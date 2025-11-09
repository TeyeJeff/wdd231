const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';
const cards = document.querySelector("#cards");

async function getProphetData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
        displayProphets(data.prophets);
    } catch (error) {
        console.error("Error:", error);
        cards.innerHTML = "<p>Failed to load data.</p>";
    }
}

getProphetData(url);

const getOrdinal = (n) => {
    const s = ["th", "st", "nd", "rd"],
          v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

const displayProphets = (prophets) => {
    cards.innerHTML = ""; // Clear previous content
    prophets.forEach((prophet) => {
        const card = document.createElement("section");
        const fullname = document.createElement("h3");
        const portrait = document.createElement("img");
        const details = document.createElement("div");

        // Name with ordinal
        fullname.textContent = `${prophet.name} ${prophet.lastname}`;

        // Portrait
        portrait.setAttribute("src", prophet.imageurl);
        portrait.setAttribute("alt", `Portrait of ${prophet.name} ${prophet.lastname}, ${getOrdinal(prophet.order)} Prophet`);
        portrait.setAttribute("loading", "lazy");
        portrait.setAttribute("width", "340");
        portrait.setAttribute("height", "440");

        // Additional info
        details.innerHTML = `
            <p><strong>Date of Birth:</strong> ${prophet.birthdate}</p>
            <p><strong>Place of Birth:</strong> ${prophet.birthplace}</p>
            <p><strong>Length of Service:</strong> ${prophet.length} years</p>
        `;

        card.appendChild(fullname);
        card.appendChild(portrait);
        card.appendChild(details);
        cards.appendChild(card);
    });
};

// Optional: Update year in footer
document.addEventListener("DOMContentLoaded", () => {
    const yearSpan = document.getElementById("year");
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});