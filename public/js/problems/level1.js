export default function getProblems() {
    // Soal 1.1: Kedai cetak 3D — penjumlahan
    const keychain = (Math.floor(Math.random() * 5) + 1) * 5000; // 5k - 25k
    const plaque = (Math.floor(Math.random() * 5) + 3) * 10000; // 30k - 70k
    const total1 = keychain + plaque;

    // Soal 1.2: Kabel jumper — perkalian
    const cableLength = Math.floor(Math.random() * 11) + 10; // 10 - 20 meter
    const pricePerMeter = (Math.floor(Math.random() * 4) + 2) * 1000; // 2000 - 5000
    const total2 = cableLength * pricePerMeter;

    return [
        {
            id: "1_1",
            task: `Sebuah kedai cetak 3D di sekolah menjual gantungan kunci seharga Rp ${keychain.toLocaleString('id-ID')} per buah dan plakat penghargaan seharga Rp ${plaque.toLocaleString('id-ID')} per buah. Tanpa menggunakan blok variabel, hitung dan cetak langsung total harga jika seseorang membeli satu gantungan kunci dan satu plakat.`,
            expectedOutput: total1.toString(),
            hints: [
                "Coba pikirkan kembali, operasi matematika apa yang dipakai untuk menggabungkan dua harga menjadi satu total?",
                "Periksa apakah kamu sudah memasukkan blok angka yang benar ke dalam blok operasi penjumlahan sebelum dihubungkan ke blok print.",
                "Cek kembali apakah hasil penjumlahan tersebut sudah benar-benar terhubung langsung ke blok print, bukan tertinggal terpisah di area kerja."
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
        },
        {
            id: "1_2",
            task: `Tim robotik sekolah membeli kabel jumper sepanjang ${cableLength} meter dengan harga Rp ${pricePerMeter.toLocaleString('id-ID')} per meter. Tanpa variabel, hitung dan cetak langsung total biaya kabel jumper tersebut.`,
            expectedOutput: total2.toString(),
            hints: [
                "Ingat kembali, untuk mencari total biaya dari satuan harga per meter, operasi apa yang lebih tepat dibanding penjumlahan?",
                "Periksa apakah angka panjang kabel dan harga per meter sudah ditempatkan pada slot yang benar di blok perkalian.",
                "Pastikan blok perkalian yang sudah kamu susun benar-benar tersambung ke blok print, bukan berdiri sendiri terpisah."
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
        },
        {
            id: "1_3",
            task: `Sebuah warnet sekolah mengenakan biaya sewa komputer Rp 3.000 per jam. Buat program yang membaca jumlah jam sewa menggunakan blok read int, lalu langsung kalikan dengan biaya per jam dan cetak hasilnya tanpa menyimpannya ke variabel.`,
            expectedOutput: "6000",
            hints: [
                "Coba ingat kembali, blok mana yang dipakai untuk membaca masukan angka dari pengguna?",
                "Periksa apakah hasil dari blok read int sudah langsung dihubungkan ke salah satu slot pada blok perkalian, bukan dibiarkan menggantung.",
                "Cek kembali urutan kedua nilai pada blok perkalian — apakah hasil masukan pengguna sudah dikalikan dengan harga satuan yang benar?"
            ],
            validateCode: async function(code, output, simulator) {
                if (code.includes('=')) {
                    return { success: false, message: "❌ Kamu tidak boleh menggunakan variabel di Level 1! Langsung kalikan input dengan angkanya di dalam blok print." };
                }
                if (!code.includes('input(')) {
                    return { success: false, message: "❌ Kamu harus meminta input dari pengguna. Gunakan blok 'read int' dari menu I/O!" };
                }

                const testOutput = await simulator.runSilentTest(code, ["2"]);
                if (testOutput.trim() !== "6000") {
                    return { success: false, message: `❌ Logika perhitunganmu salah. Jika diinput angka 2, seharusnya program mencetak 6000, tapi programmu mencetak: ${testOutput}` };
                }

                return { success: true };
            }
        },
        {
            id: "1_4",
            task: `Panitia LKS ingin membagi peserta ke dalam kelompok beranggotakan 5 orang. Buat program yang membaca jumlah total peserta menggunakan blok read int, lalu hitung langsung sisa peserta yang tidak mendapat kelompok penuh menggunakan blok modulo (sisa bagi dengan 5). Gunakan blok create text with beserta to str untuk mencetak kalimat "Sisa peserta: " digabung dengan hasil hitungan tersebut.`,
            expectedOutput: "Sisa peserta: 2",
            hints: [
                "Coba ingat kembali, blok matematika mana yang digunakan khusus untuk mencari sisa hasil bagi, bukan hasil bagi itu sendiri?",
                "Periksa apakah blok modulo yang kamu gunakan sudah membagi jumlah peserta dengan angka 5, bukan sebaliknya.",
                "Cek kembali apakah hasil dari blok modulo sudah diubah menggunakan blok 'to str' sebelum digabungkan dengan teks menggunakan blok 'create text with'."
            ],
            validateCode: async function(code, output, simulator) {
                if (code.includes('=')) {
                    return { success: false, message: "❌ Kamu tidak boleh menggunakan variabel di Level 1!" };
                }
                if (!code.includes('input(')) {
                    return { success: false, message: "❌ Program harus membaca input angka dari pengguna menggunakan blok 'read int'." };
                }
                if (!code.includes('%')) {
                    return { success: false, message: "❌ Kamu harus menggunakan blok modulo (sisa bagi) untuk mencari sisa peserta!" };
                }
                if (!code.includes('str(')) {
                    return { success: false, message: "❌ Kamu harus menggunakan blok 'to str' untuk mengubah angka menjadi teks sebelum digabungkan!" };
                }

                const testOutput = await simulator.runSilentTest(code, ["17"]);
                if (testOutput.trim().toLowerCase() !== "sisa peserta: 2") {
                    return { success: false, message: `❌ Logika programmu salah. Jika diinput 17 peserta, sisa bagi 5 adalah 2, sehingga harus mencetak "Sisa peserta: 2", tapi programmu mencetak: ${testOutput}` };
                }

                return { success: true };
            }
        }
    ];
}
 