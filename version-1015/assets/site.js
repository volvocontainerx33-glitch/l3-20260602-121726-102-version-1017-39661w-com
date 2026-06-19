(function () {
    var navToggle = document.querySelector('[data-nav-toggle]');
    var navMenu = document.querySelector('[data-nav-menu]');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            navMenu.classList.toggle('open');
        });
    }

    document.querySelectorAll('.site-search').forEach(function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            var input = form.querySelector('input[name="q"]');
            var base = form.getAttribute('data-base') || './';
            var query = input ? input.value.trim() : '';
            var target = base + 'search.html';

            if (query) {
                target += '?q=' + encodeURIComponent(query);
            }

            window.location.href = target;
        });
    });

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var current = 0;
        var timer = null;

        var showSlide = function (index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === current);
            });
        };

        var start = function () {
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5000);
        };

        var restart = function () {
            window.clearInterval(timer);
            start();
        };

        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(current - 1);
                restart();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                showSlide(current + 1);
                restart();
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
                restart();
            });
        });

        showSlide(0);
        start();
    }

    var searchInput = document.getElementById('searchInput');
    var categoryFilter = document.getElementById('categoryFilter');
    var yearFilter = document.getElementById('yearFilter');
    var typeFilter = document.getElementById('typeFilter');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.search-card'));

    if (searchInput && cards.length) {
        var params = new URLSearchParams(window.location.search);
        var initialQuery = params.get('q') || '';

        searchInput.value = initialQuery;

        var filterCards = function () {
            var query = searchInput.value.trim().toLowerCase();
            var category = categoryFilter ? categoryFilter.value : '';
            var year = yearFilter ? yearFilter.value : '';
            var type = typeFilter ? typeFilter.value : '';

            cards.forEach(function (card) {
                var text = (card.getAttribute('data-text') || '').toLowerCase();
                var title = (card.getAttribute('data-title') || '').toLowerCase();
                var cardCategory = card.getAttribute('data-category') || '';
                var cardYear = card.getAttribute('data-year') || '';
                var cardType = card.getAttribute('data-type') || '';
                var matched = true;

                if (query && title.indexOf(query) === -1 && text.indexOf(query) === -1) {
                    matched = false;
                }

                if (category && cardCategory !== category) {
                    matched = false;
                }

                if (year && cardYear !== year) {
                    matched = false;
                }

                if (type && cardType !== type) {
                    matched = false;
                }

                card.classList.toggle('is-hidden', !matched);
            });
        };

        [searchInput, categoryFilter, yearFilter, typeFilter].forEach(function (control) {
            if (control) {
                control.addEventListener('input', filterCards);
                control.addEventListener('change', filterCards);
            }
        });

        filterCards();
    }

    document.querySelectorAll('[data-player]').forEach(function (holder) {
        var video = holder.querySelector('[data-player-video]');
        var cover = holder.querySelector('[data-player-cover]');
        var stream = holder.getAttribute('data-stream');
        var hlsInstance = null;
        var ready = false;

        var attach = function () {
            if (!video || !stream || ready) {
                return;
            }

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(stream);
                hlsInstance.attachMedia(video);
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
            } else {
                video.src = stream;
            }

            ready = true;
        };

        var play = function () {
            attach();

            if (cover) {
                cover.classList.add('hidden');
            }

            if (video) {
                video.play().catch(function () {});
            }
        };

        if (cover) {
            cover.addEventListener('click', play);
        }

        if (video) {
            video.addEventListener('click', function () {
                if (!ready) {
                    play();
                }
            });
        }

        window.addEventListener('pagehide', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    });
})();
