// Funcionalidad de búsqueda

function searchNames(query) {
    const q = query.toLowerCase();
    return Object.values(familyData).filter(p => p.nombres_apellidos.toLowerCase().includes(q));
}

function displaySearchResults(results) {
    const container = document.getElementById('search-results');
    if (results.length === 0) {
        container.innerHTML = '<div class="search-result-item">No encontrado</div>';
        container.style.display = 'block';
        return;
    }
    container.innerHTML = results.map(p => `
        <div class="search-result-item" onclick="selectPersonById(${p.id})">
            <strong>${p.nombres_apellidos}</strong> (${p.fecha_nacimiento || '?'})
        </div>
    `).join('');
    container.style.display = 'block';
}

function setupSearchListener() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query.length > 1) {
            const results = searchNames(query);
            displaySearchResults(results);
        } else {
            searchResults.style.display = 'none';
        }
    });
    
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-container')) searchResults.style.display = 'none';
    });
}
