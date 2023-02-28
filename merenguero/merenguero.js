let heads = 0;
let tails = 0;
let monedas = 0;
let merengues = 0;
let segundos = 2;
let infinito=false;
let coin = document.querySelector(".coin");
let flipBtn = document.querySelector("#flip-button");
let resetBtn = document.querySelector("#reset-button");

coin.addEventListener("click", bolado);
flipBtn.addEventListener("click", bolado);
function bolado() {
    let i = Math.floor(Math.random() * 2);
    coin.style.animation = "none";
    if(i){
        // Águila: Cliente lleva 2x1, lleva dos merengues por una moneda
        setTimeout(function(){
            coin.style.animation = "spin-heads "+segundos+"s forwards";
        }, 10);
        heads++;
        merengues+=2;
        monedas++;
    }
    else{
        // Sol: Cliente paga doble, dos monedas por un merengue
        setTimeout(function(){
            coin.style.animation = "spin-tails "+segundos+"s forwards";
        }, 10);
        tails++;
        merengues++;
        monedas+=2;
    }
    setTimeout(updateStats, segundos*1000-200);
    disableButton();
}
function updateStats(){
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
    monedas = 0;
    merengues = 0;
    updateStats();
});
document.querySelector("#infinito").addEventListener("change",(ev) => {
    infinito = document.querySelector("#infinito").checked;
    if(infinito)flipBtn.innerHTML='<big>&infin;</big> Bolados';
    else flipBtn.innerHTML='1 Bolado';
});
