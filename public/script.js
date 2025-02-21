const BACKEND_URL = "https://glorious-space-potato-vpvvqvrqg93xjv7-3000.app.github.dev";

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const steamId = urlParams.get("steamId");

    if (steamId) {
        document.getElementById("steamId").value = steamId;
        getPlayerInfo();
    }
});

async function getPlayerInfo() {
    const steamId = document.getElementById("steamId").value;
    if (!steamId) return alert("Please enter a Steam ID");

    // Update URL for sharing
    const newUrl = `${window.location.origin}${window.location.pathname}?steamId=${steamId}`;
    window.history.pushState({}, '', newUrl);

    try {
        const response = await fetch(`${BACKEND_URL}/api/player/${steamId}`);
        const data = await response.json();

        if (data.name) {
            document.getElementById("output").innerHTML = `
                <div id="player-card" class="mt-4 p-6 bg-gray-700 rounded-lg border border-yellow-500 shadow-md">
                    <img src="${data.avatar}" alt="Avatar" class="mx-auto mb-3 w-24 h-24 rounded-lg border border-yellow-400 shadow-md">
                    <p class="text-xl font-bold">${data.name}</p>
                    <a href="${data.profileUrl}" target="_blank" class="text-blue-400 hover:underline">View Profile</a>

                    <div class="mt-4 text-left space-y-2">
                        <p><strong>Steam ID:</strong> ${data.steamId}</p>
                        <p><strong>Last Log Off:</strong> ${data.lastLogOff}</p>
                        <p><strong>Account Age:</strong> ${data.accountAge} years</p>
                        <p><strong>CS2 Hours Played:</strong> ${data.hoursPlayed}</p>
                        <p class="${data.vacBans > 0 ? 'text-red-400' : 'text-green-400'}">
                            <strong>VAC Bans:</strong> ${data.vacBans}
                        </p>
                        <p class="${data.gameBans > 0 ? 'text-red-400' : 'text-green-400'}">
                            <strong>Game Bans:</strong> ${data.gameBans}
                        </p>
                        <p><strong>Community Banned:</strong> ${data.communityBanned ? 'Yes' : 'No'}</p>
                        <p><strong>Economy Ban:</strong> ${data.economyBan}</p>

                        <p class="text-xl mt-4 font-bold ${data.trustFactor >= 700 ? 'text-green-400' : data.trustFactor >= 400 ? 'text-yellow-400' : 'text-red-400'}">
                            🔥 Trust Factor Score: ${data.trustFactor}/1000
                        </p>
                    </div>
                </div>
                <canvas id="trustFactorChart" class="mt-6"></canvas>
                <div class="mt-4 flex justify-center space-x-4">
                    <button onclick="sharePage()" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">Share Page</button>
                    <button onclick="shareCard()" class="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">Share Card</button>
                </div>
            `;

            // Update or create the bar chart
            drawTrustFactorGraph(data.trustFactor);
        } else {
            document.getElementById("output").innerHTML = `<p class="text-red-400">No player found.</p>`;
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById("output").innerHTML = `<p class="text-red-400">Error fetching data.</p>`;
    }
}

// 🎨 Draw or Update the Trust Factor Chart
function drawTrustFactorGraph(trustFactor) {
    const ctx = document.getElementById("trustFactorChart").getContext("2d");

    // 🔥 Fix: Check if `trustFactorChart` is a valid Chart.js instance before calling `.destroy()`
    if (trustFactorChart instanceof Chart) {
        trustFactorChart.destroy();
    }

    // Create the new bar chart
    trustFactorChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Trust Factor"],
            datasets: [{
                label: "Trust Factor Score",
                data: [trustFactor],
                backgroundColor: trustFactor >= 700 ? "#10B981" : trustFactor >= 400 ? "#F59E0B" : "#EF4444",
                borderColor: "#fff",
                borderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    min: 0,
                    max: 1000,
                    ticks: {
                        stepSize: 200,
                        color: "#fff"
                    },
                    grid: {
                        color: "rgba(255, 255, 255, 0.2)"
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}
function sharePage() {
    const shareUrl = window.location.href;

    if (navigator.share) {
        navigator.share({
            title: "Check this CS Trust Factor!",
            text: "See this player's trust factor details:",
            url: shareUrl
        }).catch(console.error);
    } else {
        navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
    }
}

async function shareCard() {
    const playerCard = document.getElementById("player-card");

    if (!playerCard) {
        alert("No player card to share!");
        return;
    }

    // Ensure the profile image is properly loaded
    const img = playerCard.querySelector("img");
    if (img) {
        const newImg = await loadImage(img.src); // Load image with CORS handling
        img.src = newImg;
    }

    try {
        const canvas = await html2canvas(playerCard, {
            useCORS: true, // Enable cross-origin image capturing
            allowTaint: true, // Allows tainted images (not always needed)
            scale: 2 // Higher resolution
        });

        const image = canvas.toDataURL("image/png");

        const link = document.createElement("a");
        link.href = image;
        link.download = "CS_Trust_Factor.png";
        link.click();

        alert("Card image saved!! You can now share it.");
    } catch (error) {
        console.error("Error generating image:", error);
        alert("Failed to generate image.");
    }
}

// Helper function to properly load an image before rendering
async function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous"; // Ensure cross-origin loading
        img.src = url;
        img.onload = () => resolve(img.src);
        img.onerror = (e) => reject(e);
    });
}