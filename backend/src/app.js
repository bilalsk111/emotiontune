const express = require('express')
const path = require('path')
const app = express();
const cookieParser = require('cookie-parser')
const cors = require('cors')

app.use(express.json())
app.use(cookieParser())
app.use(cors({
  origin: true, 
  credentials: true, 
}))
app.use(express.static("./public"))

const authRouter = require('./routes/auth.route')
const songrouter = require('./routes/song.route')
const musicRouter = require("./routes/music.route");



app.use('/api/auth',authRouter)
app.use('/api/songs',songrouter)
app.use("/api/music", musicRouter);


app.get("*name", (req, res) => {
  res.sendFile(path.join(__dirname,"..","/public/index.html"));
});



module.exports = app