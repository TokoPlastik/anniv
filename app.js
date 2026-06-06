// ===== PARTICLES =====
const pc = document.getElementById('particles');
for(let i = 0; i < 25; i++) {
  const p = document.createElement('div');
  p.className = 'particle';
  const size = Math.random() * 20 + 5;
  p.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;animation-duration:${Math.random()*20+15}s;animation-delay:${Math.random()*15}s;`;
  pc.appendChild(p);
}

// ===== COUNTER =====
const startDate = new Date('2025-06-08T00:00:00');
function updateCounter() {
  const now = new Date();
  const diff = now - startDate;
  const days = Math.floor(diff / (1000*60*60*24));
  const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
  const mins = Math.floor((diff % (1000*60*60)) / (1000*60));
  document.getElementById('cnt-days').textContent = days;
  document.getElementById('cnt-hours').textContent = hours;
  document.getElementById('cnt-mins').textContent = mins;
}
updateCounter();
setInterval(updateCounter, 60000);

/// ===== CLOCK LDR FIX (BERDASARKAN WAKTU LOKAL PERANGKAT LO) =====
function updateClocks() {
  // 1. Ambil waktu lokal dari perangkat lo saat ini (WITA)
  const waktuLokal = new Date();
  
  // Format jam Bagas (WITA)
  const jamBagas = waktuLokal.getHours().toString().padStart(2, '0');
  const menitBagas = waktuLokal.getMinutes().toString().padStart(2, '0');
  
  // 2. Kurangi 1 jam secara manual untuk mendapatkan waktu Piya (WIB)
  const waktuPiya = new Date(waktuLokal.getTime() - (1 * 60 * 60 * 1000));
  
  // Format jam Piya (WIB)
  const jamPiya = waktuPiya.getHours().toString().padStart(2, '0');
  const menitPiya = waktuPiya.getMinutes().toString().padStart(2, '0');
  
  // Tampilkan ke elemen HTML
  document.getElementById('clock-bagas').textContent = `${jamBagas}.${menitBagas}`;
  document.getElementById('clock-piya').textContent = `${jamPiya}.${menitPiya}`;
}

// Jalankan fungsi jamnya
updateClocks();

// ===== SCROLL ANIMATIONS =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.15 });
document.querySelectorAll('.timeline-item').forEach(el => observer.observe(el));

// ===== PHOTO UPLOAD =====
function loadPhoto(input) {
  if(!input.files[0]) return;
  const reader = new FileReader();
  reader.onload = e => {
    const slot = input.closest('.photo-slot');
    let img = slot.querySelector('img');
    if(!img) { img = document.createElement('img'); slot.appendChild(img); }
    img.src = e.target.result;
    slot.querySelector('.photo-icon').style.display = 'none';
    slot.querySelectorAll('div').forEach(d => { if(!d.classList.contains('photo-icon') && d !== slot) d.style.display = 'none'; });
  };
  reader.readAsDataURL(input.files[0]);
}

// ===== QUIZ =====
const quizAnswers = { 0: 'd', 1: 'd', 2: 'd', 3: 'd', 4: 'c' };
const quizState = { current: 0, score: 0, answered: [false, false, false, false, false] };

function answerQuiz(q, choice, btn) {
  if(quizState.answered[q]) return;
  quizState.answered[q] = true;
  const correct = quizAnswers[q];
  const card = document.getElementById('qcard-' + q);
  const opts = card.querySelectorAll('.quiz-opt');
  opts.forEach(o => {
    o.disabled = true;
    if(o === btn) {
      o.classList.add(choice === correct ? 'correct' : 'wrong');
    }
    if(o !== btn && true) {
      const oc = o.getAttribute('onclick').match(/'([a-d])'/);
      if(oc && oc[1] === correct) o.classList.add('correct');
    }
  });
  if(choice === correct) quizState.score++;
  quizState.current++;

  if(choice === correct) spawnHearts(btn);

  setTimeout(() => {
    if(quizState.answered.every(a => a)) showQuizResult();
  }, 800);
}

function showQuizResult() {
  document.getElementById('quiz-result').style.display = 'block';
  document.getElementById('score-num').textContent = quizState.score + '/5';
  const msgs = ['Kenalan dulu yuk! 😄', 'Lumayan! 😊', 'Cukup kenal! 💙', 'Saling kenal banget! 🌊', 'Soulmate sejati! 💙✨'];
  document.getElementById('score-msg').textContent = msgs[quizState.score];
}

function resetQuiz() {
  quizState.score = 0;
  quizState.answered = [false, false, false, false, false];
  document.getElementById('quiz-result').style.display = 'none';
  document.querySelectorAll('.quiz-opt').forEach(o => {
    o.disabled = false;
    o.classList.remove('correct', 'wrong');
  });
}

// ===== MUSIC PLAYER (AUDIO ASLI STREAMING LANGSUNG) =====
const songs = [
  { 
    title: 'Perfect', 
    artist: 'Ed Sheeran', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' // Diganti ke direct streaming stream asli
  },
  { 
    title: 'A Thousand Years', 
    artist: 'Christina Perri', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  { 
    title: 'Can\'t Help Falling in Love', 
    artist: 'Elvis Presley', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  },
  { 
    title: 'All of Me', 
    artist: 'John Legend', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
  },
  { 
    title: 'Thinking Out Loud', 
    artist: 'Ed Sheeran', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
  },
  { 
    title: 'Speechless', 
    artist: 'Dan + Shay', 
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3'
  }
];

let curSong = 0;
let isPlaying = false;
let audioObj = new Audio(songs[curSong].url);

function renderSongList() {
  const sl = document.getElementById('song-list');
  sl.innerHTML = songs.map((s, i) => `
    <div class="song-item ${i===curSong?'active':''}" onclick="selectSong(${i})">
      <span class="si-num">${i+1}</span>
      <div class="si-info">
        <div class="si-title">${s.title}</div>
        <div class="si-artist">${s.artist}</div>
      </div>
      ${i===curSong && isPlaying ? '<span style="color:var(--gold);font-size:0.8rem;">♪</span>' : ''}
    </div>
  `).join('');
}

function selectSong(i) {
  const wasPlaying = isPlaying;
  audioObj.pause();
  
  curSong = i;
  audioObj = new Audio(songs[curSong].url);
  
  document.getElementById('song-title').textContent = songs[i].title;
  document.getElementById('song-artist').textContent = songs[i].artist;
  
  // Sinkronisasi info durasi saat metadata lagu keload
  audioObj.addEventListener('loadedmetadata', updateTimeDisplay);
  audioObj.addEventListener('timeupdate', updateProgressBar);
  audioObj.addEventListener('ended', nextSong);

  renderSongList();
  
  if (wasPlaying) {
    audioObj.play();
  } else if (isPlaying) {
    audioObj.play();
  }
}

function togglePlay() {
  isPlaying = !isPlaying;
  document.getElementById('play-btn').textContent = isPlaying ? '⏸' : '▶';
  document.getElementById('vinyl').classList.toggle('spinning', isPlaying);
  
  if (isPlaying) {
    audioObj.play().catch(err => console.log("Play diblokir browser sebelum interaksi."));
  } else {
    audioObj.pause();
  }
  renderSongList();
}

function updateProgressBar() {
  if (!audioObj.duration) return;
  const pct = (audioObj.currentTime / audioObj.duration) * 100;
  document.getElementById('prog-fill').style.width = pct + '%';
  
  const cur = Math.floor(audioObj.currentTime);
  document.getElementById('cur-time').textContent = `${Math.floor(cur/60)}:${String(cur%60).padStart(2,'0')}`;
}

function updateTimeDisplay() {
  const total = Math.floor(audioObj.duration || 0);
  document.getElementById('tot-time').textContent = `${Math.floor(total/60)}:${String(total%60).padStart(2,'0')}`;
}

function prevSong() { 
  let target = (curSong - 1 + songs.length) % songs.length; 
  selectSong(target); 
  if(!isPlaying) togglePlay();
}

function nextSong() { 
  let target = (curSong + 1) % songs.length; 
  selectSong(target); 
  if(!isPlaying) togglePlay();
}

function seekSong(e) {
  const bar = document.getElementById('prog-bar');
  const pct = e.offsetX / bar.offsetWidth;
  if(audioObj.duration) {
    audioObj.currentTime = pct * audioObj.duration;
  }
}

// Inisialisasi event listener audio bawaan awal
audioObj.addEventListener('loadedmetadata', updateTimeDisplay);
audioObj.addEventListener('timeupdate', updateProgressBar);
audioObj.addEventListener('ended', nextSong);
renderSongList();

// ===== PROMISES =====
const promiseData = [
  { icon: '💙', title: 'Selalu Ada', text: 'Aku akan selalu ada, meski jarak memisahkan.' },
  { icon: '📞', title: 'Nggak Pernah Berhenti', text: 'Kalau kangen, aku pasti call kamu' },
  { icon: '🌊', title: 'Setia', text: 'Laut bisa berubah, tapi kesetiaanku tidak.' },
  { icon: '🙏', title: 'Sabar', text: 'Aku berjanji untuk sabar, sama kamu dan sama jarak ini.' },
  { icon: '🗺️', title: 'Suatu Hari Nanti', text: 'Kita akan ketemu lagi, dan itu akan jadi hari terbaik.' },
  { icon: '❤️‍🩹', title: 'Nggak Nyakitin', text: 'Aku jaga perasaan kamu disinii' },
  { icon: '🌺', title: 'Menghargai', text: 'Setiap detik, aku akan menghargai kehadiran kamu di hidupku.' },
  { icon: '💪', title: 'Kuat Bareng', text: 'LDR bukan akhir, ini latihan kita jadi lebih kuat.' },
  { icon: '🌟', title: 'Bangga', text: 'Aku selalu bangga kamu adalah milikku.' },
  { icon: '♾️', title: 'Selamanya', text: 'Satu tahun ini baru awal. Kita punya waktu seumur hidup.' },
];

const pg = document.getElementById('promise-grid');
promiseData.forEach(p => {
  pg.innerHTML += `<div class="promise-card">
    <div class="promise-icon">${p.icon}</div>
    <div class="promise-title">${p.title}</div>
    <div class="promise-text">${p.text}</div>
  </div>`;
});

// ===== WISH JAR =====
const wishEmojis = ['💙', '🌊', '✨', '🌙', '🌺', '🎯', '🗺️', '🏖️', '🌟', '🎉', '💌', '🌈'];

function addWish() {
  const inp = document.getElementById('jar-input');
  const val = inp.value.trim();
  if(!val) return;
  const note = document.createElement('div');
  note.className = 'wish-note';
  const emoji = wishEmojis[Math.floor(Math.random() * wishEmojis.length)];
  note.textContent = emoji + ' ' + val;
  document.getElementById('jar-notes').appendChild(note);
  inp.value = '';
  shakeJar();
}

function shakeJar() {
  const jar = document.querySelector('.jar');
  jar.style.animation = 'shake 0.5s ease';
  setTimeout(() => jar.style.animation = '', 500);
}

// ===== MEMORIES =====
const memEmojis = ['💙', '🌊', '😂', '🌙', '📞', '💌', '🎵', '☕', '🌺', '✨', '🤗', '🎬'];
function addMemory() {
  const inp = document.getElementById('mem-input');
  const val = inp.value.trim();
  if(!val) return;
  const card = document.createElement('div');
  card.className = 'memory-card';
  const emoji = memEmojis[Math.floor(Math.random() * memEmojis.length)];
  card.innerHTML = `<div class="memory-emoji">${emoji}</div><div>${val}</div><button class="memory-del" onclick="this.parentElement.remove()">✕</button>`;
  document.getElementById('memory-grid').insertBefore(card, document.getElementById('memory-grid').firstChild);
  inp.value = '';
}

// ===== HEARTS =====
function spawnHearts(el) {
  const rect = el.getBoundingClientRect();
  for(let i = 0; i < 5; i++) {
    const h = document.createElement('div');
    h.className = 'fh';
    h.textContent = ['💙', '💗', '✨', '⭐', '💛'][Math.floor(Math.random()*5)];
    h.style.left = (rect.left + Math.random() * rect.width) + 'px';
    h.style.top = (rect.top + window.scrollY) + 'px';
    h.style.animationDelay = (Math.random() * 0.3) + 's';
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 2800);
  }
}

let heartCooldown = false;
document.addEventListener('click', (e) => {
  if(heartCooldown) return;
  heartCooldown = true;
  setTimeout(() => heartCooldown = false, 800);
  const h = document.createElement('div');
  h.className = 'fh';
  h.textContent = Math.random() > 0.5 ? '💙' : '✨';
  h.style.left = (e.clientX - 12) + 'px';
  h.style.top = (e.clientY + window.scrollY - 12) + 'px';
  document.body.appendChild(h);
  setTimeout(() => h.remove(), 2800);
});

// ===== RINDU =====
function sendRindu() {
  const msg = document.getElementById('rindu-msg').value.trim();
  if(!msg) return;
  const div = document.getElementById('rindu-sent');
  div.style.display = 'block';
  div.textContent = '💌 "' + msg + '" — Terkirim ke hati Piya ✨';
  document.getElementById('rindu-msg').value = '';
  for(let i = 0; i < 8; i++) {
    setTimeout(() => {
      const h = document.createElement('div');
      h.className = 'fh';
      h.textContent = ['💙', '💌', '✨'][Math.floor(Math.random()*3)];
      h.style.left = (20 + Math.random() * 60) + '%';
      h.style.top = (window.scrollY + window.innerHeight * 0.5) + 'px';
      document.body.appendChild(h);
      setTimeout(() => h.remove(), 2800);
    }, i * 150);
  }
}