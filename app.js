// Inicialización y control principal

document.addEventListener('DOMContentLoaded', () => {
    initializeNetworks();
    setupEventListeners();
    
    // ============================================================
    // ELIGE UNA DE LAS DOS OPCIONES:
    // ============================================================
    
    // OPCIÓN 1: COMENZAR DESDE CERO (data.js vacío)
    // loadSampleData();  // DESCOMENTA ESTA LÍNEA PARA DATOS VACÍOS
    
    // OPCIÓN 2: CARGAR LA FAMILIA BUENDÍA (data-buendia.js)
    loadSampleData();  // DESCOMENTA ESTA LÍNEA PARA LA FAMILIA BUENDÍA
    
    // Pequeño retraso para asegurar que la red esté lista
    setTimeout(() => {
        regenerateVisualization();
    }, 100);
});

function setupEventListeners() {
    document.getElementById('file-input').addEventListener('change', handleFileSelect);
    document.getElementById('new-person-btn').addEventListener('click', () => openModal());
    document.getElementById('edit-mode-btn').addEventListener('click', () => {
        if (currentEditId && familyData[currentEditId]) {
            openModal(currentEditId);
        } else {
            showToast('Seleccione una persona primero', '#f44336');
        }
    });
    document.getElementById('person-form').addEventListener('submit', savePerson);
    document.getElementById('delete-person-btn').addEventListener('click', deletePerson);
    
    setupSearchListener();
}

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        const csv = e.target.result;
        parseCSV(csv);
    };
    reader.readAsText(file);
}

// Exponer funciones globales necesarias para el HTML
window.selectPersonById = selectPersonById;
window.addRelation = addRelation;
window.removeRelation = removeRelation;
window.closeModal = closeModal;
window.fitView = fitView;
window.resetView = resetView;
window.exportCSV = exportCSV;
window.showPersonDetails = showPersonDetails;
window.savePerson = savePerson;
window.deletePerson = deletePerson;
window.openModal = openModal;
window.regenerateVisualization = regenerateVisualization;
window.familyData = familyData;
