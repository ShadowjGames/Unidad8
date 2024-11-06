const waveSketch = (p) => {
  let noiseMax = 1;
  let zoff = 0;
  let ca, cb;
  let centerX, centerY;
  let MAX_RADIUS;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.angleMode(p.DEGREES);
    ca = p.color("#0CCBCFAA");  // Color inicial de las ondas
    cb = p.color("#FE68B5AA");  // Color final de las ondas
    centerX = p.width / 2;
    centerY = p.height / 2;
    MAX_RADIUS = p.width > p.height ? p.width * 0.8 : p.height * 0.8;
    p.noFill();
  };

  p.draw = () => {
    p.clear();
    p.stroke(p.lerpColor(ca, cb, Math.abs(Math.sin(zoff * 100))));
    p.strokeWeight(2);

    p.push();
    p.translate(centerX, centerY);

    // Comienza a dibujar la onda circular usando Perlin Noise en un ciclo de 360 grados
    p.beginShape();
    for (let angle = 0; angle < 360; angle += 5) {
      // Calcula el desplazamiento de ruido para x e y
      let xoff = p.map(p.cos(angle), -1, 1, 0, noiseMax);
      let yoff = p.map(p.sin(angle), -1, 1, 0, noiseMax);
      let n = p.noise(xoff, yoff, zoff);
      
      // Radio de la onda basado en el ruido, ajustado al tamaño máximo de la pantalla
      let radius = p.map(n, 0, 1, MAX_RADIUS * 0.3, MAX_RADIUS);
      let x = radius * p.cos(angle);
      let y = radius * p.sin(angle);
      p.vertex(x, y);
    }
    p.endShape(p.CLOSE);
    p.pop();

    // Incrementa el z-offset para animar la forma
    zoff += 0.01;
  };

    p.mousePressed = () => {
    if (p.mouseButton === p.LEFT) {
      explode = true;
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

