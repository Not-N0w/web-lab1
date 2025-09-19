const rUpperBound = 10;
const rLowerBound = 1;
const imagePartRatio = 0.7;

var rRangeInput = document.getElementById("r-range-input");
var yRangeInput = document.getElementById("y-range-input");
var xCheckboxes = document.querySelectorAll('input[name="x-coordinate"]');
var rInput = document.getElementById("r-input");
var yInput = document.getElementById("y-input");
var bgSelector = document.getElementById("bg-selector");
var dialog = document.getElementById("dialog-window");
var dialogButton = document.getElementById("got-it");
var dialogType = document.getElementById("dialog-window-type");
var dialogText = document.getElementById("dialog-window-text");
var coordinateUpperBound;
var coordinateLowerBound;
var isCustomX = false;



function roundToTenth(value) {
  return Math.round(value * 10) / 10;
}

function updateCoordsRestrictions() {
    coordinateLowerBound = roundToTenth(-window.globalR * (1/imagePartRatio) + 0.1);
    coordinateUpperBound = roundToTenth(window.globalR * (1/imagePartRatio) -0.1);


    yRangeInput.max = coordinateUpperBound;
    yRangeInput.min = coordinateLowerBound;
    yInput.max = coordinateUpperBound;
    yInput.min = coordinateLowerBound;

    yInput.value = (yInput.value > coordinateUpperBound ? coordinateUpperBound : yInput.value);
    yInput.value = (yInput.value < coordinateLowerBound ? coordinateLowerBound : yInput.value);
    
    window.globalY = (yInput.value > coordinateUpperBound ? coordinateUpperBound : yInput.value);
    window.globalY = (yInput.value < coordinateLowerBound ? coordinateLowerBound : yInput.value);

    for(let i = 0; i < window.globalX.length; ++i) {
        window.globalX[i] = (window.globalX[i] < coordinateLowerBound ? coordinateLowerBound : window.globalX[i]);
        window.globalX[i] = (window.globalX[i] >  coordinateUpperBound ? coordinateUpperBound : window.globalX[i]);
    }

    const xValues = [-window.globalR *(1/imagePartRatio) + 0.1, -window.globalR, -window.globalR/2, 0, window.globalR/2, window.globalR, window.globalR * (1/imagePartRatio) - 0.1]
    for(let i = 0; i < xValues.length; ++i) {
        xCheckboxes[i].value = Math.round(xValues[i]*10)/10;
        const label = document.querySelector(`label[for="${xCheckboxes[i].id}"]`);
        label.innerHTML=Math.round(xValues[i]*10)/10;
    }
}

function numberValidation(lowerBound, upperBound, value) {
    if(/[a-zA-Zа-яА-ЯёЁ]/.test(value)) {
        dropDialog("warning", "Value must contain only numbers! <br>(Changed to 1)");
        return 1
    }
    if(value > upperBound) {
        dropDialog("warning","Value must be lower than " + upperBound + "!<br>(Changed to " + upperBound + ")");
        return upperBound
    }
    if(value < lowerBound) {
        dropDialog("warning","Value must be upper than " + lowerBound + "!<br>(Changed to " + lowerBound + ")");
        return lowerBound
    }
    return value;
}

function updateRadius(value) {
    var newValue = numberValidation(rLowerBound, rUpperBound, value);
    rInput.value = newValue;   
    rRangeInput.value= newValue;

    setGlobalHitCoordinates(window.globalX, window.globalY, newValue);
    bgSelector.style.left = (window.globalX[0] / (2*window.globalR *(1/imagePartRatio))) * (100 - 100/7) + (50-50/7)  + "%";
}


function updateYCoordinate(value) {
    var newValue = numberValidation(coordinateLowerBound, coordinateUpperBound, value);
    yInput.value = newValue;
    yRangeInput.value = newValue;
    setGlobalHitCoordinates(window.globalX, newValue, window.globalR);
}

function setGlobalHitCoordinates(xValue, yValue, rValue) {
    window.globalY = yValue;
    window.globalX = xValue;
    window.globalR = rValue;
    updateCoordsRestrictions();
    window.globalX = getXCoordinates();

    window.dispatchEvent(new CustomEvent('globalCoordinatesChange', {
        detail: { x: xValue, y: yValue, r: rValue } 
    }));
}

function getXCoordinates() {
    let result = []
    xCheckboxes.forEach(cb => {
        if(cb.checked) {
            result.push(cb.value)
        }
    });
    return (isCustomX ? window.globalX : result);
}
function dropDialog(type, message) {
    dialog.classList.add(type);
    dialog.classList.remove("hidden");
    dialogType.innerHTML=type.toUpperCase();
    dialogText.innerHTML=message;
}

function hideDialog() {
    if(!dialog.classList.contains("hidden")) {
        dialog.classList.add("hidden");
    }
}


rRangeInput.addEventListener("input", (event) => {
    updateRadius(event.target.value);
});
rInput.addEventListener("input", (event) => {
    updateRadius(event.target.value);
});

yRangeInput.addEventListener("input", (event) => {
    updateYCoordinate(event.target.value)
});
yInput.addEventListener("input", (event) => {
    updateYCoordinate(event.target.value)
});
window.addEventListener('globalCoordinatesChangeByCanvas', e => {
    isCustomX = true;
    xCheckboxes.forEach(el => {
        el.checked = false;
    });
    bgSelector.classList.add("uneven");
    bgSelector.style.left = (window.globalX[0] / (2*window.globalR *(1/imagePartRatio))) * (100 - 100/7) + (50-50/7)  + "%";
    updateYCoordinate(window.globalY);
});

xCheckboxes.forEach(cb => {
    cb.addEventListener('change', e => {
        isCustomX = false;
        bgSelector.classList.remove("uneven");
        setGlobalHitCoordinates(getXCoordinates(), window.globalY, window.globalR);
    });
    
});

xCheckboxes[3].checked = true;
setGlobalHitCoordinates([0], 0, 1)



