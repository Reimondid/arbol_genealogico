// Gestión del modal y formulario
let currentEditId = null;
let relationLists = { padres: [], hijos: [], matrimonios: [], hermanos: [] };

function openModal(personId = null) {
    console.log('🔓 Abriendo modal, personId:', personId);
    const modal = document.getElementById('editor-modal');
    const deleteBtn = document.getElementById('delete-person-btn');
    
    // Limpiar relaciones anteriores
    relationLists = { padres: [], hijos: [], matrimonios: [], hermanos: [] };
    
    // Configurar los buscadores
    setupSearchSelectors();
    
    if (personId && familyData[personId]) {
        const p = familyData[personId];
        console.log('📝 Editando persona:', p.nombres_apellidos, 'ID:', p.id);
        
        document.getElementById('modal-title').textContent = '✏️ Editar Persona';
        document.getElementById('edit-id').value = p.id;
        document.getElementById('edit-nombres').value = p.nombres_apellidos || '';
        document.getElementById('edit-nacimiento').value = p.fecha_nacimiento || '';
        document.getElementById('edit-fallecimiento').value = p.fecha_fallecimiento || '';
        document.getElementById('edit-nacimiento-lugar').value = p.nacimiento_lugar || '';
        document.getElementById('edit-fallecimiento-lugar').value = p.fallecimiento_lugar || '';
        document.getElementById('edit-pais').value = p.pais || '';
        document.getElementById('edit-comentarios').value = p.comentarios || '';
        document.getElementById('edit-imagen').value = p.imagen || '';
        
        // Cargar relaciones existentes en los arrays
        relationLists.padres = p.padres ? p.padres.split(';').filter(s => s.trim() !== '') : [];
        relationLists.hijos = p.hijos ? p.hijos.split(';').filter(s => s.trim() !== '') : [];
        relationLists.matrimonios = p.matrimonios ? p.matrimonios.split(';').filter(s => s.trim() !== '') : [];
        relationLists.hermanos = p.hermanos ? p.hermanos.split(';').filter(s => s.trim() !== '') : [];
        
        // Renderizar los tags de relaciones
        renderRelationTags('padres');
        renderRelationTags('hijos');
        renderRelationTags('matrimonios');
        renderRelationTags('hermanos');
        
        deleteBtn.style.display = 'inline-block';
    } else {
        console.log('➕ Creando nueva persona');
        document.getElementById('modal-title').textContent = '➕ Nueva Persona';
        document.getElementById('person-form').reset();
        document.getElementById('edit-id').value = getNextId();
        
        // Resetear relaciones
        relationLists = { padres: [], hijos: [], matrimonios: [], hermanos: [] };
        renderRelationTags('padres');
        renderRelationTags('hijos');
        renderRelationTags('matrimonios');
        renderRelationTags('hermanos');
        
        deleteBtn.style.display = 'none';
    }
    
    // Limpiar los campos de búsqueda
    ['parent-search', 'children-search', 'spouse-search', 'sibling-search'].forEach(id => {
        const input = document.getElementById(id);
        if (input) input.value = '';
    });
    
    // Cerrar todos los dropdowns
    ['parent-dropdown', 'children-dropdown', 'spouse-dropdown', 'sibling-dropdown'].forEach(id => {
        const dropdown = document.getElementById(id);
        if (dropdown) dropdown.classList.remove('show');
    });
    
    modal.classList.add('active');
}

function closeModal() { 
    document.getElementById('editor-modal').classList.remove('active'); 
}

function savePerson(e) {
    e.preventDefault();
    const id = parseInt(document.getElementById('edit-id').value);
    const nombres = document.getElementById('edit-nombres').value.trim();
    if (!nombres) { showToast('El nombre es obligatorio', '#f44336'); return; }
    
    // Verificar que no haya IDs vacíos en las relaciones
    const cleanList = (list) => list.filter(id => id && id.trim() !== '');
    
    const person = {
        id: id,
        nombres_apellidos: nombres,
        fecha_nacimiento: document.getElementById('edit-nacimiento').value,
        fecha_fallecimiento: document.getElementById('edit-fallecimiento').value || '',
        nacimiento_lugar: document.getElementById('edit-nacimiento-lugar').value,
        fallecimiento_lugar: document.getElementById('edit-fallecimiento-lugar').value || '',
        pais: document.getElementById('edit-pais').value,
        comentarios: document.getElementById('edit-comentarios').value,
        imagen: document.getElementById('edit-imagen').value,
        padres: cleanList(relationLists.padres).join(';'),
        hijos: cleanList(relationLists.hijos).join(';'),
        matrimonios: cleanList(relationLists.matrimonios).join(';'),
        hermanos: cleanList(relationLists.hermanos).join(';')
    };
    
    console.log('💾 Guardando persona:', person);
    
    familyData[id] = person;
    regenerateVisualization();
    closeModal();
    showToast(`✅ Guardado: ${nombres}`, '#018786');
    selectPersonById(id);
}

function deletePerson() {
    if (!currentEditId) return;
    if (confirm(`¿Eliminar a ${familyData[currentEditId]?.nombres_apellidos}?`)) {
        const idToDelete = currentEditId.toString();
        Object.keys(familyData).forEach(otherId => {
            if (otherId !== idToDelete) {
                const other = familyData[otherId];
                ['padres', 'hijos', 'matrimonios', 'hermanos'].forEach(relType => {
                    if (other[relType]) {
                        const list = other[relType].split(';').filter(id => id !== idToDelete);
                        other[relType] = list.join(';');
                    }
                });
                familyData[otherId] = other;
            }
        });
        
        delete familyData[currentEditId];
        regenerateVisualization();
        closeModal();
        showToast('🗑️ Persona eliminada', '#f44336');
        document.getElementById('person-header').textContent = 'Seleccione una persona';
        document.getElementById('person-image-container').innerHTML = '<p class="no-data">Seleccione un nodo para ver detalles</p>';
        currentEditId = null;
    }
}

function showPersonDetails(id) {
    const p = familyData[id];
    if (!p) return;
    
    document.getElementById('person-header').textContent = `${p.nombres_apellidos} (${p.id})`;
    
    const imgContainer = document.getElementById('person-image-container');
    if (p.imagen) {
        const firstImage = p.imagen.split(';')[0];
        imgContainer.innerHTML = `<img src="${firstImage}" class="person-image" onerror="this.style.display='none'"><div class="image-caption">${p.nombres_apellidos}</div>`;
    } else {
        imgContainer.innerHTML = '<p class="no-data">Sin imagen disponible</p>';
    }
    
    document.getElementById('life-dates').innerHTML = generateLifeDatesHTML(p);
    document.getElementById('life-dates').className = 'detail-item';
    
    document.getElementById('life-places').innerHTML = generateLifePlacesHTML(p);
    document.getElementById('life-places').className = 'detail-item';
    
    document.getElementById('parents-info').innerHTML = `<span class="detail-label">👨‍👩‍👧 Padres:</span> ${formatRelationList(p.padres)}`;
    document.getElementById('parents-info').className = 'detail-item';
    
    document.getElementById('children-info').innerHTML = `<span class="detail-label">👶 Hijos:</span> ${formatRelationList(p.hijos)}`;
    document.getElementById('children-info').className = 'detail-item';
    
    document.getElementById('marriages-info').innerHTML = `<span class="detail-label">💍 Cónyuges:</span> ${formatRelationList(p.matrimonios)}`;
    document.getElementById('marriages-info').className = 'detail-item';
    
    document.getElementById('siblings-info').innerHTML = `<span class="detail-label">👥 Hermanos:</span> ${formatRelationList(p.hermanos)}`;
    document.getElementById('siblings-info').className = 'detail-item';
    
    document.getElementById('comments-info').innerHTML = p.comentarios ? `<span class="detail-label">📝 Comentarios:</span><br>${p.comentarios}` : '<span class="no-data">Sin comentarios</span>';
    document.getElementById('comments-info').className = 'comments-section';
}

function selectPersonById(id) {
    if (network && familyData[id]) {
        network.selectNodes([id]);
        network.focus(id, { animation: true, scale: 1.2 });
        showPersonDetails(id);
        document.getElementById('search-results').style.display = 'none';
        document.getElementById('search-input').value = familyData[id]?.nombres_apellidos || '';
        currentEditId = id;
    }
}
