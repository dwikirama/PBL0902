const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const PORT = 5000; // Sesuai slide arsitektur (Admin/AppX) atau bisa 5051 (MS1)

// Middleware
app.use(cors());
app.use(express.json());

// --- KONEKSI DATABASE (carsweb.db) ---
// Pastikan file carsweb.db ada di folder yang sama, atau kode ini akan membuatnya otomatis
const db = new sqlite3.Database("./carsweb.db", (err) => {
  if (err) console.error("Gagal koneksi database:", err.message);
  else console.log("Terhubung ke database SQLite (carsweb.db).");
});

// Setup Tabel (Jika belum ada di carsweb.db)
// Kita sesuaikan fieldnya dengan Frontend React kamu (merek, model, tahun, warna)
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS cars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    merek TEXT,
    model TEXT,
    tahun TEXT,
    warna TEXT,
    token TEXT -- Tambahan untuk Secure #1 jika diperlukan
  )`);

  // Tabel Logs (Untuk Secure #3 Logging)
  db.run(`CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT,
    username TEXT,
    ip_address TEXT,
    action TEXT,
    details TEXT
  )`);
});

// --- ROUTES (API ENDPOINTS) ---

// 1. GET ALL CARS (READ)
app.get("/cars", (req, res) => {
  db.all("SELECT * FROM cars ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 2. ADD CAR (CREATE)
app.post("/cars", (req, res) => {
  const { merek, model, tahun, warna, username } = req.body;
  const token = crypto.randomUUID ? crypto.randomUUID() : `token-${Date.now()}`; // Fallback jika node lama

  const query = `INSERT INTO cars (merek, model, tahun, warna, token) VALUES (?, ?, ?, ?, ?)`;
  db.run(query, [merek, model, tahun, warna, token], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    // Auto-log aktivitas
    logActivity("ADD", `Menambah ${merek} ${model}`, username || "Guest", req.ip);

    res.json({ success: true, id: this.lastID, token, merek, model, tahun, warna });
  });
});

// 3. UPDATE CAR (UPDATE) - via ID
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

  values.push(req.params.id); // Tambahkan ID di akhir

  const query = `UPDATE dba SET ${updates.join(", ")} WHERE id = ?`;

  db.run(query, values, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Updated successfully", changes: this.changes });
  });
});

// 4. DELETE CAR (DELETE) - via ID
app.delete("/cars/:id", (req, res) => {
  const { id } = req.params;
  const { username } = req.query; // Ambil username dari query string

  db.run("DELETE FROM cars WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });

    logActivity("DELETE", `Hapus data ID: ${id}`, username || "Guest", req.ip);
    res.json({ success: true });
  });
});

// 5. HELPER: LOGGING (Simpan ke DB)
function logActivity(action, details, username, ip) {
  const timestamp = new Date().toLocaleString("id-ID");
  // Fix IP ::1 jadi 127.0.0.1
  const cleanIp = ip === "::1" || ip === "::ffff:127.0.0.1" ? "127.0.0.1" : ip;

  db.run(`INSERT INTO logs (timestamp, username, ip_address, action, details) VALUES (?, ?, ?, ?, ?)`, [timestamp, username, cleanIp, action, details]);
}

// 6. API LOGS (Untuk ditampilkan di halaman Logs)
app.get("/logs", (req, res) => {
  db.all("SELECT * FROM logs ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Login Dummy (Simulasi Session)
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin123") {
    logActivity("LOGIN", `User ${username} login`, username, req.ip);
    res.json({ success: true, username });
  } else {
    logActivity("LOGIN_FAILED", `Gagal login: ${username}`, "Guest", req.ip);
    res.status(401).json({ success: false, message: "Login Gagal" });
  }
});

app.listen(PORT, () => {
  console.log(`Server Express (PBL0902) berjalan di http://localhost:${PORT}`);
});
