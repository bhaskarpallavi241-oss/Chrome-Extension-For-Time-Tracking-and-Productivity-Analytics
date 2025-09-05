fetch('http://localhost:5000/report')
  .then(res => res.json())
  .then(data => {
    document.getElementById('productive').innerText = data.productive.toFixed(2);
    document.getElementById('unproductive').innerText = data.unproductive.toFixed(2);
  });
fetch("http://localhost:5000/api/report")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("report");

    if (data.length === 0) {
      container.innerHTML = "<p>No data yet. Browse some websites!</p>";
      return;
    }

    data.forEach(site => {
      const div = document.createElement("div");
      div.classList.add("site");
      div.innerHTML = `
        <strong>${site.url}</strong> - 
        <span class="${site.classification}">
          ${site.classification}
        </span><br/>
        Time Spent: ${Math.round(site.totalDuration / 60)} mins
      `;
      container.appendChild(div);
    });
  })
  .catch(err => {
    console.error("Failed to fetch report", err);
  });
