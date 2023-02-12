const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const scoreEl = document.querySelector('#scoreEl')
const timeEl = document.querySelector('#timeEl')
const levelEl = document.querySelector('#levelEl')
const livesEl = document.querySelector('#livesEl')

const levelMid = document.querySelector('#levelMid')

canvas.width = screen.width
canvas.height = screen.height

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
        this.radius= 15
        this.radians = 1
        this.openRate = 0.1
        this.rotation = 0
        this.invincible = false
        this.invincible_points = false
        this.black = false
        this.speed = 5
    }
    draw(){
        c.save()
        c.translate(this.position.x,this.position.y)
        c.rotate(this.rotation)
        c.translate(-this.position.x,-this.position.y)
        c.beginPath()
        c.arc(this.position.x,this.position.y,this.radius,this.radians,Math.PI*2 - this.radians)
        c.lineTo(this.position.x, this.position.y)
        c.fillStyle = this.black ? '#1b1b1b' : this.invincible ? '#808080' : '#FFFFFF'
        c.fill()
        c.closePath()
        c.restore()
    }
    update(){
        this.draw()
        this.position.x+=this.velocity.x
        this.position.y+=this.velocity.y

        if (this.radians < 0 || this.radians > 1) {
          this.openRate = -this.openRate
        }
        this.radians += this.openRate
    }
}

class Ghost {
  static speed = 2
  constructor({position,velocity,eyesad,eyesws}){
      this.position=position
      this.velocity=velocity
      this.radius=14
      this.prevCollisions = []
      this.speed = 2
      this.scared = false
      this.scared_points = false
      this.eyesws = 0
      this.eyesad = 0
  }
  draw(){
    c.save()
      c.beginPath()
      c.fillStyle = this.scared ? '#FFFFFF' : '#808080'
      c.fillRect(this.position.x+this.radius,this.position.y-4,2*-this.radius,this.radius+4)
      c.arc(this.position.x,this.position.y-3,this.radius,0,Math.PI, true)
      c.fill()
      c.closePath()
      c.beginPath()
      c.fillStyle = '#1b1b1b'
      c.arc(this.position.x-6+this.eyesad,this.position.y-3+this.eyesws,4,0,Math.PI*2,true)
      c.arc(this.position.x+6+this.eyesad,this.position.y-3+this.eyesws,4,0,Math.PI*2,true)
      c.fill()
      c.closePath()
      c.beginPath()
      c.fillStyle = '#1b1b1b'
      c.arc(this.position.x-9,this.position.y+14,3,0,Math.PI,true)
      c.arc(this.position.x,this.position.y+14,3,0,Math.PI,true)
      c.arc(this.position.x+9,this.position.y+14,3,0,Math.PI,true)
      c.fill()
      c.closePath()
    c.restore()
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
        this.radius=4
    }
    draw(){
        c.beginPath()
        c.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2)
        c.fillStyle='#FFFFFF'
        c.fill()
        c.closePath()
    }
}

class Powerup {
  constructor({position}){
      this.position=position
      this.radius=8
  }
  draw(){
      c.beginPath()
      c.arc(this.position.x,this.position.y,this.radius,0,Math.PI*2)
      c.fillStyle='#FFFFFF'
      c.fill()
      c.closePath()
  }
}

const palets = []
const boundaries = []
const powerups = []
const ghosts = [
    new Ghost({
      position: 
      {x:Boundary.width * 19 + Boundary.width/2,
      y:Boundary.height + Boundary.height/2},
      velocity: {x:-Ghost.speed,y:0}
    }),
    new Ghost({
      position: 
      {x:Boundary.width * 19 + Boundary.width/2,
      y:Boundary.height * 19 + Boundary.height/2},
      velocity: {x:-Ghost.speed,y:0}
    }),
    new Ghost({
      position: 
      {x:Boundary.width + Boundary.width/2,
      y:Boundary.height * 19 + Boundary.height/2},
      velocity: {x:Ghost.speed,y:0}
    })
  ]

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

let score = 0
let time = 100000
let lives = 3
let level = 1
let time_level = 1
let fake_value = false

function Level_Time(){
  setTimeout(() => {
    if (level>time_level){
      time_level+=1
    }
    else cancelAnimationFrame(animationId)
  }, time)
}

Level_Time()

const map1 = [
    ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
    ['|', ' ', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
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
    ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
    ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
]

const map2 = [
  ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
  ['|', ' ', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
  ['|', '.', '1', '-', '-', '-', '-', '-', '-', ']', '.', '[', '-', '-', '-', '-', '-', '-', '2', '.', '|'],
  ['|', '.', '|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '1', '-', '-', '-', '-', ']', '.', '[', '-', '-', '-', '-', '2', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '1', '-', '-', ']', '.', '[', '-', '-', '2', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '|', '.', '.', '.', '.', '.', '.', '.', '|', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '|', '.', '1', ']', '.', '[', '2', '.', '|', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '_', '.', '_', '.', '_', '.', '_', '.', '.', '.', '_', '.', '_', '.', '_', '.', '_', '.', '|'],
  ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'b', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
  ['|', '.', '^', '.', '^', '.', '^', '.', '^', '.', 'p', '.', '^', '.', '^', '.', '^', '.', '^', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '|', '.', '4', ']', '.', '[', '3', '.', '|', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '|', '.', '.', '.', '.', '.', '.', '.', '|', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '4', '-', '-', ']', '.', '[', '-', '-', '3', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '4', '-', '-', '-', '-', ']', '.', '[', '-', '-', '-', '-', '3', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|', '.', '|'],
  ['|', '.', '4', '-', '-', '-', '-', '-', '-', ']', '.', '[', '-', '-', '-', '-', '-', '-', '3', '.', '|'],
  ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
  ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
]

const map3 = [
  ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
  ['|', ' ', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
  ['|', '.', '1', '-', '-', '-', '-', '-', '-', ']', '.', '[', '-', '-', '-', '-', '-', '-', '2', '.', '|'],
  ['|', '.', '|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '1', '-', '-', '-', '-', ']', '.', '[', '-', '-', '-', '-', '2', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '1', '-', '-', ']', '.', '[', '-', '-', '2', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '|', '.', '.', '.', '.', '.', '.', '.', '|', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '|', '.', '1', ']', '.', '[', '2', '.', '|', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '_', '.', '_', '.', '_', '.', '_', '.', '.', '.', '_', '.', '_', '.', '_', '.', '_', '.', '|'],
  ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'b', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
  ['|', '.', '^', '.', '^', '.', '^', '.', '^', '.', 'p', '.', '^', '.', '^', '.', '^', '.', '^', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '|', '.', '4', ']', '.', '[', '3', '.', '|', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '|', '.', '.', '.', '.', '.', '.', '.', '|', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '4', '-', '-', ']', '.', '[', '-', '-', '3', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '4', '-', '-', '-', '-', ']', '.', '[', '-', '-', '-', '-', '3', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|', '.', '|'],
  ['|', '.', '4', '-', '-', '-', '-', '-', '-', ']', '.', '[', '-', '-', '-', '-', '-', '-', '3', '.', '|'],
  ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
  ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
]

const map4 = [
  ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
  ['|', ' ', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
  ['|', '.', '1', '-', '-', '-', '-', '-', '-', ']', '.', '[', '-', '-', '-', '-', '-', '-', '2', '.', '|'],
  ['|', '.', '|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '1', '-', '-', '-', '-', ']', '.', '[', '-', '-', '-', '-', '2', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '1', '-', '-', ']', '.', '[', '-', '-', '2', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '|', '.', '.', '.', '.', '.', '.', '.', '|', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '|', '.', '1', ']', '.', '[', '2', '.', '|', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '_', '.', '_', '.', '_', '.', '_', '.', '.', '.', '_', '.', '_', '.', '_', '.', '_', '.', '|'],
  ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'b', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
  ['|', '.', '^', '.', '^', '.', '^', '.', '^', '.', 'p', '.', '^', '.', '^', '.', '^', '.', '^', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '|', '.', '4', ']', '.', '[', '3', '.', '|', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '|', '.', '.', '.', '.', '.', '.', '.', '|', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '4', '-', '-', ']', '.', '[', '-', '-', '3', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '4', '-', '-', '-', '-', ']', '.', '[', '-', '-', '-', '-', '3', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|', '.', '|'],
  ['|', '.', '4', '-', '-', '-', '-', '-', '-', ']', '.', '[', '-', '-', '-', '-', '-', '-', '3', '.', '|'],
  ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
  ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
]

const map5 = [
  ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
  ['|', ' ', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
  ['|', '.', '1', '-', '-', '-', '-', '-', '-', ']', '.', '[', '-', '-', '-', '-', '-', '-', '2', '.', '|'],
  ['|', '.', '|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '1', '-', '-', '-', '-', ']', '.', '[', '-', '-', '-', '-', '2', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '1', '-', '-', ']', '.', '[', '-', '-', '2', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '|', '.', '.', '.', '.', '.', '.', '.', '|', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '|', '.', '1', ']', '.', '[', '2', '.', '|', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '_', '.', '_', '.', '_', '.', '_', '.', '.', '.', '_', '.', '_', '.', '_', '.', '_', '.', '|'],
  ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'b', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
  ['|', '.', '^', '.', '^', '.', '^', '.', '^', '.', 'p', '.', '^', '.', '^', '.', '^', '.', '^', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '|', '.', '4', ']', '.', '[', '3', '.', '|', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '|', '.', '.', '.', '.', '.', '.', '.', '|', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '4', '-', '-', ']', '.', '[', '-', '-', '3', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '4', '-', '-', '-', '-', ']', '.', '[', '-', '-', '-', '-', '3', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|', '.', '|'],
  ['|', '.', '4', '-', '-', '-', '-', '-', '-', ']', '.', '[', '-', '-', '-', '-', '-', '-', '3', '.', '|'],
  ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
  ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
]

const map6 = [
  ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
  ['|', ' ', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
  ['|', '.', '1', '-', '-', '-', '-', '-', '-', ']', '.', '[', '-', '-', '-', '-', '-', '-', '2', '.', '|'],
  ['|', '.', '|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '1', '-', '-', '-', '-', ']', '.', '[', '-', '-', '-', '-', '2', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '1', '-', '-', ']', '.', '[', '-', '-', '2', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '|', '.', '.', '.', '.', '.', '.', '.', '|', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '|', '.', '1', ']', '.', '[', '2', '.', '|', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '_', '.', '_', '.', '_', '.', '_', '.', '.', '.', '_', '.', '_', '.', '_', '.', '_', '.', '|'],
  ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'b', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
  ['|', '.', '^', '.', '^', '.', '^', '.', '^', '.', 'p', '.', '^', '.', '^', '.', '^', '.', '^', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '|', '.', '4', ']', '.', '[', '3', '.', '|', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '|', '.', '.', '.', '.', '.', '.', '.', '|', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '4', '-', '-', ']', '.', '[', '-', '-', '3', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '4', '-', '-', '-', '-', ']', '.', '[', '-', '-', '-', '-', '3', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|', '.', '|'],
  ['|', '.', '4', '-', '-', '-', '-', '-', '-', ']', '.', '[', '-', '-', '-', '-', '-', '-', '3', '.', '|'],
  ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
  ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
]

const map7 = [
  ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
  ['|', ' ', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
  ['|', '.', '1', '-', '-', '-', '-', '-', '-', ']', '.', '[', '-', '-', '-', '-', '-', '-', '2', '.', '|'],
  ['|', '.', '|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '1', '-', '-', '-', '-', ']', '.', '[', '-', '-', '-', '-', '2', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '1', '-', '-', ']', '.', '[', '-', '-', '2', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '|', '.', '.', '.', '.', '.', '.', '.', '|', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '|', '.', '1', ']', '.', '[', '2', '.', '|', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '_', '.', '_', '.', '_', '.', '_', '.', '.', '.', '_', '.', '_', '.', '_', '.', '_', '.', '|'],
  ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'b', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
  ['|', '.', '^', '.', '^', '.', '^', '.', '^', '.', 'p', '.', '^', '.', '^', '.', '^', '.', '^', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '|', '.', '4', ']', '.', '[', '3', '.', '|', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '|', '.', '.', '.', '.', '.', '.', '.', '|', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '4', '-', '-', ']', '.', '[', '-', '-', '3', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '4', '-', '-', '-', '-', ']', '.', '[', '-', '-', '-', '-', '3', '.', '|', '.', '|'],
  ['|', '.', '|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|', '.', '|'],
  ['|', '.', '4', '-', '-', '-', '-', '-', '-', ']', '.', '[', '-', '-', '-', '-', '-', '-', '3', '.', '|'],
  ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
  ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
]

const map_holder = [map1, map2, map3, map4, map5, map6, map7]

function createImage(src) {
    const image=new Image()
    image.src=src
    return image
}
function map_creation(level){
map_holder[level-1].forEach((row, i) => {
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
        case 'p':
          powerups.push(
            new Powerup({
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
}

map_creation(level)

function circleColliderWithRectangle({circle, rectangle}){
  const padding = Boundary.width/2 - circle.radius - 1
  return (
        circle.position.y - circle.radius + circle.velocity.y <= rectangle.position.y + rectangle.height + padding &&
        circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - padding &&
        circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - padding &&
        circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width + padding
    )
}

let animationId
function animate() {
    animationId = requestAnimationFrame(animate)
    c.clearRect(0,0,canvas.width,canvas.height)
    
    if (palets.length===0) {
      score+=time/1000
      time = 0
      timeEl.innerHTML= '<br>' + 'TIME: 00'+ time/1000
      score+=lives*50
      lives = 0
      livesEl.innerHTML= '<br>' + '\xa0\xa0\xa0' + 'LIVES: '+ lives

      if (score < 10) scoreEl.innerHTML='SCORE: 000'+ score
      else if (score < 100) scoreEl.innerHTML='SCORE: 00'+ score
      else if (score < 1000) scoreEl.innerHTML='SCORE: 0'+ score
      else scoreEl.innerHTML='SCORE: '+ score

      ghosts.splice(0,1)
      player.black = true
      if (boundaries.length!==0) {
        boundaries.splice(0,3)
        fake_value=true
      }
      else if (fake_value===true) {
        level+=1  
        if (level>=10) levelEl.innerHTML='LEVEL: '+ level
        else levelEl.innerHTML='LEVEL: 0'+ level
        levelMid.innerHTML='LEVEL '+ level
        levelMid.setAttribute("class", "unselectable mid")
        setTimeout(() => {
          lives=3
          livesEl.innerHTML= '<br>' + '\xa0\xa0\xa0' + 'LIVES: '+ lives
          time=100000
          timeEl.innerHTML= '<br>' + 'TIME: '+ time/1000
          map_creation(level)
          ghosts.push (
            new Ghost({
              position: 
              {x:Boundary.width * 19 + Boundary.width/2,
              y:Boundary.height + Boundary.height/2},
              velocity: {x:-Ghost.speed,y:0}
            }),
            new Ghost({
              position: 
              {x:Boundary.width * 19 + Boundary.width/2,
              y:Boundary.height * 19 + Boundary.height/2},
              velocity: {x:-Ghost.speed,y:0}
            }),
            new Ghost({
              position: 
              {x:Boundary.width + Boundary.width/2,
              y:Boundary.height * 19 + Boundary.height/2},
              velocity: {x:Ghost.speed,y:0}
            })
                )
            player.position.x = Boundary.width + Boundary.width/2
            player.position.y = Boundary.height + Boundary.height/2
            player.rotation = 0
            lastKeyws = ''
            lastKeyad = ''
            player.velocity.x = 0
            player.velocity.y = 0
            player.black = false
            Level_Time()
            levelMid.setAttribute("class", "unselectable hide")
        }, 1000)
        fake_value=false
      }
    }

    if (keys.w.pressed && lastKeyws === 'w') {
        for (let i =0; i<boundaries.length; i++) {
            const boundary = boundaries[i]
            if (circleColliderWithRectangle({circle: {...player, velocity:{x:0,y:-5}}, rectangle: boundary})
            ){
                player.velocity.y=0
                break
            } else {
                player.velocity.y=-player.speed
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
                player.velocity.x=-player.speed
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
                player.velocity.y=player.speed
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
                player.velocity.x=player.speed
            }
        }
        
    }
    
    if (player.velocity.x!=0 && player.velocity.y!=0){
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

    for (let i = powerups.length-1; 0 <= i; i--) {
      const powerup = powerups[i]
      powerup.draw()
      if (Math.hypot(powerup.position.x - player.position.x, powerup.position.y - player.position.y) < powerup.radius + player.radius) {
        powerups.splice(i,1)
        score += 10
            if (score < 10)
              scoreEl.innerHTML='SCORE: 000'+ score
            else if (score < 100)
              scoreEl.innerHTML='SCORE: 00'+ score
            else if (score < 1000)
              scoreEl.innerHTML='SCORE: 0'+ score
            else scoreEl.innerHTML='SCORE: '+ score
        ghosts.forEach(ghost => {
          ghost.scared_points = true
          ghost.scared = true
          setTimeout(() => {
            ghost.scared = false
            setTimeout(() => {
              ghost.scared = true
              setTimeout(() => {
                ghost.scared = false
                setTimeout(() => {
                  ghost.scared = true
                  setTimeout(() => {
                    ghost.scared = false
                    setTimeout(() => {
                      ghost.scared = true
                      setTimeout(() => {
                        ghost.scared_points = false
                        ghost.scared = false
                      }, 250)
                    }, 250)
                  }, 250)
                }, 250)
              }, 250)
            }, 250)
          }, 3500)
        })
      }
    }
    if (!player.invincible_points) {
      for (let i = ghosts.length-1; 0 <= i; i--) {
        const ghost = ghosts[i]
        if (Math.hypot(ghost.position.x - player.position.x, ghost.position.y - player.position.y) < ghost.radius + player.radius){
          if (ghost.scared_points) {
            ghosts.splice(i,1)
            score += 10
              if (score < 10)
                scoreEl.innerHTML='SCORE: 000'+ score
              else if (score < 100)
                scoreEl.innerHTML='SCORE: 00'+ score
              else if (score < 1000)
                scoreEl.innerHTML='SCORE: 0'+ score
              else scoreEl.innerHTML='SCORE: '+ score
          }else {
            if (lives) {
              player.invincible_points = true
              player.invincible = true
              setTimeout(() => {
                player.invincible = false
                setTimeout(() => {
                  player.invincible = true
                  setTimeout(() => {
                    player.invincible = false
                    setTimeout(() => {
                      player.invincible = true
                      setTimeout(() => {
                        player.invincible = false
                        setTimeout(() => {
                          player.invincible = true
                          setTimeout(() => {
                            player.invincible_points = false
                            player.invincible = false
                          }, 250)
                        }, 250)
                      }, 250)
                    }, 250)
                  }, 250)
                }, 250)
              }, 500)
              lives-=1
              livesEl.innerHTML='<br>' + '\xa0\xa0\xa0' + 'LIVES: '+ lives
              player.position.x = Boundary.width + Boundary.width/2
              player.position.y = Boundary.height + Boundary.height/2
              player.rotation = 0
              lastKeyws = ''
              lastKeyad = ''
              player.velocity.x = 0
              player.velocity.y = 0
            }
            else cancelAnimationFrame(animationId)}  
    }}}

    for (let i = palets.length-1; 0 <= i; i--) {
        const palet = palets[i]
        palet.draw()

        if (Math.hypot(palet.position.x - player.position.x, palet.position.y - player.position.y) < palet.radius + player.radius){
            palets.splice(i,1)
            score += 1
            if (score < 10)
              scoreEl.innerHTML='SCORE: 000'+ score
            else if (score < 100)
              scoreEl.innerHTML='SCORE: 00'+ score
            else if (score < 1000)
              scoreEl.innerHTML='SCORE: 0'+ score
            else scoreEl.innerHTML='SCORE: '+ score
        }
    }
   
    boundaries.forEach((boundary) => {
        boundary.draw()

        if (circleColliderWithRectangle({circle: player, rectangle: boundary})
        ){
            player.velocity.x = 0
            player.velocity.y = 0
        }
    })

    player.update()
    
    ghosts.forEach(ghost => {
      ghost.update()

      if (ghost.velocity.x > 0) 
      {ghost.eyesws = 0 
      ghost.eyesad = 2}

      else if (ghost.velocity.x < 0) 
      {ghost.eyesws = 0
      ghost.eyesad = -2}

      else if (ghost.velocity.y > 0) 
      {ghost.eyesws = 2 
      ghost.eyesad = 0}

      else if (ghost.velocity.y < 0) 
      {ghost.eyesws = -2 
      ghost.eyesad = 0}

      const collisions = []
      boundaries.forEach(boundary => {
        if (!collisions.includes('right') && circleColliderWithRectangle({circle: {...ghost, velocity:{x:ghost.speed,y:0}}, rectangle: boundary})){
          collisions.push('right')
        } if (!collisions.includes('left') && circleColliderWithRectangle({circle: {...ghost, velocity:{x:-ghost.speed,y:0}}, rectangle: boundary})){
          collisions.push('left')
        } if (!collisions.includes('down') && circleColliderWithRectangle({circle: {...ghost, velocity:{x:0,y:ghost.speed}}, rectangle: boundary})){
          collisions.push('down')
        } if (!collisions.includes('up') && circleColliderWithRectangle({circle: {...ghost, velocity:{x:0,y:-ghost.speed}}, rectangle: boundary})){
          collisions.push('up')
        }
      })
      if (collisions.length > ghost.prevCollisions.length){
      ghost.prevCollisions = collisions
      } if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)){
        if (ghost.velocity.x>0) ghost.prevCollisions.push('right')
        else if (ghost.velocity.x<0) ghost.prevCollisions.push('left')
        else if (ghost.velocity.y<0) ghost.prevCollisions.push('up')
        else if (ghost.velocity.y>0) ghost.prevCollisions.push('down')
        const pathways = ghost.prevCollisions.filter(collision => {
          return !collisions.includes(collision)
        })
        const direction = pathways [Math.floor(Math.random()*pathways.length)]
        switch(direction){
          case 'down':
            ghost.velocity.y = ghost.speed
            ghost.velocity.x = 0
            break
          case 'up':
            ghost.velocity.y = -ghost.speed
            ghost.velocity.x = 0
            break
          case 'right':
            ghost.velocity.y = 0
            ghost.velocity.x = ghost.speed
            break
          case 'left':
            ghost.velocity.y = 0
            ghost.velocity.x = -ghost.speed
            break
        }
        ghost.prevCollisions = []
      }
    })
    
    if (player.velocity.x > 0) player.rotation = 0
    else if (player.velocity.x < 0) player.rotation = Math.PI
    else if (player.velocity.y > 0) player.rotation = Math.PI/2
    else if (player.velocity.y < 0) player.rotation = Math.PI*1.5
    
    if (animationId%60===0 && time > 0){
      time -= 1000
      if (time/1000>100)
      timeEl.innerHTML='<br>'+'TIME: '+ time/1000
      else if (time/1000>10)
      timeEl.innerHTML='<br>'+'TIME: 0'+ time/1000
      else
      timeEl.innerHTML='<br>'+'TIME: 00'+ time/1000
    }  
}

levelMid.setAttribute("class", "unselectable mid")
setTimeout(() => {
  animate()
  levelMid.setAttribute("class", "unselectable hide")
}, 1000)


addEventListener('keydown',({key})=>{
    switch(key){
        case 'w':
        case "ArrowUp":
            keys.w.pressed = true
            lastKeyws = 'w'
            lastKey = 'w'
            break
        case 'a':
        case "ArrowLeft":
            keys.a.pressed = true
            lastKeyad = 'a'
            lastKey = 'a'
            break
        case 's':
        case "ArrowDown":
            keys.s.pressed = true
            lastKeyws = 's'
            lastKey = 's'
            break
        case 'd':
        case "ArrowRight":
            keys.d.pressed = true
            lastKeyad = 'd'
            lastKey = 'd'
            break
    }
})
