export default function getProblems() {
    // Soal 2.1: Toko sablon — perkalian dengan variabel
    const sheets = Math.floor(Math.random() * 21) + 10; // 10 - 30
    const costPerSheet = (Math.floor(Math.random() * 6) + 5) * 1000; // 5k - 10k
    const total1 = sheets * costPerSheet;

    // Soal 2.2: Filamen printer 3D — pengurangan dengan variabel
    const stockFilament = Math.floor(Math.random() * 31) + 50; // 50 - 80
    const usedFilament = Math.floor(Math.random() * 21) + 10; // 10 - 30
    const remaining = stockFilament - usedFilament;

    return [
        {
            id: "2_1",
            task: `Toko sablon sekolah mencetak ${sheets} lembar kaos dengan biaya sablon Rp ${costPerSheet.toLocaleString('id-ID')} per lembar. Buat sebuah variabel untuk menyimpan jumlah lembar dan variabel lain untuk biaya per lembar, lalu kalikan kedua variabel tersebut dan cetak hasil totalnya.`,
            expectedOutput: total1.toString(),
            hints: [
                "Coba ingat kembali, langkah apa yang perlu dilakukan terlebih dahulu sebelum sebuah angka bisa disimpan dan dipakai kembali nanti?",
                "Periksa apakah kamu sudah membuat dua variabel berbeda dan masing-masing sudah diisi dengan nilai yang sesuai menggunakan blok 'set'.",
                "Cek kembali apakah blok 'get' dari kedua variabel tersebut sudah dipasang dengan benar di kedua slot blok perkalian."
            ],
            validateCode: function(code, output) {
                if (!code.includes('=')) {
                    return { success: false, message: "❌ Kamu harus menggunakan variabel untuk menyelesaikan soal ini (gunakan menu Variables)!" };
                }
                if (output.trim() !== this.expectedOutput) {
                    return { success: false, message: "" };
                }
                return { success: true };
            }
        },
        {
            id: "2_2",
            task: `Sebuah mesin print 3D di sekolah punya stok filamen sepanjang ${stockFilament} meter. Setelah mencetak sebuah proyek, filamen yang terpakai sebanyak ${usedFilament} meter. Simpan kedua angka tersebut ke dalam variabel berbeda, kurangi stok awal dengan pemakaian untuk mencari sisa filamen, lalu cetak hasilnya.`,
            expectedOutput: remaining.toString(),
            hints: [
                "Coba ingat kembali, operasi matematika apa yang dipakai untuk mencari sisa dari sebuah jumlah setelah dikurangi pemakaian?",
                "Periksa apakah nilai stok awal dan nilai pemakaian masing-masing sudah tersimpan di variabel yang berbeda sebelum dikurangkan.",
                "Cek kembali urutan kedua variabel pada blok pengurangan — pastikan stok awal berada di posisi yang dikurangi, bukan sebaliknya."
            ],
            validateCode: function(code, output) {
                if (!code.includes('=')) {
                    return { success: false, message: "❌ Kamu harus menggunakan variabel untuk menyelesaikan soal ini!" };
                }
                if (output.trim() !== this.expectedOutput) {
                    return { success: false, message: "" };
                }
                return { success: true };
            }
        },
        {
            id: "2_3",
            task: `Kantin sekolah menjual es teh Rp 4.000 per gelas. Buat program yang membaca jumlah gelas dibeli menggunakan read int dan simpan ke variabel. Buat variabel kedua untuk menghitung total harga. Gunakan text join dan to str untuk mencetak kalimat "Total bayar: " digabung dengan hasil total tersebut.`,
            expectedOutput: "Total bayar: 12000",
            hints: [
                "Coba ingat kembali, blok apa yang dipakai untuk membaca masukan angka dari pengguna, lalu blok apa yang dipakai untuk menyimpannya?",
                "Periksa apakah variabel kedua yang menyimpan total harga sudah benar-benar mengalikan variabel jumlah gelas dengan harga satuan.",
                "Cek kembali apakah kamu sudah menggunakan blok 'to str' untuk mengubah angka total menjadi teks sebelum digabungkan dengan kalimat menggunakan 'create text with'."
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

                const testOutput = await simulator.runSilentTest(code, ["3"]);
                if (testOutput.trim() !== "Total bayar: 12000") {
                    return { success: false, message: `❌ Logika programmu masih salah. Jika diinput angka 3, seharusnya program mencetak "Total bayar: 12000", tapi programmu mencetak: ${testOutput}` };
                }

                return { success: true };
            }
        },
        {
            id: "2_4",
            task: `Timbangan digital di jurusan Tata Boga membaca berat adonan kue dalam kilogram. Buat program yang membaca berat awal adonan menggunakan read float dan simpan ke variabel "berat". Karena ada adonan tambahan, ubah (set ulang) nilai variabel "berat" dengan menambahkan 0.5 kg ke nilai sebelumnya. Cetak nilai akhir variabel tersebut.`,
            expectedOutput: "3.0",
            hints: [
                "Coba ingat kembali, blok apa yang dipakai untuk membaca masukan berupa angka desimal, bukan bilangan bulat?",
                "Periksa apakah kamu sudah menggunakan blok 'set' pada variabel berat yang sama untuk mengubah nilainya, bukan membuat variabel baru.",
                "Cek kembali apakah nilai baru pada variabel berat sudah merupakan hasil penjumlahan dari nilai variabel itu sendiri ditambah 0.5, bukan menggantikannya dengan angka 0.5 saja."
            ],
            validateCode: async function(code, output, simulator) {
                if (!code.includes('=')) {
                    return { success: false, message: "❌ Kamu harus menggunakan variabel untuk menyelesaikan soal ini!" };
                }
                if (!code.includes('input(')) {
                    return { success: false, message: "❌ Program harus membaca input berat dari pengguna menggunakan blok 'read float'." };
                }

                const testOutput = await simulator.runSilentTest(code, ["2.5"]);
                if (testOutput.trim() !== "3.0") {
                    return { success: false, message: `❌ Logika programmu salah. Jika diinput 2.5 lalu ditambah 0.5, hasilnya harus 3.0, tapi programmu mencetak: ${testOutput}` };
                }

                return { success: true };
            }
        }
    ];
}
