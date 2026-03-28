document.addEventListener("DOMContentLoaded", () => {

  const clientId = "71af79e70d7f461bb0b0eea94d84aac4";
  const redirectUri = "http://127.0.0.1:5500/";

  const loginBtn = document.getElementById("loginBtn");
  const resultsDiv = document.getElementById("results");
  const demoDiv = document.getElementById("demo");

  loginBtn.addEventListener("click", () => {
  showDemo();   // no backend
});

  loginBtn.addEventListener("click", () => {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=user-read-email`;
    window.location.href = authUrl;
  });

  function getCodeFromUrl() {
    return new URLSearchParams(window.location.search).get("code");
  }

  async function getToken(code) {
    try {
      const res = await fetch(`http://localhost:3000/token?code=${code}`);
      const data = await res.json();
      return data.access_token;
    } catch {
      return null;
    }
  }

  async function getUserProfile(token) {
    try {
      const res = await fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: "Bearer " + token }
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      displayUser(data);

    } catch {
      displayFallback();
    }
  }

  function displayUser(user) {
    resultsDiv.innerHTML = `
      <h2>Welcome ${user.display_name} 🎧</h2>
      <p>${user.email}</p>
    `;
    showDemo();
  }

  function displayFallback() {
    showDemo();
  }

  function showDemo() {
    demoDiv.classList.remove("hidden");
    enableCardEffects();
    renderChart();
  }

  function enableCardEffects() {
    document.querySelectorAll(".card").forEach(card => {
      card.addEventListener("click", () => {
        card.style.transform = "scale(1.1)";
        setTimeout(() => card.style.transform = "", 200);
      });
    });
  }

  function renderChart() {
    const ctx = document.getElementById("genreChart");

    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Pop", "Hip-Hop", "Rock", "Indie"],
        datasets: [{
          data: [40, 25, 20, 15],
          backgroundColor: ["#1db954", "#ff4d6d", "#ffa94d", "#ffd43b"]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true, // ✅ circle fix
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
  }

  document.getElementById("shareBtn").addEventListener("click", () => {
    html2canvas(document.body).then(canvas => {
      const link = document.createElement("a");
      link.download = "wrapped.png";
      link.href = canvas.toDataURL();
      link.click();
    });
  });

  async function init() {
    const code = getCodeFromUrl();
    if (!code) return;

    const token = await getToken(code);
    await getUserProfile(token);

    window.history.replaceState({}, document.title, "/");
  }

  init();

});