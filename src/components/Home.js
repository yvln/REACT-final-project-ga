import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {Radar, RadarChart, PolarGrid,
         PolarAngleAxis, PolarRadiusAxis} from 'recharts';

import './Home.css';

class Home extends Component {
  constructor(props){
    super(props);

    this.state = {
      scoreData: []
    }

    this.renderGamesBox = this.renderGamesBox.bind(this);
    this.renderStatUser = this.renderStatUser.bind(this);
    this.shareWithFb = this.shareWithFb.bind(this);
  }

  componentDidMount() {
    this.props.initializeDay();
    this.setState({
      scoreData: this.props.scoreData
    });
  }

  componentDidUpdate(prevProps, prevStats) {
    if (prevProps.scoreData !== this.props.scoreData) {
      this.renderStatUser();
    }
  }

  renderGamesBox() {
    if (this.props.games !== undefined) {
      return this.props.games.map( e => {
        return(
          <Link className={`gameBox gb${this.props.games.indexOf(e)}`}
             to='/games'
             key={e.name}
             onClick={ () => { this.props.whichGameClicked(e); }}>
            <div className="gameName">{e.name}</div>
            <div className="gameRules">{e.rules}</div>
          </Link>
        )
      })
    }
  }

  renderStatUser() {
    const data = [];
    this.props.games.map( game => {
      let userscore = this.props.scoreData[this.props.games.indexOf(game)];
      let scoretoreach = game[`points_to_reach_level_${this.props.user.level}`];
      data.push(
        {
          gameName: game.name,
          userscore: userscore/scoretoreach*100,
          scoretoreach: 100
        }
      )
    })
    return (
      <RadarChart width={550} height={400} data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="gameName" />
          <PolarRadiusAxis dataKey="scoretoreach" />
          <Radar dataKey="userscore" stroke="#D7715E" fill="#FFD000" fillOpacity={0.7}/>
      </RadarChart>
    )
  }

  shareWithFb() {
    window.FB.ui({
      method: 'share',
      mobile_iframe: true,
      href: 'https://beeurself.netlify.com/',
      quote: 'This game is awesome! Developed by Yveline Say http://www.yvelinesay.com/'
    }, function(response){
      console.log('response', response);
    });
  }
  
  render() {
    return (
      <div className="Home">
        <div className="Greetings">Hello, {this.props.user.fname}!</div>
        <div className="HomeGames">
          {this.renderGamesBox()}
        </div>
        <div className="HomeStat">
          {this.renderStatUser()}
        <div className="shareFb" onClick={this.shareWithFb}>SHARE</div>
        </div>
      </div>
    );
  }
}

export default Home;
