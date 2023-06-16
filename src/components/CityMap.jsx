import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  Circle,
} from "react-leaflet";
import PropTypes from "prop-types";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { REPORT_BASE_URL } from "../services/axios.service";
import "../assets/style/CityMap.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTranslation } from "react-i18next";
import { Carousel, message } from "antd";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import VerifiedIcon from "@mui/icons-material/VerifiedTwoTone";
import AppBadIcon from "@mui/icons-material/GppBadTwoTone";
import { deleteReport, changeApproval } from "../services/report.service";
function CityMap(props) {
  const { t } = useTranslation();
  console.log("CityMap rerender!");
  // const [uiState, changeUiState] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const redPallete = [
    "#D40000",
    "#E8000D",
    "#FF0000",
    "#8B0000",
    "#FF4040",
    "#FE2712",
    "#7C0A02",
    "#560319",
    "#FF0038",
  ];
  const yellowPallete = [
    "#FFFF00",
    "#E8F48C",
    "#FFC40C",
    "#B8860B",
    "#FF4500",
    "#FFA500",
    "#FFB347",
    "#E9692C",
    "#CB410B",
    "#FF9933",
  ];
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
  const warningIcon = new L.Icon({
    iconUrl: require("../assets/images/alert.png"),
    iconSize: [50, 50],
  });
  const limeOptions = { color: "lime" };
  function addMarkers(event, showSettings) {
    const handleDeleteReport = () => {
      deleteReport(event.id)
        .then((response) => {
          event.id = -1;
          // changeUiState(!uiState);
          props.render();
          messageApi.open({
            type: "success",
            content: t("reportDeleted"),
            duration: 0,
          });
          setTimeout(messageApi.destroy, 3000);
        })
        .catch((error) => {
          console.log(error);
          messageApi.open({
            type: "error",
            content: t("reportDeletedFailed"),
            duration: 0,
          });
          setTimeout(messageApi.destroy, 3000);
        });
    };
    const changeReportState = (state) => {
      changeApproval(event.id, state)
        .then((response) => {
          event.approved = state;
          // changeUiState(!uiState);
          props.render();
          messageApi.open({
            type: "success",
            content: t("reportStateChanged"),
            duration: 0,
          });
          setTimeout(messageApi.destroy, 3000);
        })
        .catch((response) => {
          messageApi.open({
            type: "error",
            content: t("reportStateChangedFailed"),
            duration: 0,
          });
          setTimeout(messageApi.destroy, 3000);
        });
    };
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
    const markerIconDanger = new L.Icon({
      iconUrl: require("../assets/images/danger.png"),
      iconSize: [40, 27],
    });
    const markerIconInfo = new L.Icon({
      iconUrl: require("../assets/images/info.png"),
      iconSize: [20, 20],
    });
    return (
      <Marker
        position={[event.x, event.y]}
        icon={event.approved ? markerIconDanger : markerIconInfo}
        key={event.id}
      >
        ;
        <Popup>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h3>{(showSettings ? "#" + event.id + " : " : "") + event.type}</h3>
            <h4>{event.date.split(".")[0].replace("T", " ")}</h4>
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
              <Typography>
                <span className="details-container"> {event.address}</span>
              </Typography>
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
              <Typography>
                {" "}
                <span className="details-container"> {event.content}</span>
              </Typography>
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
                {event.imagesIDs.map((img) => {
                  return (
                    <div key={img}>
                      <img
                        src={REPORT_BASE_URL + "/reports/images/" + img}
                        style={contentStyle}
                      ></img>
                    </div>
                  );
                })}
              </Carousel>
            </AccordionDetails>
          </Accordion>
          {showSettings && (
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>{t("settings")}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {event.approved ? (
                  <IconButton onClick={() => changeReportState(false)}>
                    <span className="btn-label">{t("hide")}</span>
                    <AppBadIcon color="primary" />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => changeReportState(true)}>
                    <span className="btn-label">{t("approve")}</span>
                    <VerifiedIcon color="success" />
                  </IconButton>
                )}
                <IconButton onClick={handleDeleteReport}>
                  <span className="btn-label">{t("delete")}</span>
                  <DeleteIcon color="error" />
                </IconButton>
              </AccordionDetails>
            </Accordion>
          )}
        </Popup>
      </Marker>
    );
  }

  return (
    <div className="mapArea">
      {contextHolder}
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
          props.events
            .filter((e) => e.id !== -1)
            .map((event) => {
              return addMarkers(event, props.showSettings);
            })}
        ;
        <Polygon pathOptions={limeOptions} positions={polygon} />
        {props.warnings &&
          props.warnings.map((w) => {
            let wX = 0;
            let wY = 0;
            w.reports.forEach((r) => {
              wX = wX + r.x;
              wY = wY + r.y;
            });
            console.log(
              w.level === "LOW"
                ? yellowPallete[
                    Math.floor(Math.random() * yellowPallete.length)
                  ]
                : redPallete[Math.floor(Math.random() * redPallete.length)]
            );
            return (
              <>
                <Circle
                  center={{
                    lat: w.x,
                    lng: w.y,
                  }}
                  fillColor={
                    w.level === "LOW"
                      ? yellowPallete[
                          Math.floor(Math.random() * yellowPallete.length)
                        ]
                      : redPallete[
                          Math.floor(Math.random() * redPallete.length)
                        ]
                  }
                  stroke={false}
                  fillOpacity={0.5}
                  radius={w.r + 1}
                  key={w.id + "#" + w.r}
                />
                <Marker
                  position={[wX / w.reports.length, wY / w.reports.length]}
                  icon={warningIcon}
                  key={"c" + w.id + "#" + w.r}
                >
                  ;
                  <Popup>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <h2>{"#" + w.id + " - " + t(w.level)}</h2>
                      <h3>{w.date.split(".")[0].replace("T", " ")}</h3>
                    </div>
                  </Popup>
                </Marker>
              </>
            );
          })}
      </MapContainer>
    </div>
  );
}

export default CityMap;
CityMap.propTypes = {
  events: PropTypes.array,
  warnings: PropTypes.array,
  showSettings: PropTypes.bool,
  render: PropTypes.func,
};
