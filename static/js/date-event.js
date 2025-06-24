// Load categories when calendar tab is shown
app.on('tabShow', async (tab) => {
    if (tab.id === "tab-date-events") {
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
            document.getElementById('date-events-content').innerHTML = '<p>Нет категорий для отображения</p>';
        }
    }
    catch (error) {
        console.error('Error loading categories:', error);
    }
}

function renderCategories(categories) {
    const container = document.getElementById('date-events-content');
    container.innerHTML = '';

    categories.forEach(category => {
        const categoryHtml = `
            <div class="category-item">
                <div class="category-name" style="color: ${category.color_hex}">
                    ${category.name}
                </div>
                <label class="toggle toggle-init">
                    <input type="checkbox" class="category-toggle" data-category-id="${category.id}">
                    <span class="toggle-icon"></span>
                </label>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', categoryHtml);

        // Add event listener for toggle
        const toggle = container.lastElementChild.querySelector('.category-toggle');
        toggle.addEventListener('change', function () {
            handleCategoryToggle(category.id, this.checked);
        });
    });
}

function handleCategoryToggle(categoryId, isChecked) {
    console.log(`Category ${categoryId} is now ${isChecked ? 'active' : 'inactive'}`);

}
