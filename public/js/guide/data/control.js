/**
 * Panduan Blockly — Kategori Control
 * Berisi blok: controls_if (dengan Mutator ⚙️), controls_ifelse
 */
export default {
    id: "control",
    nama: "Control",
    deskripsi: "Blok kendali alur eksekusi program untuk percabangan kondisi (if, elif, else).",
    warna: "#5C81A6",
    icon: "🔀",
    entries: [
        {
            id: "controls_if",
            aliases: ["if", "jika", "percabangan", "elif", "else_if", "kondisi"],
            nama: "if do (Percabangan Kondisi — Mutator ⚙️)",
            kategori: "Control",
            kategoriId: "control",
            gambar: ["if-block.png", "if-if.png"],
            fungsi: "Mengevaluasi suatu kondisi boolean: jika bernilai Benar (True), blok instruksi di dalam slot 'do' akan dijalankan.",
            kegunaan: "Membuat keputusan cerdas dalam program, seperti menentukan status kelulusan (nilai >= 75), memberikan hak akses, atau mengklasifikasikan predikat (A, B, C).",
            langkah: [
                "Buka kategori Control di toolbox.",
                "Tarik blok 'if do' ke kanvas.",
                "Pasang blok pembanding logika (misal 'nilai >= 75') ke slot kondisi 'if'.",
                "Pasang instruksi yang ingin dijalankan ketika kondisi terpenuhi ke dalam slot 'do' (misal print 'Status: Lulus').",
                "Jika membutuhkan cabang tambahan (else if atau else), gunakan ikon roda gigi ⚙️ di pojok kiri atas blok."
            ],
            contoh: {
                deskripsi: "Mengecek apakah siswa lulus KKM 75. Blok 'if' membaca hasil evaluasi dari blok perbandingan logika. Jika benar, kalimat kelulusan akan dicetak ke layar.",
                gambar: [
                    { src: "if-if.png", caption: "Susunan blok if do standar dengan satu syarat kondisi dan slot aksi do" },
                    { src: "if-modify.gif", caption: "Animasi Mutator ⚙️: Klik roda gigi untuk membuka jendela pengaturan dan menambah cabang" }
                ],
                python: "if nilai >= 75:\n    print('Status: Lulus')"
            },
            opsi: {
                judul: "Opsi Pengaturan (⚙️ Mutator Menambah Cabang)",
                deskripsi: "Secara default blok 'if' hanya memiliki 1 cabang syarat. Melalui menu mutator ⚙️, kamu dapat menambahkan cabang 'else if' (elif) untuk syarat bertingkat dan 'else' untuk kondisi default jika semua syarat tidak terpenuhi.",
                langkah: [
                    {
                        nomor: 1,
                        judul: "Blok Awal",
                        penjelasan: "Bentuk dasar blok kontrol 'if do' hanya memiliki 1 slot kondisi 'if' dan 1 slot aksi 'do'.",
                        gambar: "if-mutator-1.png"
                    },
                    {
                        nomor: 2,
                        judul: "Klik Ikon Roda Gigi ⚙️",
                        penjelasan: "Klik ikon roda gigi kecil berwarna biru di pojok kiri atas blok 'if'. Panel pengaturan mutator akan terbuka untuk mengubah bentuk blok.",
                        gambar: [
                            { src: "if-mutator-2.png", caption: "Jendela pengaturan mutator terbuka" },
                            { src: "if-modify.gif", caption: "Animasi cara membuka & menambah cabang" }
                        ]
                    },
                    {
                        nomor: 3,
                        judul: "Seret Bagian Tambahan (else if / else)",
                        penjelasan: "Tarik blok 'else if' dari panel kiri ke dalam tumpukan blok 'if' di panel kanan untuk menambah kondisi kedua. Jika ingin cabang terakhir, tarik blok 'else' ke bagian paling bawah.",
                        gambar: [
                            { src: "if-mutator-3.png", caption: "Menyeret else if ke dalam tumpukan mutator" },
                            { src: "if-else-if.png", caption: "Hasil penambahan cabang else if" }
                        ]
                    },
                    {
                        nomor: 4,
                        judul: "Hasil Akhir & Kode Python",
                        penjelasan: "Klik kembali ikon roda gigi ⚙️ untuk menutup jendela pengaturan. Blok 'if' kini memiliki cabang 'else if' dan 'else' lengkap di kanvas.",
                        gambar: [
                            { src: "if-mutator-4.png", caption: "Bentuk blok if else if else di kanvas" },
                            { src: "if-else-if-else.png", caption: "Susunan blok lengkap dengan kondisi bertingkat" }
                        ],
                        python: "if nilai >= 90:\n    print('Kategori: A')\nelif nilai >= 75:\n    print('Kategori: B')\nelse:\n    print('Kategori: C')"
                    }
                ]
            },
            kesalahanUmum: [
                "Urutan kondisi terbalik: memeriksa `nilai >= 75` sebelum `nilai >= 90`, sehingga nilai 95 akan masuk ke kategori B terlebih dahulu sebelum sempat dicek di A.",
                "Menaruh blok perbandingan yang salah arah atau terbalik tanda pembandingnya."
            ],
            lihatJuga: ["controls_ifelse", "logic_compare", "logic_boolean"]
        },
        {
            id: "controls_ifelse",
            aliases: ["if_else", "jika_maka_jika_tidak", "percabangan_dua_arah"],
            nama: "if do else (Percabangan Dua Arah)",
            kategori: "Control",
            kategoriId: "control",
            gambar: ["if-else-block.png", "if-else.png"],
            fungsi: "Menjalankan aksi di slot 'do' jika kondisi Benar, atau menjalankan aksi di slot 'else' jika kondisi Salah.",
            kegunaan: "Menentukan kondisi biner (dua pilihan pasti), seperti Lulus vs Tidak Lulus, Genap vs Ganjil, atau Aktif vs Tidak Aktif.",
            langkah: [
                "Buka kategori Control di toolbox.",
                "Tarik blok 'if do else' ke kanvas.",
                "Pasang kondisi logika di slot 'if'.",
                "Pasang aksi jika Benar di slot 'do', dan aksi jika Salah di slot 'else'."
            ],
            contoh: {
                deskripsi: "Menentukan status kelulusan siswa secara lengkap (Lulus jika nilai >= 75, atau Tidak Lulus jika sebaliknya).",
                gambar: [
                    { src: "if-else.png", caption: "Susunan blok if do else: percabangan dua arah untuk kondisi Benar vs Salah" }
                ],
                python: "if nilai >= 75:\n    print('Status: Lulus')\nelse:\n    print('Status: Tidak Lulus')"
            },
            opsi: null,
            kesalahanUmum: [
                "Mengisi slot 'do' tetapi lupa mengisi slot 'else', sehingga saat siswa tidak lulus, program tidak menampilkan pesan apa pun.",
                "Salah meletakkan blok print (misal print 'Tidak Lulus' terpasang di dalam slot 'do')."
            ],
            lihatJuga: ["controls_if", "logic_compare"]
        }
    ]
};
