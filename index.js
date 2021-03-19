const express = require('express')
const path = require('path')
const cors = require('cors')
require('dotenv').config();

const ToneAnalyzerV3 = require('ibm-watson/tone-analyzer/v3');
const { IamAuthenticator } = require('ibm-watson/auth');

const toneAnalyzer = new ToneAnalyzerV3({
    version: '2017-09-21',
    authenticator: new IamAuthenticator({
        apikey: process.env.API_KEY,
    }),
    serviceUrl:  process.env.URL,
});


const app = express()

app.use(express.static(__dirname + '/html'))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/autor', (req, res) => {
    res.statusCode = 200;
    res.send({ "alumno": "PedroHS" , "servicio":"Cloud Foundry en IBM Cloud"})
    //res.sendFile(path.join(__dirname, 'html', 'index.html'))
})

app.post('/', (req, res) => {
    const texto = req.body.text;
//     const text = 'Team, I know that times are tough! Product '
//   + 'sales have been disappointing for the past three '
//   + 'quarters. We have a competitive product, but we '
//   + 'need to do a better job of selling it!';
    const toneParams = {
        toneInput: { 'text': texto },
        contentType: 'application/json',
    };
    //console.log(req.body.text)
    toneAnalyzer.tone(toneParams)
        .then(toneAnalysis => {
            JSON.stringify(toneAnalysis, null, 2);
            res.send({ "respuesta": toneAnalysis.result })
        })
        .catch(err => {
            console.log('error:', err);
        });
    
})


app.listen(3000, function () {
    console.log('app is running in http://localhost:3000')
})