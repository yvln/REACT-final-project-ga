import React, { Component } from 'react';
import { Redirect, Link } from "react-router-dom";
import axios from 'axios';
import './Login.css';

class Login extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      email: '',
      password: '',
      loginSuccess: false,
      loginError: false
    }
    
    this.login = this.login.bind(this);
    this.changeInput = this.changeInput.bind(this);
    this.loginWithFB = this.loginWithFB.bind(this);
  }
  
  componentDidMount() {
    window.fbAsyncInit = function() {
      window.FB.init({
        appId      : '153252831439424',
        xfbml      : true,
        version    : 'v2.11'
      });
      window.FB.AppEvents.logPageView();
      window.FB.getLoginStatus();
    };

    (function(d, s, id){
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement(s); js.id = id;
       js.src = "https://connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
     }(document, 'script', 'facebook-jssdk'));
  }
  
  loginWithFB() {
    window.FB.login((response) => {
      if (response.status === 'connected') {
        const userID = response.authResponse.userID
        window.FB.api(`/me?fields=id,email,name,picture`, (response) => {
          axios.post(`${this.props.url}/authfb`,{
            email: response.email,
            name: response.name,
            picture: response.picture.data.url
          }).then( res => {
            this.props.setUser(res.data, true);
            this.setState({
              loginSuccess: true
            })
          }).catch( err => {
            console.log('err', err);
          })
        });
      }
    }, {scope: 'email'});
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
        this.setState({
          loginError: 'Email or Password incorrect'
        });
      })
  }
  
  changeInput(e) {
    this.setState({
      [e.target.name]: e.target.value,
      loginError: false
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
                {this.state.loginError &&
                <div className="errorAuth">{this.state.loginError}</div>
                }
                <div className="loginFormItem authFormItem">
                  <input className="goButton" type="submit" value="Go" />
                </div>
              </form>
              <div className="authLink">
                  <Link to='/signup'>SIGN UP</Link>
              </div>
              <div className='loginFB' onClick={this.loginWithFB}>
                Connect with FB
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default Login;