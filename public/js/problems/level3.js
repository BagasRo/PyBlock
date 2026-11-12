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
                tips: [
                    "💡 Buka kategori <strong>Control</strong> dan tarik blok <code>if/else</code> ke workspace.",
                    "💡 Dari <strong>Logic</strong>, gunakan blok perbandingan <code>≥</code> (greater than or equal). Bandingkan <code>get nilai</code> dengan angka <code>75</code>.",
                    "💡 Di cabang <strong>if</strong>: print \"Status: Lulus\". Di cabang <strong>else</strong>: print \"Status: Tidak Lulus\"."
                ],
                bantuan: {
                    level1: {
                        penalty: 3,
                        description: "Menandai kategori Control, Logic, Variables, Math, dan I/O di toolbox & flyout secara berurutan.",
                        steps: [
                            {
                                category: "Control",
                                block: "controls_ifelse",
                                instruction: "Tarik blok <code>if/else</code> ke area kerja dan sambungkan tepat di bawah blok print terakhir (pada slot berkedip).",
                                target: { blockType: "text_print", isLast: true, connection: "next" }
                            },
                            {
                                category: "Logic",
                                block: "logic_compare",
                                instruction: "Pasang blok perbandingan ke slot kondisi <code>if</code> di samping teks if (slot berkedip).",
                                target: { blockType: "controls_ifelse", isLast: true, input: "IF0" }
                            },
                            {
                                category: "Logic",
                                block: "logic_compare",
                                action: "change_op_gte",
                                instruction: "Klik tanda <code>=</code> pada blok perbandingan, lalu ubah tandanya menjadi <strong>≥</strong> (lebih besar sama dengan).",
                                target: { blockType: "logic_compare", isLast: true }
                            },
                            {
                                category: "Variables",
                                block: "variables_get",
                                variableName: "nilai",
                                instruction: "Buka kategori <strong>Variables</strong>, pasang blok variabel <code>nilai</code> ke slot sebelah <strong>kiri</strong> (slot A) pada blok perbandingan (slot berkedip).",
                                target: { blockType: "logic_compare", isLast: true, input: "A" }
                            },
                            {
                                category: "Math",
                                block: "math_number",
                                instruction: "Buka kategori <strong>Math</strong>, pasang blok angka ke slot sebelah <strong>kanan</strong> (slot B) pada blok perbandingan (slot berkedip), lalu ubah angkanya menjadi <strong>75</strong>.",
                                target: { blockType: "logic_compare", isLast: true, input: "B" }
                            },
                            {
                                category: "I/O",
                                block: "text_print",
                                instruction: "Buka kategori <strong>I/O</strong>, tarik blok <code>print</code> ke dalam slot cabang <code>do</code> (slot berkedip di dalam blok if), lalu ubah teks 'Halo Dunia' menjadi <code>Status: Lulus</code>.",
                                target: { blockType: "controls_ifelse", isLast: true, input: "DO0" }
                            },
                            {
                                category: "I/O",
                                block: "text_print",
                                instruction: "Buka kategori <strong>I/O</strong>, tarik blok <code>print</code> kedua ke dalam slot cabang <code>else</code> (slot berkedip di dalam blok if), lalu ubah teks 'Halo Dunia' menjadi <code>Status: Tidak Lulus</code>.",
                                target: { blockType: "controls_ifelse", isLast: true, input: "ELSE" }
                            },
                            {
                                action: "fill_values_soal5",
                                instruction: "Lengkapi isi teks dan angka yang belum diubah: pastikan angka perbandingan adalah <strong>75</strong>, serta teks cetak adalah <code>Status: Lulus</code> dan <code>Status: Tidak Lulus</code> (atau klik tombol otomatis di bawah)."
                            }
                        ],
                        categories: ["Control", "Logic", "Variables", "Math", "I/O"],
                        blocks: ["controls_ifelse", "logic_compare", "variables_get", "math_number", "text_print", "text_print"]
                    },
                    level2: {
                        penalty: 5,
                        description: "Memasukkan kerangka blok if/else dengan kondisi dan teks cetak kosong ke area kerja.",
                        insert: {
                            "type": "controls_ifelse",
                            "inputs": {
                                "IF0": {
                                    "block": {
                                        "type": "logic_compare",
                                        "fields": { "OP": "GTE" },
                                        "inputs": {
                                             "A": {
                                                "block": {
                                                    "type": "variables_get",
                                                    "fields": { "VAR": { "name": "nilai" } }
                                                }
                                            },
                                            "B": {
                                                "block": {
                                                    "type": "math_number",
                                                    "fields": { "NUM": 0 }
                                                }
                                            }
                                        }
                                    }
                                },
                                "DO0": {
                                    "block": {
                                        "type": "text_print",
                                        "inputs": {
                                            "TEXT": {
                                                "block": {
                                                    "type": "text",
                                                    "fields": { "TEXT": "" }
                                                }
                                            }
                                        }
                                    }
                                },
                                "ELSE": {
                                    "block": {
                                        "type": "text_print",
                                        "inputs": {
                                            "TEXT": {
                                                "block": {
                                                    "type": "text",
                                                    "fields": { "TEXT": "" }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        markFields: ["NUM", "TEXT"]
                    }
                },
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
                task: `Tambahkan juga penentuan kategori nilai siswa di bawah status kelulusan. <strong>Tanpa menghapus blok sebelumnya</strong>, buat percabangan baru dengan 3 cabang untuk menentukan kategori: nilai ≥ 90 → <code>Kategori: A</code>, nilai ≥ 75 → <code>Kategori: B</code>, selain itu → <code>Kategori: C</code>.`,
                expectedOutput: "Selamat Datang di Aplikasi Pencatatan Nilai\nMencatat nilai untuk: Bagas\nNilai yang dicatat: 80\nNilai Bagas adalah 80\nStatus: Lulus\nKategori: B",
                hints: [
                    "Blok status kelulusan dari Soal 5 tidak perlu dihapus — biarkan tetap berada di posisinya.",
                    "Gunakan blok percabangan baru 'if' dari kategori Control, lalu klik ikon ⚙️ pada blok tersebut untuk menambahkan cabang 'else if' dan 'else'.",
                    "Susun kondisi dari yang tertinggi (≥ 90) ke menengah (≥ 75), dan sisanya di cabang else."
                ],
                tips: [
                    "💡 Buka kategori <strong>Control</strong> dan tarik blok <code>if</code> baru di bawah blok status kelulusan.",
                    "💡 Klik ikon ⚙️ pada blok <code>if</code>, lalu tarik satu blok <code>else if</code> dan satu blok <code>else</code> ke dalamnya.",
                    "💡 Atur kondisi: jika <code>nilai ≥ 90</code> cetak <code>Kategori: A</code>, else if <code>nilai ≥ 75</code> cetak <code>Kategori: B</code>, else cetak <code>Kategori: C</code>."
                ],
                bantuan: {
                    level1: {
                        penalty: 3,
                        description: "Menandai kategori Control, Logic, Variables, Math, dan I/O di toolbox & flyout secara berurutan.",
                        steps: [
                            {
                                category: "Control",
                                block: "controls_if",
                                instruction: "Tarik blok <code>if</code> ke area kerja dan sambungkan tepat di bawah blok status kelulusan (pada slot berkedip).",
                                target: { blockType: "controls_ifelse", isLast: true, connection: "next" }
                            },
                            {
                                category: "Control",
                                block: "controls_if",
                                mutatorOf: "controls_if",
                                action: "mutator_config",
                                instruction: "Klik ikon pengaturan ⚙️ pada blok <code>if</code> (atau tombol di bawah). Tarik 1 blok <code>else if</code> dan 1 blok <code>else</code> ke dalamnya agar memiliki 3 cabang!"
                            },
                            {
                                category: "Logic",
                                block: "logic_compare",
                                instruction: "Pasang blok perbandingan ke slot kondisi <code>if</code> pertama (slot berkedip).",
                                target: { containerBlockType: "controls_if", isLastContainer: true, containerInput: "IF0" }
                            },
                            {
                                category: "Logic",
                                block: "logic_compare",
                                action: "change_op_gte",
                                instruction: "Klik tanda <code>=</code> pada blok perbandingan pertama, lalu ubah tandanya menjadi <strong>≥</strong> (lebih besar sama dengan).",
                                target: { blockType: "logic_compare", isLast: true }
                            },
                            {
                                category: "Variables",
                                block: "variables_get",
                                variableName: "nilai",
                                instruction: "Buka kategori <strong>Variables</strong>, pasang blok variabel <code>nilai</code> ke slot sebelah <strong>kiri</strong> (slot A) pada perbandingan pertama (slot berkedip).",
                                target: { containerBlockType: "controls_if", isLastContainer: true, containerInput: "IF0", childInput: "A" }
                            },
                            {
                                category: "Math",
                                block: "math_number",
                                instruction: "Buka kategori <strong>Math</strong>, pasang blok angka ke slot sebelah <strong>kanan</strong> (slot B) pada perbandingan pertama (slot berkedip), lalu ubah angkanya menjadi <strong>90</strong>.",
                                target: { containerBlockType: "controls_if", isLastContainer: true, containerInput: "IF0", childInput: "B" }
                            },
                            {
                                category: "I/O",
                                block: "text_print",
                                instruction: "Buka kategori <strong>I/O</strong>, tarik blok <code>print</code> ke slot cabang <code>do</code> pertama (slot berkedip), lalu ubah teks 'Halo Dunia' menjadi <code>Kategori: A</code>.",
                                target: { containerBlockType: "controls_if", isLastContainer: true, containerInput: "DO0" }
                            },
                            {
                                category: "Logic",
                                block: "logic_compare",
                                instruction: "Pasang blok perbandingan ke slot kondisi <code>else if</code> kedua (slot berkedip).",
                                target: { containerBlockType: "controls_if", isLastContainer: true, containerInput: "IF1" }
                            },
                            {
                                category: "Logic",
                                block: "logic_compare",
                                action: "change_op_gte",
                                instruction: "Klik tanda <code>=</code> pada perbandingan kedua, lalu ubah tandanya menjadi <strong>≥</strong> (lebih besar sama dengan).",
                                target: { blockType: "logic_compare", isLast: true }
                            },
                            {
                                category: "Variables",
                                block: "variables_get",
                                variableName: "nilai",
                                instruction: "Buka kategori <strong>Variables</strong>, pasang blok variabel <code>nilai</code> ke slot sebelah <strong>kiri</strong> (slot A) pada perbandingan kedua (slot berkedip).",
                                target: { containerBlockType: "controls_if", isLastContainer: true, containerInput: "IF1", childInput: "A" }
                            },
                            {
                                category: "Math",
                                block: "math_number",
                                instruction: "Buka kategori <strong>Math</strong>, pasang blok angka ke slot sebelah <strong>kanan</strong> (slot B) pada perbandingan kedua (slot berkedip), lalu ubah angkanya menjadi <strong>75</strong>.",
                                target: { containerBlockType: "controls_if", isLastContainer: true, containerInput: "IF1", childInput: "B" }
                            },
                            {
                                category: "I/O",
                                block: "text_print",
                                instruction: "Buka kategori <strong>I/O</strong>, tarik blok <code>print</code> ke slot cabang <code>do</code> kedua (slot berkedip), lalu ubah teks 'Halo Dunia' menjadi <code>Kategori: B</code>.",
                                target: { containerBlockType: "controls_if", isLastContainer: true, containerInput: "DO1" }
                            },
                            {
                                category: "I/O",
                                block: "text_print",
                                instruction: "Buka kategori <strong>I/O</strong>, tarik blok <code>print</code> ketiga ke dalam slot cabang <code>else</code> (slot berkedip), lalu ubah teks 'Halo Dunia' menjadi <code>Kategori: C</code>.",
                                target: { containerBlockType: "controls_if", isLastContainer: true, containerInput: "ELSE" }
                            },
                            {
                                action: "fill_values_soal6",
                                instruction: "Lengkapi isi teks dan angka yang belum diubah: pastikan angka adalah <strong>90</strong> & <strong>75</strong>, serta teks cetak adalah <code>Kategori: A</code>, <code>Kategori: B</code>, dan <code>Kategori: C</code> (atau klik tombol otomatis di bawah)."
                            }
                        ],
                        categories: ["Control", "Control", "Logic", "Logic", "Variables", "Math", "I/O", "Logic", "Logic", "Variables", "Math", "I/O", "I/O"],
                        blocks: ["controls_if", "controls_if", "logic_compare", "logic_compare", "variables_get", "math_number", "text_print", "logic_compare", "logic_compare", "variables_get", "math_number", "text_print", "text_print"]
                    },
                    level2: {
                        penalty: 5,
                        description: "Memasukkan kerangka blok if/elif/else dengan slot angka dan teks cetak kosong ke area kerja.",
                        insert: {
                            "type": "controls_if",
                            "extraState": {
                                "elseIfCount": 1,
                                "hasElse": true
                            },
                            "inputs": {
                                "IF0": {
                                    "block": {
                                        "type": "logic_compare",
                                        "fields": { "OP": "GTE" },
                                        "inputs": {
                                            "A": {
                                                "block": {
                                                    "type": "variables_get",
                                                    "fields": { "VAR": { "name": "nilai" } }
                                                }
                                            },
                                            "B": {
                                                "block": {
                                                    "type": "math_number",
                                                    "fields": { "NUM": 0 }
                                                }
                                            }
                                        }
                                    }
                                },
                                "DO0": {
                                    "block": {
                                        "type": "text_print",
                                        "inputs": {
                                            "TEXT": {
                                                "block": {
                                                    "type": "text",
                                                    "fields": { "TEXT": "" }
                                                }
                                            }
                                        }
                                    }
                                },
                                "IF1": {
                                    "block": {
                                        "type": "logic_compare",
                                        "fields": { "OP": "GTE" },
                                        "inputs": {
                                            "A": {
                                                "block": {
                                                    "type": "variables_get",
                                                    "fields": { "VAR": { "name": "nilai" } }
                                                }
                                            },
                                            "B": {
                                                "block": {
                                                    "type": "math_number",
                                                    "fields": { "NUM": 0 }
                                                }
                                            }
                                        }
                                    }
                                },
                                "DO1": {
                                    "block": {
                                        "type": "text_print",
                                        "inputs": {
                                            "TEXT": {
                                                "block": {
                                                    "type": "text",
                                                    "fields": { "TEXT": "" }
                                                }
                                            }
                                        }
                                    }
                                },
                                "ELSE": {
                                    "block": {
                                        "type": "text_print",
                                        "inputs": {
                                            "TEXT": {
                                                "block": {
                                                    "type": "text",
                                                    "fields": { "TEXT": "" }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        markFields: ["NUM", "TEXT"]
                    }
                },
                validateCode: async function(code, output, simulator) {
                    if (!code.includes('if ')) {
                        return { success: false, message: "❌ Kamu harus menggunakan blok percabangan (if)!" };
                    }
                    if (!code.includes('elif ')) {
                        return { success: false, message: "❌ Kamu harus menggunakan blok else-if (elif) untuk menambahkan cabang ketiga!" };
                    }

                    // Helper untuk normalisasi teks
                    const norm = (s) => (s || '').trim().replace(/\r\n/g, '\n').split('\n').map(l => l.trim()).filter(l => l.length > 0).join('\n');

                    // Test 1: Kategori A (95 >= 90)
                    const out1 = await simulator.runSilentTest(code, ["Rini", "95"]);
                    if (!norm(out1).endsWith("Kategori: A")) {
                        return { success: false, message: `❌ Jika nilai=95 (≥90), baris terakhir harus "Kategori: A", tapi programmu menghasilkan:\n${norm(out1)}` };
                    }

                    // Test 2: Kategori B (80, >=75 dan <90)
                    const out2 = await simulator.runSilentTest(code, ["Bagas", "80"]);
                    const expected2WithStatus = norm("Selamat Datang di Aplikasi Pencatatan Nilai\nMencatat nilai untuk: Bagas\nNilai yang dicatat: 80\nNilai Bagas adalah 80\nStatus: Lulus\nKategori: B");
                    const expected2WithoutStatus = norm("Selamat Datang di Aplikasi Pencatatan Nilai\nMencatat nilai untuk: Bagas\nNilai yang dicatat: 80\nNilai Bagas adalah 80\nKategori: B");

                    if (norm(out2) !== expected2WithStatus && norm(out2) !== expected2WithoutStatus) {
                        return { success: false, message: `❌ Jika nama="Bagas" dan nilai=80, output seharusnya:\n${expected2WithStatus}\n\nTapi programmu menghasilkan:\n${norm(out2)}` };
                    }

                    // Test 3: Kategori C (60, <75)
                    const out3 = await simulator.runSilentTest(code, ["Doni", "60"]);
                    if (!norm(out3).endsWith("Kategori: C")) {
                        return { success: false, message: `❌ Jika nilai=60 (<75), baris terakhir harus "Kategori: C", tapi programmu menghasilkan:\n${norm(out3)}` };
                    }

                    // Edge case: tepat 90 → A
                    const out4 = await simulator.runSilentTest(code, ["Eka", "90"]);
                    if (!norm(out4).endsWith("Kategori: A")) {
                        return { success: false, message: `❌ Jika nilai tepat 90, seharusnya "Kategori: A", tapi programmu menghasilkan:\n${norm(out4)}` };
                    }

                    // Edge case: tepat 75 → B
                    const out5 = await simulator.runSilentTest(code, ["Fani", "75"]);
                    if (!norm(out5).endsWith("Kategori: B")) {
                        return { success: false, message: `❌ Jika nilai tepat 75, seharusnya "Kategori: B", tapi programmu menghasilkan:\n${norm(out5)}` };
                    }

                    return { success: true };
                }
            }
        ]
    ];
}
