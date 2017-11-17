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
      counter: 30,
      
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
    let maxScore = '';
    if (this.props.user[`max_score_game_${this.props.whichGame.id}`] === null) {
      maxScore = 0
    } else {
      maxScore = this.props.user[`max_score_game_${this.props.whichGame.id}`]
    }
    this.setState({
      // game page
      counter: 30,
      
      // user info
      last_try: this.props.user.last_try,
      max_score: maxScore,
      
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
    this.setCounter();
    this.renderQuestion();
    this.setState({
      rungame: 'during',
      tryleft: this.props.nbTryGame,
    });
    axios.post(`${this.props.url}/games/updateLastPlay`, {
      user_id: this.props.user.id,
      last_try: new Date()
    }).then( () => {})
  }
  
  
  setCounter() {
    this.countdown = setInterval(this.decreaseCounter, 1000);
  }
  
  decreaseCounter() {
    this.setState({
      counter: this.state.counter - 1
    });
    this.checkCounter();
  }
  
  checkCounter() {
    if (this.state.counter === 0) {
      this.finishGame('lose');
    }
  }

  finishGame(WinOrLose) {
    console.log('1 IN GAMEVIEW FINISH GAME');
    clearInterval(this.countdown);
    this.props.lessTry(this.state.tryleft-1);
    this.setState({
      rungame: 'after',
      tryleft: this.state.tryleft - 1
    });
      
    if (this.state.score > this.state.max_score) {
      this.props.isNextLevel(this.state.score, this.props.user.id);
      this.setState({
        max_score: this.state.score
      })
    }
    
    if (WinOrLose === 'lose') {
      this.setState({
        wins: false
      })
    } else if (WinOrLose === 'win') {
      this.setState({
        wins: true
      })
    }
  }
  
  renderQuestion() {
    axios.get(`${this.props.url}/games/renderQuestion/${this.props.whichGame.id}/${this.props.user.level}`)
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
      <div className="fullQuestionBlockContainer">
          {this.props.whichGame.id !== 6 &&
            <div className="question">{this.state.question}</div>
          }
          {this.props.whichGame.id === 6 &&
            <div className="question">
              <img alt='flag' key={Math.random()} className='flagQuestion' src={`/images/flags/${this.state.question.split(' ').join('')}.png`} />
            </div>
          }
          <div className="choicesQuestion">
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
    this.gameChecker();
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
              { ((this.props.nbTryGame > 0) && (this.state.rungame === 'before')) &&
                <div className="beforePlaying">
                  <div className='gamename'>{this.props.whichGame.name}</div>
                  <div className='hint'>You have <span className="bigger">30</span> seconds to {this.props.whichGame.rules} <br /><span className="bigger">Ready</span> ?</div>
                  <div className='go' onClick={this.renderGame}>GO</div>
                </div>
              }
              { ((this.props.nbTryGame > 0) && (this.state.rungame === 'during')) &&
                <div className="gameBlock">
                  <div className="upQuestionBlock">
                    <div className="gamename">{this.props.whichGame.name}</div>
                    <div className="hint">{this.state.hint === 'x' ? '' : `Hint: ${this.state.hint}`}</div>
                    <div className='lineUpQuestion'>
                      <div className="error">Chances: {this.state.error} / {this.state.numberErrorAllowed}</div>
                      <div className="score">Score: {this.state.score} / {this.state.scoreToReach}</div>
                      <div className="counter">00:{this.state.counter < 10 ? '0' : ''}{this.state.counter}</div>
                    </div>  
                  </div>
                  <div className="fullQuestionBlock">{this.displayQuestion()}</div>
                </div>
              }
              { ((this.props.nbTryGame > 0) && (this.state.rungame === 'after')) &&
                <div className="afterPlaying" >
                  { (this.state.wins && !this.props.winGame) &&
                    <div className="wins">
                        <div className="bigger">Congratulations! You won this game level!</div>
                        <div>Want to play to something else?</div>
                        <div><Link to='/home'>Home</Link></div>
                    </div>
                  }
                  { (this.state.wins && this.props.winGame) &&
                    <div className="wins">
                        <div className="bigger">Congratulations! You finished the game!</div>
                    </div>
                  }
                  {!this.state.wins &&
                    <div className="loses">
                        <div className="bigger">Too bad!</div>
                        <div className="hint">Want to try again?</div>
                        <div className='go' onClick={this.renderGame}>GO</div>
                        <div className="hint">Want to play to something else?</div>
                        <div><Link to='/home'>Home</Link></div>
                    </div>
                  }
                </div>
              }
              { this.props.nbTryGame <= 0 &&
                <div>
                  <div className="hint">
                    Sorry... you tried enough for today!<br />
                    Please wait tomorrow!
                  </div>
                  <div><Link to='/home'>Home</Link></div>
                </div>
              }
          </div>
      </div>
    );
  }
// Share results
// Restart game when wins everything
}

export default Gameview;