
document.addEventListener('DOMContentLoaded', () => {
    // --- Элементы страниц ---
    const mainSelectionPage = document.getElementById('main-selection-page');
    const confirmationPage = document.getElementById('confirmation-page');
    const cryptoPaymentPage = document.getElementById('crypto-payment-page');
    const sbpPaymentPage = document.getElementById('sbp-payment-page');
    const checkPaymentPage = document.getElementById('check-payment-page');
    const generateQrPage = document.getElementById('generate-qr-page');

    // --- Элементы на основной странице ---
    const operatorCards = document.querySelectorAll('.operator-card');

    // --- Элементы на странице подтверждения ---
    const chosenOperatorDisplay = document.getElementById('chosen-operator');
    const chosenPriceDisplay = document.getElementById('chosen-price');
    const generatedPhoneNumberDisplay = document.getElementById('generated-phone-number');
    const cryptoPaymentBtn = document.getElementById('crypto-payment-btn');
    const sbpPaymentBtn = document.getElementById('sbp-payment-btn');

    // --- Элементы на странице крипто-оплаты ---
    const usdtSelectBtn = document.getElementById('usdt-select-btn');
    const btcSelectBtn = document.getElementById('btc-select-btn');
    const usdtAddressDisplay = document.getElementById('usdt-address-display');
    const btcAddressDisplay = document.getElementById('btc-address-display');
    const cryptoAmountRub = document.getElementById('crypto-amount-rub');
    const cryptoAmountUsdt = document.getElementById('crypto-amount-usdt');
    const cryptoAmountBtc = document.getElementById('crypto-amount-btc');
    const cryptoTimerDisplay = document.getElementById('crypto-timer');
    const iPaidCryptoBtn = document.getElementById('i-paid-crypto-btn');

    // --- Элементы на странице СБП-оплаты ---
    const sbpAmountDisplay = document.getElementById('sbp-amount-display');
    const sbpTimerDisplay = document.getElementById('sbp-timer');
    const iPaidSbpBtn = document.getElementById('i-paid-sbp-btn');
    const openSbpAppBtn = document.getElementById('open-sbp-app-btn');

    // --- Элементы на страницах проверки и QR ---
    const finalQrCodeImg = document.getElementById('final-qr-code');
    const qrCodeDisplay = document.getElementById('qr-code-display');

    // --- Переменные состояния ---
    let selectedOperator = '';
    let selectedPrice = 0;
    let paymentTimerInterval; // Для таймеров

    // --- ФИКСИРОВАННЫЕ КУРСЫ И АДРЕСА ---
    const USDT_RATE = 95.00; // 1 USDT = 95.00 RUB
    const BTC_RATE = 6000000.00; // 1 BTC = 6 000 000.00 RUB

    const USDT_ADDRESS = 'TTXL8srvCqom7RebeyZAjUwyAcTK9R9SD4';
    const BTC_ADDRESS = 'bc1qn6ye3evk12cj04dhxyk7gvrk72vjqhtqhe3gzqgl';

    const SBP_PHONE = '79299428107'; // Номер для СБП (без пробелов для ссылки)

    const DUMMY_QR_URLS = [
        'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ESIM_CODE_1234567890_RU_MTS',
        'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ESIM_CODE_0987654321_RU_MEGAFON',
        'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ESIM_CODE_ABCDEFGH_RU_BEELINE',
        'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ESIM_CODE_IJKLMNOP_RU_TELE2',
        'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ESIM_CODE_QRSTUVWX_RU_YOTA',
        'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ESIM_CODE_YZABCD_RU_TINKOFF'
    ];

    // --- Функция для переключения страниц ---
    function showPage(pageId) {
        clearInterval(paymentTimerInterval); // Останавливаем таймер при смене страницы
        const allPages = [mainSelectionPage, confirmationPage, cryptoPaymentPage, sbpPaymentPage, checkPaymentPage, generateQrPage];
        allPages.forEach(page => {
            if (page) page.style.display = 'none';
        });

        const targetPage = document.getElementById(pageId);
        if (targetPage) targetPage.style.display = 'block';

        // Сброс состояния QR-кода при переходе на главную
        if (pageId === 'main-selection-page') {
            qrCodeDisplay.style.display = 'none';
            finalQrCodeImg.src = '';
        }
    }

    // --- Функция для запуска таймера ---
    function startTimer(duration, displayElementId, onEndCallback) {
        let timer = duration; // Длительность в секундах
        clearInterval(paymentTimerInterval); // Очищаем предыдущий таймер
        const display = document.getElementById(displayElementId);

        paymentTimerInterval = setInterval(() => {
            let minutes = parseInt(timer / 60, 10);
            let seconds = parseInt(timer % 60, 10);

            minutes = minutes < 10 ? "0" + minutes : minutes;
            seconds = seconds < 10 ? "0" + seconds : seconds;

            if (display) display.textContent = minutes + ":" + seconds;

            if (--timer < 0) {
                clearInterval(paymentTimerInterval);
                if (display) display.textContent = "Время вышло!";
                if (onEndCallback) onEndCallback();
            }
        }, 1000);
    }

    // --- Генерация случайного номера телефона ---
    function generateRandomPhoneNumber() {
        const prefix = '9'; // Начинаем с 9
        const digits = Array(9).fill(0).map(() => Math.floor(Math.random() * 10)).join('');
        return `+7 ${prefix}${digits.substring(0,2)} ${digits.substring(2,5)}-${digits.substring(5,7)}-${digits.substring(7,9)}`;
    }


    // --- Обработчики событий ---

    // Выбор оператора
    operatorCards.forEach(card => {
        card.addEventListener('click', () => {
            selectedOperator = card.dataset.operator;
            selectedPrice = parseInt(card.dataset.price);

            chosenOperatorDisplay.textContent = selectedOperator;
            chosenPriceDisplay.textContent = selectedPrice;
            generatedPhoneNumberDisplay.textContent = generateRandomPhoneNumber(); // Генерируем новый номер

            showPage('confirmation-page');
        });
    });

    // Оплата криптовалютой
    if (cryptoPaymentBtn) {
        cryptoPaymentBtn.addEventListener('click', () => {
            showPage('crypto-payment-page');
            cryptoAmountRub.textContent = selectedPrice; // Сумма в рублях

            // Изначально показываем USDT
            usdtSelectBtn.click(); // Имитируем нажатие на кнопку USDT, чтобы сразу посчиталось и показалось

            startTimer(900, 'crypto-timer', () => { // 15 минут = 900 секунд
                alert('Время для оплаты криптовалютой истекло! Пожалуйста, начните заново.');
                showPage('main-selection-page');
            });
        });
    }

    // Кнопки выбора монеты
    if (usdtSelectBtn) {
        usdtSelectBtn.addEventListener('click', () => {
            usdtSelectBtn.classList.add('active');
            btcSelectBtn.classList.remove('active');
            usdtAddressDisplay.style.display = 'block';
            btcAddressDisplay.style.display = 'none';

            const usdtAmount = (selectedPrice / USDT_RATE).toFixed(2);
            cryptoAmountUsdt.textContent = usdtAmount;
        });
    }
    if (btcSelectBtn) {
        btcSelectBtn.addEventListener('click', () => {
            btcSelectBtn.classList.add('active');
            usdtSelectBtn.classList.remove('active');
            btcAddressDisplay.style.display = 'block';
            usdtAddressDisplay.style.display = 'none';

            const btcAmount = (selectedPrice / BTC_RATE).toFixed(6); // BTC с большей точностью
            cryptoAmountBtc.textContent = btcAmount;
        });
    }

    // Кнопки "Скопировать адрес"
    document.querySelectorAll('.copy-button').forEach(button => {
        button.addEventListener('click', () => {
            const address = button.dataset.address;
            navigator.clipboard.writeText(address).then(() => {
                const originalText = button.textContent;
                button.textContent = 'Скопировано!';
                setTimeout(() => {
                    button.textContent = originalText;
                }, 1500);
            }).catch(err => {
                console.error('Не удалось скопировать текст: ', err);
                alert('Ошибка при копировании. Попробуйте вручную.');
            });
        });
    });

    // Оплата через СБП
    if (sbpPaymentBtn) {
        sbpPaymentBtn.addEventListener('click', () => {
            showPage('sbp-payment-page');
            sbpAmountDisplay.textContent = selectedPrice;

            startTimer(900, 'sbp-timer', () => { // 15 минут
                alert('Время для оплаты по СБП истекло! Пожалуйста, начните заново.');
                showPage('main-selection-page');
            });
        });
    }

    // Кнопка "Перейти в СБП" (имитация глубокой ссылки)
    if (openSbpAppBtn) {
        openSbpAppBtn.addEventListener('click', () => {
            // Эта ссылка - глубокая ссылка для Сбербанка.
            // Для универсальной СБП нужен API. Это имитация.
            const sbpLink = `https://link.payments.yandex.ru/bank_app/sberbank?amount=${selectedPrice}&phone=${SBP_PHONE}`;
            window.open(sbpLink, '_blank'); // Открываем в новой вкладке
        });
    }

    // Кнопка "Я оплатил" (крипта)
    if (iPaidCryptoBtn) {
        iPaidCryptoBtn.addEventListener('click', () => {
            clearInterval(paymentTimerInterval);
            showPage('check-payment-page');
            simulatePaymentCheck();
        });
    }

    // Кнопка "Я оплатил" (СБП)
    if (iPaidSbpBtn) {
        iPaidSbpBtn.addEventListener('click', () => {
            clearInterval(paymentTimerInterval);
            showPage('check-payment-page');
            simulatePaymentCheck();
        });
    }

    // --- Симуляция проверки оплаты и генерации QR ---
    function simulatePaymentCheck() {
        // Убираем старый QR при повторной проверке
        qrCodeDisplay.style.display = 'none';
        finalQrCodeImg.src = '';

        setTimeout(() => {
            // После 30 секунд проверки, переходим к генерации QR
            showPage('generate-qr-page');
            setTimeout(() => {
                // После 1 минуты генерации, показываем QR
                displayRandomQrCode();
            }, 60000); // 1 минута
        }, 30000); // 30 секунд
    }

    function displayRandomQrCode() {
        const randomIndex = Math.floor(Math.random() * DUMMY_QR_URLS.length);
        finalQrCodeImg.src = DUMMY_QR_URLS[randomIndex];
        qrCodeDisplay.style.display = 'block'; // Показываем блок с QR-кодом
    }

    // --- Начальная инициализация: показываем главную страницу ---
    showPage('main-selection-page');
});
