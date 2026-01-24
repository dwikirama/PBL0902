import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const ServerDashboard = () => {
  const { msId } = useParams();
  const [data, setData] = useState([]);
  const [dbName, setDbName] = useState("");

  const getBackendURL = () => {
    if (msId === "MS1") return "http://localhost:5051";
    if (msId === "MS2") return "http://localhost:5052";
    if (msId === "MS3") return "http://localhost:5053";
    return "";
  };

  useEffect(() => {
    if (msId === "MS3") setDbName("DB-B");
    else setDbName("DB-A");

    setData([]);
    axios
      .get(`${getBackendURL()}/cars`)
      .then((res) => {
        if (Array.isArray(res.data)) setData(res.data);
      })
      .catch((err) => console.error("Gagal ambil data:", err));
  }, [msId]);

  return (
    <div className="container">
      <div className="card-custom">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="page-title mb-0">
              Microservice <span className="text-primary">{msId}</span>
            </h2>
            <span className="badge badge-light text-secondary border">
              Connected to {dbName}
            </span>
          </div>
          <Link to="/pbl0902" className="btn btn-secondary btn-sm">
            Back to Home
          </Link>
        </div>

        {/* Action Toolbar dengan Link yang SUDAH DIPERBAIKI (/pbl0902/...) */}
        <div className="bg-light p-3 rounded mb-4 d-flex gap-2 border">
          <Link
            to={`/pbl0902/create/${msId}`}
            className="btn btn-success btn-sm"
          >
            ➕ Create New
          </Link>
          <Link to={`/pbl0902/read/${msId}`} className="btn btn-primary btn-sm">
            🔄 Refresh List
          </Link>
          <Link to={`/pbl0902/search/${msId}`} className="btn btn-info btn-sm">
            🔍 Search Data
          </Link>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Brand</th>
                <th>Model</th>
                <th>Price</th>
                <th>Description</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id}>
                  <td>
                    <span
                      className="badge"
                      style={{
                        color: "#000000",
                        padding: "5px 10px",
                        borderRadius: "10px",
                        fontWeight: "bold",
                      }}
                    >
                      {row.id || "N/A"}
                    </span>
                  </td>
                  <td className="font-weight-bold">{row.carname}</td>
                  <td>{row.carbrand}</td>
                  <td>{row.carmodel}</td>
                  <td className="text-success font-weight-bold">
                    {row.carprice}
                  </td>
                  <td className="small text-muted">{row.description}</td>
                  <td className="text-center">
                    {/* Link Update & Delete juga diperbaiki */}
                    <Link
                      to={`/pbl0902/update/${msId}`}
                      className="btn btn-sm btn-outline-warning mr-1"
                    >
                      ✏️
                    </Link>
                    <Link
                      to={`/pbl0902/delete/${msId}`}
                      className="btn btn-sm btn-outline-danger"
                    >
                      🗑️
                    </Link>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No Data Available / Server Offline
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ServerDashboard;
