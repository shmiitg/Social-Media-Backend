const express = require("express");
const router = express.Router();
const db = require("../config/db");

const authenticateToken = require("../middleware/verifyJWT");

// get all posts
router.get("/all", (req, res) => {
    try {
        const posts =
            "SELECT post.id, post.description, user.email, user.name FROM post LEFT JOIN user ON post.userId=user.id";
        db.query(posts, [], (err, data) => {
            if (err) {
                return res.status(401).json({ error: "Something went wrong" });
            }
            res.status(200).json({ posts: data });
        });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

// get the post with given id
router.get("/:postId", (req, res) => {
    try {
        const postId = req.params.postId;
        const findPost = "SELECT * FROM post WHERE id = ?";
        db.query(findPost, [postId], (err, data) => {
            if (err) {
                return res.status(401).json({ error: "Something went wrong" });
            }
            if (data.length === 0) {
                return res.status(409).json({ error: "The post does not exists" });
            }
            res.status(200).json({ post: data[0] });
        });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

// create a new post
router.post("/new", authenticateToken, (req, res) => {
    try {
        const id = req.user.id;
        const { description } = req.body;
        const findUser = "SELECT * FROM user WHERE id = ?";
        db.query(findUser, [id], (err, data) => {
            if (err) {
                return res
                    .status(401)
                    .json({ error: "Couldn't create the new post. Please try again!" });
            }
            const userId = data[0].id;
            const newPost = "INSERT INTO post (description, userId) VALUES (?)";
            const values = [description, userId];
            db.query(newPost, [values], (err, data) => {
                if (err) {
                    return res
                        .status(500)
                        .json({ error: "Couldn't create the new post. Please try again!" });
                }
                res.status(201).json({
                    post: data,
                    success: "Successfully added a new post!",
                });
            });
        });
    } catch (err) {
        return res.status(500).json({ error: "Something went wrong. Please try again!" });
    }
});

// update the post with given id
router.put("/:id", authenticateToken, (req, res) => {
    try {
        const userId = req.user.id;
        const postId = req.params.id;
        const { description } = req.body;
        const findPost = "UPDATE post SET description = ? WHERE id = ? AND userId = ?";
        db.query(findPost, [description, postId, userId], (err, data) => {
            if (err) {
                return res.status(401).json({ error: "Couldn't update post. Please try again!" });
            }
            res.status(200).json({ success: "Succesfully updated post" });
        });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong. Please try again!" });
    }
});

// delete the post with given id
router.delete("/:id", authenticateToken, (req, res) => {
    try {
        const userId = req.user.id;
        const postId = req.params.id;
        const deletePost = "DELETE FROM post WHERE id = ? AND userId = ?";
        db.query(deletePost, [postId, userId], (err, data) => {
            if (err) {
                return res.status(401).json({ error: "Couldn't delete post. Please try again!" });
            }
            res.status(200).json({ success: "Post deleted successfully" });
        });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong. Please try again!" });
    }
});

// get the posts based on current page no
router.get("/page/:pageNo/:limit", (req, res) => {
    try {
        const pageNo = Number(req.params.pageNo);
        const limit = Number(req.params.limit);
        const getPosts =
            "SELECT post.id, post.description, user.email, user.name FROM post LEFT JOIN user ON post.userId=user.id LIMIT ? OFFSET ?";
        db.query(getPosts, [limit, (pageNo - 1) * limit], (err, data) => {
            if (err) {
                return res.status(401).json({ error: err });
            }
            res.status(200).json({ posts: data });
        });
    } catch (err) {
        res.status(500).json({ error: "Something went wrong" });
    }
});

module.exports = router;
