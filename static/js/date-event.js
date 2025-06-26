let currentSelectedDate = new Date();

// Load categories when calendar tab is shown
app.on('tabShow', async (tab) => {
    if (tab.id === "tab-date-events") {
        await loadCategoriesForEvent(formatDate(currentSelectedDate));
    }
});

function formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

async function loadCategoriesForEvent(date) {
    try {
        currentSelectedDate = new Date(date);

        // Load categories
        const categoriesResponse = await fetch(`/get_categories?telegram_id=${telegram_id}`);
        const categoriesData = await categoriesResponse.json();

        if (!categoriesData.success) {
            console.error('Error loading categories:', categoriesData.error);
            document.getElementById('date-events-content').innerHTML = '<p>Нет категорий для отображения</p>';
            return;
        }

        // Load marked categories for selected date
        const entriesResponse = await fetch(`/get_day_entries?telegram_id=${telegram_id}&date=${formatDate(date)}`);
        const entriesData = await entriesResponse.json();

        const markedCategories = entriesData.success ? entriesData.entries.map(e => e.category_id) : [];

        // Render categories with marks
        renderCategoriesForEvent(categoriesData.categories, date, markedCategories);
    }
    catch (error) {
        console.error('Error loading categories:', error);
    }
}

function renderCategoriesForEvent(categories, currentDate, markedCategories = []) {
    const container = document.getElementById('date-events-content');
    container.innerHTML = '';

    const dateObj = new Date(currentDate);

    const prevDate = new Date(dateObj);
    prevDate.setDate(dateObj.getDate() - 1);

    const nextDate = new Date(dateObj);
    nextDate.setDate(dateObj.getDate() + 1);

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const displayDate = dateObj.toLocaleDateString('ru-RU', options);

    const dateSwitcherHtml = `
        <div class="date-switcher">
            <div class="date-nav-buttons">
                <button class="date-nav-button" data-date="${formatDate(prevDate)}">‹</button>
                <button class="date-nav-button" data-date="${formatDate(nextDate)}">›</button>
            </div>
            <div class="current-date">${dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', dateSwitcherHtml);

    const navButtons = container.querySelectorAll('.date-nav-button');
    navButtons.forEach(button => {
        button.addEventListener('click', function () {
            const newDate = this.getAttribute('data-date');
            loadCategoriesForEvent(newDate);
        });
    });

    container.insertAdjacentHTML('beforeend', '<hr class="date-separator">');

    if (categories.length > 0) {
        categories.forEach(category => {
            const isChecked = markedCategories.includes(category.id);

            const categoryHtml = `
                <div class="category-item">
                    <div class="category-name">
                        ${category.name}
                    </div>
                    <label class="toggle toggle-init">
                        <input type="checkbox" class="category-toggle" 
                               data-category-id="${category.id}" 
                               ${isChecked ? 'checked' : ''}>
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
    else {
        container.insertAdjacentHTML('beforeend', '<p class="no-categories">Нет категорий для отображения</p>');
    }
}

async function handleCategoryToggle(categoryId, isChecked) {
    try {
        const date = formatDate(currentSelectedDate);
        const url = isChecked ? '/add_day_entry' : '/remove_day_entry';

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                telegram_id: telegram_id,
                category_id: categoryId,
                date: date
            })
        });

        const data = await response.json();
        if (!data.success) {
            console.error('Error:', data.error);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
