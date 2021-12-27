// Drawing
const canvas = document.createElement('canvas');
canvas.setAttribute('class','game');
canvas.width = 480;
canvas.height = 600;
const ctx = canvas.getContext("2d");
const BEEP = new Audio('./assets/beep.mp3');

let frameInterval = 0;

// Controls
let leftMove = false;
let rightMove = false;
let hundredCounter = 0;

class Game {
  constructor(parent) {
    this.parent = parent;
    // place canvas
    document.body.appendChild(canvas);
    this.metrics = new GameMetrics(3);

    // create the ball
    let ballRad = 4;
    let ballX = (canvas.width - ballRad)/2;
    let ballY = 60;
    this.ball = new Ball(ballX, ballY, 10);

    this.walls = [];

    // callbacks
    document.addEventListener("keydown", this.keyDownHandler, false);
    document.addEventListener("keyup", this.keyUpHandler, false);

    // start drawing
    this.draw = this.draw.bind(this);
    this.draw()
  }

  draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.ball.draw()

      for (let i=0; i < this.walls.length; i++){
          let onscreen = this.walls[i].moveUp();
          if(!onscreen) this.walls.shift()
          this.walls[i].draw();
      }

      this.addWalls();
      this.metrics.draw();

      this.collisionDetection()

      if (rightMove) this.ball.moveRight();

      if (leftMove) this.ball.moveLeft();

      frameInterval++;
      requestAnimationFrame(this.draw);
  }

  collisionDetection() {
      if (hundredCounter === 0) {
          for(let i = 0; i < this.walls.length; i++) {
              const collided = this.walls[i].collision(this.ball.x, this.ball.y);
              if (collided) {
                  const continueGame = this.metrics.decrementLives();
                  if (!continueGame) this.reset()
                  hundredCounter = 100;
              }
          }
      } else {
          hundredCounter--;
      }
  }

  addWalls(){
      if (frameInterval % 120 !== 0) return;
      this.walls.push(new Walls(0))
      frameInterval = 0;
      this.metrics.updateScore();
  }


  moveRight(e) {
    if (e === true) rightMove = true;
    else if (e === false) rightMove = false;
  }

  moveLeft(e) {
    if (e === true) leftMove = true;
    else if (e === false) leftMove = false;
  }

  // Keyboard callbacks
  keyDownHandler(e) {
  	if (e.keyCode === 39) rightMove = true;
  	else if (e.keyCode === 37) leftMove = true;
  }

  keyUpHandler(e) {
  	if (e.keyCode === 39) rightMove = false;
  	else if (e.keyCode === 37) leftMove = false;
  }

  reset(){
    frameInterval = 0;
    // Controls
    leftMove = false;
    rightMove = false;
    hundredCounter = 0;
    this.metrics = new GameMetrics(3);
    this.walls = [];
  }

}

class Walls {
    constructor(spawnY){
        this.spawnY = canvas.height + spawnY;
        this.randSpawn();
        this.draw = this.draw.bind(this);
    }

    draw() {
        ctx.beginPath();
        ctx.rect(this.x,this.y, this.width, this.height)
        ctx.fillStyle = "#66ff00"
        ctx.fill()
        ctx.closePath();
    }

    moveUp() {
        this.y -= this.dy;
        return this.y >= 0 - this.height;
    }

    collision(objectX, objectY){
        if (objectX >= this.x && objectX <= this.x + this.width) {
            return this.y < objectY && this.y + this.height > objectY;
        }
        return false
    }

    randSpawn(){
        this.dy = 2;
        const random = Math.random();
        this.width = (random * (canvas.width/3)) + canvas.width/3; // random wall length
        this.height = 30;
        const left = random > 0.5;
        if (left)this.x = 0
        else this.x = canvas.width - this.width;
        this.y = this.spawnY
    }
}


class GameMetrics {
    constructor(lives){
        this.lives = lives;
        this.score = 0;
    }

    updateScore() {
        this.score++;
    }

    decrementLives() {
        BEEP.play();
        if (this.lives > 1) {
            this.lives--;
            return true
        } else{
            this.lives--;
            alert("Game Over\nScore: " + this.score)
            return false
        }
    }

    draw() {
        ctx.font = "bold 16px Helvetica";
        ctx.fillStyle = "#fff";
        ctx.fillText("Score: " + this.score, 10, 20);
        ctx.fillText("Lives: " + this.lives, 10, 45);
    }
}

class Ball {

    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.draw = this.draw.bind(this)
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        ctx.fillStyle = "#EF5E77";
        ctx.fill();
        ctx.closePath();
    }

    moveRight(){
        if(this.x < canvas.width - this.radius) this.x += 5
    }

    moveLeft(){
        if (this.x > 0 + this.radius) this.x -= 5
    }
}

export default Game
