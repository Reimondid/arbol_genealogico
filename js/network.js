// ============================================
// VERSIÓN 10 - OPTIMIZADO Y ESTABLE
// ============================================
console.log('✅ network.js VERSIÓN 10 - Optimizado y estable');

// Configuración y gestión de redes
let network;
let clickTimer = null;
let isDragging = false;
let dragStartPos = null;
let lastClickNodeId = null;
let isUpdating = false;
let nodePositions = {};
let stabilizationComplete = false;

function getNetworkOptions() {
    return {
        nodes: {
            shape: 'box',
            margin: { top: 10, bottom: 10, left: 15, right: 15 },
            widthConstraint: { minimum: 100, maximum: 200 },
            font: { color: '#ffffff', size: 13, face: 'Segoe UI', strokeWidth: 2, strokeColor: '#121212' },
            borderWidth: 2,
            shadow: { enabled: false },  // Desactivado para mejorar rendimiento
            color: { border: '#2c3e50', background: '#27ae60', highlight: { border: '#f39c12', background: '#e67e22' } }
        },
        edges: {
            smooth: { type: 'dynamic', roundness: 0.5 },  // Dynamic es más rápido
            width: 2,
            color: { color: '#5a6e8a', highlight: '#bb86fc', hover: '#03dac6', inherit: false, opacity: 0.8 },
            shadow: false  // Desactivado para mejorar rendimiento
        },
        physics: {
            enabled: true,
            stabilization: { 
                iterations: 50,  // Reducido de 200 a 50
                updateInterval: 25
            },
            barnesHut: {
                gravitationalConstant: -5000,  // Reducido para menos movimiento
                centralGravity: 0.5,  // Aumentado para mantener los nodos centrados
                springLength: 150,
                springConstant: 0.08,
                damping: 0.15,  // Aumentado para reducir oscilaciones
                avoidOverlap: 0.2
            },
            maxVelocity: 20,  // Limitar velocidad
            minVelocity: 0.5
        },
        interaction: { 
            hover: true, 
            tooltipDelay: 300,  // Aumentado para mejor rendimiento
            dragNodes: true,
            dragView: true, 
            zoomView: true,
            zoomSpeed: 0.8,  // Reducido para zoom más suave
            selectable: true,
            multiselect: false
        },
        // Layout básico sin jerarquía
        layout: {
            randomSeed: 12345,
            improvedLayout: false
        }
    };
}

function initializeNetworks() {
    console.log('✅ initializeNetworks() ejecutado - Versión optimizada');
    
    const container = document.getElementById('mynetwork');
    
    network = new vis.Network(container, 
        { nodes: new vis.DataSet([]), edges: new vis.DataSet([]) }, 
        getNetworkOptions());
    
    // --- EVENTOS PARA EL ÁRBOL ---
    network.on('dragStart', (params) => {
        isDragging = false;
        dragStartPos = { x: params.pointer.DOM.x, y: params.pointer.DOM.y };
        if (params.nodes && params.nodes.length > 0) {
            lastClickNodeId = params.nodes[0];
        } else {
            lastClickNodeId = null;
        }
        if (clickTimer) {
            clearTimeout(clickTimer);
            clickTimer = null;
        }
    });
    
    network.on('dragging', (params) => {
        if (dragStartPos && !stabilizationComplete) {
            // Si aún está estabilizando, ignorar arrastres
            return;
        }
        if (dragStartPos) {
            const dx = params.pointer.DOM.x - dragStartPos.x;
            const dy = params.pointer.DOM.y - dragStartPos.y;
            if (Math.sqrt(dx*dx + dy*dy) > 10) {  // Umbral ligeramente mayor
                isDragging = true;
            }
        }
    });
    
    network.on('dragEnd', (params) => {
        // Guardar posiciones después de arrastrar
        setTimeout(() => {
            saveNodePositions();
        }, 200);
        
        if (!isDragging && lastClickNodeId !== null && stabilizationComplete) {
            clickTimer = setTimeout(() => {
                selectPerson(lastClickNodeId);
                clickTimer = null;
            }, 50);
        }
        isDragging = false;
        dragStartPos = null;
    });
    
    network.on('click', (params) => {
        if (!isDragging && params.nodes && params.nodes.length > 0 && stabilizationComplete) {
            const nodeId = params.nodes[0];
            if (clickTimer) {
                clearTimeout(clickTimer);
                clickTimer = null;
            }
            selectPerson(nodeId);
        }
    });
    
    // Evento: cuando la estabilización termina
    network.on('stabilizationIterationsDone', () => {
        stabilizationComplete = true;
        console.log('✅ Estabilización completada');
        saveNodePositions();
        network.fit({ animation: false, duration: 0 });
    });
    
    // Si la estabilización tarda demasiado, forzar finalización
    setTimeout(() => {
        if (!stabilizationComplete) {
            console.log('⏰ Forzando finalización de estabilización');
            stabilizationComplete = true;
            saveNodePositions();
            network.fit({ animation: false, duration: 0 });
        }
    }, 5000);
    
    // Ajustar vista inicial
    setTimeout(() => {
        if (network && !stabilizationComplete) {
            network.fit({ animation: false, duration: 0 });
        }
    }, 1000);
}

function saveNodePositions() {
    if (!network) return;
    try {
        const positions = network.getPositions();
        Object.keys(positions).forEach(id => {
            nodePositions[id] = positions[id];
        });
    } catch(e) {
        // Ignorar errores
    }
}

function selectPerson(nodeId) {
    if (isUpdating) return;
    if (!stabilizationComplete) {
        // Esperar a que termine la estabilización
        setTimeout(() => selectPerson(nodeId), 200);
        return;
    }
    
    isUpdating = true;
    
    try {
        if (!familyData[nodeId]) {
            console.warn('⚠️ Persona no encontrada:', nodeId);
            isUpdating = false;
            return;
        }
        
        // Actualizar panel de detalles
        showPersonDetails(nodeId);
        currentEditId = nodeId;
        
        // Seleccionar y enfocar en el árbol (con animación suave)
        network.selectNodes([nodeId]);
        network.focus(nodeId, { 
            animation: { 
                duration: 500,
                easingFunction: 'easeInOutQuad'
            }, 
            scale: 1.2 
        });
        
        // Actualizar búsqueda
        document.getElementById('search-results').style.display = 'none';
        document.getElementById('search-input').value = familyData[nodeId]?.nombres_apellidos || '';
        
    } catch (error) {
        console.error('Error en selectPerson:', error);
    } finally {
        setTimeout(() => {
            isUpdating = false;
        }, 100);
    }
}

function regenerateVisualization() {
    const { nodes, edges } = generateGraphData();
    
    // Aplicar posiciones guardadas si existen
    const nodesWithPositions = nodes.map(node => {
        if (nodePositions[node.id]) {
            return { ...node, ...nodePositions[node.id] };
        }
        return node;
    });
    
    network.setData({ nodes: new vis.DataSet(nodesWithPositions), edges: new vis.DataSet(edges) });
    stabilizationComplete = false;
    
    // Si no hay posiciones guardadas, ajustar vista después de la estabilización
    if (Object.keys(nodePositions).length === 0) {
        network.once('stabilizationIterationsDone', () => {
            setTimeout(() => {
                network.fit({ animation: false, duration: 0 });
                stabilizationComplete = true;
            }, 100);
        });
    } else {
        stabilizationComplete = true;
        setTimeout(() => {
            network.fit({ animation: false, duration: 0 });
        }, 100);
    }
    
    updateRelationSelectors();
}

function generateGraphData() {
    const nodes = [];
    const edges = [];
    const addedEdges = new Set();
    
    // Generar posiciones en un layout circular
    let index = 0;
    const total = Object.keys(familyData).length;
    const radius = Math.max(200, total * 20);
    
    Object.values(familyData).forEach(p => {
        let pos = nodePositions[p.id];
        if (!pos) {
            const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
            pos = {
                x: radius * Math.cos(angle),
                y: radius * Math.sin(angle)
            };
            index++;
        }
        
        nodes.push({
            id: p.id,
            label: p.nombres_apellidos,
            title: `${p.nombres_apellidos}\n📅 ${p.fecha_nacimiento || '?'} - ${p.fecha_fallecimiento || 'Presente'}\n📍 ${p.pais || '?'}`,
            shape: p.imagen ? 'circularImage' : 'box',
            image: p.imagen || undefined,
            color: p.fecha_fallecimiento ? { border: '#7f8c8d', background: '#95a5a6' } : { border: '#2c3e50', background: '#27ae60' },
            font: { size: 12, color: '#ffffff' },
            x: pos.x,
            y: pos.y
        });
        
        if (p.padres) {
            p.padres.split(';').forEach(pid => {
                const key = `${pid}-${p.id}`;
                if (!addedEdges.has(key) && familyData[pid]) {
                    edges.push({ 
                        from: parseInt(pid), 
                        to: p.id, 
                        color: '#3498db', 
                        width: 2, 
                        arrows: { to: { enabled: true } }
                    });
                    addedEdges.add(key);
                }
            });
        }
        
        if (p.matrimonios) {
            p.matrimonios.split(';').forEach(spid => {
                const key = `marriage-${Math.min(p.id, spid)}-${Math.max(p.id, spid)}`;
                if (!addedEdges.has(key) && familyData[spid]) {
                    edges.push({ 
                        from: p.id, 
                        to: parseInt(spid), 
                        color: '#e74c3c', 
                        dashes: true, 
                        width: 3,
                        arrows: { to: { enabled: false } }, 
                        smooth: { type: 'curvedCW', roundness: 0.3 }
                    });
                    addedEdges.add(key);
                }
            });
        }
        
        if (p.hermanos) {
            p.hermanos.split(';').forEach(sid => {
                const key = `sibling-${Math.min(p.id, sid)}-${Math.max(p.id, sid)}`;
                if (!addedEdges.has(key) && familyData[sid]) {
                    edges.push({ 
                        from: p.id, 
                        to: parseInt(sid), 
                        color: '#2ecc71', 
                        dashes: [8, 6], 
                        width: 1.5, 
                        arrows: { to: { enabled: false } }, 
                        smooth: { type: 'curvedCW', roundness: 0.2 }
                    });
                    addedEdges.add(key);
                }
            });
        }
    });
    
    return { nodes, edges };
}

function fitView() { 
    if (network && stabilizationComplete) {
        network.fit({ animation: { duration: 500, easingFunction: 'easeInOutQuad' } });
    }
}

function resetView() { 
    nodePositions = {};
    stabilizationComplete = false;
    regenerateVisualization();
}
