const waveSketch = (p) => {
  let noiseMax = 1;
  let zoff = 0;
  let ca, cb;
  let ox, oy;
  let MAX;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.angleMode(p.DEGREES);
    ca = p.color("#0CCBCFAA");  // Color inicial de las ondas
    cb = p.color("#FE68B5AA");  // Color final de las ondas
    ox = p.width / 2;           // Centro de las ondas en el ancho
    oy = p.height;              // Centro de las ondas en el alto
    MAX = p.width > p.height ? p.width : p.height;
    p.noFill();
  };

  p.draw = () => {
    p.clear();
    p.stroke(p.lerpColor(ca, cb, Math.abs(Math.sin(zoff * 100))));
    p.push();
    p.translate(ox, oy);

    p.beginShape();
    for (let t = 0; t < 360; t++) {
      let xoff = p.map(p.cos(t), -1, 1, 0, noiseMax);
      let yoff = p.map(p.sin(t), -1, 1, 0, noiseMax);
      let n = p.noise(xoff, yoff, zoff);
      let r = p.map(n, 0, 1, 0, p.height * 1.5);
      let x = r * p.cos(t);
      let y = r * p.sin(t);
      p.vertex(x, y);
    }
    p.endShape(p.CLOSE);
    p.pop();

    zoff += 0.005;  // Incremento para animar el ruido
  };

  
  p.mousePressed = () => {
    if (p.mouseButton === p.LEFT) {
      explode = true;
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    ox = p.width / 2;
    oy = p.height;
  };
};

new p5(waveSketch, "wave-canvas");
