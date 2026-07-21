/*==================================================
NOCTIS PLAYER V5
PART 1
==================================================*/

const audio = document.getElementById("audio");

const player = document.querySelector(".player");

const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const loopBtn = document.getElementById("loop");

const currentTimeLabel = document.getElementById("currentTime");
const durationLabel = document.getElementById("duration");

const seekbar = document.getElementById("seekbar");
const seekFill = document.getElementById("seekFill");
const seekThumb = document.getElementById("seekThumb");

const volume = document.getElementById("volume");

const bars = document.querySelectorAll(".visualizer span");

/*==================================================
STATE
==================================================*/

let loopEnabled = false;

let visualizerTimer = null;

/*==================================================
TIME
==================================================*/

function formatTime(seconds){

    if(isNaN(seconds)) return "0:00";

    const m = Math.floor(seconds / 60);

    const s = Math.floor(seconds % 60);

    return `${m}:${String(s).padStart(2,"0")}`;

}

/*==================================================
LOAD
==================================================*/

audio.addEventListener("loadedmetadata",()=>{

    durationLabel.textContent = formatTime(audio.duration);

});

/*==================================================
AUTOPLAY
==================================================*/

window.addEventListener("load",()=>{

    audio.volume = 1;

    volume.value = 100;

    tryAutoplay();

});

async function tryAutoplay(){

    try{

        await audio.play();

    }

    catch(error){

        console.log("Autoplay bloqueado.");

    }

}

/*==================================================
AUTOPLAY RETRY
==================================================*/

["click","pointerdown","touchstart","keydown"].forEach(event=>{

    window.addEventListener(event,()=>{

        if(audio.paused){

            audio.play().catch(()=>{});

        }

    },{once:true});

});

/*==================================================
PLAY / PAUSE
==================================================*/

playBtn.addEventListener("click",()=>{

    if(audio.paused){

        audio.play();

    }

    else{

        audio.pause();

    }

});

audio.addEventListener("play",()=>{

    player.classList.add("playing");

    playBtn.textContent = "⏸";

});

audio.addEventListener("pause",()=>{

    player.classList.remove("playing");

    playBtn.textContent = "▶";

});

/*==================================================
PREVIOUS
==================================================*/

prevBtn.addEventListener("click",()=>{

    audio.currentTime = 0;

});

/*==================================================
NEXT
==================================================*/

nextBtn.addEventListener("click",()=>{

    audio.currentTime = audio.duration;

});

/*==================================================
LOOP
==================================================*/

loopBtn.addEventListener("click",()=>{

    loopEnabled = !loopEnabled;

    audio.loop = loopEnabled;

    loopBtn.classList.toggle("active",loopEnabled);

});
/*==================================================
TIME UPDATE
==================================================*/

audio.addEventListener("timeupdate",()=>{

    currentTimeLabel.textContent = formatTime(audio.currentTime);

    if(!audio.duration) return;

    const percent = (audio.currentTime / audio.duration) * 100;

    seekFill.style.width = percent + "%";

    seekThumb.style.left = percent + "%";

});

/*==================================================
SEEKBAR
==================================================*/

seekbar.addEventListener("click",(e)=>{

    if(!audio.duration) return;

    const rect = seekbar.getBoundingClientRect();

    const percent = (e.clientX - rect.left) / rect.width;

    audio.currentTime = percent * audio.duration;

});

/*==================================================
DRAG SEEKBAR
==================================================*/

let dragging = false;

seekThumb.addEventListener("pointerdown",()=>{

    dragging = true;

});

window.addEventListener("pointerup",()=>{

    dragging = false;

});

window.addEventListener("pointermove",(e)=>{

    if(!dragging) return;

    if(!audio.duration) return;

    const rect = seekbar.getBoundingClientRect();

    let percent = (e.clientX - rect.left) / rect.width;

    percent = Math.max(0,Math.min(1,percent));

    audio.currentTime = percent * audio.duration;

});

/*==================================================
VOLUME
==================================================*/

volume.addEventListener("input",()=>{

    audio.volume = volume.value / 100;

});

/*==================================================
VISUALIZER
==================================================*/

function randomBar(){

    return .15 + Math.random() * .85;

}

function animateBars(){

    if(audio.paused){

        bars.forEach(bar=>{

            bar.style.transform = "scaleY(.18)";

            bar.style.opacity = ".45";

        });

        return;

    }

    bars.forEach(bar=>{

        bar.style.transform = `scaleY(${randomBar()})`;

        bar.style.opacity = (.45 + Math.random() * .55);

    });

    visualizerTimer = setTimeout(

        animateBars,

        95

    );

}

audio.addEventListener("play",()=>{

    clearTimeout(visualizerTimer);

    animateBars();

});

audio.addEventListener("pause",()=>{

    clearTimeout(visualizerTimer);

});

/*==================================================
ENDED
==================================================*/

audio.addEventListener("ended",()=>{

    if(loopEnabled){

        audio.currentTime = 0;

        audio.play();

        return;

    }

    playBtn.textContent = "▶";

    player.classList.remove("playing");

});

/*==================================================
STARTUP
==================================================*/

bars.forEach(bar=>{

    bar.style.transform = "scaleY(.18)";

    bar.style.opacity = ".45";

});

audio.volume = 1;

volume.value = 100;

/*==================================================
KEEP ALIVE
==================================================*/

document.addEventListener("visibilitychange",()=>{

    if(

        document.visibilityState === "visible" &&

        audio.paused

    ){

        audio.play().catch(()=>{});

    }

});

window.addEventListener("pageshow",()=>{

    if(audio.paused){

        audio.play().catch(()=>{});

    }

});

/*==================================================
READY
==================================================*/

console.log("🎵 Noctis Player V5 Ready");
