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

        if (data.response && data.response.players.length > 0) {
            const player = data.response.players[0];
            document.getElementById("output").innerHTML = `
                <div class="mt-4 p-4 bg-gray-700 rounded-lg shadow">
                    <img src="${player.avatarfull}" alt="Avatar" class="rounded-full mx-auto mb-2">
                    <p class="text-lg font-semibold">${player.personaname}</p>
                    <a href="${player.profileurl}" target="_blank" class="text-blue-400 hover:underline">View Profile</a>
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
