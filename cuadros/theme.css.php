<?php
header("Content-type: text/css", true);
?>
html,body {
	margin: 0;
	padding: 0;
	background-color: #202020;
}
h1 {
	color:#f9f9f9;
}
.container {
	width: 520px;
	text-align: center;
	margin: 0 auto;
}
.cuadro {
	background-color: #404040;
	border: 1px solid #000;
	padding-top:40px;
	padding-bottom:20px;
	margin-top:20px;
	margin-bottom:20px;
}
button {
	font-size: 1.5em;
	cursor: pointer;
	margin:3px;
}
code {
	display: block;
	background: #202020;
	color: #30ec5f;
	white-space: pre;
	width: 400px;
	margin: 0 auto;
	padding: 10px;
	text-align: left;
	font-family: monospace;
}

.grid-square {
	display: inline-block;
	background-color: #fff;
	border: solid 1px rgb(0,0,0,0.2);
	text-align: center;
	cursor: grab;
	border-radius: 10px;
}
.grid-square:hover {
	background-color: #ffd;
}
.grid-square:active {
	background-color: #ffe;
	cursor: grabbing!important;
}
.grabbing * {
    cursor: grabbing !important;
}
<?php
	$w = 340;
?>
.grid {
	margin:0 auto;
	padding:10px;
	user-select: none;
	background-color: #f9f9f9;
	border: solid 1px rgb(0,0,0,1);
	border-radius: 10px;
	line-height: 100%;
	width: <?php echo $w+20; ?>px; /* 3*(n*1.1+2)=340 */
}
<?php
	for($m=3;$m<=6;$m++){
		$n = floor((($w/$m)-2)/1.1);
		$wf = $w+$m; // ancho final
		if ($wf % 2 != 0) $wf++; // un poquito más
?>
#grid<?php echo $m."x".$m; ?> .grid-square {
	width: <?php echo $n; ?>px; /* n */
	height: <?php echo floor($n*0.6); ?>px; /* n */
	margin: <?php echo floor($n/20); ?>px; /* n/20 */
	padding-top: <?php echo floor($n/2.5); ?>px; /* n/3.333 */
	font-size: <?php echo floor($n*10/50)/10; ?>em; /* n/50 */
}
<?php
	}
?>




.desde {
	background-color: #48b4e6!important;
}

.hasta {
	background-color: #30ec5f!important;
}

.filtro {
	background-color: #ec6530!important;
}

.selected {
	background-color: #f9c7c8!important;
	border: solid red 1px !important;
	z-index: 1 !important;
}