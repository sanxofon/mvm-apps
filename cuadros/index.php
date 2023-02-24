<!DOCTYPE html>
<html lang="es" xml:lang="es">
<head>
    <meta charset="utf-8">
    <meta id="viewport" name="viewport" content="initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
    <title>Arrastrar cuadros</title>
	<link rel="stylesheet" type="text/css" href="theme.css.php">
</head>
<body>
    <div class="container">
        <h1>Cuadros mágicos</h1>
        <div><select id="cuadroNum">
        <option value="3">3 x 3 : [1-9] => 15</option>
        <option value="4">4 x 4 : [1-16] => 34</option>
        <option value="5">5 x 5 : [1-25] => 65</option>
        <option value="6">6 x 6 : [1-36] => 111</option>
        </select></div>
        <?php for($m=3;$m<=6;$m++){ $mm = $m*$m; ?>
        <div class="cuadro" id="cuadro<?php echo $m; ?>">
            <div class="grid">
                <div id="grid<?php echo $m."x".$m; ?>">
                <?php for($i=1;$i<=$mm;$i++){ ?>
                    <div class="grid-square"><?php echo $i; ?></div>
                <?php } ?>
                </div>
            </div>
            <button onclick="ordenar(<?php echo $m; ?>)">ORDENAR</button>
            <button onclick="ordenar(<?php echo $m; ?>,true)">DESORDENAR</button>
            <button onclick="solucion(<?php echo $m; ?>)">SOLUCIÓN</button>
            <pre><code id="salida<?php echo $m."x".$m; ?>"></code></pre>
        </div>
            <?php } ?>
	</div>

<script src="sortable.1.14.0.js"></script>
<script src="app.js.php"></script>

<script type="text/javascript">
let cuadroNum = 3;
document.getElementById('cuadroNum').value=cuadroNum;
function changeCuadroNum(cuadroNum){
  cuadroNum = parseInt(cuadroNum);
  for (let i = 3; i <= 6; i++) {
    if(i!=cuadroNum) {
      document.getElementById('cuadro'+String(i)).style.display='none';
    } else {
      document.getElementById('cuadro'+String(i)).style.display='block';
    }
  }
}
document.getElementById('cuadroNum').addEventListener('change', function(){
  changeCuadroNum(this.value);
});
changeCuadroNum(cuadroNum);

//mobile viewport hack
(function(){

  function apply_viewport(){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)   ) {

      var ww = window.screen.width;
      var mw = 520; // min width of site
      var ratio =  ww / mw; //calculate ratio
      var viewport_meta_tag = document.getElementById('viewport');
      if( ww < mw){ //smaller than minimum size
        viewport_meta_tag.setAttribute('content', 'initial-scale=' + ratio + ', maximum-scale=' + ratio + ', minimum-scale=' + ratio + ', user-scalable=no, width=' + mw);
      }
      else { //regular size
        viewport_meta_tag.setAttribute('content', 'initial-scale=1.0, maximum-scale=1, minimum-scale=1.0, user-scalable=yes, width=' + ww);
      }
    }
  }

  //ok, i need to update viewport scale if screen dimentions changed
  window.addEventListener('resize', function(){
    apply_viewport();
  });

  apply_viewport();

}());
</script>

</body>
</html>