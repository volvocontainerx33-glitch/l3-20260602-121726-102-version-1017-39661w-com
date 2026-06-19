(function() {
  const menuButton = document.querySelector("[data-menu-toggle]");
  const mobilePanel = document.querySelector("[data-mobile-panel]");

  if (menuButton && mobilePanel) {
    menuButton.addEventListener("click", function() {
      mobilePanel.classList.toggle("is-open");
    });
  }

  const carousel = document.querySelector("[data-hero-carousel]");
  if (carousel) {
    const slides = Array.from(carousel.querySelectorAll("[data-hero-slide]"));
    const dots = Array.from(carousel.querySelectorAll("[data-hero-dot]"));
    let current = 0;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function(slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === current);
      });
      dots.forEach(function(dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === current);
      });
    }

    dots.forEach(function(dot, index) {
      dot.addEventListener("click", function() {
        showSlide(index);
      });
    });

    if (slides.length > 1) {
      setInterval(function() {
        showSlide(current + 1);
      }, 5200);
    }
  }

  const cards = Array.from(document.querySelectorAll("[data-card]"));
  const searchInput = document.querySelector("[data-filter-search]");
  const yearSelect = document.querySelector("[data-filter-year]");
  const typeSelect = document.querySelector("[data-filter-type]");
  const resetButton = document.querySelector("[data-filter-reset]");
  const countLabel = document.querySelector("[data-filter-count]");

  function getQueryFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("q") || "";
  }

  if (searchInput && !searchInput.value) {
    searchInput.value = getQueryFromUrl();
  }

  function applyFilters() {
    if (!cards.length) {
      return;
    }

    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const year = yearSelect ? yearSelect.value : "";
    const type = typeSelect ? typeSelect.value : "";
    let visible = 0;

    cards.forEach(function(card) {
      const text = [
        card.dataset.title || "",
        card.dataset.category || "",
        card.dataset.tags || "",
        card.dataset.type || "",
        card.dataset.year || ""
      ].join(" ").toLowerCase();
      const yearOk = !year || card.dataset.year === year;
      const typeOk = !type || card.dataset.type === type;
      const queryOk = !query || text.indexOf(query) !== -1;
      const shouldShow = yearOk && typeOk && queryOk;
      card.classList.toggle("is-hidden", !shouldShow);
      if (shouldShow) {
        visible += 1;
      }
    });

    if (countLabel) {
      countLabel.textContent = query || year || type ? "筛选结果：" + visible + " 部" : "";
    }
  }

  [searchInput, yearSelect, typeSelect].forEach(function(control) {
    if (control) {
      control.addEventListener("input", applyFilters);
      control.addEventListener("change", applyFilters);
    }
  });

  if (resetButton) {
    resetButton.addEventListener("click", function() {
      if (searchInput) {
        searchInput.value = "";
      }
      if (yearSelect) {
        yearSelect.value = "";
      }
      if (typeSelect) {
        typeSelect.value = "";
      }
      applyFilters();
    });
  }

  applyFilters();
})();
