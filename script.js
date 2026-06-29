let archiveData = null;

window.onload = function() {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            archiveData = data;
            renderArchive();
        })
        .catch(err => {
            console.error(err);
            document.getElementById('category-list').innerHTML = '<p style="color:red;">Could not load data.json. Ensure that JavaScript is turned on. Is JavaScript on and the page still will not load? Please contact support at @ephemea.proton.me</p>';
        });
};

function renderArchive() {
    document.getElementById('archive-title').textContent = archiveData.title;
    document.getElementById('archive-subtitle').textContent = archiveData.subtitle;

    const container = document.getElementById('category-list');
    container.innerHTML = '';

    archiveData.categories.forEach(cat => {
        const div = document.createElement('div');
        div.className = 'category';
        div.innerHTML = `<h3>${cat.name} (${cat.items.length})</h3>`;

        const ul = document.createElement('ul');
        cat.items.forEach(item => {
            const li = document.createElement('li');
            li.className = 'item';
            const badge = item.declassified ? `<span class="declassified-badge">DECLASSIFIED</span> ` : '';
            li.innerHTML = `<strong>[${item.year}] ${item.title}</strong> ${badge}<br><em>${item.notes || ''}</em>`;
            ul.appendChild(li);
        });
        div.appendChild(ul);
        container.appendChild(div);
    });

    if (archiveData.uncategorized && archiveData.uncategorized.length > 0) {
        const div = document.createElement('div');
        div.className = 'category';
        div.innerHTML = `<h3>Uncategorized (${archiveData.uncategorized.length})</h3>`;
        const ul = document.createElement('ul');
        archiveData.uncategorized.forEach(item => {
            const li = document.createElement('li');
            li.className = 'item';
            const badge = item.declassified ? `<span class="declassified-badge">DECLASSIFIED</span> ` : '';
            li.innerHTML = `<strong>[${item.year}] ${item.title}</strong> ${badge}<br><em>${item.notes || ''}</em>`;
            ul.appendChild(li);
        });
        div.appendChild(ul);
        container.appendChild(div);
    }
}

function filterItems() {
    const query = document.getElementById('search-input').value.toLowerCase().trim();
    const results = document.getElementById('search-results');
    results.innerHTML = '';

    if (!query || !archiveData) return;

    let found = [];

    archiveData.categories.forEach(cat => {
        cat.items.forEach(item => {
            if (item.title.toLowerCase().includes(query) || 
                item.year.includes(query) ||
                (item.notes && item.notes.toLowerCase().includes(query))) {
                found.push({cat: cat.name, ...item});
            }
        });
    });

    if (archiveData.uncategorized) {
        archiveData.uncategorized.forEach(item => {
            if (item.title.toLowerCase().includes(query) || 
                item.year.includes(query) ||
                (item.notes && item.notes.toLowerCase().includes(query))) {
                found.push({cat: 'Uncategorized', ...item});
            }
        });
    }

    if (found.length === 0) {
        results.innerHTML = '<p>No matches found.</p>';
        return;
    }

    const ul = document.createElement('ul');
    found.forEach(item => {
        const li = document.createElement('li');
        li.className = 'item';
        const badge = item.declassified ? `<span class="declassified-badge">DECLASSIFIED</span> ` : '';
        li.innerHTML = `<strong>[${item.cat}] [${item.year}] ${item.title}</strong> ${badge}<br><em>${item.notes || ''}</em>`;
        ul.appendChild(li);
    });
    results.appendChild(ul);
}
