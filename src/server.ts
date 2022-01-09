const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.post('/refresh', (req: any, res: any) => {
    const refreshToken = req.body.refreshToken
    console.log('hi')
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken
    })

    spotifyApi.refreshAccessToken()
        .then((data: any) =>
            res.json({
                accessToken: data.body.accessToken,
                expiresIn: data.body.expiresIn,
            })
                .catch(() => {
                    res.sendStatus(400)
                }))

})

app.post('/login', (req: any, res: any) => {
    const code = req.body.code
    console.log(code)
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
        .catch((error: any) => {
            res.sendStatus(400)
        })

})

// app.get('/lyrics', async (req: any, res: any) => {
//     const lyrics = await lyricsFinder(req.query.artist, req.query.track) || "No Lyrics found"
//     res.json({lyrics})
// })

app.listen(3001)