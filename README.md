# 📌 KDY Node.js + MongoDB 게시판 (Express + Vanilla JS)

JWT 로그인/회원가입/포스트 **작성·수정·삭제**가 되는 최소구성 프로젝트입니다.  
프론트는 `Client/` 폴더의 **정적 파일(HTML + mjs + CSS)** 로 구성되고, 백엔드 Express가 이를 서빙합니다.

---

## 📁 실제 폴더 구조 (gitignore 대상 제외)

```
.
├─ Client/
│  ├─ js/
│  │  ├─ login.mjs
│  │  ├─ post_detail.mjs
│  │  ├─ post_new.mjs
│  │  ├─ post_update.mjs
│  │  ├─ posts.mjs
│  │  └─ signup.mjs
│  ├─ api.mjs
│  ├─ index.html
│  ├─ login.html
│  ├─ post_detail.html
│  ├─ post_new.html
│  ├─ post_update.html
│  ├─ posts.html
│  └─ signup.html
│  
├─ controller/
│  ├─ auth.mjs
│  └─ post.mjs
├─ data/
│  ├─ auth.mjs
│  └─ post.mjs
├─ db/
│  └─ database.mjs
|
├─ middleware/
│  └─ auth.mjs
├─ router/
│  ├─ auth.mjs
│  └─ posts.mjs
├─ app.mjs
├─ config.mjs
├─ package.json
└─ package-lock.json
```

> `node_modules/`, `.env` 등은 **gitignore** 대상으로 간주하여 위 표에서 제외했습니다.

---

## ⚙️ 환경변수 (.env) – 반드시 작성

프로젝트 루트에 `.env` 파일을 만들고 아래 값을 **본인 값으로 채워 넣으세요.**

```env
# JWT
JWT_SECRET=CHANGE_ME_RANDOM_STRING
JWT_EXPIRES_SEC=172800        # 2일 = 172800초
BCRYPT_SALT_ROUNDS=10

# 서버
HOST_PORT=8080                # Express listen 포트

# DB (MongoDB Atlas URI 또는 로컬)
DB_HOST=mongodb+srv://USERNAME:PASSWORD@CLUSTER/dbname?retryWrites=true&w=majority
```

> ❗ `.env`는 **절대 커밋하지 마세요.**(gitignore 권장)

---

## 🚀 실행 방법

1. 의존성 설치

```bash
npm install
```

2. 환경변수 파일(.env) 작성(위 템플릿 참고)

3. 개발 서버 실행

```bash
npm run dev
```

4. 브라우저에서 접속

```
http://localhost:8080
```

---

## 🧩 라우팅 개요

### 백엔드 (예시)

- **Auth**
  - `POST /auth/signup` : 회원가입
  - `POST /auth/login` : 로그인(JWT 발급)
  - _(선택)_ `GET /auth/me` : 토큰 검증 후 사용자 식별 정보 반환
- **Posts**
  - `GET /post` : 전체 목록 (쿼리: `?userid=` 로 특정 사용자 글만)
  - `GET /post/:id` : 상세
  - `POST /post` : 작성(인증 필요) — body: `{ text }`
  - `PUT /post/:id` : 수정(인증 + 본인 글만)
  - `DELETE /post/:id` : 삭제(인증 + 본인 글만)

### 프론트 (Client/)

- `index.html` : 시작 페이지(로그인/회원가입 페이지로 이동)
- `login.html` + `js/login.mjs` : 로그인, 성공 시 `accessToken` 저장
- `signup.html` + `js/signup.mjs` : 회원가입(프로필 URL 포함)
- `posts.html` + `js/posts.mjs` : 최신 글 목록 + 사용자ID 검색
- `post_detail.html` + `js/post_detail.mjs` : 상세 페이지(수정 버튼 없음)
- `post_new.html` + `js/post_new.mjs` : 새 글 작성
- `post_update.html` + `js/post_update.mjs` : **목록형 선택 → 텍스트 수정/삭제**

---

## 🔐 인증 처리(프론트 관점)

- 로그인 성공 시 백엔드 응답에서 토큰 키를 자동 인식하여 저장:
  ```js
  localStorage.setItem("accessToken", token);
  ```
- 공통 fetch(`apiFetch`)에서 `Authorization: Bearer <token>`를 자동 첨부.
- 401이면 로그인 페이지로 리다이렉트, 403이면 “본인 글만 수정/삭제 가능” 표시.

> 참고: 로그인 응답이 `{ token, user }` 형태일 경우 `user.userid`도
>
> ```js
> localStorage.setItem("me", JSON.stringify(result.user));
> localStorage.setItem("meUserid", result.user.userid);
> ```
>
> 로 저장하여 화면 표기/필터에 활용할 수 있습니다.

---

## ✅ 체크리스트

- [ ] `.env` 작성 완료 (특히 `DB_HOST`, `JWT_SECRET`)
- [ ] Atlas **Network Access**에 현재 IP 추가(또는 0.0.0.0/0 허용)
- [ ] 서버 포트(`HOST_PORT`) 중복되지 않는지
- [ ] 로그인/회원가입 정상 동작
- [ ] 글 작성/수정/삭제 시 토큰 포함 확인

---

## 🧰 스크립트/팁

- 로그/디버깅은 개발자도구 Console에서 확인
- API 에러 응답 형식은 `{ message: "..." }` 가정 (백엔드와 통일 권장)
- 정적 리소스 경로: `app.mjs` 에서 `express.static("Client")` 를 통해 제공

---

## © 라이선스/표기

- 저작권 표기: `© KDY - All rights reserved`
- `Client/posts.html` 푸터에 GitHub 아이콘 버튼 포함 (필요 시 링크 변경)

---

### 메모

- 실제 라우터/컨트롤러 파일 이름은 폴더 내 파일에 맞춰 사용하세요.
