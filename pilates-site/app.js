const data = window.PILATES_DATA;

const programGrid = document.getElementById("programGrid");

const detailTitle = document.getElementById("detailTitle");
const detailOneLiner = document.getElementById("detailOneLiner");
const detailPrice = document.getElementById("detailPrice");
const detailFreq = document.getElementById("detailFreq");

const accPanels = {
  effect: document.querySelector('[data-panel="effect"]'),
  target: document.querySelector('[data-panel="target"]'),
  caution: document.querySelector('[data-panel="caution"]'),
  guide: document.querySelector('[data-panel="guide"]')
};

const lookupForm = document.getElementById("lookupForm");
const lookupResult = document.getElementById("lookupResult");

const changeForm = document.getElementById("changeForm");
const changeResult = document.getElementById("changeResult");
const changeType = document.getElementById("changeType");
const changeFields = document.getElementById("changeFields");

const btnTop = document.getElementById("btnTop");
btnTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// 카카오 버튼: 나중에 실제 채널 URL로 교체
document.getElementById("kakaoBtn").addEventListener("click", (e) => {
  e.preventDefault();
  alert("Truly pilates 카카오 채널 링크를 연결해주세요. (#kakaoBtn href 교체)");
});

// Program Grid Render
function renderPrograms() {
  programGrid.innerHTML = data.programs.map(p => {
    const badges = p.badges.map(b => `<span class="badge">${escapeHtml(b)}</span>`).join("");
    return `
      <article class="card">
        <p class="card__kicker">PROGRAM</p>
        <h3 class="card__title">${escapeHtml(p.name)}</h3>
        <p class="card__muted">${escapeHtml(p.oneLiner)}</p>
        <div class="badges">${badges}</div>
        <div class="card__actions">
          <button class="btn" type="button" data-pick="${p.id}">자세히</button>
          <a class="btn btn--ghost" href="#reserve">예약</a>
        </div>
      </article>
    `;
  }).join("");

  programGrid.querySelectorAll("[data-pick]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-pick");
      pickProgram(id);
      document.getElementById("truly").scrollIntoView({ behavior: "smooth" });
    });
  });
}

// Truly Detail
function pickProgram(id) {
  const p = data.programs.find(x => x.id === id);
  if (!p) return;

  detailTitle.textContent = p.name;
  detailOneLiner.textContent = p.oneLiner;
  detailPrice.textContent = p.price;
  detailFreq.textContent = p.freq;

  accPanels.effect.innerHTML = ul(p.effect);
  accPanels.target.innerHTML = ul(p.target);
  accPanels.caution.innerHTML = ul(p.caution);
  accPanels.guide.innerHTML = ul(p.guide);
}

// Accordion toggle
document.querySelectorAll(".acc__btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const key = btn.getAttribute("data-acc");
    const panel = document.querySelector(`[data-panel="${key}"]`);
    const isOpen = panel.classList.toggle("is-open");
    btn.querySelector(".acc__icon").textContent = isOpen ? "－" : "＋";
  });
});

// Lookup Reservation
lookupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(lookupForm);
  const code = String(fd.get("code") || "").trim();
  const phone4 = String(fd.get("phone4") || "").trim();

  const r = data.reservations.find(x =>
    x.code.toUpperCase() === code.toUpperCase() && x.phone4 === phone4
  );

  if (!r) {
    lookupResult.innerHTML = `
      <div><b>조회 결과</b></div>
      <div>일치하는 예약이 없습니다. 예약번호/연락처(뒤4자리)를 확인해주세요.</div>
    `;
    return;
  }

  lookupResult.innerHTML = `
    <div><b>조회 결과</b></div>
    <div class="divider"></div>
    <div><b>예약자</b> ${escapeHtml(r.name)}</div>
    <div><b>프로그램</b> ${escapeHtml(r.program)}</div>
    <div><b>일정</b> ${escapeHtml(r.date)} ${escapeHtml(r.time)}</div>
    <div><b>상태</b> ${escapeHtml(r.status)}</div>
    <div class="divider"></div>
    <div class="hint">변경/취소 폼에 예약번호를 입력해 요청을 접수하세요.</div>
  `;

  // 변경 폼에 자동 채우기(편의)
  changeForm.elements["code"].value = r.code;
});

// Change / Cancel form behavior
changeType.addEventListener("change", () => {
  const isCancel = changeType.value === "cancel";
  changeFields.style.display = isCancel ? "none" : "grid";
});

changeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(changeForm);

  const payload = {
    id: `REQ-${Date.now()}`,
    type: fd.get("type"),
    code: String(fd.get("code") || "").trim(),
    phone: String(fd.get("phone") || "").trim(),
    date: fd.get("date") || null,
    time: fd.get("time") || null,
    message: String(fd.get("message") || "").trim(),
    createdAt: new Date().toISOString()
  };

  // 간단 검증: 취소면 date/time 없어도 OK, 변경이면 date/time 권장
  if (payload.type === "change" && (!payload.date || !payload.time)) {
    alert("변경 요청은 희망 날짜/시간을 입력해주세요.");
    return;
  }

  // 로컬 저장(데모용). 운영에선 서버/DB로 전환하면 됨
  const key = "pilates_requests";
  const existing = JSON.parse(localStorage.getItem(key) || "[]");
  existing.unshift(payload);
  localStorage.setItem(key, JSON.stringify(existing));

  changeResult.innerHTML = `
    <div><b>접수 완료</b></div>
    <div class="divider"></div>
    <div><b>요청번호</b> ${escapeHtml(payload.id)}</div>
    <div><b>유형</b> ${payload.type === "cancel" ? "취소" : "변경"}</div>
    <div><b>예약번호</b> ${escapeHtml(payload.code)}</div>
    <div><b>연락처</b> ${escapeHtml(payload.phone)}</div>
    ${payload.type === "change" ? `<div><b>희망</b> ${escapeHtml(payload.date)} ${escapeHtml(payload.time)}</div>` : ""}
    <div class="divider"></div>
    <div class="hint">현재는 “접수 저장(데모)” 단계입니다. 실제 처리(알림/DB)는 다음 단계에서 연결합니다.</div>
  `;

  changeForm.reset();
  changeFields.style.display = "grid";
});

// Helpers
function ul(arr){
  return `<ul class="list">${arr.map(x => `<li>${escapeHtml(x)}</li>`).join("")}</ul>`;
}
function escapeHtml(str){
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// init
renderPrograms();
if (data.programs.length > 0) {
  pickProgram(data.programs[0].id);
}
