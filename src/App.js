import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { LogIn } from "./pages/LogIn/index";
import { SignUp } from "./pages/SignUp/index";
import { CitizenHomePage } from "./pages/CitizenHomePage/index";
import { CityOfficialHomePage } from "./pages/CityOfficialHomePage/index";
import initializeI18n from "./utils/internationalization/initialize";
// eslint-disable-next-line no-unused-vars
import { LocalizationProvider } from "@mui/x-date-pickers";
// eslint-disable-next-line no-unused-vars
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// koristi se za prevodjenje (inicijalizuje se trenutni jezik, na osnovu vrijednosti procitanje iz local storage)
initializeI18n();

function App() {
  return (
    // proksiranje ne radi kada se aplikacija deploy
    <Router>
      {/* Bira se prva ruta cija se vrijednost path atributa poklopi (zbog exact) sa specifikovanim url-om */}
      <Routes>
        <Route path="/ReportSystem/citizen" exact element={<LogIn />}></Route>
        <Route path="/ReportSystem" exact element={<LogIn />}></Route>
        <Route
          path="/ReportSystem/citizen/login"
          exact
          element={<LogIn />}
        ></Route>
        <Route path="/ReportSystem/login" exact element={<LogIn />}></Route>
        <Route
          path="/ReportSystem/citizen/signup"
          exact
          element={<SignUp />}
        ></Route>
        <Route path="/ReportSystem/signup" exact element={<SignUp />}></Route>
        <Route
          path="/ReportSystem/citizen/home"
          exact
          element={<CitizenHomePage />}
        ></Route>
        <Route
          path="/ReportSystem/admin/home"
          exact
          element={<CityOfficialHomePage />}
        ></Route>
        <Route
          path="/CityReportSystem/admin"
          exact
          element={<CityOfficialHomePage />}
        ></Route>
        <Route path="*" element={<LogIn />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
