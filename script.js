let currentPrice = 0;
let selectedOp = "";
let timerInterval;

function selectOperator(name, basePrice) {
    selectedOp = name;
    // Цена: Базовая + случайные 5-25 рублей, чтобы не было ровно 750, 800 и т.д.
    currentPrice = basePrice + Math.floor(Math.random() * 20) + 5;
    
    document.getElementById('selected-op-name').innerText = `eSIM ${name}`;
    document.getElementById('final-price').innerText = `${currentPrice} ₽`;
    
    goToStep(2);
}

function goToStep(stepNumber) {
    const loader = document.getElementById('loader');
    loader.style.display = 'flex';

    // Задержка 4 секунды как в ТЗ
    setTimeout(() => {
        loader.style.display = 'none';
        
        document.querySelectorAll('.step').forEach(s => s.classList.add('hidden'));
        document.getElementById(`step-${stepNumber}`).classList.remove('hidden');

        if (stepNumber === 3) {
            startTimer(300); // 5 минут
        } else {
            clearInterval(timerInterval);
        }
    }, 4000);
}

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
            showError();
        }
    }, 1000);
}

function checkPayment() {
    // Имитация проверки
    const loader = document.getElementById('loader');
    loader.style.display = 'flex';
    
    setTimeout(() => {
        loader.style.display = 'none';
        showError();
    }, 4000);
}

function showError() {
    document.getElementById('payment-methods').classList.add('hidden');
    document.getElementById('error-message').classList.remove('hidden');
}

function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Можно добавить легкую вибрацию или смену текста
        alert('Скопировано в буфер обмена');
    });
}

// Блокировка кнопки "Назад" браузера для контроля шагов (опционально)
window.history.pushState(null, null, window.location.href);
window.onpopstate = function() {
    window.history.go(1);
};
