export default function getProblems() {
    // Level 1 — Chain-based (2 soal per chain, kumulatif)
    // Konsep: Output, Teks & Input
    // Workspace TIDAK dibersihkan antar soal — output terakumulasi

    return [
        // =============================================
        // CHAIN 1 — Sistem Pencatatan Nilai Siswa
        // =============================================
        [
            // --- SOAL 1: Print teks statis ---
            {
                id: "L1-C1-Q1",
                chainId: "C1",
                order: 1,
                task: `Buat program pembuka aplikasi pencatatan nilai. Tampilkan tulisan "Selamat Datang di Aplikasi Pencatatan Nilai" menggunakan satu blok cetak`,
                expectedOutput: "Selamat Datang di Aplikasi Pencatatan Nilai",
                hints: [
                    "Pikirkan blok apa yang digunakan untuk menampilkan teks ke layar.",
                    "Perhatikan bahwa teks yang ditampilkan harus sama persis dengan yang diminta, termasuk huruf kapital dan spasi.",
                    "Pastikan blok teks sudah terhubung ke blok cetak, bukan berdiri sendiri di area kerja."
                ],
                validateCode: function(code, output) {
                    if (!code.includes('print(')) {
                        return { success: false, message: "❌ Kamu harus menggunakan blok cetak (print) untuk menampilkan teks ke layar!" };
                    }
                    if (output.trim() !== this.expectedOutput) {
                        return { success: false, message: "❌ Teks yang ditampilkan harus sama persis: \"Selamat Datang di Aplikasi Pencatatan Nilai\"" };
                    }
                    return { success: true };
                }
            },

            // --- SOAL 2: Input nama + text join (kumulatif) ---
            {
                id: "L1-C1-Q2",
                chainId: "C1",
                order: 2,
                task: `Tambahkan fitur pencatatan nama siswa. <strong>Tanpa menghapus blok sebelumnya</strong>, minta pengguna memasukkan nama siswa, lalu tampilkan konfirmasi pencatatan dengan format: <code>Mencatat nilai untuk: [nama]</code>`,
                expectedOutput: "Selamat Datang di Aplikasi Pencatatan Nilai\nMencatat nilai untuk: Bagas",
                hints: [
                    "Pikirkan blok mana yang dipakai untuk membaca masukan berupa teks dari pengguna, bukan angka.",
                    "Output yang diminta mengandung teks tetap dan teks dari pengguna dalam satu baris — pikirkan cara menggabungkan keduanya.",
                    "Periksa apakah blok sambutan dari soal sebelumnya masih ada dan masih terhubung dengan benar sebelum blok baru."
                ],
                validateCode: async function(code, output, simulator) {
                    if (!code.includes('print(')) {
                        return { success: false, message: "❌ Kamu harus menggunakan blok cetak (print)!" };
                    }
                    if (!code.includes('input(')) {
                        return { success: false, message: "❌ Kamu harus menggunakan blok read text untuk membaca nama siswa!" };
                    }

                    // Test 1
                    const out1 = await simulator.runSilentTest(code, ["Bagas"]);
                    const expected1 = "Selamat Datang di Aplikasi Pencatatan Nilai\nMencatat nilai untuk: Bagas";
                    if (out1.trim() !== expected1) {
                        return { success: false, message: `❌ Jika nama yang dimasukkan "Bagas", output seharusnya:\n${expected1}\n\nTapi programmu menghasilkan:\n${out1.trim()}` };
                    }

                    // Test 2 — nama berbeda untuk pastikan fleksibel
                    const out2 = await simulator.runSilentTest(code, ["Sari"]);
                    const expected2 = "Selamat Datang di Aplikasi Pencatatan Nilai\nMencatat nilai untuk: Sari";
                    if (out2.trim() !== expected2) {
                        return { success: false, message: `❌ Jika nama yang dimasukkan "Sari", output seharusnya:\n${expected2}\n\nTapi programmu menghasilkan:\n${out2.trim()}` };
                    }

                    return { success: true };
                }
            }
        ]
        // Chain 2, 3, dst. bisa ditambahkan di sini nanti
    ];
}