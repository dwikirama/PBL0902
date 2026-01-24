import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Home = () => {
  const [dataDBA, setDataDBA] = useState([]);
  const [dataDBB, setDataDBB] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5051/cars")
      .then((res) => setDataDBA(res.data))
      .catch(() => setDataDBA([]));
    axios
      .get("http://localhost:5053/cars")
      .then((res) => setDataDBB(res.data))
      .catch(() => setDataDBB([]));
  }, []);

  return (
    <div className="container">
      {/* Header */}
      <div className="row mb-4 text-center">
        <div className="col-12">
          <h1 className="page-title display-4">🚗 Car Microservices Hub</h1>
          <p className="sub-title">
            Project Based Learning 0902 | Central Dashboard
          </p>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="row mb-5 justify-content-center">
        {["MS1", "MS2", "MS3"].map((ms) => (
          <div className="col-md-4 mb-3" key={ms}>
            <div className="card-custom card-hover text-center h-100">
              <h3 className="text-primary">{ms}</h3>
              <p className="text-muted small">
                {ms === "MS1"
                  ? "Direct DB-A Access"
                  : ms === "MS2"
                    ? "Gateway / Logic"
                    : "Direct DB-B Access"}
              </p>
              <Link
                to={`/pbl0902/ms/${ms}`}
                className="btn btn-outline-primary btn-block mt-auto"
              >
                Manage {ms} &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Tables Section */}
      <div className="row">
        {/* Table DB-A */}
        <div className="col-md-6">
          <div className="card-custom">
            <h4 className="mb-3 border-bottom pb-2">
              📂 Database A (MS1 & MS2)
            </h4>
            <div className="table-responsive">
              <table className="table table-hover table-sm">
                <thead>
                  <tr>
                    <th>Brand</th>
                    <th>Model</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {dataDBA.slice(0, 5).map((data) => (
                    <tr key={data.id}>
                      <td>{data.carbrand}</td>
                      <td>{data.carmodel}</td>
                      <td>{data.carprice}</td>
                    </tr>
                  ))}
                  {dataDBA.length === 0 && (
                    <tr>
                      <td colSpan="3" className="text-center">
                        No Data
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <small className="text-muted">*Showing top 5 entries</small>
            </div>
          </div>
        </div>

        {/* Table DB-B */}
        <div className="col-md-6">
          <div className="card-custom">
            <h4 className="mb-3 border-bottom pb-2">📂 Database B (MS3)</h4>
            <div className="table-responsive">
              <table className="table table-hover table-sm">
                <thead>
                  <tr>
                    <th>Brand</th>
                    <th>Model</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {dataDBB.slice(0, 5).map((data) => (
                    <tr key={data.id}>
                      <td>{data.carbrand}</td>
                      <td>{data.carmodel}</td>
                      <td>{data.carprice}</td>
                    </tr>
                  ))}
                  {dataDBB.length === 0 && (
                    <tr>
                      <td colSpan="3" className="text-center">
                        No Data
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <small className="text-muted">*Showing top 5 entries</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
