require('dotenv').config();

const express = require('express');
const morgan = require('morgan')
const axios = require('axios');
const cron = require('node-cron');
const instance = axios.create();

const app = express();

let cache={}

cron.schedule('0 0 * * *', () => {
    console.log('****** Cron Job At Work ********');
    cache={};
    console.log('****** Cron Job At Work ********');
})

app.use(morgan('dev'));

app.get('/', (req,res) => {
    let queryParam = (Object.keys(req.query)[0])
    let url = `http://omdbapi.com/?${queryParam}=${req.query[queryParam]}&apikey=${process.env.OMDB_API_KEY}`
    if (cache[url]) {
        res.send(cache[url]);
    } else {
        instance.get(url)
                .then(response => cache[url] = response.data)
                .then(response => res.send(response))
                .catch(err => res.send(err));
    }
});

app.get(`/:id`, (req, res) => {
    let url = `http://omdbapi.com/?s=${req.params.id}&apikey=${process.env.OMDB_API_KEY}`
    if (cache[url]) {
        res.send(cache[url]);
    } else {
        axios.get(url)
            .then(response => cache[url] = response.data)
            .then(response => res.send(response))
            .catch(err => res.send(err));
    }
});

module.exports = app;