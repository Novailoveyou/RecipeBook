const express = require('express'),
  path = require('path'),
  bodyParser = require('body-parser'),
  cons = require('consolidate'),
  dust = require('dustjs-helpers'),
  pg = require('pg'),
  app = express();

const { Pool, Client } = require('pg');

const config = {
  user: 'eduonix',
  database: 'recipebookdb',
  password: secret,
  port: 5432, //Default port, change it if needed
};

// DB Connect String
const connect = 'postgres://eduonix:secret@localhost/recipebookdb';

// const pool = new pg.Pool({
//   connect: connect,
// });

const pool = new pg.Pool(config);

// const client = new Client({
//   connect: connect,
// });

// Assign Dust Engine To .dust Files
app.engine('dust', cons.dust);

// Set Default Ext .dust
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Get a recipes
app.get('/', (req, res, next) => {
  pool.connect((err, client, done) => {
    if (err) {
      return console.log(`Can not connect to the DB ${err}`);
    }
    client.query('SELECT * FROM recipes', function (err, result) {
      if (err) {
        console.log(err);
        res.status(400).send(err);
      }
      // res.status(200).send(result.rows);
      res.render('index', { recipes: result.rows });
      done();
    });
  });
});

// Submit a recipe
app.post('/add', (req, res) => {
  pool.connect((err, client, done) => {
    if (err) {
      return console.log(`Can not connect to the DB ${err}`);
    }
    client.query(
      'INSERT INTO recipes(name, ingredients, directions) VALUES($1, $2, $3)',
      [req.body.name, req.body.ingredients, req.body.directions]
    );

    done();
    res.redirect('/');
  });
});

// Delete a recipe
app.delete('/delete/:id', (req, res) => {
  pool.connect((err, client, done) => {
    if (err) {
      return console.log(`Can not connect to the DB ${err}`);
    }
    client.query('DELETE FROM recipes WHERE id = $1', [req.params.id]);

    done();
    res.sendStatus(200);
  });
});

// Edit a recipe
app.post('/edit', (req, res) => {
  pool.connect((err, client, done) => {
    if (err) {
      return console.log(`Can not connect to the DB ${err}`);
    }
    client.query(
      'UPDATE recipes SET name = $1, ingredients = $2, directions = $3 WHERE id = $4',
      [req.body.name, req.body.ingredients, req.body.directions, req.body.id]
    );

    done();
    res.redirect('/');
  });
});

// Server
app.listen(3000, () => {
  console.log('Server Started!!! Port: 3000');
});

// function getKeyByValue(object, value) {
//   return Object.keys(object).find((key) => object[key] === value);
// }

// const map = { test: '0', first: '1', second: '2' };
// console.log(getKeyByValue(map, '0'));

// console.log(map['test'] === map.test);

// let Rectangle = class {
//   constructor(height, width) {
//     this.height = height;
//     this.width = width;
//   }
// };
// console.log(Rectangle.name);
// // output: "Rectangle"

// const rect = new Rectangle(1, 2);
// console.log(rect.height);
