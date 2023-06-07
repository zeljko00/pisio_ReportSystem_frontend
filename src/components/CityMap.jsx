import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
import PropTypes from "prop-types";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { BASE_URL } from "../services/axios.service";
import "../assets/style/CityMap.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTranslation } from "react-i18next";
import { Carousel } from "antd";

function CityMap(props) {
  const { t } = useTranslation();

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
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {props.events &&
          props.events.map((event) => {
            return addMarkers(
              event.id,
              event.content,
              event.date,
              event.x,
              event.y,
              event.type,
              event.address,
              event.imagesIDs,
              event.approved,
              t
            );
          })}
        ;
        <Polygon pathOptions={limeOptions} positions={polygon} />
      </MapContainer>
    </div>
  );
}
function addMarkers(
  id,
  content,
  date,
  x,
  y,
  type,
  address,
  imagesIDs,
  approved,
  t
) {
  const contentStyle = {
    margin: "auto",
    height: "270px",
    color: "#fff",
    lineHeight: "260px",
    textAlign: "center",
    background: "#364d79",
    maxWidth: "100%",
  };
  const onChange = (currentSlide) => {
    console.log(currentSlide);
  };
  const markerIcon = new L.Icon({
    iconUrl: require("../assets/images/danger.png"),
    iconSize: [40, 27],
  });
  return (
    <Marker position={[x, y]} icon={markerIcon} key={id}>
      ;
      <Popup>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h3>{type}</h3>
          <h4>{date.split(".")[0].replace("T", " ")}</h4>
        </div>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>{t("address")}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{address}</Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>{t("info")}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>{content}</Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>{t("photos")}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Carousel afterChange={onChange}>
              {imagesIDs.map((img) => {
                return (
                  <div key={img}>
                    <img
                      src={BASE_URL + "/reports/images/" + img}
                      style={contentStyle}
                    ></img>
                  </div>
                );
              })}
            </Carousel>
          </AccordionDetails>
        </Accordion>
      </Popup>
    </Marker>
  );
}

export default CityMap;
CityMap.propTypes = {
  events: PropTypes.array,
};
