//setting up

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width=840;
canvas.height=840;

const gravity = 1

//classes

class Player{
    constructor(){
        this.position = {
            x:100,
            y:100
        }
        this.velocity ={
            x:0,
            y:1
        }
        this.width=40;
        this.height=40;
    }
    draw(){
        c.fillStyle = '#fff';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
    update(){
        this.draw();
        this.position.y+=this.velocity.y;
        this.position.x+=this.velocity.x;
        if (this.position.y + this.height + this.velocity.y < canvas.height)
            this.velocity.y += gravity;
        else {
            this.velocity.y=0;
            if (player.velocity.y===0 && canJump){
                player.velocity.y=-20;
                jumpsNumber++;
                    if (jumpsNumber===3){
                        player.velocity.y=-30;
                        jumpsNumber=0;
                    }
            }
        }
    }
}

class Platform{
    constructor({x,y}){
        this.position={x,y}
        this.width=40;
        this.height=40;
    }
    draw(){
        c.fillStyle = '#fff';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

const player = new Player();
const platforms = [new Platform({x: 100, y:640}), new Platform({x: 240, y:640}), new Platform({x: 280, y:640}), new Platform({x: 320, y:640})];
const keys = {
    a:{pressed:false},
    d:{pressed:false}
}

//changeable variables

let lastKey;
let canJump=false;
let jumpsNumber=0;

//animate function

function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0,0,canvas.width,canvas.height);
    player.update();
    platforms.forEach(platform => {
        platform.draw();
    });

    platforms.forEach(platform => {
        if (player.position.y + player.height <= platform.position.y 
            && player.position.y + player.height+player.velocity.y > platform.position.y
            && player.position.x + player.width >= platform.position.x
            && player.position.x <= platform.position.x + platform.width){
                player.velocity.y=0;
                if (player.velocity.y===0 && canJump){
                    player.velocity.y=-20;
                    jumpsNumber++;
                    if (jumpsNumber===3){
                        player.velocity.y=-30;
                        jumpsNumber=0;
                    }
                }
            }
    });

    if (keys.d.pressed && player.position.x < 420 && lastKey==="d"){
        player.velocity.x=10;
    } else if (keys.a.pressed && player.position.x > 210 && lastKey==="a"){
        player.velocity.x=-10;
    }else {
        player.velocity.x=0;
        if (keys.d.pressed && lastKey==="d"){
            platforms.forEach(platform => {
                platform.position.x-=10;
            })
        } else if (keys.a.pressed && lastKey==="a"){
            platforms.forEach(platform => {
                platform.position.x+=10;
            })
        }
    };
};

animate();

//event listeners

addEventListener('keydown',({key})=>{
    switch(key){
        case 'w':
        case "ArrowUp":
            canJump = true;
            break;
        case 'a':
        case "ArrowLeft":
            lastKey="a";
            keys.a.pressed = true;
            break;
        case 'd':
        case "ArrowRight":
            lastKey="d";
            keys.d.pressed = true;
            break;
    }
});

addEventListener('keyup',({key})=>{
    switch(key){
        case 'w':
        case "ArrowUp":
            canJump = false;
            jumpsNumber=0;
            break;
        case 'a':
        case "ArrowLeft":
            lastKey="d";
            keys.a.pressed = false;
            break;
        case 'd':
        case "ArrowRight":
            lastKey="a";
            keys.d.pressed = false;
            break;
    }
});