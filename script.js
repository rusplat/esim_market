let currentPriceRub = 0;
let timerInterval;
const USDT_RATE = 77.4; // Курс USDT к рублю. Можете менять здесь.

function selectOperator(name, basePrice) {
    // Рандомная добавка к цене для реализма
    currentPriceRub = basePrice + Math.floor(Math.random() * 15) + 3;
    
    document.getElementById('selected-op-name').innerText = `eSIM ${name}`;
    document.getElementById('preview-price').innerText = `${currentPriceRub} ₽`;
    
    goToStep(2);
}

function goToStep(stepNumber) {
    const loader = document.getElementById('loader');
    loader.style.display = 'flex';

    setTimeout(() => {
        loader.style.display = 'none';
        document.querySelectorAll('.step').forEach(s => s.classList.add('hidden'));
        document.getElementById(`step-${stepNumber}`).classList.remove('hidden');

        if (stepNumber === 3) {
            setupPaymentPage();
            startTimer(300);
        } else {
            clearInterval(timerInterval);
        }
    }, 4000);
}

function setupPaymentPage() {
    // Установка суммы в рублях
    document.getElementById('pay-amount-rub').innerText = `${currentPriceRub} ₽`;
    
    // Расчет и установка суммы в USDT
    const priceUsdt = (currentPriceRub / USDT_RATE).toFixed(2);
    document.getElementById('pay-amount-usdt').innerText = `${priceUsdt} USDT`;
    
    // Сброс UI
    document.getElementById('payment-methods').classList.remove('hidden');
    document.getElementById('pay-check-btn').classList.remove('hidden');
    document.getElementById('error-message').classList.add('hidden');
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
            showPaymentError();
        }
    }, 1000);
}

function checkPayment() {
    const loader = document.getElementById('loader');
    loader.style.display = 'flex';
    setTimeout(() => {
        loader.style.display = 'none';
        showPaymentError();
    }, 4000);
}

function showPaymentError() {
    document.getElementById('payment-methods').classList.add('hidden');
    document.getElementById('pay-check-btn').classList.add('hidden');
    document.getElementById('error-message').classList.remove('hidden');
}

function copyText(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Скопировано');
    });
}
