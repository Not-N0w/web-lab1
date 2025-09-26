const root = document.documentElement;
const styles = getComputedStyle(root);
const color_red_bright = styles.getPropertyValue("--color-bright-red").trim();
const color_red = styles.getPropertyValue("--color-red").trim();
const color_light = styles.getPropertyValue("--color-light").trim();

var xHit = [0];
var yHit = 0;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
let tooltip = document.getElementById("tooltip");
const aimPoint = new Image();
aimPoint.src = "img/cross-svgrepo-com.svg";

let r, canvasHeight, canvasWidth;



function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const cssWidth = rect.width;
  const cssHeight = rect.height;
  const dpr = window.devicePixelRatio || 1;
  const displayWidth = Math.round(cssWidth * dpr);
  const displayHeight = Math.round(cssHeight * dpr);


  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    r = (canvas.clientWidth/2 * imagePartRatio);
    canvasWidth = canvas.clientWidth;
    canvasHeight = canvas.clientHeight;
  }
}

function drawLine(x1, y1, x2, y2) {
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function updateRadiusAxisText() {

    ctx.fillText("R/2", canvasWidth/2 + r/2 - ctx.measureText("R/2").width/2, canvasHeight/2 + hatchLength/2 + letterHeight);
    ctx.fillText("R", canvasWidth/2 + r - ctx.measureText("R").width/2, canvasHeight/2 + hatchLength/2 + letterHeight);
    ctx.fillText("-R/2", canvasWidth/2 - r/2 - ctx.measureText("-R/2").width/2, canvasHeight/2 + hatchLength/2 + letterHeight);
    ctx.fillText("-R", canvasWidth/2 - r - ctx.measureText("-R").width/2, canvasHeight/2 + hatchLength/2 + letterHeight);

    ctx.fillText("R/2", canvasWidth/2 - hatchLength/2 - ctx.measureText("R/2").width - 4, canvasHeight/2 - r/2 + letterHeight/2 - 2);
    ctx.fillText("-R/2", canvasWidth/2 - hatchLength/2 - ctx.measureText("-R/2").width - 4, canvasHeight/2 + r/2 + letterHeight/2 - 2);
    ctx.fillText("R", canvasWidth/2 - hatchLength/2 - ctx.measureText("R").width - 4, canvasHeight/2 - r + letterHeight/2 - 2);
    ctx.fillText("-R", canvasWidth/2 - hatchLength/2 - ctx.measureText("-R").width - 4, canvasHeight/2 + r + letterHeight/2 - 2);

}

function drawAxis() {
    ctx.strokeStyle = color_light;
    ctx.lineWidth = 1;
    
    ctx.fillStyle = color_light;
    ctx.font = letterHeight + "px serif";

    ctx.beginPath();
    drawLine(0, canvasHeight / 2, canvasWidth, canvasHeight / 2)
    drawLine(canvasWidth/2 + r/2, canvasHeight/2 - hatchLength/2, canvasWidth/2 + r/2, canvasHeight/2 + hatchLength/2);
    drawLine(canvasWidth/2 + r, canvasHeight/2 - hatchLength/2,canvasWidth/2 + r, canvasHeight/2 + hatchLength/2);
    drawLine(canvasWidth/2 - r/2, canvasHeight/2 - hatchLength/2,canvasWidth/2 - r/2, canvasHeight/2 + hatchLength/2)
    drawLine(canvasWidth/2 - r, canvasHeight/2 - hatchLength/2,canvasWidth/2 - r, canvasHeight/2 + hatchLength/2);


    ctx.beginPath();
    ctx.moveTo(canvasWidth - hatchLength, canvasHeight/2 - hatchLength/2);
    ctx.lineTo(canvasWidth, canvasHeight/2);
    ctx.lineTo(canvasWidth - hatchLength, canvasHeight/2 + hatchLength/2);
    ctx.lineTo(canvasWidth - hatchLength, canvasHeight/2 - hatchLength/2);
    ctx.closePath();
    ctx.fill();

    ctx.fillText("X", canvasWidth - ctx.measureText("X").width - 5, canvasHeight/2 + hatchLength/2 + letterHeight);


    drawLine(canvasWidth/2, 0, canvasWidth/2, canvasHeight);
    drawLine(canvasWidth/2 - hatchLength/2, canvasHeight/2 - r/2,canvasWidth/2 + hatchLength/2, canvasHeight/2 - r/2);
    drawLine(canvasWidth/2 - hatchLength/2, canvasHeight/2 + r/2,canvasWidth/2 + hatchLength/2, canvasHeight/2 + r/2)
    drawLine(canvasWidth/2 - hatchLength/2, canvasHeight/2 - r,canvasWidth/2 + hatchLength/2, canvasHeight/2 - r)
    drawLine(canvasWidth/2 - hatchLength/2, canvasHeight/2 + r,canvasWidth/2 + hatchLength/2, canvasHeight/2 + r )

    updateRadiusAxisText()

    ctx.beginPath();
    ctx.moveTo(canvasWidth/2 - hatchLength/2, hatchLength);
    ctx.lineTo(canvasWidth/2, 0);
    ctx.lineTo(canvasWidth/2 + hatchLength/2, hatchLength);
    ctx.lineTo(canvasWidth/2 - hatchLength/2, hatchLength);
    ctx.closePath();
    ctx.fill();

    ctx.fillText("Y", canvasWidth/2 - ctx.measureText("X").width/2 - hatchLength/2 - 10, letterHeight + 2);

    ctx.closePath()
}
function drawHitPoint() {
    if(xHit != null && yHit != null) {
        const y = canvasHeight / 2 - (r / window.globalR * yHit);
        xHit.forEach(xPoint => {
            const x = (r / window.globalR * xPoint) + canvasWidth / 2;
            ctx.drawImage(aimPoint, x - 10, y - 10, 20, 20);
        });
    }
}

function drawFugure() {
    ctx.beginPath();
    ctx.moveTo(canvasWidth/2, canvasHeight/2);
    ctx.arc(canvasWidth/2, canvasHeight/2, r, Math.PI, 0.5* Math.PI, true);
    
    ctx.moveTo(canvasWidth/2 - r, canvasHeight/2);
    ctx.lineTo(canvasWidth/2, canvasHeight/2 - r);
    ctx.lineTo(canvasWidth/2, canvasHeight/2 - r/2);
    ctx.lineTo(canvasWidth/2 + r, canvasHeight/2 - r/2);
    ctx.lineTo(canvasWidth/2 + r, canvasHeight/2);
    ctx.lineTo(canvasWidth/2 , canvasHeight/2);

    ctx.closePath(); 
    ctx.fillStyle = color_red_bright;
    ctx.fill();

}


function drawHistory() {

    for(var i = 0; i < hits.length; ++i) {
        if(hits[i].r != window.globalR) continue;
        const y = canvasHeight / 2 - (r / window.globalR * hits[i].y);
        const x = (r / window.globalR * hits[i].x) + canvasWidth / 2;
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fillStyle = (hits[i].isHit ? "#3ece4aff" : "#f57138ff");
        ctx.fill(); 
    }
}

function fillCanvas() {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    resizeCanvas();
    drawFugure();
    drawAxis();
    drawHistory();
    drawHitPoint();
}

canvas.addEventListener(
    "mousemove", 
    (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = (event.clientX - rect.left - canvasWidth/2) * (window.globalR/r);
        const y = (canvasHeight/2 - (event.clientY - rect.top)) * (window.globalR/r);

        const roundedX = Math.round(x*10)/10;
        const roundedY =  Math.round(y*10)/10;
        tooltip.classList.remove("hidden");
        tooltip.innerHTML = 
            "X: " + " ".repeat(5 - roundedX.toString().length) + roundedX +
            " Y: " + " ".repeat(5 - roundedY.toString().length) + roundedY;    
        tooltip.style.left = event.pageX +10 + 'px';
        tooltip.style.top  = event.pageY + 'px';
    }
);

canvas.addEventListener(
    "mouseleave", 
    (event) => {
        tooltip.classList.add("hidden")
    }
);

window.addEventListener('globalCoordinatesChange', e => {
    xHit = window.globalX
    yHit = window.globalY
    fillCanvas()
});


aimPoint.onload = function() {
    fillCanvas()
};

