loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userIdValue = document.getElementById("loginId").value;
  const userPwValue = document.getElementById("loginPw").value;

  if (!userIdValue || !userPwValue) {
    failMsg.textContent = "아이디와 비밀번호를 입력하세요.";
    return;
  }

  try {
    const response = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userid: userIdValue, password: userPwValue }),
    });

    const raw = await response.text();
    let result = {};
    try {
      result = JSON.parse(raw);
    } catch {}

    // 서버가 주는 토큰 키(token)를 자동 인식
    const token =
      result.accessToken ||
      result.token ||
      result.jwt ||
      result.TOKEN ||
      result.access_token;

    if (token) {
      localStorage.setItem("accessToken", token);
    }

    if (!response.ok) {
      failMsg.textContent = result.message || "로그인 실패";
      return;
    }

    window.location.href = "./posts.html";
  } catch (err) {
    failMsg.textContent = "서버와 연결할 수 없습니다.";
  }
});
