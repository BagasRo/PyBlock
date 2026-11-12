/**
 * Panduan Blockly — Kategori Lists
 * Berisi blok:
 * - lists_create_with (dengan Mutator ⚙️)
 * - lists_repeat
 * - lists_length
 * - lists_isEmpty
 * - lists_indexOf
 * - lists_getIndex
 * - lists_setIndex
 */
export default {
    id: "lists",
    nama: "Lists",
    deskripsi: "Blok untuk mengelola struktur data daftar / array yang memuat banyak nilai sekaligus.",
    warna: "#4A90E2",
    icon: "📋",
    entries: [
        {
            id: "lists_create_with",
            aliases: ["create_list_with", "list", "daftar", "buat_list", "array"],
            nama: "create list with (Buat Daftar / List — Mutator ⚙️)",
            kategori: "Lists",
            kategoriId: "lists",
            gambar: ["list-create-block.png", "list-create-list-with-item.png"],
            fungsi: "Membuat struktur data List (Array) yang dapat menampung beberapa item data dalam satu variabel.",
            kegunaan: "Menyimpan kumpulan nama siswa `['Ali', 'Budi', 'Cici']`, sekumpulan nilai ujian, daftar harga belanja, atau antrean data.",
            langkah: [
                "Buka kategori Lists di toolbox.",
                "Tarik blok 'create list with' ke kanvas.",
                "Colokkan item-item data (bisa berupa teks, angka, atau variabel) ke slot yang tersedia.",
                "Gunakan ikon roda gigi ⚙️ di pojok kiri atas untuk menambah atau mengurangi jumlah slot item.",
                "Simpan hasilnya ke dalam sebuah variabel dengan blok 'set [daftar] to'."
            ],
            contoh: {
                deskripsi: "Membuat list yang dapat diisi berbagai tipe data, seperti sekumpulan angka numerik atau kumpulan teks string.",
                gambar: [
                    { src: "list-create-list-with-item.png", caption: "Blok list dasar dengan elemen data awal" },
                    { src: "list-create-empty-list.png", caption: "List kosong tanpa elemen awal (panjang = 0)" },
                    { src: "list-create-list-with-numbers.png", caption: "List berisi kumpulan data angka" },
                    { src: "list-create-list-with-text.png", caption: "List berisi kumpulan data teks string" }
                ],
                python: "siswa = ['Ali', 'Budi', 'Cici']"
            },
            opsi: {
                judul: "Opsi Pengaturan (⚙️ Mutator Menambah Item List)",
                deskripsi: "Secara default blok ini menyediakan 3 slot item (atau 0 untuk list kosong). Kamu bisa menambah slot menjadi 4, 5, atau lebih sesuai banyaknya data yang ingin disimpan.",
                langkah: [
                    {
                        nomor: 1,
                        judul: "Blok Awal",
                        penjelasan: "Tampilan standar blok create list with memiliki slot colokan item bawaan.",
                        gambar: [
                            { src: "list-mutator-1.png", caption: "Bentuk blok create list with di kanvas" },
                            { src: "list-create-list-with-item.png", caption: "Blok list dengan item data" }
                        ]
                    },
                    {
                        nomor: 2,
                        judul: "Klik Ikon Roda Gigi ⚙️",
                        penjelasan: "Klik ikon roda gigi kecil di sudut kiri atas blok. Jendela konfigurasi mutator list akan terbuka untuk menambah atau mengurangi slot.",
                        gambar: "list-create-list-modify.gif"
                    },
                    {
                        nomor: 3,
                        judul: "Seret Bagian Tambahan (Item)",
                        penjelasan: "Tarik blok 'item' dari panel kiri dan colokkan ke bagian bawah tumpukan di panel kanan untuk menambah slot angka atau teks.",
                        gambar: "list-create-list-with-numbers.png"
                    },
                    {
                        nomor: 4,
                        judul: "Hasil Akhir & Kode Python",
                        penjelasan: "Klik kembali ikon roda gigi ⚙️ untuk menutup jendela pengaturan. Blok list kini memiliki jumlah slot sesuai yang kamu atur.",
                        gambar: "list-create-list-with-text.png",
                        python: "nilai_siswa = [70, 85, 90, 95]"
                    }
                ]
            },
            kesalahanUmum: [
                "Menyisakan slot kosong tanpa diisi blok apa pun di dalam list.",
                "Mengira indeks awal list dimulai dari 1 (di Python indeks list dimulai dari angka 0)."
            ],
            lihatJuga: ["lists_length", "lists_getIndex", "controls_forEach"]
        },
        {
            id: "lists_repeat",
            aliases: ["repeat_list", "isi_berulang", "list_repeat"],
            nama: "create list with item repeated [N] times (List Nilai Berulang)",
            kategori: "Lists",
            kategoriId: "lists",
            gambar: ["list-repeat-block.png"],
            fungsi: "Membuat sebuah List baru berisi N buah item yang semuanya bernilai sama persis.",
            kegunaan: "Menginisialisasi tabel skor dengan nilai awal 0, atau membuat daftar status 'Belum Selesai' untuk 10 siswa.",
            langkah: [
                "Tarik blok 'create list with item repeated'.",
                "Pasang nilai bawaan yang diinginkan di slot 'item' (misal angka 0).",
                "Pasang angka jumlah pengulangan di slot angka (misal 5)."
            ],
            contoh: {
                deskripsi: "Membuat list 5 elemen yang semuanya bernilai 0.",
                python: "skor = [0] * 5"
            },
            opsi: null,
            kesalahanUmum: [
                "Memasukkan angka pengulangan negatif yang memicu pembuatan list kosong."
            ],
            lihatJuga: ["lists_create_with", "math_number"]
        },
        {
            id: "lists_length",
            aliases: ["length", "len", "panjang_list", "jumlah_item"],
            nama: "length of [list] (Panjang List / Jumlah Elemen)",
            kategori: "Lists",
            kategoriId: "lists",
            gambar: ["list-length-block.png", "list-length.png"],
            fungsi: "Menghitung berapa banyak total item atau data yang tersimpan di dalam suatu List.",
            kegunaan: "Mengetahui jumlah siswa yang sudah terdaftar, menghitung pembagi rata-rata (total / len), atau menentukan batas loop perulangan.",
            langkah: [
                "Tarik blok 'length of' dari kategori Lists.",
                "Colokkan variabel list ke slot input.",
                "Gunakan hasilnya untuk dicetak atau dihitung di matematika."
            ],
            contoh: {
                deskripsi: "Menghitung total banyaknya elemen yang ada di dalam suatu list.",
                gambar: [
                    { src: "list-length.png", caption: "Blok length of menerima input variabel list" },
                    { src: "list-length2.png", caption: "Penerapan length of untuk mencetak jumlah total data di dalam list" }
                ],
                python: "print('Total siswa terdaftar: ' + str(len(daftar_siswa)))"
            },
            opsi: null,
            kesalahanUmum: [
                "Mengira panjang list sama dengan nomor indeks elemen terakhir (ingat: jika panjang list = 3, indeks elemen terakhir adalah 2 karena mulai dari 0)."
            ],
            lihatJuga: ["lists_create_with", "lists_isEmpty"]
        },
        {
            id: "lists_isEmpty",
            aliases: ["is_empty", "cek_kosong", "apakah_kosong"],
            nama: "is empty [list] (Cek Apakah List Kosong)",
            kategori: "Lists",
            kategoriId: "lists",
            gambar: ["list-empty-block.png", "list-empty.png"],
            fungsi: "Memeriksa apakah sebuah list tidak memiliki data sama sekali (panjangnya 0). Mengembalikan True jika kosong dan False jika ada isinya.",
            kegunaan: "Memvalidasi apakah pengguna sudah menginput data sebelum sistem menghitung nilai rata-rata, mencegah error pembagian dengan 0.",
            langkah: [
                "Tarik blok 'is empty' dari kategori Lists.",
                "Pasangkan variabel list ke slot input.",
                "Colokkan blok ini ke syarat 'if' pada percabangan kontrol."
            ],
            contoh: {
                deskripsi: "Mengecek apakah daftar siswa masih kosong sebelum diproses.",
                gambar: [
                    { src: "list-empty.png", caption: "Blok is empty mengembalikan True jika list kosong, dan False jika ada isinya" }
                ],
                python: "if not len(daftar_siswa):\n    print('Belum ada data siswa yang dicatat!')"
            },
            opsi: null,
            kesalahanUmum: [
                "Mencoba mengakses item pertama list sebelum memeriksa apakah list tersebut kosong atau tidak."
            ],
            lihatJuga: ["lists_length", "controls_if"]
        },
        {
            id: "lists_indexOf",
            aliases: ["index_of", "cari_posisi", "find_item", "posisi_item"],
            nama: "in list find first / last occurrence of item (Cari Posisi)",
            kategori: "Lists",
            kategoriId: "lists",
            gambar: ["list-indexof-block.png", "list-find-first1.png"],
            fungsi: "Mencari posisi nomor indeks kemunculan suatu data di dalam List.",
            kegunaan: "Mencari ranking siswa tertentu, mengetahui urutan antrean, atau mengecek apakah suatu nama sudah ada di dalam daftar.",
            langkah: [
                "Tarik blok 'in list find ...'.",
                "Pilih 'first' (kemunculan pertama) atau 'last' (kemunculan terakhir).",
                "Colokkan variabel list di slot pertama dan item yang dicari di slot kedua."
            ],
            contoh: {
                deskripsi: "Mencari posisi nomor indeks suatu elemen di dalam list. Kamu dapat memilih 'find first' (kemunculan pertama) atau 'find last' (kemunculan terakhir jika ada data ganda).",
                gambar: [
                    { src: "list-find-first1.png", caption: "Mencari posisi kemunculan pertama suatu item di dalam list" },
                    { src: "list-find-last.png", caption: "Mencari posisi kemunculan terakhir dari item yang bernilai sama" }
                ],
                python: "posisi = daftar_siswa.index('Budi') + 1"
            },
            opsi: null,
            kesalahanUmum: [
                "Item yang dicari ternyata tidak ada di dalam list (pada Python murni memicu ValueError jika tidak dicek terlebih dahulu dengan 'in')."
            ],
            lihatJuga: ["lists_getIndex", "lists_create_with"]
        },
        {
            id: "lists_getIndex",
            aliases: ["get_index", "ambil_item_list", "baca_elemen"],
            nama: "in list get # [i] (Ambil Nilai di Posisi Tertentu)",
            kategori: "Lists",
            kategoriId: "lists",
            gambar: ["list-getindex-block.png"],
            fungsi: "Mengambil data elemen list pada posisi urutan tertentu (pertama, terakhir, acak, atau nomor urut #).",
            kegunaan: "Mengambil nama juara 1 (posisi pertama), membaca nilai siswa terakhir, atau mengakses elemen berdasarkan nomor indeks.",
            langkah: [
                "Tarik blok 'in list get'.",
                "Pilih aksi 'get' atau 'get and remove'.",
                "Pilih posisi: '#', 'first', 'last', atau 'random'.",
                "Pasang variabel list dan nomor posisi indeksnya."
            ],
            contoh: {
                deskripsi: "Mengambil nama siswa pertama di dalam list.",
                python: "siswa_pertama = daftar_siswa[0]"
            },
            opsi: null,
            kesalahanUmum: [
                "Mengakses nomor indeks yang melebihi jumlah elemen list (IndexError: list index out of range)."
            ],
            lihatJuga: ["lists_setIndex", "lists_length"]
        },
        {
            id: "lists_setIndex",
            aliases: ["set_index", "ubah_item_list", "update_elemen", "sisip_item"],
            nama: "in list set # [i] as (Ubah / Sisipkan Nilai di Posisi)",
            kategori: "Lists",
            kategoriId: "lists",
            gambar: ["list-setindex-block.png", "list-set.png"],
            fungsi: "Mengubah (menimpa) atau menyisipkan nilai baru pada posisi urutan tertentu di dalam list.",
            kegunaan: "Memperbaiki salah ketik nama siswa, memperbarui nilai ujian setelah remedial, atau menyisipkan siswa baru ke posisi tertentu.",
            langkah: [
                "Tarik blok 'in list set # as'.",
                "Pilih 'set' (untuk menimpa) atau 'insert at' (untuk menyisipkan).",
                "Pilih posisi '#', 'first', atau 'last'.",
                "Pasang variabel list, nomor indeks, dan nilai baru yang ingin dimasukkan."
            ],
            contoh: {
                deskripsi: "Mengubah (menimpa) atau menyisipkan nilai baru pada posisi urutan tertentu di dalam list.",
                gambar: [
                    { src: "list-set.png", caption: "Blok in list set # as untuk memperbarui nilai elemen list pada posisi indeks tertentu" },
                    { src: "list-set-example.png", caption: "Contoh pembaruan nilai elemen list" },
                    { src: "list-print.png", caption: "Mencetak hasil list setelah elemen diperbarui ke layar" }
                ],
                python: "daftar_siswa[0] = 'Ahmad'"
            },
            opsi: null,
            kesalahanUmum: [
                "Menggunakan mode 'set' pada nomor indeks yang belum pernah ada (gunakan 'insert at' jika ingin menambah data baru)."
            ],
            lihatJuga: ["lists_getIndex", "lists_create_with"]
        }
    ]
};
