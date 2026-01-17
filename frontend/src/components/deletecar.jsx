import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const DeleteCar = () => {
  const { msId } = useParams();
  const navigate = useNavigate();
  const [id, setId] = useState("");

  const getBackendURL = () => {
    if (msId === "MS1") return "http://localhost:5051";
    if (msId === "MS2") return "http://localhost:5052";
    if (msId === "MS3") return "http://localhost:5053";
    return "";
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this car?")) return;
    try {
      await axios.delete(`${getBackendURL()}/cars/${id}`);
      alert("Data deleted.");
      navigate(`/pbl0902/ms/${msId}`);
    } catch (error) {
      alert("Error deleting data / ID not found");
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card-custom border-danger" style={{borderTop: '5px solid #e74c3c'}}>
            <h3 className="page-title text-center text-danger">Delete Car</h3>
            <p className="text-center text-muted">Server: {msId}</p>
            
            <form onSubmit={handleDelete}>
              <div className="form-group">
                <label>Enter Car ID to Delete</label>
                <input type="number" className="form-control form-control-lg" name="id" value={id} onChange={(e) => setId(e.target.value)} required placeholder="ID..." />
              </div>

              <div className="d-flex justify-content-between mt-4">
                <Link to={`/pbl0902/ms/${msId}`} className="btn btn-secondary">Cancel</Link>
                <button type="submit" className="btn btn-danger px-4">Delete Permanently</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteCar;