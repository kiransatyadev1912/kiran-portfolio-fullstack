console.log("✅ script.js loaded");

/* =========================================================
   ✅ SET YOUR RENDER BACKEND URL HERE (after deploy)
   Example: https://portfolio-backend.onrender.com
   ========================================================= */
const RENDER_BACKEND_URL = "https://kiran-portfolio-backend.onrender.com";

function changeAboutMeText() {
  const aboutMeTexts = ["Tech Enthusiast", "Data Scientist", "Full Stack Web Developer"];
  const typingSpeed = 100;
  const eraseSpeed = 50;
  const pauseTime = 1500;
  const aboutMeElement = document.querySelector(".about-me");

  if (!aboutMeElement) return;

  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentText = aboutMeTexts[textIndex];

    // Typing
    if (!isDeleting && charIndex < currentText.length) {
      aboutMeElement.textContent += currentText[charIndex];
      charIndex++;
      setTimeout(type, typingSpeed);
    }
    // Erasing
    else if (isDeleting && charIndex > 0) {
      aboutMeElement.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
      setTimeout(type, eraseSpeed);
    }
    // Switch typing/deleting
    else {
      isDeleting = !isDeleting;
      if (!isDeleting) {
        textIndex = (textIndex + 1) % aboutMeTexts.length;
      }
      setTimeout(type, pauseTime);
    }
  }

  type();
}

document.addEventListener("DOMContentLoaded", function () {
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const body = document.body;

  if (!darkModeToggle) return;

  darkModeToggle.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    const icon = darkModeToggle.querySelector("i");
    if (icon) {
      icon.classList.toggle("fa-sun");
      icon.classList.toggle("fa-moon");
      icon.classList.toggle("light-mode");
    }
  });
});

changeAboutMeText();

document.addEventListener("DOMContentLoaded", function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const progressBar = entry.target.querySelector(".progress-bar");
        if (!progressBar) return;

        const progress = progressBar.dataset.progress;
        progressBar.style.setProperty("--progress", `${progress}%`);
        progressBar.classList.add("animated");
        observer.unobserve(entry.target);
      }
    });
  });

  const programmingLanguages = document.querySelectorAll("#programming-languages .skill");
  programmingLanguages.forEach((skill) => {
    observer.observe(skill);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (!navToggle || !navMenu) return;

  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });
});

/* ------------------------------- MODAL SCRIPTS - PROJECTS POPUP ------------------------------------- */

document.querySelectorAll(".btn-know-more").forEach((button) => {
  button.addEventListener("click", () => {
    const modal = document.createElement("div");
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-button">×</span>
        <h2>Project Title</h2>
        <p>Project description...</p>
      </div>
    `;
    modal.className = "modal";
    document.body.appendChild(modal);

    modal.style.display = "block";

    modal.querySelector(".close-button").addEventListener("click", () => {
      modal.style.display = "none";
      modal.remove();
    });
  });
});

document.querySelectorAll(".btn.know-more").forEach((button) => {
  button.addEventListener("click", function (e) {
    e.preventDefault();
    const modalId = this.getAttribute("data-modal-target");
    const modal = document.querySelector(modalId);
    if (modal) {
      modal.style.display = "block";
      disableScroll();
    }
  });
});

// Function to prevent scrolling
function disableScroll() {
  document.body.style.overflow = "hidden";
}

// Function to enable scrolling
function enableScroll() {
  document.body.style.overflow = "";
}

// Function to initialize the carousel (SAFE VERSION)
function initializeCarousel(carouselContainer) {
  let slideIndex = 1;
  const slides = carouselContainer.querySelectorAll(".carousel-slide img");

  if (!slides.length) return;

  function showSlides(n) {
    if (n > slides.length) slideIndex = 1;
    if (n < 1) slideIndex = slides.length;
    slides.forEach((slide) => (slide.style.display = "none"));
    slides[slideIndex - 1].style.display = "block";
  }

  showSlides(slideIndex);

  const prevBtn = carouselContainer.querySelector(".prev");
  const nextBtn = carouselContainer.querySelector(".next");

  if (prevBtn) prevBtn.addEventListener("click", () => showSlides(--slideIndex));
  if (nextBtn) nextBtn.addEventListener("click", () => showSlides(++slideIndex));
}

// Enhanced modal logic to handle opening and initializing the carousel
document.querySelectorAll(".btn.know-more").forEach((button) => {
  button.addEventListener("click", function (e) {
    e.preventDefault();
    const modalId = this.getAttribute("data-modal-target");
    const modal = document.querySelector(modalId);
    if (modal) {
      modal.style.display = "block";
      disableScroll();
      const carouselContainer = modal.querySelector(".carousel-container");
      if (carouselContainer) {
        initializeCarousel(carouselContainer);
      }
    }
  });
});

// Close modal functionality
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("modal") || e.target.classList.contains("close")) {
    const modals = document.querySelectorAll(".modal");
    modals.forEach((modal) => {
      modal.style.display = "none";
    });
    enableScroll();
  }
});

/* ===============================
   Contact form -> Backend (LOCAL + RENDER)
   =============================== */
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");
  const contactStatus = document.getElementById("contactStatus");

  console.log("✅ trying to attach contact handler...");

  if (!contactForm) {
    console.log("❌ contactForm not found (check id='contactForm' in HTML)");
    return;
  }

  console.log("✅ contact handler attached");

  // ✅ Auto-switch API URL:
  // - local dev (localhost) -> use local backend
  // - GitHub Pages / production -> use Render backend
  const API_BASE =
    window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
      ? "http://localhost:5000"
      : RENDER_BACKEND_URL;

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    contactStatus.textContent = "Sending...";

    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        contactStatus.textContent = data.msg || "Failed to send.";
        return;
      }

      contactStatus.textContent = data.msg || "Message received ✅";
      contactForm.reset();
    } catch (err) {
      console.error(err);
      contactStatus.textContent = "Error: Backend not reachable.";
    }
  });
});
