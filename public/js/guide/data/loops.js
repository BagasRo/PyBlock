/**
 * Panduan Blockly — Kategori Loops (Perulangan)
 * Berisi blok:
 * - controls_repeat_ext
 * - controls_whileUntil
 * - controls_for
 * - controls_forEach
 * - loop_range
 * - loop_doWhile
 * - loop_forEachChar
 * - loop_forEachIndex
 * - controls_flow_statements_break
 * - controls_flow_statements_continue
 */
export default {
    id: "loops",
    nama: "Loops",
    deskripsi: "Blok perulangan untuk mengulang serangkaian perintah secara efisien tanpa menulis ulang kode.",
    warna: "#5CA65C",
    icon: "🔁",
    entries: [
        {
            id: "controls_repeat_ext",
            aliases: ["repeat", "ulang_n_kali", "perulangan_kali"],
            nama: "repeat [N] times (Ulangi N Kali)",
            kategori: "Loops",
            kategoriId: "loops",
            gambar: ["repeat-ext-block.png"],
            fungsi: "Mengulang blok instruksi yang berada di dalam slot 'do' sebanyak angka putaran yang ditentukan.",
            kegunaan: "Mengulang tindakan sederhana yang jumlah putarannya sudah pasti dan tidak memerlukan variabel nomor urut.",
            langkah: [
                "Buka kategori Loops di toolbox.",
                "Tarik blok 'repeat ... times' ke kanvas.",
                "Tentukan angka jumlah pengulangan di slot input (misal angka 5).",
                "Masukkan blok-blok yang ingin diulang ke dalam rongga slot 'do'."
            ],
            contoh: {
                deskripsi: "Mencetak kalimat salam sebanyak 3 kali tanpa memerlukan variabel pencacah.",
                gambar: [
                    { src: "control-repeat.png", caption: "Susunan blok repeat: mengulang isi di dalam slot do sebanyak N kali" }
                ],
                python: "for count in range(3):\n    print('Semangat Pagi!')"
            },
            opsi: null,
            kesalahanUmum: [
                "Memasukkan angka 0 atau negatif yang menyebabkan isi loop tidak pernah berjalan.",
                "Menaruh perintah sambutan awal di dalam loop sehingga sambutan ikut tercetak berulang kali."
            ],
            lihatJuga: ["controls_for", "controls_whileUntil", "loop_range"]
        },
        {
            id: "controls_whileUntil",
            aliases: ["while", "repeat_while", "selama", "perulangan_kondisi"],
            nama: "repeat while / until (Perulangan Kondisi While)",
            kategori: "Loops",
            kategoriId: "loops",
            gambar: ["while-block.png"],
            fungsi: "Terus mengulang perintah selama kondisi pembanding bernilai Benar (while), atau berhenti saat kondisi terpenuhi (until).",
            kegunaan: "Mencatat data siswa yang jumlahnya tidak diketahui di awal secara dinamis, mengulang menu aplikasi, atau menunggu input berhenti dari pengguna.",
            langkah: [
                "Buat variabel saklar (misal: 'set lanjut to 1') tepat sebelum perulangan dimulai.",
                "Tarik blok 'repeat while' dan pasang perbandingan 'lanjut = 1' pada slot kondisi.",
                "Pindahkan rangkaian proses pencatatan siswa ke dalam slot 'do'.",
                "Di bagian paling akhir dalam loop 'do', pasang pertanyaan konfirmasi: 'set lanjut to read int (Tambah data? 1=Ya, 0=Tidak): '."
            ],
            contoh: {
                deskripsi: "Blok perulangan bersyarat memiliki dua mode yang dapat dipilih pada dropdown: 'while' (mengulang SELAMA kondisi True) dan 'until' (mengulang SAMPAI kondisi terpenuhi / berhenti saat True). Gambar di bawah membandingkan susunan kedua mode tersebut.",
                gambar: [
                    { src: "control-repeat-while.png", caption: "Mode Repeat While: isi loop dijalankan berulang kali selama kondisi bernilai Benar" },
                    { src: "control-repeat-until.png", caption: "Mode Repeat Until: isi loop dijalankan berulang kali sampai kondisi menjadi Benar" }
                ],
                python: "lanjut = 1\nwhile lanjut == 1:\n    nama = input('masukkan nama: ')\n    print('Mencatat: ' + str(nama))\n    lanjut = int(input('Tambah data? (1=Ya, 0=Tidak): '))"
            },
            opsi: null,
            kesalahanUmum: [
                "Lupa menyertakan pembacaan saklar 'lanjut' di bagian paling akhir loop, menyebabkan loop berjalan selamanya tanpa henti (Infinite Loop).",
                "Menaruh inisialisasi 'lanjut = 1' di dalam loop, sehingga nilai saklar selalu ter-reset ke 1 pada setiap putaran."
            ],
            lihatJuga: ["controls_for", "loop_doWhile", "controls_flow_statements_break"]
        },
        {
            id: "controls_for",
            aliases: ["count_with", "for_count", "ulang_hitung", "loop_for"],
            nama: "count with [i] from [1] to [N] by [1] (For Loop Pencacah)",
            kategori: "Loops",
            kategoriId: "loops",
            gambar: ["for-count-block.png"],
            fungsi: "Mengulang instruksi dengan variabel pencacah yang otomatis bertambah dari nilai awal hingga batas akhir.",
            kegunaan: "Mencatat tepat sejumlah N siswa (misal tepat 3 siswa), membuat nomor antrean, mencetak deret angka kelipatan.",
            langkah: [
                "Tarik blok 'count with' dari kategori Loops.",
                "Tentukan variabel pencacah (default: 'i').",
                "Atur nilai awal pada slot 'from' (misal 1), nilai akhir pada slot 'to' (misal 3), dan langkah kelipatan pada slot 'by' (misal 1).",
                "Pindahkan blok-blok yang ingin dijalankan ke dalam slot 'do'."
            ],
            contoh: {
                deskripsi: "Perulangan pencacah dapat berjalan maju (step positif) atau mundur (step negatif). Gambar pertama memperlihatkan pencacah maju dari 1 ke 10, sedangkan gambar kedua memperlihatkan pencacah mundur dari 10 turun ke 1 dengan kelipatan -1.",
                gambar: [
                    { src: "control-count-with.png", caption: "Pencacah maju: count with i from 1 to 10 by 1" },
                    { src: "control-for-each-down.png", caption: "Pencacah mundur: count with i from 10 down to 1 by -1" }
                ],
                python: "for i in range(1, 4, 1):\n    nama = input('masukkan nama: ')\n    print('Mencatat nilai untuk: ' + str(nama))"
            },
            opsi: null,
            kesalahanUmum: [
                "Lupa bahwa blok pesan sambutan cukup tampil sekali di awal, sehingga tidak boleh dimasukkan ke dalam slot 'do'.",
                "Memasukkan angka kelipatan 'by' bernilai 0."
            ],
            lihatJuga: ["loop_range", "controls_repeat_ext", "controls_forEach"]
        },
        {
            id: "controls_forEach",
            aliases: ["for_each", "untuk_setiap", "telusuri_list"],
            nama: "for each [item] in list (Perulangan Elemen List)",
            kategori: "Loops",
            kategoriId: "loops",
            gambar: ["for-each-block.png"],
            fungsi: "Mengambil dan memproses setiap data di dalam suatu List/Array secara otomatis dari awal hingga akhir.",
            kegunaan: "Menampilkan semua nama siswa dari daftar list, menghitung total nilai seluruh siswa, atau menyaring data kelulusan.",
            langkah: [
                "Tarik blok 'for each ... in list'.",
                "Tentukan nama variabel penampung sementara (misal 'item' atau 'siswa').",
                "Pasang variabel List di slot input list.",
                "Susun instruksi pengolahan di dalam slot 'do'."
            ],
            contoh: {
                deskripsi: "Mengambil setiap item di dalam list secara otomatis. Kamu juga dapat menyematkan perintah 'break' atau 'continue' di dalam loop untuk mengendalikan pengolahan elemen.",
                gambar: [
                    { src: "control-for-each.png", caption: "Susunan dasar for each in list untuk memproses setiap elemen list" },
                    { src: "control-for-each-break.png", caption: "Penerapan break di dalam for each: langsung menghentikan iterasi list saat kondisi terpenuhi" }
                ],
                python: "daftar = ['Ali', 'Budi', 'Cici']\nfor item in daftar:\n    print('Nama: ' + str(item))"
            },
            opsi: null,
            kesalahanUmum: [
                "Memasukkan variabel bertipe angka atau teks tunggal ke slot list (bukan tipe data List)."
            ],
            lihatJuga: ["lists_create_with", "loop_forEachChar", "loop_forEachIndex"]
        },
        {
            id: "loop_range",
            aliases: ["range", "loop_range", "for_range", "for_in_range"],
            nama: "for [i] in range(...) (Perulangan Fungsi Range)",
            kategori: "Loops",
            kategoriId: "loops",
            gambar: ["loop-range-block.png"],
            fungsi: "Perulangan pencacah angka menggunakan fungsi bawaan Python range() dengan 3 mode: (stop), (start, stop), atau (start, stop, step).",
            kegunaan: "Menjalankan perulangan sebanyak N kali, membuat deret angka, atau melangkah maju/mundur dengan kelipatan tertentu.",
            langkah: [
                "Tarik blok 'for ... in range' dari kategori Loops.",
                "Pilih mode range pada dropdown: (stop), (start, stop), atau (start, stop, step).",
                "Masukkan nilai batas pada slot yang tersedia.",
                "Catatan penting: Nilai batas stop tidak ikut dihitung (stop eksklusif).",
                "Susun blok yang ingin diulang di dalam slot 'do'."
            ],
            contoh: {
                deskripsi: "Mencetak angka 1 sampai 5 menggunakan range(1, 6).",
                python: "for i in range(1, 6):\n    print(i)"
            },
            opsi: null,
            kesalahanUmum: [
                "Mengira angka batas stop ikut diproses (misal range(1, 5) hanya berhenti di 4, gunakan range(1, 6) jika ingin sampai 5).",
                "Mengisi nilai step = 0 yang menyebabkan program error."
            ],
            lihatJuga: ["controls_for", "controls_repeat_ext", "loop_doWhile"]
        },
        {
            id: "loop_doWhile",
            aliases: ["loop_doWhile", "do_while", "do_until", "do_while_loop"],
            nama: "do ... while / until (Perulangan Do-While / Do-Until)",
            kategori: "Loops",
            kategoriId: "loops",
            gambar: ["loop-dowhile-block.png"],
            fungsi: "Menjalankan instruksi di dalam 'do' MINIMAL SATU KALI terlebih dahulu, baru kemudian memeriksa syarat perulangan di akhir.",
            kegunaan: "Meminta input data dari pengguna paling tidak satu kali sebelum menanyakan opsi 'Tambah data lagi?'.",
            langkah: [
                "Tarik blok 'do ... while / until' dari kategori Loops.",
                "Pilih mode pada dropdown: 'while' (ulang selama benar) atau 'until' (ulang sampai benar).",
                "Pasang perintah yang ingin dijalankan di slot 'do'.",
                "Pasang syarat kondisi boolean pada slot pembanding di bagian bawah blok."
            ],
            contoh: {
                deskripsi: "Membaca input minimal satu kali sebelum mengecek status lanjut.",
                python: "# do-while: isi dijalankan dulu, kondisi dicek di akhir\nwhile True:\n    nama = input('Nama: ')\n    lanjut = int(input('Lanjut? (1/0): '))\n    if not (lanjut == 1):\n        break"
            },
            opsi: null,
            kesalahanUmum: [
                "Mengira do-while sama persis dengan while biasa (perbedaan utama: do-while selalu mengeksekusi instruksi minimal 1 kali meskipun syarat bernilai False sejak awal)."
            ],
            lihatJuga: ["controls_whileUntil", "controls_flow_statements_break"]
        },
        {
            id: "loop_forEachChar",
            aliases: ["loop_forEachChar", "for_each_char", "for_char", "karakter_teks", "huruf_per_huruf"],
            nama: "for each character [k] in [teks] (Telusuri Karakter Teks)",
            kategori: "Loops",
            kategoriId: "loops",
            gambar: ["loop-foreach-char-block.png"],
            fungsi: "Mengambil dan memproses setiap huruf/karakter di dalam sebuah teks string satu demi satu (`for k in teks:`).",
            kegunaan: "Memeriksa apakah ada angka dalam penulisan nama, menghitung jumlah huruf vokal, membuat sandi atau enkripsi sederhana.",
            langkah: [
                "Tarik blok 'for each character ... in text' dari kategori Loops.",
                "Tentukan variabel penampung huruf (default: 'k').",
                "Pasang teks atau variabel string di slot input teks.",
                "Masukkan perintah pemrosesan huruf di dalam slot 'do'."
            ],
            contoh: {
                deskripsi: "Mencetak setiap huruf dari kata 'PYTHON' satu baris per huruf.",
                python: "for k in 'PYTHON':\n    print(k)"
            },
            opsi: null,
            kesalahanUmum: [
                "Memasukkan tipe angka numerik ke slot teks tanpa dikonversi dengan to str terlebih dahulu."
            ],
            lihatJuga: ["text", "controls_forEach", "loop_forEachIndex"]
        },
        {
            id: "loop_forEachIndex",
            aliases: ["loop_forEachIndex", "for_each_index", "for_index", "enumerate", "indeks_dan_item"],
            nama: "for each index [i], [item] in [list] (Indeks & Nilai)",
            kategori: "Loops",
            kategoriId: "loops",
            gambar: ["loop-foreach-index-block.png"],
            fungsi: "Menelusuri setiap elemen di dalam List sekaligus mencatat nomor urut/indeksnya menggunakan fungsi `enumerate` bawaan Python.",
            kegunaan: "Menampilkan daftar berperingkat (misal: '1. Ali', '2. Budi'), menandai posisi data siswa.",
            langkah: [
                "Tarik blok 'for each index ... in list' dari kategori Loops.",
                "Tentukan variabel indeks (default: 'i') dan variabel nilai (default: 'item').",
                "Pasang variabel List di slot input.",
                "Susun perintah tampilan di dalam slot 'do'."
            ],
            contoh: {
                deskripsi: "Mencetak nomor urut dan nama siswa dari sebuah list.",
                python: "for i, item in enumerate(daftar_nama):\n    print(str(i + 1) + '. ' + str(item))"
            },
            opsi: null,
            kesalahanUmum: [
                "Lupa bahwa indeks default Python dimulai dari 0 (tambahkan 1 jika ingin menampilkan nomor urut manusia 1, 2, 3).",
                "Menggunakan nama variabel yang sama untuk indeks dan item."
            ],
            lihatJuga: ["controls_forEach", "lists_create_with", "loop_forEachChar"]
        },
        {
            id: "controls_flow_statements_break",
            aliases: ["break_out_of_loop", "break", "hentikan_loop", "loop_break", "controls_flow_statements"],
            nama: "break out of loop (Hentikan & Keluar Perulangan)",
            kategori: "Loops",
            kategoriId: "loops",
            gambar: ["flow-statements-block.png"],
            fungsi: "Menghentikan perulangan saat ini seketika dan langsung melompat keluar ke baris kode setelah blok perulangan.",
            kegunaan: "Keluar dari pencarian data saat elemen yang dicari sudah ditemukan, membatasi perulangan tak terbatas saat target tercapai, atau menghentikan proses iterasi lebih awal.",
            langkah: [
                "Buka kategori Loops di toolbox.",
                "Tarik blok 'break out of loop' ke dalam kanvas.",
                "Pasangkan di dalam blok percabangan 'if' di dalam perulangan (while, for, atau for each).",
                "Pastikan menu dropdown pada blok memilih opsi 'break out of loop'."
            ],
            contoh: {
                deskripsi: "Menghentikan penelusuran list seketika ketika menemukan item 'beta'. Elemen setelahnya ('gamma') tidak akan diproses lagi.",
                gambar: [
                    { src: "control-for-each-break.png", caption: "Opsi break: perulangan langsung berhenti seketika saat kondisi terpenuhi" }
                ],
                python: "daftar = ['alpha', 'beta', 'gamma']\nfor letter in daftar:\n    if letter == 'beta':\n        break\n    print(letter)"
            },
            opsi: null,
            kesalahanUmum: [
                "Meletakkan break langsung di dalam loop tanpa dibungkus kondisi 'if', menyebabkan perulangan langsung berhenti di putaran pertama.",
                "Memasang blok break out of loop di luar blok perulangan (akan memicu peringatan error dari Blockly dan SyntaxError di Python)."
            ],
            lihatJuga: ["controls_flow_statements_continue", "controls_whileUntil", "controls_forEach", "controls_for"]
        },
        {
            id: "controls_flow_statements_continue",
            aliases: ["continue_with_next_iteration", "continue", "lewati_putaran", "lompati_iterasi", "loop_continue"],
            nama: "continue with next iteration (Lompati ke Putaran Berikutnya)",
            kategori: "Loops",
            kategoriId: "loops",
            gambar: ["flow-statements-continue.png"],
            fungsi: "Mengabaikan sisa instruksi di bawahnya pada putaran saat ini dan langsung melompat ke iterasi/putaran berikutnya.",
            kegunaan: "Menyaring data yang tidak diinginkan (misal melewati data kosong atau angka 0), mengabaikan elemen tertentu tanpa membatalkan seluruh perulangan.",
            langkah: [
                "Buka kategori Loops di toolbox.",
                "Tarik blok 'break out of loop' ke dalam kanvas.",
                "Pasangkan di dalam blok percabangan 'if' di dalam perulangan.",
                "Klik menu dropdown pada blok dan pilih opsi 'continue with next iteration of loop'."
            ],
            contoh: {
                deskripsi: "Melompati elemen 'beta' sehingga blok cetak di bawahnya diabaikan, lalu perulangan otomatis berlanjut ke elemen berikutnya ('gamma').",
                gambar: [
                    { src: "control-for-each-continue.png", caption: "Opsi continue: melewati 'beta' dan langsung lanjut memproses elemen 'gamma'" }
                ],
                python: "daftar = ['alpha', 'beta', 'gamma']\nfor letter in daftar:\n    if letter == 'beta':\n        continue\n    print(letter)"
            },
            opsi: null,
            kesalahanUmum: [
                "Pada loop while manual, jika pembaruan pencacah diletakkan setelah perintah continue, pencacah tidak bertambah dan memicu infinite loop.",
                "Memasang blok continue di luar perulangan (akan memicu SyntaxError di Python)."
            ],
            lihatJuga: ["controls_flow_statements_break", "controls_forEach", "controls_whileUntil", "controls_for"]
        }
    ]
};
