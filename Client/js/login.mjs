// 로그인 폼 가져오기
const loginForm = document.getElementById("loginForm");

// 로그인 실패 시 메시지
const failMsg = document.createElement("p");
failMsg.style.color = "red";
failMsg.style.marginTop = "10px";
loginForm.appendChild(failMsg);

// 폼 제출
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userIdValue = document.getElementById("loginId").value;
  const userPwValue = document.getElementById("loginPw").value;

  if (!userIdValue || !userPwValue) {
    failMsg.textContent = "아이디와 비밀번호를 입력하세요.";
    return;
  }

  try {
    // 로그인 요청(fetch)
    const response = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userid: userIdValue,
        password: userPwValue,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      failMsg.textContent = result.message || "로그인 실패";
      return;
    }

    if (result.accessToken) {
      localStorage.setItem("accessToken", result.accessToken);
    }

    window.location.href = "/";
  } catch (error) {
    failMsg.textContent = "서버와 연결할 수 없습니다.";
  }
});
