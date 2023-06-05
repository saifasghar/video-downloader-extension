chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'downloadVideo') {
        const videoUrl = message.videoUrl;
        downloadVideo(videoUrl);
    }
});

function downloadVideo(videoUrl) {
    chrome.downloads.download({
        url: 'http://localhost:3000/download',
        method: 'POST',
        headers: [
            { name: 'Content-Type', value: 'application/json' }
        ],
        body: JSON.stringify({ url: videoUrl }),
        filename: 'video.mp4',
        saveAs: false
    }, function (downloadId) {
        chrome.runtime.sendMessage({ action: 'downloadComplete', videoUrl: 'videoUrl' });
    });
}

