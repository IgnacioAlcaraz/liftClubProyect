import React from "react";

export default function SessionsTable({misSesiones, onMarcarComoCompletada}) {
  return (
    <table className="table table-bordered table-hover align-middle text-center">
      <thead className="table-light">
        <tr>
          <th>Profesor</th>
          <th>Servicio</th>
          <th>Fecha</th>
          <th>Estado</th>
          <th>Accion</th>
        </tr>
      </thead>
      <tbody>
        {misSesiones.map((s) => {
          return (
            <tr key={s._id}>
              <td>{s.coach.firstName + " " + s.coach.lastName}</td>
              <td>{s.service.name}</td>
              <td>{s.date + " " + s.startTime}</td>
              <td className="text-center align-middle">
                <span
                  className={`badge bg-${s.status === "Completado" ? "success" : "warning"}`}
                >
                  {s.status}
                </span>
              </td>

              <td className="text-center align-middle">
                {s.status !== "Completado" && (
                  <button
                    className="btn btn-outline-success btn-sm"
                    onClick={() => {
                      if (
                        window.confirm(
                          "¿Estás seguro de que querés marcar como realizada la sesión?"
                        )
                      ) {
                        onMarcarComoCompletada(s._id);
                      }
                    }}
                  >
                    Marcar como completado
                  </button>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
