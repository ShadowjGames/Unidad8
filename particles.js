const particleSketch = (p) => {
  let particles = [];
  let centerX, centerY;
  let explosionPhase = false;
  let textOpacity = 0;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    centerX = p.width / 2;
    centerY = p.height / 2;
  };

  p.draw = () => {
    p.clear();

    if (!showText && !explosionPhase) {
      if (p.mouseX >= 0 && p.mouseY >= 0) {
        particles.push(new Particle(p.mouseX, p.mouseY, p));
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        let particle = particles[i];
        particle.update();
        particle.display();

        if (particle.isDead()) {
          particles.splice(i, 1);
        }
      }
    } else if (explosionPhase) {
      // Generar efecto de explosión en partículas
      for (let particle of particles) {
        particle.explode();
      }
      
      // Reducir la cantidad de partículas para hacer la explosión más visible
      particles = particles.filter(p => !p.isDead());

      // Cuando se terminan las partículas, comenzar a mostrar el texto
      if (particles.length === 0) {
        explosionPhase = false;
        showText = true;
      }
    } else {
      // Mostrar el texto con un degradado de opacidad
      textOpacity = Math.min(textOpacity + 5, 255);
      p.fill(255, textOpacity);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(150);
      p.text("JUANES", centerX, centerY);
    }
  };

  p.mousePressed = () => {
    if (p.mouseButton === p.LEFT) {
      explosionPhase = true;
    }
  };

  class Particle {
    constructor(x, y, p) {
      this.p = p;
      this.pos = this.p.createVector(x, y);
      this.vel = p5.Vector.random2D().mult(this.p.random(1, 3));
      this.acc = p.createVector(0, 0.05);
      this.size = this.p.random(15, 25);
      this.lifespan = 200;

      const symbolsAndColors = [
        { symbol: '▲', color: p.color(0, 128, 0, 180) },
        { symbol: '■', color: p.color(75, 0, 130, 180) },
        { symbol: '●', color: p.color(255, 20, 147, 180) },
        { symbol: '✖', color: p.color(0, 0, 205, 180) }
      ];
      let selected = symbolsAndColors[Math.floor(this.p.random(symbolsAndColors.length))];
      this.symbol = selected.symbol;
      this.color = selected.color;
    }

    update() {
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.lifespan -= 3;
    }

    explode() {
      this.pos.add(this.vel.mult(5)); // Mayor velocidad para simular explosión
      this.lifespan -= 10;
    }

    display() {
      this.p.fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.lifespan);
      this.p.noStroke();
      this.p.textSize(this.size);
      this.p.text(this.symbol, this.pos.x, this.pos.y);
    }

    isDead() {
      return this.lifespan <= 0;
    }
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    centerX = p.width / 2;
    centerY = p.height / 2;
  };
};

new p5(particleSketch, "particle-canvas");
