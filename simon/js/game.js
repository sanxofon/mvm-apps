const juego = () => {
    const sleep = m => new Promise(r => setTimeout(r, m));

    var sonidoError = new Howl({
        src: ['0.mp3']
    });

    var sonidoSuperiorIzquierda = new Howl({
        src: ['1.mp3']
    });
    var sonidoSuperiorDerecha = new Howl({
        src: ['2.mp3']
    });
    var sonidoInferiorIzquierda = new Howl({
        src: ['3.mp3']
    });
    var sonidoInferiorDerecha = new Howl({
        src: ['4.mp3']
    });

    /* const cargarSonido = function (fuente) {
        const sonido = document.createElement("audio");
        sonido.src = fuente;
        sonido.setAttribute("preload", "auto");
        sonido.setAttribute("controls", "none");
        sonido.style.display = "none";
        document.body.appendChild(sonido);
        return sonido;
    } */
    const partidoEn16 = (Math.PI * 2) / 16;
    const centroX = 200, centroY = 200;
    const radioCirculo = 200;
    const radioCuarto = 170;
    const radioCirculoCentral = 80;
    const distancia = 10;
    const gamma = 2;
    const milisegundosCpu = 200,
        milisegundosUsuario = 100;
    /* const sonidoSuperiorIzquierda = cargarSonido("1.mp3"),
        sonidoSuperiorDerecha = cargarSonido("2.mp3"),
        sonidoInferiorIzquierda = cargarSonido("3.mp3"),
        sonidoInferiorDerecha = cargarSonido("4.mp3"); */

    let puedeJugar = false;
    let contador = 0;
    let puntaje = 0;
    let secuencia = [];

    const verde = d3.color("#1B5E20"),
        rojo = d3.color("#B71C1C"),
        amarillo = d3.color("#F9A825"),
        azul = d3.color("#0D47A1"),
        negro = d3.color("#212121");


    const circuloFondo = d3.arc()
        .innerRadius(0)
        .outerRadius(radioCirculo)
        .startAngle(0)
        .endAngle(Math.PI * 2);

    const circuloCentral = d3.arc()
        .innerRadius(0)
        .outerRadius(radioCirculoCentral)
        .startAngle(0)
        .endAngle(Math.PI * 2);

    const $svg = d3.select("#contenedorJuego")
        .append("svg")
        .attr('width', 300)
        .attr('height', 300)
        .attr('viewBox','0 0 400 400');

    $svg.append("g")
        .attr("transform", `translate(${centroX},${centroY})`)
        .append("path")
        .attr("d", circuloFondo)
        .attr("fill", negro);


    const superiorIzquierda = $svg.append("g")
        .attr("transform", `translate(${centroX - distancia},${centroY - distancia})`)
        .attr("class", "boton")
        .append("path")
        .attr("d",
            d3.arc()
                .innerRadius(0)
                .outerRadius(radioCuarto)
                .startAngle(partidoEn16 * 12)
                .endAngle(partidoEn16 * 16)
        )
        .attr("fill", verde);


    const superiorDerecha = $svg.append("g")
        .attr("transform", `translate(${centroX + distancia},${centroY - distancia})`)
        .attr("class", "boton")
        .append("path")
        .attr("d",
            d3.arc()
                .innerRadius(0)
                .outerRadius(radioCuarto)
                .startAngle(0)
                .endAngle(partidoEn16 * 4)
        )
        .attr("fill", rojo);
    const inferiorIzquierda = $svg.append("g")
        .attr("transform", `translate(${centroX - distancia},${centroY + distancia})`)
        .attr("class", "boton")
        .append("path")
        .attr("d",
            d3.arc()
                .innerRadius(0)
                .outerRadius(radioCuarto)
                .startAngle(partidoEn16 * 8)
                .endAngle(partidoEn16 * 12)
        )
        .attr("fill", amarillo);

    const inferiorDerecha = $svg.append("g")
        .attr("transform", `translate(${centroX + distancia},${centroY + distancia})`)
        .attr("class", "boton")
        .append("path")
        .attr("d",
            d3.arc()
                .innerRadius(0)
                .outerRadius(radioCuarto)
                .startAngle(partidoEn16 * 4)
                .endAngle(partidoEn16 * 8)
        )
        .attr("fill", azul);

    // Encima de los otros círculos, el círculo central
    $svg.append("g")
        .attr("transform", `translate(${centroX},${centroY})`)
        .append("path")
        .attr("d", circuloCentral)
        .attr("fill", negro);

    const textoPuntaje = $svg.append("text")
        .attr("transform", `translate(${centroX},${centroY})`)
        .attr("fill", "#ffffff")
        .attr("font-size", 30)
        .attr("font-weight", "bold")
        .attr("font-family", "Courier")
        .style("text-anchor", "middle")
        .style("dominant-baseline", "central")
        .text("0")
    const encenderYApagarBoton = async (boton, duracion, error=0) => {
        puedeJugar = false;
        const colorActual = boton.attr("fill");
        let sonidoQueSeReproduce;
        if(error>0) {
            sonidoQueSeReproduce = sonidoError;
        } else if (compararBotones(boton, superiorIzquierda)) {
            sonidoQueSeReproduce = sonidoSuperiorIzquierda;
        } else if (compararBotones(boton, superiorDerecha)) {
            sonidoQueSeReproduce = sonidoSuperiorDerecha;
        } else if (compararBotones(boton, inferiorIzquierda)) {
            sonidoQueSeReproduce = sonidoInferiorIzquierda
        } else {
            sonidoQueSeReproduce = sonidoInferiorDerecha;
        }
        sonidoQueSeReproduce.pos=0;
        await sonidoQueSeReproduce.play();
        boton.attr("fill", d3.color(colorActual).brighter(gamma))
        await sleep(duracion);
        boton.attr("fill", d3.color(colorActual));
        await sleep(duracion);
        await sonidoQueSeReproduce.pause();
        puedeJugar = true;
    };
    const reproducirSecuencia = async secuencia => {
        for (const boton of secuencia) {
            await encenderYApagarBoton(boton, milisegundosCpu);
        }
    };
    const reproducirSecuenciaConRuido = async secuencia => {
        const noise = parseInt(document.getElementById('noise').value); // Porcentaje de errores
        for (const boton of secuencia) {
            const gremlin = Math.floor(Math.random()*100);
            if(gremlin<=noise) {
                await encenderYApagarBoton(aleatorioDeArreglo(botones), milisegundosCpu);
            }else{
                await encenderYApagarBoton(boton, milisegundosCpu);
            }
        }
    };
    const botones = [superiorIzquierda, superiorDerecha, inferiorIzquierda, inferiorDerecha];
    const aleatorioDeArreglo = arreglo => arreglo[Math.floor(Math.random() * arreglo.length)];
    const agregarBotonAleatorioASecuencia = secuencia => secuencia.push(aleatorioDeArreglo(botones));
    const compararBotones = (boton, otroBoton) => {
        return boton.attr("fill") === otroBoton.attr("fill");
    };
    const compararSecuenciaDeUsuarioConOriginal = (secuenciaOriginal, botonDeUsuario, indice) => {
        return compararBotones(secuenciaOriginal[indice], botonDeUsuario);
    };
    const refrescarPuntaje = puntaje => textoPuntaje.text(puntaje.toString());
    const reiniciar = () => {
        secuencia = [];
        puedeJugar = false;
        contador = puntaje = 0;
        refrescarPuntaje(puntaje);
    }

    botones.forEach(boton => {
        boton.on("click", async () => {
            if (!puedeJugar) {
                console.log("No puedes jugar ._.");
                return;
            }
            puedeJugar = false;
            const ok = compararSecuenciaDeUsuarioConOriginal(secuencia, boton, contador);
            if (ok) {
                await encenderYApagarBoton(boton, milisegundosUsuario);
                if (contador >= secuencia.length - 1) {
                    puntaje++;
                    refrescarPuntaje(puntaje);
                    await sleep(500);
                    await turnoDelCpu();
                } else {
                    contador++;
                }
                puedeJugar = true;
            } else {
                await encenderYApagarBoton(boton, milisegundosUsuario*3, 1); // True = Error
                await sleep(500);
                await repiteTurnoDelCpu();
                // puedeJugar = true;
                // $btnComenzar.disabled = false;
                // Swal.fire("Perdiste", `Has perdido. Tu puntuación fue de ${puntaje}. Puedes jugar de nuevo cuando quieras`);
            }
        });
    });

    const repiteTurnoDelCpu = async () => {
        puedeJugar = false;
        await reproducirSecuenciaConRuido(secuencia);
        contador = 0;
        puedeJugar = true;
    }

    const turnoDelCpu = async () => {
        puedeJugar = false;
        agregarBotonAleatorioASecuencia(secuencia);
        await reproducirSecuenciaConRuido(secuencia);
        contador = 0;
        puedeJugar = true;
    }

    const $btnComenzar = document.querySelector("#comenzar");
    $btnComenzar.addEventListener("click", () => {
        $btnComenzar.disabled = true;
        reiniciar();
        turnoDelCpu();
    });
}
Swal.fire("Bienvenido", `Comienza a jugar, mira la secuencia e imítala (cuando hagas clic, espera a que el botón se apague para hacer el siguiente clic).
<br>
<br>
    Ganas cuando se desborde la memoria del programa u ocurra un fallo, aunque probablemente pierdas antes de que eso ocurra.`)
    .then(juego)
