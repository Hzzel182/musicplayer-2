/*==================================================
NOCTIS PLAYER V2.1
PARTE 1
==================================================*/

const audio=document.getElementById("audio");

const player=document.querySelector(".player");

const play=document.getElementById("play");
const prev=document.getElementById("prev");
const next=document.getElementById("next");

const currentTimeLabel=document.getElementById("currentTime");
const durationLabel=document.getElementById("duration");

const seekbar=document.getElementById("seekbar");
const seekFill=document.getElementById("seekFill");
const seekThumb=document.getElementById("seekThumb");

const volume=document.getElementById("volume");

const cover=document.getElementById("cover");

const canvas=document.getElementById("visualizer");
const ctx=canvas.getContext("2d");

let audioContext=null;
let analyser=null;
let source=null;
let frequencyData=null;

let animationFrame=null;

let started=false;

/*==================================================
CANVAS
==================================================*/

function resizeCanvas(){

    canvas.width=canvas.clientWidth;

    canvas.height=canvas.clientHeight;

}

window.addEventListener("resize",resizeCanvas);

resizeCanvas();

/*==================================================
TIME FORMAT
==================================================*/

function formatTime(seconds){

    if(isNaN(seconds)) return "0:00";

    const m=Math.floor(seconds/60);

    const s=Math.floor(seconds%60);

    return `${m}:${String(s).padStart(2,"0")}`;

}

/*==================================================
LOAD
==================================================*/

audio.addEventListener("loadedmetadata",()=>{

    durationLabel.textContent=formatTime(audio.duration);

});

/*==================================================
AUTOPLAY
==================================================*/

window.addEventListener("load",()=>{

    audio.volume=1;

    audio.preload="auto";

    attemptAutoplay();

});

async function attemptAutoplay(){

    try{

        await audio.play();

        onPlay();

    }

    catch(e){

        console.log("Autoplay bloqueado");

    }

}

/*==================================================
USER INTERACTION
==================================================*/

["click","touchstart","keydown"].forEach(event=>{

    window.addEventListener(event,()=>{

        if(audio.paused){

            attemptAutoplay();

        }

    },{once:true});

});

/*==================================================
PLAY BUTTON
==================================================*/

play.addEventListener("click",()=>{

    if(audio.paused){

        audio.play();

        onPlay();

    }else{

        audio.pause();

        onPause();

    }

});

/*==================================================
PLAY
==================================================*/

function onPlay(){

    play.textContent="⏸";

    player.classList.add("playing");

    if(!started){

        setupAudio();

        started=true;

    }

    renderVisualizer();

}

/*==================================================
PAUSE
==================================================*/

function onPause(){

    play.textContent="▶";

    player.classList.remove("playing");

    cancelAnimationFrame(animationFrame);

}

audio.addEventListener("pause",onPause);

audio.addEventListener("ended",onPause);
/*==================================================
SETUP AUDIO
==================================================*/

function setupAudio(){

    audioContext=new (window.AudioContext||window.webkitAudioContext)();

    source=audioContext.createMediaElementSource(audio);

    analyser=audioContext.createAnalyser();

    analyser.fftSize=256;

    source.connect(analyser);

    analyser.connect(audioContext.destination);

    frequencyData=new Uint8Array(analyser.frequencyBinCount);

}

/*==================================================
TIME UPDATE
==================================================*/

audio.addEventListener("timeupdate",()=>{

    currentTimeLabel.textContent=formatTime(audio.currentTime);

    if(audio.duration){

        const percent=(audio.currentTime/audio.duration)*100;

        seekFill.style.width=percent+"%";

        seekThumb.style.left=percent+"%";

    }

});

/*==================================================
SEEKBAR
==================================================*/

seekbar.addEventListener("click",(e)=>{

    if(!audio.duration) return;

    const rect=seekbar.getBoundingClientRect();

    const percent=(e.clientX-rect.left)/rect.width;

    audio.currentTime=percent*audio.duration;

});

/*==================================================
PREVIOUS / NEXT
==================================================*/

prev.addEventListener("click",()=>{

    audio.currentTime=0;

});

next.addEventListener("click",()=>{

    audio.currentTime=audio.duration;

});

/*==================================================
VOLUME
==================================================*/

volume.addEventListener("input",()=>{

    audio.volume=volume.value/100;

});

/*==================================================
VISUALIZER
==================================================*/

function renderVisualizer(){

    if(audio.paused) return;

    animationFrame=requestAnimationFrame(renderVisualizer);

    analyser.getByteFrequencyData(frequencyData);

    ctx.clearRect(0,0,canvas.width,canvas.height);

    const bars=48;

    const spacing=4;

    const barWidth=(canvas.width-(bars-1)*spacing)/bars;

    for(let i=0;i<bars;i++){

        const value=frequencyData[i]/255;

        const height=Math.max(4,value*canvas.height);

        const x=i*(barWidth+spacing);

        const y=canvas.height-height;

        const gradient=ctx.createLinearGradient(

            0,

            y,

            0,

            canvas.height

        );

        gradient.addColorStop(0,"rgba(255,255,255,.95)");

        gradient.addColorStop(.5,"rgba(255,255,255,.70)");

        gradient.addColorStop(1,"rgba(255,255,255,.20)");

        ctx.fillStyle=gradient;

        roundRect(

            x,

            y,

            barWidth,

            height,

            4

        );

    }

}

/*==================================================
ROUNDED BAR
==================================================*/

function roundRect(x,y,w,h,r){

    ctx.beginPath();

    ctx.moveTo(x+r,y);

    ctx.arcTo(x+w,y,x+w,y+h,r);

    ctx.arcTo(x+w,y+h,x,y+h,r);

    ctx.arcTo(x,y+h,x,y,r);

    ctx.arcTo(x,y,x+w,y,r);

    ctx.closePath();

    ctx.fill();

}
