import React from "react";
import { Button, Form, Input, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { login } from "../services/citizenService.js";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

export function LogInForm(props) {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const register = () => {
    navigate("/ReportSystem/citizen/signup");
  };

  const submit = () => {
    form.validateFields().then((values) => {
      login(values.username, values.password)
        .then((result) => {
          // successful login - changing current user
          // console.log("fetched user data: " + result.data);
          // sessionStorage.setItem("user", JSON.stringify(result.data));
          // if (result.data.user.role === "CITIZEN")
          //   navigate("/CityReportSystem/citizen/home");
          // else props.func();
        })
        .catch((result) => {
          console.log(result.response.status);
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
    });
  };

  return (
    <div className="login-form-container">
      {contextHolder}
      <Form
        form={form}
        name="loginform"
        initialValues={{ remember: true }}
        onSubmit={() => submit()}
        autoComplete="off"
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: t("usernameMissing") }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder={t("username")}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: t("passwordMissing") }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder={t("password")}
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button gray-text"
            onClick={() => submit()}
            id="login-btn"
          >
            {t("loginBtn")}
          </Button>
          <a className="gray-text" onClick={register}>
            {t("register")}
          </a>
        </Form.Item>
      </Form>
    </div>
  );
}

LogInForm.propTypes = {
  func: PropTypes.func,
};
