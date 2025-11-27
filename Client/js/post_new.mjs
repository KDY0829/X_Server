// 로그인 안 되어 있으면 돌려보냄
const token = localStorage.getItem("accessToken");
if (!token) window.location.href = "./login.html";

const user = (id) => document.getElementById(id);

async function apiFetch(url, options = {}) {
  const headers = Object.assign({}, options.headers || {}, {
    Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
    "Content-Type": "application/json",
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

const form = user("writeForm");
const textEl = user("postText");
const msg = user("writeMsg");
const btnSubmit = user("btnSubmit");
const btnCancel = user("btnCancel");

btnCancel.addEventListener(
  "click",
  () => (window.location.href = "./posts.html")
);

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const text = textEl.value; // trim 금지(요청대로)

  if (!text) {
    msg.className = "msg fail";
    msg.textContent = "내용을 입력하세요.";
    return;
  }

  btnSubmit.disabled = true;

  try {
    await apiFetch("/post", {
      method: "POST",
      body: JSON.stringify({ text }),
    });
    window.location.href = "./posts.html";
  } catch (err) {
    msg.className = "msg fail";
    msg.textContent = err.message || "작성 실패";
  } finally {
    btnSubmit.disabled = false;
  }
});
