// Datos globales
let familyData = {};

// Datos de ejemplo - VACÍO para comenzar desde cero
// Puedes cargar tus propios datos usando el botón "Cargar CSV"
const SAMPLE_DATA = [];

function loadSampleData() {
    // No carga ningún dato de ejemplo
    // familyData permanece vacío
    console.log('📂 Árbol vacío - Comienza desde cero');
}

function getNextId() {
    const ids = Object.keys(familyData).map(Number);
    const maxId = ids.length > 0 ? Math.max(...ids) : 0;
    return maxId + 1;
}
