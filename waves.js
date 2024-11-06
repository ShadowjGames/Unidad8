// waves.js optimizado

const waveSketch = (p) => {
  let noiseMax = 1;
  let zoff = 0;
  let ca, cb;
  let ox, oy;
  let colorFactor = 0;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.angleMode(p.DEGREES);

    ca = p.color(10, 100, 120);  // Azul oscuro
    cb = p.color(120, 20, 60);   // Rosado oscuro

    ox = p.width / 2;
    oy = p.height;
    p.noFill();

    // Establecemos una tasa de frames más baja
    p.frameRate(30); // Se actualiza a 30 FPS en lugar de 60 FPS para reducir la carga.
  };

  p.draw = () => {
    p.background(0, 20);

    // Actualización del color menos frecuente (cada 10 frames)
    if (p.frameCount % 10 === 0) {
      colorFactor = (Math.sin(zoff) + 1) / 2;
    }
    p.stroke(p.lerpColor(ca, cb, colorFactor));

    p.push();
    p.translate(ox, oy);
    p.beginShape();

    // Menos vértices en el ciclo for para mejorar rendimiento
    for (let t = 0; t < 360; t += 5) { // Cambiamos de 1 a 5 para reducir puntos
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

    // Incremento de `zoff` más lento
    zoff += 0.001; // Reducimos la velocidad de cambio para ahorrar procesamiento
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

// Instancia para el contenedor de las ondas
new p5(waveSketch, "wave-canvas");
