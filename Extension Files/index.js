document.addEventListener('DOMContentLoaded', function () {
    var downloadButton = document.getElementById('downloadButton');
    downloadButton.addEventListener('click', function () {
        var videoUrl = document.getElementById('videoUrl').value;
        downloadVideo(videoUrl);
    });
});

function downloadVideo(videoUrl) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:3000/download', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.responseType = 'blob';

    // Track the progress of the download
    xhr.onprogress = function (event) {
        if (event.lengthComputable) {
            var percentComplete = Math.round((event.loaded / event.total) * 100);
            updateProgressBar(percentComplete);
        }
    };

    xhr.onloadstart = function () {
        showProgressBar();
    };

    xhr.onload = function () {
        if (xhr.status === 200) {
            var url = window.URL.createObjectURL(xhr.response);
            var a = document.createElement('a');
            a.href = url;
            a.download = 'video.mp4';
            a.click();
        }
    };

    xhr.send(JSON.stringify({ url: videoUrl }));
}

function showProgressBar() {
    var progressBar = document.querySelector('.progress');
    progressBar.style.display = 'block';
}

function updateProgressBar(percentComplete) {
    var progressElement = document.querySelector('.progress-bar');
    progressElement.style.width = percentComplete + '%';
    progressElement.setAttribute('aria-valuenow', percentComplete);
    progressElement.textContent = percentComplete + '%'; // Display the progress percentage
}
