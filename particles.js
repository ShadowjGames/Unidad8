const particleSketch = (p) => {
  let particles = [];
  let centerX, centerY;
  let explosionPhase = false;
  let textOpacity = 0;
  let letters = [];
  let links = [
    { letter: "J", url: "https://example.com/j", tooltip: "Página J" },
    { letter: "U", url: "https://example.com/u", tooltip: "Página U" },
    { letter: "A", url: "https://example.com/a", tooltip: "Página A" },
    { letter: "N", url: "https://example.com/n", tooltip: "Página N" },
    { letter: "E", url: "https://example.com/e", tooltip: "Página E" },
    { letter: "S", url: "https://example.com/s", tooltip: "Página S" }
  ];
  let activeTooltip = null;

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
      for (let particle of particles) {
        particle.explode();
      }
      particles = particles.filter(p => !p.isDead());

      if (particles.length === 0) {
        explosionPhase = false;
        showText = true;
      }
    } else {
      // Aumentar opacidad del texto suavemente
      textOpacity = Math.min(textOpacity + 3, 255);
      p.fill(255, textOpacity);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(150);

      // Renderizar letras y guardar sus posiciones
      letters = [];
      let spacing = 120;
      let startX = centerX - (spacing * (links.length - 1)) / 2;

      for (let i = 0; i < links.length; i++) {
        let link = links[i];
        let x = startX + i * spacing;
        let y = centerY;

        p.text(link.letter, x, y); // Renderizar la letra
        letters.push({ x, y, letter: link.letter, link });
      }

      // Mostrar tooltip si está activo
      if (activeTooltip) {
        p.fill(50, 50, 255, 200);
        p.noStroke();
        p.ellipse(activeTooltip.x, activeTooltip.y - 100, 140, 50); // Burbuja

        p.fill(255);
        p.textSize(20);
        p.textAlign(p.CENTER, p.CENTER);
        p.text(activeTooltip.link.tooltip, activeTooltip.x, activeTooltip.y - 100); // Texto del tooltip
      }
    }
  };

  p.mousePressed = () => {
    if (p.mouseButton === p.LEFT) {
      if (showText) {
        activeTooltip = null;

        // Detectar si se hizo clic en alguna letra y activar tooltip
        for (let letter of letters) {
          let d = p.dist(p.mouseX, p.mouseY, letter.x, letter.y);
          if (d < 60) {
            activeTooltip = { x: letter.x, y: letter.y, link: letter.link };
            break;
          }
        }
      } else if (!showText && !explosionPhase) {
        // Solo activar la fase de explosión cuando "showText" está desactivado
        explosionPhase = true;
      }
    }
  };

  p.mouseReleased = () => {
    if (activeTooltip) {
      let d = p.dist(p.mouseX, p.mouseY, activeTooltip.x, activeTooltip.y - 100);
      if (d < 70) {
        window.open(activeTooltip.link.url, "_blank");
      }
      activeTooltip = null;
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
      this.pos.add(this.vel.mult(1.1));
      this.size *= 0.95;
      this.lifespan -= 5;
    }

    display() {
      this.p.fill(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.lifespan);
      this.p.noStroke();
      this.p.textSize(this.size);
      this.p.text(this.symbol, this.pos.x, this.pos.y);
    }

    isDead() {
      return this.lifespan <= 0 || this.size < 1;
    }
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    centerX = p.width / 2;
    centerY = p.height / 2;
  };
};

new p5(particleSketch, "particle-canvas");
