import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const SearchCar = () => {
  const { msId } = useParams();
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    let url = `http://localhost:5051/cars/search/${keyword}`;
    if (msId === "MS3") url = "http://localhost:5053/cars";
    if (msId === "MS2") url = "http://localhost:5052/cars"; // MS2 Logic (proxy)

    try {
      const res = await axios.get(url);
      let data = res.data;
      // Filter manual di frontend jika backend return semua (khusus MS2/MS3 jika endpoint search beda)
      if (msId !== "MS1" && Array.isArray(data)) {
        data = data.filter(
          (item) =>
            item.carname &&
            item.carname.toLowerCase().includes(keyword.toLowerCase()),
        );
      }
      setResults(Array.isArray(data) ? data : []);
    } catch (error) {
      setResults([]);
    }
  };

  return (
    <div className="container">
      <div className="card-custom">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="page-title">Search Car ({msId})</h2>
          <Link to={`/pbl0902/ms/${msId}`} className="btn btn-secondary btn-sm">
            Back to Dashboard
          </Link>
        </div>

        <form onSubmit={handleSearch} className="mb-4">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Enter car name (e.g. Honda)..."
              required
            />
            <div className="input-group-append">
              <button className="btn btn-info" type="submit">
                Search
              </button>
            </div>
          </div>
        </form>

        <h5 className="border-bottom pb-2 mb-3">Results</h5>
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="thead-light">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Brand</th>
                <th>Model</th>
                <th>Price</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {results.length > 0 ? (
                results.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td className="font-weight-bold">{row.carname}</td>
                    <td>{row.carbrand}</td>
                    <td>{row.carmodel}</td>
                    <td>${row.carprice}</td>
                    <td className="small text-muted">{row.description}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-4">
                    {keyword ? "No results found" : "Enter keyword to search"}
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

export default SearchCar;
