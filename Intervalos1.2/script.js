// script.js
const notes = [
    { name: 'C4', audio: new Audio('notas/Do3.mp3'), semitones: 0 },
    { name: 'C#4', audio: new Audio('notas/Do_sostenido3.mp3'), semitones: 1 },
    { name: 'D4', audio: new Audio('notas/Re3.mp3'), semitones: 2 },
    { name: 'D#4', audio: new Audio('notas/Re_sostenido3.mp3'), semitones: 3 },
    { name: 'E4', audio: new Audio('notas/Mi3.mp3'), semitones: 4 },
    { name: 'F4', audio: new Audio('notas/Fa3.mp3'), semitones: 5 },
    { name: 'F#4', audio: new Audio('notas/Fa_sostenido3.mp3'), semitones: 6 },
    { name: 'G4', audio: new Audio('notas/Sol3.mp3'), semitones: 7 },
    { name: 'G#4', audio: new Audio('notas/Sol_sostenido3.mp3'), semitones: 8 },
    { name: 'A4', audio: new Audio('notas/La3.mp3'), semitones: 9 },
    { name: 'A#4', audio: new Audio('notas/La_sostenido3.mp3'), semitones: 10 },
    { name: 'B4', audio: new Audio('notas/Si3.mp3'), semitones: 11 },
    { name: 'C5', audio: new Audio('notas/Do4.mp3'), semitones: 12 }
];

const allIntervals = {
    /*unisono: 0,*/
    segunda_menor: 1,
    segunda_mayor: 2,
    tercera_menor: 3,
    tercera_mayor: 4,
    cuarta_justa: 5,
    cuarta_aumentada: 6,
    quinta_justa: 7,
    sexta_menor: 8,
    sexta_mayor: 9,
    septima_menor: 10,
    septima_mayor: 11,
    octava_justa: 12
};

const intervalNames = {
    /*unisono: 'Unísono',*/
    segunda_menor: '2da menor',
    segunda_mayor: '2da Mayor',
    tercera_menor: '3ra menor',
    tercera_mayor: '3ra Mayor',
    cuarta_justa: '4ta Justa',
    cuarta_aumentada: '4ta Aumentada',
    quinta_justa: '5ta Justa',
    sexta_menor: '6ta menor',
    sexta_mayor: '6ta Mayor',
    septima_menor: '7ma menor',
    septima_mayor: '7ma Mayor',
    octava_justa: '8va Justa'
};

const levels = {
    basic: {
        /*unisono: 0,*/
        segunda_mayor: 2,
        tercera_mayor: 4,
        cuarta_justa: 5,
        quinta_justa: 7
    },
    intermediate: {
        /*unisono: 0,*/
        segunda_menor: 1,
        segunda_mayor: 2,
        tercera_menor: 3,
        tercera_mayor: 4,
        cuarta_justa: 5,
        quinta_justa: 7,
        sexta_mayor: 9,
        septima_menor: 10
    },
    advanced: allIntervals
};

let currentLevel = 'basic'; // Nivel por defecto
let currentNotes = null;
let currentInterval = null;
let isPlaying = false;

function updateIntervals(level) {
    currentLevel = level;

    // Limpiar el mensaje de resultado
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = '';

    const intervalsContainer = document.querySelector('.intervals');
    intervalsContainer.innerHTML = ''; // Limpiar botones anteriores

    const levelIntervals = levels[level];
    Object.keys(levelIntervals).forEach(interval => {
        const button = document.createElement('button');
        button.className = 'interval-button';
        button.setAttribute('data-interval', interval);
        // Usar el nombre amigable si existe, sino usar el nombre original
        button.textContent = intervalNames[interval] || interval.replace(/_/g, ' ');
        button.style.flex = '1 1 150px';
        button.style.maxWidth = '200px';
        button.style.backgroundColor = '#6200ea';
        button.addEventListener('click', () => checkInterval(interval));
        intervalsContainer.appendChild(button);
    });
}

document.querySelectorAll('.level-button').forEach(button => {
    button.addEventListener('click', (e) => {
        const level = e.target.getAttribute('data-level');
        updateIntervals(level);
        document.getElementById('level-selection').classList.add('hidden');
        document.getElementById('game-interface').classList.remove('hidden');
        document.getElementById('intro').classList.add('hidden'); // Ocultar el mensaje de introducción
    });
});

function showLevelSelection() {
    document.getElementById('game-interface').classList.add('hidden');
    document.getElementById('level-selection').classList.remove('hidden');
    document.getElementById('intro').classList.remove('hidden'); // Mostrar el mensaje de introducción
}

function playNotes() {
    if (isPlaying) return; // Evita reproducir notas si ya se está reproduciendo algo
    isPlaying = true;

    // Limpiar el mensaje de resultado
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = '';

    const firstNoteIndex = Math.floor(Math.random() * notes.length);
    const firstNote = notes[firstNoteIndex];

    const levelIntervals = levels[currentLevel];
    const intervalKeys = Object.keys(levelIntervals);
    const randomIntervalKey = intervalKeys[Math.floor(Math.random() * intervalKeys.length)];
    const intervalDistance = levelIntervals[randomIntervalKey];

    // Ajuste para evitar índices fuera de rango
    const secondNoteIndex = firstNoteIndex + intervalDistance;
    if (secondNoteIndex >= notes.length) {
        isPlaying = false;
        return playNotes();  
    }

    const secondNote = notes[secondNoteIndex];

    currentNotes = { firstNote, secondNote };
    currentInterval = randomIntervalKey;

    playCurrentNotes();
}

function playCurrentNotes() {
    if (!currentNotes) {
        isPlaying = false;
        return;
    }

    // Limpiar el mensaje de resultado
    const resultDiv = document.getElementById('result');
    resultDiv.textContent = '';

    const { firstNote, secondNote } = currentNotes;

    firstNote.audio.currentTime = 0;
    secondNote.audio.currentTime = 0;

    firstNote.audio.play();
    setTimeout(() => {
        secondNote.audio.play();
        setTimeout(() => { isPlaying = false; }, 1000);
    }, 1000);
}

function repeatNotes() {
    if (isPlaying || !currentNotes) return;
    playCurrentNotes();
}

function checkInterval(selectedInterval) {
    const resultDiv = document.getElementById('result');
    if (selectedInterval === currentInterval) {
        resultDiv.textContent = '¡Correcto!';
        resultDiv.style.color = 'chartreuse';
        resultDiv.style.fontSize = '25px';
        resultDiv.style.paddingBottom = '20px';
    } else {
        resultDiv.textContent = 'Incorrecto. Inténtalo de nuevo.';
        resultDiv.style.color = 'red';
        resultDiv.style.fontSize = '25px';
        resultDiv.style.paddingBottom = '20px';
    }
}