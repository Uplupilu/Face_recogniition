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

// Обработка действий
function handleAction(type) {
    if (!selectedFaceId) {
        alert("Please select a face first.");
        return;
    }

    switch(type) {
        case 'status':
            alert(`Open Status Picker for ID: ${selectedFaceId}`);
            break;
        case 'edit':
            alert(`Open Edit Form for ID: ${selectedFaceId}`);
            break;
        case 'feedback':
            alert(`Opening Telegram chat with reference to ID: ${selectedFaceId}`);
            break;
    }
}
