/**
 * Python Code Simulator
 * Client-side execution simulation for educational purposes
 */

const PythonSimulator = {
    variables: {},
    output: [],
    pyodide: null,
    isRunning: false,
    executionSpeed: 20, // ms between lines (Dipercepat)

    /**
     * Reset simulator state
     */
    reset: function() {
        this.variables = {};
        this.output = [];
        // Jangan reset pyodide instance, cukup state eksekusi
        this.isRunning = false;
        console.log('🔄 Simulator reset');
    },

    /**
     * Main execution function
     */
     run: async function(code) {
        if (this.isRunning) {
            this.stop();
            // Beri jeda singkat untuk memastikan proses stop selesai sebelum memulai lagi
            await new Promise(resolve => setTimeout(resolve, 50));
        }
        this.reset();
        this.isRunning = true;

        const outputContent = document.getElementById('outputContent');
        if (!outputContent) {
            console.error('Output container not found');
            return;
        }

        outputContent.innerHTML = '';
        this.addOutput('🚀 Memulai simulasi dengan Pyodide (Lokal)...', 'info');

        try {
            if (!this.pyodide) {
                await this.loadPyodide();
            }

            // Clear previous output buffer in Python
            this.pyodide.globals.set("output_buffer", "");

            // Redirect stdout/stderr to capture output
            this.pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
`);

            // Execute user code
            await this.pyodide.runPythonAsync(code);

            // Retrieve output
            const stdout = this.pyodide.runPython("sys.stdout.getvalue()");
            let stderr = this.pyodide.runPython("sys.stderr.getvalue()");

            if (stdout) {
                // Split stdout into individual lines to respect newlines from Python's print().
                const outputLines = stdout.split('\n');
                // The last element is often an empty string if the output ends with a newline, so pop it.
                if (outputLines.length > 1 && outputLines[outputLines.length - 1] === '') {
                    outputLines.pop();
                }
                outputLines.forEach(lineText => this.addOutput(lineText, 'stdout'));
            }
            if (stderr) this.addOutput(stderr, 'error');

        } catch (error) {
            this.addOutput(`❌ Error Pyodide: ${error.message}`, 'error');
            console.error("Pyodide Error:", error);
        } finally {
            this.finish();
        }
    },

    loadPyodide: async function() {
        // Fungsi ini mengasumsikan `loadPyodide` sudah tersedia secara global
        // dari tag <script> di index.html.
        if (typeof loadPyodide === 'undefined') {
            const errorMsg = 'Gagal menemukan fungsi loadPyodide(). Pastikan pyodide.js termuat dengan benar di HTML dan server Node.js telah direstart.';
            this.addOutput(`❌ ${errorMsg}`, 'error');
            throw new Error(errorMsg);
        }

        this.addOutput('⏳ Memuat engine Python...', 'info');
        try {
            // Memuat Pyodide dari folder lokal yang disajikan oleh server
            this.pyodide = await loadPyodide({
                indexURL: "/pyodide/" 
            });
            this.addOutput(`✅ Pyodide ${this.pyodide.version} siap!`, 'success');

            // === PATCH PENTING untuk fungsi input() ===
            // Mengganti fungsi input() bawaan Python dengan prompt() dari browser
            // agar program interaktif dapat berjalan.
            this.addOutput('ℹ️ Menyiapkan environment interaktif...', 'info');
            this.pyodide.runPython(`
from js import prompt
__builtins__.input = prompt
            `);
            this.addOutput('✅ Environment siap.', 'success');

        } catch (e) {
            console.error("Pyodide loading error:", e);
            this.addOutput(`❌ Gagal memuat engine Pyodide: ${e.message}`, 'error');
            throw e; // Lemparkan kembali error agar ditangkap oleh fungsi run()
        }
    },

    /**
     * Add output to console
     */
    addOutput: function(text, type = 'info') {
        const outputContent = document.getElementById('outputContent');
        if (!outputContent) return;

        const line = document.createElement('div');
        line.className = `output-line ${type}`;
        
        if (type === 'stdout') {
            // Tampilan seperti terminal asli: tanpa timestamp, font monospace
            line.innerHTML = this.escapeHtml(text);
            line.style.fontFamily = "'Fira Code', monospace";
            line.style.color = "#e0e0e0";
            line.style.paddingLeft = "5px";
        } else {
            // Tampilan pesan sistem (info/error), timestamp dihilangkan
            const icons = {
                'info': 'ℹ️',
                'success': '✅',
                'error': '❌',
                'warning': '⚠️'
            };
            line.innerHTML = `${icons[type] || '•'} ${this.escapeHtml(text)}`;
        }

        outputContent.appendChild(line);
        outputContent.scrollTop = outputContent.scrollHeight;
        
        this.output.push({ text, type });
    },

    /**
     * Escape HTML
     */
    escapeHtml: function(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * Finish execution
     */
    finish: function() {
        if (!this.isRunning) return; // Prevent multiple calls
        this.isRunning = false;
        
        this.addOutput('✨ Simulasi selesai!', 'info');
    },

    /**
     * Stop execution
     */
    stop: function() {
        if (this.isRunning) {
            this.isRunning = false;
            this.addOutput('🛑 Eksekusi dihentikan', 'warning');
        }
    },

    /**
     * Clear output console
     */
    clear: function() {
        const outputContent = document.getElementById('outputContent');
        if (outputContent) {
            outputContent.innerHTML = '';
        }
        this.output = [];
    }
};