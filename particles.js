const particleSketch = (p) => {
  let particles = [];
  let explode = false;
  let centerX, centerY;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    centerX = p.width / 2;
    centerY = p.height / 2;
    for (let i = 0; i < 100; i++) {
      particles.push(new Particle(p.random(p.width), p.random(p.height), p));
    }
  };

  p.draw = () => {
    p.clear();
    
    if (!explode) {
      for (let particle of particles) {
        particle.update();
        particle.display();
      }
    } else {
      // Muestra el texto después de la explosión
      p.fill(255);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(150);
      p.text("JUANES", centerX, centerY);
    }
  };

  p.mousePressed = () => {
    if (p.mouseButton === p.LEFT) {
      explode = true;
      for (let particle of particles) {
        particle.moveToCenter(centerX, centerY);
      }
    }
  };

  class Particle {
    constructor(x, y, p) {
      this.p = p;
      this.pos = this.p.createVector(x, y);
      this.vel = p5.Vector.random2D().mult(this.p.random(2, 5));
      this.target = this.p.createVector(centerX, centerY);  // Centro para la explosión
      this.size = this.p.random(15, 25);
      this.symbols = ['▲', '■', '●', '✖'];  // Símbolos de PlayStation
      this.symbol = this.symbols[Math.floor(this.p.random(this.symbols.length))];
    }

    update() {
      if (explode) {
        let force = p5.Vector.sub(this.target, this.pos).mult(0.05);
        this.vel.add(force);
        this.vel.limit(10);  // Limita la velocidad máxima
      }
      this.pos.add(this.vel);
    }

    moveToCenter(cx, cy) {
      this.target.set(cx, cy);
    }

    display() {
      if (!explode) {
        this.p.fill(255);
        this.p.textSize(this.size);
        this.p.text(this.symbol, this.pos.x, this.pos.y);
      }
    }
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    centerX = p.width / 2;
    centerY = p.height / 2;
  };
};

new p5(particleSketch, "particle-canvas");
