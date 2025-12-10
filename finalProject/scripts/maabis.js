// maabis.js - Updated with async JSON loading

const hamburger = document.querySelector(".hamburger");
const navigation2 = document.querySelector(".navigation2");
const jewelryContainer = document.getElementById("jewelryContainer");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const results = document.getElementById("results");

let allJewelries = []; // Will hold the loaded data

// Hamburger Menu Toggle
hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("show");
    navigation2.classList.toggle("show");
});

// Load jewelries from JSON file
async function loadJewelries() {
    try {
        const response = await fetch('data/jewelries.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!Array.isArray(data)) {
            throw new Error("Invalid data format: Expected an array");
        }

        allJewelries = data;
        displayJewelries(allJewelries); // Initial display

    } catch (error) {
        console.error("Failed to load jewelry data:", error);
        jewelryContainer.innerHTML = `
            <p style="text-align: center; color: red; grid-column: 1 / -1;">
                Sorry, we couldn't load the products right now. Please try again later.
            </p>
        `;
    }
}

// Display function (same as before, but safer)
function displayJewelries(jewelriesToShow) {
    jewelryContainer.innerHTML = '';

    if (jewelriesToShow.length === 0) {
        jewelryContainer.innerHTML = '<p style="text-align: center;">No items found.</p>';
        return;
    }

    jewelriesToShow.forEach(jewelry => {
        const card = document.createElement("div");
        card.classList.add("jewelry-card");

        card.innerHTML = `
            <img src="${jewelry.image}" alt="${jewelry.brandName}" loading="lazy">
            <h2>${jewelry.brandName}</h2>
            <p>${jewelry.type}</p>
            <p>${jewelry.material || "Premium Material"}</p>
            <p><strong>${jewelry.price}</strong></p>
        `;

        jewelryContainer.appendChild(card);
    });
}

// Filter by category
function filterByCategory(category) {
    let filtered = allJewelries;

    if (category !== 'All') {
        filtered = allJewelries.filter(item => item.type === category);
    }

    displayJewelries(filtered);
    closeMobileMenu();
}

function closeMobileMenu() {
    navigation2.classList.remove("show");
    hamburger.classList.remove("show");
}

// Search functionality
searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim().toLowerCase();
    
    const filtered = allJewelries.filter(jewelry =>
        jewelry.brandName.toLowerCase().includes(query)
    );

    results.innerHTML = '';
    jewelryContainer.style.display = 'none'; // Hide main grid during search

    if (filtered.length === 0) {
        results.innerHTML = "<p>No results found.</p>";
        return;
    }

    filtered.forEach(jewelry => {
        const card = document.createElement('div');
        card.classList.add('jewelry-card');
        card.innerHTML = `
            <img src="${jewelry.image}" alt="${jewelry.brandName}">
            <h3>${jewelry.brandName}</h3>
            <p>${jewelry.type} - ${jewelry.material || "N/A"}</p>
            <p><strong>${jewelry.price}</strong></p>
        `;
        results.appendChild(card);
    });
});

// Clear search when clicking outside search
searchInput.addEventListener('input', () => {
    if (searchInput.value.trim() === '') {
        results.innerHTML = '';
        jewelryContainer.style.display = 'flex';
    }
});

// Category clicks
document.querySelectorAll('.navigation2 a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const categoryMap = {
            'all': 'All',
            'watch': 'Watch',
            'rings': 'Ring',
            'earrings': 'Earring',
            'bracelets': 'Bracelet',
            'anklets': 'Anklet'
        };
        const id = link.id;
        filterByCategory(categoryMap[id] || 'All');
    });
});

// Start loading data when page loads
document.addEventListener('DOMContentLoaded', loadJewelries);