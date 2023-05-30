import React from "react";
import "../assets/style/AppHeader.css";
import { useTranslation } from "react-i18next";

export function AppHeader() {
  const { t } = useTranslation();
  return (
    <div className="header">
      <div className="title">
        <b>
          <i>{t("appTitle").toLocaleUpperCase()}</i>
        </b>
      </div>
    </div>
  );
}
