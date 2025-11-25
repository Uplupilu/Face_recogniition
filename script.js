// Переменная для хранения ID выбранного лица
let selectedFaceId = null;

// Данные по умолчанию (если память пуста)
const defaultFaces = [
    {
        id: 1,
        name: "John Doe",
        status: "Not Issued",
        image: "https://via.placeholder.com/150"
    },
    {
        id: 2,
        name: "Jane Smith",
        status: "Issued",
        image: "https://via.placeholder.com/150"
    },
    {
        id: 3,
        name: "Alex Brown",
        status: "Not Issued",
        image: "https://via.placeholder.com/150"
    }
];

// Основной массив данных (State)
let facesData = [];

// --- 1. Инициализация (При загрузке страницы) ---
window.onload = function() {
    loadData();
    renderFaces();
};

function loadData() {
    // Пытаемся достать данные из памяти браузера
    const stored = localStorage.getItem('facesData');
    if (stored) {
        facesData = JSON.parse(stored);
    } else {
        // Если памяти нет, грузим дефолт
        facesData = JSON.parse(JSON.stringify(defaultFaces));
    }
}

function saveData() {
    // Сохраняем текущий массив в память браузера
    localStorage.setItem('facesData', JSON.stringify(facesData));
}

// Сброс (для тестов, красная кнопка)
function resetData() {
    if(confirm("Reset all data to default? This cannot be undone.")) {
        localStorage.removeItem('facesData');
        loadData();
        renderFaces();
        selectedFaceId = null;
        updateActionButtons(false);
    }
}

// --- 2. Рендер (Отрисовка) карточек из данных ---
function renderFaces() {
    const grid = document.getElementById('facesGrid');
    grid.innerHTML = ''; // Очищаем сетку

    // 1. Добавляем кнопку "Add New"
    const addBtn = document.createElement('div');
    addBtn.className = 'card add-new';
    addBtn.onclick = addNewFace;
    addBtn.innerHTML = '<div class="add-icon">+</div><div class="add-text">Add new</div>';
    grid.appendChild(addBtn);

    // 2. Добавляем карточки из массива
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

// --- 3. Выбор карточки ---
function selectCard(id) {
    if (selectedFaceId == id) {
        selectedFaceId = null; // Снять выделение
    } else {
        selectedFaceId = id; // Выбрать
    }
    renderFaces(); // Перерисовать, чтобы обновить рамки
    updateActionButtons(selectedFaceId !== null);
}

function updateActionButtons(isEnabled) {
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.classList.toggle('disabled', !isEnabled);
    });
}

// --- 4. Действия (Status, Edit, Delete) ---

// -- Статус --
function handleAction(type) {
    if (!selectedFaceId) return;
    if (type === 'status') openModal('statusModal');
    if (type === 'edit') {
        prepareEditModal();
        openModal('editModal');
    }
    if (type === 'feedback') alert("Redirecting to Telegram...");
}

function applyStatus(newStatus) {
    // Находим лицо в массиве данных
    const face = facesData.find(f => f.id == selectedFaceId);
    if (face) {
        face.status = newStatus;
        saveData(); // Сохраняем в память
        renderFaces(); // Перерисовываем
    }
    closeModal('statusModal');
}

// -- Редактирование --
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
        saveData(); // Сохраняем навсегда
        renderFaces(); // Обновляем вид
    }
    closeModal('editModal');
}

// -- Удаление --
function deleteFace(event, id) {
    event.stopPropagation();
    if (confirm("Delete this face?")) {
        facesData = facesData.filter(f => f.id != id); // Удаляем из массива
        if (selectedFaceId == id) {
            selectedFaceId = null;
            updateActionButtons(false);
        }
        saveData();
        renderFaces();
    }
}

// -- Добавление (Простая логика) --
function addNewFace() {
    const newId = Date.now(); // Генерируем уникальный ID
    const newFace = {
        id: newId,
        name: "New Person",
        status: "Not Issued",
        image: "https://via.placeholder.com/150"
    };
    facesData.push(newFace);
    saveData();
    renderFaces();
    // Сразу выбираем нового, чтобы можно было редактировать
    selectCard(newId);
}

// --- 5. Вспомогательные функции ---
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
