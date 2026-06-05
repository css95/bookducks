const API_URL = "https://orderly-love-3b49471361.strapiapp.com";
const API_BASE = `${API_URL}/api`;

function getImageUrl(url) {
    if (!url) return "";
    return url.startsWith("http") ? url : `${API_URL}${url}`;
}