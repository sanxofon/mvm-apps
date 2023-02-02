/*
Kaleidoscopio del Museo Virtual de Matemáticas (México)
!@license Copyright 2022, Santiago Chávez Novaro, License: MIT, see https://github.com/sanxofon/mvm
*/
const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
});
let md = new MobileDetect(window.navigator.userAgent); // mobile-detect.min.js
let p=0.0,w=0,h=0; // Proporción, Ancho, Alto
let cWidth=0,cHeight=0; // Ancho y alto del Canvas

let sp = 0; // Current stepper
let step = 0; // Current display step
let maxstep = 8*5; // Max steps 
let stepspeed = 1; // Step speed

let vWidth=0, vHeight=0; // Video width & height
const zooms = [240,360,480,600,720]; // Lista de zooms permitidos
let sc=0; // Switchcam
let capture; // Camera capture global
let mascara; // Mask global
let st, sti=0; // Set time interval globals
let fc; // Frame Count Dom Element
let fr=0; // Frame Rate
let originx=0, originy=0;// Posición de origens, p. ej. el centro del canvas
let lista=[],jumpthis=[]; // Lista de posiciones y Lista de índices
let filtro = 0; // ïndice del filtro actual
let filtros = []; // Filtros disponibles (se llena en setup)
let ti = true; // Timer de 3 segundos antes de la foto

// Record as MP4
let encoder;
let numFrames = 30; // num of frames to record (10-100 definido en HTML)
let recording = false;
let recordedFrames = 0;

function preload() {
    HME.createH264MP4Encoder().then(enc => {
        encoder = enc
        encoder.outputFilename = 'test'
        encoder.width = cWidth
        encoder.height = cHeight
        encoder.frameRate = fr
        encoder.kbps = 50000 // video quality
        encoder.groupOfPictures = 10 // lower if you have fast actions.
        encoder.initialize()
    })
}

// Opciones del capture de la cámara del usuario
isSC = [
    {
        video: {
            optional: [{ maxFrameRate: 5 }]
        },
        audio: false
    },
    {
        video: {
            facingMode: {
                exact: "environment"
            }
        },
        audio: false
    }
];
let algoritmo;
if(params.a=='t'){algoritmo = 'test';} // Tipo de algoritmo
else if(params.a=='a'){algoritmo = 'agua';} // Tipo de algoritmo
else if(params.a=='e'){algoritmo = 'espejo';} // Tipo de algoritmo
else{algoritmo = 'kaleidoscopio';}
// ------------------------------------------

// FUNCIONES
function setup() {
    // MP4 record
    if (getItem('nf')!=null)numFrames=parseInt(getItem('nf'));
    if(numFrames<10)numFrames=10;
    else if(numFrames>100)numFrames=100;
    document.getElementById('nf').value = numFrames;
    
    if (getItem('ti')===true)ti=true;
    else ti=false;
    document.getElementById('ti').checked=ti;

    // Filtros disponibles. Se llenan con constantes definidas hasta el setup
    filtros = [
        '',
        THRESHOLD,
        GRAY,
        INVERT,
        // OPAQUE,
        // DILATE,
        // ERODE
    ];

    if (md.mobile()) {
        document.getElementById('bSwitch').style.display='inline';
    }

    if (getItem('fr')==null) changeFrameRate(5); // // Estaba seteada la velocidad del cuadro (frame rate)? Si no, está la default=5
    else changeFrameRate(getItem('fr'));

    sc = getItem('sc'); // Estaba switcheada la cámara?
    if (sc==null) sc = 0; // Si no, está la default=0

    vWidth = getItem('vw'); // Estaba guardado el zoom?
    if (vWidth==null || !zooms.includes(vWidth)) vWidth=480; // Valor default de Video Width: (240, 360, 480, 600)
    vHeight = Math.floor(vWidth*0.75); // Calcula Video Height (4:3)
    document.getElementById('zo').value = vWidth; // Cambia el valor del elemento en el dom

    if (algoritmo=='test') {
        p = 1; // Proporción: .86602540378 aprox
        w = 522; // Ancho de la máscara
        h = Math.ceil(p * w); // Alto de la máscara
        cWidth = 522; // Canvas Width (zoom actual)
        cHeight = 522; // Canvas Height
        // Posición origen, pone el primer hexágono bien al medio
        originx = cWidth/2;
        originy = cHeight/2;
    } else if (algoritmo=='espejo') {
        p = 2; // Proporción: .86602540378 aprox
        w = 261; // Ancho de la máscara
        h = Math.ceil(p * w); // Alto de la máscara
        cWidth = 522; // Canvas Width (zoom actual)
        cHeight = 522; // Canvas Height
        // Posición origen, pone el primer hexágono bien al medio
        originx = cWidth/2;
        originy = cHeight/2;
    } else if (algoritmo=='agua') {
        p = 0.5; // Proporción: .86602540378 aprox
        w = 522; // Ancho de la máscara
        h = Math.ceil(p * w); // Alto de la máscara
        cWidth = 522; // Canvas Width (zoom actual)
        cHeight = 522; // Canvas Height
        // Posición origen, pone el primer hexágono bien al medio
        originx = cWidth/2;
        originy = cHeight/2;
    } else {
        p = Math.sqrt(3)/2; // Proporción: .86602540378 aprox
        w = 200; // Ancho de la máscara
        h = Math.ceil(p * w); // Alto de la máscara
        cWidth = 522; //h*3; // Canvas Width (zoom actual)
        cHeight = 522; //h*3; // Canvas Height
        // Posición origen, pone el primer hexágono bien al medio
        originx = cWidth/2;
        originy = cHeight*2/3;
        // Lista de posiciones de los 7 hexágonos que llenan el cuadro
        lista = [
            [0,0],          // Centro
            [0,h*2-2],      // Abajo
            [-w*3/2,h-2],   // Abajo a la izquierda
            [-w*3/2,-h],    // Arriba a la izquierda
            [0,-h*2+2],     // Arriba
            [w*3/2,-h],     // Arriba a la derecha
            [w*3/2,h-2],    // Abajo a la derecha
        ];
        // Lista de índices de triángulos que NO se ven en el cuadro y que no es necesario pintar 
        jumpthis = [6,10,11,15,16,21,22,25,26,27,30,31,36];
    }

    cnv = createCanvas(cWidth, cHeight); // Crea el lienzo
    cnv.parent('contenedor'); // dentro del contenedor
    capture = createCapture(isSC[sc]); // Crea la captura de la cámara (muestra la ventana de la cámara en vivo)
    capture.size(vWidth, vHeight); // de ancho y alto
    capture.hide(); // y oculta la ventana de la cámara en vivo

    // Guarda los datos en el almacenamiento local (localstorage)
    storeItem('vw', vWidth);
    storeItem('sc', sc);
    storeItem('fr', fr);
    storeItem('nf', numFrames);
    storeItem('ti', ti);
    
    // Establece objetos para un acceso dom rápido 
    // fc = document.getElementById('frameCount');

    //crea una mask de una porción de la imagen original de la captura de video.
    mascara = createGraphics(w, h); //crea un renderizador fuera de pantalla
    // mascara.noStroke();
    mascara.beginShape();
    if (algoritmo=='test') {
        zoom(720);
        mascara.rect(0, 0, w, h); // agregando un poco más para ocultar los bordes
    } else if (algoritmo=='espejo') {
        zoom(720);
        mascara.rect(0, 0, w, h); // agregando un poco más para ocultar los bordes
    } else if (algoritmo=='agua') {
        zoom(600);
        mascara.rect(0, 0, w, h); // agregando un poco más para ocultar los bordes
    } else {
        mascara.triangle(w/2, 0, 0, h, w, h); // agregando un poco más para ocultar los bordes
    }
}
function draw() {
    if (capture.loadedmetadata == true) {
        // fc.innerHTML=frameCount;
        background(128);
        var slice = createImage(w, h);
        slice = capture.get((vWidth-w)/2,vHeight/2-h/2, w, h);
        slice.mask(mascara);
        
        if (algoritmo=='test') {
            translate(originx, originy);
            // applyMatrix(-1, 0, 0, 1, w/2, 0);
            
            applyMatrix(-Math.tan(frameCount/20), 0, 0, 1, 0, 0);
            
            image(slice, -w/2, -h/2);
            // applyMatrix(1, 0, 0, 1, w, 0);
            // image(slice, -w/2, -h/2);
            resetMatrix();
        } else if (algoritmo=='espejo') {
            translate(originx, originy);
            applyMatrix(-1, 0, 0, 1, w/2, 0);
            image(slice, -w/2, -h/2);
            applyMatrix(-1, 0, 0, 1, w, 0);
            image(slice, -w/2, -h/2);
            resetMatrix();
        } else if (algoritmo=='agua') {
            translate(originx, originy);
            applyMatrix(1, 0, 0, -1, 0, -h/2);
            image(slice, -w/2, -h/2);
            applyMatrix(1, 0, 0, -1, 0, -h);
            image(slice, -w/2, -h/2);
            resetMatrix();
        } else {
            function hexagono(n=0) {
                // Loop de 5 para el hexágono
                for (let i = 0; i < 3; i++) {
                    if(step<(n*6)+i*2)break;
                    applyMatrix(-1/2, p, p, 1/2, Math.floor(p*h/2), -Math.floor(h/4));
                    if (!jumpthis.includes((n*6)+i*2)) image(slice, -w/2, -h/2);
                    else sp+=stepspeed;
                    
                    if(step<(n*6)+i*2+1)break;
                    applyMatrix(-1/2, -p, -p, 1/2, -Math.floor(p*h/2), -Math.floor(h/4));
                    if (!jumpthis.includes((n*6)+i*2+1)) image(slice, -w/2, -h/2);
                    else sp+=stepspeed;
                }
            }
            for (let i = 0; i < lista.length; i++) {
                translate(originx+lista[i][0], originy+lista[i][1] );
                hexagono(i);
                resetMatrix();
            }
        }
                        
        // Aplica filtro a la captura del video
        if (filtro>0) filter(filtros[filtro]);
        // console.log(filtros[filtro]);
        
        if(step<maxstep) {
            sp++;
            step = Math.floor(sp/stepspeed);
        }
        
        // MP4 recording
        // keep adding new frame
        if (recording) {
            // console.log('recording');
            encoder.addFrameRgba(drawingContext.getImageData(0, 0, cWidth, cHeight).data);
            recordedFrames++;
        }
        // finalize encoding and export as mp4
        if (recordedFrames >= numFrames) {
            numFrames = parseInt(getItem("nf"));
            recording = false;
            recordedFrames = 0;
            document.getElementById('bVideo').value="● GRABAR";
            document.getElementById('bVideo').classList.remove("w3-red");
            // console.log('recording stopped');

            encoder.finalize();
            const uint8Array = encoder.FS.readFile(encoder.outputFilename);
            const anchor = document.createElement('a');
            anchor.href = URL.createObjectURL(new Blob([uint8Array], { type: 'video/mp4' }));
            anchor.download = encoder.outputFilename;
            anchor.click();
            encoder.delete();

            preload(); // reinitialize encoder
        }
    }
}
// Toma la foto
function doFoto(f) {
    if(ti===false) { // Si es la cámara frontal toma la foto y a lavarse!
        document.getElementById('countdown').style.display='none';
        saveCanvas(cnv, 'kaleidoscope', 'jpg');
    } else { // Si no, le da 3 segundos al usuario para poner cara
        clearInterval(st);
        sti = 3;
        document.getElementById('countdown').style.display='block';
        document.getElementById('countdown').innerHTML = '<sm>&#128247;</sm>';
        st = setInterval(function(){
            if (sti<=0) {
                clearInterval(st);
                document.getElementById('countdown').style.display='none';
                var name = "MVM_Kaleidoscopio_"+f;
                saveCanvas(cnv, name, 'jpg');
            } else {
                document.getElementById('countdown').innerHTML = sti;
                sti--;
            }    
        },1000);
    }
}
function doFiltro() {
    filtro++;
    if (filtro>=filtros.length) 
    filtro = 0;
}

function changeFrameRate(v) {
    if (v<1 || v>10)return;
    fr = parseInt(v);
    frameRate(fr);
    storeItem('fr', fr);
    document.getElementById('fr').value = fr;
}

function switchCamera() {
    sc = 1-sc;
    capture.remove();
    capture = createCapture(isSC[sc]);
    capture.size(vWidth, vHeight);
    capture.hide();
    storeItem('sc', sc);
}

function zoom(v) {
    v = parseInt(v);
    if(!zooms.includes(v))return;
    capture.remove();
    capture = createCapture(isSC[sc]);
    vWidth = v;
    vHeight = Math.floor(vWidth*0.75);
    capture.size(vWidth, vHeight);
    capture.hide();
    storeItem('vw', vWidth);
    document.getElementById('zo').value = vWidth;
}

// Keyboard listeners
function keyPressed() {
    //   console.log(keyCode)
    switch (keyCode) {
        case 37: //left arrow
            changeFrameRate(fr-1);
        break;
        case 39: //right arrow
            changeFrameRate(fr+1);
        break;
        case 38: //up arrow Zoom in
            zoom(vWidth+120);
        break;
        case 40: //down arrow Zoom out
            zoom(vWidth-120);
        break;
        case 83: //s for witch camera
            switchCamera();
            break;
        case 70: //f for filter
            doFiltro();
            break;
        case 32: //[spacebar] for save photo
            doFoto(Math.floor((new Date()).getTime() / 1000));
            break;
    }
}

// Input listeners
document.getElementById('bFoto').addEventListener("click", function() {
    doFoto(Math.floor((new Date()).getTime() / 1000));
});
document.getElementById('bFiltro').addEventListener("click", function() {
    doFiltro()
});
document.getElementById('bSwitch').addEventListener("click", function() {
    switchCamera();
});
document.getElementById('zo').addEventListener("change", function() {
    console.log(vWidth,this.value);
    zoom(this.value);
});
document.getElementById('fr').addEventListener("change", function() {
    changeFrameRate(this.value);
});

// Mp4 record
document.getElementById('bVideo').addEventListener("click", function() {
    
    if(recording!=true){
        this.value = "● GRABANDO";
        this.classList.add("w3-red");
        recording = true;
    }else{
        this.value = "DETENIENDO";
        numFrames = recordedFrames+1;
    }
});
document.getElementById('nf').addEventListener("change", function() {
    numFrames = parseInt(this.value);
    storeItem("nf",numFrames);
});
document.getElementById('ti').addEventListener("change", function() {
    if(this.checked)ti=true;
    else ti=false;
    storeItem('ti',ti);
});

