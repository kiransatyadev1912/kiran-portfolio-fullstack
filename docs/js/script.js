console.log("✅ script.js loaded");

function changeAboutMeText() 
{
    const aboutMeTexts = ["Tech Enthusiast", "Data Scientist", "Full Stack Web Developer"]; // Add more texts as needed
    const typingSpeed = 100; // milliseconds per character
    const eraseSpeed = 50; // milliseconds per character during erasing
    const pauseTime = 1500; // milliseconds to pause between each text change
    const aboutMeElement = document.querySelector('.about-me');

    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() 
    {
        const currentText = aboutMeTexts[textIndex];
        /* Typing */
        if (!isDeleting && charIndex < currentText.length) 
        {
            aboutMeElement.textContent += currentText[charIndex];
            charIndex++;
            setTimeout(type, typingSpeed);
        }
        /* Erasing */
        else if (isDeleting && charIndex > 0) {
            aboutMeElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            setTimeout(type, eraseSpeed);
        } 
        /* Switching the deleting or Typing process */
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


document.addEventListener('DOMContentLoaded', function () {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;

    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const currentMode = body.classList.contains('dark-mode') ? 'Dark' : 'Light';
        darkModeToggle.querySelector('i').classList.toggle('fa-sun'); // Change icon
        darkModeToggle.querySelector('i').classList.toggle('fa-moon'); // Change icon
        darkModeToggle.querySelector('i').classList.toggle('light-mode'); // Change icon color
    });
});

changeAboutMeText();

document.addEventListener('DOMContentLoaded', function() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.progress-bar');
                const progress = progressBar.dataset.progress;
                
                progressBar.style.setProperty('--progress', `${progress}%`); // Set custom property for progress
                progressBar.classList.add('animated'); // Add a class to trigger animation
                observer.unobserve(entry.target); // Stop observing once animation is triggered
            }
        });
    });

    const programmingLanguages = document.querySelectorAll('#programming-languages .skill');
    programmingLanguages.forEach(skill => {
        observer.observe(skill);
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
});


/* ------------------------------- MODAL SCRIPTS - PROJECTS POPUP ------------------------------------- */


document.querySelectorAll('.btn-know-more').forEach(button => {
    button.addEventListener('click', event => {
        const modal = document.createElement('div');
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-button">×</span>
                <h2>Project Title</h2>
                <p>Project description...</p>
                <!-- Add more content here -->
            </div>
        `;
        modal.className = 'modal';
        document.body.appendChild(modal);
        
        // Show the modal
        modal.style.display = 'block';
        
        // Close the modal
        modal.querySelector('.close-button').addEventListener('click', () => {
            modal.style.display = 'none';
        });
    });
});


document.querySelectorAll('.btn.know-more').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const modalId = this.getAttribute('data-modal-target');
        const modal = document.querySelector(modalId);
        if (modal) {
            modal.style.display = "block";
            disableScroll();
        }
    });
});

// Function to prevent scrolling
function disableScroll() {
    document.body.style.overflow = 'hidden';
}

// Function to enable scrolling
function enableScroll() {
    document.body.style.overflow = '';
}

// Function to initialize the carousel
// Function to initialize the carousel (SAFE VERSION)
function initializeCarousel(carouselContainer) {
  let slideIndex = 1;
  const slides = carouselContainer.querySelectorAll(".carousel-slide img");

  // If no slides exist, stop safely
  if (!slides.length) return;

  function showSlides(n) {
    if (n > slides.length) slideIndex = 1;
    if (n < 1) slideIndex = slides.length;
    slides.forEach(slide => (slide.style.display = "none"));
    slides[slideIndex - 1].style.display = "block";
  }

  // Initial display
  showSlides(slideIndex);

  const prevBtn = carouselContainer.querySelector(".prev");
  const nextBtn = carouselContainer.querySelector(".next");

  if (prevBtn) prevBtn.addEventListener("click", () => showSlides(--slideIndex));
  if (nextBtn) nextBtn.addEventListener("click", () => showSlides(++slideIndex));
}


// Enhanced modal logic to handle opening and initializing the carousel
document.querySelectorAll('.btn.know-more').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const modalId = this.getAttribute('data-modal-target');
        const modal = document.querySelector(modalId);
        if (modal) {
            modal.style.display = "block";
            disableScroll();
            const carouselContainer = modal.querySelector('.carousel-container');
            if (carouselContainer) {
                initializeCarousel(carouselContainer);
            }
        }
    });
});

// Close modal functionality
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal') || e.target.classList.contains('close')) {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.style.display = "none";
        });
        enableScroll();
    }
});
// ===============================
// Contact form -> Backend (SAFE)
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contactForm");
  const contactStatus = document.getElementById("contactStatus");

  console.log("✅ trying to attach contact handler...");

  if (!contactForm) {
    console.log("❌ contactForm not found (check id='contactForm' in HTML)");
    return;
  }

  console.log("✅ contact handler attached");

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    contactStatus.textContent = "Sending...";

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
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
