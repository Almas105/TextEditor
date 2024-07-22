document.addEventListener('DOMContentLoaded', () => {
    const editor = document.getElementById('editor');
    const fontFamilySelect = document.getElementById('fontFamily');
    const fontWeightSelect = document.getElementById('fontWeight');
    const toggleItalicSwitch = document.getElementById('toggleItalic');
    const saveButton = document.getElementById('save');
    const resetButton = document.getElementById('reset');

    let fonts = {};
    let defaultFontFamily = 'ABeeZee';
    let defaultFontWeight = '400';
    let defaultIsItalic = false;

    // Fetch font data from JSON file
    fetch('fonts.json')
        .then(response => response.json())
        .then(data => {
            fonts = data;
            populateFontFamily();
            loadSettings(); // Load settings when fonts are ready
        })
        .catch(error => console.error('Error fetching font data:', error));

    // Populate font family dropdown
    function populateFontFamily() {
        Object.keys(fonts).forEach(font => {
            const option = document.createElement('option');
            option.value = font;
            option.textContent = font;
            fontFamilySelect.appendChild(option);
        });

        fontFamilySelect.addEventListener('change', (e) => {
            applyFontSettings(e.target.value, fontWeightSelect.value, toggleItalicSwitch.checked);
        });

        updateFontWeights(defaultFontFamily);
    }

    // Populate font weights dropdown based on selected font family
    function updateFontWeights(fontFamily) {
        fontWeightSelect.innerHTML = '';
        const selectedFont = fonts[fontFamily];
        const weights = Object.keys(selectedFont);

        weights.forEach(weight => {
            const option = document.createElement('option');
            option.value = weight;
            option.textContent = weight;
            fontWeightSelect.appendChild(option);
        });

        fontWeightSelect.addEventListener('change', (e) => {
            applyFontSettings(fontFamilySelect.value, e.target.value, toggleItalicSwitch.checked);
        });

        fontWeightSelect.value = defaultFontWeight;
    }

    // Apply styles to the text area
    function applyFontSettings(fontFamily, fontWeight, italic) {
        const selectedFont = fonts[fontFamily];
        const weightURL = selectedFont[fontWeight];
        if (weightURL) {
            editor.style.fontFamily = fontFamily;
            editor.style.fontWeight = fontWeight;
            editor.style.fontStyle = italic ? 'italic' : 'normal';
            loadFont(weightURL);
        }
    }

    // Load font URL
    function loadFont(url) {
        const font = new FontFace(editor.style.fontFamily, `url(${url})`);
        font.load().then((loadedFont) => {
            document.fonts.add(loadedFont);
        }).catch((error) => console.error('Error loading font:', error));
    }

    // Toggle italic style
    toggleItalicSwitch.addEventListener('change', () => {
        applyFontSettings(fontFamilySelect.value, fontWeightSelect.value, toggleItalicSwitch.checked);
    });

    // Save content and styles to localStorage
    saveButton.addEventListener('click', () => {
        localStorage.setItem('editorContent', editor.value);
        localStorage.setItem('fontFamily', fontFamilySelect.value);
        localStorage.setItem('fontWeight', fontWeightSelect.value);
        localStorage.setItem('isItalic', toggleItalicSwitch.checked);
        alert('Settings saved!');
    });

    // Reset content and styles
    resetButton.addEventListener('click', () => {
        localStorage.removeItem('editorContent');
        localStorage.removeItem('fontFamily');
        localStorage.removeItem('fontWeight');
        localStorage.removeItem('isItalic');
        loadSettings(); // Reload default settings
    });

    // Load settings from localStorage
    function loadSettings() {
        const savedContent = localStorage.getItem('editorContent');
        const savedFontFamily = localStorage.getItem('fontFamily') || defaultFontFamily;
        const savedFontWeight = localStorage.getItem('fontWeight') || defaultFontWeight;
        const savedIsItalic = localStorage.getItem('isItalic') === 'true';

        editor.value = savedContent || '';
        fontFamilySelect.value = savedFontFamily;
        fontWeightSelect.value = savedFontWeight;
        toggleItalicSwitch.checked = savedIsItalic;

        updateFontWeights(savedFontFamily);
        applyFontSettings(savedFontFamily, savedFontWeight, savedIsItalic);
    }
});
