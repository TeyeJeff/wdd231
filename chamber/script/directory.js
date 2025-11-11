document.addEventListener('DOMContentLoaded', async () => {
    const directory   = document.getElementById('directory');
    const searchInput = document.getElementById('searchInput');
    const levelFilter = document.getElementById('levelFilter');
    const searchBtn   = document.getElementById('searchBtn');
    const gridBtn     = document.getElementById('gridViewBtn');
    const listBtn     = document.getElementById('listViewBtn');
    const currentYear = document.getElementById('currentYear');
    const lastModified = document.getElementById('lastModified');

    let members = [];
    let currentView = localStorage.getItem('chamberView') || 'grid';

    currentYear.textContent = new Date().getFullYear();
    lastModified.textContent = document.lastModified;

    setView(currentView);

    try {
        const resp = await fetch('members.json');
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        members = await resp.json();
        renderMembers(members);
    } catch (e) {
        console.error(e);
        directory.innerHTML = `<p style="color:red;text-align:center;padding:2rem;">
            Failed to load member directory. Please try again later.
        </p>`;
    }

    function renderMembers(list) {
        if (!list.length) {
            directory.innerHTML = `<p style="text-align:center;padding:1rem;">No members found.</p>`;
            return;
        }

        const placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGVkZWJlIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZmlsbD0iI2FhYSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPjMwMHgxNjAgUGxhY2Vob2xkZXI8L3RleHQ+PC9zdmc+';

        const html = list.map(m => {
            const levelText = m.membershipLevel === 3 ? 'Gold' : m.membershipLevel === 2 ? 'Silver' : 'Member';
            return `
                <div class="card">
                    <img class="card-img lazy" src="${placeholder}" data-src="${m.image}" alt="${m.name} logo">
                    <div class="card-body">
                        <h3>${m.name}</h3>
                        <span class="category">${m.category}</span>
                        <span class="membership-badge level-${m.membershipLevel}">${levelText}</span>
                        <p>${m.description}</p>
                        <div class="contact">
                            Location: ${m.location}<br>
                            Phone: ${m.phone}<br>
                            Email: ${m.email}
                        </div>
                        <a href="${m.website}" target="_blank" class="website">Visit Website</a>
                    </div>
                </div>
            `;
        }).join('');

        directory.innerHTML = html;
        lazyLoadImages();
    }

    function lazyLoadImages() {
        const lazyImages = document.querySelectorAll('img.lazy');
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const temp = new Image();
                    temp.src = img.dataset.src;
                    temp.onload = () => {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                    };
                    obs.unobserve(img);
                }
            });
        }, { rootMargin: '0px 0px 200px 0px', threshold: 0.1 });

        lazyImages.forEach(img => observer.observe(img));
    }

    function search() {
        const q = searchInput.value.toLowerCase().trim();
        const level = levelFilter.value;

        const filtered = members.filter(m => {
            const matchesText = !q || 
                m.name.toLowerCase().includes(q) ||
                m.description.toLowerCase().includes(q) ||
                m.location.toLowerCase().includes(q);
            const matchesLevel = !level || m.membershipLevel == level;
            return matchesText && matchesLevel;
        });
        renderMembers(filtered);
    }

    function setView(view) {
        if (view === 'list') {
            directory.classList.remove('view-grid'); directory.classList.add('view-list');
            listBtn.classList.add('active'); gridBtn.classList.remove('active');
        } else {
            directory.classList.remove('view-list'); directory.classList.add('view-grid');
            gridBtn.classList.add('active'); listBtn.classList.remove('active');
        }
        localStorage.setItem('chamberView', view);
        if (members.length) renderMembers(members);
    }

    searchBtn.addEventListener('click', search);
    searchInput.addEventListener('input', search);
    levelFilter.addEventListener('change', search);
    searchInput.addEventListener('keypress', e => e.key === 'Enter' && search());

    gridBtn.addEventListener('click', () => setView('grid'));
    listBtn.addEventListener('click', () => setView('list'));
});