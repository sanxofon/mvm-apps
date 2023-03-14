
const factorizar = async (n) => {
  const factors = [];
  let divisor = 2;
  
  while (n >= 2) {
    if (n % divisor == 0) {
      factors.push(divisor);
      n = n / divisor;
    } else {
      divisor++;
    }
  }
  return factors;
}

onmessage = async function(event) {
  const n = parseInt(event.data);
  postMessage(await factorizar(n));
}