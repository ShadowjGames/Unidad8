// waves.js

const waveSketch = (p) => {
  let noiseMax = 1;
  let zoff = 0;
  let ca, cb;
  let ox, oy;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.angleMode(p.DEGREES);

    ca = p.color(10, 100, 120);  // Azul oscuro
    cb = p.color(120, 20, 60);   // Rosado oscuro

    ox = p.width / 2;
    oy = p.height;
    p.noFill();
  };

  p.draw = () => {
    p.background(0, 20);

    const colorFactor = (Math.sin(zoff) + 1) / 2;
    p.stroke(p.lerpColor(ca, cb, colorFactor));

    p.push();
    p.translate(ox, oy);
    p.beginShape();
    for (let t = 0; t < 360; t++) {
      let xoff = p.map(Math.cos(t), -1, 1, 0, noiseMax);
      let yoff = p.map(Math.sin(t), -1, 1, 0, noiseMax);
      let n = p.noise(xoff, yoff, zoff);
      let r = p.map(n, 0, 1, 0, p.height * 1.5);
      let x = r * Math.cos(t);
      let y = r * Math.sin(t);
      p.vertex(x, y);
    }
    p.endShape(p.CLOSE);
    p.pop();

    zoff += 0.003;
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

// Instancia para el contenedor de las ondas
new p5(waveSketch, "wave-canvas");
