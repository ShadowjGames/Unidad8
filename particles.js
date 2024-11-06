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

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    centerX = p.width / 2;
    centerY = p.height / 2;
  };

  p.draw = () => {
    p.clear();
    textOpacity = Math.min(textOpacity + 3, 255);

    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(150);

    let spacing = 120;
    let startX = centerX - (spacing * (links.length - 1)) / 2;

    // Dibujar letras y detectar si el mouse está sobre alguna letra
    let hoveredLetter = null;
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

      if (p.dist(p.mouseX, p.mouseY, x, y) < 60) {
        hoveredLetter = { x, y, link };
      }
    }

    // Mostrar la burbuja de tooltip si hay una letra seleccionada
    if (hoveredLetter) {
      displayTooltip(hoveredLetter.x, hoveredLetter.y - 100, hoveredLetter.link.tooltip);
    }
  };

  const displayTooltip = (x, y, text) => {
    p.push();
    p.rectMode(p.CENTER);
    p.textAlign(p.CENTER, p.CENTER);

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
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    centerX = p.width / 2;
    centerY = p.height / 2;
  };
};

new p5(particleSketch, "particle-canvas");
