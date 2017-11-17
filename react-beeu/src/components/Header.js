import React, { Component } from 'react';
import './Header.css';

class Header extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      listGames: 'no',
      tryleft: null
    }
    
    this.renderLevel = this.renderLevel.bind(this);
    this.finishGame = this.finishGame.bind(this);
    this.renderListGames = this.renderListGames.bind(this);
    this.toggleDisplayList = this.toggleDisplayList.bind(this);
  }
  
  renderLevel() {
    let level = this.props.user.level;
    const starsLevel = [];
    for (let i=0; i<level; i++) {
      starsLevel.push(
        <img alt='x' className='starLevel' key={i} src='/images/starLevel.png' />
      )
    }
    return starsLevel;
  }
  
  finishGame() {
    this.props.lessTry(this.state.tryleft - 1);
  }

  renderListGames() {
    if (this.props.games !== undefined) {
      return this.props.games.map(e => {
        return(
          <div className='listGameHeader'
               key={e.name}
               onClick={() => {this.props.whichGameClicked(e); this.finishGame()}}>
            {e.name}
          </div>
        )
      })
    }
  }
  
  toggleDisplayList() {
    if (this.state.listGames === 'no') {
      this.setState({
        listGames: 'yes'
      })
    } else {
      this.setState({
        listGames: 'no'
      })
    }
  }
  
  render() {
    return (
      <div className="Header">
        <div className="HeaderContainer">
            <div className="Games" onClick={this.toggleDisplayList}>Games
              <div className={`listGames${this.state.listGames}`}>{this.renderListGames()}</div>
            </div>
            <div className="NbTries">Tries left for today: <span className="bigger">{this.props.nbTryGame}</span></div>
            <div className="Picture">
              {!this.props.user.picture &&
                <img alt='yourpic' className='profilePic' src='/images/user.png' />
              }
              {this.props.user.picture &&
                <img alt='yourpic' className='profilePic' src={this.props.user.picture} />
              }
              <div className="Level">{this.renderLevel()}</div>
            </div>
            <div className="LastTry">
              {!this.props.user.last_try &&
                <span>Play to improve your score!</span>
              }
              {this.props.user.last_try &&
                <span>Last try: {this.props.user.last_try.substring(0, 10)}</span>
              }
            </div>
            <div className="Logout" onClick={this.props.logout}>Log Out</div>
        </div>
      </div>
    );
  }
}

export default Header;