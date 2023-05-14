/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";

import "./Maps.css";

import logo from "../../assets/logo.svg";
import origin from "../../assets/Origin.svg";
import stops from "../../assets/Stop.svg";
import destination from "../../assets/Destination.svg";

const Maps = () => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyAYBivEevsC3sXYWfY6n9803tvASqB0TUI",
    libraries: ["places"],
  });

  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [distance, setDistance] = useState(0);
  const [wayPoints, setWayPoints] = useState([]);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);

  const originRef = useRef();
  const destinationRef = useRef();
  const waypointRefs = useRef([]);

  const center = { lat: 28.6818, lng: 77.229 };

  const calculateRoute = async () => {
    if (originRef.current.value === "" || destinationRef.current.value === "") {
      alert("Do not leave any field empty...");
      return;
    }

    const isEmptyWaypoint = waypointRefs.current.some(
      (ref) => ref.current.value === ""
    );
    if (isEmptyWaypoint) {
      alert("Do not leave any stop field empty...");
      return;
    }

    const waypoints = wayPoints.map((waypoint, index) => {
      return {
        location: waypointRefs.current[index].current.value,
        stopover: true,
      };
    });

    setOrigin(originRef.current.value);
    setDestination(destinationRef.current.value);

    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      waypoints: waypoints,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
      provideRouteAlternatives: true,
    });
    setDirectionsResponse(results);
    setDistance(results.routes[0].legs[0].distance.text);
  };

  const clearRoute = () => {
    setDirectionsResponse(null);
    setDistance(0);
    originRef.current.value = "";
    destinationRef.current.value = "";
    waypointRefs.current.forEach((ref) => (ref.current.value = ""));
    waypointRefs.current = [];
  };

  const addMidWay = () => {
    setWayPoints([...wayPoints, ""]);
    waypointRefs.current.push(React.createRef());
  };

  if (!isLoaded) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <div className="container" style={{ minHeight: "100vh" }}>
        <header className="header">
          <img src={logo} alt="Graviti Logo" />
        </header>

        <h1 className="heading">
          Let's calculate <strong>distance</strong> from Google maps
        </h1>

        <section className="main-content">
          <div className="left-side">
            <div className="grouping-container">
              <div className="group-content">
                <div className="label">Origin</div>
                <Autocomplete>
                  <input type="text" placeholder="Origin" ref={originRef} />
                </Autocomplete>

                <div>
                  <div className="label">Stop</div>
                  {wayPoints.map((item, index) => {
                    return (
                      <Autocomplete key={index}>
                        <input
                          type="text"
                          placeholder="Stop"
                          ref={waypointRefs.current[index]}
                          onChange={(e) => {
                            const updatedArray = [...wayPoints];
                            updatedArray[index] = e.target.value;
                            setWayPoints(updatedArray);
                          }}
                        />
                      </Autocomplete>
                    );
                  })}
                  <div className="add-stop" onClick={addMidWay}>
                    + Add another stop
                  </div>
                </div>

                <div className="label">Destination</div>
                <Autocomplete>
                  <input
                    type="text"
                    placeholder="Destination"
                    ref={destinationRef}
                  />
                </Autocomplete>
              </div>
              <div className="group-btn">
                <button className="calculate" onClick={calculateRoute}>
                  Calculate
                </button>
              </div>
            </div>

            <div className="distance">
              <p className="distance-title">Distance:</p>
              <p className="distance-value">{distance}</p>
            </div>

            <div className="summary">
              The distance between <strong>{origin}</strong> and{" "}
              <strong>{destination}</strong> via the seleted route is {distance}
              .
            </div>
          </div>

          <div className="right-side">
            <div className="map-container">
              <GoogleMap
                center={center}
                zoom={8}
                mapContainerStyle={{ width: "100%", height: "100%" }}
                options={{
                  zoomControl: false,
                  streetViewControl: false,
                  mapTypeControl: false,
                  fullscreenControl: false,
                }}
              >
                {/* {originMarker && (
                  <Marker
                    key="origin"
                    position={originMarker.position}
                    icon={origin}
                  />
                )}
                {stopMarkers.map((marker, index) => (
                  <Marker key={`stop-${index}`} position={marker.position} />
                ))}
                {destinationMarker && (
                  <Marker
                    key="destination"
                    position={destinationMarker.position}
                    icon={destination}
                  />
                )} */}
                {directionsResponse && (
                  <DirectionsRenderer directions={directionsResponse} />
                )}
              </GoogleMap>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Maps;
