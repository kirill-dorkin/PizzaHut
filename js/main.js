const navMenu = document.getElementById("nav-menu");
const navToggle = document.getElementById("nav-toggle");
const navClose = document.getElementById("nav-close");

const navLink = document.querySelectorAll(".nav__link")
/*~~~~~~~~~~~~~~~ TOGGLE MENU ~~~~~~~~~~~~~~~*/
/* MENU SHOW */
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu')
    })
}

/* MENU HIDDEN */
if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove("show-menu")
    })
}

/* REMOVE MENU MOBILE */
navLink.forEach(link => link.addEventListener('click', () => {
    navMenu.classList.remove("show-menu")
}))
/*~~~~~~~~~~~~~~~ CHANGE BACKGROUND HEADER ~~~~~~~~~~~~~~~*/

const scrollHeader = () => {
    const header = document.getElementById("header");

    this.scrollY >= 50
        ? header.classList.add("bg-header")
        : header.classList.remove("bg-header");
}
window.addEventListener("scroll", scrollHeader);

/*~~~~~~~~~~~~~~~ SCROLL SECTIONS ACTIVE LINK ~~~~~~~~~~~~~~~*/
const activeLink = () => {
    const section = document.querySelectorAll('section');
    const navLink = document.querySelectorAll(".nav__link");

    let current = "home";

    section.forEach(section => {
        const sectionTop = section.offsetTop;

        if (this.scrollY >= sectionTop - 60) {
            current = section.getAttribute('id');
        }
    })

    navLink.forEach(item => {
        item.classList.remove('active-link');
        if (item.href.includes(current)) {
            item.classList.add("active-link")
        }
    })

}

window.addEventListener("scroll", activeLink);

/*~~~~~~~~~~~~~~~ SHOW SCROLL UP ~~~~~~~~~~~~~~~*/
const scrollUp = () => {
    const scrollUp = document.getElementById("scroll-up");

    this.scrollY >= 350
        ? scrollUp.classList.add("show-scroll")
        : scrollUp.classList.remove("show-scroll");
}
window.addEventListener("scroll", scrollUp);
/*~~~~~~~~~~~~~~~ DARK LIGHT THEME ~~~~~~~~~~~~~~~*/
const themebutton = document.getElementById('theme-button');

if (localStorage.getItem('mode') == 'dark') {
    darkmode();
} else {
    lightmode();
}

themebutton.addEventListener('click', (e) => {
    if (localStorage.getItem('mode') == 'light') {
        darkmode();
    }
    else {
        lightmode();
    }

})

function darkmode() {
    document.body.classList.add('dark-theme');
    themebutton.classList.replace('fa-moon', 'fa-sun');
    localStorage.setItem('mode', 'dark');
}

function lightmode() {
    document.body.classList.remove('dark-theme');
    themebutton.classList.replace('fa-sun', 'fa-moon');
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
const addressInput = paymentForm.querySelector('input[placeholder="Delivery Address"]');
const nameInput = paymentForm.querySelector('input[placeholder="Cardholder Name"]');
const cardInput = paymentForm.querySelector('input[placeholder="Card Number"]');
const expiryInput = paymentForm.querySelector('input[placeholder="Expiry Date (MM/YY)"]');
const cvvInput = paymentForm.querySelector('input[placeholder="CVV"]');


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
    let value = addressInput.value.trim();
    if (value.length >= 5) {
        clearError(addressInput);
    }
});

nameInput.addEventListener('input', () => {
    let value = nameInput.value.trim();
    if (/^[A-Za-z\s]{2,}$/.test(value)) {
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

    if (addressInput.value.trim() === '') {
        showError(addressInput, 'Please enter a delivery address.');
        hasError = true;
    }

    const cardNumber = cardInput.value.replace(/\s+/g, '');
    if (!/^\d{16}$/.test(cardNumber)) {
        showError(cardInput, 'Enter a 16-digit card number.');
        hasError = true;
    }

    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiryInput.value.trim())) {
        showError(expiryInput, 'Use MM/YY format.');
        hasError = true;
    } else {
        const [month, year] = expiryInput.value.split('/').map(Number);
        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;
        if (year < currentYear || (year === currentYear && month < currentMonth)) {
            showError(expiryInput, 'Card has expired.');
            hasError = true;
        }
    }

    if (!/^\d{3,4}$/.test(cvvInput.value.trim())) {
        showError(cvvInput, 'Enter a 3- or 4-digit CVV.');
        hasError = true;
    }

    if (!hasError) {
        const payload = {
            address: addressInput.value.trim(),
            cardholderName: nameInput.value.trim(),
            cardNumber: cardInput.value.trim(),
            expiry: expiryInput.value.trim(),
            cvv: cvvInput.value.trim()
        };

        fetch('http://localhost:3000/save-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
            .then(res => res.text())
            .then(msg => {
                console.log(msg);
                showSuccessMessage('Payment saved locally (for demo)');
                paymentForm.reset();
                closePopupSmoothly();
            })
            .catch(err => {
                console.error(err);
                alert('Error saving data');
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
