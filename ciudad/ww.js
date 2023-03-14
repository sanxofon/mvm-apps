/* ---------------- WebWorker ---------------- */
const btn = document.querySelector('#btnCreate');
const numero = document.querySelector('#numero');
const container = document.querySelector('#container');
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
numero.value=getRandomInt(10000);
btn.addEventListener('click', () => {
    var worker = new Worker('webworker.js')
    worker.addEventListener('message', evt => {
      const primos = evt.data;
      // console.log(primos);
      container.innerText = primos.join(", ");
    });
    worker.postMessage(numero.value)
    numero.value=getRandomInt(10000);
});