import React from 'react';
import History from './History.jsx';
import './../css/style.css';
import img from './images/pizzablue.png';

var Dashboard = (props) => (
  <div className="dashboard">
    <h1>Start Workout</h1>
    <div className="startButton">
      <img onClick= {props.goToCountdown} src="public/images/pizzablue.png" alt="Start"/>
    </div>
    <History workoutHistory={props.workoutHistory} workoutDate={props.workoutDate} workoutLength={props.workoutLength} loggedIn={props.loggedIn}/>
  </div>
);


export default Dashboard;
// window.Dashboard = Dashboard;
