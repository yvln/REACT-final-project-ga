import React, { Component } from 'react';
import { Link } from "react-router-dom";

import axios from 'axios';

import './Userprofile.css';

class UserProfile extends Component {
  constructor(props){
    super(props);
    
    this.state = {
      picture: "",
      pictureForm: false,
      username: "",
      usernameForm: false,
      fname: "",
      fnameForm: false,
      lname: "",
      lnameForm: false
    }
    
    this.onChange = this.onChange.bind(this);
    this.changeOnDb = this.changeOnDb.bind(this);
    this.getInfoUser = this.getInfoUser.bind(this);
  }
  
  componentDidMount() {
    this.getInfoUser();
  }
  
  getInfoUser() {
    this.props.updateUserInfo();
  }
  
  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  
  changeOnDb(e) {
    e.preventDefault();
    axios.post(`${this.props.url}/userchanges`, {
      user_id: this.props.user.id,
      picture: this.state.picture,
      username: this.state.username,
      fname: this.state.fname,
      lname: this.state.lname
    }).then( res => {
      console.log('res.data', res.data);
      this.getInfoUser();
      this.setState({
        pictureForm: false,
        usernameForm: false,
        fnameForm: false,
        lnameForm: false
      })
    })
  }
  
  makeAppear(item) {
    if (!this.state[item]) {
      this.setState({
        [item]: true
      })
    } else {
      this.setState({
        [item]: false
      })
    }
  }

  render() {
    return (
      <div className="UserProfile">
        THIS IS THE USER PROFILE
        <div className='profilePicDiv' onClick={() => {this.makeAppear('pictureForm')}}><img src={this.state.picture} alt="Add Profile Picture"/></div>
          <div className={this.state.pictureForm ? 'yes' : 'no'}>
            <form onSubmit={this.changeOnDb} >
              <input type="text" name="picture" value={this.state.picture} onChange={this.onChange} />
              <input type="submit" value="OK" />
            </form>
          </div>
          
        <div onClick={() => {this.makeAppear('usernameForm')}}>Username:</div>
            {!this.state.usernameForm && 
              <div>
                {this.state.username}
              </div>
            }
            {this.state.usernameForm &&
              <form onSubmit={this.changeOnDb} >
                <input type="text" name="username" value={this.state.username} onChange={this.onChange} />
                <input type="submit" value="OK" />
              </form>
            }
        
        <div onClick={() => {this.makeAppear('fnameForm')}}>First name:</div>
            {!this.state.fnameForm && 
              <div>
                {this.state.fname}
              </div>
            }
            {this.state.fnameForm &&
              <form onSubmit={this.changeOnDb} >
                <input type="text" name="fname" value={this.state.fname} onChange={this.onChange} />
                <input type="submit" value="OK" />
              </form>
            }

        <div onClick={() => {this.makeAppear('lnameForm')}}>Last name:</div>
            {!this.state.lnameForm && 
              <div>
                {this.state.lname}
              </div>
            }
            {this.state.lnameForm &&
              <form onSubmit={this.changeOnDb} >
                <input type="text" name="lname" value={this.state.lname} onChange={this.onChange} />
                <input type="submit" value="OK" />
              </form>
            }
        
        <div>Level: {this.state.level}</div>
        <div>Registration date: {this.props.user.date_registr.substring(0,10)}</div>
      </div>
    );
  }
}

export default UserProfile;