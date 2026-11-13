(function () {
  var modal = document.querySelector('dialog');
  if (!modal) return;
  var img = modal.querySelector('img');
  var caption = modal.querySelector('p');
  var closeBtn = modal.querySelector('.close');
  var photos = Array.prototype.slice.call(document.querySelectorAll('.photo'));
  var current = 0;

  function makeNav(cls, label, text) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'viewer-nav ' + cls;
    b.setAttribute('aria-label', label);
    b.textContent = text;
    return b;
  }

  var prevBtn = makeNav('prev', '上一張', '‹');
  var nextBtn = makeNav('next', '下一張', '›');
  modal.appendChild(prevBtn);
  modal.appendChild(nextBtn);

  function show(index) {
    if (index < 0 || index >= photos.length) return;
    current = index;
    var src = photos[index];
    img.src = src.dataset.src;
    img.alt = src.dataset.caption || '';
    caption.textContent = (index + 1) + ' / ' + photos.length + '　' + (src.dataset.caption || '');
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === photos.length - 1;
  }

  photos.forEach(function (button, index) {
    button.addEventListener('click', function () {
      show(index);
      modal.showModal();
    });
  });

  prevBtn.addEventListener('click', function () { show(current - 1); });
  nextBtn.addEventListener('click', function () { show(current + 1); });
  closeBtn.addEventListener('click', function () { modal.close(); });
  modal.addEventListener('click', function (event) {
    if (event.target === modal) modal.close();
  });

  // Listen on document: a focused nav button can become disabled at the ends,
  // which drops focus out of the dialog and would stop dialog-level key events.
  document.addEventListener('keydown', function (event) {
    if (!modal.open) return;
    if (event.key === 'ArrowLeft') { event.preventDefault(); show(current - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); show(current + 1); }
  });

  var startX = null;
  modal.addEventListener('touchstart', function (event) {
    startX = event.touches[0].clientX;
  }, { passive: true });
  modal.addEventListener('touchend', function (event) {
    if (startX === null) return;
    var dx = event.changedTouches[0].clientX - startX;
    startX = null;
    if (Math.abs(dx) < 40) return;
    show(dx < 0 ? current + 1 : current - 1);
  });
})();
