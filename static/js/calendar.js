document.addEventListener('DOMContentLoaded', function() {
    const calendar = flatpickr("#inline-calendar", {
        inline: true,
        dateFormat: "Y-m-d",
        locale: "ru",
        onChange: function(selectedDates, dateStr, instance) {
            currentSelectedDate = selectedDates[0];
            loadCategoriesForEvent(dateStr);
            app.tab.show('#tab-date-events');
        }
    });

    // init with cur datre
    calendar.setDate(new Date());
});

