const particleSketch = (p) => {
  let particles = [];
  let explode = false;
  let centerX, centerY;
  let explosionTimer = 0;

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
    
    // Fondo oscuro cuando ocurre la explosión
    if (explode && explosionTimer > 0) {
      p.background(0, 150);  // Fondo oscuro con algo de transparencia
    }

    for (let particle of particles) {
      particle.update();
      particle.display();
    }

    // Si está en modo de explosión, muestra el texto en el centro
    if (explode && explosionTimer > 0) {
      p.fill(255);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(150);
      p.text("JUANES", centerX, centerY);
      explosionTimer--;
    }
  };

  p.mousePressed = () => {
    if (p.mouseButton === p.LEFT) {
      explode = true;
      explosionTimer = 60;  // Duración de la explosión en frames
      for (let particle of particles) {
        particle.moveToCenter(centerX, centerY);
      }
    }
  };

  p.mouseReleased = () => {
    explode = false;
    particles = [];  // Reinicia las partículas después de la explosión
    // Genera nuevas partículas dispersas en la pantalla
    for (let i = 0; i < 100; i++) {
      particles.push(new Particle(p.random(p.width), p.random(p.height), p));
    }
  };

  class Particle {
    constructor(x, y, p) {
      this.p = p;
      this.pos = this.p.createVector(x, y);
      this.vel = p5.Vector.random2D().mult(this.p.random(2, 5));
      this.target = this.p.createVector(centerX, centerY);  // Punto de explosión
      this.size = this.p.random(15, 25);
    }

    update() {
      if (explode) {
        // Las partículas se mueven hacia el centro
        let force = p5.Vector.sub(this.target, this.pos).mult(0.05);
        this.vel.add(force);
        this.vel.limit(10);  // Limita la velocidad máxima
      }
      this.pos.add(this.vel);
    }

    moveToCenter(cx, cy) {
      // Establece el punto de explosión como el destino
      this.target.set(cx, cy);
    }

    display() {
      this.p.fill(255);
      this.p.ellipse(this.pos.x, this.pos.y, this.size);
    }
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    centerX = p.width / 2;
    centerY = p.height / 2;
  };
};

new p5(particleSketch, "particle-canvas");
