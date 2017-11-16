import React, { Component } from 'react';
import { Link } from "react-router-dom";

import axios from 'axios';
import './Gameview.css';

class Gameview extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      // game page
      rungame: 'before',
      counter: 5,
      
      // user info
      tryleft: null,
      last_try: null,
      max_score: null,

      // game info
      numberErrorAllowed: null,
      scoreToReach: null,
      hint: '',
      
      // user info on the game
      score: 0,
      error: 0,
      wins: null,
      next_level: false,
      
      // game each question
      question: '',
      choice: [],
      response: ''
    }
    
    this.initializeState = this.initializeState.bind(this);
    
    this.getGameInfo = this.getGameInfo.bind(this);
    this.renderGame = this.renderGame.bind(this);
    
    this.decreaseCounter = this.decreaseCounter.bind(this);
    this.checkCounter = this.checkCounter.bind(this);
    this.setCounter = this.setCounter.bind(this);
    
    this.finishGame = this.finishGame.bind(this);
    // this.counterUntilTomorrow = this.counterUntilTomorrow.bind(this);
    
    this.renderQuestion = this.renderQuestion.bind(this);
    this.displayQuestion = this.displayQuestion.bind(this);
    this.checkAnswer = this.checkAnswer.bind(this);
    this.gameChecker = this.gameChecker.bind(this);
  }
  
  componentDidMount() {
    this.initializeState();
    this.getGameInfo();
  }
  
  initializeState() {
    this.setState({
      // game page
      counter: 5,
      
      // user info
      last_try: this.props.user.last_try,
      max_score: this.props.user[`max_score_game_${this.props.whichGame.id}`],

      // game info
      numberErrorAllowed: null,
      scoreToReach: null,
      hint: '',
      
      // user info on the game
      score: 0,
      error: 0,
      wins: null,
      
      // game each question
      question: '',
      choice: [],
      response: ''
    })
  }
  
  getGameInfo() {
    this.setState({
      numberErrorAllowed: this.props.whichGame[`nb_try_max_level_${this.props.user.level}`],
      scoreToReach: this.props.whichGame[`points_to_reach_level_${this.props.user.level}`],
      hint: this.props.whichGame[`hint`],
      tryleft: this.props.user.number_try_game
    })
  }
  
  renderGame() {
    this.initializeState();
    this.setState({
      rungame: 'during',
      tryleft: this.props.lesstry,
    }),
    axios.post(`${this.props.url}/games/updateLastPlay`, {
      user_id: this.props.user.id,
      last_try: new Date()
    }).then( res => {
      console.log('Just updated last day of play!');
    })
    this.setCounter();
    this.renderQuestion();
    this.gameChecker();
  }
  
  decreaseCounter() {
    this.setState({
      counter: this.state.counter - 1
    }),
    this.checkCounter();
  }
  
  checkCounter() {
    if (this.state.counter === 0) {
      this.finishGame('lose');
    }
  }
  
  setCounter() {
    this.countdown = setInterval(this.decreaseCounter, 1000);
  }
  
  finishGame(WinOrLose) {
    clearInterval(this.countdown);
    this.setState({
      rungame: 'after',
      tryleft: this.state.tryleft - 1
    });
    this.props.lessTry(this.state.tryleft);

    if (WinOrLose === 'lose') {
      this.setState({
        wins: false
      })
    } else if (WinOrLose === 'win') {
      this.setState({
        wins: true
      })
      if (this.state.score > this.state.max_score) {
        this.props.isNexLevel();
        axios.post(`${this.props.url}/games/updateMaxScore`, {
          user_id: this.props.user.id,
          score: this.state.score,
          game_id: this.props.whichGame.id
        }).then( res => {
          this.setState({
            max_score: res.data.new_max_score
          })
        })
      }
    }
  }
  
  // counterUntilTomorrow() {
  //   console.log('IN COUNTER UNTIL TOMORROW');
  //   if (this.state.last_try.substring(0,10) === new Date().substring(0,10)) {
  //     console.log('getHours', new Date().getHours());
  //     console.log('getMinutes', new Date().getMinutes());
  //     console.log('getSeconds', new Date().getSeconds());
  //   }
  // }
  
  renderQuestion() {
    axios.get(`${this.props.url}/games/renderQuestion/${this.props.whichGame.id}/${this.props.user.id}`)
    .then( data => {
      this.setState({
        question: data.data.question.fullQuestion,
        response: data.data.question.finalResponse,
        choice: data.data.question.choice
      })
    })
  }
  
  displayQuestion() {
    return (
      <div>
        <div className="question">{this.state.question}</div>
        <div>
          <div className="choiceQuestion" onClick={() => {this.checkAnswer(this.state.choice[0])} }>
            {this.state.choice[0]}
          </div>
          <div className="choiceQuestion" onClick={() => {this.checkAnswer(this.state.choice[1])} }>
            {this.state.choice[1]}
          </div>
          <div className="choiceQuestion" onClick={() => {this.checkAnswer(this.state.choice[2])} }>
            {this.state.choice[2]}
          </div>
          <div className="choiceQuestion" onClick={() => {this.checkAnswer(this.state.choice[3])} }>
            {this.state.choice[3]}
          </div>
        </div> 
      </div>
    )
  }
  
  checkAnswer(answerClicked) {
    if (answerClicked === this.state.response) {
      // add condition if score reached
      this.setState({
        score: this.state.score + 1
      })
    } else if (answerClicked !== this.state.response) {
      // Et que le nombre d'erreur autorisé n'est pas dépassé
      this.setState({
        error: this.state.error + 1
      })
    }
    this.renderQuestion();
  }
  
  gameChecker() {
    if (this.state.error === this.state.numberErrorAllowed) {
      this.finishGame('lose');
    } else if (this.state.score === this.state.scoreToReach ) {
      this.finishGame('win');
    }
  }
  
  render() {
    return (
      <div className="Gameview">
          <div className="GameContainer">
            { ((this.props.user.number_try_game > 0) && (this.state.rungame === 'before')) &&
              <div className="beforePlaying">
                <div>{this.props.whichGame.name}</div>
                <div>You have 30 seconds to {this.props.whichGame.rules}</div>
                <div>Ready ?</div>
                <div><button onClick={this.renderGame}>GO</button></div>
              </div>
            }
            { ((this.props.user.number_try_game > 0) && (this.state.rungame === 'during')) &&
              <div className="gameBlock">
                <div className="upQuestionBlock">
                  <div className="error">Chances: {this.state.error} / {this.state.numberErrorAllowed}</div>
                  <div className="score">Score: {this.state.score} / {this.state.scoreToReach}</div>
                  <div className="hint">{this.state.hint === 'x' ? '' : `Hint: ${this.state.hint}`}</div>
                  <div className="counter">00:{this.state.counter < 10 ? '0' : ''}{this.state.counter}</div>
                </div>
                <div className="fullQuestionBlock">{this.displayQuestion()}</div>
              </div>
            }
            { ((this.props.user.number_try_game > 0) && (this.state.rungame === 'after')) &&
              <div>
                {this.state.wins &&
                  <div className="afterPlaying wins">
                      <div>Congratulations! You won this game level!</div>
                      <div>Want to play to something else?</div>
                      <div><Link to='/home'>Home</Link></div>
                  </div>
                }
                {!this.state.wins &&
                  <div className="afterPlaying loses">
                      <div>Too bad!</div>
                      <div>Want to try again?</div>
                      <div><button onClick={this.renderGame}>GO</button></div>
                      <div>Want to play to something else?</div>
                      <div><Link to='/home'>Home</Link></div>
                  </div>
                }
              </div>
            }
            { this.props.user.number_try_game <= 0 &&
              <div>
                <div>Sorry... you tried enough for today!</div>
                <div>Please wait (nombre dheures et minutes)</div>
                <div><Link to='/home'>Home</Link></div>
              </div>
            }
          </div>
      </div>
    );
  }
}


export default Gameview;