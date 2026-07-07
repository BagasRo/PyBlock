export default function getProblems() {
    // Soal 3.1: Suhu ruang server — IF/ELSE sederhana
    const temperature = Math.floor(Math.random() * 16) + 25; // 25 - 40
    const threshold = Math.floor(Math.random() * 6) + 30; // 30 - 35
    const expected1 = temperature > threshold ? "Nyalakan Kipas Pendingin" : "Suhu Aman";

    // Soal 3.2: Ujian praktik — AND logic
    const nilaiTeori = Math.floor(Math.random() * 31) + 60; // 60 - 90
    const nilaiPraktik = Math.floor(Math.random() * 31) + 60; // 60 - 90
    const expected2 = (nilaiTeori >= 75 && nilaiPraktik >= 75) ? "Memenuhi Syarat Ujian" : "Belum Memenuhi Syarat";

    return [
        {
            id: "3_1",
            task: `Sensor ruang server jurusan TKJ mendeteksi suhu ${temperature}°C, dengan ambang batas aman ${threshold}°C. Simpan kedua nilai ke variabel, lalu buat blok IF/ELSE: jika suhu lebih besar dari ambang batas, cetak "Nyalakan Kipas Pendingin"; jika tidak, cetak "Suhu Aman".`,
            expectedOutput: expected1,
            hints: [
                "Coba ingat kembali, blok apa yang digunakan untuk membuat program mengambil keputusan berbeda tergantung sebuah kondisi?",
                "Periksa apakah blok perbandingan yang kamu gunakan sudah membandingkan suhu dengan ambang batas menggunakan tanda yang sesuai dengan soal.",
                "Cek kembali apakah pesan yang dicetak di bagian 'jika benar' dan 'jika tidak' sudah sesuai dengan kondisi masing-masing."
            ],
            validateCode: function(code, output) {
                if (!code.includes('if ')) {
                    return { success: false, message: "❌ Kamu harus menggunakan blok logika bersyarat (If) untuk menyelesaikan soal ini!" };
                }
                if (!code.includes('=')) {
                    return { success: false, message: "❌ Kamu harus menyimpan nilai suhu dan ambang batas ke dalam variabel!" };
                }
                if (output.trim() !== this.expectedOutput) {
                    return { success: false, message: "" };
                }
                return { success: true };
            }
        },
        {
            id: "3_2",
            task: `Untuk mengikuti ujian praktik kompetensi keahlian, seorang siswa memiliki nilai teori sebesar ${nilaiTeori} dan nilai praktik sebesar ${nilaiPraktik}. Syarat kelulusan adalah nilai teori harus lebih besar atau sama dengan 75 DAN nilai praktik juga harus lebih besar atau sama dengan 75. Simpan kedua nilai tersebut ke variabel berbeda, gunakan blok logika AND untuk memeriksa kedua syarat tersebut, lalu cetak "Memenuhi Syarat Ujian" jika keduanya benar, atau "Belum Memenuhi Syarat" jika tidak.`,
            expectedOutput: expected2,
            hints: [
                "Coba ingat kembali, blok logika apa yang dipakai untuk memeriksa dua syarat yang harus terpenuhi sekaligus, bukan salah satu saja?",
                "Periksa apakah kedua blok perbandingan (nilai teori dan nilai praktik) masing-masing sudah benar menggunakan tanda 'lebih besar sama dengan', sebelum digabungkan dengan blok AND.",
                "Cek kembali apakah hasil dari blok AND tersebut sudah dipasang sebagai kondisi pada blok IF/ELSE, bukan dibiarkan terpisah."
            ],
            validateCode: function(code, output) {
                if (!code.includes('if ')) {
                    return { success: false, message: "❌ Kamu harus menggunakan blok logika bersyarat (If/Else)!" };
                }
                if (!code.includes('and')) {
                    return { success: false, message: "❌ Kamu harus menggunakan blok logika AND untuk memeriksa kedua syarat secara bersamaan!" };
                }
                if (output.trim() !== this.expectedOutput) {
                    return { success: false, message: "" };
                }
                return { success: true };
            }
        },
        {
            id: "3_3",
            task: `Siswa jurusan Multimedia ingin membeli lisensi software edit video seharga Rp 350.000. Baca jumlah tabungan siswa menggunakan read int, simpan ke variabel. Gunakan IF/ELSE: jika tabungan ≥ harga lisensi, cetak "Lisensi berhasil dibeli!"; jika tidak, hitung selisih kekurangan dan cetak "Kurang: " digabung dengan angka kekurangan tersebut.`,
            expectedOutput: "Kurang: 50000",
            hints: [
                "Coba ingat kembali, blok apa yang dipakai untuk membaca masukan angka tabungan dari siswa?",
                "Periksa apakah blok perbandingan yang kamu gunakan sudah memeriksa apakah tabungan lebih besar ATAU SAMA DENGAN harga lisensi, bukan hanya lebih besar saja.",
                "Cek kembali, pada bagian 'jika tidak', apakah kamu sudah menghitung selisihnya dengan mengurangi harga lisensi dengan tabungan, lalu mengubahnya jadi teks sebelum digabungkan dengan kalimat?"
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

                // Test 1: Kurang uang
                const out1 = await simulator.runSilentTest(code, ["300000"]);
                if (out1.trim() !== "Kurang: 50000") {
                    return { success: false, message: `❌ Logika perhitungan selisihmu salah. Jika tabungan 300000, harus mencetak "Kurang: 50000", tapi programmu mencetak: ${out1}` };
                }

                // Test 2: Uang cukup
                const out2 = await simulator.runSilentTest(code, ["400000"]);
                if (out2.trim() !== "Lisensi berhasil dibeli!") {
                    return { success: false, message: `❌ Logika IF-mu salah. Jika tabungan 400000 (cukup), harus mencetak "Lisensi berhasil dibeli!", tapi programmu mencetak: ${out2}` };
                }

                return { success: true };
            }
        },
        {
            id: "3_4",
            task: `Event lomba desain grafis memberi kategori "Peserta Spesial" untuk siapa pun dari jurusan DKV ATAU Multimedia. Baca nama jurusan peserta sebagai teks menggunakan read text, simpan ke variabel. Gunakan blok logika OR untuk memeriksa apakah jurusan = "DKV" atau = "Multimedia". Jika salah satu benar, cetak "Peserta Spesial"; jika tidak, cetak "Peserta Umum".`,
            expectedOutput: "Peserta Spesial",
            hints: [
                "Coba ingat kembali, blok logika apa yang dipakai untuk memeriksa apakah salah satu dari dua syarat terpenuhi, tidak harus keduanya?",
                "Periksa apakah kedua blok perbandingan teks jurusan sudah menggunakan tanda 'sama dengan' dan teks yang dibandingkan ditulis persis sama (perhatikan huruf besar/kecil), sebelum digabungkan dengan blok OR.",
                "Cek kembali apakah hasil dari blok OR sudah dipasang langsung sebagai kondisi pada blok IF/ELSE."
            ],
            validateCode: async function(code, output, simulator) {
                if (!code.includes('if ') || (!code.includes('else:') && !code.includes('elif '))) {
                    return { success: false, message: "❌ Kamu harus menggunakan blok logika bersyarat (If dan Else)!" };
                }
                if (!code.includes('input(')) {
                    return { success: false, message: "❌ Kamu harus meminta input nama jurusan dari pengguna (gunakan blok 'read text')." };
                }
                if (!code.includes('or')) {
                    return { success: false, message: "❌ Kamu harus menggunakan blok logika OR untuk memeriksa dua kemungkinan jurusan!" };
                }

                // Test 1: DKV
                const out1 = await simulator.runSilentTest(code, ["DKV"]);
                if (out1.trim() !== "Peserta Spesial") {
                    return { success: false, message: `❌ Jika diinput "DKV", harus mencetak "Peserta Spesial", tapi programmu mencetak: ${out1}` };
                }

                // Test 2: Multimedia
                const out2 = await simulator.runSilentTest(code, ["Multimedia"]);
                if (out2.trim() !== "Peserta Spesial") {
                    return { success: false, message: `❌ Jika diinput "Multimedia", harus mencetak "Peserta Spesial", tapi programmu mencetak: ${out2}` };
                }

                // Test 3: Jurusan lain
                const out3 = await simulator.runSilentTest(code, ["TKJ"]);
                if (out3.trim() !== "Peserta Umum") {
                    return { success: false, message: `❌ Jika diinput "TKJ", harus mencetak "Peserta Umum", tapi programmu mencetak: ${out3}` };
                }

                return { success: true };
            }
        }
    ];
}
