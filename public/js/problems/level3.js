export default function getProblems() {
    // Level 3: 3 slot soal (Soal 5, 6, 7)
    // Setiap slot berisi array varian (A, B, dst.)

    return [
        // =============================================
        // SOAL 5 — Mudah: IF/ELSE + perbandingan tunggal
        // =============================================
        [
            // --- Varian A ---
            (function() {
                const suhuDeteksi = Math.floor(Math.random() * 16) + 25; // 25 - 40
                const batasAman = Math.floor(Math.random() * 6) + 30; // 30 - 35
                const expected = suhuDeteksi > batasAman ? "Aktifkan Pendingin" : "Suhu Aman";

                return {
                    id: "3_1_a",
                    variant: "A",
                    task: `Sistem monitoring otomatis di ruang server jurusan TKJ mendeteksi bahwa suhu ruangan saat ini adalah ${suhuDeteksi}°C. Standar keamanan perangkat jaringan menetapkan bahwa suhu tidak boleh melebihi ${batasAman}°C. Rancanglah algoritma yang membandingkan suhu yang terdeteksi dengan batas aman tersebut, kemudian menampilkan pesan "Aktifkan Pendingin" apabila suhu melampaui batas, atau "Suhu Aman" apabila kondisi masih dalam batas normal.\n\nSusunlah rancangan algoritma menggunakan blok Blockly yang tersedia, dan perhatikan kode Python yang dihasilkan sebagai wujud program dalam bahasa komputer.`,
                    expectedOutput: expected,
                    hints: [
                        "Persoalan ini mengharuskan program mengambil satu dari dua kemungkinan keputusan — apa yang menentukan keputusan mana yang diambil, dan kapan keputusan itu ditetapkan?",
                        "Ada dua nilai yang perlu dibandingkan — identifikasi terlebih dahulu nilai mana yang berperan sebagai \"kondisi yang diukur\" dan nilai mana yang berperan sebagai \"ukuran standar pembanding\".",
                        "Periksa arah perbandingan yang kamu gunakan: apakah kondisi yang memicu pesan \"Aktifkan Pendingin\" sudah tepat mencerminkan situasi yang digambarkan dalam soal?"
                    ],
                    validateCode: function(code, output) {
                        if (!code.includes('if ')) {
                            return { success: false, message: "❌ Kamu harus menggunakan blok logika bersyarat (If/Else) untuk menyelesaikan soal ini!" };
                        }
                        if (!code.includes('=')) {
                            return { success: false, message: "❌ Kamu harus menyimpan nilai suhu dan batas aman ke dalam variabel!" };
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
                const kapasitasTerpakai = Math.floor(Math.random() * 51) + 50; // 50 - 100
                const batasPeringatan = Math.floor(Math.random() * 16) + 70; // 70 - 85
                const expected = kapasitasTerpakai > batasPeringatan ? "Kapasitas Hampir Penuh" : "Kapasitas Aman";

                return {
                    id: "3_1_b",
                    variant: "B",
                    task: `Sistem monitoring otomatis di ruang server jurusan RPL mendeteksi bahwa kapasitas penyimpanan yang terpakai saat ini adalah ${kapasitasTerpakai} GB. Batas peringatan ditetapkan pada ${batasPeringatan} GB — apabila pemakaian melampaui batas tersebut, sistem harus segera memberi peringatan kepada administrator. Rancanglah algoritma yang membandingkan kapasitas terpakai dengan batas peringatan, kemudian menampilkan pesan "Kapasitas Hampir Penuh" apabila melampaui batas, atau "Kapasitas Aman" apabila masih dalam batas normal.\n\nSusunlah rancangan algoritma menggunakan blok Blockly yang tersedia, dan perhatikan kode Python yang dihasilkan sebagai wujud program dalam bahasa komputer.`,
                    expectedOutput: expected,
                    hints: [
                        "Persoalan ini mengharuskan program mengambil satu dari dua kemungkinan keputusan berdasarkan sebuah kondisi — apa yang menjadi penentu keputusan mana yang diambil oleh program?",
                        "Ada dua nilai yang perlu dibandingkan — tentukan terlebih dahulu nilai mana yang berperan sebagai \"kondisi yang diukur\" dan nilai mana yang berperan sebagai \"batas standar pembanding\".",
                        "Periksa arah perbandingan yang kamu gunakan: apakah kondisi yang memicu pesan \"Kapasitas Hampir Penuh\" sudah tepat mencerminkan situasi yang digambarkan dalam soal?"
                    ],
                    validateCode: function(code, output) {
                        if (!code.includes('if ')) {
                            return { success: false, message: "❌ Kamu harus menggunakan blok logika bersyarat (If/Else) untuk menyelesaikan soal ini!" };
                        }
                        if (!code.includes('=')) {
                            return { success: false, message: "❌ Kamu harus menyimpan nilai kapasitas dan batas peringatan ke dalam variabel!" };
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
                const kecepatanDeteksi = Math.floor(Math.random() * 61) + 20; // 20 - 80
                const standarMinimal = Math.floor(Math.random() * 11) + 40; // 40 - 50
                const expected = kecepatanDeteksi >= standarMinimal ? "Jaringan Memadai" : "Jaringan Lambat";

                return {
                    id: "3_1_c",
                    variant: "C",
                    task: `Sistem monitoring jaringan di laboratorium komputer jurusan TKJ mendeteksi bahwa kecepatan unduh jaringan saat ini adalah ${kecepatanDeteksi} Mbps. Standar minimal kecepatan jaringan untuk kegiatan praktik ditetapkan sebesar ${standarMinimal} Mbps. Rancanglah algoritma yang membandingkan kecepatan jaringan yang terdeteksi dengan standar minimal tersebut, kemudian menampilkan pesan "Jaringan Memadai" apabila kecepatan mencukupi, atau "Jaringan Lambat" apabila kecepatan di bawah standar.\n\nSusunlah rancangan algoritma menggunakan blok Blockly yang tersedia, dan perhatikan kode Python yang dihasilkan sebagai wujud program dalam bahasa komputer.`,
                    expectedOutput: expected,
                    hints: [
                        "Persoalan ini mengharuskan program mengambil satu dari dua kemungkinan keputusan berdasarkan sebuah kondisi — apa yang menjadi penentu keputusan mana yang diambil oleh program?",
                        "Ada dua nilai yang perlu dibandingkan — tentukan terlebih dahulu nilai mana yang berperan sebagai \"kondisi yang diukur\" dan nilai mana yang berperan sebagai \"batas standar minimal\".",
                        "Perhatikan perbedaan antara \"melebihi batas\" dan \"di bawah standar minimal\" — pastikan arah perbandingan yang kamu gunakan sudah mencerminkan kondisi yang tepat dari soal."
                    ],
                    validateCode: function(code, output) {
                        if (!code.includes('if ')) {
                            return { success: false, message: "❌ Kamu harus menggunakan blok logika bersyarat (If/Else) untuk menyelesaikan soal ini!" };
                        }
                        if (!code.includes('=')) {
                            return { success: false, message: "❌ Kamu harus menyimpan nilai kecepatan dan standar minimal ke dalam variabel!" };
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
        // SOAL 6 — Sedang: Input + IF/ELSE + selisih + teks
        // =============================================
        [
            // --- Varian A ---
            {
                id: "3_2_a",
                variant: "A",
                task: `Siswa jurusan RPL ingin membeli sebuah lisensi software code editor premium seharga Rp 350.000. Ia ingin program yang bisa memberinya informasi apakah tabungannya sudah cukup untuk membeli lisensi tersebut. Jika cukup, program menampilkan "Lisensi dapat dibeli!". Jika belum cukup, program harus menghitung dan menampilkan kekurangan yang masih perlu ditabung dalam format: Tabungan kurang: Rp [selisih]. Rancanglah algoritmanya.\n\nSusunlah rancangan algoritma menggunakan blok Blockly yang tersedia, dan perhatikan kode Python yang dihasilkan sebagai wujud program dalam bahasa komputer.`,
                expectedOutput: "Tabungan kurang: Rp 50000",
                hints: [
                    "Sebelum membangun percabangan, tentukan dulu: nilai mana yang tetap tidak berubah, dan nilai mana yang bergantung pada masukan pengguna saat program dijalankan?",
                    "Pada kondisi \"belum cukup\", program diminta menampilkan angka tambahan yang perlu dihitung — dari dua nilai yang ada, bagaimana cara mendapatkan angka kekurangan tersebut?",
                    "Pastikan pada cabang yang menampilkan selisih, urutan pengurangan yang kamu susun sudah benar — siapa yang dikurangi dari siapa agar hasilnya tidak negatif?"
                ],
                validateCode: async function(code, output, simulator) {
                    if (!code.includes('if ') || (!code.includes('else:') && !code.includes('elif '))) {
                        return { success: false, message: "❌ Kamu harus menggunakan blok logika bersyarat (If dan Else)!" };
                    }
                    if (!code.includes('input(')) {
                        return { success: false, message: "❌ Kamu harus meminta input tabungan dari pengguna (gunakan blok 'read int')." };
                    }
                    if (!code.includes('str(')) {
                        return { success: false, message: "❌ Kamu harus mengubah angka kekurangan menjadi teks (to str) agar bisa digabungkan dengan kalimat!" };
                    }

                    // Test 1: Tabungan kurang (300000)
                    const out1 = await simulator.runSilentTest(code, ["300000"]);
                    if (out1.trim() !== "Tabungan kurang: Rp 50000") {
                        return { success: false, message: `❌ Logika perhitungan selisihmu salah. Jika tabungan 300000, harus mencetak "Tabungan kurang: Rp 50000", tapi programmu mencetak: ${out1}` };
                    }

                    // Test 2: Tabungan cukup (400000)
                    const out2 = await simulator.runSilentTest(code, ["400000"]);
                    if (out2.trim() !== "Lisensi dapat dibeli!") {
                        return { success: false, message: `❌ Logika IF-mu salah. Jika tabungan 400000 (cukup), harus mencetak "Lisensi dapat dibeli!", tapi programmu mencetak: ${out2}` };
                    }

                    // Edge case: Tabungan tepat 350000
                    const out3 = await simulator.runSilentTest(code, ["350000"]);
                    if (out3.trim() !== "Lisensi dapat dibeli!") {
                        return { success: false, message: `❌ Jika tabungan tepat 350000 (sama dengan harga lisensi), seharusnya "Lisensi dapat dibeli!", tapi programmu mencetak: ${out3}` };
                    }

                    return { success: true };
                }
            },
            // --- Varian B ---
            {
                id: "3_2_b",
                variant: "B",
                task: `Siswa jurusan Otomotif ingin membeli toolkit servis kendaraan untuk keperluan praktik mandiri di rumah. Set toolkit yang diinginkan dibanderol seharga Rp 185.000 di toko perlengkapan otomotif. Ia ingin program yang memberitahu apakah tabungannya sudah mencukupi. Jika cukup, program menampilkan "Toolkit bisa dibeli!". Jika belum, program harus menghitung dan menampilkan kekurangan dalam format: Tabungan kurang: Rp [selisih]. Rancanglah algoritmanya.\n\nSusunlah rancangan algoritma menggunakan blok Blockly yang tersedia, dan perhatikan kode Python yang dihasilkan sebagai wujud program dalam bahasa komputer.`,
                expectedOutput: "Tabungan kurang: Rp 35000",
                hints: [
                    "Sebelum membangun percabangan, tentukan dulu: nilai mana yang tetap tidak berubah dan nilai mana yang bergantung pada masukan pengguna saat program dijalankan?",
                    "Pada kondisi \"belum cukup\", program diminta menampilkan angka yang perlu dihitung terlebih dahulu — dari dua nilai yang ada, bagaimana cara mendapatkan angka kekurangan tersebut?",
                    "Pastikan urutan pengurangan yang kamu susun pada cabang yang menampilkan selisih sudah benar — siapa yang dikurangi dari siapa agar hasilnya tidak bernilai negatif?"
                ],
                validateCode: async function(code, output, simulator) {
                    if (!code.includes('if ') || (!code.includes('else:') && !code.includes('elif '))) {
                        return { success: false, message: "❌ Kamu harus menggunakan blok logika bersyarat (If dan Else)!" };
                    }
                    if (!code.includes('input(')) {
                        return { success: false, message: "❌ Kamu harus meminta input tabungan dari pengguna (gunakan blok 'read int')." };
                    }
                    if (!code.includes('str(')) {
                        return { success: false, message: "❌ Kamu harus mengubah angka kekurangan menjadi teks (to str) agar bisa digabungkan dengan kalimat!" };
                    }

                    // Test 1: Tabungan kurang (150000)
                    const out1 = await simulator.runSilentTest(code, ["150000"]);
                    if (out1.trim() !== "Tabungan kurang: Rp 35000") {
                        return { success: false, message: `❌ Logika perhitungan selisihmu salah. Jika tabungan 150000, harus mencetak "Tabungan kurang: Rp 35000", tapi programmu mencetak: ${out1}` };
                    }

                    // Test 2: Tabungan cukup (200000)
                    const out2 = await simulator.runSilentTest(code, ["200000"]);
                    if (out2.trim() !== "Toolkit bisa dibeli!") {
                        return { success: false, message: `❌ Logika IF-mu salah. Jika tabungan 200000 (cukup), harus mencetak "Toolkit bisa dibeli!", tapi programmu mencetak: ${out2}` };
                    }

                    // Edge case: Tabungan tepat 185000
                    const out3 = await simulator.runSilentTest(code, ["185000"]);
                    if (out3.trim() !== "Toolkit bisa dibeli!") {
                        return { success: false, message: `❌ Jika tabungan tepat 185000 (sama dengan harga toolkit), seharusnya "Toolkit bisa dibeli!", tapi programmu mencetak: ${out3}` };
                    }

                    return { success: true };
                }
            },
            // --- Varian C ---
            {
                id: "3_2_c",
                variant: "C",
                task: `Siswa jurusan Animasi ingin membeli paket bundel software animasi dan tablet grafis seharga Rp 225.000 untuk mendukung proyek tugas akhir. Ia ingin program yang memberitahu apakah tabungannya sudah mencukupi untuk membeli paket tersebut. Jika cukup, program menampilkan "Paket bundel bisa dibeli!". Jika belum, program harus menghitung dan menampilkan kekurangan yang masih perlu disiapkan dalam format: Tabungan kurang: Rp [selisih]. Rancanglah algoritmanya.\n\nSusunlah rancangan algoritma menggunakan blok Blockly yang tersedia, dan perhatikan kode Python yang dihasilkan sebagai wujud program dalam bahasa komputer.`,
                expectedOutput: "Tabungan kurang: Rp 25000",
                hints: [
                    "Sebelum membangun percabangan, tentukan dulu: nilai mana yang tetap tidak berubah dan nilai mana yang bergantung pada masukan pengguna saat program dijalankan?",
                    "Pada kondisi \"belum cukup\", program diminta menampilkan angka yang perlu dihitung terlebih dahulu — dari dua nilai yang ada, bagaimana cara mendapatkan angka kekurangan tersebut?",
                    "Pastikan urutan pengurangan yang kamu susun pada cabang yang menampilkan selisih sudah benar — siapa yang dikurangi dari siapa agar hasilnya tidak bernilai negatif?"
                ],
                validateCode: async function(code, output, simulator) {
                    if (!code.includes('if ') || (!code.includes('else:') && !code.includes('elif '))) {
                        return { success: false, message: "❌ Kamu harus menggunakan blok logika bersyarat (If dan Else)!" };
                    }
                    if (!code.includes('input(')) {
                        return { success: false, message: "❌ Kamu harus meminta input tabungan dari pengguna (gunakan blok 'read int')." };
                    }
                    if (!code.includes('str(')) {
                        return { success: false, message: "❌ Kamu harus mengubah angka kekurangan menjadi teks (to str) agar bisa digabungkan dengan kalimat!" };
                    }

                    // Test 1: Tabungan kurang (200000)
                    const out1 = await simulator.runSilentTest(code, ["200000"]);
                    if (out1.trim() !== "Tabungan kurang: Rp 25000") {
                        return { success: false, message: `❌ Logika perhitungan selisihmu salah. Jika tabungan 200000, harus mencetak "Tabungan kurang: Rp 25000", tapi programmu mencetak: ${out1}` };
                    }

                    // Test 2: Tabungan cukup (250000)
                    const out2 = await simulator.runSilentTest(code, ["250000"]);
                    if (out2.trim() !== "Paket bundel bisa dibeli!") {
                        return { success: false, message: `❌ Logika IF-mu salah. Jika tabungan 250000 (cukup), harus mencetak "Paket bundel bisa dibeli!", tapi programmu mencetak: ${out2}` };
                    }

                    // Edge case: Tabungan tepat 225000
                    const out3 = await simulator.runSilentTest(code, ["225000"]);
                    if (out3.trim() !== "Paket bundel bisa dibeli!") {
                        return { success: false, message: `❌ Jika tabungan tepat 225000 (sama dengan harga paket), seharusnya "Paket bundel bisa dibeli!", tapi programmu mencetak: ${out3}` };
                    }

                    return { success: true };
                }
            },
            // --- Tambahkan Varian D di sini nanti ---
        ],

        // =============================================
        // SOAL 7 — Sulit: Input × 2 + IF/ELSE + AND
        // =============================================
        [
            // --- Varian A ---
            {
                id: "3_3_a",
                variant: "A",
                task: `Lomba kompetensi siswa bidang IT menetapkan dua syarat untuk peserta yang bisa melaju ke babak semifinal: nilai ujian teori harus minimal 75, dan nilai ujian praktik juga harus minimal 75. Rancanglah program yang menerima nilai teori dan nilai praktik dari peserta, kemudian menampilkan "Lolos Semifinal" apabila kedua syarat terpenuhi, atau "Belum Lolos" apabila salah satu atau kedua syarat tidak terpenuhi.\n\nSusunlah rancangan algoritma menggunakan blok Blockly yang tersedia, dan perhatikan kode Python yang dihasilkan sebagai wujud program dalam bahasa komputer.`,
                expectedOutput: "Lolos Semifinal",
                hints: [
                    "Persoalan ini memiliki dua syarat yang harus terpenuhi secara bersamaan — bagaimana cara menyatakan \"dua kondisi yang harus sama-sama benar\" dalam satu ekspresi logika?",
                    "Coba pisahkan dulu ekspresi logika untuk syarat pertama dan ekspresi logika untuk syarat kedua, sebelum memikirkan bagaimana cara menggabungkan keduanya menjadi satu kondisi.",
                    "Uji algoritma kamu dengan empat kemungkinan: (1) keduanya ≥ 75, (2) hanya teori ≥ 75, (3) hanya praktik ≥ 75, (4) keduanya < 75 — apakah hasilnya selalu tepat untuk keempat skenario?"
                ],
                validateCode: async function(code, output, simulator) {
                    if (!code.includes('if ') || (!code.includes('else:') && !code.includes('elif '))) {
                        return { success: false, message: "❌ Kamu harus menggunakan blok logika bersyarat (If/Else)!" };
                    }
                    if (!code.includes('input(')) {
                        return { success: false, message: "❌ Kamu harus meminta input nilai teori dan praktik dari pengguna (gunakan blok 'read int')." };
                    }
                    if (!code.includes('and')) {
                        return { success: false, message: "❌ Kamu harus menggunakan blok logika AND untuk memeriksa kedua syarat secara bersamaan! Jangan gunakan dua blok IF terpisah yang bertingkat." };
                    }

                    // Test 1: Keduanya >= 75 → Lolos
                    const out1 = await simulator.runSilentTest(code, ["80", "85"]);
                    if (out1.trim() !== "Lolos Semifinal") {
                        return { success: false, message: `❌ Jika nilai teori 80 dan praktik 85 (keduanya ≥ 75), harus mencetak "Lolos Semifinal", tapi programmu mencetak: ${out1}` };
                    }

                    // Test 2: Hanya teori >= 75 → Belum Lolos
                    const out2 = await simulator.runSilentTest(code, ["80", "60"]);
                    if (out2.trim() !== "Belum Lolos") {
                        return { success: false, message: `❌ Jika nilai teori 80 tapi praktik hanya 60, harus mencetak "Belum Lolos", tapi programmu mencetak: ${out2}` };
                    }

                    // Test 3: Hanya praktik >= 75 → Belum Lolos
                    const out3 = await simulator.runSilentTest(code, ["60", "80"]);
                    if (out3.trim() !== "Belum Lolos") {
                        return { success: false, message: `❌ Jika nilai teori 60 tapi praktik 80, harus mencetak "Belum Lolos", tapi programmu mencetak: ${out3}` };
                    }

                    // Test 4: Keduanya < 75 → Belum Lolos
                    const out4 = await simulator.runSilentTest(code, ["50", "60"]);
                    if (out4.trim() !== "Belum Lolos") {
                        return { success: false, message: `❌ Jika kedua nilai di bawah 75 (50 dan 60), harus mencetak "Belum Lolos", tapi programmu mencetak: ${out4}` };
                    }

                    // Edge case: Keduanya tepat 75 → Lolos
                    const out5 = await simulator.runSilentTest(code, ["75", "75"]);
                    if (out5.trim() !== "Lolos Semifinal") {
                        return { success: false, message: `❌ Jika kedua nilai tepat 75, seharusnya "Lolos Semifinal", tapi programmu mencetak: ${out5}` };
                    }

                    return { success: true };
                }
            },
            // --- Varian B ---
            {
                id: "3_3_b",
                variant: "B",
                task: `Program beasiswa prestasi sekolah menetapkan dua syarat yang harus dipenuhi sekaligus oleh calon penerima: nilai rata-rata akademik harus minimal 80, dan persentase kehadiran harus minimal 80%. Rancanglah program yang menerima nilai rata-rata akademik dan persentase kehadiran dari siswa, kemudian menampilkan "Memenuhi Syarat Beasiswa" apabila kedua syarat terpenuhi, atau "Tidak Memenuhi Syarat" apabila salah satu atau kedua syarat tidak terpenuhi.\n\nSusunlah rancangan algoritma menggunakan blok Blockly yang tersedia, dan perhatikan kode Python yang dihasilkan sebagai wujud program dalam bahasa komputer.`,
                expectedOutput: "Memenuhi Syarat Beasiswa",
                hints: [
                    "Persoalan ini memiliki dua syarat yang keduanya harus terpenuhi secara bersamaan — bagaimana cara menyatakan \"dua kondisi yang harus sama-sama benar\" dalam satu ekspresi logika?",
                    "Pisahkan dulu ekspresi logika untuk syarat pertama dan ekspresi logika untuk syarat kedua sebelum memikirkan bagaimana cara menggabungkan keduanya menjadi satu kondisi tunggal.",
                    "Uji algoritma kamu dengan empat kemungkinan: (1) keduanya ≥ 80, (2) hanya nilai rata-rata ≥ 80, (3) hanya kehadiran ≥ 80, (4) keduanya < 80 — apakah hasilnya selalu tepat untuk keempat skenario?"
                ],
                validateCode: async function(code, output, simulator) {
                    if (!code.includes('if ') || (!code.includes('else:') && !code.includes('elif '))) {
                        return { success: false, message: "❌ Kamu harus menggunakan blok logika bersyarat (If/Else)!" };
                    }
                    if (!code.includes('input(')) {
                        return { success: false, message: "❌ Kamu harus meminta input nilai rata-rata dan kehadiran dari pengguna (gunakan blok 'read int')." };
                    }
                    if (!code.includes('and')) {
                        return { success: false, message: "❌ Kamu harus menggunakan blok logika AND untuk memeriksa kedua syarat secara bersamaan! Jangan gunakan dua blok IF terpisah yang bertingkat." };
                    }

                    // Test 1: Keduanya >= 80 → Memenuhi
                    const out1 = await simulator.runSilentTest(code, ["85", "90"]);
                    if (out1.trim() !== "Memenuhi Syarat Beasiswa") {
                        return { success: false, message: `❌ Jika nilai rata-rata 85 dan kehadiran 90 (keduanya ≥ 80), harus mencetak "Memenuhi Syarat Beasiswa", tapi programmu mencetak: ${out1}` };
                    }

                    // Test 2: Hanya nilai >= 80 → Tidak Memenuhi
                    const out2 = await simulator.runSilentTest(code, ["85", "70"]);
                    if (out2.trim() !== "Tidak Memenuhi Syarat") {
                        return { success: false, message: `❌ Jika nilai rata-rata 85 tapi kehadiran hanya 70, harus mencetak "Tidak Memenuhi Syarat", tapi programmu mencetak: ${out2}` };
                    }

                    // Test 3: Hanya kehadiran >= 80 → Tidak Memenuhi
                    const out3 = await simulator.runSilentTest(code, ["65", "85"]);
                    if (out3.trim() !== "Tidak Memenuhi Syarat") {
                        return { success: false, message: `❌ Jika nilai rata-rata 65 tapi kehadiran 85, harus mencetak "Tidak Memenuhi Syarat", tapi programmu mencetak: ${out3}` };
                    }

                    // Test 4: Keduanya < 80 → Tidak Memenuhi
                    const out4 = await simulator.runSilentTest(code, ["50", "60"]);
                    if (out4.trim() !== "Tidak Memenuhi Syarat") {
                        return { success: false, message: `❌ Jika kedua nilai di bawah 80 (50 dan 60), harus mencetak "Tidak Memenuhi Syarat", tapi programmu mencetak: ${out4}` };
                    }

                    // Edge case: Keduanya tepat 80 → Memenuhi
                    const out5 = await simulator.runSilentTest(code, ["80", "80"]);
                    if (out5.trim() !== "Memenuhi Syarat Beasiswa") {
                        return { success: false, message: `❌ Jika kedua nilai tepat 80, seharusnya "Memenuhi Syarat Beasiswa", tapi programmu mencetak: ${out5}` };
                    }

                    return { success: true };
                }
            },
            // --- Varian C ---
            {
                id: "3_3_c",
                variant: "C",
                task: `Seleksi tim futsal sekolah untuk mengikuti turnamen antar SMK menetapkan dua syarat yang harus dipenuhi sekaligus oleh setiap calon pemain: nilai tes fisik harus minimal 65, dan nilai tes teknik bermain juga harus minimal 65. Rancanglah program yang menerima nilai tes fisik dan nilai tes teknik dari calon pemain, kemudian menampilkan "Lolos Seleksi Tim" apabila kedua syarat terpenuhi, atau "Tidak Lolos Seleksi" apabila salah satu atau kedua nilai tidak mencapai batas minimum.\n\nSusunlah rancangan algoritma menggunakan blok Blockly yang tersedia, dan perhatikan kode Python yang dihasilkan sebagai wujud program dalam bahasa komputer.`,
                expectedOutput: "Lolos Seleksi Tim",
                hints: [
                    "Persoalan ini memiliki dua syarat yang keduanya harus terpenuhi secara bersamaan — bagaimana cara menyatakan \"dua kondisi yang harus sama-sama benar\" dalam satu ekspresi logika?",
                    "Pisahkan dulu ekspresi logika untuk syarat pertama dan ekspresi logika untuk syarat kedua sebelum memikirkan bagaimana cara menggabungkan keduanya menjadi satu kondisi tunggal.",
                    "Uji algoritma kamu dengan empat kemungkinan: (1) keduanya ≥ 65, (2) hanya tes fisik ≥ 65, (3) hanya tes teknik ≥ 65, (4) keduanya < 65 — apakah hasilnya selalu tepat untuk keempat skenario?"
                ],
                validateCode: async function(code, output, simulator) {
                    if (!code.includes('if ') || (!code.includes('else:') && !code.includes('elif '))) {
                        return { success: false, message: "❌ Kamu harus menggunakan blok logika bersyarat (If/Else)!" };
                    }
                    if (!code.includes('input(')) {
                        return { success: false, message: "❌ Kamu harus meminta input nilai tes dari pengguna (gunakan blok 'read int')." };
                    }
                    if (!code.includes('and')) {
                        return { success: false, message: "❌ Kamu harus menggunakan blok logika AND untuk memeriksa kedua syarat secara bersamaan! Jangan gunakan dua blok IF terpisah yang bertingkat." };
                    }

                    // Test 1: Keduanya >= 65 → Lolos
                    const out1 = await simulator.runSilentTest(code, ["70", "75"]);
                    if (out1.trim() !== "Lolos Seleksi Tim") {
                        return { success: false, message: `❌ Jika nilai fisik 70 dan teknik 75 (keduanya ≥ 65), harus mencetak "Lolos Seleksi Tim", tapi programmu mencetak: ${out1}` };
                    }

                    // Test 2: Hanya fisik >= 65 → Tidak Lolos
                    const out2 = await simulator.runSilentTest(code, ["70", "60"]);
                    if (out2.trim() !== "Tidak Lolos Seleksi") {
                        return { success: false, message: `❌ Jika nilai fisik 70 tapi teknik hanya 60, harus mencetak "Tidak Lolos Seleksi", tapi programmu mencetak: ${out2}` };
                    }

                    // Test 3: Hanya teknik >= 65 → Tidak Lolos
                    const out3 = await simulator.runSilentTest(code, ["50", "75"]);
                    if (out3.trim() !== "Tidak Lolos Seleksi") {
                        return { success: false, message: `❌ Jika nilai fisik 50 tapi teknik 75, harus mencetak "Tidak Lolos Seleksi", tapi programmu mencetak: ${out3}` };
                    }

                    // Test 4: Keduanya < 65 → Tidak Lolos
                    const out4 = await simulator.runSilentTest(code, ["50", "60"]);
                    if (out4.trim() !== "Tidak Lolos Seleksi") {
                        return { success: false, message: `❌ Jika kedua nilai di bawah 65 (50 dan 60), harus mencetak "Tidak Lolos Seleksi", tapi programmu mencetak: ${out4}` };
                    }

                    // Edge case: Keduanya tepat 65 → Lolos
                    const out5 = await simulator.runSilentTest(code, ["65", "65"]);
                    if (out5.trim() !== "Lolos Seleksi Tim") {
                        return { success: false, message: `❌ Jika kedua nilai tepat 65, seharusnya "Lolos Seleksi Tim", tapi programmu mencetak: ${out5}` };
                    }

                    return { success: true };
                }
            },
            // --- Tambahkan Varian D di sini nanti ---
        ]
    ];
}
