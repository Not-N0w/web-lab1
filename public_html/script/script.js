
var rRangeInput = document.getElementById("r-range-input");
var yRangeInput = document.getElementById("y-range-input");
var xCheckboxes = document.querySelectorAll('input[name="x-coordinate"]');
var rInput = document.getElementById("r-input");
var yInput = document.getElementById("y-input");
var dialog = document.getElementById("dialog-window");
var dialogButton = document.getElementById("got-it");
var dialogType = document.getElementById("dialog-window-type");
var dialogText = document.getElementById("dialog-window-text");
var coordinateUpperBound;
var coordinateLowerBound;



function roundToTenth(value) {
  return Math.round(value * 10) / 10;
}

function updateCoordsRestrictions() {
    coordinateLowerBound = roundToTenth(-window.globalR * (1/imagePartRatio - 0.2));
    coordinateUpperBound = roundToTenth(window.globalR * (1/imagePartRatio - 0.2));

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

    const xValues = [-window.globalR *1.5, -window.globalR, -window.globalR/2, 0, window.globalR/2, window.globalR, window.globalR * 1.5]
    for(let i = 0; i < xValues.length; ++i) {
        xCheckboxes[i].value = Math.round(xValues[i]*10)/10;
        const label = document.querySelector(`label[for="${xCheckboxes[i].id}"]`);
        label.innerHTML=Math.round(xValues[i]*10)/10;
    }
}
function preValidation(value) {
    return value.replace(/,/g, ".").trim();
}

function numberValidation(lowerBound, upperBound, value) {
    if(!(/^-?(?:\d+|\d*\.\d+)$/.test(value))) {
        dropDialog("warning", "Invalid number! <br>(Changed to 1)");
        return 1
    }
    if(value > upperBound) {
        console.log(upperBound)
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
    var newValue = numberValidation(rLowerBound, rUpperBound, preValidation(value));
    if(/[.,]/.test(value)) {
        newValue = Math.round(preValidation(value)) == NaN ? Math.round(preValidation(value)) : 1
        dropDialog("warning", "Value must be integer! <br>(Changed to "+newValue+")");
    }
    rInput.value = newValue;   
    rRangeInput.value = newValue;

    setGlobalHitCoordinates(window.globalX, window.globalY, newValue);
}


function updateYCoordinate(value) {
    console.log(preValidation(value))
    var newValue = numberValidation(coordinateLowerBound, coordinateUpperBound, preValidation(value));
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
    return result;
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
rInput.addEventListener("change", (event) => {
    updateRadius(event.target.value);
});

yRangeInput.addEventListener("input", (event) => {
    updateYCoordinate(event.target.value)
});
yInput.addEventListener("change", (event) => {
    updateYCoordinate(event.target.value)
});

xCheckboxes.forEach(cb => {
    cb.addEventListener('change', e => {
        setGlobalHitCoordinates(getXCoordinates(), window.globalY, window.globalR);
    });
});

xCheckboxes[3].checked = true;
setGlobalHitCoordinates([0], 0, 1)



