import React, { Component } from 'react';
import './LoadingScene.css'

export default class LoadingScene extends Component {

  render() {
    return(
      <div className='LoadingScene'>
        <div className='wrapper'>
          <img id='spinner' src={require('../../assets/Loading_icon.gif')} alt='Loading...' />
        </div>
      </div>
    )
  }

}
