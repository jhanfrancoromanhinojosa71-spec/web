// ======================================================
// PREGUNTAS DE CADA NIVEL
// ======================================================

const niveles = [

    // ==========================
    // NIVEL 1 - SUMAS
    // ==========================
    [
        { p: "5 + 3", r: 8 },
        { p: "10 + 4", r: 14 },
        { p: "7 + 2", r: 9 },
        { p: "9 + 5", r: 14 },
        { p: "6 + 6", r: 12 }
    ],

    // ==========================
    // NIVEL 2 - RESTAS
    // ==========================
    [
        { p: "10 - 4", r: 6 },
        { p: "15 - 5", r: 10 },
        { p: "20 - 8", r: 12 },
        { p: "18 - 9", r: 9 },
        { p: "30 - 10", r: 20 }
    ],

    // ==========================
    // NIVEL 3 - MULTIPLICACIONES
    // ==========================
    [
        { p: "2 × 3", r: 6 },
        { p: "4 × 2", r: 8 },
        { p: "3 × 3", r: 9 },
        { p: "5 × 4", r: 20 },
        { p: "6 × 5", r: 30 }
    ]

];


// ======================================================
// VARIABLES DEL JUEGO
// ======================================================

let nivelActual = 0;
let preguntas = niveles[nivelActual];

let vidas = 3;
let puntos = 0;
let actual = 0;

let x = 50;
let salto = false;


// ======================================================
// ELEMENTOS HTML
// ======================================================

const mario = document.getElementById("mario");

const musicaMenu = document.getElementById("musicaMenu");
const musicaJuego = document.getElementById("musicaJuego");
const musicaGameOver = document.getElementById("musicaGameOver");
const musicaNivel = document.getElementById("musicaNivel");
const musicaFinal = document.getElementById("musicaFinal");

const sonidoSalto = document.getElementById("sonidoSalto");
const sonidoCorrecto = document.getElementById("sonidoCorrecto");
const sonidoIncorrecto = document.getElementById("sonidoIncorrecto");
const sonidoBloque = document.getElementById("sonidoBloque");


// ======================================================
// INICIAR JUEGO
// ======================================================

function iniciarJuego() {

    document.getElementById("menuInicio").style.display = "none";

    document.getElementById("juegoCompleto").style.display = "block";

    musicaMenu.pause();
    musicaMenu.currentTime = 0;

    musicaJuego.currentTime = 0;
    musicaJuego.play().catch(() => {});

    nuevaPregunta();
}


// ======================================================
// NUEVA PREGUNTA
// ======================================================

function nuevaPregunta() {

    if (actual >= preguntas.length) {

        completarNivel();

        return;
    }


    let p = preguntas[actual];

    document.getElementById("pregunta").innerHTML = p.p;


    // Crear respuestas
    let respuestas = [p.r];

    while (respuestas.length < 3) {

        let n =
            p.r +
            Math.floor(Math.random() * 9) -
            4;

        if (
            n > 0 &&
            !respuestas.includes(n)
        ) {
            respuestas.push(n);
        }
    }


    // Mezclar respuestas
    respuestas.sort(
        () => Math.random() - 0.5
    );


    document.getElementById("b1").innerHTML =
        respuestas[0];

    document.getElementById("b2").innerHTML =
        respuestas[1];

    document.getElementById("b3").innerHTML =
        respuestas[2];
}


// ======================================================
// MOVIMIENTO DE MARIO
// ======================================================

document.addEventListener("keydown", function(e) {

    if (
        document.getElementById("juegoCompleto").style.display === "none"
    ) {
        return;
    }


    if (
        e.key === "ArrowRight" &&
        x < 1000
    ) {
        x += 20;
    }


    if (
        e.key === "ArrowLeft" &&
        x > 10
    ) {
        x -= 20;
    }


    if (
        e.code === "Space" &&
        !salto
    ) {

        saltar();
    }


    mario.style.left = x + "px";

});


// ======================================================
// SALTO
// ======================================================

function saltar() {

    sonidoSalto.currentTime = 0;

    sonidoSalto.play().catch(() => {});


    salto = true;

    let h = 0;


    let subir = setInterval(() => {

        h += 15;

        mario.style.bottom =
            h + "px";


        if (h >= 140) {

            clearInterval(subir);

            golpear();


            let bajar = setInterval(() => {

                h -= 15;

                mario.style.bottom =
                    h + "px";


                if (h <= 0) {

                    clearInterval(bajar);

                    salto = false;

                }

            }, 20);
        }

    }, 20);
}


// ======================================================
// GOLPEAR BLOQUE
// ======================================================

function golpear() {

    const bloques =
        document.querySelectorAll(".bloque");


    bloques.forEach(b => {

        let bx = b.offsetLeft;


        if (
            x + 40 > bx &&
            x < bx + 80
        ) {

            let respuesta =
                parseInt(b.innerHTML);


            if (
                respuesta === preguntas[actual].r
            ) {

                // CORRECTO
                sonidoCorrecto.currentTime = 0;
                sonidoCorrecto.play().catch(() => {});


                sonidoBloque.currentTime = 0;
                sonidoBloque.play().catch(() => {});


                puntos += 10;

                document.getElementById("puntos").innerHTML =
                    puntos;


                actual++;


                nuevaPregunta();

            } else {

                // INCORRECTO
                perderVida();

            }

        }

    });
}


// ======================================================
// PERDER VIDA
// ======================================================

function perderVida() {

    sonidoIncorrecto.currentTime = 0;

    sonidoIncorrecto.play().catch(() => {});


    vidas--;

    document.getElementById("vidas").innerHTML =
        vidas;


    if (vidas <= 0) {

        terminarJuego();

    }

}


// ======================================================
// NIVEL COMPLETADO
// ======================================================

function completarNivel() {

    musicaJuego.pause();

    musicaNivel.currentTime = 0;

    musicaNivel.play().catch(() => {});


    document.getElementById("juegoCompleto")
        .style.display = "none";


    document.getElementById("nivelCompletado")
        .style.display = "flex";


    document.getElementById("mensajeNivel")
        .innerHTML =
        "¡Terminaste el Nivel " +
        (nivelActual + 1) +
        "!";

}


// ======================================================
// SIGUIENTE NIVEL
// ======================================================

function siguienteNivel() {

    musicaNivel.pause();

    musicaNivel.currentTime = 0;


    nivelActual++;


    // Si todavía quedan niveles
    if (
        nivelActual < niveles.length
    ) {

        preguntas =
            niveles[nivelActual];

        actual = 0;

        vidas = 3;


        document.getElementById("vidas")
            .innerHTML = vidas;


        document.getElementById("nivel")
            .innerHTML =
            nivelActual + 1;


        document.getElementById("nivelCompletado")
            .style.display = "none";


        document.getElementById("juegoCompleto")
            .style.display = "block";


        musicaJuego.currentTime = 0;

        musicaJuego.play().catch(() => {});


        nuevaPregunta();

    } else {

        terminarJuegoCompleto();

    }

}


// ======================================================
// GAME OVER
// ======================================================

function terminarJuego() {

    musicaJuego.pause();


    musicaGameOver.currentTime = 0;

    musicaGameOver.play().catch(() => {});


    document.getElementById("juegoCompleto")
        .style.display = "none";


    document.getElementById("gameOver")
        .style.display = "flex";

}


// ======================================================
// FINAL DEL JUEGO
// ======================================================

function terminarJuegoCompleto() {

    musicaJuego.pause();

    musicaFinal.currentTime = 0;

    musicaFinal.play().catch(() => {});


    document.getElementById("juegoCompleto")
        .style.display = "none";


    document.getElementById("finalJuego")
        .style.display = "flex";


    document.getElementById("puntosFinales")
        .innerHTML =
        "⭐ Puntos finales: " +
        puntos;

}


// ======================================================
// REINICIAR
// ======================================================

function reiniciarJuego() {
    location.reload();
}


// ==========================================
// CONTINUAR DESDE EL NIVEL DONDE PERDIÓ
// ==========================================

function continuarDesdeNivel() {

    // Recupera las preguntas del nivel actual
    preguntas = niveles[nivelActual];

    // Reinicia las vidas
    vidas = 3;

    document.getElementById("vidas").innerHTML = vidas;

    // Empieza nuevamente las preguntas de ESE nivel
    actual = 0;

    // Coloca nuevamente a Mario al inicio del escenario
    x = 50;
    mario.style.left = x + "px";
    mario.style.bottom = "0px";

    // Oculta Game Over
    document.getElementById("gameOver").style.display = "none";

    // Muestra nuevamente el juego
    document.getElementById("juegoCompleto").style.display = "block";

    // Detiene música de Game Over
    musicaGameOver.pause();
    musicaGameOver.currentTime = 0;

    // Vuelve a poner música del juego
    musicaJuego.currentTime = 0;
    musicaJuego.play().catch(() => {});

    // Muestra una pregunta del mismo nivel
    nuevaPregunta();
}

// ======================================================
// RETO DE LA PRINCESA
// ======================================================

let respuestaPrincesaCorrecta = 0;


function preguntarPrincesa() {

    let num1 =
        Math.floor(Math.random() * 10) + 1;

    let num2 =
        Math.floor(Math.random() * 10) + 1;


    respuestaPrincesaCorrecta =
        num1 + num2;


    document.getElementById(
        "pregunta-princesa"
    ).innerHTML =
        `¿Cuánto es ${num1} + ${num2}? 
        Premio: 20 puntos`;


    document.getElementById(
        "modal-princesa"
    ).style.display = "flex";

}


function verificarRespuestaPrincesa() {

    let respuestaUsuario =
        parseInt(
            document.getElementById(
                "respuesta-princesa"
            ).value
        );


    if (
        respuestaUsuario ===
        respuestaPrincesaCorrecta
    ) {

        puntos += 20;


        document.getElementById("puntos")
            .innerHTML = puntos;


        alert(
            "🎉 ¡Correcto! +20 puntos"
        );

    } else {

        alert(
            "❌ Incorrecto. Era " +
            respuestaPrincesaCorrecta
        );

    }


    document.getElementById(
        "modal-princesa"
    ).style.display = "none";


    document.getElementById(
        "respuesta-princesa"
    ).value = "";

}


// ======================================================
// MÚSICA DEL MENÚ
// ======================================================

// Intenta iniciar la música del menú
// cuando el usuario toca la página.

document.addEventListener(
    "click",
    function iniciarMusicaMenu() {

        if (
            document.getElementById(
                "menuInicio"
            ).style.display !== "none"
        ) {

            musicaMenu.play().catch(() => {});

        }

    },
    { once: true }
);