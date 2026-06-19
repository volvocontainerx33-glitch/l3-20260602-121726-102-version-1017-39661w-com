(function () {
  const header = document.querySelector('[data-site-header]');
  const mobileButton = document.querySelector('[data-nav-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');
  const backTop = document.querySelector('[data-back-top]');

  function updateScrollState() {
    const active = window.scrollY > 24;
    if (header) {
      header.classList.toggle('is-floating', active);
    }
    if (backTop) {
      backTop.classList.toggle('is-visible', window.scrollY > 480);
    }
  }

  window.addEventListener('scroll', updateScrollState, { passive: true });
  updateScrollState();

  if (mobileButton && mobileNav) {
    mobileButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  if (backTop) {
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
  const next = document.querySelector('[data-hero-next]');
  const prev = document.querySelector('[data-hero-prev]');
  let heroIndex = 0;
  let heroTimer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    heroIndex = (index + slides.length) % slides.length;
    slides.forEach(function (slide, current) {
      slide.classList.toggle('is-active', current === heroIndex);
    });
    dots.forEach(function (dot, current) {
      dot.classList.toggle('is-active', current === heroIndex);
    });
  }

  function startHeroTimer() {
    if (slides.length <= 1) {
      return;
    }
    window.clearInterval(heroTimer);
    heroTimer = window.setInterval(function () {
      showSlide(heroIndex + 1);
    }, 5200);
  }

  if (next) {
    next.addEventListener('click', function () {
      showSlide(heroIndex + 1);
      startHeroTimer();
    });
  }

  if (prev) {
    prev.addEventListener('click', function () {
      showSlide(heroIndex - 1);
      startHeroTimer();
    });
  }

  dots.forEach(function (dot, index) {
    dot.addEventListener('click', function () {
      showSlide(index);
      startHeroTimer();
    });
  });

  showSlide(0);
  startHeroTimer();

  const searchInput = document.querySelector('[data-search-input]');
  const searchClear = document.querySelector('[data-search-clear]');
  const searchableCards = Array.from(document.querySelectorAll('[data-movie-card]'));
  const emptyState = document.querySelector('[data-empty-state]');

  function normalizeText(value) {
    return String(value || '').toLowerCase().trim();
  }

  function applySearch() {
    if (!searchInput || !searchableCards.length) {
      return;
    }
    const keyword = normalizeText(searchInput.value);
    let visible = 0;
    searchableCards.forEach(function (card) {
      const haystack = normalizeText(card.getAttribute('data-search'));
      const matched = !keyword || haystack.indexOf(keyword) !== -1;
      card.classList.toggle('is-hidden', !matched);
      if (matched) {
        visible += 1;
      }
    });
    if (emptyState) {
      emptyState.classList.toggle('is-visible', visible === 0);
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', applySearch);
  }

  if (searchClear && searchInput) {
    searchClear.addEventListener('click', function () {
      searchInput.value = '';
      applySearch();
      searchInput.focus();
    });
  }
})();

function initMoviePlayer(source) {
  const video = document.querySelector('[data-player-video]');
  const overlay = document.querySelector('[data-player-overlay]');
  const button = document.querySelector('[data-player-button]');
  const message = document.querySelector('[data-player-message]');
  let hlsInstance = null;
  let prepared = false;

  if (!video || !source) {
    return;
  }

  function showMessage(text) {
    if (message) {
      message.textContent = text;
      message.classList.add('is-visible');
    }
  }

  function preparePlayer() {
    if (prepared) {
      return;
    }
    prepared = true;

    if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
      hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
        if (data && data.fatal) {
          showMessage('播放暂时不可用，请稍后再试');
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else {
      showMessage('播放暂时不可用，请稍后再试');
    }
  }

  function playVideo() {
    preparePlayer();
    if (overlay) {
      overlay.classList.add('is-hidden');
    }
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {
        if (overlay) {
          overlay.classList.remove('is-hidden');
        }
      });
    }
  }

  if (button) {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      playVideo();
    });
  }

  if (overlay) {
    overlay.addEventListener('click', playVideo);
  }

  video.addEventListener('click', function () {
    if (video.paused) {
      playVideo();
    } else {
      video.pause();
    }
  });

  video.addEventListener('play', function () {
    if (overlay) {
      overlay.classList.add('is-hidden');
    }
  });

  video.addEventListener('pause', function () {
    if (video.currentTime === 0 && overlay) {
      overlay.classList.remove('is-hidden');
    }
  });

  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}
