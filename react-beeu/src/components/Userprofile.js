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
    this.props.updateUserInfo(this.props.user.id);
    this.setState({
      picture: this.props.user.picture,
      username: this.props.user.username,
      fname: this.props.user.fname,
      lname: this.props.user.lname
    })
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
      this.getInfoUser();
      this.setState({
        pictureForm: false,
        usernameForm: false,
        fnameForm: false,
        lnameForm: false,
        picture: res.data.picture,
        username: res.data.username,
        fname: res.data.fname,
        lname: res.data.lname
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

        <div className="UserProfileContainer">

          <div className='labelUserProfileStatic LevelUserProfile'>Level {this.props.user.level}</div>
          <div className='labelUserProfileStatic RegisUserProfile'>Registration date {this.props.user.date_registr.substring(0,10)}</div>
          <div className='profilePicDiv' onClick={() => {this.makeAppear('pictureForm')}}><img className='displayBigProfilPic' src={this.state.picture} alt="Add Profile Picture"/></div>
            <div className={this.state.pictureForm ? 'yes' : 'no'}>
              <form onSubmit={this.changeOnDb} >
                <input type="text" name="picture" value={this.state.picture} onChange={this.onChange} placeholder="image url" />
                <input className="ok" type="submit" value="OK" />
              </form>
            </div>

          <div className='labelUserProfile' onClick={() => {this.makeAppear('usernameForm')}}>Username</div>
              {!this.state.usernameForm &&
                <div className="inputUserProfile">
                  {this.state.username}
                </div>
              }
              {this.state.usernameForm &&
                <form onSubmit={this.changeOnDb} >
                  <input type="text" name="username" value={this.state.username} onChange={this.onChange} />
                  <input className="ok" type="submit" value="OK" />
                </form>
              }

          <div className='labelUserProfile' onClick={() => {this.makeAppear('fnameForm')}}>First name</div>
              {!this.state.fnameForm &&
                <div className="inputUserProfile">
                  {this.state.fname}
                </div>
              }
              {this.state.fnameForm &&
                <form onSubmit={this.changeOnDb} >
                  <input type="text" name="fname" value={this.state.fname} onChange={this.onChange} />
                  <input className="ok" type="submit" value="OK" />
                </form>
              }

          <div className='labelUserProfile' onClick={() => {this.makeAppear('lnameForm')}}>Last name</div>
              {!this.state.lnameForm &&
                <div className="inputUserProfile">
                  {this.state.lname}
                </div>
              }
              {this.state.lnameForm &&
                <form onSubmit={this.changeOnDb} >
                  <input type="text" name="lname" value={this.state.lname} onChange={this.onChange} />
                  <input className="ok" type="submit" value="OK" />
                </form>
              }

          <Link to='/home'>Home</Link>

        </div>

      </div>
    );
  }
}

export default UserProfile;
