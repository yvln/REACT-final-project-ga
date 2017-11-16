import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import axios from 'axios';
import './Login.css';

class Login extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      email: '',
      password: '',
      loginSuccess: false
    }
    
    this.login = this.login.bind(this);
    this.changeInput = this.changeInput.bind(this);
  }
  
  login(e) {
    e.preventDefault();
    axios.post(`${this.props.url}/login`,
      {
        email: this.state.email,
        password: this.state.password,
        
      })
      .then(res => {
        this.props.setUser(res.data);
        this.setState({
          loginSuccess: true
        })
      }).catch(err => {
        console.log('Could not Log In:', err);
      })
  }
  
  changeInput(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render() {
    return (
      <div>
        {this.state.loginSuccess &&
            <Redirect to='/home' />
        }
        {!this.state.loginSuccess &&
          <div className="login auth">
            <div className="nameApp">Be EU</div>
            <div className="loginContainer authContainer">
              <div className="loginTitle authTitle">LOG IN</div>
              <form onSubmit={this.login} className="loginForm authForm">
                <div className="loginFormItem authFormItem">
                  <input className="authInput" type="text" name="email" value={this.state.email} placeholder='E-mail' onChange={this.changeInput}/>
                </div>
                <div className="loginFormItem authFormItem">
                  <input className="authInput" type="password" name="password" value={this.state.password} placeholder='Password' onChange={this.changeInput}/>
                </div>
                <div className="loginFormItem authFormItem">
                  <input className="goButton" type="submit" value="Go" />
                </div>
              </form>
              <div className="authLink"><a href='/signup'>SIGN UP</a></div>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default Login;