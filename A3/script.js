const cursor = document.querySelector(".cursor");
const progress = document.querySelector(".progress");
const chapters = document.querySelectorAll(".chapter");
const heroVideo = document.querySelector(".hero-video");
const soundButton = document.querySelector("#soundButton");
const ambientAudio = document.querySelector("#ambientAudio");

const canvas = document.querySelector("#particleCanvas");
const context = canvas.getContext("2d");

let soundOn = false;
let particles = [];
let mouseX = 0;
let mouseY = 0;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticles() {
  particles = [];

  for (let i = 0; i < 160; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.4,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: (Math.random() - 0.5) * 0.35,
      opacity: Math.random() * 0.7 + 0.15
    });
  }
}

function animateParticles() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(function (particle) {
    particle.x += particle.speedX + (mouseX - canvas.width / 2) * 0.00003;
    particle.y += particle.speedY + (mouseY - canvas.height / 2) * 0.00003;

    if (particle.x < 0) particle.x = canvas.width;
    if (particle.x > canvas.width) particle.x = 0;
    if (particle.y < 0) particle.y = canvas.height;
    if (particle.y > canvas.height) particle.y = 0;

    context.beginPath();
    context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    context.fillStyle = `rgba(0, 234, 255, ${particle.opacity})`;
    context.fill();
  });

  requestAnimationFrame(animateParticles);
}

resizeCanvas();
createParticles();
animateParticles();

window.addEventListener("resize", function () {
  resizeCanvas();
  createParticles();
});

soundButton.addEventListener("click", function () {
  if (soundOn === false) {
    ambientAudio.volume = 0.45;
    ambientAudio.play();
    soundButton.textContent = "SOUND ON";
    soundOn = true;
  } else {
    ambientAudio.pause();
    soundButton.textContent = "SOUND OFF";
    soundOn = false;
  }
});

window.addEventListener("mousemove", function (event) {
  mouseX = event.clientX;
  mouseY = event.clientY;

  cursor.style.left = `${event.clientX}px`;
  cursor.style.top = `${event.clientY}px`;
});

window.addEventListener("scroll", function () {
  const scrollTop = window.scrollY;
  const pageHeight = document.body.scrollHeight - window.innerHeight;
  const percent = scrollTop / pageHeight;

  progress.style.width = `${percent * 100}%`;

  if (heroVideo) {
    heroVideo.style.transform =
      `scale(${1.08 + percent * 0.22}) rotate(${percent * 4}deg)`;
  }

  chapters.forEach(function (chapter, index) {
    const rect = chapter.getBoundingClientRect();
    const local = 1 - Math.abs(rect.top / window.innerHeight);

    const image = chapter.querySelector(".image");
    const copy = chapter.querySelector(".copy");
    const hud = chapter.querySelector(".hud");

    if (image) {
      image.style.transform =
        `perspective(1000px)
        rotateY(${(1 - local) * -18}deg)
        rotateX(${(1 - local) * 10}deg)
        translateY(${(1 - local) * 55}px)
        scale(${1 + local * 0.08})`;
    }

    if (copy) {
      copy.style.transform =
        `translateY(${(1 - local) * 45}px)`;
    }

    if (hud) {
      hud.style.transform =
        `rotateX(${(1 - local) * 18}deg)
        rotateY(${scrollTop * 0.04 + index * 20}deg)
        scale(${1 + local * 0.08})`;
    }
  });
});

const observer = new IntersectionObserver(
  function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.25
  }
);

chapters.forEach(function (chapter) {
  observer.observe(chapter);

  const accent = chapter.dataset.accent;
  chapter.style.setProperty("--glow", accent);
});