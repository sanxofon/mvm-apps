let heads = 0;
let tails = 0;
let monedas = 0;
let merengues = 0;
let segundos = 2;
let infinito=false;
let last = 0; // 1=Aguila, -1=Sol
let coin = document.querySelector(".coin");
let flipBtn = document.querySelector("#flip-button");
let resetBtn = document.querySelector("#reset-button");

coin.addEventListener("click", bolado);
flipBtn.addEventListener("click", merenguero);
function bolado(aos=1,fast=false) {
    let i = Math.floor(Math.random() * 2);
    coin.style.animation = "none";
    if(i){
        // Águila: Cliente lleva 2x1, lleva su merengue gratis
        setTimeout(function(){
            coin.style.animation = "spin-heads "+segundos+"s forwards";
        }, 10);
        heads++;
        merengues++;
        if(aos<0)monedas+=2;
        last = 1;
    }
    else{
        // Sol: Cliente paga dos monedas por su merengue
        setTimeout(function(){
            coin.style.animation = "spin-tails "+segundos+"s forwards";
        }, 10);
        tails++;
        last = -1;
        merengues++;
        if(aos>0)monedas+=2;
    }
    if(fast)setTimeout(function(){updateStats()}, segundos*1000);
    else setTimeout(function(){updateStats(aos,true)}, segundos*1000);
    disableButton();
}
function updateStats(aos=1,end=false){
    let p1 = (Math.round(1000*(heads)/(tails+heads))/10);
    let p2 = (Math.round(1000*(tails)/(tails+heads))/10);
    let p3 = ((Math.round(10000*(monedas)/(monedas+merengues))-5000)/100);
    if(isNaN(p1))p1=0;
    if(isNaN(p2))p2=0;
    if(isNaN(p3))p3=0;
    document.querySelector("#heads-count").innerHTML = `Águila: ${heads}<br>(`+p1+"%)";
    document.querySelector("#tails-count").innerHTML = `Sol: ${tails}<br>(`+p2+"%)";
    document.querySelector("#merengues").innerHTML = '<img src="merengue.png" width="60"><br>'+(merengues);
    document.querySelector("#monedas").innerHTML = '<img src="dinero.png" width="60"><br>'+monedas;
    document.querySelector("#indice").innerHTML = p3+"%";
    document.querySelector("#pbi").value = 0;
    document.querySelector("#pbd").value = 0;
    if(p3<0)document.querySelector("#pbi").value = Math.abs(p3*20);
    else if(p3>0)document.querySelector("#pbd").value = p3*20;

    if(end && !infinito){
        if(last==aos) {
            Swal.fire({
                title: '<strong>Ganaste</strong>',
                // icon: 'info',
                imageUrl: 'merenguero0.png',
                imageWidth: 400,
                // imageHeight: 400,
                imageAlt: 'Ganaste',
                html: '<b>Te llevas un merengue gratis! :)</b>',
                showCloseButton: true,
                showCancelButton: false,
                focusConfirm: true,
                confirmButtonText: 'Cerrar',
                confirmButtonAriaLabel: 'Cerrar'
            });
        } else {
            Swal.fire({
                title: '<strong>Perdiste</strong>',
                // icon: 'info',
                imageUrl: 'merenguero2.png',
                imageWidth: 400,
                // imageHeight: 400,
                imageAlt: 'Perdiste',
                html: '<b>Compras un merengue por dos monedas :(</b>',
                showCloseButton: true,
                showCancelButton: false,
                focusConfirm: true,
                confirmButtonText: 'Cerrar',
                confirmButtonAriaLabel: 'Cerrar'
            });
        }
    }
}
function disableButton(){
    flipBtn.disabled = true;
    setTimeout(function(){
        flipBtn.disabled = false;
        if(infinito)flipBtn.click();
    },segundos*1000);
}
function merenguero(fast=false){
    if(fast==true || infinito){
        // Solo tira el bolado, el usuario por default elige águila
        bolado(1,true);
    }else{
        // Permite elegir si comprar un merengue o jugar doble o nada
        Swal.fire({
            title: '<strong>Merenguero</strong>',
            // icon: 'info',
            imageUrl: 'merengues.png',
            imageWidth: 400,
            // imageHeight: 200,
            imageAlt: 'Merenguero',
            html: '<b>¿Así que quieres comprar un merengue?</b><br>1 merengue cuesta 1 moneda<br>Pero te juego <b>"doble o nada"</b>. Si ganas el bolado el merengue te sale gratis, pero si pierdes te cuesta el doble (2 monedas).',
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: true,
            confirmButtonText: 'Doble o Nada',
            confirmButtonAriaLabel: 'Chingón :)',
            cancelButtonText: 'Sólo dame mi merengue',
            cancelButtonAriaLabel: 'Del nabo :('
        }).then((result) => {
            if (result.isConfirmed) {
                // Permite elegir un lado de la moneda cuando aceptamos el doble o nada
                Swal.fire({
                    title: '<strong>Águila o Sol</strong>',
                    // icon: 'info',
                    imageUrl: 'tiramoneda.png',
                    imageWidth: 300,
                    // imageHeight: 200,
                    imageAlt: 'Águila o Sol',
                    html: '<b>Elige un lado de la moneda</b>',
                    showCloseButton: true,
                    showCancelButton: true,
                    focusConfirm: false,
                    confirmButtonText: 'Águila',
                    confirmButtonAriaLabel: 'Águila',
                    cancelButtonText: 'Sol',
                    cancelButtonAriaLabel: 'Sol'
                }).then((result) => {
                    if (result.isConfirmed) { // Usuario elige Águila
                        bolado(1);
                    } else if (result.dismiss === Swal.DismissReason.cancel) { // Usuario elige Sol
                        bolado(-1);
                    }
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // El usuario eligió comprar su merengue simplemente por una moneda
                merengues++;
                monedas++;
                updateStats();
                Swal.fire({
                    title: 'Tome su merengue',
                    imageUrl: 'merenguero1.png',
                    imageWidth: 400,
                    // imageHeight: 400,
                    imageAlt: 'Tome su merengue',
                    // html: '<b>Tome su merengue</b>',
                    showCloseButton: true,
                    showCancelButton: false,
                    focusConfirm: false,
                    confirmButtonText: 'Cerrar',
                    confirmButtonAriaLabel: 'Cerrar'
                });
            }
        });
    }
}




resetBtn.addEventListener("click",() => {
    coin.style.animation = "none";
    heads = 0;
    tails = 0;
    monedas = 0;
    merengues = 0;
    updateStats();
});
document.querySelector("#infinito").addEventListener("change",(ev) => {
    infinito = document.querySelector("#infinito").checked;
    if(infinito)flipBtn.innerHTML='<big>&infin;</big> Merengues';
    else flipBtn.innerHTML='1 Merengue, por favor';
});