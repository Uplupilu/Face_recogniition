let selectedFaceId = null;
const modal = document.getElementById('statusModal');

// 1. Выбор карточки
function selectCard(element) {
    const id = element.getAttribute('data-id');

    if (selectedFaceId === id) {
        // Если кликнули по той же карточке - снимаем выделение
        deselectAll();
        selectedFaceId = null;
        updateActionButtons(false);
        return;
    }

    // Снимаем выделение со всех
    deselectAll();

    // Выделяем новую
    element.classList.add('selected');
    selectedFaceId = id;
    
    // Включаем кнопки
    updateActionButtons(true);
}

function deselectAll() {
    document.querySelectorAll('.face-card').forEach(card => {
        card.classList.remove('selected');
    });
}

// 2. Управление состоянием кнопок (Активно / Неактивно)
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

// 3. Обработка нажатий на кнопки действий
function handleAction(type) {
    if (!selectedFaceId) return;

    switch(type) {
        case 'status':
            openStatusModal();
            break;
        case 'edit':
            alert("Edit feature placeholder");
            break;
        case 'feedback':
            alert("Feedback feature placeholder");
            break;
    }
}

// 4. Функции Модального окна
function openStatusModal() {
    modal.classList.add('active');
}

function closeStatusModal() {
    modal.classList.remove('active');
}

function applyStatus(newStatus) {
    if (!selectedFaceId) return;

    // Находим выбранную карточку
    const card = document.querySelector(`.face-card[data-id="${selectedFaceId}"]`);
    if (!card) return;

    const badge = card.querySelector('.status-badge');

    // Определяем текст и стиль в зависимости от выбора
    if (newStatus === 'Issued') {
        badge.textContent = '✅ Issued';
        badge.className = 'status-badge status-issued'; // Сброс классов и установка новых
    } else {
        badge.textContent = '⏳ Not Issued';
        badge.className = 'status-badge status-not-issued';
    }

    closeStatusModal();
}

// 5. Удаление лица
function deleteFace(event, btnElement) {
    event.stopPropagation(); // Чтобы не выделялась карточка при клике на крестик
    
    if (confirm("Are you sure?")) {
        const card = btnElement.closest('.card');
        
        if (card.classList.contains('selected')) {
            selectedFaceId = null;
            updateActionButtons(false);
        }
        
        card.remove();
    }
}

// 6. Добавление (заглушка)
function addNewFace() {
    alert("Add New Face placeholder");
}

// Закрытие модального окна при клике на темный фон
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeStatusModal();
    }
});
