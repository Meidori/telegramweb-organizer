// Initialize calendar
app.calendar.create({
    containerEl: '#inline-calendar',
    inline: true,
    touchMove: true,
    dateFormat: 'yyyy-mm-dd',
    on: {
        init: function(calendar) {
            fixCalendarHeaderPosition();
        },
        change: function (calendar, dates) {
            const selectedDate = dates[0];
            const dateObj = new Date(selectedDate);
            const formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}.${String(dateObj.getMonth() + 1).padStart(2, '0')}.${dateObj.getFullYear()}`;
            loadCategoriesForEvent(selectedDate);
            app.tab.show('#tab-date-events');
        }
    }
});

function fixCalendarHeaderPosition() {
    const header = document.querySelector('#inline-calendar .calendar-header');
    if (header) {
        header.style.cssText = `
            position: relative !important;
            top: -15px !important;
            margin-bottom: -15px !important;
            background: white !important;
            z-index: 10 !important;
            padding: 5px 0 !important;
        `;
    }
}

document.addEventListener('DOMContentLoaded', fixCalendarHeaderPosition);
setTimeout(fixCalendarHeaderPosition, 500);

setInterval(fixCalendarHeaderPosition, 1000);
