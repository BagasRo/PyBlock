export default function getProblems() {
    // Level 3 — Chain-based (2 soal per chain, kumulatif)
    // Konsep: Boolean, Perbandingan & Percabangan
    // Workspace TIDAK dibersihkan — output terakumulasi dari Level 1-2

    return [
        // =============================================
        // CHAIN 1 — Sistem Pencatatan Nilai Siswa
        // =============================================
        [
            // --- SOAL 5: If/Else kelulusan ---
            {
                id: "L3-C1-Q5",
                chainId: "C1",
                order: 5,
                task: `Tambahkan pengecekan status kelulusan. <strong>Tanpa menghapus blok sebelumnya</strong>, gunakan nilai yang sudah disimpan di variabel <code>nilai</code> untuk menentukan status: jika nilai ≥ 75 tampilkan <code>Status: Lulus</code>, jika tidak tampilkan <code>Status: Tidak Lulus</code>`,
                expectedOutput: "Selamat Datang di Aplikasi Pencatatan Nilai\nMencatat nilai untuk: Bagas\nNilai yang dicatat: 80\nNilai Bagas adalah 80\nStatus: Lulus",
                hints: [
                    "Program sekarang perlu mengambil keputusan berbeda berdasarkan kondisi tertentu — blok apa yang digunakan untuk percabangan?",
                    "Pastikan variabel yang dibandingkan adalah variabel nilai yang sudah disimpan sebelumnya, bukan angka yang ditulis langsung.",
                    "Periksa arah perbandingan: kondisi mana yang memicu \"Lulus\" dan kondisi mana yang memicu \"Tidak Lulus\"?"
                ],
                validateCode: async function(code, output, simulator) {
                    if (!code.includes('if ')) {
                        return { success: false, message: "❌ Kamu harus menggunakan blok percabangan (if/else)!" };
                    }
                    if (!code.includes('else')) {
                        return { success: false, message: "❌ Kamu harus menggunakan blok else untuk menangani kondisi \"Tidak Lulus\"!" };
                    }

                    // Test 1: Lulus (80 >= 75)
                    const out1 = await simulator.runSilentTest(code, ["Bagas", "80"]);
                    const expected1 = "Selamat Datang di Aplikasi Pencatatan Nilai\nMencatat nilai untuk: Bagas\nNilai yang dicatat: 80\nNilai Bagas adalah 80\nStatus: Lulus";
                    if (out1.trim() !== expected1) {
                        return { success: false, message: `❌ Jika nama="Bagas" dan nilai=80, output seharusnya:\n${expected1}\n\nTapi programmu menghasilkan:\n${out1.trim()}` };
                    }

                    // Test 2: Tidak Lulus (60 < 75)
                    const out2 = await simulator.runSilentTest(code, ["Ani", "60"]);
                    const expected2 = "Selamat Datang di Aplikasi Pencatatan Nilai\nMencatat nilai untuk: Ani\nNilai yang dicatat: 60\nNilai Ani adalah 60\nStatus: Tidak Lulus";
                    if (out2.trim() !== expected2) {
                        return { success: false, message: `❌ Jika nama="Ani" dan nilai=60, output seharusnya:\n${expected2}\n\nTapi programmu menghasilkan:\n${out2.trim()}` };
                    }

                    // Test 3: Edge case — tepat 75
                    const out3 = await simulator.runSilentTest(code, ["Cici", "75"]);
                    if (!out3.trim().endsWith("Status: Lulus")) {
                        return { success: false, message: `❌ Jika nilai tepat 75 (≥75), baris terakhir seharusnya "Status: Lulus", tapi programmu menghasilkan:\n${out3.trim()}` };
                    }

                    return { success: true };
                }
            },

            // --- SOAL 6: If/Elif/Else kategori A/B/C ---
            {
                id: "L3-C1-Q6",
                chainId: "C1",
                order: 6,
                task: `Kembangkan blok if/else dari soal sebelumnya menjadi tiga kategori nilai yang lebih detail. <strong>Ubah</strong> blok percabangan yang sudah ada menjadi tiga cabang: nilai ≥ 90 → <code>Kategori: A</code>, nilai ≥ 75 → <code>Kategori: B</code>, selain itu → <code>Kategori: C</code>. Blok-blok lain tidak perlu diubah.`,
                expectedOutput: "Selamat Datang di Aplikasi Pencatatan Nilai\nMencatat nilai untuk: Bagas\nNilai yang dicatat: 80\nNilai Bagas adalah 80\nKategori: B",
                hints: [
                    "Blok if/else yang sudah ada tidak perlu dihapus — pikirkan cara menambahkan cabang ketiga pada blok percabangan yang sama.",
                    "Susun kondisi dari yang paling tinggi ke yang paling rendah — mengapa urutan ini penting?",
                    "Pastikan setiap cabang menampilkan teks \"Kategori:\" diikuti huruf yang sesuai, bukan kata \"Status\" seperti soal sebelumnya."
                ],
                validateCode: async function(code, output, simulator) {
                    if (!code.includes('if ')) {
                        return { success: false, message: "❌ Kamu harus menggunakan blok percabangan (if)!" };
                    }
                    if (!code.includes('elif ')) {
                        return { success: false, message: "❌ Kamu harus menggunakan blok else-if (elif) untuk menambahkan cabang ketiga!" };
                    }

                    // Test 1: Kategori A (95 >= 90)
                    const out1 = await simulator.runSilentTest(code, ["Rini", "95"]);
                    if (!out1.trim().endsWith("Kategori: A")) {
                        return { success: false, message: `❌ Jika nilai=95 (≥90), baris terakhir harus "Kategori: A", tapi programmu menghasilkan:\n${out1.trim()}` };
                    }

                    // Test 2: Kategori B (80, >=75 dan <90)
                    const out2 = await simulator.runSilentTest(code, ["Bagas", "80"]);
                    const expected2 = "Selamat Datang di Aplikasi Pencatatan Nilai\nMencatat nilai untuk: Bagas\nNilai yang dicatat: 80\nNilai Bagas adalah 80\nKategori: B";
                    if (out2.trim() !== expected2) {
                        return { success: false, message: `❌ Jika nama="Bagas" dan nilai=80, output seharusnya:\n${expected2}\n\nTapi programmu menghasilkan:\n${out2.trim()}` };
                    }

                    // Test 3: Kategori C (60, <75)
                    const out3 = await simulator.runSilentTest(code, ["Doni", "60"]);
                    if (!out3.trim().endsWith("Kategori: C")) {
                        return { success: false, message: `❌ Jika nilai=60 (<75), baris terakhir harus "Kategori: C", tapi programmu menghasilkan:\n${out3.trim()}` };
                    }

                    // Edge case: tepat 90 → A
                    const out4 = await simulator.runSilentTest(code, ["Eka", "90"]);
                    if (!out4.trim().endsWith("Kategori: A")) {
                        return { success: false, message: `❌ Jika nilai tepat 90, seharusnya "Kategori: A", tapi programmu menghasilkan:\n${out4.trim()}` };
                    }

                    // Edge case: tepat 75 → B
                    const out5 = await simulator.runSilentTest(code, ["Fani", "75"]);
                    if (!out5.trim().endsWith("Kategori: B")) {
                        return { success: false, message: `❌ Jika nilai tepat 75, seharusnya "Kategori: B", tapi programmu menghasilkan:\n${out5.trim()}` };
                    }

                    return { success: true };
                }
            }
        ]
    ];
}
