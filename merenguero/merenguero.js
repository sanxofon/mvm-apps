let heads = 0;
let tails = 0;
let coin = document.querySelector(".coin");
let flipBtn = document.querySelector("#flip-button");
let resetBtn = document.querySelector("#reset-button");

flipBtn.addEventListener("click", () => {
    let i = Math.floor(Math.random() * 2);
    coin.style.animation = "none";
    if(i){
        setTimeout(function(){
            coin.style.animation = "spin-heads 2s forwards";
        }, 100);
        heads++;
    }
    else{
        setTimeout(function(){
            coin.style.animation = "spin-tails 2s forwards";
        }, 100);
        tails++;
    }
    setTimeout(updateStats, 2000);
    disableButton();
});
function updateStats(){
    document.querySelector("#heads-count").textContent = `Águila: ${heads} (`+(Math.round(1000*(heads)/(tails+heads))/10)+"%)";
    document.querySelector("#tails-count").textContent = `Sol: ${tails} (`+(Math.round(1000*(tails)/(tails+heads))/10)+"%)";
}
function disableButton(){
    flipBtn.disabled = true;
    setTimeout(function(){
        flipBtn.disabled = false;
    },3000);
}
resetBtn.addEventListener("click",() => {
    coin.style.animation = "none";
    heads = 0;
    tails = 0;
    updateStats();
});

// Tira bolados infinitamente
/* setInterval(function(){
  flipBtn.click()
},5000); */