import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { TabPanel, TabList, TabContext } from "@mui/lab";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HistoryIcon from "@mui/icons-material/History";
import PostAddIcon from "@mui/icons-material/PostAdd";
import MapIcon from "@mui/icons-material/Map";
import LogoutIcon from "@mui/icons-material/Logout";
import { Tab, Box } from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import userImg from "../../assets/images/user.png";

import { LanguageSelector } from "../../components/LanguageSelector";
import CityMap from "../../components/CityMap";
import { AppHeader } from "../../layouts/AppHeader";
import { AppFooter } from "../../layouts/AppFooter";

import "../../assets/style/CitizenHomePage.css";
import "../../assets/style/CityOfficialHomePage.css";
import // getReportTypes,
// // postReport,
// getMyReports,
// getReportStates,
"../../services/report.service";
import EventTable from "../../components/EventTable";
import ReportTable from "../../components/ReportTable";
export function CityOfficialHomePage() {
  // eslint-disable-next-line no-unused-vars
  const [changed, changeChanged] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [guest, changeGuest] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [user, changeUser] = useState(null);

  // let counter = 1;

  const { t } = useTranslation();

  useEffect(() => {
    if (sessionStorage.getItem("tab") !== null) {
      console.log("saved tab: " + sessionStorage.getItem("tab"));
      handleChange(null, sessionStorage.getItem("tab"));
    }
    // // counter = 1;
    const temp = JSON.parse(sessionStorage.getItem("user"));
    if (temp !== null && temp !== undefined) {
      changeGuest(false);
      changeUser(temp);
      console.log("switched user to ");
      console.log(temp);
    } else {
      console.log("no user found");
      navigate("/");
    }
  }, []);

  const [value, setValue] = useState("4");

  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    console.log("handling " + newValue);
    if (newValue === "-1") {
      sessionStorage.clear();
      navigate("/CityReportSystem/login");
    } else if (newValue !== undefined) {
      console.log("saving tab: " + newValue);
      sessionStorage.setItem("tab", newValue);
      setValue(newValue);
    }
  };

  return (
    user !== null &&
    user !== undefined && (
      <div className="citizen-home-page">
        {/* {contextHolder} */}
        <AppHeader></AppHeader>

        <div id="tab-menu">
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList onChange={handleChange} value={value} centered>
                <Tab
                  label={t("cityMap")}
                  value="1"
                  icon={<MapIcon />}
                  initial="1"
                />
                <Tab
                  label={t("arrivedReports")}
                  value="2"
                  icon={<PostAddIcon />}
                />
                <Tab label={t("events")} value="3" icon={<HistoryIcon />} />
                <Tab label={t("profile")} value="4" icon={<AccountBoxIcon />} />
                <Tab label={t("logout")} icon={<LogoutIcon />} value="-1"></Tab>
              </TabList>
            </Box>
            <TabPanel value="1">
              <CityMap></CityMap>
            </TabPanel>
            <TabPanel value="2">
              <ReportTable></ReportTable>
              <div className="placeholder-div"></div>
            </TabPanel>
            <TabPanel value="3">
              <EventTable></EventTable>
              <div className="placeholder-div"></div>
            </TabPanel>
            <TabPanel value="4">
              <div className="placeholder-div">
                <div id="acc-info-div">
                  <div id="profile-info-div" className="rounded-edges-div">
                    <img src={userImg} alt="profile-img" id="user-img"></img>
                    <div className="label-div bolded-text">
                      {user.user.firstName} {user.user.lastName}
                    </div>
                    <div className="label-div gray-font">
                      {user.user.education}
                    </div>
                    <div className="label-div gray-font">
                      {user.user.position}
                    </div>
                  </div>
                  <div className="two-row-container">
                    <div id="department-info-div" className="rounded-edges-div">
                      <div className="label-div gray-font">
                        {t("department")}:
                      </div>
                      <div className="label-div bolded-text">
                        {user.user.department.name}
                      </div>
                      <div className="label-div gray-font">
                        {user.user.department.mail}
                      </div>
                      <div className="label-div gray-font">
                        {user.user.department.phone}
                      </div>
                    </div>
                    <div id="data-div" className="rounded-edges-div">
                      <div className="label-div gray-font">
                        {t("createdEvents")}:
                        <span className="count">
                          {" " + user.user.createdEventsNum}
                        </span>
                      </div>
                      <div className="label-div gray-font">
                        {t("activeEvents")}:
                        <span className="count">
                          {" " + user.user.activeEventsNum}
                        </span>
                      </div>
                      <div className="label-div gray-font">
                        {t("solvedReports")}:
                        <span className="count">
                          {" " + user.user.solvedReports}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabPanel>
          </TabContext>
        </div>
        <div id="lng-select">
          <LanguageSelector></LanguageSelector>
        </div>

        <div id="bottom-menu">
          <Box sx={{ centered: true }}>
            <BottomNavigation showLabels value={value} onChange={handleChange}>
              <BottomNavigationAction
                label={t("map")}
                value="1"
                icon={<MapIcon />}
              />
              <BottomNavigationAction
                label={t("arrivedReportsMobile")}
                value="2"
                icon={<PostAddIcon />}
              />
              <BottomNavigationAction
                label={t("eventsMobile")}
                value="3"
                icon={<HistoryIcon />}
              />
              <BottomNavigationAction
                label={t("profileMobile")}
                value="4"
                icon={<AccountBoxIcon />}
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
