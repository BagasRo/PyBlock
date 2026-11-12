/**
 * Panduan Blockly — Kategori Logic
 * Berisi blok: logic_compare, logic_operation, logic_negate, logic_boolean
 */
export default {
    id: "logic",
    nama: "Logic",
    deskripsi: "Blok perbandingan nilai dan operasi logika kebenaran boolean (True / False).",
    warna: "#5C81A6",
    icon: "⚖️",
    entries: [
        {
            id: "logic_compare",
            aliases: ["compare", "pembanding", "sama_dengan", "lebih_besar", "kurang_dari", "gte", "lte"],
            nama: "Perbandingan Logika (=, ≠, <, ≤, >, ≥)",
            kategori: "Logic",
            kategoriId: "logic",
            gambar: ["logic-compare-block.png", "logic-compare.png"],
            fungsi: "Membandingkan dua nilai dan menghasilkan nilai boolean True (Benar) atau False (Salah).",
            kegunaan: "Menjadi syarat penentu pada blok 'if', 'repeat while', filter data list, atau validasi angka.",
            langkah: [
                "Buka kategori Logic di toolbox.",
                "Tarik blok perbandingan ke kanvas.",
                "Klik tanda pembanding di tengah blok untuk memilih operator:",
                "  • = (sama dengan)",
                "  • ≠ (tidak sama dengan)",
                "  • < (lebih kecil dari)",
                "  • ≤ (lebih kecil sama dengan)",
                "  • > (lebih besar dari)",
                "  • ≥ (lebih besar sama dengan)",
                "Pasang variabel atau angka di slot kiri (A) dan slot kanan (B)."
            ],
            contoh: {
                deskripsi: "Mengecek apakah variabel nilai siswa mencapai minimal 75. Menghasilkan True jika nilai >= 75.",
                gambar: [
                    { src: "logic-compare.png", caption: "Blok perbandingan logika dengan pilihan operator relasional" }
                ],
                python: "nilai >= 75"
            },
            opsi: null,
            kesalahanUmum: [
                "Tertukar posisi kiri dan kanan: memasang angka di kiri dan variabel di kanan (misal `75 >= nilai` yang berarti nilai maksimal 75, bukan minimal 75).",
                "Memakai tanda '=' tunggal saat berniat mengecek kesamaan (di Python perbandingan sama dengan adalah `==`)."
            ],
            lihatJuga: ["controls_if", "controls_whileUntil", "math_number"]
        },
        {
            id: "logic_operation",
            aliases: ["and", "or", "dan", "atau", "operator_logika"],
            nama: "Operasi Logika (and / or)",
            kategori: "Logic",
            kategoriId: "logic",
            gambar: ["logic-operation-block.png", "logic-and.png"],
            fungsi: "Menggabungkan dua syarat logika boolean menjadi satu kesimpulan keputusan.",
            kegunaan: "Mengecek rentang nilai (misal: 75 <= nilai <= 100), atau mengecek kelayakan ganda (misal: nilai >= 75 AND kehadiran >= 80%).",
            langkah: [
                "Buka kategori Logic di toolbox.",
                "Tarik blok operasi logika ke kanvas.",
                "Pilih operator 'and' (keduanya wajib Benar) atau 'or' (salah satu cukup Benar).",
                "Colokkan kondisi boolean pertama di slot kiri dan kondisi boolean kedua di slot kanan."
            ],
            contoh: {
                deskripsi: "Memeriksa apakah nilai siswa berada dalam rentang wajar 0 sampai 100. Gambar di bawah membandingkan operator AND (keduanya harus Benar) dan OR (salah satu cukup Benar).",
                gambar: [
                    { src: "logic-and.png", caption: "Operasi Logika AND: Benar hanya jika kedua syarat bernilai True" },
                    { src: "logic-or.png", caption: "Operasi Logika OR: Benar jika salah satu syarat bernilai True" }
                ],
                python: "if nilai >= 0 and nilai <= 100:\n    print('Nilai Valid')"
            },
            opsi: null,
            kesalahanUmum: [
                "Salah memilih operator: memakai 'or' padahal kedua syarat harus sama-sama terpenuhi, atau sebaliknya."
            ],
            lihatJuga: ["logic_compare", "logic_negate"]
        },
        {
            id: "logic_negate",
            aliases: ["not", "bukan", "negasi", "tidak"],
            nama: "not (Pembalikan Logika)",
            kategori: "Logic",
            kategoriId: "logic",
            gambar: ["logic-negate-block.png", "logic-not.png"],
            fungsi: "Membalikkan nilai kebenaran: mengubah True menjadi False, dan False menjadi True.",
            kegunaan: "Memeriksa kondisi negatif, seperti 'selama BELUM selesai' atau 'jika list TIDAK kosong'.",
            langkah: [
                "Buka kategori Logic di toolbox.",
                "Tarik blok 'not' ke kanvas.",
                "Masukkan kondisi logika yang ingin dibalik nilainya ke dalam slot input 'not'."
            ],
            contoh: {
                deskripsi: "Mengecek apakah siswa tidak lulus (nilai di bawah 75). Pembalikan logika mengubah True menjadi False dan sebaliknya.",
                gambar: [
                    { src: "logic-not.png", caption: "Blok pembalik logika not menerima 1 input kondisi" },
                    { src: "logic-not-true.png", caption: "Contoh: not (True) mengevaluasi menjadi False" }
                ],
                python: "if not (nilai >= 75):\n    print('Remedial')"
            },
            opsi: null,
            kesalahanUmum: [
                "Menggunakan negasi berlebihan yang membuat logika kode sulit dibaca dan dipahami."
            ],
            lihatJuga: ["logic_boolean", "logic_compare"]
        },
        {
            id: "logic_boolean",
            aliases: ["true", "false", "benar", "salah", "boolean"],
            nama: "True / False (Konstanta Boolean)",
            kategori: "Logic",
            kategoriId: "logic",
            gambar: ["logic-boolean-block.png", "logic-true-false.png"],
            fungsi: "Menyediakan nilai kebenaran mutlak Benar (`True`) atau Salah (`False`).",
            kegunaan: "Menjadi nilai awal status saklar program, parameter bendera (flag), atau kondisi dasar perulangan.",
            langkah: [
                "Buka kategori Logic di toolbox.",
                "Tarik blok True/False ke kanvas.",
                "Pilih nilai 'TRUE' atau 'FALSE' dari dropdown menu.",
                "Pasangkan ke variabel atau slot logika."
            ],
            contoh: {
                deskripsi: "Menetapkan status awal saklar aplikasi aktif dengan memilih konstanta True dari dropdown.",
                gambar: [
                    { src: "logic-true-false.png", caption: "Dropdown menu untuk memilih nilai True atau False" }
                ],
                python: "berjalan = True"
            },
            opsi: null,
            kesalahanUmum: [
                "Mengetikkan teks string 'True' (dengan tanda kutip) yang bertipe data teks bukan tipe data boolean asli."
            ],
            lihatJuga: ["logic_compare", "controls_if"]
        }
    ]
};
