/* --------------- Variables generales --------------- */
let anterior=0;
let actual=0;
let appendNumber = 0;
let prependNumber = 0;
let loadedSlides = [];
let wid = 0;
// let si = null;
/* ---------------- Colores de primos ---------------- */
let colores = [];
function getUniqueColor(n) {
	const rgb = [0, 0, 0];
  for (let i = 0; i < 24; i++) {
  	rgb[i%3] <<= 1;
    rgb[i%3] |= n & 0x01;
    n >>= 1;
  }
  return '#' + rgb.reduce((a, c) => (c > 0x0f ? c.toString(16) : '0' + c.toString(16)) + a, '')
}
/* ---------------- CREADOR DE SVG ---------------- */
// function getNode(n, v) {
//     n = document.createElementNS("http://www.w3.org/2000/svg", n);
//     for (var p in v){
//         n.setAttributeNS(null, p.replace(/[A-Z]/g, function(m, p, o, s) { return "-" + m.toLowerCase(); }), v[p]);
//     }
//     return n;
// }

/* ---------------- INICIO DEL PLUGIN ---------------- */
function ciudad({ swiper, extendParams, on }) {
    extendParams({
        // debugger: true,
    });
    const worker = new Worker('webworker.js')
    
    /* ---------------- WebWorker ---------------- */
    
    function loadSlides(){
        // console.log("loadSlides");
        // console.log("activeIndex",swiper.activeIndex);
        // console.log("actual",actual);
        // console.log(loadedSlides);
        
        const primos = [
            2,  3,  5,
            7, 11, 13, 
            17, 19, 23
        ];
        const pisos = [
            "imagen/edificio-1","imagen/edificio-2","imagen/edificio-3",
            "imagen/edificio-4","imagen/edificio-5","imagen/edificio-6",
            "imagen/edificio-7","imagen/edificio-8","imagen/edificio-9"
        ]
        const techo = "imagen/edificioTop";
        
        // web worker
        worker.addEventListener('message', evt => {
            const n = evt.data.n;
            if(loadedSlides.includes(n)===false){
                const f = n+prependNumber;
                const factores = evt.data.factores;
                for (let i = 0; i < swiper.slides.length; i++) {
                    let j = parseInt(swiper.slides[i].getAttribute('data-swiper-slide-index'));
                    if(j==f){
                        if(n>=2){
                            // Aquí se cargan las imágenes
                            let pp = ['<b>'+n+'</b>'];
                            for (let l = 0; l < factores.length; l++) {
                                const p = factores[l];
                                const k = primos.indexOf(p);
                                let piso = '';
                                if(k<0){
                                    // El primo no tiene dibujito!!
                                    let color=getUniqueColor(p);
                                    // console.log(p);                                  
                                    piso='<span>'+p+'</span><svg viewBox="0 0 160 115"><rect x="8" y="0" width="144" height="115" fill="'+color+'" rx="4" ry="4" stroke="#000000" stroke-width="3"></rect><rect x="0" y="0" width="160" height="8" rx="4" ry="4" fill="'+color+'" stroke="#000000" stroke-width="3"></rect><rect x="25" y="30" width="40" height="36" rx="2" ry="2" fill="#ffffff" stroke="#000000" stroke-width="2"></rect><rect x="25" y="30" width="20" height="18" fill="#ffffff" stroke="#000000" stroke-width="1"></rect><rect x="45" y="48" width="20" height="18" fill="#ffffff" stroke="#000000" stroke-width="1"></rect>'+(l==0 ? '<rect x="90" y="35" width="36" height="79" rx="2" ry="2" fill="'+color+'" stroke="#000000" stroke-width="2"></rect>':'<rect x="94" y="30" width="40" height="36" rx="2" ry="2" fill="#ffffff" stroke="#000000" stroke-width="2"></rect><rect x="94" y="30" width="20" height="18" fill="#ffffff" stroke="#000000" stroke-width="1"></rect><rect x="114" y="48" width="20" height="18" fill="#ffffff" stroke="#000000" stroke-width="1"></rect>')+'</svg>';
                                } else {
                                    // Cargamos el dibujito asignado!!
                                    piso='<span>'+p+'</span><img title="'+p+'" src="./'+pisos[k]+(l==0 ? 'b':'')+'.png">';
                                }
                                // Si es piso 0 (hasta abajo) abrega una 'b'
                                pp.push(piso);
                            }
                            // Agregar el techo
                            const r = Math.floor(Math.random() * 8)+1;
                            pp.push('<img title="'+n+'" src="./'+techo+r+'ch.png">');
                            // Todo va al revés
                            pp.reverse();
                            swiper.slides[i].title=n;
                            swiper.slides[i].innerHTML='<x><div>'+pp.join('</div><div>')+'</div></x>';
                        }
                        loadedSlides.push(n);
                        // console.log(factores);
                        break;
                    }
                }
            }
        });
        
        // Si no está cargado, carga el actual
        for (let i = 0; i < swiper.slides.length; i++) {
            let j = parseInt(swiper.slides[i].getAttribute('data-swiper-slide-index'));
            // console.log(i,j);
            if(j==swiper.activeIndex && loadedSlides.includes(actual)===false){
                // loadedSlides.push(actual);
                worker.postMessage(actual);
                // swiper.slides[i].innerText+='x';
            }else if(j==swiper.activeIndex-1 && loadedSlides.includes(actual-1)===false){
                // loadedSlides.push(actual-1);
                worker.postMessage(actual-1);
                // swiper.slides[i].innerText+='a';
            }else if(j==swiper.activeIndex+1 && loadedSlides.includes(actual+1)===false){
                // loadedSlides.push(actual+1);
                worker.postMessage(actual+1);
                // swiper.slides[i].innerText+='s';
            }
        }
    }
    ciudad.loadSlides = loadSlides;
    
    on('init', () => {
        // if (!swiper.params.debugger) return;
        // console.log('init');
        // loadSlides();
        let a=[];
        for (let i = 0; i < 100; i++) {
            a.push(++appendNumber);            
        }
        swiper.virtual.appendSlide(a);
        loadSlides();
        setTimeout(function(){
            gotoslide(2);
            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = '.swiper-slide { padding-bottom: '+parseInt(swiper.slides[0].clientHeight-window.innerHeight+4)+'px; }';
            // style.innerHTML = '.swiper-slide { max-height:'+window.innerHeight+'px; }';
            document.getElementsByTagName('head')[0].appendChild(style);
            // alert("swiper/screen/window\n"+swiper.slides[0].clientHeight+" / "+screen.height+" / "+window.innerHeight);
            // console.log("swiper-slides-height:",swiper.slides[0].clientHeight);
            // console.log("screen-height:",screen.height);
            // console.log("window-innerHeight:",window.innerHeight);

        },500);
    });
    // on('click', (swiper, e) => {
    //     if (!swiper.params.debugger) return;
    //     console.log('click');
    // });
    // on('tap', (swiper, e) => {
    //     if (!swiper.params.debugger) return;
    //     console.log('tap');
    // });
    on('doubleTap', (swiper, e) => {
        // if (!swiper.params.debugger) return;
        let t = e.target;
        while(!t.getAttribute('data-swiper-slide-index')) {
            t = t.parentNode;
        }
        var jmc = document.getElementById('jsModalContent');
        jmc.innerHTML=t.innerHTML;
        openModal();
        jmc.scrollTop = jmc.scrollHeight; // Scroll to bottom
        // Aquí debe abrir un modal y mostrar ahí el edificio scrolleable
        // console.log('doubleTap',t);
        // console.log('doubleTap',t.getAttribute('data-swiper-slide-index'));
    });
    on('slideChange', () => {
        anterior = swiper.previousIndex + prependNumber;
        actual = swiper.activeIndex + prependNumber;
        loadSlides();
    });
    on('reachBeginning', () => {
        // swiper.virtual.prependSlide([
        //     --prependNumber,
        //     --prependNumber,
        //     // --prependNumber,
        //     // --prependNumber,
        //     // --prependNumber,
        // ]);
        // loadSlides();
    });
    on('reachEnd', () => {
        swiper.virtual.appendSlide([
            ++appendNumber,
            ++appendNumber,
            // ++appendNumber,
            // ++appendNumber,
            // ++appendNumber,
        ]);
        loadSlides();
    });
}

/* ---------------- FIN DEL PLUGIN ---------------- */

/* ---------------- Iniciar swiper ---------------- */
const swiper = new Swiper('.swiper', {
    modules: [ciudad],// Install Plugin To Swiper
    slidesPerView: 3,
    centeredSlides: true,
    // spaceBetween: 30,
    // speed: 600,
    parallax: true,
    grabCursor: true,
    mousewheel: true,
    keyboard: {
        enabled: true,
    },
    // pagination: {
    //     el: '.swiper-pagination',
    //     // type: 'fraction',
    //     dynamicBullets: true,
    //     clickable: true,
    // },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    virtual: {
        slides: (function () {
            const slides = [];
            for (var i = prependNumber; i <= appendNumber; i += 1) {
                // slides.push('' + (i + 1));
                slides.push(i);
            }
            return slides;
        })(),
    },
});

// Funcion para ir a cualquier ficha
function gotoslide(n) {
    // bloqueo de negativos
    if(n<2 || n>9999)return;
    if(n<prependNumber){
        // Agrega las fichas necesarias hacia atrás
        let j = n+prependNumber;
        let a = [];
        for (let i = 0; i > j; i--) {
            a.push(--prependNumber);
        }
        swiper.virtual.prependSlide(a);
    } else if(n>appendNumber) {
        // Agrega las fichas necesarias hacia adelante
        let j = n-appendNumber;
        let a = [];
        for (let i = 0; i < j; i++) {
            a.push(++appendNumber);
        }
        swiper.virtual.appendSlide(a);
    }
    n -= prependNumber;
    swiper.slideTo(n, 0);
    ciudad.loadSlides();
}

function irAlNumero() {
    let n = document.getElementById('numero').value;
    console.log('n:',n);
    n=n.replace(/[^0-9\*]/g,'');
    console.log('n(f):',n);
    if(n.includes('*')){
        const a = n.split('*');
        let r = 1;
        for (let i = 0; i < a.length; i++) {
            r = r*a[i];
        }
        n=r;
    }
    if(n<2){
        // Reset all!
        anterior=0;
        actual=0;
        appendNumber = 0;
        prependNumber = 0;
        loadedSlides = [];
        colores = [];
        // reset slides
        swiper.virtual.removeAllSlides();
        // swiper.virtual.slides = [];
        // reset cache if param.virtual.cache = true;
        // swiper.virtual.cache = [];
        let a=[];
        for (let i = 0; i < 100; i++) {
            a.push(++appendNumber);            
        }
        swiper.virtual.appendSlide(a);
        gotoslide(2);
        swiper.slides[0].innerText='0';
        swiper.slides[1].innerText='1';
    }else{
        gotoslide(n);
        document.getElementById('numero').value='';
    }
}

/* ----- Modal Js ----- */
/* MODAL PURE JS */
function openModal() {
    document.getElementById('jsModal').classList.add('jsModalOpen');
}
function closeModal(){
    document.getElementById('jsModal').classList.remove('jsModalOpen');
}
