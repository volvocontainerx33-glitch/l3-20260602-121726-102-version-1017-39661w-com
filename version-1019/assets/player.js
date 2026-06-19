(function () {
    window.initMoviePlayer = function (videoId, coverId, streamUrl) {
        var video = document.getElementById(videoId);
        var cover = document.getElementById(coverId);
        var started = false;
        var hlsInstance = null;

        if (!video || !cover || !streamUrl) {
            return;
        }

        function attachStream() {
            if (started) {
                return;
            }

            started = true;

            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = streamUrl;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(streamUrl);
                hlsInstance.attachMedia(video);
            } else {
                video.src = streamUrl;
            }
        }

        function playVideo() {
            attachStream();
            cover.classList.add("is-hidden");
            video.controls = true;
            var result = video.play();

            if (result && typeof result.catch === "function") {
                result.catch(function () {
                    cover.classList.remove("is-hidden");
                });
            }
        }

        cover.addEventListener("click", playVideo);

        video.addEventListener("click", function () {
            if (video.paused) {
                playVideo();
            }
        });

        window.addEventListener("pagehide", function () {
            if (hlsInstance) {
                hlsInstance.destroy();
                hlsInstance = null;
            }
        });
    };
})();
