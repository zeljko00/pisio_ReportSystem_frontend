import { React } from "react";
import { Form, Input, Button } from "antd";
import { useTranslation } from "react-i18next";
import "../assets/style/ReportAdditionalInfoForm.css";
import { provideInfo } from "../services/report.service";
import PropTypes from "prop-types";
export const ReportAdditionalInfoForm = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const submit = () => {
    form.validateFields().then((values) => {
      console.log(values.providedInfo);
      provideInfo(props.report.id, values.providedInfo);
      props.report.requiredInfo = false;
      props.func();
    });
  };
  return (
    <div className="form-container">
      <Form
        form={form}
        name="additionalInfoForm"
        onSubmit={() => submit()}
        autoComplete="off"
      >
        <Form.Item
          name="providedInfo"
          rules={[{ required: true, message: t("required") }]}
        >
          <Input.TextArea
            placeholder={t("additionalInfo")}
            style={{ fontSize: "14px" }}
            size="large"
            className="info-text-area"
            rows={3}
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            onClick={() => submit()}
            style={{
              fontSize: "16px",
              lineHeight: "16px",
              margin: "0 0 10px 0",
            }}
          >
            {t("send")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
ReportAdditionalInfoForm.propTypes = {
  report: PropTypes.object,
  func: PropTypes.func,
};
