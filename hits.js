var hitForm = document.getElementById("hit-form");
var hitsTable = document.getElementById("hits-table");
var hits = [];


function updateHitsTable() {
    hits.forEach(hit => {
        const row = hitsTable.insertRow(-1);
        row.insertCell(0).textContent = hit.x;
        row.insertCell(1).textContent = hit.y;
        row.insertCell(2).textContent = hit.r;
        row.insertCell(3).textContent = hit.isHit ? "Yes" : "No";
        row.insertCell(4).textContent = hit.executionTime;
        row.insertCell(5).textContent = hit.currentTime;
    });
} 

function processResponse(response) {
    if(response.status == "error") {
        dropDialog("error", response.message);
        return;
    }
    for (let i = 0; i < response.points.length; i++) {
        const point = response.points[i];
        hits.push(
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
    updateHitsTable();
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

