import express from "express";
import * as authRepository from "../data/auth.mjs";

// 회원가입 함수
export async function signup(req, res, next) {
  const { userid, password, name, email } = req.body;
  const user = await authRepository.createUser(userid, password, name, email);
  if (user) {
    res.status(200).json(user);
  }
}

// 로그인 함수
export async function login(req, res, next) {
  const { userid, password } = req.body;
  const user = await authRepository.login(userid, password);
  if (user) {
    res.status(200).json({ message: `${userid}님 어서오세요!` });
  } else {
    res
      .status(401)
      .json({ message: "ID 또는 비밀번호가 틀립니다. 다시 입력하세요." });
  }
}
