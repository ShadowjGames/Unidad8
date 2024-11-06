const particleSketch = (p) => {
  let particles = [];
  let centerX, centerY;
  let explosionPhase = false;
  let showText = false;
  let textOpacity = 0;
  let letters = [];
  let links = [
    { letter: "J", url: "https://editor.p5js.org/ShadowjGames/full/fIQOZ1eUz", tooltip: "Aleatoriedad" },
    { letter: "U", url: "https://editor.p5js.org/ShadowjGames/full/kmjQZ8CAT", tooltip: "Vectores" },
    { letter: "A", url: "https://editor.p5js.org/ShadowjGames/full/ozWClCL5x", tooltip: "Fuerzas" },
    { letter: "N", url: "https://editor.p5js.org/ShadowjGames/full/uRDz4fkYq", tooltip: "Ondas" },
    { letter: "E", url: "https://editor.p5js.org/ShadowjGames/full/b2nVk9p9m", tooltip: "Partículas" },
    { letter: "S", url: "https://editor.p5js.org/ShadowjGames/full/9m_UHPMuZ", tooltip: "Agentes Autónomos" }
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
      // Partículas de fondo
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
      // Explosión de partículas
      for (let particle of particles) {
        particle.explode();
      }
      particles = particles.filter(p => !p.isDead());

      if (particles.length === 0) {
        explosionPhase = false;
        showText = true;
      }
    } else if (showText) {
      // Aumentar opacidad del texto suavemente
      textOpacity = Math.min(textOpacity + 3, 255);

      // Configuración de estilo de texto
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(150);

      // Configurar el espacio entre letras
      let spacing = 120;
      let startX = centerX - (spacing * (links.length - 1)) / 2;

      // Efecto de gradiente y estilo para cada letra de "JUANES"
      for (let i = 0; i < links.length; i++) {
        let link = links[i];
        let x = startX + i * spacing;
        let y = centerY;

        // Gradiente de color
        let color1 = p.color("#FE68B5");
        let color2 = p.color("#0CCBCF");
        let gradientColor = p.lerpColor(color1, color2, i / (links.length - 1));

        p.fill(gradientColor.levels[0], gradientColor.levels[1], gradientColor.levels[2], textOpacity);
        p.stroke(255, 255, 255, 150); // Borde blanco semitransparente
        p.strokeWeight(2); // Ancho del borde

        // Animación de tamaño de letra
        p.textSize(150 + Math.sin(p.frameCount * 0.05 + i) * 5);

        // Sombra
        p.push();
        p.translate(5, 5);
        p.fill(0, 0, 0, textOpacity * 0.5);
        p.noStroke();
        p.text(link.letter, x, y);
        p.pop();

        // Dibujar letra principal
        p.text(link.letter, x, y);

        // Guardar posición de cada letra para detección de clic
        letters[i] = { x, y, link };
      }
    }
  };

  p.mousePressed = () => {
    if (p.mouseButton === p.LEFT) {
      if (showText) {
        activeTooltip = null;

        // Detectar si se hizo clic en alguna letra
        for (let letter of letters) {
          let d = p.dist(p.mouseX, p.mouseY, letter.x, letter.y);
          if (d < 60) {
            activeTooltip = { x: letter.x, y: letter.y, link: letter.link };
            break;
          }
        }
      } else if (!showText && !explosionPhase) {
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
