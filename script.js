// ====== PENGATURAN (silakan ubah sesuai keinginan) ======
const NAMA = "Melda";
const UCAPAN_KETIK = `Semoga hari ini penuh tawa, cinta, dan semua hal yang bikin kamu bahagia, ${NAMA}! ✨`;
const PESAN_KARTU = `Selamat ulang tahun, ${NAMA}! 🎂

Terima kasih sudah jadi teman yang baik, yang selalu ada dan bikin hari-hari lebih seru.

Semoga di umur yang baru ini, semua doa dan impianmu satu per satu jadi kenyataan.
Tetap jadi dirimu yang hebat ya!

wishing you a day full of laughter, love, and everything that makes you happy.

Dari temanmu jaky`;
// =======================================================

const $ = (id) => document.getElementById(id);
const screens = document.querySelectorAll(".screen");

function showScreen(id) {
  screens.forEach((s) => s.classList.remove("active"));
  $(id).classList.add("active");
}

// ----- Efek mengetik -----
function typeText(el, text, speed = 45) {
  el.textContent = "";
  let i = 0;
  const timer = setInterval(() => {
    el.textContent += text[i++];
    if (i >= text.length) clearInterval(timer);
  }, speed);
}

// ----- Konfeti (canvas) -----
const canvas = $("confetti");
const ctx = canvas.getContext("2d");
let pieces = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

function burst(count = 150) {
  const colors = ["#ff6fa5", "#8a5cf6", "#ffd166", "#06d6a0", "#4cc9f0"];
  for (let i = 0; i < count; i++) {
    pieces.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 16,
      vy: Math.random() * -14 - 4,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * 360,
      vr: (Math.random() - 0.5) * 12,
      life: 0,
    });
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pieces.forEach((p) => {
    p.vy += 0.25; // gravitasi
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.vr;
    p.life++;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rot * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
    ctx.restore();
  });
  pieces = pieces.filter((p) => p.y < canvas.height + 20 && p.life < 300);
  requestAnimationFrame(animate);
}
animate();

// ----- Alur halaman -----
$("openBtn").addEventListener("click", () => {
  showScreen("cake-screen");
  burst(120);
  const music = $("music");
  if (music.querySelector("source")) music.play().catch(() => {});
});

let blown = false;
$("flame").parentElement.addEventListener("click", () => {
  if (blown) return;
  blown = true;
  $("flame").classList.add("off");
  $("hint").textContent = "Yeay! Semoga permintaanmu terkabul 🌟";
  burst(200);
  typeText($("typed"), UCAPAN_KETIK);
  setTimeout(() => $("nextBtn").classList.remove("hidden"), 2500);
});

$("nextBtn").addEventListener("click", () => {
  showScreen("card-screen");
  typeText($("message"), PESAN_KARTU, 30);
});

$("partyBtn").addEventListener("click", () => burst(250));

$("replayBtn").addEventListener("click", () => {
  blown = false;
  $("flame").classList.remove("off");
  $("hint").textContent = "Klik lilinnya untuk meniup 🕯️";
  $("typed").textContent = "";
  $("nextBtn").classList.add("hidden");
  showScreen("intro");
});
