import React, { Component, PropTypes } from 'react';
import history from '../utils/history'

class LoginForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {signingUp: false};
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearInput = this.clearInput.bind(this);
    this.onSigningUp = this.onSigningUp.bind(this);
    this.onLoggingIn = this.onLoggingIn.bind(this);
    this.login = this.login.bind(this);
  }

  clearInput() {
    this.refs.username.value = '';
    this.refs.pswd.value = '';
    this.refs.fname.value = '';
    this.refs.lname.value = '';
    this.refs.email.value = '';
  }

  onSigningUp() {
    this.setState({signingUp: true});
    $(".wrapper").addClass("wrapper-signup");

    $(".login-button").slideToggle("fast", function(){
      $(".signup-input").slideToggle("fast");
    });
    $(".signup-switch-button").slideToggle("fast");

    $(".reminder-1").slideToggle("fast");
    $(".reminder-2").slideToggle("fast");

    this.clearInput();
  }

  onLoggingIn() {
    this.setState({signingUp: false});
    $(".wrapper").removeClass("wrapper-signup");

    $(".signup-input").slideToggle("fast");
    $(".login-button").slideToggle("fast");
    $(".signup-switch-button").slideToggle("fast");

    $(".reminder-1").slideToggle("fast");
    $(".reminder-2").slideToggle("fast");

    this.clearInput();
  }

  login(username, pswd) {
    Parse.User.logIn(username, pswd, {
      success: (user) => {
        console.log("logged in"); 
        history.replaceState(null, '/app/solve');
      },
      error: (user, err) => {
        window.alert("Oops something is wrong. Please try again.");
      }
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    const _this = this;
    if (this.state.signingUp == false) {
      // logging in
      let username = this.refs.username.value.trim();
      let pswd = this.refs.pswd.value.trim();
      if (!pswd || !username) {
        window.alert("Wrong username/password. (For testing, please use hannah/hannah)");
        return;
      }
      this.login(username, pswd);
    } else {
      // signing up

      let username = this.refs.username.value.trim();
      let pswd = this.refs.pswd.value.trim();
      let fname = this.refs.fname.value.trim();
      let lname = this.refs.lname.value.trim();
      let email = this.refs.email.value.trim();
      if (!pswd || !username || !fname || !lname || !email) {
        window.alert("Missing fields");
        return;
      }

      const user = new Parse.User()
        .set("username", username)
        .set("password", pswd)
        .set("email", email)
        .set("first", fname)
        .set("last", lname);

      user.signUp(null, {
        success: (user) => {
          window.alert("Hooray! You are all set.")
          _this.login(username, pswd);
        },
        error: (user, error) => {
          switch (error.code) {
            case 100: window.alert("Please check network connection."); break;
            case 125: window.alert("Bad email format."); break;
            case 202: window.alert("Please pick different username."); break;
            case 203: window.alert("Please pick different email."); break;
            default: window.alert("Oops something is wrong. Please try later."); 
          }
        }
      });
    }
  }

  render() {
    return (
      <div id="login">
        <div className="formBox">
          <form className="inputForm" onSubmit={this.handleSubmit} ref="inputForm">

            <div className="input-set">
              <span className="fa fa-user"></span>
              <input type="text" placeholder="Username" ref="username" />
            </div>
            <div className="input-set">
              <span className="fa fa-lock"></span>
              <input type="password" placeholder="Password" ref="pswd" />
            </div>
            <input type="submit" className="button login-button" value="Log In" />

            <div className="signup-input">
              <div className="input-set">
                <span className="fa fa-caret-right"></span>
                <input type="text" placeholder="First Name" ref="fname" />
              </div>
              <div className="input-set">
                <span className="fa fa-caret-right"></span>
                <input type="text" placeholder="Last Name" ref="lname" />
              </div>
              <div className="input-set">
                <span className="fa fa-envelope"></span>
                <input type="text" placeholder="E-mail" ref="email" />
              </div>
              <input type="submit" className="button signup-button" value="Sign Up & Log In" />
            </div>

            <div className="reminder reminder-1">
              Don&apos;t have an account yet?
            </div>
            <div className="reminder reminder-2" onClick={this.onLoggingIn} >
              <span className="fa fa-arrow-left"></span>Going back to log in
            </div>
          </form>

          <input type="submit" className="button signup-button signup-switch-button" value="Sign Up" onClick={this.onSigningUp} />
        </div>
      </div>
    );
  }
};

export default LoginForm;
