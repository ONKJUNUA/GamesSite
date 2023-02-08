const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

class Boundary {
    static width = 40
    static height = 40
    constructor({position, image}){
        this.position=position
        this.width=40
        this.height=40
        this.image=image
    }

    draw() {
        c.drawImage(this.image,this.position.x,this.position.y)
    }
}

class Player {
    constructor({position,velocity}){
        this.position=position
        this.velocity=velocity
        this.radius=15
    }
    draw(){
        c.beginPath()
        c.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2)
        c.fillStyle='white'
        c.fill()
        c.closePath()
    }
    update(){
        this.draw()
        this.position.x+=this.velocity.x
        this.position.y+=this.velocity.y
    }
}

class Palet {
    constructor({position}){
        this.position=position
        this.radius=3
    }
    draw(){
        c.beginPath()
        c.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2)
        c.fillStyle='white'
        c.fill()
        c.closePath()
    }
}

const palets = []
const boundaries = []
const player = new Player({
    position: {
        x:Boundary.width + Boundary.width/2,
        y:Boundary.height + Boundary.height/2
    },
    velocity: {
        x:0,
        y:0
    }
})

const keys = {
    w:{
        pressed:false
    },
    a:{
        pressed:false
    },
    s:{
        pressed:false
    },
    d:{
        pressed:false
    }
}
let lastKey = ''
let lastKeyws = ''
let lastKeyad = ''

const map = [
    ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
    ['|', 'p', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '^', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
    ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
    ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
    ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '_', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
    ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
  ]

function createImage(src) {
    const image=new Image()
    image.src=src
    return image
}

map.forEach((row, i) => {
    row.forEach((symbol, j) => {
      switch (symbol) {
        case '-':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('./img/boundaries/pipeHorizontal.png')
            })
          )
          break
        case '|':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('./img/boundaries/pipeVertical.png')
            })
          )
          break
        case '1':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('./img/boundaries/pipeCorner1.png')
            })
          )
          break
        case '2':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('./img/boundaries/pipeCorner2.png')
            })
          )
          break
        case '3':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('./img/boundaries/pipeCorner3.png')
            })
          )
          break
        case '4':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('./img/boundaries/pipeCorner4.png')
            })
          )
          break
        case 'b':
          boundaries.push(
            new Boundary({
              position: {
                x: Boundary.width * j,
                y: Boundary.height * i
              },
              image: createImage('./img/boundaries/block.png')
            })
          )
          break
        case '[':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('./img/boundaries/capLeft.png')
            })
          )
          break
        case ']':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('./img/boundaries/capRight.png')
            })
          )
          break
        case '_':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('./img/boundaries/capBottom.png')
            })
          )
          break
        case '^':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('./img/boundaries/capTop.png')
            })
          )
          break
        case '+':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('./img/boundaries/pipeCross.png')
            })
          )
          break
        case '5':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('./img/boundaries/pipeConnectorTop.png')
            })
          )
          break
        case '6':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('./img/boundaries/pipeConnectorRight.png')
            })
          )
          break
        case '7':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('./img/boundaries/pipeConnectorBottom.png')
            })
          )
          break
        case '8':
          boundaries.push(
            new Boundary({
              position: {
                x: j * Boundary.width,
                y: i * Boundary.height
              },
              image: createImage('./img/boundaries/pipeConnectorLeft.png')
            })
          )
          break
        case '.':
          palets.push(
            new Palet({
              position: {
                x: j * Boundary.width + Boundary.width / 2,
                y: i * Boundary.height + Boundary.height / 2
              }
            })
          )
          break
      }
    })
  })

function circleColliderWithRectangle({circle, rectangle}){
    return (
        circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height &&
        circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x &&
        circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y &&
        circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width
    )
}

function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0,0,canvas.width,canvas.height)
    
    if (keys.w.pressed && lastKeyws === 'w') {
        for (let i =0; i<boundaries.length; i++) {
            const boundary = boundaries[i]
            if (circleColliderWithRectangle({circle: {...player, velocity:{x:0,y:-5}}, rectangle: boundary})
            ){
                player.velocity.y=0
                break
            } else {
                player.velocity.y=-5
            }
        }

    } if (keys.a.pressed && lastKeyad === 'a') {
        for (let i =0; i<boundaries.length; i++) {
            const boundary = boundaries[i]
            if (circleColliderWithRectangle({circle: {...player, velocity:{x:-5,y:0}}, rectangle: boundary})
            ){
                player.velocity.x=0
                break
            } else {
                player.velocity.x=-5
            }
        }

    } if (keys.s.pressed && lastKeyws === 's') {
        for (let i =0; i<boundaries.length; i++) {
            const boundary = boundaries[i]
            if (circleColliderWithRectangle({circle: {...player, velocity:{x:0,y:5}}, rectangle: boundary})
            ){
                player.velocity.y=0
                break
            } else {
                player.velocity.y=5
            }
        }

    } if (keys.d.pressed && lastKeyad === 'd') {
        for (let i =0; i<boundaries.length; i++) {
            const boundary = boundaries[i]
            if (circleColliderWithRectangle({circle: {...player, velocity:{x:5,y:0}}, rectangle: boundary})
            ){
                player.velocity.x=0
                break
            } else {
                player.velocity.x=5
            }
        }
    } if (player.velocity.x!=0 && player.velocity.y!=0){
        switch(lastKey){
            case 'w':
                lastKeyad = ''
                break
            case 'a':
                lastKeyws = ''
                break
            case 's':
                lastKeyad = ''
                break
            case 'd':
                lastKeyws = ''
                break
        }
    }

    palets.forEach(palet => {
        palet.draw()
    })

    boundaries.forEach((boundary) => {
        boundary.draw()

        if (circleColliderWithRectangle({circle: player, rectangle: boundary})
        ){
            player.velocity.x = 0
            player.velocity.y = 0
        }
    })

    player.update()
    player.velocity.y=0
    player.velocity.x=0
}

animate()

addEventListener('keydown',({key})=>{
    switch(key){
        case 'w':
            keys.w.pressed = true
            lastKeyws = 'w'
            lastKey = 'w'
            break
        case 'a':
            keys.a.pressed = true
            lastKeyad = 'a'
            lastKey = 'a'
            break
        case 's':
            keys.s.pressed = true
            lastKeyws = 's'
            lastKey = 's'
            break
        case 'd':
            keys.d.pressed = true
            lastKeyad = 'd'
            lastKey = 'd'
            break

    }
})

