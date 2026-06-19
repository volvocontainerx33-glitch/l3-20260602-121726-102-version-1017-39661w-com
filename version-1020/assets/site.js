(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var menu = document.querySelector('[data-menu]');

    if (menuButton && menu) {
        menuButton.addEventListener('click', function () {
            menu.classList.toggle('is-open');
        });
    }

    var sliders = document.querySelectorAll('[data-hero-slider]');

    sliders.forEach(function (slider) {
        var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
        var current = 0;

        function showSlide(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
            });
        });

        if (slides.length > 1) {
            window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        }
    });

    var searchInput = document.querySelector('[data-card-search]');
    var cardList = document.querySelector('[data-card-list]');

    if (searchInput && cardList) {
        var cards = Array.prototype.slice.call(cardList.querySelectorAll('[data-title]'));

        searchInput.addEventListener('input', function () {
            var query = searchInput.value.trim().toLowerCase();

            cards.forEach(function (card) {
                var text = [
                    card.getAttribute('data-title') || '',
                    card.getAttribute('data-year') || '',
                    card.getAttribute('data-region') || '',
                    card.getAttribute('data-genre') || '',
                    card.getAttribute('data-category') || '',
                    card.textContent || ''
                ].join(' ').toLowerCase();

                card.classList.toggle('is-hidden', query && text.indexOf(query) === -1);
            });
        });
    }

    var playerBoxes = document.querySelectorAll('[data-player-box]');

    playerBoxes.forEach(function (box) {
        var video = box.querySelector('video[data-stream]');
        var startButton = box.querySelector('[data-player-start]');

        if (!video || !startButton) {
            return;
        }

        startButton.addEventListener('click', function () {
            var stream = video.getAttribute('data-stream');

            function playVideo() {
                var playPromise = video.play();
                if (playPromise && typeof playPromise.catch === 'function') {
                    playPromise.catch(function () {});
                }
            }

            if (window.Hls && window.Hls.isSupported()) {
                var hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(stream);
                hls.attachMedia(video);
                hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    box.classList.add('is-ready');
                    playVideo();
                });
            } else {
                video.src = stream;
                box.classList.add('is-ready');
                playVideo();
            }
        });
    });

    var images = document.querySelectorAll('img');

    images.forEach(function (image) {
        image.addEventListener('error', function () {
            image.style.opacity = '0';
        });
    });
})();
