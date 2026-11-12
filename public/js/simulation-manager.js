/**
 * Simulation Manager — Mode Simulasi Soal Berantai (Chain-Based) dengan Timer
 * Mengelola alur simulasi: memuat soal berantai per level, timer, auto-skip, dan evaluasi akhir.
 * Workspace TIDAK dibersihkan antar soal — blok terakumulasi (scaffolding).
 * 
 * Fitur:
 * - Tips progresif (muncul satu per satu, gratis)
 * - Bantuan (help) yang mengurangi skor (-10 per penggunaan)
 * - Guide step-by-step
 * - Mendukung jumlah soal dinamis (termasuk loop tambahan)
 */
class SimulationManager {
    constructor() {
        this.allQuestions = [];     // Soal berantai yang sudah dipilih & diurutkan
        this.currentIndex = 0;     // Index soal saat ini
        this.results = [];         // Hasil per soal: { level, status, timeSpent, questionId, helpUsed, tipsRevealed }
        this.workspace = null;
        this.timerInterval = null;
        this.timeRemaining = 0;    // Detik tersisa untuk soal saat ini
        this.questionStartTime = 0;
        this.isFinished = false;

        // Tracking per-soal
        this.currentTipsShown = false;  // toggle panel tips
        this.currentHelpUsed = false;   // apakah bantuan sudah dipakai
        this.currentBantuanOption = 0;  // 0 = belum, 1 = opsi 1, 2 = opsi 2
        this.currentBantuanLevel = 0;   // alias kompatibilitas
        this.currentPenalty = 0;        // poin penalti yang dikenakan
        this.currentGuideShown = false;
        this.activeBlockChangeListener = null;
        this.fieldChangeListener = null;
        this.currentBantuanLevel1Active = false;
        this.currentBantuanLevel1Steps = [];
        this.currentBantuanLevel1StepIndex = 0;
        this.currentHighlightedConnections = [];

        // Penalti skor per opsi bantuan
        this.helpPenaltyOption1 = 3;    // Opsi 1: -3 poin (sorot toolbox & flyout berurutan)
        this.helpPenaltyOption2 = 5;    // Opsi 2: -5 poin (kerangka blok netral)
        this.helpPenalty = 3;           // default
        this.timeLimits = {
            1: 3 * 60,
            2: 5 * 60,
            3: 7 * 60,
            4: 8 * 60
        };
    }

    async init(workspace) {
        this.workspace = workspace;
        await this.loadAllQuestions();
        this.renderProgress();
        this.loadQuestion();
    }

    /**
     * Memuat seluruh soal dari file data terpusat (/js/problems/questions.js).
     * Soal diurutkan berdasarkan level lalu nomor urut di dalam level.
     */
    async loadAllQuestions() {
        this.allQuestions = [];

        try {
            const module = await import(`/js/problems/questions.js?v=${Date.now()}`);
            const questions = typeof module.getAllQuestions === 'function'
                ? module.getAllQuestions()
                : (typeof module.default === 'function' ? module.default() : (module.QUESTIONS_DATA || []));

            // Urutkan berdasarkan level lalu nomor
            questions.sort((a, b) => {
                if ((a.level || 1) !== (b.level || 1)) return (a.level || 1) - (b.level || 1);
                return (a.nomor || 1) - (b.nomor || 1);
            });

            this.allQuestions = questions.map((q, idx) => ({
                ...q,
                _level: q.level || q._level || 1,
                level: q.level || q._level || 1,
                nomor: q.nomor || idx + 1,
                teks_soal: q.teks_soal || q.task || "",
                task: q.teks_soal || q.task || "",
                hasil_diharapkan: q.hasil_diharapkan || q.expectedOutput || "",
                expectedOutput: q.hasil_diharapkan || q.expectedOutput || "",
                petunjuk_konsep: Array.isArray(q.petunjuk_konsep) ? q.petunjuk_konsep : (q.hints || []),
                hints: Array.isArray(q.petunjuk_konsep) ? q.petunjuk_konsep : (q.hints || []),
                tips_langkah: Array.isArray(q.tips_langkah) ? q.tips_langkah : (q.tips || []),
                tips: Array.isArray(q.tips_langkah) ? q.tips_langkah : (q.tips || []),
                mode_awal: q.mode_awal || (q.nomor === 1 ? "kosong" : "lanjut")
            }));
        } catch (error) {
            console.error("Gagal memuat bank soal terpusat questions.js:", error);
        }

        // Inisialisasi array results per soal untuk pelaporan lengkap
        this.results = this.allQuestions.map((q, i) => ({
            index: i,
            level: q.level,
            judul_level: q.judul_level || `Level ${q.level}`,
            nomor: q.nomor,
            tipe: q.tipe || "Latihan",
            questionId: q.id,
            mode_awal: q.mode_awal,
            status: 'unanswered', // 'correct', 'wrong', 'timeout', 'surrendered'
            attempts: 0,
            timeSpent: 0,
            task: q.teks_soal,
            helpUsed: false,
            bantuanOption: 0,
            bantuanLevel: 0,
            bantuanPenalty: 0,
            tipsShown: false,
            maxPoints: 5,
            scorePoints: 0,
            scorePercent: 0,
            submittedCode: ""
        }));
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    /**
     * Ambil semua soal yang berada pada level tertentu
     */
    getQuestionsInLevel(level) {
        return this.allQuestions.filter(q => q.level === level);
    }

    /**
     * Load soal saat ini ke workspace
     */
    loadQuestion() {
        if (this.currentIndex >= this.allQuestions.length) {
            this.finishSimulation();
            return;
        }

        const question = this.allQuestions[this.currentIndex];
        const level = question.level;

        // Reset tracking per-soal
        this.currentTipsShown = false;
        this.currentHelpUsed = false;
        this.currentBantuanOption = 0;
        this.currentBantuanLevel = 0;
        this.currentPenalty = 0;
        this.currentGuideShown = false;
        this.clearToolboxHighlights();

        // Update toolbox sesuai blok_tersedia atau level soal
        this.updateToolbox(level, question.blok_tersedia);

        // Siapkan workspace sesuai mode_awal ("kosong", "preset", atau "lanjut" dari kunci_workspace sebelumnya)
        this.setupInitialWorkspace(question);

        // Update UI progres dan soal
        this.renderProgress();
        this.renderQuestion(question, level);

        // Bersihkan output console
        const levelQuestions = this.getQuestionsInLevel(level);
        const outputContent = document.getElementById('outputContent');
        if (outputContent) {
            outputContent.innerHTML = `<div class="output-line info"><span class="timestamp">[System]</span> Level ${level} — Soal ${question.nomor}/${levelQuestions.length} (${question.tipe || ''}) dimuat. Mode awal: <strong>${question.mode_awal}</strong>. Susun blok dan klik Kumpulkan untuk menjawab.</div>`;
        }

        // Mulai timer
        this.startTimer(level);
        this.questionStartTime = Date.now();

        // Sembunyikan tombol next
        const nextContainer = document.getElementById('nextLevelContainer');
        if (nextContainer) nextContainer.style.display = 'none';
    }

    /**
     * Mengatur kondisi awal workspace berdasarkan mode_awal soal:
     * - "kosong" : Workspace dibersihkan tanpa blok.
     * - "preset" : Workspace dibersihkan lalu diisi dari workspace_awal.
     * - "lanjut" : Workspace diisi dari kunci_workspace soal sebelumnya (pada level yang sama),
     *              ditambah blok tambahan dari workspace_awal bila ada (atau diganti jika timpa_workspace = true).
     */
    setupInitialWorkspace(question) {
        if (!this.workspace || !question) return;

        // Soal nomor 1 tiap level selalu mereset workspace sesuai mode_awal soal 1 level baru
        const isFirstInLevel = question.nomor === 1 || this.currentIndex === 0 ||
            (this.allQuestions[this.currentIndex - 1] && this.allQuestions[this.currentIndex - 1].level !== question.level);

        const effectiveMode = isFirstInLevel
            ? (question.mode_awal === 'preset' ? 'preset' : 'kosong')
            : (question.mode_awal || 'lanjut');

        try {
            if (effectiveMode === 'kosong') {
                this.workspace.clear();
            } else if (effectiveMode === 'preset') {
                this.workspace.clear();
                if (question.workspace_awal) {
                    this.loadSerializedStateWithLocks(question.workspace_awal, true);
                }
            } else if (effectiveMode === 'lanjut') {
                const prevQuestion = this.currentIndex > 0 ? this.allQuestions[this.currentIndex - 1] : null;
                const hasCustomOverride = question.workspace_awal && question.workspace_awal.timpa_workspace;

                if (hasCustomOverride) {
                    // Soal memperbaiki program (mis. Soal 5) yang menyediakan workspace salah utuh
                    this.loadSerializedStateWithLocks(question.workspace_awal, true);
                } else {
                    // Muat kunci_workspace dari soal sebelumnya agar kesalahan siswa di soal lama tidak terbawa
                    if (prevQuestion && prevQuestion.kunci_workspace && prevQuestion.level === question.level) {
                        this.loadSerializedStateWithLocks(prevQuestion.kunci_workspace, true);
                    }

                    // Jika soal "lanjut" ini juga memiliki blok tambahan di workspace_awal, tambahkan ke workspace
                    if (question.workspace_awal) {
                        this.appendWorkspaceAwalBlocks(question.workspace_awal);
                    }
                }
            }

            if (this.workspace.render) {
                this.workspace.render();
            }
            if (typeof PythonCodeHandler !== 'undefined') {
                const code = PythonCodeHandler.generate(this.workspace);
                PythonCodeHandler.display(code);
            }
        } catch (err) {
            console.error("Gagal menyiapkan workspace awal:", err);
        }
    }

    /**
     * Tombol Reset / Bersihkan soal: mengembalikan ke kondisi awal soal saat ini
     * (hasil kunci_workspace soal sebelumnya atau preset), bukan workspace kosong.
     */
    resetCurrentQuestionWorkspace() {
        const question = this.allQuestions[this.currentIndex];
        if (!question || !this.workspace) return;

        this.clearToolboxHighlights();
        this.setupInitialWorkspace(question);

        // Jika siswa sebelumnya sudah membuka Bantuan Opsi 2 pada soal ini,
        // pasang kembali bantuan opsi 2 tanpa menambah penalti baru
        if (this.currentBantuanOption === 2) {
            this.applyBantuanLevel2(question, true);
        }

        if (typeof PythonSimulator !== 'undefined') {
            PythonSimulator.clear();
            PythonSimulator.addOutput(`🔄 Workspace dikembalikan ke kondisi awal Soal ${question.nomor} (mode: ${question.mode_awal}).`, 'info');
        }
    }

    /**
     * Memuat state serialisasi Blockly ke workspace dan menerapkan opsi penguncian per blok
     */
    loadSerializedStateWithLocks(stateObj, clearFirst = true) {
        if (!this.workspace || !stateObj) return;

        if (clearFirst) {
            this.workspace.clear();
        }

        // Clone agar objek asli di data tidak termutasi oleh Blockly
        const stateCopy = JSON.parse(JSON.stringify(stateObj));
        delete stateCopy.timpa_workspace;

        // Pastikan daftar variabel terdaftar
        const varsList = stateCopy.variables || (stateCopy.blocks && stateCopy.blocks.variables) || [];
        if (Array.isArray(varsList)) {
            varsList.forEach(v => {
                if (v && v.name) {
                    const existing = this.workspace.getVariable(v.name);
                    if (!existing) {
                        this.workspace.createVariable(v.name, v.type || '', v.id || undefined);
                    }
                }
            });
        }

        if (Blockly.serialization && Blockly.serialization.workspaces) {
            try {
                Blockly.serialization.workspaces.load(stateCopy, this.workspace);
            } catch (loadErr) {
                console.warn("Blockly workspaces.load warning, mencoba fallback append per blok:", loadErr);
                const fallbackBlocks = (stateCopy.blocks && stateCopy.blocks.blocks) || [];
                fallbackBlocks.forEach(bJson => {
                    try {
                        const blk = Blockly.serialization.blocks.append(bJson, this.workspace);
                        if (blk) {
                            blk.initSvg();
                            blk.render();
                        }
                    } catch (e2) {
                        console.error("Gagal memuat blok:", e2);
                    }
                });
            }
        }

        // Pastikan seluruh blok telah dirender secara visual di canvas SVG
        this.workspace.getAllBlocks(false).forEach(b => {
            try {
                if (!b.rendered && typeof b.initSvg === 'function') b.initSvg();
                if (typeof b.render === 'function') b.render();
            } catch (e) {}
        });

        // Terapkan opsi penguncian per blok (locked, deletable, movable, editable)
        const topBlocksJson = (stateCopy.blocks && stateCopy.blocks.blocks) || [];
        topBlocksJson.forEach(bJson => this.applyLockRecursive(bJson, true));
    }

    /**
     * Menambahkan blok tambahan dari workspace_awal pada mode "lanjut" (tanpa menghapus kunci_workspace sebelumnya)
     */
    appendWorkspaceAwalBlocks(workspaceAwal) {
        if (!this.workspace || !workspaceAwal) return;

        const stateCopy = JSON.parse(JSON.stringify(workspaceAwal));
        const varsList = stateCopy.variables || (stateCopy.blocks && stateCopy.blocks.variables) || [];
        varsList.forEach(v => {
            if (v && v.name && !this.workspace.getVariable(v.name)) {
                this.workspace.createVariable(v.name, v.type || '', v.id || undefined);
            }
        });

        const blocksArray = (stateCopy.blocks && stateCopy.blocks.blocks) ||
            (Array.isArray(stateCopy.blocks) ? stateCopy.blocks : (stateCopy.type ? [stateCopy] : []));

        blocksArray.forEach(blockJson => {
            if (!Blockly.serialization || !Blockly.serialization.blocks) return;

            const topBlocks = this.workspace.getTopBlocks(true);
            const created = Blockly.serialization.blocks.append(blockJson, this.workspace);
            if (!created) return;

            created.initSvg();
            created.render();

            // Jika blok statement dan tidak ditentukan koordinat khusus, sambungkan ke bawah rantai utama
            if (blockJson.sambung_ke_akhir !== false && created.previousConnection && topBlocks.length > 0) {
                const mainTop = topBlocks.find(b => b.id !== created.id);
                if (mainTop) {
                    let last = mainTop;
                    while (last.getNextBlock()) {
                        last = last.getNextBlock();
                    }
                    if (last.nextConnection && !last.nextConnection.isConnected()) {
                        try {
                            last.nextConnection.connect(created.previousConnection);
                        } catch (e) {}
                    }
                }
            }

            this.applyLockRecursive(blockJson, !created.getParent());
        });
    }

    /**
     * Terapkan atribut penguncian (locked / deletable / movable / editable) secara rekursif per blok
     */
    applyLockRecursive(blockNode, isRoot = false) {
        if (!blockNode || !this.workspace) return;

        if (blockNode.id) {
            const block = this.workspace.getBlockById(blockNode.id);
            if (block) {
                if (blockNode.locked === true) {
                    const del = typeof blockNode.deletable === 'boolean' ? blockNode.deletable : false;
                    const edit = typeof blockNode.editable === 'boolean' ? blockNode.editable : false;
                    // Root block dikunci posisinya agar tidak tergeser, sedangkan blok di tengah rantai
                    // tetap mengizinkan penyisipan blok baru di antaranya kecuali movable: false diset eksplisit
                    const mov = typeof blockNode.movable === 'boolean' ? blockNode.movable : !isRoot;
                    block.setDeletable(del);
                    block.setEditable(edit);
                    block.setMovable(mov);
                } else {
                    if (typeof blockNode.deletable === 'boolean') block.setDeletable(blockNode.deletable);
                    if (typeof blockNode.movable === 'boolean') block.setMovable(blockNode.movable);
                    if (typeof blockNode.editable === 'boolean') block.setEditable(blockNode.editable);
                }
            }
        }

        if (blockNode.inputs) {
            Object.values(blockNode.inputs).forEach(inp => {
                if (inp && inp.block) this.applyLockRecursive(inp.block, false);
                if (inp && inp.shadow) this.applyLockRecursive(inp.shadow, false);
            });
        }

        if (blockNode.next && blockNode.next.block) {
            this.applyLockRecursive(blockNode.next.block, false);
        }
    }

    /**
     * Update toolbox Blockly berdasarkan blok_tersedia dan level soal
     */
    updateToolbox(level, blokTersedia = null) {
        if (!this.workspace) return;
        try {
            const toolbox = typeof BlocklyConfig.getToolboxForQuestion === 'function'
                ? BlocklyConfig.getToolboxForQuestion(blokTersedia, level)
                : BlocklyConfig.getToolboxForLevel(level);
            this.workspace.updateToolbox(toolbox);
        } catch (e) {
            console.error("Gagal update toolbox:", e);
        }
    }

    /**
     * Render progress bar, indikator "Soal X/5" per level, dan status soal (Selesai / Aktif / Terkunci)
     */
    renderProgress() {
        const progressText = document.getElementById('simProgressText');
        const progressFill = document.getElementById('simProgressFill');
        const currentQ = this.allQuestions[this.currentIndex];
        const currentLevel = currentQ ? currentQ.level : 1;
        const levelQuestions = this.getQuestionsInLevel(currentLevel);
        const nomorDalamLevel = currentQ ? currentQ.nomor : 1;
        const totalDalamLevel = levelQuestions.length || 5;

        if (progressText) {
            progressText.innerHTML = `<strong>Level ${currentLevel} (${currentQ?.judul_level || ''}): Soal ${nomorDalamLevel}/${totalDalamLevel}</strong> <span style="opacity:0.7;font-size:0.85em;margin-left:6px;">• Total Progres: ${this.currentIndex + 1}/${this.allQuestions.length}</span>`;
        }
        if (progressFill) {
            const pct = (this.currentIndex / Math.max(1, this.allQuestions.length)) * 100;
            progressFill.style.width = `${pct}%`;
        }

        // Render indikator soal dalam level saat ini + ringkasan level
        const dotsContainer = document.getElementById('simProgressDots');
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            dotsContainer.style.cssText = 'display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-top:6px;';

            // Tampilkan badge per level (Level 1 s.d. Level 4)
            const activeLevels = [...new Set(this.allQuestions.map(q => q.level))];
            activeLevels.forEach(lvl => {
                const lvlIndices = this.allQuestions
                    .map((q, idx) => (q.level === lvl ? idx : -1))
                    .filter(idx => idx !== -1);
                const doneCount = lvlIndices.filter(idx => this.results[idx]?.status === 'correct').length;
                const isCurrentLvl = lvl === currentLevel;
                const isCompletedLvl = doneCount === lvlIndices.length && lvlIndices.length > 0;

                const lvlPill = document.createElement('span');
                lvlPill.style.cssText = `
                    font-size: 0.72rem;
                    font-weight: 700;
                    padding: 2px 8px;
                    border-radius: 999px;
                    border: 1px solid ${isCurrentLvl ? '#38bdf8' : isCompletedLvl ? '#10b981' : 'rgba(255,255,255,0.15)'};
                    background: ${isCurrentLvl ? 'rgba(56,189,248,0.18)' : isCompletedLvl ? 'rgba(16,185,129,0.18)' : 'rgba(255,255,255,0.05)'};
                    color: ${isCurrentLvl ? '#7dd3fc' : isCompletedLvl ? '#6ee7b7' : 'rgba(255,255,255,0.5)'};
                `;
                lvlPill.textContent = `L${lvl}: ${doneCount}/${lvlIndices.length}`;
                dotsContainer.appendChild(lvlPill);
            });

            // Pemisah
            const sep = document.createElement('span');
            sep.style.cssText = 'color:rgba(255,255,255,0.25);margin:0 4px;';
            sep.textContent = '|';
            dotsContainer.appendChild(sep);

            // Tampilkan 5 indikator soal pada level aktif (Selesai ✅, Aktif 🔵, Terkunci 🔒)
            levelQuestions.forEach(q => {
                const globalIdx = this.allQuestions.findIndex(item => item.id === q.id);
                const res = this.results[globalIdx];
                const stepEl = document.createElement('div');

                const isDone = res && res.status === 'correct';
                const isCurrent = globalIdx === this.currentIndex;
                const isLocked = globalIdx > this.currentIndex;

                let icon = '🔒';
                let bg = 'rgba(255,255,255,0.05)';
                let border = 'rgba(255,255,255,0.12)';
                let color = 'rgba(255,255,255,0.45)';
                let statusLabel = 'Terkunci (selesaikan soal sebelumnya)';

                if (isDone) {
                    icon = '✅';
                    bg = 'rgba(16, 185, 129, 0.2)';
                    border = '#10b981';
                    color = '#a7f3d0';
                    statusLabel = `Selesai (Skor: ${res.scorePoints}/5)`;
                } else if (isCurrent) {
                    icon = '🔵';
                    bg = 'rgba(0, 212, 255, 0.2)';
                    border = '#00d4ff';
                    color = '#ffffff';
                    statusLabel = 'Sedang dikerjakan';
                } else if (!isLocked && res) {
                    icon = res.status === 'timeout' ? '⏰' : '❌';
                    bg = 'rgba(239, 68, 68, 0.2)';
                    border = '#ef4444';
                    color = '#fca5a5';
                    statusLabel = res.status;
                }

                stepEl.style.cssText = `
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    padding: 2px 9px;
                    border-radius: 6px;
                    font-size: 0.74rem;
                    font-weight: ${isCurrent ? '700' : '600'};
                    background: ${bg};
                    border: 1px solid ${border};
                    color: ${color};
                    opacity: ${isLocked ? '0.6' : '1'};
                `;
                stepEl.title = `Soal ${q.nomor}/${totalDalamLevel}: ${q.tipe || ''} — ${statusLabel}`;
                stepEl.innerHTML = `<span>${icon}</span> <span>Soal ${q.nomor}/${totalDalamLevel}</span>`;
                dotsContainer.appendChild(stepEl);
            });
        }
    }

    /**
     * Render teks soal & info level + tips/help/guide buttons
     */
    renderQuestion(question, level) {
        const levelQuestions = this.getQuestionsInLevel(level);
        const totalInLevel = levelQuestions.length || 5;

        const levelTitle = document.getElementById('levelTitle');
        if (levelTitle) {
            const isDebugSoal = (question.tipe || '').toLowerCase().includes('memperbaiki');
            const modeIcon = isDebugSoal ? '🔧' : '📌';
            const modeLabel = isDebugSoal
                ? 'Evaluasi & Perbaikan Program'
                : question.mode_awal === 'kosong'
                ? 'Workspace Kosong'
                : question.mode_awal === 'preset'
                ? 'Preset Sistem'
                : 'Melanjutkan Soal Sebelumnya';
            levelTitle.innerHTML = `
                <span class="sim-level-badge level-${level}">Level ${level}: ${question.judul_level || ''}</span>
                <strong>Soal ${question.nomor}/${totalInLevel}</strong>
                <span style="font-size:0.82rem;opacity:0.8;margin-left:6px;">(${question.tipe || 'Latihan'})</span>
                <span style="font-size:0.75rem;background:rgba(255,255,255,0.1);padding:2px 8px;border-radius:999px;margin-left:6px;font-weight:500;">${modeIcon} ${modeLabel}</span>
            `;
        }

        const taskText = document.getElementById('taskText');
        if (taskText) {
            taskText.innerHTML = question.teks_soal || question.task;
        }

        // Status badge
        const statusBadge = document.getElementById('taskStatus');
        if (statusBadge) {
            statusBadge.innerHTML = '<span style="background:#ef4444;color:#fff;padding:3px 10px;border-radius:12px;font-size:0.8rem;">⏳ Belum Selesai</span>';
        }

        // Sembunyikan taskHints statis — semua petunjuk kini disatukan ke dalam tombol Tips
        const hintsContainer = document.getElementById('taskHints');
        if (hintsContainer) {
            hintsContainer.innerHTML = '';
            hintsContainer.style.display = 'none';
        }

        // Render assistance buttons (Tips, Help, Guide)
        this.renderAssistanceButtons(question);
    }

    /**
     * Render tombol bantuan: Tips, Help, Guide
     */
    renderAssistanceButtons(question) {
        let assistContainer = document.getElementById('assistanceContainer');
        if (!assistContainer) {
            const taskPanel = document.querySelector('.task-panel .panel-content');
            if (!taskPanel) return;
            assistContainer = document.createElement('div');
            assistContainer.id = 'assistanceContainer';
            assistContainer.style.cssText = 'margin-top: 0.75rem; display: flex; gap: 0.5rem; flex-wrap: wrap;';
            taskPanel.appendChild(assistContainer);
        }

        const hasTips = (question.tips && question.tips.length > 0) || (question.hints && question.hints.length > 0);
        const bantuanData = question.bantuan || (question.help ? { penalty: this.helpPenalty, text: question.help } : null);
        const hasHelp = !!bantuanData;
        const hasGuide = question.guide && question.guide.length > 0;

        let buttonsHtml = '';

        if (hasTips) {
            buttonsHtml += `<button id="btnTips" class="assist-btn assist-btn-tips" title="Tampilkan semua tips & petunjuk (gratis)">
                <span>💡</span> Tips & Petunjuk
            </button>`;
        }

        if (hasHelp) {
            const p1 = (bantuanData.level1 && bantuanData.level1.penalty) || this.helpPenaltyOption1;
            const p2 = (bantuanData.level2 && bantuanData.level2.penalty) || this.helpPenaltyOption2;
            buttonsHtml += `<button id="btnHelp" class="assist-btn assist-btn-help" title="Bantuan langsung (Opsi 1: -${p1} poin, Opsi 2: -${p2} poin)">
                <span>🆘</span> Bantuan <span class="assist-penalty">-${p1} / -${p2}</span>
            </button>`;
        }

        if (hasGuide) {
            buttonsHtml += `<button id="btnGuide" class="assist-btn assist-btn-guide" title="Panduan step-by-step">
                <span>📖</span> Panduan
            </button>`;
        }

        assistContainer.innerHTML = buttonsHtml;

        // Container untuk konten bantuan
        let assistContent = document.getElementById('assistanceContent');
        if (!assistContent) {
            const taskPanel = document.querySelector('.task-panel .panel-content');
            if (!taskPanel) return;
            assistContent = document.createElement('div');
            assistContent.id = 'assistanceContent';
            taskPanel.appendChild(assistContent);
        }
        assistContent.innerHTML = '';

        // Event listeners
        const btnTips = document.getElementById('btnTips');
        const btnHelp = document.getElementById('btnHelp');
        const btnGuide = document.getElementById('btnGuide');

        if (btnTips) {
            btnTips.addEventListener('click', () => this.toggleTips(question));
        }
        if (btnHelp) {
            btnHelp.addEventListener('click', () => this.showBantuanConfirmModal(question));
        }
        if (btnGuide) {
            btnGuide.addEventListener('click', () => this.showGuide(question));
        }
    }

    /**
     * Tampilkan tips & petunjuk sekaligus (gratis, tanpa penalti)
     * Dapat di-toggle atau dibuka paksa saat salah menjawab
     */
    toggleTips(question, forceOpen = false) {
        let tipsPanel = document.getElementById('tipsPanel');
        const assistContent = document.getElementById('assistanceContent');
        if (!assistContent) return;

        const btnTips = document.getElementById('btnTips');

        // Toggle: Jika sudah terbuka dan bukan dipaksa buka, tutup panel
        if (tipsPanel && !forceOpen) {
            tipsPanel.remove();
            this.currentTipsShown = false;
            if (btnTips) btnTips.classList.remove('assist-btn-active');
            return;
        }

        this.currentTipsShown = true;
        this.results[this.currentIndex].tipsShown = true;
        if (btnTips) btnTips.classList.add('assist-btn-active');

        if (!tipsPanel) {
            tipsPanel = document.createElement('div');
            tipsPanel.id = 'tipsPanel';
            tipsPanel.className = 'assist-panel assist-panel-tips';
            assistContent.prepend(tipsPanel);
        }

        tipsPanel.style.animation = 'fadeSlideIn 0.3s ease-out';

        let sectionsHtml = '';

        // 1. Petunjuk Konseptual (dari question.petunjuk_konsep / question.hints)
        if (question.hints && question.hints.length > 0) {
            sectionsHtml += `
                <div style="margin-bottom: 0.85rem;">
                    <div style="font-weight: 700; color: #6ee7b7; font-size: 0.9rem; margin-bottom: 0.4rem; display: flex; align-items: center; gap: 6px;">
                        <span>💡</span> Petunjuk Konsep:
                    </div>
                    <ul style="margin: 0; padding-left: 1.25rem; font-size: 0.88rem; line-height: 1.55; color: rgba(255,255,255,0.88);">
                        ${question.hints.map(hint => `<li style="margin-bottom: 4px;">${hint}</li>`).join('')}
                    </ul>
                </div>
            `;
        }

        // 2. Tips Blok & Langkah Pengerjaan (dari question.tips_langkah / question.tips)
        if (question.tips && question.tips.length > 0) {
            sectionsHtml += `
                <div>
                    <div style="font-weight: 700; color: #93c5fd; font-size: 0.9rem; margin-bottom: 0.4rem; display: flex; align-items: center; gap: 6px;">
                        <span>🧩</span> Tips Langkah & Blok:
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 0.45rem;">
                        ${question.tips.map((tip, idx) => `
                            <div class="assist-tip-item" style="animation: none;">
                                <span class="tip-number">${idx + 1}</span> ${tip}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        tipsPanel.innerHTML = `
            <div class="assist-panel-header" style="display: flex; justify-content: space-between; align-items: center;">
                <span>💡 Tips & Petunjuk Soal</span>
                <span style="font-size: 0.72rem; color: #a7f3d0; background: rgba(16, 185, 129, 0.2); padding: 2px 8px; border-radius: 999px; font-weight: 600;">Gratis (0 Penalti)</span>
            </div>
            <div class="assist-panel-body" id="tipsPanelBody">
                ${sectionsHtml}
            </div>
        `;
    }

    /**
     * Tampilkan modal konfirmasi bantuan dengan Opsi 1 (-3 poin) & Opsi 2 (-5 poin)
     * Jika Opsi 1 sudah dipakai dan siswa memakai Opsi 2, penalti menjadi total 5 poin (bukan 8).
     */
    showBantuanConfirmModal(question) {
        if (this.currentBantuanOption === 2) return;
        const bantuan = question.bantuan || { text: question.help };
        const p1 = (bantuan.level1 && bantuan.level1.penalty) || this.helpPenaltyOption1;
        const p2 = (bantuan.level2 && bantuan.level2.penalty) || this.helpPenaltyOption2;

        const existing = document.getElementById('bantuanConfirmModal');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'bantuanConfirmModal';
        overlay.className = 'bantuan-confirm-overlay';

        const hasLevel1 = !!bantuan.level1;
        const hasLevel2 = !!(bantuan.level2 && (bantuan.level2.insert || bantuan.level2.blockData || bantuan.level2.markBlockIds));
        const isL1Active = this.currentBantuanOption === 1;

        overlay.innerHTML = `
            <div class="bantuan-confirm-box">
                <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">🆘</div>
                <h3 style="margin-bottom: 0.5rem; font-size: 1.2rem;">Konfirmasi Penggunaan Bantuan</h3>
                <p style="margin-bottom: 1rem; font-size: 0.9rem; color: rgba(255,255,255,0.8); line-height: 1.5;">
                    Fitur bantuan akan <strong style="color: #fca5a5;">mengurangi skor kamu</strong> untuk soal ini.<br>
                    <span style="font-size: 0.82rem; color: rgba(255,255,255,0.6);">Silakan tentukan opsi bantuan yang kamu perlukan:</span>
                </p>

                <div style="display: flex; flex-direction: column; gap: 0.65rem; margin-bottom: 1.25rem; text-align: left;">
                    ${hasLevel1 ? `
                    <button id="btnChooseLevel1" ${isL1Active ? 'disabled style="opacity: 0.5; cursor: not-allowed; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.2); color: #888; padding: 12px; border-radius: 8px; text-align: left;"' : 'style="background: rgba(251, 191, 36, 0.12); border: 1px solid rgba(251, 191, 36, 0.4); color: #fbbf24; padding: 12px; border-radius: 8px; text-align: left; cursor: pointer; transition: all 0.2s;"'}>
                        <div style="font-weight: 700; font-size: 0.92rem; display: flex; align-items: center; justify-content: space-between;">
                            <span>🟡 Opsi 1: Sorot Blok di Toolbox & Flyout</span>
                            <span style="font-size: 0.75rem; color: ${isL1Active ? '#888' : '#fca5a5'}; font-weight: 700; background: rgba(239, 68, 68, 0.2); padding: 2px 8px; border-radius: 6px;">
                                ${isL1Active ? 'Sudah Aktif (-' + p1 + ')' : '-' + p1 + ' poin'}
                            </span>
                        </div>
                        <div style="font-size: 0.8rem; color: rgba(255,255,255,0.7); margin-top: 4px;">
                            ${bantuan.level1.description || 'Menandai kategori dan blok yang dibutuhkan di toolbox dan flyout secara berurutan.'}
                        </div>
                    </button>
                    ` : ''}

                    ${hasLevel2 ? `
                    <button id="btnChooseLevel2" style="background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.4); color: #fca5a5; padding: 12px; border-radius: 8px; text-align: left; cursor: pointer; transition: all 0.2s;">
                        <div style="font-weight: 700; font-size: 0.92rem; display: flex; align-items: center; justify-content: space-between;">
                            <span>🔴 Opsi 2: Pasang Kerangka Blok (Tanpa Jawaban)</span>
                            <span style="font-size: 0.75rem; color: #fca5a5; font-weight: 700; background: rgba(239, 68, 68, 0.2); padding: 2px 8px; border-radius: 6px;">
                                ${isL1Active ? 'Total -' + p2 + ' poin' : '-' + p2 + ' poin'}
                            </span>
                        </div>
                        <div style="font-size: 0.8rem; color: rgba(255,255,255,0.7); margin-top: 4px;">
                            ${bantuan.level2.description || 'Memasukkan kerangka struktur blok ke area kerja. Kamu tetap harus mengisi jawabannya.'}
                        </div>
                    </button>
                    ` : ''}

                    ${(!hasLevel1 && !hasLevel2 && bantuan.text) ? `
                    <button id="btnChooseDirect" style="background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.4); color: #fca5a5; padding: 12px; border-radius: 8px; text-align: left; cursor: pointer; transition: all 0.2s;">
                        <div style="font-weight: 700; font-size: 0.92rem; display: flex; align-items: center; justify-content: space-between;">
                            <span>Buka Kunci Solusi Pendekatan</span>
                            <span style="font-size: 0.75rem; color: #fca5a5; font-weight: 700; background: rgba(239, 68, 68, 0.2); padding: 2px 8px; border-radius: 6px;">-${p1} poin</span>
                        </div>
                    </button>
                    ` : ''}
                </div>

                <div class="bantuan-confirm-actions">
                    <button class="btn-confirm-no" id="btnCancelBantuan">Batal (Coba Sendiri Dulu)</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        const btnCancel = overlay.querySelector('#btnCancelBantuan');
        btnCancel.onclick = () => overlay.remove();

        const btnL1 = overlay.querySelector('#btnChooseLevel1');
        if (btnL1 && !isL1Active) {
            btnL1.onclick = () => {
                overlay.remove();
                this.applyBantuanLevel1(question);
            };
        }

        const btnL2 = overlay.querySelector('#btnChooseLevel2');
        if (btnL2) {
            btnL2.onclick = () => {
                overlay.remove();
                this.applyBantuanLevel2(question);
            };
        }

        const btnDirect = overlay.querySelector('#btnChooseDirect');
        if (btnDirect) {
            btnDirect.onclick = () => {
                overlay.remove();
                this.applyBantuanDirect(question);
            };
        }
    }

    /**
     * Dapatkan step penandaan berurutan Level 1 yang sedang aktif
     */
    getCurrentBantuanStep() {
        if (!this.currentBantuanLevel1Steps || this.currentBantuanLevel1Steps.length === 0) return null;
        if (this.currentBantuanLevel1StepIndex >= this.currentBantuanLevel1Steps.length) return null;
        return this.currentBantuanLevel1Steps[this.currentBantuanLevel1StepIndex];
    }

    /**
     * Pasang listener flyout.show agar blok di flyout otomatis ditandai class hint-blink
     */
    ensureFlyoutHook() {
        if (!this.workspace) return;
        const flyout = this.workspace.getFlyout();
        if (flyout && !flyout._hintBlinkWrapped) {
            const origShow = flyout.show;
            const self = this;
            flyout.show = function(xmlList) {
                origShow.call(this, xmlList);
                setTimeout(() => {
                    if (self.currentBantuanLevel1Active) {
                        self.markCurrentFlyoutBlock();
                    }
                }, 25);
            };
            flyout._hintBlinkWrapped = true;
        }
    }

    /**
     * Pasang listener workspace agar setelah blok ditarik ke workspace,
     * tanda bergeser ke blok berikutnya
     */
    ensureBlockCreateHook() {
        if (this.workspace && !this.activeBlockChangeListener) {
            this.activeBlockChangeListener = (e) => {
                if (!this.currentBantuanLevel1Active) return;

                if (e.type === Blockly.Events.BLOCK_CREATE && e.workspaceId === this.workspace.id) {
                    const createdBlock = this.workspace.getBlockById(e.blockId);
                    if (!createdBlock || createdBlock.isShadow()) return;

                    const step = this.getCurrentBantuanStep();
                    const isBlockMatch = step && createdBlock && (
                        createdBlock.type === step.block ||
                        (step.block === 'controls_ifelse' && createdBlock.type === 'controls_if') ||
                        (step.block === 'controls_if' && createdBlock.type === 'controls_ifelse')
                    );
                    if (step && isBlockMatch && !step.mutatorOf) {
                        if (step.variableName && createdBlock.getField('VAR')) {
                            try {
                                const varModel = this.workspace.getVariable(step.variableName) || this.workspace.createVariable(step.variableName);
                                if (varModel) {
                                    createdBlock.setFieldValue(varModel.getId(), 'VAR');
                                }
                            } catch (err) {}
                        }
                        if (!this.currentBantuanLevel1CreatedBlocks) {
                            this.currentBantuanLevel1CreatedBlocks = [];
                        }
                        this.currentBantuanLevel1CreatedBlocks.push(createdBlock);

                        // Blok yang dibutuhkan untuk langkah ini sudah ditarik ke workspace!
                        this.currentBantuanLevel1StepIndex++;
                        if (this.currentBantuanLevel1StepIndex < this.currentBantuanLevel1Steps.length) {
                            // Lanjut ke blok berikutnya
                            this.applyCurrentBantuanStep();
                        } else {
                            // Seluruh blok yang dibutuhkan telah ditarik
                            this.finishBantuanLevel1();
                        }
                    }
                } else if (e.type === Blockly.Events.BLOCK_CHANGE && e.workspaceId === this.workspace.id) {
                    const step = this.getCurrentBantuanStep();
                    if (step && (step.action === 'mutator_config' || step.mutatorOf)) {
                        const block = this.workspace.getBlockById(e.blockId);
                        if (block && block.type === (step.mutatorOf || step.block)) {
                            // Deteksi jika pengaturan cabang sudah ditambahkan (IF1 dan ELSE)
                            if (block.getInput('IF1') && block.getInput('ELSE')) {
                                this.currentBantuanLevel1StepIndex++;
                                if (this.currentBantuanLevel1StepIndex < this.currentBantuanLevel1Steps.length) {
                                    this.applyCurrentBantuanStep();
                                } else {
                                    this.finishBantuanLevel1();
                                }
                            }
                        }
                    } else if (step && step.action === 'change_op_gte' && e.name === 'OP') {
                        const block = this.workspace.getBlockById(e.blockId);
                        if (block && block.type === 'logic_compare' && block.getFieldValue('OP') === 'GTE') {
                            this.currentBantuanLevel1StepIndex++;
                            if (this.currentBantuanLevel1StepIndex < this.currentBantuanLevel1Steps.length) {
                                this.applyCurrentBantuanStep();
                            } else {
                                this.finishBantuanLevel1();
                            }
                        }
                    }
                } else if (e.type === Blockly.Events.BLOCK_MOVE && e.workspaceId === this.workspace.id) {
                    const step = this.getCurrentBantuanStep();
                    if (step && step.action === 'move_input_to_set_nama') {
                        const readTextBlock = this.workspace.getAllBlocks(false).find(b => b.type === 'python_input');
                        if (readTextBlock && readTextBlock.getParent() && readTextBlock.getParent().type === 'variables_set') {
                            this.currentBantuanLevel1StepIndex++;
                            if (this.currentBantuanLevel1StepIndex < this.currentBantuanLevel1Steps.length) {
                                this.applyCurrentBantuanStep();
                            } else {
                                this.finishBantuanLevel1();
                            }
                        }
                    } else if (step && step.action === 'insert_var_nama_to_mencatat') {
                        const joins = this.workspace.getAllBlocks(false).filter(b => b.type === 'text_join');
                        if (joins.length > 0) {
                            const add1 = joins[0].getInputTargetBlock('ADD1');
                            if (add1 && add1.type === 'variables_get') {
                                this.currentBantuanLevel1StepIndex++;
                                if (this.currentBantuanLevel1StepIndex < this.currentBantuanLevel1Steps.length) {
                                    this.applyCurrentBantuanStep();
                                } else {
                                    this.finishBantuanLevel1();
                                }
                            }
                        }
                    } else if (step && step.block === 'python_input' && !step.action) {
                        const movedBlock = this.workspace.getBlockById(e.blockId);
                        if (movedBlock && movedBlock.type === 'python_input' && movedBlock.getParent()) {
                            this.currentBantuanLevel1StepIndex++;
                            if (this.currentBantuanLevel1StepIndex < this.currentBantuanLevel1Steps.length) {
                                this.applyCurrentBantuanStep();
                            } else {
                                this.finishBantuanLevel1();
                            }
                        }
                    } else if (step && step.action === 'move_blocks_into_while') {
                        const whileBlocks = this.workspace.getAllBlocks(false).filter(b => b.type === 'controls_whileUntil');
                        const whileBlock = whileBlocks[whileBlocks.length - 1];
                        if (whileBlock) {
                            const doTarget = whileBlock.getInputTargetBlock('DO');
                            if (doTarget) {
                                this.currentBantuanLevel1StepIndex++;
                                if (this.currentBantuanLevel1StepIndex < this.currentBantuanLevel1Steps.length) {
                                    this.applyCurrentBantuanStep();
                                } else {
                                    this.finishBantuanLevel1();
                                }
                            }
                        }
                    }
                }
            };
            this.workspace.addChangeListener(this.activeBlockChangeListener);
        }
    }

    /**
     * Sorot slot koneksi target di workspace berdasarkan konfigurasi target
     */
    highlightTargetConnection(target) {
        this.clearConnectionHighlights();
        if (!this.workspace || !target) return;

        let targetConn = null;

        if (target.containerBlockType) {
            const containers = this.workspace.getAllBlocks(true).filter(b => b.type === target.containerBlockType);
            const container = target.isLastContainer ? containers[containers.length - 1] : (typeof target.containerIndex === 'number' ? containers[target.containerIndex] : containers[containers.length - 1]);
            if (container) {
                if (target.containerInput && target.childInput) {
                    let child = container.getInputTargetBlock(target.containerInput);
                    // Fallback jika child belum dicolok ke container (misal blok perbandingan masih mengambang di workspace)
                    if (!child) {
                        const sessionChilds = (this.currentBantuanLevel1CreatedBlocks || []).filter(b => !b.disposed && (target.childBlockType ? b.type === target.childBlockType : true));
                        child = sessionChilds.slice().reverse().find(b => b.getInput && b.getInput(target.childInput)) ||
                                this.workspace.getAllBlocks(true).slice().reverse().find(b => b.getInput && b.getInput(target.childInput));
                    }
                    if (child) {
                        const inp = child.getInput(target.childInput);
                        if (inp && inp.connection) targetConn = inp.connection;
                    }
                } else if (target.containerInput) {
                    const inp = container.getInput(target.containerInput);
                    if (inp && inp.connection) targetConn = inp.connection;
                }
            }
        } else if (target.type === 'next_of_last') {
            const topBlocks = this.workspace.getTopBlocks(true);
            if (topBlocks.length > 0) {
                // Pilih rantai top block terpanjang (rantai kode utama)
                let longestBlock = topBlocks[0];
                let maxDepth = 0;
                topBlocks.forEach(tb => {
                    let depth = 0;
                    let curr = tb;
                    while (curr) {
                        depth++;
                        curr = curr.getNextBlock();
                    }
                    if (depth > maxDepth) {
                        maxDepth = depth;
                        longestBlock = tb;
                    }
                });
                let current = longestBlock;
                while (current.getNextBlock()) {
                    current = current.getNextBlock();
                }
                if (current.nextConnection) {
                    targetConn = current.nextConnection;
                }
            }
        } else if (target.insideLoopDoOf) {
            const loops = this.workspace.getAllBlocks(true).filter(b => b.type === target.insideLoopDoOf);
            const loopBlock = loops[loops.length - 1];
            if (loopBlock) {
                const doInput = loopBlock.getInput('DO');
                if (doInput && doInput.connection) {
                    const firstChild = doInput.connection.targetBlock();
                    if (firstChild && target.lastStatement) {
                        let curr = firstChild;
                        while (curr.getNextBlock()) {
                            curr = curr.getNextBlock();
                        }
                        if (curr.nextConnection) targetConn = curr.nextConnection;
                    } else {
                        targetConn = doInput.connection;
                    }
                }
            }
        } else if (target.blockType) {
            // Gunakan getAllBlocks(true) agar berurutan top-down, bukan hashmap acak
            const matchingBlocks = this.workspace.getAllBlocks(true).filter(b => b.type === target.blockType);
            if (matchingBlocks.length > 0) {
                let chosenBlock = null;

                // Prioritaskan blok yang baru ditarik pada sesi bantuan saat ini
                const sessionBlocks = (this.currentBantuanLevel1CreatedBlocks || []).filter(b => !b.disposed && b.type === target.blockType);

                if (target.isLast) {
                    chosenBlock = sessionBlocks.length > 0 ? sessionBlocks[sessionBlocks.length - 1] : matchingBlocks[matchingBlocks.length - 1];
                } else if (typeof target.index === 'number') {
                    chosenBlock = matchingBlocks[target.index] || matchingBlocks[matchingBlocks.length - 1];
                } else {
                    // Jika mencari slot input (misal TEXT, ADD0, ADD1, VALUE)
                    if (target.input) {
                        // Cari blok yang slot input-nya masih kosong atau masih berupa shadow block (belum terisi kode permanen)
                        let cand = sessionBlocks.slice().reverse().find(b => {
                            const inp = b.getInput(target.input);
                            if (!inp || !inp.connection) return false;
                            const targetB = inp.connection.targetBlock();
                            return !targetB || targetB.isShadow();
                        });
                        if (!cand) {
                            cand = matchingBlocks.slice().reverse().find(b => {
                                const inp = b.getInput(target.input);
                                if (!inp || !inp.connection) return false;
                                const targetB = inp.connection.targetBlock();
                                return !targetB || targetB.isShadow();
                            });
                        }
                        chosenBlock = cand || (sessionBlocks.length > 0 ? sessionBlocks[sessionBlocks.length - 1] : matchingBlocks[matchingBlocks.length - 1]);
                    } else if (target.connection === 'next') {
                        // Cari blok yang nextConnection-nya belum terhubung
                        let cand = sessionBlocks.slice().reverse().find(b => b.nextConnection && !b.getNextBlock());
                        if (!cand) {
                            cand = matchingBlocks.slice().reverse().find(b => b.nextConnection && !b.getNextBlock());
                        }
                        chosenBlock = cand || (sessionBlocks.length > 0 ? sessionBlocks[sessionBlocks.length - 1] : matchingBlocks[matchingBlocks.length - 1]);
                    } else {
                        chosenBlock = sessionBlocks.length > 0 ? sessionBlocks[sessionBlocks.length - 1] : matchingBlocks[matchingBlocks.length - 1];
                    }
                }

                if (chosenBlock) {
                    if (target.childBlockType) {
                        const descendants = chosenBlock.getDescendants(true);
                        const child = descendants.find(b => b.type === target.childBlockType);
                        if (child && target.input) {
                            const inp = child.getInput(target.input);
                            if (inp && inp.connection) targetConn = inp.connection;
                        }
                    } else if (target.input) {
                        const input = chosenBlock.getInput(target.input);
                        if (input && input.connection) {
                            targetConn = input.connection;
                        }
                    } else if (target.connection === 'next' && chosenBlock.nextConnection) {
                        targetConn = chosenBlock.nextConnection;
                    }
                }
            }
        }

        if (targetConn && typeof targetConn.highlight === 'function') {
            try {
                targetConn.highlight();
                this.currentHighlightedConnections.push(targetConn);
            } catch (err) {
                console.warn("Gagal menyorot koneksi target:", err);
            }
        }
    }

    /**
     * Bersihkan semua sorotan koneksi dan animasi ikon mutator
     */
    clearConnectionHighlights() {
        if (this.currentHighlightedConnections && this.currentHighlightedConnections.length > 0) {
            this.currentHighlightedConnections.forEach(conn => {
                try {
                    if (conn && typeof conn.unhighlight === 'function') {
                        conn.unhighlight();
                    }
                } catch (e) {}
            });
            this.currentHighlightedConnections = [];
        }
        document.querySelectorAll('.mutator-hint-glow').forEach(el => {
            el.classList.remove('mutator-hint-glow');
        });
        document.querySelectorAll('.logic-compare-hint-glow').forEach(el => {
            el.classList.remove('logic-compare-hint-glow');
        });
        document.querySelectorAll('.blocklyHighlightedConnectionPath').forEach(el => {
            el.remove();
        });
    }

    /**
     * Selesaikan Bantuan Opsi 1 ketika semua langkah selesai
     */
    finishBantuanLevel1() {
        this.clearToolboxHighlights();
        this.currentBantuanLevel1Active = false;
        const helpPanel = document.getElementById('helpPanel');
        if (helpPanel) {
            const body = helpPanel.querySelector('.assist-panel-body');
            if (body) {
                const currentQ = this.allQuestions && this.allQuestions[this.currentIndex];
                const isQ5 = (currentQ && currentQ.id === 'L3-C1-Q5') ||
                             (this.currentBantuanLevel1Steps || []).some(s => s.action === 'fill_values_soal5');
                const isQ6 = (currentQ && currentQ.id === 'L3-C1-Q6') ||
                             (this.currentBantuanLevel1Steps || []).some(s => s.action === 'fill_values_soal6');
                const isQ8 = (currentQ && currentQ.id === 'L4-C1-Q8') ||
                             (this.currentBantuanLevel1Steps || []).some(s => s.action === 'fill_values_soal8' || s.action === 'move_blocks_into_while');

                let autoFillButtonHtml = '';
                if (isQ5 || isQ6) {
                    autoFillButtonHtml = `
                        <div style="margin-top: 10px; padding: 10px; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 6px;">
                            <div style="font-size: 0.85rem; color: #a7f3d0; margin-bottom: 6px;">
                                💡 <strong>Ingin melengkapi teks & angka yang belum diganti secara otomatis?</strong>
                            </div>
                            <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                                <button id="btnAutoFillCurrentProblem" class="btn-mutator-action btn-mutator-auto" style="padding: 6px 14px; font-size: 0.85rem; font-weight: 600;">
                                    ⚡ Lengkapi Isi Angka & Teks Cetak Otomatis
                                </button>
                                <span id="autoFillSuccessBadge" style="display: none; color: #34d399; font-size: 0.85rem; font-weight: 600;">
                                    ✨ Isi angka dan teks cetak berhasil dilengkapi!
                                </span>
                            </div>
                        </div>
                    `;
                } else if (isQ8) {
                    autoFillButtonHtml = `
                        <div style="margin-top: 10px; padding: 10px; background: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 6px;">
                            <div style="font-size: 0.85rem; color: #a7f3d0; margin-bottom: 6px;">
                                💡 <strong>Ingin menyusun While Loop dan konfirmasi Tambah Data secara otomatis?</strong>
                            </div>
                            <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
                                <button id="btnAutoFillCurrentProblem" class="btn-mutator-action btn-mutator-auto" style="padding: 6px 14px; font-size: 0.85rem; font-weight: 600;">
                                    ⚡ Lengkapi While Loop & Konfirmasi Otomatis
                                </button>
                                <span id="autoFillSuccessBadge" style="display: none; color: #34d399; font-size: 0.85rem; font-weight: 600;">
                                    ✨ While loop dan konfirmasi Tambah Data berhasil disusun & dilengkapi!
                                </span>
                            </div>
                        </div>
                    `;
                }

                const bantuanTeks = currentQ ? (currentQ.bantuan_teks || (currentQ.bantuan && currentQ.bantuan.teks) || '') : '';
                const bantuanTeksHtml = bantuanTeks
                    ? `<div style="margin-top: 8px; padding: 8px 12px; background: rgba(56, 189, 248, 0.12); border-left: 3px solid #38bdf8; border-radius: 4px; color: #e0f2fe; font-size: 0.88rem; line-height: 1.45;">💡 <strong>Bantuan:</strong> ${bantuanTeks}</div>`
                    : '';

                body.innerHTML = `
                    <div>
                        ✅ <strong>Semua blok yang dibutuhkan telah ditarik ke area kerja!</strong><br>
                        <small style="color: rgba(255,255,255,0.7);">Silakan susun dan lengkapi blok-blok tersebut sesuai instruksi soal.</small>
                        ${bantuanTeksHtml}
                        ${autoFillButtonHtml}
                    </div>
                `;

                if (isQ5 || isQ6 || isQ8) {
                    const btnAutoFill = body.querySelector('#btnAutoFillCurrentProblem');
                    if (btnAutoFill) {
                        btnAutoFill.onclick = () => {
                            if (isQ5) this.fillValuesSoal5ToWorkspace();
                            if (isQ6) this.fillValuesSoal6ToWorkspace();
                            if (isQ8) this.fillValuesSoal8ToWorkspace();
                            const badge = body.querySelector('#autoFillSuccessBadge');
                            if (badge) badge.style.display = 'inline-block';
                        };
                    }
                }
            }
        }
        if (this.workspace && typeof Blockly !== 'undefined' && Blockly.svgResize) {
            Blockly.svgResize(this.workspace);
        }
    }

    /**
     * Bantuan Opsi 1: Tandai kategori dan blok di toolbox & flyout secara berurutan
     */
    applyBantuanLevel1(question) {
        const bantuan = question.bantuan || {};
        const penalty = (bantuan.level1 && bantuan.level1.penalty) || this.helpPenaltyOption1;
        this.markBantuanUsed(1, penalty);

        // Susun urutan langkah: dari steps eksplisit atau pasangan categories & blocks
        let steps = [];
        if (bantuan.level1 && Array.isArray(bantuan.level1.steps) && bantuan.level1.steps.length > 0) {
            steps = bantuan.level1.steps;
        } else if (bantuan.level1 && Array.isArray(bantuan.level1.categories) && Array.isArray(bantuan.level1.blocks)) {
            steps = bantuan.level1.categories.map((cat, i) => ({
                category: cat,
                block: bantuan.level1.blocks[i] || bantuan.level1.blocks[0]
            }));
        } else {
            steps = [{ category: 'I/O', block: 'text_print' }];
        }

        this.currentBantuanLevel1Steps = steps;
        this.currentBantuanLevel1StepIndex = 0;
        this.currentBantuanLevel1Active = true;
        this.currentBantuanLevel1CreatedBlocks = [];

        // Pastikan variabel yang dibutuhkan soal sudah terdaftar di workspace agar kategori Variables tidak kosong
        if (this.workspace) {
            const varsToEnsure = [];
            if (question.kunci_workspace && Array.isArray(question.kunci_workspace.variables)) {
                question.kunci_workspace.variables.forEach(v => varsToEnsure.push(v));
            }
            if (bantuan.level2 && Array.isArray(bantuan.level2.variables)) {
                bantuan.level2.variables.forEach(v => varsToEnsure.push(v));
            }
            steps.forEach(s => {
                if (s && s.variableName) {
                    varsToEnsure.push({ name: s.variableName });
                }
            });
            varsToEnsure.forEach(v => {
                if (v && v.name && !this.workspace.getVariable(v.name)) {
                    try {
                        this.workspace.createVariable(v.name, '', v.id || undefined);
                    } catch (e) {}
                }
            });
        }

        this.ensureFlyoutHook();
        this.ensureBlockCreateHook();
        this.applyCurrentBantuanStep();
    }

    /**
     * Terapkan langkah penandaan saat ini: sorot kategori dan tandai blok di flyout
     */
    applyCurrentBantuanStep() {
        const step = this.getCurrentBantuanStep();
        if (!step) {
            this.clearToolboxHighlights();
            return;
        }

        // 1. Bersihkan highlight kategori lama
        document.querySelectorAll('.bantuan-highlight-category').forEach(el => {
            el.classList.remove('bantuan-highlight-category');
        });

        const isMutatorStep = step.action === 'mutator_config' || !!step.mutatorOf;
        const isLoopConfigStep = step.action === 'change_loop_to_3';
        const isChangeOpGteStep = step.action === 'change_op_gte';
        const isMoveBlocksStep = step.action === 'move_blocks_into_loop' || step.action === 'move_blocks_into_while';
        const isAddSetNamaStep = step.action === 'add_set_nama';
        const isMoveInputStep = step.action === 'move_input_to_set_nama';
        const isInsertVarNamaStep = step.action === 'insert_var_nama_to_mencatat';
        const isAddPrintStep = step.action === 'add_print_summary';
        const isJoin4Step = step.action === 'setup_join_4_slots';
        const isFillSummaryStep = step.action === 'fill_summary_components';
        const isFillValuesSoal5Step = step.action === 'fill_values_soal5';
        const isFillValuesSoal6Step = step.action === 'fill_values_soal6';
        const isFillValuesSoal8Step = step.action === 'fill_values_soal8';
        const isAddSetLanjutEndStep = step.block === 'variables_set' && step.variableName === 'lanjut' && step.target && step.target.insideLoopDoOf;
        const isAttachReadNumStep = step.block === 'read_number' && step.target && step.target.containerBlockType === 'variables_set';
        const isActionStep = isMutatorStep || isLoopConfigStep || isChangeOpGteStep || isMoveBlocksStep || isMoveInputStep || isFillSummaryStep || isFillValuesSoal5Step || isFillValuesSoal6Step || isFillValuesSoal8Step;

        // 2. Beri highlight kedip pada kategori toolbox yang dibutuhkan (jika bukan action khusus)
        if (!isActionStep && step.category) {
            const rows = document.querySelectorAll('.blocklyTreeRow, .blocklyToolboxCategory');
            rows.forEach(row => {
                const labelEl = row.querySelector('.blocklyTreeLabel') || row;
                const text = labelEl.textContent.trim().toLowerCase();
                const targetCat = step.category.toLowerCase();
                if (text === targetCat || text.includes(targetCat)) {
                    row.classList.add('bantuan-highlight-category');
                }
            });

            // 3. Jika flyout sedang terbuka untuk kategori ini, langsung tandai blok di flyout
            this.markCurrentFlyoutBlock();
        }

        // 4. Sorot slot koneksi target di workspace jika ada
        if (step.target) {
            this.highlightTargetConnection(step.target);
        } else {
            this.clearConnectionHighlights();
        }

        // 5. Jika ini langkah mutator (Soal 6), beri animasi glow pada ikon gear di blok controls_if
        let targetMutatorBlock = null;
        if (isMutatorStep && this.workspace) {
            const ifBlocks = this.workspace.getAllBlocks(false).filter(b => b.type === (step.mutatorOf || 'controls_if'));
            targetMutatorBlock = ifBlocks[ifBlocks.length - 1];
            if (targetMutatorBlock) {
                const svgRoot = targetMutatorBlock.getSvgRoot();
                if (svgRoot) {
                    const iconEl = svgRoot.querySelector('.blocklyIconGroup, .blockly-icon-mutator, image');
                    if (iconEl) iconEl.classList.add('mutator-hint-glow');
                }
            }
        }

        // 5b. Jika ini langkah ubah operator >= (Soal 5 & 6), beri efek visual glow pada blok logic_compare target
        if (isChangeOpGteStep && this.workspace) {
            let targetCompare = null;
            if (step.target && step.target.containerBlockType) {
                const containers = this.workspace.getAllBlocks(true).filter(b => b.type === step.target.containerBlockType);
                const container = step.target.isLastContainer ? containers[containers.length - 1] : containers[0];
                if (container && step.target.containerInput) {
                    targetCompare = container.getInputTargetBlock(step.target.containerInput);
                }
            } else if (step.target && step.target.blockType) {
                const matching = this.workspace.getAllBlocks(true).filter(b => b.type === step.target.blockType);
                const targetBlock = step.target.isLast ? matching[matching.length - 1] : matching[0];
                if (targetBlock) {
                    if (step.target.input) {
                        targetCompare = targetBlock.getInputTargetBlock(step.target.input);
                    } else if (targetBlock.type === 'logic_compare') {
                        targetCompare = targetBlock;
                    }
                }
            }
            if (!targetCompare) {
                const sessionComps = (this.currentBantuanLevel1CreatedBlocks || []).filter(b => !b.disposed && b.type === 'logic_compare');
                targetCompare = sessionComps[sessionComps.length - 1];
            }
            if (!targetCompare) {
                const compares = this.workspace.getAllBlocks(true).filter(b => b.type === 'logic_compare');
                targetCompare = compares.find(b => b.getFieldValue('OP') !== 'GTE') || compares[compares.length - 1];
            }
            if (targetCompare && targetCompare.getSvgRoot()) {
                targetCompare.getSvgRoot().classList.add('logic-compare-hint-glow');
            }
        }

        // 6. Update info pada panel bantuan di bawah soal
        let helpPanel = document.getElementById('helpPanel');
        const assistContent = document.getElementById('assistanceContent');
        if (assistContent) {
            if (!helpPanel) {
                helpPanel = document.createElement('div');
                helpPanel.id = 'helpPanel';
                helpPanel.className = 'assist-panel assist-panel-help';
                assistContent.appendChild(helpPanel);
            }
            helpPanel.style.animation = 'fadeSlideIn 0.3s ease-out';
            const stepNum = this.currentBantuanLevel1StepIndex + 1;
            const totalSteps = this.currentBantuanLevel1Steps.length;
            const instructionHtml = step.instruction 
                ? `<div style="margin-top: 8px; padding: 8px 12px; background: rgba(16, 185, 129, 0.12); border-left: 3px solid #10b981; border-radius: 4px; color: #d1fae5; font-size: 0.9rem; line-height: 1.45;">📌 <strong>Instruksi:</strong> ${step.instruction}</div>`
                : '';

            const slotHintHtml = step.target
                ? `<div style="margin-top: 6px; font-size: 0.82rem; color: #38bdf8;">🎯 <strong>Lokasi Pasang:</strong> Perhatikan slot/sambungan yang <strong>berkedip biru-kuning terang</strong> di area kerja!</div>`
                : '';

            let actionControlsHtml = '';
            if (isMutatorStep) {
                actionControlsHtml = `
                    <div style="margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
                        <button id="btnOpenMutatorModal" class="btn-mutator-action">
                            ⚙️ Buka Menu Pengaturan If
                        </button>
                        <button id="btnAutoConfigMutator" class="btn-mutator-action btn-mutator-auto">
                            ⚡ Pasang Cabang Otomatis (1 Else-If, 1 Else)
                        </button>
                    </div>
                `;
            } else if (isLoopConfigStep) {
                actionControlsHtml = `
                    <div style="margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
                        <button id="btnSetLoop3" class="btn-mutator-action btn-mutator-auto">
                            ⚡ Ubah Batas Loop Menjadi 3 Otomatis
                        </button>
                    </div>
                `;
            } else if (isChangeOpGteStep) {
                actionControlsHtml = `
                    <div style="margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
                        <button id="btnAutoChangeOpGte" class="btn-mutator-action btn-mutator-auto">
                            ⚡ Ubah Tanda Menjadi ≥ Otomatis
                        </button>
                    </div>
                `;
            } else if (isMoveBlocksStep) {
                actionControlsHtml = `
                    <div style="margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
                        <button id="btnMoveBlocksIntoLoop" class="btn-mutator-action btn-mutator-auto">
                            ⚡ Pindahkan Rangkaian Blok ke Dalam Loop Otomatis
                        </button>
                    </div>
                `;
            } else if (isAddSetNamaStep) {
                actionControlsHtml = `
                    <div style="margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
                        <button id="btnAutoAddSetNama" class="btn-mutator-action btn-mutator-auto">
                            ⚡ Pasang Blok 'set nama to' Otomatis
                        </button>
                    </div>
                `;
            } else if (isMoveInputStep) {
                actionControlsHtml = `
                    <div style="margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
                        <button id="btnAutoMoveInput" class="btn-mutator-action btn-mutator-auto">
                            ⚡ Pindahkan Input ke 'set nama to' Otomatis
                        </button>
                    </div>
                `;
            } else if (isInsertVarNamaStep) {
                actionControlsHtml = `
                    <div style="margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
                        <button id="btnAutoInsertVarNama" class="btn-mutator-action btn-mutator-auto">
                            ⚡ Pasang Variabel nama ke Cetak Otomatis
                        </button>
                    </div>
                `;
            } else if (isAddPrintStep) {
                actionControlsHtml = `
                    <div style="margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
                        <button id="btnAutoAddPrint" class="btn-mutator-action btn-mutator-auto">
                            ⚡ Pasang Blok Print ke Paling Bawah Otomatis
                        </button>
                    </div>
                `;
            } else if (isJoin4Step) {
                actionControlsHtml = `
                    <div style="margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
                        <button id="btnAutoJoin4" class="btn-mutator-action btn-mutator-auto">
                            ⚡ Pasang & Atur 4 Slot Otomatis
                        </button>
                    </div>
                `;
            } else if (isFillSummaryStep) {
                actionControlsHtml = `
                    <div style="margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
                        <button id="btnAutoFillSummary" class="btn-mutator-action btn-mutator-auto">
                            ⚡ Pasang Komponen Ringkasan Otomatis
                        </button>
                    </div>
                `;
            } else if (isFillValuesSoal5Step || isFillValuesSoal6Step) {
                actionControlsHtml = `
                    <div style="margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
                        <button id="btnAutoFillValues" class="btn-mutator-action btn-mutator-auto">
                            ⚡ Lengkapi Isi Angka & Teks Cetak Otomatis
                        </button>
                    </div>
                `;
            } else if (isAddSetLanjutEndStep) {
                actionControlsHtml = `
                    <div style="margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
                        <button id="btnAutoAddSetLanjutEnd" class="btn-mutator-action btn-mutator-auto">
                            ⚡ Pasang 'set lanjut to' di Akhir Loop Otomatis
                        </button>
                    </div>
                `;
            } else if (isAttachReadNumStep) {
                actionControlsHtml = `
                    <div style="margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
                        <button id="btnAutoAttachReadNum" class="btn-mutator-action btn-mutator-auto">
                            ⚡ Pasang 'read int' ke 'set lanjut to' Otomatis
                        </button>
                    </div>
                `;
            } else if (isFillValuesSoal8Step) {
                actionControlsHtml = `
                    <div style="margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap; align-items: center;">
                        <button id="btnAutoFillValuesSoal8" class="btn-mutator-action btn-mutator-auto">
                            ⚡ Lengkapi Teks Konfirmasi Tambah Data Otomatis
                        </button>
                    </div>
                `;
            }

            let stepDesc = '';
            if (isMutatorStep) {
                stepDesc = `<strong>Langkah ${stepNum} dari ${totalSteps}:</strong> Klik ikon roda gigi ⚙️ pada blok <code>if</code> di area kerja untuk menambah cabang.`;
            } else if (isLoopConfigStep) {
                stepDesc = `<strong>Langkah ${stepNum} dari ${totalSteps}:</strong> Ubah angka batas perulangan pada blok <code>count with</code> (slot <code>to</code>) menjadi <strong>3</strong>.`;
            } else if (isChangeOpGteStep) {
                stepDesc = `<strong>Langkah ${stepNum} dari ${totalSteps}:</strong> Klik tanda <code>=</code> pada blok perbandingan, lalu ubah tandanya menjadi <strong>≥</strong> (lebih besar sama dengan).`;
            } else if (isMoveBlocksStep) {
                stepDesc = `<strong>Langkah ${stepNum} dari ${totalSteps}:</strong> Pindahkan seluruh rangkaian blok siswa ke dalam loop perulangan (slot <code>do</code>).`;
            } else if (isAddSetNamaStep) {
                stepDesc = `<strong>Langkah ${stepNum} dari ${totalSteps}:</strong> Buka kategori <strong>Variables</strong> (👈), buat variabel <code>nama</code>, lalu tarik blok <code>set [nama] to</code> dan letakkan tepat di bawah <code>print 'Selamat Datang...'</code>.`;
            } else if (isMoveInputStep) {
                stepDesc = `<strong>Langkah ${stepNum} dari ${totalSteps}:</strong> Pindahkan blok <code>read text 'masukkan nama'</code> dari dalam blok print ke slot kosong di samping <code>set [nama] to</code>.`;
            } else if (isInsertVarNamaStep) {
                stepDesc = `<strong>Langkah ${stepNum} dari ${totalSteps}:</strong> Buka kategori <strong>Variables</strong> (👈), tarik blok variabel <code>nama</code> dan pasangkan ke slot kedua pada <code>print 'Mencatat nilai untuk: '</code> (di mana sebelumnya tempat dari input yang dipindah).`;
            } else if (isAddPrintStep) {
                stepDesc = `<strong>Langkah ${stepNum} dari ${totalSteps}:</strong> Buka kategori <strong>I/O</strong> (👈), tarik blok <code>print</code> baru ke bagian paling bawah rangkaian program.`;
            } else if (isJoin4Step) {
                stepDesc = `<strong>Langkah ${stepNum} dari ${totalSteps}:</strong> Buka kategori <strong>Text</strong> (👈), tarik blok <code>create text with</code> ke dalam blok print baru di bawah (klik ikon ⚙️ untuk membuat 4 slot).`;
            } else if (isFillSummaryStep) {
                stepDesc = `<strong>Langkah ${stepNum} dari ${totalSteps}:</strong> Pasang 4 komponen ringkasan ke masing-masing slot (teks <code>"Nilai "</code>, variabel <code>nama</code>, teks <code>" adalah "</code>, dan variabel <code>nilai</code>).`;
            } else if (isFillValuesSoal5Step) {
                stepDesc = `<strong>Langkah ${stepNum} dari ${totalSteps}:</strong> Periksa dan lengkapi isi angka (<code>75</code>) serta teks cetak (<code>Status: Lulus</code> dan <code>Status: Tidak Lulus</code>).`;
            } else if (isFillValuesSoal6Step) {
                stepDesc = `<strong>Langkah ${stepNum} dari ${totalSteps}:</strong> Periksa dan lengkapi isi angka (<code>90</code> & <code>75</code>) serta teks cetak (<code>Kategori: A</code>, <code>Kategori: B</code>, dan <code>Kategori: C</code>).`;
            } else if (isFillValuesSoal8Step) {
                stepDesc = `<strong>Langkah ${stepNum} dari ${totalSteps}:</strong> Periksa teks konfirmasi di akhir loop: ubah teks <code>read int</code> menjadi <code>Tambah data? (1=Ya, 0=Tidak): </code>.`;
            } else {
                stepDesc = `<strong>Langkah ${stepNum} dari ${totalSteps}:</strong> Buka kategori <strong>${step.category}</strong> (👈) di sebelah kiri, lalu tarik blok yang berkedip ke area kerja.`;
            }

            const currentQ = this.allQuestions && this.allQuestions[this.currentIndex];
            const bantuanTeks = currentQ ? (currentQ.bantuan_teks || (currentQ.bantuan && currentQ.bantuan.teks) || '') : '';
            const bantuanTeksHtml = bantuanTeks
                ? `<div style="margin-top: 8px; padding: 8px 12px; background: rgba(56, 189, 248, 0.12); border-left: 3px solid #38bdf8; border-radius: 4px; color: #e0f2fe; font-size: 0.88rem; line-height: 1.45;">💡 <strong>Bantuan:</strong> ${bantuanTeks}</div>`
                : '';

            helpPanel.innerHTML = `
                <div class="assist-panel-header" style="background: rgba(251, 191, 36, 0.15); border-left-color: #fbbf24; display: flex; align-items: center; justify-content: space-between;">
                    <span>🟡 Bantuan Opsi 1 Digunakan</span>
                    <span style="font-size: 0.75rem; color: #fca5a5;">Penalti: -${this.currentPenalty} poin</span>
                </div>
                <div class="assist-panel-body">
                    ${bantuanTeksHtml}
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; flex-wrap: wrap; ${bantuanTeksHtml ? 'margin-top: 8px;' : ''}">
                        <div style="flex: 1; min-width: 200px;">
                            ${stepDesc}
                        </div>
                        <div style="display: flex; gap: 6px; margin-left: auto;">
                            ${stepNum > 1 ? `<button id="btnPrevStepBantuan" class="btn btn-secondary btn-small" style="padding: 2px 8px; font-size: 0.75rem; white-space: nowrap;">⏮️ Sebelum</button>` : ''}
                            <button id="btnNextStepBantuan" class="btn btn-secondary btn-small" style="padding: 2px 8px; font-size: 0.75rem; white-space: nowrap;">Lewati / Lanjut ⏭️</button>
                        </div>
                    </div>
                    ${instructionHtml}
                    ${slotHintHtml}
                    ${actionControlsHtml}
                    <small style="color: rgba(255,255,255,0.7); display: block; margin-top: 6px;">Setelah instruksi dijalankan, panduan akan otomatis berpindah ke langkah berikutnya.</small>
                </div>
            `;

            // Pasang event listener tombol navigasi langkah
            const btnNext = helpPanel.querySelector('#btnNextStepBantuan');
            if (btnNext) {
                btnNext.onclick = () => {
                    this.currentBantuanLevel1StepIndex++;
                    if (this.currentBantuanLevel1StepIndex < this.currentBantuanLevel1Steps.length) {
                        this.applyCurrentBantuanStep();
                    } else {
                        this.finishBantuanLevel1();
                    }
                };
            }
            const btnPrev = helpPanel.querySelector('#btnPrevStepBantuan');
            if (btnPrev) {
                btnPrev.onclick = () => {
                    if (this.currentBantuanLevel1StepIndex > 0) {
                        this.currentBantuanLevel1StepIndex--;
                        this.applyCurrentBantuanStep();
                    }
                };
            }

            // Pasang listener tombol aksi mutator
            const btnOpenMut = helpPanel.querySelector('#btnOpenMutatorModal');
            if (btnOpenMut && targetMutatorBlock) {
                btnOpenMut.onclick = () => {
                    try {
                        const mutator = targetMutatorBlock.getIcon ? targetMutatorBlock.getIcon(Blockly.icons.IconType.MUTATOR) : targetMutatorBlock.mutator;
                        if (mutator && typeof mutator.setBubbleVisible === 'function') {
                            mutator.setBubbleVisible(true);
                        }
                    } catch (e) {
                        console.warn("Gagal membuka bubble mutator:", e);
                    }
                };
            }

            const btnAutoMut = helpPanel.querySelector('#btnAutoConfigMutator');
            if (btnAutoMut && targetMutatorBlock) {
                btnAutoMut.onclick = () => {
                    try {
                        if (typeof targetMutatorBlock.loadExtraState === 'function') {
                            targetMutatorBlock.loadExtraState({ elseIfCount: 1, hasElse: true });
                        } else if (typeof targetMutatorBlock.updateShape_ === 'function') {
                            targetMutatorBlock.elseifCount_ = 1;
                            targetMutatorBlock.elseCount_ = 1;
                            targetMutatorBlock.updateShape_();
                        }
                        this.currentBantuanLevel1StepIndex++;
                        if (this.currentBantuanLevel1StepIndex < this.currentBantuanLevel1Steps.length) {
                            this.applyCurrentBantuanStep();
                        } else {
                            this.finishBantuanLevel1();
                        }
                    } catch (e) {
                        console.warn("Gagal mengonfigurasi mutator otomatis:", e);
                    }
                };
            }

            // Pasang listener tombol ubah loop ke 3 (Soal 7)
            const btnSetLoop3 = helpPanel.querySelector('#btnSetLoop3');
            if (btnSetLoop3 && this.workspace) {
                btnSetLoop3.onclick = () => {
                    try {
                        const loopBlocks = this.workspace.getAllBlocks(false).filter(b => b.type === 'controls_for');
                        const loop = loopBlocks[loopBlocks.length - 1];
                        if (loop) {
                            const toBlock = loop.getInputTargetBlock('TO');
                            if (toBlock) {
                                toBlock.setFieldValue('3', 'NUM');
                            } else {
                                const f = loop.getField('TO');
                                if (f) f.setValue('3');
                            }
                        }
                        this.currentBantuanLevel1StepIndex++;
                        if (this.currentBantuanLevel1StepIndex < this.currentBantuanLevel1Steps.length) {
                            this.applyCurrentBantuanStep();
                        } else {
                            this.finishBantuanLevel1();
                        }
                    } catch (e) {
                        console.warn("Gagal ubah batas loop ke 3:", e);
                    }
                };
            }

            // Pasang listener tombol ubah operator logic compare ke >= (Soal 5 & 6)
            const btnChangeOp = helpPanel.querySelector('#btnAutoChangeOpGte');
            if (btnChangeOp && this.workspace) {
                btnChangeOp.onclick = () => {
                    try {
                        const compareBlocks = this.workspace.getAllBlocks(true).filter(b => b.type === 'logic_compare');
                        const targetCompare = (this.currentBantuanLevel1CreatedBlocks || []).slice().reverse().find(b => !b.disposed && b.type === 'logic_compare') ||
                                              compareBlocks.find(b => b.getFieldValue('OP') !== 'GTE') ||
                                              compareBlocks[compareBlocks.length - 1];
                        if (targetCompare) {
                            targetCompare.setFieldValue('GTE', 'OP');
                        }
                        this.currentBantuanLevel1StepIndex++;
                        if (this.currentBantuanLevel1StepIndex < this.currentBantuanLevel1Steps.length) {
                            this.applyCurrentBantuanStep();
                        } else {
                            this.finishBantuanLevel1();
                        }
                    } catch (e) {
                        console.warn("Gagal mengubah operator ke GTE:", e);
                    }
                };
            }

            // Pasang listener tombol pindahkan blok ke dalam loop (Soal 7 & 8)
            const btnMoveBlocks = helpPanel.querySelector('#btnMoveBlocksIntoLoop');
            if (btnMoveBlocks && this.workspace) {
                btnMoveBlocks.onclick = () => {
                    const step = this.getCurrentBantuanStep();
                    if (step && step.action === 'move_blocks_into_while') {
                        this.moveBlocksIntoWhileInWorkspace();
                        this.currentBantuanLevel1StepIndex++;
                        if (this.currentBantuanLevel1StepIndex < this.currentBantuanLevel1Steps.length) {
                            this.applyCurrentBantuanStep();
                        } else {
                            this.finishBantuanLevel1();
                        }
                    } else {
                        this.restructureLoopInWorkspace();
                        this.finishBantuanLevel1();
                    }
                };
            }

            // Pasang listener tombol aksi Soal 8
            const btnSetLanjutEnd = helpPanel.querySelector('#btnAutoAddSetLanjutEnd');
            if (btnSetLanjutEnd) {
                btnSetLanjutEnd.onclick = () => {
                    this.addSetLanjutEndToWorkspace();
                    this.currentBantuanLevel1StepIndex++;
                    if (this.currentBantuanLevel1StepIndex < this.currentBantuanLevel1Steps.length) {
                        this.applyCurrentBantuanStep();
                    } else {
                        this.finishBantuanLevel1();
                    }
                };
            }

            const btnAttachReadNum = helpPanel.querySelector('#btnAutoAttachReadNum');
            if (btnAttachReadNum) {
                btnAttachReadNum.onclick = () => {
                    this.attachReadNumberToSetLanjutEndInWorkspace();
                    this.currentBantuanLevel1StepIndex++;
                    if (this.currentBantuanLevel1StepIndex < this.currentBantuanLevel1Steps.length) {
                        this.applyCurrentBantuanStep();
                    } else {
                        this.finishBantuanLevel1();
                    }
                };
            }

            const btnFillVal8 = helpPanel.querySelector('#btnAutoFillValuesSoal8');
            if (btnFillVal8) {
                btnFillVal8.onclick = () => {
                    this.fillValuesSoal8ToWorkspace();
                    this.finishBantuanLevel1();
                };
            }

            // Pasang listener tombol aksi Soal 4
            const btnAddSet = helpPanel.querySelector('#btnAutoAddSetNama');
            if (btnAddSet) {
                btnAddSet.onclick = () => {
                    this.addSetNamaToWorkspace();
                    this.currentBantuanLevel1StepIndex++;
                    if (this.currentBantuanLevel1StepIndex < this.currentBantuanLevel1Steps.length) {
                        this.applyCurrentBantuanStep();
                    } else {
                        this.finishBantuanLevel1();
                    }
                };
            }

            const btnMoveInp = helpPanel.querySelector('#btnAutoMoveInput');
            if (btnMoveInp) {
                btnMoveInp.onclick = () => {
                    this.moveInputToSetNamaInWorkspace();
                    this.currentBantuanLevel1StepIndex++;
                    if (this.currentBantuanLevel1StepIndex < this.currentBantuanLevel1Steps.length) {
                        this.applyCurrentBantuanStep();
                    } else {
                        this.finishBantuanLevel1();
                    }
                };
            }

            const btnInsVar = helpPanel.querySelector('#btnAutoInsertVarNama');
            if (btnInsVar) {
                btnInsVar.onclick = () => {
                    this.insertVarNamaToMencatatInWorkspace();
                    this.currentBantuanLevel1StepIndex++;
                    if (this.currentBantuanLevel1StepIndex < this.currentBantuanLevel1Steps.length) {
                        this.applyCurrentBantuanStep();
                    } else {
                        this.finishBantuanLevel1();
                    }
                };
            }

            const btnAddPr = helpPanel.querySelector('#btnAutoAddPrint');
            if (btnAddPr) {
                btnAddPr.onclick = () => {
                    this.addPrintSummaryToWorkspace();
                    this.currentBantuanLevel1StepIndex++;
                    if (this.currentBantuanLevel1StepIndex < this.currentBantuanLevel1Steps.length) {
                        this.applyCurrentBantuanStep();
                    } else {
                        this.finishBantuanLevel1();
                    }
                };
            }

            const btnJ4 = helpPanel.querySelector('#btnAutoJoin4');
            if (btnJ4) {
                btnJ4.onclick = () => {
                    this.setupJoin4SlotsToWorkspace();
                    this.currentBantuanLevel1StepIndex++;
                    if (this.currentBantuanLevel1StepIndex < this.currentBantuanLevel1Steps.length) {
                        this.applyCurrentBantuanStep();
                    } else {
                        this.finishBantuanLevel1();
                    }
                };
            }

            const btnFillSum = helpPanel.querySelector('#btnAutoFillSummary');
            if (btnFillSum) {
                btnFillSum.onclick = () => {
                    this.fillSummaryComponentsToWorkspace();
                    this.finishBantuanLevel1();
                };
            }

            const btnFillVal = helpPanel.querySelector('#btnAutoFillValues');
            if (btnFillVal) {
                btnFillVal.onclick = () => {
                    if (isFillValuesSoal5Step) this.fillValuesSoal5ToWorkspace();
                    if (isFillValuesSoal6Step) this.fillValuesSoal6ToWorkspace();
                    this.finishBantuanLevel1();
                };
            }

            if (this.workspace && typeof Blockly !== 'undefined' && Blockly.svgResize) {
                Blockly.svgResize(this.workspace);
            }
        }
    }

    /**
     * Tandai blok yang dibutuhkan di dalam flyout dengan class CSS hint-blink
     * dan gulir flyout ke blok tersebut jika flyout panjang
     */
    markCurrentFlyoutBlock() {
        if (!this.workspace) return;
        const flyout = this.workspace.getFlyout();
        if (!flyout || !flyout.isVisible()) return;
        const flyoutWs = flyout.getWorkspace();
        if (!flyoutWs) return;

        // Bersihkan tanda hint-blink lama dari semua blok di flyout
        const allFlyoutBlocks = flyoutWs.getAllBlocks(false);
        allFlyoutBlocks.forEach(b => {
            const root = b.getSvgRoot();
            if (root) root.classList.remove('hint-blink');
        });

        if (!this.currentBantuanLevel1Active) return;
        const step = this.getCurrentBantuanStep();
        if (!step) return;

        // Cari blok yang tipenya sesuai (dan periksa nama variabel jika ditentukan)
        let targetBlock = null;
        if (step.variableName && (step.block === 'variables_get' || step.block === 'variables_set')) {
            targetBlock = allFlyoutBlocks.find(b => {
                if (b.type !== step.block) return false;
                const f = b.getField('VAR');
                if (f) {
                    const txt = f.getText ? f.getText() : '';
                    if (txt && txt.toLowerCase() === step.variableName.toLowerCase()) return true;
                }
                const val = b.getFieldValue('VAR');
                return val === step.variableName;
            });
        }
        if (!targetBlock) {
            targetBlock = allFlyoutBlocks.find(b => b.type === step.block);
        }

        if (targetBlock) {
            const svgRoot = targetBlock.getSvgRoot();
            if (svgRoot) {
                svgRoot.classList.add('hint-blink');
                // Gulir ke blok jika flyout panjang
                try {
                    if (typeof flyout.scrollToBlock === 'function') {
                        flyout.scrollToBlock(targetBlock);
                    } else if (svgRoot.scrollIntoView) {
                        svgRoot.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                } catch (e) {}
            }
        }
    }

    /**
     * Dapatkan id variabel atau buat jika belum ada di workspace
     */
    getOrCreateVariable(varName) {
        if (!this.workspace) return varName;
        let v = null;
        if (typeof this.workspace.getVariableMap === 'function') {
            v = this.workspace.getVariableMap().getVariableByNameAndType(varName, '') 
               || this.workspace.createVariable(varName);
        } else if (typeof this.workspace.createVariable === 'function') {
            v = this.workspace.createVariable(varName);
        }
        return v ? (v.getId ? v.getId() : v.id_) : varName;
    }

    /**
     * Tambahkan / tempatkan blok 'set nama to' di antara print 'Selamat Datang...' dan print 'Mencatat...'
     */
    addSetNamaToWorkspace() {
        if (!this.workspace) return;
        try {
            const varId = this.getOrCreateVariable('nama');
            const allBlocks = this.workspace.getAllBlocks(false);
            let setBlock = allBlocks.find(b => b.type === 'variables_set' && b.getFieldValue('VAR') === varId);

            if (!setBlock) {
                setBlock = this.workspace.newBlock('variables_set');
                setBlock.setFieldValue(varId, 'VAR');
                setBlock.initSvg();
                setBlock.render();
            }

            // Cari blok print "Mencatat nilai untuk:"
            const printMencatat = allBlocks.find(b => {
                if (b.type !== 'text_print') return false;
                const desc = b.getDescendants(false);
                return desc.some(d => {
                    const val = d.getFieldValue && d.getFieldValue('TEXT');
                    return typeof val === 'string' && val.toLowerCase().includes('mencatat');
                });
            });

            if (printMencatat && printMencatat.previousConnection) {
                const prevConn = printMencatat.previousConnection.targetConnection;
                if (prevConn && prevConn !== setBlock.nextConnection) {
                    printMencatat.previousConnection.disconnect();
                    prevConn.connect(setBlock.previousConnection);
                    setBlock.nextConnection.connect(printMencatat.previousConnection);
                } else if (!setBlock.nextConnection.isConnected()) {
                    setBlock.nextConnection.connect(printMencatat.previousConnection);
                }
            } else {
                // Pasang di bawah print 'Selamat Datang' jika ada
                const printSelamat = allBlocks.find(b => {
                    if (b.type !== 'text_print') return false;
                    const desc = b.getDescendants(false);
                    return desc.some(d => {
                        const val = d.getFieldValue && d.getFieldValue('TEXT');
                        return typeof val === 'string' && val.toLowerCase().includes('selamat datang');
                    });
                });
                if (printSelamat && printSelamat.nextConnection) {
                    const nextConn = printSelamat.nextConnection.targetConnection;
                    if (nextConn && nextConn !== setBlock.previousConnection) {
                        printSelamat.nextConnection.disconnect();
                        printSelamat.nextConnection.connect(setBlock.previousConnection);
                        setBlock.nextConnection.connect(nextConn);
                    } else if (!printSelamat.nextConnection.isConnected()) {
                        printSelamat.nextConnection.connect(setBlock.previousConnection);
                    }
                } else {
                    setBlock.moveTo(new Blockly.utils.Coordinate(40, 80));
                }
            }
            setBlock.render();
            if (typeof Blockly.svgResize === 'function') Blockly.svgResize(this.workspace);
        } catch (e) {
            console.warn("Gagal memasang set nama to:", e);
        }
    }

    /**
     * Pindahkan blok 'read text' dari print 'Mencatat...' ke input VALUE dari 'set nama to'
     */
    moveInputToSetNamaInWorkspace() {
        if (!this.workspace) return;
        try {
            const varId = this.getOrCreateVariable('nama');
            const allBlocks = this.workspace.getAllBlocks(false);
            let setBlock = allBlocks.find(b => b.type === 'variables_set' && b.getFieldValue('VAR') === varId);
            if (!setBlock) {
                this.addSetNamaToWorkspace();
                setBlock = this.workspace.getAllBlocks(false).find(b => b.type === 'variables_set' && b.getFieldValue('VAR') === varId);
            }
            const readTextBlock = allBlocks.find(b => b.type === 'python_input');

            if (setBlock && readTextBlock) {
                if (readTextBlock.outputConnection) {
                    readTextBlock.outputConnection.disconnect();
                }
                const setValInput = setBlock.getInput('VALUE');
                if (setValInput && setValInput.connection && readTextBlock.outputConnection) {
                    setValInput.connection.connect(readTextBlock.outputConnection);
                }
                setBlock.render();
                readTextBlock.render();
            }
        } catch (e) {
            console.warn("Gagal memindahkan input ke set nama:", e);
        }
    }

    /**
     * Pasangkan blok variabel 'nama' ke slot print 'Mencatat nilai untuk:'
     */
    insertVarNamaToMencatatInWorkspace() {
        if (!this.workspace) return;
        try {
            const varId = this.getOrCreateVariable('nama');
            const allBlocks = this.workspace.getAllBlocks(false);
            const printMencatat = allBlocks.find(b => {
                if (b.type !== 'text_print') return false;
                const desc = b.getDescendants(false);
                return desc.some(d => {
                    const val = d.getFieldValue && d.getFieldValue('TEXT');
                    return typeof val === 'string' && val.toLowerCase().includes('mencatat');
                });
            });

            if (printMencatat) {
                const joinBlock = printMencatat.getDescendants(false).find(b => b.type === 'text_join');
                if (joinBlock) {
                    const add1Input = joinBlock.getInput('ADD1');
                    if (add1Input && add1Input.connection) {
                        const existingTarget = add1Input.connection.targetBlock();
                        if (!existingTarget) {
                            const getBlock = this.workspace.newBlock('variables_get');
                            getBlock.setFieldValue(varId, 'VAR');
                            getBlock.initSvg();
                            getBlock.render();
                            add1Input.connection.connect(getBlock.outputConnection);
                            joinBlock.render();
                        } else if (existingTarget.type === 'variables_get') {
                            existingTarget.setFieldValue(varId, 'VAR');
                        }
                    }
                }
            }
        } catch (e) {
            console.warn("Gagal memasang variabel nama ke print mencatat:", e);
        }
    }

    /**
     * Tambahkan blok print ringkasan ke bagian paling bawah
     */
    addPrintSummaryToWorkspace() {
        if (!this.workspace) return;
        try {
            const topBlocks = this.workspace.getTopBlocks(true);
            if (topBlocks.length === 0) return;
            let lastBlock = topBlocks[0];
            while (lastBlock.getNextBlock()) {
                lastBlock = lastBlock.getNextBlock();
            }
            if (lastBlock.type === 'text_print' && lastBlock.getDescendants(false).length > 2) {
                const desc = lastBlock.getDescendants(false);
                const hasSummary = desc.some(d => {
                    const v = d.getFieldValue && d.getFieldValue('TEXT');
                    return typeof v === 'string' && v.includes('adalah');
                });
                if (hasSummary) return;
            }
            const newPrint = this.workspace.newBlock('text_print');
            newPrint.initSvg();
            newPrint.render();
            if (lastBlock.nextConnection) {
                lastBlock.nextConnection.connect(newPrint.previousConnection);
            }
            newPrint.render();
        } catch (e) {
            console.warn("Gagal memasang print ringkasan:", e);
        }
    }

    /**
     * Pasang blok create text with 4 slot ke dalam blok print ringkasan
     */
    setupJoin4SlotsToWorkspace() {
        if (!this.workspace) return;
        try {
            const prints = this.workspace.getAllBlocks(false).filter(b => b.type === 'text_print');
            let lastPrint = prints[prints.length - 1];
            if (!lastPrint) return;

            let joinBlock = lastPrint.getInputTargetBlock('TEXT');
            if (!joinBlock) {
                joinBlock = this.workspace.newBlock('text_join');
                if (typeof joinBlock.loadExtraState === 'function') {
                    joinBlock.loadExtraState({ itemCount: 4 });
                } else if (typeof joinBlock.itemCount_ !== 'undefined') {
                    joinBlock.itemCount_ = 4;
                    joinBlock.updateShape_();
                }
                joinBlock.initSvg();
                joinBlock.render();
                lastPrint.getInput('TEXT').connection.connect(joinBlock.outputConnection);
            } else if (joinBlock.type === 'text_join') {
                if (typeof joinBlock.loadExtraState === 'function') {
                    joinBlock.loadExtraState({ itemCount: 4 });
                } else if (typeof joinBlock.itemCount_ !== 'undefined') {
                    joinBlock.itemCount_ = 4;
                    joinBlock.updateShape_();
                }
                joinBlock.render();
            }
            lastPrint.render();
        } catch (e) {
            console.warn("Gagal mengatur 4 slot join:", e);
        }
    }

    /**
     * Isi seluruh komponen teks ringkasan (Nilai + nama + adalah + nilai)
     */
    fillSummaryComponentsToWorkspace() {
        if (!this.workspace) return;
        try {
            const varNamaId = this.getOrCreateVariable('nama');
            const varNilaiId = this.getOrCreateVariable('nilai');
            const joins = this.workspace.getAllBlocks(false).filter(b => b.type === 'text_join');
            const lastJoin = joins[joins.length - 1];
            if (!lastJoin) return;

            // Slot 0: "Nilai "
            if (!lastJoin.getInputTargetBlock('ADD0')) {
                const t1 = this.workspace.newBlock('text');
                t1.setFieldValue('Nilai ', 'TEXT');
                t1.initSvg();
                t1.render();
                lastJoin.getInput('ADD0').connection.connect(t1.outputConnection);
            }
            // Slot 1: nama
            if (!lastJoin.getInputTargetBlock('ADD1')) {
                const g1 = this.workspace.newBlock('variables_get');
                g1.setFieldValue(varNamaId, 'VAR');
                g1.initSvg();
                g1.render();
                lastJoin.getInput('ADD1').connection.connect(g1.outputConnection);
            }
            // Slot 2: " adalah "
            if (!lastJoin.getInputTargetBlock('ADD2')) {
                const t2 = this.workspace.newBlock('text');
                t2.setFieldValue(' adalah ', 'TEXT');
                t2.initSvg();
                t2.render();
                lastJoin.getInput('ADD2').connection.connect(t2.outputConnection);
            }
            // Slot 3: nilai
            if (!lastJoin.getInputTargetBlock('ADD3')) {
                const g2 = this.workspace.newBlock('variables_get');
                g2.setFieldValue(varNilaiId, 'VAR');
                g2.initSvg();
                g2.render();
                lastJoin.getInput('ADD3').connection.connect(g2.outputConnection);
            }
            lastJoin.render();
        } catch (e) {
            console.warn("Gagal mengisi komponen ringkasan:", e);
        }
    }

    /**
     * Set nilai string teks pada blok text_print
     */
    setPrintTextBlockValue(printBlock, textVal) {
        if (!printBlock || printBlock.type !== 'text_print') return;
        let textTarget = printBlock.getInputTargetBlock('TEXT');
        if (!textTarget) {
            textTarget = this.workspace.newBlock('text');
            textTarget.initSvg();
            textTarget.render();
            if (printBlock.getInput('TEXT') && printBlock.getInput('TEXT').connection) {
                try {
                    printBlock.getInput('TEXT').connection.connect(textTarget.outputConnection);
                } catch(e) {}
            }
        }
        if (textTarget) {
            textTarget.setFieldValue(textVal, 'TEXT');
            textTarget.render();
        }
    }

    /**
     * Lengkapi isi angka dan teks cetak untuk Soal 5 (nilai >= 75, Status: Lulus, Status: Tidak Lulus)
     */
    fillValuesSoal5ToWorkspace() {
        if (!this.workspace) return;
        try {
            const ifelses = this.workspace.getAllBlocks(true).filter(b => b.type === 'controls_ifelse');
            const ifelse = ifelses[ifelses.length - 1];
            if (!ifelse) return;

            const varNilaiId = this.getOrCreateVariable('nilai');

            // 1. Sambungkan ifelse di bawah blok print terakhir jika masih mengambang
            if (!ifelse.getParent()) {
                const prints = this.workspace.getAllBlocks(true).filter(b => b.type === 'text_print' && b !== ifelse.getInputTargetBlock('DO0') && b !== ifelse.getInputTargetBlock('ELSE'));
                const lastPrint = prints.slice().reverse().find(p => p.nextConnection && !p.getNextBlock());
                if (lastPrint) {
                    try {
                        lastPrint.nextConnection.connect(ifelse.previousConnection);
                    } catch(e) {}
                }
            }

            // 2. Cek & sambungkan blok logic_compare ke IF0
            let comp = ifelse.getInputTargetBlock('IF0');
            if (!comp) {
                const comps = this.workspace.getAllBlocks(true).filter(b => b.type === 'logic_compare' && !b.getParent());
                if (comps.length > 0 && ifelse.getInput('IF0')) {
                    try {
                        ifelse.getInput('IF0').connection.connect(comps[0].outputConnection);
                        comp = comps[0];
                    } catch(e) {}
                }
            }
            if (!comp) {
                comp = this.workspace.newBlock('logic_compare');
                comp.initSvg();
                comp.render();
                ifelse.getInput('IF0').connection.connect(comp.outputConnection);
            }
            if (comp) {
                comp.setFieldValue('GTE', 'OP');
                let blockA = comp.getInputTargetBlock('A');
                let blockB = comp.getInputTargetBlock('B');

                // Jika terbalik (angka di A, variabel di B), tukar posisinya!
                if (blockA && blockA.type === 'math_number' && blockB && blockB.type === 'variables_get') {
                    comp.getInput('A').connection.disconnect();
                    comp.getInput('B').connection.disconnect();
                    comp.getInput('A').connection.connect(blockB.outputConnection);
                    comp.getInput('B').connection.connect(blockA.outputConnection);
                    blockA = comp.getInputTargetBlock('A');
                    blockB = comp.getInputTargetBlock('B');
                }

                // Slot A: variables_get nilai
                if (!blockA) {
                    const v = this.workspace.newBlock('variables_get');
                    v.setFieldValue(varNilaiId, 'VAR');
                    v.initSvg();
                    v.render();
                    comp.getInput('A').connection.connect(v.outputConnection);
                } else if (blockA.type === 'variables_get') {
                    blockA.setFieldValue(varNilaiId, 'VAR');
                    blockA.render();
                }

                // Slot B: math_number 75
                if (!blockB) {
                    const num = this.workspace.newBlock('math_number');
                    num.setFieldValue('75', 'NUM');
                    num.initSvg();
                    num.render();
                    comp.getInput('B').connection.connect(num.outputConnection);
                } else if (blockB.type === 'math_number') {
                    blockB.setFieldValue('75', 'NUM');
                    blockB.render();
                }
                comp.render();
            }

            // 3. Cabang DO0: Status: Lulus
            let printDo = ifelse.getInputTargetBlock('DO0');
            if (!printDo) {
                const prints = this.workspace.getAllBlocks(true).filter(b => b.type === 'text_print' && !b.getParent());
                if (prints.length > 0 && ifelse.getInput('DO0')) {
                    try {
                        ifelse.getInput('DO0').connection.connect(prints[0].previousConnection);
                        printDo = prints[0];
                    } catch(e) {}
                }
            }
            if (!printDo) {
                printDo = this.workspace.newBlock('text_print');
                printDo.initSvg();
                printDo.render();
                ifelse.getInput('DO0').connection.connect(printDo.previousConnection);
            }
            if (printDo) {
                this.setPrintTextBlockValue(printDo, 'Status: Lulus');
                printDo.render();
            }

            // 4. Cabang ELSE: Status: Tidak Lulus
            let printElse = ifelse.getInputTargetBlock('ELSE');
            if (!printElse) {
                const prints = this.workspace.getAllBlocks(true).filter(b => b.type === 'text_print' && !b.getParent());
                if (prints.length > 0 && ifelse.getInput('ELSE')) {
                    try {
                        ifelse.getInput('ELSE').connection.connect(prints[0].previousConnection);
                        printElse = prints[0];
                    } catch(e) {}
                }
            }
            if (!printElse) {
                printElse = this.workspace.newBlock('text_print');
                printElse.initSvg();
                printElse.render();
                ifelse.getInput('ELSE').connection.connect(printElse.previousConnection);
            }
            if (printElse) {
                this.setPrintTextBlockValue(printElse, 'Status: Tidak Lulus');
                printElse.render();
            }

            ifelse.render();
            this.workspace.render();

            if (typeof Blockly !== 'undefined' && Blockly.Events) {
                Blockly.Events.fire(new Blockly.Events.BlockChange(ifelse, 'field', null, '', ''));
            }
        } catch(e) {
            console.warn("Gagal melengkapi nilai dan teks Soal 5:", e);
        }
    }

    /**
     * Lengkapi isi angka dan teks cetak untuk Soal 6 (nilai >= 90 Kategori A, nilai >= 75 Kategori B, Kategori C)
     */
    fillValuesSoal6ToWorkspace() {
        if (!this.workspace) return;
        try {
            const ifBlocks = this.workspace.getAllBlocks(true).filter(b => b.type === 'controls_if');
            const ifBlock = ifBlocks[ifBlocks.length - 1];
            if (!ifBlock) return;

            // 1. Pastikan memiliki 3 cabang (1 else-if, 1 else)
            if (!ifBlock.getInput('IF1') || !ifBlock.getInput('ELSE')) {
                if (typeof ifBlock.loadExtraState === 'function') {
                    ifBlock.loadExtraState({ elseIfCount: 1, hasElse: true });
                } else if (typeof ifBlock.updateShape_ === 'function') {
                    ifBlock.elseifCount_ = 1;
                    ifBlock.elseCount_ = 1;
                    ifBlock.updateShape_();
                }
            }

            // 2. Sambungkan di bawah controls_ifelse (Soal 5) jika masih mengambang
            if (!ifBlock.getParent()) {
                const ifelses = this.workspace.getAllBlocks(true).filter(b => b.type === 'controls_ifelse');
                const ifelse = ifelses[ifelses.length - 1];
                if (ifelse && ifelse.nextConnection && !ifelse.getNextBlock()) {
                    try {
                        ifelse.nextConnection.connect(ifBlock.previousConnection);
                    } catch(e) {}
                }
            }

            const varNilaiId = this.getOrCreateVariable('nilai');

            // Helper untuk konfigurasi kondisi perbandingan
            const configureBranchCondition = (inputName, expectedNum) => {
                let comp = ifBlock.getInputTargetBlock(inputName);
                if (!comp) {
                    const comps = this.workspace.getAllBlocks(true).filter(b => b.type === 'logic_compare' && !b.getParent());
                    if (comps.length > 0 && ifBlock.getInput(inputName)) {
                        try {
                            ifBlock.getInput(inputName).connection.connect(comps[0].outputConnection);
                            comp = comps[0];
                        } catch(e) {}
                    }
                }
                if (!comp) {
                    comp = this.workspace.newBlock('logic_compare');
                    comp.initSvg();
                    comp.render();
                    ifBlock.getInput(inputName).connection.connect(comp.outputConnection);
                }
                if (comp) {
                    comp.setFieldValue('GTE', 'OP');
                    let blockA = comp.getInputTargetBlock('A');
                    let blockB = comp.getInputTargetBlock('B');

                    // Jika terbalik (angka di A, variabel di B), tukar posisinya!
                    if (blockA && blockA.type === 'math_number' && blockB && blockB.type === 'variables_get') {
                        comp.getInput('A').connection.disconnect();
                        comp.getInput('B').connection.disconnect();
                        comp.getInput('A').connection.connect(blockB.outputConnection);
                        comp.getInput('B').connection.connect(blockA.outputConnection);
                        blockA = comp.getInputTargetBlock('A');
                        blockB = comp.getInputTargetBlock('B');
                    }

                    // Slot A: variabel nilai
                    if (!blockA) {
                        const v = this.workspace.newBlock('variables_get');
                        v.setFieldValue(varNilaiId, 'VAR');
                        v.initSvg();
                        v.render();
                        comp.getInput('A').connection.connect(v.outputConnection);
                    } else if (blockA.type === 'variables_get') {
                        blockA.setFieldValue(varNilaiId, 'VAR');
                        blockA.render();
                    }

                    // Slot B: angka target
                    if (!blockB) {
                        const num = this.workspace.newBlock('math_number');
                        num.setFieldValue(String(expectedNum), 'NUM');
                        num.initSvg();
                        num.render();
                        comp.getInput('B').connection.connect(num.outputConnection);
                    } else if (blockB.type === 'math_number') {
                        blockB.setFieldValue(String(expectedNum), 'NUM');
                        blockB.render();
                    }
                    comp.render();
                }
            };

            // Helper untuk konfigurasi blok print pada cabang
            const configureBranchPrint = (statementInputName, textVal) => {
                let printB = ifBlock.getInputTargetBlock(statementInputName);
                if (!printB) {
                    const prints = this.workspace.getAllBlocks(true).filter(b => b.type === 'text_print' && !b.getParent());
                    if (prints.length > 0 && ifBlock.getInput(statementInputName)) {
                        try {
                            ifBlock.getInput(statementInputName).connection.connect(prints[0].previousConnection);
                            printB = prints[0];
                        } catch(e) {}
                    }
                }
                if (!printB) {
                    printB = this.workspace.newBlock('text_print');
                    printB.initSvg();
                    printB.render();
                    ifBlock.getInput(statementInputName).connection.connect(printB.previousConnection);
                }
                if (printB) {
                    this.setPrintTextBlockValue(printB, textVal);
                    printB.render();
                }
            };

            // Cabang 1: nilai >= 90 -> Kategori: A
            configureBranchCondition('IF0', 90);
            configureBranchPrint('DO0', 'Kategori: A');

            // Cabang 2: nilai >= 75 -> Kategori: B
            configureBranchCondition('IF1', 75);
            configureBranchPrint('DO1', 'Kategori: B');

            // Cabang 3: else -> Kategori: C
            configureBranchPrint('ELSE', 'Kategori: C');

            ifBlock.render();
            this.workspace.render();

            if (typeof Blockly !== 'undefined' && Blockly.Events) {
                Blockly.Events.fire(new Blockly.Events.BlockChange(ifBlock, 'field', null, '', ''));
            }
        } catch (e) {
            console.warn("Gagal melengkapi nilai dan teks Soal 6:", e);
        }
    }

    /**
     * Memperbarui program secara otomatis untuk Soal 4:
     * - Memasang blok 'set nama to' di bawah blok Selamat Datang
     * - Memindahkan blok 'read text' ke blok 'set nama to'
     * - Mengganti slot bekas 'read text' dengan blok variabel 'nama'
     */
    restructureNameVariableInWorkspace() {
        if (!this.workspace) return;
        try {
            this.addSetNamaToWorkspace();
            this.moveInputToSetNamaInWorkspace();
            this.insertVarNamaToMencatatInWorkspace();
        } catch (e) {
            console.warn("Gagal merestrukturisasi variabel nama otomatis:", e);
        }
    }

    /**
     * Memperbarui program secara otomatis untuk Soal 7:
     * - Memasukkan seluruh blok siswa ke dalam loop count with (3 kali)
     * - Mempertahankan blok Nilai yang dicatat dan Status Lulus
     * - Tanpa blok Siswa ke-
     */
    restructureLoopInWorkspace() {
        if (!this.workspace) return;
        try {
            // 1. Cari blok cetak selamat datang
            const printSelamatDatang = this.workspace.getAllBlocks(false).find(b => {
                if (b.type !== 'text_print') return false;
                const desc = b.getDescendants(false);
                return desc.some(d => {
                    const val = d.getFieldValue('TEXT');
                    return typeof val === 'string' && val.toLowerCase().includes('selamat datang');
                });
            });

            // 2. Cari blok statement pertama siswa (setelah selamat datang)
            let firstStudentBlock = null;
            if (printSelamatDatang && printSelamatDatang.getNextBlock()) {
                firstStudentBlock = printSelamatDatang.getNextBlock();
                if (firstStudentBlock.type === 'controls_for') {
                    // Loop sudah ada, tidak perlu restrukturisasi
                    return;
                }
                // Lepaskan sambungan dari selamat datang
                printSelamatDatang.nextConnection.disconnect();
            } else {
                firstStudentBlock = this.workspace.getAllBlocks(false).find(b => b.type === 'variables_set' && b.getField('VAR')?.getText() === 'nama');
            }

            // 3. Buat blok count with i from 1 to 3 by 1 (tanpa Siswa ke-)
            const loopJson = {
                "type": "controls_for",
                "fields": { "VAR": { "name": "i" } },
                "inputs": {
                    "FROM": { "shadow": { "type": "math_number", "fields": { "NUM": 1 } } },
                    "TO": { "shadow": { "type": "math_number", "fields": { "NUM": 3 } } },
                    "BY": { "shadow": { "type": "math_number", "fields": { "NUM": 1 } } }
                }
            };

            const createdLoop = Blockly.serialization.blocks.append(loopJson, this.workspace);
            createdLoop.initSvg();
            createdLoop.render();

            // Sambungkan loop di bawah print selamat datang
            if (printSelamatDatang && printSelamatDatang.nextConnection && createdLoop.previousConnection) {
                printSelamatDatang.nextConnection.connect(createdLoop.previousConnection);
            } else {
                createdLoop.moveTo(new Blockly.utils.Coordinate(40, 100));
            }

            // Sambungkan seluruh blok siswa langsung ke dalam slot DO loop
            if (firstStudentBlock && firstStudentBlock.previousConnection) {
                const doInput = createdLoop.getInput('DO');
                if (doInput && doInput.connection) {
                    doInput.connection.connect(firstStudentBlock.previousConnection);
                }
            }

            if (this.workspace.render) this.workspace.render();
        } catch (e) {
            console.warn("Gagal restrukturisasi loop otomatis:", e);
        }
    }

    /**
     * Memperbarui program secara otomatis untuk Soal 8:
     * - Mengganti loop for dengan loop while (lanjut == 1)
     * - Memasukkan blok siswa ke dalam loop while
     * - Menambahkan prompt konfirmasi 'Tambah data? (1=Ya, 0=Tidak): ' di akhir loop
     */
    /**
     * Pindahkan rangkaian blok siswa ke dalam slot DO perulangan repeat while (Soal 8)
     */
    moveBlocksIntoWhileInWorkspace() {
        if (!this.workspace) return;
        try {
            const whileBlocks = this.workspace.getAllBlocks(false).filter(b => b.type === 'controls_whileUntil');
            const whileBlock = whileBlocks[whileBlocks.length - 1];
            if (!whileBlock) return;

            // Lepaskan dari loop for lama jika ada
            const oldForLoop = this.workspace.getAllBlocks(false).find(b => b.type === 'controls_for');
            let firstStudentBlock = null;
            if (oldForLoop) {
                firstStudentBlock = oldForLoop.getInputTargetBlock('DO');
                if (firstStudentBlock && firstStudentBlock.previousConnection) {
                    firstStudentBlock.previousConnection.disconnect();
                }
                oldForLoop.dispose(true);
            } else {
                const varNamaId = this.getOrCreateVariable('nama');
                firstStudentBlock = this.workspace.getAllBlocks(false).find(b => b.type === 'variables_set' && b.getFieldValue('VAR') === varNamaId && b.getParent() !== whileBlock);
            }

            if (firstStudentBlock && firstStudentBlock.previousConnection) {
                const doInput = whileBlock.getInput('DO');
                if (doInput && doInput.connection) {
                    if (doInput.connection.isConnected()) {
                        doInput.connection.disconnect();
                    }
                    doInput.connection.connect(firstStudentBlock.previousConnection);
                }
            }
            if (this.workspace.render) this.workspace.render();
        } catch (e) {
            console.warn("Gagal memindahkan blok siswa ke dalam while:", e);
        }
    }

    /**
     * Tambahkan blok 'set lanjut to' ke bagian paling akhir di dalam while loop (Soal 8)
     */
    addSetLanjutEndToWorkspace() {
        if (!this.workspace) return;
        try {
            const varLanjutId = this.getOrCreateVariable('lanjut');
            const whileBlocks = this.workspace.getAllBlocks(false).filter(b => b.type === 'controls_whileUntil');
            const whileBlock = whileBlocks[whileBlocks.length - 1];
            if (!whileBlock) return;

            let firstInDo = whileBlock.getInputTargetBlock('DO');
            let lastInDo = firstInDo;
            while (lastInDo && lastInDo.getNextBlock()) {
                lastInDo = lastInDo.getNextBlock();
            }

            // Cek apakah sudah ada variables_set lanjut di akhir
            if (lastInDo && lastInDo.type === 'variables_set' && lastInDo.getFieldValue('VAR') === varLanjutId) {
                return;
            }

            const setLanjutEnd = this.workspace.newBlock('variables_set');
            setLanjutEnd.setFieldValue(varLanjutId, 'VAR');
            setLanjutEnd.initSvg();
            setLanjutEnd.render();

            if (lastInDo && lastInDo.nextConnection) {
                lastInDo.nextConnection.connect(setLanjutEnd.previousConnection);
            } else if (whileBlock.getInput('DO') && whileBlock.getInput('DO').connection && !firstInDo) {
                whileBlock.getInput('DO').connection.connect(setLanjutEnd.previousConnection);
            }
            if (this.workspace.render) this.workspace.render();
        } catch (e) {
            console.warn("Gagal memasang set lanjut di akhir while:", e);
        }
    }

    /**
     * Pasangkan blok read_number dengan teks 'Tambah data? (1=Ya, 0=Tidak): ' ke 'set lanjut to' di akhir loop (Soal 8)
     */
    attachReadNumberToSetLanjutEndInWorkspace() {
        if (!this.workspace) return;
        try {
            const varLanjutId = this.getOrCreateVariable('lanjut');
            const whileBlocks = this.workspace.getAllBlocks(false).filter(b => b.type === 'controls_whileUntil');
            const whileBlock = whileBlocks[whileBlocks.length - 1];
            if (!whileBlock) return;

            // Cari set lanjut to di dalam while
            const allBlocks = whileBlock.getDescendants(false);
            const setLanjutEnd = allBlocks.slice().reverse().find(b => b.type === 'variables_set' && b.getFieldValue('VAR') === varLanjutId);
            if (!setLanjutEnd) {
                this.addSetLanjutEndToWorkspace();
            }

            const targetSet = whileBlock.getDescendants(false).slice().reverse().find(b => b.type === 'variables_set' && b.getFieldValue('VAR') === varLanjutId);
            if (!targetSet) return;

            let readNum = targetSet.getInputTargetBlock('VALUE');
            if (!readNum) {
                // Cek apakah ada read_number yang mengambang
                const floatingReads = this.workspace.getAllBlocks(false).filter(b => b.type === 'read_number' && !b.getParent());
                if (floatingReads.length > 0) {
                    readNum = floatingReads[0];
                } else {
                    readNum = this.workspace.newBlock('read_number');
                    readNum.initSvg();
                    readNum.render();
                }
                targetSet.getInput('VALUE').connection.connect(readNum.outputConnection);
            }

            if (readNum) {
                let promptBlock = readNum.getInputTargetBlock('PROMPT');
                if (!promptBlock) {
                    promptBlock = this.workspace.newBlock('text');
                    promptBlock.initSvg();
                    promptBlock.render();
                    readNum.getInput('PROMPT').connection.connect(promptBlock.outputConnection);
                }
                if (promptBlock && promptBlock.getField('TEXT')) {
                    promptBlock.setFieldValue('Tambah data? (1=Ya, 0=Tidak): ', 'TEXT');
                    promptBlock.render();
                }
                readNum.render();
            }

            targetSet.render();
            if (this.workspace.render) this.workspace.render();
        } catch (e) {
            console.warn("Gagal memasang read int ke set lanjut:", e);
        }
    }

    /**
     * Memperbarui program secara otomatis untuk Soal 8:
     * - Mengganti loop for dengan loop while (lanjut == 1)
     * - Memasukkan blok siswa ke dalam loop while
     * - Menambahkan prompt konfirmasi 'Tambah data? (1=Ya, 0=Tidak): ' di akhir loop
     */
    restructureWhileInWorkspace() {
        this.fillValuesSoal8ToWorkspace();
    }

    /**
     * Lengkapi dan susun keseluruhan while loop dan konfirmasi tambah data untuk Soal 8
     */
    fillValuesSoal8ToWorkspace() {
        if (!this.workspace) return;
        try {
            const varLanjutId = this.getOrCreateVariable('lanjut');
            const printSelamatDatang = this.workspace.getAllBlocks(false).find(b => {
                if (b.type !== 'text_print') return false;
                const desc = b.getDescendants(false);
                return desc.some(d => {
                    const val = d.getFieldValue('TEXT');
                    return typeof val === 'string' && val.toLowerCase().includes('selamat datang');
                });
            });

            // Lepaskan blok siswa dari loop lama (controls_for) jika ada
            const oldForLoop = this.workspace.getAllBlocks(false).find(b => b.type === 'controls_for');
            let firstStudentBlock = null;
            if (oldForLoop) {
                firstStudentBlock = oldForLoop.getInputTargetBlock('DO');
                if (firstStudentBlock && firstStudentBlock.previousConnection) {
                    firstStudentBlock.previousConnection.disconnect();
                }
                oldForLoop.dispose(true);
            }

            // 1. Cari atau buat blok set lanjut to 1 di awal
            const allSets = this.workspace.getAllBlocks(false).filter(b => b.type === 'variables_set' && b.getFieldValue('VAR') === varLanjutId);
            let setLanjutStart = allSets.find(b => {
                let p = b.getParent();
                while (p) {
                    if (p.type === 'controls_whileUntil') return false;
                    p = p.getParent();
                }
                return true;
            });

            if (!setLanjutStart) {
                setLanjutStart = this.workspace.newBlock('variables_set');
                setLanjutStart.setFieldValue(varLanjutId, 'VAR');
                setLanjutStart.initSvg();
                setLanjutStart.render();
            }

            // Pastikan nilai set lanjut awal bernilai 1
            let num1 = setLanjutStart.getInputTargetBlock('VALUE');
            if (!num1) {
                num1 = this.workspace.newBlock('math_number');
                num1.initSvg();
                num1.render();
                setLanjutStart.getInput('VALUE').connection.connect(num1.outputConnection);
            }
            if (num1 && num1.getField('NUM')) {
                num1.setFieldValue('1', 'NUM');
                num1.render();
            }
            setLanjutStart.render();

            // Sambungkan set lanjut di bawah print selamat datang
            if (printSelamatDatang && printSelamatDatang.nextConnection) {
                if (printSelamatDatang.getNextBlock() !== setLanjutStart) {
                    const curNext = printSelamatDatang.getNextBlock();
                    if (curNext && curNext !== setLanjutStart) {
                        printSelamatDatang.nextConnection.disconnect();
                        if (!firstStudentBlock && curNext.type !== 'controls_whileUntil') {
                            firstStudentBlock = curNext;
                        }
                    }
                    printSelamatDatang.nextConnection.connect(setLanjutStart.previousConnection);
                }
            }

            // 2. Cari atau buat loop controls_whileUntil
            const whileBlocks = this.workspace.getAllBlocks(false).filter(b => b.type === 'controls_whileUntil');
            let whileBlock = whileBlocks[whileBlocks.length - 1];
            if (!whileBlock) {
                const whileJson = {
                    "type": "controls_whileUntil",
                    "fields": { "MODE": "WHILE" },
                    "inputs": {
                        "BOOL": {
                            "block": {
                                "type": "logic_compare",
                                "fields": { "OP": "EQ" },
                                "inputs": {
                                    "A": { "block": { "type": "variables_get", "fields": { "VAR": { "name": "lanjut" } } } },
                                    "B": { "shadow": { "type": "math_number", "fields": { "NUM": 1 } } }
                                }
                            }
                        }
                    }
                };
                whileBlock = Blockly.serialization.blocks.append(whileJson, this.workspace);
                whileBlock.initSvg();
                whileBlock.render();
            } else {
                whileBlock.setFieldValue('WHILE', 'MODE');
                // Pastikan kondisi BOOL terpasang lanjut == 1
                let boolComp = whileBlock.getInputTargetBlock('BOOL');
                if (!boolComp) {
                    boolComp = this.workspace.newBlock('logic_compare');
                    boolComp.initSvg();
                    boolComp.render();
                    whileBlock.getInput('BOOL').connection.connect(boolComp.outputConnection);
                }
                if (boolComp) {
                    boolComp.setFieldValue('EQ', 'OP');
                    let aBlock = boolComp.getInputTargetBlock('A');
                    if (!aBlock) {
                        const getVar = this.workspace.newBlock('variables_get');
                        getVar.setFieldValue(varLanjutId, 'VAR');
                        getVar.initSvg(); getVar.render();
                        boolComp.getInput('A').connection.connect(getVar.outputConnection);
                    } else if (aBlock.type === 'variables_get') {
                        aBlock.setFieldValue(varLanjutId, 'VAR');
                    }
                    let bBlock = boolComp.getInputTargetBlock('B');
                    if (!bBlock) {
                        const numB = this.workspace.newBlock('math_number');
                        numB.setFieldValue('1', 'NUM');
                        numB.initSvg(); numB.render();
                        boolComp.getInput('B').connection.connect(numB.outputConnection);
                    } else if (bBlock.getField('NUM')) {
                        bBlock.setFieldValue('1', 'NUM');
                    }
                    boolComp.render();
                }
            }

            // Sambungkan whileBlock di bawah setLanjutStart
            if (setLanjutStart && setLanjutStart.nextConnection) {
                if (setLanjutStart.getNextBlock() !== whileBlock) {
                    if (setLanjutStart.nextConnection.isConnected()) {
                        setLanjutStart.nextConnection.disconnect();
                    }
                    setLanjutStart.nextConnection.connect(whileBlock.previousConnection);
                }
            }

            // 3. Cari blok siswa pertama jika belum ditemukan
            if (!firstStudentBlock) {
                const varNamaId = this.getOrCreateVariable('nama');
                firstStudentBlock = this.workspace.getAllBlocks(false).find(b => b.type === 'variables_set' && b.getFieldValue('VAR') === varNamaId);
            }

            // Sambungkan blok-blok siswa ke dalam DO while
            if (firstStudentBlock) {
                const doInput = whileBlock.getInput('DO');
                if (doInput && doInput.connection) {
                    if (firstStudentBlock.getParent() !== whileBlock) {
                        if (firstStudentBlock.previousConnection && firstStudentBlock.previousConnection.isConnected()) {
                            firstStudentBlock.previousConnection.disconnect();
                        }
                        doInput.connection.connect(firstStudentBlock.previousConnection);
                    }
                }
            }

            // 4. Cari statement terakhir di dalam DO while
            let firstInDo = whileBlock.getInputTargetBlock('DO');
            let lastInDo = firstInDo;
            while (lastInDo && lastInDo.getNextBlock()) {
                lastInDo = lastInDo.getNextBlock();
            }

            // Cari apakah di dalam while sudah ada set lanjut to read_number
            const descendants = whileBlock.getDescendants(false);
            let setLanjutEnd = descendants.slice().reverse().find(b => b.type === 'variables_set' && b.getFieldValue('VAR') === varLanjutId);

            if (!setLanjutEnd) {
                setLanjutEnd = this.workspace.newBlock('variables_set');
                setLanjutEnd.setFieldValue(varLanjutId, 'VAR');
                setLanjutEnd.initSvg();
                setLanjutEnd.render();

                if (lastInDo && lastInDo.nextConnection) {
                    lastInDo.nextConnection.connect(setLanjutEnd.previousConnection);
                } else if (whileBlock.getInput('DO') && whileBlock.getInput('DO').connection && !firstInDo) {
                    whileBlock.getInput('DO').connection.connect(setLanjutEnd.previousConnection);
                }
            }

            if (setLanjutEnd) {
                let readNum = setLanjutEnd.getInputTargetBlock('VALUE');
                if (!readNum) {
                    readNum = this.workspace.newBlock('read_number');
                    readNum.initSvg();
                    readNum.render();
                    setLanjutEnd.getInput('VALUE').connection.connect(readNum.outputConnection);
                }
                if (readNum) {
                    let promptBlock = readNum.getInputTargetBlock('PROMPT');
                    if (!promptBlock) {
                        promptBlock = this.workspace.newBlock('text');
                        promptBlock.initSvg();
                        promptBlock.render();
                        readNum.getInput('PROMPT').connection.connect(promptBlock.outputConnection);
                    }
                    if (promptBlock && promptBlock.getField('TEXT')) {
                        promptBlock.setFieldValue('Tambah data? (1=Ya, 0=Tidak): ', 'TEXT');
                        promptBlock.render();
                    }
                    readNum.render();
                }
                setLanjutEnd.render();
            }

            whileBlock.render();
            if (this.workspace.render) this.workspace.render();

            if (typeof Blockly !== 'undefined' && Blockly.Events) {
                Blockly.Events.fire(new Blockly.Events.BlockChange(whileBlock, 'field', null, '', ''));
            }
        } catch (e) {
            console.warn("Gagal melengkapi while loop Soal 8:", e);
        }
    }

    /**
     * Bantuan Opsi 2: Masukkan kerangka blok tanpa jawaban ke workspace
     * Field yang ditentukan soal diisi nilai netral (teks kosong, angka 0, dsb)
     * dan diberi border kedip field-needs-input.
     * Penalti Level 1 lalu Level 2 = total 5 poin, bukan 8.
     */
    applyBantuanLevel2(question, isResetRestore = false) {
        const bantuan = question.bantuan || {};
        const penalty = (bantuan.level2 && bantuan.level2.penalty) || this.helpPenaltyOption2;

        // Bersihkan highlight Opsi 1 jika sebelumnya aktif
        this.clearToolboxHighlights();
        this.currentBantuanLevel1Active = false;

        // Terapkan penalti Opsi 2 (maksimal 5 poin, tidak ditumpuk menjadi 8)
        if (!isResetRestore) {
            this.markBantuanUsed(2, penalty);
            // Kembalikan workspace ke kondisi awal soal terlebih dahulu agar blok setengah jadi dari percobaan sebelumnya tidak bertabrakan dengan kerangka Opsi 2
            this.setupInitialWorkspace(question);
        }

        // Jika soal adalah memperbaiki blok yang sudah ada di workspace (markBlockIds)
        if (bantuan.level2 && Array.isArray(bantuan.level2.markBlockIds) && bantuan.level2.markBlockIds.length > 0 && this.workspace) {
            const markFields = (bantuan.level2.markFields || bantuan.level2.fieldsToFill || ['OP', 'NUM', 'TEXT']);
            bantuan.level2.markBlockIds.forEach(bid => {
                const blk = this.workspace.getBlockById(bid);
                if (blk) {
                    markFields.forEach(mf => {
                        const fname = typeof mf === 'string' ? mf : (mf.fieldName || mf.field);
                        const f = blk.getField(fname);
                        if (f && f.getSvgRoot && f.getSvgRoot()) {
                            f.getSvgRoot().classList.add('field-needs-input');
                        }
                    });
                }
            });
            this.ensureFieldChangeListener();
            this.renderBantuanLevel2Panel();
            return;
        }

        // Otomatisasi lama Soal 4 / Soal 7 / Soal 8 (Level 3 & 4 kompatibilitas)
        if (question.id === 'L2-C1-Q4' || (bantuan.level2 && bantuan.level2.autoRestructureName)) {
            this.restructureNameVariableInWorkspace();
        }
        if (question.id === 'L4-C1-Q7' || (bantuan.level2 && bantuan.level2.autoRestructureLoop)) {
            this.restructureLoopInWorkspace();
            this.renderBantuanLevel2Panel();
            return;
        }
        if (question.id === 'L4-C1-Q8' || (bantuan.level2 && bantuan.level2.autoRestructureWhile)) {
            this.restructureWhileInWorkspace();
            this.renderBantuanLevel2Panel();
            return;
        }

        const rawInsertData = bantuan.level2 && (bantuan.level2.insert || bantuan.level2.blockData);

        if (this.workspace && Blockly.serialization && Blockly.serialization.blocks && rawInsertData) {
            try {
                // Deep copy dan pastikan semua variabel yang direferensikan di insertData sudah ada di workspace
                const insertData = JSON.parse(JSON.stringify(rawInsertData));
                this.resolveInsertDataVariables(insertData);

                // Letakkan di area kosong di bawah blok-blok yang sudah ada
                const topBlocks = this.workspace.getTopBlocks(true);
                let newX = 40;
                let newY = 40;
                if (topBlocks.length > 0) {
                    let maxY = 0;
                    topBlocks.forEach(b => {
                        const xy = b.getRelativeToSurfaceXY();
                        const h = b.getHeightWidth().height;
                        if (xy.y + h > maxY) maxY = xy.y + h;
                    });
                    newY = Math.max(40, maxY + 35);
                }

                const createdBlock = Blockly.serialization.blocks.append(insertData, this.workspace);
                if (createdBlock) {
                    createdBlock.moveTo(new Blockly.utils.Coordinate(newX, newY));
                    createdBlock.initSvg();
                    createdBlock.render();
                    const allCreatedDescendants = createdBlock.getDescendants(false);

                    // Penanganan posisi spesifik per soal agar kerangka masuk ke slot yang tepat
                    if (question.id === 'L1-S3') {
                        const presetInput = this.workspace.getBlockById('l1_s3_preset_input');
                        if (presetInput) {
                            presetInput.setDeletable(true);
                            presetInput.dispose(false);
                        }
                        let mainSeq = topBlocks.find(b => b.id !== createdBlock.id && !b.disposed);
                        if (mainSeq && createdBlock.previousConnection) {
                            let curr = mainSeq;
                            while (curr.getNextBlock()) {
                                curr = curr.getNextBlock();
                            }
                            if (curr.nextConnection && !curr.nextConnection.isConnected()) {
                                curr.nextConnection.connect(createdBlock.previousConnection);
                            }
                        }
                    } else if (question.id === 'L2-S4') {
                        // createdBlock = set [nama] to read text -> print("" + nama)
                        const printPembeli = createdBlock.getNextBlock();
                        if (printPembeli && printPembeli.previousConnection) {
                            printPembeli.previousConnection.disconnect();
                        }
                        const setStok = this.workspace.getBlockById('l2_s1_set_stok');
                        const setJumlah = this.workspace.getBlockById('l2_s2_set_jumlah');
                        const numJumlah = this.workspace.getBlockById('l2_s2_num_jumlah');
                        const printTotal = this.workspace.getBlockById('l2_s2_print_total');
                        if (setStok && setJumlah && setStok.nextConnection && createdBlock.previousConnection) {
                            if (setStok.nextConnection.isConnected()) setStok.nextConnection.disconnect();
                            setStok.nextConnection.connect(createdBlock.previousConnection);
                            if (createdBlock.nextConnection && setJumlah.previousConnection) {
                                createdBlock.nextConnection.connect(setJumlah.previousConnection);
                            }
                        }
                        if (setJumlah && setJumlah.getInput('VALUE')) {
                            if (numJumlah) {
                                numJumlah.setDeletable(true);
                                numJumlah.dispose(false);
                            }
                            const readNumBlock = Blockly.serialization.blocks.append({
                                type: 'read_number',
                                inputs: { PROMPT: { shadow: { type: 'text', fields: { TEXT: 'Masukkan jumlah beli:' } } } }
                            }, this.workspace);
                            if (readNumBlock && readNumBlock.outputConnection) {
                                readNumBlock.initSvg();
                                readNumBlock.render();
                                setJumlah.getInput('VALUE').connection.connect(readNumBlock.outputConnection);
                            }
                        }
                        if (printPembeli && printTotal && printTotal.previousConnection) {
                            const beforePrintTotal = printTotal.getPreviousBlock();
                            if (beforePrintTotal && beforePrintTotal.nextConnection) {
                                beforePrintTotal.nextConnection.disconnect();
                                beforePrintTotal.nextConnection.connect(printPembeli.previousConnection);
                                if (printPembeli.nextConnection) {
                                    printPembeli.nextConnection.connect(printTotal.previousConnection);
                                }
                            }
                        }
                    } else if (question.id === 'L3-S2') {
                        const cmpBlock = this.workspace.getBlockById('l3_s1_cmp') ||
                            this.workspace.getAllBlocks(false).find(b => b.type === 'logic_compare');
                        const oldPrint = this.workspace.getBlockById('l3_s1_print_cmp') ||
                            this.workspace.getBlockById('l3_s1_print') ||
                            (cmpBlock && cmpBlock.getParent() && cmpBlock.getParent().type === 'text_print' ? cmpBlock.getParent() : null);
                        const setNilai = this.workspace.getBlockById('l3_s1_set_nilai');
                        if (cmpBlock && cmpBlock.outputConnection && createdBlock.getInput('IF0')) {
                            if (cmpBlock.outputConnection.isConnected()) cmpBlock.outputConnection.disconnect();
                            createdBlock.getInput('IF0').connection.connect(cmpBlock.outputConnection);
                        }
                        if (oldPrint) {
                            oldPrint.setDeletable(true);
                            oldPrint.dispose(false);
                        }
                        if (setNilai && setNilai.nextConnection && createdBlock.previousConnection) {
                            setNilai.nextConnection.connect(createdBlock.previousConnection);
                        }
                    } else if (question.id === 'L3-S3') {
                        const ifElseBlock = this.workspace.getBlockById('l3_s3_ifelse') ||
                            this.workspace.getAllBlocks(false).find(b => b.type === 'controls_if');
                        const elseInput = ifElseBlock && ifElseBlock.getInput('ELSE');
                        if (elseInput && elseInput.connection && !elseInput.connection.isConnected() && createdBlock.previousConnection) {
                            elseInput.connection.connect(createdBlock.previousConnection);
                        }
                    } else if (question.id === 'L3-S4') {
                        const oldIf = this.workspace.getBlockById('l3_s3_ifelse');
                        const setNilai = this.workspace.getBlockById('l3_s1_set_nilai');
                        if (oldIf) {
                            oldIf.getDescendants(false).forEach(d => d.setDeletable(true));
                            oldIf.dispose(false);
                        }
                        if (setNilai && setNilai.nextConnection && createdBlock.previousConnection) {
                            setNilai.nextConnection.connect(createdBlock.previousConnection);
                        }
                    } else if (question.id === 'L3-S5') {
                        // Pisahkan set kehadiran (createdBlock) dengan if-else status (statusIfBlock)
                        const statusIfBlock = createdBlock.getNextBlock();
                        if (statusIfBlock && statusIfBlock.previousConnection) {
                            statusIfBlock.previousConnection.disconnect();
                        }
                        let mainSeq = topBlocks.find(b => b.id !== createdBlock.id);
                        if (mainSeq) {
                            // Pasang set kehadiran tepat setelah pembacaan nilai (blok pertama)
                            const afterFirst = mainSeq.getNextBlock();
                            if (mainSeq.nextConnection && createdBlock.previousConnection) {
                                if (afterFirst && afterFirst.previousConnection) {
                                    mainSeq.nextConnection.disconnect();
                                    mainSeq.nextConnection.connect(createdBlock.previousConnection);
                                    if (createdBlock.nextConnection) {
                                        createdBlock.nextConnection.connect(afterFirst.previousConnection);
                                    }
                                } else {
                                    mainSeq.nextConnection.connect(createdBlock.previousConnection);
                                }
                            }
                            // Pasang statusIfBlock di bagian paling akhir rangkaian
                            if (statusIfBlock && statusIfBlock.previousConnection) {
                                let curr = mainSeq;
                                while (curr.getNextBlock()) {
                                    curr = curr.getNextBlock();
                                }
                                if (curr.nextConnection && !curr.nextConnection.isConnected()) {
                                    curr.nextConnection.connect(statusIfBlock.previousConnection);
                                }
                            }
                        }
                    } else if (question.id === 'L4-S2') {
                        const whileBlock = this.workspace.getBlockById('l4_s1_while') ||
                            this.workspace.getAllBlocks(false).find(b => b.type === 'controls_whileUntil');
                        const addTotal = this.workspace.getBlockById('l4_s1_add_total');
                        const readNext = this.workspace.getBlockById('l4_s1_read_next');
                        if (whileBlock && createdBlock.previousConnection) {
                            const doInput = whileBlock.getInput('DO');
                            if (addTotal && addTotal.previousConnection) {
                                if (addTotal.previousConnection.isConnected()) addTotal.previousConnection.disconnect();
                                if (readNext && readNext.previousConnection && readNext.previousConnection.isConnected()) {
                                    readNext.previousConnection.disconnect();
                                }
                                const do0 = createdBlock.getInput('DO0');
                                if (do0 && do0.connection) {
                                    do0.connection.connect(addTotal.previousConnection);
                                }
                            }
                            if (doInput && doInput.connection) {
                                doInput.connection.connect(createdBlock.previousConnection);
                            }
                            if (readNext && readNext.previousConnection && createdBlock.nextConnection) {
                                createdBlock.nextConnection.connect(readNext.previousConnection);
                            }
                        }
                    } else if (question.id === 'L4-S3') {
                        // createdBlock = set jumlah = 0 -> set jumlah = jumlah + 0 -> print("" + jumlah) -> if jumlah > 0
                        const incJumlah = createdBlock.getNextBlock();
                        const printJumlah = incJumlah && incJumlah.getNextBlock();
                        if (incJumlah && incJumlah.previousConnection) {
                            incJumlah.previousConnection.disconnect();
                        }
                        if (printJumlah && printJumlah.previousConnection) {
                            printJumlah.previousConnection.disconnect();
                        }
                        const setTotal = this.workspace.getBlockById('l4_s1_set_total');
                        const addTotal = this.workspace.getBlockById('l4_s1_add_total');
                        if (setTotal && setTotal.nextConnection && createdBlock.previousConnection) {
                            const afterSetTotal = setTotal.getNextBlock();
                            if (afterSetTotal && afterSetTotal.previousConnection) {
                                setTotal.nextConnection.disconnect();
                                setTotal.nextConnection.connect(createdBlock.previousConnection);
                                if (createdBlock.nextConnection) {
                                    createdBlock.nextConnection.connect(afterSetTotal.previousConnection);
                                }
                            } else {
                                setTotal.nextConnection.connect(createdBlock.previousConnection);
                            }
                        }
                        if (addTotal && addTotal.nextConnection && incJumlah && incJumlah.previousConnection) {
                            addTotal.nextConnection.connect(incJumlah.previousConnection);
                        }
                        let mainSeq = topBlocks.find(b => b.id !== createdBlock.id);
                        if (mainSeq && printJumlah && printJumlah.previousConnection) {
                            let curr = mainSeq;
                            while (curr.getNextBlock()) {
                                curr = curr.getNextBlock();
                            }
                            if (curr.nextConnection && !curr.nextConnection.isConnected()) {
                                curr.nextConnection.connect(printJumlah.previousConnection);
                            }
                        }
                    } else if (question.id === 'L4-S4') {
                        const firstCustomerBlock = this.workspace.getBlockById('l4_s1_set_total');
                        const forBlock = createdBlock.getNextBlock();
                        const printOmset = forBlock && forBlock.getNextBlock();
                        if (firstCustomerBlock && forBlock && forBlock.getInput('DO')) {
                            createdBlock.moveTo(new Blockly.utils.Coordinate(40, 40));
                            const printPelanggan = forBlock.getInputTargetBlock('DO');
                            const addOmsetBlock = printPelanggan && printPelanggan.getNextBlock();
                            if (addOmsetBlock && addOmsetBlock.previousConnection) {
                                addOmsetBlock.previousConnection.disconnect();
                            }
                            if (printPelanggan && printPelanggan.nextConnection && firstCustomerBlock.previousConnection) {
                                printPelanggan.nextConnection.connect(firstCustomerBlock.previousConnection);
                            }
                            if (addOmsetBlock && addOmsetBlock.previousConnection) {
                                let lastInDo = forBlock.getInputTargetBlock('DO');
                                while (lastInDo && lastInDo.getNextBlock()) {
                                    lastInDo = lastInDo.getNextBlock();
                                }
                                if (lastInDo && lastInDo.nextConnection) {
                                    lastInDo.nextConnection.connect(addOmsetBlock.previousConnection);
                                }
                            }
                        }
                        if (printOmset) {
                            printOmset.render();
                        }
                    } else if (question.id === 'L4-S5') {
                        // createdBlock = set terbesar = 0 -> set pelanggan_terbesar = 0 -> if total > terbesar -> 3x print
                        const setPelangganTerbesar = createdBlock.getNextBlock();
                        const ifRekorBlock = setPelangganTerbesar && setPelangganTerbesar.getNextBlock();
                        const firstSummaryPrint = ifRekorBlock && ifRekorBlock.getNextBlock();
                        if (ifRekorBlock && ifRekorBlock.previousConnection) {
                            ifRekorBlock.previousConnection.disconnect();
                        }
                        if (firstSummaryPrint && firstSummaryPrint.previousConnection) {
                            firstSummaryPrint.previousConnection.disconnect();
                        }
                        let mainSeq = topBlocks.find(b => b.id !== createdBlock.id);
                        if (mainSeq) {
                            // 1. Pasang set terbesar & set pelanggan_terbesar setelah set omset = 0
                            const afterOmset = mainSeq.getNextBlock();
                            if (mainSeq.nextConnection && createdBlock.previousConnection) {
                                if (afterOmset && afterOmset.previousConnection) {
                                    mainSeq.nextConnection.disconnect();
                                    mainSeq.nextConnection.connect(createdBlock.previousConnection);
                                    if (setPelangganTerbesar && setPelangganTerbesar.nextConnection) {
                                        setPelangganTerbesar.nextConnection.connect(afterOmset.previousConnection);
                                    }
                                } else {
                                    mainSeq.nextConnection.connect(createdBlock.previousConnection);
                                }
                            }
                            // 2. Pasang ifRekorBlock di akhir DO dari controls_for
                            const forBlock = this.workspace.getAllBlocks(false).find(b => b.type === 'controls_for');
                            if (forBlock && ifRekorBlock && ifRekorBlock.previousConnection) {
                                let lastInDo = forBlock.getInputTargetBlock('DO');
                                while (lastInDo && lastInDo.getNextBlock()) {
                                    lastInDo = lastInDo.getNextBlock();
                                }
                                if (lastInDo && lastInDo.nextConnection) {
                                    lastInDo.nextConnection.connect(ifRekorBlock.previousConnection);
                                }
                            }
                            // 3. Pasang 3 blok print ringkasan di paling bawah setelah cetak omset
                            if (firstSummaryPrint && firstSummaryPrint.previousConnection) {
                                let curr = mainSeq;
                                while (curr.getNextBlock()) {
                                    curr = curr.getNextBlock();
                                }
                                if (curr.nextConnection && !curr.nextConnection.isConnected()) {
                                    curr.nextConnection.connect(firstSummaryPrint.previousConnection);
                                }
                            }
                        }
                    } else if (question.id !== 'L2-S4' && topBlocks.length > 0 && createdBlock.previousConnection) {
                        // Sambungkan otomatis ke blok statement paling bawah jika tersedia
                        let mainSeq = topBlocks.find(b => b.id !== createdBlock.id);
                        if (mainSeq) {
                            let curr = mainSeq;
                            while (curr.getNextBlock()) {
                                curr = curr.getNextBlock();
                            }
                            if (curr.nextConnection && !curr.nextConnection.isConnected()) {
                                try {
                                    curr.nextConnection.connect(createdBlock.previousConnection);
                                } catch (e) {}
                            }
                        }
                    }

                    // Beri border kedip pada field yang harus diisi siswa
                    const markFields = (bantuan.level2 && (bantuan.level2.markFields || bantuan.level2.fieldsToFill)) || [];
                    allCreatedDescendants.forEach(b => {
                        markFields.forEach(mf => {
                            const fname = typeof mf === 'string' ? mf : (mf.fieldName || mf.field);
                            const f = b.getField(fname);
                            if (f && f.getSvgRoot && f.getSvgRoot()) {
                                f.getSvgRoot().classList.add('field-needs-input');
                            }
                        });
                    });
                }
            } catch (err) {
                console.error("Gagal memasukkan kerangka blok bantuan opsi 2:", err);
            }
        }

        this.ensureFieldChangeListener();
        this.renderBantuanLevel2Panel();
        if (this.workspace && typeof PythonCodeHandler !== 'undefined') {
            try {
                const code = PythonCodeHandler.generate(this.workspace);
                PythonCodeHandler.display(code);
            } catch (e) {}
        }
    }

    /**
     * Pastikan variabel di dalam state blok Bantuan Opsi 2 sudah terdaftar di workspace
     */
    resolveInsertDataVariables(blockNode) {
        if (!blockNode || typeof blockNode !== 'object' || !this.workspace) return;
        if (blockNode.fields && blockNode.fields.VAR && (blockNode.fields.VAR.id || blockNode.fields.VAR.name)) {
            const varId = blockNode.fields.VAR.id;
            const guessedName = blockNode.fields.VAR.name || (varId ? varId.replace(/^var_/, '') : 'item');
            let v = varId ? this.workspace.getVariableById(varId) : null;
            if (!v) {
                const byName = this.workspace.getVariable(guessedName);
                if (byName) {
                    blockNode.fields.VAR.id = byName.getId();
                } else {
                    try {
                        v = this.workspace.createVariable(guessedName, '', varId || undefined);
                        blockNode.fields.VAR.id = v.getId();
                    } catch (e) {}
                }
            }
        }
        if (blockNode.inputs) {
            Object.values(blockNode.inputs).forEach(inp => {
                if (inp && inp.block) this.resolveInsertDataVariables(inp.block);
                if (inp && inp.shadow) this.resolveInsertDataVariables(inp.shadow);
            });
        }
        if (blockNode.next && blockNode.next.block) {
            this.resolveInsertDataVariables(blockNode.next.block);
        }
    }

    /**
     * Pasang listener perubahan field agar highlight merah-kuning hilang setelah siswa mengedit field
     */
    ensureFieldChangeListener() {
        if (this.workspace && !this.fieldChangeListener) {
            this.fieldChangeListener = (e) => {
                if (e.type === Blockly.Events.BLOCK_CHANGE && e.element === 'field') {
                    const block = this.workspace.getBlockById(e.blockId);
                    if (block) {
                        const f = block.getField(e.name);
                        if (f && f.getSvgRoot && f.getSvgRoot()) {
                            f.getSvgRoot().classList.remove('field-needs-input');
                        }
                    }
                }
            };
            this.workspace.addChangeListener(this.fieldChangeListener);
        }
    }

    /**
     * Tampilkan panel Bantuan Opsi 2 di bawah soal
     */
    renderBantuanLevel2Panel() {
        let helpPanel = document.getElementById('helpPanel');
        const assistContent = document.getElementById('assistanceContent');
        if (assistContent) {
            if (!helpPanel) {
                helpPanel = document.createElement('div');
                helpPanel.id = 'helpPanel';
                helpPanel.className = 'assist-panel assist-panel-help';
                assistContent.appendChild(helpPanel);
            }
            const currentQ = this.allQuestions && this.allQuestions[this.currentIndex];
            const bantuanTeks = currentQ ? (currentQ.bantuan_teks || (currentQ.bantuan && currentQ.bantuan.teks) || '') : '';
            const bantuanTeksHtml = bantuanTeks
                ? `<div style="margin-top: 8px; padding: 8px 12px; background: rgba(56, 189, 248, 0.12); border-left: 3px solid #38bdf8; border-radius: 4px; color: #e0f2fe; font-size: 0.88rem; line-height: 1.45;">💡 <strong>Bantuan:</strong> ${bantuanTeks}</div>`
                : '';

            helpPanel.style.animation = 'fadeSlideIn 0.3s ease-out';
            helpPanel.innerHTML = `
                <div class="assist-panel-header" style="background: rgba(239, 68, 68, 0.15); border-left-color: #ef4444;">
                    🔴 Bantuan Opsi 2 Digunakan <span style="font-size: 0.75rem; color: #fca5a5; margin-left: auto;">Total Penalti: -${this.currentPenalty} poin</span>
                </div>
                <div class="assist-panel-body">
                    Kerangka blok telah <strong>disiapkan di area kerja kamu tanpa jawaban akhir</strong>.<br>
                    <span style="color: #fbbf24;">⚠️ Field dengan border merah-kuning berkedip harus kamu isi atau perbaiki sesuai soal!</span>
                    ${bantuanTeksHtml}
                </div>
            `;
        }
    }

    /**
     * Bantuan teks langsung (fallback)
     */
    applyBantuanDirect(question) {
        const bantuan = question.bantuan || {};
        const penalty = this.helpPenaltyOption1;
        this.markBantuanUsed(1, penalty);

        let helpPanel = document.getElementById('helpPanel');
        const assistContent = document.getElementById('assistanceContent');
        if (assistContent) {
            if (!helpPanel) {
                helpPanel = document.createElement('div');
                helpPanel.id = 'helpPanel';
                helpPanel.className = 'assist-panel assist-panel-help';
                assistContent.appendChild(helpPanel);
            }
            helpPanel.style.animation = 'fadeSlideIn 0.3s ease-out';
            helpPanel.innerHTML = `
                <div class="assist-panel-header" style="background: rgba(239, 68, 68, 0.15); border-left-color: #ef4444;">
                    🆘 Bantuan <span style="font-size: 0.75rem; color: #fca5a5; margin-left: auto;">Skor -${penalty} poin</span>
                </div>
                <div class="assist-panel-body">${bantuan.text || question.help || ''}</div>
            `;
        }
    }

    /**
     * Catat penggunaan bantuan dan ubah status tombol
     * Aturan: jika Level 1 lalu Level 2 dipakai, total penalti adalah 5 poin (bukan 8)
     */
    markBantuanUsed(optionNumber, penalty) {
        this.currentHelpUsed = true;
        this.currentBantuanOption = Math.max(this.currentBantuanOption, optionNumber);
        this.currentBantuanLevel = this.currentBantuanOption;

        // Capped pada nilai maksimal: jika Level 1 (3) lalu Level 2 (5), total penalty = 5
        const finalPenalty = Math.max(this.currentPenalty, penalty);
        this.currentPenalty = finalPenalty;

        this.results[this.currentIndex].helpUsed = true;
        this.results[this.currentIndex].bantuanOption = this.currentBantuanOption;
        this.results[this.currentIndex].bantuanLevel = this.currentBantuanOption;
        this.results[this.currentIndex].bantuanPenalty = finalPenalty;

        const btn = document.getElementById('btnHelp');
        if (btn) {
            if (this.currentBantuanOption === 2) {
                btn.disabled = true;
                btn.classList.add('assist-btn-disabled');
                btn.innerHTML = `<span>🆘</span> Bantuan <span class="assist-penalty">Opsi 2 (-${finalPenalty})</span>`;
            } else {
                // Opsi 1 aktif, tombol MASIH BISA diklik untuk upgrade ke Opsi 2!
                btn.disabled = false;
                btn.innerHTML = `<span>🆘</span> Bantuan <span class="assist-penalty">Opsi 1 Aktif (-${finalPenalty})</span>`;
            }
        }
    }

    /**
     * Bersihkan efek visual highlight pada toolbox, flyout, dan field
     */
    clearToolboxHighlights() {
        document.querySelectorAll('.bantuan-highlight-category').forEach(el => {
            el.classList.remove('bantuan-highlight-category');
        });
        if (this.workspace) {
            const flyout = this.workspace.getFlyout();
            if (flyout) {
                const flyoutWs = flyout.getWorkspace();
                if (flyoutWs) {
                    flyoutWs.getAllBlocks(false).forEach(b => {
                        const root = b.getSvgRoot();
                        if (root) root.classList.remove('hint-blink');
                    });
                }
            }
        }
        document.querySelectorAll('.field-needs-input').forEach(el => {
            el.classList.remove('field-needs-input');
        });
        this.clearConnectionHighlights();
        this.currentBantuanLevel1Active = false;
    }

    /**
     * Tampilkan guide step-by-step (gratis)
     */
    showGuide(question) {
        if (!question.guide || question.guide.length === 0) return;

        this.currentGuideShown = !this.currentGuideShown;

        const btn = document.getElementById('btnGuide');
        if (btn) {
            btn.classList.toggle('assist-btn-active', this.currentGuideShown);
        }

        let guidePanel = document.getElementById('guidePanel');

        if (!this.currentGuideShown) {
            if (guidePanel) guidePanel.remove();
            return;
        }

        const assistContent = document.getElementById('assistanceContent');
        if (!assistContent) return;

        if (!guidePanel) {
            guidePanel = document.createElement('div');
            guidePanel.id = 'guidePanel';
            guidePanel.className = 'assist-panel assist-panel-guide';
            assistContent.appendChild(guidePanel);
        }

        let stepsHtml = '';
        question.guide.forEach((step, i) => {
            stepsHtml += `
                <div class="guide-step">
                    <div class="guide-step-number">${i + 1}</div>
                    <div class="guide-step-text">${step}</div>
                </div>
            `;
        });

        guidePanel.style.animation = 'fadeSlideIn 0.3s ease-out';
        guidePanel.innerHTML = `
            <div class="assist-panel-header" style="background: rgba(99, 102, 241, 0.15); border-left-color: #6366f1;">
                📖 Panduan Step-by-Step
            </div>
            <div class="assist-panel-body">${stepsHtml}</div>
        `;
    }

    /**
     * Mulai countdown timer untuk soal saat ini
     */
    startTimer(level) {
        this.stopTimer();
        this.timeRemaining = this.timeLimits[level] || 300;

        this.updateTimerDisplay();

        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();

            if (this.timeRemaining <= 0) {
                this.onTimeout();
            }
        }, 1000);
    }

    /**
     * Stop timer
     */
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    /**
     * Update tampilan timer
     */
    updateTimerDisplay() {
        const timerEl = document.getElementById('simTimer');
        const timerFill = document.getElementById('simTimerFill');

        if (timerEl) {
            const minutes = Math.floor(this.timeRemaining / 60);
            const seconds = this.timeRemaining % 60;
            timerEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            // Animasi warning saat waktu hampir habis
            const timerContainer = document.getElementById('simTimerContainer');
            if (timerContainer) {
                timerContainer.classList.remove('warning', 'danger');
                if (this.timeRemaining <= 30) {
                    timerContainer.classList.add('danger');
                } else if (this.timeRemaining <= 60) {
                    timerContainer.classList.add('warning');
                }
            }
        }

        // Update progress bar timer
        if (timerFill) {
            const question = this.allQuestions[this.currentIndex];
            const totalTime = this.timeLimits[question?._level] || 300;
            const pct = (this.timeRemaining / totalTime) * 100;
            timerFill.style.width = `${pct}%`;

            if (this.timeRemaining <= 30) {
                timerFill.style.background = 'linear-gradient(90deg, #ef4444, #dc2626)';
            } else if (this.timeRemaining <= 60) {
                timerFill.style.background = 'linear-gradient(90deg, #f59e0b, #d97706)';
            } else {
                timerFill.style.background = 'linear-gradient(90deg, var(--accent), #06b6d4)';
            }
        }
    }

    /**
     * Handler ketika waktu habis
     */
    onTimeout() {
        this.stopTimer();

        const timeSpent = this.timeLimits[this.allQuestions[this.currentIndex]?._level] || 0;
        this.results[this.currentIndex].status = 'timeout';
        this.results[this.currentIndex].timeSpent = timeSpent;
        this.results[this.currentIndex].scorePoints = 0;
        this.results[this.currentIndex].scorePercent = 0;

        // Langsung evaluasi, tidak lanjut
        this.finishSimulation(true, 'timeout');
    }

    /**
     * Menyerah dari soal saat ini (sebelumnya Skip)
     */
    skipQuestion() {
        if (this.isFinished || this.currentIndex >= this.allQuestions.length) return;
        
        this.stopTimer();
        
        const timeSpent = Math.round((Date.now() - this.questionStartTime) / 1000);
        this.results[this.currentIndex].status = 'surrendered';
        this.results[this.currentIndex].timeSpent = timeSpent;
        this.results[this.currentIndex].scorePoints = 0;
        this.results[this.currentIndex].scorePercent = 0;
        
        // Langsung evaluasi, tidak lanjut
        this.finishSimulation(true, 'surrendered');
    }

    /**
     * Validasi jawaban siswa berbasis data (uji_kasus dan aturan_validasi)
     */
    async validateQuestionWithTestCases(question, code, cleanOutput, simulator) {
        if (!code || code.trim() === '') {
            return {
                success: false,
                message: "Area kerja masih kosong! Susun blok terlebih dahulu sebelum mengumpulkan jawaban."
            };
        }

        // 1. Cek aturan_validasi struktural dari data soal (jika ada)
        const aturan = question.aturan_validasi || {};
        if (aturan.min_jumlah_print) {
            const printMatches = code.match(/print\s*\(/g) || [];
            if (printMatches.length < aturan.min_jumlah_print) {
                return {
                    success: false,
                    message: aturan.pesan_kurang_print || `Program harus memiliki minimal ${aturan.min_jumlah_print} blok print.`
                };
            }
        }

        if (Array.isArray(aturan.wajib_kode)) {
            for (const rule of aturan.wajib_kode) {
                const pola = typeof rule === 'string' ? rule : rule.pola;
                if (pola) {
                    let matched = false;
                    if (rule && rule.isRegex) {
                        try {
                            const regex = new RegExp(pola, rule.flags || '');
                            matched = regex.test(code);
                        } catch (e) {
                            matched = code.includes(pola);
                        }
                    } else {
                        matched = code.includes(pola);
                    }
                    if (rule && rule.harus_tidak_ada ? matched : !matched) {
                        return {
                            success: false,
                            message: (rule && (rule.pesan || rule.pesan_gagal)) || "Struktur blok belum sesuai dengan instruksi soal."
                        };
                    }
                }
            }
        }

        // 2. Jalankan seluruh uji_kasus (minimal 2 uji kasus per soal) menggunakan simulator
        if (Array.isArray(question.uji_kasus) && question.uji_kasus.length > 0 && simulator && typeof simulator.runSilentTest === 'function') {
            for (let i = 0; i < question.uji_kasus.length; i++) {
                const tc = question.uji_kasus[i];
                const inputs = Array.isArray(tc.input) ? tc.input : [];
                const expected = (tc.expectedOutput || '').trim().replace(/\r\n/g, '\n');
                const alternates = Array.isArray(tc.alternateOutputs)
                    ? tc.alternateOutputs.map(s => String(s).trim().replace(/\r\n/g, '\n'))
                    : [];

                // Jika uji kasus tidak punya input khusus dan kita sudah punya cleanOutput dari eksekusi tombol Kumpulkan,
                // kita tetap jalankan runSilentTest (atau gunakan cleanOutput sebagai cadangan).
                const rawRes = await simulator.runSilentTest(code, inputs);
                const isObj = rawRes !== null && typeof rawRes === 'object';
                const actualRaw = isObj ? (rawRes.output || '') : String(rawRes ?? '');
                const hasError = isObj ? !rawRes.success : actualRaw.includes('[Test Error:');

                if (hasError) {
                    const errText = isObj
                        ? (rawRes.error || 'Runtime error')
                        : (actualRaw.match(/\[Test Error:\s*(.*?)\]/)?.[1] || 'Runtime error');
                    return {
                        success: false,
                        message: `Terjadi error saat program diuji: ${errText}`,
                        actualOutput: actualRaw.replace(/\n?\[Test Error:.*?\]/g, '').trim() || cleanOutput,
                        expectedOutput: expected
                    };
                }

                let actual = actualRaw.trim().replace(/\r\n/g, '\n');
                // Jika tidak ada input dan actual kosong padahal cleanOutput ada, gunakan cleanOutput
                if (!actual && inputs.length === 0 && cleanOutput) {
                    actual = cleanOutput;
                }

                const isMatch = (actual === expected) || alternates.includes(actual);

                if (!isMatch) {
                    const inputInfo = inputs.length > 0
                        ? `Saat diuji dengan input [${inputs.map(x => `"${x}"`).join(', ')}], output program belum sesuai.`
                        : `Output program belum persis sama dengan yang diminta soal. Periksa huruf besar/kecil, spasi, dan tanda baca.`;
                    return {
                        success: false,
                        message: inputInfo,
                        actualOutput: actual,
                        expectedOutput: expected
                    };
                }
            }

            return {
                success: true,
                message: "Semua kasus uji berhasil dilewati dengan tepat!"
            };
        }

        // 3. Fallback ke fungsi validateCode bawaan jika soal Level 3/4 belum memiliki uji_kasus
        if (typeof question.validateCode === 'function') {
            return await question.validateCode(code, cleanOutput, simulator);
        }

        // 4. Fallback perbandingan string sederhana
        const expected = (question.expectedOutput || question.hasil_diharapkan || '').trim().replace(/\r\n/g, '\n');
        if (cleanOutput === expected) {
            return { success: true };
        }
        return {
            success: false,
            message: "Output belum sesuai dengan yang diharapkan.",
            actualOutput: cleanOutput,
            expectedOutput: expected
        };
    }

    /**
     * Evaluasi jawaban siswa (dipanggil saat tombol Kumpulkan ditekan)
     */
    async evaluate(output) {
        if (this.isFinished || this.currentIndex >= this.allQuestions.length) return;

        const question = this.allQuestions[this.currentIndex];
        const cleanOutput = (output || '').trim().replace(/\r\n/g, '\n');

        let code = "";
        if (this.workspace) {
            code = (typeof PythonCodeHandler !== 'undefined' && typeof PythonCodeHandler.generate === 'function')
                ? PythonCodeHandler.generate(this.workspace)
                : Blockly.Python.workspaceToCode(this.workspace);
        }

        const validation = await this.validateQuestionWithTestCases(question, code, cleanOutput, window.PythonSimulator);

        const timeSpent = Math.round((Date.now() - this.questionStartTime) / 1000);

        if (validation.success) {
            const currentResult = this.results[this.currentIndex];
            currentResult.status = 'correct';
            currentResult.timeSpent = timeSpent;
            const qScore = this.calculateQuestionScore(currentResult);
            currentResult.scorePoints = qScore.points;
            currentResult.scorePercent = qScore.percent;

            this.stopTimer();
            this.renderProgress();

            // Update status badge
            const statusBadge = document.getElementById('taskStatus');
            if (statusBadge) {
                statusBadge.innerHTML = '<span style="background:#10b981;color:#fff;padding:3px 10px;border-radius:12px;font-size:0.8rem;">✅ Benar</span>';
            }

            this.showCorrectModal();
        } else {
            // Jawaban salah — timer tetap berjalan, siswa bisa coba lagi
            const expected = (validation.expectedOutput || question.expectedOutput || question.hasil_diharapkan || '').trim().replace(/\r\n/g, '\n');
            const actual = (validation.actualOutput !== undefined ? validation.actualOutput : cleanOutput);
            this.showWrongModal(expected, actual, validation.message);
        }
    }

    /**
     * Modal jawaban benar
     */
    showCorrectModal() {
        const modal = document.getElementById('evaluationModal');
        const title = document.getElementById('evalTitle');
        const message = document.getElementById('evalMessage');
        const btn = document.getElementById('evalBtnNext');

        if (modal && title && message && btn) {
            title.innerHTML = '✅ Jawaban Benar!';
            title.style.color = '#10b981';

            const isLast = this.currentIndex + 1 >= this.allQuestions.length;
            const currentResult = this.results[this.currentIndex];
            const currentQuestion = this.allQuestions[this.currentIndex];
            const nextQuestion = !isLast ? this.allQuestions[this.currentIndex + 1] : null;
            const isLevelComplete = nextQuestion && nextQuestion._level !== currentQuestion._level;

            const timeSpent = currentResult.timeSpent;
            const mins = Math.floor(timeSpent / 60);
            const secs = timeSpent % 60;
            const helpUsed = currentResult.helpUsed;
            const qScore = this.calculateQuestionScore(currentResult);

            let helpNote = '';
            if (helpUsed) {
                const opt = currentResult.bantuanOption || currentResult.bantuanLevel || 1;
                const penalty = currentResult.bantuanPenalty || (opt === 2 ? this.helpPenaltyOption2 : this.helpPenaltyOption1);
                helpNote = `<p style="color: #fca5a5; font-size: 0.85rem;">⚠️ Bantuan Opsi ${opt} digunakan: skor soal ini <strong>${qScore.points}/5</strong> (-${penalty} poin)</p>`;
            } else {
                helpNote = `<p style="color: #6ee7b7; font-size: 0.85rem;">⭐ Skor soal ini: <strong>${qScore.points}/5 poin</strong> (Tanpa penalti)</p>`;
            }

            let nextInfoHtml = '';
            if (isLast) {
                nextInfoHtml = '<p>Ini adalah soal terakhir. Lihat hasil evaluasi akhir!</p>';
            } else if (isLevelComplete) {
                nextInfoHtml = `<p style="color:#38bdf8;font-weight:600;">🎉 Selamat! Kamu telah menyelesaikan seluruh soal di Level ${currentQuestion._level}. Selanjutnya masuk ke <strong>Level ${nextQuestion._level} (Soal 1)</strong>.</p>`;
            } else {
                const totalInLevel = this.allQuestions.filter(q => q._level === nextQuestion._level).length;
                nextInfoHtml = `<p>Lanjut ke <strong>Level ${nextQuestion._level} — Soal ${nextQuestion.nomor || (this.currentIndex + 2)}/${totalInLevel}</strong>.</p>`;
            }

            message.innerHTML = `
                <div style="background: rgba(16, 185, 129, 0.15); border-left: 4px solid #10b981; padding: 12px; border-radius: 0 8px 8px 0; margin-bottom: 1rem; text-align: left; color: rgba(255,255,255,0.9);">
                    🎉 Kerja bagus! Jawaban kamu tepat.
                </div>
                <p style="color: rgba(255,255,255,0.7); font-size: 0.9rem;">Waktu pengerjaan: <strong>${mins}m ${secs}s</strong></p>
                ${helpNote}
                ${nextInfoHtml}
            `;
            btn.innerHTML = isLast ? '📊 Lihat Hasil Evaluasi' : (isLevelComplete ? `Lanjut ke Level ${nextQuestion._level} ➡️` : 'Lanjut ke Soal Berikutnya ➡️');
            btn.onclick = () => {
                this.closeModal('evaluationModal');
                this.currentIndex++;
                if (isLast) {
                    this.finishSimulation();
                } else {
                    this.loadQuestion();
                }
            };
            this.openModal('evaluationModal');
        }
    }

    /**
     * Modal jawaban salah — siswa bisa coba lagi selama timer belum habis
     * Otomatis membuka tips & petunjuk agar siswa terbantu
     */
    showWrongModal(expected, actual, customMessage) {
        // Otomatis buka tips & petunjuk agar langsung terlihat oleh siswa
        const currentQ = this.allQuestions[this.currentIndex];
        if (currentQ) {
            this.toggleTips(currentQ, true);
        }

        const modal = document.getElementById('evaluationModal');
        const title = document.getElementById('evalTitle');
        const message = document.getElementById('evalMessage');
        const btn = document.getElementById('evalBtnNext');

        if (modal && title && message && btn) {
            title.innerHTML = '❌ Jawaban Kurang Tepat';
            title.style.color = '#ef4444';

            let modalMessage = "";
            if (customMessage) {
                modalMessage += `<div style="background:#fee2e2; border-left: 4px solid #ef4444; padding:10px; border-radius:5px; margin:5px 0; color:#b91c1c; text-align:left;">
                    <strong>Kesalahan:</strong><br>${customMessage}
                </div><br>`;
            }

            modalMessage += `Output yang diharapkan:<br><pre style="background:#f1f5f9;padding:10px;border-radius:5px;margin:5px 0;color:#0f172a">${expected}</pre>Output kamu:<br><pre style="background:#fee2e2;padding:10px;border-radius:5px;margin:5px 0;color:#0f172a">${actual || '(kosong)'}</pre>`;

            modalMessage += `<br><div style="text-align: left; background: rgba(245, 158, 11, 0.15); padding: 10px; border-radius: 6px; border-left: 4px solid #f59e0b; margin-top: 10px; color: rgba(255,255,255,0.9);">
                <strong>💡 Tips & Petunjuk telah dibuka otomatis!</strong> Pelajari petunjuk di panel soal untuk membantumu memperbaiki jawaban sebelum timer habis.
            </div>`;

            message.innerHTML = modalMessage;
            btn.innerHTML = 'Coba Lagi';
            btn.onclick = () => {
                this.closeModal('evaluationModal');
            };
            this.openModal('evaluationModal');
        }
    }

    /**
     * Hitung skor untuk satu soal (skala 5 poin per soal sehingga 20 soal = 100 Total Poin)
     * Tips = 0 penalti, Bantuan Opsi 1 = -3 poin, Opsi 2 = -5 poin (maksimal -5 poin).
     */
    calculateQuestionScore(result) {
        const maxPoints = 5;
        if (!result || result.status !== 'correct') {
            return { points: 0, maxPoints, percent: 0 };
        }
        let penalty = 0;
        if (result.helpUsed) {
            penalty = result.bantuanPenalty !== undefined
                ? result.bantuanPenalty
                : (result.bantuanOption === 2 ? this.helpPenaltyOption2 : this.helpPenaltyOption1);
            penalty = Math.min(maxPoints, Math.max(0, penalty));
        }
        const points = Math.max(0, maxPoints - penalty);
        return {
            points,
            maxPoints,
            percent: Math.round((points / maxPoints) * 100)
        };
    }

    /**
     * Hitung skor dan statistik per level (5 soal per level × 5 poin = 25 poin per level)
     */
    calculateLevelScores() {
        const levelBreakdown = {};
        const levels = [...new Set(this.allQuestions.map(q => q._level))].sort((a, b) => a - b);
        for (const lvl of [1, 2, 3, 4]) {
            const levelResults = this.results.filter(r => r.level === lvl);
            const correct = levelResults.filter(r => r.status === 'correct').length;
            let points = 0;
            const maxPoints = levelResults.length * 5;
            levelResults.forEach(r => {
                const qs = this.calculateQuestionScore(r);
                r.scorePoints = qs.points;
                r.scorePercent = qs.percent;
                points += qs.points;
            });
            const scorePercent = maxPoints > 0 ? Math.round((points / maxPoints) * 100) : 0;
            levelBreakdown[lvl] = {
                total: levelResults.length,
                correct,
                points,
                maxPoints,
                scorePercent,
                active: levels.includes(lvl)
            };
        }
        return levelBreakdown;
    }

    /**
     * Menghitung skor total (0-100) dengan mempertimbangkan penalti bantuan Opsi 1 (-3 poin) & Opsi 2 (-5 poin)
     */
    calculateScore() {
        const totalQuestions = this.allQuestions.length;
        if (totalQuestions === 0) return 0;

        let totalPoints = 0;
        const maxTotalPoints = totalQuestions * 5;

        for (const result of this.results) {
            const qs = this.calculateQuestionScore(result);
            result.scorePoints = qs.points;
            result.scorePercent = qs.percent;
            totalPoints += qs.points;
        }

        return maxTotalPoints > 0 ? Math.round((totalPoints / maxTotalPoints) * 100) : 0;
    }

    /**
     * Simpan data hasil per soal, per level, dan total untuk laporan
     */
    saveReportData(totalScore, levelBreakdown, forced = false, reason = '') {
        const totalTimeSpent = this.results.reduce((sum, r) => sum + (r.timeSpent || 0), 0);
        const report = {
            timestamp: new Date().toISOString(),
            totalQuestions: this.allQuestions.length,
            totalCorrect: this.results.filter(r => r.status === 'correct').length,
            totalScore,
            totalPoints: this.results.reduce((sum, r) => sum + (r.scorePoints || 0), 0),
            maxTotalPoints: 100,
            totalTimeSpentSeconds: totalTimeSpent,
            forcedEnd: forced,
            endReason: reason || 'completed',
            perLevel: levelBreakdown,
            perQuestion: this.results.map((r, idx) => ({
                no: idx + 1,
                id: r.questionId,
                level: r.level,
                nomor: r.nomor,
                tipe: r.tipe,
                title: r.title,
                status: r.status,
                timeSpentSeconds: r.timeSpent,
                tipsShown: r.tipsShown,
                helpUsed: r.helpUsed,
                bantuanOption: r.bantuanOption,
                bantuanPenalty: r.bantuanPenalty,
                scorePoints: r.scorePoints,
                maxPoints: 5,
                scorePercent: r.scorePercent
            }))
        };

        this.reportData = report;
        window.lastSimulationReport = report;
        try {
            localStorage.setItem('blockly_simulation_report', JSON.stringify(report));
        } catch (e) {
            console.warn("Gagal menyimpan laporan simulasi ke localStorage:", e);
        }
        return report;
    }

    /**
     * Mengakhiri simulasi dan menampilkan hasil evaluasi akhir.
     */
    finishSimulation(forced = false, reason = '') {
        this.isFinished = true;
        this.stopTimer();
        this.clearToolboxHighlights();

        // Hitung skor total & per level
        const score = this.calculateScore();
        const levelBreakdown = this.calculateLevelScores();
        this.saveReportData(score, levelBreakdown, forced, reason);

        // Hitung statistik
        const totalCorrect = this.results.filter(r => r.status === 'correct').length;
        const totalTimeout = this.results.filter(r => r.status === 'timeout').length;
        const totalSurrendered = this.results.filter(r => r.status === 'surrendered').length;
        const totalUnanswered = this.results.filter(r => r.status === 'unanswered' || r.status === 'wrong' || r.status === 'skipped').length;
        const totalQuestions = this.allQuestions.length;
        const totalHelpUsed = this.results.filter(r => r.helpUsed).length;

        // Total waktu
        const totalTimeSpent = this.results.reduce((sum, r) => sum + r.timeSpent, 0);
        const totalMins = Math.floor(totalTimeSpent / 60);
        const totalSecs = totalTimeSpent % 60;

        // Render halaman evaluasi
        this.renderEvaluation(score, totalCorrect, totalTimeout, totalUnanswered, totalSurrendered, totalQuestions, levelBreakdown, totalMins, totalSecs, totalHelpUsed, forced, reason);
    }

    /**
     * Render halaman evaluasi akhir (full-page overlay)
     */
    renderEvaluation(score, totalCorrect, totalTimeout, totalUnanswered, totalSurrendered, totalQuestions, levelBreakdown, totalMins, totalSecs, totalHelpUsed, forced = false, reason = '') {
        // Sembunyikan container utama
        const mainContainer = document.querySelector('.container');
        const header = document.querySelector('.header');
        if (mainContainer) mainContainer.style.display = 'none';
        if (header) header.style.display = 'none';

        // Sembunyikan progress bar simulasi
        const progressBar = document.getElementById('simProgressBar');
        if (progressBar) progressBar.style.display = 'none';

        // Hitung total akumulasi penalti bantuan yang sebenarnya dari setiap soal
        const totalPenaltyAccumulated = this.results.reduce((sum, r) => {
            if (r.helpUsed) {
                const p = r.bantuanPenalty !== undefined ? r.bantuanPenalty : (r.bantuanOption === 2 ? this.helpPenaltyOption2 : this.helpPenaltyOption1);
                return sum + p;
            }
            return sum;
        }, 0);

        const totalPointsEarned = this.results.reduce((sum, r) => sum + (r.scorePoints || 0), 0);
        const maxTotalPoints = 100;

        // Buat overlay evaluasi
        const evalOverlay = document.createElement('div');
        evalOverlay.className = 'eval-overlay';
        evalOverlay.innerHTML = `
            <div class="eval-container">
                <div class="eval-header">
                    <h1 class="eval-title">📊 Hasil Evaluasi Simulasi</h1>
                    <p class="eval-subtitle">Simulasi selesai! Berikut ringkasan skor per soal, per level, dan total performamu.</p>
                </div>

                <div class="eval-score-section">
                    <div class="eval-score-circle">
                        <svg viewBox="0 0 100 100" class="score-ring">
                            <circle cx="50" cy="50" r="45" class="score-ring-bg"/>
                            <circle cx="50" cy="50" r="45" class="score-ring-fill"
                                stroke-dasharray="${2 * Math.PI * 45}"
                                stroke-dashoffset="${2 * Math.PI * 45}" />
                        </svg>
                        <div class="score-number">${score}<span class="score-percent">%</span></div>
                    </div>
                    <div class="eval-score-details">
                        <div class="score-stat correct">
                            <span class="stat-icon">✅</span>
                            <span class="stat-label">Soal Benar</span>
                            <span class="stat-value">${totalCorrect}/${totalQuestions}</span>
                        </div>
                        <div class="score-stat" style="border-color: rgba(56, 189, 248, 0.35);">
                            <span class="stat-icon">⭐</span>
                            <span class="stat-label">Total Poin</span>
                            <span class="stat-value" style="color: #38bdf8;">${totalPointsEarned}/${maxTotalPoints}</span>
                        </div>
                        <div class="score-stat wrong">
                            <span class="stat-icon">❌</span>
                            <span class="stat-label">Belum Selesai</span>
                            <span class="stat-value">${totalUnanswered + totalTimeout + totalSurrendered}</span>
                        </div>
                        <div class="score-stat time">
                            <span class="stat-icon">🕐</span>
                            <span class="stat-label">Total Waktu</span>
                            <span class="stat-value">${totalMins}m ${totalSecs}s</span>
                        </div>
                        ${totalHelpUsed > 0 ? `
                        <div class="score-stat" style="grid-column: 1 / -1; border-color: rgba(239, 68, 68, 0.3);">
                            <span class="stat-icon">🆘</span>
                            <span class="stat-label">Total Penalti Bantuan</span>
                            <span class="stat-value" style="color: #fca5a5;">-${totalPenaltyAccumulated} poin</span>
                        </div>
                        ` : ''}
                    </div>
                </div>

                <div class="eval-level-breakdown">
                    <h2>📈 Skor & Progress Per Level</h2>
                    <div class="level-bars">
                        ${[1,2,3,4].map(lvl => {
                            const data = levelBreakdown[lvl] || { total: 0, correct: 0, points: 0, maxPoints: 0, scorePercent: 0 };
                            const pct = data.scorePercent || 0;
                            return `
                                <div class="level-bar-item">
                                    <div class="level-bar-label">
                                        <span class="level-badge level-${lvl}">Level ${lvl}</span>
                                        <span>Benar: ${data.correct}/${data.total} &bull; Skor: <strong>${data.points}/${data.maxPoints}</strong> (${pct}%)</span>
                                    </div>
                                    <div class="level-bar-track">
                                        <div class="level-bar-fill level-fill-${lvl}" style="width: ${pct}%"></div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <div class="eval-message-box ${score >= 80 ? 'excellent' : score >= 50 ? 'good' : 'needs-work'}">
                    ${score >= 80 ? `
                        <h3>🏆 Luar Biasa!</h3>
                        <p>Kamu menunjukkan pemahaman yang sangat baik tentang pemrograman Python! Terus pertahankan dan kembangkan kemampuanmu.</p>
                    ` : score >= 50 ? `
                        <h3>👍 Cukup Baik!</h3>
                        <p>Kamu sudah menguasai beberapa konsep dasar. Coba pelajari kembali materi yang terkait dengan soal yang belum berhasil dijawab.</p>
                    ` : `
                        <h3>💪 Tetap Semangat!</h3>
                        <p>Jangan menyerah! Coba pelajari kembali materi dari awal, lalu ulangi simulasi ini. Latihan yang konsisten akan membuahkan hasil.</p>
                    `}
                    ${forced ? this.getAdviceHTML(reason, this.allQuestions[this.currentIndex]?._level || 1) : ''}
                </div>

                <div class="eval-detail-section">
                    <h2>📋 Laporan Detail Per Soal</h2>
                    <div class="eval-table-wrapper">
                        <table class="eval-table">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th style="white-space: nowrap;">Level & Soal</th>
                                    <th>Status</th>
                                    <th>Skor</th>
                                    <th>Waktu</th>
                                    <th>Bantuan</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.results.map((r, i) => {
                                    const statusIcon = r.status === 'correct' ? '✅ Benar' : r.status === 'timeout' ? '⏰ Waktu Habis' : r.status === 'surrendered' ? '🏳️ Menyerah' : r.status === 'skipped' ? '⏭️ Dilewati' : '🔒 Belum Dijawab';
                                    const statusClass = r.status === 'correct' ? 'status-correct' : 'status-wrong';
                                    const mins = Math.floor(r.timeSpent / 60);
                                    const secs = r.timeSpent % 60;
                                    const timeStr = r.timeSpent > 0 ? `${mins}m ${secs}s` : '-';
                                    const helpStr = r.helpUsed 
                                        ? `🆘 Opsi ${r.bantuanOption || r.bantuanLevel || 1} <span style="color:#fca5a5">(-${r.bantuanPenalty || (r.bantuanOption === 2 ? 5 : 3)})</span>` 
                                        : (r.tipsShown ? `💡 Tips (0)` : '-');
                                    const scoreStr = `${r.scorePoints !== undefined ? r.scorePoints : 0}/5`;
                                    return `
                                        <tr>
                                            <td>${i + 1}</td>
                                            <td style="white-space: nowrap;"><span class="level-badge-sm level-${r.level}" style="white-space: nowrap;">L${r.level}-S${r.nomor || (i + 1)}</span></td>
                                            <td><span class="${statusClass}">${statusIcon}</span></td>
                                            <td><strong>${scoreStr}</strong></td>
                                            <td>${timeStr}</td>
                                            <td>${helpStr}</td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="eval-actions">
                    <a href="simulasi.html" class="eval-btn eval-btn-retry">🔄 Ulangi Simulasi</a>
                    <a href="index.html" class="eval-btn eval-btn-home">🏠 Kembali ke Beranda</a>
                </div>
            </div>
        `;

        document.body.appendChild(evalOverlay);

        // Animate entrance
        requestAnimationFrame(() => {
            evalOverlay.classList.add('active');
        });

        // Animate score ring
        setTimeout(() => {
            const ring = evalOverlay.querySelector('.score-ring-fill');
            if (ring) {
                ring.style.transition = 'stroke-dashoffset 1.5s ease-out';
                ring.style.strokeDashoffset = `${2 * Math.PI * 45 * (1 - score / 100)}`;
            }
        }, 300);
    }

    openModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => modal.classList.add('active'), 10);
        }
    }

    closeModal(id) {
        const modal = document.getElementById(id);
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.style.display = 'none', 300);
        }
    }

    getAdviceHTML(reason, level) {
        let title = reason === 'timeout' ? '⏰ Waktu Habis!' : '🏳️ Kamu Menyerah';
        let adviceText = '';
        switch(level) {
            case 1: adviceText = 'Kamu diharuskan untuk mempelajari kembali materi Output dan Input (Print & Input).'; break;
            case 2: adviceText = 'Kamu diharuskan untuk mempelajari kembali materi Variabel dan Pengelolaan Data.'; break;
            case 3: adviceText = 'Kamu diharuskan untuk mempelajari kembali materi Percabangan (If/Else).'; break;
            case 4: adviceText = 'Kamu diharuskan untuk mempelajari kembali materi Perulangan (For/While Loops).'; break;
            default: adviceText = 'Pelajari kembali materi di menu Pembelajaran.';
        }
        return `
            <div style="margin-top: 1rem; padding: 1rem; background: rgba(239, 68, 68, 0.1); border-left: 4px solid #ef4444; border-radius: 8px; text-align: left;">
                <h4 style="color: #fca5a5; margin-bottom: 0.5rem; margin-top: 0; font-size: 1.1rem;">${title}</h4>
                <p style="margin: 0; color: rgba(255,255,255,0.9); font-size: 0.95rem;">Kamu terhenti di Level ${level}. ${adviceText}</p>
            </div>
        `;
    }
}

// Akan diinisialisasi oleh main.js
window.SimulationManager = SimulationManager;
