export const getApiUrl = () => {
    let api_url = import.meta.env.VITE_API_URL;
    if (window.location.hostname !== 'localhost' && (!api_url || api_url.includes('localhost'))) {
        api_url = 'https://gitfixai.onrender.com';
    } else {
        api_url = api_url || 'http://localhost:8000';
    }
    return api_url;
};

export const getWsUrl = () => {
    const apiUrl = getApiUrl();
    const wsProtocol = apiUrl.startsWith('https') ? 'wss' : 'ws';
    return apiUrl.replace(/^http(s)?/, wsProtocol) + '/ws';
};
