const waveSketch = (p) => {
  let noiseMax = 1;
  let zoff = 0;
  let ca, cb;
  let centerX, centerY;
  let MAX_RADIUS;
  let explosionPhase = false;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.angleMode(p.DEGREES);
    ca = p.color("#0CCBCFAA");
    cb = p.color("#FE68B5AA");
    centerX = p.width / 2;
    centerY = p.height / 2;
    MAX_RADIUS = p.width > p.height ? p.width * 0.8 : p.height * 0.8;
    p.noFill();
  };

  p.draw = () => {
    p.clear();

    if (!showText && !explosionPhase) {
      p.stroke(p.lerpColor(ca, cb, Math.abs(Math.sin(zoff * 100))));
      p.strokeWeight(2);

      p.push();
      p.translate(centerX, centerY);

      p.beginShape();
      for (let angle = 0; angle < 360; angle += 5) {
        let xoff = p.map(p.cos(angle), -1, 1, 0, noiseMax);
        let yoff = p.map(p.sin(angle), -1, 1, 0, noiseMax);
        let n = p.noise(xoff, yoff, zoff);
        
        let radius = p.map(n, 0, 1, MAX_RADIUS * 0.3, MAX_RADIUS);
        let x = radius * p.cos(angle);
        let y = radius * p.sin(angle);
        p.vertex(x, y);
      }
      p.endShape(p.CLOSE);
      p.pop();

      zoff += 0.01;
    } else if (explosionPhase) {
      // Expandir y desvanecer las ondas para una transición suave
      MAX_RADIUS += 10; // Expande las ondas progresivamente
      let opacity = p.map(MAX_RADIUS, p.width * 0.8, Math.max(p.width, p.height) * 2, 255, 0);
      p.stroke(p.red(cb), p.green(cb), p.blue(cb), opacity); // Gradualmente se hace transparente

      p.push();
      p.translate(centerX, centerY);
      
      p.beginShape();
      for (let angle = 0; angle < 360; angle += 5) {
        let xoff = p.map(p.cos(angle), -1, 1, 0, noiseMax);
        let yoff = p.map(p.sin(angle), -1, 1, 0, noiseMax);
        let n = p.noise(xoff, yoff, zoff);
        
        let radius = p.map(n, 0, 1, MAX_RADIUS * 0.3, MAX_RADIUS);
        let x = radius * p.cos(angle);
        let y = radius * p.sin(angle);
        p.vertex(x, y);
      }
      p.endShape(p.CLOSE);
      p.pop();

      if (MAX_RADIUS > Math.max(p.width, p.height) * 2) {
        explosionPhase = false;
        showText = true; // Habilita `showText` pero sin dibujar el texto
      }
    }
  };

  p.mousePressed = () => {
    if (p.mouseButton === p.LEFT) {
      explosionPhase = true;
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    centerX = p.width / 2;
    centerY = p.height / 2;
    MAX_RADIUS = p.width > p.height ? p.width * 0.8 : p.height * 0.8;
  };
};

new p5(waveSketch, "wave-canvas");
