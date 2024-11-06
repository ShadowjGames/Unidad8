const backgroundSketch = (p) => {
  let circles = [];
  let explode = false;
  let centerX, centerY;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    centerX = p.width / 2;
    centerY = p.height / 2;
    for (let i = 0; i < 50; i++) {
      circles.push(new FloatingCircle(p.random(p.width), p.random(p.height), p));
    }
  };

  p.draw = () => {
    p.clear();
    for (let circle of circles) {
      circle.update();
      circle.display();
    }
  };

  p.mousePressed = () => {
    if (p.mouseButton === p.LEFT) {
      explode = true;
      for (let circle of circles) {
        circle.moveToCenter(centerX, centerY);
      }
    }
  };

  p.mouseReleased = () => {
    explode = false;
    circles = [];
    // Genera nuevos círculos dispersos
    for (let i = 0; i < 50; i++) {
      circles.push(new FloatingCircle(p.random(p.width), p.random(p.height), p));
    }
  };

  class FloatingCircle {
    constructor(x, y, p) {
      this.p = p;
      this.pos = this.p.createVector(x, y);
      this.vel = p5.Vector.random2D().mult(this.p.random(1, 3));
      this.target = this.p.createVector(centerX, centerY);  // Centro para la explosión
      this.size = this.p.random(20, 50);
      this.opacity = this.p.random(50, 100);
    }

    update() {
      if (explode) {
        // Los círculos se acercan al centro
        let force = p5.Vector.sub(this.target, this.pos).mult(0.03);
        this.vel.add(force);
        this.vel.limit(8);
      }
      this.pos.add(this.vel);
    }

    moveToCenter(cx, cy) {
      // Establece el centro como el objetivo
      this.target.set(cx, cy);
    }

    display() {
      this.p.noStroke();
      this.p.fill(200, this.opacity);  // Círculo gris semitransparente
      this.p.ellipse(this.pos.x, this.pos.y, this.size);
    }
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    centerX = p.width / 2;
    centerY = p.height / 2;
  };
};

new p5(backgroundSketch, "wave-canvas");
