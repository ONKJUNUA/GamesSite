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
const map = {
    width: 800,
    height: 600
  };

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

    if (player.x < 0) {
        player.x = 0;
      }
      if (player.y < 0) {
        player.y = 0;
      }
      if (player.x + player.width > map.width) {
        player.x = map.width - player.width;
      }
      if (player.y + player.height > map.height) {
        player.y = map.height - player.height;
      }
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.beginPath();
ctx.arc(player.x+player.width/2, player.y-player.height*2, 50, 0, 2 * Math.PI);
ctx.fillStyle = "#ffb6c1";
ctx.fill();

// draw body
ctx.fillRect(player.x-player.width, player.y, player.width*3, player.height*5);
ctx.fillStyle = "#ff69b4";
ctx.fill();

// draw left arm
ctx.beginPath();
ctx.fillRect(player.x-player.width*4.5, player.y, player.width*3, player.height);
ctx.fillStyle = "#ffb6c1";
ctx.fill();

// draw right arm
ctx.beginPath();
ctx.fillRect(player.x+player.width*2.5, player.y, player.width*3, player.height);
ctx.fillStyle = "#ffb6c1";
ctx.fill();

// draw left leg
ctx.beginPath();
ctx.fillRect(player.x-player.width, player.y+player.width*5.5, player.width, player.height*3);
ctx.fillStyle = "#ff69b4";
ctx.fill();

// draw right leg
ctx.beginPath();
ctx.fillRect(player.x+player.width, player.y+player.width*5.5, player.width, player.height*3);
ctx.fillStyle = "#ff69b4";
ctx.fill();
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