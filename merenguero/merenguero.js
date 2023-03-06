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
        if(last==aos)Swal.fire("Ganaste", `Te llevas un merengue gratis! :)`,"success");
        else if(last==aos)Swal.fire("Perdiste", `Compras un merengue por dos monedas :(`,"error");
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
        bolado(1,true);
    }else{
        Swal.fire({
            title: '<strong>Merenguero</strong>',
            icon: 'info',
            // imageUrl: 'https://unsplash.it/400/200',
            // imageWidth: 400,
            // imageHeight: 200,
            // imageAlt: 'Custom image',
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
                Swal.fire({
                    title: '<strong>Águila o Sol</strong>',
                    icon: 'info',
                    // imageUrl: 'https://unsplash.it/400/200',
                    // imageWidth: 400,
                    // imageHeight: 200,
                    // imageAlt: 'Custom image',
                    html: '<b>Elige un lado de la moneda</b>',
                    showCloseButton: true,
                    showCancelButton: true,
                    focusConfirm: false,
                    confirmButtonText: 'Águila',
                    confirmButtonAriaLabel: 'Águila',
                    cancelButtonText: 'Sol',
                    cancelButtonAriaLabel: 'Sol'
                }).then((result) => {
                    if (result.isConfirmed) { // Águila
                        bolado(1);
                    } else if (result.dismiss === Swal.DismissReason.cancel) { // Sol
                        bolado(-1);
                    }
                });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                merengues++;
                monedas++;
                updateStats();
                Swal.fire("Merengue", `Tome su merengue`,"success");
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