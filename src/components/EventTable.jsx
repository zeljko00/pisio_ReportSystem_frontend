import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Paper from "@mui/material/Paper";
import TableCell from "@mui/material/TableCell";
import { BASE_URL } from "../services/axios.service";
import { visuallyHidden } from "@mui/utils";
import { useTranslation } from "react-i18next";
import {
  getEvents,
  deleteEvent,
  activateEvent,
  getTypes,
} from "../services/eventService";
import { getServices } from "../services/cityServices.service";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Toolbar from "@mui/material/Toolbar";
import FilterListIcon from "@mui/icons-material/FilterList";
import "../assets/style/EventTable.css";
import Tooltip from "@mui/material/Tooltip";
import CalendarMonthIconTwoTone from "@mui/icons-material/CalendarMonthTwoTone";
import FingerprintTwoToneIcon from "@mui/icons-material/FingerprintTwoTone";
import VerifiedTwoToneIcon from "@mui/icons-material/VerifiedTwoTone";
import SupervisorAccountTwoToneIcon from "@mui/icons-material/SupervisorAccountTwoTone";
import ReceiptLongTwoToneIcon from "@mui/icons-material/ReceiptLongTwoTone";
import Divider from "@mui/material/Divider";
import InfoTwoToneIcon from "@mui/icons-material/InfoTwoTone";
import ManageAccountsTwoToneIcon from "@mui/icons-material/ManageAccountsTwoTone";
import DeleteIcon from "@mui/icons-material/Delete";
import SettingsTwoToneIcon from "@mui/icons-material/SettingsTwoTone";
import LocationOnTwoToneIcon from "@mui/icons-material/LocationOnTwoTone";
import { Carousel, message } from "antd";
import noimg from "../assets/images/no-img.png";
import AddBoxTwoToneIcon from "@mui/icons-material/AddBoxTwoTone";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import EventLocation from "../components/EventLocation";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import { NewEventDialog } from "../components/NewEventDialog";
import { UpdateEvent } from "../components/UpdateEvent";
import DialogContent from "@mui/material/DialogContent";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
// function descendingComparator(a, b, orderBy) {
//   if (orderBy === "date") {
//     const tokensA = a[orderBy].split(" ");
//     const dateTokensA = tokensA[0].split(".");
//     const timeTokensA = tokensA[1].split(":");
//     const tokensB = b[orderBy].split(" ");
//     const dateTokensB = tokensB[0].split(".");
//     const timeTokensB = tokensB[1].split(":");
//     console.log(tokensA);
//     const dateA = new Date(
//       dateTokensA[2],
//       dateTokensA[1] - 1,
//       dateTokensA[0],
//       timeTokensA[0],
//       timeTokensA[1],
//       timeTokensA[2]
//     );
//     const dateB = new Date(
//       dateTokensB[2],
//       dateTokensB[1] - 1,
//       dateTokensB[0],
//       timeTokensB[0],
//       timeTokensB[1],
//       timeTokensB[2]
//     );
//     console.log(dateA);
//     console.log(dateA.getTime());
//     console.log(dateB.getTime());
//     if (dateB.getTime() < dateA.getTime()) return -1;
//     else if (dateB.getTime() > dateA.getTime()) return 1;
//     else return 0;
//   } else {
//     if (b[orderBy] < a[orderBy]) {
//       return -1;
//     }
//     if (b[orderBy] > a[orderBy]) {
//       return 1;
//     }
//     return 0;
//   }
// }

// function getComparator(order, orderBy) {
//   return order === "desc"
//     ? (a, b) => descendingComparator(a, b, orderBy)
//     : (a, b) => -descendingComparator(a, b, orderBy);
// }

// function stableSort(array, comparator) {
//   const stabilizedThis = array.map((el, index) => [el, index]);
//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0]);
//     if (order !== 0) {
//       return order;
//     }
//     return a[1] - b[1];
//   });
//   return stabilizedThis.map((el) => el[0]);
// }

export function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    console.log("sorting" + property);
    onRequestSort(property);
  };
  const { t } = useTranslation();

  const headCells = [
    {
      id: "id",
      numeric: false,
      disablePadding: false,
      label: t("eventId"),
      icon: FingerprintTwoToneIcon,
      sort: true,
      color: "success",
    },
    {
      id: "title",
      numeric: false,
      disablePadding: false,
      label: t("eventTitle"),
      icon: "-",
      sort: true,
    },
    {
      id: "type",
      numeric: false,
      disablePadding: false,
      label: t("eventType"),
      icon: ReceiptLongTwoToneIcon,
      sort: false,
    },
    {
      id: "date",
      numeric: false,
      disablePadding: false,
      label: t("eventDate"),
      icon: CalendarMonthIconTwoTone,
      sort: true,
    },
    {
      id: "creator.department.name",
      numeric: false,
      disablePadding: false,
      label: t("eventCreator"),
      icon: SupervisorAccountTwoToneIcon,
      sort: false,
    },
    {
      id: "active",
      numeric: false,
      disablePadding: false,
      label: t("eventState"),
      icon: VerifiedTwoToneIcon,
      sort: false,
    },
  ];
  return (
    <TableHead>
      <TableRow className="table-header">
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "center" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.sort ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.icon !== "-" && <headCell.icon color="success" />}
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              <>
                {headCell.icon !== "-" && <headCell.icon color="primary" />}
                {headCell.label}
              </>
            )}
          </TableCell>
        ))}
        <TableCell align="right" sx={{ width: 30 }} />
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
};

export default function EventTable() {
  const [rows, changeRows] = React.useState([]);
  const { t } = useTranslation();
  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState("date");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [total, changeTotal] = React.useState(-1);
  const [search, changeSearch] = React.useState("");

  const [typeFilter, changeTypeFilter] = React.useState("all");
  const [stateFilter, changeStateFilter] = React.useState("all");
  const [departmentFilter, changeDepartmentFilter] = React.useState("all");

  const [servicesList, changeServicesList] = React.useState([]);
  const [eventTypes, changeEventTypes] = React.useState([]);

  const handleChangeTypeFilter = (event) => {
    changeTypeFilter(event.target.value);
    setPage(0);
    fetchData(
      0,
      rowsPerPage,
      search,
      event.target.value,
      stateFilter,
      departmentFilter,
      orderBy,
      order
    );
  };
  const handleChangeStateFilter = (event) => {
    changeStateFilter(event.target.value);
    setPage(0);
    fetchData(
      0,
      rowsPerPage,
      search,
      typeFilter,
      event.target.value,
      departmentFilter,
      orderBy,
      order
    );
  };
  const handleChangeDepartmentFilter = (event) => {
    setPage(0);
    changeDepartmentFilter(event.target.value);
    fetchData(
      0,
      rowsPerPage,
      search,
      typeFilter,
      stateFilter,
      event.target.value,
      orderBy,
      order
    );
  };

  // const [sort, changeSort] = React.useState("date");
  // const [sortValue, changeSortValue] = React.useState("asc");

  const returnNewEvent = (data) => {
    if (data === "error") {
      changeMsg("eventNotCreated");
      changeSeverity("error");
    } else if (data === "location missing") {
      changeMsg("locationMissing");
      changeSeverity("error");
    } else {
      console.log("new *event:");
      console.log(data);
      const temp = rows;
      temp.push(data);
      const tempUser = JSON.parse(sessionStorage.getItem("user"));
      tempUser.user.createdEventsNum++;
      tempUser.user.activeEventsNum++;
      sessionStorage.setItem("user", JSON.stringify(tempUser));
      changeRows(temp);
      changeMsg("eventCreated");
      changeSeverity("success");
    }
    handleClick();
  };
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
    fetchData(
      page,
      rowsPerPage,
      search,
      typeFilter,
      stateFilter,
      departmentFilter,
      property,
      isAsc ? "desc" : "asc"
    );
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    fetchData(
      newPage,
      rowsPerPage,
      search,
      typeFilter,
      stateFilter,
      departmentFilter,
      orderBy,
      order
    );
  };

  const handleChangeRowsPerPage = (event) => {
    const n = parseInt(event.target.value, 10);
    setRowsPerPage(n);
    setPage(0);
    fetchData(
      0,
      n,
      search,
      typeFilter,
      stateFilter,
      departmentFilter,
      orderBy,
      order
    );
  };

  //  Avoid a layout jump when reaching the last page with empty rows.
  // const emptyRows =
  //   page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  const fetchData = (
    page,
    size,
    search,
    typeFilter,
    stateFilter,
    departmentFilter,
    orderBy,
    order
  ) => {
    const titleToSearch =
      search !== undefined && search != null && search !== "" ? search : "-";
    console.log("fetch filtered with filter=" + titleToSearch);
    // eslint-disable-next-line no-unneeded-ternary
    getEvents(
      page,
      size,
      titleToSearch,
      typeFilter,
      stateFilter,
      departmentFilter,
      orderBy,
      order
    ).then((result) => {
      changeTotal(result.data.pages);
      changeRows(result.data.data);
    });
  };
  React.useEffect(() => {
    fetchData(
      page,
      rowsPerPage,
      search,
      typeFilter,
      stateFilter,
      departmentFilter,
      orderBy,
      order
    );
    getServices()
      .catch()
      .then((response) => {
        changeServicesList(response.data);
      });
    getTypes()
      .catch()
      .then((response) => {
        changeEventTypes(response.data);
      });
  }, []);
  const fetchFiltered = (e) => {
    changeSearch(e.target.value);
    setPage(0);
    fetchData(
      0,
      rowsPerPage,
      e.target.value,
      typeFilter,
      stateFilter,
      departmentFilter,
      orderBy,
      order
    );
  };

  const [openNewEventDialog, setOpenNewEventDialog] = React.useState(false);
  const handleOpenNewEventDialog = () => {
    setOpenNewEventDialog(true);
  };

  const handleCloseNewEventDialog = (value) => {
    setOpenNewEventDialog(false);
  };
  const [opened, setOpened] = React.useState(false);

  const handleClick = () => {
    console.log("snackabar");
    setOpened(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpened(false);
  };
  const [msg, changeMsg] = React.useState("-");
  const [severity, changeSeverity] = React.useState("success");

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  return (
    rows &&
    servicesList && (
      <Box sx={{ width: "100%" }}>
        <Snackbar open={opened} autoHideDuration={5000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity={severity}
            sx={{ width: "100%" }}
          >
            {t(msg)}
          </Alert>
        </Snackbar>
        <Dialog
          open={openNewEventDialog}
          onClose={handleCloseNewEventDialog}
          maxWidth="md"
          fullWidth
          className="new-event-dialog"
        >
          <DialogTitle>{t("createNewEvent")}</DialogTitle>
          <Divider />
          <DialogContent style={{ overflowY: "visible" }}>
            <div className="form-wrapper">
              <NewEventDialog returnData={returnNewEvent}></NewEventDialog>
            </div>
          </DialogContent>
          <Divider />
          <DialogActions>
            <Button autoFocus onClick={() => handleCloseNewEventDialog()}>
              {t("return")}
            </Button>
          </DialogActions>
        </Dialog>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <Toolbar
            sx={{
              pl: { sm: 2 },
              pr: { xs: 1, sm: 1 },

              bgcolor: "#d0dbe0",
            }}
          >
            <Typography
              sx={{ flex: "1 1 100%" }}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              {t("events")}
            </Typography>
            <TextField
              id="outlined-search"
              label={t("search")}
              type="search"
              size="small"
              sx={{ marginRight: 5, width: 250, zIndex: "1" }}
              onChange={fetchFiltered}
            />
            <Tooltip title={t("filter")}>
              <IconButton onClick={handleClickMenu}>
                <FilterListIcon color="primary" />
              </IconButton>
            </Tooltip>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleCloseMenu}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <FormControl variant="standard" sx={{ m: 1, minWidth: 170 }}>
                <InputLabel id="demo-simple-select-standard-label">
                  {t("eventType")}
                </InputLabel>
                <Select value={typeFilter} onChange={handleChangeTypeFilter}>
                  <MenuItem value="all">{t("all")}</MenuItem>
                  {eventTypes.map((et) => {
                    return (
                      <MenuItem key={et} value={et}>
                        {t(et)}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <br />
              <FormControl variant="standard" sx={{ m: 1, minWidth: 170 }}>
                <InputLabel id="demo-simple-select-standard-label">
                  {t("eventState")}
                </InputLabel>
                <Select value={stateFilter} onChange={handleChangeStateFilter}>
                  <MenuItem value="all">{t("all")}</MenuItem>
                  <MenuItem value="true">{t("active")}</MenuItem>
                  <MenuItem value="false">{t("inactive")}</MenuItem>
                </Select>
              </FormControl>
              <br />
              <FormControl variant="standard" sx={{ m: 1, minWidth: 170 }}>
                <InputLabel id="demo-simple-select-standard-label">
                  {t("department")}
                </InputLabel>
                <Select
                  value={departmentFilter}
                  onChange={handleChangeDepartmentFilter}
                >
                  <MenuItem value="all">{t("all")}</MenuItem>
                  {servicesList.map((ss) => {
                    return (
                      <MenuItem key={ss} value={ss}>
                        {t(ss)}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Menu>
            <Tooltip title={t("newEvent")}>
              <IconButton onClick={() => handleOpenNewEventDialog()}>
                <AddBoxTwoToneIcon color="success" />
              </IconButton>
            </Tooltip>
          </Toolbar>
          <TableContainer>
            <Table sx={{ minWidth: 750 }} size="small">
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {rows.map((row, index) => {
                  return (
                    <Row key={row.id} row={row} className="body-row"></Row>
                  );
                })}
                {/* {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 53 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )} */}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            showFirstButton
            showLastButton
            labelRowsPerPage={t("rowsPerPage")}
            labelDisplayedRows={({ from, to, count }) =>
              `${from} - ${to} ${t("from")} ${count}`
            }
          />
        </Paper>
      </Box>
    )
  );
}
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
function Row(props) {
  const [messageApi, contextHolder] = message.useMessage();
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation();
  const [changed, changeChanged] = React.useState(false);
  const contentStyle = {
    margin: "auto",
    width: "100%",
    color: "#fff",
    textAlign: "center",
    background: "#364d79",
    maxWidth: "100%",
    maxHeight: "100%",
    borderRadius: "40px",
  };
  const [deEvent, changeDeEvent] = React.useState(-1);
  const deleteClick = (row) => {
    deleteEvent(JSON.parse(sessionStorage.getItem("user")).user.id, row.id)
      .catch(() => {
        messageApi.open({
          type: "error",
          content: t("notDeletedEvent"),
          duration: 0,
        });
        setTimeout(messageApi.destroy, 3000);
      })
      .then(() => {
        row.active = false;
        changeChanged(!changed);
        changeDeEvent(row.id);
        changeMsg("deletedEvent");
        changeSeverity("success");
        handleClick();
      });
  };
  const [opened, setOpened] = React.useState(false);

  const handleClick = () => {
    console.log("snackabar");
    setOpened(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpened(false);
  };
  const [msg, changeMsg] = React.useState("-");
  const [severity, changeSeverity] = React.useState("success");
  const handleUndo = () => {
    activateEvent(JSON.parse(sessionStorage.getItem("user")).user.id, deEvent)
      .catch(() => {
        changeDeEvent(-1);
      })
      .then(() => {
        changeDeEvent(-1);
        row.active = true;
      });
    handleClose();
  };
  const [openDialog, setOpenDialog] = React.useState(false);
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const returnUpdateEvent = (data) => {
    if (data === "error") {
      changeMsg("eventNotUpdated");
      changeSeverity("error");
    } else {
      console.log("updated event:");
      console.log(data);
      row.info = data.info;
      row.x = data.x;
      row.y = data.y;
      row.description = data.description;
      row.images = data.images;
      changeChanged(!changed);
      changeMsg("eventUpdated");
      changeSeverity("success");
    }
    handleClick();
  };
  const handleCloseDialog = (value) => {
    setOpenDialog(false);
  };
  const [openUpdateEventDialog, setOpenUpdateEventDialog] =
    React.useState(false);
  const handleOpenUpdateEventDialog = () => {
    setOpenUpdateEventDialog(true);
  };

  const handleCloseUpdateEventDialog = (value) => {
    setOpenUpdateEventDialog(false);
  };
  return (
    <React.Fragment>
      {contextHolder}
      <Snackbar open={opened} autoHideDuration={10000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {t(msg)}
          {msg === "deletedEvent" && (
            <Button
              sx={{ color: "yellow", marginLeft: 8 }}
              size="small"
              onClick={handleUndo}
            >
              {t("undo")}
            </Button>
          )}
        </Alert>
      </Snackbar>

      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell align="left" sx={{ minWidth: "100px" }}>
          #{row.id}
        </TableCell>
        <TableCell align="left" sx={{ minWidth: "150px", maxWidth: "320px" }}>
          {row.title}
        </TableCell>
        <TableCell align="left" sx={{ minWidth: "150px" }}>
          {t(row.type)}
        </TableCell>
        <TableCell align="left" sx={{ minWidth: "170px" }}>
          {row.date}
        </TableCell>
        <TableCell align="left" sx={{ minWidth: "200px" }}>
          {t(row.creator.department.name)}
        </TableCell>
        <TableCell align="left" sx={{ minWidth: "100px" }}>
          {row.active === true ? t("active") : t("inactive")}
        </TableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box>
              <div id="flex-column-container">
                <div className="flex-div half-width">
                  <p className="event-title">{row.title}</p>
                  <p className="event-info">
                    <InfoTwoToneIcon sx={{ fontSize: 22 }} color="success" />{" "}
                    {row.description}
                  </p>
                  <Divider />
                  <p className="event-creator-info">
                    <span className="creator-info-span">
                      <ManageAccountsTwoToneIcon color="info" />{" "}
                      {row.creator.firstName + " " + row.creator.lastName}
                    </span>
                    <br></br>
                    <span className="department-span">
                      {row.creator.position}

                      <br></br>
                      {row.creator.department.name}
                    </span>
                  </p>
                  <Divider />
                  <div className="controls">
                    <IconButton
                      color="primary"
                      sx={{ fontSize: 37 }}
                      onClick={() => handleOpenDialog()}
                    >
                      <LocationOnTwoToneIcon fontSize="inherit" />
                    </IconButton>
                    {row.creator.id ===
                      JSON.parse(sessionStorage.getItem("user")).user.id &&
                      row.active && (
                        <>
                          <IconButton
                            color="success"
                            sx={{ fontSize: 37 }}
                            onClick={() => handleOpenUpdateEventDialog(row)}
                          >
                            <SettingsTwoToneIcon fontSize="inherit" />
                          </IconButton>
                          <IconButton
                            color="error"
                            sx={{ fontSize: 37 }}
                            onClick={() => deleteClick(row)}
                          >
                            <DeleteIcon fontSize="inherit" />
                          </IconButton>
                        </>
                      )}
                  </div>
                </div>
                <div className="flex-div half-width" id="gallery">
                  {row.images.length > 0 ? (
                    <Carousel dotPosition="top">
                      {row.images.map((img) => {
                        return (
                          <div key={img.id} className="img-container">
                            <img
                              src={
                                BASE_URL +
                                "/CityReportSystem/events/active/images/" +
                                img.id
                              }
                              style={contentStyle}
                            ></img>
                          </div>
                        );
                      })}
                    </Carousel>
                  ) : (
                    <div id="no-img">
                      <img src={noimg} id="no-img-img"></img>
                    </div>
                  )}
                </div>
                <div className="flex-div half-width">
                  <p className="info-title">{t("addInfo")}</p>
                  <Divider />
                  <p className="info-content">
                    {row.info && row.info !== "" ? row.info : t("noAddInfo")}
                  </p>
                </div>
                <Dialog
                  open={openDialog}
                  onClose={handleCloseDialog}
                  maxWidth="md"
                  fullWidth
                >
                  <DialogTitle>{t("location")}</DialogTitle>
                  <Divider />
                  <EventLocation event={row}></EventLocation>
                  <Divider />
                  <DialogActions>
                    <Button autoFocus onClick={() => handleCloseDialog()}>
                      {t("return")}
                    </Button>
                  </DialogActions>
                </Dialog>
                <Dialog
                  open={openUpdateEventDialog}
                  onClose={handleCloseUpdateEventDialog}
                  maxWidth="md"
                  fullWidth
                  className="update-event-dialog"
                >
                  <DialogTitle>{t("updateEvent")}</DialogTitle>
                  <Divider />
                  <DialogContent style={{ overflowY: "visible" }}>
                    <div className="form-wrapper">
                      <UpdateEvent
                        returnData={returnUpdateEvent}
                        event={row}
                      ></UpdateEvent>
                    </div>
                  </DialogContent>
                  <Divider />
                  <DialogActions>
                    <Button
                      autoFocus
                      onClick={() => handleCloseUpdateEventDialog()}
                    >
                      {t("return")}
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}
Row.propTypes = {
  row: PropTypes.object,
};
