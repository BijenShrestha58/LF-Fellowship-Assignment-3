const BOUNDARY_X_MIN = 0;
const BOUNDARY_X_MAX = 1000;

const BOUNDARY_Y_MIN = 0;
const BOUNDARY_Y_MAX = 700;

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
      let distance = Math.sqrt(
        (i.x + i.r - randomX + radius) ** 2 +
          (i.y + i.r - randomY + radius) ** 2
      );
      if (distance <= radius + i.r) {
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
boundary.style.width = `${BOUNDARY_X_MAX}px`;
boundary.style.height = `${BOUNDARY_Y_MAX}px`;
boundary.style.border = "1px solid #ccc";
boundary.style.position = "relative";
// boundary.style.top = "50%";
// boundary.style.left = "50%";
// boundary.style.transform = "translate(-50%,-50%)";

document.body.appendChild(boundary);

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
    this.element.style.position = `absolute`;
    this.element.style.background = this.color;
    this.element.style.borderRadius = "50%";
  }

  ballMovement(delta) {
    this.x = this.x + (this.dx * delta) / 10;
    this.y = this.y + (this.dy * delta) / 10;
    this.element.style.transform = `translate(${this.x}px,${this.y}px)`;
  }

  isWallCollision() {
    if (this.x <= BOUNDARY_X_MIN) {
      this.x = Math.max(0, this.x);
      this.dx *= -1;
    }
    if (this.x + 2 * this.r >= BOUNDARY_X_MAX) {
      this.x = Math.min(BOUNDARY_X_MAX - 2 * this.r, this.x);
      this.dx *= -1;
    }
    if (this.y <= BOUNDARY_Y_MIN) {
      this.y = Math.max(0, this.y);
      this.dy *= -1;
    }
    if (this.y + 2 * this.r >= BOUNDARY_Y_MAX) {
      this.y = Math.min(BOUNDARY_Y_MAX - 2 * this.r, this.y);
      this.dy *= -1;
    }

    // if (this.y + 2 * this.r >= BOUNDARY_Y_MAX || this.y <= BOUNDARY_Y_MIN) {
    //   this.dy = this.dy * -1;
    // }
    // if (this.x + 2 * this.r >= BOUNDARY_X_MAX || this.x <= BOUNDARY_X_MIN) {
    //   this.dx = this.dx * -1;
    // }
  }

  isBallCollision(ball2) {
    if (
      Math.hypot(
        this.x + this.r - ball2.x - ball2.r,
        this.y + this.r - ball2.y - ball2.r
      ) <=
      this.r + ball2.r
    ) {
      console.log("colliding");
      let newAdx =
        ((this.r ** 1 - ball2.r ** 1) / (this.r ** 1 + ball2.r ** 1)) *
          this.dx +
        ((2 * ball2.r ** 1) / (this.r ** 1 + ball2.r ** 1)) * ball2.dx;
      let newAdy =
        ((this.r ** 1 - ball2.r ** 1) / (this.r ** 1 + ball2.r ** 1)) *
          this.dy +
        ((2 * ball2.r ** 1) / (this.r ** 1 + ball2.r ** 1)) * ball2.dy;
      let newBdx =
        ((2 * this.r ** 1) / (this.r ** 1 + ball2.r ** 1)) * this.dx +
        ((ball2.r ** 1 - this.r ** 1) / (this.r ** 1 + ball2.r ** 1)) *
          ball2.dx;
      let newBdy =
        ((2 * this.r ** 1) / (this.r ** 1 + ball2.r ** 1)) * this.dy +
        ((ball2.r ** 1 - this.r ** 1) / (this.r ** 1 + ball2.r ** 1)) *
          ball2.dy;

      this.dx = newAdx;
      this.dy = newAdy;
      ball2.dx = newBdx;
      ball2.dy = newBdy;
      this.isOverlap(ball2);

      // let temp = this.dx;

      // temp = this.dy;
      // this.dy = ball2.dy;
      // ball2.dy = temp;
    }
  }

  isOverlap(ball2) {
    let distance = Math.sqrt(
      (ball2.x + ball2.r - this.x - this.r) ** 2 +
        (ball2.y + ball2.r - this.y - this.r) ** 2
    );
    let distanceRequired = ball2.r + this.r;
    if (distanceRequired < distance) return; //no collision
    let overlap = distanceRequired - distance;
    this.x -= (overlap * (ball2.x - this.x)) / distance;
    this.y -= (overlap * (ball2.y - this.y)) / distance;
    ball2.x += (overlap * (ball2.x - this.x)) / distance;
    ball2.y += (overlap * (ball2.y - this.y)) / distance;

    // this.x = Math.max(this.r, Math.min(this.x, BOUNDARY_X_MAX - this.r * 2));
    // this.y = Math.max(this.r, Math.min(this.y, BOUNDARY_Y_MAX - this.r * 2));
    // ball2.x = Math.max(
    //   ball2.r,
    //   Math.min(ball2.x, BOUNDARY_X_MAX - ball2.r * 2)
    // );
    // ball2.y = Math.max(
    //   ball2.r,
    //   Math.min(ball2.y, BOUNDARY_Y_MAX - ball2.r * 2)
    // );
  }
}

const BALL_COUNT = 200;

const ballArray = [];

for (let i = 0; i < BALL_COUNT; i++) {
  let radius = getRandomInt(5, 30);
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

function update() {
  {
    for (let i = 0; i < ballArray.length - 1; i++) {
      for (let j = i + 1; j < ballArray.length; j++) {
        // if (ballArray[i] === ballArray[j]) break;
        ballArray[i].isBallCollision(ballArray[j]);
        // ballArray[i].isOverlap(ballArray[j]);
      }
    }
    ballArray.forEach((ball) => {
      ball.isWallCollision();
    });
    ballArray.forEach((ball) => ball.ballMovement(1000 / 60));
    setTimeout(update, 1000 / 60);
  }
}

setTimeout(update, 1000 / 60);
// console.log(ballArray);
