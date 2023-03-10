const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width=840;
canvas.height=840;

const gravity = 1

class Player{
    constructor(){
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity ={
            x: 0,
            y: 1
        }
        this.width = 40;
        this.height = 40;
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

const player = new Player();

const keys = {
    a:{
        pressed:false
    },
    d:{
        pressed:false
    }
}

function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0,0,canvas.width,canvas.height);
    player.update();

    if (keys.d.pressed){
        player.velocity.x=10;
    } else if (keys.a.pressed){
        player.velocity.x=-10;
    }else player.velocity.x=0;

    
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