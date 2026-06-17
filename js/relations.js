// Lógica de relaciones

// Variables para almacenar el estado de los buscadores
let searchSelectors = {};

function getInverseRelation(relation) {
    const inverseMap = {
        'padres': 'hijos',
        'hijos': 'padres',
        'matrimonios': 'matrimonios',
        'hermanos': 'hermanos'
    };
    return inverseMap[relation];
}

function getRelationName(relation) {
    const nameMap = {
        'padres': 'padre/madre',
        'hijos': 'hijo/a',
        'matrimonios': 'cónyuge',
        'hermanos': 'hermano/a'
    };
    return nameMap[relation] || relation;
}

// ============================================================
// FUNCIONES PARA BUSCADORES EN EL MODAL
// ============================================================

function setupSearchSelectors() {
    const configs = [
        { inputId: 'parent-search', dropdownId: 'parent-dropdown', type: 'padres' },
        { inputId: 'children-search', dropdownId: 'children-dropdown', type: 'hijos' },
        { inputId: 'spouse-search', dropdownId: 'spouse-dropdown', type: 'matrimonios' },
        { inputId: 'sibling-search', dropdownId: 'sibling-dropdown', type: 'hermanos' }
    ];
    
    configs.forEach(cfg => {
        const input = document.getElementById(cfg.inputId);
        const dropdown = document.getElementById(cfg.dropdownId);
        
        if (!input || !dropdown) return;
        
        // Limpiar estado anterior
        if (searchSelectors[cfg.type]) {
            delete searchSelectors[cfg.type];
        }
        
        searchSelectors[cfg.type] = {
            input: input,
            dropdown: dropdown,
            selectedId: null,
            selectedName: null
        };
        
        // Evento: escribir en el input
        input.addEventListener('input', function(e) {
            const query = this.value.trim().toLowerCase();
            const currentId = document.getElementById('edit-id')?.value;
            
            if (query.length === 0) {
                dropdown.classList.remove('show');
                return;
            }
            
            // Buscar personas que coincidan
            const results = Object.values(familyData)
                .filter(p => {
                    const name = p.nombres_apellidos.toLowerCase();
                    return name.includes(query) && p.id.toString() !== currentId;
                })
                .slice(0, 10); // Limitar a 10 resultados
            
            if (results.length === 0) {
                dropdown.innerHTML = '<div class="search-select-no-results">No se encontraron personas</div>';
                dropdown.classList.add('show');
                return;
            }
            
            // Resaltar coincidencia
            dropdown.innerHTML = results.map(p => {
                const name = p.nombres_apellidos;
                const index = name.toLowerCase().indexOf(query);
                let highlighted = name;
                if (index !== -1) {
                    const before = name.substring(0, index);
                    const match = name.substring(index, index + query.length);
                    const after = name.substring(index + query.length);
                    highlighted = `${before}<span class="highlight">${match}</span>${after}`;
                }
                return `<div class="search-select-option" data-id="${p.id}" onclick="selectSearchOption('${cfg.type}', ${p.id}, '${p.nombres_apellidos}')">
                    ${highlighted} (${p.id})
                </div>`;
            }).join('');
            
            dropdown.classList.add('show');
        });
        
        // Evento: al perder el foco, cerrar dropdown
        input.addEventListener('blur', function() {
            setTimeout(() => {
                dropdown.classList.remove('show');
            }, 200);
        });
        
        // Evento: al enfocar, mostrar resultados si hay texto
        input.addEventListener('focus', function() {
            if (this.value.trim().length > 0) {
                this.dispatchEvent(new Event('input'));
            }
        });
        
        // Evento: tecla Enter para seleccionar el primer resultado
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const firstOption = dropdown.querySelector('.search-select-option');
                if (firstOption) {
                    firstOption.click();
                    e.preventDefault();
                }
            }
            if (e.key === 'Escape') {
                dropdown.classList.remove('show');
                this.blur();
            }
        });
    });
}

function selectSearchOption(type, id, name) {
    const selector = searchSelectors[type];
    if (!selector) return;
    
    const currentId = document.getElementById('edit-id')?.value;
    if (id.toString() === currentId) {
        showToast('No puede relacionarse consigo mismo', '#f44336');
        selector.dropdown.classList.remove('show');
        return;
    }
    
    // Verificar si ya está en la lista
    if (relationLists[type] && relationLists[type].includes(id.toString())) {
        showToast('Esta relación ya está agregada', '#f44336');
        selector.dropdown.classList.remove('show');
        selector.input.value = '';
        return;
    }
    
    // Agregar la relación
    addRelationDirect(type, id.toString());
    
    // Limpiar el input
    selector.input.value = '';
    selector.dropdown.classList.remove('show');
}

function addRelationDirect(type, personId) {
    const currentPersonId = parseInt(document.getElementById('edit-id').value);
    const targetId = parseInt(personId);
    
    if (currentPersonId === targetId) {
        showToast('No puede relacionarse consigo mismo', '#f44336');
        return;
    }
    
    if (relationLists[type].includes(personId)) {
        showToast('Esta relación ya está agregada', '#f44336');
        return;
    }
    
    console.log(`➕ Agregando relación ${type}: ${personId} a persona ${currentPersonId}`);
    
    relationLists[type].push(personId);
    renderRelationTags(type);
    
    // Relación bidireccional
    const isBidirectional = ['padres', 'hijos', 'matrimonios', 'hermanos'].includes(type);
    if (isBidirectional && familyData[targetId]) {
        const targetPerson = familyData[targetId];
        const inverseType = getInverseRelation(type);
        const currentPersonIdStr = currentPersonId.toString();
        
        if (inverseType) {
            let currentInverse = targetPerson[inverseType] ? targetPerson[inverseType].split(';').filter(s => s.trim() !== '') : [];
            
            if (!currentInverse.includes(currentPersonIdStr)) {
                currentInverse.push(currentPersonIdStr);
                targetPerson[inverseType] = currentInverse.join(';');
                familyData[targetId] = targetPerson;
                showToast(`✅ Relación bidireccional establecida: ${familyData[targetId]?.nombres_apellidos} ahora tiene a ${familyData[currentPersonId]?.nombres_apellidos} como ${getRelationName(inverseType)}`, '#018786');
            }
        }
    }
}

// Función para agregar relación desde el botón (mantener compatibilidad)
function addRelationFromSearch(type) {
    const selector = searchSelectors[type];
    if (!selector) return;
    
    const input = selector.input;
    const dropdown = selector.dropdown;
    
    // Si hay un valor en el input, intentar buscar
    const query = input.value.trim();
    if (query.length === 0) {
        showToast('Escribe el nombre de la persona', '#f44336');
        return;
    }
    
    // Buscar coincidencia exacta
    const currentId = document.getElementById('edit-id')?.value;
    const results = Object.values(familyData)
        .filter(p => {
            const name = p.nombres_apellidos.toLowerCase();
            return name === query.toLowerCase() && p.id.toString() !== currentId;
        });
    
    if (results.length === 1) {
        // Coincidencia exacta, agregar directamente
        selectSearchOption(type, results[0].id, results[0].nombres_apellidos);
    } else {
        // Mostrar dropdown con resultados
        input.dispatchEvent(new Event('input'));
        dropdown.classList.add('show');
    }
}

// ============================================================
// FUNCIONES DE RELACIONES EXISTENTES
// ============================================================

function updateRelationSelectors() {
    // Ya no se usan selects, pero mantenemos la función para compatibilidad
    // Los buscadores se actualizan automáticamente con familyData
}

function removeRelation(type, index) {
    console.log(`🗑️ Eliminando relación ${type} en índice ${index}`);
    const removedId = relationLists[type][index];
    const currentPersonId = parseInt(document.getElementById('edit-id').value);
    
    relationLists[type].splice(index, 1);
    renderRelationTags(type);
    
    if (familyData[removedId]) {
        const targetPerson = familyData[removedId];
        const inverseType = getInverseRelation(type);
        const currentIdStr = currentPersonId.toString();
        
        if (inverseType && targetPerson[inverseType]) {
            let inverseList = targetPerson[inverseType].split(';').filter(s => s.trim() !== '');
            const newInverseList = inverseList.filter(id => id !== currentIdStr);
            targetPerson[inverseType] = newInverseList.join(';');
            familyData[removedId] = targetPerson;
        }
    }
    
    showToast(`🗑️ Relación eliminada`, '#f44336');
}

function renderRelationTags(type) {
    const containerMap = {
        'padres': 'parents-tags',
        'hijos': 'hijos-tags',
        'matrimonios': 'matrimonios-tags',
        'hermanos': 'hermanos-tags'
    };
    
    const containerId = containerMap[type];
    if (!containerId) {
        console.error(`❌ Tipo de relación desconocido: ${type}`);
        return;
    }
    
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`❌ Contenedor no encontrado: ${containerId}`);
        return;
    }
    
    if (!relationLists[type] || relationLists[type].length === 0) {
        container.innerHTML = '<span class="no-data">Ninguno</span>';
        return;
    }
    
    const html = relationLists[type].map((id, idx) => {
        const person = familyData[id];
        const name = person ? person.nombres_apellidos : `ID: ${id}`;
        return `<span class="relation-tag">${name} (${id}) <button type="button" onclick="removeRelation('${type}', ${idx})" title="Eliminar relación">✖</button></span>`;
    }).join('');
    
    container.innerHTML = html;
}
