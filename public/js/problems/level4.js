export default function getProblems() {
    // Level 4 — Chain-based (2 soal per chain, kumulatif)
    // Konsep: Perulangan (Loops)
    // Soal 7-8 melibatkan RESTRUKTURISASI blok — blok dipindah ke dalam loop

    return [
        // =============================================
        // CHAIN 1 — Sistem Pencatatan Nilai Siswa
        // =============================================
        [
            // --- SOAL 7: For loop (count with) ---
            {
                id: "L4-C1-Q7",
                chainId: "C1",
                order: 7,
                task: `Ubah program agar dapat mencatat nilai <strong>tiga siswa</strong> sekaligus secara otomatis menggunakan perulangan. Blok <code>print "Selamat Datang..."</code> tetap di luar perulangan (cukup tampil sekali). <strong>Pindahkan</strong> blok input, variabel, cetak ringkasan, dan pengecekan kategori ke dalam blok perulangan yang berjalan 3 kali. Hapus blok <code>Nilai yang dicatat:</code> karena sudah terwakili oleh baris ringkasan. Tambahkan label urutan siswa di awal setiap putaran dengan format: <code>Siswa ke-[urutan]:</code>`,
                expectedOutput: "Selamat Datang di Aplikasi Pencatatan Nilai\nSiswa ke-1:\nMencatat nilai untuk: Ali\nNilai Ali adalah 70\nKategori: C\nSiswa ke-2:\nMencatat nilai untuk: Budi\nNilai Budi adalah 85\nKategori: B\nSiswa ke-3:\nMencatat nilai untuk: Cici\nNilai Cici adalah 90\nKategori: A",
                hints: [
                    "Perulangan jenis apa yang paling sesuai saat kamu sudah tahu persis berapa kali harus berulang?",
                    "Perhatikan bahwa blok sambutan cukup tampil sekali di awal — posisikan blok tersebut di luar (sebelum) blok perulangan.",
                    "Variabel penghitung dari blok perulangan bisa langsung digunakan untuk menampilkan \"Siswa ke-1:\", \"Siswa ke-2:\", dan seterusnya — tidak perlu membuat variabel penghitung baru secara manual."
                ],
                validateCode: async function(code, output, simulator) {
                    if (!code.includes('for ') && !code.includes('while ')) {
                        return { success: false, message: "❌ Kamu harus menggunakan blok perulangan (Loops) untuk menyelesaikan soal ini!" };
                    }
                    if (!code.includes('if ') || !code.includes('elif ')) {
                        return { success: false, message: "❌ Blok percabangan if/elif/else dari soal sebelumnya harus tetap ada di dalam perulangan!" };
                    }
                    if (!code.includes('input(')) {
                        return { success: false, message: "❌ Blok input harus ada di dalam perulangan untuk membaca data setiap siswa!" };
                    }

                    // Test: 3 siswa dengan nilai berbeda (A, B, C)
                    const out1 = await simulator.runSilentTest(code, ["Ali", "70", "Budi", "85", "Cici", "90"]);
                    const expected1 = [
                        "Selamat Datang di Aplikasi Pencatatan Nilai",
                        "Siswa ke-1:",
                        "Mencatat nilai untuk: Ali",
                        "Nilai Ali adalah 70",
                        "Kategori: C",
                        "Siswa ke-2:",
                        "Mencatat nilai untuk: Budi",
                        "Nilai Budi adalah 85",
                        "Kategori: B",
                        "Siswa ke-3:",
                        "Mencatat nilai untuk: Cici",
                        "Nilai Cici adalah 90",
                        "Kategori: A"
                    ].join("\n");

                    if (out1.trim() !== expected1) {
                        return { success: false, message: `❌ Dengan input 3 siswa (Ali/70, Budi/85, Cici/90), output seharusnya:\n${expected1}\n\nTapi programmu menghasilkan:\n${out1.trim()}` };
                    }

                    // Test 2: verifikasi dengan nilai berbeda
                    const out2 = await simulator.runSilentTest(code, ["Dina", "95", "Eko", "74", "Fani", "80"]);
                    const lines2 = out2.trim().split("\n");

                    // Cek "Selamat Datang" hanya muncul sekali
                    const welcomeCount = lines2.filter(l => l.includes("Selamat Datang")).length;
                    if (welcomeCount !== 1) {
                        return { success: false, message: `❌ Pesan "Selamat Datang..." harus muncul tepat 1 kali (di luar loop), tapi muncul ${welcomeCount} kali.` };
                    }

                    // Cek kategori benar
                    if (!out2.includes("Kategori: A")) {
                        return { success: false, message: "❌ Siswa dengan nilai 95 seharusnya mendapat \"Kategori: A\"." };
                    }
                    if (!out2.includes("Kategori: C")) {
                        return { success: false, message: "❌ Siswa dengan nilai 74 seharusnya mendapat \"Kategori: C\"." };
                    }

                    return { success: true };
                }
            },

            // --- SOAL 8: While loop + sentinel ---
            {
                id: "L4-C1-Q8",
                chainId: "C1",
                order: 8,
                task: `Terkadang kita tidak tahu pasti berapa jumlah siswa yang akan dicatat. <strong>Hapus</strong> blok perulangan <code>count with</code> dari soal sebelumnya dan ganti dengan perulangan <code>repeat while</code>.<br><br>Buat variabel <code>lanjut</code> dan beri nilai awal angka <strong>1</strong> tepat sebelum perulangan dimulai. Atur agar loop terus berjalan <strong>selama <code>lanjut</code> sama dengan 1</strong>. Di bagian paling akhir di dalam loop, tanyakan kepada pengguna: <code>Tambah data? (1=Ya, 0=Tidak): </code> menggunakan blok pembaca angka, lalu simpan hasilnya ke variabel <code>lanjut</code>.`,
                expectedOutput: "Selamat Datang di Aplikasi Pencatatan Nilai\nSiswa ke-1:\nMencatat nilai untuk: Ali\nNilai Ali adalah 70\nKategori: C\nSiswa ke-2:\nMencatat nilai untuk: Budi\nNilai Budi adalah 85\nKategori: B",
                hints: [
                    "Perulangan while membutuhkan \"saklar\" untuk menyala dan mati. Variabel lanjut adalah saklarnya. Pastikan saklar dalam keadaan \"menyala\" (diisi angka 1) sebelum memasuki loop.",
                    "Gunakan operator pembanding sama dengan (=) untuk mengecek apakah lanjut adalah 1.",
                    "Pertanyaan \"Tambah data?\" berfungsi untuk memperbarui status saklar. Jika blok ini tidak diletakkan di dalam loop, programmu tidak akan pernah berhenti!"
                ],
                validateCode: async function(code, output, simulator) {
                    if (!code.includes('while ')) {
                        return { success: false, message: "❌ Soal ini mengharuskan kamu menggunakan blok perulangan while (repeat while)!" };
                    }
                    if (!code.includes('if ') || !code.includes('elif ')) {
                        return { success: false, message: "❌ Blok percabangan if/elif/else harus tetap ada di dalam perulangan while!" };
                    }
                    if (!code.includes('input(')) {
                        return { success: false, message: "❌ Kamu harus menggunakan blok input untuk membaca data siswa dan konfirmasi lanjut!" };
                    }

                    // Test 1: 2 siswa (lanjut=1, lanjut=0)
                    // Input order per iterasi: nama, nilai, lanjut
                    const out1 = await simulator.runSilentTest(code, ["Ali", "70", "1", "Budi", "85", "0"]);
                    const expected1 = [
                        "Selamat Datang di Aplikasi Pencatatan Nilai",
                        "Siswa ke-1:",
                        "Mencatat nilai untuk: Ali",
                        "Nilai Ali adalah 70",
                        "Kategori: C",
                        "Siswa ke-2:",
                        "Mencatat nilai untuk: Budi",
                        "Nilai Budi adalah 85",
                        "Kategori: B"
                    ].join("\n");

                    if (out1.trim() !== expected1) {
                        return { success: false, message: `❌ Dengan 2 siswa (Ali/70 lanjut, Budi/85 stop), output seharusnya:\n${expected1}\n\nTapi programmu menghasilkan:\n${out1.trim()}` };
                    }

                    // Test 2: 1 siswa saja (langsung stop)
                    const out2 = await simulator.runSilentTest(code, ["Cici", "90", "0"]);
                    const expected2 = [
                        "Selamat Datang di Aplikasi Pencatatan Nilai",
                        "Siswa ke-1:",
                        "Mencatat nilai untuk: Cici",
                        "Nilai Cici adalah 90",
                        "Kategori: A"
                    ].join("\n");

                    if (out2.trim() !== expected2) {
                        return { success: false, message: `❌ Dengan 1 siswa (Cici/90 lalu stop), output seharusnya:\n${expected2}\n\nTapi programmu menghasilkan:\n${out2.trim()}` };
                    }

                    // Test 3: 3 siswa — pastikan counter naik dengan benar
                    const out3 = await simulator.runSilentTest(code, ["X", "50", "1", "Y", "100", "1", "Z", "75", "0"]);
                    const lines3 = out3.trim().split("\n");
                    if (!lines3.some(l => l.includes("Siswa ke-3:"))) {
                        return { success: false, message: "❌ Dengan 3 siswa, baris \"Siswa ke-3:\" harus muncul. Pastikan variabel penghitung bertambah di setiap iterasi!" };
                    }
                    if (!out3.includes("Kategori: C") || !out3.includes("Kategori: A") || !out3.includes("Kategori: B")) {
                        return { success: false, message: "❌ Pengecekan kategori tidak berfungsi dengan benar untuk ketiga siswa." };
                    }

                    return { success: true };
                }
            }
        ]
    ];
}
