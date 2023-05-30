import * as React from "react";
import { Button, Form, Input } from "antd";
import ImageUpload from "../components/ImageUpload";
import AreaPicker from "../components/AreaPicker";
import { useTranslation } from "react-i18next";
import {
  updateEvent,
  updateImage,
  deleteUpdatedImage,
} from "../services/eventService";
import PropTypes from "prop-types";
export function UpdateEvent(props) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { TextArea } = Input;
  const [location, setLocation] = React.useState(null);
  const changeLocation = (loc) => {
    setLocation(loc);
  };
  const submit = () => {
    form.validateFields().then((values) => {
      const event = props.event;
      if (values.desc !== undefined) event.description = values.desc;
      if (values.info !== undefined) event.info = values.info;
      const areas = [];
      if (location !== null) {
        console.log(location.areas);
        if (location.position != null) {
          event.x = location.position[0];
          event.y = location.position[1];
        }
        location.areas.forEach((value) => {
          const coordinates = [];
          value.coords.forEach((v) => {
            coordinates.push({
              area: value.id,
              x: v.lat,
              y: v.lng,
            });
          });
          areas.push(coordinates);
        });
        if (areas.length > 0) event.coords = areas;
      }
      console.log(areas);
      console.log(event);
      updateEvent(JSON.parse(sessionStorage.getItem("user")).user.id, event)
        .then((response) => {
          form.resetFields();
          props.returnData(response.data);
        })
        .catch(() => {
          props.returnData("error");
        });
    });
  };

  return (
    <Form
      form={form}
      name="newEventForm"
      initialValues={{ remember: true }}
      onSubmit={() => submit()}
      autoComplete="off"
    >
      <Form.Item name="desc">
        <TextArea
          defaultValue={props.event.description}
          style={{ fontSize: "18px" }}
          size="large"
          rows={5}
        />
      </Form.Item>
      <Form.Item name="info">
        <TextArea
          defaultValue={props.event.info}
          style={{ fontSize: "18px" }}
          size="large"
          rows={5}
        />
      </Form.Item>
      <Form.Item>
        <AreaPicker returnLocation={changeLocation}></AreaPicker>
      </Form.Item>
      <Form.Item>
        {/* // izmijeniti */}
        <ImageUpload
          identificator={props.event.id}
          uploadImage={updateImage}
          deleteImage={deleteUpdatedImage}
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
UpdateEvent.propTypes = {
  returnData: PropTypes.func,
  event: PropTypes.object,
};
