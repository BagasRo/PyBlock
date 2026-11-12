/**
 * Panduan Blockly — Kategori Text
 * Berisi blok: text, text_join (dengan Mutator ⚙️), convert_to_string, python_comment
 */
export default {
    id: "text",
    nama: "Text",
    deskripsi: "Blok untuk mengolah tulisan, karakter, kata, dan kalimat string.",
    warna: "#A65C81",
    icon: "📝",
    entries: [
        {
            id: "text",
            aliases: ["string", "tulisan", "teks", "kata"],
            nama: "\" \" (Konstanta Teks / String)",
            kategori: "Text",
            kategoriId: "text",
            gambar: ["text-block.png", "text-text.png"],
            fungsi: "Menyimpan konstanta teks tetap diapit oleh tanda kutip ganda atau tunggal.",
            kegunaan: "Menuliskan kata, kalimat, judul, label output, atau simbol seperti 'Lulus', 'Ali', 'Status: ', atau ' adalah '.",
            langkah: [
                "Buka kategori Text di toolbox.",
                "Tarik blok teks berwana ungu kemerahan dengan tanda petik \" \".",
                "Klik di dalam kotak teks blok tersebut dan ketikkan kata/kalimat yang kamu inginkan.",
                "Colokkan ke slot yang menerima tipe data string, seperti slot print atau input join."
            ],
            contoh: {
                deskripsi: "Menyimpan teks string di dalam tanda kutip untuk dicetak ke layar.",
                gambar: [
                    { src: "text-text.png", caption: "Blok teks string: tempat mengetikkan tulisan atau kalimat" }
                ],
                python: "print('Status: Lulus')"
            },
            opsi: null,
            kesalahanUmum: [
                "Mengetik spasi yang kurang pada label gabungan (misal 'Nilai' bukan 'Nilai ' sehingga kata menjadi menempel rapat 'NilaiAli').",
                "Mengira angka di dalam tanda kutip '75' bisa langsung dijumlahkan dengan angka matematika tanpa dikonversi."
            ],
            lihatJuga: ["text_join", "convert_to_string", "text_print"]
        },
        {
            id: "text_join",
            aliases: ["create_text_with", "join_text", "gabung_teks", "rangkai_teks"],
            nama: "create text with (Gabung Teks — Mutator ⚙️)",
            kategori: "Text",
            kategoriId: "text",
            gambar: ["text-join-block.png", "text-create.png"],
            fungsi: "Menggabungkan beberapa penggalan teks, angka, atau isi variabel menjadi satu kalimat string utuh yang rapi.",
            kegunaan: "Membuat kalimat ringkasan data, seperti 'Nilai Ali adalah 85', menggabungkan nama depan dan belakang, atau menyusun laporan hasil siswa.",
            langkah: [
                "Tarik blok 'create text with' dari kategori Text.",
                "Pasang potongan teks pertama di slot teratas (item 0), dan teks/variabel kedua di slot berikutnya (item 1).",
                "Jika membutuhkan lebih dari 2 komponen (misal butuh 4 slot), gunakan menu pengaturan roda gigi ⚙️ di pojok kiri atas blok.",
                "Colokkan output blok gabungan ini ke dalam blok print atau variabel penampung teks."
            ],
            contoh: {
                deskripsi: "Menggabungkan 4 komponen: teks 'Nilai ', variabel nama, teks ' adalah ', dan variabel nilai menjadi satu kalimat utuh.",
                gambar: [
                    { src: "text-create.png", caption: "Blok create text with: menghubungkan beberapa slot teks menjadi satu kalimat" }
                ],
                python: "print(''.join([str(x) for x in ['Nilai ', nama, ' adalah ', nilai]]))"
            },
            opsi: {
                judul: "Opsi Pengaturan (⚙️ Mutator Menambah Slot)",
                deskripsi: "Secara default blok ini hanya menyediakan 2 slot input. Kamu bisa menambah slot menjadi 3, 4, atau lebih sesuai kebutuhan kalimat.",
                langkah: [
                    {
                        nomor: 1,
                        judul: "Blok Awal",
                        penjelasan: "Tampilan standar blok create text with saat pertama kali ditarik memiliki dua slot colokan item.",
                        gambar: "text-mutator-1.png"
                    },
                    {
                        nomor: 2,
                        judul: "Klik Ikon Roda Gigi ⚙️",
                        penjelasan: "Klik ikon roda gigi kecil di sudut kiri atas blok. Jendela mini popup mutator akan terbuka untuk menambah slot.",
                        gambar: "text-create-modify.png"
                    },
                    {
                        nomor: 3,
                        judul: "Seret Bagian Tambahan (Item)",
                        penjelasan: "Tarik blok 'item' dari kotak sebelah kiri dan colokkan ke bagian bawah tumpukan 'item' di panel kanan sebanyak slot yang kamu perlukan.",
                        gambar: "text-create-modify.png"
                    },
                    {
                        nomor: 4,
                        judul: "Hasil Akhir & Kode Python",
                        penjelasan: "Klik kembali ikon roda gigi ⚙️ untuk menutup jendela pengaturan. Blok di workspace kini memiliki slot input tambahan yang siap diisi komponen kalimat.",
                        gambar: "text-create.png",
                        python: "# Menghasilkan penggabungan 4 komponen sekaligus\nprint(''.join([str(x) for x in ['Nilai ', nama, ' adalah ', nilai]]))"
                    }
                ]
            },
            kesalahanUmum: [
                "Lupa memberi spasi di akhir atau awal teks konstanta pemisah, misalnya menulis 'Nilai' dan 'adalah' sehingga outputnya menjadi 'NilaiAliadalah85'.",
                "Menyisakan slot kosong tanpa blok terpasang di dalamnya."
            ],
            lihatJuga: ["text", "convert_to_string", "variables_get"]
        },
        {
            id: "convert_to_string",
            aliases: ["str", "to_string", "konversi_string", "ubah_ke_teks"],
            nama: "str() / to string (Konversi ke Teks)",
            kategori: "Text",
            kategoriId: "text",
            gambar: ["convert-to-string-block.png"],
            fungsi: "Mengubah tipe data angka (integer / float) atau boolean menjadi bentuk teks string yang aman disambung.",
            kegunaan: "Mencegah error 'TypeError: can only concatenate str to str' saat menyambungkan angka dengan teks di bahasa Python.",
            langkah: [
                "Buka kategori Text di toolbox.",
                "Tarik blok 'str()' atau 'convert to string'.",
                "Masukkan blok angka, variabel nilai, atau operasi hitung ke dalam slotnya.",
                "Hubungkan hasilnya ke blok print atau penyambung teks."
            ],
            contoh: {
                deskripsi: "Mengubah variabel nilai 85 menjadi teks '85' untuk disambung dengan tanda tambah (+).",
                python: "print('Nilai yang dicatat: ' + str(nilai))"
            },
            opsi: null,
            kesalahanUmum: [
                "Menyambungkan teks langsung dengan variabel angka menggunakan operator '+' tanpa blok str() di Python murni."
            ],
            lihatJuga: ["text", "text_join", "math_number"]
        },
        {
            id: "python_comment",
            aliases: ["comment", "komentar", "catatan", "pagar"],
            nama: "# Komentar (Catatan Program)",
            kategori: "Text",
            kategoriId: "text",
            gambar: ["comment-block.png"],
            fungsi: "Menyematkan baris teks catatan di antara blok program yang akan diabaikan oleh mesin eksekusi Python.",
            kegunaan: "Memberi keterangan fungsi kode, mencatat nama pembuat, atau menandai bagian program agar mudah dipahami siswa.",
            langkah: [
                "Tarik blok '# komentar' dari kategori Text.",
                "Ketik catatan penjelasan pada kolom isian.",
                "Letakkan di atas atau di antara blok logika yang ingin kamu jelaskan."
            ],
            contoh: {
                deskripsi: "Menuliskan dokumentasi penanda inisialisasi variabel.",
                python: "# Inisialisasi variabel awal\nlanjut = 1"
            },
            opsi: null,
            kesalahanUmum: [
                "Mengetikkan perintah kode yang ingin dijalankan di dalam blok komentar (ingat: komentar tidak pernah dieksekusi oleh Python)."
            ],
            lihatJuga: ["intro_workspace"]
        }
    ]
};
