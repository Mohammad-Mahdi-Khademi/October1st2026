(() => {
  const song = document.getElementById('song');
  const entry = document.getElementById('entry');
  const enterButton = document.getElementById('enterButton');
  const trackControl = document.getElementById('trackControl');
  const playRecord = document.getElementById('playRecord');
  const trackStatus = document.getElementById('trackStatus');
  const controlIcon = document.querySelector('.control-icon');
  const turntable = document.getElementById('turntable');
  const scenes = [...document.querySelectorAll('.scene')];
  const sceneNumber = document.getElementById('sceneNumber');
  const previous = document.getElementById('previous');
  const next = document.getElementById('next');
  let currentScene = 0;
  let hasEntered = false;

  const renderPlayback = () => {
    const playing = !song.paused && !song.ended;
    document.body.classList.toggle('is-playing', playing);
    turntable.classList.toggle('is-playing', playing);
    trackControl.setAttribute('aria-label', playing ? 'Pause song' : 'Play song');
    playRecord.setAttribute('aria-label', playing ? 'Pause Love is a Stranger' : 'Play Love is a Stranger');
    controlIcon.textContent = playing ? 'Ⅱ' : '▶';
    trackStatus.textContent = playing ? 'NOW PLAYING · SIDE A' : song.ended ? 'PLAY AGAIN WHENEVER' : 'READY WHEN YOU ARE';
  };

  const startSong = async () => {
    if (song.ended) song.currentTime = 0;
    try { await song.play(); }
    catch (error) { trackStatus.textContent = 'TAP PLAY TO START THE SONG'; }
    renderPlayback();
  };

  const enterRoom = () => {
    if (hasEntered) return;
    hasEntered = true;
    entry.classList.add('is-gone');
    startSong();
  };
  enterButton.addEventListener('click', enterRoom);
  entry.addEventListener('pointerdown', event => { if (event.target !== enterButton) enterRoom(); }, { once: true });
  entry.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') enterRoom(); });
  trackControl.addEventListener('click', () => song.paused ? startSong() : song.pause());
  playRecord.addEventListener('click', () => song.paused ? startSong() : song.pause());
  song.addEventListener('play', renderPlayback);
  song.addEventListener('pause', renderPlayback);
  song.addEventListener('ended', renderPlayback);
  song.addEventListener('error', () => { trackStatus.textContent = 'SONG FILE COULD NOT BE LOADED'; });

  const showScene = index => {
    currentScene = Math.max(0, Math.min(scenes.length - 1, index));
    scenes.forEach((scene, i) => {
      const active = i === currentScene;
      scene.classList.toggle('is-active', active);
      scene.setAttribute('aria-hidden', String(!active));
      scene.inert = !active;
    });
    sceneNumber.textContent = String(currentScene + 1).padStart(2, '0');
    previous.disabled = currentScene === 0;
    next.disabled = currentScene === scenes.length - 1;
  };
  previous.addEventListener('click', () => showScene(currentScene - 1));
  next.addEventListener('click', () => showScene(currentScene + 1));
  document.getElementById('replayNote').addEventListener('click', () => {
    showScene(0);
    if (song.ended) startSong();
  });
  document.addEventListener('keydown', event => {
    if (!entry.classList.contains('is-gone')) return;
    if (event.key === 'ArrowRight') showScene(currentScene + 1);
    if (event.key === 'ArrowLeft') showScene(currentScene - 1);
    if (event.code === 'Space' && document.activeElement.tagName !== 'BUTTON') {
      event.preventDefault();
      song.paused ? startSong() : song.pause();
    }
  });

  const dust = document.getElementById('dust');
  const count = window.matchMedia('(max-width: 520px)').matches ? 16 : 26;
  for (let i = 0; i < count; i += 1) {
    const mote = document.createElement('i');
    mote.style.left = `${Math.random() * 100}%`;
    mote.style.top = `${45 + Math.random() * 65}%`;
    mote.style.setProperty('--duration', `${14 + Math.random() * 19}s`);
    mote.style.setProperty('--delay', `${-Math.random() * 28}s`);
    mote.style.setProperty('--drift', `${Math.random() * 70 - 35}px`);
    mote.style.setProperty('--alpha', `${0.18 + Math.random() * 0.38}`);
    dust.appendChild(mote);
  }

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (finePointer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.addEventListener('pointermove', event => {
      const x = (event.clientX / window.innerWidth - 0.5) * 7;
      const y = (event.clientY / window.innerHeight - 0.5) * 5;
      document.querySelector('.room-light').style.transform = `translate(${x}px, ${y}px)`;
    }, { passive: true });
  }

  showScene(0);
  renderPlayback();
  song.play().then(renderPlayback).catch(() => {});
})();
