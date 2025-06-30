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
}


document.addEventListener('DOMContentLoaded', initStats);
