// 토큰 없으면 로그인 페이지로
const token = localStorage.getItem("accessToken");
if (!token) window.location.href = "./login.html";

const $ = (id) => document.getElementById(id);

// URL에서 id 파라미터 얻기
const params = new URLSearchParams(location.search);
const id = params.get("id");

// 공통 fetch: Authorization 자동 추가
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
    throw new Error(data.message || "요청 실패");
  }
  return data;
}

// 날짜 포맷
function fmtDate(v) {
  try {
    const d = new Date(v);
    if (isNaN(d.getTime())) return v || "";
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}
            ${String(d.getHours()).padStart(2, "0")}:${String(
      d.getMinutes()
    ).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
  } catch {
    return v || "";
  }
}

// Key-Value 테이블 생성
function renderAllFields(doc) {
  const table = $("kvTable");
  table.innerHTML = "";

  Object.entries(doc).forEach(([k, v]) => {
    if (typeof v === "object" && v !== null) {
      try {
        v = JSON.stringify(v, null, 2);
      } catch {
        v = String(v);
      }
    }

    if (/created|updated/i.test(k)) {
      v = fmtDate(v);
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <th>${k}</th>
      <td>${v || ""}</td>
    `;
    table.appendChild(tr);
  });
}

// 상세 불러오기
async function loadDetail() {
  if (!id) {
    $("detailText").textContent = "잘못된 접근입니다. (id 없음)";
    return;
  }

  try {
    const doc = await apiFetch(`/post/${encodeURIComponent(id)}`);

    $("detailName").textContent =
      doc.name || doc.userid || doc.author || "알 수 없음";

    $("detailTime").textContent = fmtDate(doc.createdAt || doc.updatedAt || "");

    $("detailText").textContent = doc.text || "(내용 없음)";

    renderAllFields(doc);
  } catch (e) {
    $("detailText").textContent = "불러오기 실패: " + e.message;
  }
}

loadDetail();
