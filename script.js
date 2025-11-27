let selectedFaceId = null;

const defaultFaces = [
    { id: 1, name: "John Doe", status: "Not Issued", image: "https://via.placeholder.com/150" },
    { id: 2, name: "Jane Smith", status: "Issued", image: "https://via.placeholder.com/150" }
];

let facesData = [];

// --- Инициализация ---
window.onload = function() {
    loadData();
    renderFaces();
};

function loadData() {
    const stored = localStorage.getItem('facesData');
    if (stored) {
        facesData = JSON.parse(stored);
    } else {
        facesData = JSON.parse(JSON.stringify(defaultFaces));
    }
}

function saveData() {
    localStorage.setItem('facesData', JSON.stringify(facesData));
}

function resetData() {
    if(confirm("Reset all data to default?")) {
        localStorage.removeItem('facesData');
        loadData();
        renderFaces();
        selectedFaceId = null;
        updateActionButtons(false);
    }
}

// --- Рендеринг ---
function renderFaces() {
    const grid = document.getElementById('facesGrid');
    
    // Удаляем только карточки (не кнопку Add New)
    const existingCards = grid.querySelectorAll('.face-card');
    existingCards.forEach(card => card.remove());

    facesData.forEach(face => {
        const card = document.createElement('div');
        card.className = `card face-card ${selectedFaceId == face.id ? 'selected' : ''}`;
        card.setAttribute('data-id', face.id);
        card.onclick = () => selectCard(face.id);

        const statusClass = face.status === 'Issued' ? 'status-issued' : 'status-not-issued';
        const statusIcon = face.status === 'Issued' ? '✅' : '⏳';

        card.innerHTML = `
            <div class="delete-btn" onclick="deleteFace(event, ${face.id})">✕</div>
            <div class="card-image">
                <div class="status-badge ${statusClass}">${statusIcon} ${face.status}</div>
                <img src="${face.image}" alt="Face" class="face-img">
            </div>
            <div class="card-name">${face.name}</div>
        `;
        grid.appendChild(card);
    });
}

// --- Добавление ---
function addNewFace() {
    const newId = Date.now();
    const newFace = {
        id: newId,
        name: "New Person",
        status: "Not Issued",
        image: "https://via.placeholder.com/150"
    };
    facesData.push(newFace);
    saveData();
    renderFaces();
    selectCard(newId);
}

// --- Логика выбора ---
function selectCard(id) {
    if (selectedFaceId == id) {
        selectedFaceId = null;
    } else {
        selectedFaceId = id;
    }
    renderFaces();
    updateActionButtons(selectedFaceId !== null);
}

function updateActionButtons(isEnabled) {
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.classList.toggle('disabled', !isEnabled);
    });
}

// --- ДЕЙСТВИЯ (ОБНОВЛЕНО ЗДЕСЬ) ---
function handleAction(type) {
    if (!selectedFaceId) return;
    
    if (type === 'status') {
        openModal('statusModal');
    }
    
    if (type === 'edit') {
        prepareEditModal();
        openModal('editModal');
    }
    
    if (type === 'feedback') {
        // Открываем ссылку в новой вкладке
        window.open('https://t.me/MainMaths', '_blank');
    }
}

// --- Статус ---
function applyStatus(newStatus) {
    const face = facesData.find(f => f.id == selectedFaceId);
    if (face) {
        face.status = newStatus;
        saveData();
        renderFaces();
    }
    closeModal('statusModal');
}

// --- Редактирование ---
function prepareEditModal() {
    const face = facesData.find(f => f.id == selectedFaceId);
    if (face) {
        document.getElementById('editNameInput').value = face.name;
        document.getElementById('editPreviewImg').src = face.image;
        document.getElementById('editFileInput').value = "";
    }
}

function previewFile() {
    const preview = document.getElementById('editPreviewImg');
    const file = document.getElementById('editFileInput').files[0];
    const reader = new FileReader();
    reader.onloadend = function () {
        preview.src = reader.result;
    }
    if (file) reader.readAsDataURL(file);
}

function saveEditInfo() {
    const newName = document.getElementById('editNameInput').value;
    const newImgSrc = document.getElementById('editPreviewImg').src;
    
    const face = facesData.find(f => f.id == selectedFaceId);
    if (face) {
        face.name = newName;
        face.image = newImgSrc;
        saveData();
        renderFaces();
    }
    closeModal('editModal');
}

// --- Удаление ---
function deleteFace(event, id) {
    event.stopPropagation();
    if (confirm("Delete this face?")) {
        facesData = facesData.filter(f => f.id != id);
        if (selectedFaceId == id) {
            selectedFaceId = null;
            updateActionButtons(false);
        }
        saveData();
        renderFaces();
    }
}

// --- Модальные окна ---
function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

window.onclick = function(event) {
    if (event.target.classList.contains('modal-overlay')) {
        event.target.classList.remove('active');
    }
}

function exportData() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(facesData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "faces_database.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
