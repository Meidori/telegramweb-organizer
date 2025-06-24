// Initialize calendar
app.on('pageInit', function () {
    app.calendar.create({
        containerEl: '#inline-calendar',
        inline: true,
        dateFormat: 'yyyy-mm-dd',
        touchMove: true,
        on: {
            change: function (calendar, dates) {
                if (!dates || dates.length === 0) return;
                const selectedDate = dates[0];
                console.log('Selected (mobile):', selectedDate);
                
                const dateObj = new Date(selectedDate);
                const day = String(dateObj.getDate()).padStart(2, '0');
                const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                const year = dateObj.getFullYear();
                
                document.getElementById('date-events-title').textContent = `${day}.${month}.${year}`;
                app.tab.show('#tab-date-events');
            }
        }
    });
});
