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
    streamBuffer: "",
    lastStdout: "",

    addOutputFromPython: function(text, isError = false) {
        this.streamBuffer += text;
        if (this.streamBuffer.includes('\n')) {
            const lines = this.streamBuffer.split('\n');
            for (let i = 0; i < lines.length - 1; i++) {
                this.addOutput(lines[i], isError ? 'error' : 'stdout');
                if (!isError) {
                    this.lastStdout += lines[i] + '\n';
                }
            }
            this.streamBuffer = lines[lines.length - 1];
        }
    },

    flushStreamBuffer: function() {
        if (this.streamBuffer) {
            this.addOutput(this.streamBuffer, 'stdout');
            this.lastStdout += this.streamBuffer;
            this.streamBuffer = "";
        }
    },

    /**
     * Reset simulator state
     */
    reset: function() {
        this.variables = {};
        this.output = [];
        this.isRunning = false;
        this.streamBuffer = "";
        this.lastStdout = "";
        console.log('🔄 Simulator reset');
    },

    /**
     * Main execution function
     */
     run: async function(code, isSubmit = false) {
        this.isSubmit = isSubmit;
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

        try {
            if (!this.pyodide) {
                await this.loadPyodide();
            }

            // Clear previous output buffer in Python
            this.pyodide.globals.set("output_buffer", "");

            // Redirect stdout/stderr to capture output real-time & setup infinite loop guard
            this.pyodide.runPython(`
import sys
from js import window

class JSStdout:
    def __init__(self, is_error=False):
        self.is_error = is_error
    def write(self, text):
        window.PythonSimulator.addOutputFromPython(text, self.is_error)
    def flush(self):
        pass

sys.stdout = JSStdout(False)
sys.stderr = JSStdout(True)

# Guard trace untuk mencegah infinite loop
def trace_limit(frame, event, arg):
    global execution_counter
    if event == 'line':
        execution_counter += 1
        if execution_counter > 50000:
            raise RuntimeError("Batas maksimum instruksi terlampaui (kemungkinan infinite loop)")
    return trace_limit

execution_counter = 0
sys.settrace(trace_limit)
`);

            // Execute user code
            await this.pyodide.runPythonAsync(code);

            // Clean up trace
            this.pyodide.runPython("sys.settrace(None)");
            this.flushStreamBuffer();

        } catch (error) {
            // Clean up trace on error
            try { this.pyodide.runPython("sys.settrace(None)"); } catch(e){}
            this.flushStreamBuffer();
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
            // Menggunakan customPythonInput dari JS (standalone function)
            // agar echo input muncul di console output seperti terminal asli.
            this.addOutput('ℹ️ Menyiapkan environment interaktif...', 'info');
            this.pyodide.runPython(`
from js import customPythonInput
__builtins__.input = customPythonInput
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
        } else if (type === 'input-echo') {
            // Tampilan input echo: prompt + nilai input user berwarna cyan
            line.style.fontFamily = "'Fira Code', monospace";
            line.style.paddingLeft = "5px";
            line.innerHTML = `<span style="color:#e0e0e0">${this.escapeHtml(text)}</span>`;
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
        


        // Panggil evaluasi jika mode submit aktif
        if (this.isSubmit && this.lastStdout !== undefined) {
            if (window.simulationManager) {
                // Mode Simulasi 8 soal (chain-based)
                window.simulationManager.evaluate(this.lastStdout);
            } else if (window.levelManager) {
                // Mode Level lama
                window.levelManager.evaluate(this.lastStdout);
            }
            this.lastStdout = undefined;
        } else if (!this.isSubmit && this.lastStdout !== undefined) {
            this.lastStdout = undefined; // Reset for next run
        }
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
     * Run code silently with mocked inputs for automated validation
     */
    runSilentTest: async function(code, inputsArray) {
        if (!this.pyodide) {
            await this.loadPyodide();
        }

        let testOutput = "";

        // Simpan fungsi asli
        const originalStdoutWrite = window.PythonSimulator.addOutputFromPython;
        
        try {
            // Override stdout ke variabel testOutput
            window.PythonSimulator.addOutputFromPython = function(text, isError) {
                if (!isError) {
                    testOutput += text;
                }
            };

            // Terekspos ke Pyodide via object js
            window.mockInputsArray = inputsArray;
            window.mockInputIndex = 0;
            
            // Timpa fungsi input bawaan Python dengan mock (tanpa echo)
            this.pyodide.runPython(`
from js import window
def mock_input(prompt_text=""):
    if window.mockInputIndex < len(window.mockInputsArray):
        val = str(window.mockInputsArray[window.mockInputIndex])
        window.mockInputIndex += 1
        return val
    return ""
__builtins__.input = mock_input
            `);

            // Jalankan kode
            await this.pyodide.runPythonAsync(code);

        } catch (error) {
            // Abaikan error dalam test atau rekam jika perlu
            testOutput += "\\n[Test Error: " + error.message.split('\\n').pop() + "]";
        } finally {
            // Kembalikan stdout aslinya
            window.PythonSimulator.addOutputFromPython = originalStdoutWrite;
            
            // Kembalikan input ke customPythonInput (dengan echo ke console)
            this.pyodide.runPython(`
from js import customPythonInput
__builtins__.input = customPythonInput
            `);
        }

        return testOutput;
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

window.PythonSimulator = PythonSimulator;

/**
 * Standalone function untuk menggantikan input() Python.
 * Menampilkan browser prompt, lalu echo prompt+nilai ke console output.
 * Dibuat sebagai standalone function (bukan method) agar Pyodide
 * bisa memanggilnya langsung tanpa masalah binding `this`.
 */
window.customPythonInput = function(promptText) {
    if (promptText === undefined || promptText === null) {
        promptText = "";
    }

    // Flush stream buffer dulu — jika ada teks print() sebelumnya yang belum di-flush
    PythonSimulator.flushStreamBuffer();
    
    // Tampilkan browser prompt dialog
    const result = window.prompt(promptText);
    const inputValue = (result !== null) ? result : "";
    
    // (Echo prompt dan input dinonaktifkan agar tidak ganda di output)
    // const echoText = promptText + inputValue;
    // PythonSimulator.addOutput(echoText, 'input-echo');
    
    return inputValue;
};