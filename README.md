# PyBlock (Python Blockly Simulator)

**PyBlock** adalah platform pembelajaran pemrograman Python interaktif berbasis web untuk pemula. Aplikasi ini menggabungkan antarmuka pemrograman visual blok (*drag-and-drop*) bertenaga Google Blockly dengan eksekusi kode Python langsung di dalam peramban web (*in-browser*) menggunakan WebAssembly (**Pyodide**).

---

## ✨ Fitur Utama

- 🧩 **Visual Programming**: Menyusun algoritma menggunakan blok visual intuitif (I/O, Variabel, Logika/Percabangan, Perulangan, List, Matematika, dan Teks).
- 🐍 **Real-time Python Generation**: Blok visual langsung diterjemahkan menjadi kode Python standar secara *real-time* dengan penyorotan sintaks (*syntax highlighting*).
- ⚡ **In-Browser Execution (Pyodide)**: Mengeksekusi Python secara aman dan cepat langsung di browser pengguna tanpa memerlukan instalasi Python di komputer lokal.
- 📝 **Mode Latihan Simulasi Berantai**:
  - Terdiri dari 4 Level bertingkat (Dasar I/O, Percabangan, Perulangan, hingga List).
  - Setiap level memiliki 5 varian soal cerita berantai.
  - Dilengkapi batasan waktu (*countdown timer*) dan validasi keberhasilan otomatis (*test cases*).
  - Sistem penilaian dan evaluasi skor akhir.
- 🧪 **Mode Sandbox**: Ruang eksperimen bebas tanpa batasan waktu untuk merancang dan mencoba algoritma sendiri.
- 📖 **Panduan Ensiklopedia Blok & Python**:
  - Dokumentasi visual lengkap untuk setiap kategori blok.
  - Disertai contoh kasus nyata, ilustrasi blok, dan padanan sintaks Python-nya.
  - Dapat diakses melalui modal bantuan di ruang kerja maupun halaman mandiri (`/panduan`).
- 📚 **Modul Materi Pembelajaran**: Materi bacaan terstruktur dari materi pengantar hingga level mahir.
- 💾 **Manajemen Workspace**: Fitur simpan/muat proyek via file JSON, tombol reset workspace ke kondisi awal soal, serta ekspor skrip ke file `.py`.

---

## 🛠️ Teknologi yang Digunakan

- **Backend**: Node.js & Express.js
- **Frontend**: HTML5, Modern CSS3, Vanilla JavaScript (ES6+ Modules)
- **Library & Mesin Eksekusi**:
  - [Google Blockly](https://developers.google.com/blockly) - Visual Programming Workspace
  - [Pyodide](https://pyodide.org/) - Python runtime via WebAssembly

---

## 📁 Struktur Direktori

```text
python-blockly-Tes-Soal/
├── public/
│   ├── assets/              # Aset gambar, ikon, dan ilustrasi panduan
│   ├── css/                 # Stylesheet antarmuka utama dan panduan
│   ├── js/
│   │   ├── guide/           # Data & sistem navigasi panduan ensiklopedia
│   │   ├── problems/        # Bank soal simulasi (Level 1 - 4 & questions.js)
│   │   ├── blockly-config.js# Konfigurasi custom blocks & toolbox Blockly
│   │   ├── python-generator.js # Generator blok ke kode Python
│   │   ├── simulation-manager.js # Logika alur simulasi, timer, & evaluasi
│   │   └── simulator.js     # Integrasi Pyodide & antarmuka simulator
│   ├── index.html           # Halaman beranda utama
│   ├── materi.html          # Menu modul materi
│   ├── panduan.html         # Halaman panduan ensiklopedia blok
│   ├── simulator.html       # Pemilihan mode simulasi / latihan
│   ├── simulasi.html        # Antarmuka pengerjaan simulasi berantai
│   └── sandbox.html         # Antarmuka eksplorasi bebas (sandbox)
├── server.js                # Server Express.js lokal
├── package.json
└── README.md
```

---

## 🚀 Cara Menjalankan Aplikasi

1. **Prasyarat**: Pastikan sudah terpasang [Node.js](https://nodejs.org/) di komputer Anda.
2. **Clone Repositori**:
   ```bash
   git clone https://github.com/BagasRo/PyBlock.git
   cd PyBlock
   ```
3. **Instal Dependensi**:
   ```bash
   npm install
   ```
4. **Jalankan Server**:
   ```bash
   npm start
   # atau
   node server.js
   ```
5. **Buka di Browser**:
   Akses `http://localhost:3000` pada peramban web pilihan Anda.
