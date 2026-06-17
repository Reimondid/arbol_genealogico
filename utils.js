// Funciones utilitarias

function showToast(msg, bg) { 
    const toast = document.createElement('div'); 
    toast.className = 'toast'; 
    toast.textContent = msg; 
    toast.style.backgroundColor = bg; 
    document.body.appendChild(toast); 
    setTimeout(() => toast.remove(), 3000); 
}

function formatRelationList(ids) {
    if (!ids || ids.trim() === '') return '<span class="no-data">-</span>';
    return ids.split(';').map(id => {
        const personId = id.trim();
        const person = familyData[personId];
        if (person) {
            return `<span class="person-link" onclick="selectPersonById(${personId})">${person.nombres_apellidos} (${personId})</span>`;
        }
        return id;
    }).join(', ');
}

function parseCSVLine(line) {
    const result = [];
    let inQuotes = false;
    let current = '';
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);
    return result;
}

function parseCSV(csv) {
    const lines = csv.split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const newData = {};
    
    for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const values = parseCSVLine(lines[i]);
        const person = {};
        headers.forEach((h, idx) => { person[h] = (values[idx] || '').replace(/^"|"$/g, ''); });
        if (person.id) newData[person.id] = person;
    }
    
    if (Object.keys(newData).length > 0) {
        familyData = newData;
        regenerateVisualization();
        showToast('✅ CSV cargado correctamente', '#018786');
    } else {
        showToast('Error: No se pudo cargar el CSV', '#f44336');
    }
}

function exportCSV() {
    if (Object.keys(familyData).length === 0) { 
        showToast('No hay datos para exportar', '#f44336'); 
        return; 
    }
    
    // Solicitar nombre del archivo al usuario
    const fechaActual = new Date().toISOString().slice(0, 10);
    const nombrePorDefecto = `arbol_genealogico_${fechaActual}`;
    
    const nombreArchivo = prompt(
        '💾 Guardar archivo como\n\nIngresa el nombre del archivo (sin extensión):',
        nombrePorDefecto
    );
    
    // Si el usuario cancela (presiona Cancelar o ESC), no hacer nada
    if (nombreArchivo === null) {
        showToast('❌ Exportación cancelada', '#f44336');
        return;
    }
    
    // Si el usuario deja el nombre vacío, usar el nombre por defecto
    const nombreFinal = nombreArchivo.trim() || nombrePorDefecto;
    
    // Definir headers en el orden correcto (mismo que se usa para importar)
    const headers = [
        'id', 
        'nombres_apellidos', 
        'fecha_nacimiento', 
        'fecha_fallecimiento', 
        'nacimiento_lugar', 
        'fallecimiento_lugar', 
        'pais', 
        'imagen', 
        'comentarios', 
        'padres', 
        'hijos', 
        'matrimonios', 
        'hermanos'
    ];
    
    // Construir las filas del CSV
    const rows = Object.values(familyData).map(p => {
        return headers.map(h => {
            let val = p[h] || '';
            val = String(val);
            if (val.includes(',') || val.includes('"') || val.includes(';') || val.includes('\n')) {
                val = `"${val.replace(/"/g, '""')}"`;
            }
            return val;
        }).join(',');
    });
    
    // Unir headers y rows
    const csvContent = [headers.join(','), ...rows].join('\n');
    
    // Crear el blob con BOM para UTF-8
    const blob = new Blob(["\uFEFF" + csvContent], { 
        type: 'text/csv;charset=utf-8;' 
    });
    
    // Crear link de descarga
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `${nombreFinal}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showToast(`📁 Archivo guardado: ${nombreFinal}.csv (${Object.keys(familyData).length} personas)`, '#018786');
}

// ========== FUNCIONES PARA CÁLCULO DE EDAD ==========

function parseDate(dateStr) {
    if (!dateStr || dateStr.trim() === '') return null;
    const parts = dateStr.split('/');
    if (parts.length !== 3) return null;
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]) - 1;
    const year = parseInt(parts[2]);
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    return new Date(year, month, day);
}

function calculateAge(birthDate, deathDate) {
    const birth = parseDate(birthDate);
    if (!birth) return null;
    
    const endDate = deathDate ? parseDate(deathDate) : new Date();
    if (!endDate) return null;
    
    let age = endDate.getFullYear() - birth.getFullYear();
    const monthDiff = endDate.getMonth() - birth.getMonth();
    const dayDiff = endDate.getDate() - birth.getDate();
    
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }
    
    return age;
}

function formatDateWithMonth(dateStr) {
    if (!dateStr || dateStr.trim() === '') return '';
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                   'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    const parts = dateStr.split('/');
    if (parts.length !== 3) return dateStr;
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]);
    const year = parseInt(parts[2]);
    if (isNaN(day) || isNaN(month) || isNaN(year)) return dateStr;
    return `${day} de ${months[month-1]} de ${year}`;
}

function generateLifeDatesHTML(person) {
    const birthDate = person.fecha_nacimiento || '';
    const deathDate = person.fecha_fallecimiento || '';
    const isAlive = !deathDate || deathDate.trim() === '';
    
    let birthDisplay = birthDate ? formatDateWithMonth(birthDate) : '?';
    let deathDisplay = deathDate ? formatDateWithMonth(deathDate) : 'Presente';
    
    let ageHTML = '';
    const age = calculateAge(birthDate, deathDate);
    
    if (age !== null) {
        if (isAlive) {
            ageHTML = ` <span class="age-badge">🎂 ${age} años</span>`;
        } else {
            ageHTML = ` <span class="age-badge deceased">${age} años</span>`;
        }
    }
    
    return `
        <div class="detail-row-combined">
            <span class="detail-label" style="min-width: 110px;">📅 Nacimiento:</span>
            <span class="date-value">${birthDisplay}</span>
            <span class="date-separator">—</span>
            <span class="detail-label" style="min-width: auto;">Fallecimiento:</span>
            <span class="date-value">${deathDisplay}</span>
            ${ageHTML}
        </div>
    `;
}

function generateLifePlacesHTML(person) {
    const birthPlace = person.nacimiento_lugar || '';
    const deathPlace = person.fallecimiento_lugar || '';
    const country = person.pais || '';
    
    let birthDisplay = birthPlace ? birthPlace : '-';
    if (country && birthPlace) {
        birthDisplay = `${birthPlace}, ${country}`;
    } else if (country && !birthPlace) {
        birthDisplay = country;
    }
    
    let deathDisplay = deathPlace ? deathPlace : '-';
    
    return `
        <div class="detail-row-combined">
            <span class="detail-label" style="min-width: 110px;">📍 Nacimiento:</span>
            <span class="date-value">${birthDisplay}</span>
            <span class="date-separator">—</span>
            <span class="detail-label" style="min-width: auto;">Fallecimiento:</span>
            <span class="date-value">${deathDisplay}</span>
        </div>
    `;
}
