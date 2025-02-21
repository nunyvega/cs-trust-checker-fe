const BACKEND_URL = "https://glorious-space-potato-vpvvqvrqg93xjv7-3000.app.github.dev";

async function getPlayerInfo() {
    const steamId = document.getElementById("steamId").value;
    if (!steamId) return alert("Please enter a Steam ID");

    try {
        const response = await fetch(`${BACKEND_URL}/api/player/${steamId}`);
        const data = await response.json();

        if (data.response && data.response.players.length > 0) {
            const player = data.response.players[0];
            document.getElementById("output").innerHTML = `
                <p><strong>Name:</strong> ${player.personaname}</p>
                <p><strong>Profile:</strong> <a href="${player.profileurl}" target="_blank">View Profile</a></p>
                <p><img src="${player.avatar}" alt="Avatar"></p>
            `;
        } else {
            document.getElementById("output").innerHTML = `<p>No player found.</p>`;
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        document.getElementById("output").innerHTML = `<p>Error fetching data.</p>`;
    }
}
