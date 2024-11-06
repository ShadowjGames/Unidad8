const waveSketch = (p) => {
  let yValues = [];
  let theta = 0;
  let waveAmplitude = 75;
  let waveFrequency = 0.05;
  let explode = false;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    for (let x = 0; x < p.width; x += 10) {
      yValues.push(0);
    }
  };

  p.draw = () => {
    p.clear();

    if (!explode) {
      // Dibuja las ondas normales
      p.noFill();
      p.stroke(0, 100, 200, 150);
      p.strokeWeight(2);
      theta += 0.02;
      let x = theta;
      for (let i = 0; i < yValues.length; i++) {
        yValues[i] = Math.sin(x) * waveAmplitude;
        x += waveFrequency;
      }
      for (let x = 0; x < yValues.length; x++) {
        p.ellipse(x * 10, p.height / 2 + yValues[x], 10, 10);
      }
    }
  };

  p.mousePressed = () => {
    if (p.mouseButton === p.LEFT) {
      explode = true;
    }
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

new p5(waveSketch, "wave-canvas");
