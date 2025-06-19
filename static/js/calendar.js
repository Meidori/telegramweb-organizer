// Initialize calendar
app.calendar.create({
    containerEl: '#inline-calendar',
    inline: true,
    dateFormat: 'yyyy-mm-dd',
    on: {
        change: function (calendar, dates) {
            console.log('chosen:', dates[0]);
        }
    }
});
