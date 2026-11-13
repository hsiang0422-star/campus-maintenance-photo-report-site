(function () {
  var modal = document.querySelector('dialog');
  if (!modal) return;
  var photos = Array.prototype.slice.call(document.querySelectorAll('.photo'));
  var n = photos.length;
  var current = 0;
  var scale = 1;

  modal.classList.add('viewer');
  modal.innerHTML =
    '<div class="v-bar v-top">' +
      '<button type="button" class="v-btn" data-act="prev">‹ 上一張</button>' +
      '<span class="v-count"></span>' +
      '<button type="button" class="v-btn" data-act="next">下一張 ›</button>' +
      '<span class="v-spacer"></span>' +
      '<button type="button" class="v-btn" data-act="zoom-in">放大</button>' +
      '<button type="button" class="v-btn" data-act="zoom-reset">還原尺寸</button>' +
      '<button type="button" class="v-btn v-close" data-act="close">關閉 ×</button>' +
    '</div>' +
    '<div class="v-stage"><img alt=""></div>' +
    '<div class="v-bar v-bottom">' +
      '<button type="button" class="v-btn" data-act="prev">‹ 上一張</button>' +
      '<p class="v-caption"></p>' +
      '<button type="button" class="v-btn" data-act="next">下一張 ›</button>' +
    '</div>';

  var img = modal.querySelector('img');
  var stage = modal.querySelector('.v-stage');
  var counts = modal.querySelectorAll('.v-count');
  var captions = modal.querySelectorAll('.v-caption');
  var prevs = modal.querySelectorAll('[data-act="prev"]');
  var nexts = modal.querySelectorAll('[data-act="next"]');
  var zoomIn = modal.querySelector('[data-act="zoom-in"]');
  var zoomReset = modal.querySelector('[data-act="zoom-reset"]');

  function setScale(next) {
    scale = Math.min(4, Math.max(1, next));
    if (scale === 1) {
      img.style.maxWidth = '';
      img.style.maxHeight = '';
      img.style.width = '';
      img.style.height = '';
    } else {
      img.style.maxWidth = 'none';
      img.style.maxHeight = 'none';
      img.style.width = (scale * 100) + '%';
      img.style.height = 'auto';
    }
    zoomIn.disabled = scale >= 4;
    zoomReset.disabled = scale === 1;
    if (scale > 1) {
      requestAnimationFrame(function () {
        stage.scrollLeft = (stage.scrollWidth - stage.clientWidth) / 2;
        stage.scrollTop = (stage.scrollHeight - stage.clientHeight) / 2;
      });
    } else {
      stage.scrollLeft = 0;
      stage.scrollTop = 0;
    }
  }

  function show(index) {
    if (index < 0 || index >= n) return;
    current = index;
    var src = photos[index];
    var caption = src.dataset.caption || '';
    img.src = src.dataset.src;
    img.alt = caption;
    Array.prototype.forEach.call(counts, function (el) { el.textContent = (index + 1) + ' / ' + n; });
    Array.prototype.forEach.call(captions, function (el) { el.textContent = caption; });
    Array.prototype.forEach.call(prevs, function (el) { el.disabled = index === 0; });
    Array.prototype.forEach.call(nexts, function (el) { el.disabled = index === n - 1; });
    setScale(1);
  }

  photos.forEach(function (button, index) {
    button.addEventListener('click', function () {
      show(index);
      modal.showModal();
    });
  });

  modal.addEventListener('click', function (event) {
    var target = event.target.closest('[data-act]');
    if (target) {
      var act = target.dataset.act;
      if (act === 'prev') show(current - 1);
      if (act === 'next') show(current + 1);
      if (act === 'zoom-in') setScale(scale * 1.5);
      if (act === 'zoom-reset') setScale(1);
      if (act === 'close') modal.close();
      return;
    }
    if (event.target === modal) modal.close();
  });

  document.addEventListener('keydown', function (event) {
    if (!modal.open) return;
    if (event.key === 'ArrowLeft') { event.preventDefault(); show(current - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); show(current + 1); }
    if (event.key === '+' || event.key === '=') { event.preventDefault(); setScale(scale * 1.5); }
    if (event.key === '-') { event.preventDefault(); setScale(scale / 1.5); }
    if (event.key === '0') { event.preventDefault(); setScale(1); }
  });

  // Swipe between photos only when not zoomed, so panning still works.
  var startX = null;
  stage.addEventListener('touchstart', function (event) {
    startX = scale === 1 ? event.touches[0].clientX : null;
  }, { passive: true });
  stage.addEventListener('touchend', function (event) {
    if (startX === null) return;
    var dx = event.changedTouches[0].clientX - startX;
    startX = null;
    if (Math.abs(dx) < 40) return;
    show(dx < 0 ? current + 1 : current - 1);
  });
})();
