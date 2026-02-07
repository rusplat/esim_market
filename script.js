let currentPrice = 0;
let timerInterval;

// Функция выбора оператора
function selectOperator(name, basePrice) {
    // Генерация цены: База + случайные 3-18 рублей
    currentPrice = basePrice + Math.floor(Math.random() * 15) + 3;
    
    document.getElementById('selected-op-name').innerText = `eSIM ${name}`;
    document.getElementById('final-price').innerText = `${currentPrice} ₽`;
    
    goToStep(2);
}

// Функция переключения шагов с задержкой 4 сек
function goToStep(stepNumber) {
    const loader = document.getElementById('loader');
    loader.style.display = 'flex';

    setTimeout(() => {
        loader.style.display = 'none';
        
        // Скрываем все шаги
        document.querySelectorAll('.step').forEach(s => s.classList.add('hidden'));
        
        // Показываем нужный шаг
        const nextStep = document.getElementById(`step-${stepNumber}`);
        nextStep.classList.remove('hidden');

        // Логика для экрана оплаты
        if (stepNumber === 3) {
            resetPaymentUI();
            startTimer(300); // Таймер на 5 минут (300 сек)
        } else {
            clearInterval(timerInterval);
        }
    }, 4000);
}

// Таймер
function startTimer(duration) {
    let timer = duration, minutes, seconds;
    clearInterval(timerInterval);
    
    timerInterval = setInterval(() => {
        minutes = parseInt(timer / 60, 10);
        seconds = parseInt(timer % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        document.getElementById('timer').textContent = minutes + ":" + seconds;

        if (--timer < 0) {
            clearInterval(timerInterval);
            showPaymentError();
        }
    }, 1000);
}

// Имитация проверки оплаты
function checkPayment() {
    const loader = document.getElementById('loader');
    loader.style.display = 'flex';

    setTimeout(() => {
        loader.style.display = 'none';
        showPaymentError();
    }, 4000);
}

// Показать ошибку
function showPaymentError() {
    document.getElementById('payment-methods').classList.add('hidden');
    document.getElementById('pay-check-btn').classList.add('hidden');
    document.getElementById('error-message').classList.remove('hidden');
}

// Сброс интерфейса оплаты (если нажали Назад и снова Перешли)
function resetPaymentUI() {
    document.getElementById('payment-methods').classList.remove('hidden');
    document.getElementById('pay-check-btn').classList.remove('hidden');
    document.getElementById('error-message').classList.add('hidden');
}

// Копирование
function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Скопировано в буфер обмена');
    });
}

// Блокировка системной кнопки назад для корректной работы SPA (опционально)
window.history.pushState(null, null, window.location.href);
window.onpopstate = function() {
    window.history.go(1);
};
