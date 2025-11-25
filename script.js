let selectedFaceId = null;

// Функция выбора карточки
function selectCard(element) {
    const id = element.getAttribute('data-id');

    // Если кликнули на уже выбранную - снимаем выделение
    if (selectedFaceId === id) {
        deselectAll();
        selectedFaceId = null;
        updateActionButtons(false);
        return;
    }

    // Снимаем старое выделение
    deselectAll();

    // Выделяем новую
    element.classList.add('selected');
    selectedFaceId = id;
    
    // Активируем кнопки
    updateActionButtons(true);
}

function deselectAll() {
    document.querySelectorAll('.face-card').forEach(card => {
        card.classList.remove('selected');
    });
}

// Обновление состояния кнопок
function updateActionButtons(isEnabled) {
    const btns = document.querySelectorAll('.action-btn');
    btns.forEach(btn => {
        if (isEnabled) {
            btn.classList.remove('disabled');
        } else {
            btn.classList.add('disabled');
        }
    });
}

// Удаление лица
function deleteFace(event, btnElement) {
    event.stopPropagation(); // Предотвращаем выделение карточки при удалении
    
    if (confirm("Are you sure you want to delete this face?")) {
        const card = btnElement.closest('.card');
        
        // Если удаляем выбранную карточку, сбрасываем состояние
        if (card.classList.contains('selected')) {
            selectedFaceId = null;
            updateActionButtons(false);
        }
        
        card.remove();
    }
}

// Добавление (заглушка)
function addNewFace() {
    alert("Opens form: Upload image + Enter name + Status");
}

// --- Логика модального окна статусов ---

const modal = document.getElementById('statusModal');

function handleAction(type) {
    if (!selectedFaceId) {
        alert("Please select a face first.");
        return;
    }

    switch(type) {
        case 'status':
            // Открываем модальное окно
            modal.classList.add('active');
            break;
        case 'edit':
            alert(`Open Edit Form for ID: ${selectedFaceId}`);
            break;
        case 'feedback':
            alert(`Opening Telegram chat with reference to ID: ${selectedFaceId}`);
            break;
    }
}

function closeStatusModal() {
    modal.classList.remove('active');
}

// Применяем статус
function applyStatus(newStatus) {
    if (!selectedFaceId) return;

    // Находим карточку в DOM
    const card = document.querySelector(`.face-card[data-id="${selectedFaceId}"]`);
    const badge = card.querySelector('.status-badge');

    // Обновляем текст
    // Добавляем иконку для красоты
    const icon = newStatus === 'Issued' ? '✅' : '⏳';
    badge.textContent = `${icon} ${newStatus}`;

    // Сбрасываем старые классы цветов
    badge.classList.remove('status-issued', 'status-not-issued');

    // Добавляем новый класс цвета
    if (newStatus === 'Issued') {
        badge.classList.add('status-issued');
    } else {
        badge.classList.add('status-not-issued');
    }

    // Закрываем окно
    closeStatusModal();
}

// Закрытие модального окна при клике вне его (на темный фон)
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeStatusModal();
    }
});
