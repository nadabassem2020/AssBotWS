const { freeDownloader } = require('../controllers/freeDownloaderController');

function freeDownloaderRoute(app){
    app.route('/freeDownloader/search')
        .get(freeDownloader)
}

module.exports = freeDownloaderRoute;