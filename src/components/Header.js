import React, { Component } from 'react';
import { Link } from "react-router-dom";

import './Header.css';

class Header extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      listGames: 'no',
      tryleft: null
    }
    
    this.renderLevel = this.renderLevel.bind(this);
    this.renderListGames = this.renderListGames.bind(this);
    this.toggleDisplayList = this.toggleDisplayList.bind(this);
  }
  
  componentDidMount() {
    this.setState({
      tryleft: this.props.user.number_try_game
    })
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

  renderListGames() {
    if (this.props.games !== undefined) {
      return this.props.games.map(e => {
        return(
            <Link className='listGameHeader' key={this.props.games.indexOf(e)} to='/games'>
              <div 
                   key={e.name}
                   onClick={() => {this.props.whichGameClicked(e)}}>
                {e.name}
              </div>
            </Link>
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
            <div className="NbTries">Tries left for today: {this.props.nbTryGame}</div>
            <div className="Picture">
              {!this.props.user.picture &&
                <Link to="/profile">
                  <img alt='yourpic' className='profilePic' src='/images/user.png' />
                </Link>
              }
              {this.props.user.picture &&
                <Link to="/profile">
                  <img alt='yourpic' className='profilePic' src={this.props.user.picture} />
                </Link>
              }
              <div className="Level">{this.renderLevel()}</div>
            </div>
            <div className="LastTry">
              {!this.props.user.last_try &&
                <span>Play to improve your score!</span>
              }
              {(this.props.user.last_try && !this.state.last_try) &&
                <span>Last try: {this.props.user.last_try.substring(0, 10)}</span>
              }
              {(this.props.user.last_try && this.state.last_try) &&
                <span>Last try: {this.state.last_try.substring(0, 10)}</span>
              }
            </div>
            <div className="Logout" onClick={this.props.logout}>Log Out</div>
        </div>
      </div>
    );
  }
}

export default Header;