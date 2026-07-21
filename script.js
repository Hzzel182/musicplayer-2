const audio = document.getElementById("audio");

const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

const current = document.getElementById("current");
const duration = document.getElementById("duration");

const progress = document.getElementById("progress");
const progressFill = document.getElementById("progressFill");

const volume = document.getElementById("volume");

const canvas = document.getElementById("visualizer");
const ctx = canvas.getContext("2d");

const player = document.querySelector(".player");

let audioContext;
let analyser;
let source;
let dataArray;
let animationId;

function format(seconds){

    if(isNaN(seconds)) return "0:00";

    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);

    return `${min}:${sec.toString().padStart(2,"0")}`;

}

audio.addEventListener("loadedmetadata",()=>{

    duration.textContent = format(audio.duration);

});

audio.addEventListener("timeupdate",()=>{

    current.textContent = format(audio.currentTime);

    const percent = (audio.currentTime / audio.duration) * 100;

    progressFill.style.width = percent + "%";

});

progress.addEventListener("click",(e)=>{

    const rect = progress.getBoundingClientRect();

    const x = e.clientX - rect.left;

    const percent = x / rect.width;

    audio.currentTime = percent * audio.duration;

});

volume.addEventListener("input",()=>{

    audio.volume = volume.value / 100;

});

playBtn.addEventListener("click",togglePlay);

function togglePlay(){

    if(audio.paused){

        audio.play();

        playBtn.textContent = "⏸";

        player.classList.add("playing");

        if(!audioContext){

            setupVisualizer();

        }

        draw();

    }else{

        audio.pause();

        playBtn.textContent = "▶";

        player.classList.remove("playing");

        cancelAnimationFrame(animationId);

    }

}

audio.addEventListener("ended",()=>{

    playBtn.textContent = "▶";

    player.classList.remove("playing");

    cancelAnimationFrame(animationId);

});

prevBtn.addEventListener("click",()=>{

    audio.currentTime = 0;

});

nextBtn.addEventListener("click",()=>{

    audio.currentTime = audio.duration;

});

function setupVisualizer(){

    audioContext = new AudioContext();

    source = audioContext.createMediaElementSource(audio);

    analyser = audioContext.createAnalyser();

    analyser.fftSize = 128;

    source.connect(analyser);

    analyser.connect(audioContext.destination);

    dataArray = new Uint8Array(analyser.frequencyBinCount);

}

function resizeCanvas(){

    canvas.width = canvas.clientWidth;

    canvas.height = canvas.clientHeight;

}

window.addEventListener("resize",resizeCanvas);

resizeCanvas();

function draw(){

    animationId = requestAnimationFrame(draw);

    analyser.getByteFrequencyData(dataArray);

    ctx.clearRect(0,0,canvas.width,canvas.height);

    const bars = dataArray.length;

    const gap = 3;

    const width = (canvas.width / bars) - gap;

    let x = 0;

    for(let i=0;i<bars;i++){

        const value = dataArray[i] / 255;

        const h = value * canvas.height;

        ctx.fillStyle = "rgba(255,255,255,.9)";

        ctx.fillRect(

            x,

            canvas.height - h,

            width,

            h

        );

        x += width + gap;

    }

}
