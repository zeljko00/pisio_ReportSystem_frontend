/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TabPanel, TabList, TabContext } from "@mui/lab";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import { Tab, Box } from "@mui/material";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import { LanguageSelector } from "../../components/LanguageSelector";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import CityMap from "../../components/CityMap";
import { AppHeader } from "../../layouts/AppHeader";
import { AppFooter } from "../../layouts/AppFooter";
import "../../assets/style/CitizenHomePage.css";
import "../../assets/style/ManagerHomePage.css";
import { getStats, getYearStats } from "../../services/stats.service";
import { getReportTypes } from "../../services/report.service";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ReportMap } from "../../components/ReportMap";
import { LayersControl } from "react-leaflet";
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import { UserSwitchOutlined } from "@ant-design/icons";
export function ManagerHomePage() {
  const date = new Date();
  const [reportStates, changeStates] = useState([]);
  const [reports, setReports] = useState([]);
  const [typeFilter, changeTypeFilter] = useState("all");
  const [reportTypes, setReportTypes] = useState(null);
  const [value, setValue] = React.useState("2");
  const [guest, changeGuest] = useState(true);
  const [firstDate, setFirstDate] = useState(
    date.getFullYear() +
      "-" +
      ((date.getMonth() + 1 > 9 ? "" : "0") + (date.getMonth() + 1)) +
      "-01"
  );
  const [lastDate, setLastDate] = useState(
    date.getFullYear() +
      "-" +
      ((date.getMonth() + 1 > 9 ? "" : "0") + (date.getMonth() + 1)) +
      "-" +
      ((date.getDate() > 9 ? "" : "0") + date.getDate())
  );
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [totalReports, setTotalReports] = React.useState("");
  const [solvedReports, setSolvedReports] = React.useState("");
  const [avgTime, setAvgTime] = React.useState("");
  const [maxTime, setMaxTime] = React.useState("");
  const [differencePer, setDifferencePer] = React.useState("");
  const [solvedPer, setSolvedPer] = React.useState("");
  const [avgPer, setAvgPer] = React.useState("");
  const [pieData, setPieData] = React.useState(null);
  const [avgTimePerType, setAvgTimePerType] = useState(null);
  const [reportsPerType, setReportsPerType] = useState(null);
  const [reportsPerDay, setReportsPerDay] = useState(0);
  const [solvedPerDay, setSolvedPerDay] = useState(0);
  const [areaChartData, setAreaChartData] = useState(null);

  const [year, setYear] = useState(date.getFullYear());
  const [yearTotalReports, setYearTotalReports] = useState(0);
  const [yearPerDayReports, setYearPerDayReports] = useState(0);
  const [yearPerDaySolved, setYearPerDaySolved] = useState(0);
  const [yearSolvedReports, setYearSoldReports] = useState(0);
  const [yearPerMonthData, setYearPerMonthData] = useState(null);
  const [yearPerTypeData, setYearPerTypeData] = useState(null);
  const [yearPerDepartmentData, setYearPerDeprtmentData] = useState(null);
  const [yearSolvedPercentage, setYearSolvedPercentage] = useState(null);

  useEffect(() => {
    if (sessionStorage.getItem("tab") !== null) {
      handleChange(null, sessionStorage.getItem("tab"));
    }
    const temp = JSON.parse(sessionStorage.getItem("user"));
    if (
      temp !== null &&
      temp !== undefined &&
      temp.user.role === "CITY_MANAGER"
    ) {
      changeGuest(false);
      fetchData(typeFilter, firstDate, lastDate);
      fetchYearData(year);
    } else {
      navigate("/CityReportSystem/login");
    }
    getReportTypes().then((response) => {
      setReportTypes(response.data);
    });
  }, []);

  const handleChange = (event, newValue) => {
    if (newValue === "-1") {
      sessionStorage.clear();
      navigate("/CityReportSystem/login");
    } else if (newValue !== undefined) {
      sessionStorage.setItem("tab", newValue);
      setValue(newValue);
    }
  };
  const handleChangeTypeFilter = (event) => {
    const temp = event.target.value;
    changeTypeFilter(temp);
    fetchData(temp, firstDate, lastDate);
  };
  const handleChangeYearFilter = (event) => {
    const temp = event.target.value;
    console.log("year to fetch: " + temp);
    fetchYearData(temp);
    setYear(temp);
  };
  const handleChangeFirstDate = (event) => {
    const month = event.$M + 1;
    const temp =
      event.$y +
      "-" +
      ((month > 9 ? "" : "0") + month) +
      "-" +
      ((event.$D > 9 ? "" : "0") + event.$D);
    setFirstDate(temp);
    fetchData(typeFilter, temp, lastDate);
  };
  const handleChangeLastDate = (event) => {
    const month = event.$M + 1;
    const temp =
      event.$y +
      "-" +
      ((month > 9 ? "" : "0") + month) +
      "-" +
      ((event.$D > 9 ? "" : "0") + event.$D);
    setLastDate(temp);
    fetchData(typeFilter, firstDate, temp);
  };

  const fetchData = (type, first, last) => {
    getStats(type, first, last).then((response) => {
      setTotalReports(response.data.reports);
      setSolvedReports(response.data.solvedReports);
      const avg = parseTimeInMin(response.data.avgTimeInMin);
      setAvgTime(
        avg[0] +
          " " +
          t("days") +
          " " +
          avg[1] +
          " " +
          t("hours") +
          " " +
          avg[2] +
          " " +
          t("mins")
      );
      const max = parseTimeInMin(response.data.maxTime.number);
      setMaxTime({
        value:
          max[0] +
          " " +
          t("days") +
          " " +
          max[1] +
          " " +
          t("hours") +
          " " +
          max[2] +
          " " +
          t("mins"),
        type: response.data.maxTime.type,
      });
      setAvgPer(response.data.avgPercentage);
      setDifferencePer(response.data.differencePercentage);
      setSolvedPer(response.data.solvedPercentage);
      setReports(response.data.reportsData);
      setReportsPerDay(response.data.reportsPerDay);
      setSolvedPerDay(response.data.solvedPerDay);
      const array = [];
      response.data.reportsPerType.forEach((tuple) => {
        if (tuple.number !== 0)
          array.push({
            name: t(tuple.type),
            value: tuple.number / response.data.reports,
          });
      });
      setPieData(array);
      const avgTime = [];
      response.data.avgTimePerType.forEach((tuple) => {
        avgTime.push({
          name: t(tuple.type),
          h: tuple.number,
          amt: 0.3,
        });
      });

      setAvgTimePerType(avgTime);
      const perType = [];
      response.data.reportsPerType.forEach((tuple) => {
        perType.push({
          name: t(tuple.type),
          n: tuple.number,
          amt: 0.3,
        });
      });

      setReportsPerType(perType);
      const temp = [];
      response.data.dataPerDay.forEach((tuple) => {
        temp.push({
          name: tuple.date,
          zaprimljeno: tuple.received,
          obrađeno: tuple.solved,
        });
      });

      setAreaChartData(temp);
    });
  };
  const fetchYearData = (year) => {
    getYearStats(year)
      .catch()
      .then((response) => {
        setYearPerDayReports(response.data.receivedPerDay);
        setYearPerDaySolved(response.data.solvedPerDay);
        setYearPerTypeData(response.data.perType);
        setYearTotalReports(response.data.received);
        setYearSoldReports(response.data.solved);
        setYearSolvedPercentage(
          (response.data.solved * 100.0) / response.data.received
        );
        const ar = [];
        response.data.perType.forEach((d) => {
          ar.push({
            name: t(d.type),
            value: d.number / response.data.received,
          });
        });
        setYearPerTypeData(ar);

        const temp = [];
        response.data.perDepartmentData.forEach((d) => {
          temp.push({
            name: d.department,
            zaprimljeno: d.received,
            obrađeno: d.solved,
            h: d.avgTime,
          });
        });

        setYearPerDeprtmentData(temp);

        const array = [];

        response.data.perMonth.forEach((d) => {
          array.push({
            name: d.month,
            zaprimljeno: d.received,
            obrađeno: d.solved,
          });
        });

        setYearPerMonthData(array);
      });
  };
  const parseTimeInMin = (time) => {
    const days = Math.floor(time / (60 * 24));
    let mins = time - days * 60 * 24;
    const hours = Math.floor(mins / 60);
    mins = Math.floor(mins - hours * 60);
    if (isNaN(days) || isNaN(hours) || isNaN(mins)) return [0, 0, 0];
    return [days, hours, mins];
  };
  return (
    areaChartData &&
    yearPerMonthData && (
      <div className="citizen-home-page">
        <AppHeader></AppHeader>
        <div id="tab-menu">
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList onChange={handleChange} value={value} centered>
                <Tab
                  label={t("statistics")}
                  value="2"
                  icon={<QueryStatsIcon />}
                  disabled={guest}
                />
                <Tab
                  label={t("activityInspection")}
                  value="3"
                  icon={<HistoryIcon />}
                  disabled={guest}
                />
                <Tab
                  label={t("logout")}
                  icon={<LogoutIcon />}
                  value="-1"
                  disabled={guest}
                ></Tab>
                <Tab style={{ display: "none" }} value="0"></Tab>
              </TabList>
            </Box>
            <TabPanel value="2">
              {" "}
              <div className="dashboard">
                <div className="dashboard-header">
                  <div className="blue-div dashboard-cell">
                    <p className="value large-font medium-top-margin">
                      {totalReports + "  ("}
                      {reportsPerDay.toFixed(2)}
                      <span className="small-font">{" / " + t("perDay")}</span>
                      {")"}
                    </p>
                    <p className="key">{t("total")}</p>
                  </div>
                  <div className="purple-div dashboard-cell">
                    {solvedPer >= 100 ? (
                      <p className="details success">{solvedPer + "%"}</p>
                    ) : (
                      <p className="details bad">{solvedPer + "%"}</p>
                    )}
                    <p className="value large-font large-top-margin">
                      {solvedReports + "  ("}
                      {solvedPerDay.toFixed(2)}
                      <span className="small-font">{" / " + t("perDay")}</span>
                      {")"}
                    </p>
                    <p className="key">{t("solved")}</p>
                  </div>
                  <div className="blue-div dashboard-cell">
                    {avgPer <= 100 ? (
                      <p className="details success">
                        {"-" + (100 - avgPer) + "%"}
                      </p>
                    ) : (
                      <p className="details bad">
                        {" "}
                        {"+" + (avgPer - 100) + "%"}
                      </p>
                    )}
                    <p className="value medium-font custom-top-margin">
                      {avgTime}
                    </p>
                    <p className="key">{t("avgTime")}</p>
                  </div>
                  <div className="purple-div dashboard-cell">
                    <p className="details bad">{differencePer + "%"}</p>

                    <p className="value medium-font custom-top-margin">
                      {maxTime.value}
                    </p>
                    <p className="key">
                      {t("maxTime") + " (" + t(maxTime.type) + ")"}
                    </p>
                  </div>
                </div>
                <div className="type-pie">
                  {" "}
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart width={700} height={400}>
                      <Pie
                        data={pieData}
                        cx="37%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Legend
                        verticalAlign="top"
                        align="left"
                        height={26}
                        layout="vertical"
                      />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="legend">{t("perTypePercentage")}</div>
                <div className="time-for-solving-per-type">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      width={500}
                      height={300}
                      data={avgTimePerType}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis dataKey="h" />
                      <Tooltip />

                      <Bar dataKey="h" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="legend">{t("timePerType")}</div>
                <div className="time-for-solving-per-type">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      width={500}
                      height={300}
                      data={reportsPerType}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis dataKey="n" />
                      <Tooltip />

                      <Bar dataKey="n" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="legend">{t("reportsPerType")}</div>
                <div className="area-chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      height={250}
                      width={500}
                      data={areaChartData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorUv"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#8884d8"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#8884d8"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorPv"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#82ca9d"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#82ca9d"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" />
                      <YAxis dataKey="zaprimljeno" />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="obrađeno"
                        stroke="#8884d8"
                        fillOpacity={1}
                        fill="url(#colorUv)"
                      />
                      <Area
                        type="monotone"
                        dataKey="zaprimljeno"
                        stroke="#82ca9d"
                        fillOpacity={1}
                        fill="url(#colorPv)"
                      />
                      <Legend></Legend>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="legend">{t("dynamicPerDay")}</div>
                <ReportMap reports={reports}></ReportMap>
                <div className="filters-container">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      sx={{ m: 1 }}
                      label={t("firstDate")}
                      onChange={handleChangeFirstDate}
                    />
                  </LocalizationProvider>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      sx={{ m: 1 }}
                      label={t("lastDate")}
                      onChange={handleChangeLastDate}
                    />
                  </LocalizationProvider>
                  <FormControl sx={{ m: 1, minWidth: 200 }} fullwidth>
                    <InputLabel id="demo-simple-select-label">
                      {t("report")}
                    </InputLabel>
                    <Select
                      value={typeFilter}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label={t("report")}
                      onChange={handleChangeTypeFilter}
                    >
                      <MenuItem value="all">{t("all")}</MenuItem>
                      {reportTypes.map((et) => {
                        return (
                          <MenuItem key={et} value={et}>
                            {t(et)}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                </div>
              </div>
            </TabPanel>
            <TabPanel value="3">
              <div className="dashboard">
                <div className="dashboard-header">
                  <div className="blue-div dashboard-cell">
                    <p className="value large-font medium-top-margin">
                      {yearTotalReports + "  ("}
                      {yearPerDayReports.toFixed(2)}
                      <span className="small-font">{" / " + t("perDay")}</span>
                      {")"}
                    </p>
                    <p className="key">{t("total")}</p>
                  </div>
                  <div className="purple-div dashboard-cell">
                    {yearSolvedPercentage >= 80 ? (
                      <p className="details success">
                        {yearSolvedPercentage.toFixed(2) + "%"}
                      </p>
                    ) : (
                      <p className="details bad">
                        {yearSolvedPercentage.toFixed(2) + "%"}
                      </p>
                    )}
                    <p className="value large-font large-top-margin">
                      {yearSolvedReports + "  ("}
                      {yearPerDaySolved.toFixed(2)}
                      <span className="small-font">{" / " + t("perDay")}</span>
                      {")"}
                    </p>
                    <p className="key">{t("solved")}</p>
                  </div>
                </div>
                <div className="type-pie">
                  {" "}
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart width={400} height={400}>
                      <Pie
                        data={yearPerTypeData}
                        cx="37%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={140}
                        fill="#8884d8"
                        dataKey="value"
                        la
                      >
                        {yearPerTypeData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Legend
                        verticalAlign="top"
                        align="left"
                        height={26}
                        layout="vertical"
                      />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="legend">{t("perTypePercentage")}</div>
                <div className="time-for-solving-per-type">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      width={500}
                      height={300}
                      data={yearPerDepartmentData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis dataKey="zaprimljeno" />
                      <Tooltip />

                      <Bar dataKey="zaprimljeno" fill="#8884d8" />
                      <Bar dataKey="obrađeno" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="legend">{t("perDepartment")}</div>
                <div className="time-for-solving-per-type">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      width={500}
                      height={300}
                      data={yearPerDepartmentData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis dataKey="h" />
                      <Tooltip />
                      <Bar dataKey="h" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="legend">{t("perDepartmentTime")}</div>
                <div className="area-chart">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      height={250}
                      width={500}
                      data={yearPerMonthData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorUv"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#8884d8"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#8884d8"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="colorPv"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#82ca9d"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#82ca9d"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="obrađeno"
                        stroke="#8884d8"
                        fillOpacity={1}
                        fill="url(#colorUv)"
                      />
                      <Area
                        type="monotone"
                        dataKey="zaprimljeno"
                        stroke="#82ca9d"
                        fillOpacity={1}
                        fill="url(#colorPv)"
                      />
                      <Legend></Legend>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="legend">{t("dynamic")}</div>
                <div className="filters-container">
                  <FormControl sx={{ m: 1, minWidth: 200 }} fullwidth>
                    <InputLabel id="demo-simple-select-label">
                      {t("year")}
                    </InputLabel>
                    <Select
                      value={year}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      label={t("year")}
                      onChange={handleChangeYearFilter}
                    >
                      <MenuItem key={2022} value={2022}>
                        2022
                      </MenuItem>
                      <MenuItem key={2023} value={2023}>
                        2023
                      </MenuItem>
                    </Select>
                  </FormControl>
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
                label={t("statistics")}
                value="2"
                icon={<QueryStatsIcon />}
                disabled={guest}
              />
              <BottomNavigationAction
                label={t("activityInspection")}
                value="3"
                icon={<HistoryIcon />}
                disabled={guest}
              />
              <BottomNavigationAction
                label={t("logoutMobile")}
                value="-1"
                icon={<LogoutIcon />}
                disabled={guest}
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

const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
];

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#2dea89",
  "#b2dc18",
  "#dcc718",
  "#15ad13",
  "#2dead9",
  "#1091be",
  "#9610be",
  "#f7690d",
  "#dcc718",
  "#71dc18",
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}\n%`}
    </text>
  );
};
