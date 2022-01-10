const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')
const SpotifyWebApi = require('spotify-web-api-node');
const lyricsFinder = require('lyrics-finder');

const app = express();
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

const port = process.env.PORT || 5000;


console.log('hehe')

// @ts-ignore
app.get('/', function (req, res) {
    res.send('hello world');
})

// @ts-ignore
app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken
    })


    spotifyApi.refreshAccessToken()
        // @ts-ignore
        .then((data) =>
            res.json({
                accessToken: data.body.accessToken,
                expiresIn: data.body.expiresIn,
            })
                .catch(() => {
                    res.sendStatus(400)
                }))

})
// @ts-ignore
app.post('/login', (req, res) => {
    const code = req.body.code
    console.log(code)
    const spotifyApi = new SpotifyWebApi({
        redirectUri: process.env.REDIRECT_URI,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
    })


    spotifyApi
        .authorizationCodeGrant(code)
        // @ts-ignore
        .then((data) => {
            res.json({
                accessToken: data.body.access_token,
                refreshToken: data.body.refresh_token,
                expiresIn: data.body.expires_in,
            })
        })
        // @ts-ignore
        .catch((error) => {
            res.sendStatus(400)
        })

})

app.get('/lyrics', async (req: any, res: any) => {
    const lyrics = await lyricsFinder(req.query.artist, req.query.track) || "No Lyrics found"
    res.json({lyrics})
})

app.listen(port)