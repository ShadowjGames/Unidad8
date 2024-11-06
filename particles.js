const particleSketch = (p) => {
  let particles = [];
  let centerX, centerY;
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
  let showText = false;
  let explosionPhase = false;

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
        textOpacity = 0;
      }
    } else if (showText) {
      textOpacity = Math.min(textOpacity + 3, 255);

      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(150);

      let spacing = 120;
      let startX = centerX - (spacing * (links.length - 1)) / 2;

      for (let i = 0; i < links.length; i++) {
        let link = links[i];
        let x = startX + i * spacing;
        let y = centerY;

        let color1 = p.color("#FE68B5");
        let color2 = p.color("#0CCBCF");
        let gradientColor = p.lerpColor(color1, color2, i / (links.length - 1));

        p.fill(gradientColor.levels[0], gradientColor.levels[1], gradientColor.levels[2], textOpacity);
        p.stroke(255, 255, 255, 150);
        p.strokeWeight(2);

        p.textSize(150 + Math.sin(p.frameCount * 0.05 + i) * 5);

        p.push();
        p.translate(5, 5);
        p.fill(0, 0, 0, textOpacity * 0.5);
        p.noStroke();
        p.text(link.letter, x, y);
        p.pop();

        p.text(link.letter, x, y);

        letters[i] = { x, y, link };
      }

      let hoveredLetter = letters.find(letter => p.dist(p.mouseX, p.mouseY, letter.x, letter.y) < 60);
      if (hoveredLetter && showText) {
        activeTooltip = hoveredLetter;
        displayTooltip(hoveredLetter.x, hoveredLetter.y - 100, hoveredLetter.link.tooltip);
      } else {
        activeTooltip = null;
      }
    }
  };

  const displayTooltip = (x, y, text) => {
    p.push();
    p.rectMode(p.CENTER);
    p.textAlign(p.CENTER, p.CENTER);
    p.noStroke();

    // Fondo con gradiente suave
    let gradColor1 = p.color("#FE68B5");
    let gradColor2 = p.color("#0CCBCF");
    for (let i = 0; i <= 15; i++) {
      let inter = p.map(i, 0, 15, 0, 1);
      let c = p.lerpColor(gradColor1, gradColor2, inter);
      p.fill(c.levels[0], c.levels[1], c.levels[2], 180 - i * 12);
      p.rect(x, y, p.textWidth(text) + 40 - i, 50 - i, 15);
    }

    // Sombra de la burbuja
    p.fill(0, 0, 0, 80);
    p.rect(x + 4, y + 4, p.textWidth(text) + 40, 50, 15);

    // Triángulo tipo globo de diálogo
    p.fill(gradColor1);
    p.triangle(x - 15, y + 25, x + 15, y + 25, x, y + 45);

    // Texto
    p.fill(255);
    p.textSize(18);
    p.text(text, x, y);

    p.pop();
  };

  p.mousePressed = () => {
    if (p.mouseButton === p.LEFT && activeTooltip) {
      window.open(activeTooltip.link.url, "_blank");
    } else if (p.mouseButton === p.LEFT && !showText && !explosionPhase) {
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
