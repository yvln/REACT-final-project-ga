import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import axios from 'axios';

import Cookies from './helpers/Cookies';
import Login from './components/Login';
import Signup from './components/Signup';
import Header from './components/Header';
import Home from './components/Home';
import Gameview from './components/Gameview';

import './App.css';

// This class PrivateRoute is from https://reacttraining.com/react-router/web/example/auth-workflow
// It allows to redirect the user when not authenticated.
class PrivateRoute extends Component {
  render() {
    // rename component in 'Component' to fit the convention
    // ...rest = every props except component
    const { component: Component, ...rest } = this.props;
    return (
      // ...rest = tranfers all props to the Route
      <Route {...rest}
        render={ props => (
          // if authenticate, render the Component 
          this.props.isAuthenticated ?
          ( <Component {...props}
              user={this.props.isAuthenticated}
              logout={this.props.logout}
              url={this.props.url}
              games={this.props.games}
              whichGameClicked={this.props.whichGameClicked}
              whichGame={this.props.whichGame} />) : (
            // if not, redirect to /login
            <Redirect to={
              {
                pathname: '/login',
                // give to the Login page the route where the user wanted to go in the first place 
                state: { from: props.location }
              }
            } />
          )
        )} />
    )
  }
}

class App extends Component {
  
  url = 'http://localhost:8080';
  
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      games: [],
      whichGame: {}
    }
    this.setUser = this.setUser.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getGames = this.getGames.bind(this);
    this.logout = this.logout.bind(this);
    this.whichGameClicked = this.whichGameClicked.bind(this);
  }
  
  // LIFE CYCLE 
  
  componentDidMount() {
    this.getGames();
  }
  
  // AUTHENTICATION 
  
  setUser(user){
    Cookies.set('token', user.token);
    this.setState({
      user: user
    });
  }
  
  isAuthenticated() {
    return this.state.user;
  }
  
  logout() {
    console.log('function logout');
  }
  
  // GAMES
  
  getGames() {
    axios.get(`${this.url}/games`)
      .then(response => {
        console.log("response in GET GAMES. ID ?", response);
  			this.setState({
  				games: response.data.allGames
  			})
		}).catch(err => {console.log('err', err)});
  }
  
  whichGameClicked(game) {
    this.setState({
      whichGame: game
    })
  }
  
  // RENDER
  
  render() {
    return (
      <div>
      { this.state.user &&
          <Header
            user={this.state.user}
            whichGameClicked={this.whichGameClicked}
            games={this.state.games}
            logout={this.logout} />
      }

      <BrowserRouter>
        <div className='App'>
          <Route
            exact path="/"
            render = {() => 
              <Redirect to="/home" />
            } />
          <Route 
            exact path='/login'
            render = {() => {
              return (
                <Login 
                  url={this.url}
                  setUser={this.setUser} />
              )
            }} />
          <Route 
            exact path='/signup'
            render = {() => {
              return (
                <Signup 
                  url={this.url}
                  setUser={this.setUser} />
              )
            }} />
            <PrivateRoute
              exact path='/home'
              component={Home}
              isAuthenticated={this.isAuthenticated()}
              logout={this.logout}
              url={this.url}
              games={this.state.games}
              whichGameClicked={this.whichGameClicked} />
            <PrivateRoute
              exact path='/games'
              component={Gameview} 
              isAuthenticated={this.isAuthenticated()}
              logout={this.logout}
              url={this.url}
              games={this.state.games}
              whichGame={this.state.whichGame} />
        </div>
      </BrowserRouter>
      </div>
    );
  }
}

// Quand signup ou login => redirect home

export default App;
