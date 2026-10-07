(function () {
  "use strict";

  var W = window.WEDDING;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var WEEK = ["일", "월", "화", "수", "목", "금", "토"];
  var date = new Date(W.date);

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function nl2br(s) { return esc(s).replace(/\n/g, "<br>"); }
  function pad(n) { return String(n).padStart(2, "0"); }
  function tel(n) { return String(n).replace(/[^0-9+]/g, ""); }

  // 한국 시간 기준 날짜 구성요소
  function kst(d) {
    var k = new Date(d.getTime() + 9 * 3600 * 1000);
    return { y: k.getUTCFullYear(), m: k.getUTCMonth() + 1, d: k.getUTCDate(), w: k.getUTCDay(), h: k.getUTCHours(), min: k.getUTCMinutes() };
  }
  var D = kst(date);
  function timeText() {
    var ampm = D.h < 12 ? "오전" : "오후";
    var h = D.h % 12 || 12;
    return ampm + " " + h + "시" + (D.min ? " " + D.min + "분" : "");
  }

  /* ---------- 토스트 / 복사 ---------- */
  var toastTimer;
  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 1800);
  }
  function copy(text, msg) {
    var done = function () { toast(msg || "복사되었습니다"); };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else {
      fallback();
    }
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); done(); } catch (e) { toast("복사에 실패했습니다"); }
      document.body.removeChild(ta);
    }
  }

  /* ---------- 커버 ---------- */
  function renderCover() {
    $("#cover").innerHTML =
      '<div class="cover__date">' + D.y + "<strong>" + pad(D.m) + " / " + pad(D.d) + "</strong>" +
      ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"][D.w] + "</div>" +
      '<img class="cover__photo" src="' + esc(W.coverImage) + '" alt="웨딩 대표 사진" />' +
      '<p class="cover__names">' + esc(W.groom.name) + "<span>♥</span>" + esc(W.bride.name) + "</p>" +
      '<p class="cover__info">' + D.y + "년 " + D.m + "월 " + D.d + "일 " + WEEK[D.w] + "요일 " + timeText() +
      "<br>" + esc(W.venue.name) + " " + esc(W.venue.hall) + "</p>" +
      '<div class="scroll-hint">SCROLL ↓</div>';
  }

  /* ---------- 인사말 ---------- */
  function parentName(p) {
    return '<span class="parents__name' + (p.deceased ? " deceased" : "") + '">' + esc(p.name) + "</span>";
  }
  function parentRow(side) {
    var s = W[side];
    return '<div class="parents__row">' + parentName(s.father) + " · " + parentName(s.mother) +
      '<span class="parents__rel">의 ' + esc(s.relation) + "</span><b class=\"parents__name\">" + esc(s.name) + "</b></div>";
  }
  function renderGreeting() {
    $("#greeting").innerHTML =
      '<div class="reveal"><p class="eyebrow">Invitation</p><h2 class="title">' + esc(W.greeting.title) + "</h2>" +
      '<p class="greeting__msg">' + nl2br(W.greeting.message) + "</p></div>" +
      '<div class="divider"></div>' +
      '<div class="parents reveal">' + parentRow("groom") + parentRow("bride") + "</div>" +
      '<button class="btn reveal" id="open-contact">✆ 연락하기</button>';

    var rows = function (label, s) {
      var list = [
        { role: label, name: s.name, phone: s.phone },
        { role: label + " 아버지", name: s.father.name, phone: s.father.phone, hide: s.father.deceased },
        { role: label + " 어머니", name: s.mother.name, phone: s.mother.phone, hide: s.mother.deceased },
      ];
      list = list.filter(function (p) { return p.phone && !p.hide; });
      if (!list.length) return "";
      return '<div class="contact-group"><h4>' + label + "측</h4>" + list.map(function (p) {
        return '<div class="contact-row"><span><small>' + esc(p.role) + "</small>" + esc(p.name) + "</span>" +
          '<span class="icons"><a href="tel:' + tel(p.phone) + '" aria-label="' + esc(p.name) + ' 전화">✆</a>' +
          '<a href="sms:' + tel(p.phone) + '" aria-label="' + esc(p.name) + ' 문자">✉</a></span></div>';
      }).join("") + "</div>";
    };
    var contacts = rows("신랑", W.groom) + rows("신부", W.bride);
    if (!contacts) {
      $("#open-contact").remove();
      return;
    }
    $("#contact-body").innerHTML = contacts;

    var modal = $("#contact-modal");
    $("#open-contact").addEventListener("click", function () { modal.hidden = false; });
    modal.addEventListener("click", function (e) { if (e.target.hasAttribute("data-close")) modal.hidden = true; });
  }

  /* ---------- 달력 / D-day ---------- */
  function renderCalendar() {
    var first = new Date(Date.UTC(D.y, D.m - 1, 1)).getUTCDay();
    var last = new Date(Date.UTC(D.y, D.m, 0)).getUTCDate();
    var cells = WEEK.map(function (w, i) {
      return '<div class="cal__head ' + (i === 0 ? "sun" : i === 6 ? "sat" : "") + '">' + w + "</div>";
    });
    for (var i = 0; i < first; i++) cells.push("<div></div>");
    for (var d = 1; d <= last; d++) {
      var wd = (first + d - 1) % 7;
      var cls = d === D.d ? "day" : wd === 0 ? "sun" : wd === 6 ? "sat" : "";
      cells.push('<div class="cal__cell ' + cls + '">' + d + "</div>");
    }

    $("#calendar").innerHTML =
      '<div class="reveal"><p class="eyebrow">Wedding Day</p>' +
      '<p class="cal__date">' + D.y + "년 " + D.m + "월 " + D.d + "일 " + WEEK[D.w] + "요일</p>" +
      '<p class="cal__time">' + timeText() + "</p>" +
      '<div class="cal">' + cells.join("") + "</div>" +
      '<div class="countdown">' +
      ["DAYS", "HOUR", "MIN", "SEC"].map(function (l) {
        return '<div class="countdown__item"><span class="countdown__num" data-cd="' + l + '">0</span><span class="countdown__label">' + l + "</span></div>";
      }).join("") +
      '</div><p class="dday"></p></div>';

    var nums = document.querySelectorAll("[data-cd]");
    var dday = $(".dday");
    var names = esc(W.groom.firstName) + " ♥ " + esc(W.bride.firstName);
    function tick() {
      var diff = Math.max(0, date - Date.now());
      var s = Math.floor(diff / 1000);
      var v = [Math.floor(s / 86400), Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60];
      nums.forEach(function (n, i) { n.textContent = i ? pad(v[i]) : v[i]; });

      // 날짜 기준 D-day (한국 시간)
      var today = kst(new Date());
      var days = Math.round((Date.UTC(D.y, D.m - 1, D.d) - Date.UTC(today.y, today.m - 1, today.d)) / 86400000);
      dday.innerHTML = days > 0 ? names + "의 결혼식이 <em>" + days + "일</em> 남았습니다"
        : days === 0 ? "오늘은 " + names + "의 <em>결혼식</em>입니다"
        : names + "의 결혼식이 <em>" + -days + "일</em> 지났습니다";
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- 갤러리 ---------- */
  function renderGallery() {
    var imgs = W.gallery || [];
    var preview = W.galleryPreviewCount || imgs.length;
    $("#gallery").innerHTML =
      '<p class="eyebrow reveal">Gallery</p><h2 class="title reveal">우리의 순간</h2>' +
      '<div class="gallery reveal">' + imgs.map(function (src, i) {
        return '<button data-i="' + i + '"' + (i >= preview ? " hidden" : "") + ' aria-label="사진 ' + (i + 1) + ' 크게 보기">' +
          '<img src="' + esc(src) + '" alt="" loading="lazy" /></button>';
      }).join("") + "</div>" +
      (imgs.length > preview ? '<button class="btn gallery-more">사진 더보기 +</button>' : "");

    var more = $(".gallery-more");
    if (more) more.addEventListener("click", function () {
      document.querySelectorAll(".gallery [hidden]").forEach(function (b) { b.hidden = false; });
      more.remove();
    });

    var lb = $("#lightbox"), lbImg = $(".lightbox__img", lb), lbCount = $(".lightbox__count", lb), cur = 0;
    function show(i) {
      cur = (i + imgs.length) % imgs.length;
      lbImg.src = imgs[cur];
      lbCount.textContent = cur + 1 + " / " + imgs.length;
    }
    function open(i) { show(i); lb.hidden = false; document.body.style.overflow = "hidden"; }
    function close() { lb.hidden = true; document.body.style.overflow = ""; }

    $(".gallery").addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (b) open(+b.dataset.i);
    });
    $(".lightbox__close", lb).addEventListener("click", close);
    $(".lightbox__nav--prev", lb).addEventListener("click", function () { show(cur - 1); });
    $(".lightbox__nav--next", lb).addEventListener("click", function () { show(cur + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
    document.addEventListener("keydown", function (e) {
      if (lb.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(cur - 1);
      if (e.key === "ArrowRight") show(cur + 1);
    });

    var sx = null;
    lb.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
      sx = null;
    });
  }

  /* ---------- 오시는 길 ---------- */
  function renderLocation() {
    var v = W.venue;
    var hasCoord = v.lat != null && v.lng != null;
    var query = encodeURIComponent(v.mapQuery || v.name);
    var naver = "https://map.naver.com/p/search/" + query;
    var kakao = hasCoord
      ? "https://map.kakao.com/link/to/" + encodeURIComponent(v.name) + "," + v.lat + "," + v.lng
      : "https://map.kakao.com/link/search/" + query;
    var tmap = hasCoord
      ? "tmap://route?goalname=" + encodeURIComponent(v.name) + "&goalx=" + v.lng + "&goaly=" + v.lat
      : "tmap://search?name=" + query;
    var embedQ = hasCoord ? v.lat + "," + v.lng : query;

    $("#location").innerHTML =
      '<div class="reveal"><p class="eyebrow">Location</p><h2 class="title">오시는 길</h2>' +
      '<p class="venue__name">' + esc(v.name) + " " + esc(v.hall) + "</p>" +
      '<p class="venue__addr">' + esc(v.address) + (v.tel ? "<br>Tel. " + esc(v.tel) : "") + "</p></div>" +
      '<iframe class="map" loading="lazy" title="예식장 지도" referrerpolicy="no-referrer-when-downgrade" ' +
      'src="https://maps.google.com/maps?q=' + embedQ + '&z=16&hl=ko&output=embed"></iframe>' +
      '<div class="map-links">' +
      '<a class="btn" href="' + naver + '" target="_blank" rel="noopener">네이버 지도</a>' +
      '<a class="btn" href="' + kakao + '" target="_blank" rel="noopener">카카오맵</a>' +
      '<a class="btn" href="' + tmap + '">티맵</a></div>' +
      '<div class="venue__actions"><button class="btn" id="copy-addr">주소 복사</button>' +
      (v.tel ? '<a class="btn" href="tel:' + tel(v.tel) + '">예식장 전화</a>' : "") + "</div>" +
      '<div class="transport">' + (v.transport || []).map(function (t) {
        return '<div class="transport__item reveal"><h4>' + esc(t.title) + "</h4>" +
          t.lines.map(function (l) { return "<p>" + esc(l) + "</p>"; }).join("") + "</div>";
      }).join("") + "</div>";

    $("#copy-addr").addEventListener("click", function () { copy(v.address, "주소가 복사되었습니다"); });
  }

  /* ---------- 마음 전하실 곳 ---------- */
  function renderAccount() {
    var filled = function (list) {
      return (list || []).filter(function (a) { return a.bank && a.number; });
    };
    var groom = filled(W.accounts.groom), bride = filled(W.accounts.bride);
    if (!groom.length && !bride.length) {
      $("#account").hidden = true;
      // 배경색이 번갈아 나오도록 다음 섹션 톤을 맞춤
      $("#share").classList.remove("section--tint");
      return;
    }

    var group = function (label, list) {
      if (!list.length) return "";
      return '<div class="acc reveal"><button class="acc__head" aria-expanded="false">' + label + '</button>' +
        '<div class="acc__body"><div class="acc__inner">' + list.map(function (a) {
          var full = a.bank + " " + a.number;
          return '<div class="acct"><div class="acct__info"><small>' + esc(a.role) + "</small>" +
            esc(a.bank) + " " + esc(a.number) + "<br>예금주 " + esc(a.name) + "</div>" +
            '<div class="acct__btns">' +
            (a.kakaopay ? '<a class="btn btn--kakaopay" href="' + esc(a.kakaopay) + '" target="_blank" rel="noopener">pay</a>' : "") +
            '<button class="btn" data-copy="' + esc(full) + '">복사</button></div></div>';
        }).join("") + "</div></div></div>";
    };

    $("#account").innerHTML =
      '<p class="eyebrow reveal">Account</p><h2 class="title reveal">마음 전하실 곳</h2>' +
      '<p class="account__msg reveal">참석이 어려우신 분들을 위해<br>계좌번호를 기재하였습니다.<br>너그러운 마음으로 양해 부탁드립니다.</p>' +
      group("신랑측 계좌번호", groom) + group("신부측 계좌번호", bride);

    $("#account").addEventListener("click", function (e) {
      var head = e.target.closest(".acc__head");
      if (head) {
        var acc = head.parentElement;
        head.setAttribute("aria-expanded", acc.classList.toggle("open"));
      }
      var c = e.target.closest("[data-copy]");
      if (c) copy(c.dataset.copy, "계좌번호가 복사되었습니다");
    });
  }

  /* ---------- 공유 ---------- */
  function renderShare() {
    $("#share").innerHTML =
      '<p class="eyebrow reveal">Share</p><h2 class="title reveal">청첩장 공유하기</h2>' +
      '<div class="share reveal">' +
      (W.kakao && W.kakao.jsKey ? '<button class="btn btn--block btn--kakao" id="share-kakao">카카오톡으로 공유하기</button>' : "") +
      '<button class="btn btn--block" id="share-link">링크 복사하기</button></div>';

    var url = W.siteUrl || location.href;
    var title = W.groom.name + " ♥ " + W.bride.name + " 결혼합니다";
    var desc = D.y + "년 " + D.m + "월 " + D.d + "일 " + WEEK[D.w] + "요일 " + timeText() + "\n" + W.venue.name;

    $("#share-link").addEventListener("click", function () { copy(url, "링크가 복사되었습니다"); });
    if (!(W.kakao && W.kakao.jsKey)) return;

    $("#share-kakao").addEventListener("click", function () {
      if (window.Kakao && Kakao.isInitialized()) {
        Kakao.Share.sendDefault({
          objectType: "feed",
          content: {
            title: title,
            description: desc,
            imageUrl: new URL(W.kakao.shareImage, url).href,
            link: { mobileWebUrl: url, webUrl: url },
          },
          buttons: [{ title: "청첩장 보기", link: { mobileWebUrl: url, webUrl: url } }],
        });
      } else if (navigator.share) {
        navigator.share({ title: title, text: desc, url: url }).catch(function () {});
      } else {
        copy(url, "링크가 복사되었습니다");
      }
    });

    var s = document.createElement("script");
    s.src = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js";
    s.crossOrigin = "anonymous";
    s.onload = function () { if (!Kakao.isInitialized()) Kakao.init(W.kakao.jsKey); };
    document.head.appendChild(s);
  }

  /* ---------- BGM ---------- */
  function setupBgm() {
    if (!W.bgm) return;
    var btn = $("#bgm-toggle");
    var audio = new Audio(W.bgm);
    audio.loop = true;
    btn.hidden = false;
    btn.addEventListener("click", function () {
      if (audio.paused) audio.play().then(function () { btn.classList.add("playing"); }, function () {});
      else { audio.pause(); btn.classList.remove("playing"); }
    });
  }

  /* ---------- 꽃잎 효과 ---------- */
  function setupPetals() {
    if (!W.petals || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var box = $("#petals");
    for (var i = 0; i < 14; i++) {
      var p = document.createElement("span");
      p.className = "petal";
      var size = 6 + Math.random() * 8;
      p.style.cssText = "left:" + Math.random() * 100 + "%;width:" + size + "px;height:" + size + "px;" +
        "animation-duration:" + (9 + Math.random() * 8) + "s;animation-delay:" + -Math.random() * 15 + "s;" +
        "--drift:" + (Math.random() * 120 - 60) + "px";
      box.appendChild(p);
    }
  }

  /* ---------- 스크롤 등장 애니메이션 ---------- */
  function setupReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.15 });
    els.forEach(function (el) { io.observe(el); });
  }

  renderCover();
  renderGreeting();
  renderCalendar();
  renderGallery();
  renderLocation();
  renderAccount();
  renderShare();
  setupBgm();
  setupPetals();
  setupReveal();
})();
