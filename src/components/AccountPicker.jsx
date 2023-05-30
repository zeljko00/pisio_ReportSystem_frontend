import * as React from "react";
import PropTypes from "prop-types";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import PersonIcon from "@mui/icons-material/Person";
import { blue } from "@mui/material/colors";

import { useTranslation } from "react-i18next";

export function AccountPicker(props) {
  const { onClose, selectedValue, open } = props;
  const { t } = useTranslation();
  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{t("pickAcc")}</DialogTitle>
      <List sx={{ pt: 0 }}>
        <ListItem disableGutters>
          <ListItemButton
            onClick={() => handleListItemClick("citizen")}
            key={"citizen"}
          >
            <ListItemAvatar>
              <Avatar
                sx={{ bgcolor: blue[100], color: blue[600], marginRight: 2 }}
              >
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={t("citizen")} />
          </ListItemButton>
        </ListItem>
        <ListItem disableGutters>
          <ListItemButton
            onClick={() => handleListItemClick("admin")}
            key={"admin"}
          >
            <ListItemAvatar>
              <Avatar
                sx={{ bgcolor: blue[100], color: blue[600], marginRight: 2 }}
              >
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={t("admin")} />
          </ListItemButton>
        </ListItem>
      </List>
    </Dialog>
  );
}

AccountPicker.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};
