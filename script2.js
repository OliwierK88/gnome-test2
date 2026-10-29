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