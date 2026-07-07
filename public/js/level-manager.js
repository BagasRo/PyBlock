class LevelManager {
    constructor() {
        this.problems = [];
        this.currentProblemIndex = 0;
        this.currentLevel = 1;
        this.failedAttempts = 0;
        
        // Parse difficulty from URL, default to 'sedang'
        const urlParams = new URLSearchParams(window.location.search);
        this.difficulty = urlParams.get('difficulty') || 'sedang';
        
        this.isLevelMode = true;
    }

    init(workspace, levelNum) {
        this.workspace = workspace;
        this.currentLevel = levelNum;
        this.currentProblemIndex = 0;
        this.loadLevelData();
    }

    async loadLevelData() {
        try {
            // Menggunakan modul JS dinamis alih-alih file statis JSON
            const module = await import(`/js/problems/level${this.currentLevel}.js?v=${new Date().getTime()}`);
            this.problems = module.default();
            // Hanya acak jika ada lebih dari 1 soal
            if (this.problems.length > 1) {
                this.shuffleArray(this.problems);
            }
            // Batasi hanya 1 soal per level
            this.problems = this.problems.slice(0, 1);
            this.updateLevelUI();
            this.loadProblem();
        } catch (error) {
            console.error("Gagal mengambil bank soal:", error);
            const taskText = document.getElementById('taskText');
            if (taskText) {
                taskText.innerHTML = `<span style="color:red">Gagal memuat soal Level ${this.currentLevel}. Pastikan file JSON tersedia.</span>`;
            }
        }
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    loadProblem() {
        if (this.currentProblemIndex >= this.problems.length) {
            // Semua soal sudah selesai — transisi ditangani oleh showSuccessModal
            return;
        }

        const problem = this.problems[this.currentProblemIndex];
        this.currentAnsweredCorrectly = false;
        this.failedAttempts = 0;
        
        const taskText = document.getElementById('taskText');
        if (taskText) {
            taskText.innerHTML = `<strong>Tugas ${this.currentProblemIndex + 1}/${this.problems.length}:</strong> ${problem.task}`;
        }

        // Tampilkan status badge
        const statusBadge = document.getElementById('taskStatus');
        if (statusBadge) {
            statusBadge.innerHTML = '<span style="background:#ef4444;color:#fff;padding:3px 10px;border-radius:12px;font-size:0.8rem;">⏳ Belum Dijawab</span>';
        }
        
        const hintsContainer = document.getElementById('taskHints');
        if (hintsContainer) {
            if (this.difficulty === 'mudah' && problem.hints && problem.hints.length > 0) {
                hintsContainer.style.display = 'block';
                let hintsHtml = '💡 <strong>Petunjuk:</strong><br><ul style="margin-left: 20px; padding-left: 0; margin-bottom: 0;">';
                problem.hints.forEach(hint => {
                    hintsHtml += `<li style="margin-top: 5px;">${hint}</li>`;
                });
                hintsHtml += '</ul>';
                hintsContainer.innerHTML = hintsHtml;
            } else {
                hintsContainer.innerHTML = '';
                hintsContainer.style.display = 'none';
            }
        }

        if (this.workspace) {
            this.workspace.clear();
            if (problem.initialWorkspace) {
                try {
                    Blockly.serialization.workspaces.load(problem.initialWorkspace, this.workspace);
                } catch (e) {
                    console.error("Gagal memuat blok awal:", e);
                }
            }
        }
        
        const outputContent = document.getElementById('outputContent');
        if (outputContent) {
            outputContent.innerHTML = `<div class="output-line info"><span class="timestamp">[System]</span> Siap untuk tugas baru! Susun blok dan klik Jalankan untuk menguji jawabanmu.</div>`;
        }

        // Sembunyikan tombol next inline saat soal baru dimuat
        const nextContainer = document.getElementById('nextLevelContainer');
        if (nextContainer) nextContainer.style.display = 'none';
    }

    async evaluate(output) {
        if (!this.isLevelMode || this.currentProblemIndex >= this.problems.length) return;

        const problem = this.problems[this.currentProblemIndex];
        const cleanOutput = output.trim().replace(/\r\n/g, '\n');
        
        let code = "";
        if (this.workspace) {
            code = Blockly.Python.workspaceToCode(this.workspace);
        }

        const validation = await problem.validateCode(code, cleanOutput, window.PythonSimulator);

        if (validation.success) {
            this.currentAnsweredCorrectly = true;
            // Update status badge
            const statusBadge = document.getElementById('taskStatus');
            if (statusBadge) {
                statusBadge.innerHTML = '<span style="background:#10b981;color:#fff;padding:3px 10px;border-radius:12px;font-size:0.8rem;">✅ Benar</span>';
            }
            this.showSuccessModal();
        } else {
            this.currentAnsweredCorrectly = false;
            const expected = problem.expectedOutput.trim().replace(/\r\n/g, '\n');
            this.showErrorModal(expected, cleanOutput, validation.message);
        }
    }

    showSuccessModal() {
        const modal = document.getElementById('evaluationModal');
        const title = document.getElementById('evalTitle');
        const message = document.getElementById('evalMessage');
        const btn = document.getElementById('evalBtnNext');

        const nextContainer = document.getElementById('nextLevelContainer');
        const btnNextLevel = document.getElementById('btnNextLevel');

        if (modal && title && message && btn) {
            title.innerHTML = '✅ Jawaban Benar!';
            title.style.color = '#10b981';

            const isLastProblem = (this.currentProblemIndex + 1) >= this.problems.length;

            if (isLastProblem && this.currentLevel < 4) {
                const levelTitles = {
                    1: "Level 1",
                    2: "Level 2",
                    3: "Level 3",
                    4: "Level 4"
                };
                const nextTitle = levelTitles[this.currentLevel + 1] || `Level ${this.currentLevel + 1}`;
                message.innerHTML = `Kerja bagus! Kamu telah menyelesaikan semua soal di level ini.<br><br>Selanjutnya: <strong>${nextTitle}</strong>`;
                btn.innerHTML = '🚀 Lanjut ke Level Berikutnya';
                btn.onclick = () => {
                    this.closeModal('evaluationModal');
                    window.location.href = `level${this.currentLevel + 1}.html?difficulty=${this.difficulty}`;
                };
                if (nextContainer && btnNextLevel) {
                    nextContainer.style.display = 'block';
                    btnNextLevel.innerHTML = '🚀 Lanjut ke Level Berikutnya';
                    btnNextLevel.onclick = btn.onclick;
                }
            } else if (isLastProblem && this.currentLevel >= 4) {
                message.innerHTML = 'Luar biasa! Kamu telah menyelesaikan semua soal di level terakhir!';
                btn.innerHTML = '🏆 Lihat Hasil Akhir';
                btn.onclick = () => {
                    this.closeModal('evaluationModal');
                    this.showFinalEvaluation();
                };
                if (nextContainer && btnNextLevel) {
                    nextContainer.style.display = 'block';
                    btnNextLevel.innerHTML = '🏆 Lihat Hasil Akhir';
                    btnNextLevel.onclick = btn.onclick;
                }
            } else {
                message.innerHTML = 'Kerja bagus! Kode kamu menghasilkan output yang tepat.';
                btn.innerHTML = 'Lanjut Soal Berikutnya';
                btn.onclick = () => {
                    this.closeModal('evaluationModal');
                    this.currentProblemIndex++;
                    this.loadProblem();
                };
                if (nextContainer && btnNextLevel) {
                    nextContainer.style.display = 'block';
                    btnNextLevel.innerHTML = 'Lanjut Soal Berikutnya';
                    btnNextLevel.onclick = btn.onclick;
                }
            }
            // Hapus popup modal untuk jawaban benar, hanya tampilkan tombol di bawah "Jalankan"
            // this.openModal('evaluationModal');
        }
    }

    showErrorModal(expected, actual, customMessage) {
        const modal = document.getElementById('evaluationModal');
        const title = document.getElementById('evalTitle');
        const message = document.getElementById('evalMessage');
        const btn = document.getElementById('evalBtnNext');

        if (modal && title && message && btn) {
            this.failedAttempts++;
            title.innerHTML = '❌ Jawaban Kurang Tepat';
            title.style.color = '#ef4444';
            
            let modalMessage = "";
            if (customMessage) {
                modalMessage += `<div style="background:#fee2e2; border-left: 4px solid #ef4444; padding:10px; border-radius:5px; margin:5px 0; color:#b91c1c; text-align:left;">
                    <strong>Kesalahan Logika / Kode:</strong><br>${customMessage}
                </div><br>`;
            }
            
            modalMessage += `Output yang diharapkan:<br><pre style="background:#f1f5f9;padding:10px;border-radius:5px;margin:5px 0;color:#0f172a">${expected}</pre>Output kamu:<br><pre style="background:#fee2e2;padding:10px;border-radius:5px;margin:5px 0;color:#0f172a">${actual || '(kosong)'}</pre>`;

            const problem = this.problems[this.currentProblemIndex];
            
            if (this.difficulty === 'mudah') {
                modalMessage += `<br><div style="text-align: left; background: rgba(34, 197, 94, 0.2); padding: 10px; border-radius: 6px; border-left: 4px solid #22c55e; margin-top: 15px; color: #fff;">
                    <strong>💡 Coba perhatikan lagi petunjuk-petunjuk yang ada di bawah soal.</strong>
                </div>`;
            } else if (this.difficulty === 'sulit') {
                // Mode Sulit: Tidak ada petunjuk sama sekali
                modalMessage += `<br><div style="text-align: left; background: rgba(239, 68, 68, 0.2); padding: 10px; border-radius: 6px; border-left: 4px solid #ef4444; margin-top: 15px; color: #fff;">
                    <strong>🔥 Mode Sulit:</strong> Petunjuk sistem dinonaktifkan. Silakan periksa kembali logika kamu!
                </div>`;
            } else {
                // Mode Sedang: Mulai dari hint 1, lalu naik ke hint berikutnya setiap gagal
                if (problem && problem.hints && problem.hints.length > 0) {
                    const hintIndex = Math.min(this.failedAttempts - 1, problem.hints.length - 1);
                    const currentHint = problem.hints[hintIndex];
                    
                    if (this.failedAttempts <= problem.hints.length) {
                        const hintsContainer = document.getElementById('taskHints');
                        if (hintsContainer) {
                            hintsContainer.style.display = 'block';
                            if (this.failedAttempts === 1) {
                                hintsContainer.innerHTML = '💡 <strong>Petunjuk:</strong><br><ul id="hintsList" style="margin-left: 20px; padding-left: 0; margin-bottom: 0;"></ul>';
                            }
                            const hintsList = document.getElementById('hintsList');
                            if (hintsList) {
                                hintsList.innerHTML += `<li style="margin-top: 5px;">${currentHint}</li>`;
                            }
                        }
                        
                        modalMessage += `<br><div style="text-align: left; background: rgba(255, 235, 59, 0.2); padding: 10px; border-radius: 6px; border-left: 4px solid #fbc02d; margin-top: 15px; color: #fff;">
                            <strong>💡 Petunjuk ${this.failedAttempts}:</strong> ${currentHint}
                        </div>`;
                    } else {
                        modalMessage += `<br><div style="text-align: left; background: rgba(255, 235, 59, 0.2); padding: 10px; border-radius: 6px; border-left: 4px solid #fbc02d; margin-top: 15px; color: #fff;">
                            <strong>💡 Coba perhatikan lagi semua petunjuk di bawah soal.</strong>
                        </div>`;
                    }
                }
            }

            message.innerHTML = modalMessage;
            btn.innerHTML = 'Coba Lagi';
            btn.onclick = () => {
                this.closeModal('evaluationModal');
            };
            this.openModal('evaluationModal');
        }
    }



    showFinalEvaluation() {
        const modal = document.getElementById('evaluationModal');
        const title = document.getElementById('evalTitle');
        const message = document.getElementById('evalMessage');
        const btn = document.getElementById('evalBtnNext');

        if (modal && title && message && btn) {
            title.innerHTML = '🏆 Luar Biasa!';
            title.style.color = '#f59e0b';
            message.innerHTML = 'Kamu telah menyelesaikan semua level simulasi! Kamu sekarang sudah siap untuk membuat program Python yang lebih kompleks.';
            
            btn.innerHTML = 'Kembali ke Beranda';
            btn.onclick = () => {
                window.location.href = 'index.html';
            };
            this.openModal('evaluationModal');
        }
    }

    updateLevelUI() {
        const levelTitle = document.getElementById('levelTitle');
        if (levelTitle) {
            const levelTitles = {
                1: "Level 1",
                2: "Level 2",
                3: "Level 3",
                4: "Level 4"
            };
            levelTitle.innerText = levelTitles[this.currentLevel] || `Level ${this.currentLevel}`;
        }
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
}

window.levelManager = new LevelManager();