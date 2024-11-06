const particleSketch = (p) => {
  let particles = [];
  let explode = false;
  let centerX, centerY;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    centerX = p.width / 2;
    centerY = p.height / 2;
  };

  p.draw = () => {
    p.clear();

    if (!explode) {
      // Crear una nueva partícula en la posición del ratón en cada cuadro
      if (p.mouseIsPressed && p.mouseButton === p.LEFT) {
        particles.push(new Particle(p.mouseX, p.mouseY, p));
      }

      // Actualizar y mostrar partículas
      for (let i = particles.length - 1; i >= 0; i--) {
        let particle = particles[i];
        particle.update();
        particle.display();

        // Eliminar partículas muertas
        if (particle.isDead()) {
          particles.splice(i, 1);
        }
      }
    } else {
      // Mostrar el texto después de la explosión
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
      this.vel = p5.Vector.random2D().mult(this.p.random(1, 3));
      this.acc = p.createVector(0, 0.05);
      this.size = this.p.random(20, 30); // Tamaño de los símbolos
      this.lifespan = 255; // Tiempo de vida de la partícula

      // Colores de los botones de PlayStation: verde, rosa, azul, morado
      this.colors = [
        p.color(0, 255, 0),       // Verde
        p.color(255, 0, 255),     // Rosa
        p.color(0, 0, 255),       // Azul
        p.color(128, 0, 128)      // Morado
      ];
      this.color = this.colors[Math.floor(this.p.random(this.colors.length))];

      // Símbolos de PlayStation
      this.symbols = ['▲', '■', '●', '✖'];
      this.symbol = this.symbols[Math.floor(this.p.random(this.symbols.length))];
    }

    update() {
      if (explode) {
        let force = p5.Vector.sub(this.p.createVector(centerX, centerY), this.pos).mult(0.1);
        this.vel.add(force);
        this.vel.limit(5); // Limitar la velocidad de las partículas
      } else {
        this.vel.add(this.acc); // Añadir aceleración en modo normal
      }
      this.pos.add(this.vel);
      this.lifespan -= 5; // Disminuir la vida de la partícula
    }

    moveToCenter(cx, cy) {
      // Reasignar el objetivo al centro
      this.target = this.p.createVector(cx, cy);
    }

    display() {
      this.p.fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.lifespan);
      this.p.noStroke();
      this.p.textSize(this.size);
      this.p.text(this.symbol, this.pos.x, this.pos.y); // Dibujar el símbolo en lugar de un círculo
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
