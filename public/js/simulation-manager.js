/**
 * Simulation Manager — Mode Simulasi 10 Soal dengan Timer
 * Mengelola alur simulasi: memuat soal, timer, auto-skip, dan evaluasi akhir.
 */
class SimulationManager {
    constructor() {
        this.allQuestions = [];     // 10 soal yang sudah dipilih & diurutkan
        this.currentIndex = 0;     // Index soal saat ini (0-9)
        this.results = [];         // Hasil per soal: { level, status, timeSpent, questionId }
        this.workspace = null;
        this.timerInterval = null;
        this.timeRemaining = 0;    // Detik tersisa untuk soal saat ini
        this.questionStartTime = 0;
        this.isFinished = false;

        // Waktu per level (dalam detik)
        // Level 1: 3 menit, Level 2: 4 menit, Level 3: 5 menit, Level 4: 5 menit
        this.timeLimits = {
            1: 3 * 60,
            2: 4 * 60,
            3: 5 * 60,
            4: 5 * 60
        };
    }

    async init(workspace) {
        this.workspace = workspace;
        await this.loadAllQuestions();
        this.renderProgress();
        this.loadQuestion();
    }

    /**
     * Memuat soal dari semua level secara URUT (Soal 1-10).
     * Setiap slot soal bisa memiliki beberapa varian (A, B, dst.)
     * Sistem memilih 1 varian secara acak per slot.
     * Komposisi: 2 soal L1, 2 soal L2, 3 soal L3, 3 soal L4 = 10 soal
     */
    async loadAllQuestions() {
        const levels = [1, 2, 3, 4];

        this.allQuestions = [];

        for (const level of levels) {
            try {
                const module = await import(`/js/problems/level${level}.js?v=${Date.now()}`);
                const questionSlots = module.default(); // Array of slots, each slot = array of variants

                // Iterasi setiap slot secara URUT, pilih 1 varian acak per slot
                for (const variants of questionSlots) {
                    const selected = variants[Math.floor(Math.random() * variants.length)];
                    selected._level = level; // Tandai level asal
                    this.allQuestions.push(selected);
                }
            } catch (error) {
                console.error(`Gagal memuat soal level ${level}:`, error);
            }
        }

        // Inisialisasi array results
        this.results = this.allQuestions.map((q, i) => ({
            index: i,
            level: q._level,
            questionId: q.id,
            status: 'unanswered', // 'correct', 'wrong', 'timeout'
            timeSpent: 0,
            task: q.task
        }));
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
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
        const level = question._level;

        // Update toolbox sesuai level soal
        this.updateToolbox(level);

        // Update UI
        this.renderProgress();
        this.renderQuestion(question, level);

        // Bersihkan workspace
        if (this.workspace) {
            this.workspace.clear();
            if (question.initialWorkspace) {
                try {
                    Blockly.serialization.workspaces.load(question.initialWorkspace, this.workspace);
                } catch (e) {
                    console.error("Gagal memuat blok awal:", e);
                }
            }
        }

        // Bersihkan output
        const outputContent = document.getElementById('outputContent');
        if (outputContent) {
            outputContent.innerHTML = `<div class="output-line info"><span class="timestamp">[System]</span> Soal ${this.currentIndex + 1}/10 dimuat. Susun blok dan klik Kumpulkan untuk menjawab.</div>`;
        }

        // Mulai timer
        this.startTimer(level);
        this.questionStartTime = Date.now();

        // Sembunyikan tombol next
        const nextContainer = document.getElementById('nextLevelContainer');
        if (nextContainer) nextContainer.style.display = 'none';
    }

    /**
     * Update toolbox Blockly berdasarkan level soal
     */
    updateToolbox(level) {
        if (!this.workspace) return;
        try {
            const toolbox = BlocklyConfig.getToolboxForLevel(level);
            this.workspace.updateToolbox(toolbox);
        } catch (e) {
            console.error("Gagal update toolbox:", e);
        }
    }

    /**
     * Render progress bar dan info soal
     */
    renderProgress() {
        const progressBar = document.getElementById('simProgressBar');
        const progressText = document.getElementById('simProgressText');
        const progressFill = document.getElementById('simProgressFill');

        if (progressText) {
            progressText.textContent = `Soal ${this.currentIndex + 1} dari ${this.allQuestions.length}`;
        }
        if (progressFill) {
            const pct = ((this.currentIndex) / this.allQuestions.length) * 100;
            progressFill.style.width = `${pct}%`;
        }

        // Render dots
        const dotsContainer = document.getElementById('simProgressDots');
        if (dotsContainer) {
            dotsContainer.innerHTML = '';
            for (let i = 0; i < this.allQuestions.length; i++) {
                const dot = document.createElement('div');
                dot.className = 'progress-dot';
                if (i < this.currentIndex) {
                    const status = this.results[i]?.status;
                    if (status === 'correct') dot.classList.add('correct');
                    else if (status === 'timeout') dot.classList.add('timeout');
                    else dot.classList.add('wrong');
                } else if (i === this.currentIndex) {
                    dot.classList.add('active');
                }
                dot.title = `Soal ${i + 1} (Level ${this.allQuestions[i]?._level || '?'})`;
                dotsContainer.appendChild(dot);
            }
        }
    }

    /**
     * Render teks soal & info level
     */
    renderQuestion(question, level) {
        const levelTitle = document.getElementById('levelTitle');
        if (levelTitle) {
            levelTitle.innerHTML = `<span class="sim-level-badge level-${level}">Level ${level}</span> Soal ${this.currentIndex + 1}/10`;
        }

        const taskText = document.getElementById('taskText');
        if (taskText) {
            taskText.innerHTML = `<strong>Soal ${this.currentIndex + 1}:</strong> ${question.task}`;
        }

        // Status badge
        const statusBadge = document.getElementById('taskStatus');
        if (statusBadge) {
            statusBadge.innerHTML = '<span style="background:#ef4444;color:#fff;padding:3px 10px;border-radius:12px;font-size:0.8rem;">⏳ Belum Dijawab</span>';
        }

        // Tampilkan petunjuk
        const hintsContainer = document.getElementById('taskHints');
        if (hintsContainer) {
            if (question.hints && question.hints.length > 0) {
                hintsContainer.style.display = 'block';
                let hintsHtml = '💡 <strong>Petunjuk:</strong><br><ul style="margin-left: 20px; padding-left: 0; margin-bottom: 0;">';
                question.hints.forEach(hint => {
                    hintsHtml += `<li style="margin-top: 5px;">${hint}</li>`;
                });
                hintsHtml += '</ul>';
                hintsContainer.innerHTML = hintsHtml;
            } else {
                hintsContainer.innerHTML = '';
                hintsContainer.style.display = 'none';
            }
        }
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

        // Tampilkan notifikasi timeout
        this.showTimeoutNotification();
    }

    /**
     * Tampilkan notifikasi waktu habis lalu pindah soal
     */
    showTimeoutNotification() {
        const modal = document.getElementById('evaluationModal');
        const title = document.getElementById('evalTitle');
        const message = document.getElementById('evalMessage');
        const btn = document.getElementById('evalBtnNext');

        if (modal && title && message && btn) {
            title.innerHTML = '⏰ Waktu Habis!';
            title.style.color = '#f59e0b';

            const isLast = this.currentIndex + 1 >= this.allQuestions.length;
            message.innerHTML = `
                <div style="background: rgba(245, 158, 11, 0.15); border-left: 4px solid #f59e0b; padding: 12px; border-radius: 0 8px 8px 0; margin-bottom: 1rem; text-align: left; color: rgba(255,255,255,0.9);">
                    Waktu untuk soal ini telah habis. Soal ini dicatat sebagai <strong>tidak terjawab</strong>.
                </div>
                ${isLast ? '<p>Ini adalah soal terakhir. Lihat hasil evaluasi akhir.</p>' : `<p>Lanjut ke soal berikutnya (Soal ${this.currentIndex + 2}/10).</p>`}
            `;
            btn.innerHTML = isLast ? '📊 Lihat Hasil Evaluasi' : 'Lanjut ke Soal Berikutnya ➡️';
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
     * Lewati soal saat ini (Skip)
     */
    skipQuestion() {
        if (this.isFinished || this.currentIndex >= this.allQuestions.length) return;
        
        this.stopTimer();
        
        const timeSpent = Math.round((Date.now() - this.questionStartTime) / 1000);
        this.results[this.currentIndex].status = 'skipped';
        this.results[this.currentIndex].timeSpent = timeSpent;
        
        // Show skip notification
        this.showSkipNotification();
    }

    showSkipNotification() {
        const modal = document.getElementById('evaluationModal');
        const title = document.getElementById('evalTitle');
        const message = document.getElementById('evalMessage');
        const btn = document.getElementById('evalBtnNext');

        if (modal && title && message && btn) {
            title.innerHTML = '⏭️ Soal Dilewati';
            title.style.color = '#f59e0b';

            const isLast = this.currentIndex + 1 >= this.allQuestions.length;
            message.innerHTML = `
                <div style="background: rgba(245, 158, 11, 0.15); border-left: 4px solid #f59e0b; padding: 12px; border-radius: 0 8px 8px 0; margin-bottom: 1rem; text-align: left; color: rgba(255,255,255,0.9);">
                    Kamu telah melewati soal ini. Soal dicatat sebagai <strong>tidak terjawab (skipped)</strong>.
                </div>
                ${isLast ? '<p>Ini adalah soal terakhir. Lihat hasil evaluasi akhir.</p>' : `<p>Lanjut ke soal berikutnya (Soal ${this.currentIndex + 2}/10).</p>`}
            `;
            btn.innerHTML = isLast ? '📊 Lihat Hasil Evaluasi' : 'Lanjut ke Soal Berikutnya ➡️';
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
     * Evaluasi jawaban siswa (dipanggil saat tombol Kumpulkan ditekan)
     */
    async evaluate(output) {
        if (this.isFinished || this.currentIndex >= this.allQuestions.length) return;

        const question = this.allQuestions[this.currentIndex];
        const cleanOutput = output.trim().replace(/\r\n/g, '\n');

        let code = "";
        if (this.workspace) {
            code = Blockly.Python.workspaceToCode(this.workspace);
        }

        const validation = await question.validateCode(code, cleanOutput, window.PythonSimulator);

        const timeSpent = Math.round((Date.now() - this.questionStartTime) / 1000);

        if (validation.success) {
            this.results[this.currentIndex].status = 'correct';
            this.results[this.currentIndex].timeSpent = timeSpent;
            this.stopTimer();

            // Update status badge
            const statusBadge = document.getElementById('taskStatus');
            if (statusBadge) {
                statusBadge.innerHTML = '<span style="background:#10b981;color:#fff;padding:3px 10px;border-radius:12px;font-size:0.8rem;">✅ Benar</span>';
            }

            this.showCorrectModal();
        } else {
            // Jawaban salah — timer tetap berjalan, siswa bisa coba lagi
            const expected = question.expectedOutput.trim().replace(/\r\n/g, '\n');
            this.showWrongModal(expected, cleanOutput, validation.message);
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
            const timeSpent = this.results[this.currentIndex].timeSpent;
            const mins = Math.floor(timeSpent / 60);
            const secs = timeSpent % 60;

            message.innerHTML = `
                <div style="background: rgba(16, 185, 129, 0.15); border-left: 4px solid #10b981; padding: 12px; border-radius: 0 8px 8px 0; margin-bottom: 1rem; text-align: left; color: rgba(255,255,255,0.9);">
                    🎉 Kerja bagus! Jawaban kamu tepat.
                </div>
                <p style="color: rgba(255,255,255,0.7); font-size: 0.9rem;">Waktu pengerjaan: <strong>${mins}m ${secs}s</strong></p>
                ${isLast ? '<p>Ini adalah soal terakhir. Lihat hasil evaluasi akhir!</p>' : `<p>Lanjut ke soal berikutnya (Soal ${this.currentIndex + 2}/10).</p>`}
            `;
            btn.innerHTML = isLast ? '📊 Lihat Hasil Evaluasi' : 'Lanjut ke Soal Berikutnya ➡️';
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
     */
    showWrongModal(expected, actual, customMessage) {
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
                <strong>⏳ Masih ada waktu!</strong> Perbaiki jawabanmu dan coba kumpulkan lagi sebelum timer habis.
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
     * Selesai simulasi — tampilkan hasil evaluasi akhir
     */
    finishSimulation() {
        this.stopTimer();
        this.isFinished = true;

        // Hitung statistik
        const totalCorrect = this.results.filter(r => r.status === 'correct').length;
        const totalTimeout = this.results.filter(r => r.status === 'timeout').length;
        const totalUnanswered = this.results.filter(r => r.status === 'unanswered' || r.status === 'wrong' || r.status === 'skipped').length;
        const totalQuestions = this.allQuestions.length;
        const score = Math.round((totalCorrect / totalQuestions) * 100);

        // Breakdown per level
        const levelBreakdown = {};
        for (let lvl = 1; lvl <= 4; lvl++) {
            const levelResults = this.results.filter(r => r.level === lvl);
            const correct = levelResults.filter(r => r.status === 'correct').length;
            levelBreakdown[lvl] = { total: levelResults.length, correct };
        }

        // Total waktu
        const totalTimeSpent = this.results.reduce((sum, r) => sum + r.timeSpent, 0);
        const totalMins = Math.floor(totalTimeSpent / 60);
        const totalSecs = totalTimeSpent % 60;

        // Render halaman evaluasi
        this.renderEvaluation(score, totalCorrect, totalTimeout, totalUnanswered, totalQuestions, levelBreakdown, totalMins, totalSecs);
    }

    /**
     * Render halaman evaluasi akhir (full-page overlay)
     */
    renderEvaluation(score, totalCorrect, totalTimeout, totalUnanswered, totalQuestions, levelBreakdown, totalMins, totalSecs) {
        // Sembunyikan container utama
        const mainContainer = document.querySelector('.container');
        const header = document.querySelector('.header');
        if (mainContainer) mainContainer.style.display = 'none';
        if (header) header.style.display = 'none';

        // Sembunyikan progress bar simulasi
        const progressBar = document.getElementById('simProgressBar');
        if (progressBar) progressBar.style.display = 'none';

        // Buat overlay evaluasi
        const evalOverlay = document.createElement('div');
        evalOverlay.className = 'eval-overlay';
        evalOverlay.innerHTML = `
            <div class="eval-container">
                <div class="eval-header">
                    <h1 class="eval-title">📊 Hasil Evaluasi Simulasi</h1>
                    <p class="eval-subtitle">Simulasi selesai! Berikut ringkasan performamu.</p>
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
                            <span class="stat-label">Benar</span>
                            <span class="stat-value">${totalCorrect}</span>
                        </div>
                        <div class="score-stat timeout">
                            <span class="stat-icon">⏰</span>
                            <span class="stat-label">Waktu Habis</span>
                            <span class="stat-value">${totalTimeout}</span>
                        </div>
                        <div class="score-stat wrong">
                            <span class="stat-icon">❌</span>
                            <span class="stat-label">Belum Benar</span>
                            <span class="stat-value">${totalUnanswered}</span>
                        </div>
                        <div class="score-stat time">
                            <span class="stat-icon">🕐</span>
                            <span class="stat-label">Total Waktu</span>
                            <span class="stat-value">${totalMins}m ${totalSecs}s</span>
                        </div>
                    </div>
                </div>

                <div class="eval-level-breakdown">
                    <h2>📈 Breakdown Per Level</h2>
                    <div class="level-bars">
                        ${[1,2,3,4].map(lvl => {
                            const data = levelBreakdown[lvl];
                            const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
                            return `
                                <div class="level-bar-item">
                                    <div class="level-bar-label">
                                        <span class="level-badge level-${lvl}">Level ${lvl}</span>
                                        <span>${data.correct}/${data.total}</span>
                                    </div>
                                    <div class="level-bar-track">
                                        <div class="level-bar-fill level-fill-${lvl}" style="width: ${pct}%"></div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <div class="eval-detail-section">
                    <h2>📋 Detail Per Soal</h2>
                    <div class="eval-table-wrapper">
                        <table class="eval-table">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Level</th>
                                    <th>Status</th>
                                    <th>Waktu</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.results.map((r, i) => {
                                    const statusIcon = r.status === 'correct' ? '✅ Benar' : r.status === 'timeout' ? '⏰ Waktu Habis' : r.status === 'skipped' ? '⏭️ Dilewati' : '❌ Belum Benar';
                                    const statusClass = r.status === 'correct' ? 'status-correct' : r.status === 'timeout' ? 'status-timeout' : 'status-wrong';
                                    const mins = Math.floor(r.timeSpent / 60);
                                    const secs = r.timeSpent % 60;
                                    const timeStr = r.timeSpent > 0 ? `${mins}m ${secs}s` : '-';
                                    return `
                                        <tr>
                                            <td>${i + 1}</td>
                                            <td><span class="level-badge-sm level-${r.level}">L${r.level}</span></td>
                                            <td><span class="${statusClass}">${statusIcon}</span></td>
                                            <td>${timeStr}</td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
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
                </div>

                <div class="eval-actions">
                    <a href="simulator.html" class="eval-btn eval-btn-retry">🔄 Ulangi Simulasi</a>
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
}

// Akan diinisialisasi oleh main.js
window.SimulationManager = SimulationManager;
