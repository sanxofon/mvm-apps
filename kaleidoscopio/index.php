<?php
include_once("appConfig.php");
include("appHeader.php");
$ancho_sidebar=400;
$ancho_logo=60;
?>
	<div id="cuerpo" class="w3-row" style="z-index:9;">
		<div class="w3-sidebar w3-animate-right lateral-sidebar" id="MVMSidebar">
			<img src="img/boton-logo.png" class="lateral-boton-close" onclick="w3_close()">
			<div class="lateral-container">
				<div class="lateral-header">Volver al Museo</div>
				<div class="w3-text-black styled-scrollbars lateral-main">
					<div class="w3-bar grisoscuro">
						<button style="width: 50%;" class="w3-bar-item w3-button lateral-tablink amarillo" onclick="openTabs(event,'aplicacion')">Aplicación</button>
						<button style="width: 50%;" class="w3-bar-item w3-button lateral-tablink" onclick="openTabs(event,'creditos')">Créditos</button>
					</div>
					<div class="lateral-tab" id="aplicacion">
						<div style="text-align:left;" class="w3-padding-large">
							<h2>Aplicación</h2>
							<p>
								Se pueden usar signos matemáticos en el texto: \(a \ne 0\),  \(ax^2 + bx + c = 0\), o como nueva línea:
								  \[x = {-b \pm \sqrt{b^2-4ac} \over 2a}\]
								<br>
								Para generar y mostrar signos matemáticos en las descripciones usamos la librería mathjax.org y escribir la expresión en <b>LaTeX</b> o <b>TeX</b>.
							</p>
							<h3>Ejemplos:</h3>

							<b>The Lorenz Equations</b>

							<p>
							\begin{align}
							\dot{x} &amp; = \sigma(y-x) \\
							\dot{y} &amp; = \rho x - y - xz \\
							\dot{z} &amp; = -\beta z + xy
							\end{align}
							</p>

							<b>The Cauchy-Schwarz Inequality</b>

							<p>\[
							\left( \sum_{k=1}^n a_k b_k \right)^{\!\!2} \leq
							\left( \sum_{k=1}^n a_k^2 \right) \left( \sum_{k=1}^n b_k^2 \right)
							\]</p>

							<b>A Cross Product Formula</b>

							<p>\[
							\mathbf{V}_1 \times \mathbf{V}_2 =
							\begin{vmatrix}
								\mathbf{i} &amp; \mathbf{j} &amp; \mathbf{k} \\
								\frac{\partial X}{\partial u} &amp; \frac{\partial Y}{\partial u} &amp; 0 \\
								\frac{\partial X}{\partial v} &amp; \frac{\partial Y}{\partial v} &amp; 0 \\
							\end{vmatrix}
							\]</p>

							<b>The probability of getting \(k\) heads when flipping \(n\) coins is:</b>

							<p>\[P(E) = {n \choose k} p^k (1-p)^{ n-k} \]</p>

							<b>An Identity of Ramanujan</b>

							<p>\[
							\frac{1}{(\sqrt{\phi \sqrt{5}}-\phi) e^{\frac25 \pi}} =
								1+\frac{e^{-2\pi}} {1+\frac{e^{-4\pi}} {1+\frac{e^{-6\pi}}
								{1+\frac{e^{-8\pi}} {1+\ldots} } } }
							\]</p>

							<b>Maxwell's Equations</b>

							<p>
							\begin{align}
							\nabla \times \vec{\mathbf{B}} -\, \frac1c\, \frac{\partial\vec{\mathbf{E}}}{\partial t} &amp; = \frac{4\pi}{c}\vec{\mathbf{j}} \\
							\nabla \cdot \vec{\mathbf{E}} &amp; = 4 \pi \rho \\
							\nabla \times \vec{\mathbf{E}}\, +\, \frac1c\, \frac{\partial\vec{\mathbf{B}}}{\partial t} &amp; = \vec{\mathbf{0}} \\
							\nabla \cdot \vec{\mathbf{B}} &amp; = 0
							\end{align}
							</p>

						</div>
					</div>
					<div class="lateral-tab" id="creditos" style="display:none;">
						<div style="text-align:left;" class="w3-padding-large">
							<h2>Créditos</h2>
							<p>
								Praesent eleifend lorem velit, et tristique erat euismod iaculis. Duis vestibulum nunc quis velit egestas, ut bibendum nunc placerat. Fusce at leo at nibh varius ornare. Sed sed sodales ex. Nam quis congue metus. Ut suscipit augue a purus cursus, a lobortis diam blandit. Aliquam magna erat, ultricies id varius id, rutrum sed ex. Etiam id cursus sem. Nam at convallis ipsum. Ut quis sem ut ex viverra vestibulum vel nec dui. Nunc vehicula at purus non viverra.
							</p>
						</div>
					</div>
				</div>
				<div class="lateral-footer"><img src="img/footer-lateral.png" class="lateral-footer-img"></div>
			</div>
		</div>
		<img src="img/boton-logo.png" class="lateral-boton-open" onclick="w3_open()">
		<div id="countdown"><sm>&#128247;</sm></div>
		<div id="contenedor" class="w3-twothird"></div>
		<div id="derecha" class="w3-third w3-bar">
			<div class="w3-padding">
				<input type="image" src="img/foto.png" style="width:90px;" class="botimg" id="bFoto" title="Tomar Foto">
				<input type="image" src="img/grabar.png" style="width:90px;" class="botimg" id="bVideo" title="Grabar Video">
			</div>
			<div class="w3-padding">
				<input type="image" src="img/timer.png" style="width:50px;margin-right:5px;" class="botimg" id="ti" title="Timer: 3s">
				<input type="image" src="img/flip.png" style="width:50px;display:none;" class="botimg" id="bSwitch" title="Cámara Forntal/Trasera">
				<input type="image" src="img/filtro.png" style="width:50px;margin-left:5px;" class="botimg" id="bFiltro" title="Filtros">
			</div>
			<br>
			<div class="w3-padding">
				<img src="img/algoritmo.png" class="icoimg" style="width: 40px;" title="Selecciona un Algoritmo">
				<select title="Selecciona un Algoritmo" class="w3-black w3-round" style="border:none;height:40px;width:120px;" onchange="window.location='?a='+this.value;">
					<option value="" disabled selected>Algoritmo</option>
					<option value="k">Kaleidoscopio</option>
					<option value="e">Espejo</option>
					<option value="a">Agua</option>
					<option value="t">Hiperbólica</option>
				</select>
			</div>
			<div class="w3-padding">
				<!-- <input style="display:none;" type="button" class="w3-button w3-round w3-purple" id="bSwitch" value="SWITCH"> -->
				<!-- <input type="button" class="w3-button w3-round w3-blue" id="bFiltro" value="FILTRO"> -->
				<!-- <button class="w3-button w3-large w3-padding-large w3-round w3-red" id="bFullscreen">FSCREEN</button>  -->
			</div>
			<div class="w3-padding">
				<!-- <label class="w3-large w3-dark-gray w3-round">TIMER 3s: <input type="checkbox" id="ti" name="ti" value="timer"></label> -->
				<label title="Zoom" style="width: 50%;display:inline;">
					<img type="image" src="img/zoom.png" style="height:40px;width:40px;" class="icoimg" title="Zoom">
					<select style="height:40px;width: 34px;border:none;" class="w3-black w3-round" id="zo">
						<option value="240">1</option>
						<option value="360">2</option>
						<option value="480" selected>3</option>
						<option value="600">4</option>
						<option value="720">5</option>
					</select>
				</label><label title="FPS: Cuadros por Segundo" style="width: 50%;display:inline;">
					<img type="image" src="img/speed.png" style="height:40px;width:40px;" class="icoimg" title="FPS: Cuadros por Segundo">
					<select style="height:40px;width:40px;border:none;" class="w3-black w3-round"" class="w3-black w3-round" id="fr">
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