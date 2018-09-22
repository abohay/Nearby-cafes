import React, { Component } from 'react';
import './App.css';
import escapeRegExp from 'escape-string-regexp'

class MapList extends Component {

  //intialize the state that we will use
  state = {
    query: '',
    venues: this.props.venues
  }
  // function that show the marker when you click
  showMarker = (venue) => {
      this.props.markers.map((marker) => {
          if(marker.title === venue) {
              window.google.maps.event.trigger(marker, 'click');
          }
      })
  }

  // update the search input and filter the list of venues
     updateQuery = (query) => {
         this.setState({ query })
         let filteredVenues
         const match = new RegExp(escapeRegExp(query), 'i');
         filteredVenues = this.props.venues.filter((place) => match.test(place.venue.name))
         this.setState({ venues: filteredVenues })
         //zoom places depend on query
         let back = filteredVenues.map(place => place.venue.name)
         this.props.updateVenues(back)
         //to render all markers if query is empty
         if (query.length < 1) {
             let places = this.props.venues.map(place => place.venue.name);
             this.props.updateVenues(places)
         }
     }
  render(){
    return(
      <aside>
        <div className="searchForm">
            <label htmlFor="searchQuery" id="searchLabel">Cafes List</label>
            <input
                id="searchQuery"
                aria-label="search Cafes"
                type="text"
                placeholder="Type the Search text here"
                onChange={(e) => this.updateQuery(e.target.value)}
                value={this.state.query}
            />
        </div>
        {this.state.venues.length !== 0 && (
            <ul className="searchResult">
                {this.state.venues.map((venue, index) => (
                    <li
                        key={index}
                        tabIndex={index}
                        className="item"
                        onClick={() => this.showMarker(venue.venue.name)}
                    >
                        {venue.venue.name}
                    </li>
                ))}
            </ul>
        )}
        {this.state.venues === 0 && (
            <ul className="searchResult">
                <li>sorry dude no places found</li>
            </ul>
        )}
      </aside>
    )
  }
}

export default MapList
