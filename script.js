/*==================================================
NOCTIS PLAYER V2.2
PARTE 1
==================================================*/

const audio = document.getElementById("audio");

const player = document.querySelector(".player");

const play = document.getElementById("play");
const prev = document.getElementById("prev");
const next = document.getElementById("next");

const currentTimeLabel = document.getElementById("currentTime");
const durationLabel = document.getElementById("duration");

const seekbar = document.getElementById("seekbar");
const seekFill = document.getElementById("seekFill");
const seekThumb = document.getElementById("seekThumb");

const volume = document.getElementById("volume");

const bars = document.querySelectorAll(".visualizer span");

/*==================================================
TIME
==================================================*/

function formatTime(seconds){

    if(isNaN(seconds)) return "0:00";

    const m = Math.floor(seconds/60);
    const s = Math.floor(seconds%60);

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

    tryAutoplay();

});

async function tryAutoplay(){

    try{

        await audio.play();

    }catch(e){

        console.log("Autoplay bloqueado por el navegador.");

    }

}

/*==================================================
REINTENTO
==================================================*/

["pointerdown","click","touchstart","keydown"].forEach(evt=>{

    window.addEventListener(evt,()=>{

        if(audio.paused){

            audio.play().catch(()=>{});

        }

    },{once:true});

});

/*==================================================
PLAY / PAUSE
==================================================*/

play.addEventListener("click",()=>{

    if(audio.paused){

        audio.play();

    }else{

        audio.pause();

    }

});

audio.addEventListener("play",()=>{

    play.textContent="⏸";

    player.classList.add("playing");

});

audio.addEventListener("pause",()=>{

    play.textContent="▶";

    player.classList.remove("playing");

});

/*==================================================
TIME UPDATE
==================================================*/

audio.addEventListener("timeupdate",()=>{

    currentTimeLabel.textContent = formatTime(audio.currentTime);

    if(audio.duration){

        const percent = (audio.currentTime/audio.duration)*100;

        seekFill.style.width = percent+"%";

        seekThumb.style.left = percent+"%";

    }

});
/*==================================================
NOCTIS PLAYER V2.2
PARTE 2
==================================================*/

/*==============================
SEEKBAR
==============================*/

seekbar.addEventListener("click",(e)=>{

    if(!audio.duration) return;

    const rect=seekbar.getBoundingClientRect();

    const percent=(e.clientX-rect.left)/rect.width;

    audio.currentTime=percent*audio.duration;

});

/*==============================
VOLUME
==============================*/

volume.addEventListener("input",()=>{

    audio.volume=volume.value/100;

});

/*==============================
PREV
==============================*/

prev.addEventListener("click",()=>{

    audio.currentTime=0;

});

/*==============================
NEXT
==============================*/

next.addEventListener("click",()=>{

    audio.currentTime=audio.duration;

});

/*==============================
VISUALIZER
==============================*/

let visualizerLoop=null;

function randomHeight(){

    return (Math.random()*0.9)+0.15;

}

function animateBars(){

    if(audio.paused){

        bars.forEach(bar=>{

            bar.style.transform="scaleY(.15)";

            bar.style.opacity=".45";

        });

        return;

    }

    bars.forEach(bar=>{

        const h=randomHeight();

        const o=0.45+Math.random()*0.55;

        bar.style.transform=`scaleY(${h})`;

        bar.style.opacity=o;

    });

    visualizerLoop=setTimeout(

        animateBars,

        120

    );

}

audio.addEventListener("play",()=>{

    clearTimeout(visualizerLoop);

    animateBars();

});

audio.addEventListener("pause",()=>{

    clearTimeout(visualizerLoop);

    bars.forEach(bar=>{

        bar.style.transform="scaleY(.15)";

        bar.style.opacity=".45";

    });

});

/*==============================
ENDED
==============================*/

audio.addEventListener("ended",()=>{

    play.textContent="▶";

    player.classList.remove("playing");

});

/*==============================
STARTUP
==============================*/

bars.forEach(bar=>{

    bar.style.transform="scaleY(.15)";

    bar.style.opacity=".45";

});

volume.value=100;

audio.volume=1;

/*==============================
AUTOPLAY EXTRA
==============================*/

document.addEventListener("visibilitychange",()=>{

    if(

        document.visibilityState==="visible" &&

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

/*==============================
READY
==============================*/

console.log("Noctis Player V2.2 Ready");
