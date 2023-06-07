import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "../../layouts/AppHeader";
import { AppFooter } from "../../layouts/AppFooter";
import { AccountPicker } from "../../components/AccountPicker";
import { message } from "antd";
import "../../assets/style/CitizenLogin.css";
import { login } from "../../services/citizenService";
import { useTranslation } from "react-i18next";

export function LogIn() {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState("citizen");
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const { t } = useTranslation();
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
    console.log(value);
    if (value === "citizen") navigate("/ReportSystem/citizen/home");
    else if (value === "admin") navigate("/ReportSystem/admin/home");
  };
  const handleAuthResponse = (response) => {
    // console.log(response.credential);
    const accesToken = response.credential;
    login(accesToken)
      .then((result) => {
        const user = result.data;
        console.log("fetched data: " + JSON.stringify(user));
        sessionStorage.setItem("user", JSON.stringify(user));
        if (user.role === "CITIZEN") navigate("/ReportSystem/citizen/home");
        else handleClickOpen();
      })
      .catch((result) => {
        console.log(result);
        messageApi.open({
          type: "error",
          content: t(
            result.response.status === 500
              ? "serviceUnavailable"
              : "invalidCredentials"
          ),
          duration: 0,
        });
        setTimeout(messageApi.destroy, 3000);
      });
  };

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID,
      callback: handleAuthResponse,
    });
    google.accounts.id.renderButton(document.getElementById("signInBtn"), {
      theme: "outlined",
      size: "large",
    });
  }, []);
  return (
    <div className="login-page">
      {contextHolder}
      <AppHeader></AppHeader>
      <div id="signInBtn"></div>
      <AccountPicker
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
      />
      <footer>
        <AppFooter></AppFooter>
      </footer>
    </div>
  );
}
