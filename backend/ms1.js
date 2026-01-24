// ms1.js - Port 5051 (DB-A)
const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const PORT = 5051;

app.use(cors());
app.use(express.json());

// Koneksi ke DB-A
const db = new sqlite3.Database("./DB-A.db", (err) => {
  if (err) console.error("MS1: Gagal koneksi DB-A", err);
  else console.log("MS1: Terhubung ke DB-A");
});

// 1. GET ALL (Read)
app.get("/cars", (req, res) => {
  db.all("SELECT * FROM tbcarsweb ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 2. SEARCH (HARUS DI ATAS GET BY ID!)
app.get("/cars/search/:query", (req, res) => {
  const { query } = req.params;
  db.all(
    "SELECT * FROM tbcarsweb WHERE carname LIKE ?",
    [`%${query}%`],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    },
  );
});

// 3. GET SINGLE (By ID)
app.get("/cars/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM tbcarsweb WHERE id = ?", [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: "Car not found" });
    res.json(row);
  });
});

// 4. CREATE (Post)
app.post("/cars", (req, res) => {
  const { carname, carbrand, carmodel, carprice, description } = req.body;
  const query = `INSERT INTO tbcarsweb (carname, carbrand, carmodel, carprice, description) 
                 VALUES (?, ?, ?, ?, ?)`;

  db.run(
    query,
    [carname, carbrand, carmodel, carprice, description],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({
        message: "Data Saved",
        id: this.lastID,
        carname,
        carbrand,
        carmodel,
        carprice,
        description,
      });
    },
  );
});

// 5. UPDATE (Put) - DIPERBAIKI!
app.put("/cars/:id", (req, res) => {
  const updates = [];
  const values = [];

  // Hanya update field yang dikirim
  if (req.body.carname !== undefined) {
    updates.push("carname = ?");
    values.push(req.body.carname);
  }
  if (req.body.carbrand !== undefined) {
    updates.push("carbrand = ?");
    values.push(req.body.carbrand);
  }
  if (req.body.carmodel !== undefined) {
    updates.push("carmodel = ?");
    values.push(req.body.carmodel);
  }
  if (req.body.carprice !== undefined) {
    updates.push("carprice = ?");
    values.push(req.body.carprice);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  values.push(req.params.id);

  // FIX: tbcarsweb bukan dba!
  const query = `UPDATE tbcarsweb SET ${updates.join(", ")} WHERE id = ?`;

  db.run(query, values, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({
      message: "Updated successfully",
      changes: this.changes,
    });
  });
});

// 6. DELETE
app.delete("/cars/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM tbcarsweb WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ result: "Data Deleted" });
  });
});

app.listen(PORT, () => {
  console.log(`MS1 (Express) berjalan di http://localhost:${PORT}`);
});
