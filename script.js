let selectedFaceId = null;

// --- 1. Основные функции выбора ---

function selectCard(element) {
    const id = element.getAttribute('data-id');

    if (selectedFaceId === id) {
        deselectAll();
        selectedFaceId = null;
        updateActionButtons(false);
        return;
    }

    deselectAll();
    element.classList.add('selected');
    selectedFaceId = id;
    updateActionButtons(true);
}

function deselectAll() {
    document.querySelectorAll('.face-card').forEach(card => card.classList.remove('selected'));
}

function updateActionButtons(isEnabled) {
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.classList.toggle('disabled', !isEnabled);
    });
}

// --- 2. Обработчик кнопок нижнего бара ---

function handleAction(type) {
    if (!selectedFaceId) return;

    switch(type) {
        case 'status':
            openModal('statusModal');
            break;
        case 'edit':
            prepareEditModal(); // Подготовить данные
            openModal('editModal');
            break;
        case 'feedback':
            alert("Redirecting to Telegram...");
            break;
    }
}

// --- 3. Управление Модальными окнами (Общее) ---

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Закрытие по клику на фон
window.onclick = function(event) {
    if (event.target.classList.contains('modal-overlay')) {
        event.target.classList.remove('active');
    }
}

// --- 4. Логика Смены Статуса ---

function applyStatus(newStatus) {
    if (!selectedFaceId) return;
    const card = document.querySelector(`.face-card[data-id="${selectedFaceId}"]`);
    const badge = card.querySelector('.status-badge');

    if (newStatus === 'Issued') {
        badge.textContent = '✅ Issued';
        badge.className = 'status-badge status-issued';
    } else {
        badge.textContent = '⏳ Not Issued';
        badge.className = 'status-badge status-not-issued';
    }
    closeModal('statusModal');
}

// --- 5. Логика Редактирования (Edit Info) ---

function prepareEditModal() {
    // Получаем текущие данные с карточки
    const card = document.querySelector(`.face-card[data-id="${selectedFaceId}"]`);
    const currentName = card.querySelector('.card-name').textContent;
    const currentImgSrc = card.querySelector('.face-img').src;

    // Заполняем поля в модальном окне
    document.getElementById('editNameInput').value = currentName;
    document.getElementById('editPreviewImg').src = currentImgSrc;
    document.getElementById('editFileInput').value = ""; // Сброс файла
}

// Предпросмотр загружаемого файла
function previewFile() {
    const preview = document.getElementById('editPreviewImg');
    const file = document.getElementById('editFileInput').files[0];
    const reader = new FileReader();

    reader.onloadend = function () {
        preview.src = reader.result; // Показываем новую картинку
    }

    if (file) {
        reader.readAsDataURL(file);
    }
}

// Сохранение изменений
function saveEditInfo() {
    const newName = document.getElementById('editNameInput').value;
    const newImgSrc = document.getElementById('editPreviewImg').src;

    const card = document.querySelector(`.face-card[data-id="${selectedFaceId}"]`);
    
    // Обновляем DOM
    card.querySelector('.card-name').textContent = newName;
    card.querySelector('.face-img').src = newImgSrc;

    closeModal('editModal');
}

// --- 6. Экспорт данных в файл (JSON) ---

function exportData() {
    const faces = [];
    document.querySelectorAll('.face-card').forEach(card => {
        const id = card.getAttribute('data-id');
        const name = card.querySelector('.card-name').textContent;
        const statusText = card.querySelector('.status-badge').textContent;
        const imgSrc = card.querySelector('.face-img').src; // Внимание: если картинка большая (base64), файл будет тяжелым

        faces.push({
            id: id,
            name: name,
            status: statusText.includes('Issued') ? 'Issued' : 'Not Issued',
            image: imgSrc
        });
    });

    // Создаем файл для скачивания
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(faces, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "faces_database.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

// --- 7. Удаление и Добавление ---

function deleteFace(event, btnElement) {
    event.stopPropagation();
    if (confirm("Delete this face?")) {
        const card = btnElement.closest('.card');
        if (card.classList.contains('selected')) {
            selectedFaceId = null;
            updateActionButtons(false);
        }
        card.remove();
    }
}

function addNewFace() {
    alert("To add a new face logic, we would clone a card template and append it to the grid.");
}
