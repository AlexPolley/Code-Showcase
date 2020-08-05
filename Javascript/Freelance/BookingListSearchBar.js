import React, { Component } from 'react';
import './BookingListSearchBar.css'

export default class BookingListSearchBar extends Component {

  updateQuery(input) { this.props.updateQuery(input.target.value) }

  render() {

    return (
      <div className ='BookingListSearchBar'>
        <img className='icon' src={require('../../assets/search.png')} alt='Search' />
          <input type='text' placeholder='Search...' value={this.props.query} onChange={this.updateQuery.bind(this)}/>
        </div>
    )
  }
}
