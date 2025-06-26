// Load categories when calendar tab is shown
app.on('tabShow', async (tab) => {
    if (tab.id === "tab-date-events") {
        await loadCategoriesForEvent();
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
        const response = await fetch(`/get_categories?telegram_id=${telegram_id}&date=${date}`);
        const data = await response.json();

        if (data.success) {
            renderCategoriesForEvent(data.categories, date);
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


function renderCategoriesForEvent(categories, currentDate) {
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
            <button class="date-nav-button" data-date="${formatDate(prevDate)}">← ${prevDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</button>
            <div class="current-date">${displayDate}</div>
            <button class="date-nav-button" data-date="${formatDate(nextDate)}">${nextDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })} →</button>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', dateSwitcherHtml);

    const navButtons = container.querySelectorAll('.date-nav-button');
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const newDate = this.getAttribute('data-date');
            loadCategoriesForEvent(newDate);
        });
    });

    container.insertAdjacentHTML('beforeend', '<hr class="date-separator">');

    if (categories.length > 0) {
        categories.forEach(category => {
            const categoryHtml = `
                <div class="category-item">
                    <div class="category-name">
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
    else {
        container.insertAdjacentHTML('beforeend', '<p class="no-categories">Нет категорий для отображения</p>');
    }
}


function handleCategoryToggle(categoryId, isChecked) {
    console.log(`Category ${categoryId} is now ${isChecked ? 'active' : 'inactive'}`);
}
