(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var mainNav = document.querySelector("[data-main-nav]");

    if (menuButton && mainNav) {
        menuButton.addEventListener("click", function () {
            mainNav.classList.toggle("is-open");
        });
    }

    var hero = document.querySelector("[data-hero]");

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
        var index = 0;
        var timer = null;

        function showSlide(nextIndex) {
            if (!slides.length) {
                return;
            }

            index = (nextIndex + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === index);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === index);
            });
        }

        function startHero() {
            window.clearInterval(timer);
            timer = window.setInterval(function () {
                showSlide(index + 1);
            }, 5600);
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
                startHero();
            });
        });

        showSlide(0);
        startHero();
    }

    var cardGrid = document.querySelector("[data-card-grid]");
    var cards = cardGrid ? Array.prototype.slice.call(cardGrid.querySelectorAll("[data-card]")) : [];
    var searchInput = document.querySelector("[data-search-input]");
    var yearSelect = document.querySelector("[data-filter-year]");
    var typeSelect = document.querySelector("[data-filter-type]");
    var regionSelect = document.querySelector("[data-filter-region]");

    function norm(value) {
        return String(value || "").toLowerCase().trim();
    }

    function applyFilters() {
        if (!cards.length) {
            return;
        }

        var query = norm(searchInput ? searchInput.value : "");
        var year = norm(yearSelect ? yearSelect.value : "");
        var type = norm(typeSelect ? typeSelect.value : "");
        var region = norm(regionSelect ? regionSelect.value : "");

        cards.forEach(function (card) {
            var text = norm(card.getAttribute("data-search"));
            var cardYear = norm(card.getAttribute("data-year"));
            var cardType = norm(card.getAttribute("data-type"));
            var cardRegion = norm(card.getAttribute("data-region"));
            var matched = true;

            if (query && text.indexOf(query) === -1) {
                matched = false;
            }

            if (year && cardYear !== year) {
                matched = false;
            }

            if (type && cardType !== type) {
                matched = false;
            }

            if (region && cardRegion !== region) {
                matched = false;
            }

            card.classList.toggle("is-filtered-out", !matched);
        });
    }

    var params = new URLSearchParams(window.location.search);
    var queryParam = params.get("q") || params.get("search") || "";

    if (searchInput && queryParam) {
        searchInput.value = queryParam;
    }

    [searchInput, yearSelect, typeSelect, regionSelect].forEach(function (control) {
        if (control) {
            control.addEventListener("input", applyFilters);
            control.addEventListener("change", applyFilters);
        }
    });

    applyFilters();
})();
