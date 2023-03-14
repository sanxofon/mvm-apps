/* --------------- Variables generales --------------- */
let anterior=0;
let actual=0;
let appendNumber = 0;
let prependNumber = 0;
let loadedSlides = [];
// let si = null;

/* ---------------- INICIO DEL PLUGIN ---------------- */
function myPlugin({ swiper, extendParams, on }) {
    extendParams({
        // debugger: true,
    });
    
    function loadSlides(){
        // console.log("loadSlides");
        // console.log("activeIndex",swiper.activeIndex);
        // console.log("actual",actual);
        // console.log(loadedSlides);

        // Si no está cargado, carga el actual
        for (let i = 0; i < swiper.slides.length; i++) {
            let j = parseInt(swiper.slides[i].getAttribute('data-swiper-slide-index'));
            // console.log(i,j);
            if(loadedSlides.includes(actual)===false && j==swiper.activeIndex){
                loadedSlides.push(actual);
                swiper.slides[i].innerText+='x';
            }else if(loadedSlides.includes(actual-1)===false && j==swiper.activeIndex-1){
                loadedSlides.push(actual-1);
                swiper.slides[i].innerText+='a';
            }else if(loadedSlides.includes(actual+1)===false && j==swiper.activeIndex+1){
                loadedSlides.push(actual+1);
                swiper.slides[i].innerText+='s';
            }
        }
    }
    myPlugin.loadSlides = loadSlides;
    
    on('init', () => {
        // if (!swiper.params.debugger) return;
        // console.log('init');
        // loadSlides();
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
        console.log('doubleTap',e.target.firstChild.nodeValue);
        // console.log('doubleTap',e.target.getAttribute('data-swiper-slide-index'));
    });
    on('slideChange', () => {
        // if (!swiper.params.debugger) return;
        // clearTimeout(si);
        anterior = swiper.previousIndex + prependNumber;
        actual = swiper.activeIndex + prependNumber;
        // console.log(
        //     'slideChange:',
        //     anterior,
        //     '->',
        //     actual
        // );
        // console.log(
        //     'activeIndex:',
        //     swiper.activeIndex
        // );
        // si = setTimeout(function(){
        //     clearTimeout(si);
        /* if(loadedSlides.includes(actual-1)===false){
            // Si no está cargado, carga el inmediato anterior
            if(swiper.slides.length>1){
                loadedSlides.push(actual-1);
                swiper.slides[1].innerText+='a';
            }
        } */
        loadSlides();
        /* if(loadedSlides.includes(actual+1)===false) {
            // Si no está cargado, carga el inmediato siguiente
            if(swiper.slides.length>2){
                loadedSlides.push(actual+1);
                swiper.slides[3].innerText+='s';
            }
        } */
        // console.log('activeIndex:',swiper.activeIndex);
        // console.log('actual:',actual);
        // console.log('slides:',swiper.slides);
        // console.log('loadedSlides:',loadedSlides);
        // },100);
    });
    on('reachBeginning', () => {
        // if (!swiper.params.debugger) return;
        // console.log('reachBeginning');
        swiper.virtual.prependSlide([
            --prependNumber,
            --prependNumber,
            // --prependNumber,
            // --prependNumber,
            // --prependNumber,
        ]);
        loadSlides();
    });
    on('reachEnd', () => {
        // if (!swiper.params.debugger) return;
        // console.log('reachEnd');
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
    modules: [myPlugin],// Install Plugin To Swiper
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
    myPlugin.loadSlides();
}

// DEMO ONLY!!
// document.querySelector('.prepend-slide').addEventListener('click', function (e) {
//     e.preventDefault();
//     swiper.virtual.prependSlide([
//         --prependNumber
//     ]);
// });
// document.querySelector('.append-slide').addEventListener('click', function (e) {
//     e.preventDefault();
//     swiper.virtual.appendSlide([
//         ++appendNumber
//     ]);
// });


/* ---------------- WebWorker ---------------- */
var worker = new Worker('webworker.js')
worker.addEventListener('message', evt => {
  const primos = evt.data;
  console.log(primos);
});
function factor(n) {
    worker.postMessage(n);
}