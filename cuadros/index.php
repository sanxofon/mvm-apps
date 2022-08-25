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
        <?php for($m=3;$m<=6;$m++){ $mm = $m*$m; ?>
        <div class="cuadro">
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