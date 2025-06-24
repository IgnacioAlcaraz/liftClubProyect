import React from "react";
import "./sessionsTable.css";
export default function SessionsTable({
  misSesiones,
  onMarcarComoCompletada,
  isCoach = false,
}) {
  return (
    <div className="sessions-table-container">
      <table className="table table-bordered table-hover align-middle text-center">
        <thead className="table-light">
          <tr>
            {isCoach ? (
              <>
                <th>Cliente</th>
                <th>Servicio</th>
                <th>Fecha</th>
                <th>Estado</th>
              </>
            ) : (
              <>
                <th>Profesor</th>
                <th>Servicio</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Accion</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {misSesiones.map((s) => {
            return (
              <tr key={s._id}>
                <td>
                  {isCoach
                    ? s.client.firstName + " " + s.client.lastName
                    : s.coach.firstName + " " + s.coach.lastName}
                </td>
                <td>{s.service.name}</td>
                <td>{s.date + " " + s.startTime}</td>
                <td className="text-center align-middle">
                  <span
                    className={`badge bg-${s.status === "Completado" ? "success" : "warning"}`}
                  >
                    {s.status}
                  </span>
                </td>
                {!isCoach && (
                  <td className="text-center align-middle">
                    {s.status !== "Completado" && (
                      <button
                        className="btn btn-outline-success btn-sm"
                        onClick={() => {
                          {
                            onMarcarComoCompletada(s._id);
                          }
                        }}
                      >
                        Marcar como completado
                      </button>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
