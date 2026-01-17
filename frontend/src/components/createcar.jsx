import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const CreateCar = () => {
  const { msId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ carname: "", carbrand: "", carmodel: "", carprice: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      description: `Input via ${msId} (To DB-${msId === "MS3" ? "B" : "A"})`,
    };

    try {
      if (msId === "MS1") await axios.post("http://localhost:5051/cars", payload);
      else if (msId === "MS3") await axios.post("http://localhost:5053/cars", payload);
      else if (msId === "MS2") {
        await axios.post("http://localhost:5052/cars", { ...payload, description: "Input via MS2 (To DB-A)" });
        await axios.post("http://localhost:5053/cars", { ...payload, description: "Input via MS2 (To DB-B)" });
      }
      navigate(`/pbl0902/ms/${msId}`);
    } catch (error) {
      alert("Error creating data");
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card-custom">
            <h3 className="page-title text-center">Add New Car</h3>
            <p className="text-center text-muted mb-4">Target: {msId}</p>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Car Name</label>
                <input type="text" className="form-control" name="carname" onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Brand</label>
                <input type="text" className="form-control" name="carbrand" onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Model</label>
                <input type="text" className="form-control" name="carmodel" onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Price</label>
                <input type="number" className="form-control" name="carprice" onChange={handleChange} required />
              </div>

              <div className="d-flex justify-content-between mt-4">
                <Link to={`/pbl0902/ms/${msId}`} className="btn btn-secondary">Cancel</Link>
                <button type="submit" className="btn btn-primary px-4">Save Data</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCar;