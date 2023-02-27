let heads = 0;
let tails = 0;
let venta = 0;
let apuesta = 0;
let segundos = 1;
let infinito=false;
let coin = document.querySelector(".coin");
let flipBtn = document.querySelector("#flip-button");
let resetBtn = document.querySelector("#reset-button");

flipBtn.addEventListener("click", bolado);
function bolado() {
    let i = Math.floor(Math.random() * 2);
    coin.style.animation = "none";
    if(i){
        // Águila: Cliente gana dos merengues
        setTimeout(function(){
            coin.style.animation = "spin-heads "+segundos+"s forwards";
        }, 100);
        heads++;
        apuesta++;
    }
    else{
        // Sol: Cliente no lleva merengue
        setTimeout(function(){
            coin.style.animation = "spin-tails "+segundos+"s forwards";
        }, 100);
        tails++;
    }
    venta++;
    setTimeout(updateStats, segundos*1000-200);
    disableButton();
}
function updateStats(){
    document.querySelector("#heads-count").innerHTML = `Águila: ${heads}<br>(`+(Math.round(1000*(heads)/(tails+heads))/10)+"%)";
    document.querySelector("#tails-count").innerHTML = `Sol: ${tails}<br>(`+(Math.round(1000*(tails)/(tails+heads))/10)+"%)";
    document.querySelector("#apuesta").innerHTML = '<img src="merengue.png" width="60"><br>'+(apuesta*2);
    document.querySelector("#venta").innerHTML = '<img src="dinero.png" width="60"><br>'+venta;
    document.querySelector("#indice").innerHTML = ((Math.round(10000*(venta)/(venta+apuesta*2))-5000)/100)+"%"
}
function disableButton(){
    flipBtn.disabled = true;
    setTimeout(function(){
        flipBtn.disabled = false;
        if(infinito)flipBtn.click();
    },segundos*1000);
}
resetBtn.addEventListener("click",() => {
    coin.style.animation = "none";
    heads = 0;
    tails = 0;
    updateStats();
});
document.querySelector("#infinito").addEventListener("change",(ev) => {
    infinito = document.querySelector("#infinito").checked;
    if(infinito)flipBtn.innerHTML='<big>&infin;</big> Bolados';
    else flipBtn.innerHTML='1 Bolado';
});
