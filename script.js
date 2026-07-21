document.addEventListener("DOMContentLoaded", () => {
    const audio = document.getElementById("audio");
    const playPauseBtn = document.getElementById("play-pause-btn");
    const playIcon = document.getElementById("play-icon");
    const repeatBtn = document.getElementById("repeat-btn");

    audio.volume = 0.6;

    // Intentar reproducción automática al cargar la página
    audio.play().then(() => {
        playIcon.classList.remove("fa-play");
        playIcon.classList.add("fa-pause");
    }).catch(error => {
        // Los navegadores modernos bloquean el autoplay con sonido si no hay interacción previa del usuario
        console.log("Autoplay bloqueado por políticas del navegador:", error);
        playIcon.classList.remove("fa-pause");
        playIcon.classList.add("fa-play");
    });

    // Control de Play / Pause
    playPauseBtn.addEventListener("click", () => {
        if (audio.paused) {
            audio.play();
            playIcon.classList.remove("fa-play");
            playIcon.classList.add("fa-pause");
        } else {
            audio.pause();
            playIcon.classList.remove("fa-pause");
            playIcon.classList.add("fa-play");
        }
    });

    // Estado inicial del botón de repetición (coincide con el atributo loop del HTML)
    if (audio.loop) {
        repeatBtn.classList.add("active");
    }

    // Control de Repetición (Loop)
    repeatBtn.addEventListener("click", () => {
        audio.loop = !audio.loop;
        if (audio.loop) {
            repeatBtn.classList.add("active");
        } else {
            repeatBtn.classList.remove("active");
        }
    });

    // Sincronizar el icono si la canción termina y no está en bucle
    audio.addEventListener("ended", () => {
        if (!audio.loop) {
            playIcon.classList.remove("fa-pause");
            playIcon.classList.add("fa-play");
        }
    });
});
