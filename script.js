const audio = document.getElementById("audio");

const playBtn = document.getElementById("play");
const playIcon = document.getElementById("playIcon");

const progress = document.querySelector(".progress");
const progressFill = document.querySelector(".progress-fill");
const progressDot = document.querySelector(".progress-dot");

const current = document.getElementById("current");
const duration = document.getElementById("duration");

const volume = document.getElementById("volume");

function formatTime(seconds){

    if(isNaN(seconds)) return "0:00";

    const min = Math.floor(seconds/60);
    const sec = Math.floor(seconds%60);

    return `${min}:${sec.toString().padStart(2,"0")}`;

}

audio.addEventListener("loadedmetadata",()=>{

    duration.textContent=formatTime(audio.duration);

});

playBtn.addEventListener("click",()=>{

    if(audio.paused){

        audio.play();

    }else{

        audio.pause();

    }

});

audio.addEventListener("play",()=>{

    playIcon.innerHTML=`
    <path d="M6 5h4v14H6zM14 5h4v14h-4z"/>
    `;

});

audio.addEventListener("pause",()=>{

    playIcon.innerHTML=`
    <path d="M8 5v14l11-7z"/>
    `;

});

audio.addEventListener("timeupdate",()=>{

    current.textContent=formatTime(audio.currentTime);

    const percent=(audio.currentTime/audio.duration)*100||0;

    progressFill.style.width=percent+"%";

    progressDot.style.left=percent+"%";

});

progress.addEventListener("click",(e)=>{

    const rect=progress.getBoundingClientRect();

    const x=e.clientX-rect.left;

    const percent=x/rect.width;

    audio.currentTime=percent*audio.duration;

});

volume.addEventListener("input",()=>{

    audio.volume=volume.value/100;

});

audio.volume=1;
