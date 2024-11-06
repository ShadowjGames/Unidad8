const particleSketch = (p) => {
  const symbols = ['X', '□', '○', '△'];
  
  class Particle {
    constructor(x, y) {
      this.position = p.createVector(x, y);
      this.velocity = p5.Vector.random2D().mult(p.random(1, 3)); // Movimiento en direcciones aleatorias
      this.acceleration = p.createVector(0, 0);
      this.lifespan = 255;
      this.symbol = p.random(symbols); // Símbolo aleatorio de PlayStation
      this.color = p.color(p.random(255), p.random(255), p.random(255));
    }

    applyForce(force) {
      let f = force.copy();
      f.div(1);
      this.acceleration.add(f);
    }

    update() {
      this.velocity.add(this.acceleration);
      this.position.add(this.velocity);
      this.acceleration.mult(0);
      this.lifespan -= 2;
    }

    display() {
      p.fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.lifespan);
      p.noStroke();
      p.textSize(20);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(this.symbol, this.position.x, this.position.y);
    }

    isDead() {
      return this.lifespan <= 0;
    }
  }

  class ParticleSystem {
    constructor(x, y) {
      this.origin = p.createVector(x, y);
      this.particles = [];
    }

    addParticle() {
      this.particles.push(new Particle(this.origin.x, this.origin.y));
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

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    ps = new ParticleSystem(p.width / 2, p.height / 2); // Centro de la pantalla
  };

  p.draw = () => {
    p.clear();
    ps.addParticle();
    ps.run();
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

new p5(particleSketch, "canvas-container");
