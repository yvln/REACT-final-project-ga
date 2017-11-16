import React, { Component } from 'react';
import axios from 'axios';
import './Gameview.css';

class Gameview extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      // game page
      rungame: false,
      counter: 30,
      
      // user info
      tryleft: null,
      last_try: null,

      // game info
      numberErrorAllowed: null,
      scoreToReach: null,
      hint: '',
      
      // user info on the game
      score: 0,
      error: 0,
      
      // game each question
      question: '',
      choice: [],
      response: ''
    }
    
    this.getGameInfo = this.getGameInfo.bind(this);
    this.renderGame = this.renderGame.bind(this);
    
    this.decreaseCounter = this.decreaseCounter.bind(this);
    this.setCounter = this.setCounter.bind(this);
    
    this.finishGame = this.finishGame.bind(this);
    this.counterUntilTomorrow = this.counterUntilTomorrow.bind(this);
    
    this.renderQuestion = this.renderQuestion.bind(this);
    this.displayQuestion = this.displayQuestion.bind(this);
    this.checkAnswer = this.checkAnswer.bind(this);
  }
  
  componentDidMount() {
    this.setState({
      tryleft: this.props.user.number_try_game,
      last_try: this.props.user.last_try
    });
    this.getGameInfo();
  }
  
  getGameInfo() {
    axios.get(`${this.props.url}/games/${this.props.whichGame.id}/${this.props.user.id}`)
    .then( res => {
      console.log(res.data);
      // this.setState({
      //   numberErrorAllowed: res.data.game.nb_try_max_level_this.props.user.level,
      //   scoreToReach: res.data.game.points_to_reach_level_this.props.user.level,
      //   hint: res.data.game.hint
      // })
    })
    // get number error OK : state numberErrorAllowed
    // get score to reach function of level : scoreToReach
    // add it on line 121
  }
  
  renderGame() {
    this.setState({
      rungame: true
    }),
    this.decreaseCounter();
    this.renderQuestion();
  }
  
  decreaseCounter() {
    this.setState({
      counter: this.state.counter - 1
    })
  }
  
  setCounter() {
    setInterval(this.decreaseCounter, 1000);
    if (this.state.counter === 0) {
      this.finishGame();
    }
  }
  
  finishGame() {
    console.log('counter finished');
    clearInterval(this.decreaseCounter);
    // axios.post(`${this.props.url}/games/lessTry`, {
    //   number_try_game: this.props.user.number_try_game - 1,
    //   user_id: this.props.user.id
    // }).then( res => {
      // this.setState({
      //   tryleft: this.props.user.number_try_game
      // })
    //   
    //   })
    // })
  // }
  }
  
  counterUntilTomorrow() {
    if (this.state.last_try.substring(0,10) === new Date().substring(0,10)) {
      console.log('getHours', new Date().getHours());
      console.log('getMinutes', new Date().getMinutes());
      console.log('getSeconds', new Date().getSeconds());
    }
  }
  
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
    } else if (answerClicked !== this.state.response) {
      this.renderQuestion();
    }
  }
  

  render() {
    // console.log(this.state.numberErrorAllowed);
    // console.log(this.state.scoreToReach);
    // console.log(this.state.hint);
    return (
      <div className="Gameview">
          <div className="GameContainer">
            { ((this.props.user.number_try_game >= 0) && (!this.state.rungame)) &&
              <div>
                {this.props.whichGame.name}
                You have 30 seconds to {this.props.whichGame.rules}
                Ready ?
                <button onClick={this.renderGame}>GO</button>
              </div>
            }
            { ((this.props.user.number_try_game >= 0) && (this.state.rungame)) &&
              <div className="gameBlock">
                <div className="upQuestionBlock">
                  <div className="error">{this.state.error} / {this.state.numberErrorAllowed}</div>
                  <div className="score">{this.state.score} / {this.state.scoreToReach}</div>
                  <div className="counter">{this.state.counter}</div>
                </div>
                <div className="fullQuestionBlock">{this.displayQuestion()}</div>
              </div>
            }
            { this.props.user.number_try_game < 0 &&
              <div>
                Sorry... you tried enough for today!
                {this.counterUntilTomorrow()}
              </div>
            }
          </div>
      </div>
    );
  }
}


export default Gameview;