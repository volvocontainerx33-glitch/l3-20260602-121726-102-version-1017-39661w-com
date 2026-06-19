(function() {
    var header = document.querySelector('[data-site-header]');
    var menuButton = document.querySelector('[data-menu-button]');
    var hero = document.querySelector('[data-hero-slider]');

    function updateHeader() {
        if (!header) {
            return;
        }
        if (window.scrollY > 18) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }
    }

    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();

    if (menuButton && header) {
        menuButton.addEventListener('click', function() {
            header.classList.toggle('is-open');
        });
    }

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var previous = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var active = 0;
        var timer = null;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            active = (index + slides.length) % slides.length;
            slides.forEach(function(slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === active);
            });
            dots.forEach(function(dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === active);
            });
        }

        function startTimer() {
            window.clearInterval(timer);
            timer = window.setInterval(function() {
                showSlide(active + 1);
            }, 5200);
        }

        dots.forEach(function(dot, dotIndex) {
            dot.addEventListener('click', function() {
                showSlide(dotIndex);
                startTimer();
            });
        });

        if (previous) {
            previous.addEventListener('click', function() {
                showSlide(active - 1);
                startTimer();
            });
        }

        if (next) {
            next.addEventListener('click', function() {
                showSlide(active + 1);
                startTimer();
            });
        }

        showSlide(0);
        startTimer();
    }

    document.querySelectorAll('[data-filter-panel]').forEach(function(panel) {
        var root = panel.closest('section') || document;
        var input = panel.querySelector('[data-search-input]');
        var buttons = Array.prototype.slice.call(panel.querySelectorAll('[data-filter]'));
        var cards = Array.prototype.slice.call(root.querySelectorAll('[data-movie-card]'));
        var filterValue = '全部';

        function normalize(value) {
            return String(value || '').toLowerCase().trim();
        }

        function applyFilter() {
            var query = normalize(input ? input.value : '');
            cards.forEach(function(card) {
                var haystack = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-keywords'),
                    card.getAttribute('data-year'),
                    card.getAttribute('data-type')
                ].join(' '));
                var queryMatch = !query || haystack.indexOf(query) !== -1;
                var filterMatch = filterValue === '全部' || haystack.indexOf(normalize(filterValue)) !== -1;
                card.classList.toggle('is-hidden', !(queryMatch && filterMatch));
            });
        }

        if (input) {
            input.addEventListener('input', applyFilter);
        }

        buttons.forEach(function(button) {
            if (button.getAttribute('data-filter') === '全部') {
                button.classList.add('is-active');
            }
            button.addEventListener('click', function() {
                filterValue = button.getAttribute('data-filter') || '全部';
                buttons.forEach(function(item) {
                    item.classList.toggle('is-active', item === button);
                });
                applyFilter();
            });
        });
    });
})();
