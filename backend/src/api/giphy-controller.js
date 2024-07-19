import express from "express";
import auth from "../utils/auth.js";
import axios from "axios"

const router = express.Router();

router.get("/:term", auth, async (req, res) => {
    const { userId, params } = req
    try {
        if (!userId) {
            return res.json({ message: "Unauthenticated" });
        }
        const response = await axios.get(`https://api.giphy.com/v1/gifs/search?api_key=${process.env.GIPHY_API_KEY}&q=${params.term.replace('_', '+')}&limit=25&offset=0&rating=g&lang=en&bundle=messaging_non_clips`)
        const data = response.data
        console.log(data)
        res.status(200).json({ data });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Something went wrong" });
    }
});

export default router;
