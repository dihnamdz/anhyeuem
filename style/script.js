$(document).ready(function () {
    const envelope = $('#envelope');
    const resetBtn = $("#resetBtn");
    const passwordOverlay = $("#passwordOverlay");
    const passwordInput = $("#passwordInput");
    const submitPass = $("#submitPass");
    const passMessage = $("#passMessage");
    const audio = $("#sound")[0];
  
    let currentPage = 1;
    const totalPages = 31; // đúng với số page trong HTML
    let isOpen = false;
    let hasPlayed = false;
  
    const correctPassword = "emyeuanh"; // 👉 chỉnh mật khẩu ở đây
  
    // Khi bấm xác nhận mật khẩu
    submitPass.on("click", function () {
      const entered = passwordInput.val().trim();
      if (entered === correctPassword) {
        passMessage.text("");
        passwordOverlay.fadeOut(500); // ẩn hộp nhập mật khẩu
  
        // Mở thư & phát nhạc
        setTimeout(() => {
          envelope.removeClass("close").addClass("open");
          isOpen = true;
          playAudioOnce();
          resetBtn.show();
        }, 400);
      } else {
        passMessage.text("❌ Sai mật khẩu rồi, Phương Thuỳ hay ai đấyyy!");
        passwordInput.val("");
      }
    });
  
    // Khi click phong bì => chuyển trang tiếp theo
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
        passwordOverlay.fadeIn(300); // hiện lại hộp mật khẩu
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
  
    function playAudioOnce() {
      if (!hasPlayed) {
        audio.play().then(() => {
          hasPlayed = true;
        }).catch((e) => {
          console.log("Không thể phát nhạc:", e);
        });
      }
    }
  });
  
