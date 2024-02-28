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
let heehee = 0;
let font;

let score = 0;

function preload() {
  object = loadModel("attack.obj");
  sound = loadSound("blip.mp3");
  fire = loadImage("fire.gif");
  pink = loadImage("pinkfire.gif");
  comet = loadImage("comet.png");
    font = loadFont('AdobeDevanagari-Regular.otf');

}

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
  createCanvas(cam_w, cam_h, WEBGL);
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
  translate(-width / 2, -height / 2);
  translate(width, 0);
  scale(-1, 1);
  image(capture, 0, 0);
  pop();
  
  textSize(40);


  textFont(font);
  text("magic Lv. "+ score, -width/2+50,-height/2+50,1000)
  //d();

  if (poses.length > 0) {
    let pose = poses[0].pose;

    let elbowlx = pose.keypoints[7].position.x;
    let elbowly = pose.keypoints[7].position.y;
    let elbowrx = pose.keypoints[8].position.x;
    let elbowry = pose.keypoints[8].position.y;

    let wristlx = pose.keypoints[9].position.x;
    let wristly = pose.keypoints[9].position.y;
    let wristrx = pose.keypoints[10].position.x;
    let wristry = pose.keypoints[10].position.y;

    let elbowDis = sqrt(sq(elbowlx - elbowrx) + sq(elbowly - elbowry));
    let wristDis = sqrt(sq(wristlx - wristrx) + sq(wristly - wristry));

    let elbowMPx = abs(elbowlx + elbowrx) / 2;
    let elbowMPy = abs(elbowly + elbowry) / 2;
    let wristMPx = abs(wristlx + wristrx) / 2;
    let wristMPy = abs(wristly + wristry) / 2;

    //     fill(0, 255, 0);
    //     circle(-width / 2 + wristlx, -height / 2 + wristly, 20);
    //     circle(-width / 2 + wristrx, -height / 2 + wristry, 20);

    //     circle(-width / 2 + elbowlx, -height / 2 + elbowly, 20);
    //     circle(-width / 2 + elbowrx, -height / 2 + elbowry, 20);
    //     fill(255, 0, 0);
    //     circle(-width / 2 + wristMPx, -height / 2 + wristMPy, 30);
    //     circle(-width / 2 + elbowMPx, -height / 2 + elbowMPy, 30);

    CheckA(elbowDis, wristDis, elbowMPx, elbowMPy, wristMPx, wristMPy);
  }
}
function CheckA(elbowDis, wristDis, elbowMPx, elbowMPy, wristMPx, wristMPy) {
  let fired = 0;
  if (elbowDis < 200 && wristDis < 200) {
    magic(elbowMPx, elbowMPy, wristMPx, wristMPy);
    fired + 1;
  }
}
function magic(elbowMPx, elbowMPy, wristMPx, wristMPy) {
  console.log("magic called");
  let armAngle = atan((wristMPx - elbowMPx) / (wristMPy - elbowMPy));
  // fill(0, 0, 255);
  // circle(0, 0, 100);
  let Z = 1 + (frameCount % 100);

  translate(
    -width / 2 + wristMPx + 0.05 * (wristMPx - elbowMPx) * Z,
    -height / 2 + wristMPy + 0.05 * (wristMPx - elbowMPx) * Z,
    0.5 * Z);
  scale(50);
  //rotateZ(frameCount * 0.01);
  //translate(10, 10, 0);

  let change = [comet, fire, pink];

  if (Z <= 1) {
    sound.setVolume(0.2);
    sound.playMode("untilDone");
    sound.play();
    heehee += 1;
    score +=1;
    if (heehee > 2) {
      heehee = 0;
    
    }
  }

  rotateY(-armAngle);
  rotateX(armAngle);
  normalMaterial();

  texture(change[heehee]);

  model(object);
  
}
// function d() {
//   if (poses.length > 0) {
//     let pose = poses[0].pose;

//     //   0 nose
//     // 1 leftEye
//     // 2 rightEye
//     // 3 leftEar
//     // 4 rightEar
//     // 5 leftShoulder
//     // 6 rightShoulder
//     // 7 leftElbow
//     // 8 rightElbow
//     // 9 leftWrist
//     // 10 rightWrist
//     // 11 leftHip
//     // 12 rightHip
//     // 13 leftknee
//     // 14 rightKnee
//     // 15 leftAnkle
//     // 16 rightAnkle

//     let eyelx = pose.keypoints[1].position.x;
//     let eyely = pose.keypoints[1].position.y;
//     let eyerx = pose.keypoints[2].position.x;
//     let eyery = pose.keypoints[2].position.y;
//     let nosex = pose.keypoints[0].position.x;
//     let nosey = pose.keypoints[0].position.y;

//     // let earlx = pose.keypoints[3].position.x;
//     // let early = pose.keypoints[3].position.y;
//     // let earrx = pose.keypoints[4].position.x;
//     // let earry = pose.keypoints[4].position.y;

//     let elbowlx = pose.keypoints[7].position.x;
//     let elbowly = pose.keypoints[7].position.y;
//     let elbowrx = pose.keypoints[8].position.x;
//     let elbowry = pose.keypoints[8].position.y;

//     let wristrx = pose.keypoints[10].position.x;
//     let wristry = pose.keypoints[10].position.y;

//     //     let eyedis = sqrt(abs((eyerx - eyelx) * (eyerx - eyelx)) + abs((eyery - eyely) * (eyery - eyely)));

//     let O = (eyelx + eyerx) / 2 - nosex;
//     let A = (eyely + eyery) / 2 - nosey;
//     let headangle = atan(O / A);

//     // for (let Z=0;Z<1000;Z+=t*50){

//     // for (let Z=0;Z<100;Z++){
//     //   if(Z>=99){Z=0}

//     //    translate(0, 0, Z);

//     // push()
//     //   translate(0, 0, 200);
//     // pop()
//     //rotateZ(frameCount * 0.01);
//     //translate(10, 10, 0);

//     push();

//     translate(-width / 2 + nosex, -height / 2 + nosey, 0);
//     normalMaterial();
//     scale(15);
//     rotateY(headangle);
//     rotateX(-headangle);

//     model(object);
//     pop();
//   }
// }
