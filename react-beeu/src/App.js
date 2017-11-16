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
              whichGame={this.props.whichGame}
              isNextLevel={this.props.isNextLevel}
              lessTry={this.props.lessTry}
              lesstry={this.props.lesstry} />) : (
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
      whichGame: {},
      isNextLevel: false,
      lesstry: null
    }
    this.setUser = this.setUser.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getGames = this.getGames.bind(this);
    this.logout = this.logout.bind(this);
    this.whichGameClicked = this.whichGameClicked.bind(this);
    this.isNextLevel = this.isNextLevel.bind(this);
    this.lessTry = this.lessTry.bind(this);
  }
  
  // LIFE CYCLE 
  
  componentDidMount() {
    this.getGames();
  }
  
  // AUTHENTICATION 
  
  setUser(user){
    Cookies.set('token', user.token);
    this.setState({
      user: user,
      lesstry: user.number_try_game
    });
  }
  
  isAuthenticated() {
    return this.state.user;
  }
  
  logout() {
    this.setState({
      user: null
    })
  }
  
  // GAMES
  
  getGames() {
    axios.get(`${this.url}/games`)
      .then(response => {
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
  
  isNextLevel() {
    console.log('this.state.games',this.state.games);
    let next_level = true;
    for (let i = 1 ; i <= 6 ; i++ ) {
      if (this.state.user[`max_score_game_${i}`] !== this.state.games[`${i-1}`][`points_to_reach_level_${this.state.user.level}`]) {
        next_level = false;
      }
    }
    if (next_level = true) {
      this.setState({
        isNextLevel: true
      })
    }
  }
  
  lessTry(number) {
    axios.post(`${this.url}/games/updateNumberTry`, {
      new_nb_try: number,
      user_id: this.state.user.id
    }).then( res => {
      this.setState({
        lesstry: res.data.number_try_game
      })
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
            logout={this.logout}
            lesstry={this.state.lesstry} />
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
              whichGameClicked={this.whichGameClicked}
              isNextLevel={this.isNextLevel} />
            <PrivateRoute
              exact path='/games'
              component={Gameview} 
              isAuthenticated={this.isAuthenticated()}
              logout={this.logout}
              url={this.url}
              games={this.state.games}
              whichGame={this.state.whichGame}
              isNextLevel={this.isNextLevel}
              lessTry={this.lessTry}
              lesstry={this.state.lesstry} />
        </div>
      </BrowserRouter>
      </div>
    );
  }
}

// Quand signup ou login => redirect home

export default App;
