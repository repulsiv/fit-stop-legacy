var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var seed = require('./seedDB.js');


/* * * * * * * * * * * * * * * * * * * * * * * * * * *
  Connection to MongoDB instance
* * * * * * * * * * * * * * * * * * * * * * * * * * */


const MONGODB_URI = process.env.MONGODB_URI  || 'mongodb://localhost/fit-stop';
mongoose.connect(MONGODB_URI);

mongoose.connection.on('error', function(error) {
  console.log('database connection error: ' + error);
});


/* * * * * * * * * * * * * * * * * * * * * * * * * * *
  Definition of Schemas
* * * * * * * * * * * * * * * * * * * * * * * * * * */

var exerciseSchema = new Schema({
  name: String,
  description: String,
  type: String,
  picture: String,
  environment: String,
  muscleGroup: String,
  difficulty: String
});

var userSchema = new Schema({
  username: String,
  password: String,
  preferences: {},
  workoutHistory: []
});



/* * * * * * * * * * * * * * * * * * * * * * * * * * *
   Model Creation based on Schemas
* * * * * * * * * * * * * * * * * * * * * * * * * * */



var Exercise = mongoose.model('Exercise', exerciseSchema);
var User = mongoose.model('User', userSchema);

Exercise.collection.drop();

// Inserting data - // Uncomment (and deploy in heroku) first time when no data is there
Exercise.insertMany(seed, (err) => {
  console.log(err);
})



module.exports.exerciseModel = Exercise;
module.exports.userModel = User;
module.exports.mongoose = mongoose;

