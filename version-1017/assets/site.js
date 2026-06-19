(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  var navToggle = qs('.nav-toggle');
  var navMenu = qs('.nav-menu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var opened = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
      navToggle.textContent = opened ? '×' : '☰';
    });
  }

  var slides = qsa('.hero-slide');
  var dots = qsa('.hero-dot');
  var current = 0;
  var timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('active', i === current);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('active', i === current);
    });
  }

  function startHero() {
    if (slides.length < 2) {
      return;
    }
    timer = window.setInterval(function () {
      showSlide(current + 1);
    }, 5000);
  }

  function resetHero() {
    if (timer) {
      window.clearInterval(timer);
    }
    startHero();
  }

  qsa('.hero-next').forEach(function (button) {
    button.addEventListener('click', function () {
      showSlide(current + 1);
      resetHero();
    });
  });

  qsa('.hero-prev').forEach(function (button) {
    button.addEventListener('click', function () {
      showSlide(current - 1);
      resetHero();
    });
  });

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      showSlide(Number(dot.getAttribute('data-slide')) || 0);
      resetHero();
    });
  });

  startHero();

  function normalize(text) {
    return (text || '').toString().toLowerCase().trim();
  }

  function runFilter() {
    var input = qs('.filter-input');
    var select = qs('.filter-select');
    var list = qs('.filter-list');
    if (!list || (!input && !select)) {
      return;
    }
    var keyword = normalize(input ? input.value : '');
    var selected = normalize(select ? select.value : '');
    qsa('[data-title]', list).forEach(function (card) {
      var haystack = normalize([
        card.getAttribute('data-title'),
        card.getAttribute('data-region'),
        card.getAttribute('data-year'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-tags')
      ].join(' '));
      var okKeyword = !keyword || haystack.indexOf(keyword) !== -1;
      var okSelected = !selected || haystack.indexOf(selected) !== -1;
      card.classList.toggle('hidden-by-filter', !(okKeyword && okSelected));
    });
  }

  qsa('.filter-input, .filter-select').forEach(function (control) {
    control.addEventListener('input', runFilter);
    control.addEventListener('change', runFilter);
  });

  function renderSearch() {
    var input = qs('#search-input');
    var results = qs('#search-results');
    var summary = qs('#search-summary');
    if (!input || !results || !summary || !window.MOVIE_INDEX) {
      return;
    }
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';
    input.value = query;
    var normalized = normalize(query);
    var matches = window.MOVIE_INDEX.filter(function (item) {
      if (!normalized) {
        return true;
      }
      return normalize([
        item.title,
        item.region,
        item.year,
        item.type,
        item.genre,
        item.category,
        item.tags,
        item.oneLine
      ].join(' ')).indexOf(normalized) !== -1;
    }).slice(0, 120);
    summary.textContent = normalized ? '搜索结果：' + matches.length + ' 条' : '可输入关键词搜索，也可以先浏览以下精选条目';
    results.innerHTML = matches.map(function (item) {
      return [
        '<article class="movie-card">',
        '<a class="movie-card-link" href="' + item.url + '">',
        '<figure class="movie-cover">',
        '<img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '" loading="lazy">',
        '<span class="movie-category">' + escapeHtml(item.category) + '</span>',
        '<span class="play-hover">▶</span>',
        '</figure>',
        '<div class="movie-card-body">',
        '<h3>' + escapeHtml(item.title) + '</h3>',
        '<p>' + escapeHtml(item.oneLine) + '</p>',
        '<div class="movie-meta"><span>' + escapeHtml(item.region) + '</span><span>' + escapeHtml(item.year) + '</span></div>',
        '</div>',
        '</a>',
        '</article>'
      ].join('');
    }).join('');
  }

  function escapeHtml(value) {
    return (value || '').toString()
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  renderSearch();
})();

function initMoviePlayer(source) {
  var video = document.getElementById('movie-player');
  var overlay = document.getElementById('player-overlay');
  var startButton = document.getElementById('player-start');
  var hlsInstance = null;

  if (!video || !overlay || !source) {
    return;
  }

  function attachSource() {
    if (video.getAttribute('data-ready') === 'true') {
      return;
    }
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
    } else if (window.Hls && window.Hls.isSupported()) {
      hlsInstance = new window.Hls({ enableWorker: true });
      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
    } else {
      video.src = source;
    }
    video.setAttribute('data-ready', 'true');
  }

  function playVideo() {
    attachSource();
    overlay.classList.add('is-hidden');
    video.controls = true;
    var promise = video.play();
    if (promise && promise.catch) {
      promise.catch(function () {});
    }
  }

  overlay.addEventListener('click', playVideo);
  if (startButton) {
    startButton.addEventListener('click', function (event) {
      event.stopPropagation();
      playVideo();
    });
  }
  video.addEventListener('click', function () {
    if (video.paused) {
      playVideo();
    }
  });
  video.addEventListener('play', function () {
    overlay.classList.add('is-hidden');
  });
  window.addEventListener('beforeunload', function () {
    if (hlsInstance) {
      hlsInstance.destroy();
    }
  });
}
