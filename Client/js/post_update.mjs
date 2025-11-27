// 토큰 없으면 로그인으로
const token = localStorage.getItem("accessToken");
if (!token) window.location.href = "./login.html";

const $ = (id) => document.getElementById(id);

// 공용 fetch (Authorization 자동)
async function apiFetch(url, options = {}) {
  const headers = Object.assign({}, options.headers || {}, {
    Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
    "Content-Type": options.body ? "application/json" : undefined,
  });
  const res = await fetch(url, { ...options, headers });
  const ct = res.headers.get("content-type") || "";
  const data = ct.includes("application/json")
    ? await res.json().catch(() => ({}))
    : await res.text().catch(() => "");
  if (!res.ok) {
    const msg =
      (data && data.message) || (typeof data === "string" ? data : "요청 실패");
    const err = new Error(msg);
    err.status = res.status;
    throw err;
  }
  return data;
}

function fmtDate(iso) {
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

const listBox = $("list");
const textEl = $("postText");
const msg = $("editMsg");
const btnSave = $("btnSave");
const btnDelete = $("btnDelete");
$("btnCancel").addEventListener(
  "click",
  () => (window.location.href = "./posts.html")
);

let items = [];
let currentId = null;

function renderPosts(arr) {
  listBox.innerHTML = "";
  if (!Array.isArray(arr) || arr.length === 0) {
    listBox.innerHTML = `<div style="color:#6b7280; padding:12px;">포스트가 없습니다.</div>`;
    return;
  }
  arr.forEach((p) => {
    const el = document.createElement("div");
    el.className = "post";
    el.innerHTML = `
      <div class="author">${
        p.name || (p.author && p.author.name) || p.userid || "알 수 없음"
      }</div>
      <div class="time">${fmtDate(p.createdAt || p.updatedAt)}</div>
      <div class="excerpt">${(p.text && String(p.text)) || ""}</div>
    `;
    el.addEventListener("click", () => {
      currentId = p._id || p.id;
      textEl.value = p.text || "";
      btnSave.disabled = false;
      btnDelete.disabled = false;
      msg.className = "msg";
      msg.textContent = "";
      $("editTitle").textContent =
        "포스트 내용 수정 · " + (p.name || p.userid || "작성자");

      [...listBox.children].forEach((c) => (c.style.outline = ""));
      el.style.outline = "2px solid #2563eb";
      el.style.outlineOffset = "2px";
    });
    listBox.appendChild(el);
  });
}

async function loadPosts() {
  const data = await apiFetch("/post", { method: "GET" });
  items = Array.isArray(data) ? data : data.items || data.posts || [];
  renderPosts(items);
}

btnDelete.addEventListener("click", async () => {
  if (!currentId) return;
  if (!confirm("정말 이 글을 삭제할까요?")) return;

  btnDelete.disabled = true;
  try {
    await apiFetch(`/post/${encodeURIComponent(currentId)}`, {
      method: "DELETE",
    });
    // 목록에서 제거 후 재렌더
    items = items.filter((x) => (x._id || x.id) !== currentId);
    renderPosts(items);
    // 선택 해제 & 폼 리셋
    currentId = null;
    textEl.value = "";
    btnSave.disabled = true;
    btnDelete.disabled = true;
    msg.className = "msg ok";
    msg.textContent = "삭제 완료";
  } catch (err) {
    if (err.status === 403) {
      msg.className = "msg fail";
      msg.textContent = "본인 글만 삭제할 수 있습니다.";
    } else if (err.status === 404) {
      msg.className = "msg fail";
      msg.textContent = "존재하지 않는 글입니다.";
    } else if (err.status === 401) {
      window.location.href = "./login.html";
    } else {
      msg.className = "msg fail";
      msg.textContent = err.message || "삭제 실패";
    }
  } finally {
    btnDelete.disabled = false;
  }
});

$("editForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  msg.className = "msg";
  msg.textContent = "";

  if (!currentId) {
    msg.className = "msg fail";
    msg.textContent = "수정할 포스트를 먼저 선택하세요.";
    return;
  }

  const text = textEl.value; // trim 안 씀
  if (!text) {
    msg.className = "msg fail";
    msg.textContent = "내용을 입력하세요.";
    return;
  }

  btnSave.disabled = true;
  try {
    await apiFetch(`/post/${encodeURIComponent(currentId)}`, {
      method: "PUT",
      body: JSON.stringify({ text }),
    });
    // 성공 후 상세로 이동
    window.location.href = `./post_detail.html?id=${encodeURIComponent(
      currentId
    )}`;
  } catch (err) {
    if (err.status === 403) {
      msg.className = "msg fail";
      msg.textContent = "본인 글만 수정할 수 있습니다.";
    } else if (err.status === 404) {
      msg.className = "msg fail";
      msg.textContent = "존재하지 않는 글입니다.";
    } else if (err.status === 401) {
      window.location.href = "./login.html";
    } else {
      msg.className = "msg fail";
      msg.textContent = err.message || "수정 실패";
    }
  } finally {
    btnSave.disabled = false;
  }
});

loadPosts().catch((e) => {
  msg.className = "msg fail";
  msg.textContent = e.message || "목록 불러오기 실패";
});
