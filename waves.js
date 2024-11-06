let noiseMax = 1;
let zoff = 0;
let ca, cb;
let ox, oy;

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent("canvas-container");
  angleMode(DEGREES);

  // Colores de las ondas
  ca = color("#0CCBCFAA");
  cb = color("#FE68B5AA");
  
  // Centro de las ondas
  ox = width / 2;
  oy = height;
  
  noFill();
  background("#E7ECF2");
}

function draw() {
  background(0, 10); // Fondo negro semi-transparente para rastro
  
  stroke(lerpColor(ca, cb, abs(sin(zoff * 100)))); // Interpolación de color
  push();
  translate(ox, oy); // Centra las ondas en la parte inferior
  beginShape();
  for (let t = 0; t < 360; t++) {
    let xoff = map(cos(t), -1, 1, 0, noiseMax);
    let yoff = map(sin(t), -1, 1, 0, noiseMax);
    let n = noise(xoff, yoff, zoff);
    let r = map(n, 0, 1, 0, height * 1.5);
    let x = r * cos(t);
    let y = r * sin(t);
    vertex(x, y);
  }
  endShape(CLOSE);
  
  zoff += 0.005;
}

// Ajuste de tamaño de canvas al cambiar el tamaño de la ventana
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
