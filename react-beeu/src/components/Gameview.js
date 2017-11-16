import React, { Component } from 'react';
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
      tryleft: this.props.user.number_try_game,
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
      hint: this.props.whichGame[`hint`]
    })
  }
  
  renderGame() {
    this.initializeState();
    this.getGameInfo();
    this.setState({
      rungame: 'during'
    }),
    axios.post(`${this.props.url}/games/updateLastPlay`, {
      user_id: this.props.user.id,
      last_try: new Date()
    }).then( res => {
      console.log('res');
    })
    this.setCounter();
    this.renderQuestion();
    this.gameChecker();
  }
  
  decreaseCounter() {
    console.log('IN DECREASE COUNTER');
    this.setState({
      counter: this.state.counter - 1
    }),
    this.checkCounter();
  }
  
  checkCounter() {
    console.log('IN CHECK COUNTER');
    if (this.state.counter === 0) {
      console.log('COUNTER = 0!');
      this.finishGame('lose');
    }
  }
  
  setCounter() {
    this.countdown = setInterval(this.decreaseCounter, 1000);
  }
  
  finishGame(WinOrLose) {
    console.log('WIN OR LOSE?', WinOrLose);
    clearInterval(this.countdown);
    this.setState({
      rungame: 'after'
    });
  
    if (WinOrLose === 'lose') {
      console.log('LOSE???? YES!');
      this.setState({
        wins: false
      })
      axios.post(`${this.props.url}/games/updateNumberTry`, {
        new_nb_try: this.props.user.number_try_game - 1,
        user_id: this.props.user.id
      }).then( res => {
        console.log('IS NUMBER TRY UPDATED? res.data.new_nb_try:', res.data.new_nb_try);
        this.setState({
          tryleft: res.data.new_nb_try
        })
      })
    } else if (WinOrLose === 'win') {
      this.setState({
        wins: true
      })
      if (this.state.score > this.state.max_score) {
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
    console.log('IN RENDER QUESTION');
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
    console.log('IN displayQuestion');
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
    console.log('iN checkAnswer');
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
    console.log('iN GAME CHECKER');
    if (this.state.error === this.state.numberErrorAllowed) {
      this.finishGame('lose');
    } else if (this.state.score === this.state.scoreToReach ) {
      this.finishGame('win');
    }
  }
  
  render() {
    console.log('iN GAME VIEW');
    return (
      <div className="Gameview">
          <div className="GameContainer">
            { ((this.props.user.number_try_game > 0) && (this.state.rungame === 'before')) &&
              <div className="beforePlaying">
                {this.props.whichGame.name}
                You have 30 seconds to {this.props.whichGame.rules}
                Ready ?
                <button onClick={this.renderGame}>GO</button>
              </div>
            }
            { ((this.props.user.number_try_game > 0) && (this.state.rungame === 'during')) &&
              <div className="gameBlock">
                <div className="upQuestionBlock">
                  <div className="error">Chances: {this.state.error} / {this.state.numberErrorAllowed}</div>
                  <div className="score">Score: {this.state.score} / {this.state.scoreToReach}</div>
                  {this.state.hint !== 'x' &&
                    <div className="score">Hint: {this.state.hint}</div>
                  }
                  <div className="counter">00:{this.state.counter}</div>
                </div>
                <div className="fullQuestionBlock">{this.displayQuestion()}</div>
              </div>
            }
            { ((this.props.user.number_try_game > 0) && (this.state.rungame === 'after')) &&
              <div>
                {this.state.wins &&
                  <div className="afterPlaying wins">
                      Want to play to something else?
                  </div>
                }
                {!this.state.wins &&
                  <div className="afterPlaying loses">
                      Want to try again?
                      <button onClick={this.renderGame}>GO</button>
                  </div>
                }
              </div>
            }
            { this.props.user.number_try_game <= 0 &&
              <div>
                Sorry... you tried enough for today!
                Please wait 
              </div>
            }
          </div>
      </div>
    );
  }
}


export default Gameview;