let currentStatsYear;


function initStats() {
    currentStatsYear = new Date().getFullYear();
    
    const yearPrev = document.querySelector('.year-prev');
    const yearNext = document.querySelector('.year-next');
    
    if (yearPrev && yearNext) {
        yearPrev.addEventListener('click', (e) => {
            e.preventDefault();
            changeYear(-1);
        });
        
        yearNext.addEventListener('click', (e) => {
            e.preventDefault();
            changeYear(1);
        });
    }
    
    updateStatsDisplay();
}


function changeYear(delta) {
    currentStatsYear += delta;
    updateStatsDisplay();
}


function updateStatsDisplay() {
    const yearElement = document.querySelector('.current-year');
    if (yearElement) {
        yearElement.textContent = currentStatsYear;
    }
    
    const statsYearElement = document.querySelector('.stats-year');
    if (statsYearElement) {
        statsYearElement.textContent = currentStatsYear;
    }
    
    loadStatsForYear(currentStatsYear);
}


async function loadStatsForYear(year) {
    try {
        const tg = window.Telegram.WebApp;
        const telegram_id = tg.initDataUnsafe?.user?.id;
        
        if (!telegram_id) return;
        
        const categoriesResponse = await fetch(`/get_categories?telegram_id=${telegram_id}`);
        const categoriesData = await categoriesResponse.json();
        
        if (!categoriesData.success) return;
        
        const categories = categoriesData.categories;
        
        const statsResponse = await fetch(`/get_year_stats?telegram_id=${telegram_id}&year=${year}`);
        const statsData = await statsResponse.json();
        
        if (!statsData.success) return;
        
        const stats = statsData.stats;
        
        renderStats(categories, stats, year);
    }
    catch (error) {
        console.error('Error loading stats:', error);
    }
}


function renderStats(categories, stats, year) {
    const statsContainer = document.querySelector('.stats-content .block');
    if (!statsContainer) return;
    
    statsContainer.innerHTML = '';
    
    const monthsContainer = document.createElement('div');
    monthsContainer.className = 'months-container';
    
    // group 3 in one row
    for (let i = 0; i < 12; i += 3) {
        const monthRow = document.createElement('div');
        monthRow.className = 'month-row';
        
        for (let j = 0; j < 3; j++) {
            const monthIndex = i + j;
            if (monthIndex >= 12) break;
            
            const monthData = stats[monthIndex] || {};
            const monthElement = createMonthElement(monthIndex, monthData, categories, year);
            monthRow.appendChild(monthElement);
        }
        
        monthsContainer.appendChild(monthRow);
    }
    
    statsContainer.appendChild(monthsContainer);
}


function createMonthElement(monthIndex, monthData, categories, year) {
    const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 
                       'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    
    const monthElement = document.createElement('div');
    monthElement.className = 'month-item';
    
    const monthName = document.createElement('div');
    monthName.className = 'month-name';
    monthName.textContent = monthNames[monthIndex];
    monthElement.appendChild(monthName);
    
    const categoriesContainer = document.createElement('div');
    categoriesContainer.className = 'categories-container';
    
    categories.forEach(category => {
        const categoryData = monthData[category.id] || { count: 0, days_in_month: getDaysInMonth(monthIndex + 1, year) };
        const categoryElement = createCategoryBar(category, categoryData);
        categoriesContainer.appendChild(categoryElement);
    });
    
    monthElement.appendChild(categoriesContainer);
    return monthElement;
}


function createCategoryBar(category, categoryData) {
    const { count, days_in_month } = categoryData;
    const percentage = Math.min(100, (count / days_in_month) * 100);
    
    const categoryBar = document.createElement('div');
    categoryBar.className = 'category-bar';
    
    const gradientBar = document.createElement('div');
    gradientBar.className = 'gradient-bar';
    
    for (let i = 0; i < 9; i++) {
        const segment = document.createElement('div');
        segment.className = 'gradient-segment';
        
        const segmentThreshold = (i + 1) * (100 / 9);
        const opacity = percentage >= segmentThreshold ? 1 : 
                       percentage > (i * (100 / 9)) ? (percentage - (i * (100 / 9))) / (100 / 9) : 0;
        
        segment.style.backgroundColor = category.color_hex;
        segment.style.opacity = opacity;
        
        if (i < 8) {
            segment.style.boxShadow = 'inset 0 -1px 0 rgba(255,255,255,0.2)';
        }
        
        gradientBar.appendChild(segment);
    }
    
    const countLabel = document.createElement('div');
    countLabel.className = 'category-count';
    countLabel.textContent = count;
    countLabel.style.color = category.color_hex;
    
    categoryBar.appendChild(gradientBar);
    categoryBar.appendChild(countLabel);
    
    return categoryBar;
}


function getDaysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}


document.addEventListener('DOMContentLoaded', initStats);
