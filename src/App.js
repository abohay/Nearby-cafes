import React, { Component } from 'react';
import './App.css';
import axios from 'axios'
import MapList from './MapList'

class App extends Component {
  //intialize the state that we will use
  state = {
    venues : [],
    filteredVenues:[],
    markers: [],
  }

  //function that will update the venues according to the search input
  updateVenues = (newVenues) => {
    this.setState({filteredVenues: newVenues})
  }

  // asynchronous request to the venues from foursquare api
  componentDidMount(){
    this.getVenues()
  }

  // rendering the map acc to google api docs
  renderMap = () =>{
    LoadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyCtrInC9FOB1Jkicx9el5JWJs8zHXz3xvI&callback=initMap")
    window.initMap = this.initMap; {/* this help us to assign our value to the map  */}
  }

  initMap = () => {
    var map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 31.042457, lng: 30.47275},
      zoom: 12
    })
    var infowindow = new window.google.maps.InfoWindow();
    this.state.filteredVenues.map(myVenue => {
      var contentString = `${myVenue.venue.name}`;
      var marker = new window.google.maps.Marker({
        position: {lat: myVenue.venue.location.lat, lng: myVenue.venue.location.lng},
        map: map,
        title:myVenue.venue.name
      });
      this.state.markers.push(marker)
      marker.addListener('click', function() {
        infowindow.setContent(contentString);
        infowindow.open(map, marker);
      });
    })
  }
  // getting the data from foursquare api
  getVenues = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?"
    const parameters = {
      client_id:"WOIQGRDXUBMSIIZUX4EG4GCJSZK1TXU3O4WSXXSH1VQPLJAM",
      client_secret:"ZVUEES53ND204QQTJBXM4ZFRGO5H2FROZAKFJC3TW0AZI4U5",
      query:"food",
      near:"damanhour",
      v:"20182507"
    }

    // adding the parameters to the url
    axios.get(endPoint + new URLSearchParams(parameters))
    .then(response =>{
      this.setState({
        venues:response.data.response.groups[0].items,
        filteredVenues:response.data.response.groups[0].items
      },this.renderMap())
    })
    .catch(error =>{
      console.log("ERROR!! "+error)
    })
  }

  render() {
      return (
        <main>
          <MapList
            venues={this.state.venues}
            markers={this.state.markers}
            updateVenues= {this.updateVenues}
          />
          <div id="map"></div>
        </main>
    );
  }
}
// function for asynchronous load to the google api
function LoadScript(url){
   var index = window.document.getElementsByTagName("script")[0]
   var script = window.document.createElement('script')
   script.src = url
   script.async = true
   script.defer = true
   index.parentNode.insertBefore(script,index)
}
export default App;
