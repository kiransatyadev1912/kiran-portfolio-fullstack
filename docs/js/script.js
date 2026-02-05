console.log("✅ script.js loaded");

const RENDER_BACKEND_URL = "https://kiran-portfolio-fullstack.onrender.com";

/* ===============================
   Typing Animation (About Me)
   =============================== */
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

    if (!isDeleting && charIndex < currentText.length) {
      aboutMeElement.textContent += currentText[charIndex];
      charIndex++;
      setTimeout(type, typingSpeed);
    } else if (isDeleting && charIndex > 0) {
      aboutMeElement.textContent = currentText.substring(0, charIndex - 1);
      charIndex--;
      setTimeout(type, eraseSpeed);
    } else {
      isDeleting = !isDeleting;
      if (!isDeleting) textIndex = (textIndex + 1) % aboutMeTexts.length;
      setTimeout(type, pauseTime);
    }
  }

  type();
}

changeAboutMeText();

/* ===============================
   DOM Ready: All UI behaviors
   =============================== */
document.addEventListener("DOMContentLoaded", () => {
  /* Dark Mode Toggle */
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const body = document.body;

  if (darkModeToggle) {
    darkModeToggle.addEventListener("click", () => {
      body.classList.toggle("dark-mode");
      const icon = darkModeToggle.querySelector("i");
      if (icon) {
        icon.classList.toggle("fa-sun");
        icon.classList.toggle("fa-moon");
        icon.classList.toggle("light-mode");
      }
    });
  }

  /* Mobile Nav Toggle */
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
    });
  }

  /* ✅ Horizontal Skills Scroll Animation */
  const skills = document.querySelectorAll(".skills-list li");

  if (skills.length) {
    const skillObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show-skill");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    skills.forEach((skill, index) => {
      skill.style.transitionDelay = `${index * 0.25}s`; // one-by-one
      skillObserver.observe(skill);
    });
  }

  /* ✅ Progress Bars Animation */
  const progressSkills = document.querySelectorAll("#programming-languages .skill");

  const progressObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const bar = entry.target.querySelector(".progress-bar");
        if (!bar) return;

        const progress = bar.dataset.progress;
        bar.style.setProperty("--progress", `${progress}%`);
        bar.classList.add("animated");

        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  progressSkills.forEach((skill) => progressObserver.observe(skill));

  /* ✅ Contact Form (Local + Render) */
  const contactForm = document.getElementById("contactForm");
  const contactStatus = document.getElementById("contactStatus");

  if (contactForm && contactStatus) {
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
  }
});
