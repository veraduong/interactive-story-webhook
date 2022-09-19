const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const util = require('util');
var pgp = require('pg-promise')();

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(bodyParser.json());

let dbConfig = {
	host: 'localhost',
	port: 5432,
	database: 'game_db',
	user: 'postgres',
	password: 'pwd'
};

const isProduction = process.env.NODE_ENV === 'production';
dbConfig = isProduction ? process.env.DATABASE_URL : dbConfig;
let db = pgp(dbConfig);


app.post("/games_complete", function(req, res) {
  console.log(`post/${util.inspect(req.body,false,null)}`); // print the request parameters

  let ending = '';

  // check if parameters exist (i.e., stuff sent in the request body)
  if (typeof req.body.sessionInfo.parameters !== 'undefined') {
    
    ending = req.body.sessionInfo.parameters['given-name'];
    ending = ending[0].toLowerCase();

    // create a new entry in the database for the ending chosen by the player
    let query = "INSERT INTO Complete (endName) VALUES ('" + ending + "');";
    db.any(query)
      .then(function (rows) {
        console.log("Inserted ending '" + ending + "' into database.");
      }).catch(function (err) {
        console.error("Error inserting into db.");
      });

  } else if (typeof req.body.fulfillmentInfo.tag !== 'undefined') {
    
    ending = req.body.fulfillmentInfo.tag;
    ending = ending.toLowerCase();

    // create a new entry in the database for the ending chosen by the player
    let query = "INSERT INTO Complete (endName) VALUES ('" + ending + "');";
    db.any(query)
      .then(function (rows) {
        console.log("Inserted ending '" + ending + "' into database.");
      }).catch(function (err) {
        console.error("Error inserting into db.");
      });

  } else {
    console.error("Parameter 'ending' of type @sys.given-name is EMPTY or undefined.")
    console.error("FulfillmentInfo does not contain webhook tag.")
  }
  
  /*
  var response = {
    message: [
      {
        "text": {
          "text": [
            `You, ${username}, find yourself in a dark, dark dungeon. There are bad things here. Option 1, 2, or 3. What would you like to do?`
          ],
          "allowPlaybackInterruption": true,  
        },
        "outputAudioText": {
          "allowPlaybackInterruption": true,
          "text": [
            `You, ${username}, find yourself in a dark, dark dungeon. There are bad things here. Option 1, 2, or 3. What would you like to do?`
          ]
        }
      }  
    ]
  };

  return res.json({
    fulfillmentResponse: response
  });
  */

});

app.post("/games_started", function(req, res) {
  console.log(`post/${util.inspect(req.body,false,null)}`); // print the request parameters

  let page = '';

  // check if parameters exist (i.e., stuff sent in the request body)
  if (typeof req.body.pageInfo.currentPage !== 'undefined' && typeof req.body.fulfillmentInfo.tag !== 'undefined') {
    
    page = req.body.pageInfo.currentPage;
    page_tag = req.body.fulfillmentInfo.tag;

    // create a new entry in the database for the page the player is on
    let query = "INSERT INTO Play (pageID, pageTag) VALUES ('" + page + "', '" + page_tag + "');";
    db.any(query)
      .then(function (rows) {
        console.log("Inserted page '" + page + "' with tag '" + page_tag + "' into database.");
      }).catch(function (err) {
        console.error("Error inserting into db.");
      });

  } else if (typeof req.body.pageInfo.currentPage !== 'undefined') {

    page = req.body.pageInfo.currentPage;

    // create a new entry in the database for the page the player is on
    let query = "INSERT INTO Play (pageID) VALUES ('" + page + "');";
    db.any(query)
      .then(function (rows) {
        console.log("Inserted page '" + page + "' into database.");
      }).catch(function (err) {
        console.error("Error inserting into db.");
      });

  } else if (typeof req.body.fulfillmentInfo.tag !== 'undefined') {
    
    page_tag = req.body.fulfillmentInfo.tag;

    // create a new entry in the database for the page the player is on
    let query = "INSERT INTO Play (pageTag) VALUES ('" + page_tag + "');";
    db.any(query)
      .then(function (rows) {
        console.log("Inserted page with tag '" + page_tag + "' into database.");
      }).catch(function (err) {
        console.error("Error inserting into db.");
      });

  } else {
    console.error("Parameter 'currentPage' is EMPTY or undefined.")
    console.error("FulfillmentInfo does not contain webhook tag.")
  }

});


app.get('/', function(req, res) {
  // retrieve usage data from database
  let games_played = "SELECT COUNT(*) FROM Play;";
  let games_completed = "SELECT COUNT(*) FROM Complete;";
  let myrtle = "SELECT COUNT(*) FROM Complete WHERE endName = 'myrtle';";
  let bruce = "SELECT COUNT(*) FROM Complete WHERE endName = 'bruce';";
  let sebastian = "SELECT COUNT(*) FROM Complete WHERE endName = 'sebastian';";

  db.task('get-everything', task => {
    return task.batch([
        task.any(games_played),
        task.any(games_completed),
        task.any(myrtle),
        task.any(bruce),
        task.any(sebastian)
    ]);
  }).then(info => {
      //console.log(info);
      res.render('home',{
        games_played: info[0][0].count,
        games_completed: info[1][0].count,
        myrtle: info[2][0].count,
        bruce: info[3][0].count,
        sebastian: info[4][0].count
      });
  }).catch(err => {
      console.log('error', err);
      res.render('home', {
        
      });
  });
});

// window.onload = function () {
    
//   var chart = new CanvasJS.Chart("chartContainer", {
//     animationEnabled: true,
//     exportEnabled: true,
//     theme: "light1", // "light1", "light2", "dark1", "dark2"
//     title:{
//       text: "Game Stats"
//     },
//       axisY: {
//         includeZero: true
//       },
//     data: [{
//       type: "column", //change type to bar, line, area, pie, etc
//       //indexLabel: "{y}", //Shows y value on all Data Points
//       indexLabelFontColor: "#5A5757",
//           indexLabelFontSize: 16,
//       indexLabelPlacement: "outside",
//       dataPoints: [
//         { x: 10, y: document.getElementById("myr").value, indexLabel: "\u2605 Myrtle" },
//         { x: 20, y: document.getElementById("myr").value, indexLabel: "\u2605 Bruce" },
//         { x: 30, y: document.getElementById("myr").value, indexLabel: "\u2605 Sebastian" },
//         { x: 40, y: document.getElementById("myr").value, indexLabel: "\u2605 Games Started" },
//         { x: 50, y: document.getElementById("myr").value, indexLabel: "\u2605 Games Completed" }
//       ]
//     }]
//   });
//   chart.render();
  
//   }




const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
    console.log(`Express running → PORT ${server.address().port}`);
});