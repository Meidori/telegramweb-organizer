// Initialize calendar
app.calendar.create({
    containerEl: '#inline-calendar',
    inline: true,
    touchMove: true,
    dateFormat: 'yyyy-mm-dd',
    on: {
        change: function (calendar, dates) {
            const selectedDate = dates[0];
            const dateObj = new Date(selectedDate);

            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const year = dateObj.getFullYear();

            const formattedDate = `${day}.${month}.${year}`;
            document.getElementById('date-events-title').textContent = formattedDate;

            // Скрыть текущую активную вкладку
            const currentTab = document.querySelector('.tab.tab-active');
            const dateEventsTab = document.getElementById('tab-date-events');
            if (currentTab && dateEventsTab) {
                currentTab.classList.remove('tab-active');
                dateEventsTab.classList.add('tab-active');
            }

            // Обновить заголовок в navbar
            const navbarTitle = document.querySelector('.navbar .title');
            if (navbarTitle) navbarTitle.textContent = 'События';

            // Скрыть нижнюю панель табов
            const tabbar = document.querySelector('.toolbar.tabbar');
            if (tabbar) tabbar.style.display = 'none';
        }
    }
});
