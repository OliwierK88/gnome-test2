(function () {
  // Elementy strony używane przez skrypt
  var light = document.querySelector('.flashlight');          // ciemna nakładka
  var toggle = document.querySelector('.flashlight-toggle');  // przycisk włącz/wyłącz
  var trailer = document.querySelector('.trailer');           // ramka z filmem
  var shield = document.querySelector('.trailer-shield');     // osłona na iframe

  // Bez nakładki i przycisku skrypt nie ma nic do roboty
  if (!light || !toggle) return;

  // Przesuwa środek kręgu światła w podane miejsce (zmienne CSS --x i --y)
  function move(x, y) {
    light.style.setProperty('--x', x + 'px');
    light.style.setProperty('--y', y + 'px');
  }

  // Iframe z YouTube przejmuje zdarzenia myszy, więc nad filmem strona nie widzi
  // ruchu kursora. Dlatego na trailerze leży osłona, która go śledzi.
  // Po kliknięciu osłona znika (żeby film dostał kliknięcie), a światło się
  // zapala. Gdy wskaźnik wyjdzie poza trailer, latarka wraca (ta funkcja).
  
  function resume(target) {
	  
    if (!shield || !shield.classList.contains('hidden')) return;	// Nic do robienia, jeśli osłona jest na swoim miejscu

    if (trailer && trailer.contains(target)) return;
    shield.classList.remove('hidden');
    light.classList.remove('watching');
  }

  if (shield) {	// Kliknięcie w trailer: zdejmij osłonę i rozjaśnij stronę na czas oglądania
    shield.addEventListener('click', function () {
      shield.classList.add('hidden');
      light.classList.add('watching');
    });
  }

  document.addEventListener('mousemove', function (e) {   // Przesuwanie światła za kursorem
    resume(e.target);
    move(e.clientX, e.clientY);
  });

  // Ekran dotykowy
  function onTouch(e) {
    var t = e.touches[0];
    if (!t) return;
    resume(e.target);
    move(t.clientX, t.clientY);
  }
  document.addEventListener('touchstart', onTouch, { passive: true });
  document.addEventListener('touchmove', onTouch, { passive: true });

  toggle.addEventListener('click', function () {
    var off = light.classList.toggle('off');
    toggle.textContent = off ? 'Flashlight: off' : 'Flashlight: on';
  });
})();

// Karuzela screenshotów: strzałki, kropki i przewijanie palcem/myszą
(function () {
  var track = document.querySelector('.shots');
  var prev = document.querySelector('.carousel-btn.prev');
  var next = document.querySelector('.carousel-btn.next');
  var dotsBox = document.querySelector('.carousel-dots');
  if (!track || !prev || !next || !dotsBox) return;

  var slides = track.children;
  var dots = [];

  // Przewija do slajdu o podanym numerze (zapętla się na końcach).
  // Płynnie tylko do sąsiedniego slajdu; dalsze skoki (zawinięcie, kropki) są natychmiastowe,
  // żeby nie było widać przelatywania przez wszystkie slajdy po drodze.
  function go(i) {
    var from = current();
    var n = (i + slides.length) % slides.length;
    var near = Math.abs(n - from) === 1;
    track.scrollTo({ left: n * track.clientWidth, behavior: near ? 'smooth' : 'instant' });
  }

  function current() {
    return Math.round(track.scrollLeft / track.clientWidth);
  }

  for (var i = 0; i < slides.length; i++) {
    (function (n) {
      var d = document.createElement('button');
      d.type = 'button';
      d.title = String(n + 1);
      d.addEventListener('click', function () { go(n); });
      dotsBox.appendChild(d);
      dots.push(d);
    })(i);
  }

  function update() {
    var c = current();
    for (var j = 0; j < dots.length; j++) dots[j].classList.toggle('active', j === c);
  }

  prev.addEventListener('click', function () { go(current() - 1); });
  next.addEventListener('click', function () { go(current() + 1); });
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', function () { track.scrollLeft = current() * track.clientWidth; });
  update();
})();
