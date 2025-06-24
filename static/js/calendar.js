// Initialize calendar
// Initialize calendar
app.calendar.create({
    containerEl: '#inline-calendar',
    inline: true,
    touchMove: true,
    dateFormat: 'yyyy-mm-dd',
    on: {
        dayClick: function (calendar, dayEl, year, month, day) {
            // Format the selected date
            const formattedDay = String(day).padStart(2, '0');
            const formattedMonth = String(month + 1).padStart(2, '0');
            const formattedDate = `${formattedDay}.${formattedMonth}.${year}`;
            
            // Update the title and show the events tab
            document.getElementById('date-events-title').textContent = formattedDate;
            app.tab.show('#tab-date-events');
        },
        change: function (calendar, dates) {
            // This will handle desktop clicks or other change events
            if (dates && dates.length > 0) {
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
    }
});
