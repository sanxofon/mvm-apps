<?php
	header('Content-Type: application/javascript');
?>

function sum(arr,lista){
	var total = 0;
	for (var i in arr) {
		total += (lista[arr[i]]);
	}
	return total;
}
function getOrder(n=3, what='.grid-square') {
	var where = n+'x'+n;
	var parent = document.getElementById('grid'+where);
	var childs = parent.querySelectorAll(what);
	var lista = [];
	for(i=0; i < childs.length ; i++) {
		lista.push(parseInt(childs[i].innerHTML));
	}
	console.log('lista:',lista);
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
	console.log('f:',fils);
	console.log('c:',cols);
	console.log('d1:',diag1);
	console.log('d2:',diag2);
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
	console.log('fils:',sumas['fils']);
	console.log('cols:',sumas['cols']);
	console.log('diags:',sumas['diags']);
		
	document.getElementById('salida'+where).innerHTML = 'Filas: '+sumas['fils'].join(', ')+'<br>Columnas: '+sumas['cols'].join(', ')+'<br>Diagonales: '+sumas['diags'].join(', ');
}

<?php
	for($m=3;$m<=5;$m++){
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
		getOrder(<?php echo $m; ?>);
	},
});
getOrder(<?php echo $m; ?>); // Sumas iniciales
<?php
	}
?>
