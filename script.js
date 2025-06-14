const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const workTimeInput = document.getElementById("workTime");
const breakTimeInput = document.getElementById("breakTime");
const timerDisplay = document.getElementById("timer");
const modal = document.getElementById("breakModal");
const closeModal = document.getElementById("closeModal");
const chime = document.getElementById("chime");
const alarmSound = document.getElementById("alarmSound");
const themeToggle = document.getElementById("toggleDark");
const backgroundMusic = document.getElementById("backgroundMusic");
const customMusic = document.getElementById("customMusic");

let timer = null;
let isRunning = false;
let remainingSeconds = 0;
let currentPhase = "work"; // 'work' або 'break'

const radius = 70;
const circumference = 2 * Math.PI * radius;
const progressCircle = document.querySelector(".progress");
progressCircle.style.strokeDasharray = `${circumference}`;
progressCircle.style.strokeDashoffset = `${circumference}`;

function setProgress(percent) {
    const offset = circumference - percent * circumference;
    progressCircle.style.strokeDashoffset = offset;
}

function updateDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

    const total = (currentPhase === "work" ? workTimeInput.value : breakTimeInput.value) * 60;
    setProgress(1 - seconds / total);
}

function startPhase(phase) {
    clearInterval(timer);
    currentPhase = phase;
    isRunning = true;

    const inputTime = phase === "work" ? workTimeInput.value : breakTimeInput.value;
    remainingSeconds = parseInt(inputTime) * 60;
    updateDisplay(remainingSeconds);

    timer = setInterval(() => {
        remainingSeconds--;
        updateDisplay(remainingSeconds);

        if (remainingSeconds <= 0) {
            clearInterval(timer);
            isRunning = false;
            chime.play();
            alarmSound.play();

            if (phase === "work") {
                modal.style.display = "flex"; // покажи модалку
            } else {
                startPhase("work"); // автоматичний перехід до роботи
            }
        }
    }, 1000);

    startBtn.disabled = true;
    pauseBtn.disabled = false;
}

startBtn.addEventListener("click", () => {
    if (!isRunning) {
        startPhase("work");
    }
});

pauseBtn.addEventListener("click", () => {
    clearInterval(timer);
    isRunning = false;
    startBtn.disabled = false;
    pauseBtn.disabled = true;
});

resetBtn.addEventListener("click", () => {
    clearInterval(timer);
    isRunning = false;
    currentPhase = "work";
    remainingSeconds = parseInt(workTimeInput.value) * 60;
    updateDisplay(remainingSeconds);
    startBtn.disabled = false;
    pauseBtn.disabled = true;
});

closeModal.addEventListener("click", () => {
    modal.style.display = "none";
    startPhase("break"); // запусти перерву
});

// Тема
themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const darkMode = document.body.classList.contains("dark");
    themeToggle.textContent = darkMode ? "☀️ Light Mode" : "🌙 Dark Mode";
    localStorage.setItem("darkMode", darkMode);
});

// Завантаження
window.addEventListener("load", () => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    document.body.classList.toggle("dark", savedMode);
    themeToggle.textContent = savedMode ? "☀️ Light Mode" : "🌙 Dark Mode";

    currentPhase = "work";
    remainingSeconds = parseInt(workTimeInput.value) * 60;
    updateDisplay(remainingSeconds);
});

// Музика
customMusic.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const url = URL.createObjectURL(file);
        backgroundMusic.src = url;
        backgroundMusic.play();
    }
});