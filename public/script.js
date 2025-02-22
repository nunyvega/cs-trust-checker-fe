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

        if (data.steam.name) {
            let faceitContent = `<p class="mt-4 text-gray-400">⚠️ No Faceit profile found.</p>`;

            if (data.faceit.csgo || data.faceit.cs2) {
                faceitContent = `
                    <h2 class="text-lg mt-6 font-bold text-yellow-400">🔥 Faceit Profiles</h2>
                    <div class="flex flex-wrap gap-4">
                        ${["csgo", "cs2"].map(game => {
                            if (!data.faceit[game]) return "";
                            const faceitInfo = data.faceit[game];

                            return `
                                <div class="bg-gray-800 p-4 rounded-lg border border-blue-500 text-center w-full md:w-1/2 shadow-md">
                                    <img src="${faceitInfo.avatar}" alt="Faceit Avatar" class="mx-auto w-20 h-20 rounded-full border border-yellow-400">
                                    <p class="text-lg font-semibold">${faceitInfo.nickname}</p>
                                    <p><strong>🌎 Region:</strong> ${faceitInfo.region}</p>
                                    <p><strong>⚡ Skill Level:</strong> ${faceitInfo.skill_level}/10</p>
                                    <p class="text-xl font-bold ${faceitInfo.elo >= 2000 ? 'text-green-400' : faceitInfo.elo >= 1500 ? 'text-yellow-400' : 'text-red-400'}">
                                        🔥 Faceit ELO: ${faceitInfo.elo}
                                    </p>

                                    ${faceitInfo.last_match ? `
                                        <h3 class="text-lg mt-4 font-bold text-blue-400">🆚 Last Match</h3>
                                        <p><strong>Map:</strong> ${faceitInfo.last_match.map}</p>
                                        <p><strong>Score:</strong> ${faceitInfo.last_match.score}</p>
                                        <p><strong>Result:</strong> ${faceitInfo.last_match.result}</p>
                                    ` : "<p class='text-gray-400'>No recent matches found.</p>"}

                                    ${faceitInfo.bans.length > 0 ? `
                                        <h3 class="text-lg mt-4 font-bold text-red-400">🚫 Faceit Bans</h3>
                                        <ul class="list-disc list-inside text-red-300">
                                            ${faceitInfo.bans.map(ban => `
                                                <li><strong>Type:</strong> ${ban.type} - <strong>Reason:</strong> ${ban.reason}</li>
                                            `).join('')}
                                        </ul>
                                    ` : "<p class='text-green-400'>✅ No Faceit bans.</p>"}
                                </div>
                            `;
                        }).join('')}
                    </div>
                `;
            }

            document.getElementById("output").innerHTML = `
                <div class="mt-4 p-6 bg-gray-800 rounded-lg border border-yellow-500 shadow-lg text-center">
                    <img src="${data.steam.avatar}" alt="Avatar" class="mx-auto mb-3 w-24 h-24 rounded-lg border border-yellow-400">
                    <p class="text-xl font-bold">${data.steam.name}</p>
                    <a href="${data.steam.profileUrl}" target="_blank" class="text-blue-400 hover:underline">View Steam Profile</a>

                    <div class="mt-4 text-left space-y-2 text-gray-300">
                        <p><strong>🕰️ Account Age:</strong> ${data.steam.accountAge} years</p>
                        <p><strong>🎮 CS2 Hours Played:</strong> ${data.steam.hoursPlayed}</p>

                        <p class="text-2xl mt-4 font-bold ${data.trustFactor >= 700 ? 'text-green-400' : data.trustFactor >= 400 ? 'text-yellow-400' : 'text-red-400'}">
                            🔥 Trust Factor Score: ${data.trustFactor.toFixed(1)}/1000
                        </p>
                    </div>

                    ${faceitContent}
                </div>
            `;
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById("output").innerHTML = `<p class="text-red-400 text-center">⚠️ Error fetching data.</p>`;
    }
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
        alert("✅ Link copied to clipboard!");
    }
}

async function shareCard() {
    const playerCard = document.getElementById("player-card");

    if (!playerCard) {
        alert("⚠️ No player card to share!");
        return;
    }

    try {
        const canvas = await html2canvas(playerCard, {
            useCORS: true,
            allowTaint: true,
            scale: 2
        });

        const image = canvas.toDataURL("image/png");

        const link = document.createElement("a");
        link.href = image;
        link.download = "CS_Trust_Factor.png";
        link.click();

        alert("✅ Card image saved! You can now share it.");
    } catch (error) {
        console.error("Error generating image:", error);
        alert("⚠️ Failed to generate image.");
    }
}
