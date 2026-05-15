const myVideo = document.querySelector("#my-video");
const bgAudio = document.querySelector("#bg-audio");
const msg = document.querySelector("#msg");

myVideo.loop = true;
myVideo.muted = true;
bgAudio.volume = 0.25;

// ----------------------------------------------------------------------
// Play / pause logic
const playPauseButton = document.querySelector("#play-pause-button");
const playPauseImg = document.querySelector("#play-pause-img");

playPauseButton.addEventListener("click", toggleVideo);

function toggleVideo() {
  if (myVideo.paused || myVideo.ended) {
    myVideo.play();

    if (bgAudio.src) {
      bgAudio.play();
    }

    playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/pause--v2.png";
    msg.innerHTML = "Playing ambient focus video";
  } else {
    myVideo.pause();
    bgAudio.pause();

    playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/play--v2.png";
    msg.innerHTML = "Paused";
  }
}

// ----------------------------------------------------------------------
// Mute / unmute logic
// This controls both the background mp3 and any original video sound.
const muteUnmuteButton = document.querySelector("#mute-unmute-button");
const muteUnmuteImg = document.querySelector("#mute-unmute-img");

muteUnmuteButton.addEventListener("click", toggleSound);

function toggleSound() {
  const shouldMute = !bgAudio.muted;

  bgAudio.muted = shouldMute;
  myVideo.muted = shouldMute;

  if (shouldMute) {
    muteUnmuteImg.src = "https://img.icons8.com/ios-glyphs/30/no-audio--v1.png";
    msg.innerHTML = "Sound muted";
  } else {
    muteUnmuteImg.src =
      "https://img.icons8.com/ios-glyphs/30/high-volume--v2.png";
    msg.innerHTML = "Sound on";
  }
}

// ----------------------------------------------------------------------
// Fast forward
const fastForwardButton = document.querySelector("#fast-forward-button");

fastForwardButton.addEventListener("click", fastForward);

function fastForward() {
  myVideo.currentTime = myVideo.currentTime + 10;
  msg.innerHTML = "Skipped forward 10 seconds";
}

// ----------------------------------------------------------------------
// Chapter buttons
const step1Button = document.querySelector("#step1-button");
const step2Button = document.querySelector("#step2-button");

step1Button.addEventListener("click", function () {
  myVideo.currentTime = 5;
  msg.innerHTML = "Jumped to focus point 1";
});

step2Button.addEventListener("click", function () {
  myVideo.currentTime = 10;
  msg.innerHTML = "Jumped to focus point 2";
});

// ----------------------------------------------------------------------
// Likes logic
const heartButton = document.querySelector("#heart-button");
const heartSymbol = document.querySelector("#heart-symbol");
const likes = document.querySelector("#likes");

let likesCount = 0;

heartButton.addEventListener("click", showLikes);

function showLikes() {
  likesCount++;
  likes.textContent = likesCount;
  heartSymbol.textContent = "♥";

  heartButton.classList.remove("liked");
  void heartButton.offsetWidth;
  heartButton.classList.add("liked");

  msg.innerHTML = "Saved calm moment " + likesCount;
}

// ----------------------------------------------------------------------
// Fullscreen
const fullscreenButton = document.querySelector("#fullscreen-button");

fullscreenButton.addEventListener("click", goFullscreen);
myVideo.addEventListener("dblclick", goFullscreen);

function goFullscreen() {
  if (!document.fullscreenElement) {
    myVideo.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

// ----------------------------------------------------------------------
// Progress bar
const progressBar = document.querySelector("#progress-bar");
const progressBarContainer = document.querySelector("#progress-bar-container");

myVideo.addEventListener("timeupdate", updateProgress);
progressBarContainer.addEventListener("click", seekVideo);

function updateProgress() {
  if (myVideo.duration) {
    const progress = Math.floor((myVideo.currentTime / myVideo.duration) * 100);
    progressBar.style.width = progress + "%";
  }
}

function seekVideo(event) {
  if (myVideo.duration) {
    const barWidth = progressBarContainer.clientWidth;
    const clickPosition = event.offsetX;
    myVideo.currentTime = (clickPosition / barWidth) * myVideo.duration;
    msg.innerHTML = "Video position updated";
  }
}
/*
AI tools including ChatGPT were used to assist
with debugging JavaScript logic, improving media
playback behaviour, and refining interaction design.

All final code decisions, styling choices,
and feature implementations were customised
and edited by the student.
*/

/*
Different video modes were designed to create
different emotional atmospheres for studying
and relaxation.

Each video has its own ambient soundtrack
to improve immersion and create a stronger
connection between visual and audio feedback.

The looping playback behaviour was intentionally
added so the experience feels continuous and
non-disruptive during long focus sessions.
*/

// ----------------------------------------------------------------------
// Playlist
const videoList = [
  {
    id: 1,
    src: "cosmic-drift.mp4",
    audio: "cosmic-ambience.mp3",
    name: "Cosmic Drift",
  },
  {
    id: 2,
    src: "rain-window.mp4",
    audio: "rain-ambience.mp3",
    name: "Rain Window",
  },
  {
    id: 3,
    src: "https://thelongesthumstore.sgp1.cdn.digitaloceanspaces.com/IM-2250/miac.mp4",
    audio: "",
    name: "Music Video",
  },
];

const stardustButton = document.querySelector("#stardust-vid-button");
const zenscapeButton = document.querySelector("#zenscape-vid-button");
const musicvideoButton = document.querySelector("#musicvideo-vid-button");
const playlistButtons = document.querySelectorAll(".playlist button");

playlistButtons[0].classList.add("active-video");

stardustButton.addEventListener("click", function () {
  chooseVideo(0);
});

zenscapeButton.addEventListener("click", function () {
  chooseVideo(1);
});

musicvideoButton.addEventListener("click", function () {
  chooseVideo(2);
});

function chooseVideo(id) {
  const selectedVideo = videoList[id];

  myVideo.src = selectedVideo.src;
  myVideo.loop = true;
  myVideo.load();

  bgAudio.pause();

  if (selectedVideo.audio) {
    bgAudio.src = selectedVideo.audio;
    bgAudio.volume = 0.25;
    bgAudio.loop = true;
  } else {
    bgAudio.removeAttribute("src");
    bgAudio.load();
  }

  myVideo.play();

  if (selectedVideo.audio) {
    bgAudio.play();
    myVideo.muted = true;
  } else {
    myVideo.muted = bgAudio.muted;
  }

  playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/pause--v2.png";
  progressBar.style.width = "0%";
  msg.innerHTML = "Now playing: " + selectedVideo.name;

  playlistButtons.forEach(function (button) {
    button.classList.remove("active-video");
  });

  playlistButtons[id].classList.add("active-video");
}

// ----------------------------------------------------------------------
// Focus mode and timer
const focusModeButton = document.querySelector("#focus-mode-button");
const focusTimer = document.querySelector("#focus-timer");

let focusModeActive = false;
let focusTimeLeft = 25 * 60;
let focusInterval = null;

focusModeButton.addEventListener("click", toggleFocusMode);

function toggleFocusMode() {
  focusModeActive = !focusModeActive;
  document.body.classList.toggle("focus-mode");

  if (focusModeActive) {
    focusModeButton.textContent = "Exit Focus Mode";
    msg.innerHTML = "Focus mode started";
    startFocusTimer();

    if (myVideo.paused) {
      myVideo.play();

      if (bgAudio.src) {
        bgAudio.play();
      }

      playPauseImg.src = "https://img.icons8.com/ios-glyphs/30/pause--v2.png";
    }
  } else {
    focusModeButton.textContent = "Focus Mode";
    msg.innerHTML = "Focus mode ended";
    stopFocusTimer();
  }
}

function startFocusTimer() {
  if (focusInterval !== null) {
    return;
  }

  focusInterval = setInterval(function () {
    focusTimeLeft--;
    updateFocusTimerDisplay();

    if (focusTimeLeft <= 0) {
      stopFocusTimer();
      focusModeActive = false;
      document.body.classList.remove("focus-mode");
      focusModeButton.textContent = "Focus Mode";
      msg.innerHTML = "Focus session complete";
      focusTimeLeft = 25 * 60;
      updateFocusTimerDisplay();
    }
  }, 1000);
}

function stopFocusTimer() {
  clearInterval(focusInterval);
  focusInterval = null;
}

function updateFocusTimerDisplay() {
  const minutes = Math.floor(focusTimeLeft / 60);
  let seconds = focusTimeLeft % 60;

  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  focusTimer.textContent = minutes + ":" + seconds;
}

updateFocusTimerDisplay();