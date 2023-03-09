<?php
include_once("appConfig.php");
include("appHeader.php");
?>
	<div id="cuerpo" class="w3-row" style="z-index:9;">
		<?php include("sidebar.html") ?>
		<div id="countdown"><sm>&#128247;</sm></div>
		<div id="contenedor" class="w3-twothird"></div>
		<div id="derecha" class="w3-third w3-bar">
			<div class="w3-padding">
				<input type="image" src="img/foto.png" style="width:90px;margin-right:20px;" class="botimg" id="bFoto" title="Tomar Foto">
				<input type="image" src="img/grabar.png" style="width:90px;margin-left:20px;" class="botimg" id="bVideo" title="Grabar Video">
			</div>
			<div class="w3-padding">
				<input type="image" src="img/timer.png" style="width:50px;margin-right:15px;" class="botimg" id="ti" title="Timer: 3s">
				<input type="image" src="img/flip.png" style="width:60px;display:none;" class="botimg" id="bSwitch" title="Cámara Forntal/Trasera">
				<input type="image" src="img/filtro.png" style="width:50px;margin-left:15px;" class="botimg" id="bFiltro" title="Filtros">
			</div>
			<br>
			<div class="w3-padding">
				<img src="img/algoritmo.png" class="icoimg" style="width: 50px;" title="Selecciona un Algoritmo">
				<select id="selAlgo" title="Selecciona un Algoritmo" class="w3-black w3-round" style="border:none;height:40px;width:140px;">
					<option value="" disabled selected>Algoritmo</option>
					<option value="kaleidoscopio">Caleidoscopio</option>
					<option value="espejo">Espejo</option>
					<option value="agua">Agua</option>
					<option value="hiperbolico">Hiperbólica</option>
				</select>
			</div>
			<div class="w3-padding">
				<!-- <label class="w3-large w3-dark-gray w3-round">TIMER 3s: <input type="checkbox" id="ti" name="ti" value="timer"></label> -->
				<label title="Zoom" style="width: 50%;display:inline;padding-right:10px;">
					<img type="image" src="img/zoom.png" style="height:40px;width:40px;" class="icoimg" title="Zoom">
					<select style="height:40px;width: 44px;border:none;" class="w3-black w3-round" id="zo">
						<option value="240">1</option>
						<option value="360">2</option>
						<option value="480" selected>3</option>
						<option value="600">4</option>
						<option value="720">5</option>
					</select>
				</label><label title="FPS: Cuadros por Segundo" style="width: 50%;display:inline;padding-left:10px;">
					<img type="image" src="img/speed.png" style="height:40px;width:40px;" class="icoimg" title="FPS: Cuadros por Segundo">
					<select style="height:40px;width:50px;border:none;" class="w3-black w3-round"" class="w3-black w3-round" id="fr">
						<option value="1">1</option>
						<option value="2">2</option>
						<option value="3">3</option>
						<option value="4">4</option>
						<option value="5" selected>5</option>
						<option value="6">6</option>
						<option value="7">7</option>
						<option value="8">8</option>
						<option value="9">9</option>
						<option value="10">10</option>
					</select>
				</label>
			</div>
				
			<!-- <br><br><button onclick="localStorage.clear();window.location.reload(true);">RELOAD</button> -->
				
			<!-- <input id="steprange" type="range" min="0" max="40" step="1" value="0"> -->

			<!-- <br clear="all"><br clear="all">
			<div style="text-align: center;"><span id="frameCount"></span></div> -->

		</div>

	</div>

<?php include_once "appFooter.php"; ?>

</body>
</html>