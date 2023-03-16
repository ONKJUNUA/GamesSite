//setting up

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width=1280;
canvas.height=960;

const gravity = 2

//classes

class Player{
    constructor({image}){
        this.position = {
            x:160,
            y:640
        }
        this.velocity ={
            x:0,
            y:0
        }
        this.width=48;
        this.height=64;
        this.image=image;
    }
    draw() {
        c.drawImage(this.image,this.position.x,this.position.y)
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
                player.velocity.y=-32;
                jumpsNumber++;
                    if (jumpsNumber===3){
                        //player.velocity.y=-48;
                        jumpsNumber=0;
                    }
            }
        }
    }
}

class Block{
    constructor({x,y}){
        this.position={x,y}
        this.width=64;
        this.height=64;
    }
    draw(){
        c.fillStyle = '#fff';
        c.fillRect(this.position.x, this.position.y+2, 28, 18);
        c.fillRect(this.position.x+2, this.position.y+24, 60, 20);
        c.fillRect(this.position.x, this.position.y+48, 28, 18);

        c.fillRect(this.position.x+32, this.position.y+2, 32, 18);
        c.fillRect(this.position.x+32, this.position.y+48, 32, 18);
    }
}

class Coin{
    constructor({x,y}){
        this.position={x,y}
        this.width=32;
        this.height=32;
    }
    draw(){
        c.beginPath()
        c.ellipse(this.position.x-2,this.position.y-2, 15, 25, 0, 0,Math.PI*2);
        c.fillStyle='#fff'
        c.fill()
        c.closePath()
        c.beginPath()
        c.ellipse(this.position.x-2,this.position.y-2, 10, 15, 0, 0,Math.PI*2);
        c.fillStyle='#222'
        c.fill()
        c.closePath()
        c.beginPath()
        c.ellipse(this.position.x-6,this.position.y-4, 10, 15, 0, 0,Math.PI*2);
        c.fillStyle='#fff'
        c.fill()
        c.closePath()
    }
}

function createImage(src) {
    const image=new Image()
    image.src=src
    return image
}

const player = new Player({image: createImage('img/gracz.png')});
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
let scrollScreen=160;
let speed=8;

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
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','b',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','f'],
    [' ',' ',' ',' ',' ','b','b','b',' ',' ',' ',' ',' ',' ',' ','b',' ',' ',' ',' ',' ',' ',' ',' ','b','b','b',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','b','b','b',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','f'],
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','b',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','f'],
    [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','c',' ',' ',' ',' ','b',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','f']
    ];

function map_creation(){
    map1.forEach((row, i) => {
        row.forEach((symbol, j) => {
            switch (symbol) {
                case 'b':
                    blocks.push(
                        new Block({
                            x: 64*j,
                            y: 64*i
                        })
                    )
                break;
                case 'c':
                    coins.push(
                        new Coin({
                            x: 64*j+32,
                            y: 64*i+32
                        })
                    )
                break;
            }
        })
    })
    blocks.push(
        new Block({
            x: -64,
            y: -64
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
           && player.position.y < block.position.y + block.height){
            if (lastKey==='d' && player.position.x < block.position.x) player.position.x=block.position.x-player.width-10;
            if (lastKey==='a' && player.position.x > block.position.x) player.position.x=block.position.x+block.width+10;
           }
           

        if (player.position.y >= block.position.y + block.height
            && player.position.y + player.velocity.y <= block.position.y + block.height
            && player.position.x + player.width > block.position.x
            && player.position.x < block.position.x + block.width){
                player.velocity.y=4;
                jumpsNumber=0;

                if (blocks[index+1].position.x===block.position.x+64
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
                    player.velocity.y=-32;
                    jumpsNumber++;
                    if (jumpsNumber===3){
                        //player.velocity.y=-48;
                        jumpsNumber=0;
                    }
                }
            }
    });

    if (keys.d.pressed && player.position.x < 420 && lastKey==="d" && xblocks){
        player.velocity.x=speed;
        scrollScreen+=speed;
    } else if ((keys.a.pressed && player.position.x > 200 && lastKey==="a" && xblocks)||(keys.a.pressed && lastKey==="a" && scrollScreen <= 200 && player.position.x > 0 && xblocks)){
        player.velocity.x=-speed;
        scrollScreen-=speed;
    }else {
        player.velocity.x=0;
        if (keys.d.pressed && lastKey==="d" && xblocks){
            blocks.forEach(block => {
                block.position.x-=speed;
                scrollScreen+=speed;
            })
            coins.forEach(coin => {
                coin.position.x-=speed;
            })
        } else if ((keys.a.pressed && lastKey==="a" && xblocks && scrollScreen > 0)){
            blocks.forEach(block => {
                block.position.x+=speed;
                scrollScreen-=speed;
            })
            coins.forEach(coin => {
                coin.position.x+=speed;
            })
        }
        if ((keys.d.pressed || keys.a.pressed) && speed < 24) speed+=1;
        if (!keys.d.pressed && !keys.a.pressed) speed=8;
        if (player.position.x<=0) player.position.x=0;
    
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