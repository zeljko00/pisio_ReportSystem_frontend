import React from "react";
import "../assets/style/AppFooter.css";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "../components/LanguageSelector";
export function AppFooter() {
  const { t } = useTranslation();
  return (
    <div className="footer">
      <div className="lang-selector">
        <LanguageSelector></LanguageSelector>
      </div>
      <div className="signature-div">{t("signature")}</div>
    </div>
  );
}
