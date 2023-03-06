<!DOCTYPE html>
<html lang="es" xml:lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, user-scalable=0, minimal-ui">
	<script>
	var viewport = document.querySelector("meta[name=viewport]");
	var ratio = window.innerWidth/522;
	// alert(ratio);
	viewport.setAttribute( 'content', 'initial-scale=' + ratio );
	</script>
	<style>@viewport {
		viewport-fit: auto;
	}</style>
  <script src="https://unpkg.com/h264-mp4-encoder/embuild/dist/h264-mp4-encoder.web.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/p5@1.5.0/lib/p5.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/mobile-detect@1.4.4/mobile-detect.min.js"></script>
  <script src="filtro.lista.js"></script>
  <!-- <meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" name="viewport"/> -->
  <!-- <meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1.0, maximum-scale=1.0"/> -->
  <!-- Search Engine -->
  <meta name="description" content="<?php echo $app_description; ?>">
  <meta name="image" content="<?php echo $app_server.$app_path; ?>img/app_705x368.png">
  <meta name="author" content="<?php echo $app_author; ?>">
  <link rel="manifest" href="<?php echo $app_server.$app_path; ?>manifest.php">
  <title><?php echo $app_name; ?> <?php echo $app_version; ?></title>
  <meta name="theme-color" content="#202020" />
  <!-- Allow web app to be run in full-screen mode. -->
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="mobile-web-app-capable" content="yes">
  <meta name="application-name" content="<?php echo $app_name; ?>">
  <meta name="apple-mobile-web-app-title" content="<?php echo $app_name; ?>">
  <meta name="apple-mobile-web-app-status-bar-style" content="black">
  <link rel="apple-touch-icon" href="<?php echo $app_server.$app_path; ?>img/launcher-icon-4x.png">
  <!-- Open Graph general (Facebook, Pinterest & Google+) -->
  <meta name="og:title" content="<?php echo $app_name; ?> <?php echo $app_version; ?>">
  <meta name="og:description" content="<?php echo $app_description; ?>">
  <meta name="og:image" content="<?php echo $app_server.$app_path; ?>img/app.jpg">
  <meta name="og:url" content="<?php echo $app_server.$app_path; ?>">
  <meta name="og:site_name" content="<?php echo $app_name; ?>">
  <meta name="og:locale" content="es_MX">
  <meta name="og:type" content="app">
  <meta name="website:author" content="<?php echo $app_author; ?>">
  <!-- Schema.org for Google -->
  <meta itemprop="name" content="<?php echo $app_name; ?>">
  <meta itemprop="description" content="<?php echo $app_description; ?>">
  <meta itemprop="image" content="<?php echo $app_server.$app_path; ?>img/app.jpg">
  <!-- Twitter -->
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="<?php echo $app_name; ?>">
  <meta name="twitter:description" content="<?php echo $app_description; ?>">
  <meta name="twitter:site" content="<?php echo $app_authorTwitter; ?>">
  <meta name="twitter:creator" content="<?php echo $app_authorTwitter; ?>">
  <meta name="twitter:image:src" content="<?php echo $app_server.$app_path; ?>img/app.jpg">
  
  <!-- mathjax.org -->
  <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
  <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
  <!-- Modales y alertas -->
  <script src="sweetalert2.min.js"></script>
  
  <!-- Disable automatic phone number detection. -->
  <meta name="format-detection" content="telephone=no">
  <!-- FAVICON -->
  <link rel="shortcut icon" href="<?php echo $app_server.$app_path; ?>img/favicon.png" type="image/png">
  <link rel="icon" href="<?php echo $app_server.$app_path; ?>img/favicon.png" type="image/png">
  <!-- STYLES -->
  <link rel="stylesheet" href="<?php echo $app_server.$app_path; ?>w3.css">
  <link rel="stylesheet" href="<?php echo $app_server.$app_path; ?>style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Alata&family=Anton&family=Courier+Prime&display=swap" rel="stylesheet">
  <style>
    body,h1,h2,h3,h4,h5,h6 {font-family: "Lato", sans-serif;}
    body, html {
      height: 100%;
      color: #777;
      line-height: 1.8;
    }
    .alata {
      font-family: 'Alata', sans-serif;
    }
    .anton {
      font-family: 'Anton', sans-serif;
    }
    .courier {
      font-family: 'Courier Prime', monospace;
    }

    .w3-wide {letter-spacing: 10px;}
    .w3-hover-opacity {cursor: pointer;}

  </style>
</head>
<body>