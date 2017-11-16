import React, { Component } from 'react';
import './Header.css';

class Header extends Component {
  constructor(props) {
    super(props);
    
    this.renderLevel = this.renderLevel.bind(this);
    this.renderListGames = this.renderListGames.bind(this);
  }
  
  renderLevel() {
    let level = this.props.user.level;
    const starsLevel = [];
    for (let i=0; i<level; i++) {
      starsLevel.push(
        <img className='starLevel' key={i} src='/images/starLevel.png' />
      )
    }
    return starsLevel;
  }

  renderListGames() {
    const listGames = [];
    if (this.props.games !== undefined) {
      this.props.games.map(e => {
        listGames.push(
          <div className='listGameHeader' key={e.name} onClick={() => {this.props.whichGameClicked(e)}}>{e.name}</div>
        )
      })
    }
    return listGames;
  }
  
  render() {
    return (
      <div className="Header">
        <div className="Games">Games
          <div className="listGames">{this.renderListGames()}</div>
        </div>
        <div className="NbTries">Tries left for today: {this.props.lesstry}</div>
        <div className="Name">{this.props.user.fname}</div>
        <div className="Picture">
          {!this.props.user.picture &&
            <img className='profilePic' src='/images/user.png' />
          }
          {this.props.user.picture &&
            <img className='profilePic' src={this.props.user.picture} />
          }
        </div>
        <div className="LastTry">
          {!this.props.user.last_try &&
            <span>Play to improve your score!</span>
          }
          {this.props.user.last_try &&
            <span>Last try: {this.props.user.last_try.substring(0, 10)}</span>
          }
        </div>
        <div className="Level">{this.renderLevel()}</div>
        <div className="Logout" onClick={this.props.lougout}>Log Out</div>
      </div>
    );
  }
}



export default Header;