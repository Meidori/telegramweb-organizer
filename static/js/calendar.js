// Initialize calendar
app.calendar.create({
    containerEl: '#inline-calendar',
    inline: true,
    dateFormat: 'yyyy-mm-dd',
    on: {
        change: function (calendar, dates) {
            const selectedDate = dates[0];
            document.getElementById('date-events-title').textContent = `События на ${selectedDate}`;
            app.tab.show('#tab-date-events');
        }
    }
});
