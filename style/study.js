(() => {
  // Durations (seconds)
  const DUR = { pomodoro: 25 * 60, short: 5 * 60, long: 10 * 60 };

  // State
  let mode = 'pomodoro';
  let timeLeft = DUR.pomodoro;
  let isRunning = false;
  let pomoCount = 0;
  let countdown = null;

  // Elements
  const timerEl = document.getElementById('timer');
  const quoteEl = document.getElementById('quote');
  const pomoDisplay = document.getElementById('pomoCount');

  const overlay = document.getElementById('overlay');
  const overlayTitle = document.getElementById('overlayTitle');
  const overlayQuote = document.getElementById('overlayQuote');

  const startBtn = document.getElementById('startBtn');
  const resetBtn = document.getElementById('resetBtn');
  const skipBtn = document.getElementById('skipBtn');
  const nextBtn = document.getElementById('nextBtn');

  const btnPomodoro = document.getElementById('modePomodoro');
  const btnShort = document.getElementById('modeShort');
  const btnLong = document.getElementById('modeLong');

  const musicStudy = document.getElementById('musicStudy');
  const musicBreak = document.getElementById('musicBreak');

  // Quotes
  const pomodoroQuotes = [
    "Anh đang học cùng em đó, cố lên nha 💪",
    "Mỗi phút học là một bước gần hơn tới thành công! 💖",
    "Em học chăm ghê, xứng đáng nghỉ một chút 💕"
  ];
  const shortQuotes = [
    "💜 Nghỉ 5 phút nhẹ nhàng nha 🌸",
    "Uống nước nhé, anh pha trà cho em nè ☕",
    "Anh chờ em 5 phút thôi đó 😆"
  ];
  const longQuotes = [
    "💙 Nghỉ dài 10 phút nè, em xứng đáng!",
    "Thư giãn sâu, lấy lại năng lượng! 🌷",
    "Anh tự hào về em lắm, cô gái nhỏ kiên trì 💕"
  ];

  // Helpers
  const pad = n => n.toString().padStart(2, '0');
  function updateTimer() {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    const text = `${pad(m)}:${pad(s)}`;
    timerEl.textContent = text;
    document.title = `${text} • ${labelOf(mode)} ❤`;
  }
  function labelOf(m) {
    if (m === 'pomodoro') return 'Pomodoro';
    if (m === 'short') return 'Nghỉ ngắn';
    return 'Nghỉ dài';
  }
  function stopMusic() {
    musicStudy.pause();
    musicBreak.pause();
  }
  function playMusic(el) {
    const p = el.play();
    if (p && typeof p.catch === 'function') {
      p.catch(() => {
        document.body.addEventListener('click', () => el.play(), { once: true });
      });
    }
  }
  function setActiveTab(next) {
    const tabs = [btnPomodoro, btnShort, btnLong];
    tabs.forEach(btn => {
      const active = (btn === (
        next === 'pomodoro' ? btnPomodoro : next === 'short' ? btnShort : btnLong
      ));
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  // NEW: central pause helper to stop time and music
  function pause() {
    clearInterval(countdown);
    countdown = null;
    isRunning = false;
    stopMusic();
  }

  // Mode switch
  function setMode(newMode) {
    mode = newMode;
    // durations
    timeLeft = DUR[mode];
    // background + quote + music priming
    let q = '';
    if (mode === 'pomodoro') {
      document.body.style.background = 'var(--study-bg)';
      q = pomodoroQuotes[Math.floor(Math.random() * pomodoroQuotes.length)];
      musicBreak.pause();
    } else if (mode === 'short') {
      document.body.style.background = 'var(--break-bg)';
      q = shortQuotes[Math.floor(Math.random() * shortQuotes.length)];
      musicStudy.pause();
    } else {
      document.body.style.background = 'var(--long-bg)';
      q = longQuotes[Math.floor(Math.random() * longQuotes.length)];
      musicStudy.pause();
    }
    quoteEl.textContent = q;
    setActiveTab(mode);
    stopMusic();
    updateTimer();
  }

  // Controls
  function start() {
    if (isRunning) return;
    isRunning = true;

    // Music
    if (mode === 'pomodoro') playMusic(musicStudy);
    else playMusic(musicBreak);

    countdown = setInterval(() => {
      timeLeft -= 1;
      updateTimer();
      if (timeLeft <= 0) {
        clearInterval(countdown);
        countdown = null;
        isRunning = false;
        endSession();
      }
    }, 1000);
  }

  function playAlertSound() {
    const alertSound = document.getElementById('alertSound');
    if (alertSound) {
      alertSound.play().catch(() => {
        document.body.addEventListener('click', () => alertSound.play(), { once: true });
      });
    }
  }

  function endSession() {
    // Tạm dừng nhạc nền
    stopMusic();

    // Phát âm thanh báo hiệu
    playAlertSound();

    overlay.style.display = 'flex';

    if (mode === 'pomodoro') {
      pomoCount += 1;
      pomoDisplay.textContent = String(pomoCount);
      overlayTitle.textContent = "💖 Giỏi lắm, cô gái của anh 💕";
      overlayQuote.textContent = pomodoroQuotes[Math.floor(Math.random() * pomodoroQuotes.length)];
      // Sau mỗi 4 Pomodoro => nghỉ dài, nếu không thì nghỉ ngắn
      if (pomoCount % 4 === 0) setMode('long');
      else setMode('short');
    } else {
      overlayTitle.textContent = "💪 Hết giờ nghỉ rồi, mình học tiếp nhé 🌸";
      overlayQuote.textContent = shortQuotes[Math.floor(Math.random() * shortQuotes.length)];
      setMode('pomodoro');
    }
    updateTimer();
  }

  // Use pause() in reset for consistency
  function resetAll() {
    pause();
    pomoCount = 0;
    pomoDisplay.textContent = '0';
    setMode('pomodoro');
    quoteEl.textContent = "Nhấn “Bắt đầu học” để cùng anh học nhé 🌸";
    overlay.style.display = 'none';
  }

  // Use pause() then show overlay logic
  function skip() {
    pause();
    endSession();
  }

  // Events: pause when switching modes so time only runs after Start
  btnPomodoro.addEventListener('click', () => { pause(); setMode('pomodoro'); });
  btnShort.addEventListener('click', () => { pause(); setMode('short'); });
  btnLong.addEventListener('click', () => { pause(); setMode('long'); });

  startBtn.addEventListener('click', start);
  resetBtn.addEventListener('click', resetAll);
  skipBtn.addEventListener('click', skip);
  nextBtn.addEventListener('click', () => {
    overlay.style.display = 'none';
    if (mode === 'pomodoro') playMusic(musicStudy);
    else playMusic(musicBreak);
    start();
  });

  // Init
  setMode('pomodoro');
  updateTimer();

  // Floating hearts remain driven by CSS + inline generator already in HTML
})();
