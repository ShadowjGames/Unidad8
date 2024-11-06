// particles.js

class Particle {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(random(-2, 2), random(-2, 0));
    this.acceleration = createVector(0, 0.07);
    this.lifespan = 255;
    this.cr = random(255);
    this.cg = random(255);
    this.cb = random(255);
  }

  applyForce(force) {
    let f = force.copy();
    f.div(1); // Masa de 1
    this.acceleration.add(f);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);

    // Rebote en los bordes
    if (this.position.y > height) {
      this.velocity.y *= -0.8; // Reducción de velocidad al rebotar
      this.position.y = height;
    }
    
    this.lifespan -= 2;
  }

  display() {
    stroke(255, this.lifespan);
    strokeWeight(2);
    fill(this.cr, this.cg, this.cb, this.lifespan);
    ellipse(this.position.x, this.position.y, 12, 12);
  }

  isDead() {
    return this.lifespan <= 0;
  }
}

class ParticleSystem {
  constructor(x, y) {
    this.origin = createVector(x, y);
    this.particles = [];
  }

  addParticle() {
    this.particles.push(new Particle(this.origin.x, this.origin.y));
  }

  applyForce(force) {
    for (let particle of this.particles) {
      particle.applyForce(force);
    }
  }

  run() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      let particle = this.particles[i];
      particle.update();
      particle.display();
      if (particle.isDead()) {
        this.particles.splice(i, 1);
      }
    }
  }
}

let ps;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("canvas-container");

  ps = new ParticleSystem(width / 2, height / 2);
}

function draw() {
  clear(); // Limpia la pantalla en cada cuadro para la transparencia
  let gravity = createVector(0, 0.2);
  ps.applyForce(gravity);
  ps.addParticle();
  ps.run();
}

// Ajuste de tamaño de canvas al cambiar el tamaño de la ventana
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
