$(document).ready(function () {
    const envelope = $('#envelope');
    const resetBtn = $("#resetBtn");
    const passwordOverlay = $("#passwordOverlay");
    const passwordInput = $("#passwordInput");
    const submitPass = $("#submitPass");
    const passMessage = $("#passMessage");
    const audio = $("#sound")[0];
  
    let currentPage = 1;
    const totalPages = 31;
    let isOpen = false;
    let hasPlayed = false;
  
    const correctPassword = "emyeuanh"; // 🔐 Mật khẩu
  
    // 🎶 Danh sách bài nhạc
    const playlist = [
        "1.mp3",
      "./style/IxkUNOlUqqWjHD9b.mp3",
      "2.mp3",
      "3.mp3",
      "4.mp3"
    ];
    let currentTrack = 0;
  
    // Khi bấm xác nhận mật khẩu
    submitPass.on("click", function () {
      const entered = passwordInput.val().trim();
      if (entered === correctPassword) {
        passMessage.text("");
        passwordOverlay.fadeOut(500);
        setTimeout(() => {
          envelope.removeClass("close").addClass("open");
          isOpen = true;
          playAudioOnce();
          resetBtn.show();
        }, 400);
      } else {
        passMessage.text("❌ Sai mật khẩu rồi, có phải Phương Thuỳ không mà đòi xemmm!");
        passwordInput.val("");
      }
    });
  
    // Khi click phong bì => lật trang tiếp
    envelope.on("click", function () {
      if (isOpen) nextLyric();
    });
  
    // Nút đóng thư
    resetBtn.on("click", function () {
      envelope.removeClass("open").addClass("close");
      isOpen = false;
      setTimeout(function () {
        currentPage = 1;
        updateActivePage();
        resetBtn.hide();
        passwordOverlay.fadeIn(300);
        stopAudio();
      }, 600);
    });
  
    function nextLyric() {
      currentPage = currentPage < totalPages ? currentPage + 1 : 1;
      updateActivePage();
    }
  
    function updateActivePage() {
      $(".lyric-page").removeClass("active");
      $("#page" + currentPage).addClass("active");
    }
  
    // 🎧 Phát nhạc & tự động chuyển bài
    function playAudioOnce() {
      if (!hasPlayed) {
        playTrack(currentTrack);
        hasPlayed = true;
      }
    }
  
    function playTrack(index) {
      audio.src = playlist[index];
      audio.play().catch((e) => console.log("Không thể phát nhạc:", e));
  
      // Khi bài hiện tại kết thúc => phát bài tiếp theo
      audio.onended = function () {
        currentTrack = (currentTrack + 1) % playlist.length;
        playTrack(currentTrack);
      };
    }
  
    function stopAudio() {
      audio.pause();
      audio.currentTime = 0;
      hasPlayed = false;
      currentTrack = 0;
    }
  });
  


