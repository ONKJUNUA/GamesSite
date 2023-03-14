//setting up

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width=800;
canvas.height=800;

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
        c.fillStyle = '#fff';
        c.fillRect(this.position.x+10, this.position.y, 20, 20);
        c.fillRect(this.position.x, this.position.y+10, 40, 10);
        c.fillRect(this.position.x+30, this.position.y+10, 10, 30);
        c.fillRect(this.position.x, this.position.y+10, 10, 30);
    }
    update(){
        this.draw();
        this.position.y+=this.velocity.y;
        this.position.x+=this.velocity.x;
        if (this.position.y < 0)
            this.velocity.y =5;
        else if (this.position.y + this.height + this.velocity.y < canvas.height)
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
        c.fillRect(this.position.x, this.position.y, 18, 12);
        c.fillRect(this.position.x+1, this.position.y+14, 38, 12);
        c.fillRect(this.position.x, this.position.y+28, 18, 12);

        c.fillRect(this.position.x+20, this.position.y, 20, 12);
        c.fillRect(this.position.x+20, this.position.y+28, 20, 12);
    }
}

class Coin{
    constructor({x,y}){
        this.position={x,y}
        this.width=20;
        this.height=20;
    }
    draw(){
        c.beginPath()
        c.ellipse(this.position.x-2,this.position.y-2, 10, 15, 0, 0,Math.PI*2);
        c.fillStyle='#fff'
        c.fill()
        c.closePath()
        c.beginPath()
        c.ellipse(this.position.x-2,this.position.y-2, 5, 10, 0, 0,Math.PI*2);
        c.fillStyle='#222'
        c.fill()
        c.closePath()
        c.beginPath()
        c.ellipse(this.position.x-4,this.position.y-4, 5, 10, 0, 0,Math.PI*2);
        c.fillStyle='#fff'
        c.fill()
        c.closePath()
    }
}

const player = new Player();
const blocks = [];
const coins = [];

const keys = {
    a:{pressed:false},
    d:{pressed:false}
};

//changeable variables

let lastKey;
let canJump=false;
let jumpsNumber=0;
let xblocks = true;
let scrollScreen=200;

//maps

const map1 = [
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','f'],
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','f'],
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','f'],
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','f'],
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','b','b','b',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','b','b','b',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','b','b','b',' ',' ',' ',' ',' ',' ','f'],
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','f'],
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','f'],
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','f'],
    [' ',' ',' ',' ',' ',' ',' ',' ','b','b','b',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','b','b','b',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','b','b','b',' ',' ',' ',' ',' ',' ',' ',' ',' ','f'],
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','f'],
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','f'],
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','f'],
    [' ',' ',' ',' ',' ','b','b','b',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','b','b','b',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','b','b','b',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','f'],
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','f'],
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','f'],
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','f'],
    [' ',' ','b','b','b',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','b','b','b',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','b','b','b',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','f'],
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','f'],
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','f'],
    [' ',' ',' ',' ',' ',' ',' ',' ',' ','c','c','c','c','c','c',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','f']
    ];

function map_creation(){
    map1.forEach((row, i) => {
        row.forEach((symbol, j) => {
            switch (symbol) {
                case 'b':
                    blocks.push(
                        new Block({
                            x: 40*j,
                            y: 40*i
                        })
                    )
                break;
                case 'c':
                    coins.push(
                        new Coin({
                            x: 40*j+20,
                            y: 40*i+20
                        })
                    )
                break;
            }
        })
    })
    blocks.push(
        new Block({
            x: -40,
            y: -40
        })
    )
}

map_creation();

//animate function

function animate(){
    requestAnimationFrame(animate);
    c.clearRect(0,0,canvas.width,canvas.height);
    coins.forEach(coin => {
        coin.draw();
    });
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
            coins.forEach(coin => {
                coin.position.x-=10;
            })
        } else if ((keys.a.pressed && lastKey==="a" && xblocks && scrollScreen > 0)){
            blocks.forEach(block => {
                block.position.x+=10;
                scrollScreen-=10;
            })
            coins.forEach(coin => {
                coin.position.x+=10;
            })
        }
    };
    player.update();
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