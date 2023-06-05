document.addEventListener('DOMContentLoaded', function () {
    var downloadButton = document.getElementById('downloadButton');
    var loader = document.getElementById('loader');

    downloadButton.addEventListener('click', function () {
        var videoUrl = document.getElementById('videoUrl').value;
        showLoader(); // Show the loader before sending the download message
        chrome.runtime.sendMessage({ action: 'downloadVideo', videoUrl: videoUrl });
    });

    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        debugger
        if (message.action === 'downloadComplete') {
            hideLoader(); // Hide the loader upon download completion
        }
    });

    function showLoader() {
        loader.style.display = 'inherit';
    }

    function hideLoader() {
        loader.style.display = 'none';
    }
});

