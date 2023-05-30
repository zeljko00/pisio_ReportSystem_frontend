import React, { useState, useMemo, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  FeatureGroup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../assets/style/CityMap.css";
// eslint-disable-next-line no-unused-vars
import L, { circleMarker, marker } from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import PropTypes from "prop-types";
import { EditControl } from "react-leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
function AreaPicker(props) {
  const markerRef = useRef(null);
  const [location, setLocation] = React.useState({
    position: null,
    areas: new Map(),
  });
  const eventHandlers = useMemo(() => ({
    dragend() {
      const marker = markerRef.current;
      if (marker != null) {
        const pos = marker.getLatLng();
        const temp = [pos.lat, pos.lng];
        const tempLocation = location;
        tempLocation.position = temp;
        props.returnLocation(tempLocation);
        setLocation(tempLocation);
      }
    },
  }));

  // eslint-disable-next-line no-unused-vars
  const [position, setPosition] = useState([
    44.78798121640895, 17.201115245677336,
  ]);

  // problem with loading default marker icon solved with following code
  const DefIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
  });
  L.Marker.prototype.options.icon = DefIcon;

  const _onCreate = (e) => {
    const { layerType, layer } = e;
    if (layerType === "polygon") {
      // eslint-disable-next-line camelcase
      const { _leaflet_id } = layer;
      const tempLocation = location;
      tempLocation.areas.set(_leaflet_id, {
        // eslint-disable-next-line camelcase
        id: _leaflet_id,
        coords: layer.getLatLngs()[0],
      });
      props.returnLocation(tempLocation);
      setLocation(tempLocation);
    }
  };
  // coordinates automaticaly update because layer.latlngs object changes
  const _onEdit = (e) => {
    props.returnLocation(location);
  };
  const _onDelete = (e) => {
    const {
      layers: { _layers },
    } = e;
    const tempLocation = location;
    Object.values(_layers).forEach((element) => {
      tempLocation.areas.delete(element._leaflet_id);
    });
    props.returnLocation(tempLocation);
    setLocation(location);
  };
  const polygon = [
    [44.8726118, 17.2588105],
    [44.8689621, 17.2461076],
    [44.8621487, 17.2385545],
    [44.8606886, 17.2323747],
    [44.8541176, 17.2303148],
    [44.8511969, 17.2200151],
    [44.8463288, 17.2158952],
    [44.8448683, 17.210402],
    [44.8397562, 17.2100587],
    [44.8380521, 17.200789],
    [44.832209, 17.1966691],
    [44.8307481, 17.1846528],
    [44.8149196, 17.1908326],
    [44.8119969, 17.1801896],
    [44.8078562, 17.1867128],
    [44.7981123, 17.1846528],
    [44.7983559, 17.16783],
    [44.8059076, 17.1654268],
    [44.8039589, 17.1592469],
    [44.7990867, 17.1568437],
    [44.7942142, 17.16886],
    [44.7883667, 17.1637101],
    [44.7932397, 17.1537538],
    [44.7676518, 17.1609636],
    [44.7620453, 17.1578737],
    [44.7608264, 17.1637101],
    [44.7557069, 17.1637101],
    [44.7544879, 17.1568437],
    [44.7493678, 17.1527238],
    [44.744491, 17.1489473],
    [44.7271754, 17.1530671],
    [44.7266875, 17.1619935],
    [44.7318097, 17.1623369],
    [44.7435156, 17.1551271],
    [44.7481486, 17.1623369],
    [44.7464418, 17.1788163],
    [44.750343, 17.1829362],
    [44.7483924, 17.1894594],
    [44.7547317, 17.1966691],
    [44.7505869, 17.2313447],
    [44.7454664, 17.2392411],
    [44.751806, 17.255034],
    [44.750343, 17.2673936],
    [44.7376629, 17.2800966],
    [44.7415648, 17.2821565],
    [44.747661, 17.2739167],
    [44.7547317, 17.265677],
    [44.7544879, 17.2567506],
    [44.7591199, 17.256064],
    [44.7700892, 17.2471376],
    [44.7752075, 17.2344346],
    [44.7795942, 17.233748],
    [44.7769135, 17.2402711],
    [44.7815438, 17.2481675],
    [44.7771572, 17.254004],
    [44.785199, 17.2526307],
    [44.7886103, 17.2423311],
    [44.7932397, 17.2416444],
    [44.7939706, 17.2344346],
    [44.7961633, 17.2282548],
    [44.8010356, 17.2310014],
    [44.8078562, 17.2241349],
    [44.8127276, 17.2227617],
    [44.8212515, 17.2241349],
    [44.8256347, 17.223105],
    [44.8353741, 17.2244783],
    [44.8446249, 17.2399278],
    [44.8487629, 17.2461076],
    [44.8643388, 17.2529741],
    [44.8679888, 17.2598405],
    [44.8726118, 17.2588105],
  ];
  const limeOptions = { color: "lime" };

  return (
    <div className="mapArea">
      <MapContainer
        center={[44.78798121640895, 17.201115245677336]}
        zoom={12}
        scrollWheelZoom={true}
        key="1"
      >
        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={_onCreate}
            onDeleted={_onDelete}
            onEdited={_onEdit}
            draw={{
              circle: false,
              circlemarker: false,
              marker: false,
              polyline: false,
              rectangle: false,
            }}
          ></EditControl>
        </FeatureGroup>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Polygon pathOptions={limeOptions} positions={polygon} />
        <Marker
          draggable={true}
          eventHandlers={eventHandlers}
          position={position}
          ref={markerRef}
        ></Marker>
      </MapContainer>
    </div>
  );
}

AreaPicker.propTypes = {
  returnLocation: PropTypes.func,
};

export default AreaPicker;
