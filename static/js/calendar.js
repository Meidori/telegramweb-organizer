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
            // document.getElementById('date-events-title').textContent = formattedDate;
            loadCategoriesForEvent(selectedDate);
            app.tab.show('#tab-date-events');
        }
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const fixHeaderPosition = () => {
        const header = document.querySelector('#inline-calendar .calendar-header');
        if (header) {
            header.style.cssText = `
                position: relative !important;
                top: -15px !important;
                margin-bottom: -15px !important;
                background: white !important;
                z-index: 10 !important;
            `;
        }
    };
    
    fixHeaderPosition();
    
    setTimeout(fixHeaderPosition, 300);
});
