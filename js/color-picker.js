let currentColorPicker = null;
let selectedColor = '#ffffff';
/*
// Click on color pickers
document.addEventListener('click', function (e) {
    if (e.target.classList.contains('color-picker')) {
        currentColorPicker = e.target;
        selectedColor = e.target.style.backgroundColor || '#ffffff';

        const modal = document.getElementById('color-picker-modal');
        const currentColorBox = document.getElementById('current-color-box');

        currentColorBox.style.backgroundColor = selectedColor;

        document.querySelectorAll('.color-option').forEach(option => {
            option.classList.remove('selected');
        });

        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    }

    if (e.target.classList.contains('color-option') && !e.target.classList.contains('custom-color')) {
        selectedColor = e.target.dataset.color;
        document.getElementById('current-color-box').style.backgroundColor = selectedColor;

        document.querySelectorAll('.color-option').forEach(option => {
            option.classList.remove('selected');
        });
        e.target.classList.add('selected');
    }

    if (e.target.closest('.custom-color')) {
        document.getElementById('custom-color-input').click();
    }
});

// Custom color input
document.getElementById('custom-color-input').addEventListener('input', function () {
    selectedColor = this.value;
    document.getElementById('current-color-box').style.backgroundColor = selectedColor;

    document.querySelectorAll('.color-option').forEach(option => {
        option.classList.remove('selected');
    });
});

// OK button
document.querySelector('.color-picker-ok').addEventListener('click', function (e) {
    e.preventDefault();

    if (currentColorPicker) {
        currentColorPicker.style.backgroundColor = selectedColor;

        const categoryRow = currentColorPicker.closest('.color-row');
        const categoryId = categoryRow.dataset.id;

        updateCategoryColor(categoryId, selectedColor);
    }

    closeColorPicker();
});

// Cancel button
document.querySelector('.color-picker-cancel').addEventListener('click', function (e) {
    e.preventDefault();
    closeColorPicker();
});

function closeColorPicker() {
    const modal = document.getElementById('color-picker-modal');
    modal.classList.remove('active');

    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);

    currentColorPicker = null;
}
*/
