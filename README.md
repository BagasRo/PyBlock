# PyBlock
# PyBlock (Python Blockly Simulator)

PyBlock adalah simulator pemrograman visual berbasis web yang memungkinkan penggunanya untuk belajar dan menulis kode Python menggunakan antarmuka blok (drag-and-drop) yang interaktif. Aplikasi ini mengubah blok-blok logika tersebut menjadi kode Python murni dan langsung mengeksekusinya di dalam browser.

## ✨ Fitur Utama

- **Visual Programming**: Antarmuka berbasis blok yang interaktif menggunakan Google Blockly, memudahkan pemula untuk memahami alur logika (Control, Loops, Logic, Math, I/O).
- **Real-time Code Generation**: Setiap perubahan pada blok akan secara otomatis memperbarui kode Python di panel samping lengkap dengan *syntax highlighting*.
- **In-Browser Execution**: Mengeksekusi kode Python secara langsung di sisi klien (browser) menggunakan **Pyodide** (WebAssembly Python engine), sehingga cepat, aman, dan tanpa membebani server.
- **Interactive I/O**: Mendukung input dinamis menggunakan fungsi `input()` dari Python yang di-*routing* ke dialog browser, serta mencetak output sistem dan *error* di konsol bawaan.
- **Save & Load Workspace**: Kemampuan untuk menyimpan status susunan blok ke dalam file JSON dan memuatnya kembali.
- **Export to Python**: Memungkinkan pengguna untuk menyalin atau mengunduh blok visual mereka sebagai file skrip `.py` yang sesungguhnya.

## 🛠️ Teknologi yang Digunakan

- **Backend**: Node.js & Express.js (menyajikan aset statis dan API lokal)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Libraries Engine**:
  - Blockly (Pemrograman Visual)
  - Pyodide (Runtime Python WebAssembly)

## 🚀 Cara Menjalankan Aplikasi

1. Pastikan Anda telah menginstal Node.js di komputer Anda.
2. *Clone* atau unduh repositori ini.
3. Buka terminal di dalam direktori proyek (`d:\Coding\Phyton\python-blockly-sim`).
4. Instal semua dependensi menggunakan NPM:
   ```bash
   npm install
   ```
5. Jalankan server web lokal:
   ```bash
   npm start
   # atau
   node server.js
   ```
6. Buka web browser Anda dan kunjungi URL berikut:
   ```
   http://localhost:3000
   ```
   
Selamat mencoba dan belajar Python dengan cara yang menyenangkan!
