/**
 * Panduan Blockly — Kategori Variables
 * Berisi blok: variables_set, variables_get
 */
export default {
    id: "variables",
    nama: "Variables",
    deskripsi: "Blok untuk membuat tempat penyimpanan data sementara dan mengambil isinya.",
    warna: "#FF8C1A",
    icon: "📦",
    entries: [
        {
            id: "variables_set",
            aliases: ["set", "set_variable", "simpan_variabel", "isi_variabel"],
            nama: "set [variabel] to (Simpan Nilai ke Variabel)",
            kategori: "Variables",
            kategoriId: "variables",
            gambar: ["variable-set-block.png", "variables-set.png"],
            fungsi: "Menyimpan atau memperbarui data (teks, angka, hasil hitung, list) ke dalam suatu variabel bernama.",
            kegunaan: "Menyimpan data siswa (nama, nilai), mencatat status saklar perulangan (`lanjut = 1`), atau menyimpan hasil penjumlahan akumulatif.",
            langkah: [
                "Buka kategori Variables di toolbox.",
                "Jika variabel belum ada, klik 'Create variable...' lalu ketikkan nama variabel (misal: 'nama', 'nilai', atau 'lanjut').",
                "Tarik blok 'set [variabel] to' ke kanvas workspace.",
                "Pilih nama variabel dari menu dropdown jika ingin mengganti target variabel.",
                "Pasangkan nilai yang ingin disimpan (bisa berupa teks, input, angka, atau ekspresi matematika) ke slot sebelah kanan."
            ],
            contoh: {
                deskripsi: "Menyimpan nilai awal ke dalam variabel bernama. Pada ilustrasi di bawah, kamu juga dapat melihat cara memperbarui dan menambah nilai variabel secara bertahap (increment).",
                gambar: [
                    { src: "variables-set.png", caption: "Menetapkan nilai ke variabel item" },
                    { src: "variables-change.png", caption: "Mengubah nilai variabel dengan menambahkan nilai tertentu" },
                    { src: "variables-increment.png", caption: "Operasi penambahan nilai akumulatif pada variabel" }
                ],
                python: "lanjut = 1"
            },
            opsi: null,
            kesalahanUmum: [
                "Membalik posisi: mencoba memasang variabel di kanan dan nilai di kiri.",
                "Salah memilih nama variabel di dropdown sehingga data tertukar (misal nama tersimpan ke variabel nilai)."
            ],
            lihatJuga: ["variables_get", "python_input", "read_number"]
        },
        {
            id: "variables_get",
            aliases: ["get", "get_variable", "ambil_variabel", "baca_variabel"],
            nama: "[variabel] (Ambil Nilai Variabel)",
            kategori: "Variables",
            kategoriId: "variables",
            gambar: ["variable-get-block.png", "variables-get.png"],
            fungsi: "Mengambil kembali data yang tersimpan di dalam variabel untuk digunakan pada instruksi lain.",
            kegunaan: "Mencetak isi variabel ke layar, membandingkan nilainya dalam percabangan `if`, atau memakainya dalam rumus matematika.",
            langkah: [
                "Buka kategori Variables di toolbox.",
                "Cari blok lonjong oranye bertuliskan nama variabelmu (misal 'nama' atau 'nilai').",
                "Tarik blok tersebut dan pasangkan ke slot target yang membutuhkan nilai (misal slot print, slot kondisi if, atau slot perbandingan logic)."
            ],
            contoh: {
                deskripsi: "Mengambil data yang tersimpan di dalam variabel. Klik nama variabel untuk memilih dari daftar dropdown variabel yang sudah dibuat.",
                gambar: [
                    { src: "variables-get.png", caption: "Blok variabel get untuk mengambil isi variabel" },
                    { src: "variables-dropdown.png", caption: "Menu dropdown untuk memilih atau mengganti variabel yang ingin diambil" },
                    { src: "variables-example.png", caption: "Contoh pemakaian variabel get di dalam blok print" }
                ],
                python: "if nilai >= 75:\n    print('Status: Lulus')"
            },
            opsi: null,
            kesalahanUmum: [
                "Mengambil variabel sebelum variabel tersebut pernah diisi nilai dengan 'set to' (akan memicu NameError di Python).",
                "Mencoba mengganti nama variabel langsung di blok get tanpa mengubah definisi variabelnya."
            ],
            lihatJuga: ["variables_set", "text_print", "logic_compare"]
        }
    ]
};
