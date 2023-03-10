const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width=840;
canvas.height=840;

const gravity = 1

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
        else this.velocity.y=0
    }
}

class Platform{
    constructor({x,y}){
        this.position={x,y}
        this.width=400;
        this.height=40;
    }
    draw(){
        c.fillStyle = '#fff';
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

const player = new Player();
const platforms = [new Platform({x: 400, y:440}), new Platform({x: 200, y:640})];
const keys = {
    a:{pressed:false},
    d:{pressed:false}
}

function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0,0,canvas.width,canvas.height);
    player.update();
    platforms.forEach(platform => {
        platform.draw();
    });

    if (keys.d.pressed && keys.a.pressed){
        player.velocity.x=0;
    } else if (keys.d.pressed && player.position.x < 420){
        player.velocity.x=10;
    } else if (keys.a.pressed && player.position.x > 210){
        player.velocity.x=-10;
    }else {
        player.velocity.x=0;
        if (keys.d.pressed){
            platforms.forEach(platform => {
                platform.position.x-=10;
            })
        } else if (keys.a.pressed){
            platforms.forEach(platform => {
                platform.position.x+=10;
            })
        }
    }
    platforms.forEach(platform => {
        if (player.position.y + player.height <= platform.position.y 
            && player.position.y+player.height+player.velocity.y > platform.position.y
            && player.position.x+player.width >= platform.position.x
            && player.position.x <= platform.position.x+platform.width){
            player.velocity.y=0;
        }
    })
}

animate();

addEventListener('keydown',({key})=>{
    switch(key){
        case 'w':
        case "ArrowUp":
            player.velocity.y=-20;
            break;
        case 'a':
        case "ArrowLeft":
            keys.a.pressed = true;
            break;
        case 'd':
        case "ArrowRight":
            keys.d.pressed = true;
            break;
    }
});

addEventListener('keyup',({key})=>{
    switch(key){
        case 'a':
        case "ArrowLeft":
            keys.a.pressed = false;
            break;
        case 'd':
        case "ArrowRight":
            keys.d.pressed = false;
            break;
    }
});