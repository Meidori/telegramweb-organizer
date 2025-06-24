// Initialize calendar
function initCalendar() {
    const calendar = app.calendar.create({
        containerEl: '#inline-calendar',
        inline: true,
        touchMove: true,
        dateFormat: 'yyyy-mm-dd',
        firstDay: 1, // Monday as first day
        on: {
            dayClick: function (calendar, dayEl, year, month, day) {
                handleDateSelection(year, month, day);
            },
            change: function (calendar, dates) {
                if (dates && dates.length > 0) {
                    const date = new Date(dates[0]);
                    handleDateSelection(
                        date.getFullYear(),
                        date.getMonth(),
                        date.getDate()
                    );
                }
            }
        }
    });

    // Mobile-specific touch handling
    document.getElementById('inline-calendar').addEventListener('touchstart', function(e) {
        // Prevent default to avoid any browser interference
        e.preventDefault();
    }, { passive: false });
}

// Handle date selection consistently
function handleDateSelection(year, month, day) {
    const formattedDate = `${String(day).padStart(2, '0')}.${String(month + 1).padStart(2, '0')}.${year}`;
    
    // Update title
    document.getElementById('date-events-title').textContent = formattedDate;
    
    // Show events tab with animation
    app.tab.show('#tab-date-events', {
        animate: true,
        on: {
            afterShow: function() {
                // Force redraw to fix mobile rendering issues
                app.utils.nextTick(function() {
                    app.tab.get('#tab-date-events').$el.css('display', '');
                });
            }
        }
    });
}

// Initialize when page is ready
app.on('pageInit', function() {
    initCalendar();
});
