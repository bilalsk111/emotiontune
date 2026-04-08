const favModel = require("../models/fav.model")
const songModel = require("../models/song.model")
const storageService = require("../services/storage.service")
const id3 = require("node-id3")

const ALLOWED_MOODS = ["happy", "sad", "neutral", "calm", "angry", "surprise"]

async function uploadSong(req, res) {
    try {

        if (!req.file) {
            return res.status(400).json({ message: "Song file is required" })
        }

        const { mood } = req.body

        if (!ALLOWED_MOODS.includes(mood)) {
            return res.status(400).json({ message: "Invalid mood type" })
        }

        const songBuffer = req.file.buffer

        // read metadata
        const tags = id3.read(songBuffer) || {}

        const title = tags.title || "Unknown Title"
        const artist = tags.artist || "Unknown Artist"
        const year = tags.year || new Date().getFullYear()

        const uniqueSongName = `${Date.now()}-${title.replace(/\s+/g, "_")}.mp3`

        // upload song
        const songUploadPromise = storageService.uploadFile({
            buffer: songBuffer,
            filename: uniqueSongName,
            folder: "/cohort-2/moodify/songs"
        })

        // upload poster only if exists
        let posterUploadPromise = null

        if (tags.image?.imageBuffer) {
            const posterName = `${Date.now()}-${title.replace(/\s+/g, "_")}.jpeg`

            posterUploadPromise = storageService.uploadFile({
                buffer: tags.image.imageBuffer,
                filename: posterName,
                folder: "/cohort-2/moodify/posters"
            })
        }

        const [songFile, posterFile] = await Promise.all([
            songUploadPromise,
            posterUploadPromise
        ])

        const song = await songModel.create({
            title,
            year,
            artist,
            url: songFile.url,
            posterUrl: posterFile?.url || null,
            mood
        })

        res.status(201).json({
            message: "Song uploaded successfully",
            song
        })

    } catch (error) {
        console.error("Upload song error:", error)
        res.status(500).json({
            message: "Failed to upload song",
            error: error.message
        })
    }
}


async function getSong(req, res) {
    try {

        const { mood } = req.query

        let query = {}

        if (mood && mood !== "all") {
            query.mood = mood.toLowerCase()
        }

        const songs = await songModel
            .find(query)
            .select("title artist url posterUrl mood year")
            .lean()

        if (!songs.length) {
            return res.status(404).json({
                message: "No songs found for this mood"
            })
        }

        res.status(200).json({
            message: "Songs fetched successfully",
            songs
        })

    } catch (error) {
        res.status(500).json({
            message: "Server Error",
            error: error.message
        })
    }
}


const toggleFav = async (req, res) => {

    try {

        const userId = req.user?.id
        const songId = req.params?.id

        if (!userId || !songId) {
            return res.status(400).json({
                message: "User or Song ID missing"
            })
        }

        const existingFav = await favModel.findOne({
            user: userId,
            song: songId
        }).lean()

        if (existingFav) {

            await favModel.deleteOne({ _id: existingFav._id })

            return res.status(200).json({
                message: "Removed from favorites",
                isSaved: false
            })
        }

        await favModel.create({
            user: userId,
            song: songId
        })

        res.status(201).json({
            message: "Added to favorites",
            isSaved: true
        })

    } catch (error) {

        // handle duplicate race condition
        if (error.code === 11000) {
            return res.status(200).json({
                message: "Already in favorites",
                isSaved: true
            })
        }

        res.status(500).json({
            message: "Server Error",
            error: error.message
        })
    }
}


async function getFav(req, res) {

    try {

        const userId = req.user.id

        const fav = await favModel
            .find({ user: userId })
            .populate("song", "title artist posterUrl url mood year")
            .lean()

        res.status(200).json({
            success: true,
            fav
        })

    } catch (error) {

        res.status(500).json({
            message: "Error fetching favorites",
            error: error.message
        })
    }
}

module.exports = {
    uploadSong,
    getSong,
    toggleFav,
    getFav
}