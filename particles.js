const particleSketch = (p) => {
  let particles = [];
  let showText = false;
  let centerX, centerY;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    centerX = p.width / 2;
    centerY = p.height / 2;
  };

  p.draw = () => {
    p.clear();

    if (!showText) {
      // Crear partículas en la posición del mouse en cada frame
      particles.push(new Particle(p.mouseX, p.mouseY, p));
      
      // Actualizar y mostrar partículas
      for (let i = particles.length - 1; i >= 0; i--) {
        let particle = particles[i];
        particle.update();
        particle.display();

        // Eliminar partículas cuando su tiempo de vida termina
        if (particle.isDead()) {
          particles.splice(i, 1);
        }
      }
    } else {
      // Mostrar el texto en el centro de la pantalla
      p.fill(255);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(150);
      p.text("JUANES", centerX, centerY);
    }
  };

  p.mousePressed = () => {
    if (p.mouseButton === p.LEFT) {
      showText = true; // Activar el texto y detener partículas al hacer clic izquierdo
    }
  };

  class Particle {
    constructor(x, y, p) {
      this.p = p;
      this.pos = this.p.createVector(x, y);
      this.vel = p5.Vector.random2D().mult(this.p.random(1, 3));
      this.acc = p.createVector(0, 0.05);
      this.size = this.p.random(15, 25); // Tamaño ajustado de los símbolos
      this.lifespan = 200; // Tiempo de vida de la partícula

      // Definir símbolos y colores de PlayStation (ajustados)
      const symbolsAndColors = [
        { symbol: '▲', color: p.color(0, 128, 0, 180) },       // Verde para Triángulo
        { symbol: '■', color: p.color(75, 0, 130, 180) },      // Morado para Cuadrado
        { symbol: '●', color: p.color(255, 20, 147, 180) },    // Rosa para Círculo
        { symbol: '✖', color: p.color(0, 0, 205, 180) }        // Azul para X
      ];
      let selected = symbolsAndColors[Math.floor(this.p.random(symbolsAndColors.length))];
      this.symbol = selected.symbol;
      this.color = selected.color;
    }

    update() {
      this.vel.add(this.acc);
      this.pos.add(this.vel);
      this.lifespan -= 3; // Reducir gradualmente la opacidad
    }

    display() {
      this.p.fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.lifespan);
      this.p.noStroke();
      this.p.textSize(this.size);
      this.p.text(this.symbol, this.pos.x, this.pos.y); // Dibujar el símbolo
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
