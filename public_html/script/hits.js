var hitForm = document.getElementById("hit-form");
var hitsTable = document.getElementById("hits-table");
var clearButton = document.getElementById("clear-button");
var radiusCheckbox = document.getElementById("radius-checkbox");
var isFixedR = false;

var hits = [];

function formatCell(content, maxLength = 20, maxVisible = 5 , minEnd = 2) {
    let display = content;
    if (content.length > maxLength) {
        display = `${content.slice(0, maxVisible)}...${content.slice(-minEnd)}`;
    }

    const span = document.createElement('span');
    span.textContent = display;
    span.title = content;
    return span;
}

function clearTable() {
    const rows = hitsTable.rows; 
    for (let i = rows.length - 1; i > 0; i--) {
        hitsTable.deleteRow(i);
    }
}

function updateHitsTable(diff) {
    diff.forEach(hit => {
        if(isFixedR && hit.r != window.globalR) return;
        const row = hitsTable.insertRow(1);

        row.insertCell(0).appendChild(formatCell(hit.x.toString()));
        row.insertCell(1).appendChild(formatCell(hit.y.toString()));
        row.insertCell(2).appendChild(formatCell(hit.r.toString()));

        const hitCell = row.insertCell(3);
        hitCell.textContent = hit.isHit ? "Yes" : "No";
        hitCell.title = hit.isHit ? "Hit" : "Miss";

        const execCell = row.insertCell(4);
        execCell.textContent = hit.executionTime;
        execCell.title = hit.executionTime.toString();

        const timeCell = row.insertCell(5);
        timeCell.textContent = hit.currentTime;
        timeCell.title = hit.currentTime;
    });
}


function saveHitsToCookies() {
    const json = JSON.stringify(hits);
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `hits=${encodeURIComponent(json)}; expires=${expires}; path=/`;
}

function loadHitsFromCookies() {
    const cookies = document.cookie.split(';').map(c => c.trim());
    const hitCookie = cookies.find(c => c.startsWith('hits='));
    if (hitCookie) {
        try {
            hits = JSON.parse(decodeURIComponent(hitCookie.split('=')[1]));
            updateHitsTable(hits);
        } catch (e) {
            hits = [];
        }
    }
}

function processResponse(response) {
    if(response==null) {
        dropDialog("error", "Server dead");
        return;
    }
    if(response.status == "error") {
        dropDialog("error", response.message);
        return;
    }
    diff = []
    for (let i = 0; i < response.points.length; i++) {
        const point = response.points[i];
        diff.push(
            {
                "x": point.x,
                "y": point.y,
                "r": response.r,
                "isHit": point.isHit,
                "executionTime": response.executionTime,
                "currentTime": response.currentTime   
            }
        );
    }
    hits=hits.concat(diff);
    saveHitsToCookies();
    clearTable();
    updateHitsTable(hits);
    
}
async function doFetch() {
  const x = window.globalX
  const y = window.globalY
  const r = window.globalR

  const formBody = new URLSearchParams();
  formBody.append('x', x);
  formBody.append('y', y);
  formBody.append('r', r);


  try {
    const resp = await fetch(POST_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formBody.toString()
    });

    if (!resp.ok) {
      throw new Error(`Sending error! status: ${resp.status}`);
    }

    const data = await resp.json();

    return data; 
  } catch (err) {
    dropDialog("error", err);
    return null;
  }
}


hitForm.addEventListener('submit', async function (event) {
  event.preventDefault(); 

  const response = await doFetch();
  processResponse(response);
});


clearButton.addEventListener("click", (event) => {
    hits = []
    document.cookie = "hits=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    clearTable()
    window.dispatchEvent(new CustomEvent('globalCoordinatesChange', {
        detail: { x: window.globalX, y: window.globalY, r: window.globalR } 
    }));
});

radiusCheckbox.addEventListener(
    "change",
    (event) => {
        isFixedR = !isFixedR;
        clearTable();
        updateHitsTable(hits);
    }
);
window.addEventListener('globalCoordinatesChange', e => {
    clearTable();
    updateHitsTable(hits);
});


loadHitsFromCookies();