function init()
{
	if (window.DeviceOrientationEvent) {
		
		window.addEventListener("deviceorientation", function(event) 
		{
			document.getElementById("y").style.transform = "scaleY("+(Math.round(event.beta))+")";  
			document.getElementById("x").style.transform = "scaleX("+(Math.round(event.gamma))+")";
			document.getElementById("angle").style.transform = "rotateZ("+(Math.round(event.alpha))+"deg)";  
		}, true);
		
		
		
	} else {
  	alert("Sorry, your browser doesn't support Device Orientation");
	} 
}