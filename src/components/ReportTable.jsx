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
import TextField from "@mui/material/TextField";
import AddTaskIcon from "@mui/icons-material/AddTask";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import {
  getReports,
  getReportStates,
  getReportTypesByDepartment,
  addFeedback,
  changeState,
  requireInfo,
} from "../services/report.service";
import Badge from "@mui/material/Badge";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Toolbar from "@mui/material/Toolbar";
import FilterListIcon from "@mui/icons-material/FilterList";
import "../assets/style/EventTable.css";
import "../assets/style/ReportTable.css";
import Tooltip from "@mui/material/Tooltip";
import CalendarMonthIconTwoTone from "@mui/icons-material/CalendarMonthTwoTone";
import FingerprintTwoToneIcon from "@mui/icons-material/FingerprintTwoTone";
import VerifiedTwoToneIcon from "@mui/icons-material/VerifiedTwoTone";
import ReceiptLongTwoToneIcon from "@mui/icons-material/ReceiptLongTwoTone";
import Divider from "@mui/material/Divider";
import InfoTwoToneIcon from "@mui/icons-material/InfoTwoTone";
import LocationOnTwoToneIcon from "@mui/icons-material/LocationOnTwoTone";
import MailIcon from "@mui/icons-material/Mail";
import { Carousel } from "antd";
import noimg from "../assets/images/no-img.png";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import ReportLocation from "../components/ReportLocation";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
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
      label: t("reportType"),
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
      id: "state",
      numeric: false,
      disablePadding: false,
      label: t("reportState"),
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

export default function ReportTable() {
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

  const [types, changeTypes] = React.useState(null);
  const [states, changeStates] = React.useState(null);

  const handleChangeTypeFilter = (event) => {
    changeTypeFilter(event.target.value);
    setPage(0);
    fetchData(
      0,
      rowsPerPage,
      search,
      event.target.value,
      stateFilter,
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
      orderBy,
      order
    );
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
      orderBy,
      order
    );
  };

  const handleChangeRowsPerPage = (event) => {
    const n = parseInt(event.target.value, 10);
    setRowsPerPage(n);
    setPage(0);
    fetchData(0, n, search, typeFilter, stateFilter, orderBy, order);
  };

  const fetchData = (
    page,
    size,
    search,
    typeFilter,
    stateFilter,
    orderBy,
    order
  ) => {
    const titleToSearch =
      search !== undefined && search != null && search !== "" ? search : "-";
    console.log("fetch filtered with filter=" + titleToSearch);
    const user = JSON.parse(sessionStorage.getItem("user")).user;
    // eslint-disable-next-line no-unneeded-ternary
    getReports(
      user.id,
      user.department.id,
      typeFilter,
      stateFilter,
      page,
      size,
      titleToSearch,
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
      orderBy,
      order
    );
    const user = JSON.parse(sessionStorage.getItem("user")).user;
    getReportTypesByDepartment(user.department.id)
      .catch()
      .then((response) => {
        changeTypes(response.data);
      });
    getReportStates()
      .catch()
      .then((response) => {
        changeStates(response.data);
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
      orderBy,
      order
    );
  };

  const [opened, setOpened] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpened(false);
  };

  // eslint-disable-next-line no-unused-vars
  const [msg, changeMsg] = React.useState("-");
  // eslint-disable-next-line no-unused-vars
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
    types &&
    states && (
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
              {t("arrivedReports")}
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
                  {t("typeReport")}
                </InputLabel>
                <Select value={typeFilter} onChange={handleChangeTypeFilter}>
                  <MenuItem value="all">{t("all")}</MenuItem>
                  {types.map((et) => {
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
                  {t("state")}
                </InputLabel>
                <Select value={stateFilter} onChange={handleChangeStateFilter}>
                  <MenuItem value="all">{t("all")}</MenuItem>
                  {states.map((ss) => {
                    return (
                      <MenuItem key={ss} value={ss}>
                        {t(ss)}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Menu>
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
                    <Row
                      key={row.id}
                      row={row}
                      states={states}
                      className="body-row"
                    ></Row>
                  );
                })}
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
  const [opened, setOpened] = React.useState(false);
  // eslint-disable-next-line no-unused-vars
  const [feedback, setFeedback] = React.useState("");
  const changeFeedback = (event) => {
    console.log(event.target.value);
    setFeedback(event.target.value);
  };
  const addFeed = () => {
    console.log("feed");
    if (feedback !== "") {
      addFeedback(row.id, feedback)
        .catch(() => {
          console.log("error");
        })
        .then((resposne) => {
          row.feedback += " " + feedback;
          changeMsg("feedbackAdded");
          changeSeverity("success");
          handleClick();
          changeChanged(!changed);
        });
    } else {
      changeMsg("feedbackRequired");
      changeSeverity("error");
      handleClick();
    }
  };
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

  const handleChangeState = (event) => {
    const data = JSON.parse(sessionStorage.getItem("user"));
    const user = data.user;
    console.log(event.target.value);
    if (event.target.value !== row.state) {
      row.state = event.target.value;
      if (event.target.value === "CLOSED") {
        user.solvedReports++;
        sessionStorage.setItem("user", JSON.stringify(data));
        if (!row.feedback || row.feedback === "") {
          changeMsg("feedbackRequiredForStateChange");
          changeSeverity("error");
          handleClick();
          return;
        }
      }
      setState(event.target.value);
      changeState(user.id, row.id, event.target.value)
        .catch()
        .then((response) => {
          changeMsg("stateChanged");
          changeSeverity("success");
          handleClick();
        });
    }
  };
  // eslint-disable-next-line no-unused-vars
  const [state, setState] = React.useState(row.state);
  const [msg, changeMsg] = React.useState("-");
  const [severity, changeSeverity] = React.useState("success");
  const [openDialog, setOpenDialog] = React.useState(false);
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = (value) => {
    setOpenDialog(false);
  };
  const [openRequireInfoDialog, setOpenRequireInfoDialog] =
    React.useState(false);
  // eslint-disable-next-line no-unused-vars
  const handleOpenRequireInfoDialog = () => {
    setOpenRequireInfoDialog(true);
  };
  const [info, setInfo] = React.useState("");
  const handleRequireInfo = () => {
    console.log(info);
    console.log(row.id);
    requireInfo(row.id, info)
      .catch(() => {
        changeMsg(t("error"));
        changeSeverity("error");
        handleClick();
      })
      .then(() => {
        changeMsg(t("requestSend"));
        changeSeverity("success");
        handleClick();
      });
  };

  const handleCloseRequireInfoDialog = () => {
    setOpenRequireInfoDialog(false);
  };
  return (
    <React.Fragment>
      <Snackbar open={opened} autoHideDuration={10000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {t(msg)}
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

        <TableCell align="left" sx={{ minWidth: "150px" }}>
          {t(row.state) + "  "}
          {row.state === "RECEIVED" && (
            <Badge badgeContent={1} color="primary">
              <MailIcon color="action" />
            </Badge>
          )}
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
                  <p className="event-title">
                    {row.title}
                    <Tooltip title={t("reportLocation")}>
                      <IconButton
                        color="primary"
                        sx={{ fontSize: 37 }}
                        onClick={() => handleOpenDialog()}
                      >
                        <LocationOnTwoToneIcon fontSize="inherit" />
                      </IconButton>
                    </Tooltip>
                  </p>
                  <Divider />
                  <p className="event-info">
                    <InfoTwoToneIcon sx={{ fontSize: 22 }} color="success" />{" "}
                    {t("content") + ": "} <br></br>
                    {row.content}
                  </p>
                  {row.providedAdditionalInfo &&
                    row.providedAdditionalInfo !== "" && (
                      <>
                        <p className="note-div">{row.providedAdditionalInfo}</p>
                      </>
                    )}
                  {row.note && row.note !== "" && (
                    <>
                      <p className="note-div">
                        <InfoTwoToneIcon sx={{ fontSize: 22 }} color="error" />{" "}
                        {t("note") + ": "} <br></br>
                        {row.note}
                      </p>
                    </>
                  )}
                  {row.feedback && row.feedback !== "" && (
                    <>
                      <p className="note-div">
                        <InfoTwoToneIcon
                          sx={{ fontSize: 22 }}
                          color="primary"
                        />{" "}
                        {t("feedback") + ": "} <br></br>
                        {row.feedback.split("||").join(" ")}
                      </p>
                    </>
                  )}
                  <Divider />{" "}
                  <TextField
                    id="filled-multiline-flexible"
                    label={t("feedback")}
                    multiline
                    maxRows={4}
                    variant="standard"
                    onChange={changeFeedback}
                    sx={{
                      width: "77%",
                      marginTop: "10px",
                      marginLeft: "10px",
                      marginRight: "5px",
                    }}
                  />
                  <Tooltip title={t("addFeedback")}>
                    <IconButton
                      onClick={() => addFeed()}
                      sx={{
                        display: "inline-block",
                        marginTop: "17px",
                      }}
                    >
                      <AddTaskIcon
                        color="primary"
                        sx={{
                          fontSize: "30px",
                        }}
                      ></AddTaskIcon>
                    </IconButton>
                  </Tooltip>
                  {!row.solvedDate && (
                    <div className="settings">
                      <FormControl
                        variant="standard"
                        sx={{ m: 1, minWidth: 170 }}
                      >
                        <InputLabel id="demo-simple-select-standard-label">
                          {t("state")}
                        </InputLabel>
                        <Select value={state} onChange={handleChangeState}>
                          {props.states.map((ss) => {
                            return (
                              <MenuItem key={ss} value={ss}>
                                {t(ss)}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                      <Tooltip title={t("requireInfo")}>
                        <IconButton
                          sx={{ marginTop: "10px" }}
                          onClick={() => handleOpenRequireInfoDialog()}
                        >
                          <ContactSupportIcon
                            color="primary"
                            sx={{ fontSize: 35 }}
                          ></ContactSupportIcon>
                        </IconButton>
                      </Tooltip>
                    </div>
                  )}
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
                                "/CityReportSystem/reports/images/" +
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
                <Dialog
                  open={openDialog}
                  onClose={handleCloseDialog}
                  maxWidth="md"
                  fullWidth
                >
                  <DialogTitle>{t("location")}</DialogTitle>
                  <Divider />
                  <ReportLocation report={row}></ReportLocation>
                  <Divider />
                  <DialogActions>
                    <Button autoFocus onClick={() => handleCloseDialog()}>
                      {t("return")}
                    </Button>
                  </DialogActions>
                </Dialog>
                <Dialog
                  open={openRequireInfoDialog}
                  maxWidth="md"
                  fullWidth
                  className="update-event-dialog"
                >
                  <DialogTitle>{t("requireInfo")}</DialogTitle>
                  <Divider />
                  <DialogContent style={{ overflowY: "visible" }}>
                    <div className="form-wrapper">
                      <TextField
                        id="filled-multiline-flexible"
                        label={t("addInfo")}
                        multiline
                        rows={8}
                        variant="standard"
                        fullWidth
                        onChange={(event) => setInfo(event.target.value)}
                      />
                    </div>
                  </DialogContent>
                  <Divider />
                  <DialogActions>
                    <Button autoFocus onClick={() => handleRequireInfo()}>
                      {t("send")}
                    </Button>
                    <Button
                      autoFocus
                      onClick={() => handleCloseRequireInfoDialog()}
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
  states: PropTypes.array,
};
