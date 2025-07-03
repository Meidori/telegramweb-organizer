// Load categories when settings tab is shown
app.on('tabShow', async (tab) => {
    if (tab.id === "tab-settings") {
        await loadCategories();
    }
});


async function loadCategories() {
    try {
        const response = await fetch(`/get_categories?telegram_id=${telegram_id}`);
        const data = await response.json();

        if (data.success) {
            renderCategories(data.categories);
        }
        else {
            console.error('Error loading categories:', data.error);
        }
    }
    catch (error) {
        console.error('Error loading categories:', error);
    }
}


function renderCategories(categories) {
    const container = document.getElementById('categories-container');
    container.innerHTML = '';

    categories.forEach(category => {
        const categoryHtml = `
            <div class="color-row" data-id="${category.id}">
                <div class="color-picker" style="background-color: ${category.color_hex || '#ffffff'};"></div>
                <div class="color-input">
                    <input type="text" value="${category.name}" placeholder="Введите название">
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', categoryHtml);

        const input = container.lastElementChild.querySelector('input');
        input.addEventListener('change', function () {
            updateCategory(category.id, this.value);
        });
    });
    
    addCategoryControls(); // Add the controls after rendering categories
}


async function updateCategory(categoryId, newName) {
    try {
        const response = await fetch('/update_category', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                category_id: categoryId,
                new_name: newName,
                telegram_id: telegram_id
            })
        });

        const data = await response.json();
    }
    catch (error) {
        console.error('Error updating category:', error);
    }
}

async function updateCategoryColor(categoryId, newColor) {
    try {
        const response = await fetch('/update_category_color', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                category_id: categoryId,
                new_color: newColor,
                telegram_id: telegram_id
            })
        });

        const data = await response.json();
        if (!data.success) {
            console.error('Error updating category color:', data.error);
        }
    }
    catch (error) {
        console.error('Error updating category color:', error);
    }
}

function rgbToHex(rgb) {
    if (!rgb) return null;
    if (rgb.startsWith('#')) return rgb;

    const match = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
    if (!match) return null;

    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);

    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
}


async function addCategory(name, color = '#FFFFFF') {
    try {
        const response = await fetch('/add_category', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                telegram_id: telegram_id,
                name: name,
                color_hex: color
            })
        });

        const data = await response.json();
        if (data.success) {
            await loadCategories(); // Refresh the list
        }
        return data;
    }
    catch (error) {
        console.error('Error adding category:', error);
        return { success: false, error: error.message };
    }
}

async function deleteCategory(categoryId) {
    try {
        const response = await fetch('/delete_category', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                telegram_id: telegram_id,
                category_id: categoryId
            })
        });

        const data = await response.json();
        if (data.success) {
            await loadCategories(); // Refresh the list
        }
        return data;
    }
    catch (error) {
        console.error('Error deleting category:', error);
        return { success: false, error: error.message };
    }
}


function addCategoryControls() {
    const container = document.getElementById('categories-container');
    
    // Add button
    const addButton = document.createElement('div');
    addButton.className = 'color-row add-category';
    addButton.innerHTML = `
        <div class="color-picker" style="background-color: #FFFFFF;"></div>
        <div class="color-input">
            <input type="text" placeholder="Новая категория" id="new-category-name">
        </div>
        <div class="category-actions">
            <button class="button button-small button-fill add-category-btn">+</button>
        </div>
    `;
    container.appendChild(addButton);
    
    // Add event listeners
    addButton.querySelector('.add-category-btn').addEventListener('click', async () => {
        const nameInput = document.getElementById('new-category-name');
        const name = nameInput.value.trim();
        
        if (name) {
            await addCategory(name);
            nameInput.value = ''; // Clear input
        }
    });
    
    // Add delete buttons to existing categories
    document.querySelectorAll('.color-row[data-id]').forEach(row => {
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'button button-small button-outline delete-category-btn';
        deleteBtn.textContent = '×';
        deleteBtn.style.marginLeft = '10px';
        
        deleteBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const categoryId = row.dataset.id;
            if (confirm('Удалить эту категорию?')) {
                await deleteCategory(categoryId);
            }
        });
        
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'category-actions';
        actionsDiv.appendChild(deleteBtn);
        row.appendChild(actionsDiv);
    });
}
