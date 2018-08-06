import React from 'react';
import './../css/style.css';

var SignUp = (props) => (
  <div className="signupPage">
    <h1>Sign Up</h1>
    <form onSubmit={props.signup}>
      <label htmlFor="username">Username:  </label>
      <input id="username" type="text" name="username"/>
      <label htmlFor="password">Password:</label>
      <input id="password" type="password" name="password"/>
      <input type="submit" value="Sign Up"/>
    </form>
  </div>
);


export default SignUp;
// window.SignUp = SignUp;

