export default function getProblems() {
    // Soal 4.1: Bel sekolah — repeat times
    const bellCount = Math.floor(Math.random() * 4) + 3; // 3 - 6
    let expected1 = "";
    for (let i = 0; i < bellCount; i++) {
        expected1 += "Kring!\n";
    }
    expected1 = expected1.trim();

    // Soal 4.2: Rak gudang — count with (for)
    const rackCount = Math.floor(Math.random() * 5) + 4; // 4 - 8
    let expected2 = "";
    for (let i = 1; i <= rackCount; i++) {
        expected2 += `Memeriksa rak nomor: ${i}\n`;
    }
    expected2 = expected2.trim();

    // Soal 4.3: Antrian bengkel — while + break
    const queueMax = Math.floor(Math.random() * 6) + 15; // 15 - 20
    let expected3 = "";
    for (let i = 1; i <= queueMax; i++) {
        if (i === 13) {
            expected3 += "Antrian dihentikan untuk kasus darurat\n";
            break;
        }
        expected3 += `Memanggil nomor antrian: ${i}\n`;
    }
    expected3 = expected3.trim();

    // Soal 4.4: Lini produksi — count with + continue
    const prodCount = Math.floor(Math.random() * 5) + 8; // 8 - 12
    let expected4 = "";
    for (let i = 1; i <= prodCount; i++) {
        if (i === 7) continue;
        expected4 += `Sepatu nomor seri ${i} lolos pemeriksaan\n`;
    }
    expected4 = expected4.trim();

    return [
        {
            id: "4_1",
            task: `Sistem bel sekolah perlu menandai pergantian jam pelajaran. Gunakan blok repeat ... times untuk mencetak teks "Kring!" sebanyak ${bellCount} kali ke layar terminal.`,
            expectedOutput: expected1,
            hints: [
                "Coba ingat kembali, blok apa yang dipakai untuk mengulang sebuah tindakan sebanyak jumlah tertentu tanpa harus menyusunnya berkali-kali secara manual?",
                "Periksa apakah angka pengulangan pada blok 'repeat' sudah sesuai dengan jumlah yang diminta soal.",
                "Cek kembali apakah blok print dengan teks 'Kring!' sudah diletakkan di dalam (bukan di luar) blok perulangan."
            ],
            validateCode: function(code, output) {
                if (!code.includes('for ') && !code.includes('while ')) {
                    return { success: false, message: "❌ Kamu harus menggunakan blok perulangan (Loops) untuk menyelesaikan soal ini!" };
                }
                if (output.trim() !== this.expectedOutput) {
                    return { success: false, message: "" };
                }
                return { success: true };
            }
        },
        {
            id: "4_2",
            task: `Gudang jurusan Teknik Kendaraan Ringan ingin mendata nomor rak suku cadang secara berurutan dari rak 1 hingga rak ${rackCount}. Gunakan blok count with (for) untuk mencetak "Memeriksa rak nomor: " digabung nomor rak saat ini, untuk setiap rak dari 1 sampai ${rackCount}.`,
            expectedOutput: expected2,
            hints: [
                "Coba ingat kembali, blok perulangan mana yang cocok dipakai saat kamu tahu pasti nilai awal dan nilai akhir dari sebuah urutan angka?",
                "Periksa apakah nilai awal dan nilai akhir pada blok 'count with' sudah sesuai dengan rentang nomor rak yang diminta soal.",
                "Cek kembali apakah variabel penghitung dari blok 'count with' sudah digabungkan dengan teks menggunakan 'to str', bukan langsung dimasukkan begitu saja ke 'create text with'."
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
        },
        {
            id: "4_3",
            task: `Mesin antrian di bengkel otomotif memanggil nomor antrian satu per satu mulai dari nomor 1, selama nomor tersebut belum mencapai ${queueMax}. Buat variabel penghitung mulai dari 1. Gunakan blok WHILE dengan kondisi penghitung ≤ ${queueMax} untuk mencetak "Memanggil nomor antrian: " digabung nilai penghitung, lalu tambahkan penghitung dengan 1 setiap putaran. Di dalam loop, tambahkan blok IF: jika penghitung sudah mencapai nomor antrian darurat (nomor 13), hentikan perulangan lebih awal menggunakan break, dan cetak "Antrian dihentikan untuk kasus darurat".`,
            expectedOutput: expected3,
            hints: [
                "Coba ingat kembali, blok perulangan mana yang cocok dipakai saat jumlah pengulangan tidak pasti dan bergantung pada sebuah kondisi yang terus diperiksa?",
                "Periksa apakah kamu sudah menambah nilai variabel penghitung di setiap akhir putaran, supaya kondisi pada blok while suatu saat menjadi tidak terpenuhi.",
                "Cek kembali apakah blok IF dan blok break untuk kasus darurat sudah diletakkan di dalam blok while, dan kondisinya memeriksa kesamaan nomor penghitung dengan nomor darurat."
            ],
            validateCode: function(code, output) {
                if (!code.includes('while ')) {
                    return { success: false, message: "❌ Soal ini mengharuskan kamu menggunakan blok perulangan WHILE!" };
                }
                if (!code.includes('break')) {
                    return { success: false, message: "❌ Kamu harus menggunakan blok 'break' untuk menghentikan perulangan saat mencapai nomor darurat!" };
                }
                if (!code.includes('if ')) {
                    return { success: false, message: "❌ Kamu harus menggunakan blok IF untuk memeriksa kondisi darurat!" };
                }
                if (output.trim() !== this.expectedOutput) {
                    return { success: false, message: "" };
                }
                return { success: true };
            }
        },
        {
            id: "4_4",
            task: `Sebuah lini produksi sepatu memeriksa nomor seri sepatu dari 1 sampai ${prodCount} menggunakan perulangan count with (for). Untuk setiap nomor seri, JIKA nomor seri tersebut sama dengan nomor cacat produksi (nomor 7), gunakan blok continue untuk melewati pencetakan pesan pada nomor tersebut tanpa menghentikan keseluruhan perulangan. Untuk nomor lainnya, cetak pesan "Sepatu nomor seri " digabung dengan nomor tersebut digabung dengan " lolos pemeriksaan".`,
            expectedOutput: expected4,
            hints: [
                "Coba ingat kembali, blok apa yang dipakai untuk melewati satu putaran tertentu dalam perulangan tanpa menghentikan keseluruhan perulangan?",
                "Periksa apakah blok IF yang memeriksa nomor seri cacat sudah diletakkan di awal badan perulangan, sebelum blok print untuk nomor yang lolos.",
                "Cek kembali apakah blok continue sudah ditempatkan di dalam kondisi IF tersebut, sehingga saat kondisinya benar, blok print di bawahnya ikut terlewati."
            ],
            validateCode: function(code, output) {
                if (!code.includes('for ')) {
                    return { success: false, message: "❌ Soal ini mengharuskan kamu menggunakan blok perulangan count with (for)!" };
                }
                if (!code.includes('continue')) {
                    return { success: false, message: "❌ Kamu harus menggunakan blok 'continue' untuk melewati nomor seri cacat!" };
                }
                if (!code.includes('if ')) {
                    return { success: false, message: "❌ Kamu harus menggunakan blok IF untuk memeriksa nomor seri cacat!" };
                }
                if (output.trim() !== this.expectedOutput) {
                    return { success: false, message: "" };
                }
                return { success: true };
            }
        }
    ];
}
