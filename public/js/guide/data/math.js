/**
 * Panduan Blockly — Kategori Math
 * Berisi blok: math_number, math_arithmetic, math_modulo
 */
export default {
    id: "math",
    nama: "Math",
    deskripsi: "Blok untuk angka numerik, kalkulasi matematika, dan operasi aritmatika.",
    warna: "#5C68A6",
    icon: "🔢",
    entries: [
        {
            id: "math_number",
            aliases: ["angka", "number", "bilangan", "konstanta_angka"],
            nama: "123 (Konstanta Angka)",
            kategori: "Math",
            kategoriId: "math",
            gambar: ["math-number-block.png"],
            fungsi: "Menyimpan nilai bilangan numerik (bulat positif, negatif, atau pecahan berkoma).",
            kegunaan: "Memberikan nilai awal pada variabel (misal: lanjut = 1), batas pengulangan loop (misal: 3 kali), atau nilai KKM standar (75, 90).",
            langkah: [
                "Buka kategori Math di toolbox.",
                "Tarik blok angka berwarna biru ke kanvas.",
                "Klik pada angka default (misal 123) lalu ketik angka yang dibutuhkan, misalnya 75 atau 1.",
                "Colokkan ke slot yang membutuhkan tipe angka, seperti slot nilai variabel atau pembanding logika."
            ],
            contoh: {
                deskripsi: "Mengatur variabel lanjut bernilai 1 sebagai saklar awal while loop.",
                python: "lanjut = 1"
            },
            opsi: null,
            kesalahanUmum: [
                "Memasukkan karakter huruf di dalam blok angka numerik.",
                "Mengira angka di blok Math sama dengan blok Teks '123' (blok Math bertipe numerik integer/float, sedangkan blok Teks bertipe string)."
            ],
            lihatJuga: ["math_arithmetic", "math_modulo", "read_number"]
        },
        {
            id: "math_arithmetic",
            aliases: ["hitung", "tambah", "kurang", "kali", "bagi", "pangkat", "aritmatika"],
            nama: "Operasi Aritmatika (+, -, ×, ÷, ^)",
            kategori: "Math",
            kategoriId: "math",
            gambar: ["math-arithmetic-block.png"],
            fungsi: "Menjalankan perhitungan matematika dasar antara dua angka atau dua variabel numerik.",
            kegunaan: "Menghitung total nilai ujian, mencari rata-rata, menghitung diskon harga, atau mengkalkulasi luas dan keliling.",
            langkah: [
                "Buka kategori Math di toolbox.",
                "Tarik blok operasi aritmatika ke kanvas.",
                "Klik menu dropdown di tengah blok untuk memilih operator: + (penjumlahan), - (pengurangan), × (perkalian), ÷ (pembagian), atau ^ (pangkat).",
                "Pasang angka atau variabel di slot sebelah kiri dan slot sebelah kanan."
            ],
            contoh: {
                deskripsi: "Menghitung rata-rata dari dua variabel nilai dengan operasi penjumlahan dan pembagian.",
                gambar: [
                    { src: "math-arithmetic-example.png", caption: "Contoh operasi hitung bertingkat: rata_rata = (nilai1 + nilai2) / 2" }
                ],
                python: "rata_rata = (nilai1 + nilai2) / 2"
            },
            opsi: null,
            kesalahanUmum: [
                "Melakukan pembagian dengan angka 0 yang memicu ZeroDivisionError di Python.",
                "Salah memilih operator hitung (misal ingin perkalian tetapi memilih operator pangkat ^)."
            ],
            lihatJuga: ["math_number", "math_modulo", "variables_set"]
        },
        {
            id: "math_modulo",
            aliases: ["modulo", "mod", "sisa_bagi", "remainder"],
            nama: "remainder of (Sisa Pembagian / Modulo %)",
            kategori: "Math",
            kategoriId: "math",
            gambar: ["math-modulo-block.png"],
            fungsi: "Menghitung sisa bilangan bulat yang tertinggal setelah suatu angka dibagi dengan angka lainnya.",
            kegunaan: "Mendeteksi bilangan genap/ganjil (`angka % 2 == 0`), menentukan tahun kabisat, kelipatan angka, atau konversi satuan waktu (detik ke menit/jam).",
            langkah: [
                "Buka kategori Math di toolbox.",
                "Tarik blok 'remainder of'.",
                "Masukkan bilangan yang dibagi di slot sebelah kiri, dan bilangan pembagi di slot sebelah kanan.",
                "Colokkan hasilnya ke pembanding logika atau variabel."
            ],
            contoh: {
                deskripsi: "Mengecek apakah suatu angka merupakan bilangan genap menggunakan perbandingan modulo (angka % 2 == 0).",
                gambar: [
                    { src: "math-modulo-example.png", caption: "Penerapan modulo di dalam blok if untuk mendeteksi bilangan genap: angka % 2 == 0" }
                ],
                python: "if angka % 2 == 0:\n    print('Bilangan Genap')"
            },
            opsi: null,
            kesalahanUmum: [
                "Mengisi slot pembagi di sebelah kanan dengan angka 0.",
                "Mengira hasil modulo adalah hasil bagi desimal (modulo adalah sisa pembagian, misal 7 % 3 adalah 1, bukan 2.33)."
            ],
            lihatJuga: ["math_arithmetic", "logic_compare", "controls_if"]
        }
    ]
};
