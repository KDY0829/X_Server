// 토큰 없으면 로그인으로
const token = localStorage.getItem("accessToken");
if (!token) window.location.href = "./login.html";

const $ = (id) => document.getElementById(id);
const searchInput = $("searchUserId");
const titleEl = document.querySelector(".section-title");

// 공용 fetch (Authorization 자동)
async function apiFetch(url, options = {}) {
  const headers = Object.assign({}, options.headers || {}, {
    Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
  });
  const res = await fetch(url, { ...options, headers });
  const ct = res.headers.get("content-type") || "";
  const data = ct.includes("application/json")
    ? await res.json().catch(() => ({}))
    : await res.text().catch(() => "");
  if (!res.ok)
    throw new Error(
      (data && data.message) || (typeof data === "string" ? data : "요청 실패")
    );
  return data;
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${y}-${m}-${day} ${hh}:${mm}`;
  } catch {
    return iso || "";
  }
}

function renderPosts(items) {
  const box = $("list");
  box.innerHTML = "";
  if (!Array.isArray(items) || items.length === 0) {
    box.innerHTML = `<div style="color:#6b7280; padding:12px;">포스트가 없습니다.</div>`;
    return;
  }
  items.forEach((p) => {
    const el = document.createElement("div");
    el.className = "post";
    el.innerHTML = `
      <div class="author">${p.name || p.userid || "알 수 없음"}</div>
      <div class="time">${formatDate(p.createdAt)}</div>
      <div class="excerpt">${(p.text && String(p.text)) || ""}</div>
    `;
    el.addEventListener("click", () => {
      window.location.href = "./post_detail.html?id=" + (p._id || p.id);
    });
    box.appendChild(el);
  });
}

// URL 쿼리 유지/삭제
function setQueryParam(userid) {
  const url = new URL(location.href);
  if (userid) url.searchParams.set("userid", userid);
  else url.searchParams.delete("userid");
  history.replaceState({}, "", url);
}

// 목록 로드
async function loadPosts(userid) {
  try {
    titleEl.textContent = userid ? `최신 포스트 by ${userid}` : "최신 포스트";
    const url = userid ? `/post?userid=${encodeURIComponent(userid)}` : "/post";
    const data = await apiFetch(url, { method: "GET" });
    renderPosts(Array.isArray(data) ? data : data.items || data.posts || []);
  } catch (e) {
    $(
      "list"
    ).innerHTML = `<div style="color:#ef4444; padding:12px;">목록 로딩 실패: ${
      e.message || e
    }</div>`;
  }
}

// 검색 제출
$("searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const q = searchInput.value;
  setQueryParam(q);
  loadPosts(q);
});

// 초기: 주소의 ?userid 반영
const initUser = new URLSearchParams(location.search).get("userid") || "";
if (initUser) searchInput.value = initUser;
loadPosts(initUser);
