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
import Badge from "@mui/material/Badge";
import MailIcon from "@mui/icons-material/Mail";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Button, Form, Input, Select, message, Collapse, Carousel } from "antd";

import { LanguageSelector } from "../../components/LanguageSelector";
import CityMap from "../../components/CityMap";
// import { CitizenInfo } from "../../components/CitizenInfo";
import LocationPicker from "../../components/LocationPicker";
import ImageUpload from "../../components/ImageUpload";
import { AppHeader } from "../../layouts/AppHeader";
import { AppFooter } from "../../layouts/AppFooter";

import "../../assets/style/CitizenHomePage.css";

import {
  getReportTypes,
  postReport,
  getMyReports,
  getReportStates,
  uploadImage,
  deleteImage,
} from "../../services/report.service";
import obj from "../../../package.json";
import { ReportAdditionalInfoForm } from "../../components/ReportAdditionalInfoForm";

const { Panel } = Collapse;
export function CitizenHomePage() {
  let ident = Math.floor(Math.random() * 1000000 + 1); // used add key when uploading report images
  const [reportTypes, changeTypes] = useState([]);
  const [reportFilterTypes, changeFilterTypes] = useState([]); // used for filtering my reports
  const [reportStates, changeStates] = useState([]);
  const [myReports, changeMyReports] = useState([]);
  const [myFilteredReports, changeMyFilteredReports] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  // eslint-disable-next-line no-unused-vars
  const [changed, changeChanged] = useState(false);

  const [typeFilterValue, changeTypeFilterValue] = useState("");
  const [stateFilterValue, changeStateFilterValue] = useState("");

  const [guest, changeGuest] = useState(true);
  const [user, changeUser] = useState(null);

  let counter = 1;

  const { t } = useTranslation();

  const sortCriteria = [
    { value: "date", label: t("date") },
    { value: "state", label: t("state") },
    { value: "type", label: t("type") },
  ];

  const sortByDate = {
    method: (r1, r2) => {
      const tokens1 = r1.date.split(" ");
      const date1 = tokens1[0].split(".");
      const time1 = tokens1[1].split(":");

      const tokens2 = r2.date.split(" ");
      const date2 = tokens2[0].split(".");
      const time2 = tokens2[1].split(":");

      const d1 = new Date(
        date1[2],
        date1[1] - 1,
        date1[0],
        time1[0],
        time1[1],
        time1[2]
      );

      const d2 = new Date(
        date2[2],
        date2[1] - 1,
        date2[0],
        time2[0],
        time2[1],
        time2[2]
      );
      console.log(d1.getTime() < d2.getTime());

      return d1.getTime() < d2.getTime();
    },
  };
  const sortByType = {
    method: (r1, r2) => {
      return r1.type.localeCompare(r2.type);
    },
  };
  const sortByState = {
    method: (r1, r2) => {
      return r1.state.localeCompare(r2.state);
    },
  };
  const sortDefault = {
    method: (r1, r2) => {
      return true;
    },
  };
  const [sortFunction, changeSortFunction] = useState(sortDefault);

  const filterFunc = (state, type) => {
    console.log("state: " + state + "   " + "type: " + type);
    let t = myReports;
    if (state !== "all" && state !== "") {
      t = t.filter((r) => {
        return r.state === state;
      });
    } else console.log("all");
    if (type !== "all" && type !== "") {
      t = t.filter((r) => {
        return r.type === type;
      });
    } else console.log("all");
    changeMyFilteredReports(t);
  };
  const stateFilter = (value) => {
    console.log(value);
    changeStateFilterValue(value);
    filterFunc(value, typeFilterValue);
  };
  const typeFilter = (value) => {
    console.log(value);
    changeTypeFilterValue(value);
    filterFunc(stateFilterValue, value);
  };

  const sortFunc = (value) => {
    if (value === "date") {
      console.log("sort by date");
      changeSortFunction(sortByDate);
    } else if (value === "type") {
      console.log("sort by type");
      changeSortFunction(sortByType);
    } else {
      console.log("sort by state");
      changeSortFunction(sortByState);
    }
  };
  useEffect(() => {
    if (sessionStorage.getItem("tab") !== null) {
      console.log("saved tab: " + sessionStorage.getItem("tab"));
      handleChange(null, sessionStorage.getItem("tab"));
    }
    counter = 1;
    const temp = JSON.parse(sessionStorage.getItem("user"));
    if (temp !== null && temp !== undefined) {
      changeGuest(false);
      changeUser(temp);
      console.log("switched user to ");
      console.log(temp);
      getReportTypes()
        .then((response) => {
          const types = response.data.map((type) => {
            return {
              value: type,
              label: t(type),
            };
          });
          changeTypes(types);

          // report types for filtering (added 'all')
          const temp = [];
          types.forEach((t) => {
            temp.push(t);
          });
          temp.push({ value: "all", label: t("all") });
          changeFilterTypes(temp);
        })
        .catch();
      getReportStates()
        .then((response) => {
          const states = response.data.map((type) => {
            return {
              value: type,
              label: t(type),
            };
          });
          states.push({ value: "all", label: t("all") });
          changeStates(states);
        })
        .catch();

      console.log("fetching my reports");
      getMyReports(temp.user.id)
        .then((response) => {
          sessionStorage.setItem("myReports", JSON.stringify(response.data));
          changeMyReports(response.data);
          changeMyFilteredReports(response.data);
        })
        .catch();
    } else {
      changeUser("guest");
    }
  }, []);

  const { TextArea } = Input;

  const [form] = Form.useForm();
  const [value, setValue] = useState("0");

  const navigate = useNavigate();
  // to enable collecting data from child component we use callback function
  let position = null;
  const changePosition = (pos) => {
    position = pos;
  };

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

  const submit = () => {
    form.validateFields().then((values) => {
      if (position === null) {
        messageApi.open({
          type: "error",
          content: t("coordinatesMissing"),
          duration: 0,
        });
        setTimeout(messageApi.destroy, 3000);
      } else {
        let user;
        if (sessionStorage.getItem("user") !== null) {
          console.log("not guest");
          user = JSON.parse(sessionStorage.getItem("user")).user.id;
          console.log(user);
        } else {
          console.log("guest");
          user = -1;
        }
        const reportRequest = {
          id: ident,
          title: values.title,
          note: values.note,
          content: values.content,
          type: values.type,
          x: position[0],
          y: position[1],
          creator: user,
        };
        postReport(reportRequest)
          .then((response) => {
            ident = Math.floor(Math.random() * 1000000 + 1);
            form.resetFields();
            myReports.push(response.data);
            messageApi.open({
              type: "success",
              content: t("reportSent"),
              duration: 0,
            });
            setTimeout(messageApi.destroy, 4000);
          })
          .catch((error) => {
            messageApi.open({
              type: "error",
              content: error,
              duration: 0,
            });
            setTimeout(messageApi.destroy, 3000);
          });
      }
    });
  };
  const [changing, setChanging] = React.useState(false);
  const signal = () => {
    console.log("changing!");
    setChanging(!changing);
    messageApi.open({
      type: "success",
      content: t("successfulProvidingInfo"),
      duration: 0,
    });
    setTimeout(messageApi.destroy, 3000);
  };
  const contentStyle = {
    margin: "auto",
    height: "370px",
    color: "#fff",
    lineHeight: "260px",
    textAlign: "center",
    background: "#364d79",
    maxWidth: "100%",
  };
  const onChange = (currentSlide) => {};

  return (
    user !== null &&
    user !== undefined && (
      <div className="citizen-home-page">
        {contextHolder}
        <AppHeader></AppHeader>
        <div id="tab-menu">
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList onChange={handleChange} value={value} centered>
                <Tab label={t("cityMap")} value="1" icon={<MapIcon />} />
                <Tab
                  label={t("newReport")}
                  value="2"
                  icon={<PostAddIcon />}
                  disabled={guest}
                />
                <Tab
                  label={t("reportHistory")}
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
            <TabPanel value="0"></TabPanel>
            <TabPanel value="1">
              <CityMap></CityMap>
            </TabPanel>
            <TabPanel value="2">
              <div className="report-container">
                <Form
                  form={form}
                  name="reportForm"
                  initialValues={{ remember: true }}
                  onSubmit={() => submit()}
                  autoComplete="off"
                >
                  <Form.Item
                    name="type"
                    rules={[{ required: true, message: t("requiredSelect") }]}
                  >
                    <Select
                      showSearch
                      placeholder={t("type")}
                      optionFilterProp="children"
                      style={{ fontSize: "18px" }}
                      size="large"
                      filterOption={(input, option) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={reportTypes}
                    />
                  </Form.Item>
                  <Form.Item
                    name="title"
                    rules={[{ required: true, message: t("required") }]}
                  >
                    <Input
                      placeholder={t("title")}
                      style={{ fontSize: "18px" }}
                      size="large"
                    />
                  </Form.Item>
                  <Form.Item name="content">
                    <TextArea
                      placeholder={t("content")}
                      style={{ fontSize: "18px" }}
                      size="large"
                      rows={5}
                    />
                  </Form.Item>
                  <Form.Item name="note">
                    <TextArea
                      placeholder={t("note")}
                      style={{ fontSize: "18px" }}
                      size="large"
                      rows={3}
                    />
                  </Form.Item>
                  <Form.Item>
                    <LocationPicker
                      callback={changePosition}
                      deviceLocation={true}
                    ></LocationPicker>
                  </Form.Item>
                  <Form.Item>
                    <ImageUpload
                      identificator={ident}
                      uploadImage={uploadImage}
                      deleteImage={deleteImage}
                    ></ImageUpload>
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="login-form-button"
                      onClick={() => submit()}
                      id="send-btn"
                      style={{
                        fontSize: "20px",
                        lineHeight: "20px",
                        margin: "0 0 10px 0",
                      }}
                    >
                      {t("send")}
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </TabPanel>
            <TabPanel value="3">
              <div className="wrapper">
                <div id="user-info-div">
                  <AccountCircleIcon
                    sx={{ fontSize: "50px" }}
                    color="info"
                  ></AccountCircleIcon>
                  {user && user !== "guest" && (
                    <span id="user-info">
                      {user.user.firstName + " " + user.user.lastName}
                    </span>
                  )}
                </div>
                <div className="filter-sort-div">
                  <Select
                    onChange={typeFilter}
                    placeholder={t("typeFilter")}
                    optionFilterProp="children"
                    style={{ fontSize: "18px" }}
                    size="large"
                    options={reportFilterTypes}
                    className="filter-sort-select"
                  />
                  <Select
                    onChange={stateFilter}
                    placeholder={t("stateFilter")}
                    optionFilterProp="children"
                    style={{ fontSize: "18px" }}
                    size="large"
                    options={reportStates}
                    className="filter-sort-select"
                  />
                  <Select
                    onChange={sortFunc}
                    placeholder={t("sort")}
                    optionFilterProp="children"
                    style={{ fontSize: "18px" }}
                    size="large"
                    options={sortCriteria}
                    className="filter-sort-select"
                  />
                </div>
                <div className="report-history-container">
                  <Collapse accordion>
                    {myFilteredReports &&
                      myFilteredReports
                        .sort(sortFunction.method)
                        .map((report) => {
                          return (
                            <Panel
                              header={
                                <span className="reportHeader">
                                  <span className="title-span">
                                    {counter++}.&nbsp;&nbsp;&nbsp;{report.title}
                                  </span>
                                  <span className="type-span">
                                    {t("reportType")}&nbsp;&nbsp;&nbsp;
                                    {t(report.type)}
                                  </span>
                                  <span className="time-span">
                                    {t("reportCreationTime")}&nbsp;&nbsp;&nbsp;
                                    {report.date}
                                  </span>
                                  <span className="state-span">
                                    {t(report.state)}

                                    {report.requiredInfo && (
                                      <span>
                                        &nbsp;&nbsp;&nbsp;&nbsp;
                                        <Badge badgeContent={1} color="primary">
                                          <MailIcon color="action" />
                                        </Badge>
                                      </span>
                                    )}
                                  </span>
                                </span>
                              }
                              key={report.id}
                              className="reportInfo"
                            >
                              <p>
                                <span className="title-span-extended">
                                  {t("content") + ": "}
                                </span>
                                <br />
                                {report.content}
                              </p>
                              {report.note !== null && report.note !== "" && (
                                <p>
                                  <span className="title-span-extended">
                                    {t("note") + ": "}
                                  </span>
                                  <br />

                                  {report.note}
                                </p>
                              )}
                              {report.feedback && report.feedback !== "" && (
                                <p>
                                  <span className="title-span-extended">
                                    {t("feedback") + ": "}
                                  </span>
                                  <br />

                                  {report.feedback}
                                </p>
                              )}

                              {report.providedAdditionalInfo !== null &&
                                report.providedAdditionalInfo !== "" && (
                                  <p>
                                    <span className="title-span-extended">
                                      {t("additionalInfo") + ": "}
                                    </span>
                                    <br />
                                    {report.providedAdditionalInfo}
                                  </p>
                                )}
                              {report.requiredInfo && (
                                <p>
                                  <span className="title-span-extended red-text">
                                    {t("requiredInfo") + ": "}
                                  </span>
                                  <br />
                                  {report.requiredAdditionalInfo}
                                </p>
                              )}
                              {report.requiredInfo && (
                                <ReportAdditionalInfoForm
                                  report={report}
                                  func={signal}
                                ></ReportAdditionalInfoForm>
                              )}

                              <div className="galery-container">
                                <Carousel afterChange={onChange}>
                                  {report.images &&
                                    report.images.map((img) => {
                                      return (
                                        <div key={img.id}>
                                          <img
                                            src={
                                              obj.proxy +
                                              "/CityReportSystem/reports/images/" +
                                              img.id
                                            }
                                            style={contentStyle}
                                          ></img>
                                        </div>
                                      );
                                    })}
                                </Carousel>
                              </div>
                            </Panel>
                          );
                        })}
                  </Collapse>
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
                label={t("cityMap")}
                value="1"
                icon={<MapIcon />}
              />
              <BottomNavigationAction
                label={t("newReportMobile")}
                value="2"
                icon={<PostAddIcon />}
                disabled={guest}
              />
              <BottomNavigationAction
                label={t("reportHistoryMobile")}
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
