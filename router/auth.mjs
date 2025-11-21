// 인증, 사용자 관련(회원가입, 로그인 등)
import express from "express";
import * as authController from "../controller/auth.mjs";

const router = express.Router();

// 회원 가입
router.post("/signup", authController.signup);

// 로그인
router.post("/login", authController.login);

// 로그인 유지

export default router;
