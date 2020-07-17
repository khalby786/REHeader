var c = document.getElementById("preview");
var ctx = c.getContext("2d");

ctx.fillStyle = "pink";
ctx.fillRect(0, 0, c.width, c.height);

ctx.fillStyle = "black";
ctx.font = "40px Arial";
ctx.fillText("Hi, I am", 50, 70);