import './App.css';
import { GoogleMap, useLoadScript, Marker, Autocomplete, DirectionsRenderer} from '@react-google-maps/api';
import { useState, useRef } from 'react';
const center = { lat: 48.8584, lng: 2.2945 }

function App() {
  const [map, setMap] = useState(/** @type google.maps.Map */ (null))
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
  const [travelMode, setTravelMode] = useState("DRIVING");
  
  const markerRef = useRef(/** @type google.maps.Marker */ null);
  const markerPosition = () => {
    const position = markerRef.current.props.position;
    console.log(position)
  }

    /** @type React.MutableRefObject<HTMLInputElement> */
    const originRef = useRef()
    /** @type React.MutableRefObject<HTMLInputElement> */
    const destiantionRef = useRef()
  const {isLoaded} = useLoadScript({googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  libraries: ['places']})
  if (!isLoaded) return <div>Loading...</div>

  async function calculateRoute () {
    if (originRef.current.value === '' || destiantionRef.current.value === "" ) {
      return
    }
          // eslint-disable-next-line no-undef
    const directionService = new google.maps.DirectionsService()
    try { const results = await directionService.route({
      origin: originRef.current.value,
      destination: destiantionRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: travelMode
    })
    setDirectionsResponse(results)
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);}
    catch {
      setDistance("not possible");
      setDuration("not possible");
    }
    

  }
  function clearRoute() {
    setDirectionsResponse(null);
    setDistance('');
    setDuration('');
    originRef.current.value = ''
    destiantionRef.current.value = ''
  }
  return (
    <div className='App'>
          <GoogleMap zoom={15} center={center}
    mapContainerClassName='map-container'
    options={{zoomControl: false, streetViewControl: false,
    mapTypeControl: false, fullscreenControl: false}}
    onLoad={map => setMap(map)}>
      {directionsResponse && <DirectionsRenderer directions={directionsResponse} />}
      <Marker position={center} draggable={true} ref={markerRef} onPositionChanged={markerPosition}></Marker>
    </GoogleMap>
    <div className="box">
      <div className='inputs'>
        <Autocomplete>
        <input placeholder='Origin' ref={originRef}/>
        </Autocomplete>
        <Autocomplete>
        <input placeholder='Destination' ref={destiantionRef}/>
        </Autocomplete>
        <button onClick={calculateRoute}>Calculate Route</button>
        <button onClick={clearRoute}><i class="fa fa-times" aria-hidden="true"></i>
</button>
      </div>
      <div className='info'>
        <p>Distance: {distance}</p>
        <p>Duration: {duration}</p>
        <button onClick={() => {map.panTo(center); map.setZoom(15) }}><i className='fa fa-location-arrow'></i></button>
        </div>
    </div>
    <div className='box-method'>
      <select onChange={(e) => setTravelMode(e.target.value)}>
        <option value="DRIVING">Driving</option>
        <option value="WALKING">Walking</option>
        <option value="TRANSIT">Transit</option>
        <option value="BICYCLING">Bicycling</option>
      </select>
    </div>
    </div>
  )
}


export default App;
