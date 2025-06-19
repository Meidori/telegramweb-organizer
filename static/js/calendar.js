// Initialize calendar
app.calendar.create({
    containerEl: '#inline-calendar',
    inline: true,
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
            app.tab.show('#tab-date-events');
        }
    }
});

// back btn
document.addEventListener('click', function(e) {
    if (e.target.closest('.back') || e.target.closest('.icon-back')) {
        const currentTab = app.tab.get('.tab-active');
        if (currentTab && currentTab.id === 'tab-date-events') {
            e.preventDefault();
            app.tab.show('#tab-calendar');
        }
    }
});
