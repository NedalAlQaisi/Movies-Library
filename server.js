'use strict';

const express = require('express');

const app = express();

const jsonData = require("./Movie Data/data.json");

const dotenv = require('dotenv');
const axios = require("axios");
dotenv.config();

const PORT = process.env.PORT;
const APIKEY = process.env.APIKEY;


app.get('/', moviesHandler);
app.get('/favorite', welcomeToFavoriteHandler);
app.get('/reviews', reviews)
app.get('/trending', trendHandler);
app.get('/searchmovie', movieSearch);
app.post("/addMovie", addMovieHandler);
app.get("/getMovies", getMoviesHandler)
app.use(errorHandler);



function Movies(id, title, release_date, poster_path, overview) {

    this.id = id;
    this.title = title,
        this.release_date = release_date;
    this.poster_path = poster_path,
        this.overview = overview

};

function errorHandler(error, req, res) {

    const err = {
        status: 500,
        message: error
    }

    res.status(500).send(err);
};

function addMovieHandler(req, res) {
    let movies = req.body;
    const sql = `INSERT INTO overmovie(title, release_date, poster, overview, comment) VALUES(MOV1, MOV2, MOV3, MOV4, MOV5) RETURNING *;`
    let value = [movies.title, movies.release_date, movies.poster_path, movies.overview, movies.comment];
    client.query(sql, value).then((data) => {

        return res.status(201).json(data.rows);
    })
}

function getMoviesHandler(req, res) {
    const sql = `SELECT * FROM overmovie`;
    client.query(sql).then(data => {
        return res.status(200).json(data.rows);
    })
}


function welcomeToFavoriteHandler(req, res) {
    return res.status(200).send("Welcome to Favorite Page");
};

function moviesHandler(req, res) {
    let movies = new Movies(jsonData.title, jsonData.poster_path, jsonData.overview);;


    return res.status(200).json(movies);
};

app.listen(300, () => {
    console.log('Listen to port 300');

});