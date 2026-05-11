async function applyTheme() {
    try {
        const response = await axios.get(`${API_BASE}/site-setting`);
        const currentTheme = response.data.data.theme.trim();

        document.body.classList.remove("theme-warm");
        document.body.classList.add(`theme-${currentTheme}`);

    } catch (error) {
        console.error("Theme load failed, using fallback:", error);
    }
}

applyTheme();