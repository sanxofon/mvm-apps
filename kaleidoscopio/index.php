<?php
include_once("appConfig.php");
include("appHeader.php");
?>

<!-- Header -->
<header class="w3-center w3-black w3-padding-64 w3-opacity w3-hover-opacity-off">
  <h1 class="w3-center"><b><?php echo $app_name; ?></b> <?php echo $app_version; ?></h1>
</header>

<div class="w3-content w3-card">
  <h2 class="w3-center"><em><?php echo $app_description; ?></em></h2>
  <div class="w3-center"><a href="appStart.php"><img style="width: 100%;" src="<?php echo $app_server.$app_path."img/launcher-icon-512.png"; ?>"></a></div>
</div>

<!-- Footer -->
<footer class="w3-center w3-black w3-padding-64 w3-opacity w3-hover-opacity-off">
  <p><b><?php echo $app_name; ?></b> - &copy; (<?php echo $app_year; ?>) <a href="//twitter.com/<?php echo $app_authorTwitter; ?>" target="_blank"><?php echo $app_author; ?></a></p>
</footer>

<?php include_once "appFooter.php"; ?>

</body>
</html>