'use strict';

const express = require("express");
const app = express();
app.use(express.json());

const jsonData = require("./Movie_Data/data.json");

const dotenv = require(`dotenv`);

const axios = require("axios");

const pg = require("pg");

// const { Client } = require('pg/lib');

dotenv.config();

const PORT = process.env.PORT;
const APIKEY = process.env.APIKEY;


const DATABASE_URL = process.env.DATABASE_URL;
const client = new pg.Client(DATABASE_URL);


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>[Home Page]
app.get('/', home_page);

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>[Favorite Page]
app.get('/favorite', favorite_page);


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>[Trend List]
app.get('/trending', trend_list);


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>[Searching for a Movie]
app.get('/searchmovie', searching_for_movie);


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>[Add a Movie in DB]
app.post("/addMovie", addMovie);


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>[Get a Movie from DB]
app.get("/getMovies", getMovies);

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>[Updete a Movie in DB by id]
app.put("/UPDATE/:id", updateMovie);


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>[Delete a Movie in DB by id]
app.delete("/DELETE/:id", deleteMovie)


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>[Get a movie by its id]
app.get("/getMovie/:id", getMovieByid);


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>[404]
app.get('*', page_not_found);

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>[500]
app.use(errorHandler);



// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^[404]
function page_not_found(req, res) {
    res.status(404).send('Page not found error');
}
// ________________________________________________________________________[404]


// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^[500]
function errorHandler(error, req, res, next) {

    const err = {
        status: 500,
        message: error,
    };

    res.status(500).send(err);
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




// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^[Add Movie in DB]
function addMovie(req, res) {
    let movieInsert = req.body;
    const cols = Object.keys(req.body).join(",");
    let valDoller = "";
    Object.keys(req.body).forEach((item, idx, arr) => {
        valDoller += `$${idx+1} ${idx < arr.length-1 ? ",": ""}`;
    });

    const sql = `INSERT INTO overmovie(${cols}) VALUES(${valDoller}) RETURNING *;`
        // const sql = `insert into overmovie(${cols}) VALUES(${valDoller}) RETURNING *;`
        // console.log(sql);
        // let value = [movieInsert.title, movieInsert.release_date, movieInsert.poster, movieInsert.overview, movieInsert.comment];
    client.query(sql, Object.values(req.body)).then((data) => {

        res.status(201).json(data.rows);

    }).catch(error => {
        errorHandler(error, req, res);
    })
}
// ________________________________________________________________________[Add Movie in DB]



// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^[Get Movie from DB]
function getMovies(req, res) {

    const sql = `SELECT * FROM overMovie`;

    client.query(sql).then(data => {

        return res.status(200).json(data.rows);

    }).catch(error => {
        errorHandler(error, req, res);
    })
}
// ________________________________________________________________________[Get Movie from DB]


// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^[Updete a Movie in DB by id]
function updateMovie(req, res) {
    const id = req.params.id;
    const upMov = req.body;

    const sql = `UPDATE overMovie SET title=$1, release_date=$2, poster=$3, overview=$4, comment=$5 WHERE id=${id} RETURNING *;`;

    const values = [upMov.title, upMov.release_date, upMov.poster, upMov.overview, upMov.comment];

    client.query(sql, values).then(data => {

        return res.status(200).json(data.rows);

    }).catch(error => {
        errorHandler(error, req, res);
    })
};
// ________________________________________________________________________[Updete a Movie in DB by id]


// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^[Delete a Movie in DB by id]
function deleteMovie(req, res) {
    const id = req.params.id;

    const sql = `DELETE FROM overMovie WHERE id=${id};`

    client.query(sql).then(() => {

        return res.status(204).json([]);

    }).catch(error => {
        errorHandler(error, req, res);
    })
}
// ________________________________________________________________________[Delete a Movie in DB by id]



// ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^[Get a movie by its id]
function getMovieByid(req, res) {
    const id = req.params.id;
    const sql = `SELECT * FROM overMovie WHERE id=${id};`

    client.query(sql).then(data => {

        res.status(200).json(data.rows);

    }).catch(error => {
        console.log(error);
        errorHandler(error, req, res);
    })
}
// ________________________________________________________________________[Get a movie by its id]

client.connect().then(() => {

    app.listen(PORT, () => {
        console.log(`Listen to port ${PORT}`);
    });
});