
document.addEventListener('DOMContentLoaded', () => {
    // --- Utility/footer Functions ---

    const updateFooter = () => {
        document.getElementById('currentYear').textContent = new Date().getFullYear();
        document.getElementById('lastModified').textContent = document.lastModified;
    };

    const getLevelLabel = (level) => {
        switch (level) {
            case 3: return 'Gold';
            case 2: return 'Silver';
            case 1: return 'Member';
            default: return 'Associate';
        }
    };

    const createMemberCard = (member) => {
        const card = document.createElement('div');
        card.className = 'member-card';
        card.classList.add(`level-${member.membershipLevel}`);
        
        card.innerHTML = `
            <div class="card-header">
                <img src="${member.image}" alt="${member.name} image" loading="lazy">
                <h3 class="company-name">${member.name}</h3>
                <p class="category">${member.category}</p>
            </div>
            <div class="card-body">
                <p class="level-badge">${getLevelLabel(member.membershipLevel)}</p>
                <p class="description">${member.description}</p>
                <p class="location">Location: ${member.location}</p>
                <a href="tel:${member.phone}" class="phone">📞 ${member.phone}</a>
                <a href="mailto:${member.email}" class="email">📧 ${member.email}</a>
            </div>
            <div class="card-footer">
                <a href="${member.website}" target="_blank" rel="noopener noreferrer" class="website-link">Visit Website</a>
            </div>
        `;
        return card;
    };

    const createMemberRow = (member) => {
        const row = document.createElement('section');
        row.className = 'member-row';
        row.classList.add(`level-${member.membershipLevel}`);

        row.innerHTML = `
            <h3 class="company-name">${member.name}</h3>
            <p class="category">${member.category}</p>
            <p class="location">${member.location}</p>
            <a href="tel:${member.phone}" class="phone">${member.phone}</a>
            <a href="${member.website}" target="_blank" rel="noopener noreferrer" class="website-link">Website</a>
        `;
        return row;
    };

    // --- Directory and Navigation Logic ---

    const directoryContainer = document.getElementById('directory');
    const gridViewBtn = document.getElementById('gridViewBtn');
    const listViewBtn = document.getElementById('listViewBtn');
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');

    let allMembers = [];

    /**
     * Rendering all members to the DOM based on the current view mode the user selects.
     */
    const displayMembers = () => {
        directoryContainer.innerHTML = '';
        
        if (allMembers.length === 0) {
            directoryContainer.innerHTML = '<p class="no-results">No members found.</p>';
            return;
        }

        const isGridView = directoryContainer.classList.contains('view-grid');
        
        // Using a document fragment for faster rendering
        const fragment = document.createDocumentFragment();
        
        allMembers.forEach(member => {
            if (isGridView) {
                fragment.appendChild(createMemberCard(member));
            } else {
                fragment.appendChild(createMemberRow(member));
            }
        });
        directoryContainer.appendChild(fragment);
    };

    /**
     * Toggling between the view between Grid and List.
     */
    const toggleView = (view) => {
        if (view === 'grid') {
            directoryContainer.classList.remove('view-list');
            directoryContainer.classList.add('view-grid');
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
        } else if (view === 'list') {
            directoryContainer.classList.remove('view-grid');
            directoryContainer.classList.add('view-list');
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
        }
        displayMembers(); 
    };

    /**
     * Fetching the member data using async/await.
     */
    const getMemberData = async () => {
        const url = 'data/members.json';
        
        try {
            directoryContainer.innerHTML = '<div class="loading">Loading members...</div>';
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            allMembers = data;
            displayMembers();

        } catch (error) {
            console.error('Could not fetch member data:', error);
            directoryContainer.innerHTML = '<p class="error">Failed to load business directory. Please check the network path.</p>';
        }
    };

    // --- Event Listeners ---
    
    // View toggles
    gridViewBtn.addEventListener('click', () => toggleView('grid'));
    listViewBtn.addEventListener('click', () => toggleView('list'));

    // Navigation toggle
    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('open');
        menuToggle.classList.toggle('active');
    });

    // --- Initialization ---
    updateFooter();
    getMemberData();
});