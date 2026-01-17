import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const UpdateCar = () => {
  const { msId } = useParams();
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [form, setForm] = useState({ carname: "", carbrand: "", carmodel: "", carprice: "" });

  const getBackendURL = () => {
    if (msId === "MS1") return "http://localhost:5051";
    if (msId === "MS2") return "http://localhost:5052";
    if (msId === "MS3") return "http://localhost:5053";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {};
    if (form.carname) payload.carname = form.carname;
    if (form.carbrand) payload.carbrand = form.carbrand;
    if (form.carmodel) payload.carmodel = form.carmodel;
    if (form.carprice) payload.carprice = form.carprice;

    if (Object.keys(payload).length === 0) {
      alert("Please fill at least one field");
      return;
    }

    try {
      await axios.put(`${getBackendURL()}/cars/${id}`, payload);
      alert("Data updated successfully");
      navigate(`/pbl0902/ms/${msId}`);
    } catch (error) {
      alert("Error updating data / ID not found");
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card-custom border-warning" style={{borderTop: '5px solid #f1c40f'}}>
            <h3 className="page-title text-center">Update Car</h3>
            <p className="text-center text-muted mb-4">Server: {msId}</p>

            <form onSubmit={handleSubmit}>
              <div className="form-group bg-light p-3 rounded mb-3">
                <label className="font-weight-bold">Target ID</label>
                <input type="number" className="form-control" name="id" value={id} onChange={(e) => setId(e.target.value)} required placeholder="Enter Car ID..." />
              </div>

              <div className="form-group">
                <label>New Name</label>
                <input type="text" className="form-control" name="carname" onChange={(e) => setForm({ ...form, carname: e.target.value })} />
              </div>
              <div className="form-group">
                <label>New Brand</label>
                <input type="text" className="form-control" name="carbrand" onChange={(e) => setForm({ ...form, carbrand: e.target.value })} />
              </div>
              <div className="form-group">
                <label>New Model</label>
                <input type="text" className="form-control" name="carmodel" onChange={(e) => setForm({ ...form, carmodel: e.target.value })} />
              </div>
              <div className="form-group">
                <label>New Price</label>
                <input type="number" className="form-control" name="carprice" onChange={(e) => setForm({ ...form, carprice: e.target.value })} />
              </div>

              <div className="d-flex justify-content-between mt-4">
                <Link to={`/pbl0902/ms/${msId}`} className="btn btn-secondary">Cancel</Link>
                <button type="submit" className="btn btn-warning px-4">Update</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCar;