export default function getProblems() {
    // Level 2 — Chain-based (2 soal per chain, kumulatif)
    // Konsep: Variabel & Pengelolaan Data
    // Workspace TIDAK dibersihkan — output terakumulasi dari Level 1

    return [
        // =============================================
        // CHAIN 1 — Sistem Pencatatan Nilai Siswa
        // =============================================
        [
            // --- SOAL 3: Variabel + read int ---
            {
                id: "L2-C1-Q3",
                chainId: "C1",
                order: 3,
                task: `Simpan nilai ujian siswa ke dalam sebuah variabel. <strong>Tanpa menghapus blok sebelumnya</strong>, minta pengguna memasukkan nilai (angka bulat), simpan ke variabel <code>nilai</code>, lalu tampilkan: <code>Nilai yang dicatat: [nilai]</code>`,
                expectedOutput: "Selamat Datang di Aplikasi Pencatatan Nilai\nMencatat nilai untuk: Bagas\nNilai yang dicatat: 85",
                hints: [
                    "Pikirkan perbedaan blok untuk membaca teks dan membaca angka — mana yang tepat untuk nilai ujian?",
                    "Nilai yang dimasukkan perlu disimpan ke sebuah wadah bernama sebelum bisa ditampilkan — blok apa yang digunakan untuk itu?",
                    "Pastikan blok pembacaan angka tersambung ke blok pengisi variabel, bukan langsung ke blok cetak."
                ],
                validateCode: async function(code, output, simulator) {
                    if (!code.includes('=')) {
                        return { success: false, message: "❌ Kamu harus menggunakan variabel untuk menyimpan nilai! Gunakan menu Variables." };
                    }
                    if (!code.includes('int(input(')) {
                        return { success: false, message: "❌ Kamu harus menggunakan blok read int untuk membaca nilai angka!" };
                    }
                    if (!code.includes('str(')) {
                        return { success: false, message: "❌ Kamu harus menggunakan blok to str untuk mengubah angka menjadi teks sebelum digabungkan!" };
                    }

                    // Test 1
                    const out1 = await simulator.runSilentTest(code, ["Bagas", "85"]);
                    const expected1 = "Selamat Datang di Aplikasi Pencatatan Nilai\nMencatat nilai untuk: Bagas\nNilai yang dicatat: 85";
                    if (out1.trim() !== expected1) {
                        return { success: false, message: `❌ Jika nama="Bagas" dan nilai=85, output seharusnya:\n${expected1}\n\nTapi programmu menghasilkan:\n${out1.trim()}` };
                    }

                    // Test 2
                    const out2 = await simulator.runSilentTest(code, ["Ani", "92"]);
                    const expected2 = "Selamat Datang di Aplikasi Pencatatan Nilai\nMencatat nilai untuk: Ani\nNilai yang dicatat: 92";
                    if (out2.trim() !== expected2) {
                        return { success: false, message: `❌ Jika nama="Ani" dan nilai=92, output seharusnya:\n${expected2}\n\nTapi programmu menghasilkan:\n${out2.trim()}` };
                    }

                    return { success: true };
                }
            },

            // --- SOAL 4: Dua variabel, restructure input ke variabel ---
            {
                id: "L2-C1-Q4",
                chainId: "C1",
                order: 4,
                task: `Perbarui program agar nama yang dimasukkan pengguna tidak langsung dicetak, melainkan disimpan ke dalam variabel baru bernama <code>nama</code>. Pastikan pengguna hanya diminta memasukkan nama <strong>satu kali</strong>. Setelah disimpan, gunakan variabel <code>nama</code> dan variabel <code>nilai</code> untuk menampilkan ringkasan di bagian bawah: <code>Nilai [nama] adalah [nilai]</code>`,
                expectedOutput: "Selamat Datang di Aplikasi Pencatatan Nilai\nMencatat nilai untuk: Bagas\nNilai yang dicatat: 85\nNilai Bagas adalah 85",
                hints: [
                    "Tarik blok read text (input nama) dari soal sebelumnya, lalu pasangkan ke blok set [nama] to.",
                    "Untuk menampilkan nama di baris \"Mencatat nilai untuk...\" dan \"Nilai [nama] adalah...\", gunakan blok get [nama], bukan meminta input lagi.",
                    "Baris ringkasan terakhir menggabungkan tiga komponen: teks tetap, variabel nama, dan variabel nilai — pikirkan urutannya."
                ],
                validateCode: async function(code, output, simulator) {
                    if (!code.includes('=')) {
                        return { success: false, message: "❌ Kamu harus menggunakan variabel!" };
                    }
                    const assignments = code.match(/^\s*(\w+)\s*=/gm);
                    if (!assignments || assignments.length < 2) {
                        return { success: false, message: "❌ Kamu harus membuat minimal 2 variabel berbeda (nama dan nilai)!" };
                    }
                    if (!code.includes('input(')) {
                        return { success: false, message: "❌ Kamu harus menggunakan blok input untuk membaca data!" };
                    }

                    // Test 1
                    const out1 = await simulator.runSilentTest(code, ["Bagas", "85"]);
                    const expected1 = "Selamat Datang di Aplikasi Pencatatan Nilai\nMencatat nilai untuk: Bagas\nNilai yang dicatat: 85\nNilai Bagas adalah 85";
                    if (out1.trim() !== expected1) {
                        return { success: false, message: `❌ Jika nama="Bagas" dan nilai=85, output seharusnya:\n${expected1}\n\nTapi programmu menghasilkan:\n${out1.trim()}` };
                    }

                    // Test 2 — pastikan nama hanya diminta sekali & fleksibel
                    const out2 = await simulator.runSilentTest(code, ["Dina", "70"]);
                    const expected2 = "Selamat Datang di Aplikasi Pencatatan Nilai\nMencatat nilai untuk: Dina\nNilai yang dicatat: 70\nNilai Dina adalah 70";
                    if (out2.trim() !== expected2) {
                        return { success: false, message: `❌ Jika nama="Dina" dan nilai=70, output seharusnya:\n${expected2}\n\nTapi programmu menghasilkan:\n${out2.trim()}` };
                    }

                    return { success: true };
                }
            }
        ]
    ];
}
