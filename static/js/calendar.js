// Initialize calendar
app.calendar.create({
    containerEl: '#inline-calendar',
    inline: true,
    touchMove: true,
    mode: 'touch',
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
