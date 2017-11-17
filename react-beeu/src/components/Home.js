import React, { Component } from 'react';
import { Link } from "react-router-dom";
import {Radar, RadarChart, PolarGrid, Legend,
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
  }
  
  renderStatUser() {
    const data = [];
    this.props.games.map( game => {
      let userscore =  this.props.scoreData[this.props.games.indexOf(game)];
      let scoretoreach = game[`points_to_reach_level_${this.props.user.level}`];
      data.push(
        { 
          gameName: game.name,
          userscore: userscore/scoretoreach*100,
          scoretoreach: 100
        }
      )
    })
    console.log('DATA IN RENDER STAT', data);
        
    return (
      <RadarChart cx={300} cy={250} outerRadius={150} width={600} height={500} data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="gameName" />
          <PolarRadiusAxis dataKey="scoretoreach" />
          <Radar dataKey="userscore" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6}/>
      </RadarChart>
    )
        
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