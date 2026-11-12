/**
 * ============================================================================
 * BANK SOAL TERPUSAT — Blockly Python Simulator
 * ============================================================================
 * Seluruh definisi soal berlevel disimpan di file ini.
 * Logika aplikasi (SimulationManager / LevelManager) hanya membaca data dari sini.
 *
 * Struktur tiap soal:
 * - id               : String unik identitas soal (mis. "L1-S1")
 * - level            : Nomor level (1, 2, 3, 4)
 * - judul_level      : Tema / judul level (mis. "Proyek Jaringan Lab Komputer")
 * - nomor            : Nomor urut soal dalam level (1 s.d. 5)
 * - tipe             : Kategori/jenis soal (mis. "Menampilkan teks")
 * - teks_soal        : Instruksi soal (mendukung tag HTML seperti <strong>, <code>)
 * - hasil_diharapkan : Contoh teks output yang diharapkan (ditampilkan saat evaluasi)
 * - petunjuk_konsep  : Array string berisi petunjuk konseptual
 * - tips_langkah     : Array string berisi langkah-langkah & petunjuk blok
 * - blok_tersedia    : Array nama kategori toolbox yang diizinkan (["Text", "Math", "I/O", ...])
 *                      atau objek kustom { categories: [...], blocks: {...} }
 * - mode_awal        : "kosong" | "preset" | "lanjut"
 *                      - "kosong" : Workspace dibersihkan tanpa blok.
 *                      - "preset" : Workspace dibersihkan lalu diisi dari workspace_awal.
 *                      - "lanjut" : Workspace diisi dari kunci_workspace soal sebelumnya,
 *                                   ditambah/digabung dengan workspace_awal soal ini (bila ada).
 * - workspace_awal   : Objek serialisasi Blockly untuk blok bawaan / blok tambahan / blok salah.
 *                      Jika pada mode "lanjut" properti `timpa_workspace: true` diset, maka
 *                      workspace_awal akan menggantikan kunci_workspace sebelumnya (cocok untuk Soal 5: Memperbaiki program).
 *                      Tiap blok di dalam workspace_awal/kunci_workspace mendukung opsi penguncian:
 *                      `locked: true` atau per-properti `deletable: false`, `movable: false`, `editable: false`.
 * - kunci_workspace  : Objek serialisasi Blockly berisi kunci jawaban soal ini yang akan menjadi
 *                      titik awal bersih bagi soal berikutnya (mode "lanjut").
 * - uji_kasus        : Array minimal 2 kasus uji:
 *                      [ { input: [...], expectedOutput: "...", alternateOutputs: [...], keterangan: "..." }, ... ]
 * - aturan_validasi  : Objek opsional untuk pengecekan struktur dasar (mis. wajib_kode: ["print(", "*"])
 * - bantuan          : Konfigurasi fitur Bantuan (Opsi 1: sorot toolbox -3 poin, Opsi 2: kerangka blok -5 poin)
 *                      Hanya menandai atau memasukkan blok yang perlu ditambah/diubah siswa.
 */

export const QUESTIONS_DATA = [
    // ========================================================================
    // LEVEL 1: Proyek Jaringan Lab Komputer (5 Soal)
    // ========================================================================
    {
        id: "L1-S1",
        level: 1,
        judul_level: "Proyek Jaringan Lab Komputer",
        nomor: 1,
        tipe: "Menampilkan teks",
        teks_soal: `Sekolah akan membangun laboratorium komputer baru. Sistem logistik perlu menampilkan pesan pembuka di layar teknisi. <strong>Tampilkan dua baris teks berikut persis sama, termasuk huruf besar dan tanda baca:</strong> <code>Proyek Jaringan Lab Komputer</code> dan pada baris kedua <code>Mulai perhitungan logistik!</code>`,
        hasil_diharapkan: "Proyek Jaringan Lab Komputer\nMulai perhitungan logistik!",
        petunjuk_konsep: [
            "Satu baris tampilan membutuhkan satu blok cetak.",
            "Teks yang tampil harus sama persis dengan contoh."
        ],
        tips_langkah: [
            "Ambil blok <code>print</code> dari kategori <strong>I/O</strong>, lalu pasang blok teks berisi <code>Proyek Jaringan Lab Komputer</code>.",
            "Tambahkan blok <code>print</code> kedua di bawahnya berisi <code>Mulai perhitungan logistik!</code>."
        ],
        bantuan_teks: `Dua blok <code>print</code> berurutan, masing-masing berisi satu blok teks dengan isi persis seperti contoh.`,
        blok_tersedia: ["Text", "Math", "I/O"],
        mode_awal: "kosong",
        workspace_awal: null,
        kunci_workspace: {
            blocks: {
                languageVersion: 0,
                blocks: [
                    {
                        type: "text_print",
                        id: "l1_s1_print1",
                        x: 40,
                        y: 40,
                        locked: true,
                        inputs: {
                            TEXT: {
                                block: {
                                    type: "text",
                                    id: "l1_s1_text1",
                                    locked: true,
                                    fields: { TEXT: "Proyek Jaringan Lab Komputer" }
                                }
                            }
                        },
                        next: {
                            block: {
                                type: "text_print",
                                id: "l1_s1_print2",
                                locked: true,
                                inputs: {
                                    TEXT: {
                                        block: {
                                            type: "text",
                                            id: "l1_s1_text2",
                                            locked: true,
                                            fields: { TEXT: "Mulai perhitungan logistik!" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        },
        aturan_validasi: {
            wajib_kode: [
                { pola: "print(", pesan: "❌ Kamu harus menggunakan blok cetak (print) dari kategori I/O!" }
            ],
            min_jumlah_print: 2
        },
        uji_kasus: [
            {
                input: [],
                expectedOutput: "Proyek Jaringan Lab Komputer\nMulai perhitungan logistik!",
                keterangan: "Uji tampilan dua baris pesan pembuka sistem logistik"
            },
            {
                input: [],
                expectedOutput: "Proyek Jaringan Lab Komputer\nMulai perhitungan logistik!",
                keterangan: "Verifikasi konsistensi huruf besar, spasi, dan tanda seru"
            }
        ],
        bantuan: {
            teks: `Dua blok <code>print</code> berurutan, masing-masing berisi satu blok teks dengan isi persis seperti contoh.`,
            level1: {
                penalty: 3,
                description: "Menandai kategori I/O (blok print) dan Text (blok teks) untuk menampilkan dua baris pesan pembuka.",
                steps: [
                    {
                        category: "I/O",
                        block: "text_print",
                        instruction: "Buka kategori <strong>I/O</strong>, tarik blok <code>print</code> pertama ke area kerja, lalu ketik <code>Proyek Jaringan Lab Komputer</code>."
                    },
                    {
                        category: "I/O",
                        block: "text_print",
                        instruction: "Tarik blok <code>print</code> kedua dari kategori <strong>I/O</strong> dan sambungkan di bawah blok print pertama, lalu ketik <code>Mulai perhitungan logistik!</code>.",
                        target: { blockType: "text_print", isLast: true, connection: "next" }
                    }
                ]
            },
            level2: {
                penalty: 5,
                description: "Memasukkan dua kerangka blok print dengan slot teks kosong ke area kerja.",
                insert: {
                    type: "text_print",
                    inputs: {
                        TEXT: {
                            block: {
                                type: "text",
                                fields: { TEXT: "" }
                            }
                        }
                    },
                    next: {
                        block: {
                            type: "text_print",
                            inputs: {
                                TEXT: {
                                    block: {
                                        type: "text",
                                        fields: { TEXT: "" }
                                    }
                                }
                            }
                        }
                    }
                },
                markFields: ["TEXT"]
            }
        }
    },

    {
        id: "L1-S2",
        level: 1,
        judul_level: "Proyek Jaringan Lab Komputer",
        nomor: 2,
        tipe: "Menampilkan angka dan hasil hitungan",
        teks_soal: `Teknisi perlu tahu tata letak komputer. Terdapat <strong>4 baris meja</strong>, dan tiap baris akan diisi <strong>8 komputer</strong>. Total komputer didapat dari <strong>4 × 8</strong>. <strong>Tanpa menghapus blok sebelumnya</strong>, tambahkan dua baris di bawahnya dengan format: <code>Target baris meja: 4</code> dan <code>Total komputer: [hasil]</code>. Total komputer harus dihitung dengan blok operasi matematika, bukan diketik langsung hasilnya.`,
        hasil_diharapkan: "Proyek Jaringan Lab Komputer\nMulai perhitungan logistik!\nTarget baris meja: 4\nTotal komputer: 32",
        petunjuk_konsep: [
            "Teks dan angka bisa digabung dalam satu baris tampilan. Blok apa yang menggabungkannya?",
            "Hasil hitungan bisa dipasang langsung ke slot penggabung tanpa disimpan dulu."
        ],
        tips_langkah: [
            "Tarik <code>print</code> baru dengan <code>create text with</code> berisi teks <code>\"Target baris meja: \"</code> dan angka <code>4</code>.",
            "Tarik <code>print</code> baru dengan <code>create text with</code> berisi teks <code>\"Total komputer: \"</code> dan blok perkalian dari kategori <strong>Math</strong> (<code>4 × 8</code>).",
            "Angka bisa dipasang langsung tanpa blok <code>to str</code>."
        ],
        bantuan_teks: `Dua <code>print</code> dengan <code>create text with</code>. Baris pertama teks <code>"Target baris meja: "</code> dan angka <code>4</code>. Baris kedua teks <code>"Total komputer: "</code> dan blok perkalian <code>4 × 8</code>.`,
        blok_tersedia: ["Text", "Math", "I/O"],
        mode_awal: "lanjut",
        workspace_awal: null,
        kunci_workspace: {
            blocks: {
                languageVersion: 0,
                blocks: [
                    {
                        type: "text_print",
                        id: "l1_s1_print1",
                        x: 40,
                        y: 40,
                        locked: true,
                        inputs: {
                            TEXT: {
                                block: {
                                    type: "text",
                                    id: "l1_s1_text1",
                                    locked: true,
                                    fields: { TEXT: "Proyek Jaringan Lab Komputer" }
                                }
                            }
                        },
                        next: {
                            block: {
                                type: "text_print",
                                id: "l1_s1_print2",
                                locked: true,
                                inputs: {
                                    TEXT: {
                                        block: {
                                            type: "text",
                                            id: "l1_s1_text2",
                                            locked: true,
                                            fields: { TEXT: "Mulai perhitungan logistik!" }
                                        }
                                    }
                                },
                                next: {
                                    block: {
                                        type: "text_print",
                                        id: "l1_s2_print3",
                                        locked: true,
                                        inputs: {
                                            TEXT: {
                                                block: {
                                                    type: "text_join",
                                                    id: "l1_s2_join1",
                                                    locked: true,
                                                    extraState: { itemCount: 2 },
                                                    inputs: {
                                                        ADD0: {
                                                            block: {
                                                                type: "text",
                                                                id: "l1_s2_text3",
                                                                locked: true,
                                                                fields: { TEXT: "Target baris meja: " }
                                                            }
                                                        },
                                                        ADD1: {
                                                            block: {
                                                                type: "math_number",
                                                                id: "l1_s2_num1",
                                                                locked: true,
                                                                fields: { NUM: 4 }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        next: {
                                            block: {
                                                type: "text_print",
                                                id: "l1_s2_print4",
                                                locked: true,
                                                inputs: {
                                                    TEXT: {
                                                        block: {
                                                            type: "text_join",
                                                            id: "l1_s2_join2",
                                                            locked: true,
                                                            extraState: { itemCount: 2 },
                                                            inputs: {
                                                                ADD0: {
                                                                    block: {
                                                                        type: "text",
                                                                        id: "l1_s2_text4",
                                                                        locked: true,
                                                                        fields: { TEXT: "Total komputer: " }
                                                                    }
                                                                },
                                                                ADD1: {
                                                                    block: {
                                                                        type: "math_arithmetic",
                                                                        id: "l1_s2_mul",
                                                                        locked: true,
                                                                        fields: { OP: "MULTIPLY" },
                                                                        inputs: {
                                                                            A: {
                                                                                block: {
                                                                                    type: "math_number",
                                                                                    id: "l1_s2_num2",
                                                                                    locked: true,
                                                                                    fields: { NUM: 4 }
                                                                                }
                                             },
                                                                            B: {
                                                                                block: {
                                                                                    type: "math_number",
                                                                                    id: "l1_s2_num3",
                                                                                    locked: true,
                                                                                    fields: { NUM: 8 }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        },
        aturan_validasi: {
            wajib_kode: [
                { pola: "*", pesan: "❌ Total komputer harus dihitung menggunakan blok operasi perkalian (4 × 8) dari kategori Math, bukan diketik langsung hasilnya!" }
            ]
        },
        uji_kasus: [
            {
                input: [],
                expectedOutput: "Proyek Jaringan Lab Komputer\nMulai perhitungan logistik!\nTarget baris meja: 4\nTotal komputer: 32",
                alternateOutputs: [
                    "Target baris meja: 4\nTotal komputer: 32"
                ],
                keterangan: "Uji tampilan pesan pembuka beserta target baris meja dan hasil hitungan total komputer (4 × 8)"
            },
            {
                input: [],
                expectedOutput: "Proyek Jaringan Lab Komputer\nMulai perhitungan logistik!\nTarget baris meja: 4\nTotal komputer: 32",
                alternateOutputs: [
                    "Target baris meja: 4\nTotal komputer: 32"
                ],
                keterangan: "Verifikasi format penggabungan teks dan angka dengan blok perkalian"
            }
        ],
        bantuan: {
            teks: `Dua <code>print</code> dengan <code>create text with</code>. Baris pertama teks <code>"Target baris meja: "</code> dan angka <code>4</code>. Baris kedua teks <code>"Total komputer: "</code> dan blok perkalian <code>4 × 8</code>.`,
            level1: {
                penalty: 3,
                description: "Menandai blok print, create text with, angka, dan perkalian Math secara berurutan.",
                steps: [
                    {
                        category: "I/O",
                        block: "text_print",
                        instruction: "Tarik blok <code>print</code> baru ke bawah blok sebelumnya untuk menampilkan Target baris meja.",
                        target: { type: "next_of_last" }
                    },
                    {
                        category: "Text",
                        block: "text_join",
                        instruction: "Pasang blok <code>create text with</code> ke dalam blok print baru tersebut.",
                        target: { blockType: "text_print", isLast: true, input: "TEXT" }
                    },
                    {
                        category: "Math",
                        block: "math_number",
                        instruction: "Isi slot pertama dengan teks <code>\"Target baris meja: \"</code>, lalu tarik blok angka dari <strong>Math</strong> ke slot kedua dan isi <code>4</code>.",
                        target: { blockType: "text_join", isLast: true, input: "ADD1" }
                    },
                    {
                        category: "I/O",
                        block: "text_print",
                        instruction: "Tarik blok <code>print</code> lagi di paling bawah untuk menampilkan Total komputer.",
                        target: { type: "next_of_last" }
                    },
                    {
                        category: "Text",
                        block: "text_join",
                        instruction: "Pasang blok <code>create text with</code> ke dalam blok print Total komputer.",
                        target: { blockType: "text_print", isLast: true, input: "TEXT" }
                    },
                    {
                        category: "Math",
                        block: "math_arithmetic",
                        instruction: "Isi slot pertama dengan teks <code>\"Total komputer: \"</code>, lalu pasang blok operasi matematika dari <strong>Math</strong> di slot kedua dan ubah menjadi perkalian <code>4 × 8</code>.",
                        target: { blockType: "text_join", isLast: true, input: "ADD1" }
                    }
                ]
            },
            level2: {
                penalty: 5,
                description: "Memasukkan kerangka dua blok print gabungan untuk target baris meja dan perkalian total komputer.",
                insert: {
                    type: "text_print",
                    inputs: {
                        TEXT: {
                            block: {
                                type: "text_join",
                                extraState: { itemCount: 2 },
                                inputs: {
                                    ADD0: { block: { type: "text", fields: { TEXT: "" } } },
                                    ADD1: { block: { type: "math_number", fields: { NUM: 0 } } }
                                }
                            }
                        }
                    },
                    next: {
                        block: {
                            type: "text_print",
                            inputs: {
                                TEXT: {
                                    block: {
                                        type: "text_join",
                                        extraState: { itemCount: 2 },
                                        inputs: {
                                            ADD0: { block: { type: "text", fields: { TEXT: "" } } },
                                            ADD1: {
                                                block: {
                                                    type: "math_arithmetic",
                                                    fields: { OP: "MULTIPLY" },
                                                    inputs: {
                                                        A: { block: { type: "math_number", fields: { NUM: 0 } } },
                                                        B: { block: { type: "math_number", fields: { NUM: 0 } } }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                markFields: ["TEXT", "NUM"]
            }
        }
    },

    {
        id: "L1-S3",
        level: 1,
        judul_level: "Proyek Jaringan Lab Komputer",
        nomor: 3,
        tipe: "Membaca input teks",
        teks_soal: `Sistem perlu mencatat siapa yang bertanggung jawab hari ini. <strong>Blok <code>read text</code> sudah tersedia di workspace tetapi belum tersambung. Tanpa menghapus blok sebelumnya</strong>, minta pengguna memasukkan nama teknisi (teks), lalu tampilkan di baris baru dengan format: <code>Teknisi penanggung jawab: [nama]</code>`,
        hasil_diharapkan: "Proyek Jaringan Lab Komputer\nMulai perhitungan logistik!\nTarget baris meja: 4\nTotal komputer: 32\nTeknisi penanggung jawab: Budi",
        petunjuk_konsep: [
            "Bagian mana dari kalimat konfirmasi yang berubah-ubah tiap orang?",
            "Hasil ketikan pengguna perlu digabung dengan teks tetap."
        ],
        tips_langkah: [
            "Tarik <code>print</code> baru dengan <code>create text with</code> ke bawah program.",
            "Isi slot pertama dengan teks <code>\"Teknisi penanggung jawab: \"</code>.",
            "Ambil blok <code>read text</code> yang sudah tersedia (bukan <code>read int</code>) dan pasang ke slot kedua, karena nama berupa teks."
        ],
        bantuan_teks: `Tambahkan <code>print</code> dengan <code>create text with</code> teks <code>"Teknisi penanggung jawab: "</code> dan <code>read text</code> yang sudah tersedia di workspace.`,
        blok_tersedia: ["Text", "Math", "I/O"],
        mode_awal: "lanjut",
        workspace_awal: {
            blocks: {
                languageVersion: 0,
                blocks: [
                    {
                        type: "python_input",
                        id: "l1_s3_preset_input",
                        x: 420,
                        y: 180,
                        deletable: true,
                        movable: true,
                        editable: true,
                        inputs: {
                            TEXT: {
                                shadow: {
                                    type: "text",
                                    id: "l1_s3_preset_prompt",
                                    fields: { TEXT: "Masukkan nama teknisi:" }
                                }
                            }
                        }
                    }
                ]
            }
        },
        kunci_workspace: {
            blocks: {
                languageVersion: 0,
                blocks: [
                    {
                        type: "text_print",
                        id: "l1_s1_print1",
                        x: 40,
                        y: 40,
                        locked: true,
                        inputs: {
                            TEXT: {
                                block: {
                                    type: "text",
                                    id: "l1_s1_text1",
                                    locked: true,
                                    fields: { TEXT: "Proyek Jaringan Lab Komputer" }
                                }
                            }
                        },
                        next: {
                            block: {
                                type: "text_print",
                                id: "l1_s1_print2",
                                locked: true,
                                inputs: {
                                    TEXT: {
                                        block: {
                                            type: "text",
                                            id: "l1_s1_text2",
                                            locked: true,
                                            fields: { TEXT: "Mulai perhitungan logistik!" }
                                        }
                                    }
                                },
                                next: {
                                    block: {
                                        type: "text_print",
                                        id: "l1_s2_print3",
                                        locked: true,
                                        inputs: {
                                            TEXT: {
                                                block: {
                                                    type: "text_join",
                                                    id: "l1_s2_join1",
                                                    locked: true,
                                                    extraState: { itemCount: 2 },
                                                    inputs: {
                                                        ADD0: {
                                                            block: {
                                                                type: "text",
                                                                id: "l1_s2_text3",
                                                                locked: true,
                                                                fields: { TEXT: "Target baris meja: " }
                                                            }
                                                        },
                                                        ADD1: {
                                                            block: {
                                                                type: "math_number",
                                                                id: "l1_s2_num1",
                                                                locked: true,
                                                                fields: { NUM: 4 }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        next: {
                                            block: {
                                                type: "text_print",
                                                id: "l1_s2_print4",
                                                locked: true,
                                                inputs: {
                                                    TEXT: {
                                                        block: {
                                                            type: "text_join",
                                                            id: "l1_s2_join2",
                                                            locked: true,
                                                            extraState: { itemCount: 2 },
                                                            inputs: {
                                                                ADD0: {
                                                                    block: {
                                                                        type: "text",
                                                                        id: "l1_s2_text4",
                                                                        locked: true,
                                                                        fields: { TEXT: "Total komputer: " }
                                                                    }
                                                                },
                                                                ADD1: {
                                                                    block: {
                                                                        type: "math_arithmetic",
                                                                        id: "l1_s2_mul",
                                                                        locked: true,
                                                                        fields: { OP: "MULTIPLY" },
                                                                        inputs: {
                                                                            A: {
                                                                                block: {
                                                                                    type: "math_number",
                                                                                    id: "l1_s2_num2",
                                                                                    locked: true,
                                                                                    fields: { NUM: 4 }
                                                                                }
                                                                            },
                                                                            B: {
                                                                                block: {
                                                                                    type: "math_number",
                                                                                    id: "l1_s2_num3",
                                                                                    locked: true,
                                                                                    fields: { NUM: 8 }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                },
                                                next: {
                                                    block: {
                                                        type: "text_print",
                                                        id: "l1_s3_print5",
                                                        locked: true,
                                                        inputs: {
                                                            TEXT: {
                                                                block: {
                                                                    type: "text_join",
                                                                    id: "l1_s3_join3",
                                                                    locked: true,
                                                                    extraState: { itemCount: 2 },
                                                                    inputs: {
                                                                        ADD0: {
                                                                            block: {
                                                                                type: "text",
                                                                                id: "l1_s3_text5",
                                                                                locked: true,
                                                                                fields: { TEXT: "Teknisi penanggung jawab: " }
                                                                            }
                                                                        },
                                                                        ADD1: {
                                                                            block: {
                                                                                type: "python_input",
                                                                                id: "l1_s3_input1",
                                                                                locked: true,
                                                                                inputs: {
                                                                                    TEXT: {
                                                                                        shadow: {
                                                                                            type: "text",
                                                                                            id: "l1_s3_prompt1",
                                                                                            fields: { TEXT: "Masukkan nama teknisi:" }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        },
        aturan_validasi: {
            wajib_kode: [
                { pola: "input(", pesan: "❌ Kamu harus menggunakan blok read text untuk membaca nama teknisi!" }
            ]
        },
        uji_kasus: [
            {
                input: ["Budi"],
                expectedOutput: "Proyek Jaringan Lab Komputer\nMulai perhitungan logistik!\nTarget baris meja: 4\nTotal komputer: 32\nTeknisi penanggung jawab: Budi",
                alternateOutputs: [
                    "Teknisi penanggung jawab: Budi"
                ],
                keterangan: "Jika nama teknisi yang diketik adalah \"Budi\""
            },
            {
                input: ["Ani"],
                expectedOutput: "Proyek Jaringan Lab Komputer\nMulai perhitungan logistik!\nTarget baris meja: 4\nTotal komputer: 32\nTeknisi penanggung jawab: Ani",
                alternateOutputs: [
                    "Teknisi penanggung jawab: Ani"
                ],
                keterangan: "Jika nama teknisi yang diketik adalah \"Ani\""
            }
        ],
        bantuan: {
            teks: `Tambahkan <code>print</code> dengan <code>create text with</code> teks <code>"Teknisi penanggung jawab: "</code> dan <code>read text</code> yang sudah tersedia di workspace.`,
            level1: {
                penalty: 3,
                description: "Menandai blok print, create text with, teks, dan read text secara berurutan.",
                steps: [
                    {
                        category: "I/O",
                        block: "text_print",
                        instruction: "Tarik blok <code>print</code> baru dan sambungkan di paling bawah.",
                        target: { type: "next_of_last" }
                    },
                    {
                        category: "Text",
                        block: "text_join",
                        instruction: "Pasang blok <code>create text with</code> ke dalam blok print baru.",
                        target: { blockType: "text_print", isLast: true, input: "TEXT" }
                    },
                    {
                        category: "Text",
                        block: "text",
                        instruction: "Pasang blok teks di slot pertama dan isi dengan <code>Teknisi penanggung jawab: </code> (perhatikan spasi di akhir).",
                        target: { blockType: "text_join", isLast: true, input: "ADD0" }
                    },
                    {
                        category: "I/O",
                        block: "python_input",
                        instruction: "Pasang blok <code>read text</code> yang sudah ada di workspace (atau dari kategori <strong>I/O</strong>) ke slot kedua.",
                        target: { blockType: "text_join", isLast: true, input: "ADD1" }
                    }
                ]
            },
            level2: {
                penalty: 5,
                description: "Memasukkan kerangka blok print gabungan dengan read text ke bawah program.",
                insert: {
                    type: "text_print",
                    inputs: {
                        TEXT: {
                            block: {
                                type: "text_join",
                                extraState: { itemCount: 2 },
                                inputs: {
                                    ADD0: {
                                        block: {
                                            type: "text",
                                            fields: { TEXT: "" }
                                        }
                                    },
                                    ADD1: {
                                        block: {
                                            type: "python_input",
                                            inputs: {
                                                TEXT: {
                                                    shadow: {
                                                        type: "text",
                                                        fields: { TEXT: "Masukkan nama teknisi:" }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                markFields: ["TEXT"]
            }
        }
    },

    {
        id: "L1-S4",
        level: 1,
        judul_level: "Proyek Jaringan Lab Komputer",
        nomor: 4,
        tipe: "Membaca input desimal dan pangkat",
        teks_soal: `Ruang server di lab tersebut berbentuk persegi dan akan dipasangi lantai khusus. Karena ukurannya tidak selalu bulat (bisa ada koma/desimal), gunakan input khusus bilangan desimal. <strong>Tanpa menghapus blok sebelumnya</strong>, minta pengguna memasukkan panjang sisi ruangan (<code>read float</code>), lalu tampilkan luasnya di baris baru dengan format: <code>Luas ruang server: [hasil]</code>. Luas dihitung dengan memangkatkan input sisi dengan <strong>2</strong>. <strong>Gunakan titik, bukan koma, sebagai tanda desimal.</strong> Jika diketik 4.5, hasilnya 20.25.`,
        hasil_diharapkan: "Proyek Jaringan Lab Komputer\nMulai perhitungan logistik!\nTarget baris meja: 4\nTotal komputer: 32\nTeknisi penanggung jawab: Budi\nLuas ruang server: 20.25",
        petunjuk_konsep: [
            "Ukuran desimal tidak bisa dibaca dengan read int. Gunakan blok baca yang tepat untuk pecahan/desimal.",
            "Tanda desimal di pemrograman adalah titik (4.5), bukan koma (4,5).",
            "Luas persegi adalah sisi pangkat 2. Gunakan operator matematika perpangkatan (^)."
        ],
        tips_langkah: [
            "Tarik <code>print</code> baru dengan <code>create text with</code> berisi teks <code>\"Luas ruang server: \"</code>.",
            "Untuk slot kedua pakai blok aritmetika dari <strong>Math</strong>, ubah operatornya menjadi pangkat (<code>^</code>).",
            "Isi sisi kiri pangkat dengan <code>read float</code>, dan sisi kanan dengan angka <code>2</code>."
        ],
        bantuan_teks: `Tambahkan <code>print</code> dengan <code>create text with</code> teks <code>"Luas ruang server: "</code> dan blok pangkat dari <strong>Math</strong> dengan sisi kiri <code>read float</code> dan sisi kanan <code>2</code>.`,
        blok_tersedia: ["Text", "Math", "I/O"],
        mode_awal: "lanjut",
        workspace_awal: null,
        kunci_workspace: {
            blocks: {
                languageVersion: 0,
                blocks: [
                    {
                        type: "text_print",
                        id: "l1_s1_print1",
                        x: 40,
                        y: 40,
                        locked: true,
                        inputs: {
                            TEXT: {
                                block: {
                                    type: "text",
                                    id: "l1_s1_text1",
                                    locked: true,
                                    fields: { TEXT: "Proyek Jaringan Lab Komputer" }
                                }
                            }
                        },
                        next: {
                            block: {
                                type: "text_print",
                                id: "l1_s1_print2",
                                locked: true,
                                inputs: {
                                    TEXT: {
                                        block: {
                                            type: "text",
                                            id: "l1_s1_text2",
                                            locked: true,
                                            fields: { TEXT: "Mulai perhitungan logistik!" }
                                        }
                                    }
                                },
                                next: {
                                    block: {
                                        type: "text_print",
                                        id: "l1_s2_print3",
                                        locked: true,
                                        inputs: {
                                            TEXT: {
                                                block: {
                                                    type: "text_join",
                                                    id: "l1_s2_join1",
                                                    locked: true,
                                                    extraState: { itemCount: 2 },
                                                    inputs: {
                                                        ADD0: {
                                                            block: {
                                                                type: "text",
                                                                id: "l1_s2_text3",
                                                                locked: true,
                                                                fields: { TEXT: "Target baris meja: " }
                                                            }
                                                        },
                                                        ADD1: {
                                                            block: {
                                                                type: "math_number",
                                                                id: "l1_s2_num1",
                                                                locked: true,
                                                                fields: { NUM: 4 }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        next: {
                                            block: {
                                                type: "text_print",
                                                id: "l1_s2_print4",
                                                locked: true,
                                                inputs: {
                                                    TEXT: {
                                                        block: {
                                                            type: "text_join",
                                                            id: "l1_s2_join2",
                                                            locked: true,
                                                            extraState: { itemCount: 2 },
                                                            inputs: {
                                                                ADD0: {
                                                                    block: {
                                                                        type: "text",
                                                                        id: "l1_s2_text4",
                                                                        locked: true,
                                                                        fields: { TEXT: "Total komputer: " }
                                                                    }
                                                                },
                                                                ADD1: {
                                                                    block: {
                                                                        type: "math_arithmetic",
                                                                        id: "l1_s2_mul",
                                                                        locked: true,
                                                                        fields: { OP: "MULTIPLY" },
                                                                        inputs: {
                                                                            A: {
                                                                                block: {
                                                                                    type: "math_number",
                                                                                    id: "l1_s2_num2",
                                                                                    locked: true,
                                                                                    fields: { NUM: 4 }
                                                                                }
                                                                            },
                                                                            B: {
                                                                                block: {
                                                                                    type: "math_number",
                                                                                    id: "l1_s2_num3",
                                                                                    locked: true,
                                                                                    fields: { NUM: 8 }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                },
                                                next: {
                                                    block: {
                                                        type: "text_print",
                                                        id: "l1_s3_print5",
                                                        locked: true,
                                                        inputs: {
                                                            TEXT: {
                                                                block: {
                                                                    type: "text_join",
                                                                    id: "l1_s3_join3",
                                                                    locked: true,
                                                                    extraState: { itemCount: 2 },
                                                                    inputs: {
                                                                        ADD0: {
                                                                            block: {
                                                                                type: "text",
                                                                                id: "l1_s3_text5",
                                                                                locked: true,
                                                                                fields: { TEXT: "Teknisi penanggung jawab: " }
                                                                            }
                                                                        },
                                                                        ADD1: {
                                                                            block: {
                                                                                type: "python_input",
                                                                                id: "l1_s3_input1",
                                                                                locked: true,
                                                                                inputs: {
                                                                                    TEXT: {
                                                                                        shadow: {
                                                                                            type: "text",
                                                                                            id: "l1_s3_prompt1",
                                                                                            fields: { TEXT: "Masukkan nama teknisi:" }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        next: {
                                                            block: {
                                                                type: "text_print",
                                                                id: "l1_s4_print6",
                                                                locked: true,
                                                                inputs: {
                                                                    TEXT: {
                                                                        block: {
                                                                            type: "text_join",
                                                                            id: "l1_s4_join4",
                                                                            locked: true,
                                                                            extraState: { itemCount: 2 },
                                                                            inputs: {
                                                                                ADD0: {
                                                                                    block: {
                                                                                        type: "text",
                                                                                        id: "l1_s4_text6",
                                                                                        locked: true,
                                                                                        fields: { TEXT: "Luas ruang server: " }
                                                                                    }
                                                                                },
                                                                                ADD1: {
                                                                                    block: {
                                                                                        type: "math_arithmetic",
                                                                                        id: "l1_s4_pow",
                                                                                        locked: true,
                                                                                        fields: { OP: "POWER" },
                                                                                        inputs: {
                                                                                            A: {
                                                                                                block: {
                                                                                                    type: "read_float",
                                                                                                    id: "l1_s4_readfloat",
                                                                                                    locked: true,
                                                                                                    inputs: {
                                                                                                        PROMPT: {
                                                                                                            shadow: {
                                                                                                                type: "text",
                                                                                                                id: "l1_s4_prompt2",
                                                                                                                fields: { TEXT: "Masukkan sisi ruangan:" }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            },
                                                                                            B: {
                                                                                                block: {
                                                                                                    type: "math_number",
                                                                                                    id: "l1_s4_num2",
                                                                                                    locked: true,
                                                                                                    fields: { NUM: 2 }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        },
        aturan_validasi: {
            wajib_kode: [
                { pola: "float(input(", pesan: "❌ Ukuran sisi ruangan berupa bilangan desimal. Gunakan blok read float dari kategori I/O!" },
                { pola: "**", pesan: "❌ Hitung luas ruang server dengan memangkatkan sisi dengan 2 menggunakan operator pangkat (^) pada blok Math!" }
            ]
        },
        uji_kasus: [
            {
                input: ["Budi", "4.5"],
                expectedOutput: "Proyek Jaringan Lab Komputer\nMulai perhitungan logistik!\nTarget baris meja: 4\nTotal komputer: 32\nTeknisi penanggung jawab: Budi\nLuas ruang server: 20.25",
                alternateOutputs: [
                    "Teknisi penanggung jawab: Budi\nLuas ruang server: 20.25",
                    "Luas ruang server: 20.25"
                ],
                keterangan: "Jika nama=\"Budi\" dan sisi ruangan=4.5 (4.5 ^ 2 = 20.25)"
            },
            {
                input: ["Ani", "5.0"],
                expectedOutput: "Proyek Jaringan Lab Komputer\nMulai perhitungan logistik!\nTarget baris meja: 4\nTotal komputer: 32\nTeknisi penanggung jawab: Ani\nLuas ruang server: 25.0",
                alternateOutputs: [
                    "Teknisi penanggung jawab: Ani\nLuas ruang server: 25.0",
                    "Luas ruang server: 25.0"
                ],
                keterangan: "Jika nama=\"Ani\" dan sisi ruangan=5.0 (5.0 ^ 2 = 25.0)"
            }
        ],
        bantuan: {
            teks: `Tambahkan <code>print</code> dengan <code>create text with</code> teks <code>"Luas ruang server: "</code> dan blok pangkat dari <strong>Math</strong> dengan sisi kiri <code>read float</code> dan sisi kanan <code>2</code>.`,
            level1: {
                penalty: 3,
                description: "Menandai blok print, create text with, pangkat Math (^), dan read float secara berurutan.",
                steps: [
                    {
                        category: "I/O",
                        block: "text_print",
                        instruction: "Tarik blok <code>print</code> baru ke bagian paling bawah.",
                        target: { type: "next_of_last" }
                    },
                    {
                        category: "Text",
                        block: "text_join",
                        instruction: "Pasang blok <code>create text with</code> ke dalam blok print tersebut.",
                        target: { blockType: "text_print", isLast: true, input: "TEXT" }
                    },
                    {
                        category: "Math",
                        block: "math_arithmetic",
                        instruction: "Isi slot pertama dengan teks <code>\"Luas ruang server: \"</code>, lalu pasang blok operasi matematika (ubah operatornya menjadi pangkat <code>^</code>) di slot kedua.",
                        target: { blockType: "text_join", isLast: true, input: "ADD1" }
                    },
                    {
                        category: "I/O",
                        block: "read_float",
                        instruction: "Pasang blok <code>read float</code> ke sisi kiri pangkat, dan angka <code>2</code> ke sisi kanan pangkat.",
                        target: { blockType: "math_arithmetic", isLast: true, input: "A" }
                    }
                ]
            },
            level2: {
                penalty: 5,
                description: "Memasukkan kerangka blok print Luas ruang server dengan operasi pangkat read float.",
                insert: {
                    type: "text_print",
                    inputs: {
                        TEXT: {
                            block: {
                                type: "text_join",
                                extraState: { itemCount: 2 },
                                inputs: {
                                    ADD0: { block: { type: "text", fields: { TEXT: "" } } },
                                    ADD1: {
                                        block: {
                                            type: "math_arithmetic",
                                            fields: { OP: "POWER" },
                                            inputs: {
                                                A: {
                                                    block: {
                                                        type: "read_float",
                                                        inputs: {
                                                            PROMPT: {
                                                                shadow: { type: "text", fields: { TEXT: "Masukkan sisi ruangan:" } }
                                                            }
                                                        }
                                                    }
                                                },
                                                B: {
                                                    block: { type: "math_number", fields: { NUM: 0 } }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                markFields: ["TEXT", "NUM"]
            }
        }
    },

    {
        id: "L1-S5",
        level: 1,
        judul_level: "Proyek Jaringan Lab Komputer",
        nomor: 5,
        tipe: "Menerapkan (lanjutan)",
        teks_soal: `Kabel dari seluruh komputer akan dihubungkan ke alat bernama Switch Hub. Setiap Switch Hub memiliki tepat 24 colokan (port). Teknisi ingin tahu ada berapa colokan yang terpakai di alat yang terakhir (sisa baginya). <strong>Tanpa menghapus blok sebelumnya</strong>, minta pengguna memasukkan <strong>merek switch (teks)</strong> dan <strong>total kabel terpasang (angka bulat)</strong>, lalu tampilkan di baris baru dengan format: <code>Merek switch: [merek]</code> dan <code>Port di switch terakhir: [sisa]</code>. Sisa dihitung menggunakan operasi sisa bagi (modulo / remainder) dari total kabel dibagi 24. Jika diketik Cisco dan 50, maka port tersisa di alat terakhir adalah 2 (karena 50 dibagi 24 bersisa 2).`,
        hasil_diharapkan: "Proyek Jaringan Lab Komputer\nMulai perhitungan logistik!\nTarget baris meja: 4\nTotal komputer: 32\nTeknisi penanggung jawab: Budi\nLuas ruang server: 20.25\nMerek switch: Cisco\nPort di switch terakhir: 2",
        petunjuk_konsep: [
            "Merek switch berupa teks, sedangkan total kabel berupa angka bulat.",
            "Sisa colokan yang tidak genap 1 mesin penuh bisa didapat dengan operator sisa bagi (remainder).",
            "Hasil hitungan sisa bagi bisa langsung dipasang ke penggabung teks."
        ],
        tips_langkah: [
            "Tambahkan dua <code>print</code> baru di bawah program, satu untuk merek dan satu untuk port tersisa.",
            "Isi merek dengan <code>read text</code>, dan port tersisa dengan blok <code>remainder of</code> (sisa bagi) yang sisi kirinya diisi <code>read int</code> dan sisi kanannya angka <code>24</code>.",
            "Jalankan dengan input contoh dan cocokkan seluruh baris."
        ],
        bantuan_teks: `Tambahkan <code>print</code> dengan <code>create text with</code> teks <code>"Merek switch: "</code> dan <code>read text</code>. Tambahkan <code>print</code> dengan <code>create text with</code> teks <code>"Port di switch terakhir: "</code> dan blok sisa bagi <code>remainder of</code> (dari kategori <strong>Math</strong>), isi sisi kirinya dengan <code>read int</code> dan sisi kanannya <code>24</code>.`,
        blok_tersedia: ["Text", "Math", "I/O"],
        mode_awal: "lanjut",
        workspace_awal: null,
        kunci_workspace: {
            blocks: {
                languageVersion: 0,
                blocks: [
                    {
                        type: "text_print",
                        id: "l1_s1_print1",
                        x: 40,
                        y: 40,
                        locked: true,
                        inputs: {
                            TEXT: {
                                block: {
                                    type: "text",
                                    id: "l1_s1_text1",
                                    locked: true,
                                    fields: { TEXT: "Proyek Jaringan Lab Komputer" }
                                }
                            }
                        },
                        next: {
                            block: {
                                type: "text_print",
                                id: "l1_s1_print2",
                                locked: true,
                                inputs: {
                                    TEXT: {
                                        block: {
                                            type: "text",
                                            id: "l1_s1_text2",
                                            locked: true,
                                            fields: { TEXT: "Mulai perhitungan logistik!" }
                                        }
                                    }
                                },
                                next: {
                                    block: {
                                        type: "text_print",
                                        id: "l1_s2_print3",
                                        locked: true,
                                        inputs: {
                                            TEXT: {
                                                block: {
                                                    type: "text_join",
                                                    id: "l1_s2_join1",
                                                    locked: true,
                                                    extraState: { itemCount: 2 },
                                                    inputs: {
                                                        ADD0: {
                                                            block: {
                                                                type: "text",
                                                                id: "l1_s2_text3",
                                                                locked: true,
                                                                fields: { TEXT: "Target baris meja: " }
                                                            }
                                                        },
                                                        ADD1: {
                                                            block: {
                                                                type: "math_number",
                                                                id: "l1_s2_num1",
                                                                locked: true,
                                                                fields: { NUM: 4 }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        next: {
                                            block: {
                                                type: "text_print",
                                                id: "l1_s2_print4",
                                                locked: true,
                                                inputs: {
                                                    TEXT: {
                                                        block: {
                                                            type: "text_join",
                                                            id: "l1_s2_join2",
                                                            locked: true,
                                                            extraState: { itemCount: 2 },
                                                            inputs: {
                                                                ADD0: {
                                                                    block: {
                                                                        type: "text",
                                                                        id: "l1_s2_text4",
                                                                        locked: true,
                                                                        fields: { TEXT: "Total komputer: " }
                                                                    }
                                                                },
                                                                ADD1: {
                                                                    block: {
                                                                        type: "math_arithmetic",
                                                                        id: "l1_s2_mul",
                                                                        locked: true,
                                                                        fields: { OP: "MULTIPLY" },
                                                                        inputs: {
                                                                            A: {
                                                                                block: {
                                                                                    type: "math_number",
                                                                                    id: "l1_s2_num2",
                                                                                    locked: true,
                                                                                    fields: { NUM: 4 }
                                                                                }
                                                                            },
                                                                            B: {
                                                                                block: {
                                                                                    type: "math_number",
                                                                                    id: "l1_s2_num3",
                                                                                    locked: true,
                                                                                    fields: { NUM: 8 }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                },
                                                next: {
                                                    block: {
                                                        type: "text_print",
                                                        id: "l1_s3_print5",
                                                        locked: true,
                                                        inputs: {
                                                            TEXT: {
                                                                block: {
                                                                    type: "text_join",
                                                                    id: "l1_s3_join3",
                                                                    locked: true,
                                                                    extraState: { itemCount: 2 },
                                                                    inputs: {
                                                                        ADD0: {
                                                                            block: {
                                                                                type: "text",
                                                                                id: "l1_s3_text5",
                                                                                locked: true,
                                                                                fields: { TEXT: "Teknisi penanggung jawab: " }
                                                                            }
                                                                        },
                                                                        ADD1: {
                                                                            block: {
                                                                                type: "python_input",
                                                                                id: "l1_s3_input1",
                                                                                locked: true,
                                                                                inputs: {
                                                                                    TEXT: {
                                                                                        shadow: {
                                                                                            type: "text",
                                                                                            id: "l1_s3_prompt1",
                                                                                            fields: { TEXT: "Masukkan nama teknisi:" }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        next: {
                                                            block: {
                                                                type: "text_print",
                                                                id: "l1_s4_print6",
                                                                locked: true,
                                                                inputs: {
                                                                    TEXT: {
                                                                        block: {
                                                                            type: "text_join",
                                                                            id: "l1_s4_join4",
                                                                            locked: true,
                                                                            extraState: { itemCount: 2 },
                                                                            inputs: {
                                                                                ADD0: {
                                                                                    block: {
                                                                                        type: "text",
                                                                                        id: "l1_s4_text6",
                                                                                        locked: true,
                                                                                        fields: { TEXT: "Luas ruang server: " }
                                                                                    }
                                                                                },
                                                                                ADD1: {
                                                                                    block: {
                                                                                        type: "math_arithmetic",
                                                                                        id: "l1_s4_pow",
                                                                                        locked: true,
                                                                                        fields: { OP: "POWER" },
                                                                                        inputs: {
                                                                                            A: {
                                                                                                block: {
                                                                                                    type: "read_float",
                                                                                                    id: "l1_s4_readfloat",
                                                                                                    locked: true,
                                                                                                    inputs: {
                                                                                                        PROMPT: {
                                                                                                            shadow: {
                                                                                                                type: "text",
                                                                                                                id: "l1_s4_prompt2",
                                                                                                                fields: { TEXT: "Masukkan sisi ruangan:" }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            },
                                                                                            B: {
                                                                                                block: {
                                                                                                    type: "math_number",
                                                                                                    id: "l1_s4_num2",
                                                                                                    locked: true,
                                                                                                    fields: { NUM: 2 }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                },
                                                                next: {
                                                                    block: {
                                                                        type: "text_print",
                                                                        id: "l1_s5_print7",
                                                                        locked: true,
                                                                        inputs: {
                                                                            TEXT: {
                                                                                block: {
                                                                                    type: "text_join",
                                                                                    id: "l1_s5_join5",
                                                                                    locked: true,
                                                                                    extraState: { itemCount: 2 },
                                                                                    inputs: {
                                                                                        ADD0: {
                                                                                            block: {
                                                                                                type: "text",
                                                                                                id: "l1_s5_text7",
                                                                                                locked: true,
                                                                                                fields: { TEXT: "Merek switch: " }
                                                                                            }
                                                                                        },
                                                                                        ADD1: {
                                                                                            block: {
                                                                                                type: "python_input",
                                                                                                id: "l1_s5_input_merek",
                                                                                                locked: true,
                                                                                                inputs: {
                                                                                                    TEXT: {
                                                                                                        shadow: {
                                                                                                            type: "text",
                                                                                                            fields: { TEXT: "Masukkan merek switch:" }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        },
                                                                        next: {
                                                                            block: {
                                                                                type: "text_print",
                                                                                id: "l1_s5_print8",
                                                                                locked: true,
                                                                                inputs: {
                                                                                    TEXT: {
                                                                                        block: {
                                                                                            type: "text_join",
                                                                                            id: "l1_s5_join6",
                                                                                            locked: true,
                                                                                            extraState: { itemCount: 2 },
                                                                                            inputs: {
                                                                                                ADD0: {
                                                                                                    block: {
                                                                                                        type: "text",
                                                                                                        id: "l1_s5_text8",
                                                                                                        locked: true,
                                                                                                        fields: { TEXT: "Port di switch terakhir: " }
                                                                                                    }
                                                                                                },
                                                                                                ADD1: {
                                                                                                    block: {
                                                                                                        type: "math_modulo",
                                                                                                        id: "l1_s5_modulo",
                                                                                                        locked: true,
                                                                                                        inputs: {
                                                                                                            DIVIDEND: {
                                                                                                                block: {
                                                                                                                    type: "read_number",
                                                                                                                    id: "l1_s5_readint_kabel",
                                                                                                                    locked: true,
                                                                                                                    inputs: {
                                                                                                                        PROMPT: {
                                                                                                                            shadow: {
                                                                                                                                type: "text",
                                                                                                                                fields: { TEXT: "Masukkan total kabel:" }
                                                                                                                            }
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                            },
                                                                                                            DIVISOR: {
                                                                                                                block: {
                                                                                                                    type: "math_number",
                                                                                                                    id: "l1_s5_num24",
                                                                                                                    locked: true,
                                                                                                                    fields: { NUM: 24 }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        },
        aturan_validasi: {
            min_jumlah_print: 2,
            wajib_kode: [
                { pola: "int(input(", pesan: "❌ Total kabel berupa angka bulat. Gunakan blok read int dari kategori I/O!" },
                { pola: "%", pesan: "❌ Hitung sisa bagi menggunakan blok remainder of dari kategori Math!" }
            ]
        },
        uji_kasus: [
            {
                input: ["Budi", "4.5", "Cisco", "50"],
                expectedOutput: "Proyek Jaringan Lab Komputer\nMulai perhitungan logistik!\nTarget baris meja: 4\nTotal komputer: 32\nTeknisi penanggung jawab: Budi\nLuas ruang server: 20.25\nMerek switch: Cisco\nPort di switch terakhir: 2",
                alternateOutputs: [
                    "Proyek Jaringan Lab Komputer\nMulai perhitungan logistik!\nTarget baris meja: 4\nTotal komputer: 32\nTeknisi penanggung jawab: Budi\nLuas ruang server: 20.25\nMerek switch: Cisco\nKabel di switch yang belum penuh: 2",
                    "Merek switch: Cisco\nPort di switch terakhir: 2",
                    "Merek switch: Cisco\nKabel di switch yang belum penuh: 2",
                    "Teknisi penanggung jawab: Budi\nLuas ruang server: 20.25\nMerek switch: Cisco\nPort di switch terakhir: 2",
                    "Teknisi penanggung jawab: Budi\nLuas ruang server: 20.25\nMerek switch: Cisco\nKabel di switch yang belum penuh: 2"
                ],
                keterangan: "Jika diketik Budi, 4.5, Cisco, dan 50 (50 % 24 = 2)"
            },
            {
                input: ["Ani", "5.0", "TP-Link", "48"],
                expectedOutput: "Proyek Jaringan Lab Komputer\nMulai perhitungan logistik!\nTarget baris meja: 4\nTotal komputer: 32\nTeknisi penanggung jawab: Ani\nLuas ruang server: 25.0\nMerek switch: TP-Link\nPort di switch terakhir: 0",
                alternateOutputs: [
                    "Proyek Jaringan Lab Komputer\nMulai perhitungan logistik!\nTarget baris meja: 4\nTotal komputer: 32\nTeknisi penanggung jawab: Ani\nLuas ruang server: 25.0\nMerek switch: TP-Link\nKabel di switch yang belum penuh: 0",
                    "Merek switch: TP-Link\nPort di switch terakhir: 0",
                    "Merek switch: TP-Link\nKabel di switch yang belum penuh: 0",
                    "Teknisi penanggung jawab: Ani\nLuas ruang server: 25.0\nMerek switch: TP-Link\nPort di switch terakhir: 0",
                    "Teknisi penanggung jawab: Ani\nLuas ruang server: 25.0\nMerek switch: TP-Link\nKabel di switch yang belum penuh: 0"
                ],
                keterangan: "Jika diketik Ani, 5.0, TP-Link, dan 48 (48 % 24 = 0)"
            }
        ],
        bantuan: {
            teks: `Tambahkan <code>print</code> dengan <code>create text with</code> teks <code>"Merek switch: "</code> dan <code>read text</code>. Tambahkan <code>print</code> dengan <code>create text with</code> teks <code>"Port di switch terakhir: "</code> dan blok sisa bagi <code>remainder of</code> (dari kategori <strong>Math</strong>), isi sisi kirinya dengan <code>read int</code> dan sisi kanannya <code>24</code>.`,
            level1: {
                penalty: 3,
                description: "Menandai blok print, create text with, read text, remainder of (Math), dan read int secara berurutan.",
                steps: [
                    {
                        category: "I/O",
                        block: "text_print",
                        instruction: "Buka kategori <strong>I/O</strong>, tarik blok <code>print</code> pertama dan sambungkan di paling bawah program.",
                        target: { type: "next_of_last" }
                    },
                    {
                        category: "Text",
                        block: "text_join",
                        instruction: "Buka kategori <strong>Text</strong>, tarik blok <code>create text with</code> ke dalam blok <code>print</code> pertama.",
                        target: { blockType: "text_print", isLast: true, input: "TEXT" }
                    },
                    {
                        category: "Text",
                        block: "text",
                        instruction: "Tarik blok teks <code>\" \"</code> ke slot pertama <code>create text with</code>, lalu ketik <code>Merek switch: </code> (perhatikan spasi di akhir).",
                        target: { blockType: "text_join", isLast: true, input: "ADD0" }
                    },
                    {
                        category: "I/O",
                        block: "python_input",
                        instruction: "Buka kategori <strong>I/O</strong>, tarik blok <code>read text</code> ke slot kedua <code>create text with</code>.",
                        target: { blockType: "text_join", isLast: true, input: "ADD1" }
                    },
                    {
                        category: "I/O",
                        block: "text_print",
                        instruction: "Tarik blok <code>print</code> kedua dari kategori <strong>I/O</strong> dan sambungkan di paling bawah.",
                        target: { type: "next_of_last" }
                    },
                    {
                        category: "Text",
                        block: "text_join",
                        instruction: "Buka kategori <strong>Text</strong>, tarik blok <code>create text with</code> ke dalam <code>print</code> kedua, lalu isi slot pertamanya dengan teks <code>\"Port di switch terakhir: \"</code>.",
                        target: { blockType: "text_print", isLast: true, input: "TEXT" }
                    },
                    {
                        category: "Math",
                        block: "math_modulo",
                        instruction: "Buka kategori <strong>Math</strong>, tarik blok <code>remainder of</code> (sisa bagi) ke slot kedua <code>create text with</code>, lalu isi sisi kanannya dengan angka <code>24</code>.",
                        target: { blockType: "text_join", isLast: true, input: "ADD1" }
                    },
                    {
                        category: "I/O",
                        block: "read_number",
                        instruction: "Buka kategori <strong>I/O</strong>, tarik blok <code>read int</code> ke sisi kiri <code>remainder of</code> untuk membaca total kabel terpasang.",
                        target: { blockType: "math_modulo", isLast: true, input: "DIVIDEND" }
                    }
                ]
            },
            level2: {
                penalty: 5,
                description: "Memasukkan kerangka dua blok print untuk Merek switch (read text) dan Port di switch terakhir (remainder of).",
                insert: {
                    type: "text_print",
                    inputs: {
                        TEXT: {
                            block: {
                                type: "text_join",
                                extraState: { itemCount: 2 },
                                inputs: {
                                    ADD0: { block: { type: "text", fields: { TEXT: "" } } },
                                    ADD1: {
                                        block: {
                                            type: "python_input",
                                            inputs: { TEXT: { shadow: { type: "text", fields: { TEXT: "Masukkan merek switch:" } } } }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    next: {
                        block: {
                            type: "text_print",
                            inputs: {
                                TEXT: {
                                    block: {
                                        type: "text_join",
                                        extraState: { itemCount: 2 },
                                        inputs: {
                                            ADD0: { block: { type: "text", fields: { TEXT: "" } } },
                                            ADD1: {
                                                block: {
                                                    type: "math_modulo",
                                                    inputs: {
                                                        DIVIDEND: {
                                                            block: {
                                                                type: "read_number",
                                                                inputs: { PROMPT: { shadow: { type: "text", fields: { TEXT: "Masukkan total kabel:" } } } }
                                                            }
                                                        },
                                                        DIVISOR: { block: { type: "math_number", fields: { NUM: 0 } } }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                markFields: ["TEXT", "NUM"]
            }
        }
    },

    // ========================================================================
    // LEVEL 2: Koperasi Sekolah (5 Soal)
    // ========================================================================
    {
        id: "L2-S1",
        level: 2,
        judul_level: "Koperasi Sekolah",
        nomor: 1,
        tipe: "Menyimpan data ke variabel",
        teks_soal: `Koperasi sekolah menjual pulpen dan petugasnya ingin data barang tersimpan rapi di program. Harga satu pulpen <strong>2500</strong> dan stok yang tersedia <strong>40</strong> buah. Simpan keduanya ke dalam variabel bernama <code>harga</code> dan <code>stok</code>, lalu tampilkan dengan format: <code>Harga pulpen: [harga]</code> dan <code>Stok pulpen: [stok]</code>`,
        hasil_diharapkan: "Harga pulpen: 2500\nStok pulpen: 40",
        petunjuk_konsep: [
            "Nilai yang disimpan perlu wadah bernama sebelum bisa ditampilkan. Blok apa yang membuat wadah itu?",
            "Tampilan akhir menggabungkan teks tetap dengan isi variabel."
        ],
        tips_langkah: [
            "Buka kategori <strong>Variables</strong>, lalu buat variabel baru bernama <code>harga</code> dan <code>stok</code>.",
            "Tarik <code>set [harga] to</code> berisi <code>2500</code>, dan <code>set [stok] to</code> berisi <code>40</code>.",
            "Tambahkan dua blok <code>print</code>, masing-masing berisi <code>create text with</code> teks dan variabelnya."
        ],
        blok_tersedia: ["Text", "Math", "I/O", "Variables"],
        mode_awal: "kosong",
        workspace_awal: null,
        kunci_workspace: {
            variables: [
                { name: "harga", id: "var_harga" },
                { name: "stok", id: "var_stok" }
            ],
            blocks: {
                languageVersion: 0,
                blocks: [
                    {
                        type: "variables_set",
                        id: "l2_s1_set_harga",
                        x: 40,
                        y: 40,
                        locked: true,
                        fields: { VAR: { id: "var_harga", name: "harga" } },
                        inputs: {
                            VALUE: {
                                block: {
                                    type: "math_number",
                                    id: "l2_s1_num_harga",
                                    locked: true,
                                    fields: { NUM: 2500 }
                                }
                            }
                        },
                        next: {
                            block: {
                                type: "variables_set",
                                id: "l2_s1_set_stok",
                                locked: true,
                                fields: { VAR: { id: "var_stok", name: "stok" } },
                                inputs: {
                                    VALUE: {
                                        block: {
                                            type: "math_number",
                                            id: "l2_s1_num_stok",
                                            locked: true,
                                            fields: { NUM: 40 }
                                        }
                                    }
                                },
                                next: {
                                    block: {
                                        type: "text_print",
                                        id: "l2_s1_print_harga",
                                        locked: true,
                                        inputs: {
                                            TEXT: {
                                                block: {
                                                    type: "text_join",
                                                    id: "l2_s1_join_harga",
                                                    locked: true,
                                                    extraState: { itemCount: 2 },
                                                    inputs: {
                                                        ADD0: {
                                                            block: {
                                                                type: "text",
                                                                id: "l2_s1_txt_harga",
                                                                locked: true,
                                                                fields: { TEXT: "Harga pulpen: " }
                                                            }
                                                        },
                                                        ADD1: {
                                                            block: {
                                                                type: "variables_get",
                                                                id: "l2_s1_get_harga",
                                                                locked: true,
                                                                fields: { VAR: { id: "var_harga", name: "harga" } }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        next: {
                                            block: {
                                                type: "text_print",
                                                id: "l2_s1_print_stok",
                                                locked: true,
                                                inputs: {
                                                    TEXT: {
                                                        block: {
                                                            type: "text_join",
                                                            id: "l2_s1_join_stok",
                                                            locked: true,
                                                            extraState: { itemCount: 2 },
                                                            inputs: {
                                                                ADD0: {
                                                                    block: {
                                                                        type: "text",
                                                                        id: "l2_s1_txt_stok",
                                                                        locked: true,
                                                                        fields: { TEXT: "Stok pulpen: " }
                                                                    }
                                                                },
                                                                ADD1: {
                                                                    block: {
                                                                        type: "variables_get",
                                                                        id: "l2_s1_get_stok",
                                                                        locked: true,
                                                                        fields: { VAR: { id: "var_stok", name: "stok" } }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        },
        aturan_validasi: {
            wajib_kode: [
                { pola: "harga =", pesan: "❌ Buat dan isi variabel bernama 'harga' menggunakan blok set [harga] to!" },
                { pola: "stok =", pesan: "❌ Buat dan isi variabel bernama 'stok' menggunakan blok set [stok] to!" }
            ]
        },
        uji_kasus: [
            {
                input: [],
                expectedOutput: "Harga pulpen: 2500\nStok pulpen: 40",
                keterangan: "Menampilkan nilai variabel harga (2500) dan stok (40)"
            },
            {
                input: [],
                expectedOutput: "Harga pulpen: 2500\nStok pulpen: 40",
                keterangan: "Verifikasi penyimpanan variabel harga dan stok"
            }
        ],
        bantuan: {
            level1: {
                penalty: 3,
                description: "Menandai kategori Variables, Math, I/O, dan Text secara berurutan.",
                steps: [
                    {
                        category: "Variables",
                        block: "variables_set",
                        variableName: "harga",
                        instruction: "Buka kategori <strong>Variables</strong>, tarik blok <code>set [harga] to</code> ke area kerja dan isi dengan angka <code>2500</code> dari kategori <strong>Math</strong>."
                    },
                    {
                        category: "Variables",
                        block: "variables_set",
                        variableName: "stok",
                        instruction: "Tarik blok <code>set [stok] to</code> di bawahnya dan isi dengan angka <code>40</code>.",
                        target: { blockType: "variables_set", isLast: true, connection: "next" }
                    },
                    {
                        category: "I/O",
                        block: "text_print",
                        instruction: "Tarik blok <code>print</code> pertama dari kategori <strong>I/O</strong> di bawah <code>set [stok]</code>.",
                        target: { type: "next_of_last" }
                    },
                    {
                        category: "Text",
                        block: "text_join",
                        instruction: "Pasang <code>create text with</code> dari kategori <strong>Text</strong> ke dalam <code>print</code> pertama, lalu isi slot pertama dengan teks <code>\"Harga pulpen: \"</code>.",
                        target: { blockType: "text_print", isLast: true, input: "TEXT" }
                    },
                    {
                        category: "Variables",
                        block: "variables_get",
                        variableName: "harga",
                        instruction: "Buka kategori <strong>Variables</strong>, tarik blok variabel <code>harga</code> ke slot kedua <code>create text with</code>.",
                        target: { blockType: "text_join", isLast: true, input: "ADD1" }
                    },
                    {
                        category: "I/O",
                        block: "text_print",
                        instruction: "Tarik blok <code>print</code> kedua di paling bawah, pasang <code>create text with</code> berisi teks <code>\"Stok pulpen: \"</code> dan variabel <code>stok</code>.",
                        target: { type: "next_of_last" }
                    }
                ]
            },
            level2: {
                penalty: 5,
                description: "Memasukkan kerangka variabel harga & stok beserta dua blok print ke area kerja.",
                insert: {
                    type: "variables_set",
                    fields: { VAR: { name: "harga" } },
                    inputs: { VALUE: { block: { type: "math_number", fields: { NUM: 0 } } } },
                    next: {
                        block: {
                            type: "variables_set",
                            fields: { VAR: { name: "stok" } },
                            inputs: { VALUE: { block: { type: "math_number", fields: { NUM: 0 } } } },
                            next: {
                                block: {
                                    type: "text_print",
                                    inputs: {
                                        TEXT: {
                                            block: {
                                                type: "text_join",
                                                extraState: { itemCount: 2 },
                                                inputs: {
                                                    ADD0: { block: { type: "text", fields: { TEXT: "" } } },
                                                    ADD1: { block: { type: "variables_get", fields: { VAR: { name: "harga" } } } }
                                                }
                                            }
                                        }
                                    },
                                    next: {
                                        block: {
                                            type: "text_print",
                                            inputs: {
                                                TEXT: {
                                                    block: {
                                                        type: "text_join",
                                                        extraState: { itemCount: 2 },
                                                        inputs: {
                                                            ADD0: { block: { type: "text", fields: { TEXT: "" } } },
                                                            ADD1: { block: { type: "variables_get", fields: { VAR: { name: "stok" } } } }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                markFields: ["NUM", "TEXT"]
            }
        }
    },

    {
        id: "L2-S2",
        level: 2,
        judul_level: "Koperasi Sekolah",
        nomor: 2,
        tipe: "Menghitung dengan variabel",
        teks_soal: `Seorang siswa datang untuk membeli beberapa pulpen. Petugas perlu tahu total yang harus dibayar. <strong>Tanpa menghapus blok sebelumnya</strong>, buat variabel <code>jumlah</code> bernilai <strong>6</strong> dan variabel <code>total</code> yang berisi <code>harga</code> dikali <code>jumlah</code>. Tampilkan di baris baru dengan format: <code>Total belanja: [total]</code>`,
        hasil_diharapkan: "Harga pulpen: 2500\nStok pulpen: 40\nTotal belanja: 15000",
        petunjuk_konsep: [
            "Variabel bisa dipakai di dalam rumus variabel lain.",
            "Pastikan harga dan jumlah sudah terisi sebelum total dihitung."
        ],
        tips_langkah: [
            "Buat variabel <code>jumlah</code> dan <code>total</code>, lalu atur <code>jumlah</code> ke <code>6</code>.",
            "Isi <code>total</code> dengan blok perkalian dari kategori <strong>Math</strong> (<code>harga × jumlah</code>).",
            "Tambahkan <code>print</code> berisi teks <code>\"Total belanja: \"</code> dan variabel <code>total</code>."
        ],
        blok_tersedia: ["Text", "Math", "I/O", "Variables"],
        mode_awal: "lanjut",
        workspace_awal: null,
        kunci_workspace: {
            variables: [
                { name: "harga", id: "var_harga" },
                { name: "stok", id: "var_stok" },
                { name: "jumlah", id: "var_jumlah" },
                { name: "total", id: "var_total" }
            ],
            blocks: {
                languageVersion: 0,
                blocks: [
                    {
                        type: "variables_set",
                        id: "l2_s1_set_harga",
                        x: 40,
                        y: 40,
                        locked: true,
                        fields: { VAR: { id: "var_harga", name: "harga" } },
                        inputs: {
                            VALUE: { block: { type: "math_number", id: "l2_s1_num_harga", locked: true, fields: { NUM: 2500 } } }
                        },
                        next: {
                            block: {
                                type: "variables_set",
                                id: "l2_s1_set_stok",
                                locked: true,
                                fields: { VAR: { id: "var_stok", name: "stok" } },
                                inputs: {
                                    VALUE: { block: { type: "math_number", id: "l2_s1_num_stok", locked: true, fields: { NUM: 40 } } }
                                },
                                next: {
                                    block: {
                                        type: "text_print",
                                        id: "l2_s1_print_harga",
                                        locked: true,
                                        inputs: {
                                            TEXT: {
                                                block: {
                                                    type: "text_join",
                                                    id: "l2_s1_join_harga",
                                                    locked: true,
                                                    extraState: { itemCount: 2 },
                                                    inputs: {
                                                        ADD0: { block: { type: "text", id: "l2_s1_txt_harga", locked: true, fields: { TEXT: "Harga pulpen: " } } },
                                                        ADD1: { block: { type: "variables_get", id: "l2_s1_get_harga", locked: true, fields: { VAR: { id: "var_harga", name: "harga" } } } }
                                                    }
                                                }
                                            }
                                        },
                                        next: {
                                            block: {
                                                type: "text_print",
                                                id: "l2_s1_print_stok",
                                                locked: true,
                                                inputs: {
                                                    TEXT: {
                                                        block: {
                                                            type: "text_join",
                                                            id: "l2_s1_join_stok",
                                                            locked: true,
                                                            extraState: { itemCount: 2 },
                                                            inputs: {
                                                                ADD0: { block: { type: "text", id: "l2_s1_txt_stok", locked: true, fields: { TEXT: "Stok pulpen: " } } },
                                                                ADD1: { block: { type: "variables_get", id: "l2_s1_get_stok", locked: true, fields: { VAR: { id: "var_stok", name: "stok" } } } }
                                                            }
                                                        }
                                                    }
                                                },
                                                next: {
                                                    block: {
                                                        type: "variables_set",
                                                        id: "l2_s2_set_jumlah",
                                                        locked: true,
                                                        fields: { VAR: { id: "var_jumlah", name: "jumlah" } },
                                                        inputs: {
                                                            VALUE: { block: { type: "math_number", id: "l2_s2_num_jumlah", locked: true, fields: { NUM: 6 } } }
                                                        },
                                                        next: {
                                                            block: {
                                                                type: "variables_set",
                                                                id: "l2_s2_set_total",
                                                                locked: true,
                                                                fields: { VAR: { id: "var_total", name: "total" } },
                                                                inputs: {
                                                                    VALUE: {
                                                                        block: {
                                                                            type: "math_arithmetic",
                                                                            id: "l2_s2_mul_total",
                                                                            locked: true,
                                                                            fields: { OP: "MULTIPLY" },
                                                                            inputs: {
                                                                                A: { block: { type: "variables_get", id: "l2_s2_get_harga", locked: true, fields: { VAR: { id: "var_harga", name: "harga" } } } },
                                                                                B: { block: { type: "variables_get", id: "l2_s2_get_jumlah", locked: true, fields: { VAR: { id: "var_jumlah", name: "jumlah" } } } }
                                                                            }
                                                                        }
                                                                    }
                                                                },
                                                                next: {
                                                                    block: {
                                                                        type: "text_print",
                                                                        id: "l2_s2_print_total",
                                                                        locked: true,
                                                                        inputs: {
                                                                            TEXT: {
                                                                                block: {
                                                                                    type: "text_join",
                                                                                    id: "l2_s2_join_total",
                                                                                    locked: true,
                                                                                    extraState: { itemCount: 2 },
                                                                                    inputs: {
                                                                                        ADD0: { block: { type: "text", id: "l2_s2_txt_total", locked: true, fields: { TEXT: "Total belanja: " } } },
                                                                                        ADD1: { block: { type: "variables_get", id: "l2_s2_get_total", locked: true, fields: { VAR: { id: "var_total", name: "total" } } } }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        },
        aturan_validasi: {
            wajib_kode: [
                { pola: "jumlah =", pesan: "❌ Buat dan isi variabel 'jumlah' terlebih dahulu!" },
                { pola: "total =", pesan: "❌ Buat dan isi variabel 'total' dengan rumus harga × jumlah!" },
                { pola: "*", pesan: "❌ Gunakan blok perkalian dari kategori Math untuk menghitung total!" }
            ]
        },
        uji_kasus: [
            {
                input: [],
                expectedOutput: "Harga pulpen: 2500\nStok pulpen: 40\nTotal belanja: 15000",
                alternateOutputs: [
                    "Total belanja: 15000"
                ],
                keterangan: "Menghitung total belanja (2500 × 6 = 15000)"
            },
            {
                input: [],
                expectedOutput: "Harga pulpen: 2500\nStok pulpen: 40\nTotal belanja: 15000",
                alternateOutputs: [
                    "Total belanja: 15000"
                ],
                keterangan: "Verifikasi penggunaan variabel jumlah dan total"
            }
        ],
        bantuan: {
            level1: {
                penalty: 3,
                description: "Menandai pembuatan variabel jumlah & total, perkalian Math, dan print.",
                steps: [
                    {
                        category: "Variables",
                        block: "variables_set",
                        variableName: "jumlah",
                        instruction: "Buka kategori <strong>Variables</strong>, buat variabel <code>jumlah</code> dan <code>total</code>. Tarik <code>set [jumlah] to</code> ke bawah program dan isi dengan angka <code>6</code>.",
                        target: { type: "next_of_last" }
                    },
                    {
                        category: "Variables",
                        block: "variables_set",
                        variableName: "total",
                        instruction: "Tarik <code>set [total] to</code> di bawahnya.",
                        target: { type: "next_of_last" }
                    },
                    {
                        category: "Math",
                        block: "math_arithmetic",
                        instruction: "Pasang blok perkalian <code>harga × jumlah</code> ke dalam <code>set [total] to</code>.",
                        target: { blockType: "variables_set", isLast: true, input: "VALUE" }
                    },
                    {
                        category: "I/O",
                        block: "text_print",
                        instruction: "Tambahkan blok <code>print</code> dengan <code>create text with</code> untuk menampilkan <code>Total belanja: [total]</code>.",
                        target: { type: "next_of_last" }
                    }
                ]
            },
            level2: {
                penalty: 5,
                description: "Memasukkan kerangka blok set jumlah, set total (harga × jumlah), dan print Total belanja.",
                insert: {
                    type: "variables_set",
                    fields: { VAR: { name: "jumlah" } },
                    inputs: { VALUE: { block: { type: "math_number", fields: { NUM: 0 } } } },
                    next: {
                        block: {
                            type: "variables_set",
                            fields: { VAR: { name: "total" } },
                            inputs: {
                                VALUE: {
                                    block: {
                                        type: "math_arithmetic",
                                        fields: { OP: "MULTIPLY" },
                                        inputs: {
                                            A: { block: { type: "variables_get", fields: { VAR: { name: "harga" } } } },
                                            B: { block: { type: "variables_get", fields: { VAR: { name: "jumlah" } } } }
                                        }
                                    }
                                }
                            },
                            next: {
                                block: {
                                    type: "text_print",
                                    inputs: {
                                        TEXT: {
                                            block: {
                                                type: "text_join",
                                                extraState: { itemCount: 2 },
                                                inputs: {
                                                    ADD0: { block: { type: "text", fields: { TEXT: "" } } },
                                                    ADD1: { block: { type: "variables_get", fields: { VAR: { name: "total" } } } }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                markFields: ["NUM", "TEXT"]
            }
        }
    },

    {
        id: "L2-S3",
        level: 2,
        judul_level: "Koperasi Sekolah",
        nomor: 3,
        tipe: "Memperbarui nilai variabel",
        teks_soal: `Setelah pembelian selesai, stok pulpen di koperasi pasti berkurang. Program perlu mengubah data stok agar tidak salah catat pada transaksi berikutnya. <strong>Tanpa menghapus blok sebelumnya</strong>, perbarui variabel <code>stok</code> dengan nilai <code>stok</code> dikurangi <code>jumlah</code>, lalu tampilkan di baris baru dengan format: <code>Sisa stok: [stok]</code>`,
        hasil_diharapkan: "Harga pulpen: 2500\nStok pulpen: 40\nTotal belanja: 15000\nSisa stok: 34",
        petunjuk_konsep: [
            "Sebuah variabel boleh memakai nilainya sendiri untuk menghitung nilai barunya.",
            "Perhatikan urutan: perhitungan stok baru harus berada setelah jumlah terisi."
        ],
        tips_langkah: [
            "Tarik <code>set [stok] to</code> baru ke bawah blok <code>print</code> terakhir.",
            "Isi dengan blok pengurangan dari <strong>Math</strong> (<code>stok − jumlah</code>).",
            "Tambahkan <code>print</code> berisi teks <code>\"Sisa stok: \"</code> dan variabel <code>stok</code>. Hasilnya harus <code>34</code>."
        ],
        blok_tersedia: ["Text", "Math", "I/O", "Variables"],
        mode_awal: "lanjut",
        workspace_awal: null,
        kunci_workspace: {
            variables: [
                { name: "harga", id: "var_harga" },
                { name: "stok", id: "var_stok" },
                { name: "jumlah", id: "var_jumlah" },
                { name: "total", id: "var_total" }
            ],
            blocks: {
                languageVersion: 0,
                blocks: [
                    {
                        type: "variables_set",
                        id: "l2_s1_set_harga",
                        x: 40,
                        y: 40,
                        locked: true,
                        fields: { VAR: { id: "var_harga", name: "harga" } },
                        inputs: {
                            VALUE: { block: { type: "math_number", id: "l2_s1_num_harga", locked: true, fields: { NUM: 2500 } } }
                        },
                        next: {
                            block: {
                                type: "variables_set",
                                id: "l2_s1_set_stok",
                                locked: true,
                                fields: { VAR: { id: "var_stok", name: "stok" } },
                                inputs: {
                                    VALUE: { block: { type: "math_number", id: "l2_s1_num_stok", locked: true, fields: { NUM: 40 } } }
                                },
                                next: {
                                    block: {
                                        type: "text_print",
                                        id: "l2_s1_print_harga",
                                        locked: true,
                                        inputs: {
                                            TEXT: {
                                                block: {
                                                    type: "text_join",
                                                    id: "l2_s1_join_harga",
                                                    locked: true,
                                                    extraState: { itemCount: 2 },
                                                    inputs: {
                                                        ADD0: { block: { type: "text", id: "l2_s1_txt_harga", locked: true, fields: { TEXT: "Harga pulpen: " } } },
                                                        ADD1: { block: { type: "variables_get", id: "l2_s1_get_harga", locked: true, fields: { VAR: { id: "var_harga", name: "harga" } } } }
                                                    }
                                                }
                                            }
                                        },
                                        next: {
                                            block: {
                                                type: "text_print",
                                                id: "l2_s1_print_stok",
                                                locked: true,
                                                inputs: {
                                                    TEXT: {
                                                        block: {
                                                            type: "text_join",
                                                            id: "l2_s1_join_stok",
                                                            locked: true,
                                                            extraState: { itemCount: 2 },
                                                            inputs: {
                                                                ADD0: { block: { type: "text", id: "l2_s1_txt_stok", locked: true, fields: { TEXT: "Stok pulpen: " } } },
                                                                ADD1: { block: { type: "variables_get", id: "l2_s1_get_stok", locked: true, fields: { VAR: { id: "var_stok", name: "stok" } } } }
                                                            }
                                                        }
                                                    }
                                                },
                                                next: {
                                                    block: {
                                                        type: "variables_set",
                                                        id: "l2_s2_set_jumlah",
                                                        deletable: false,
                                                        movable: true,
                                                        editable: true,
                                                        fields: { VAR: { id: "var_jumlah", name: "jumlah" } },
                                                        inputs: {
                                                            VALUE: {
                                                                block: {
                                                                    type: "math_number",
                                                                    id: "l2_s2_num_jumlah",
                                                                    deletable: true,
                                                                    movable: true,
                                                                    editable: true,
                                                                    fields: { NUM: 6 }
                                                                }
                                                            }
                                                        },
                                                        next: {
                                                            block: {
                                                                type: "variables_set",
                                                                id: "l2_s2_set_total",
                                                                locked: true,
                                                                fields: { VAR: { id: "var_total", name: "total" } },
                                                                inputs: {
                                                                    VALUE: {
                                                                        block: {
                                                                            type: "math_arithmetic",
                                                                            id: "l2_s2_mul_total",
                                                                            locked: true,
                                                                            fields: { OP: "MULTIPLY" },
                                                                            inputs: {
                                                                                A: { block: { type: "variables_get", id: "l2_s2_get_harga", locked: true, fields: { VAR: { id: "var_harga", name: "harga" } } } },
                                                                                B: { block: { type: "variables_get", id: "l2_s2_get_jumlah", locked: true, fields: { VAR: { id: "var_jumlah", name: "jumlah" } } } }
                                                                            }
                                                                        }
                                                                    }
                                                                },
                                                                next: {
                                                                    block: {
                                                                        type: "text_print",
                                                                        id: "l2_s2_print_total",
                                                                        locked: true,
                                                                        inputs: {
                                                                            TEXT: {
                                                                                block: {
                                                                                    type: "text_join",
                                                                                    id: "l2_s2_join_total",
                                                                                    locked: true,
                                                                                    extraState: { itemCount: 2 },
                                                                                    inputs: {
                                                                                        ADD0: { block: { type: "text", id: "l2_s2_txt_total", locked: true, fields: { TEXT: "Total belanja: " } } },
                                                                                        ADD1: { block: { type: "variables_get", id: "l2_s2_get_total", locked: true, fields: { VAR: { id: "var_total", name: "total" } } } }
                                                                                    }
                                                                                }
                                                                            }
                                                                        },
                                                                        next: {
                                                                            block: {
                                                                                type: "variables_set",
                                                                                id: "l2_s3_set_stok_baru",
                                                                                locked: true,
                                                                                fields: { VAR: { id: "var_stok", name: "stok" } },
                                                                                inputs: {
                                                                                    VALUE: {
                                                                                        block: {
                                                                                            type: "math_arithmetic",
                                                                                            id: "l2_s3_sub_stok",
                                                                                            locked: true,
                                                                                            fields: { OP: "MINUS" },
                                                                                            inputs: {
                                                                                                A: { block: { type: "variables_get", id: "l2_s3_get_stok1", locked: true, fields: { VAR: { id: "var_stok", name: "stok" } } } },
                                                                                                B: { block: { type: "variables_get", id: "l2_s3_get_jumlah1", locked: true, fields: { VAR: { id: "var_jumlah", name: "jumlah" } } } }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                },
                                                                                next: {
                                                                                    block: {
                                                                                        type: "text_print",
                                                                                        id: "l2_s3_print_sisa",
                                                                                        locked: true,
                                                                                        inputs: {
                                                                                            TEXT: {
                                                                                                block: {
                                                                                                    type: "text_join",
                                                                                                    id: "l2_s3_join_sisa",
                                                                                                    locked: true,
                                                                                                    extraState: { itemCount: 2 },
                                                                                                    inputs: {
                                                                                                        ADD0: { block: { type: "text", id: "l2_s3_txt_sisa", locked: true, fields: { TEXT: "Sisa stok: " } } },
                                                                                                        ADD1: { block: { type: "variables_get", id: "l2_s3_get_stok2", locked: true, fields: { VAR: { id: "var_stok", name: "stok" } } } }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        },
        aturan_validasi: {
            wajib_kode: [
                { pola: "-", pesan: "❌ Gunakan operasi pengurangan (stok − jumlah) dari kategori Math untuk memperbarui nilai stok!" }
            ]
        },
        uji_kasus: [
            {
                input: [],
                expectedOutput: "Harga pulpen: 2500\nStok pulpen: 40\nTotal belanja: 15000\nSisa stok: 34",
                alternateOutputs: [
                    "Total belanja: 15000\nSisa stok: 34"
                ],
                keterangan: "Memperbarui stok dengan 40 − 6 = 34"
            },
            {
                input: [],
                expectedOutput: "Harga pulpen: 2500\nStok pulpen: 40\nTotal belanja: 15000\nSisa stok: 34",
                alternateOutputs: [
                    "Total belanja: 15000\nSisa stok: 34"
                ],
                keterangan: "Verifikasi tampilan Sisa stok: 34"
            }
        ],
        bantuan: {
            level1: {
                penalty: 3,
                description: "Menandai blok set [stok] to, pengurangan Math (stok - jumlah), dan print Sisa stok.",
                steps: [
                    {
                        category: "Variables",
                        block: "variables_set",
                        variableName: "stok",
                        instruction: "Tarik blok <code>set [stok] to</code> baru ke bawah blok print terakhir.",
                        target: { type: "next_of_last" }
                    },
                    {
                        category: "Math",
                        block: "math_arithmetic",
                        instruction: "Pasang blok operasi matematika pada <code>set [stok] to</code>, ubah menjadi pengurangan (<code>-</code>), lalu isi dengan <code>stok − jumlah</code>.",
                        target: { blockType: "variables_set", isLast: true, input: "VALUE" }
                    },
                    {
                        category: "I/O",
                        block: "text_print",
                        instruction: "Tambahkan blok <code>print</code> dengan <code>create text with</code> berisi <code>\"Sisa stok: \"</code> dan variabel <code>stok</code>.",
                        target: { type: "next_of_last" }
                    }
                ]
            },
            level2: {
                penalty: 5,
                description: "Memasukkan kerangka pembaruan variabel stok (stok - jumlah) dan print Sisa stok.",
                insert: {
                    type: "variables_set",
                    fields: { VAR: { name: "stok" } },
                    inputs: {
                        VALUE: {
                            block: {
                                type: "math_arithmetic",
                                fields: { OP: "MINUS" },
                                inputs: {
                                    A: { block: { type: "variables_get", fields: { VAR: { name: "stok" } } } },
                                    B: { block: { type: "variables_get", fields: { VAR: { name: "jumlah" } } } }
                                }
                            }
                        }
                    },
                    next: {
                        block: {
                            type: "text_print",
                            inputs: {
                                TEXT: {
                                    block: {
                                        type: "text_join",
                                        extraState: { itemCount: 2 },
                                        inputs: {
                                            ADD0: { block: { type: "text", fields: { TEXT: "" } } },
                                            ADD1: { block: { type: "variables_get", fields: { VAR: { name: "stok" } } } }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                markFields: ["TEXT"]
            }
        }
    },

    {
        id: "L2-S4",
        level: 2,
        judul_level: "Koperasi Sekolah",
        nomor: 4,
        tipe: "Variabel dari input pengguna",
        teks_soal: `Keesokan harinya stok pulpen diisi ulang menjadi 40 buah. Pembeli berikutnya adalah Dimas, dan ia membeli pulpen dalam jumlah berbeda. Petugas ingin nama pembeli dan jumlah beli diketik langsung (tanpa mencetak harga dan stok awal lagi). <strong>Perbarui program di workspace agar <code>nama</code> (teks) disimpan ke variabel <code>nama</code> dan <code>jumlah</code> diambil dari input (angka bulat)</strong>, masing-masing hanya diminta <strong>satu kali</strong>. Jika diketik Dimas dan 10, tampilkan dengan format: <code>Pembeli: [nama]</code>, <code>Total belanja: [total]</code>, dan <code>Sisa stok: [stok]</code>`,
        hasil_diharapkan: "Pembeli: Dimas\nTotal belanja: 25000\nSisa stok: 30",
        petunjuk_konsep: [
            "Nama berupa teks dan jumlah berupa angka. Blok baca mana yang cocok untuk masing-masing?",
            "Nilai dari input harus tersimpan dulu di variabel sebelum dipakai dalam rumus.",
            "Input dibaca di bagian atas sebelum perhitungan total."
        ],
        tips_langkah: [
            "Buat variabel <code>nama</code>, lalu pasang <code>set [nama] to</code> berisi blok <code>read text</code> di atas <code>set [jumlah] to</code>.",
            "Ganti angka <code>6</code> pada <code>set [jumlah] to</code> dengan blok <code>read int</code>.",
            "Pastikan kedua blok <code>set</code> itu berada di atas perhitungan <code>total</code>.",
            "Tambahkan <code>print</code> untuk <code>Pembeli: [nama]</code> di atas <code>print</code> Total belanja. Hasilnya <code>Total belanja: 25000</code> dan <code>Sisa stok: 30</code>."
        ],
        blok_tersedia: ["Text", "Math", "I/O", "Variables"],
        mode_awal: "lanjut",
        workspace_awal: {
            timpa_workspace: true,
            variables: [
                { name: "harga", id: "var_harga" },
                { name: "stok", id: "var_stok" },
                { name: "jumlah", id: "var_jumlah" },
                { name: "total", id: "var_total" }
            ],
            blocks: {
                languageVersion: 0,
                blocks: [
                    {
                        type: "variables_set",
                        id: "l2_s1_set_harga",
                        x: 40,
                        y: 40,
                        locked: true,
                        fields: { VAR: { id: "var_harga", name: "harga" } },
                        inputs: {
                            VALUE: { block: { type: "math_number", id: "l2_s1_num_harga", locked: true, fields: { NUM: 2500 } } }
                        },
                        next: {
                            block: {
                                type: "variables_set",
                                id: "l2_s1_set_stok",
                                locked: true,
                                fields: { VAR: { id: "var_stok", name: "stok" } },
                                inputs: {
                                    VALUE: { block: { type: "math_number", id: "l2_s1_num_stok", locked: true, fields: { NUM: 40 } } }
                                },
                                next: {
                                    block: {
                                        type: "variables_set",
                                        id: "l2_s2_set_jumlah",
                                        deletable: false,
                                        movable: true,
                                        editable: true,
                                        fields: { VAR: { id: "var_jumlah", name: "jumlah" } },
                                        inputs: {
                                            VALUE: {
                                                block: {
                                                    type: "math_number",
                                                    id: "l2_s2_num_jumlah",
                                                    deletable: true,
                                                    movable: true,
                                                    editable: true,
                                                    fields: { NUM: 6 }
                                                }
                                            }
                                        },
                                        next: {
                                            block: {
                                                type: "variables_set",
                                                id: "l2_s2_set_total",
                                                locked: true,
                                                fields: { VAR: { id: "var_total", name: "total" } },
                                                inputs: {
                                                    VALUE: {
                                                        block: {
                                                            type: "math_arithmetic",
                                                            id: "l2_s2_mul_total",
                                                            locked: true,
                                                            fields: { OP: "MULTIPLY" },
                                                            inputs: {
                                                                A: { block: { type: "variables_get", id: "l2_s2_get_harga", locked: true, fields: { VAR: { id: "var_harga", name: "harga" } } } },
                                                                B: { block: { type: "variables_get", id: "l2_s2_get_jumlah", locked: true, fields: { VAR: { id: "var_jumlah", name: "jumlah" } } } }
                                                            }
                                                        }
                                                    }
                                                },
                                                next: {
                                                    block: {
                                                        type: "variables_set",
                                                        id: "l2_s3_set_stok_baru",
                                                        locked: true,
                                                        fields: { VAR: { id: "var_stok", name: "stok" } },
                                                        inputs: {
                                                            VALUE: {
                                                                block: {
                                                                    type: "math_arithmetic",
                                                                    id: "l2_s3_sub_stok",
                                                                    locked: true,
                                                                    fields: { OP: "MINUS" },
                                                                    inputs: {
                                                                        A: { block: { type: "variables_get", id: "l2_s3_get_stok1", locked: true, fields: { VAR: { id: "var_stok", name: "stok" } } } },
                                                                        B: { block: { type: "variables_get", id: "l2_s3_get_jumlah1", locked: true, fields: { VAR: { id: "var_jumlah", name: "jumlah" } } } }
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        next: {
                                                            block: {
                                                                type: "text_print",
                                                                id: "l2_s2_print_total",
                                                                locked: true,
                                                                inputs: {
                                                                    TEXT: {
                                                                        block: {
                                                                            type: "text_join",
                                                                            id: "l2_s2_join_total",
                                                                            locked: true,
                                                                            extraState: { itemCount: 2 },
                                                                            inputs: {
                                                                                ADD0: { block: { type: "text", id: "l2_s2_txt_total", locked: true, fields: { TEXT: "Total belanja: " } } },
                                                                                ADD1: { block: { type: "variables_get", id: "l2_s2_get_total", locked: true, fields: { VAR: { id: "var_total", name: "total" } } } }
                                                                            }
                                                                        }
                                                                    }
                                                                },
                                                                next: {
                                                                    block: {
                                                                        type: "text_print",
                                                                        id: "l2_s3_print_sisa",
                                                                        locked: true,
                                                                        inputs: {
                                                                            TEXT: {
                                                                                block: {
                                                                                    type: "text_join",
                                                                                    id: "l2_s3_join_sisa",
                                                                                    locked: true,
                                                                                    extraState: { itemCount: 2 },
                                                                                    inputs: {
                                                                                        ADD0: { block: { type: "text", id: "l2_s3_txt_sisa", locked: true, fields: { TEXT: "Sisa stok: " } } },
                                                                                        ADD1: { block: { type: "variables_get", id: "l2_s3_get_stok2", locked: true, fields: { VAR: { id: "var_stok", name: "stok" } } } }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        },
        kunci_workspace: {
            variables: [
                { name: "harga", id: "var_harga" },
                { name: "stok", id: "var_stok" },
                { name: "nama", id: "var_nama" },
                { name: "jumlah", id: "var_jumlah" },
                { name: "total", id: "var_total" }
            ],
            blocks: {
                languageVersion: 0,
                blocks: [
                    {
                        type: "variables_set",
                        id: "l2_s4_set_harga",
                        x: 40,
                        y: 40,
                        locked: true,
                        fields: { VAR: { id: "var_harga", name: "harga" } },
                        inputs: {
                            VALUE: { block: { type: "math_number", locked: true, fields: { NUM: 2500 } } }
                        },
                        next: {
                            block: {
                                type: "variables_set",
                                id: "l2_s4_set_stok",
                                locked: true,
                                fields: { VAR: { id: "var_stok", name: "stok" } },
                                inputs: {
                                    VALUE: { block: { type: "math_number", locked: true, fields: { NUM: 40 } } }
                                },
                                next: {
                                    block: {
                                        type: "variables_set",
                                        id: "l2_s4_set_nama",
                                        locked: true,
                                        fields: { VAR: { id: "var_nama", name: "nama" } },
                                        inputs: {
                                            VALUE: {
                                                block: {
                                                    type: "python_input",
                                                    locked: true,
                                                    inputs: { TEXT: { shadow: { type: "text", fields: { TEXT: "Masukkan nama pembeli:" } } } }
                                                }
                                            }
                                        },
                                        next: {
                                            block: {
                                                type: "variables_set",
                                                id: "l2_s4_set_jumlah",
                                                locked: true,
                                                fields: { VAR: { id: "var_jumlah", name: "jumlah" } },
                                                inputs: {
                                                    VALUE: {
                                                        block: {
                                                            type: "read_number",
                                                            locked: true,
                                                            inputs: { PROMPT: { shadow: { type: "text", fields: { TEXT: "Masukkan jumlah beli:" } } } }
                                                        }
                                                    }
                                                },
                                                next: {
                                                    block: {
                                                        type: "variables_set",
                                                        id: "l2_s4_set_total",
                                                        locked: true,
                                                        fields: { VAR: { id: "var_total", name: "total" } },
                                                        inputs: {
                                                            VALUE: {
                                                                block: {
                                                                    type: "math_arithmetic",
                                                                    locked: true,
                                                                    fields: { OP: "MULTIPLY" },
                                                                    inputs: {
                                                                        A: { block: { type: "variables_get", locked: true, fields: { VAR: { id: "var_harga", name: "harga" } } } },
                                                                        B: { block: { type: "variables_get", locked: true, fields: { VAR: { id: "var_jumlah", name: "jumlah" } } } }
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        next: {
                                                            block: {
                                                                type: "variables_set",
                                                                id: "l2_s4_set_stok_baru",
                                                                locked: true,
                                                                fields: { VAR: { id: "var_stok", name: "stok" } },
                                                                inputs: {
                                                                    VALUE: {
                                                                        block: {
                                                                            type: "math_arithmetic",
                                                                            locked: true,
                                                                            fields: { OP: "MINUS" },
                                                                            inputs: {
                                                                                A: { block: { type: "variables_get", locked: true, fields: { VAR: { id: "var_stok", name: "stok" } } } },
                                                                                B: { block: { type: "variables_get", locked: true, fields: { VAR: { id: "var_jumlah", name: "jumlah" } } } }
                                                                            }
                                                                        }
                                                                    }
                                                                },
                                                                next: {
                                                                    block: {
                                                                        type: "text_print",
                                                                        id: "l2_s4_print_pembeli",
                                                                        locked: true,
                                                                        inputs: {
                                                                            TEXT: {
                                                                                block: {
                                                                                    type: "text_join",
                                                                                    locked: true,
                                                                                    extraState: { itemCount: 2 },
                                                                                    inputs: {
                                                                                        ADD0: { block: { type: "text", locked: true, fields: { TEXT: "Pembeli: " } } },
                                                                                        ADD1: { block: { type: "variables_get", locked: true, fields: { VAR: { id: "var_nama", name: "nama" } } } }
                                                                                    }
                                                                                }
                                                                            }
                                                                        },
                                                                        next: {
                                                                            block: {
                                                                                type: "text_print",
                                                                                id: "l2_s4_print_total",
                                                                                locked: true,
                                                                                inputs: {
                                                                                    TEXT: {
                                                                                        block: {
                                                                                            type: "text_join",
                                                                                            locked: true,
                                                                                            extraState: { itemCount: 2 },
                                                                                            inputs: {
                                                                                                ADD0: { block: { type: "text", locked: true, fields: { TEXT: "Total belanja: " } } },
                                                                                                ADD1: { block: { type: "variables_get", locked: true, fields: { VAR: { id: "var_total", name: "total" } } } }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                },
                                                                                next: {
                                                                                    block: {
                                                                                        type: "text_print",
                                                                                        id: "l2_s4_print_sisa",
                                                                                        locked: true,
                                                                                        inputs: {
                                                                                            TEXT: {
                                                                                                block: {
                                                                                                    type: "text_join",
                                                                                                    locked: true,
                                                                                                    extraState: { itemCount: 2 },
                                                                                                    inputs: {
                                                                                                        ADD0: { block: { type: "text", locked: true, fields: { TEXT: "Sisa stok: " } } },
                                                                                                        ADD1: { block: { type: "variables_get", locked: true, fields: { VAR: { id: "var_stok", name: "stok" } } } }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        },
        aturan_validasi: {
            wajib_kode: [
                { pola: "nama =", pesan: "❌ Buat variabel 'nama' dan simpan input nama pembeli ke dalamnya!" },
                { pola: "int(input(", pesan: "❌ Gunakan blok read int untuk mengisi variabel 'jumlah'!" }
            ]
        },
        uji_kasus: [
            {
                input: ["Dimas", "10"],
                expectedOutput: "Pembeli: Dimas\nTotal belanja: 25000\nSisa stok: 30",
                alternateOutputs: [
                    "Harga pulpen: 2500\nStok pulpen: 40\nPembeli: Dimas\nTotal belanja: 25000\nSisa stok: 30",
                    "Pembeli: Dimas\nHarga pulpen: 2500\nStok pulpen: 40\nTotal belanja: 25000\nSisa stok: 30",
                    "Total belanja: 25000\nSisa stok: 30\nPembeli: Dimas"
                ],
                keterangan: "Jika diketik \"Dimas\" dan 10 (Total belanja: 25000, Sisa stok: 30)"
            },
            {
                input: ["Sari", "4"],
                expectedOutput: "Pembeli: Sari\nTotal belanja: 10000\nSisa stok: 36",
                alternateOutputs: [
                    "Harga pulpen: 2500\nStok pulpen: 40\nPembeli: Sari\nTotal belanja: 10000\nSisa stok: 36",
                    "Pembeli: Sari\nHarga pulpen: 2500\nStok pulpen: 40\nTotal belanja: 10000\nSisa stok: 36",
                    "Total belanja: 10000\nSisa stok: 36\nPembeli: Sari"
                ],
                keterangan: "Jika diketik \"Sari\" dan 4 (Total belanja: 10000, Sisa stok: 36)"
            }
        ],
        bantuan: {
            level1: {
                penalty: 3,
                description: "Menandai pembuatan variabel nama (read text), penggantian jumlah dengan read int, dan print Pembeli.",
                steps: [
                    {
                        category: "Variables",
                        block: "variables_set",
                        variableName: "nama",
                        instruction: "Buka kategori <strong>Variables</strong>, buat variabel <code>nama</code>, lalu pasang <code>set [nama] to</code> di atas blok <code>set [jumlah] to</code>.",
                        target: { blockType: "variables_set", index: 1, connection: "next" }
                    },
                    {
                        category: "I/O",
                        block: "python_input",
                        instruction: "Pasang blok <code>read text</code> ke dalam <code>set [nama] to</code>.",
                        target: { blockType: "variables_set", input: "VALUE" }
                    },
                    {
                        category: "I/O",
                        block: "read_number",
                        instruction: "Ganti angka <code>6</code> pada <code>set [jumlah] to</code> dengan blok <code>read int</code> dari kategori <strong>I/O</strong>.",
                        target: { blockType: "variables_set", index: 2, input: "VALUE" }
                    },
                    {
                        category: "I/O",
                        block: "text_print",
                        instruction: "Tambahkan blok <code>print</code> dengan <code>create text with</code> berisi <code>\"Pembeli: \"</code> dan variabel <code>nama</code> di atas tampilan Total belanja.",
                        target: { type: "next_of_last" }
                    }
                ]
            },
            level2: {
                penalty: 5,
                description: "Memasukkan kerangka blok set nama (read text) dan print Pembeli: [nama].",
                insert: {
                    type: "variables_set",
                    fields: { VAR: { name: "nama" } },
                    inputs: {
                        VALUE: {
                            block: {
                                type: "python_input",
                                inputs: { TEXT: { shadow: { type: "text", fields: { TEXT: "Masukkan nama pembeli:" } } } }
                            }
                        }
                    },
                    next: {
                        block: {
                            type: "text_print",
                            inputs: {
                                TEXT: {
                                    block: {
                                        type: "text_join",
                                        extraState: { itemCount: 2 },
                                        inputs: {
                                            ADD0: { block: { type: "text", fields: { TEXT: "" } } },
                                            ADD1: { block: { type: "variables_get", fields: { VAR: { name: "nama" } } } }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                markFields: ["TEXT"]
            }
        }
    },

    {
        id: "L2-S5",
        level: 2,
        judul_level: "Koperasi Sekolah",
        nomor: 5,
        tipe: "Menerapkan (lanjutan)",
        teks_soal: `Dimas membayar belanjaannya di kasir koperasi. Hari ini koperasi memberi potongan tetap 2000 untuk setiap transaksi, dan petugas perlu menghitung kembalian. <strong>Tanpa menghapus blok sebelumnya</strong>, tambahkan variabel <code>potongan</code> bernilai 2000 dan variabel <code>bayar</code> yang berisi <code>total</code> dikurangi <code>potongan</code>. Lalu minta uang yang dibayarkan pembeli (angka bulat) ke variabel <code>uang</code>, dan hitung <code>kembalian</code> (uang dikurangi bayar). Tampilkan dengan format: <code>Potongan: [potongan]</code>, <code>Bayar: [bayar]</code>, <code>Uang dibayar: [uang]</code>, dan <code>Kembalian: [kembalian]</code>.`,
        hasil_diharapkan: "Pembeli: Dimas\nTotal belanja: 25000\nSisa stok: 30\nPotongan: 2000\nBayar: 23000\nUang dibayar: 30000\nKembalian: 7000",
        petunjuk_konsep: [
            "Variabel baru bisa memakai variabel lama dalam rumusnya.",
            "Uang pembeli datang dari input, jadi harus tersimpan dulu di variabel sebelum dipakai menghitung kembalian.",
            "Urutan blok menentukan hasil: rumus baru dihitung setelah semua nilai yang dipakainya terisi."
        ],
        tips_langkah: [
            "Buat empat variabel baru: <code>potongan</code>, <code>bayar</code>, <code>uang</code>, dan <code>kembalian</code>.",
            "Isi satu per satu dari atas ke bawah, mulai dari yang tidak bergantung pada variabel lain.",
            "Tambahkan empat <code>print</code> baru, lalu cocokkan hasilnya dengan contoh."
        ],
        bantuan_teks: `Atur <code>potongan = 2000</code>, <code>bayar = total − potongan</code>, <code>uang = read int</code>, <code>kembalian = uang − bayar</code>. Lalu <code>print</code> <code>"Potongan: "</code>, <code>"Bayar: "</code>, <code>"Uang dibayar: "</code>, dan <code>"Kembalian: "</code> masing-masing digabung dengan variabelnya.`,
        blok_tersedia: ["Text", "Math", "I/O", "Variables"],
        mode_awal: "lanjut",
        workspace_awal: null,
        kunci_workspace: {
            variables: [
                { name: "harga", id: "var_harga" },
                { name: "stok", id: "var_stok" },
                { name: "nama", id: "var_nama" },
                { name: "jumlah", id: "var_jumlah" },
                { name: "total", id: "var_total" },
                { name: "potongan", id: "var_potongan" },
                { name: "bayar", id: "var_bayar" },
                { name: "uang", id: "var_uang" },
                { name: "kembalian", id: "var_kembalian" }
            ],
            blocks: {
                languageVersion: 0,
                blocks: [
                    {
                        type: "variables_set",
                        x: 40,
                        y: 40,
                        fields: { VAR: { id: "var_harga", name: "harga" } },
                        inputs: { VALUE: { block: { type: "math_number", fields: { NUM: 2500 } } } },
                        next: {
                            block: {
                                type: "variables_set",
                                fields: { VAR: { id: "var_stok", name: "stok" } },
                                inputs: { VALUE: { block: { type: "math_number", fields: { NUM: 40 } } } },
                                next: {
                                    block: {
                                        type: "variables_set",
                                        fields: { VAR: { id: "var_nama", name: "nama" } },
                                        inputs: { VALUE: { block: { type: "python_input", inputs: { TEXT: { shadow: { type: "text", fields: { TEXT: "Masukkan nama pembeli:" } } } } } } },
                                        next: {
                                            block: {
                                                type: "variables_set",
                                                fields: { VAR: { id: "var_jumlah", name: "jumlah" } },
                                                inputs: { VALUE: { block: { type: "read_number", inputs: { PROMPT: { shadow: { type: "text", fields: { TEXT: "Masukkan jumlah beli:" } } } } } } },
                                                next: {
                                                    block: {
                                                        type: "variables_set",
                                                        fields: { VAR: { id: "var_total", name: "total" } },
                                                        inputs: {
                                                            VALUE: {
                                                                block: {
                                                                    type: "math_arithmetic",
                                                                    fields: { OP: "MULTIPLY" },
                                                                    inputs: {
                                                                        A: { block: { type: "variables_get", fields: { VAR: { id: "var_harga", name: "harga" } } } },
                                                                        B: { block: { type: "variables_get", fields: { VAR: { id: "var_jumlah", name: "jumlah" } } } }
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        next: {
                                                            block: {
                                                                type: "variables_set",
                                                                fields: { VAR: { id: "var_stok", name: "stok" } },
                                                                inputs: {
                                                                    VALUE: {
                                                                        block: {
                                                                            type: "math_arithmetic",
                                                                            fields: { OP: "MINUS" },
                                                                            inputs: {
                                                                                A: { block: { type: "variables_get", fields: { VAR: { id: "var_stok", name: "stok" } } } },
                                                                                B: { block: { type: "variables_get", fields: { VAR: { id: "var_jumlah", name: "jumlah" } } } }
                                                                            }
                                                                        }
                                                                    }
                                                                },
                                                                next: {
                                                                    block: {
                                                                        type: "text_print",
                                                                        inputs: {
                                                                            TEXT: {
                                                                                block: {
                                                                                    type: "text_join",
                                                                                    extraState: { itemCount: 2 },
                                                                                    inputs: {
                                                                                        ADD0: { block: { type: "text", fields: { TEXT: "Pembeli: " } } },
                                                                                        ADD1: { block: { type: "variables_get", fields: { VAR: { id: "var_nama", name: "nama" } } } }
                                                                                    }
                                                                                }
                                                                            }
                                                                        },
                                                                        next: {
                                                                            block: {
                                                                                type: "text_print",
                                                                                inputs: {
                                                                                    TEXT: {
                                                                                        block: {
                                                                                            type: "text_join",
                                                                                            extraState: { itemCount: 2 },
                                                                                            inputs: {
                                                                                                ADD0: { block: { type: "text", fields: { TEXT: "Total belanja: " } } },
                                                                                                ADD1: { block: { type: "variables_get", fields: { VAR: { id: "var_total", name: "total" } } } }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                },
                                                                                next: {
                                                                                    block: {
                                                                                        type: "text_print",
                                                                                        inputs: {
                                                                                            TEXT: {
                                                                                                block: {
                                                                                                    type: "text_join",
                                                                                                    extraState: { itemCount: 2 },
                                                                                                    inputs: {
                                                                                                        ADD0: { block: { type: "text", fields: { TEXT: "Sisa stok: " } } },
                                                                                                        ADD1: { block: { type: "variables_get", fields: { VAR: { id: "var_stok", name: "stok" } } } }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        },
                                                                                        next: {
                                                                                            block: {
                                                                                                type: "variables_set",
                                                                                                fields: { VAR: { id: "var_potongan", name: "potongan" } },
                                                                                                inputs: { VALUE: { block: { type: "math_number", fields: { NUM: 2000 } } } },
                                                                                                next: {
                                                                                                    block: {
                                                                                                        type: "variables_set",
                                                                                                        fields: { VAR: { id: "var_bayar", name: "bayar" } },
                                                                                                        inputs: {
                                                                                                            VALUE: {
                                                                                                                block: {
                                                                                                                    type: "math_arithmetic",
                                                                                                                    fields: { OP: "MINUS" },
                                                                                                                    inputs: {
                                                                                                                        A: { block: { type: "variables_get", fields: { VAR: { id: "var_total", name: "total" } } } },
                                                                                                                        B: { block: { type: "variables_get", fields: { VAR: { id: "var_potongan", name: "potongan" } } } }
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        },
                                                                                                        next: {
                                                                                                            block: {
                                                                                                                type: "variables_set",
                                                                                                                fields: { VAR: { id: "var_uang", name: "uang" } },
                                                                                                                inputs: {
                                                                                                                    VALUE: {
                                                                                                                        block: {
                                                                                                                            type: "read_number",
                                                                                                                            inputs: { PROMPT: { shadow: { type: "text", fields: { TEXT: "Masukkan uang dibayar:" } } } }
                                                                                                                        }
                                                                                                                    }
                                                                                                                },
                                                                                                                next: {
                                                                                                                    block: {
                                                                                                                        type: "variables_set",
                                                                                                                        fields: { VAR: { id: "var_kembalian", name: "kembalian" } },
                                                                                                                        inputs: {
                                                                                                                            VALUE: {
                                                                                                                                block: {
                                                                                                                                    type: "math_arithmetic",
                                                                                                                                    fields: { OP: "MINUS" },
                                                                                                                                    inputs: {
                                                                                                                                        A: { block: { type: "variables_get", fields: { VAR: { id: "var_uang", name: "uang" } } } },
                                                                                                                                        B: { block: { type: "variables_get", fields: { VAR: { id: "var_bayar", name: "bayar" } } } }
                                                                                                                                    }
                                                                                                                                }
                                                                                                                            }
                                                                                                                        },
                                                                                                                        next: {
                                                                                                                            block: {
                                                                                                                                type: "text_print",
                                                                                                                                inputs: {
                                                                                                                                    TEXT: {
                                                                                                                                        block: {
                                                                                                                                            type: "text_join",
                                                                                                                                            extraState: { itemCount: 2 },
                                                                                                                                            inputs: {
                                                                                                                                                ADD0: { block: { type: "text", fields: { TEXT: "Potongan: " } } },
                                                                                                                                                ADD1: { block: { type: "variables_get", fields: { VAR: { id: "var_potongan", name: "potongan" } } } }
                                                                                                                                            }
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                },
                                                                                                                                next: {
                                                                                                                                    block: {
                                                                                                                                        type: "text_print",
                                                                                                                                        inputs: {
                                                                                                                                            TEXT: {
                                                                                                                                                block: {
                                                                                                                                                    type: "text_join",
                                                                                                                                                    extraState: { itemCount: 2 },
                                                                                                                                                    inputs: {
                                                                                                                                                        ADD0: { block: { type: "text", fields: { TEXT: "Bayar: " } } },
                                                                                                                                                        ADD1: { block: { type: "variables_get", fields: { VAR: { id: "var_bayar", name: "bayar" } } } }
                                                                                                                                                    }
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                        },
                                                                                                                                        next: {
                                                                                                                                            block: {
                                                                                                                                                type: "text_print",
                                                                                                                                                inputs: {
                                                                                                                                                    TEXT: {
                                                                                                                                                        block: {
                                                                                                                                                            type: "text_join",
                                                                                                                                                            extraState: { itemCount: 2 },
                                                                                                                                                            inputs: {
                                                                                                                                                                ADD0: { block: { type: "text", fields: { TEXT: "Uang dibayar: " } } },
                                                                                                                                                                ADD1: { block: { type: "variables_get", fields: { VAR: { id: "var_uang", name: "uang" } } } }
                                                                                                                                                            }
                                                                                                                                                        }
                                                                                                                                                    }
                                                                                                                                                },
                                                                                                                                                next: {
                                                                                                                                                    block: {
                                                                                                                                                        type: "text_print",
                                                                                                                                                        inputs: {
                                                                                                                                                            TEXT: {
                                                                                                                                                                block: {
                                                                                                                                                                    type: "text_join",
                                                                                                                                                                    extraState: { itemCount: 2 },
                                                                                                                                                                    inputs: {
                                                                                                                                                                        ADD0: { block: { type: "text", fields: { TEXT: "Kembalian: " } } },
                                                                                                                                                                        ADD1: { block: { type: "variables_get", fields: { VAR: { id: "var_kembalian", name: "kembalian" } } } }
                                                                                                                                                                    }
                                                                                                                                                                }
                                                                                                                                                            }
                                                                                                                                                        }
                                                                                                                                                    }
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                }
                                                                                                                            }
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        },
        aturan_validasi: {
            min_jumlah_print: 4,
            wajib_kode: [
                { pola: "potongan =", pesan: "❌ Buat dan isi variabel 'potongan' terlebih dahulu!" },
                { pola: "bayar =", pesan: "❌ Buat dan isi variabel 'bayar' (total − potongan)!" },
                { pola: "uang =", pesan: "❌ Buat variabel 'uang' dan isi dengan blok read int!" },
                { pola: "kembalian =", pesan: "❌ Buat dan isi variabel 'kembalian' (uang − bayar)!" }
            ]
        },
        uji_kasus: [
            {
                input: ["Dimas", "10", "30000"],
                expectedOutput: "Pembeli: Dimas\nTotal belanja: 25000\nSisa stok: 30\nPotongan: 2000\nBayar: 23000\nUang dibayar: 30000\nKembalian: 7000",
                alternateOutputs: [
                    "Potongan: 2000\nBayar: 23000\nUang dibayar: 30000\nKembalian: 7000"
                ],
                keterangan: "Jika diketik Dimas, 10, dan 30000 (Total: 25000, Bayar: 23000, Kembalian: 7000)"
            },
            {
                input: ["Rina", "5", "20000"],
                expectedOutput: "Pembeli: Rina\nTotal belanja: 12500\nSisa stok: 35\nPotongan: 2000\nBayar: 10500\nUang dibayar: 20000\nKembalian: 9500",
                alternateOutputs: [
                    "Potongan: 2000\nBayar: 10500\nUang dibayar: 20000\nKembalian: 9500"
                ],
                keterangan: "Jika diketik Rina, 5, dan 20000 (Total: 12500, Bayar: 10500, Kembalian: 9500)"
            }
        ],
        bantuan: {
            teks: `Atur <code>potongan = 2000</code>, <code>bayar = total − potongan</code>, <code>uang = read int</code>, <code>kembalian = uang − bayar</code>. Lalu <code>print</code> <code>"Potongan: "</code>, <code>"Bayar: "</code>, <code>"Uang dibayar: "</code>, dan <code>"Kembalian: "</code> masing-masing digabung dengan variabelnya.`,
            level1: {
                penalty: 3,
                description: "Menandai pembuatan variabel potongan, bayar, uang, kembalian beserta operasi pengurangan dan print.",
                steps: [
                    {
                        category: "Variables",
                        block: "variables_set",
                        variableName: "potongan",
                        instruction: "Buka kategori <strong>Variables</strong>, tarik <code>set [potongan] to</code> ke bawah program dan isi dengan angka <code>2000</code>.",
                        target: { type: "next_of_last" }
                    },
                    {
                        category: "Variables",
                        block: "variables_set",
                        variableName: "bayar",
                        instruction: "Tarik <code>set [bayar] to</code> di bawahnya.",
                        target: { type: "next_of_last" }
                    },
                    {
                        category: "Math",
                        block: "math_arithmetic",
                        instruction: "Buka kategori <strong>Math</strong>, pasang blok operasi pengurangan (<code>−</code>) ke dalam <code>set [bayar]</code> dengan isi <code>total − potongan</code>.",
                        target: { blockType: "variables_set", isLast: true, input: "VALUE" }
                    },
                    {
                        category: "Variables",
                        block: "variables_set",
                        variableName: "uang",
                        instruction: "Buka kategori <strong>Variables</strong>, tarik <code>set [uang] to</code> di bawah <code>set [bayar]</code>.",
                        target: { type: "next_of_last" }
                    },
                    {
                        category: "I/O",
                        block: "read_number",
                        instruction: "Buka kategori <strong>I/O</strong>, pasang blok <code>read int</code> ke dalam <code>set [uang] to</code>.",
                        target: { blockType: "variables_set", isLast: true, input: "VALUE" }
                    },
                    {
                        category: "Variables",
                        block: "variables_set",
                        variableName: "kembalian",
                        instruction: "Buka kategori <strong>Variables</strong>, tarik <code>set [kembalian] to</code> di bawah <code>set [uang]</code>, lalu isi dengan pengurangan <code>uang − bayar</code>.",
                        target: { type: "next_of_last" }
                    },
                    {
                        category: "I/O",
                        block: "text_print",
                        instruction: "Tambahkan empat blok <code>print</code> dengan <code>create text with</code> untuk menampilkan <code>Potongan: [potongan]</code>, <code>Bayar: [bayar]</code>, <code>Uang dibayar: [uang]</code>, dan <code>Kembalian: [kembalian]</code>.",
                        target: { type: "next_of_last" }
                    }
                ]
            },
            level2: {
                penalty: 5,
                description: "Memasukkan kerangka blok variabel potongan, bayar, uang, kembalian dan empat blok print.",
                insert: {
                    type: "variables_set",
                    fields: { VAR: { name: "potongan" } },
                    inputs: { VALUE: { block: { type: "math_number", fields: { NUM: 0 } } } },
                    next: {
                        block: {
                            type: "variables_set",
                            fields: { VAR: { name: "bayar" } },
                            inputs: {
                                VALUE: {
                                    block: {
                                        type: "math_arithmetic",
                                        fields: { OP: "MINUS" },
                                        inputs: {
                                            A: { block: { type: "variables_get", fields: { VAR: { name: "total" } } } },
                                            B: { block: { type: "variables_get", fields: { VAR: { name: "potongan" } } } }
                                        }
                                    }
                                }
                            },
                            next: {
                                block: {
                                    type: "variables_set",
                                    fields: { VAR: { name: "uang" } },
                                    inputs: {
                                        VALUE: {
                                            block: {
                                                type: "read_number",
                                                inputs: { PROMPT: { shadow: { type: "text", fields: { TEXT: "Masukkan uang dibayar:" } } } }
                                            }
                                        }
                                    },
                                    next: {
                                        block: {
                                            type: "variables_set",
                                            fields: { VAR: { name: "kembalian" } },
                                            inputs: {
                                                VALUE: {
                                                    block: {
                                                        type: "math_arithmetic",
                                                        fields: { OP: "MINUS" },
                                                        inputs: {
                                                            A: { block: { type: "variables_get", fields: { VAR: { name: "uang" } } } },
                                                            B: { block: { type: "variables_get", fields: { VAR: { name: "bayar" } } } }
                                                        }
                                                    }
                                                }
                                            },
                                            next: {
                                                block: {
                                                    type: "text_print",
                                                    inputs: {
                                                        TEXT: {
                                                            block: {
                                                                type: "text_join",
                                                                extraState: { itemCount: 2 },
                                                                inputs: {
                                                                    ADD0: { block: { type: "text", fields: { TEXT: "" } } },
                                                                    ADD1: { block: { type: "variables_get", fields: { VAR: { name: "potongan" } } } }
                                                                }
                                                            }
                                                        }
                                                    },
                                                    next: {
                                                        block: {
                                                            type: "text_print",
                                                            inputs: {
                                                                TEXT: {
                                                                    block: {
                                                                        type: "text_join",
                                                                        extraState: { itemCount: 2 },
                                                                        inputs: {
                                                                            ADD0: { block: { type: "text", fields: { TEXT: "" } } },
                                                                            ADD1: { block: { type: "variables_get", fields: { VAR: { name: "bayar" } } } }
                                                                        }
                                                                    }
                                                                }
                                                            },
                                                            next: {
                                                                block: {
                                                                    type: "text_print",
                                                                    inputs: {
                                                                        TEXT: {
                                                                            block: {
                                                                                type: "text_join",
                                                                                extraState: { itemCount: 2 },
                                                                                inputs: {
                                                                                    ADD0: { block: { type: "text", fields: { TEXT: "" } } },
                                                                                    ADD1: { block: { type: "variables_get", fields: { VAR: { name: "uang" } } } }
                                                                                }
                                                                            }
                                                                        }
                                                                    },
                                                                    next: {
                                                                        block: {
                                                                            type: "text_print",
                                                                            inputs: {
                                                                                TEXT: {
                                                                                    block: {
                                                                                        type: "text_join",
                                                                                        extraState: { itemCount: 2 },
                                                                                        inputs: {
                                                                                            ADD0: { block: { type: "text", fields: { TEXT: "" } } },
                                                                                            ADD1: { block: { type: "variables_get", fields: { VAR: { name: "kembalian" } } } }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                markFields: ["NUM", "TEXT"]
            }
        }
    },

    // ========================================================================
    // LEVEL 3: Penilaian Ujian Praktik (5 Soal)
    // ========================================================================
    {
        id: "L3-S1",
        level: 3,
        judul_level: "Penilaian Ujian Praktik",
        nomor: 1,
        tipe: "Membandingkan nilai",
        teks_soal: `Pak Andi baru selesai menilai ujian praktik pemrograman dan ingin mengecek apakah nilai siswa mencapai batas kelulusan. Di workspace sudah tersedia variabel <strong>batas</strong> yang bernilai <strong>75</strong> dan variabel <strong>nilai</strong> yang membaca input nilai ujian (<code>read int</code>). <strong>Tanpa menghapus blok yang sudah ada</strong>, tampilkan hasil perbandingan apakah <strong>nilai lebih besar atau sama dengan batas</strong> (<code>nilai ≥ batas</code>) menggunakan blok <code>print</code>. Saat diuji dengan memasukkan nilai ujian <strong>80</strong>, program menampilkan <code>True</code> (sedangkan jika dimasukkan nilai <strong>60</strong>, program menampilkan <code>False</code>).`,
        hasil_diharapkan: "True",
        petunjuk_konsep: [
            "Perbandingan dua nilai menghasilkan jawaban benar (True) atau salah (False), bukan angka.",
            "Siswa dinyatakan mencapai batas jika nilainya lebih besar atau sama dengan 75 (variabel batas). Operator mana yang mencakup itu?",
            "Hasil perbandingan bisa langsung dipasang ke dalam blok print tanpa disimpan ke variabel baru."
        ],
        tips_langkah: [
            "Ambil blok <code>print</code> dari kategori <strong>I/O</strong> dan pasang di bawah blok <code>set [nilai]</code>.",
            "Dari kategori <strong>Logic</strong>, ambil blok perbandingan dan ubah operatornya menjadi <code>≥</code>.",
            "Isi sisi kiri perbandingan dengan variabel <code>nilai</code> dan sisi kanan dengan variabel <code>batas</code> (bernilai 75), lalu masukkan nilai <code>80</code> saat mencoba menjalankan program."
        ],
        bantuan_teks: `Pasang blok <code>print</code> di bawah <code>set [nilai]</code>, lalu isi dengan blok perbandingan <code>nilai ≥ batas</code> dari kategori <strong>Logic</strong>.`,
        blok_tersedia: ["Text", "Math", "I/O", "Variables", "Control", "Logic"],
        mode_awal: "preset",
        workspace_awal: {
            variables: [
                { name: "batas", id: "var_batas" },
                { name: "nilai", id: "var_nilai" }
            ],
            blocks: {
                languageVersion: 0,
                blocks: [
                    {
                        type: "variables_set",
                        id: "l3_s1_set_batas",
                        x: 40,
                        y: 40,
                        locked: true,
                        fields: { VAR: { id: "var_batas", name: "batas" } },
                        inputs: {
                            VALUE: {
                                block: {
                                    type: "math_number",
                                    id: "l3_s1_num_batas",
                                    locked: true,
                                    fields: { NUM: 75 }
                                }
                            }
                        },
                        next: {
                            block: {
                                type: "variables_set",
                                id: "l3_s1_set_nilai",
                                locked: true,
                                fields: { VAR: { id: "var_nilai", name: "nilai" } },
                                inputs: {
                                    VALUE: {
                                        block: {
                                            type: "read_number",
                                            id: "l3_s1_read_nilai",
                                            locked: true,
                                            inputs: {
                                                PROMPT: {
                                                    shadow: {
                                                        type: "text",
                                                        id: "l3_s1_prompt_nilai",
                                                        fields: { TEXT: "Masukkan nilai ujian:" }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        },
        kunci_workspace: {
            variables: [
                { name: "batas", id: "var_batas" },
                { name: "nilai", id: "var_nilai" }
            ],
            blocks: {
                languageVersion: 0,
                blocks: [
                    {
                        type: "variables_set",
                        id: "l3_s1_set_batas",
                        x: 40,
                        y: 40,
                        locked: true,
                        fields: { VAR: { id: "var_batas", name: "batas" } },
                        inputs: {
                            VALUE: {
                                block: {
                                    type: "math_number",
                                    id: "l3_s1_num_batas",
                                    locked: true,
                                    fields: { NUM: 75 }
                                }
                            }
                        },
                        next: {
                            block: {
                                type: "variables_set",
                                id: "l3_s1_set_nilai",
                                locked: true,
                                fields: { VAR: { id: "var_nilai", name: "nilai" } },
                                inputs: {
                                    VALUE: {
                                        block: {
                                            type: "read_number",
                                            id: "l3_s1_read_nilai",
                                            locked: true,
                                            inputs: {
                                                PROMPT: {
                                                    shadow: {
                                                        type: "text",
                                                        id: "l3_s1_prompt_nilai",
                                                        fields: { TEXT: "Masukkan nilai ujian:" }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                next: {
                                    block: {
                                        // Di Soal 2 siswa diminta memindahkan blok perbandingan ke if dan menghapus print lama ini
                                        type: "text_print",
                                        id: "l3_s1_print_cmp",
                                        deletable: true,
                                        movable: true,
                                        editable: true,
                                        inputs: {
                                            TEXT: {
                                                block: {
                                                    type: "logic_compare",
                                                    id: "l3_s1_cmp",
                                                    deletable: false,
                                                    movable: true,
                                                    editable: true,
                                                    fields: { OP: "GTE" },
                                                    inputs: {
                                                        A: {
                                                            block: {
                                                                type: "variables_get",
                                                                id: "l3_s1_get_nilai",
                                                                deletable: false,
                                                                movable: true,
                                                                editable: true,
                                                                fields: { VAR: { id: "var_nilai", name: "nilai" } }
                                                            }
                                                        },
                                                        B: {
                                                            block: {
                                                                type: "variables_get",
                                                                id: "l3_s1_get_batas",
                                                                deletable: false,
                                                                movable: true,
                                                                editable: true,
                                                                fields: { VAR: { id: "var_batas", name: "batas" } }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        },
        aturan_validasi: {
            min_jumlah_print: 1,
            wajib_kode: [
                { pola: "print(", pesan: "❌ Gunakan blok print dari kategori I/O untuk menampilkan hasil perbandingan!" },
                { pola: ">=", pesan: "❌ Gunakan operator perbandingan ≥ (lebih besar atau sama dengan) dari kategori Logic!" }
            ]
        },
        uji_kasus: [
            {
                input: ["80"],
                expectedOutput: "True",
                keterangan: "Jika nilai=80 (80 ≥ 75 adalah True)"
            },
            {
                input: ["75"],
                expectedOutput: "True",
                keterangan: "Jika nilai=75 tepat di batas kelulusan (75 ≥ 75 adalah True)"
            },
            {
                input: ["60"],
                expectedOutput: "False",
                keterangan: "Jika nilai=60 di bawah batas (60 ≥ 75 adalah False)"
            }
        ],
        bantuan: {
            teks: `Pasang blok <code>print</code> di bawah <code>set [nilai]</code>, lalu isi dengan blok perbandingan <code>nilai ≥ batas</code> dari kategori <strong>Logic</strong>.`,
            level1: {
                penalty: 3,
                description: "Menandai kategori I/O (print), Logic (perbandingan ≥), dan Variables (nilai & batas).",
                steps: [
                    {
                        category: "I/O",
                        block: "text_print",
                        instruction: "Tarik blok <code>print</code> dari kategori <strong>I/O</strong> dan sambungkan di bawah blok <code>set [nilai]</code>.",
                        target: { type: "next_of_last" }
                    },
                    {
                        category: "Logic",
                        block: "logic_compare",
                        instruction: "Buka kategori <strong>Logic</strong>, tarik blok perbandingan ke dalam <code>print</code>, lalu ubah operatornya menjadi <code>≥</code>.",
                        target: { blockType: "text_print", isLast: true, input: "TEXT" }
                    },
                    {
                        category: "Variables",
                        block: "variables_get",
                        instruction: "Buka kategori <strong>Variables</strong>, pasang variabel <code>nilai</code> di sisi kiri dan variabel <code>batas</code> di sisi kanan perbandingan.",
                        target: { blockType: "logic_compare", isLast: true, input: "A" }
                    }
                ]
            },
            level2: {
                penalty: 5,
                description: "Memasukkan kerangka blok print dengan blok perbandingan Logic.",
                insert: {
                    type: "text_print",
                    inputs: {
                        TEXT: {
                            block: {
                                type: "logic_compare",
                                fields: { OP: "GTE" },
                                inputs: {
                                    A: {
                                        block: {
                                            type: "variables_get",
                                            fields: { VAR: { id: "var_nilai", name: "nilai" } }
                                        }
                                    },
                                    B: {
                                        block: {
                                            type: "variables_get",
                                            fields: { VAR: { id: "var_batas", name: "batas" } }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                markFields: ["OP"]
            }
        }
    },

    {
        id: "L3-S2",
        level: 3,
        judul_level: "Penilaian Ujian Praktik",
        nomor: 2,
        tipe: "Percabangan if",
        teks_soal: `Pak Andi tidak ingin layar hanya menampilkan <code>True</code> atau <code>False</code>, melainkan pesan kelulusan yang langsung bisa dibaca siswa. Siswa dinyatakan lulus jika <strong>nilai lebih besar atau sama dengan batas (75)</strong>. <strong>Tanpa menghapus blok variabel sebelumnya</strong>, hapus blok <code>print</code> yang lama, lalu gunakan blok percabangan <code>if</code> dengan syarat <code>nilai ≥ batas</code> untuk mencetak teks <code>Lulus</code>. Saat diuji dengan memasukkan nilai ujian <strong>80</strong>, program menampilkan <code>Lulus</code> (jika dimasukkan nilai di bawah 75 seperti <strong>60</strong>, tidak ada tampilan apa pun).`,
        hasil_diharapkan: "Lulus",
        petunjuk_konsep: [
            "Blok if hanya menjalankan perintah di dalamnya (do) jika syarat perbandingannya bernilai benar.",
            "Blok perbandingan nilai ≥ batas dari soal sebelumnya dapat langsung dipindahkan menjadi syarat pada blok if.",
            "Jika nilai yang dimasukkan kurang dari batas (75), bagian do di dalam if akan dilewati."
        ],
        tips_langkah: [
            "Ambil blok <code>if</code> dari kategori <strong>Control</strong> dan sambungkan di bawah blok <code>set [nilai]</code>.",
            "Pindahkan blok perbandingan <code>nilai ≥ batas</code> ke slot kondisi di samping <code>if</code>, lalu hapus blok <code>print</code> kosong yang lama.",
            "Di dalam bagian <code>do</code> pada blok <code>if</code>, pasang blok <code>print</code> berisi teks <code>\"Lulus\"</code>.",
            "Jalankan program dengan memasukkan nilai <code>80</code> untuk memastikan tampil kata <code>Lulus</code>."
        ],
        bantuan_teks: `Pasang blok <code>if</code> di bawah <code>set [nilai]</code>, pindahkan perbandingan <code>nilai ≥ batas</code> ke syarat <code>if</code>, hapus <code>print</code> lama, lalu tambahkan <code>print</code> berisi teks <code>"Lulus"</code> di dalam bagian <code>do</code>.`,
        blok_tersedia: ["Text", "Math", "I/O", "Variables", "Control", "Logic"],
        mode_awal: "lanjut",
        workspace_awal: null,
        kunci_workspace: {
            variables: [
                { name: "batas", id: "var_batas" },
                { name: "nilai", id: "var_nilai" }
            ],
            blocks: {
                languageVersion: 0,
                blocks: [
                    {
                        type: "variables_set",
                        id: "l3_s1_set_batas",
                        x: 40,
                        y: 40,
                        locked: true,
                        fields: { VAR: { id: "var_batas", name: "batas" } },
                        inputs: {
                            VALUE: {
                                block: {
                                    type: "math_number",
                                    id: "l3_s1_num_batas",
                                    locked: true,
                                    fields: { NUM: 75 }
                                }
                            }
                        },
                        next: {
                            block: {
                                type: "variables_set",
                                id: "l3_s1_set_nilai",
                                locked: true,
                                fields: { VAR: { id: "var_nilai", name: "nilai" } },
                                inputs: {
                                    VALUE: {
                                        block: {
                                            type: "read_number",
                                            id: "l3_s1_read_nilai",
                                            locked: true,
                                            inputs: {
                                                PROMPT: {
                                                    shadow: {
                                                        type: "text",
                                                        id: "l3_s1_prompt_nilai",
                                                        fields: { TEXT: "Masukkan nilai ujian:" }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                next: {
                                    block: {
                                        type: "controls_if",
                                        id: "l3_s2_if",
                                        deletable: false,
                                        movable: true,
                                        editable: true,
                                        inputs: {
                                            IF0: {
                                                block: {
                                                    type: "logic_compare",
                                                    id: "l3_s1_cmp",
                                                    deletable: false,
                                                    movable: true,
                                                    editable: true,
                                                    fields: { OP: "GTE" },
                                                    inputs: {
                                                        A: {
                                                            block: {
                                                                type: "variables_get",
                                                                id: "l3_s1_get_nilai",
                                                                deletable: false,
                                                                movable: true,
                                                                editable: true,
                                                                fields: { VAR: { id: "var_nilai", name: "nilai" } }
                                                            }
                                                        },
                                                        B: {
                                                            block: {
                                                                type: "variables_get",
                                                                id: "l3_s1_get_batas",
                                                                deletable: false,
                                                                movable: true,
                                                                editable: true,
                                                                fields: { VAR: { id: "var_batas", name: "batas" } }
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            DO0: {
                                                block: {
                                                    type: "text_print",
                                                    id: "l3_s2_print_lulus",
                                                    deletable: false,
                                                    movable: true,
                                                    editable: true,
                                                    inputs: {
                                                        TEXT: {
                                                            block: {
                                                                type: "text",
                                                                id: "l3_s2_text_lulus",
                                                                deletable: false,
                                                                movable: true,
                                                                editable: true,
                                                                fields: { TEXT: "Lulus" }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        },
        aturan_validasi: {
            min_jumlah_print: 1,
            wajib_kode: [
                { pola: "if ", pesan: "❌ Gunakan blok percabangan if dari kategori Control!" },
                { pola: ">=", pesan: "❌ Syarat pada blok if harus menggunakan perbandingan nilai >= batas!" }
            ]
        },
        uji_kasus: [
            {
                input: ["80"],
                expectedOutput: "Lulus",
                keterangan: "Jika nilai=80 (memenuhi batas ≥ 75), tampilkan Lulus"
            },
            {
                input: ["75"],
                expectedOutput: "Lulus",
                keterangan: "Jika nilai=75 (tepat di batas 75), tampilkan Lulus"
            },
            {
                input: ["60"],
                expectedOutput: "",
                keterangan: "Jika nilai=60 (di bawah batas), tidak ada tampilan apa pun"
            }
        ],
        bantuan: {
            teks: `Pasang blok <code>if</code> di bawah <code>set [nilai]</code>, pindahkan perbandingan <code>nilai ≥ batas</code> ke syarat <code>if</code>, hapus <code>print</code> lama, lalu tambahkan <code>print</code> berisi teks <code>"Lulus"</code> di dalam bagian <code>do</code>.`,
            level1: {
                penalty: 3,
                description: "Menandai blok if di kategori Control serta blok print dan teks untuk menampilkan Lulus.",
                steps: [
                    {
                        category: "Control",
                        block: "controls_if",
                        instruction: "Buka kategori <strong>Control</strong>, tarik blok <code>if</code> ke bawah blok <code>set [nilai]</code>.",
                        target: { type: "next_of_last" }
                    },
                    {
                        category: "I/O",
                        block: "text_print",
                        instruction: "Pindahkan blok perbandingan <code>nilai ≥ batas</code> ke slot kondisi <code>if</code>, hapus blok <code>print</code> lama, lalu pasang blok <code>print</code> baru berisi teks <code>\"Lulus\"</code> di dalam <code>do</code>.",
                        target: { blockType: "controls_if", isLast: true, input: "DO0" }
                    }
                ]
            },
            level2: {
                penalty: 5,
                description: "Memasukkan kerangka blok if dengan print di dalamnya.",
                insert: {
                    type: "controls_if",
                    inputs: {
                        DO0: {
                            block: {
                                type: "text_print",
                                inputs: {
                                    TEXT: {
                                        block: {
                                            type: "text",
                                            fields: { TEXT: "" }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                markFields: ["TEXT"]
            }
        }
    },

    {
        id: "L3-S3",
        level: 3,
        judul_level: "Penilaian Ujian Praktik",
        nomor: 3,
        tipe: "If-else, melengkapi",
        teks_soal: `Ternyata siswa yang nilainya di bawah batas kelulusan (<strong>75</strong>) bingung karena layar kosong tanpa pesan. Pak Andi ingin program menampilkan kata <strong>Remedial</strong> jika nilai ujian kurang dari batas tersebut. <strong>Blok <code>if</code> di workspace sudah memiliki bagian <code>else</code> tetapi masih kosong. Tanpa menghapus blok sebelumnya</strong>, isi bagian <code>else</code> dengan blok <code>print</code> untuk menampilkan teks <code>Remedial</code>. Saat diuji dengan memasukkan nilai ujian <strong>60</strong>, program menampilkan <code>Remedial</code> (dan jika dimasukkan nilai <strong>80</strong>, program menampilkan <code>Lulus</code>).`,
        hasil_diharapkan: "Remedial",
        petunjuk_konsep: [
            "Bagian else otomatis dijalankan ketika syarat pada if (nilai ≥ batas) tidak terpenuhi.",
            "Hanya salah satu cabang yang dijalankan: Lulus (jika nilai ≥ 75) atau Remedial (jika nilai < 75).",
            "Teks yang dicetak pada bagian else harus ditulis persis \"Remedial\"."
        ],
        tips_langkah: [
            "Perhatikan bagian <code>else</code> yang masih kosong pada blok <code>if</code> di workspace.",
            "Tarik blok <code>print</code> dari kategori <strong>I/O</strong> ke dalam slot <code>else</code>.",
            "Pasang blok teks berisi kata <code>\"Remedial\"</code> ke dalam blok <code>print</code> tersebut.",
            "Jalankan program dengan memasukkan nilai <code>60</code> untuk memastikan tampil <code>Remedial</code>."
        ],
        bantuan_teks: `Tarik blok <code>print</code> ke dalam slot <code>else</code> yang masih kosong, lalu isi dengan blok teks <code>"Remedial"</code>.`,
        blok_tersedia: ["Text", "Math", "I/O", "Variables", "Control", "Logic"],
        mode_awal: "lanjut",
        workspace_awal: {
            timpa_workspace: true,
            variables: [
                { name: "batas", id: "var_batas" },
                { name: "nilai", id: "var_nilai" }
            ],
            blocks: {
                languageVersion: 0,
                blocks: [
                    {
                        type: "variables_set",
                        id: "l3_s1_set_batas",
                        x: 40,
                        y: 40,
                        locked: true,
                        fields: { VAR: { id: "var_batas", name: "batas" } },
                        inputs: {
                            VALUE: {
                                block: {
                                    type: "math_number",
                                    id: "l3_s1_num_batas",
                                    locked: true,
                                    fields: { NUM: 75 }
                                }
                            }
                        },
                        next: {
                            block: {
                                type: "variables_set",
                                id: "l3_s1_set_nilai",
                                locked: true,
                                fields: { VAR: { id: "var_nilai", name: "nilai" } },
                                inputs: {
                                    VALUE: {
                                        block: {
                                            type: "read_number",
                                            id: "l3_s1_read_nilai",
                                            locked: true,
                                            inputs: {
                                                PROMPT: {
                                                    shadow: {
                                                        type: "text",
                                                        id: "l3_s1_prompt_nilai",
                                                        fields: { TEXT: "Masukkan nilai ujian:" }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                next: {
                                    block: {
                                        // Blok if sudah memiliki bagian else yang masih kosong sesuai deskripsi soal
                                        type: "controls_if",
                                        id: "l3_s3_ifelse",
                                        deletable: false,
                                        movable: false,
                                        editable: true,
                                        extraState: { hasElse: true },
                                        inputs: {
                                            IF0: {
                                                block: {
                                                    type: "logic_compare",
                                                    id: "l3_s1_cmp",
                                                    locked: true,
                                                    fields: { OP: "GTE" },
                                                    inputs: {
                                                        A: {
                                                            block: {
                                                                type: "variables_get",
                                                                id: "l3_s1_get_nilai",
                                                                locked: true,
                                                                fields: { VAR: { id: "var_nilai", name: "nilai" } }
                                                            }
                                                        },
                                                        B: {
                                                            block: {
                                                                type: "variables_get",
                                                                id: "l3_s1_get_batas",
                                                                locked: true,
                                                                fields: { VAR: { id: "var_batas", name: "batas" } }
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            DO0: {
                                                block: {
                                                    type: "text_print",
                                                    id: "l3_s2_print_lulus",
                                                    locked: true,
                                                    inputs: {
                                                        TEXT: {
                                                            block: {
                                                                type: "text",
                                                                id: "l3_s2_text_lulus",
                                                                locked: true,
                                                                fields: { TEXT: "Lulus" }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        },
        kunci_workspace: {
            variables: [
                { name: "batas", id: "var_batas" },
                { name: "nilai", id: "var_nilai" }
            ],
            blocks: {
                languageVersion: 0,
                blocks: [
                    {
                        type: "variables_set",
                        id: "l3_s1_set_batas",
                        x: 40,
                        y: 40,
                        locked: true,
                        fields: { VAR: { id: "var_batas", name: "batas" } },
                        inputs: {
                            VALUE: {
                                block: {
                                    type: "math_number",
                                    id: "l3_s1_num_batas",
                                    locked: true,
                                    fields: { NUM: 75 }
                                }
                            }
                        },
                        next: {
                            block: {
                                type: "variables_set",
                                id: "l3_s1_set_nilai",
                                locked: true,
                                fields: { VAR: { id: "var_nilai", name: "nilai" } },
                                inputs: {
                                    VALUE: {
                                        block: {
                                            type: "read_number",
                                            id: "l3_s1_read_nilai",
                                            locked: true,
                                            inputs: {
                                                PROMPT: {
                                                    shadow: {
                                                        type: "text",
                                                        id: "l3_s1_prompt_nilai",
                                                        fields: { TEXT: "Masukkan nilai ujian:" }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                next: {
                                    block: {
                                        // Penting untuk Soal 4: editable: true agar ikon gerigi (mutator else if) muncul!
                                        // Blok di dalamnya movable: true & editable: true agar siswa bisa mengubah syarat & teks menjadi "Kategori: ..."
                                        type: "controls_if",
                                        id: "l3_s3_ifelse",
                                        deletable: false,
                                        movable: true,
                                        editable: true,
                                        extraState: { hasElse: true },
                                        inputs: {
                                            IF0: {
                                                block: {
                                                    type: "logic_compare",
                                                    id: "l3_s1_cmp",
                                                    deletable: true,
                                                    movable: true,
                                                    editable: true,
                                                    fields: { OP: "GTE" },
                                                    inputs: {
                                                        A: {
                                                            block: {
                                                                type: "variables_get",
                                                                id: "l3_s1_get_nilai",
                                                                deletable: true,
                                                                movable: true,
                                                                editable: true,
                                                                fields: { VAR: { id: "var_nilai", name: "nilai" } }
                                                            }
                                                        },
                                                        B: {
                                                            block: {
                                                                type: "variables_get",
                                                                id: "l3_s1_get_batas",
                                                                deletable: true,
                                                                movable: true,
                                                                editable: true,
                                                                fields: { VAR: { id: "var_batas", name: "batas" } }
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            DO0: {
                                                block: {
                                                    type: "text_print",
                                                    id: "l3_s2_print_lulus",
                                                    deletable: true,
                                                    movable: true,
                                                    editable: true,
                                                    inputs: {
                                                        TEXT: {
                                                            block: {
                                                                type: "text",
                                                                id: "l3_s2_text_lulus",
                                                                deletable: true,
                                                                movable: true,
                                                                editable: true,
                                                                fields: { TEXT: "Lulus" }
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            ELSE: {
                                                block: {
                                                    type: "text_print",
                                                    id: "l3_s3_print_remedial",
                                                    deletable: true,
                                                    movable: true,
                                                    editable: true,
                                                    inputs: {
                                                        TEXT: {
                                                            block: {
                                                                type: "text",
                                                                id: "l3_s3_text_remedial",
                                                                deletable: true,
                                                                movable: true,
                                                                editable: true,
                                                                fields: { TEXT: "Remedial" }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        },
        aturan_validasi: {
            min_jumlah_print: 2,
            wajib_kode: [
                { pola: "if ", pesan: "❌ Jangan hapus blok percabangan if!" },
                { pola: "else:", pesan: "❌ Isi bagian else pada blok if dengan blok print untuk menampilkan Remedial!" }
            ]
        },
        uji_kasus: [
            {
                input: ["80"],
                expectedOutput: "Lulus",
                keterangan: "Jika nilai=80 (memenuhi batas ≥ 75), tampilkan Lulus"
            },
            {
                input: ["75"],
                expectedOutput: "Lulus",
                keterangan: "Jika nilai=75 (tepat di batas 75), tampilkan Lulus"
            },
            {
                input: ["60"],
                expectedOutput: "Remedial",
                keterangan: "Jika nilai=60 (di bawah batas 75), tampilkan Remedial"
            }
        ],
        bantuan: {
            teks: `Tarik blok <code>print</code> ke dalam slot <code>else</code> yang masih kosong, lalu isi dengan blok teks <code>"Remedial"</code>.`,
            level1: {
                penalty: 3,
                description: "Menandai blok print di kategori I/O dan blok teks di kategori Text untuk mengisi bagian else.",
                steps: [
                    {
                        category: "I/O",
                        block: "text_print",
                        instruction: "Buka kategori <strong>I/O</strong>, tarik blok <code>print</code> ke dalam slot <code>else</code> yang masih kosong.",
                        target: { blockType: "controls_if", isLast: true, input: "ELSE" }
                    },
                    {
                        category: "Text",
                        block: "text",
                        instruction: "Pasang blok teks dari kategori <strong>Text</strong> ke dalam print tersebut dan ketik <code>Remedial</code>.",
                        target: { blockType: "text_print", isLast: true, input: "TEXT" }
                    }
                ]
            },
            level2: {
                penalty: 5,
                description: "Memasukkan kerangka blok print dengan teks kosong untuk dipasang ke bagian else.",
                insert: {
                    type: "text_print",
                    inputs: {
                        TEXT: {
                            block: {
                                type: "text",
                                fields: { TEXT: "" }
                            }
                        }
                    }
                },
                markFields: ["TEXT"]
            }
        }
    },

    {
        id: "L3-S4",
        level: 3,
        judul_level: "Penilaian Ujian Praktik",
        nomor: 4,
        tipe: "If-elif-else, tiga kategori",
        teks_soal: `Pak Andi ingin mengelompokkan nilai ujian siswa ke dalam tiga kategori penilaian berdasarkan variabel <strong>nilai</strong> dan <strong>batas</strong> (bernilai <strong>75</strong>):<br>• Jika <strong>nilai ≥ 90</strong>, tampilkan <code>Kategori: Sangat Baik</code><br>• Jika <strong>nilai ≥ batas</strong> (yaitu minimal 75), tampilkan <code>Kategori: Baik</code><br>• Selain itu (di bawah 75), tampilkan <code>Kategori: Remedial</code><br><strong>Tanpa menghapus blok variabel sebelumnya</strong>, ubah percabangan <code>if</code> menjadi tiga jalur (<code>if</code>, <code>else if</code>, dan <code>else</code>) sesuai aturan di atas. Saat diuji dengan memasukkan nilai ujian <strong>95</strong>, program menampilkan <code>Kategori: Sangat Baik</code>.`,
        hasil_diharapkan: "Kategori: Sangat Baik",
        petunjuk_konsep: [
            "Percabangan bisa memiliki jalur kedua dengan syarat sendiri menggunakan cabang else if.",
            "Program memeriksa syarat dari atas ke bawah dan berhenti pada cabang pertama yang bernilai benar.",
            "Karena itu, syarat batas nilai yang lebih tinggi (nilai ≥ 90) harus diletakkan pada cabang if paling atas sebelum nilai ≥ batas (75)."
        ],
        tips_langkah: [
            "Ubah syarat <code>if</code> paling atas menjadi <code>nilai ≥ 90</code> (menggunakan blok angka <code>90</code> dari <strong>Math</strong>), dan ubah teks <code>print</code> di dalamnya menjadi <code>\"Kategori: Sangat Baik\"</code>.",
            "Klik ikon gerigi (⚙️) pada blok <code>if</code> untuk menambahkan satu cabang <code>else if</code> di atas <code>else</code>. Isi syarat <code>else if</code> dengan <code>nilai ≥ batas</code> dan pasang <code>print</code> berisi teks <code>\"Kategori: Baik\"</code>.",
            "Pada bagian <code>else</code>, ubah teks <code>print</code> menjadi <code>\"Kategori: Remedial\"</code>, lalu uji dengan memasukkan nilai <code>95</code>."
        ],
        bantuan_teks: `Klik ikon gerigi (⚙️) pada blok <code>if</code> untuk menambahkan cabang <code>else if</code>. Atur syarat pertama (<code>if</code>) menjadi <code>nilai ≥ 90</code> dengan <code>print</code> <code>"Kategori: Sangat Baik"</code>, syarat kedua (<code>else if</code>) menjadi <code>nilai ≥ batas</code> dengan <code>print</code> <code>"Kategori: Baik"</code>, dan bagian <code>else</code> mencetak <code>"Kategori: Remedial"</code>.`,
        blok_tersedia: ["Text", "Math", "I/O", "Variables", "Control", "Logic"],
        mode_awal: "lanjut",
        workspace_awal: null,
        kunci_workspace: {
            variables: [
                { name: "batas", id: "var_batas" },
                { name: "nilai", id: "var_nilai" }
            ],
            blocks: {
                languageVersion: 0,
                blocks: [
                    {
                        type: "variables_set",
                        id: "l3_s1_set_batas",
                        x: 40,
                        y: 40,
                        locked: true,
                        fields: { VAR: { id: "var_batas", name: "batas" } },
                        inputs: {
                            VALUE: {
                                block: {
                                    type: "math_number",
                                    id: "l3_s1_num_batas",
                                    locked: true,
                                    fields: { NUM: 75 }
                                }
                            }
                        },
                        next: {
                            block: {
                                type: "variables_set",
                                id: "l3_s1_set_nilai",
                                locked: true,
                                fields: { VAR: { id: "var_nilai", name: "nilai" } },
                                inputs: {
                                    VALUE: {
                                        block: {
                                            type: "read_number",
                                            id: "l3_s1_read_nilai",
                                            locked: true,
                                            inputs: {
                                                PROMPT: {
                                                    shadow: {
                                                        type: "text",
                                                        id: "l3_s1_prompt_nilai",
                                                        fields: { TEXT: "Masukkan nilai ujian:" }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                next: {
                                    block: {
                                        type: "controls_if",
                                        id: "l3_s4_ifelifelse",
                                        locked: true,
                                        extraState: { elseIfCount: 1, hasElse: true },
                                        inputs: {
                                            IF0: {
                                                block: {
                                                    type: "logic_compare",
                                                    id: "l3_s4_cmp_90",
                                                    locked: true,
                                                    fields: { OP: "GTE" },
                                                    inputs: {
                                                        A: {
                                                            block: {
                                                                type: "variables_get",
                                                                id: "l3_s4_get_nilai1",
                                                                locked: true,
                                                                fields: { VAR: { id: "var_nilai", name: "nilai" } }
                                                            }
                                                        },
                                                        B: {
                                                            block: {
                                                                type: "math_number",
                                                                id: "l3_s4_num_90",
                                                                locked: true,
                                                                fields: { NUM: 90 }
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            DO0: {
                                                block: {
                                                    type: "text_print",
                                                    id: "l3_s4_print_sb",
                                                    locked: true,
                                                    inputs: {
                                                        TEXT: {
                                                            block: {
                                                                type: "text",
                                                                id: "l3_s4_text_sb",
                                                                locked: true,
                                                                fields: { TEXT: "Kategori: Sangat Baik" }
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            IF1: {
                                                block: {
                                                    type: "logic_compare",
                                                    id: "l3_s4_cmp_batas",
                                                    locked: true,
                                                    fields: { OP: "GTE" },
                                                    inputs: {
                                                        A: {
                                                            block: {
                                                                type: "variables_get",
                                                                id: "l3_s4_get_nilai2",
                                                                locked: true,
                                                                fields: { VAR: { id: "var_nilai", name: "nilai" } }
                                                            }
                                                        },
                                                        B: {
                                                            block: {
                                                                type: "variables_get",
                                                                id: "l3_s4_get_batas",
                                                                locked: true,
                                                                fields: { VAR: { id: "var_batas", name: "batas" } }
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            DO1: {
                                                block: {
                                                    type: "text_print",
                                                    id: "l3_s4_print_b",
                                                    locked: true,
                                                    inputs: {
                                                        TEXT: {
                                                            block: {
                                                                type: "text",
                                                                id: "l3_s4_text_b",
                                                                locked: true,
                                                                fields: { TEXT: "Kategori: Baik" }
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            ELSE: {
                                                block: {
                                                    type: "text_print",
                                                    id: "l3_s4_print_r",
                                                    locked: true,
                                                    inputs: {
                                                        TEXT: {
                                                            block: {
                                                                type: "text",
                                                                id: "l3_s4_text_r",
                                                                locked: true,
                                                                fields: { TEXT: "Kategori: Remedial" }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        },
        aturan_validasi: {
            min_jumlah_print: 3,
            wajib_kode: [
                { pola: "elif ", pesan: "❌ Gunakan tiga jalur percabangan (if, else if, dan else) dengan menekan ikon gerigi pada blok if!" },
                { pola: "90", pesan: "❌ Syarat untuk kategori Sangat Baik harus memeriksa angka 90!" }
            ]
        },
        uji_kasus: [
            {
                input: ["95"],
                expectedOutput: "Kategori: Sangat Baik",
                keterangan: "Jika nilai=95 (≥ 90), tampilkan Kategori: Sangat Baik"
            },
            {
                input: ["90"],
                expectedOutput: "Kategori: Sangat Baik",
                keterangan: "Jika nilai=90 (tepat di batas 90), tampilkan Kategori: Sangat Baik"
            },
            {
                input: ["80"],
                expectedOutput: "Kategori: Baik",
                keterangan: "Jika nilai=80 (≥ batas 75 dan < 90), tampilkan Kategori: Baik"
            },
            {
                input: ["75"],
                expectedOutput: "Kategori: Baik",
                keterangan: "Jika nilai=75 (tepat di batas 75), tampilkan Kategori: Baik"
            },
            {
                input: ["60"],
                expectedOutput: "Kategori: Remedial",
                keterangan: "Jika nilai=60 (< 75), tampilkan Kategori: Remedial"
            }
        ],
        bantuan: {
            teks: `Klik ikon gerigi (⚙️) pada blok <code>if</code> untuk menambahkan cabang <code>else if</code>. Atur syarat pertama (<code>if</code>) menjadi <code>nilai ≥ 90</code> dengan <code>print</code> <code>"Kategori: Sangat Baik"</code>, syarat kedua (<code>else if</code>) menjadi <code>nilai ≥ batas</code> dengan <code>print</code> <code>"Kategori: Baik"</code>, dan bagian <code>else</code> mencetak <code>"Kategori: Remedial"</code>.`,
            level1: {
                penalty: 3,
                description: "Menandai pengaturan cabang else-if pada blok if, perbandingan Logic, dan teks untuk 3 jalur kategori.",
                steps: [
                    {
                        category: "Control",
                        block: "controls_if",
                        action: "mutator_config",
                        mutatorOf: "controls_if",
                        instruction: "Klik ikon <strong>gerigi (⚙️)</strong> pada blok <code>if</code> di workspace (atau klik tombol otomatis di bawah), lalu pastikan terdapat 1 cabang <code>else if</code> dan 1 cabang <code>else</code>.",
                        target: { blockType: "controls_if", isLast: true, input: "IF0" }
                    },
                    {
                        category: "Logic",
                        block: "logic_compare",
                        instruction: "Pastikan syarat pertama (<code>if</code>) adalah <code>nilai ≥ 90</code> dengan print <code>\"Kategori: Sangat Baik\"</code>, lalu tarik blok perbandingan dari <strong>Logic</strong> ke syarat kedua (<code>else if</code>) untuk <code>nilai ≥ batas</code>.",
                        target: { blockType: "controls_if", isLast: true, input: "IF1" }
                    },
                    {
                        category: "I/O",
                        block: "text_print",
                        instruction: "Tarik blok <code>print</code> ke cabang <code>do</code> milik <code>else if</code> dengan teks <code>\"Kategori: Baik\"</code>, dan ubah teks pada bagian <code>else</code> menjadi <code>\"Kategori: Remedial\"</code>.",
                        target: { blockType: "controls_if", isLast: true, input: "DO1" }
                    }
                ]
            },
            level2: {
                penalty: 5,
                description: "Memasukkan kerangka percabangan tiga jalur (if / else if / else) untuk dilengkapi.",
                insert: {
                    type: "controls_if",
                    extraState: { elseIfCount: 1, hasElse: true },
                    inputs: {
                        IF0: {
                            block: {
                                type: "logic_compare",
                                fields: { OP: "GTE" },
                                inputs: {
                                    A: { block: { type: "variables_get", fields: { VAR: { id: "var_nilai", name: "nilai" } } } },
                                    B: { block: { type: "math_number", fields: { NUM: 0 } } }
                                }
                            }
                        },
                        DO0: {
                            block: {
                                type: "text_print",
                                inputs: { TEXT: { block: { type: "text", fields: { TEXT: "Kategori: " } } } }
                            }
                        },
                        IF1: {
                            block: {
                                type: "logic_compare",
                                fields: { OP: "GTE" },
                                inputs: {
                                    A: { block: { type: "variables_get", fields: { VAR: { id: "var_nilai", name: "nilai" } } } },
                                    B: { block: { type: "variables_get", fields: { VAR: { id: "var_batas", name: "batas" } } } }
                                }
                            }
                        },
                        DO1: {
                            block: {
                                type: "text_print",
                                inputs: { TEXT: { block: { type: "text", fields: { TEXT: "Kategori: " } } } }
                            }
                        },
                        ELSE: {
                            block: {
                                type: "text_print",
                                inputs: { TEXT: { block: { type: "text", fields: { TEXT: "Kategori: " } } } }
                            }
                        }
                    }
                },
                markFields: ["NUM", "TEXT"]
            }
        }
    },

    {
        id: "L3-S5",
        level: 3,
        judul_level: "Penilaian Ujian Praktik",
        nomor: 5,
        tipe: "Menerapkan (lanjutan)",
        teks_soal: `Sekolah menambah aturan kelulusan baru: selain nilai ujian, persentase kehadiran siswa juga diperiksa dengan <strong>batas minimal kehadiran 80</strong>. <strong>Tanpa menghapus blok sebelumnya</strong>, buat variabel bernama <strong>kehadiran</strong> tepat di bawah blok <code>set [nilai]</code>, lalu isi dengan blok <code>read int</code> untuk meminta input kehadiran (angka bulat). Selanjutnya, tambahkan blok percabangan <code>if-else</code> baru di paling bawah program dengan ketentuan:<br>• Jika <strong>nilai ≥ batas (75)</strong> <strong>dan</strong> (<code>and</code>) <strong>kehadiran ≥ 80</strong>, tampilkan <code>Status: Lulus</code><br>• Selain itu, tampilkan <code>Status: Tidak Lulus</code><br>Saat diuji dengan memasukkan nilai ujian <strong>95</strong> dan kehadiran <strong>90</strong>, program menampilkan:<br><code>Kategori: Sangat Baik</code><br><code>Status: Lulus</code>`,
        hasil_diharapkan: "Kategori: Sangat Baik\nStatus: Lulus",
        petunjuk_konsep: [
            "Ada dua syarat yang harus terpenuhi sekaligus (nilai ≥ batas dan kehadiran ≥ 80). Gunakan blok logika 'and' dari kategori Logic untuk menggabungkannya.",
            "Jika salah satu syarat saja tidak terpenuhi (misalnya nilai 80 tetapi kehadiran 70), maka cabang else akan dijalankan dan mencetak Status: Tidak Lulus.",
            "Penentuan Kategori nilai dan Status kelulusan berdiri sendiri, sehingga blok percabangan Kategori di atasnya tidak perlu diubah."
        ],
        tips_langkah: [
            "Buat variabel baru bernama <code>kehadiran</code> di kategori <strong>Variables</strong>, lalu pasang blok <code>set [kehadiran] to</code> berisi <code>read int</code> tepat di bawah <code>set [nilai]</code>.",
            "Tambahkan blok <code>if-else</code> baru di paling bawah program (di bawah percabangan kategori).",
            "Pasang blok <code>and</code> dari kategori <strong>Logic</strong> ke syarat <code>if</code>: isi sisi kiri dengan <code>nilai ≥ batas</code> dan sisi kanan dengan <code>kehadiran ≥ 80</code>.",
            "Isi bagian <code>do</code> dengan <code>print</code> teks <code>\"Status: Lulus\"</code> dan bagian <code>else</code> dengan <code>print</code> teks <code>\"Status: Tidak Lulus\"</code>, lalu uji dengan memasukkan nilai <code>95</code> dan kehadiran <code>90</code>."
        ],
        bantuan_teks: `Buat <code>kehadiran = read int</code> (setelah <code>nilai</code>). Tambahkan <code>if-else</code> baru di bawah percabangan kategori dengan syarat <code>(nilai ≥ batas) and (kehadiran ≥ 80)</code>. Bagian <code>if</code> mencetak <code>"Status: Lulus"</code>, bagian <code>else</code> mencetak <code>"Status: Tidak Lulus"</code>.`,
        blok_tersedia: ["Text", "Math", "I/O", "Variables", "Control", "Logic"],
        mode_awal: "lanjut",
        workspace_awal: null,
        kunci_workspace: {
            variables: [
                { name: "batas", id: "var_batas" },
                { name: "nilai", id: "var_nilai" },
                { name: "kehadiran", id: "var_kehadiran" }
            ],
            blocks: {
                languageVersion: 0,
                blocks: [
                    {
                        type: "variables_set",
                        x: 40,
                        y: 40,
                        fields: { VAR: { id: "var_batas", name: "batas" } },
                        inputs: {
                            VALUE: { block: { type: "math_number", fields: { NUM: 75 } } }
                        },
                        next: {
                            block: {
                                type: "variables_set",
                                fields: { VAR: { id: "var_nilai", name: "nilai" } },
                                inputs: {
                                    VALUE: {
                                        block: {
                                            type: "read_number",
                                            inputs: { PROMPT: { shadow: { type: "text", fields: { TEXT: "Masukkan nilai ujian:" } } } }
                                        }
                                    }
                                },
                                next: {
                                    block: {
                                        type: "variables_set",
                                        fields: { VAR: { id: "var_kehadiran", name: "kehadiran" } },
                                        inputs: {
                                            VALUE: {
                                                block: {
                                                    type: "read_number",
                                                    inputs: { PROMPT: { shadow: { type: "text", fields: { TEXT: "Masukkan kehadiran:" } } } }
                                                }
                                            }
                                        },
                                        next: {
                                            block: {
                                                type: "controls_if",
                                                extraState: { elseIfCount: 1, hasElse: true },
                                                inputs: {
                                                    IF0: {
                                                        block: {
                                                            type: "logic_compare",
                                                            fields: { OP: "GTE" },
                                                            inputs: {
                                                                A: { block: { type: "variables_get", fields: { VAR: { id: "var_nilai", name: "nilai" } } } },
                                                                B: { block: { type: "math_number", fields: { NUM: 90 } } }
                                                            }
                                                        }
                                                    },
                                                    DO0: {
                                                        block: {
                                                            type: "text_print",
                                                            inputs: { TEXT: { block: { type: "text", fields: { TEXT: "Kategori: Sangat Baik" } } } }
                                                        }
                                                    },
                                                    IF1: {
                                                        block: {
                                                            type: "logic_compare",
                                                            fields: { OP: "GTE" },
                                                            inputs: {
                                                                A: { block: { type: "variables_get", fields: { VAR: { id: "var_nilai", name: "nilai" } } } },
                                                                B: { block: { type: "variables_get", fields: { VAR: { id: "var_batas", name: "batas" } } } }
                                                            }
                                                        }
                                                    },
                                                    DO1: {
                                                        block: {
                                                            type: "text_print",
                                                            inputs: { TEXT: { block: { type: "text", fields: { TEXT: "Kategori: Baik" } } } }
                                                        }
                                                    },
                                                    ELSE: {
                                                        block: {
                                                            type: "text_print",
                                                            inputs: { TEXT: { block: { type: "text", fields: { TEXT: "Kategori: Remedial" } } } }
                                                        }
                                                    }
                                                },
                                                next: {
                                                    block: {
                                                        type: "controls_if",
                                                        extraState: { hasElse: true },
                                                        inputs: {
                                                            IF0: {
                                                                block: {
                                                                    type: "logic_operation",
                                                                    fields: { OP: "AND" },
                                                                    inputs: {
                                                                        A: {
                                                                            block: {
                                                                                type: "logic_compare",
                                                                                fields: { OP: "GTE" },
                                                                                inputs: {
                                                                                    A: { block: { type: "variables_get", fields: { VAR: { id: "var_nilai", name: "nilai" } } } },
                                                                                    B: { block: { type: "variables_get", fields: { VAR: { id: "var_batas", name: "batas" } } } }
                                                                                }
                                                                            }
                                                                        },
                                                                        B: {
                                                                            block: {
                                                                                type: "logic_compare",
                                                                                fields: { OP: "GTE" },
                                                                                inputs: {
                                                                                    A: { block: { type: "variables_get", fields: { VAR: { id: "var_kehadiran", name: "kehadiran" } } } },
                                                                                    B: { block: { type: "math_number", fields: { NUM: 80 } } }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            },
                                                            DO0: {
                                                                block: {
                                                                    type: "text_print",
                                                                    inputs: { TEXT: { block: { type: "text", fields: { TEXT: "Status: Lulus" } } } }
                                                                }
                                                            },
                                                            ELSE: {
                                                                block: {
                                                                    type: "text_print",
                                                                    inputs: { TEXT: { block: { type: "text", fields: { TEXT: "Status: Tidak Lulus" } } } }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        },
        aturan_validasi: {
            min_jumlah_print: 4,
            wajib_kode: [
                { pola: "kehadiran =", pesan: "❌ Buat variabel 'kehadiran' dan isi dengan blok read int!" },
                { pola: " and ", pesan: "❌ Gunakan blok logika 'and' dari kategori Logic untuk menggabungkan syarat nilai dan kehadiran!" }
            ]
        },
        uji_kasus: [
            {
                input: ["95", "90"],
                expectedOutput: "Kategori: Sangat Baik\nStatus: Lulus",
                keterangan: "Jika diketik 95 dan 90 (nilai ≥ 90 dan kehadiran ≥ 80)"
            },
            {
                input: ["80", "70"],
                expectedOutput: "Kategori: Baik\nStatus: Tidak Lulus",
                keterangan: "Jika diketik 80 dan 70 (nilai ≥ 75 tetapi kehadiran < 80)"
            },
            {
                input: ["60", "100"],
                expectedOutput: "Kategori: Remedial\nStatus: Tidak Lulus",
                keterangan: "Jika diketik 60 dan 100 (kehadiran ≥ 80 tetapi nilai < 75)"
            },
            {
                input: ["75", "80"],
                expectedOutput: "Kategori: Baik\nStatus: Lulus",
                keterangan: "Jika diketik 75 dan 80 (tepat di batas nilai 75 dan kehadiran 80)"
            }
        ],
        bantuan: {
            teks: `Buat <code>kehadiran = read int</code> (setelah <code>nilai</code>). Tambahkan <code>if-else</code> baru di bawah percabangan kategori dengan syarat <code>(nilai ≥ batas) and (kehadiran ≥ 80)</code>. Bagian <code>if</code> mencetak <code>"Status: Lulus"</code>, bagian <code>else</code> mencetak <code>"Status: Tidak Lulus"</code>.`,
            level1: {
                penalty: 3,
                description: "Menandai pembuatan variabel kehadiran (read int), blok if-else di Control, dan operator logika and di Logic.",
                steps: [
                    {
                        category: "Variables",
                        block: "variables_set",
                        variableName: "kehadiran",
                        instruction: "Buka kategori <strong>Variables</strong>, tarik blok <code>set [kehadiran] to</code> dan pasang tepat di bawah <code>set [nilai]</code>.",
                        target: { blockType: "variables_set", index: 1, connection: "next" }
                    },
                    {
                        category: "I/O",
                        block: "read_number",
                        instruction: "Buka kategori <strong>I/O</strong>, pasang blok <code>read int</code> ke dalam <code>set [kehadiran] to</code>.",
                        target: { blockType: "variables_set", isLast: true, input: "VALUE" }
                    },
                    {
                        category: "Control",
                        block: "controls_ifelse",
                        instruction: "Tarik blok <code>if-else</code> dari kategori <strong>Control</strong> ke bawah percabangan kategori.",
                        target: { type: "next_of_last" }
                    },
                    {
                        category: "Logic",
                        block: "logic_operation",
                        instruction: "Buka kategori <strong>Logic</strong>, pasang blok logika <code>and</code> pada syarat <code>if-else</code> baru.",
                        target: { blockType: "controls_if", isLast: true, input: "IF0" }
                    },
                    {
                        category: "Logic",
                        block: "logic_compare",
                        instruction: "Pasang blok perbandingan untuk <code>nilai ≥ batas</code> di sisi kiri <code>and</code> dan <code>kehadiran ≥ 80</code> di sisi kanan <code>and</code>, lalu cetak <code>\"Status: Lulus\"</code> pada <code>if</code> dan <code>\"Status: Tidak Lulus\"</code> pada <code>else</code>.",
                        target: { blockType: "logic_operation", isLast: true, input: "A" }
                    }
                ]
            },
            level2: {
                penalty: 5,
                description: "Memasukkan kerangka pembacaan kehadiran dan percabangan if-else dengan syarat gabungan and.",
                insert: {
                    type: "variables_set",
                    fields: { VAR: { name: "kehadiran" } },
                    inputs: {
                        VALUE: {
                            block: {
                                type: "read_number",
                                inputs: { PROMPT: { shadow: { type: "text", fields: { TEXT: "Masukkan kehadiran:" } } } }
                            }
                        }
                    },
                    next: {
                        block: {
                            type: "controls_if",
                            extraState: { hasElse: true },
                            inputs: {
                                IF0: {
                                    block: {
                                        type: "logic_operation",
                                        fields: { OP: "AND" },
                                        inputs: {
                                            A: {
                                                block: {
                                                    type: "logic_compare",
                                                    fields: { OP: "GTE" },
                                                    inputs: {
                                                        A: { block: { type: "variables_get", fields: { VAR: { name: "nilai" } } } },
                                                        B: { block: { type: "variables_get", fields: { VAR: { name: "batas" } } } }
                                                    }
                                                }
                                            },
                                            B: {
                                                block: {
                                                    type: "logic_compare",
                                                    fields: { OP: "GTE" },
                                                    inputs: {
                                                        A: { block: { type: "variables_get", fields: { VAR: { name: "kehadiran" } } } },
                                                        B: { block: { type: "math_number", fields: { NUM: 0 } } }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                DO0: {
                                    block: {
                                        type: "text_print",
                                        inputs: { TEXT: { block: { type: "text", fields: { TEXT: "" } } } }
                                    }
                                },
                                ELSE: {
                                    block: {
                                        type: "text_print",
                                        inputs: { TEXT: { block: { type: "text", fields: { TEXT: "" } } } }
                                    }
                                }
                            }
                        }
                    }
                },
                markFields: ["NUM", "TEXT"]
            }
        }
    },

    // ========================================================================
    // LEVEL 4: Kasir Digital (5 Soal)
    // ========================================================================
    {
        id: "L4-S1",
        level: 4,
        judul_level: "Kasir Digital",
        nomor: 1,
        tipe: "Loop sampai berhenti dan akumulator",
        teks_soal: `Bu Wati membuka kasir digital di warungnya. Kasir ini harus <strong>terus meminta harga barang satu per satu sampai kasir mengetik angka 0</strong> tanda belanja selesai. Variabel <strong>total</strong> dan pembacaan <strong>harga</strong> pertama sudah ada di workspace. <strong>Tanpa menghapus blok yang sudah ada</strong>, buat perulangan yang menjumlahkan setiap harga ke total dan terus membaca harga baru, lalu tampilkan hasilnya setelah perulangan selesai dengan format: <code>Total belanja: [total]</code> (Jika diketik 5000, 12000, 3000, 0 maka tampil <code>Total belanja: 20000</code>).`,
        hasil_diharapkan: "Total belanja: 20000",
        petunjuk_konsep: [
            "Jumlah barang belum diketahui, jadi perulangan berjalan selama harga bukan 0, bukan sebanyak angka tertentu.",
            "Di dalam perulangan, harga ditambahkan ke total, lalu harga berikutnya dibaca lagi.",
            "Hasil akhir ditampilkan satu kali, jadi cetaknya berada di luar perulangan."
        ],
        tips_langkah: [
            "Ambil blok <code>repeat while</code> dari kategori <strong>Loops</strong>, lalu isi syaratnya <code>harga ≠ 0</code>.",
            "Di dalamnya, pasang <code>set [total] to total + harga</code>, lalu <code>set [harga] to read int</code>.",
            "Di bawah perulangan (di luar), tambahkan <code>print</code> dengan <code>create text with</code> berisi teks <code>\"Total belanja: \"</code> dan variabel <code>total</code>."
        ],
        blok_tersedia: ["Text", "Math", "I/O", "Variables", "Control", "Logic", "Loops"],
        mode_awal: "preset",
        workspace_awal: {
            variables: [
                { name: "total", id: "var_l4_total" },
                { name: "harga", id: "var_l4_harga" }
            ],
            blocks: {
                languageVersion: 0,
                blocks: [
                    {
                        type: "variables_set",
                        id: "l4_s1_set_total",
                        x: 40,
                        y: 40,
                        locked: true,
                        fields: { VAR: { id: "var_l4_total", name: "total" } },
                        inputs: {
                            VALUE: {
                                block: {
                                    type: "math_number",
                                    id: "l4_s1_num_0",
                                    locked: true,
                                    fields: { NUM: 0 }
                                }
                            }
                        },
                        next: {
                            block: {
                                type: "variables_set",
                                id: "l4_s1_set_harga",
                                locked: true,
                                fields: { VAR: { id: "var_l4_harga", name: "harga" } },
                                inputs: {
                                    VALUE: {
                                        block: {
                                            type: "read_number",
                                            id: "l4_s1_read_harga",
                                            locked: true,
                                            inputs: {
                                                PROMPT: {
                                                    shadow: {
                                                        type: "text",
                                                        id: "l4_s1_prompt_harga",
                                                        fields: { TEXT: "Masukkan harga barang:" }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        },
        kunci_workspace: {
            variables: [
                { name: "total", id: "var_l4_total" },
                { name: "harga", id: "var_l4_harga" }
            ],
            blocks: {
                languageVersion: 0,
                blocks: [
                    {
                        type: "variables_set",
                        id: "l4_s1_set_total",
                        x: 40,
                        y: 40,
                        locked: true,
                        fields: { VAR: { id: "var_l4_total", name: "total" } },
                        inputs: {
                            VALUE: {
                                block: {
                                    type: "math_number",
                                    id: "l4_s1_num_0",
                                    locked: true,
                                    fields: { NUM: 0 }
                                }
                            }
                        },
                        next: {
                            block: {
                                type: "variables_set",
                                id: "l4_s1_set_harga",
                                locked: true,
                                fields: { VAR: { id: "var_l4_harga", name: "harga" } },
                                inputs: {
                                    VALUE: {
                                        block: {
                                            type: "read_number",
                                            id: "l4_s1_read_harga",
                                            locked: true,
                                            inputs: {
                                                PROMPT: {
                                                    shadow: {
                                                        type: "text",
                                                        id: "l4_s1_prompt_harga",
                                                        fields: { TEXT: "Masukkan harga barang:" }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                next: {
                                    block: {
                                        type: "controls_whileUntil",
                                        id: "l4_s1_while",
                                        deletable: false,
                                        movable: true,
                                        editable: true,
                                        fields: { MODE: "WHILE" },
                                        inputs: {
                                            BOOL: {
                                                block: {
                                                    type: "logic_compare",
                                                    id: "l4_s1_cmp_neq0",
                                                    locked: true,
                                                    fields: { OP: "NEQ" },
                                                    inputs: {
                                                        A: {
                                                            block: {
                                                                type: "variables_get",
                                                                id: "l4_s1_get_harga_cond",
                                                                locked: true,
                                                                fields: { VAR: { id: "var_l4_harga", name: "harga" } }
                                                            }
                                                        },
                                                        B: {
                                                            block: {
                                                                type: "math_number",
                                                                id: "l4_s1_num_cond0",
                                                                locked: true,
                                                                fields: { NUM: 0 }
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            DO: {
                                                block: {
                                                    // Di Soal 2 siswa memindahkan blok set [total] ini ke dalam if harga > 0
                                                    type: "variables_set",
                                                    id: "l4_s1_add_total",
                                                    deletable: false,
                                                    movable: true,
                                                    editable: true,
                                                    fields: { VAR: { id: "var_l4_total", name: "total" } },
                                                    inputs: {
                                                        VALUE: {
                                                            block: {
                                                                type: "math_arithmetic",
                                                                id: "l4_s1_math_add",
                                                                deletable: false,
                                                                movable: true,
                                                                editable: true,
                                                                fields: { OP: "ADD" },
                                                                inputs: {
                                                                    A: {
                                                                        block: {
                                                                            type: "variables_get",
                                                                            id: "l4_s1_get_total_a",
                                                                            deletable: false,
                                                                            movable: true,
                                                                            editable: true,
                                                                            fields: { VAR: { id: "var_l4_total", name: "total" } }
                                                                        }
                                                                    },
                                                                    B: {
                                                                        block: {
                                                                            type: "variables_get",
                                                                            id: "l4_s1_get_harga_b",
                                                                            deletable: false,
                                                                            movable: true,
                                                                            editable: true,
                                                                            fields: { VAR: { id: "var_l4_harga", name: "harga" } }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    },
                                                    next: {
                                                        block: {
                                                            type: "variables_set",
                                                            id: "l4_s1_read_next_harga",
                                                            deletable: false,
                                                            movable: true,
                                                            editable: true,
                                                            fields: { VAR: { id: "var_l4_harga", name: "harga" } },
                                                            inputs: {
                                                                VALUE: {
                                                                    block: {
                                                                        type: "read_number",
                                                                        id: "l4_s1_read_int_loop",
                                                                        deletable: false,
                                                                        movable: true,
                                                                        editable: true,
                                                                        inputs: {
                                                                            PROMPT: {
                                                                                shadow: {
                                                                                    type: "text",
                                                                                    id: "l4_s1_prompt_loop",
                                                                                    fields: { TEXT: "Masukkan harga barang:" }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        next: {
                                            block: {
                                                type: "text_print",
                                                id: "l4_s1_print_total",
                                                locked: true,
                                                inputs: {
                                                    TEXT: {
                                                        block: {
                                                            type: "text_join",
                                                            id: "l4_s1_join_total",
                                                            locked: true,
                                                            extraState: { itemCount: 2 },
                                                            inputs: {
                                                                ADD0: {
                                                                    block: {
                                                                        type: "text",
                                                                        id: "l4_s1_text_total",
                                                                        locked: true,
                                                                        fields: { TEXT: "Total belanja: " }
                                                                    }
                                                                },
                                                                ADD1: {
                                                                    block: {
                                                                        type: "variables_get",
                                                                        id: "l4_s1_get_total_out",
                                                                        locked: true,
                                                                        fields: { VAR: { id: "var_l4_total", name: "total" } }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        },
        aturan_validasi: {
            min_jumlah_print: 1,
            wajib_kode: [
                { pola: "while ", pesan: "❌ Gunakan blok perulangan repeat while dari kategori Loops!" },
                { pola: "!=", pesan: "❌ Syarat perulangan repeat while harus memeriksa apakah harga ≠ 0!" },
                { pola: "+", pesan: "❌ Tambahkan harga ke variabel total di dalam perulangan menggunakan operasi penjumlahan (+)!" }
            ]
        },
        uji_kasus: [
            {
                input: ["5000", "12000", "3000", "0"],
                expectedOutput: "Total belanja: 20000",
                keterangan: "Jika diketik 5000, 12000, 3000, lalu 0 (5000 + 12000 + 3000 = 20000)"
            },
            {
                input: ["10000", "7500", "2500", "4000", "0"],
                expectedOutput: "Total belanja: 24000",
                keterangan: "Jika diketik 10000, 7500, 2500, 4000, lalu 0 (total = 24000)"
            },
            {
                input: ["0"],
                expectedOutput: "Total belanja: 0",
                keterangan: "Jika langsung diketik 0 di awal (total = 0)"
            }
        ],
        bantuan: {
            level1: {
                penalty: 3,
                description: "Menandai blok repeat while di kategori Loops, perbandingan ≠ di Logic, serta akumulasi total dan print.",
                steps: [
                    {
                        category: "Loops",
                        block: "controls_whileUntil",
                        instruction: "Buka kategori <strong>Loops</strong>, tarik blok <code>repeat while</code> ke bawah blok <code>set [harga]</code>.",
                        target: { type: "next_of_last" }
                    },
                    {
                        category: "Logic",
                        block: "logic_compare",
                        instruction: "Pasang blok perbandingan dari <strong>Logic</strong> ke syarat <code>repeat while</code>, ubah operatornya menjadi <code>≠</code>, lalu isi dengan <code>harga ≠ 0</code>.",
                        target: { blockType: "controls_whileUntil", isLast: true, input: "BOOL" }
                    },
                    {
                        category: "Variables",
                        block: "variables_set",
                        instruction: "Di dalam <code>do</code> pada perulangan, pasang <code>set [total] to total + harga</code> diikuti <code>set [harga] to read int</code>.",
                        target: { blockType: "controls_whileUntil", isLast: true, input: "DO" }
                    },
                    {
                        category: "I/O",
                        block: "text_print",
                        instruction: "Di luar (di bawah) perulangan, pasang <code>print</code> dengan <code>create text with</code> berisi <code>\"Total belanja: \"</code> dan variabel <code>total</code>.",
                        target: { type: "next_of_last" }
                    }
                ]
            },
            level2: {
                penalty: 5,
                description: "Memasukkan kerangka repeat while beserta akumulasi total, pembacaan harga berikutnya, dan print hasil.",
                insert: {
                    type: "controls_whileUntil",
                    fields: { MODE: "WHILE" },
                    inputs: {
                        BOOL: {
                            block: {
                                type: "logic_compare",
                                fields: { OP: "NEQ" },
                                inputs: {
                                    A: { block: { type: "variables_get", fields: { VAR: { id: "var_l4_harga", name: "harga" } } } },
                                    B: { block: { type: "math_number", fields: { NUM: 0 } } }
                                }
                            }
                        },
                        DO: {
                            block: {
                                type: "variables_set",
                                fields: { VAR: { id: "var_l4_total", name: "total" } },
                                inputs: {
                                    VALUE: {
                                        block: {
                                            type: "math_arithmetic",
                                            fields: { OP: "ADD" },
                                            inputs: {
                                                A: { block: { type: "variables_get", fields: { VAR: { id: "var_l4_total", name: "total" } } } },
                                                B: { block: { type: "variables_get", fields: { VAR: { id: "var_l4_harga", name: "harga" } } } }
                                            }
                                        }
                                    }
                                },
                                next: {
                                    block: {
                                        type: "variables_set",
                                        fields: { VAR: { id: "var_l4_harga", name: "harga" } },
                                        inputs: {
                                            VALUE: {
                                                block: {
                                                    type: "read_number",
                                                    inputs: { PROMPT: { shadow: { type: "text", fields: { TEXT: "Masukkan harga barang:" } } } }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    next: {
                        block: {
                            type: "text_print",
                            inputs: {
                                TEXT: {
                                    block: {
                                        type: "text_join",
                                        extraState: { itemCount: 2 },
                                        inputs: {
                                            ADD0: { block: { type: "text", fields: { TEXT: "" } } },
                                            ADD1: { block: { type: "variables_get", fields: { VAR: { id: "var_l4_total", name: "total" } } } }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                markFields: ["TEXT"]
            }
        }
    },

    {
        id: "L4-S2",
        level: 4,
        judul_level: "Kasir Digital",
        nomor: 2,
        tipe: "Validasi di dalam loop",
        teks_soal: `Beberapa kali kasir salah mengetik harga menjadi angka negatif sehingga total belanja berkurang. Bu Wati ingin program menolak harga seperti itu. <strong>Tanpa menghapus blok sebelumnya</strong>, tambahkan percabangan di dalam perulangan. <strong>Harga negatif harus menampilkan pesan <code>Harga tidak valid!</code> dan tidak ikut ditambahkan ke total.</strong> Jika diketik 5000, -2000, 3000, 0 maka tampil: <code>Harga tidak valid!</code> lalu di akhir <code>Total belanja: 8000</code>.`,
        hasil_diharapkan: "Harga tidak valid!\nTotal belanja: 8000",
        petunjuk_konsep: [
            "Angka 0 sudah ditangani syarat perulangan. Percabangan di dalamnya hanya perlu memisahkan harga yang valid dan tidak valid.",
            "Pembacaan harga berikutnya tetap dilakukan di kedua jalur, kalau tidak perulangan tidak akan pernah berhenti.",
            "Pesan muncul tepat saat harga negatif diketik, bukan di akhir."
        ],
        tips_langkah: [
            "Di dalam perulangan, tambahkan blok <code>if-else</code> dari kategori <strong>Control</strong> dengan syarat <code>harga &gt; 0</code>.",
            "Pindahkan <code>set [total] to total + harga</code> ke dalam <code>if</code>, lalu isi <code>else</code> dengan <code>print</code> teks <code>\"Harga tidak valid!\"</code>.",
            "Pastikan <code>set [harga] to read int</code> tetap berada di luar <code>if-else</code> (di bawahnya, masih di dalam perulangan), agar selalu dijalankan."
        ],
        blok_tersedia: ["Text", "Math", "I/O", "Variables", "Control", "Logic", "Loops"],
        mode_awal: "lanjut",
        workspace_awal: null,
        kunci_workspace: {
            variables: [
                { name: "total", id: "var_l4_total" },
                { name: "harga", id: "var_l4_harga" },
                { name: "jumlah", id: "var_l4_jumlah" }
            ],
            blocks: {
                languageVersion: 0,
                blocks: [
                    {
                        type: "variables_set",
                        id: "l4_s1_set_total",
                        x: 40,
                        y: 40,
                        deletable: false,
                        movable: true,
                        editable: false,
                        fields: { VAR: { id: "var_l4_total", name: "total" } },
                        inputs: {
                            VALUE: {
                                block: {
                                    type: "math_number",
                                    id: "l4_s1_num_0",
                                    locked: true,
                                    fields: { NUM: 0 }
                                }
                            }
                        },
                        next: {
                            block: {
                                type: "variables_set",
                                id: "l4_s1_set_harga",
                                deletable: false,
                                movable: true,
                                editable: false,
                                fields: { VAR: { id: "var_l4_harga", name: "harga" } },
                                inputs: {
                                    VALUE: {
                                        block: {
                                            type: "read_number",
                                            id: "l4_s1_read_harga",
                                            locked: true,
                                            inputs: {
                                                PROMPT: {
                                                    shadow: {
                                                        type: "text",
                                                        id: "l4_s1_prompt_harga",
                                                        fields: { TEXT: "Masukkan harga barang:" }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                next: {
                                    block: {
                                        type: "controls_whileUntil",
                                        id: "l4_s1_while",
                                        deletable: false,
                                        movable: true,
                                        editable: true,
                                        fields: { MODE: "WHILE" },
                                        inputs: {
                                            BOOL: {
                                                block: {
                                                    type: "logic_compare",
                                                    id: "l4_s1_cmp_neq0",
                                                    locked: true,
                                                    fields: { OP: "NEQ" },
                                                    inputs: {
                                                        A: {
                                                            block: {
                                                                type: "variables_get",
                                                                id: "l4_s1_get_harga_cond",
                                                                locked: true,
                                                                fields: { VAR: { id: "var_l4_harga", name: "harga" } }
                                                            }
                                                        },
                                                        B: {
                                                            block: {
                                                                type: "math_number",
                                                                id: "l4_s1_num_cond0",
                                                                locked: true,
                                                                fields: { NUM: 0 }
                                                            }
                                                        }
                                                    }
                                                }
                                            },
                                            DO: {
                                                block: {
                                                    type: "controls_if",
                                                    id: "l4_s2_ifelse_valid",
                                                    deletable: false,
                                                    movable: true,
                                                    editable: true,
                                                    extraState: { hasElse: true },
                                                    inputs: {
                                                        IF0: {
                                                            block: {
                                                                type: "logic_compare",
                                                                id: "l4_s2_cmp_gt0",
                                                                locked: true,
                                                                fields: { OP: "GT" },
                                                                inputs: {
                                                                    A: {
                                                                        block: {
                                                                            type: "variables_get",
                                                                            id: "l4_s2_get_harga_gt",
                                                                            locked: true,
                                                                            fields: { VAR: { id: "var_l4_harga", name: "harga" } }
                                                                        }
                                                                    },
                                                                    B: {
                                                                        block: {
                                                                            type: "math_number",
                                                                            id: "l4_s2_num_gt0",
                                                                            locked: true,
                                                                            fields: { NUM: 0 }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        DO0: {
                                                            block: {
                                                                type: "variables_set",
                                                                id: "l4_s1_add_total",
                                                                locked: true,
                                                                fields: { VAR: { id: "var_l4_total", name: "total" } },
                                                                inputs: {
                                                                    VALUE: {
                                                                        block: {
                                                                            type: "math_arithmetic",
                                                                            id: "l4_s1_math_add",
                                                                            locked: true,
                                                                            fields: { OP: "ADD" },
                                                                            inputs: {
                                                                                A: {
                                                                                    block: {
                                                                                        type: "variables_get",
                                                                                        id: "l4_s1_get_total_a",
                                                                                        locked: true,
                                                                                        fields: { VAR: { id: "var_l4_total", name: "total" } }
                                                                                    }
                                                                                },
                                                                                B: {
                                                                                    block: {
                                                                                        type: "variables_get",
                                                                                        id: "l4_s1_get_harga_b",
                                                                                        locked: true,
                                                                                        fields: { VAR: { id: "var_l4_harga", name: "harga" } }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        ELSE: {
                                                            block: {
                                                                type: "text_print",
                                                                id: "l4_s2_print_invalid",
                                                                locked: true,
                                                                inputs: {
                                                                    TEXT: {
                                                                        block: {
                                                                            type: "text",
                                                                            id: "l4_s2_text_invalid",
                                                                            locked: true,
                                                                            fields: { TEXT: "Harga tidak valid!" }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    },
                                                    next: {
                                                        block: {
                                                            type: "variables_set",
                                                            id: "l4_s1_read_next_harga",
                                                            locked: true,
                                                            fields: { VAR: { id: "var_l4_harga", name: "harga" } },
                                                            inputs: {
                                                                VALUE: {
                                                                    block: {
                                                                        type: "read_number",
                                                                        id: "l4_s1_read_int_loop",
                                                                        locked: true,
                                                                        inputs: {
                                                                            PROMPT: {
                                                                                shadow: {
                                                                                    type: "text",
                                                                                    id: "l4_s1_prompt_loop",
                                                                                    fields: { TEXT: "Masukkan harga barang:" }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        next: {
                                            block: {
                                                type: "text_print",
                                                id: "l4_s1_print_total",
                                                locked: true,
                                                inputs: {
                                                    TEXT: {
                                                        block: {
                                                            type: "text_join",
                                                            id: "l4_s1_join_total",
                                                            locked: true,
                                                            extraState: { itemCount: 2 },
                                                            inputs: {
                                                                ADD0: {
                                                                    block: {
                                                                        type: "text",
                                                                        id: "l4_s1_text_total",
                                                                        locked: true,
                                                                        fields: { TEXT: "Total belanja: " }
                                                                    }
                                                                },
                                                                ADD1: {
                                                                    block: {
                                                                        type: "variables_get",
                                                                        id: "l4_s1_get_total_out",
                                                                        locked: true,
                                                                        fields: { VAR: { id: "var_l4_total", name: "total" } }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        },
        aturan_validasi: {
            min_jumlah_print: 2,
            wajib_kode: [
                { pola: "while ", pesan: "❌ Pertahankan blok perulangan repeat while!" },
                { pola: "if ", pesan: "❌ Tambahkan percabangan if-else di dalam perulangan untuk memvalidasi harga!" },
                { pola: "else:", pesan: "❌ Gunakan bagian else pada blok if untuk menampilkan pesan 'Harga tidak valid!'!" }
            ]
        },
        uji_kasus: [
            {
                input: ["5000", "-2000", "3000", "0"],
                expectedOutput: "Harga tidak valid!\nTotal belanja: 8000",
                keterangan: "Jika diketik 5000, -2000 (ditolak), 3000, 0 (Total belanja: 8000)"
            },
            {
                input: ["-1500", "4000", "-500", "6000", "0"],
                expectedOutput: "Harga tidak valid!\nHarga tidak valid!\nTotal belanja: 10000",
                keterangan: "Jika ada dua input negatif (-1500 dan -500), keduanya ditolak dan totalnya 10000"
            },
            {
                input: ["7000", "3000", "0"],
                expectedOutput: "Total belanja: 10000",
                keterangan: "Jika semua harga positif (7000 dan 3000), pesan tidak valid tidak muncul"
            }
        ],
        bantuan: {
            level1: {
                penalty: 3,
                description: "Menandai blok if-else di kategori Control, perbandingan > 0 di Logic, dan print pesan di I/O.",
                steps: [
                    {
                        category: "Control",
                        block: "controls_ifelse",
                        instruction: "Buka kategori <strong>Control</strong>, tarik blok <code>if-else</code> ke bagian atas di dalam <code>repeat while</code>.",
                        target: { blockType: "controls_whileUntil", isLast: true, input: "DO" }
                    },
                    {
                        category: "Logic",
                        block: "logic_compare",
                        instruction: "Pasang perbandingan <code>harga &gt; 0</code> sebagai syarat <code>if</code>, lalu pindahkan <code>set [total] to total + harga</code> ke dalam <code>do</code>.",
                        target: { blockType: "controls_if", isLast: true, input: "IF0" }
                    },
                    {
                        category: "I/O",
                        block: "text_print",
                        instruction: "Di bagian <code>else</code>, pasang <code>print</code> berisi teks <code>\"Harga tidak valid!\"</code>. Pastikan <code>set [harga] to read int</code> tetap di bawah <code>if-else</code>.",
                        target: { blockType: "controls_if", isLast: true, input: "ELSE" }
                    }
                ]
            },
            level2: {
                penalty: 5,
                description: "Memasukkan kerangka if-else untuk memvalidasi harga > 0.",
                insert: {
                    type: "controls_if",
                    extraState: { hasElse: true },
                    inputs: {
                        IF0: {
                            block: {
                                type: "logic_compare",
                                fields: { OP: "GT" },
                                inputs: {
                                    A: { block: { type: "variables_get", fields: { VAR: { id: "var_l4_harga", name: "harga" } } } },
                                    B: { block: { type: "math_number", fields: { NUM: 0 } } }
                                }
                            }
                        },
                        ELSE: {
                            block: {
                                type: "text_print",
                                inputs: {
                                    TEXT: { block: { type: "text", fields: { TEXT: "" } } }
                                }
                            }
                        }
                    }
                },
                markFields: ["TEXT"]
            }
        }
    },

    {
        id: "L4-S3",
        level: 4,
        judul_level: "Kasir Digital",
        nomor: 3,
        tipe: "Counter dan rata-rata",
        teks_soal: `Bu Wati juga ingin tahu rata-rata harga barang yang dibeli pelanggan. Untuk itu program perlu menghitung berapa barang valid yang sudah dimasukkan. <strong>Tanpa menghapus blok sebelumnya</strong>, tambahkan variabel <strong>jumlah</strong> sebagai penghitung barang valid, lalu tampilkan total, jumlah barang (<code>Jumlah barang: [jumlah]</code>), dan rata-rata (<code>Rata-rata: [rata_rata]</code>). <strong>Jika tidak ada barang valid, tampilkan <code>Rata-rata: 0</code></strong> agar program tidak error. Jika diketik 6000, -2000, 9000, 3000, 0 maka tampil: <code>Harga tidak valid!</code>, <code>Total belanja: 18000</code>, <code>Jumlah barang: 3</code>, dan <code>Rata-rata: 6000.0</code>. Jika langsung diketik 0 maka tampil: <code>Total belanja: 0</code>, <code>Jumlah barang: 0</code>, dan <code>Rata-rata: 0</code>.`,
        hasil_diharapkan: "Harga tidak valid!\nTotal belanja: 18000\nJumlah barang: 3\nRata-rata: 6000.0",
        petunjuk_konsep: [
            "Penghitung bertambah 1 tiap ada barang valid, jadi penambahannya berada di jalur harga valid.",
            "Seperti total, variabel jumlah harus bernilai awal 0 sebelum perulangan dimulai.",
            "Pembagian dengan 0 menyebabkan error, jadi rata-rata hanya dihitung bila jumlah > 0."
        ],
        tips_langkah: [
            "Gunakan variabel <code>jumlah</code> dari kategori <strong>Variables</strong>, lalu pasang <code>set [jumlah] to 0</code> di atas perulangan.",
            "Di jalur harga valid (di dalam <code>if harga &gt; 0</code>), tambahkan <code>set [jumlah] to jumlah + 1</code>.",
            "Di bawah <code>print</code> Total belanja, tambahkan <code>print</code> dengan <code>create text with</code> berisi teks <code>\"Jumlah barang: \"</code> dan variabel <code>jumlah</code>.",
            "Di bawahnya lagi, tambahkan <code>if-else</code> dengan syarat <code>jumlah &gt; 0</code>: cabang <code>if</code> mencetak <code>\"Rata-rata: \"</code> digabung <code>total ÷ jumlah</code>, dan cabang <code>else</code> mencetak <code>\"Rata-rata: 0\"</code>."
        ],
        blok_tersedia: ["Text", "Math", "I/O", "Variables", "Control", "Logic", "Loops"],
        mode_awal: "lanjut",
        workspace_awal: null,
        kunci_workspace: {
            // Semua blok di kunci_workspace Soal 3 diset deletable: false, movable: true, editable: true
            // agar di Soal 4 siswa dapat memindahkan rangkaian blok ke dalam perulangan luar (count with i from 1 to 3 by 1)!
            variables: [
                { name: "total", id: "var_l4_total" },
                { name: "harga", id: "var_l4_harga" },
                { name: "jumlah", id: "var_l4_jumlah" },
                { name: "omset", id: "var_l4_omset" },
                { name: "i", id: "var_l4_i" }
            ],
            blocks: {
                languageVersion: 0,
                blocks: [
                    {
                        type: "variables_set",
                        id: "l4_s1_set_total",
                        x: 40,
                        y: 40,
                        deletable: false,
                        movable: true,
                        editable: true,
                        fields: { VAR: { id: "var_l4_total", name: "total" } },
                        inputs: {
                            VALUE: {
                                block: {
                                    type: "math_number",
                                    id: "l4_s1_num_0",
                                    deletable: false,
                                    movable: true,
                                    editable: true,
                                    fields: { NUM: 0 }
                                }
                            }
                        },
                        next: {
                            block: {
                                type: "variables_set",
                                id: "l4_s3_set_jumlah",
                                deletable: false,
                                movable: true,
                                editable: true,
                                fields: { VAR: { id: "var_l4_jumlah", name: "jumlah" } },
                                inputs: {
                                    VALUE: {
                                        block: {
                                            type: "math_number",
                                            id: "l4_s3_num_jumlah0",
                                            deletable: false,
                                            movable: true,
                                            editable: true,
                                            fields: { NUM: 0 }
                                        }
                                    }
                                },
                                next: {
                                    block: {
                                        type: "variables_set",
                                        id: "l4_s1_set_harga",
                                        deletable: false,
                                        movable: true,
                                        editable: true,
                                        fields: { VAR: { id: "var_l4_harga", name: "harga" } },
                                        inputs: {
                                            VALUE: {
                                                block: {
                                                    type: "read_number",
                                                    id: "l4_s1_read_harga",
                                                    deletable: false,
                                                    movable: true,
                                                    editable: true,
                                                    inputs: {
                                                        PROMPT: {
                                                            shadow: {
                                                                type: "text",
                                                                id: "l4_s1_prompt_harga",
                                                                fields: { TEXT: "Masukkan harga barang:" }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        next: {
                                            block: {
                                                type: "controls_whileUntil",
                                                id: "l4_s1_while",
                                                deletable: false,
                                                movable: true,
                                                editable: true,
                                                fields: { MODE: "WHILE" },
                                                inputs: {
                                                    BOOL: {
                                                        block: {
                                                            type: "logic_compare",
                                                            id: "l4_s1_cmp_neq0",
                                                            deletable: false,
                                                            movable: true,
                                                            editable: true,
                                                            fields: { OP: "NEQ" },
                                                            inputs: {
                                                                A: {
                                                                    block: {
                                                                        type: "variables_get",
                                                                        id: "l4_s1_get_harga_cond",
                                                                        deletable: false,
                                                                        movable: true,
                                                                        editable: true,
                                                                        fields: { VAR: { id: "var_l4_harga", name: "harga" } }
                                                                    }
                                                                },
                                                                B: {
                                                                    block: {
                                                                        type: "math_number",
                                                                        id: "l4_s1_num_cond0",
                                                                        deletable: false,
                                                                        movable: true,
                                                                        editable: true,
                                                                        fields: { NUM: 0 }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    },
                                                    DO: {
                                                        block: {
                                                            type: "controls_if",
                                                            id: "l4_s2_ifelse_valid",
                                                            deletable: false,
                                                            movable: true,
                                                            editable: true,
                                                            extraState: { hasElse: true },
                                                            inputs: {
                                                                IF0: {
                                                                    block: {
                                                                        type: "logic_compare",
                                                                        id: "l4_s2_cmp_gt0",
                                                                        deletable: false,
                                                                        movable: true,
                                                                        editable: true,
                                                                        fields: { OP: "GT" },
                                                                        inputs: {
                                                                            A: {
                                                                                block: {
                                                                                    type: "variables_get",
                                                                                    id: "l4_s2_get_harga_gt",
                                                                                    deletable: false,
                                                                                    movable: true,
                                                                                    editable: true,
                                                                                    fields: { VAR: { id: "var_l4_harga", name: "harga" } }
                                                                                }
                                                                            },
                                                                            B: {
                                                                                block: {
                                                                                    type: "math_number",
                                                                                    id: "l4_s2_num_gt0",
                                                                                    deletable: false,
                                                                                    movable: true,
                                                                                    editable: true,
                                                                                    fields: { NUM: 0 }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                },
                                                                DO0: {
                                                                    block: {
                                                                        type: "variables_set",
                                                                        id: "l4_s1_add_total",
                                                                        deletable: false,
                                                                        movable: true,
                                                                        editable: true,
                                                                        fields: { VAR: { id: "var_l4_total", name: "total" } },
                                                                        inputs: {
                                                                            VALUE: {
                                                                                block: {
                                                                                    type: "math_arithmetic",
                                                                                    id: "l4_s1_math_add",
                                                                                    deletable: false,
                                                                                    movable: true,
                                                                                    editable: true,
                                                                                    fields: { OP: "ADD" },
                                                                                    inputs: {
                                                                                        A: {
                                                                                            block: {
                                                                                                type: "variables_get",
                                                                                                id: "l4_s1_get_total_a",
                                                                                                deletable: false,
                                                                                                movable: true,
                                                                                                editable: true,
                                                                                                fields: { VAR: { id: "var_l4_total", name: "total" } }
                                                                                            }
                                                                                        },
                                                                                        B: {
                                                                                            block: {
                                                                                                type: "variables_get",
                                                                                                id: "l4_s1_get_harga_b",
                                                                                                deletable: false,
                                                                                                movable: true,
                                                                                                editable: true,
                                                                                                fields: { VAR: { id: "var_l4_harga", name: "harga" } }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        },
                                                                        next: {
                                                                            block: {
                                                                                type: "variables_set",
                                                                                id: "l4_s3_inc_jumlah",
                                                                                deletable: false,
                                                                                movable: true,
                                                                                editable: true,
                                                                                fields: { VAR: { id: "var_l4_jumlah", name: "jumlah" } },
                                                                                inputs: {
                                                                                    VALUE: {
                                                                                        block: {
                                                                                            type: "math_arithmetic",
                                                                                            id: "l4_s3_math_inc",
                                                                                            deletable: false,
                                                                                            movable: true,
                                                                                            editable: true,
                                                                                            fields: { OP: "ADD" },
                                                                                            inputs: {
                                                                                                A: {
                                                                                                    block: {
                                                                                                        type: "variables_get",
                                                                                                        id: "l4_s3_get_jumlah_a",
                                                                                                        deletable: false,
                                                                                                        movable: true,
                                                                                                        editable: true,
                                                                                                        fields: { VAR: { id: "var_l4_jumlah", name: "jumlah" } }
                                                                                                    }
                                                                                                },
                                                                                                B: {
                                                                                                    block: {
                                                                                                        type: "math_number",
                                                                                                        id: "l4_s3_num_1",
                                                                                                        deletable: false,
                                                                                                        movable: true,
                                                                                                        editable: true,
                                                                                                        fields: { NUM: 1 }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                },
                                                                ELSE: {
                                                                    block: {
                                                                        type: "text_print",
                                                                        id: "l4_s2_print_invalid",
                                                                        deletable: false,
                                                                        movable: true,
                                                                        editable: true,
                                                                        inputs: {
                                                                            TEXT: {
                                                                                block: {
                                                                                    type: "text",
                                                                                    id: "l4_s2_text_invalid",
                                                                                    deletable: false,
                                                                                    movable: true,
                                                                                    editable: true,
                                                                                    fields: { TEXT: "Harga tidak valid!" }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            },
                                                            next: {
                                                                block: {
                                                                    type: "variables_set",
                                                                    id: "l4_s1_read_next_harga",
                                                                    deletable: false,
                                                                    movable: true,
                                                                    editable: true,
                                                                    fields: { VAR: { id: "var_l4_harga", name: "harga" } },
                                                                    inputs: {
                                                                        VALUE: {
                                                                            block: {
                                                                                type: "read_number",
                                                                                id: "l4_s1_read_int_loop",
                                                                                deletable: false,
                                                                                movable: true,
                                                                                editable: true,
                                                                                inputs: {
                                                                                    PROMPT: {
                                                                                        shadow: {
                                                                                            type: "text",
                                                                                            id: "l4_s1_prompt_loop",
                                                                                            fields: { TEXT: "Masukkan harga barang:" }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                },
                                                next: {
                                                    block: {
                                                        type: "text_print",
                                                        id: "l4_s1_print_total",
                                                        deletable: false,
                                                        movable: true,
                                                        editable: true,
                                                        inputs: {
                                                            TEXT: {
                                                                block: {
                                                                    type: "text_join",
                                                                    id: "l4_s1_join_total",
                                                                    deletable: false,
                                                                    movable: true,
                                                                    editable: true,
                                                                    extraState: { itemCount: 2 },
                                                                    inputs: {
                                                                        ADD0: {
                                                                            block: {
                                                                                type: "text",
                                                                                id: "l4_s1_text_total",
                                                                                deletable: false,
                                                                                movable: true,
                                                                                editable: true,
                                                                                fields: { TEXT: "Total belanja: " }
                                                                            }
                                                                        },
                                                                        ADD1: {
                                                                            block: {
                                                                                type: "variables_get",
                                                                                id: "l4_s1_get_total_out",
                                                                                deletable: false,
                                                                                movable: true,
                                                                                editable: true,
                                                                                fields: { VAR: { id: "var_l4_total", name: "total" } }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        next: {
                                                            block: {
                                                                type: "text_print",
                                                                id: "l4_s3_print_jumlah",
                                                                deletable: false,
                                                                movable: true,
                                                                editable: true,
                                                                inputs: {
                                                                    TEXT: {
                                                                        block: {
                                                                            type: "text_join",
                                                                            id: "l4_s3_join_jumlah",
                                                                            deletable: false,
                                                                            movable: true,
                                                                            editable: true,
                                                                            extraState: { itemCount: 2 },
                                                                            inputs: {
                                                                                ADD0: {
                                                                                    block: {
                                                                                        type: "text",
                                                                                        id: "l4_s3_text_jumlah",
                                                                                        deletable: false,
                                                                                        movable: true,
                                                                                        editable: true,
                                                                                        fields: { TEXT: "Jumlah barang: " }
                                                                                    }
                                                                                },
                                                                                ADD1: {
                                                                                    block: {
                                                                                        type: "variables_get",
                                                                                        id: "l4_s3_get_jumlah_out",
                                                                                        deletable: false,
                                                                                        movable: true,
                                                                                        editable: true,
                                                                                        fields: { VAR: { id: "var_l4_jumlah", name: "jumlah" } }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                },
                                                                next: {
                                                                    block: {
                                                                        type: "controls_if",
                                                                        id: "l4_s3_ifelse_rata",
                                                                        deletable: false,
                                                                        movable: true,
                                                                        editable: true,
                                                                        extraState: { hasElse: true },
                                                                        inputs: {
                                                                            IF0: {
                                                                                block: {
                                                                                    type: "logic_compare",
                                                                                    id: "l4_s3_cmp_jml_gt0",
                                                                                    deletable: false,
                                                                                    movable: true,
                                                                                    editable: true,
                                                                                    fields: { OP: "GT" },
                                                                                    inputs: {
                                                                                        A: {
                                                                                            block: {
                                                                                                type: "variables_get",
                                                                                                id: "l4_s3_get_jml_cond",
                                                                                                deletable: false,
                                                                                                movable: true,
                                                                                                editable: true,
                                                                                                fields: { VAR: { id: "var_l4_jumlah", name: "jumlah" } }
                                                                                            }
                                                                                        },
                                                                                        B: {
                                                                                            block: {
                                                                                                type: "math_number",
                                                                                                id: "l4_s3_num_jml0",
                                                                                                deletable: false,
                                                                                                movable: true,
                                                                                                editable: true,
                                                                                                fields: { NUM: 0 }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            },
                                                                            DO0: {
                                                                                block: {
                                                                                    type: "text_print",
                                                                                    id: "l4_s3_print_rata_val",
                                                                                    deletable: false,
                                                                                    movable: true,
                                                                                    editable: true,
                                                                                    inputs: {
                                                                                        TEXT: {
                                                                                            block: {
                                                                                                type: "text_join",
                                                                                                id: "l4_s3_join_rata",
                                                                                                deletable: false,
                                                                                                movable: true,
                                                                                                editable: true,
                                                                                                extraState: { itemCount: 2 },
                                                                                                inputs: {
                                                                                                    ADD0: {
                                                                                                        block: {
                                                                                                            type: "text",
                                                                                                            id: "l4_s3_text_rata",
                                                                                                            deletable: false,
                                                                                                            movable: true,
                                                                                                            editable: true,
                                                                                                            fields: { TEXT: "Rata-rata: " }
                                                                                                        }
                                                                                                    },
                                                                                                    ADD1: {
                                                                                                        block: {
                                                                                                            type: "math_arithmetic",
                                                                                                            id: "l4_s3_div_rata",
                                                                                                            deletable: false,
                                                                                                            movable: true,
                                                                                                            editable: true,
                                                                                                            fields: { OP: "DIVIDE" },
                                                                                                            inputs: {
                                                                                                                A: {
                                                                                                                    block: {
                                                                                                                        type: "variables_get",
                                                                                                                        id: "l4_s3_get_total_div",
                                                                                                                        deletable: false,
                                                                                                                        movable: true,
                                                                                                                        editable: true,
                                                                                                                        fields: { VAR: { id: "var_l4_total", name: "total" } }
                                                                                                                    }
                                                                                                                },
                                                                                                                B: {
                                                                                                                    block: {
                                                                                                                        type: "variables_get",
                                                                                                                        id: "l4_s3_get_jml_div",
                                                                                                                        deletable: false,
                                                                                                                        movable: true,
                                                                                                                        editable: true,
                                                                                                                        fields: { VAR: { id: "var_l4_jumlah", name: "jumlah" } }
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            },
                                                                            ELSE: {
                                                                                block: {
                                                                                    type: "text_print",
                                                                                    id: "l4_s3_print_rata_0",
                                                                                    deletable: false,
                                                                                    movable: true,
                                                                                    editable: true,
                                                                                    inputs: {
                                                                                        TEXT: {
                                                                                            block: {
                                                                                                type: "text",
                                                                                                id: "l4_s3_text_rata0",
                                                                                                deletable: false,
                                                                                                movable: true,
                                                                                                editable: true,
                                                                                                fields: { TEXT: "Rata-rata: 0" }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        },
        aturan_validasi: {
            min_jumlah_print: 4,
            wajib_kode: [
                { pola: "jumlah", pesan: "❌ Gunakan variabel 'jumlah' sebagai penghitung barang valid!" },
                { pola: "/", pesan: "❌ Hitung rata-rata menggunakan blok pembagian (total ÷ jumlah) dari kategori Math!" }
            ]
        },
        uji_kasus: [
            {
                input: ["6000", "-2000", "9000", "3000", "0"],
                expectedOutput: "Harga tidak valid!\nTotal belanja: 18000\nJumlah barang: 3\nRata-rata: 6000.0",
                keterangan: "Kasus normal: diketik 6000, -2000 (tidak valid), 9000, 3000, 0 (3 barang valid, rata-rata 6000.0)"
            },
            {
                input: ["0"],
                expectedOutput: "Total belanja: 0\nJumlah barang: 0\nRata-rata: 0",
                alternateOutputs: [
                    "Total belanja: 0\nJumlah barang: 0\nRata-rata: 0.0"
                ],
                keterangan: "Kasus langsung 0: tidak ada barang valid (jumlah = 0), rata-rata tampil 0 tanpa error pembagian nol"
            },
            {
                input: ["10000", "5000", "0"],
                expectedOutput: "Total belanja: 15000\nJumlah barang: 2\nRata-rata: 7500.0",
                keterangan: "Kasus 2 barang valid (10000 dan 5000 -> total 15000, rata-rata 7500.0)"
            }
        ],
        bantuan: {
            level1: {
                penalty: 3,
                description: "Menandai penggunaan variabel jumlah, penambahan jumlah + 1, dan percabangan rata-rata.",
                steps: [
                    {
                        category: "Variables",
                        block: "variables_set",
                        variableName: "jumlah",
                        instruction: "Buka kategori <strong>Variables</strong>, tarik <code>set [jumlah] to 0</code> dan pasang di atas perulangan (di bawah <code>set [total] to 0</code>).",
                        target: { blockType: "variables_set", index: 0, connection: "next" }
                    },
                    {
                        category: "Variables",
                        block: "variables_set",
                        variableName: "jumlah",
                        instruction: "Tarik <code>set [jumlah] to</code> ke dalam cabang <code>if harga &gt; 0</code> (di bawah <code>set [total] to total + harga</code>), lalu isi dengan <code>jumlah + 1</code>.",
                        target: { blockType: "controls_if", isLast: true, input: "DO0" }
                    },
                    {
                        category: "I/O",
                        block: "text_print",
                        instruction: "Di bawah <code>print</code> Total belanja, tambahkan <code>print</code> dengan <code>create text with</code> berisi <code>\"Jumlah barang: \"</code> dan variabel <code>jumlah</code>.",
                        target: { type: "next_of_last" }
                    },
                    {
                        category: "Control",
                        block: "controls_ifelse",
                        instruction: "Tambahkan <code>if-else</code> di paling bawah dengan syarat <code>jumlah &gt; 0</code>: cabang <code>if</code> mencetak <code>\"Rata-rata: \"</code> + (<code>total ÷ jumlah</code>), dan cabang <code>else</code> mencetak <code>\"Rata-rata: 0\"</code>.",
                        target: { type: "next_of_last" }
                    }
                ]
            },
            level2: {
                penalty: 5,
                description: "Memasukkan kerangka variabel jumlah, cetak Jumlah barang, dan percabangan if-else untuk Rata-rata.",
                insert: {
                    type: "variables_set",
                    fields: { VAR: { id: "var_l4_jumlah", name: "jumlah" } },
                    inputs: { VALUE: { block: { type: "math_number", fields: { NUM: 0 } } } },
                    next: {
                        block: {
                            type: "variables_set",
                            fields: { VAR: { id: "var_l4_jumlah", name: "jumlah" } },
                            inputs: {
                                VALUE: {
                                    block: {
                                        type: "math_arithmetic",
                                        fields: { OP: "ADD" },
                                        inputs: {
                                            A: { block: { type: "variables_get", fields: { VAR: { id: "var_l4_jumlah", name: "jumlah" } } } },
                                            B: { block: { type: "math_number", fields: { NUM: 0 } } }
                                        }
                                    }
                                }
                            },
                            next: {
                                block: {
                                    type: "text_print",
                                    inputs: {
                                        TEXT: {
                                            block: {
                                                type: "text_join",
                                                extraState: { itemCount: 2 },
                                                inputs: {
                                                    ADD0: { block: { type: "text", fields: { TEXT: "" } } },
                                                    ADD1: { block: { type: "variables_get", fields: { VAR: { id: "var_l4_jumlah", name: "jumlah" } } } }
                                                }
                                            }
                                        }
                                    },
                                    next: {
                                        block: {
                                            type: "controls_if",
                                            extraState: { hasElse: true },
                                            inputs: {
                                                IF0: {
                                                    block: {
                                                        type: "logic_compare",
                                                        fields: { OP: "GT" },
                                                        inputs: {
                                                            A: { block: { type: "variables_get", fields: { VAR: { id: "var_l4_jumlah", name: "jumlah" } } } },
                                                            B: { block: { type: "math_number", fields: { NUM: 0 } } }
                                                        }
                                                    }
                                                },
                                                DO0: {
                                                    block: {
                                                        type: "text_print",
                                                        inputs: {
                                                            TEXT: {
                                                                block: {
                                                                    type: "text_join",
                                                                    extraState: { itemCount: 2 },
                                                                    inputs: {
                                                                        ADD0: { block: { type: "text", fields: { TEXT: "" } } },
                                                                        ADD1: {
                                                                            block: {
                                                                                type: "math_arithmetic",
                                                                                fields: { OP: "DIVIDE" },
                                                                                inputs: {
                                                                                    A: { block: { type: "variables_get", fields: { VAR: { id: "var_l4_total", name: "total" } } } },
                                                                                    B: { block: { type: "variables_get", fields: { VAR: { id: "var_l4_jumlah", name: "jumlah" } } } }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                },
                                                ELSE: {
                                                    block: {
                                                        type: "text_print",
                                                        inputs: {
                                                            TEXT: { block: { type: "text", fields: { TEXT: "" } } }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                markFields: ["NUM", "TEXT"]
            }
        }
    },

    {
        id: "L4-S4",
        level: 4,
        judul_level: "Kasir Digital",
        nomor: 4,
        tipe: "Nested loop",
        teks_soal: `Pada jam ramai, kasir Bu Wati melayani <strong>tiga pelanggan secara berurutan</strong>. Setiap pelanggan punya total, jumlah barang, dan rata-rata sendiri. Di akhir hari, Bu Wati ingin tahu omset keseluruhan. <strong>Tanpa menghapus blok sebelumnya</strong>, bungkus seluruh proses belanja ke dalam perulangan luar <code>count with i from 1 to 3 by 1</code> yang berjalan <strong>3 kali</strong> (tampilkan <code>Pelanggan [i]</code> di awal tiap pelanggan), lalu tampilkan omset toko (<code>Omset toko: [omset]</code>) setelah ketiga pelanggan selesai. Jika diketik 6000, 9000, 0, 4000, -1000, 8000, 0, 10000, 0 maka tampil rincian <code>Pelanggan 1</code> (Total 15000), <code>Pelanggan 2</code> (Total 12000), <code>Pelanggan 3</code> (Total 10000), dan di akhir <code>Omset toko: 37000</code>.`,
        hasil_diharapkan: "Pelanggan 1\nTotal belanja: 15000\nJumlah barang: 2\nRata-rata: 7500.0\nPelanggan 2\nHarga tidak valid!\nTotal belanja: 12000\nJumlah barang: 2\nRata-rata: 6000.0\nPelanggan 3\nTotal belanja: 10000\nJumlah barang: 1\nRata-rata: 10000.0\nOmset toko: 37000",
        petunjuk_konsep: [
            "Perulangan luar berjalan tetap 3 kali (jumlah pelanggan sudah diketahui). Perulangan dalam berjalan sampai harga 0.",
            "total dan jumlah adalah milik satu pelanggan, jadi harus dikembalikan ke 0 di awal tiap putaran luar.",
            "omset adalah milik seluruh toko, jadi bernilai awal 0 di luar semua perulangan dan bertambah setiap satu pelanggan selesai."
        ],
        tips_langkah: [
            "Pasang <code>set [omset] to 0</code> di paling atas program, lalu ambil blok <code>count with i from 1 to 3 by 1</code> dari kategori <strong>Loops</strong> di bawahnya.",
            "Di baris pertama dalam <code>count with</code>, tampilkan <code>Pelanggan [i]</code> (menggunakan <code>print</code> dan <code>create text with</code> berisi <code>\"Pelanggan \"</code> serta variabel <code>i</code>).",
            "Pindahkan seluruh rangkaian belanja satu pelanggan (mulai dari <code>set [total] to 0</code>, <code>set [jumlah] to 0</code>, <code>set [harga] to read int</code>, perulangan <code>while</code>, hingga cetak Rata-rata) ke dalam perulangan luar.",
            "Setelah perulangan <code>while</code> selesai (masih di dalam perulangan luar), tambahkan <code>set [omset] to omset + total</code>.",
            "Di luar (di bawah) perulangan luar, tampilkan omset dengan <code>print</code> berisi <code>\"Omset toko: \"</code> dan variabel <code>omset</code>."
        ],
        blok_tersedia: ["Text", "Math", "I/O", "Variables", "Control", "Logic", "Loops"],
        mode_awal: "lanjut",
        workspace_awal: null,
        kunci_workspace: {
            variables: [
                { name: "total", id: "var_l4_total" },
                { name: "harga", id: "var_l4_harga" },
                { name: "jumlah", id: "var_l4_jumlah" },
                { name: "omset", id: "var_l4_omset" },
                { name: "i", id: "var_l4_i" }
            ],
            blocks: {
                languageVersion: 0,
                blocks: [
                    {
                        type: "variables_set",
                        id: "l4_s4_set_omset0",
                        x: 40,
                        y: 40,
                        locked: true,
                        fields: { VAR: { id: "var_l4_omset", name: "omset" } },
                        inputs: {
                            VALUE: { block: { type: "math_number", locked: true, fields: { NUM: 0 } } }
                        },
                        next: {
                            block: {
                                type: "controls_for",
                                id: "l4_s4_for_pelanggan",
                                locked: true,
                                fields: { VAR: { id: "var_l4_i", name: "i" } },
                                inputs: {
                                    FROM: { block: { type: "math_number", locked: true, fields: { NUM: 1 } } },
                                    TO: { block: { type: "math_number", locked: true, fields: { NUM: 3 } } },
                                    BY: { block: { type: "math_number", locked: true, fields: { NUM: 1 } } },
                                    DO: {
                                        block: {
                                            type: "text_print",
                                            id: "l4_s4_print_pelanggan",
                                            locked: true,
                                            inputs: {
                                                TEXT: {
                                                    block: {
                                                        type: "text_join",
                                                        locked: true,
                                                        extraState: { itemCount: 2 },
                                                        inputs: {
                                                            ADD0: { block: { type: "text", locked: true, fields: { TEXT: "Pelanggan " } } },
                                                            ADD1: { block: { type: "variables_get", locked: true, fields: { VAR: { id: "var_l4_i", name: "i" } } } }
                                                        }
                                                    }
                                                }
                                            },
                                            next: {
                                                block: {
                                                    type: "variables_set",
                                                    id: "l4_s1_set_total",
                                                    locked: true,
                                                    fields: { VAR: { id: "var_l4_total", name: "total" } },
                                                    inputs: {
                                                        VALUE: { block: { type: "math_number", locked: true, fields: { NUM: 0 } } }
                                                    },
                                                    next: {
                                                        block: {
                                                            type: "variables_set",
                                                            id: "l4_s3_set_jumlah",
                                                            locked: true,
                                                            fields: { VAR: { id: "var_l4_jumlah", name: "jumlah" } },
                                                            inputs: {
                                                                VALUE: { block: { type: "math_number", locked: true, fields: { NUM: 0 } } }
                                                            },
                                                            next: {
                                                                block: {
                                                                    type: "variables_set",
                                                                    id: "l4_s1_set_harga",
                                                                    locked: true,
                                                                    fields: { VAR: { id: "var_l4_harga", name: "harga" } },
                                                                    inputs: {
                                                                        VALUE: {
                                                                            block: {
                                                                                type: "read_number",
                                                                                locked: true,
                                                                                inputs: { PROMPT: { shadow: { type: "text", fields: { TEXT: "Masukkan harga barang:" } } } }
                                                                            }
                                                                        }
                                                                    },
                                                                    next: {
                                                                        block: {
                                                                            type: "controls_whileUntil",
                                                                            id: "l4_s1_while",
                                                                            locked: true,
                                                                            fields: { MODE: "WHILE" },
                                                                            inputs: {
                                                                                BOOL: {
                                                                                    block: {
                                                                                        type: "logic_compare",
                                                                                        locked: true,
                                                                                        fields: { OP: "NEQ" },
                                                                                        inputs: {
                                                                                            A: { block: { type: "variables_get", locked: true, fields: { VAR: { id: "var_l4_harga", name: "harga" } } } },
                                                                                            B: { block: { type: "math_number", locked: true, fields: { NUM: 0 } } }
                                                                                        }
                                                                                    }
                                                                                },
                                                                                DO: {
                                                                                    block: {
                                                                                        type: "controls_if",
                                                                                        locked: true,
                                                                                        extraState: { hasElse: true },
                                                                                        inputs: {
                                                                                            IF0: {
                                                                                                block: {
                                                                                                    type: "logic_compare",
                                                                                                    locked: true,
                                                                                                    fields: { OP: "GT" },
                                                                                                    inputs: {
                                                                                                        A: { block: { type: "variables_get", locked: true, fields: { VAR: { id: "var_l4_harga", name: "harga" } } } },
                                                                                                        B: { block: { type: "math_number", locked: true, fields: { NUM: 0 } } }
                                                                                                    }
                                                                                                }
                                                                                            },
                                                                                            DO0: {
                                                                                                block: {
                                                                                                    type: "variables_set",
                                                                                                    locked: true,
                                                                                                    fields: { VAR: { id: "var_l4_total", name: "total" } },
                                                                                                    inputs: {
                                                                                                        VALUE: {
                                                                                                            block: {
                                                                                                                type: "math_arithmetic",
                                                                                                                locked: true,
                                                                                                                fields: { OP: "ADD" },
                                                                                                                inputs: {
                                                                                                                    A: { block: { type: "variables_get", locked: true, fields: { VAR: { id: "var_l4_total", name: "total" } } } },
                                                                                                                    B: { block: { type: "variables_get", locked: true, fields: { VAR: { id: "var_l4_harga", name: "harga" } } } }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    },
                                                                                                    next: {
                                                                                                        block: {
                                                                                                            type: "variables_set",
                                                                                                            locked: true,
                                                                                                            fields: { VAR: { id: "var_l4_jumlah", name: "jumlah" } },
                                                                                                            inputs: {
                                                                                                                VALUE: {
                                                                                                                    block: {
                                                                                                                        type: "math_arithmetic",
                                                                                                                        locked: true,
                                                                                                                        fields: { OP: "ADD" },
                                                                                                                        inputs: {
                                                                                                                            A: { block: { type: "variables_get", locked: true, fields: { VAR: { id: "var_l4_jumlah", name: "jumlah" } } } },
                                                                                                                            B: { block: { type: "math_number", locked: true, fields: { NUM: 1 } } }
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            },
                                                                                            ELSE: {
                                                                                                block: {
                                                                                                    type: "text_print",
                                                                                                    locked: true,
                                                                                                    inputs: {
                                                                                                        TEXT: { block: { type: "text", locked: true, fields: { TEXT: "Harga tidak valid!" } } }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        },
                                                                                        next: {
                                                                                            block: {
                                                                                                type: "variables_set",
                                                                                                locked: true,
                                                                                                fields: { VAR: { id: "var_l4_harga", name: "harga" } },
                                                                                                inputs: {
                                                                                                    VALUE: {
                                                                                                        block: {
                                                                                                            type: "read_number",
                                                                                                            locked: true,
                                                                                                            inputs: { PROMPT: { shadow: { type: "text", fields: { TEXT: "Masukkan harga barang:" } } } }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            },
                                                                            next: {
                                                                                block: {
                                                                                    type: "text_print",
                                                                                    locked: true,
                                                                                    inputs: {
                                                                                        TEXT: {
                                                                                            block: {
                                                                                                type: "text_join",
                                                                                                locked: true,
                                                                                                extraState: { itemCount: 2 },
                                                                                                inputs: {
                                                                                                    ADD0: { block: { type: "text", locked: true, fields: { TEXT: "Total belanja: " } } },
                                                                                                    ADD1: { block: { type: "variables_get", locked: true, fields: { VAR: { id: "var_l4_total", name: "total" } } } }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    },
                                                                                    next: {
                                                                                        block: {
                                                                                            type: "text_print",
                                                                                            locked: true,
                                                                                            inputs: {
                                                                                                TEXT: {
                                                                                                    block: {
                                                                                                        type: "text_join",
                                                                                                        locked: true,
                                                                                                        extraState: { itemCount: 2 },
                                                                                                        inputs: {
                                                                                                            ADD0: { block: { type: "text", locked: true, fields: { TEXT: "Jumlah barang: " } } },
                                                                                                            ADD1: { block: { type: "variables_get", locked: true, fields: { VAR: { id: "var_l4_jumlah", name: "jumlah" } } } }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            },
                                                                                            next: {
                                                                                                block: {
                                                                                                    type: "controls_if",
                                                                                                    locked: true,
                                                                                                    extraState: { hasElse: true },
                                                                                                    inputs: {
                                                                                                        IF0: {
                                                                                                            block: {
                                                                                                                type: "logic_compare",
                                                                                                                locked: true,
                                                                                                                fields: { OP: "GT" },
                                                                                                                inputs: {
                                                                                                                    A: { block: { type: "variables_get", locked: true, fields: { VAR: { id: "var_l4_jumlah", name: "jumlah" } } } },
                                                                                                                    B: { block: { type: "math_number", locked: true, fields: { NUM: 0 } } }
                                                                                                                }
                                                                                                            }
                                                                                                        },
                                                                                                        DO0: {
                                                                                                            block: {
                                                                                                                type: "text_print",
                                                                                                                locked: true,
                                                                                                                inputs: {
                                                                                                                    TEXT: {
                                                                                                                        block: {
                                                                                                                            type: "text_join",
                                                                                                                            locked: true,
                                                                                                                            extraState: { itemCount: 2 },
                                                                                                                            inputs: {
                                                                                                                                ADD0: { block: { type: "text", locked: true, fields: { TEXT: "Rata-rata: " } } },
                                                                                                                                ADD1: {
                                                                                                                                    block: {
                                                                                                                                        type: "math_arithmetic",
                                                                                                                                        locked: true,
                                                                                                                                        fields: { OP: "DIVIDE" },
                                                                                                                                        inputs: {
                                                                                                                                            A: { block: { type: "variables_get", locked: true, fields: { VAR: { id: "var_l4_total", name: "total" } } } },
                                                                                                                                            B: { block: { type: "variables_get", locked: true, fields: { VAR: { id: "var_l4_jumlah", name: "jumlah" } } } }
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                }
                                                                                                                            }
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        },
                                                                                                        ELSE: {
                                                                                                            block: {
                                                                                                                type: "text_print",
                                                                                                                locked: true,
                                                                                                                inputs: {
                                                                                                                    TEXT: { block: { type: "text", locked: true, fields: { TEXT: "Rata-rata: 0" } } }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    },
                                                                                                    next: {
                                                                                                        block: {
                                                                                                            type: "variables_set",
                                                                                                            id: "l4_s4_add_omset",
                                                                                                            locked: true,
                                                                                                            fields: { VAR: { id: "var_l4_omset", name: "omset" } },
                                                                                                            inputs: {
                                                                                                                VALUE: {
                                                                                                                    block: {
                                                                                                                        type: "math_arithmetic",
                                                                                                                        locked: true,
                                                                                                                        fields: { OP: "ADD" },
                                                                                                                        inputs: {
                                                                                                                            A: { block: { type: "variables_get", locked: true, fields: { VAR: { id: "var_l4_omset", name: "omset" } } } },
                                                                                                                            B: { block: { type: "variables_get", locked: true, fields: { VAR: { id: "var_l4_total", name: "total" } } } }
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                next: {
                                    block: {
                                        type: "text_print",
                                        id: "l4_s4_print_omset",
                                        locked: true,
                                        inputs: {
                                            TEXT: {
                                                block: {
                                                    type: "text_join",
                                                    locked: true,
                                                    extraState: { itemCount: 2 },
                                                    inputs: {
                                                        ADD0: { block: { type: "text", locked: true, fields: { TEXT: "Omset toko: " } } },
                                                        ADD1: { block: { type: "variables_get", locked: true, fields: { VAR: { id: "var_l4_omset", name: "omset" } } } }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        },
        aturan_validasi: {
            min_jumlah_print: 5,
            wajib_kode: [
                { pola: "for ", pesan: "❌ Gunakan blok perulangan count with i from 1 to 3 by 1 dari kategori Loops sebagai perulangan luar!" },
                { pola: "while ", pesan: "❌ Pertahankan perulangan repeat while di dalam perulangan luar!" },
                { pola: "omset", pesan: "❌ Gunakan variabel 'omset' untuk menjumlahkan total belanja seluruh pelanggan!" }
            ]
        },
        uji_kasus: [
            {
                input: ["6000", "9000", "0", "4000", "-1000", "8000", "0", "10000", "0"],
                expectedOutput: "Pelanggan 1\nTotal belanja: 15000\nJumlah barang: 2\nRata-rata: 7500.0\nPelanggan 2\nHarga tidak valid!\nTotal belanja: 12000\nJumlah barang: 2\nRata-rata: 6000.0\nPelanggan 3\nTotal belanja: 10000\nJumlah barang: 1\nRata-rata: 10000.0\nOmset toko: 37000",
                alternateOutputs: [
                    "Total belanja: 15000\nJumlah barang: 2\nRata-rata: 7500.0\nHarga tidak valid!\nTotal belanja: 12000\nJumlah barang: 2\nRata-rata: 6000.0\nTotal belanja: 10000\nJumlah barang: 1\nRata-rata: 10000.0\nOmset toko: 37000"
                ],
                keterangan: "Rangkaian 3 pelanggan sesuai contoh soal (Omset toko: 37000)"
            },
            {
                input: ["5000", "5000", "0", "12000", "0", "0"],
                expectedOutput: "Pelanggan 1\nTotal belanja: 10000\nJumlah barang: 2\nRata-rata: 5000.0\nPelanggan 2\nTotal belanja: 12000\nJumlah barang: 1\nRata-rata: 12000.0\nPelanggan 3\nTotal belanja: 0\nJumlah barang: 0\nRata-rata: 0\nOmset toko: 22000",
                alternateOutputs: [
                    "Total belanja: 10000\nJumlah barang: 2\nRata-rata: 5000.0\nTotal belanja: 12000\nJumlah barang: 1\nRata-rata: 12000.0\nTotal belanja: 0\nJumlah barang: 0\nRata-rata: 0\nOmset toko: 22000"
                ],
                keterangan: "Rangkaian 3 pelanggan termasuk pelanggan ke-3 yang batal membeli (langsung 0), Omset toko: 22000"
            }
        ],
        bantuan: {
            level1: {
                penalty: 3,
                description: "Menandai variabel omset, perulangan count with i from 1 to 3 by 1 di Loops, dan penjumlahan omset.",
                steps: [
                    {
                        category: "Variables",
                        block: "variables_set",
                        variableName: "omset",
                        instruction: "Pasang <code>set [omset] to 0</code> di paling atas program.",
                        target: { blockType: "variables_set", index: 0 }
                    },
                    {
                        category: "Loops",
                        block: "controls_for",
                        instruction: "Tarik blok <code>count with i from 1 to 5 by 1</code> dari kategori <strong>Loops</strong>, ubah angka <code>5</code> menjadi <code>3</code>, tambahkan <code>print</code> <code>\"Pelanggan \" + i</code> di awalnya, lalu pindahkan seluruh rangkaian blok pelanggan ke dalamnya.",
                        target: { type: "next_of_last" }
                    },
                    {
                        category: "Variables",
                        block: "variables_set",
                        variableName: "omset",
                        instruction: "Di akhir tiap putaran luar (setelah percabangan rata-rata selesai), tambahkan <code>set [omset] to omset + total</code>.",
                        target: { blockType: "controls_for", isLast: true, input: "DO" }
                    },
                    {
                        category: "I/O",
                        block: "text_print",
                        instruction: "Di luar (di bawah) perulangan luar, cetak <code>\"Omset toko: \"</code> + <code>omset</code>.",
                        target: { type: "next_of_last" }
                    }
                ]
            },
            level2: {
                penalty: 5,
                description: "Memasukkan kerangka set omset = 0, count with i from 1 to 3 by 1, penjumlahan omset, dan print Omset toko.",
                insert: {
                    type: "variables_set",
                    fields: { VAR: { id: "var_l4_omset", name: "omset" } },
                    inputs: {
                        VALUE: { block: { type: "math_number", fields: { NUM: 0 } } }
                    },
                    next: {
                        block: {
                            type: "controls_for",
                            fields: { VAR: { id: "var_l4_i", name: "i" } },
                            inputs: {
                                FROM: { block: { type: "math_number", fields: { NUM: 1 } } },
                                TO: { block: { type: "math_number", fields: { NUM: 3 } } },
                                BY: { block: { type: "math_number", fields: { NUM: 1 } } },
                                DO: {
                                    block: {
                                        type: "text_print",
                                        inputs: {
                                            TEXT: {
                                                block: {
                                                    type: "text_join",
                                                    extraState: { itemCount: 2 },
                                                    inputs: {
                                                        ADD0: { block: { type: "text", fields: { TEXT: "" } } },
                                                        ADD1: { block: { type: "variables_get", fields: { VAR: { id: "var_l4_i", name: "i" } } } }
                                                    }
                                                }
                                            }
                                        },
                                        next: {
                                            block: {
                                                type: "variables_set",
                                                fields: { VAR: { id: "var_l4_omset", name: "omset" } },
                                                inputs: {
                                                    VALUE: {
                                                        block: {
                                                            type: "math_arithmetic",
                                                            fields: { OP: "ADD" },
                                                            inputs: {
                                                                A: { block: { type: "variables_get", fields: { VAR: { id: "var_l4_omset", name: "omset" } } } },
                                                                B: { block: { type: "variables_get", fields: { VAR: { id: "var_l4_total", name: "total" } } } }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            next: {
                                block: {
                                    type: "text_print",
                                    inputs: {
                                        TEXT: {
                                            block: {
                                                type: "text_join",
                                                extraState: { itemCount: 2 },
                                                inputs: {
                                                    ADD0: { block: { type: "text", fields: { TEXT: "" } } },
                                                    ADD1: { block: { type: "variables_get", fields: { VAR: { id: "var_l4_omset", name: "omset" } } } }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                markFields: ["NUM", "TEXT"]
            }
        }
    },

    {
        id: "L4-S5",
        level: 4,
        judul_level: "Kasir Digital",
        nomor: 5,
        tipe: "Menerapkan (lanjutan)",
        teks_soal: `Di akhir hari, Bu Wati ingin tahu pelanggan mana yang belanjanya paling besar dan berapa rata-rata omset per pelanggan. <strong>Tanpa menghapus blok sebelumnya</strong>, tambahkan variabel <code>terbesar</code> (total belanja terbesar sejauh ini) dan <code>pelanggan_terbesar</code> (nomor pelanggannya). Perbarui keduanya setiap kali ada pelanggan yang totalnya lebih besar dari yang tercatat. Setelah tiga pelanggan selesai, tampilkan ringkasannya di bawah omset dengan format: <code>Pelanggan terbesar: [nomor]</code>, <code>Belanja terbesar: [total]</code>, dan <code>Rata-rata omset per pelanggan: [rata_rata]</code>.`,
        hasil_diharapkan: "Pelanggan 1\nTotal belanja: 15000\nJumlah barang: 2\nRata-rata: 7500.0\nPelanggan 2\nHarga tidak valid!\nTotal belanja: 12000\nJumlah barang: 2\nRata-rata: 6000.0\nPelanggan 3\nTotal belanja: 18000\nJumlah barang: 2\nRata-rata: 9000.0\nOmset toko: 45000\nPelanggan terbesar: 3\nBelanja terbesar: 18000\nRata-rata omset per pelanggan: 15000.0",
        petunjuk_konsep: [
            "Mencari nilai terbesar dilakukan dengan membandingkan total pelanggan saat ini terhadap nilai terbesar yang tersimpan.",
            "Saat rekor baru ditemukan, simpan sekaligus nilainya dan nomor pelanggannya (variabel perulangan luar).",
            "Kedua variabel pencatat rekor adalah milik seluruh toko, jadi diatur ke 0 di luar semua perulangan, sejajar dengan <code>omset</code>."
        ],
        tips_langkah: [
            "Buat variabel <code>terbesar</code> dan <code>pelanggan_terbesar</code>, atur keduanya ke 0 di paling atas (bersama <code>omset</code>).",
            "Di dalam perulangan luar (setelah <code>while</code> selesai), tambahkan <code>if</code> untuk memeriksa apakah <code>total &gt; terbesar</code>, lalu perbarui kedua variabel di dalamnya.",
            "Di bagian paling bawah (di luar perulangan luar, setelah cetak omset), tambahkan tiga <code>print</code> untuk pelanggan terbesar, belanja terbesar, dan rata-rata omset (<code>omset ÷ 3</code>)."
        ],
        bantuan_teks: `Atur terbesar = 0 dan pelanggan_terbesar = 0 di atas perulangan luar. Setelah set [omset] to omset + total, tambahkan if dengan syarat total > terbesar berisi set [terbesar] to total dan set [pelanggan_terbesar] to i. Di paling bawah, tambahkan tiga print untuk pelanggan_terbesar, terbesar, dan omset ÷ 3.`,
        blok_tersedia: ["Text", "Math", "I/O", "Variables", "Control", "Logic", "Loops"],
        mode_awal: "lanjut",
        workspace_awal: null,
        kunci_workspace: {
            variables: [
                { name: "total", id: "var_l4_total" },
                { name: "harga", id: "var_l4_harga" },
                { name: "jumlah", id: "var_l4_jumlah" },
                { name: "omset", id: "var_l4_omset" },
                { name: "i", id: "var_l4_i" },
                { name: "terbesar", id: "var_l4_terbesar" },
                { name: "pelanggan_terbesar", id: "var_l4_pelanggan_terbesar" }
            ],
            blocks: {
                languageVersion: 0,
                blocks: [
                    {
                        type: "variables_set",
                        x: 40,
                        y: 40,
                        fields: { VAR: { id: "var_l4_omset", name: "omset" } },
                        inputs: {
                            VALUE: { block: { type: "math_number", fields: { NUM: 0 } } }
                        },
                        next: {
                            block: {
                                type: "variables_set",
                                fields: { VAR: { id: "var_l4_terbesar", name: "terbesar" } },
                                inputs: {
                                    VALUE: { block: { type: "math_number", fields: { NUM: 0 } } }
                                },
                                next: {
                                    block: {
                                        type: "variables_set",
                                        fields: { VAR: { id: "var_l4_pelanggan_terbesar", name: "pelanggan_terbesar" } },
                                        inputs: {
                                            VALUE: { block: { type: "math_number", fields: { NUM: 0 } } }
                                        },
                                        next: {
                                            block: {
                                                type: "controls_for",
                                                fields: { VAR: { id: "var_l4_i", name: "i" } },
                                                inputs: {
                                                    FROM: { block: { type: "math_number", fields: { NUM: 1 } } },
                                                    TO: { block: { type: "math_number", fields: { NUM: 3 } } },
                                                    BY: { block: { type: "math_number", fields: { NUM: 1 } } },
                                                    DO: {
                                                        block: {
                                                            type: "text_print",
                                                            inputs: {
                                                                TEXT: {
                                                                    block: {
                                                                        type: "text_join",
                                                                        extraState: { itemCount: 2 },
                                                                        inputs: {
                                                                            ADD0: { block: { type: "text", fields: { TEXT: "Pelanggan " } } },
                                                                            ADD1: { block: { type: "variables_get", fields: { VAR: { id: "var_l4_i", name: "i" } } } }
                                                                        }
                                                                    }
                                                                }
                                                            },
                                                            next: {
                                                                block: {
                                                                    type: "variables_set",
                                                                    fields: { VAR: { id: "var_l4_total", name: "total" } },
                                                                    inputs: {
                                                                        VALUE: { block: { type: "math_number", fields: { NUM: 0 } } }
                                                                    },
                                                                    next: {
                                                                        block: {
                                                                            type: "variables_set",
                                                                            fields: { VAR: { id: "var_l4_jumlah", name: "jumlah" } },
                                                                            inputs: {
                                                                                VALUE: { block: { type: "math_number", fields: { NUM: 0 } } }
                                                                            },
                                                                            next: {
                                                                                block: {
                                                                                    type: "variables_set",
                                                                                    fields: { VAR: { id: "var_l4_harga", name: "harga" } },
                                                                                    inputs: {
                                                                                        VALUE: {
                                                                                            block: {
                                                                                                type: "read_number",
                                                                                                inputs: { PROMPT: { shadow: { type: "text", fields: { TEXT: "Masukkan harga barang:" } } } }
                                                                                            }
                                                                                        }
                                                                                    },
                                                                                    next: {
                                                                                        block: {
                                                                                            type: "controls_whileUntil",
                                                                                            fields: { MODE: "WHILE" },
                                                                                            inputs: {
                                                                                                BOOL: {
                                                                                                    block: {
                                                                                                        type: "logic_compare",
                                                                                                        fields: { OP: "NEQ" },
                                                                                                        inputs: {
                                                                                                            A: { block: { type: "variables_get", fields: { VAR: { id: "var_l4_harga", name: "harga" } } } },
                                                                                                            B: { block: { type: "math_number", fields: { NUM: 0 } } }
                                                                                                        }
                                                                                                    }
                                                                                                },
                                                                                                DO: {
                                                                                                    block: {
                                                                                                        type: "controls_if",
                                                                                                        extraState: { hasElse: true },
                                                                                                        inputs: {
                                                                                                            IF0: {
                                                                                                                block: {
                                                                                                                    type: "logic_compare",
                                                                                                                    fields: { OP: "GT" },
                                                                                                                    inputs: {
                                                                                                                        A: { block: { type: "variables_get", fields: { VAR: { id: "var_l4_harga", name: "harga" } } } },
                                                                                                                        B: { block: { type: "math_number", fields: { NUM: 0 } } }
                                                                                                                    }
                                                                                                                }
                                                                                                            },
                                                                                                            DO0: {
                                                                                                                block: {
                                                                                                                    type: "variables_set",
                                                                                                                    fields: { VAR: { id: "var_l4_total", name: "total" } },
                                                                                                                    inputs: {
                                                                                                                        VALUE: {
                                                                                                                            block: {
                                                                                                                                type: "math_arithmetic",
                                                                                                                                fields: { OP: "ADD" },
                                                                                                                                inputs: {
                                                                                                                                    A: { block: { type: "variables_get", fields: { VAR: { id: "var_l4_total", name: "total" } } } },
                                                                                                                                    B: { block: { type: "variables_get", fields: { VAR: { id: "var_l4_harga", name: "harga" } } } }
                                                                                                                                }
                                                                                                                            }
                                                                                                                        }
                                                                                                                    },
                                                                                                                    next: {
                                                                                                                        block: {
                                                                                                                            type: "variables_set",
                                                                                                                            fields: { VAR: { id: "var_l4_jumlah", name: "jumlah" } },
                                                                                                                            inputs: {
                                                                                                                                VALUE: {
                                                                                                                                    block: {
                                                                                                                                        type: "math_arithmetic",
                                                                                                                                        fields: { OP: "ADD" },
                                                                                                                                        inputs: {
                                                                                                                                            A: { block: { type: "variables_get", fields: { VAR: { id: "var_l4_jumlah", name: "jumlah" } } } },
                                                                                                                                            B: { block: { type: "math_number", fields: { NUM: 1 } } }
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                }
                                                                                                                            }
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                            },
                                                                                                            ELSE: {
                                                                                                                block: {
                                                                                                                    type: "text_print",
                                                                                                                    inputs: {
                                                                                                                        TEXT: { block: { type: "text", fields: { TEXT: "Harga tidak valid!" } } }
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        },
                                                                                                        next: {
                                                                                                            block: {
                                                                                                                type: "variables_set",
                                                                                                                fields: { VAR: { id: "var_l4_harga", name: "harga" } },
                                                                                                                inputs: {
                                                                                                                    VALUE: {
                                                                                                                        block: {
                                                                                                                            type: "read_number",
                                                                                                                            inputs: { PROMPT: { shadow: { type: "text", fields: { TEXT: "Masukkan harga barang:" } } } }
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            },
                                                                                            next: {
                                                                                                block: {
                                                                                                    type: "text_print",
                                                                                                    inputs: {
                                                                                                        TEXT: {
                                                                                                            block: {
                                                                                                                type: "text_join",
                                                                                                                extraState: { itemCount: 2 },
                                                                                                                inputs: {
                                                                                                                    ADD0: { block: { type: "text", fields: { TEXT: "Total belanja: " } } },
                                                                                                                    ADD1: { block: { type: "variables_get", fields: { VAR: { id: "var_l4_total", name: "total" } } } }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    },
                                                                                                    next: {
                                                                                                        block: {
                                                                                                            type: "text_print",
                                                                                                            inputs: {
                                                                                                                TEXT: {
                                                                                                                    block: {
                                                                                                                        type: "text_join",
                                                                                                                        extraState: { itemCount: 2 },
                                                                                                                        inputs: {
                                                                                                                            ADD0: { block: { type: "text", fields: { TEXT: "Jumlah barang: " } } },
                                                                                                                            ADD1: { block: { type: "variables_get", fields: { VAR: { id: "var_l4_jumlah", name: "jumlah" } } } }
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                            },
                                                                                                            next: {
                                                                                                                block: {
                                                                                                                    type: "controls_if",
                                                                                                                    extraState: { hasElse: true },
                                                                                                                    inputs: {
                                                                                                                        IF0: {
                                                                                                                            block: {
                                                                                                                                type: "logic_compare",
                                                                                                                                fields: { OP: "GT" },
                                                                                                                                inputs: {
                                                                                                                                    A: { block: { type: "variables_get", fields: { VAR: { id: "var_l4_jumlah", name: "jumlah" } } } },
                                                                                                                                    B: { block: { type: "math_number", fields: { NUM: 0 } } }
                                                                                                                                }
                                                                                                                            }
                                                                                                                        },
                                                                                                                        DO0: {
                                                                                                                            block: {
                                                                                                                                type: "text_print",
                                                                                                                                inputs: {
                                                                                                                                    TEXT: {
                                                                                                                                        block: {
                                                                                                                                            type: "text_join",
                                                                                                                                            extraState: { itemCount: 2 },
                                                                                                                                            inputs: {
                                                                                                                                                ADD0: { block: { type: "text", fields: { TEXT: "Rata-rata: " } } },
                                                                                                                                                ADD1: {
                                                                                                                                                    block: {
                                                                                                                                                        type: "math_arithmetic",
                                                                                                                                                        fields: { OP: "DIVIDE" },
                                                                                                                                                        inputs: {
                                                                                                                                                            A: { block: { type: "variables_get", fields: { VAR: { id: "var_l4_total", name: "total" } } } },
                                                                                                                                                            B: { block: { type: "variables_get", fields: { VAR: { id: "var_l4_jumlah", name: "jumlah" } } } }
                                                                                                                                                        }
                                                                                                                                                    }
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                }
                                                                                                                            }
                                                                                                                        },
                                                                                                                        ELSE: {
                                                                                                                            block: {
                                                                                                                                type: "text_print",
                                                                                                                                inputs: {
                                                                                                                                    TEXT: { block: { type: "text", fields: { TEXT: "Rata-rata: 0" } } }
                                                                                                                                }
                                                                                                                            }
                                                                                                                        }
                                                                                                                    },
                                                                                                                    next: {
                                                                                                                        block: {
                                                                                                                            type: "variables_set",
                                                                                                                            fields: { VAR: { id: "var_l4_omset", name: "omset" } },
                                                                                                                            inputs: {
                                                                                                                                VALUE: {
                                                                                                                                    block: {
                                                                                                                                        type: "math_arithmetic",
                                                                                                                                        fields: { OP: "ADD" },
                                                                                                                                        inputs: {
                                                                                                                                            A: { block: { type: "variables_get", fields: { VAR: { id: "var_l4_omset", name: "omset" } } } },
                                                                                                                                            B: { block: { type: "variables_get", fields: { VAR: { id: "var_l4_total", name: "total" } } } }
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                }
                                                                                                                            },
                                                                                                                            next: {
                                                                                                                                block: {
                                                                                                                                    type: "controls_if",
                                                                                                                                    inputs: {
                                                                                                                                        IF0: {
                                                                                                                                            block: {
                                                                                                                                                type: "logic_compare",
                                                                                                                                                fields: { OP: "GT" },
                                                                                                                                                inputs: {
                                                                                                                                                    A: { block: { type: "variables_get", fields: { VAR: { id: "var_l4_total", name: "total" } } } },
                                                                                                                                                    B: { block: { type: "variables_get", fields: { VAR: { id: "var_l4_terbesar", name: "terbesar" } } } }
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                        },
                                                                                                                                        DO0: {
                                                                                                                                            block: {
                                                                                                                                                type: "variables_set",
                                                                                                                                                fields: { VAR: { id: "var_l4_terbesar", name: "terbesar" } },
                                                                                                                                                inputs: {
                                                                                                                                                    VALUE: { block: { type: "variables_get", fields: { VAR: { id: "var_l4_total", name: "total" } } } }
                                                                                                                                                },
                                                                                                                                                next: {
                                                                                                                                                    block: {
                                                                                                                                                        type: "variables_set",
                                                                                                                                                        fields: { VAR: { id: "var_l4_pelanggan_terbesar", name: "pelanggan_terbesar" } },
                                                                                                                                                        inputs: {
                                                                                                                                                            VALUE: { block: { type: "variables_get", fields: { VAR: { id: "var_l4_i", name: "i" } } } }
                                                                                                                                                        }
                                                                                                                                                    }
                                                                                                                                                }
                                                                                                                                            }
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                }
                                                                                                                            }
                                                                                                                        }
                                                                                                                    }
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                },
                                                next: {
                                                    block: {
                                                        type: "text_print",
                                                        inputs: {
                                                            TEXT: {
                                                                block: {
                                                                    type: "text_join",
                                                                    extraState: { itemCount: 2 },
                                                                    inputs: {
                                                                        ADD0: { block: { type: "text", fields: { TEXT: "Omset toko: " } } },
                                                                        ADD1: { block: { type: "variables_get", fields: { VAR: { id: "var_l4_omset", name: "omset" } } } }
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        next: {
                                                            block: {
                                                                type: "text_print",
                                                                inputs: {
                                                                    TEXT: {
                                                                        block: {
                                                                            type: "text_join",
                                                                            extraState: { itemCount: 2 },
                                                                            inputs: {
                                                                                ADD0: { block: { type: "text", fields: { TEXT: "Pelanggan terbesar: " } } },
                                                                                ADD1: { block: { type: "variables_get", fields: { VAR: { id: "var_l4_pelanggan_terbesar", name: "pelanggan_terbesar" } } } }
                                                                            }
                                                                        }
                                                                    }
                                                                },
                                                                next: {
                                                                    block: {
                                                                        type: "text_print",
                                                                        inputs: {
                                                                            TEXT: {
                                                                                block: {
                                                                                    type: "text_join",
                                                                                    extraState: { itemCount: 2 },
                                                                                    inputs: {
                                                                                        ADD0: { block: { type: "text", fields: { TEXT: "Belanja terbesar: " } } },
                                                                                        ADD1: { block: { type: "variables_get", fields: { VAR: { id: "var_l4_terbesar", name: "terbesar" } } } }
                                                                                    }
                                                                                }
                                                                            }
                                                                        },
                                                                        next: {
                                                                            block: {
                                                                                type: "text_print",
                                                                                inputs: {
                                                                                    TEXT: {
                                                                                        block: {
                                                                                            type: "text_join",
                                                                                            extraState: { itemCount: 2 },
                                                                                            inputs: {
                                                                                                ADD0: { block: { type: "text", fields: { TEXT: "Rata-rata omset per pelanggan: " } } },
                                                                                                ADD1: {
                                                                                                    block: {
                                                                                                        type: "math_arithmetic",
                                                                                                        fields: { OP: "DIVIDE" },
                                                                                                        inputs: {
                                                                                                            A: { block: { type: "variables_get", fields: { VAR: { id: "var_l4_omset", name: "omset" } } } },
                                                                                                            B: { block: { type: "math_number", fields: { NUM: 3 } } }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                ]
            }
        },
        aturan_validasi: {
            min_jumlah_print: 8,
            wajib_kode: [
                { pola: "for ", pesan: "❌ Pertahankan perulangan luar count with i from 1 to 3 by 1!" },
                { pola: "while ", pesan: "❌ Pertahankan perulangan repeat while untuk membaca harga tiap barang!" },
                { pola: "terbesar", pesan: "❌ Gunakan variabel terbesar dan pelanggan_terbesar!" }
            ]
        },
        uji_kasus: [
            {
                input: ["6000", "9000", "0", "4000", "-1000", "8000", "0", "12000", "6000", "0"],
                expectedOutput: "Pelanggan 1\nTotal belanja: 15000\nJumlah barang: 2\nRata-rata: 7500.0\nPelanggan 2\nHarga tidak valid!\nTotal belanja: 12000\nJumlah barang: 2\nRata-rata: 6000.0\nPelanggan 3\nTotal belanja: 18000\nJumlah barang: 2\nRata-rata: 9000.0\nOmset toko: 45000\nPelanggan terbesar: 3\nBelanja terbesar: 18000\nRata-rata omset per pelanggan: 15000.0",
                alternateOutputs: [
                    "Total belanja: 15000\nJumlah barang: 2\nRata-rata: 7500.0\nHarga tidak valid!\nTotal belanja: 12000\nJumlah barang: 2\nRata-rata: 6000.0\nTotal belanja: 18000\nJumlah barang: 2\nRata-rata: 9000.0\nOmset toko: 45000\nPelanggan terbesar: 3\nBelanja terbesar: 18000\nRata-rata omset per pelanggan: 15000.0"
                ],
                keterangan: "Rangkaian 3 pelanggan sesuai contoh soal (Pelanggan terbesar: 3, Belanja terbesar: 18000, Rata-rata omset: 15000.0)"
            },
            {
                input: ["5000", "5000", "0", "2000", "0", "3000", "3000", "3000", "0"],
                expectedOutput: "Pelanggan 1\nTotal belanja: 10000\nJumlah barang: 2\nRata-rata: 5000.0\nPelanggan 2\nTotal belanja: 2000\nJumlah barang: 1\nRata-rata: 2000.0\nPelanggan 3\nTotal belanja: 9000\nJumlah barang: 3\nRata-rata: 3000.0\nOmset toko: 21000\nPelanggan terbesar: 1\nBelanja terbesar: 10000\nRata-rata omset per pelanggan: 7000.0",
                alternateOutputs: [
                    "Total belanja: 10000\nJumlah barang: 2\nRata-rata: 5000.0\nTotal belanja: 2000\nJumlah barang: 1\nRata-rata: 2000.0\nTotal belanja: 9000\nJumlah barang: 3\nRata-rata: 3000.0\nOmset toko: 21000\nPelanggan terbesar: 1\nBelanja terbesar: 10000\nRata-rata omset per pelanggan: 7000.0"
                ],
                keterangan: "Rangkaian uji ke-2: Pelanggan terbesar: 1, Belanja terbesar: 10000, Rata-rata omset: 7000.0"
            }
        ],
        bantuan: {
            teks: `Atur terbesar = 0 dan pelanggan_terbesar = 0 di atas perulangan luar. Setelah set [omset] to omset + total, tambahkan if dengan syarat total > terbesar berisi set [terbesar] to total dan set [pelanggan_terbesar] to i. Di paling bawah, tambahkan tiga print untuk pelanggan_terbesar, terbesar, dan omset ÷ 3.`,
            level1: {
                penalty: 3,
                description: "Menandai blok variabel, if untuk mencari belanja terbesar, serta print untuk ringkasan akhir.",
                steps: [
                    {
                        category: "Variables",
                        block: "variables_set",
                        variableName: "terbesar",
                        instruction: "Buka kategori <strong>Variables</strong>, tarik <code>set [terbesar] to 0</code> dan pasang di atas perulangan luar (di bawah <code>set [omset] to 0</code>).",
                        target: { blockType: "variables_set", isFirst: true, connection: "next" }
                    },
                    {
                        category: "Variables",
                        block: "variables_set",
                        variableName: "pelanggan_terbesar",
                        instruction: "Tarik <code>set [pelanggan_terbesar] to 0</code> di bawah <code>set [terbesar] to 0</code>.",
                        target: { blockType: "variables_set", index: 1, connection: "next" }
                    },
                    {
                        category: "Control",
                        block: "controls_if",
                        instruction: "Di dalam perulangan luar (setelah <code>set [omset] to omset + total</code>), pasang blok <code>if</code> dengan syarat <code>total &gt; terbesar</code>.",
                        target: { blockType: "controls_for", isLast: true, input: "DO" }
                    },
                    {
                        category: "Variables",
                        block: "variables_set",
                        variableName: "terbesar",
                        instruction: "Di dalam <code>if</code> tersebut, perbarui <code>set [terbesar] to total</code> dan <code>set [pelanggan_terbesar] to i</code>.",
                        target: { blockType: "controls_if", isLast: true, input: "DO0" }
                    },
                    {
                        category: "I/O",
                        block: "text_print",
                        instruction: "Di bagian paling bawah (setelah cetak omset toko), tambahkan tiga blok <code>print</code> untuk <code>Pelanggan terbesar: [nomor]</code>, <code>Belanja terbesar: [total]</code>, dan <code>Rata-rata omset per pelanggan: [omset ÷ 3]</code>.",
                        target: { blockType: "text_print", isLast: true, connection: "next" }
                    }
                ]
            },
            level2: {
                penalty: 5,
                description: "Menyusun kerangka variabel rekor terbesar, percabangan if total > terbesar, dan 3 baris cetak ringkasan akhir.",
                variables: [
                    { name: "terbesar", id: "var_l4_terbesar" },
                    { name: "pelanggan_terbesar", id: "var_l4_pelanggan_terbesar" }
                ],
                insert: {
                    type: "variables_set",
                    fields: { VAR: { id: "var_l4_terbesar", name: "terbesar" } },
                    inputs: {
                        VALUE: { block: { type: "math_number", fields: { NUM: 0 } } }
                    },
                    next: {
                        block: {
                            type: "variables_set",
                            fields: { VAR: { id: "var_l4_pelanggan_terbesar", name: "pelanggan_terbesar" } },
                            inputs: {
                                VALUE: { block: { type: "math_number", fields: { NUM: 0 } } }
                            },
                            next: {
                                block: {
                                    type: "controls_if",
                                    inputs: {
                                        IF0: {
                                            block: {
                                                type: "logic_compare",
                                                fields: { OP: "GT" },
                                                inputs: {
                                                    A: { block: { type: "variables_get", fields: { VAR: { id: "var_l4_total", name: "total" } } } },
                                                    B: { block: { type: "variables_get", fields: { VAR: { id: "var_l4_terbesar", name: "terbesar" } } } }
                                                }
                                            }
                                        },
                                        DO0: {
                                            block: {
                                                type: "variables_set",
                                                fields: { VAR: { id: "var_l4_terbesar", name: "terbesar" } },
                                                inputs: {
                                                    VALUE: { block: { type: "variables_get", fields: { VAR: { id: "var_l4_total", name: "total" } } } }
                                                },
                                                next: {
                                                    block: {
                                                        type: "variables_set",
                                                        fields: { VAR: { id: "var_l4_pelanggan_terbesar", name: "pelanggan_terbesar" } },
                                                        inputs: {
                                                            VALUE: { block: { type: "variables_get", fields: { VAR: { id: "var_l4_i", name: "i" } } } }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    next: {
                                        block: {
                                            type: "text_print",
                                            inputs: {
                                                TEXT: {
                                                    block: {
                                                        type: "text_join",
                                                        extraState: { itemCount: 2 },
                                                        inputs: {
                                                            ADD0: { block: { type: "text", fields: { TEXT: "" } } },
                                                            ADD1: { block: { type: "variables_get", fields: { VAR: { id: "var_l4_pelanggan_terbesar", name: "pelanggan_terbesar" } } } }
                                                        }
                                                    }
                                                }
                                            },
                                            next: {
                                                block: {
                                                    type: "text_print",
                                                    inputs: {
                                                        TEXT: {
                                                            block: {
                                                                type: "text_join",
                                                                extraState: { itemCount: 2 },
                                                                inputs: {
                                                                    ADD0: { block: { type: "text", fields: { TEXT: "" } } },
                                                                    ADD1: { block: { type: "variables_get", fields: { VAR: { id: "var_l4_terbesar", name: "terbesar" } } } }
                                                                }
                                                            }
                                                        }
                                                    },
                                                    next: {
                                                        block: {
                                                            type: "text_print",
                                                            inputs: {
                                                                TEXT: {
                                                                    block: {
                                                                        type: "text_join",
                                                                        extraState: { itemCount: 2 },
                                                                        inputs: {
                                                                            ADD0: { block: { type: "text", fields: { TEXT: "" } } },
                                                                            ADD1: {
                                                                                block: {
                                                                                    type: "math_arithmetic",
                                                                                    fields: { OP: "DIVIDE" },
                                                                                    inputs: {
                                                                                        A: { block: { type: "variables_get", fields: { VAR: { id: "var_l4_omset", name: "omset" } } } },
                                                                                        B: { block: { type: "math_number", fields: { NUM: 0 } } }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                markFields: ["NUM", "TEXT"]
            }
        }
    }
];

/**
 * Mengambil seluruh daftar soal (Level 1 s.d. Level 4, masing-masing 5 soal = 20 soal).
 */
export function getAllQuestions() {
    return QUESTIONS_DATA.map((q, idx) => normalizeQuestion(q, idx));
}

/**
 * Mengambil daftar soal untuk level tertentu.
 */
export function getQuestionsByLevel(levelNum) {
    return getAllQuestions().filter(q => q.level === Number(levelNum));
}

/**
 * Normalisasi objek soal agar mendukung field standar baru dan alias lama.
 */
export function normalizeQuestion(q, globalIdx = 0) {
    return {
        ...q,
        id: q.id || `L${q.level}-S${q.nomor}`,
        level: Number(q.level || 1),
         _level: Number(q.level || 1),
        nomor: Number(q.nomor || 1),
        order: globalIdx + 1,
        tipe: q.tipe || "Latihan",
        judul_level: q.judul_level || `Level ${q.level || 1}`,
        teks_soal: q.teks_soal || q.task || "",
        task: q.teks_soal || q.task || "",
        hasil_diharapkan: q.hasil_diharapkan || q.expectedOutput || "",
        expectedOutput: q.hasil_diharapkan || q.expectedOutput || "",
        petunjuk_konsep: Array.isArray(q.petunjuk_konsep) ? q.petunjuk_konsep : (q.hints || []),
        hints: Array.isArray(q.petunjuk_konsep) ? q.petunjuk_konsep : (q.hints || []),
        tips_langkah: Array.isArray(q.tips_langkah) ? q.tips_langkah : (q.tips || []),
        tips: Array.isArray(q.tips_langkah) ? q.tips_langkah : (q.tips || []),
        bantuan_teks: q.bantuan_teks || (q.bantuan && q.bantuan.teks) || "",
        blok_tersedia: q.blok_tersedia || null,
        mode_awal: q.mode_awal || (q.nomor === 1 ? "kosong" : "lanjut"),
        workspace_awal: q.workspace_awal || q.initialWorkspace || null,
        kunci_workspace: q.kunci_workspace || null,
        uji_kasus: Array.isArray(q.uji_kasus) ? q.uji_kasus : []
    };
}

export default getAllQuestions;

