document.addEventListener('DOMContentLoaded', function() {
  var header = document.querySelector('[data-header]');
  var menuButton = document.querySelector('[data-menu-button]');

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

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (menuButton) {
    menuButton.addEventListener('click', function() {
      document.body.classList.toggle('menu-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function(slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function(dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function startTimer() {
      clearInterval(timer);
      timer = setInterval(function() {
        showSlide(current + 1);
      }, 5200);
    }

    dots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
        startTimer();
      });
    });

    if (prev) {
      prev.addEventListener('click', function() {
        showSlide(current - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function() {
        showSlide(current + 1);
        startTimer();
      });
    }

    showSlide(0);
    startTimer();
  }

  var inputs = Array.prototype.slice.call(document.querySelectorAll('[data-filter-input]'));
  inputs.forEach(function(input) {
    var root = input.closest('[data-filter-scope]');
    var targetsRoot = root && root.nextElementSibling && root.nextElementSibling.matches('[data-filter-scope]')
      ? root.nextElementSibling
      : document;
    var items = Array.prototype.slice.call(targetsRoot.querySelectorAll('.searchable-item'));

    if (!items.length) {
      items = Array.prototype.slice.call(document.querySelectorAll('.searchable-item'));
    }

    input.addEventListener('input', function() {
      var value = input.value.trim().toLowerCase();
      items.forEach(function(item) {
        var text = (item.getAttribute('data-search') || item.textContent || '').toLowerCase();
        item.classList.toggle('is-hidden-by-filter', value && text.indexOf(value) === -1);
      });
    });
  });
});
