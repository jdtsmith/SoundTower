var canvas = document.getElementById("spectrum");
canvas.width = 1000;		// units 
canvas.height = 600;

var ctx = canvas.getContext("2d");


// Need 3 files: controls.js (REST option controls), draw.js (Canvas-based drawing), and data.js (WS receive/decode data)

// Idea: we ask for "positions" of all the points via a FETCH/GET to
// /frequencies which python server side provides as a 16 bit integer
// list of closest integers on the range 0-65535 (N=500 points or so),
// probably just via JSON.  Do we need to ask for these, or is it all
// "computable"?  I guess if the "blending" algorithm changes it's
// easier to compute in one place and communicate on startup. Should
// otherwise never change. The number of note bars to draw we can
// compute after asking for things like octaves and notes per octave.
// Then it's a matter of mapping the 16bit unsigned integer range to
// actual width of canvas.

// Binary Data format:

// - 1 Byte Volume: RMS as an absolute dB relative to dB=0 =
// 32768/sqrt(2) on the PCM data, or maybe better dB relative to a
// Sliding "recent" max level (config it and try!)). Draw as a
// horizontal alpha rectangle band at top..

// - 1 byte "beat-detected" boolean (or maybe a beat strength > 0 in a
// few steps).  N_note normalized folded note amplitudes.

// - N_MRFFT individual scaled multi-resolution FFT samples (y only!)
// (as requested above in /positions), also normalized.
// From this Canvas2D can draw the spectrum by scaling to nearest integer
// (or float?).

// - 1 byte NPeaks number of detected peaks (255 max)

// - NPeaks x,y 16bit uint pairs depicting the detected peak locations for highlight

// For the canvas plotting data, use 16bit unsigned, *little endian*
// (default S16LE CD streaming format) -- use <i2 to indicate LE on
// numpy side (then memoryview() it!), and on browser/client side, use
// dataview's getUint16 with littleEndian argument set to true to read
// the ArrayBuffer as LE 16-bit bytes.

function plot(x,y,xrange,yrange) {
  

//setInterval(show,1000)
function show() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth=2;
  ctx.strokeStyle="#0008"; 

  ctx.beginPath();
  ctx.moveTo(0, 600);
  for(i=0;i<400;i++) {
   ctx.lineTo(Math.floor(Math.random() * 840),
               Math.floor(Math.random() * 600)); 
  }
  ctx.stroke();

  
  ctx.fillStyle = "#58A27C";
  for(i=0;i<20;i++) {
    let x=Math.floor(Math.random() * 840),
        y=Math.floor(Math.random() * 600);
    ctx.strokeStyle="#000d"; 
    ctx.beginPath();
    ctx.arc(x,y,5,0,2*Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "#0006";
    ctx.beginPath();
    ctx.moveTo(x, 600);
    ctx.lineTo(x,y);
    ctx.stroke();
  }
}



var canvas = document.getElementById("myCanvas");
canvas.width = 840;
canvas.height = 600;

var ctx = canvas.getContext("2d");

setInterval(show,50)
function show() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth=2;
  ctx.strokeStyle="#0008"; 

  ctx.beginPath();
  ctx.moveTo(0, 600);
  for(i=0;i<400;i++) {
   ctx.lineTo(Math.floor(Math.random() * 840),
               Math.floor(Math.random() * 600)); 
  }
  ctx.stroke();

  
  ctx.fillStyle = "#58A27C";
  for(i=0;i<20;i++) {
    let x=Math.floor(Math.random() * 840),
        y=Math.floor(Math.random() * 600);
    ctx.strokeStyle="#000d"; 
    ctx.beginPath();
    ctx.arc(x,y,5,0,2*Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = "#0006";
    ctx.beginPath();
    ctx.moveTo(x, 600);
    ctx.lineTo(x,y);
    ctx.stroke();
  }
}




/*
ctx.beginPath();
ctx.fillStyle = "#58A27C";
ctx.moveTo(265, 150);
ctx.lineTo(295, 150);
ctx.lineTo(255, 325);
ctx.lineTo(225, 325);
ctx.fill();

ctx.font = "30px Arial";
ctx.fillText("Hello Elevator Code!!",50,40);

ctx.beginPath();
ctx.arc(390,200,40,0,2*Math.PI);
ctx.stroke();
*/

/*
ctx.beginPath();
ctx.fillStyle = "#58A27C";
ctx.moveTo(265, 150);
ctx.lineTo(295, 150);
ctx.lineTo(255, 325);
ctx.lineTo(225, 325);
ctx.fill();

ctx.font = "30px Arial";
ctx.fillText("Hello Elevator Code!!",50,40);

ctx.beginPath();
ctx.arc(390,200,40,0,2*Math.PI);
ctx.stroke();
*/


  function paintCanvas(canvas, data) {
    // get the canvas drawing context
    const context = canvas.getContext('2d');

    // clear the canvas from previous drawing
    context.clearRect(0, 0, canvas.width, canvas.height);

    //...
The function then paints a circle for each point. Note that we assume our data comes with x and y values between 0 and 1, so we need to scale these values by the canvas' height and width.

//...
    // draw a circle for each datum
    data.forEach(d => { // start a new path for drawing
        context.beginPath();

        // paint an arc based on the datum
        const x = d.x * canvas.width;
        const y = d.y * canvas.height;
        context.arc(x, y, 2, 0, 2 * Math.PI);

        // fill the point
        context.fill();
    });
}

