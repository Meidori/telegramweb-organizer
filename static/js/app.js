// Initialize Framework7
const app = new Framework7({
    root: "#app",
    theme: "auto",
});

// Initialize Telegram WebApp
const tg = window.Telegram.WebApp;
const telegram_id = tg.initDataUnsafe?.user?.id;

// Save user on load
fetch('/save_user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ telegram_id: telegram_id })
})
    .then(data => {
        console.log('User saved:', data);
    })
    .catch(error => {
        console.error('Error saving user:', error);
    });

// Dynamic change navbar title
app.on("tabShow", (tab) => {
    const navbarTitle = document.querySelector(".navbar .title");

    if (tab.id === "tab-settings") {
        navbarTitle.textContent = "Настройки";
    }
    else if (tab.id === "tab-stats") {
        navbarTitle.textContent = "Статистика";
    }
    else if (tab.id === "tab-calendar") {
        navbarTitle.textContent = "Календарь";
    }
    else if (tab.id === "tab-date-events") {
        // Title for date events tab is set in calendar.js
    }
});

// Handle back button in date events tab (FOR PC VERSION ONLY)
app.on('click', (e) => {
    const backButton = e.target.closest('.back, .icon-back');
    if (backButton) {
        const currentTab = document.querySelector('.tab-active');
        if (currentTab && currentTab.id === 'tab-date-events') {
            e.preventDefault();
            app.tab.show('#tab-calendar', {
                animate: true
            });
        }
    }
});
