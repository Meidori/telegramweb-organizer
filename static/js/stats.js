let currentStatsYear = new Date().getFullYear();
let telegram_id = window.Telegram.WebApp.initDataUnsafe?.user?.id;


function initStats() {
    const yearPrev = document.querySelector('.year-prev');
    const yearNext = document.querySelector('.year-next');
    
    yearPrev.addEventListener('click', (e) => {
        e.preventDefault();
        changeYear(-1);
    });
    
    yearNext.addEventListener('click', (e) => {
        e.preventDefault();
        changeYear(1);
    });
    
    updateStatsYearDisplay();
    loadStatsData(currentStatsYear);
}


function updateStatsYearDisplay() {
    document.querySelector('.current-year').textContent = currentStatsYear;
    document.querySelector('.stats-year').textContent = currentStatsYear;
}


function loadStatsData(year) {
    const statsContent = document.querySelector('.stats-content');
    statsContent.innerHTML = '<div class="preloader"></div>';
    // pass
}


document.addEventListener('DOMContentLoaded', initStats);
