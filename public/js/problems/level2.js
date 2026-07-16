export default function getProblems() {
    // Level 2: 2 slot soal (Soal 3 & Soal 4)
    // Setiap slot berisi array varian (A, B, dst.)

    return [
        // =============================================
        // SOAL 3 — Mudah: Dua variabel + operasi
        // =============================================
        [
            // --- Varian A ---
            (function() {
                const amplasPerKendaraan = Math.floor(Math.random() * 5) + 3; // 3 - 7
                const jumlahKendaraan = Math.floor(Math.random() * 6) + 4; // 4 - 9
                const total = amplasPerKendaraan * jumlahKendaraan;

                return {
                    id: "2_1_a",
                    variant: "A",
                    task: `Bengkel jurusan Teknik Kendaraan Ringan sedang menghitung kebutuhan bahan habis pakai. Setiap kendaraan yang masuk servis membutuhkan ${amplasPerKendaraan} lembar amplas, dan hari ini ada ${jumlahKendaraan} kendaraan yang dijadwalkan servis. Kepala bengkel ingin program yang menyimpan kedua data tersebut secara terpisah ke dalam program, kemudian menghasilkan total lembar amplas yang perlu disiapkan hari ini. Rancanglah algoritmanya.\n\nSusunlah rancangan algoritma menggunakan blok Blockly yang tersedia, dan perhatikan kode Python yang dihasilkan sebagai wujud program dalam bahasa komputer.`,
                    expectedOutput: total.toString(),
                    hints: [
                        "Kapan sebuah angka perlu disimpan ke dalam \"wadah\" bernama sebelum digunakan, dibanding langsung dipakai sekali dan dilupakan? Apa manfaatnya dalam persoalan ini?",
                        "Identifikasi berapa data berbeda yang masing-masing perlu disimpan secara terpisah sebelum keduanya bisa dihubungkan dalam satu operasi.",
                        "Pastikan operasi penghitungan mengambil nilainya dari wadah penyimpanan yang sudah dibuat, bukan menuliskan ulang angka dari soal secara langsung."
                    ],
                    validateCode: function(code, output) {
                        if (!code.includes('=')) {
                            return { success: false, message: "❌ Kamu harus menggunakan variabel untuk menyelesaikan soal ini (gunakan menu Variables)!" };
                        }
                        const assignments = code.match(/^\s*(\w+)\s*=/gm);
                        if (!assignments || assignments.length < 2) {
                            return { success: false, message: "❌ Kamu harus membuat minimal 2 variabel berbeda untuk menyimpan kedua data!" };
                        }
                        if (output.trim() !== this.expectedOutput) {
                            return { success: false, message: "" };
                        }
                        return { success: true };
                    }
                };
            })(),
            // --- Varian B ---
            (function() {
                const meterPerTitik = Math.floor(Math.random() * 5) + 3; // 3 - 7
                const jumlahTitik = Math.floor(Math.random() * 6) + 4; // 4 - 9
                const total = meterPerTitik * jumlahTitik;

                return {
                    id: "2_1_b",
                    variant: "B",
                    task: `Jurusan Teknik Instalasi Tenaga Listrik sedang menghitung kebutuhan kabel untuk proyek instalasi di gedung praktik. Setiap titik lampu membutuhkan ${meterPerTitik} meter kabel, dan gedung tersebut memiliki ${jumlahTitik} titik lampu yang perlu dipasang. Ketua proyek ingin program yang menyimpan kedua data tersebut secara terpisah ke dalam program, kemudian menghasilkan total panjang kabel yang perlu disiapkan sebelum pemasangan dimulai. Rancanglah algoritmanya.\n\nSusunlah rancangan algoritma menggunakan blok Blockly yang tersedia, dan perhatikan kode Python yang dihasilkan sebagai wujud program dalam bahasa komputer.`,
                    expectedOutput: total.toString(),
                    hints: [
                        "Kapan sebuah angka perlu diberi nama dan disimpan terlebih dahulu sebelum digunakan, dibanding langsung dipakai begitu saja? Apa manfaatnya dalam konteks persoalan ini?",
                        "Identifikasi berapa data berbeda yang masing-masing perlu disimpan secara terpisah sebelum keduanya bisa dihubungkan dalam satu operasi penghitungan.",
                        "Pastikan operasi yang menghasilkan total mengambil nilainya dari wadah penyimpanan yang sudah dibuat, bukan menuliskan ulang angka dari soal secara langsung."
                    ],
                    validateCode: function(code, output) {
                        if (!code.includes('=')) {
                            return { success: false, message: "❌ Kamu harus menggunakan variabel untuk menyelesaikan soal ini (gunakan menu Variables)!" };
                        }
                        const assignments = code.match(/^\\s*(\\w+)\\s*=/gm);
                        if (!assignments || assignments.length < 2) {
                            return { success: false, message: "❌ Kamu harus membuat minimal 2 variabel berbeda untuk menyimpan kedua data!" };
                        }
                        if (output.trim() !== this.expectedOutput) {
                            return { success: false, message: "" };
                        }
                        return { success: true };
                    }
                };
            })(),
            // --- Varian C ---
            (function() {
                const lembarPerRuang = Math.floor(Math.random() * 11) + 20; // 20 - 30
                const jumlahRuang = Math.floor(Math.random() * 6) + 15; // 15 - 20
                const total = lembarPerRuang * jumlahRuang;

                return {
                    id: "2_1_c",
                    variant: "C",
                    task: `Bagian administrasi perkantoran sekolah sedang menghitung kebutuhan kertas untuk keperluan ujian semester. Setiap ruang ujian membutuhkan ${lembarPerRuang} lembar soal, dan tersedia ${jumlahRuang} ruang ujian yang akan digunakan secara bersamaan. Kepala tata usaha ingin program yang menyimpan kedua data tersebut secara terpisah ke dalam program, kemudian menghasilkan total lembar soal yang perlu digandakan sebelum hari ujian. Rancanglah algoritmanya.\n\nSusunlah rancangan algoritma menggunakan blok Blockly yang tersedia, dan perhatikan kode Python yang dihasilkan sebagai wujud program dalam bahasa komputer.`,
                    expectedOutput: total.toString(),
                    hints: [
                        "Kapan sebuah angka perlu diberi nama dan disimpan terlebih dahulu sebelum digunakan, dibanding langsung dipakai begitu saja? Apa manfaatnya dalam konteks persoalan ini?",
                        "Identifikasi berapa data berbeda yang masing-masing perlu disimpan secara terpisah sebelum keduanya bisa dihubungkan dalam satu operasi penghitungan.",
                        "Pastikan operasi yang menghasilkan total mengambil nilainya dari wadah penyimpanan yang sudah dibuat, bukan menuliskan ulang angka dari soal secara langsung."
                    ],
                    validateCode: function(code, output) {
                        if (!code.includes('=')) {
                            return { success: false, message: "❌ Kamu harus menggunakan variabel untuk menyelesaikan soal ini (gunakan menu Variables)!" };
                        }
                        const assignments = code.match(/^\\s*(\\w+)\\s*=/gm);
                        if (!assignments || assignments.length < 2) {
                            return { success: false, message: "❌ Kamu harus membuat minimal 2 variabel berbeda untuk menyimpan kedua data!" };
                        }
                        if (output.trim() !== this.expectedOutput) {
                            return { success: false, message: "" };
                        }
                        return { success: true };
                    }
                };
            })(),
            // --- Tambahkan Varian D di sini nanti ---
        ],

        // =============================================
        // SOAL 4 — Sedang: Input + variabel + text join
        // =============================================
        [
            // --- Varian A ---
            {
                id: "2_2_a",
                variant: "A",
                task: `Jurusan Multimedia sedang membuka pendaftaran peserta workshop desain grafis dengan biaya pendaftaran Rp 25.000 per peserta. Panitia membutuhkan program yang menerima jumlah peserta yang mendaftar, menyimpan data tersebut, kemudian menghitung dan menampilkan total pemasukan dengan format: Total pemasukan: Rp [hasil]. Rancanglah algoritmanya.\n\nSusunlah rancangan algoritma menggunakan blok Blockly yang tersedia, dan perhatikan kode Python yang dihasilkan sebagai wujud program dalam bahasa komputer.`,
                expectedOutput: "Total pemasukan: Rp 200000",
                hints: [
                    "Ada dua jenis angka dalam persoalan ini: yang sudah diketahui sejak awal dan yang baru diketahui saat program berjalan — bagaimana cara algoritma menangani perbedaan sifat keduanya?",
                    "Nilai yang diterima dari pengguna perlu disimpan agar bisa digunakan dalam perhitungan selanjutnya — apakah ada manfaatnya juga menyimpan hasil perhitungan ke wadah tersendiri?",
                    "Perhatikan format output yang diminta: ada berapa komponen yang harus tampil bersama dalam satu baris, dan apakah semua komponen tersebut sudah bertipe data yang kompatibel sebelum digabungkan?"
                ],
                validateCode: async function(code, output, simulator) {
                    if (!code.includes('=')) {
                        return { success: false, message: "❌ Kamu harus menyimpan input dan hasil perhitungan ke dalam variabel!" };
                    }
                    if (!code.includes('input(')) {
                        return { success: false, message: "❌ Kamu harus meminta input dari pengguna (gunakan blok 'read int')." };
                    }
                    if (!code.includes('str(')) {
                        return { success: false, message: "❌ Jangan lupa mengubah angka menjadi teks menggunakan blok 'to str' agar bisa digabungkan dengan kalimat!" };
                    }

                    const assignments = code.match(/^\s*(\w+)\s*=/gm);
                    if (!assignments || assignments.length < 2) {
                        return { success: false, message: "❌ Kamu harus membuat minimal 2 variabel (satu untuk input, satu untuk hasil perhitungan)!" };
                    }

                    const testOutput = await simulator.runSilentTest(code, ["8"]);
                    if (testOutput.trim() !== "Total pemasukan: Rp 200000") {
                        return { success: false, message: `❌ Logika programmu masih salah. Jika diinput angka 8, seharusnya program mencetak "Total pemasukan: Rp 200000", tapi programmu mencetak: ${testOutput}` };
                    }

                    const testOutput2 = await simulator.runSilentTest(code, ["12"]);
                    if (testOutput2.trim() !== "Total pemasukan: Rp 300000") {
                        return { success: false, message: `❌ Logika programmu masih salah. Jika diinput angka 12, seharusnya program mencetak "Total pemasukan: Rp 300000", tapi programmu mencetak: ${testOutput2}` };
                    }

                    return { success: true };
                }
            },
            // --- Varian B ---
            {
                id: "2_2_b",
                variant: "B",
                task: `Ekstrakurikuler Paskibra sekolah membuka pendaftaran anggota baru dengan iuran perdana sebesar Rp 10.000 per anggota untuk keperluan seragam latihan. Pengurus membutuhkan program yang menerima jumlah anggota baru yang mendaftar, menyimpan data tersebut, kemudian menghitung dan menampilkan total iuran yang terkumpul dengan format: Total iuran terkumpul: Rp [hasil]. Rancanglah algoritmanya.\n\nSusunlah rancangan algoritma menggunakan blok Blockly yang tersedia, dan perhatikan kode Python yang dihasilkan sebagai wujud program dalam bahasa komputer.`,
                expectedOutput: "Total iuran terkumpul: Rp 120000",
                hints: [
                    "Ada dua jenis angka dalam persoalan ini: yang sudah pasti sejak awal dan yang baru diketahui saat program berjalan — bagaimana cara algoritma membedakan dan menangani keduanya?",
                    "Nilai yang diterima dari pengguna perlu disimpan agar bisa digunakan dalam perhitungan selanjutnya — apakah ada manfaatnya juga menyimpan hasil perhitungan ke dalam wadah tersendiri sebelum ditampilkan?",
                    "Perhatikan format output yang diminta: ada berapa komponen berbeda yang harus tampil bersama dalam satu baris, dan apakah semua komponen sudah bertipe data yang kompatibel sebelum digabungkan?"
                ],
                validateCode: async function(code, output, simulator) {
                    if (!code.includes('=')) {
                        return { success: false, message: "❌ Kamu harus menyimpan input dan hasil perhitungan ke dalam variabel!" };
                    }
                    if (!code.includes('input(')) {
                        return { success: false, message: "❌ Kamu harus meminta input dari pengguna (gunakan blok 'read int')." };
                    }
                    if (!code.includes('str(')) {
                        return { success: false, message: "❌ Jangan lupa mengubah angka menjadi teks menggunakan blok 'to str' agar bisa digabungkan dengan kalimat!" };
                    }

                    const assignments = code.match(/^\\s*(\\w+)\\s*=/gm);
                    if (!assignments || assignments.length < 2) {
                        return { success: false, message: "❌ Kamu harus membuat minimal 2 variabel (satu untuk input, satu untuk hasil perhitungan)!" };
                    }

                    const testOutput = await simulator.runSilentTest(code, ["12"]);
                    if (testOutput.trim() !== "Total iuran terkumpul: Rp 120000") {
                        return { success: false, message: `❌ Logika programmu masih salah. Jika diinput angka 12, seharusnya program mencetak "Total iuran terkumpul: Rp 120000", tapi programmu mencetak: ${testOutput}` };
                    }

                    const testOutput2 = await simulator.runSilentTest(code, ["20"]);
                    if (testOutput2.trim() !== "Total iuran terkumpul: Rp 200000") {
                        return { success: false, message: `❌ Logika programmu masih salah. Jika diinput angka 20, seharusnya program mencetak "Total iuran terkumpul: Rp 200000", tapi programmu mencetak: ${testOutput2}` };
                    }

                    return { success: true };
                }
            },
            // --- Varian C ---
            {
                id: "2_2_c",
                variant: "C",
                task: `Unit Kesehatan Sekolah (UKS) sedang mengadakan pelatihan pertolongan pertama untuk anggota PMR dengan biaya pelatihan Rp 18.000 per peserta yang mencakup modul dan perlengkapan praktik. Koordinator PMR membutuhkan program yang menerima jumlah peserta yang mendaftar, menyimpan data tersebut, kemudian menghitung dan menampilkan total biaya pelatihan dengan format: Total biaya pelatihan: Rp [hasil]. Rancanglah algoritmanya.\n\nSusunlah rancangan algoritma menggunakan blok Blockly yang tersedia, dan perhatikan kode Python yang dihasilkan sebagai wujud program dalam bahasa komputer.`,
                expectedOutput: "Total biaya pelatihan: Rp 162000",
                hints: [
                    "Ada dua jenis angka dalam persoalan ini: yang sudah pasti sejak awal dan yang baru diketahui saat program berjalan — bagaimana cara algoritma membedakan dan menangani keduanya?",
                    "Nilai yang diterima dari pengguna perlu disimpan agar bisa digunakan dalam perhitungan selanjutnya — apakah ada manfaatnya juga menyimpan hasil perhitungan ke dalam wadah tersendiri sebelum ditampilkan?",
                    "Perhatikan format output yang diminta: ada berapa komponen berbeda yang harus tampil bersama dalam satu baris, dan apakah semua komponen sudah bertipe data yang kompatibel sebelum digabungkan?"
                ],
                validateCode: async function(code, output, simulator) {
                    if (!code.includes('=')) {
                        return { success: false, message: "❌ Kamu harus menyimpan input dan hasil perhitungan ke dalam variabel!" };
                    }
                    if (!code.includes('input(')) {
                        return { success: false, message: "❌ Kamu harus meminta input dari pengguna (gunakan blok 'read int')." };
                    }
                    if (!code.includes('str(')) {
                        return { success: false, message: "❌ Jangan lupa mengubah angka menjadi teks menggunakan blok 'to str' agar bisa digabungkan dengan kalimat!" };
                    }

                    const assignments = code.match(/^\\s*(\\w+)\\s*=/gm);
                    if (!assignments || assignments.length < 2) {
                        return { success: false, message: "❌ Kamu harus membuat minimal 2 variabel (satu untuk input, satu untuk hasil perhitungan)!" };
                    }

                    const testOutput = await simulator.runSilentTest(code, ["9"]);
                    if (testOutput.trim() !== "Total biaya pelatihan: Rp 162000") {
                        return { success: false, message: `❌ Logika programmu masih salah. Jika diinput angka 9, seharusnya program mencetak "Total biaya pelatihan: Rp 162000", tapi programmu mencetak: ${testOutput}` };
                    }

                    const testOutput2 = await simulator.runSilentTest(code, ["15"]);
                    if (testOutput2.trim() !== "Total biaya pelatihan: Rp 270000") {
                        return { success: false, message: `❌ Logika programmu masih salah. Jika diinput angka 15, seharusnya program mencetak "Total biaya pelatihan: Rp 270000", tapi programmu mencetak: ${testOutput2}` };
                    }

                    return { success: true };
                }
            },
            // --- Tambahkan Varian D di sini nanti ---
        ]
    ];
}
