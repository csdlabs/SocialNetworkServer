require("dotenv").config()
const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const SpotifyWebApi = require("spotify-web-api-node")

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))



app.post("/refresh", (req: any, res: any) => {
    const refreshToken = req.body.refreshToken
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken,
    })

    spotifyApi
        .refreshAccessToken()
        .then((data: any) => {
            res.json({
                accessToken: data.body.accessToken,
                expiresIn: data.body.expiresIn,
            })
        })
        .catch((err: any) => {
            console.log(err)
            res.sendStatus(400)
        })
})

app.post("/login", (req: any, res: any) => {
    const code = req.body.code
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
    })

    spotifyApi
        .authorizationCodeGrant(code)
        .then((data: any) => {
            res.json({
                accessToken: data.body.access_token,
                refreshToken: data.body.refresh_token,
                expiresIn: data.body.expires_in,
            })
        })
        .catch((err: any) => {
            res.sendStatus(400)
        })
})



app.listen(process.env.PORT || 3001, function(){
    // @ts-ignore
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});