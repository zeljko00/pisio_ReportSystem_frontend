import React from "react";
import { useTranslation } from "react-i18next";
import "../assets/style/CitizenHomePage.css";
import "../assets/style/ManagerHomePage.css";
import PropTypes from "prop-types";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
export function StatsDashboard(props) {
  const { t } = useTranslation();

  // const parseTimeInMin = (time) => {
  //   const days = Math.floor(time / (60 * 24));
  //   let mins = time - days * 60 * 24;
  //   const hours = Math.floor(mins / 60);
  //   mins = Math.floor(mins - hours * 60);
  //   if (isNaN(days) || isNaN(hours) || isNaN(mins)) return [0, 0, 0];
  //   return [days, hours, mins];
  // };
  return (
    <div>
      <div className="dashboard">
        <div className="dashboard-header">
          <div className="blue-div dashboard-cell">
            <p className="value large-font medium-top-margin">
              {props.stats.count + "  ("}
              {props.stats.avgPerDay.toFixed(2)}
              <span className="medium-font">{" / " + t("perDay")}</span>
              {")"}
            </p>
            <p className="key">{t("total")}</p>
          </div>
          <div className="purple-div dashboard-cell">
            <p className="value large-font medium-top-margin">
              {props.stats.approved + " ("}
              {props.stats.approvedPercentage >= 0.7 ? (
                <span className="success">
                  {(props.stats.approvedPercentage * 100).toFixed(2) + "%"}
                </span>
              ) : (
                <span className="bad">
                  {(props.stats.approvedPercentage * 100).toFixed(2) + "%"}
                </span>
              )}
              {") "}
            </p>
            <p className="key">{t("solved")}</p>
          </div>
        </div>
        {props.stats.reportsPerType.length > 1 && props.stats.count > 0 && (
          <>
            <div className="type-pie">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart width={700} height={400}>
                  <Pie
                    data={props.stats.reportsPerType
                      .filter((o) => {
                        return o.count > 0;
                      })
                      .map((o) => {
                        return {
                          name: t(o.type),
                          value: o.percentage,
                        };
                      })}
                    cx="37%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {props.stats.reportsPerType
                      .filter((o) => {
                        return o.count > 0;
                      })
                      .map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                  </Pie>
                  <Legend
                    verticalAlign="top"
                    align="left"
                    height={26}
                    layout="vertical"
                  />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="time-for-solving-per-type">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  width={500}
                  height={300}
                  data={props.stats.reportsPerType.map((item) => {
                    return {
                      name: t(item.type),
                      zaprimljeno: item.count,
                      odobreno: item.approved,
                      amt: 0.3,
                    };
                  })}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis dataKey="zaprimljeno" />
                  <Tooltip />

                  <Bar dataKey="zaprimljeno" fill="#8884d8" />
                  <Bar dataKey="odobreno" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="legend">{t("reportsPerType")}</div>{" "}
          </>
        )}
        {props.stats.count > 0 && (
          <>
            <div className="time-for-solving-per-type">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  width={500}
                  height={300}
                  data={props.stats.dataPerAddress.map((item) => {
                    return {
                      name: item.address,
                      zaprimljeno: item.count,
                      odobreno: item.approved,
                      amt: 0.3,
                    };
                  })}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis dataKey="zaprimljeno" />
                  <Tooltip />

                  <Bar dataKey="zaprimljeno" fill="#8884d8" />
                  <Bar dataKey="odobreno" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="legend">{t("reportsPerAddress")}</div>{" "}
            <div className="area-chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  height={250}
                  width={500}
                  data={props.stats.dataPerDay
                    .map((tuple) => {
                      return {
                        name: tuple.date,
                        zaprimljeno: tuple.count,
                        // obrađeno: tuple.solved,
                      };
                    })
                    .sort((d1, d2) => {
                      return d1.name.localeCompare(d2.name);
                    })}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" />
                  <YAxis dataKey="zaprimljeno" />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="zaprimljeno"
                    stroke="#82ca9d"
                    fillOpacity={1}
                    fill="url(#colorPv)"
                  />
                  <Legend></Legend>
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="legend">{t("dynamicPerDay")}</div>
          </>
        )}
      </div>
    </div>
  );
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#2dea89",
  "#b2dc18",
  "#dcc718",
  "#15ad13",
  "#2dead9",
  "#1091be",
  "#9610be",
  "#f7690d",
  "#dcc718",
  "#71dc18",
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}\n%`}
    </text>
  );
};
StatsDashboard.propTypes = {
  stats: PropTypes.object,
};
