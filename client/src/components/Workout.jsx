import React from 'react';
import Timer from './Timer.jsx';
import Exercise from './Exercise.jsx';
import './../css/style.css';

class Workout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      warmupActive: false,
      workoutActive: false,
      cooldownActive: false
    }
    this.highlightActiveTitle.bind(this);
  }

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  sets css on mount and updates with current exercise (triggered on timer() on App.js)
* * * * * * * * * * * * * * * * * * * * * * * * * *  * * * * * * * *  * * * * * * * * * * */

  componentDidMount() {
    this.highlightActiveTitle();
  }

  highlightActiveTitle() {
    if (this.props.exercise.type === 'warmup') {
      document.body.style = 'background: #ffffe5';
      this.setState({warmupActive: true, workoutActive: false, cooldownActive: false});
    } else if (this.props.exercise.type === 'workout') {
      document.body.style = 'background: #e5f9ff';
      this.setState({warmupActive: false, workoutActive: true, cooldownActive: false});
    } else if (this.props.exercise.type === 'cooldown') {
      document.body.style = 'background: #f2ffe5';
      this.setState({warmupActive: false, workoutActive: false, cooldownActive: true});
    } else {
      console.log('workout type does not exist')
    }
  }

/* * * * * * * * * * * * * * * * * * * * * * * * * * *
  Change css based on which exercise type
* * * * * * * * * * * * * * * * * * * * * * * * * * */

   render() {
    return (
      <div className="workout">
        <span className={'warmupTitle ' + (this.state.warmupActive ? 'activeTitle' : null)}>Warmup</span>
        <span className={'workoutTitle ' + (this.state.workoutActive ? 'activeTitle' : null)}>Workout</span>
        <span className={'cooldownTitle ' + (this.state.cooldownActive ? 'activeTitle' : null)}>Cooldown</span>

        <Timer timer= {this.props.timer} />
        <Exercise exercise={this.props.exercise} />
        <button onClick={this.props.goToDashboard} className="blackButton">Quit & Back To Dashboard</button>
        <button onClick={this.props.goToSummary} className="blackButton">Summary</button>
      </div>
    );
  }

} // End of Class


export default Workout;
// window.Workout = Workout;

