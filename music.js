// Một số bài hát có thể bị lỗi do liên kết bị hỏng. Vui lòng thay thế liên kết khác để có thể phát
// Some songs may be faulty due to broken links. Please replace another link so that it can be played

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PlAYER_STORAGE_KEY = "F8_PLAYER";

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const repeatIcon = repeatBtn.querySelector("i"); // Lấy icon bên trong
const playlist = $(".playlist");
const progressBar = $(".progress-bar"); 
const currentTimeEl = $("#current-time"); 
const durationEl = $("#duration");
const volumeIcon = $(".volume-icon");
const volumeSlider = $("#volume");


const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: {},
  // (1/2) Uncomment the line below to use localStorage
  // config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Lần cuối",
      singer: "Ngọt",
      path: "song/lần-cuối-đi-bên-em-xót-xa-người-ơi.mp3",
      image: "https://i1.sndcdn.com/artworks-000605743393-0030j2-t500x500.jpg"
    },
    {
      name: "Nhất bái thiên địa",
      singer: "The Flob, Chin",
      path: "song/nhất-bái-thiên-địa.mp3",
      image:
        "https://photo-resize-zmp3.zadn.vn/w600_r1x1_jpeg/cover/b/4/a/4/b4a4cfdb468a4d095f6fb503d8534cd5.jpg"
    },
    {
      name: "Day 1",
      singer: "Red Velvet",
      path:"song/Day 1.mp3",
      image: "https://t2.genius.com/unsafe/425x425/https%3A%2F%2Fimages.genius.com%2F58ce9b4ef403e95fc90478a7a01ce2c9.243x243x1.jpg"
    },
    {
      name: "Black",
      singer: "G-Dragon, ft. Jennie",
      path: "song/black.mp3",
      image:
        "https://images.genius.com/c7e56c922dc553bebcc4c3c3881e6eed.554x554x1.jpg"
    },
    {
      name: "あの夢をなぞって",
      singer: "Yoasobi",
      path: "song/tracing a dream.mp3",
      image:
        "https://upload.wikimedia.org/wikipedia/en/2/2d/Ano_Yume_o_Nazotte_cover_art.jpg"
    },
    {
      name: "Ghost in a flower",
      singer: "Yorushika",
      path:"song/ghost in a flower.mp3",
      image:
        "https://upload.wikimedia.org/wikipedia/en/9/9a/Yorushika_-_Ghost_in_a_Flower.png"
    },
    {
      name: "Bohemian Rhapsody",
      singer: "Queen",
      path: "song/Bohemian Rhapsody.mp3",
      image:
        "https://powerpop.blog/wp-content/uploads/2020/08/queen-bohemian-rhapsody.jpg?w=500"
    },
    {
        name: "Back to December",
        singer: "Taylor Swift",
        path: "song/Back To December - Taylor Swift(Audio).mp3",
        image:
          "https://redcat.ca/cdn/shop/products/NzctNTY1Mi5qcGVn.jpg?v=1691105054"
      }
  ],
  setConfig: function (key, value) {
    this.config[key] = value;
    // (2/2) Uncomment the line below to use localStorage
    // localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
            <div class="song ${
                index === this.currentIndex ? "active" : ""
                }" data-index="${index}">
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                            <i class="fas fa-ellipsis-h"></i>
                    </div>
            </div>
                    `;
    });
    playlist.innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      }
    });
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // Xử lý CD quay / dừng
    // Handle CD spins / stops
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000, // 10 seconds
      iterations: Infinity
    });
    cdThumbAnimate.pause();

    // Xử lý phóng to / thu nhỏ CD
    // Handles CD enlargement / reduction
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0; // khi lỡ kéo nhanh quá thì nó không về 0 hẳn mà sẽ bị lag nên phải làm thế
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // Xử lý khi click play
    // Handle when click play
    playBtn.onclick = function () {
        if (app.isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
    };

    // Khi song được play
    // When the song is played
    audio.onplay = function () {
      app.isPlaying = true;
      playBtn.classList.add("playing");
      cdThumbAnimate.play();
    };

    // Khi song bị pause
    // When the song is pause
    audio.onpause = function () {
      app.isPlaying = false;
      playBtn.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    // Khi tiến độ bài hát thay đổi
    // When the song progress changes
    // audio.ontimeupdate = function () {
    //   if (audio.duration) {
    //     const progressPercent = Math.floor(
    //       (audio.currentTime / audio.duration) * 100
    //     );
    //     progress.value = progressPercent;
    //   }
    // };

    // Xử lý khi tua song
    // Handling when seek
    progress.oninput = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    // Khi next song
    // When next song
    nextBtn.onclick = function () {
        if (_this.isRepeat) {
            // Nếu repeat bật, phát lại bài hát hiện tại
            audio.currentTime = 0;
            audio.play();
        } else if (_this.isRandom) {
            // Nếu shuffle bật, chọn bài hát ngẫu nhiên
            _this.playRandomSong();
        } else {
            // Chế độ bình thường
            _this.nextSong();
        }
        audio.play();
        _this.render();
        _this.scrollToActiveSong();
    };

    // Khi prev song
    // When prev song
    prevBtn.onclick = function () {
        if (_this.isRepeat) {
            // Nếu repeat bật, phát lại bài hát hiện tại
            audio.currentTime = 0;
            audio.play();
        } else if (_this.isRandom) {
            // Nếu shuffle bật, chọn bài hát ngẫu nhiên
            _this.playRandomSong();
        } else {
            // Chế độ bình thường
            _this.prevSong();
        }
        audio.play();
        _this.render();
        _this.scrollToActiveSong();
    };

    // Xử lý bật / tắt random song
    // Handling on / off random song
    randomBtn.onclick = function () {
        // _this.isRandom = !_this.isRandom;
        // _this.setConfig("isRandom", _this.isRandom);
        // randomBtn.classList.toggle("active", _this.isRandom);

        if (!_this.isRandom) {
            _this.playRandomSong(); // Chuyển ngay đến bài hát ngẫu nhiên
            audio.play();
        }
    };

    // Xử lý lặp lại một song
    // Single-parallel repeat processing
    repeatBtn.onclick = function () {
        _this.isRepeat = !_this.isRepeat;
        _this.setConfig("isRepeat", _this.isRepeat);
        repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    // next song when ended
    audio.onended = function() {
        if (_this.isRepeat) {
            audio.currentTime = 0;
            audio.play();
        } else if (_this.isRandom) {
            _this.playRandomSong();
            audio.play();
        } else {
            nextBtn.click();
        }
    }

    audio.addEventListener("timeupdate", function () {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progress.value = progressPercent;
        progress.style.background = `linear-gradient(to right, #1ef230 ${progressPercent}%, #d3c9c9 ${progressPercent}%)`;
    });

    // Lắng nghe hành vi click vào playlist
    // Listen to playlist clicks
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");

      if (songNode || e.target.closest(".option")) {
        // Xử lý khi click vào song
        // Handle when clicking on the song
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }

        // Xử lý khi click vào song option
        // Handle when clicking on the song option
        if (e.target.closest(".option")) {
        }
      }
    };

    // Khi bài hát đang chạy
    audio.ontimeupdate = function () {
        if (audio.duration) {
            // Cập nhật thanh tiến trình
            const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
            progress.value = progressPercent;
            currentTimeEl.textContent = formatTime(audio.currentTime);
            durationEl.textContent = formatTime(audio.duration);
            // Cập nhật thời gian hiện tại
            currentTimeEl.textContent = formatTime(audio.currentTime);
        }
    };

    // Khi bài hát được tải, cập nhật thời gian tổng
    audio.onloadedmetadata = function () {
        durationEl.textContent = formatTime(audio.duration);
    };

    // Chuyển đổi giây thành định dạng mm:ss
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Điều chỉnh âm lượng
    const volumeIcon = document.querySelector(".volume-icon");
    const volumeSlider = document.querySelector("#volume");

    // Cập nhật thời gian bài hát
    // audio.ontimeupdate = function () {
    //     if (audio.duration) {
    //         const progressPercent = (audio.currentTime / audio.duration) * 100;
    //         progress.value = progressPercent;
    //         currentTimeEl.textContent = formatTime(audio.currentTime);
    //         durationEl.textContent = formatTime(audio.duration);
    //     }
    // };

    // Cập nhật khi tua bài hát
    audio.addEventListener("timeupdate", function () {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progress.value = progressPercent;
        progress.style.background = `linear-gradient(to right, #1ef230 ${progressPercent}%, #d3c9c9 ${progressPercent}%)`;
        localStorage.setItem("progress", progressPercent); // Lưu lại tiến trình
    });

    // Cập nhật âm lượng khi kéo thanh
    volumeSlider.oninput = function () {
        const volume = volumeSlider.value / 100;
        audio.volume = volume;
        updateVolumeIcon(volume);
    };

    // Bấm vào icon loa để bật/tắt âm thanh
    volumeIcon.onclick = function () {
        if (audio.volume > 0) {
            audio.volume = 0;
            volumeSlider.value = 0;
        } else {
            audio.volume = 1;
            volumeSlider.value = 100;
        }
        updateVolumeIcon(audio.volume);
    };

    // Hàm đổi biểu tượng loa theo âm lượng
    function updateVolumeIcon(volume) {
        if (volume === 0) {
            volumeIcon.className = "fas fa-volume-mute volume-icon";
        } else if (volume < 0.5) {
            volumeIcon.className = "fas fa-volume-down volume-icon";
        } else {
            volumeIcon.className = "fas fa-volume-up volume-icon";
        }
    };

    // Hàm định dạng thời gian mm:ss
    function formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };
    
  },
  playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex); // Đảm bảo không phát lại bài hát hiện tại

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    
  scrollToActiveSong: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }, 300);
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);

    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start: function () {
    // Gán cấu hình từ config vào ứng dụng
    // Assign configuration from config to application
    this.loadConfig();

    // Định nghĩa các thuộc tính cho object
    // Defines properties for the object
    this.defineProperties();

    // Lắng nghe / xử lý các sự kiện (DOM events)
    // Listening / handling events (DOM events)
    this.handleEvents();

    // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    // Load the first song information into the UI when running the app
    this.loadCurrentSong();

    // Render playlist
    this.render();

    // Hiển thị trạng thái ban đầu của button repeat & random
    // Display the initial state of the repeat & random button
    randomBtn.classList.toggle("active", this.isRandom);
    // repeatBtn.classList.toggle("active", this.isRepeat);
    document.addEventListener("DOMContentLoaded", function () {
        const isRepeat = JSON.parse(localStorage.getItem("isRepeat")) || false;
        app.isRepeat = isRepeat; // Cập nhật trạng thái trong app
        repeatBtn.classList.toggle("active", app.isRepeat); // Chỉ đổi màu nếu repeat bật

        const savedProgress = localStorage.getItem("progress");
        
        if (savedProgress) {
            audio.addEventListener("loadedmetadata", function () {
                const seekTime = (savedProgress / 100) * audio.duration;
                audio.currentTime = seekTime; // Đặt lại vị trí phát nhạc
                progress.value = savedProgress; // Cập nhật thanh progress
            });
        }
    });
  }
};

app.start();