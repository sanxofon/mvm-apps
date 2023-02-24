<?php
include_once("appConfig.php");
include("appHeader.php");
?>

<div id="cuerpo" class="w3-row">
		<div id="countdown"><sm>&#128247;</sm></div>
		<div id="contenedor" class="w3-twothird"></div>
		<div id="derecha" class="w3-third w3-bar">
			<div class="w3-padding">
				<input type="button" class="w3-button w3-xxlarge w3-round w3-green w3-margin" id="bFoto" value="FOTO">
				<input type="button" class="w3-button w3-xlarge w3-round w3-orange" id="bVideo" value="&#9679;&nbsp;GRABAR">
			</div>
			<br>
			<div class="w3-padding">
				<select class="w3-large w3-padding-large w3-dark-gray w3-round" style="border:none;" onchange="window.location='?a='+this.value;">
					<option value="" disabled selected> - Algoritmo - </option>
					<option value="t">test</option>
					<option value="e">Espejo</option>
					<option value="a">Agua</option>
					<option value="k">Kaleidoscopio</option>
				</select>
			</div>
			<div class="w3-padding">
				<input style="display:none;" type="button" class="w3-button w3-round w3-purple" id="bSwitch" value="SWITCH">
				<input type="button" class="w3-button w3-round w3-blue" id="bFiltro" value="FILTRO">
				<!-- <button class="w3-button w3-large w3-padding-large w3-round w3-red" id="bFullscreen">FSCREEN</button>  -->
			</div>
			<div class="w3-padding">
				<label class="w3-large w3-dark-gray w3-round">TIMER 3s: <input type="checkbox" id="ti" name="ti" value="timer"></label>
				<label class="w3-large w3-dark-gray w3-round">ZOOM: <select style="width: 50px;" id="zo">
					<option value="240">1</option>
					<option value="360">2</option>
					<option value="480" selected>3</option>
					<option value="600">4</option>
					<option value="720">5</option>
				</select></label>
				<label class="w3-large w3-dark-gray w3-round">SPEED:<select style="width: 50px;" id="fr">
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
				</select></label>
			</div>
				
			<br><br><button onclick="localStorage.clear();window.location.reload(true);">RELOAD</button>
				
			<!-- <input id="steprange" type="range" min="0" max="40" step="1" value="0"> -->

			<!-- <br clear="all"><br clear="all">
			<div style="text-align: center;"><span id="frameCount"></span></div> -->

		</div>
	</div>

<?php include_once "appFooter.php"; ?>

</body>
</html>