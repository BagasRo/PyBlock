export default function getProblems() {
    // Level 4: 3 slot soal (Soal 8, 9, 10)
    // Setiap slot berisi array varian (A, B, dst.)

    return [
        // =============================================
        // SOAL 8 — Mudah: Repeat times, jumlah tetap
        // =============================================
        [
            // --- Varian A ---
            (function() {
                const notifCount = Math.floor(Math.random() * 4) + 3; // 3 - 6

                let expected = "";
                for (let i = 0; i < notifCount; i++) {
                    expected += "Persiapkan diri untuk ujian praktik!\n";
                }
                expected = expected.trim();

                return {
                    id: "4_1_a",
                    variant: "A",
                    task: `Sistem bel otomatis sekolah perlu membunyikan notifikasi sebanyak ${notifCount} kali sebagai tanda bahwa ujian praktik akan segera dimulai. Rancanglah algoritma yang secara otomatis mencetak pesan "Persiapkan diri untuk ujian praktik!" sebanyak jumlah notifikasi yang telah ditentukan, tanpa harus menuliskan perintah cetak secara manual berulang kali.\n\nSusunlah rancangan algoritma menggunakan blok Blockly yang tersedia, dan perhatikan kode Python yang dihasilkan sebagai wujud program dalam bahasa komputer.`,
                    expectedOutput: expected,
                    hints: [
                        "Ketika sebuah tindakan perlu dilakukan berulang kali dengan jumlah yang sudah pasti sejak awal, struktur algoritma apa yang lebih efisien dibanding menulis perintah yang sama sebanyak itu?",
                        "Perhatikan bahwa jumlah pengulangan dalam persoalan ini sudah diketahui sejak awal dan tidak bergantung pada kondisi apapun saat program berjalan.",
                        "Pastikan perintah yang ingin diulang berada di posisi yang tepat dalam struktur perulangan — apakah ia di dalam atau di luar blok perulangan tersebut?"
                    ],
                    validateCode: function(code, output) {
                        if (!code.includes('for ') && !code.includes('while ')) {
                            return { success: false, message: "❌ Kamu harus menggunakan blok perulangan (Loops) untuk menyelesaikan soal ini! Tidak boleh menulis print berulang kali secara manual." };
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
                const hormatCount = Math.floor(Math.random() * 4) + 3; // 3 - 6

                let expected = "";
                for (let i = 0; i < hormatCount; i++) {
                    expected += "Hormat gerak!\n";
                }
                expected = expected.trim();

                return {
                    id: "4_1_b",
                    variant: "B",
                    task: `Pelatih ekstrakurikuler Paskibra sekolah memimpin sesi latihan baris-berbaris. Pada sesi pemanasan, setiap anggota diwajibkan melakukan gerakan hormat sebanyak ${hormatCount} kali secara berurutan mengikuti aba-aba. Rancanglah algoritma yang secara otomatis mencetak pesan "Hormat gerak!" sebanyak jumlah pengulangan yang telah ditentukan oleh pelatih, tanpa menuliskan perintah cetak secara manual berulang kali.\n\nSusunlah rancangan algoritma menggunakan blok Blockly yang tersedia, dan perhatikan kode Python yang dihasilkan sebagai wujud program dalam bahasa komputer.`,
                    expectedOutput: expected,
                    hints: [
                        "Ketika sebuah tindakan perlu dilakukan berulang kali dengan jumlah yang sudah pasti sejak awal, struktur algoritma apa yang lebih efisien dibanding menulis perintah yang sama sebanyak itu?",
                        "Perhatikan bahwa jumlah pengulangan dalam persoalan ini sudah diketahui sejak awal dan tidak bergantung pada kondisi tertentu yang berubah saat program berjalan.",
                        "Pastikan perintah yang ingin diulang berada di posisi yang tepat dalam struktur perulangan — apakah ia berada di dalam atau di luar blok perulangan tersebut?"
                    ],
                    validateCode: function(code, output) {
                        if (!code.includes('for ') && !code.includes('while ')) {
                            return { success: false, message: "❌ Kamu harus menggunakan blok perulangan (Loops) untuk menyelesaikan soal ini! Tidak boleh menulis print berulang kali secara manual." };
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
                const jumlahGerakan = Math.floor(Math.random() * 4) + 5; // 5 - 8

                let expected = "";
                for (let i = 0; i < jumlahGerakan; i++) {
                    expected += "Jumping jack!\n";
                }
                expected = expected.trim();

                return {
                    id: "4_1_c",
                    variant: "C",
                    task: `Instruktur senam pagi di sekolah memandu siswa dalam sesi pemanasan. Setiap siswa diwajibkan melakukan gerakan jumping jack sebanyak ${jumlahGerakan} kali mengikuti hitungan instruktur. Rancanglah algoritma yang secara otomatis mencetak hitungan "Jumping jack!" sebanyak jumlah yang telah ditentukan, tanpa menuliskan perintah cetak secara manual berulang kali.\n\nSusunlah rancangan algoritma menggunakan blok Blockly yang tersedia, dan perhatikan kode Python yang dihasilkan sebagai wujud program dalam bahasa komputer.`,
                    expectedOutput: expected,
                    hints: [
                        "Ketika sebuah tindakan perlu dilakukan berulang kali dengan jumlah yang sudah pasti sejak awal, struktur algoritma apa yang lebih efisien dibanding menulis perintah yang sama sebanyak itu?",
                        "Perhatikan bahwa jumlah pengulangan dalam persoalan ini sudah diketahui sejak awal dan tidak bergantung pada kondisi tertentu yang berubah saat program berjalan.",
                        "Pastikan perintah yang ingin diulang berada di posisi yang tepat dalam struktur perulangan — apakah ia berada di dalam atau di luar blok perulangan tersebut?"
                    ],
                    validateCode: function(code, output) {
                        if (!code.includes('for ') && !code.includes('while ')) {
                            return { success: false, message: "❌ Kamu harus menggunakan blok perulangan (Loops) untuk menyelesaikan soal ini! Tidak boleh menulis print berulang kali secara manual." };
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
        // SOAL 9 — Sedang: For-count + output bernomor
        // =============================================
        [
            // --- Varian A ---
            (function() {
                const rakCount = Math.floor(Math.random() * 5) + 5; // 5 - 9
                let expected = "";
                for (let i = 1; i <= rakCount; i++) {
                    expected += `Rak nomor ${i}\n`;
                }
                expected = expected.trim();

                return {
                    id: "4_2_a",
                    variant: "A",
                    task: `Petugas perpustakaan sekolah perlu mencetak label nomor rak buku secara berurutan dari rak nomor 1 hingga rak nomor ${rakCount} untuk keperluan penataan ulang koleksi. Setiap label harus tampil dalam format "Rak nomor [nomor]" agar mudah dipasang oleh petugas. Rancanglah algoritma yang menghasilkan seluruh label tersebut secara otomatis dan berurutan.\n\nSusunlah rancangan algoritma menggunakan blok Blockly yang tersedia, dan perhatikan kode Python yang dihasilkan sebagai wujud program dalam bahasa komputer.`,
                    expectedOutput: expected,
                    hints: [
                        "Persoalan ini membutuhkan pengulangan yang menghasilkan output berbeda di setiap putarannya — apa yang membedakan output setiap putaran dari putaran sebelumnya?",
                        "Ketika setiap pengulangan menghasilkan output yang memuat nomor urut yang berubah secara teratur, pikirkan jenis struktur perulangan mana yang secara otomatis menyediakan penghitung yang bisa langsung digunakan dalam output.",
                        "Perhatikan bahwa output setiap putaran mengandung angka dan teks — pikirkan apa yang perlu dilakukan terhadap angka urutan tersebut sebelum bisa digabungkan dengan teks menjadi satu kalimat."
                    ],
                    validateCode: function(code, output) {
                        if (!code.includes('for ') && !code.includes('while ')) {
                            return { success: false, message: "❌ Kamu harus menggunakan blok perulangan!" };
                        }
                        if (!code.includes('str(')) {
                            return { success: false, message: "❌ Kamu harus menggunakan blok 'to str' untuk mengubah angka nomor rak menjadi teks sebelum digabungkan!" };
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
                const kendaraanCount = Math.floor(Math.random() * 5) + 5; // 5 - 9
                let expected = "";
                for (let i = 1; i <= kendaraanCount; i++) {
                    expected += `Kendaraan antrian nomor ${i}\n`;
                }
                expected = expected.trim();

                return {
                    id: "4_2_b",
                    variant: "B",
                    task: `Koordinator praktik jurusan Otomotif perlu mencatat nomor urut kendaraan yang masuk untuk diservis hari ini, mulai dari kendaraan nomor 1 hingga nomor ${kendaraanCount}. Setiap kendaraan harus tercatat dalam format "Kendaraan antrian nomor [nomor]" agar mudah dipantau oleh mekanik. Rancanglah algoritma yang menghasilkan seluruh catatan nomor antrian tersebut secara otomatis dan berurutan.\n\nSusunlah rancangan algoritma menggunakan blok Blockly yang tersedia, dan perhatikan kode Python yang dihasilkan sebagai wujud program dalam bahasa komputer.`,
                    expectedOutput: expected,
                    hints: [
                        "Persoalan ini membutuhkan pengulangan yang menghasilkan output berbeda di setiap putarannya — apa yang membedakan output setiap putaran dari putaran sebelumnya?",
                        "Ketika setiap pengulangan menghasilkan output yang memuat nomor urut yang berubah secara teratur, pikirkan jenis struktur perulangan mana yang secara otomatis menyediakan penghitung yang bisa langsung digunakan.",
                        "Perhatikan bahwa output setiap putaran mengandung angka dan teks — pikirkan apa yang perlu dilakukan terhadap angka urutan tersebut sebelum bisa digabungkan menjadi satu kalimat yang utuh."
                    ],
                    validateCode: function(code, output) {
                        if (!code.includes('for ') && !code.includes('while ')) {
                            return { success: false, message: "❌ Kamu harus menggunakan blok perulangan!" };
                        }
                        if (!code.includes('str(')) {
                            return { success: false, message: "❌ Kamu harus menggunakan blok 'to str' untuk mengubah angka nomor kendaraan menjadi teks sebelum digabungkan!" };
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
                const tabungCount = Math.floor(Math.random() * 5) + 6; // 6 - 10
                let expected = "";
                for (let i = 1; i <= tabungCount; i++) {
                    expected += `Tabung sampel nomor ${i}\n`;
                }
                expected = expected.trim();

                return {
                    id: "4_2_c",
                    variant: "C",
                    task: `Laboran jurusan Kimia Industri perlu memberi label nomor urut pada setiap tabung sampel yang akan diuji, mulai dari tabung nomor 1 hingga tabung nomor ${tabungCount}. Setiap tabung harus dilabeli dalam format "Tabung sampel nomor [nomor]" agar tidak tertukar saat proses pengujian berlangsung. Rancanglah algoritma yang menghasilkan seluruh label nomor tabung tersebut secara otomatis dan berurutan.\n\nSusunlah rancangan algoritma menggunakan blok Blockly yang tersedia, dan perhatikan kode Python yang dihasilkan sebagai wujud program dalam bahasa komputer.`,
                    expectedOutput: expected,
                    hints: [
                        "Persoalan ini membutuhkan pengulangan yang menghasilkan output berbeda di setiap putarannya — apa yang membedakan output setiap putaran dari putaran sebelumnya?",
                        "Ketika setiap pengulangan menghasilkan output yang memuat nomor urut yang berubah secara teratur, pikirkan jenis struktur perulangan mana yang secara otomatis menyediakan penghitung yang bisa langsung digunakan.",
                        "Perhatikan bahwa output setiap putaran mengandung angka dan teks — pikirkan apa yang perlu dilakukan terhadap angka urutan tersebut sebelum bisa digabungkan menjadi satu kalimat yang utuh."
                    ],
                    validateCode: function(code, output) {
                        if (!code.includes('for ') && !code.includes('while ')) {
                            return { success: false, message: "❌ Kamu harus menggunakan blok perulangan!" };
                        }
                        if (!code.includes('str(')) {
                            return { success: false, message: "❌ Kamu harus menggunakan blok 'to str' untuk mengubah angka nomor tabung menjadi teks sebelum digabungkan!" };
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
        // SOAL 10 — Sulit: While + IF + continue + modulo
        // =============================================
        [
            // --- Varian A ---
            (function() {
                const prodCount = Math.floor(Math.random() * 5) + 10; // 10 - 14
                let expected = "";
                for (let i = 1; i <= prodCount; i++) {
                    if (i % 3 === 0) continue;
                    expected += `Produk ${i}: Lulus QC\n`;
                }
                expected = expected.trim();

                return {
                    id: "4_3_a",
                    variant: "A",
                    task: `Sistem pengecekan kualitas produk di jurusan Tata Busana memeriksa nomor produk secara berurutan dari nomor 1 sampai ${prodCount}. Untuk setiap produk yang diperiksa, sistem menampilkan "Produk [nomor]: Lulus QC". Namun, setiap produk dengan nomor yang merupakan kelipatan 3 dinyatakan perlu pemeriksaan ulang oleh supervisor dan harus dilewati tanpa dicetak statusnya. Rancanglah algoritma menggunakan perulangan berbasis kondisi (while) yang mengotomasi seluruh proses pengecekan ini.\n\nSusunlah rancangan algoritma menggunakan blok Blockly yang tersedia, dan perhatikan kode Python yang dihasilkan sebagai wujud program dalam bahasa komputer.`,
                    expectedOutput: expected,
                    hints: [
                        "Dalam persoalan ini ada dua keputusan berbeda yang perlu ditangani: kapan perulangan masih harus berjalan, dan kapan sebuah putaran tertentu harus dilewati tanpa menghentikan keseluruhan perulangan — apakah keduanya menggunakan mekanisme yang sama?",
                        "Untuk menentukan apakah sebuah nomor merupakan kelipatan dari angka tertentu, pikirkan operasi matematika yang menghasilkan nilai nol ketika sebuah bilangan habis dibagi tanpa sisa.",
                        "Pastikan penghitung perulangan tetap bertambah nilainya bahkan ketika sebuah putaran dilewati — pikirkan apa yang akan terjadi pada jalannya program jika penghitung tidak bertambah saat putaran tersebut dilewati."
                    ],
                    validateCode: function(code, output) {
                        if (!code.includes('while ')) {
                            return { success: false, message: "❌ Soal ini mengharuskan kamu menggunakan blok perulangan WHILE (perulangan berbasis kondisi)!" };
                        }
                        if (!code.includes('continue')) {
                            return { success: false, message: "❌ Kamu harus menggunakan blok 'continue' untuk melewati produk dengan nomor kelipatan 3! Jangan gunakan if/else biasa." };
                        }
                        if (!code.includes('if ')) {
                            return { success: false, message: "❌ Kamu harus menggunakan blok IF untuk memeriksa apakah nomor produk merupakan kelipatan 3!" };
                        }
                        if (!code.includes('%')) {
                            return { success: false, message: "❌ Kamu harus menggunakan blok modulo (sisa bagi) untuk memeriksa kelipatan 3!" };
                        }
                        if (output.trim() !== this.expectedOutput) {
                            const lines = output.trim().split('\n');
                            for (const line of lines) {
                                const match = line.match(/Produk (\d+):/);
                                if (match) {
                                    const num = parseInt(match[1]);
                                    if (num % 3 === 0) {
                                        return { success: false, message: `❌ Produk nomor ${num} adalah kelipatan 3 dan seharusnya dilewati, tapi masih muncul di output!` };
                                    }
                                }
                            }
                            return { success: false, message: "" };
                        }
                        return { success: true };
                    }
                };
            })(),
            // --- Varian B ---
            (function() {
                const kotakCount = Math.floor(Math.random() * 6) + 15; // 15 - 20
                let expected = "";
                for (let i = 1; i <= kotakCount; i++) {
                    if (i % 5 === 0) continue;
                    expected += `Kotak ${i}: Komponen Tersedia\n`;
                }
                expected = expected.trim();

                return {
                    id: "4_3_b",
                    variant: "B",
                    task: `Sistem inventaris gudang jurusan Teknik Instalasi Tenaga Listrik memeriksa nomor kotak penyimpanan komponen secara berurutan dari nomor 1 sampai ${kotakCount}. Untuk setiap kotak yang diperiksa, sistem menampilkan pesan "Kotak [nomor]: Komponen Tersedia". Namun, setiap kotak dengan nomor yang merupakan kelipatan 5 sedang dalam proses pengisian ulang dan harus dilewati tanpa dicetak statusnya. Rancanglah algoritma menggunakan perulangan berbasis kondisi yang mengotomasi seluruh proses pemeriksaan ini.\n\nSusunlah rancangan algoritma menggunakan blok Blockly yang tersedia, dan perhatikan kode Python yang dihasilkan sebagai wujud program dalam bahasa komputer.`,
                    expectedOutput: expected,
                    hints: [
                        "Dalam persoalan ini ada dua keputusan berbeda yang perlu ditangani: kapan perulangan masih harus berjalan, dan kapan sebuah putaran tertentu harus dilewati tanpa menghentikan keseluruhan perulangan — apakah keduanya menggunakan mekanisme yang sama?",
                        "Untuk menentukan apakah sebuah nomor merupakan kelipatan dari angka tertentu, pikirkan operasi matematika yang menghasilkan nilai nol ketika sebuah bilangan habis dibagi tanpa sisa.",
                        "Pastikan penghitung perulangan tetap bertambah nilainya bahkan ketika sebuah putaran dilewati — pikirkan apa yang akan terjadi pada jalannya program jika penghitung tidak bertambah saat putaran tersebut dilewati."
                    ],
                    validateCode: function(code, output) {
                        if (!code.includes('while ')) {
                            return { success: false, message: "❌ Soal ini mengharuskan kamu menggunakan blok perulangan WHILE (perulangan berbasis kondisi)!" };
                        }
                        if (!code.includes('continue')) {
                            return { success: false, message: "❌ Kamu harus menggunakan blok 'continue' untuk melewati kotak dengan nomor kelipatan 5! Jangan gunakan if/else biasa." };
                        }
                        if (!code.includes('if ')) {
                            return { success: false, message: "❌ Kamu harus menggunakan blok IF untuk memeriksa apakah nomor kotak merupakan kelipatan 5!" };
                        }
                        if (!code.includes('%')) {
                            return { success: false, message: "❌ Kamu harus menggunakan blok modulo (sisa bagi) untuk memeriksa kelipatan 5!" };
                        }
                        if (output.trim() !== this.expectedOutput) {
                            const lines = output.trim().split('\n');
                            for (const line of lines) {
                                const match = line.match(/Kotak (\d+):/);
                                if (match) {
                                    const num = parseInt(match[1]);
                                    if (num % 5 === 0) {
                                        return { success: false, message: `❌ Kotak nomor ${num} adalah kelipatan 5 dan seharusnya dilewati, tapi masih muncul di output!` };
                                    }
                                }
                            }
                            return { success: false, message: "" };
                        }
                        return { success: true };
                    }
                };
            })(),
            // --- Varian C ---
            (function() {
                const totalPerangkat = Math.floor(Math.random() * 5) + 10; // 10 - 14
                const perangkatRusak = Math.floor(Math.random() * 5) + 4; // 4 - 8
                
                let expected = "";
                for (let i = 1; i <= totalPerangkat; i++) {
                    if (i === perangkatRusak) {
                        expected += `Pemindaian dihentikan: perangkat ${i} bermasalah\n`;
                        break;
                    }
                    expected += `Perangkat ${i}: Terpindai\n`;
                }
                expected = expected.trim();

                return {
                    id: "4_3_c",
                    variant: "C",
                    task: `Sistem pemindaian perangkat di laboratorium komputer jurusan RPL memeriksa nomor perangkat satu per satu secara berurutan dari nomor 1 sampai maksimal ${totalPerangkat} perangkat. Untuk setiap perangkat yang berhasil dipindai, sistem menampilkan pesan "Perangkat [nomor]: Terpindai". Namun, apabila sistem menemukan nomor perangkat ${perangkatRusak} yang ditandai sebagai perangkat bermasalah, seluruh proses pemindaian harus dihentikan sepenuhnya dan menampilkan pesan "Pemindaian dihentikan: perangkat ${perangkatRusak} bermasalah". Rancanglah algoritma menggunakan perulangan berbasis kondisi yang mengotomasi proses pemindaian ini.\n\nSusunlah rancangan algoritma menggunakan blok Blockly yang tersedia, dan perhatikan kode Python yang dihasilkan sebagai wujud program dalam bahasa komputer.`,
                    expectedOutput: expected,
                    hints: [
                        "Berbeda dari persoalan yang \"melewati\" nomor tertentu, persoalan ini meminta program untuk \"berhenti sepenuhnya\" saat menemukan kondisi khusus — apakah mekanisme untuk \"melewati\" dan \"berhenti total\" menggunakan blok yang sama?",
                        "Pikirkan urutan kejadian di dalam setiap putaran: apakah pengecekan kondisi bermasalah dilakukan sebelum atau sesudah mencetak status perangkat? Coba bayangkan implikasinya terhadap output yang dihasilkan.",
                        "Pastikan saat kondisi perangkat bermasalah ditemukan, pesan khusus muncul dan perulangan benar-benar berhenti — tidak ada perangkat dengan nomor setelahnya yang boleh muncul di output."
                    ],
                    validateCode: function(code, output) {
                        if (!code.includes('while ')) {
                            return { success: false, message: "❌ Soal ini mengharuskan kamu menggunakan blok perulangan WHILE (perulangan berbasis kondisi)!" };
                        }
                        if (!code.includes('break')) {
                            return { success: false, message: "❌ Kamu harus menggunakan blok 'break' untuk menghentikan perulangan saat perangkat bermasalah ditemukan!" };
                        }
                        if (!code.includes('if ')) {
                            return { success: false, message: "❌ Kamu harus menggunakan blok IF untuk memeriksa apakah perangkat saat ini bermasalah!" };
                        }
                        if (output.trim() !== this.expectedOutput) {
                            const lines = output.trim().split('\n');
                            for (const line of lines) {
                                const match = line.match(/Perangkat (\d+):/);
                                if (match) {
                                    const num = parseInt(match[1]);
                                    if (num >= perangkatRusak) {
                                        return { success: false, message: `❌ Perangkat nomor ${num} seharusnya tidak dipindai karena pemindaian harus dihentikan saat mencapai perangkat ${perangkatRusak}!` };
                                    }
                                }
                            }
                            return { success: false, message: "" };
                        }
                        return { success: true };
                    }
                };
            })(),
            // --- Tambahkan Varian D di sini nanti ---
        ]
    ];
}
