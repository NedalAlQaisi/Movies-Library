'use strict';

const express = require('express');
const app = express();

const jsonData = require("./Movie_Data/data.json");


const dotenv = require(`dotenv`);
dotenv.config();

const axios = require("axios");

const PORT = process.env.PORT;
const APIKEY = process.env.APIKEY;


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>[Home Page]
app.get('/', home_page);

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>[Favorite Page]
app.get('/favorite', favorite_page);


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>[Trend List]
app.get('/trending', trend_list);


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>[Searching for a Movie]
app.get('/searchmovie', searching_for_movie);


// app.get('/reviews', reviews)
// app.post("/addMovie", addMovieHandler);
// app.get("/getMovies", getMoviesHandler);

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>[404]
app.get('*', page_not_found);

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>[500]
app.use(error_page);



// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^[404]
function page_not_found(req, res) {
    res.status(404).send('Page not found error');
}
// ________________________________________________________________________[404]


// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^[500]
function error_page(error, req, res) {

    const eRROr = {
        status: 500,
        message: error
    }

    res.status(500).send(eRROr);
}
// ________________________________________________________________________[500]



function movies(id, title, release_date, poster_path, overview) {

    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
};


// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^[Home Page]
function home_page(req, res) {
    let movie = new movies(jsonData.id, jsonData.title, jsonData.poster_path, jsonData.overview);


    return res.status(200).json(movie);
};
// ________________________________________________________________________[Home Page]


// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^[Favorite Page]
function favorite_page(req, res) {
    return res.status(200).send("Welcome to Favorite Page");
};
// ________________________________________________________________________[Favorite Page]



// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^[Trend List]
function trend_list(req, res) {
    let trendMovie = [];
    axios.get(`https://api.themoviedb.org/3/trending/all/day?api_key=${APIKEY}&language=en-US`).then(value => {

        value.data.results.forEach(mOv => {
            let topMovie = new movies(mOv.id, mOv.title, mOv.release_date, mOv.poster_path, mOv.overview);
            trendMovie.push(topMovie)
        })
        return res.status(200).json(trendMovie);



    }).catch(error => {
        errorHandler(error, req, res);
    })
}
// ________________________________________________________________________[Trend List]



// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^[Searching for a Movie]
function searching_for_movie(req, res) {

    let serachQuery = req.query.search;

    let searchMovie = [];

    axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${APIKEY}&language=en-US&query=${serachQuery}`).then(value => {

        value.data.results.forEach(mOv => {

            let themovie = new movies(mOv.id, mOv.title, mOv.release_date, mOv.poster_path, mOv.overview);

            searchMovie.push(themovie);
        })

        return res.status(200).json(searchMovie);

    }).catch(error => {
        errorHandler(error, req, res);
    })
}
// ________________________________________________________________________[Searching for a Movie]

/*
function addMovieHandler(req, res) {
    let movie = req.body;
    const sql = `INSERT INTO overmovie(title, release_date, poster, overview, comment) VALUES(MOV1, MOV2, MOV3, MOV4, MOV5) RETURNING *;`
    let value = [movie.title, movie.release_date, movie.poster_path, movie.overview, movie.comment];
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



*/




app.listen(PORT, () => {
    console.log(`Listen to port ${PORT}`);

});