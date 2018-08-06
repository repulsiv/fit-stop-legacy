var express = require('express')
var bodyParser = require('body-parser');
var path = require('path');

var db = require('./db').mongoose;
var Exercise = require('./db').exerciseModel;
var User = require('./db').userModel;
var ObjectID = require('mongodb').ObjectID;


var bcrypt = require('bcrypt');
const saltRounds = 10;
var salt = bcrypt.genSaltSync(saltRounds);

var app = express();

app.listen(process.env.PORT || 3000);

app.use(express.static(__dirname + '/../client/public/dist'));
// app.use('/public', express.static('client/public'));
// app.use('/react', express.static('node_modules/react/dist'));
// app.use('/react-dom', express.static('node_modules/react-dom/dist'));
// app.use('/jquery', express.static('node_modules/jquery/dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

console.log('server is running');


/* * * * * * * * * * * * * * * * * * * * * * * * * * *
  API Routes
* * * * * * * * * * * * * * * * * * * * * * * * * * */

app.get('/', (req,res)=> {
  res.sendFile('index.html', { root: 'client/public'});
});
app.get('/workout', getWorkout);
app.get('/history', getHistory);

app.post('/addWorkout', addWorkout);
app.post('/login', checkLogin);
app.post('/signup', addSignup);

app.get('/getAllExercises', getAllExercises);
app.get('/getExercise/:name', getExercise);

/* * * * * * * * * * * * * * * * * * * * * * * * * * *
  Request Handlers
* * * * * * * * * * * * * * * * * * * * * * * * * * */

function getAllExercises(req, res)  {
  Exercise.find({type: 'workout'}, function(err, data) {
    if (err) res.status(400).send('Not found')
    res.send(JSON.stringify(data))
  })
}

function getExercise(req, res) {
  var returnObj = [];
  var requestedWorkout = req.params.name;

  Exercise.find({type: 'warmup'}, function(err, data) {
    if (err) {
      console.log(err);
    } else {
      var total = data.length - 1 ;
      var randomNum = Math.floor((Math.random() * total) + 0);
      returnObj.push(data[randomNum])
    }

    Exercise.find({name: requestedWorkout}, function(err, data) {
      if (err) {
        console.log(err);
      } else {
        returnObj.push(data[0]);
      }

      Exercise.find({type: 'cooldown'}, function(err, data) {
        if (err) {
          console.log(err);
        } else {
          var total = data.length - 1;
          var randomNum = Math.floor((Math.random() * total) + 0);
          returnObj.push(data[randomNum])
        }

        res.status('200').send(returnObj);
      })

    })

  })

  //  Exercise.find({type: 'cooldown'}, function(err, data) {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     var total = data.length;
  //     var randomNum = Math.floor((Math.random() * total-1) + 0);
  //     returnObj.push(data[randomNum])
  //   }
  // })

  // Exercise.findOne({type: 'workout', _id: requestedWorkoutID}, function(err, data) {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     returnObj.push(data);
  //   }
  // })

  // res.status('200').send(returnObj);
}

function getHistory(req, res) {
  var name = req.query.username;
  User.findOne({username: name}, function(err, data) {
    if(err) {
      console.log('err happened with cooldown retrieval: ' + err);
    } else{
      res.send(data.workoutHistory);
    }
  });
}

function getWorkout(req, res) {
  var returnObj = [];

  Exercise.find({type: 'warmup'}, function(err,data) {
    if(err) {
      console.log('err happened with cooldown retrieval: ' + err);
    } else {
      returnObj.push(data[Math.floor(Math.random()*data.length)]);
      returnObj.push(data[Math.floor(Math.random()*data.length)]);
      returnObj.push(data[Math.floor(Math.random()*data.length)]);

      Exercise.find({type: 'workout'}, function(err,data) {
        if(err) {
          console.log('err happened with cooldown retrieval: ' + err);
        } else {
          returnObj.push(data[Math.floor(Math.random()*data.length)]);
          returnObj.push(data[Math.floor(Math.random()*data.length)]);
          returnObj.push(data[Math.floor(Math.random()*data.length)]);
          returnObj.push(data[Math.floor(Math.random()*data.length)]);
          returnObj.push(data[Math.floor(Math.random()*data.length)]);
          returnObj.push(data[Math.floor(Math.random()*data.length)]);
          returnObj.push(data[Math.floor(Math.random()*data.length)]);
          returnObj.push(data[Math.floor(Math.random()*data.length)]);
          returnObj.push(data[Math.floor(Math.random()*data.length)]);

          Exercise.find({type: 'cooldown'}, function(err,data) {
            if(err) {
              console.log('err happened with cooldown retrieval: ' + err);
            } else {
              returnObj.push(data[Math.floor(Math.random()*data.length)]);
              returnObj.push(data[Math.floor(Math.random()*data.length)]);
              returnObj.push(data[Math.floor(Math.random()*data.length)]);

              console.log('exercise data sent succesfully');
              res.status('200').send(returnObj);
            }
          });
        }
      });
    }
  });
}

function addWorkout(req, res) {
  var name = req.body.username;
  var workoutObj = {};
  workoutObj.currentWorkout = req.body.currentWorkout;
  workoutObj.date = req.body.date;
  workoutObj.lengthOfWorkout = req.body.lengthOfWorkout;

  User.findOne({username: name}, function(err, user) {
    if (err) {
      console.log('err happened with cooldown retrieval: ' + err);
    } else {
      user.workoutHistory.unshift(workoutObj);
      user.save(function(err) {
        if (err) {
          console.log(err + ' error happened!');
        } else {
          console.log('user workouts updated');
          res.status(202).send('user workout history updated');
        }
      });
    }
  });
}


function checkLogin(req, res) {
  var name = req.body.username;
  var pass = req.body.password;

  if (!name || !pass) res.status(400).send('Log in attempt failed');

  User.findOne({username:name}, function(err, data) {
    if (err) {
      console.log("Database access error" + err);
    } else {
      if (data) {
        if (bcrypt.compareSync(pass, data.password)=== true) {
          res.status(200).send('Log in success');
        } else {
          res.status(400).send('Log in attempt failed');
        }
      } else {
        res.status(400).send('Log in attempt failed');
      }
    }
  });
}


function addSignup(req, res) {
  var name = req.body.username;
  var pass = req.body.password;
  var hash = bcrypt.hashSync(pass, salt);
  var id = new ObjectID();

  User.find({username: name}, function(err, user) {
    if (err) {
      console.log("Database access error" + err);
    } else {
      if (!user[0]) {
        var newUser = new User({
          _id: id,
          username: name,
          password: hash,
          preferences: {}
        });
        newUser.save(function(err) {
          if (err) {
            console.log(err);
          } else {
            res.status(200).send('User Created');
          }
        });
      } else {
        res.status(400).send('User exsists');
      }
    }
  });
}


