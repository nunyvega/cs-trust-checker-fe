const BACKEND_URL = "https://glorious-space-potato-vpvvqvrqg93xjv7-3000.app.github.dev";

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("steamId").value = "76561197960434622";  // Prefilled Steam ID
});

async function getPlayerInfo() {
    const steamId = document.getElementById("steamId").value;
    if (!steamId) return alert("Please enter a Steam ID");

    try {
        const response = await fetch(`${BACKEND_URL}/api/player/${steamId}`);
        const data = await response.json();

        if (data.name) {
            document.getElementById("output").innerHTML = `
                <div class="mt-4 p-4 bg-gray-800 rounded-lg shadow-lg border-2 border-yellow-400">
                    <img src="${data.avatar}" alt="Avatar" class="avatar mx-auto mb-2">
                    <p class="text-xl font-bold">${data.name}</p>
                    <a href="${data.profileUrl}" target="_blank" class="text-blue-400 hover:underline">View Profile</a>
                    <p><strong>Steam ID:</strong> ${data.steamId}</p>
                    <p><strong>Last Log Off:</strong> ${data.lastLogOff}</p>
                    <p><strong>Account Age:</strong> ${data.accountAge}</p>
                    <p><strong>CS2 Hours Played:</strong> ${data.hoursPlayed}</p>
                    <p class="${data.vacBans > 0 ? 'text-red-400' : 'text-green-400'}">
                        <strong>VAC Bans:</strong> ${data.vacBans}
                    </p>
                    <p class="${data.gameBans > 0 ? 'text-red-400' : 'text-green-400'}">
                        <strong>Game Bans:</strong> ${data.gameBans}
                    </p>
                    <p><strong>Community Banned:</strong> ${data.communityBanned ? 'Yes' : 'No'}</p>
                    <p><strong>Economy Ban:</strong> ${data.economyBan}</p>
                </div>
            `;
        } else {
            document.getElementById("output").innerHTML = `<p class="text-red-400">No player found.</p>`;
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById("output").innerHTML = `<p class="text-red-400">Error fetching data.</p>`;
    }
}