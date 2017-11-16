import React, { Component } from 'react';
import { Route, Link } from "react-router-dom";
import './Home.css';

class Home extends Component {
  constructor(props){
    super(props);
    
    this.renderGamesBox = this.renderGamesBox.bind(this);
    this.renderStatUser = this.renderStatUser.bind(this);
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
    console.log('STAT USER');
    console.log(this.props.user);
  }

  render() {
    return (
      <div className="Home">
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