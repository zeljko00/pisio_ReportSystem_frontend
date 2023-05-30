import React from "react";
import { Button, Form, Input, message } from "antd";
import { useTranslation } from "react-i18next";
import { createCitizen } from "../services/citizenService";
import { useNavigate } from "react-router-dom";

const formItemLayout = {
  labelCol: {
    sm: { span: 5 },
  },
  wrapperCol: {
    sm: { span: 19 },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    sm: {
      span: 19,
      offset: 5,
    },
  },
};

export function SignUpForm() {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log("Received values from form: ", values);
    createCitizen({
      firstName: values.firstname,
      lastName: values.lastname,
      passwordHash: values.password,
    })
      .then((response) => {
        console.log(response.data);
        sessionStorage.setItem("user", JSON.stringify(response.data));
        navigate("/ReportSystem/citizen/home");
      })
      .catch((e) => {
        messageApi.open({
          type: "error",
          content: t("error"),
          duration: 0,
          style: { fontSize: "large" },
        });
        setTimeout(messageApi.destroy, 4000);
      });
  };

  return (
    <div>
      {contextHolder}
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={onFinish}
        scrollToFirstError
      >
        <Form.Item
          name="firstname"
          label={t("firstname")}
          rules={[
            {
              message: t("required"),
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="lastname"
          label={t("lastname")}
          rules={[
            {
              message: t("required"),
              required: true,
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label={t("password")}
          rules={[
            {
              required: true,
              message: t("required"),
            },
            {
              min: 8,
              message: t("passwordRule"),
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label={t("confirmPassword")}
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: t("required"),
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error(t("notMatchingPasswords")));
              },
            }),
          ]}
        >
          <Input.Password className="password-input" />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button
            type="primary"
            htmlType="submit"
            id="submit-btn"
            className="register-btn"
          >
            {t("register")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default SignUpForm;
