/**
 * Panduan Blockly — Kategori I/O (Input/Output)
 * Berisi blok: text_print, python_input, read_number, read_float
 */
export default {
    id: "io",
    nama: "I/O",
    deskripsi: "Blok untuk membaca masukan pengguna (input) dan mencetak keluaran (output) ke layar.",
    warna: "#49a39f",
    icon: "📥",
    entries: [
        {
            id: "text_print",
            aliases: ["print", "cetak", "tampilkan", "output"],
            nama: "print (Cetak Teks / Nilai)",
            kategori: "I/O",
            kategoriId: "io",
            gambar: ["print-block.png", "text-print.png"],
            fungsi: "Mencetak teks, angka, variabel, atau hasil penggabungan string ke layar terminal konsol.",
            kegunaan: "Menampilkan pesan sambutan kepada pengguna, mencetak hasil pengolahan data, laporan nilai siswa, atau status kelulusan.",
            langkah: [
                "Buka kategori I/O di sebelah kiri toolbox.",
                "Tarik blok 'print' ke kanvas workspace.",
                "Pasang blok teks, variabel, atau penggabung teks (create text with) ke dalam slot input 'print'.",
                "Jika ingin mencetak beberapa baris, tumpuk blok print baru tepat di bawah blok print sebelumnya."
            ],
            contoh: {
                deskripsi: "Mencetak kalimat sambutan aplikasi pencatatan nilai ke layar konsol.",
                gambar: [
                    { src: "text-print.png", caption: "Blok print menerima input teks atau ekspresi untuk ditampilkan di terminal" }
                ],
                python: "print('Selamat Datang di Aplikasi Pencatatan Nilai')"
            },
            opsi: null,
            kesalahanUmum: [
                "Membiarkan slot di dalam blok print kosong sehingga menghasilkan baris kosong.",
                "Mencoba mencetak beberapa nilai sekaligus tanpa menghubungkannya melalui blok penggabung teks (create text with)."
            ],
            lihatJuga: ["text", "text_join", "convert_to_string"]
        },
        {
            id: "python_input",
            aliases: ["input", "read_text", "baca_teks", "masukan_teks"],
            nama: "input / read text (Baca Input Teks)",
            kategori: "I/O",
            kategoriId: "io",
            gambar: ["input-block.png"],
            fungsi: "Meminta pengguna mengetikkan teks melalui keyboard dan mengembalikan nilainya sebagai tipe data teks (string).",
            kegunaan: "Membaca nama siswa, nama barang, kota, atau data teks lainnya yang dimasukkan oleh pengguna secara interaktif.",
            langkah: [
                "Buka kategori I/O di toolbox.",
                "Tarik blok 'read text' ke kanvas.",
                "Isi pertanyaan pemantik (prompt) di dalam tanda petik, misalnya 'masukkan nama: '.",
                "Pasangkan output blok ini ke slot nilai pada variabel 'set [nama] to' agar nilainya tersimpan dan bisa digunakan."
            ],
            contoh: {
                deskripsi: "Membaca nama siswa dan menyimpannya ke variabel nama.",
                python: "nama = input('masukkan nama: ')\nprint('Halo ' + str(nama))"
            },
            opsi: null,
            kesalahanUmum: [
                "Menggunakan blok ini untuk membaca angka yang akan dihitung matematika (karena tipe datanya berupa string, bukan integer).",
                "Tidak menyimpan hasil input ke dalam variabel, sehingga data yang diketik pengguna langsung hilang."
            ],
            lihatJuga: ["read_number", "read_float", "variables_set"]
        },
        {
            id: "read_number",
            aliases: ["read_int", "read_number", "input_angka", "baca_angka", "int_input"],
            nama: "read int (Baca Input Angka Bulat)",
            kategori: "I/O",
            kategoriId: "io",
            gambar: ["read-number-block.png"],
            fungsi: "Membaca input dari pengguna dan otomatis mengonversinya menjadi bilangan bulat (integer / int).",
            kegunaan: "Membaca umur, nilai ujian siswa, nomor menu pilihan (misal: 1=Ya, 0=Tidak), atau jumlah barang belanjaan.",
            langkah: [
                "Buka kategori I/O di toolbox.",
                "Tarik blok 'read int' ke kanvas.",
                "Ketikkan kalimat pertanyaan pada slot prompt, misalnya 'Masukkan angka: ' atau 'Tambah data? (1=Ya, 0=Tidak): '.",
                "Colokkan blok ini ke variabel penampung angka, seperti 'set nilai to' atau 'set lanjut to'."
            ],
            contoh: {
                deskripsi: "Membaca nilai ujian siswa dalam bentuk angka bulat.",
                python: "nilai = int(input('Masukkan angka: '))\nif nilai >= 75:\n    print('Status: Lulus')"
            },
            opsi: null,
            kesalahanUmum: [
                "Pengguna memasukkan huruf atau karakter non-angka saat aplikasi berjalan, yang memicu error ValueError di Python.",
                "Menggunakan blok pembaca teks biasa saat ingin membandingkan nilai numerik (misal: '75' >= 75 akan memicu TypeError di Python 3)."
            ],
            lihatJuga: ["read_float", "python_input", "math_number", "variables_set"]
        },
        {
            id: "read_float",
            aliases: ["read_float", "baca_desimal", "input_desimal", "float_input"],
            nama: "read float (Baca Input Angka Desimal)",
            kategori: "I/O",
            kategoriId: "io",
            gambar: ["read-float-block.png"],
            fungsi: "Membaca input dari pengguna dan otomatis mengonversinya menjadi angka berkoma / pecahan (float).",
            kegunaan: "Membaca nilai IPK (misal: 3.85), suhu tubuh, berat badan, tinggi badan, atau persentase nilai.",
            langkah: [
                "Buka kategori I/O di toolbox.",
                "Tarik blok 'read float' ke kanvas.",
                "Isi kalimat pertanyaan prompt, misal 'Masukkan nilai IPK: '.",
                "Sambungkan ke blok variabel tempat menyimpan angka desimal tersebut."
            ],
            contoh: {
                deskripsi: "Membaca suhu ruangan dan menampilkannya kembali.",
                python: "suhu = float(input('Masukkan suhu (°C): '))\nprint('Suhu terukur: ' + str(suhu))"
            },
            opsi: null,
            kesalahanUmum: [
                "Mengetik tanda koma ',' saat menginput angka di konsol (Python mewajibkan tanda titik '.' untuk desimal, misal 3.75 bukan 3,75)."
            ],
            lihatJuga: ["read_number", "python_input", "math_arithmetic"]
        }
    ]
};
