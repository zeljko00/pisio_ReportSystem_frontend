import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { TabPanel, TabList, TabContext } from "@mui/lab";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import PostAddIcon from "@mui/icons-material/PostAdd";
import MapIcon from "@mui/icons-material/Map";
import LogoutIcon from "@mui/icons-material/Logout";
import { Tab, Box } from "@mui/material";
import { Button, Form, Input, Select, message } from "antd";
import { LanguageSelector } from "../../components/LanguageSelector";
import CityMap from "../../components/CityMap";
import LocationPicker from "../../components/LocationPicker";
import ImageUpload from "../../components/ImageUpload";
import { AppHeader } from "../../layouts/AppHeader";
import { AppFooter } from "../../layouts/AppFooter";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import "../../assets/style/CitizenHomePage.css";

import {
  getReportTypes,
  postReport,
  uploadImage,
  deleteImage,
  getApprovedReports,
} from "../../services/report.service";

// import obj from "../../../package.json";
// const { Panel } = Collapse;

export function CitizenHomePage() {
  let ident = Math.floor(Math.random() * 1000000 + 1); // used add key when uploading report images
  const [reportTypes, changeTypes] = useState([]);
  const [events, changeEvents] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const { TextArea } = Input;
  const [form] = Form.useForm();
  const [value, setValue] = useState("0");
  const navigate = useNavigate();
  const { t } = useTranslation();
  // eslint-disable-next-line no-unused-vars
  const [changed, changeChanged] = useState(false);

  // to enable collecting data from child component we use callback function
  const [position, changePosition] = useState(null);

  const [typeFilterValue, changeTypeFilterValue] = useState("");
  const [dateFilterValue, changeDateFilterValue] = useState("");
  const dateFilterValues = ["24h", "7d", "31d", "6m"];
  const [addressFilterValue, changeAddressFilterValue] = useState();

  const changeTypeFilterValueWrapper = (value) => {
    changeTypeFilterValue(value.target.value);
    filterReports(value.target.value, dateFilterValue, addressFilterValue);
  };
  const changeDateFilterValueWrapper = (value) => {
    changeDateFilterValue(value.target.value);
    filterReports(typeFilterValue, value.target.value, addressFilterValue);
  };
  const changeAddressFilterValueWrapper = (value) => {
    changeAddressFilterValue(value.target.value);
    filterReports(typeFilterValue, dateFilterValue, value.target.value);
  };

  const filterReports = (type, date, address) => {
    console.log(type + "  " + date + " " + address);
    const subtype = type.includes(" - ") ? type.split(" - ")[1] : undefined;
    type =
      type !== "all" && type !== ""
        ? type.includes(" - ")
          ? type.split(" - ")[0]
          : type
        : undefined;
    date = date !== "" && date !== "all" ? date : undefined;
    address = address !== null && address !== "" ? address : undefined;
    getApprovedReports(date, address, type, subtype)
      .then((response) => {
        console.log("filtered: ");
        console.log(response.data);
        changeEvents(response.data);
      })
      .catch(() => {});
  };
  useEffect(() => {
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
    getApprovedReports()
      .then((response) => {
        console.log(response.data);
        changeEvents(response.data);
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
        console.log("sending report");
        const reportRequest = {
          content: values.content,
          type: values.type,
          x: position[0],
          y: position[1],
          id: ident,
        };
        postReport(reportRequest)
          .then((response) => {
            console.log("success");
            ident = Math.floor(Math.random() * 1000000 + 1);
            form.resetFields();
            messageApi.open({
              type: "success",
              content: t("reportSent"),
              duration: 0,
            });
            setTimeout(messageApi.destroy, 4000);
          })
          .catch((error) => {
            console.log("failure");
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
  // const [changing, setChanging] = React.useState(false);
  // const signal = () => {
  //   console.log("changing!");
  //   setChanging(!changing);
  //   messageApi.open({
  //     type: "success",
  //     content: t("successfulProvidingInfo"),
  //     duration: 0,
  //   });
  //   setTimeout(messageApi.destroy, 3000);
  // };
  // const contentStyle = {
  //   margin: "auto",
  //   height: "370px",
  //   color: "#fff",
  //   lineHeight: "260px",
  //   textAlign: "center",
  //   background: "#364d79",
  //   maxWidth: "100%",
  // };
  // const onChange = (currentSlide) => {};

  return (
    <div className="citizen-home-page">
      {contextHolder}
      <AppHeader></AppHeader>
      <div id="tab-menu">
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleTabChange} value={value} centered>
              <Tab label={t("cityMap")} value="0" icon={<MapIcon />} />
              <Tab label={t("newReport")} value="1" icon={<PostAddIcon />} />
              <Tab label={t("logout")} icon={<LogoutIcon />} value="-1"></Tab>
            </TabList>
          </Box>
          <TabPanel value="0">
            <div className="flex-wrapper">
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
                  value={addressFilterValue}
                  onChange={changeAddressFilterValueWrapper}
                  label={t("address")}
                  sx={{ m: 1, minWidth: 300 }}
                ></TextField>
              </div>

              <CityMap events={events}></CityMap>
            </div>
          </TabPanel>
          <TabPanel value="1">
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
                <Form.Item name="content">
                  <TextArea
                    placeholder={t("content")}
                    style={{ fontSize: "18px" }}
                    size="large"
                    rows={5}
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
        </TabContext>
      </div>
      <div id="lng-select">
        <LanguageSelector></LanguageSelector>
      </div>

      <div id="bottom-menu">
        <Box sx={{ centered: true }}>
          <BottomNavigation showLabels value={value} onChange={handleTabChange}>
            <BottomNavigationAction
              label={t("cityMap")}
              value="0"
              icon={<MapIcon />}
            />
            <BottomNavigationAction
              label={t("newReportMobile")}
              value="1"
              icon={<PostAddIcon />}
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
  );
}
