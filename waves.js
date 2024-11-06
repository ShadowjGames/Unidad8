// waves.js convertido a fondo de cuadrados flotantes

const backgroundSketch = (p) => {
  let squares = [];
  let numSquares = 100;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    for (let i = 0; i < numSquares; i++) {
      squares.push(new FloatingSquare(p));
    }
  };

  p.draw = () => {
    p.clear();
    for (let square of squares) {
      square.update();
      square.display();
    }
  };

  class FloatingSquare {
    constructor(p) {
      this.p = p;
      this.pos = this.p.createVector(
        this.p.random(this.p.width),
        this.p.random(this.p.height)
      );
      this.size = this.p.random(20, 50);
      this.opacity = this.p.random(50, 100);
      this.speed = this.p.random(0.2, 1);
    }

    update() {
      this.pos.y -= this.speed;
      if (this.pos.y < -this.size) {
        this.pos.y = this.p.height + this.size;
      }
    }

    display() {
      this.p.noStroke();
      this.p.fill(100, 100, 100, this.opacity); // Gris semitransparente
      this.p.rect(this.pos.x, this.pos.y, this.size, this.size);
    }
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

// Instancia para el fondo de cuadrados
new p5(backgroundSketch, "wave-canvas");
