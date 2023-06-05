const express = require('express');
const bodyParser = require('body-parser');
const ytdl = require('ytdl-core');
const cors = require('cors');
// const fbdl = require('fbdl-core');
// const fs = require("fs");
const facebookVideoDownloader = require('facebook-video-downloader');

const app = express();
app.use(bodyParser.json());

app.use(cors());

app.options('*', cors()); // Enable preflight requests for all routes
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,authorization,type');
    next();
});
app.options('*', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    // Send a 200 OK response to the preflight request
    res.sendStatus(200);
});

app.post('/download', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'chrome-extension://cbcpcikgkffmmbbkdnkjpjpcjfkldnho');

    const videoUrl = req.body.url;

    if (videoUrl.includes('youtube') || videoUrl.includes('youtu.be')) {
        try {
            // Fetch the video info to get the content length
            const videoId = extractVideoId(videoUrl);
            const info = await ytdl.getBasicInfo(videoId);
            const format = ytdl.chooseFormat(info.formats, { quality: 'lowest' });
            const contentLength = format.contentLength;

            res.setHeader('Content-Disposition', 'attachment; filename="video.mp4"');
            res.setHeader('Content-Length', contentLength);

            // Pipe the video stream to the response
            ytdl(videoId, { quality: 'highest' }).pipe(res);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'An error occurred while fetching video information' });
        }
    } else if (videoUrl.includes('facebook') || videoUrl.includes('fb.')) {
        try {
            // Download the video using the facebook-video-downloader library
            const downloadOptions = {
                quality: 'highest',
            };

            const downloadResult = await facebookVideoDownloader(videoUrl, downloadOptions);
            const { filename, mimetype, buffer } = downloadResult;

            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.setHeader('Content-Type', mimetype);
            res.send(buffer);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'An error occurred while downloading the video' });
        }
    }
});

function extractVideoId(url) {
    const match = url.match(/(?:[?&]|\b)v=([^&#]+)/);
    return match ? match[1] : null;
}

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
