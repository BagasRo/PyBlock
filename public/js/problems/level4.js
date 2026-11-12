export default function getProblems() {
    // Level 4 — Chain-based (2 soal per chain, kumulatif)
    // Konsep: Perulangan (Loops) — for (count with), while (repeat while)
    // Soal 7-8: Memasukkan rangkaian program siswa ke dalam perulangan

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
                task: `Ubah program agar dapat mencatat nilai <strong>tiga siswa</strong> sekaligus secara otomatis menggunakan perulangan. Blok <code>print "Selamat Datang..."</code> tetap di luar perulangan (cukup tampil sekali di awal). <strong>Tanpa menghapus blok-blok yang sudah ada</strong>, pasang blok perulangan <code>count with</code> yang berjalan <strong>3 kali</strong> tepat di bawah sambutan, lalu pindahkan seluruh rangkaian blok siswa ke dalam perulangan tersebut.`,
                expectedOutput: "Selamat Datang di Aplikasi Pencatatan Nilai\nMencatat nilai untuk: Ali\nNilai yang dicatat: 70\nNilai Ali adalah 70\nStatus: Tidak Lulus\nKategori: C\nMencatat nilai untuk: Budi\nNilai yang dicatat: 85\nNilai Budi adalah 85\nStatus: Lulus\nKategori: B\nMencatat nilai untuk: Cici\nNilai yang dicatat: 90\nNilai Cici adalah 90\nStatus: Lulus\nKategori: A",
                hints: [
                    "Perulangan count with (for loop) sangat cocok karena kamu sudah tahu jumlah perulangan yang pasti, yaitu tepat 3 kali.",
                    "Perhatikan bahwa blok sambutan cukup tampil sekali di awal — posisikan blok tersebut di luar (sebelum) blok perulangan.",
                    "Tidak ada blok yang perlu dihapus. Blok Status kelulusan dan Nilai yang dicatat tetap dipertahankan di dalam perulangan.",
                    "Pindahkan seluruh blok siswa mulai dari set nama sampai penentuan kategori ke dalam slot do di blok perulangan."
                ],
                tips: [
                    "💡 Tarik blok <code>count with i from 1 to 10 by 1</code> dari kategori <strong>Loops</strong>. Letakkan di bawah <code>print \"Selamat Datang...\"</code>.",
                    "💡 Ubah angka batas <code>10</code> pada slot <code>to</code> menjadi <strong>3</strong>.",
                    "💡 Pindahkan seluruh rangkaian blok siswa ke dalam slot <code>do</code> di perulangan count with."
                ],
                bantuan: {
                    level1: {
                        penalty: 3,
                        description: "Menandai kategori Loops dan pemindahan blok ke dalam loop secara berurutan.",
                        steps: [
                            {
                                category: "Loops",
                                block: "controls_for",
                                instruction: "Tarik blok loop <code>count with</code> dari kategori Loops dan letakkan tepat di bawah blok <code>print \"Selamat Datang...\"</code>.",
                                target: { blockType: "text_print", index: 0, connection: "next" }
                            },
                            {
                                category: "Loops",
                                block: "controls_for",
                                action: "change_loop_to_3",
                                instruction: "Ubah angka batas perulangan (slot <code>to</code>) menjadi angka <strong>3</strong> agar loop berjalan tepat 3 kali untuk 3 siswa.",
                                target: { blockType: "controls_for", input: "TO" }
                            },
                            {
                                action: "move_blocks_into_loop",
                                instruction: "Pindahkan rangkaian blok siswa (mulai dari blok <code>set nama to ...</code> sampai percabangan nilai) ke dalam slot <code>do</code> di dalam loop perulangan.",
                                target: { insideLoopDoOf: "controls_for" }
                            }
                        ],
                        categories: ["Loops", "Loops"],
                        blocks: ["controls_for", "controls_for"]
                    },
                    level2: {
                        penalty: 5,
                        autoRestructureLoop: true,
                        description: "Memasukkan kerangka perulangan count with (3 kali) dan otomatis memindahkan rangkaian blok siswa ke dalam loop.",
                        insert: {
                            "type": "controls_for",
                            "fields": { "VAR": { "id": "loop_i_var", "name": "i" } },
                            "inputs": {
                                "FROM": {
                                    "shadow": { "type": "math_number", "fields": { "NUM": 1 } }
                                },
                                "TO": {
                                    "shadow": { "type": "math_number", "fields": { "NUM": 3 } }
                                },
                                "BY": {
                                    "shadow": { "type": "math_number", "fields": { "NUM": 1 } }
                                }
                            }
                        }
                    }
                },
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

                    // Cek jika batas loop masih default 10
                    if (code.includes('range(1, 11') || code.includes('range(1, 10') || code.includes('range(10)')) {
                        return { 
                            success: false, 
                            message: "❌ Ubah batas perulangan menjadi 3 (bukan 10) agar loop berjalan tepat 3 kali untuk 3 orang siswa!" 
                        };
                    }

                    const norm = (s) => (s || '').trim().replace(/\r\n/g, '\n')
                        .split('\n')
                        .map(l => l.trim())
                        .filter(l => l.length > 0)
                        .join('\n');

                    // Filter toleran untuk baris-baris minor jika ada perbedaan format
                    const normCore = (s) => norm(s)
                        .split('\n')
                        .filter(l => !l.startsWith('Siswa ke-') && !l.startsWith('Siswa ke '))
                        .join('\n');

                    // Test: 3 siswa dengan nilai berbeda (A, B, C)
                    const out1 = await simulator.runSilentTest(code, ["Ali", "70", "Budi", "85", "Cici", "90"]);
                    const normOut1 = normCore(out1);

                    // Cek "Selamat Datang" hanya muncul sekali
                    const welcomeCount = norm(out1).split("\n").filter(l => l.includes("Selamat Datang")).length;
                    if (welcomeCount !== 1) {
                        return { success: false, message: `❌ Pesan "Selamat Datang..." harus muncul tepat 1 kali (di luar perulangan), tapi muncul ${welcomeCount} kali.` };
                    }

                    // Cek pengulangan 3 siswa
                    const mencatatCount = normOut1.split("\n").filter(l => l.includes("Mencatat nilai untuk:")).length;
                    if (mencatatCount !== 3) {
                        return { 
                            success: false, 
                            message: `❌ Program harus mencatat data untuk 3 orang siswa (ditemukan ${mencatatCount} kali pengulangan). Periksa batas perulanganmu!` 
                        };
                    }

                    // Cek kategori benar
                    if (!normOut1.includes("Kategori: C") || !normOut1.includes("Kategori: B") || !normOut1.includes("Kategori: A")) {
                        return { 
                            success: false, 
                            message: `❌ Kategori tidak sesuai. Ali (70) seharusnya Kategori: C, Budi (85) Kategori: B, dan Cici (90) Kategori: A.\nOutput programmu:\n${norm(out1)}` 
                        };
                    }

                    return { success: true };
                }
            },

            // --- SOAL 8: While loop + sentinel ---
            {
                id: "L4-C1-Q8",
                chainId: "C1",
                order: 8,
                task: `Pada program pencatatan nilai siswa, seringkali jumlah siswa tidak diketahui secara pasti di awal. Ubah sistem perulangan dari jumlah tetap (<code>count with</code>) menjadi perulangan berbasis kondisi (<strong>while loop</strong>) agar pencatatan nilai dapat berlangsung secara dinamis.<br><br>Program harus terus mengulang proses pencatatan siswa selama pengguna memilih untuk menambah data, dan berhenti ketika pengguna memilih selesai. <strong>Tanpa menghapus blok logika siswa yang sudah ada</strong>, ganti struktur perulangan tersebut dan terapkan mekanisme konfirmasi penambahan data.`,
                expectedOutput: "Selamat Datang di Aplikasi Pencatatan Nilai\nMencatat nilai untuk: Ali\nNilai yang dicatat: 70\nNilai Ali adalah 70\nStatus: Tidak Lulus\nKategori: C\nMencatat nilai untuk: Budi\nNilai yang dicatat: 85\nNilai Budi adalah 85\nStatus: Lulus\nKategori: B",
                hints: [
                    "Perulangan while memerlukan kondisi berhenti. Variabel 'lanjut' berfungsi sebagai saklar: selama lanjut bernilai 1, loop akan terus berjalan.",
                    "Gunakan operator pembanding sama dengan (=) dari kategori Logic untuk memeriksa apakah lanjut == 1.",
                    "Seluruh blok pemrosesan siswa yang sudah ada dipindahkan ke dalam slot do loop repeat while.",
                    "Pertanyaan 'Tambah data? (1=Ya, 0=Tidak): ' diletakkan di bagian paling akhir di dalam loop menggunakan blok pembaca angka (read int), lalu simpan hasilnya ke variabel lanjut.",
                    "Blok Selamat Datang tetap berada di luar perulangan (paling atas)."
                ],
                tips: [
                    "💡 Buat variabel sebelum loop: <code>set lanjut to 1</code> tepat di bawah <code>Selamat Datang</code>.",
                    "💡 Tarik <code>repeat while</code> dari kategori <strong>Loops</strong> di bawah <code>set lanjut to 1</code>. Gunakan perbandingan <code>lanjut = 1</code> dari kategori <strong>Logic</strong>.",
                    "💡 Pindahkan seluruh rangkaian blok siswa ke dalam slot <code>do</code> perulangan repeat while.",
                    "💡 Di bagian paling akhir di dalam loop, pasang <code>set lanjut to</code> dengan blok <code>read int</code> berisi pertanyaan <code>Tambah data? (1=Ya, 0=Tidak): </code>."
                ],
                bantuan: {
                    level1: {
                        penalty: 3,
                        description: "Menandai kategori Variables, Math, Loops, Logic, dan I/O secara berurutan beserta penyusunan while loop.",
                        steps: [
                            {
                                category: "Variables",
                                block: "variables_set",
                                variableName: "lanjut",
                                instruction: "Buka kategori Variables, buat variabel <code>lanjut</code> lalu tarik blok <code>set lanjut to</code> ke bawah blok Selamat Datang.",
                                target: { blockType: "text_print", index: 0, connection: "next" }
                            },
                            {
                                category: "Math",
                                block: "math_number",
                                instruction: "Pasang blok angka <code>1</code> ke dalam blok <code>set lanjut to</code>.",
                                target: { containerBlockType: "variables_set", isLastContainer: true, containerInput: "VALUE" }
                            },
                            {
                                category: "Loops",
                                block: "controls_whileUntil",
                                instruction: "Tarik blok loop <code>repeat while</code> dan pasangkan di bawah blok <code>set lanjut to 1</code>.",
                                target: { containerBlockType: "variables_set", isLastContainer: true, connection: "next" }
                            },
                            {
                                category: "Logic",
                                block: "logic_compare",
                                instruction: "Pasang blok perbandingan <code>=</code> ke slot kondisi <code>while</code>.",
                                target: { containerBlockType: "controls_whileUntil", isLastContainer: true, containerInput: "BOOL" }
                            },
                            {
                                category: "Variables",
                                block: "variables_get",
                                variableName: "lanjut",
                                instruction: "Pasang blok variabel <code>lanjut</code> ke slot sebelah kiri perbandingan.",
                                target: { containerBlockType: "controls_whileUntil", isLastContainer: true, containerInput: "BOOL", childInput: "A" }
                            },
                            {
                                category: "Math",
                                block: "math_number",
                                instruction: "Pasang blok angka <code>1</code> ke slot sebelah kanan perbandingan.",
                                target: { containerBlockType: "controls_whileUntil", isLastContainer: true, containerInput: "BOOL", childInput: "B" }
                            },
                            {
                                action: "move_blocks_into_while",
                                instruction: "Pindahkan rangkaian blok siswa ke dalam slot <code>do</code> di perulangan <code>repeat while</code>.",
                                target: { insideLoopDoOf: "controls_whileUntil" }
                            },
                            {
                                category: "Variables",
                                block: "variables_set",
                                variableName: "lanjut",
                                instruction: "Tarik blok <code>set lanjut to</code> ke bagian paling bawah di dalam loop <code>repeat while</code>.",
                                target: { insideLoopDoOf: "controls_whileUntil", lastStatement: true }
                            },
                            {
                                category: "I/O",
                                block: "read_number",
                                instruction: "Pasang blok pembaca angka (read int) ke dalam slot blok <code>set lanjut to</code> di akhir loop.",
                                target: { containerBlockType: "variables_set", isLastContainer: true, containerInput: "VALUE" }
                            },
                            {
                                action: "fill_values_soal8",
                                instruction: "Periksa teks konfirmasi pada <code>read int</code> di akhir loop: pastikan tertulis <code>Tambah data? (1=Ya, 0=Tidak): </code>.",
                                target: { containerBlockType: "read_number", isLastContainer: true, containerInput: "PROMPT" }
                            }
                        ],
                        categories: ["Variables", "Math", "Loops", "Logic", "Variables", "Math", "Variables", "I/O"],
                        blocks: ["variables_set", "math_number", "controls_whileUntil", "logic_compare", "variables_get", "math_number", "variables_set", "read_number"]
                    },
                    level2: {
                        penalty: 5,
                        autoRestructureWhile: true,
                        description: "Memasukkan kerangka variabel lanjut, loop repeat while (lanjut == 1), konfirmasi tambah data, dan otomatis memindahkan blok siswa ke dalam loop.",
                        insert: {
                            "type": "variables_set",
                            "fields": { "VAR": { "id": "var_lanjut_id", "name": "lanjut" } },
                            "inputs": {
                                "VALUE": { "shadow": { "type": "math_number", "fields": { "NUM": 1 } } }
                            },
                            "next": {
                                "block": {
                                    "type": "controls_whileUntil",
                                    "fields": { "MODE": "WHILE" },
                                    "inputs": {
                                        "BOOL": {
                                            "block": {
                                                "type": "logic_compare",
                                                "fields": { "OP": "EQ" },
                                                "inputs": {
                                                    "A": {
                                                        "block": {
                                                            "type": "variables_get",
                                                            "fields": { "VAR": { "id": "var_lanjut_id", "name": "lanjut" } }
                                                        }
                                                    },
                                                    "B": {
                                                        "shadow": {
                                                            "type": "math_number",
                                                            "fields": { "NUM": 1 }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        markFields: ["NUM"]
                    }
                },
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

                    const norm = (s) => (s || '').trim().replace(/\r\n/g, '\n')
                        .split('\n')
                        .map(l => l.trim())
                        .filter(l => l.length > 0)
                        .join('\n');

                    const normCore = (s) => norm(s)
                        .split('\n')
                        .filter(l => !l.startsWith('Siswa ke-') && !l.startsWith('Siswa ke '))
                        .join('\n');

                    // Test 1: 2 siswa (Ali/70 lanjut=1, Budi/85 stop=0)
                    const out1 = await simulator.runSilentTest(code, ["Ali", "70", "1", "Budi", "85", "0"]);
                    const normOut1 = normCore(out1);

                    // Cek "Selamat Datang" hanya muncul 1 kali
                    const welcomeCount = norm(out1).split("\n").filter(l => l.includes("Selamat Datang")).length;
                    if (welcomeCount !== 1) {
                        return { success: false, message: `❌ Pesan "Selamat Datang..." harus muncul tepat 1 kali (di luar perulangan), tapi muncul ${welcomeCount} kali.` };
                    }

                    // Cek ada 2 kali pencatatan
                    const mencatatCount = normOut1.split("\n").filter(l => l.includes("Mencatat nilai untuk:")).length;
                    if (mencatatCount !== 2) {
                        return { 
                            success: false, 
                            message: `❌ Loop harus berjalan 2 kali saat pengguna memasukkan lanjut=1 lalu lanjut=0 (ditemukan ${mencatatCount} kali pencatatan).` 
                        };
                    }

                    // Cek kategori
                    if (!normOut1.includes("Kategori: C") || !normOut1.includes("Kategori: B")) {
                        return { 
                            success: false, 
                            message: `❌ Kategori tidak sesuai. Ali (70) seharusnya Kategori: C dan Budi (85) seharusnya Kategori: B.\nOutput programmu:\n${norm(out1)}` 
                        };
                    }

                    // Test 2: 1 siswa saja (langsung stop=0)
                    const out2 = await simulator.runSilentTest(code, ["Cici", "90", "0"]);
                    const normOut2 = normCore(out2);
                    const mencatatCount2 = normOut2.split("\n").filter(l => l.includes("Mencatat nilai untuk:")).length;
                    if (mencatatCount2 !== 1) {
                        return { 
                            success: false, 
                            message: `❌ Loop harus langsung berhenti jika pengguna memasukkan angka 0 pada pertanyaan Tambah data (ditemukan ${mencatatCount2} kali pencatatan).` 
                        };
                    }

                    if (!normOut2.includes("Kategori: A")) {
                        return { 
                            success: false, 
                            message: "❌ Siswa Cici (90) seharusnya mendapat Kategori: A." 
                        };
                    }

                    return { success: true };
                }
            }
        ]
    ];
}
