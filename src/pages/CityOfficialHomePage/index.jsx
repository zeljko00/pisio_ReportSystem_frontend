import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { TabPanel, TabList, TabContext } from "@mui/lab";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import MapIcon from "@mui/icons-material/Map";
import LogoutIcon from "@mui/icons-material/Logout";
import { Tab, Box } from "@mui/material";
import { LanguageSelector } from "../../components/LanguageSelector";
import CityMap from "../../components/CityMap";
import { AppHeader } from "../../layouts/AppHeader";
import { AppFooter } from "../../layouts/AppFooter";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import "../../assets/style/CitizenHomePage.css";
import Avatar from "@mui/material/Avatar";
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import {
  getReportTypes,
  getReports,
  getStats,
} from "../../services/report.service";
import { StatsDashboard } from "../../components/StatsDashboard";
import NotificationImportantIcon from "@mui/icons-material/NotificationImportant";
import { detect } from "../../services/anomaly.service";
import WarningIcon from "@mui/icons-material/Warning";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
export function CityOfficialHomePage() {
  const [reportTypes, changeTypes] = useState([]);
  const [events, changeEvents] = useState([]);
  const [warnings, changeWarnings] = useState([]);
  const [uiState, changeUiState] = useState(false);
  const [stats, changeStats] = useState();
  const [value, setValue] = useState("0");
  const navigate = useNavigate();
  const { t } = useTranslation();
  // eslint-disable-next-line no-unused-vars
  const [changed, changeChanged] = useState(false);

  const user = JSON.parse(sessionStorage.getItem("user"));
  const [typeFilterValue, changeTypeFilterValue] = useState("");
  const [dateFilterValue, changeDateFilterValue] = useState("");
  const dateFilterValues = ["24h", "7d", "31d", "6m"];
  const [addressFilterValue, changeAddressFilterValue] = useState();
  const [stateFilterValue, changeStateFilterValue] = useState("");
  const render = () => {
    changeUiState(!uiState);
  };
  const changeTypeFilterValueWrapper = (value) => {
    changeTypeFilterValue(value.target.value);
    filterReports(
      value.target.value,
      dateFilterValue,
      addressFilterValue,
      stateFilterValue
    );
  };
  const changeDateFilterValueWrapper = (value) => {
    changeDateFilterValue(value.target.value);
    filterReports(
      typeFilterValue,
      value.target.value,
      addressFilterValue,
      stateFilterValue
    );
  };
  const changeAddressFilterValueWrapper = (value) => {
    changeAddressFilterValue(value.target.value);
    filterReports(
      typeFilterValue,
      dateFilterValue,
      value.target.value,
      stateFilterValue
    );
  };
  const changeStateFilterValueWrapper = (value) => {
    changeStateFilterValue(value.target.value);
    filterReports(
      typeFilterValue,
      dateFilterValue,
      addressFilterValue,
      value.target.value
    );
  };
  const filterReports = (type, date, address, approval) => {
    console.log(type + "  " + date + " " + address + "  " + approval);
    const subtype = type.includes(" - ") ? type.split(" - ")[1] : undefined;
    type =
      type !== "all" && type !== ""
        ? type.includes(" - ")
          ? type.split(" - ")[0]
          : type
        : undefined;
    date = date !== "" && date !== "all" ? date : undefined;
    address = address !== null && address !== "" ? address : undefined;
    approval = approval !== "" && approval !== "all" ? approval : undefined;
    getReports(date, address, type, subtype, approval)
      .then((response) => {
        console.log("filtered: ");
        console.log(response.data);
        changeEvents(response.data);
        getStats(response.data).then((resp) => {
          console.log(resp.data);
          changeStats(resp.data);
        });
      })
      .catch(() => {});
  };
  useEffect(() => {
    if (!sessionStorage.getItem("user")) navigate("/ReportSystem/login");

    getReportTypes()
      .then((response) => {
        const types = [];
        response.data.forEach((type) => {
          types.push({
            label: t(type.name),
            value: type.name,
          });
          type.subtypes.forEach((st) => {
            types.push({
              label: t(type.name + " - " + st),
              value: type.name + " - " + st,
            });
          });
        });
        changeTypes(types);
        console.log(types);

        const temp = [];
        types.forEach((t) => {
          temp.push(t);
        });
        temp.push({ value: "all", label: t("all") });
        // changeFilterTypes(temp);
      })
      .catch();
    getReports()
      .then((response) => {
        console.log(response.data);
        const temp = response.data.map((r) => {
          r.date = r.date.replace(" ", "T");
          return r;
        });
        changeEvents(response.data);
        getStats(temp).then((resp) => {
          console.log(resp.data);
          changeStats(resp.data);
        });
      })
      .catch(() => {});
    detect()
      .then((response) => {
        console.log(response.data);
        changeWarnings(response.data);
      })
      .catch(() => {});
  }, []);

  const handleTabChange = (event, newValue) => {
    if (newValue === "-1") {
      sessionStorage.clear();
      navigate("/ReportSystem/login");
    } else if (newValue !== undefined) {
      setValue(newValue);
    }
  };
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSelectWarn = (id) => {
    warnings.forEach((w) => {
      if (w.id === id) console.log(w);
    });
  };
  return (
    user && (
      <div className="citizen-home-page">
        <AppHeader></AppHeader>
        <div id="tab-menu">
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList onChange={handleTabChange} value={value} centered>
                <Tab label={t("cityMap")} value="0" icon={<MapIcon />} />
                <Tab
                  label={t("statistics")}
                  value="1"
                  icon={<QueryStatsIcon />}
                />
                <Tab label={t("logout")} icon={<LogoutIcon />} value="-1"></Tab>
              </TabList>
            </Box>
            <TabPanel value="0">
              <div className="flex-wrapper">
                <div className="flex-cont">
                  <div className="personal-info">
                    <Avatar src={user.picture} />
                    <span style={{ marginLeft: "15px", display: "block" }}>
                      {user.first_name + " " + user.last_name}
                    </span>
                  </div>
                  <div className="mailbox">
                    <Badge
                      badgeContent={
                        events.filter(
                          (e) => e.approved === false && e.id !== -1
                        ).length
                      }
                      color="primary"
                    >
                      <MailIcon color="action" />
                    </Badge>
                  </div>
                  {warnings.length > 0 && (
                    <div className="mailbox">
                      <IconButton onClick={handleClick}>
                        <Badge badgeContent={warnings.length} color="primary">
                          <NotificationImportantIcon
                            sx={{ color: "red" }}
                            color="action"
                          />
                        </Badge>
                      </IconButton>

                      <Menu
                        id="long-menu"
                        MenuListProps={{
                          "aria-labelledby": "long-button",
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        PaperProps={{
                          style: {
                            maxHeight: 48 * 4.5,
                            width: "320px",
                          },
                        }}
                      >
                        {warnings.map((option) => (
                          <MenuItem
                            key={option.id}
                            // selected={option === "Pyxis"}
                            onClick={() => handleSelectWarn(option.id)}
                          >
                            {option.level === "HIGH" ? (
                              <WarningIcon
                                sx={{ color: "red", marginRight: "10px" }}
                              ></WarningIcon>
                            ) : (
                              <LightbulbIcon
                                sx={{ color: "orange", marginRight: "10px" }}
                              ></LightbulbIcon>
                            )}
                            {" #" +
                              option.id +
                              " : " +
                              option.date.split(".")[0].replace("T", " ") +
                              " - " +
                              t(option.level)}
                          </MenuItem>
                        ))}
                      </Menu>
                    </div>
                  )}
                  <div className="filters">
                    <TextField
                      value={typeFilterValue}
                      onChange={changeTypeFilterValueWrapper}
                      select // tell TextField to render select
                      label={t("type")}
                      sx={{ m: 1, minWidth: 200 }}
                    >
                      <MenuItem value="all">{t("all")}</MenuItem>
                      {reportTypes.map((ss) => {
                        return (
                          <MenuItem key={ss.value} value={ss.value}>
                            {t(ss.label)}
                          </MenuItem>
                        );
                      })}
                    </TextField>

                    <TextField
                      value={dateFilterValue}
                      onChange={changeDateFilterValueWrapper}
                      select // tell TextField to render select
                      label={t("timePeriod")}
                      sx={{ m: 1, minWidth: 200 }}
                    >
                      <MenuItem value="all">{t("all")}</MenuItem>
                      {dateFilterValues.map((ss) => {
                        return (
                          <MenuItem key={ss} value={ss}>
                            {t(ss)}
                          </MenuItem>
                        );
                      })}
                    </TextField>
                    <TextField
                      value={stateFilterValue}
                      onChange={changeStateFilterValueWrapper}
                      select // tell TextField to render select
                      label={t("state")}
                      sx={{ m: 1, minWidth: 200 }}
                    >
                      <MenuItem value="all">{t("all")}</MenuItem>
                      <MenuItem value="true">{t("approved")}</MenuItem>
                      <MenuItem value="false">{t("waiting")}</MenuItem>
                    </TextField>
                    <TextField
                      value={addressFilterValue}
                      onChange={changeAddressFilterValueWrapper}
                      label={t("address")}
                      sx={{ m: 1, minWidth: 300 }}
                    ></TextField>
                  </div>
                </div>
                <CityMap
                  events={events}
                  showSettings={true}
                  render={render}
                  warnings={warnings}
                ></CityMap>
              </div>
            </TabPanel>
            <TabPanel value="1">
              <div className="flex-wrapper">
                <div className="flex-cont">
                  <div className="personal-info">
                    <Avatar src={user.picture} />
                    <span style={{ marginLeft: "15px", display: "block" }}>
                      {user.first_name + " " + user.last_name}
                    </span>
                  </div>
                  <div className="mailbox">
                    <Badge
                      badgeContent={
                        events.filter(
                          (e) => e.approved === false && e.id !== -1
                        ).length
                      }
                      color="primary"
                    >
                      <MailIcon color="action" />
                    </Badge>{" "}
                  </div>
                  {warnings.length > 0 && (
                    <div className="mailbox">
                      <IconButton onClick={handleClick}>
                        <Badge badgeContent={warnings.length} color="primary">
                          <NotificationImportantIcon
                            sx={{ color: "red" }}
                            color="action"
                          />
                        </Badge>
                      </IconButton>

                      <Menu
                        id="long-menu"
                        MenuListProps={{
                          "aria-labelledby": "long-button",
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        PaperProps={{
                          style: {
                            maxHeight: 48 * 4.5,
                            width: "320px",
                          },
                        }}
                      >
                        {warnings.map((option) => (
                          <MenuItem
                            key={option.id}
                            // selected={option === "Pyxis"}
                            onClick={() => handleSelectWarn(option.id)}
                          >
                            {option.level === "HIGH" ? (
                              <WarningIcon
                                sx={{ color: "red", marginRight: "10px" }}
                              ></WarningIcon>
                            ) : (
                              <LightbulbIcon
                                sx={{ color: "orange", marginRight: "10px" }}
                              ></LightbulbIcon>
                            )}
                            {" #" +
                              option.id +
                              " : " +
                              option.date.split(".")[0].replace("T", " ") +
                              " - " +
                              t(option.level)}
                          </MenuItem>
                        ))}
                      </Menu>
                    </div>
                  )}

                  <div className="filters">
                    <TextField
                      value={typeFilterValue}
                      onChange={changeTypeFilterValueWrapper}
                      select // tell TextField to render select
                      label={t("type")}
                      sx={{ m: 1, minWidth: 200 }}
                    >
                      <MenuItem value="all">{t("all")}</MenuItem>
                      {reportTypes.map((ss) => {
                        return (
                          <MenuItem key={ss.value} value={ss.value}>
                            {t(ss.label)}
                          </MenuItem>
                        );
                      })}
                    </TextField>

                    <TextField
                      value={dateFilterValue}
                      onChange={changeDateFilterValueWrapper}
                      select // tell TextField to render select
                      label={t("timePeriod")}
                      sx={{ m: 1, minWidth: 200 }}
                    >
                      <MenuItem value="all">{t("all")}</MenuItem>
                      {dateFilterValues.map((ss) => {
                        return (
                          <MenuItem key={ss} value={ss}>
                            {t(ss)}
                          </MenuItem>
                        );
                      })}
                    </TextField>
                    <TextField
                      value={stateFilterValue}
                      onChange={changeStateFilterValueWrapper}
                      select // tell TextField to render select
                      label={t("state")}
                      sx={{ m: 1, minWidth: 200 }}
                    >
                      <MenuItem value="all">{t("all")}</MenuItem>
                      <MenuItem value="true">{t("approved")}</MenuItem>
                      <MenuItem value="false">{t("waiting")}</MenuItem>
                    </TextField>
                    <TextField
                      value={addressFilterValue}
                      onChange={changeAddressFilterValueWrapper}
                      label={t("address")}
                      sx={{ m: 1, minWidth: 300 }}
                    ></TextField>
                  </div>
                </div>
                <StatsDashboard stats={stats}></StatsDashboard>
              </div>
            </TabPanel>
          </TabContext>
        </div>
        <div id="lng-select">
          <LanguageSelector></LanguageSelector>
        </div>

        <div id="bottom-menu">
          <Box sx={{ centered: true }}>
            <BottomNavigation
              showLabels
              value={value}
              onChange={handleTabChange}
            >
              <BottomNavigationAction
                label={t("cityMap")}
                value="0"
                icon={<MapIcon />}
              />
              <BottomNavigationAction
                label={t("statistics")}
                value="1"
                icon={<QueryStatsIcon />}
              />
              <BottomNavigationAction
                label={t("logoutMobile")}
                value="-1"
                icon={<LogoutIcon />}
              />
            </BottomNavigation>
          </Box>
        </div>
        <div id="footer">
          <AppFooter></AppFooter>
        </div>
      </div>
    )
  );
}
