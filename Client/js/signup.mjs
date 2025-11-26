const signupForm = document.getElementById("signupForm");
const failMsg = document.createElement("p");

failMsg.style.color = "red";
failMsg.style.marginTop = "10px";

signupForm.appendChild(failMsg);

const user = (id) => document.getElementById(id);

const idInput = user("signupUserId");
const pwInput = user("signupPw");
const nameInput = user("signupName");
const emailInput = user("signupEmail");
const photoInput = user("signupPhotoUrl");

[idInput, pwInput, nameInput, emailInput, photoInput].forEach((el) => {
  el.addEventListener("input", () => (failMsg.textContent = ""));
});

// 제출
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userid = idInput.value;
  const password = pwInput.value;
  const name = nameInput.value;
  const email = emailInput.value;
  const url = photoInput.value;

  if (!userid) {
    failMsg.textContent = "아이디를 입력하세요.";
    return;
  }

  if (!password) {
    failMsg.textContent = "비밀번호를 입력하세요.";
    return;
  }

  if (!name) {
    failMsg.textContent = "이름을 입력하세요.";
    return;
  }

  if (!email) {
    failMsg.textContent = "이메일을 입력하세요.";
    return;
  }

  if (!url) {
    failMsg.textContent = "프로필 사진 URL을 입력하세요.";
    return;
  }

  try {
    const response = await fetch("/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userid, password, name, email, url }),
    });

    const data = await response.json();

    if (!response.ok) {
      failMsg.textContent = data.message || "회원가입에 실패했습니다.";
      return;
    }

    window.location.href = "/login.html";
  } catch {
    failMsg.textContent = "서버와 연결할 수 없습니다.";
  }
});
