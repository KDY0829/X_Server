// 글, 리스트 관련
import express from "express";
import * as postController from "../controller/post.mjs";

const router = express.Router();

// 전체 포스트 가져오기
// 특정 id에 대한 포스트 가져오기
// http://127.0.0.1:8000/post
// http://127.0.0.1:8000/post?userid=XXX
router.get("/", postController.getPosts);

// 글 번호에 대한 포스트 가져오기
// http://127.0.0.1:8000/post/:id
router.get("/:id", postController.getPost);

// 포스트 쓰기
// http://127.0.0.1:8000/post/
router.post("/", postController.createPost);

// 포스트 수정하기
// http://127.0.0.1:8000/post/:id
router.put("/:id", postController.updatePost);

// 포스트 삭제하기
// http://127.0.0.1:8000/post/:id
router.delete("/:id", postController.deletePost);

export default router;
