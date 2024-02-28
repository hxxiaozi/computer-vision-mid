// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// https://learn.ml5js.org/#/reference/posenet

/* ===
ml5 Example
PoseNet example using p5.js
=== */

let capture;
let poseNet;
let poses = []; // this array will contain our detected poses (THIS IS THE IMPORTANT STUFF)
const cam_w = 640;
const cam_h = 480;

const options = {
  architecture: "MobileNetV1",
  imageScaleFactor: 0.3,
  outputStride: 16, // 8, 16 (larger = faster/less accurate)
  flipHorizontal: true,
  minConfidence: 0.5,
  maxPoseDetections: 3, // 5 is the max
  scoreThreshold: 0.5,
  nmsRadius: 20,
  detectionType: "multiple",
  inputResolution: 257, // 161, 193, 257, 289, 321, 353, 385, 417, 449, 481, 513, or 801, smaller = faster/less accurate
  multiplier: 0.5, // 1.01, 1.0, 0.75, or 0.50, smaller = faster/less accurate
  quantBytes: 2,
};

function setup() {
  createCanvas(cam_w, cam_h);
  capture = createCapture(VIDEO);
  capture.size(cam_w, cam_h);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(capture, options, modelReady);

  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected.
  poseNet.on("pose", function (results) {
    poses = results;
  });

  // Hide the capture element, and just show the canvas
  capture.hide();
}

// this function gets called once the model loads successfully.
function modelReady() {
  console.log("Model loaded");
}

function draw() {
  // mirror the capture being drawn to the canvas
  push();
  translate(width, 0);
  scale(-1, 1);
  image(capture, 0, 0);
  pop();

  drawRightHand();
}
function drawRightHand() {
  if (poses.length > 0) {
    let pose = poses[0].pose;

    let rwx = pose.keypoints[10].position.x;
    let rwy = pose.keypoints[10].position.y;
    let lex = pose.keypoints[1].position.x;
    let ley = pose.keypoints[1].position.y;
    let rex = pose.keypoints[2].position.x;
    let rey = pose.keypoints[2].position.y;
    let nx = pose.keypoints[0].position.x;
    let ny = pose.keypoints[0].position.y;

    let lrx = pose.keypoints[3].position.x;
    let lry = pose.keypoints[3].position.y;
    let rrx = pose.keypoints[4].position.x;
    let rry = pose.keypoints[4].position.y;
    
    let eyedis = sqrt(
      abs((rex - lex) * (rex - lex)) + abs((rey - ley) * (rey - ley))
    );

    let O = (lex + rex) / 2 - nx;
    let A = (ley + rey) / 2 - ny;
    let headangle = atan(O / A);

    textAlign(CENTER);
   textSize(eyedis*0.7)

    push();
    translate(nx, ny);
    rotate(-headangle);
    translate(-nx, -ny);

    
    noFill();
     ellipse(nx, ny, eyedis * 2.25, eyedis * 2.5 + abs((ley + rey) / 2 - ny));
    fill(0);
    
    text("👃", nx, ny+eyedis*0.1);
    text("👄", nx, ny+eyedis*0.8);
    textSize(20+eyedis);
    text("🧠",nx,ny-eyedis)
    textSize(eyedis*0.35);
    text("no face", nx, ny);
    //eyedis*2+2*abs((ley+rey)/2-ny)

    pop();

    push();
    translate(lex, ley);
    rotate(-headangle);
    translate(-lex, -ley);
    text("👁️",lex,ley+eyedis*0.2)
    pop();

    push();
    translate(rex, rey);
    rotate(-headangle);
    translate(-rex, -rey);
   
  
    text("👁️",rex,rey+eyedis*0.2)
    pop();

    
    push();
    translate(rrx, rry);
    rotate(-headangle);
    translate(-rrx, -rry);
    text("👂",rrx,rry+eyedis*0.2)
    pop();
    
    if (rwy < ny) {
    
      text("🙋", rwx, rwy);
    }else{
      fill("tomato");
       textSize(30);
      text("right wrist", rwx, rwy);
    }
  }
}
