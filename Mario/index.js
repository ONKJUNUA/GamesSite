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
            x:200,
            y:760
        }
        this.velocity ={
            x:0,
            y:0
        }
        this.width=40;
        this.height=40;
    }
    draw(){
        c.fillStyle = '#777';
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

class Block{
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
const blocks = [new Block({x: 80, y:640}),new Block({x: 120, y:640}),new Block({x: 160, y:640}), 
    new Block({x: 200, y:640}),new Block({x:240, y:480}), new Block({x: 80, y:480}), new Block({x: 440, y:320}), 
    new Block({x: 600, y:320}),new Block({x: 8000, y:320})];
const keys = {
    a:{pressed:false},
    d:{pressed:false}
}

//changeable variables

let lastKey;
let canJump=false;
let jumpsNumber=0;
let xblocks = true;
let scrollScreen=200;

//animate function

function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0,0,canvas.width,canvas.height);
    blocks.forEach(block => {
        block.draw();
    });

    if (player.position.y>0)
        xblocks=true

    blocks.forEach((block, index) => {
       if (player.position.x + player.width + player.velocity.x >= block.position.x
           && player.position.x + player.velocity.x <= block.position.x + block.width
           && player.position.y + player.height > block.position.y
           && player.position.y <= block.position.y + block.height){
               xblocks=false;
           }
        if (player.position.y >= block.position.y + block.height
            && player.position.y + player.velocity.y <= block.position.y + block.height
            && player.position.x + player.width >= block.position.x
            && player.position.x <= block.position.x + block.width){
                player.velocity.y=5;
                jumpsNumber=0;

                if (blocks[index+1].position.x===block.position.x+40
                    && player.position.x > block.position.x + (block.width/2)
                    && blocks[index+1].position.y===block.position.y)
                    setTimeout(() => {
                        blocks[index+1].position.y-=4;
                        setTimeout(() => {
                            blocks[index+1].position.y-=4;
                            setTimeout(() => {
                                blocks[index+1].position.y-=4;
                                setTimeout(() => {
                                    blocks[index+1].position.y-=4;
                                    setTimeout(() => {
                                        blocks[index+1].position.y-=4;
                                        setTimeout(() => {
                                            blocks[index+1].position.y+=4;
                                            setTimeout(() => {
                                                blocks[index+1].position.y+=4;
                                                setTimeout(() => {
                                                    blocks[index+1].position.y+=4;
                                                    setTimeout(() => {
                                                        blocks[index+1].position.y+=4;
                                                        setTimeout(() => {
                                                            blocks[index+1].position.y+=4;
                                                          }, 10);
                                                      }, 10);
                                                  }, 10);
                                              }, 10);
                                          }, 10);
                                      }, 10);
                                  }, 10);
                              }, 10);
                          }, 10);
                      }, 10);

                else setTimeout(() => {
                        block.position.y-=4;
                        setTimeout(() => {
                            block.position.y-=4;
                            setTimeout(() => {
                                block.position.y-=4;
                                setTimeout(() => {
                                    block.position.y-=4;
                                    setTimeout(() => {
                                        block.position.y-=4;
                                        setTimeout(() => {
                                            block.position.y+=4;
                                            setTimeout(() => {
                                                block.position.y+=4;
                                                setTimeout(() => {
                                                    block.position.y+=4;
                                                    setTimeout(() => {
                                                        block.position.y+=4;
                                                        setTimeout(() => {
                                                            block.position.y+=4;
                                                          }, 10);
                                                      }, 10);
                                                  }, 10);
                                              }, 10);
                                          }, 10);
                                      }, 10);
                                  }, 10);
                              }, 10);
                          }, 10);
                      }, 10);
            }
           
        else if (player.position.y + player.height <= block.position.y 
            && player.position.y + player.height + player.velocity.y > block.position.y
            && player.position.x + player.width >= block.position.x
            && player.position.x <= block.position.x + block.width){    
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
    player.update();



    if (keys.d.pressed && player.position.x < 420 && lastKey==="d" && xblocks){
        player.velocity.x=10;
        scrollScreen+=10;
    } else if ((keys.a.pressed && player.position.x > 200 && lastKey==="a" && xblocks)||(keys.a.pressed && lastKey==="a" && scrollScreen <= 200 && player.position.x > 0 && xblocks)){
        player.velocity.x=-10;
        scrollScreen-=10;
    }else {
        player.velocity.x=0;
        if (keys.d.pressed && lastKey==="d" && xblocks){
            blocks.forEach(block => {
                block.position.x-=10;
                scrollScreen+=10;
            })
        } else if ((keys.a.pressed && lastKey==="a" && xblocks && scrollScreen > 0)){
            blocks.forEach(block => {
                block.position.x+=10;
                scrollScreen-=10;
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