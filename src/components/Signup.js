import React, { Component } from 'react';
import { Redirect, Link } from "react-router-dom";
import axios from 'axios';
import './Signup.css';

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fname: '',
      lname: '',
      email: '',
      username: '',
      picture: '',
      password: '',
      password_confirmation: '',
      signupSuccess: false,
      signUpError: false
    }

    this.signup = this.signup.bind(this);
    this.changeInput = this.changeInput.bind(this);
  }

  signup(e) {
    e.preventDefault();
    axios.post(`${this.props.url}/signup`,
      {
        fname: this.state.fname,
        lname: this.state.lname,
        email: this.state.email,
        username: this.state.username,
        picture: this.state.picture,
        password: this.state.password,
        password_confirmation: this.state.password_confirmation
      })
      .then(res => {
        this.props.setUser(res.data, false);
        this.setState({
          signupSuccess: true
        })
      }).catch(err => {
        this.setState({
          signUpError: 'All field are required'
        });
      })
  }

  changeInput(e) {
    this.setState({
      [e.target.name]: e.target.value,
      signUpError: false
    })
  }

  render() {
    return (
      <div>
      {this.state.signupSuccess &&
        <Redirect to='/home' />
      }
      {!this.state.signupSuccess &&
        <div className="signup auth">
          <div className="signupContainer authContainer">
            <div className="nameApp"></div>
            <div className="signupTitle authTitle">SIGN UP</div>
            <form onSubmit={this.signup} className="signupForm authForm">
              <div className="signupFormItemLine authFormItem">
                <div className="subFormItem">
                  <input className="authInput" type="text" name="fname" value={this.state.fname} placeholder='First name' onChange={this.changeInput} />
                </div>
                <div className="subFormItem">
                  <input className="authInput" type="text" name="lname" value={this.state.lname} placeholder='Last name' onChange={this.changeInput} />
                </div>
              </div>
              <div className="signupFormItem authFormItem">
                <input className="authInput" type="text" name="email" value={this.state.email} placeholder='E-mail' onChange={this.changeInput} />
              </div>
              <div className="signupFormItem authFormItem">
                <input className="authInput" type="text" name="username" value={this.state.username} placeholder='Username' onChange={this.changeInput} />
              </div>
              <div className="signupFormItem authFormItem">
                <input className="authInput" type="text" name="picture" value={this.state.picture} placeholder='Picture url' onChange={this.changeInput} />
              </div>
              <div className="signupFormItem authFormItem">
                <input className="authInput" type="password" name="password" value={this.state.password} placeholder='Password' onChange={this.changeInput} />
              </div>
              <div className="signupFormItem authFormItem">
                <input className="authInput" type="password" name="password_confirmation" value={this.state.password_confirmation} placeholder='Password confirmation' onChange={this.changeInput} />
              </div>
              {this.state.signUpError &&
                <div className="errorAuth">{this.state.signUpError}</div>
              }
              <div className="signupFormItem authFormItem">
                <input className="goButton" type="submit" value="Go" />
              </div>
            </form>
            <div className="authLink">
                <Link to='/login'>LOG IN</Link>
            </div>
          </div>
        </div>
      }
      </div>
    );
  }
}

export default Signup;
