// particles.js con animación de explosión

const particleSketch = (p) => {
  let particles = [];
  let explode = false;
  let centerX, centerY;
  let explosionTimer = 0;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    centerX = p.width / 2;
    centerY = p.height / 2;
  };

  p.draw = () => {
    p.clear();
    for (let particle of particles) {
      particle.update();
      particle.display();
    }

    // Si se activa la explosión, muestra el texto en el centro
    if (explode && explosionTimer > 0) {
      p.fill(255);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(150);
      p.text("JUANES", centerX, centerY);

      // Reducimos el contador para detener la explosión después de unos frames
      explosionTimer--;
    }
  };

  p.mousePressed = () => {
    if (p.mouseButton === p.LEFT) {
      explode = true;
      explosionTimer = 60; // Tiempo que el texto permanecerá en pantalla
      for (let particle of particles) {
        particle.moveToCenter(centerX, centerY);
      }
    }
  };

  p.mouseReleased = () => {
    explode = false;
    particles = []; // Reinicia las partículas después de la explosión
    // Genera nuevas partículas
    for (let i = 0; i < 100; i++) {
      particles.push(new Particle(p.mouseX, p.mouseY, p));
    }
  };

  class Particle {
    constructor(x, y, p) {
      this.p = p;
      this.pos = this.p.createVector(x, y);
      this.vel = p5.Vector.random2D().mult(this.p.random(2, 5));
      this.symbols = ['X', '◯', '▢', '△'];
      this.symbol = this.p.random(this.symbols);
      this.size = this.p.random(15, 25);
      this.target = this.p.createVector(centerX, centerY); // Punto de explosión
    }

    update() {
      if (explode) {
        // Las partículas se acercan al centro
        let force = p5.Vector.sub(this.target, this.pos).mult(0.1);
        this.vel.add(force);
        this.vel.limit(5);
      }
      this.pos.add(this.vel);
    }

    moveToCenter(cx, cy) {
      // Mueve la partícula hacia el centro
      this.target.set(cx, cy);
    }

    display() {
      this.p.fill(255);
      this.p.textSize(this.size);
      this.p.text(this.symbol, this.pos.x, this.pos.y);
    }
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    centerX = p.width / 2;
    centerY = p.height / 2;
  };
};

// Instancia para el contenedor de partículas
new p5(particleSketch, "particle-canvas");
