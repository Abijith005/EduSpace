// sendToken.js
(function() {
    const token = new URLSearchParams(window.location.search).get('token');
    if (token) {
        window.opener.postMessage({ token: token }, 'http://localhost:4200');
    }
    window.close();
})();
