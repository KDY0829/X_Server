// 프론트엔드 → Node.js 백엔드 요청 담당 파일

// 서버 경로
const BASE = "http://localhost:8080"; // 배포가 아닌 로컬용
const LOGIN_PAGE = "/login.html";

export function getToken() {
  return localStorage.getItem("token");
}

export function setToken(token) {
  if (token) {
    localStorage.setItem("token", t);
  }
}

export function clearToken() {
  localStorage.removeItem("token");
}

function authHeader() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
