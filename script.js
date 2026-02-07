let currentPrice = 0;
let timerInterval;

function selectOperator(name, basePrice) {
    // Делаем цену не круглой (например 807 или 814)
    currentPrice = basePrice + Math.floor(Math.random() * 15) + 3;
    
    document.getElementById('selected-op-name').innerText = `eSIM ${name}`;
    document.getElementById('final-price').innerText = `${currentPrice} ₽`;
    
    goToStep(2);
}

function goToStep(stepNumber) {
    const loader = document.getElementById('loader');
    loader.style.display = 'flex';

    // Задержка 4 секунды (эффект работы сервера)
    setTimeout(() => {
        loader.style.display = 'none';
        document.querySelectorAll('.step').forEach(s => s.classList.add('hidden'));
        document.getElementById(`step-${stepNumber}`).classList.remove('hidden');

        if (stepNumber === 3) startTimer(300);
        else clearInterval(timerInterval);
    }, 4000);
}

// ... функции startTimer, checkPayment и copyText остаются прежними ...
