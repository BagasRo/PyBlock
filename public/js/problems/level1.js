export default function getProblems() {
    // Level 1: 2 slot soal (Soal 1 & Soal 2)
    // Setiap slot berisi array varian (A, B, dst.)
    // Sistem memilih 1 varian secara acak per slot saat simulasi dimuat

    return [
        // =============================================
        // SOAL 1 — Mudah: Aritmatika langsung + print
        // =============================================
        [
            // --- Varian A ---
            (function() {
                const mouseQty = Math.floor(Math.random() * 10) + 5; // 5 - 14
                const mousePrice = (Math.floor(Math.random() * 6) + 5) * 10000; // 50k - 100k
                const total = mouseQty * mousePrice;

                return {
                    id: "1_1_a",
                    variant: "A",
                    task: `Laboratorium komputer jurusan TKJ membeli ${mouseQty} unit mouse wireless dengan harga Rp ${mousePrice.toLocaleString('id-ID')} per unit. Kepala laboratorium perlu mengetahui total anggaran yang dibutuhkan untuk pembelian tersebut sebelum mengajukan nota pembelian ke bendahara sekolah. Rancanglah algoritma yang langsung menghasilkan total anggaran pembelian dan menampilkannya ke layar.\n\nSusunlah rancangan algoritma menggunakan blok Blockly yang tersedia, dan perhatikan kode Python yang dihasilkan sebagai wujud program dalam bahasa komputer.`,
                    expectedOutput: total.toString(),
                    hints: [
                        "Pikirkan terlebih dahulu hubungan matematis antara jumlah barang dan harga satuan — operasi apa yang menghasilkan total harga dari keduanya?",
                        "Semua angka yang diperlukan sudah tersedia langsung dari soal — tidak ada informasi yang perlu diminta dari luar saat program berjalan.",
                        "Telusuri alur program dari ujung ke ujung: apakah hasil kalkulasi yang kamu susun sudah terhubung ke perintah yang memunculkan angka tersebut di layar?"
                    ],
                    validateCode: function(code, output) {
                        if (code.includes('=')) {
                            return { success: false, message: "❌ Kamu tidak boleh menggunakan variabel untuk menyelesaikan soal di Level 1!" };
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
                const resistorQty = Math.floor(Math.random() * 10) + 5; // 5 - 14
                const resistorPrice = (Math.floor(Math.random() * 5) + 1) * 1000; // 1000 - 5000
                const total = resistorQty * resistorPrice;

                return {
                    id: "1_1_b",
                    variant: "B",
                    task: `Jurusan Teknik Elektronika Industri sedang mempersiapkan praktik perakitan rangkaian listrik. Setiap siswa membutuhkan ${resistorQty} buah resistor dengan harga Rp ${resistorPrice.toLocaleString('id-ID')} per buah sebagai komponen utama rangkaian. Guru pembimbing perlu menghitung total biaya komponen yang harus disediakan sebelum memulai sesi praktik. Rancanglah algoritma yang langsung menghasilkan total biaya komponen tersebut dan menampilkannya ke layar.\n\nSusunlah rancangan algoritma menggunakan blok Blockly yang tersedia, dan perhatikan kode Python yang dihasilkan sebagai wujud program dalam bahasa komputer.`,
                    expectedOutput: total.toString(),
                    hints: [
                        "Pikirkan terlebih dahulu hubungan matematis antara jumlah komponen dan harga satuan — operasi apa yang secara langsung menghasilkan total biaya dari keduanya?",
                        "Semua angka yang diperlukan sudah tersedia langsung dari soal — tidak ada informasi tambahan yang perlu diminta dari luar saat program berjalan.",
                        "Telusuri alur program yang kamu susun dari ujung ke ujung: apakah hasil kalkulasi sudah benar-benar terhubung ke perintah yang memunculkannya di layar terminal?"
                    ],
                    validateCode: function(code, output) {
                        if (code.includes('=')) {
                            return { success: false, message: "❌ Kamu tidak boleh menggunakan variabel untuk menyelesaikan soal di Level 1!" };
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
                const lembarPerEksemplar = Math.floor(Math.random() * 5) + 2; // 2 - 6
                const jumlahEksemplar = Math.floor(Math.random() * 50) + 100; // 100 - 149
                const total = lembarPerEksemplar * jumlahEksemplar;

                return {
                    id: "1_1_c",
                    variant: "C",
                    task: `Jurusan Teknik Grafika sedang mempersiapkan produksi brosur untuk kegiatan pameran sekolah. Mesin cetak membutuhkan ${lembarPerEksemplar} lembar kertas untuk setiap eksemplar brosur, dan panitia memesan sebanyak ${jumlahEksemplar} eksemplar. Operator mesin perlu mengetahui total lembar kertas yang harus disiapkan sebelum proses cetak dimulai. Rancanglah algoritma yang langsung menghasilkan total kebutuhan kertas tersebut dan menampilkannya ke layar.\n\nSusunlah rancangan algoritma menggunakan blok Blockly yang tersedia, dan perhatikan kode Python yang dihasilkan sebagai wujud program dalam bahasa komputer.`,
                    expectedOutput: total.toString(),
                    hints: [
                        "Pikirkan terlebih dahulu hubungan matematis antara jumlah lembar per eksemplar dan jumlah eksemplar yang dipesan — operasi apa yang menghasilkan total kebutuhan dari keduanya?",
                        "Semua angka yang diperlukan sudah tersedia langsung dari soal — tidak ada informasi tambahan yang perlu diminta dari luar saat program berjalan.",
                        "Telusuri alur program yang kamu susun dari ujung ke ujung: apakah hasil kalkulasi sudah benar-benar terhubung ke perintah yang memunculkannya di layar terminal?"
                    ],
                    validateCode: function(code, output) {
                        if (code.includes('=')) {
                            return { success: false, message: "❌ Kamu tidak boleh menggunakan variabel untuk menyelesaikan soal di Level 1!" };
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
        // SOAL 2 — Sedang: Input + operasi + text join
        // =============================================
        [
            // --- Varian A ---
            {
                id: "1_2_a",
                variant: "A",
                task: `Koperasi sekolah menjual buku tulis dengan harga Rp 4.500 per buah. Petugas koperasi membutuhkan program yang dapat langsung menghitung total pembayaran berdasarkan jumlah buku yang dibeli oleh siswa, kemudian menampilkan hasilnya dalam format yang informatif. Rancanglah algoritma yang menerima masukan berupa jumlah buku dari petugas, lalu menampilkan informasi dengan format: Total pembayaran: Rp [hasil]\n\nSusunlah rancangan algoritma menggunakan blok Blockly yang tersedia, dan perhatikan kode Python yang dihasilkan sebagai wujud program dalam bahasa komputer.`,
                expectedOutput: "Total pembayaran: Rp 22500",
                hints: [
                    "Bayangkan urutan kerja petugas koperasi: apa yang terjadi pertama kali, apa yang dihitung, dan apa yang ditampilkan ke pelanggan — bagaimana urutan itu menjadi langkah-langkah algoritma?",
                    "Perhatikan bahwa output yang diminta memuat dua jenis informasi sekaligus: kalimat teks dan angka hasil hitungan — apakah keduanya bisa langsung disatukan begitu saja?",
                    "Hasil perhitungan matematika dan teks adalah dua jenis data yang berbeda dalam program — pikirkan apa yang perlu dilakukan sebelum keduanya bisa tampil bersama dalam satu baris."
                ],
                validateCode: async function(code, output, simulator) {
                    if (code.includes('=')) {
                        return { success: false, message: "❌ Kamu tidak boleh menggunakan variabel di Level 1! Langsung kalikan input dengan angkanya di dalam blok print." };
                    }
                    if (!code.includes('input(')) {
                        return { success: false, message: "❌ Kamu harus meminta input dari pengguna. Gunakan blok 'read int' dari menu I/O!" };
                    }
                    if (!code.includes('str(')) {
                        return { success: false, message: "❌ Kamu harus menggunakan blok 'to str' untuk mengubah angka menjadi teks sebelum digabungkan!" };
                    }

                    const testOutput = await simulator.runSilentTest(code, ["5"]);
                    if (testOutput.trim() !== "Total pembayaran: Rp 22500") {
                        return { success: false, message: `❌ Logika programmu salah. Jika diinput angka 5, seharusnya program mencetak "Total pembayaran: Rp 22500", tapi programmu mencetak: ${testOutput}` };
                    }

                    const testOutput2 = await simulator.runSilentTest(code, ["10"]);
                    if (testOutput2.trim() !== "Total pembayaran: Rp 45000") {
                        return { success: false, message: `❌ Logika programmu salah. Jika diinput angka 10, seharusnya program mencetak "Total pembayaran: Rp 45000", tapi programmu mencetak: ${testOutput2}` };
                    }

                    return { success: true };
                }
            },
            // --- Varian B ---
            {
                id: "1_2_b",
                variant: "B",
                task: `Kantin sekolah menjual paket nasi bungkus lauk ayam seharga Rp 8.000 per bungkus. Setiap hari kasir kantin perlu menghitung total pemasukan dari penjualan nasi bungkus berdasarkan jumlah yang terjual, lalu mencatatnya dalam laporan harian. Rancanglah algoritma yang menerima masukan berupa jumlah nasi bungkus yang terjual, kemudian menampilkan informasi dengan format: Total pemasukan kantin: Rp [hasil]\n\nSusunlah rancangan algoritma menggunakan blok Blockly yang tersedia, dan perhatikan kode Python yang dihasilkan sebagai wujud program dalam bahasa komputer.`,
                expectedOutput: "Total pemasukan kantin: Rp 120000",
                hints: [
                    "Bayangkan urutan kerja kasir kantin: apa yang pertama kali diterima sebagai informasi, apa yang dihitung, dan apa yang akhirnya dicatat — bagaimana urutan tersebut menjadi langkah-langkah algoritma?",
                    "Perhatikan bahwa format output memuat dua jenis informasi sekaligus: teks kalimat dan angka hasil hitungan — apakah keduanya bisa langsung disatukan tanpa ada langkah tambahan?",
                    "Hasil operasi matematika dan teks adalah dua jenis data yang berbeda dalam program — pikirkan apa yang perlu dilakukan agar keduanya bisa tampil bersama dalam satu baris yang rapi."
                ],
                validateCode: async function(code, output, simulator) {
                    if (code.includes('=')) {
                        return { success: false, message: "❌ Kamu tidak boleh menggunakan variabel di Level 1! Langsung kalikan input dengan angkanya di dalam blok print." };
                    }
                    if (!code.includes('input(')) {
                        return { success: false, message: "❌ Kamu harus meminta input dari pengguna. Gunakan blok 'read int' dari menu I/O!" };
                    }
                    if (!code.includes('str(')) {
                        return { success: false, message: "❌ Kamu harus menggunakan blok 'to str' untuk mengubah angka menjadi teks sebelum digabungkan!" };
                    }

                    const testOutput = await simulator.runSilentTest(code, ["15"]);
                    if (testOutput.trim() !== "Total pemasukan kantin: Rp 120000") {
                        return { success: false, message: `❌ Logika programmu salah. Jika diinput angka 15, seharusnya program mencetak "Total pemasukan kantin: Rp 120000", tapi programmu mencetak: ${testOutput}` };
                    }

                    const testOutput2 = await simulator.runSilentTest(code, ["10"]);
                    if (testOutput2.trim() !== "Total pemasukan kantin: Rp 80000") {
                        return { success: false, message: `❌ Logika programmu salah. Jika diinput angka 10, seharusnya program mencetak "Total pemasukan kantin: Rp 80000", tapi programmu mencetak: ${testOutput2}` };
                    }

                    return { success: true };
                }
            },
            // --- Varian C ---
            {
                id: "1_2_c",
                variant: "C",
                task: `Laboratorium bahasa sekolah menyewakan headset untuk kegiatan listening test dengan tarif Rp 5.000 per sesi. Admin laboratorium membutuhkan program yang dapat langsung menghitung total biaya sewa berdasarkan jumlah headset yang dipinjam oleh siswa dalam satu sesi, kemudian menampilkan hasilnya secara informatif. Rancanglah algoritma yang menerima masukan berupa jumlah headset yang disewa, lalu menampilkan informasi dengan format: Total biaya sewa: Rp [hasil]\n\nSusunlah rancangan algoritma menggunakan blok Blockly yang tersedia, dan perhatikan kode Python yang dihasilkan sebagai wujud program dalam bahasa komputer.`,
                expectedOutput: "Total biaya sewa: Rp 30000",
                hints: [
                    "Bayangkan urutan kerja admin laboratorium: apa yang pertama kali diterima sebagai informasi, apa yang dihitung, dan apa yang akhirnya ditampilkan — bagaimana urutan tersebut menjadi langkah-langkah algoritma?",
                    "Perhatikan bahwa format output memuat dua jenis informasi sekaligus: teks kalimat dan angka hasil hitungan — apakah keduanya bisa langsung disatukan tanpa ada langkah tambahan?",
                    "Hasil operasi matematika dan teks adalah dua jenis data yang berbeda dalam program — pikirkan apa yang perlu dilakukan agar keduanya bisa tampil bersama dalam satu baris yang rapi."
                ],
                validateCode: async function(code, output, simulator) {
                    if (code.includes('=')) {
                        return { success: false, message: "❌ Kamu tidak boleh menggunakan variabel di Level 1! Langsung kalikan input dengan angkanya di dalam blok print." };
                    }
                    if (!code.includes('input(')) {
                        return { success: false, message: "❌ Kamu harus meminta input dari pengguna. Gunakan blok 'read int' dari menu I/O!" };
                    }
                    if (!code.includes('str(')) {
                        return { success: false, message: "❌ Kamu harus menggunakan blok 'to str' untuk mengubah angka menjadi teks sebelum digabungkan!" };
                    }

                    const testOutput = await simulator.runSilentTest(code, ["6"]);
                    if (testOutput.trim() !== "Total biaya sewa: Rp 30000") {
                        return { success: false, message: `❌ Logika programmu salah. Jika diinput angka 6, seharusnya program mencetak "Total biaya sewa: Rp 30000", tapi programmu mencetak: ${testOutput}` };
                    }

                    const testOutput2 = await simulator.runSilentTest(code, ["12"]);
                    if (testOutput2.trim() !== "Total biaya sewa: Rp 60000") {
                        return { success: false, message: `❌ Logika programmu salah. Jika diinput angka 12, seharusnya program mencetak "Total biaya sewa: Rp 60000", tapi programmu mencetak: ${testOutput2}` };
                    }

                    return { success: true };
                }
            },
            // --- Tambahkan Varian D di sini nanti ---
        ]
    ];
}