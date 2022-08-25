<?php
	header('Content-Type: application/javascript');
?>
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
function range(n) {
	var a = [];
	for(i=1;i<=(n*n);i++){
		a.push(i);
	}
	return a;
}
function ordenar(n=3, desordenar=false, what='.grid-square') {
	var where = n+'x'+n;
	var parent = document.getElementById('grid'+where);
	var childs = parent.querySelectorAll(what);
	var lista = range(n);
	if(Array.isArray(desordenar))lista=desordenar;
	else if(desordenar)shuffleArray(lista);
	for(i=0; i < childs.length ; i++) {
		childs[i].innerHTML=lista[i]; // Captura el número escrito en HTML
	}
	contar(n);
}
function suma(n){
	var total = 0;
	for (i=1;i<=n;i++) {
		total += i;
	}
	return total;
}
function sum(arr,lista){
	var total = 0;
	for (var i in arr) {
		total += (lista[arr[i]]);
	}
	return total;
}
function contar(n=3, what='.grid-square') {
	var where = n+'x'+n;
	var parent = document.getElementById('grid'+where);
	var childs = parent.querySelectorAll(what);
	var lista = [];
	var target = suma(n*n)/n; // Número objetivo para cada suma
	// console.log('target:',target);
	for(i=0; i < childs.length ; i++) {
		lista.push(parseInt(childs[i].innerHTML)); // Captura el número escrito en HTML
	}
	// console.log('lista:',lista);
	var sumas = {
		'fils': [],
		'cols': [],
		'diags': []
	};
	var fils = [],
		cols = [],
		diag1 = [],
		diag2 = [];
	for(i=0;i<n;i++) {
		fils.push(i);
		cols.push(i*n);
		diag1.push((n*i)+i);
		diag2.push((n-1)*(i+1));
	}
	// console.log('f:',fils);
	// console.log('c:',cols);
	// console.log('d1:',diag1);
	// console.log('d2:',diag2);
	for(i=0;i<n;i++) {
		sumas['fils'].push(sum(fils,lista));
		sumas['cols'].push(sum(cols,lista));
		for(j=0;j<n;j++) {
			fils[j]+=n;
			cols[j]++;
		}
	}
	sumas['diags'].push(sum(diag1,lista));
	sumas['diags'].push(sum(diag2,lista));
	// console.log('fils:',sumas['fils']);
	// console.log('cols:',sumas['cols']);
	// console.log('diags:',sumas['diags']);
	// Checa si hay éxito
	var ontarget = true; 
	for(i=0;i<2;i++) {
		if(sumas['diags'][i]!=target){
			ontarget=false;
			break;
		}
	}
	if(ontarget){
		for(i=0;i<n;i++) {
			if(ontarget && sumas['cols'][i]!=target){
				ontarget=false;
				break;
			}
			if(ontarget && sumas['fils'][i]!=target){
				ontarget=false;
				break;
			}
		}
	}
	if(ontarget)document.getElementById('salida'+where).innerHTML = '<b>ÉXITO</b><br>Todas las sumas dan '+target;
	else document.getElementById('salida'+where).innerHTML = '<b>OBJETIVO: '+target+'</b><br>Filas: '+sumas['fils'].join(', ')+'<br>Columnas: '+sumas['cols'].join(', ')+'<br>Diagonales: '+sumas['diags'].join(', ');
}
function solucion(n) {
	var soluciones = {
		2:[1,4,2,3],
		3:[2,7,6,9,5,1,4,3,8],
		4:[7,12,1,14,2,13,8,11,16,3,10,5,9,6,15,4],
		5:[11,24,7,20,3,4,12,25,8,16,17,5,13,21,9,10,18,1,14,22,23,6,19,2,15],
		6:[6,32,3,34,35,1,7,11,27,28,8,30,19,14,16,15,23,24,18,20,22,21,17,13,25,29,10,9,26,12,36,5,33,4,2,31],
	};
	ordenar(n,soluciones[n]);
}

<?php
	for($m=3;$m<=6;$m++){
?>
var grid<?php echo $m."x".$m; ?> = document.getElementById('grid<?php echo $m."x".$m; ?>');
new Sortable(grid<?php echo $m."x".$m; ?>, {
	animation: 150,
	swap: true,
	swapThreshold: 0.65,
	// invertSwap: true,
	// filter: '.filtro', // No arrastrables
	ghostClass: 'desde',
	swapClass: 'hasta',
	forceFallback: true,
	onChoose: function(e) {
		e.target.classList.add('grabbing');
	},
	onUnchoose: function(e) {
		e.target.classList.remove('grabbing');
	},
	onStart: function(e) {
		e.target.classList.add('grabbing');
	},
	onEnd: function(e) {
		e.target.classList.remove('grabbing');
		contar(<?php echo $m; ?>);
	},
});
//ordenar(<?php echo $m; ?>,true);
contar(<?php echo $m; ?>); // Sumas iniciales
<?php
	}
?>
