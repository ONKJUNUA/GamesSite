var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

var player = {
	x: canvas.width/2,
	y: canvas.height/2,
	width: 32,
	height: 32,
	speed: 5
};

var keysDown = {};

function update() {
	if (38 in keysDown) { // up arrow
		player.y -= player.speed;
	}
	if (40 in keysDown) { // down arrow
		player.y += player.speed;
	}
	if (37 in keysDown) { // left arrow
		player.x -= player.speed;
	}
	if (39 in keysDown) { // right arrow
		player.x += player.speed;
	}
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.beginPath();
ctx.arc(100, 100, 50, 0, 2 * Math.PI);
ctx.fillStyle = "#ffb6c1";
ctx.fill();

// draw body
ctx.fillRect(75, 150, 50, 100);
ctx.fillStyle = "#ff69b4";
ctx.fill();

// draw left arm
ctx.beginPath();
ctx.fillRect(20, 150, 50, 20);
ctx.fillStyle = "#ffb6c1";
ctx.fill();

// draw right arm
ctx.beginPath();
ctx.fillRect(130, 150, 50, 20);
ctx.fillStyle = "#ffb6c1";
ctx.fill();

// draw left leg
ctx.beginPath();
ctx.fillRect(75, 250, 20, 50);
ctx.fillStyle = "#ff69b4";
ctx.fill();

// draw right leg
ctx.beginPath();
ctx.fillRect(105, 250, 20, 50);
ctx.fillStyle = "#ff69b4";
ctx.fill();
	
ctx.fillStyle = "#FF0000";
ctx.fillRect(player.x, player.y, player.width, player.height);
}

function gameLoop() {
	update();
	draw();
	
	requestAnimationFrame(gameLoop);
}

gameLoop();

addEventListener("keydown", function(e) {
	keysDown[e.keyCode] = true;
});

addEventListener("keyup", function(e) {
	delete keysDown[e.keyCode];
});