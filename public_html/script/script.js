var xCheckboxes = document.querySelectorAll('input[name="x-coordinate"]');
var rInput = document.getElementById("r-input");
var yInput = document.getElementById("y-input");
var dialog = document.getElementById("dialog-window");
var dialogButton = document.getElementById("got-it");
var dialogType = document.getElementById("dialog-window-type");
var dialogText = document.getElementById("dialog-window-text");
var yUpperBound = 5;
var yLowerBound = -5;



function roundToTenth(value) {
  return Math.round(value * 10) / 10;
}

function updateCoordsRestrictions() {
    yInput.value = (yInput.value > yUpperBound ? yUpperBound : yInput.value);
    yInput.value = (yInput.value < yLowerBound ? yLowerBound : yInput.value);

    window.globalY = (yInput.value > yUpperBound ? yUpperBound : yInput.value);
    window.globalY = (yInput.value < yLowerBound ? yLowerBound : yInput.value);
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
    var newValue = numberValidation(1, 4, preValidation(value));
    rInput.value = newValue;
    setGlobalHitCoordinates(window.globalX, window.globalY, newValue);
}


function updateYCoordinate(value) {
    var newValue = numberValidation(yLowerBound, yUpperBound, preValidation(value));
    yInput.value = newValue;
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



rInput.addEventListener("change", (event) => {
    updateRadius(event.target.value);
});

yInput.addEventListener("change", (event) => {
    updateYCoordinate(event.target.value)
});

xCheckboxes.forEach(cb => {
    cb.addEventListener('change', e => {
        setGlobalHitCoordinates(getXCoordinates(), window.globalY, window.globalR);
    });
});

xCheckboxes[4].checked = true;
setGlobalHitCoordinates([0], 0, 1)



