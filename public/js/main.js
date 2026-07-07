/**
 * Main Application Logic - Python Blockly Simulator
 * Menggunakan Blockly dari NPM (node_modules)
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Python Blockly Simulator (NPM Version)...');
    
    // Initialize particles background
    createParticles();
    
    // Show loading
    showLoading(true);
    
    // Initialize Blockly workspace
    let workspace;
    try {
        // Cek dependensi penting sebelum init
        if (typeof Blockly === 'undefined') throw new Error('Library Blockly tidak ditemukan. Cek koneksi internet atau node_modules.');
        if (!Blockly.serialization) console.warn('⚠️ Blockly.serialization tidak ditemukan (versi lama?). Fitur save/load mungkin terbatas.');
        if (!Blockly.Msg['CONTROLS_IF_MSG_IF']) console.warn('⚠️ File bahasa Blockly tidak dimuat dengan benar. Teks blok mungkin error.');

        const levelNum = window.CURRENT_LEVEL || 1;
        workspace = BlocklyConfig.init(levelNum);
        console.log('✅ Blockly initialized successfully from node_modules');
        showLoading(false);

        if (window.SANDBOX_MODE) {
            // Mode Sandbox: tidak ada LevelManager / soal
            console.log('🧪 Sandbox mode — LevelManager dinonaktifkan');
            const btnSubmit = document.getElementById('btnSubmit');
            if (btnSubmit) btnSubmit.style.display = 'none';
        } else if (window.levelManager) {
            window.levelManager.init(workspace, levelNum);
        }

        // Load Pyodide (Pre-load agar siap saat tombol Run ditekan)
        PythonSimulator.loadPyodide();
        
        // Handle window resize agar toolbox tidak error tampilannya
        window.addEventListener('resize', function() {
            Blockly.svgResize(workspace);
        }, false);
    } catch (error) {
        console.error('❌ Error initializing Blockly:', error);
        showLoading(false);
        showError('Gagal menginisialisasi Blockly. Pastikan server berjalan dan library terinstall.');
        return; // Hentikan eksekusi jika inisialisasi gagal
    }

    // Helper: Dapatkan elemen bersih (hapus event listener lama dengan cloning)
    // Ini memperbaiki masalah tombol tertekan 2x jika script dimuat ulang
    const getCleanElement = (id) => {
        const el = document.getElementById(id);
        if (!el) return null;
        const newEl = el.cloneNode(true);
        el.parentNode.replaceChild(newEl, el);
        return newEl;
    };

    // DOM Elements
    const elements = {
        btnClear: getCleanElement('btnClear'),
        btnRun: getCleanElement('btnRun'),
        btnSubmit: getCleanElement('btnSubmit'),
        btnClearOutput: getCleanElement('btnClearOutput'),
        btnExport: getCleanElement('btnExport'),
        btnSave: getCleanElement('btnSave'),
        btnLoadTrigger: getCleanElement('btnLoadTrigger'),
        btnLoad: getCleanElement('btnLoad'),
        btnZoomIn: getCleanElement('btnZoomIn'),
        btnZoomOut: getCleanElement('btnZoomOut'),
        btnZoomReset: getCleanElement('btnZoomReset'),
        exportModal: document.getElementById('exportModal'),
        closeExportModal: getCleanElement('closeExportModal'),
        exportCode: document.getElementById('exportCode'),
        btnCopyCode: getCleanElement('btnCopyCode'),
        btnDownloadCode: getCleanElement('btnDownloadCode'),
        codeStatus: document.getElementById('codeStatus')
    };

    // Event Listeners
    elements.btnClear?.addEventListener('click', () => clearWorkspace(workspace));
    elements.btnRun?.addEventListener('click', () => runCode(workspace));
    elements.btnSubmit?.addEventListener('click', () => submitCode(workspace));
    elements.btnClearOutput?.addEventListener('click', () => PythonSimulator.clear());
    elements.btnExport?.addEventListener('click', () => openExportModal(workspace));
    elements.btnSave?.addEventListener('click', () => saveWorkspace(workspace));
    elements.btnLoadTrigger?.addEventListener('click', () => elements.btnLoad?.click());
    elements.btnLoad?.addEventListener('change', (e) => loadWorkspace(workspace, e));
    
    // Workspace zoom controls
    // Parameter ketiga pada workspace.zoom() adalah 'amount'. Nilai positif untuk zoom in, negatif untuk zoom out.
    elements.btnZoomIn?.addEventListener('click', () => workspace.zoom(workspace.getMetrics().viewWidth / 2, workspace.getMetrics().viewHeight / 2, 1));
    elements.btnZoomOut?.addEventListener('click', () => workspace.zoom(workspace.getMetrics().viewWidth / 2, workspace.getMetrics().viewHeight / 2, -1));
    elements.btnZoomReset?.addEventListener('click', () => {
        workspace.setScale(1); // Reset scale ke 1
        workspace.scrollCenter(); // Pusatkan tampilan workspace untuk mencegah pergeseran
    });
    
    elements.closeExportModal?.addEventListener('click', closeExportModalFunc);
    
    // Modal close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === elements.exportModal) closeExportModalFunc();
    });

    // Export actions
    elements.btnCopyCode?.addEventListener('click', copyCodeToClipboard);
    elements.btnDownloadCode?.addEventListener('click', downloadPythonFile);

    // Auto-generate code on block change
    workspace.addChangeListener(function(event) {
        if (event.type !== Blockly.Events.UI) {
            const code = generateCode(workspace);
            updateCodeStatus(code);
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter to run
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            runCode(workspace);
        }
    });

    // Initial code generation
    generateCode(workspace);
    
    console.log('🎉 Python Blockly Simulator ready!');
    PythonSimulator.addOutput('🚀 Selamat datang! Blockly v10+ siap digunakan.', 'success');

    // ========== FUNCTIONS ==========

    function createParticles() {
        const container = document.getElementById('particles');
        if (!container) return;
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 20 + 's';
            particle.style.animationDuration = (Math.random() * 20 + 10) + 's';
            container.appendChild(particle);
        }
    }

    function showLoading(show) {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.toggle('active', show);
        }
    }

    function generateCode(workspace) {
        const code = PythonCodeHandler.generate(workspace);
        PythonCodeHandler.display(code);
        return code;
    }

    function updateCodeStatus(code) {
        const status = document.getElementById('codeStatus');
        if (!status) return;
        
        if (!code.trim() || code === '# Kode Python akan muncul di sini...') {
            status.textContent = 'Empty';
            status.style.background = 'rgba(255, 65, 108, 0.2)';
            status.style.color = '#ff416c';
        } else {
            const lines = code.split('\n').length;
            status.textContent = `${lines} lines`;
            status.style.background = 'rgba(0, 212, 255, 0.2)';
            status.style.color = '#00d4ff';
        }
    }

    function runCode(workspace) {
        const code = generateCode(workspace);
        if (!code.trim() || code.includes('Kode Python akan muncul')) {
            PythonSimulator.addOutput('⚠️ Tidak ada kode untuk dijalankan!', 'warning');
            return;
        }
        PythonSimulator.run(code, false); // Run without evaluation
    }

    function submitCode(workspace) {
        const code = generateCode(workspace);
        if (!code.trim() || code.includes('Kode Python akan muncul')) {
            PythonSimulator.addOutput('⚠️ Tidak ada kode untuk dikumpulkan!', 'warning');
            return;
        }
        PythonSimulator.run(code, true); // Run WITH evaluation
    }

    function clearWorkspace(workspace) {
        if (confirm('Yakin ingin menghapus semua block?')) {
            workspace.clear();
            PythonCodeHandler.display('');
            PythonSimulator.clear();
            PythonSimulator.addOutput('Workspace dibersihkan', 'info');
            updateCodeStatus('');
        }
    }

    function saveWorkspace(workspace) {
        try {
            const jsonState = Blockly.serialization.workspaces.save(workspace);
            const jsonString = JSON.stringify(jsonState, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'proyek-blockly.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(a.href);

            PythonSimulator.addOutput('💾 Proyek berhasil disimpan sebagai proyek-blockly.json!', 'success');
        } catch (e) {
            console.error("Gagal menyimpan workspace:", e);
            PythonSimulator.addOutput('❌ Gagal menyimpan proyek.', 'error');
        }
    }

    function loadWorkspace(workspace, event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const jsonState = JSON.parse(e.target.result);
                
                // Bersihkan workspace sebelum memuat project baru untuk mencegah konflik
                workspace.clear();
                
                Blockly.serialization.workspaces.load(jsonState, workspace);
                PythonSimulator.addOutput(`📂 Proyek "${file.name}" berhasil dimuat.`, 'success');
                
                // Gunakan setTimeout agar generateCode berjalan setelah blok selesai dirender
                setTimeout(() => {
                    const code = generateCode(workspace);
                    updateCodeStatus(code);
                }, 10);
            } catch (e) {
                PythonSimulator.addOutput(`❌ Gagal memuat file. Pastikan file tersebut adalah file proyek Blockly (.json) yang valid.`, 'error');
            }
        };
        reader.readAsText(file);
        event.target.value = ''; // Reset input agar bisa memuat file yang sama lagi
    }

    function openExportModal(workspace) {
        const code = PythonCodeHandler.generate(workspace);
        if (elements.exportCode) {
            elements.exportCode.value = code;
        }
        elements.exportModal?.classList.add('active');
    }

    function closeExportModalFunc() {
        elements.exportModal?.classList.remove('active');
    }

    function copyCodeToClipboard() {
        const code = document.getElementById('exportCode')?.value;
        if (code) {
            navigator.clipboard.writeText(code).then(() => {
                PythonSimulator.addOutput('📋 Kode dicopy ke clipboard!', 'success');
                closeExportModalFunc();
            }).catch(() => {
                PythonSimulator.addOutput('❌ Gagal copy kode', 'error');
            });
        }
    }

    function downloadPythonFile() {
        const code = document.getElementById('exportCode')?.value;
        if (!code) return;
        
        const blob = new Blob([code], { type: 'text/x-python' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'project.py';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        PythonSimulator.addOutput('💾 File project.py didownload!', 'success');
        closeExportModalFunc();
    }

    function showError(message) {
        const outputContent = document.getElementById('outputContent');
        if (outputContent) {
            outputContent.innerHTML = `<div class="output-line error">${message}</div>`;
        }
    }
});