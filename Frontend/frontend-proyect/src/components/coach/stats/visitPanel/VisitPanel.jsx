import React from "react";
import "./visitPanel.css";

const VisitPanel = ({
  totalViews,
  conversionRate,
  conversionRatePerService,
}) => {
  const getScaledWidth = (rate) => {
    if (rate === 0) return 0;

    const maxDisplayRate = 10;
    const minWidth = 20;

    if (rate >= maxDisplayRate) return 100;

    const scaledRate = Math.log(rate + 1) / Math.log(maxDisplayRate + 1);
    return minWidth + scaledRate * (100 - minWidth);
  };

  return (
    <div>
      <h3>Estadísticas de Visualización</h3>
      <div className="visit-stats">
        <div className="visit-metrics">
          <div className="metric-card">
            <div className="metric-value">{totalViews}</div>
            <div className="metric-label">Visitas totales al perfil</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">{conversionRate}%</div>
            <div className="metric-label">
              Total de conversión por servicios
            </div>
          </div>
        </div>

        <div className="service-conversion">
          <h4>Desglose por servicios</h4>
          {conversionRatePerService &&
            Object.entries(conversionRatePerService).map(([service, rate]) => (
              <div key={service} className="service-item">
                <div className="service-header">
                  <span>{service}</span>
                  <span>{rate}%</span>
                </div>
                <div className="service-bar">
                  <div
                    className="service-bar-fill"
                    style={{ width: `${getScaledWidth(parseFloat(rate))}%` }}
                  />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default VisitPanel;
