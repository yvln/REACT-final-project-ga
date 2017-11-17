import React, { Component } from 'react';
import { Route, Link } from "react-router-dom";
import './Home.css';

class Home extends Component {
  constructor(props){
    super(props);
    
    this.state = {
      scoreData: []
    }
    
    this.renderGamesBox = this.renderGamesBox.bind(this);
    this.renderStatUser = this.renderStatUser.bind(this);
  }

  componentDidMount() {
    this.props.initializeDay();
    this.setState({
      scoreData: this.props.scoreData
    });
  }
  
  renderGamesBox() {
    const games = [];
    if (this.props.games !== undefined) {
      this.props.games.map( e => {
        games.push(
          <Link className="gameBox" 
             to='/games'
             key={e.name}
             onClick={ () => { this.props.whichGameClicked(e); }}>
            <div className="gameName">{e.name}</div>
            <div className="gameRules">{e.rules}</div>
          </Link>
        )
      })
    }
    return games;
  }
      
  renderStatUser() {
    let userData = 0;
    if (this.props.user[`max_score_game_${this.props.user.level}`] === null) {
      userData = 0
    } else {
      userData = this.props.user[`max_score_game_${this.props.user.level}`]
    }
    return this.props.games.map( game => {
      console.log('this.props.games', this.props.games);
      console.log('game', game);
      console.log('this.props.user.level', this.props.user.level);
      return(
        <div className="oneStat">
          <div className="gameNameStat">{game.name}</div>
          <div className="userGameStat">{this.props.scoreData[this.props.games.indexOf(game)]}</div>
          <div className="maxGameStat">{game[`points_to_reach_level_${this.props.user.level}`]}</div>
        </div>
      )
    })
  }

  render() {
    // console.log(this.props.user);
    // console.log(this.props.games);
    return (
      <div className="Home">
        <div className="Greetings">Hello, {this.props.user.fname}!</div>
        <div className="HomeGames">
          {this.renderGamesBox()}
        </div>
        <div className="HomeStat">
          {this.renderStatUser()}
        </div>
      </div>
    );
  }
}

export default Home;