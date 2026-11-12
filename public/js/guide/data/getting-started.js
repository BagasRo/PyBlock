/**
 * Panduan Blockly — Mulai Di Sini (Getting Started)
 * Penjelasan pengenalan antarmuka, penyambungan blok, eksekusi kode, dan manajemen workspace.
 */
export default {
    id: "getting_started",
    nama: "Mulai Di Sini",
    deskripsi: "Panduan pengenalan area kerja, cara menyambung blok, dan menjalankan simulasi.",
    warna: "#38BDF8",
    icon: "🚀",
    entries: [
        {
            id: "intro_workspace",
            aliases: ["workspace", "area_kerja", "antarmuka", "tampilan"],
            nama: "Mengenal Workspace & Antarmuka",
            kategori: "Mulai Di Sini",
            kategoriId: "getting_started",
            gambar: ["workspace-overview.png"],
            fungsi: "Memahami bagian-bagian utama antarmuka simulator untuk menyusun program Python secara visual.",
            kegunaan: "Mengetahui tempat mengambil blok, area menyusun blok, jendela editor kode Python otomatis, dan konsol terminal keluaran hasil eksekusi.",
            langkah: [
                "Toolbox (Sisi Kiri): Berisi kategori blok (Text, Math, I/O, Control, Loops, dll) yang dapat diklik untuk memilih blok.",
                "Area Kerja / Workspace (Tengah): Kanvas tempat kamu menyusun dan merangkai blok-blok logika program.",
                "Editor Kode Python (Sisi Kanan Atas): Menampilkan kode Python asli yang otomatis diperbarui secara realtime dari susunan blok.",
                "Output / Konsol Terminal (Sisi Kanan Bawah): Tempat menampilkan hasil cetak dan mengetikkan input saat program dijalankan.",
                "Tombol Kontrol: Tombol 'Jalankan' untuk menguji kode, serta 'Kumpulkan' untuk mengecek kesesuaian jawaban simulasi."
            ],
            contoh: {
                deskripsi: "Tampilan simulator standar yang siap digunakan menyusun blok kode.",
                python: "# Area kode Python otomatis ter-generate dari susunan blok di sebelah kiri\nprint('Selamat Belajar Coding!')"
            },
            opsi: null,
            kesalahanUmum: [
                "Mengira kode Python harus diketik secara manual di panel kanan (padahal kode otomatis tercipta dari blok).",
                "Panik saat blok geser keluar layar (cukup klik dan seret latar belakang kanvas untuk menggeser pandangan)."
            ],
            lihatJuga: ["intro_connect", "intro_run", "intro_delete"]
        },
        {
            id: "intro_connect",
            aliases: ["connect", "sambung_blok", "colokan", "puzzle"],
            nama: "Menyambung dan Menyusun Blok",
            kategori: "Mulai Di Sini",
            kategoriId: "getting_started",
            gambar: ["connect-blocks.png"],
            fungsi: "Menghubungkan tonjolan dan lekukan antar blok puzzle untuk membentuk alur instruksi program yang berurutan.",
            kegunaan: "Menyusun logika beruntun (dari atas ke bawah) atau memasukkan nilai data ke dalam parameter fungsi.",
            langkah: [
                "Buka kategori di toolbox sebelah kiri dan tarik blok yang dibutuhkan ke area kanvas.",
                "Dekatkan lekukan atau tonjolan blok baru ke blok yang sudah ada di kanvas.",
                "Perhatikan bayangan atau sorotan kuning/biru yang muncul sebagai penanda bahwa sambungan siap menempel.",
                "Lepaskan klik tetikus (mouse/touchpad). Blok akan menempel dengan suara klik halus.",
                "Untuk memisahkan blok, tarik bagian bawah blok yang ingin dipisah lalu letakkan di area bebas."
            ],
            contoh: {
                deskripsi: "Menyambungkan blok teks 'Halo Dunia' ke dalam slot input blok print.",
                python: "print('Halo Dunia')"
            },
            opsi: null,
            kesalahanUmum: [
                "Meletakkan blok berdekatan tetapi belum menempel pada tonjolan/slot, sehingga blok tidak ikut dieksekusi.",
                "Memasukkan tipe blok yang tidak cocok (misal mencoba menyambung blok perintah alur ke slot input teks)."
            ],
            lihatJuga: ["intro_workspace", "text_print", "text"]
        },
        {
            id: "intro_run",
            aliases: ["run", "jalankan", "eksekusi", "play"],
            nama: "Menjalankan Kode & Membaca Output",
            kategori: "Mulai Di Sini",
            kategoriId: "getting_started",
            gambar: ["run-code.png"],
            fungsi: "Mengeksekusi susunan blok melalui mesin Python (Pyodide) dan menampilkan hasilnya di panel konsol.",
            kegunaan: "Menguji kebenaran algoritma, memeriksa apakah logika program berjalan lancar tanpa error, dan melihat hasil cetak.",
            langkah: [
                "Pastikan seluruh blok yang diperlukan sudah tersambung rapi di workspace.",
                "Klik tombol merah '▶ Jalankan' di pojok kanan atas editor Python.",
                "Lihat baris teks output yang muncul pada jendela terminal di bawah editor.",
                "Jika program meminta input dari pengguna, sebuah kotak isian prompt interaktif akan muncul. Ketik jawaban lalu tekan Enter.",
                "Klik tombol 'Clear' di pojok terminal jika ingin membersihkan riwayat output layar."
            ],
            contoh: {
                deskripsi: "Menjalankan program membaca nama dan menyapa pengguna.",
                python: "nama = input('Masukkan nama: ')\nprint('Halo ' + str(nama))"
            },
            opsi: null,
            kesalahanUmum: [
                "Lupa menekan tombol Jalankan setelah mengubah susunan blok.",
                "Tidak menekan Enter saat kotak input interaktif muncul di layar."
            ],
            lihatJuga: ["text_print", "python_input", "read_number"]
        },
        {
            id: "intro_delete",
            aliases: ["delete", "hapus_blok", "undo", "pulihkan", "sampah", "trashcan"],
            nama: "Menghapus & Memulihkan Blok",
            kategori: "Mulai Di Sini",
            kategoriId: "getting_started",
            gambar: ["delete-restore.png"],
            fungsi: "Menghapus blok yang tidak diinginkan dan memulihkan kembali blok yang terhapus.",
            kegunaan: "Membersihkan area kerja dari blok yang tidak terpakai dan mengambil kembali blok yang tidak sengaja terhapus.",
            langkah: [
                "Cara Menghapus Blok:",
                "1. Klik blok yang ingin dihapus, lalu tekan tombol 'Delete' atau 'Backspace' pada keyboard.",
                "2. Seret (drag) blok ke arah ikon tempat sampah di pojok bawah area kerja (workspace), atau ke arah toolbox lalu lepaskan.",
                "3. Klik kanan pada blok, lalu pilih menu 'Delete Block'.",
                "Cara Memulihkan Blok yang Terhapus:",
                "1. Klik ikon tempat sampah 🗑️ di bawah kiri area kerja (workspace). Jendela daftar blok yang baru saja dibuang akan terbuka, lalu klik atau seret blok tersebut kembali ke workspace.",
                "2. Membatalkan Penghapusan (Undo): Tekan kombinasi tombol 'Ctrl + Z' pada keyboard untuk langsung mengembalikan blok yang baru saja terhapus.",
                "3. Redo: Tekan 'Ctrl + Y' atau 'Ctrl + Shift + Z' untuk mengulang kembali aksi yang dibatalkan."
            ],
            contoh: {
                deskripsi: "Memulihkan blok yang terhapus dapat dilakukan dengan mengeklik ikon tempat sampah di pojok bawah kiri workspace atau menekan tombol pintasan Ctrl+Z.",
                python: "# Memulihkan blok: klik ikon sampah di bawah kiri workspace atau gunakan Ctrl+Z"
            },
            opsi: null,
            kesalahanUmum: [
                "Menghapus blok induk yang memiliki banyak anak di dalamnya (seluruh anak blok di dalam induk akan ikut terhapus). Klik ikon tempat sampah atau tekan Ctrl+Z untuk memulihkan.",
                "Membiarkan blok tak terpakai mengambang bebas di workspace yang bisa menyebabkan kode Python menghasilkan baris tak diharapkan."
            ],
            lihatJuga: ["intro_workspace", "intro_connect"]
        }
    ]
};
