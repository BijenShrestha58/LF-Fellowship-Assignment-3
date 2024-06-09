function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled);
}

function getRandomPosition(minX, maxX, minY, maxY, radius) {
  const minXCeiled = Math.ceil(minX);
  const maxXFloored = Math.floor(maxX);
  const minYCeiled = Math.ceil(minY);
  const maxYFloored = Math.floor(maxY);
  let valid = true;
  do {
    var randomX = Math.floor(
      Math.random() * (maxXFloored - minXCeiled) + minXCeiled
    );
    var randomY = Math.floor(
      Math.random() * (maxYFloored - minYCeiled) + minYCeiled
    );
    valid = true;
    for (let i of ballArray) {
      if (
        Math.sqrt(
          Math.pow(i.x + i.r - randomX + radius, 2) +
            Math.pow(i.y + i.r - randomY + radius, 2)
        ) <=
        radius + i.r
      ) {
        valid = false;
      }
    }
  } while (!valid);
  return [randomX, randomY];
}

function getRandomColor() {
  let letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const boundary = document.createElement("div");
boundary.style.width = "90vw";
boundary.style.height = "90vh";
boundary.style.border = "1px solid #ccc";
boundary.style.position = "relative";
boundary.style.top = "50%";
boundary.style.left = "50%";
boundary.style.transform = "translate(-50%,-50%)";

document.body.appendChild(boundary);

const BOUNDARY_X_MIN = 0;
const BOUNDARY_X_MAX = boundary.clientWidth;

const BOUNDARY_Y_MIN = 0;
const BOUNDARY_Y_MAX = boundary.clientHeight;

class Ball {
  constructor(x = 0, y = 0, r = 20, color = "#000", dx = 1, dy = 1) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.dx = dx;
    this.dy = dy;
    this.color = color;

    this.element = document.createElement("div");

    this.element.style.width = `${this.r * 2}px`;
    this.element.style.height = `${this.r * 2}px`;
    this.element.style.transform = `translate(${this.x}px,${this.y}px)`;
    this.element.style.position = `absolute`;
    this.element.style.background = this.color;
    this.element.style.borderRadius = "50%";
  }

  ballMovement() {
    this.element.style.transform = `translate(${this.x}px,${this.y}px)`;
  }

  isWallCollision() {
    if (this.y + 2 * this.r >= BOUNDARY_Y_MAX || this.y <= BOUNDARY_Y_MIN) {
      this.dy = this.dy * -1;
    }
    if (this.x + 2 * this.r >= BOUNDARY_X_MAX || this.x <= BOUNDARY_X_MIN) {
      this.dx = this.dx * -1;
    }
    this.x = this.x + this.dx * 5;
    this.y = this.y + this.dy * 5;
  }

  isBallCollision(ball2) {
    if (
      (this.x - ball2.x) ** 2 + (this.y - ball2.y) ** 2 <=
      (this.r + ball2.r) ** 2
    ) {
      let temp = this.dx;
      this.dx = ball2.dx;
      ball2.dx = temp;

      temp = this.dy;
      this.dy = ball2.dy;
      ball2.dy = temp;
    }
  }
}

const BALL_COUNT = 10;

const ballArray = [];

for (let i = 0; i < BALL_COUNT; i++) {
  let radius = getRandomInt(15, 30);
  let color = getRandomColor();
  let [left, top] = getRandomPosition(
    BOUNDARY_X_MIN,
    BOUNDARY_X_MAX - radius * 2,
    BOUNDARY_Y_MIN,
    BOUNDARY_Y_MAX - radius * 2,
    radius
  );
  let dx = Math.random() * 2 - 1;
  let dy = Math.random() * 2 - 1;
  const ball = new Ball(left, top, radius, color, dx, dy);
  boundary.appendChild(ball.element);
  ballArray.push(ball);
}

setInterval(() => {
  ballArray.forEach((ball) => {
    ball.isWallCollision();
    ball.ballMovement();
  });
  for (let i = 0; i < ballArray.length; i++) {
    for (let j = 0; j < ballArray.length; j++) {
      if (ballArray[i] === ballArray[j]) break;
      ballArray[i].isBallCollision(ballArray[j]);
    }
  }
  ballArray.forEach((ball) => ball.ballMovement());
}, 1000 / 60);
// console.log(ballArray);
