window.addEventListener('DOMContentLoaded', function () {
  var doc = document;
  var flower = doc.querySelector('.flower');
  var startBtn = doc.getElementById('start-btn');
  var container = doc.getElementById('start-btn-container');
  var wrapper = doc.querySelector('.wrapper');
  var msg = doc.querySelector('.flower-message');
  var galaxyCanvas = doc.getElementById('galaxy-canvas');
  var music = doc.getElementById('bg-music');
  var photoBox = doc.getElementById('photo-box');
  var lovePhoto = doc.getElementById('love-photo');

  // =========================================================
  // 1) TEXTO DE LA DEDICATORIA
  // =========================================================
  const messages = [
    'Esta flor es para ti, mi conejita 💛',
    'Quiero recordarte lo mucho que significas para mí.',
    'Gracias por todo lo que haces por mí.',
    'Gracias por cada momento, cada sonrisa y cada detalle.',
    'Contigo mis días son mucho más bonitos.',
    'Te amo muchísimo, mi conejita ❤️',
    'Eres una persona muy especial en mi vida.',
    'Quiero seguir creando recuerdos bonitos contigo.',
    'Porque para mí, tú eres mi mundo. 💛',
    '¡Feliz 21 de septiembre, mi conejita! 🌻',
    'Te amo hoy, mañana y siempre. ❤️'
  ];

  // =========================================================
  // 2) FOTOS
  // Pon tus imágenes en la misma carpeta con estos nombres.
  // Puedes agregar o quitar nombres.
  // =========================================================
  const photos = [
    'foto1.jpg.jpeg',
    'foto2.jpg.jpeg',
    'foto3.jpg.jpeg',
    'foto4.jpg.jpeg'
  ];

  // =========================================================
  // 3) CREAR LA FLOR 3D AMARILLA
  // =========================================================
  var maxParts = 20;
  var maxPetals = 6;
  var partsFontStep = 25 / maxParts;

  function createFlower() {
    var angle = 360 / maxPetals;

    for (var i = 0; i < maxPetals; i++) {
      var petal = createPetal();
      var currAngle = angle * i + 'deg';
      var transform =
        'transform: rotateY(' +
        currAngle +
        ') rotateX(-30deg) translateZ(9vmin)';

      petal.setAttribute('style', transform);
      flower.appendChild(petal);
    }
  }

  function createPetal() {
    var box = createBox(null, 0);
    var petal = doc.createElement('div');
    petal.classList.add('petal');

    for (var i = 1; i <= maxParts; i++) {
      box = createBox(box, i);
    }

    petal.appendChild(box);
    return petal;
  }

  function createBox(box, pos) {
    var fontSize = partsFontStep * (maxParts - pos) + 'vmin';
    var half = maxParts / 2;
    var bright = 58;

    if (pos < half + 1) {
      fontSize = partsFontStep * pos + 'vmin';
    } else {
      bright = 34 + (28 / half) * (maxParts - pos);
    }

    // Amarillo cálido / dorado
    var baseHue = 48;
    var hueVariation = 9;
    var saturation = 94;
    var hue = baseHue + hueVariation * pos / maxParts;

    var color =
      'hsl(' + hue + ', ' + saturation + '%, ' + bright + '%)';

    var newShape = doc.createElement('div');
    newShape.classList.add('shape');

    var newBox = doc.createElement('div');
    newBox.classList.add('box');
    newBox.setAttribute(
      'style',
      'color:' + color + ';font-size:' + fontSize
    );

    if (box) newBox.appendChild(box);
    newBox.appendChild(newShape);

    return newBox;
  }

  createFlower();

  // =========================================================
  // 4) BOTÓN INICIAL CON EFECTO DE ESCRITURA
  // =========================================================
  var btnText = 'Presióname';
  startBtn.textContent = '';
  startBtn.disabled = true;

  var btnIndex = 0;

  function typeBtn() {
    if (btnIndex < btnText.length) {
      startBtn.textContent += btnText.charAt(btnIndex);
      btnIndex++;
      setTimeout(typeBtn, 90);
    } else {
      startBtn.disabled = false;
    }
  }

  typeBtn();

  // =========================================================
  // 5) GALAXIA / ESTRELLAS AMARILLAS
  // =========================================================
  var galaxyStarted = false;
  var dots = [];

  function startGalaxy() {
    if (galaxyStarted) return;
    galaxyStarted = true;

    var ctx = galaxyCanvas.getContext('2d');

    function resizeCanvas() {
      galaxyCanvas.width = window.innerWidth;
      galaxyCanvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    var isMobile = window.innerWidth <= 600;
    var numDots = isMobile ? 34 : 85;
    var minDotSize = isMobile ? 0.6 : 0.7;
    var maxDotSize = isMobile ? 1.35 : 1.8;

    for (var i = 0; i < numDots; i++) {
      dots.push({
        x: Math.random() * galaxyCanvas.width,
        y: Math.random() * galaxyCanvas.height,
        r: minDotSize + Math.random() * (maxDotSize - minDotSize),
        dx: (Math.random() - 0.5) * 0.35,
        dy: (Math.random() - 0.5) * 0.35,
        alpha: 0.45 + Math.random() * 0.5
      });
    }

    var audioCtx = null;
    var analyser = null;
    var dataArray = null;

    try {
      var AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

      if (AudioContextClass && music) {
        audioCtx = new AudioContextClass();
        var source = audioCtx.createMediaElementSource(music);

        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;

        source.connect(analyser);
        analyser.connect(audioCtx.destination);

        dataArray = new Uint8Array(analyser.frequencyBinCount);
      }
    } catch (e) {
      // Si el navegador no permite el analizador, la música igual continúa.
      analyser = null;
      dataArray = null;
    }

    function animateGalaxy() {
      ctx.clearRect(0, 0, galaxyCanvas.width, galaxyCanvas.height);

      var speedFactor = 1;

      if (analyser && dataArray) {
        analyser.getByteFrequencyData(dataArray);

        var sum = 0;
        for (var j = 0; j < dataArray.length; j++) {
          sum += dataArray[j];
        }

        var avg = sum / dataArray.length;
        speedFactor = 0.65 + (avg / 255) * 1.8;
      }

      for (var k = 0; k < dots.length; k++) {
        var dot = dots[k];

        ctx.save();
        ctx.globalAlpha = dot.alpha;
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 222, 92, 0.95)';
        ctx.shadowColor = 'rgba(255, 218, 70, 0.7)';
        ctx.shadowBlur = 3;
        ctx.fill();
        ctx.restore();

        dot.x += dot.dx * speedFactor;
        dot.y += dot.dy * speedFactor;

        if (dot.x < 0) dot.x = galaxyCanvas.width;
        if (dot.x > galaxyCanvas.width) dot.x = 0;
        if (dot.y < 0) dot.y = galaxyCanvas.height;
        if (dot.y > galaxyCanvas.height) dot.y = 0;
      }

      requestAnimationFrame(animateGalaxy);
    }

    animateGalaxy();

    setTimeout(function () {
      galaxyCanvas.style.opacity = '1';
    }, 80);
  }

  // =========================================================
  // 6) CAMBIO AUTOMÁTICO DE FOTOS
  // =========================================================
  var photoIndex = 0;
  var photoTimer = null;

  function startPhotos() {
    if (!photos.length) {
      photoBox.style.display = 'none';
      return;
    }

    lovePhoto.src = photos[0];

    // Si una foto no existe, simplemente no rompe toda la página.
    lovePhoto.onerror = function () {
      this.style.opacity = '0.25';
    };

    lovePhoto.onload = function () {
      this.style.opacity = '1';
    };

    setTimeout(function () {
      photoBox.classList.add('show');
    }, 2200);

    photoTimer = setInterval(function () {
      lovePhoto.style.opacity = '0';
      lovePhoto.style.transform = 'scale(0.965)';

      setTimeout(function () {
        photoIndex = (photoIndex + 1) % photos.length;
        lovePhoto.src = photos[photoIndex];

        lovePhoto.style.opacity = '1';
        lovePhoto.style.transform = 'scale(1)';
      }, 850);
    }, 7000);
  }

  // =========================================================
  // 7) TEXTO SIN SALIRSE DE LA PANTALLA
  //    Y DISTRIBUIDO DURANTE TODA LA CANCIÓN
  // =========================================================
  var textRunId = 0;

  function typeText(text, speed, done) {
    msg.classList.remove('show');
    msg.textContent = '';

    setTimeout(function () {
      msg.classList.add('show');

      var i = 0;

      function type() {
        if (i < text.length) {
          msg.textContent += text.charAt(i);
          i++;
          setTimeout(type, speed);
        } else if (done) {
          done();
        }
      }

      type();
    }, 250);
  }

  function startMessagesForSong() {
    textRunId++;
    var runId = textRunId;

    // Duración real de la canción.
    // Si el navegador todavía no la conoce, usa 180 s como respaldo.
    var duration =
      Number.isFinite(music.duration) && music.duration > 1
        ? music.duration
        : 180;

    // Dejamos un pequeño margen inicial y final.
    var usableDuration = Math.max(60, duration - 4);

    // Un "espacio" de tiempo para cada mensaje.
    var slotMs = (usableDuration * 1000) / messages.length;

    var current = 0;

    function showNext() {
      if (runId !== textRunId) return;

      if (current >= messages.length) {
        // El último texto queda visible hasta que termine la música.
        return;
      }

      var text = messages[current];

      // Escritura suave. En textos largos acelera un poco.
      var typingSpeed = text.length > 55 ? 42 : 52;
      var estimatedTypingMs = text.length * typingSpeed;

      typeText(text, typingSpeed, function () {
        current++;

        if (current >= messages.length) {
          return;
        }

        // Espera lo necesario para repartir todos los mensajes
        // a lo largo de TODA la canción.
        var waitMs = Math.max(
          1800,
          slotMs - estimatedTypingMs - 350
        );

        setTimeout(showNext, waitMs);
      });
    }

    showNext();
  }

  // =========================================================
  // 8) INICIAR TODO AL HACER CLIC
  // =========================================================
  var started = false;

  startBtn.addEventListener('click', function () {
    if (started) return;
    started = true;

    container.style.display = 'none';
    wrapper.style.display = 'block';

    startGalaxy();
    startPhotos();

    music.currentTime = 0;
    music.loop = false;
    music.volume = 1;

    var playPromise = music.play();

    function beginTextWhenReady() {
      if (
        Number.isFinite(music.duration) &&
        music.duration > 1
      ) {
        startMessagesForSong();
      } else {
        music.addEventListener(
          'loadedmetadata',
          startMessagesForSong,
          { once: true }
        );

        // Respaldo por si el navegador tarda demasiado.
        setTimeout(function () {
          if (!msg.textContent) {
            startMessagesForSong();
          }
        }, 1500);
      }
    }

    if (playPromise !== undefined) {
      playPromise
        .then(beginTextWhenReady)
        .catch(function () {
          started = false;
          container.style.display = 'block';
          wrapper.style.display = 'none';

          alert(
            'No se pudo iniciar la música. Verifica que el archivo se llame "musica.mp3" y vuelve a presionar.'
          );
        });
    } else {
      beginTextWhenReady();
    }
  });

  // La canción NO se corta.
  // Al terminar, dejamos visible el último mensaje y la última foto.
  music.addEventListener('ended', function () {
    if (photoTimer) {
      clearInterval(photoTimer);
    }

    msg.textContent =
      '¡Feliz 21 de septiembre, mi conejita! 🌻💛 Te amo hoy, mañana y siempre. ❤️';
    msg.classList.add('show');
  });
});
