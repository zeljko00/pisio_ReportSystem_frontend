import React from "react";
import { Button, Form, Input, Radio } from "antd";
import ImageUpload from "../components/ImageUpload";
// eslint-disable-next-line no-unused-vars
import LocationPicker from "../components/LocationPicker";
import AreaPicker from "../components/AreaPicker";
import { useTranslation } from "react-i18next";
import {
  createEvent,
  uploadImage,
  deleteImage,
} from "../services/eventService";
import PropTypes from "prop-types";
export function NewEventDialog(props) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { TextArea } = Input;
  let ident = Math.floor(Math.random() * 1000000 + 1);
  const [location, setLocation] = React.useState(null);
  const [type, setType] = React.useState("INFO");
  const changeLocation = (loc) => {
    console.log(loc);
    setLocation(loc);
  };
  const submit = () => {
    form.validateFields().then((values) => {
      if (location.position === null) {
        props.returnData("location missing");
      } else {
        const user = JSON.parse(sessionStorage.getItem("user")).user;
        const coordinates = [];
        location.areas.forEach((value) => {
          value.coords.forEach((v) => {
            coordinates.push({
              area: value.id,
              x: v.lat,
              y: v.lng,
            });
          });
        });
        const event = {
          random: ident,
          title: values.title,
          description: values.desc,
          type,
          x: location.position[0],
          y: location.position[1],
          creator: user.id,
          coords: coordinates,
        };
        console.log(event);
        createEvent(event)
          .then((response) => {
            ident = Math.floor(Math.random() * 1000000 + 1);
            form.resetFields();
            props.returnData(response.data);
          })
          .catch(() => {
            props.returnData("error");
          });
      }
    });
  };
  const types = [
    { value: "WORK_IN_PROGRESS", label: t("work") },
    { value: "DANGER", label: t("danger") },
    { value: "INFO", label: t("info") },
  ];

  const onChange = (event) => {
    console.log(event);
    setType(event.target.value);
  };
  return (
    <Form
      form={form}
      name="newEventForm"
      initialValues={{ remember: true }}
      onSubmit={() => submit()}
      autoComplete="off"
    >
      <Form.Item
        name="type"
        rules={[{ required: true, message: t("requiredSelect") }]}
      >
        <Radio.Group
          options={types}
          onChange={onChange}
          value={{ value: "INFO", label: "INFO" }}
          optionType="button"
          buttonStyle="solid"
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
      <Form.Item name="desc">
        <TextArea
          placeholder={t("desc")}
          style={{ fontSize: "18px" }}
          size="large"
          rows={5}
        />
      </Form.Item>
      <Form.Item>
        <AreaPicker returnLocation={changeLocation}></AreaPicker>
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
          {t("save")}
        </Button>
      </Form.Item>
    </Form>
  );
}
NewEventDialog.propTypes = {
  returnData: PropTypes.func,
};
