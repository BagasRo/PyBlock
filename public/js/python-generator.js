/**
 * Python Code Generator & Syntax Highlighter
 * Compatible with Blockly NPM v10+
 */

const PythonCodeHandler = {
    /**
     * Generate Python code from Blockly workspace
     */
    generate: function(workspace) {
        if (!workspace) {
            console.warn('No workspace provided to generator');
            return '';
        }
        
        try {
            // Use Blockly's built-in Python generator
            let code = Blockly.Python.workspaceToCode(workspace);
            
            // Post-process untuk membersihkan output
            code = this.postProcess(code);
            
            return code;
        } catch (error) {
            console.error('Error generating Python code:', error);
            return `# Error generating code:\n# ${error.message}`;
        }
    },

    /**
     * Post-process generated code
     */
    postProcess: function(code) {
        if (!code) return '';
        
        // Hapus deklarasi variabel otomatis dari Blockly (contoh: skor = None)
        // karena Python tidak membutuhkan deklarasi awal seperti ini
        code = code.replace(/^[a-zA-Z0-9_]+\s*=\s*None\r?\n/gm, '');

        // Remove excessive blank lines
        code = code.replace(/\n{3,}/g, '\n\n');
        
        // Trim whitespace
        code = code.trim();
        
        return code;
    },

    /**
     * Apply syntax highlighting for display
     */
    highlight: function(code) {
        if (!code || code.includes('Kode Python akan muncul')) {
            return '<span class="comment"># Kode Python akan muncul di sini...\n# Drag & drop block dari toolbox untuk memulai</span>';
        }
        
        // Jangan highlight jika ini adalah pesan error, agar pesan asli terbaca
        if (code.startsWith('# Error generating code')) {
            return `<span style="color: #ff6b6b;">${this.escapeHtml(code)}</span>`;
        }
        
        // 1. Escape HTML terlebih dahulu
        let text = this.escapeHtml(code);
        
        // Sistem Token: Simpan bagian yang sudah diwarnai agar tidak tertimpa
        const tokens = [];
        const saveToken = (str, type) => {
            const id = `___TOKEN${tokens.length}___`;
            tokens.push({id, str, type});
            return id;
        };

        // 2. Strings (Proses duluan agar keyword di dalam string tidak kena)
        text = text.replace(/((?:f|r|u|fr|rf)?["'])((?:[^\\]|\\.)*?)\1/g, match => saveToken(match, 'string'));
        
        // 3. Comments
        text = text.replace(/(#.*$)/gm, match => saveToken(match, 'comment'));
        
        // 4. Keywords
        const keywords = [
            'and', 'as', 'assert', 'break', 'class', 'continue', 'def', 'del', 'elif', 
            'else', 'except', 'False', 'finally', 'for', 'from', 'global', 'if', 
            'import', 'in', 'is', 'lambda', 'None', 'nonlocal', 'not', 'or', 'pass', 
            'raise', 'return', 'True', 'try', 'while', 'with', 'yield'
        ];
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
            text = text.replace(regex, match => saveToken(match, 'keyword'));
        });
        
        // 5. Built-in functions
        const builtins = [
            'abs', 'all', 'any', 'bin', 'bool', 'bytearray', 'bytes', 'chr', 'dict', 
            'dir', 'divmod', 'enumerate', 'eval', 'filter', 'float', 'format', 'frozenset',
            'getattr', 'globals', 'hasattr', 'hash', 'help', 'hex', 'id', 'input', 'int',
            'isinstance', 'issubclass', 'iter', 'len', 'list', 'locals', 'map', 'max', 
            'memoryview', 'min', 'next', 'object', 'oct', 'open', 'ord', 'pow', 'print', 
            'property', 'range', 'repr', 'reversed', 'round', 'set', 'setattr', 'slice', 
            'sorted', 'staticmethod', 'str', 'sum', 'super', 'tuple', 'type', 'vars', 'zip'
        ];
        builtins.forEach(func => {
            const regex = new RegExp(`\\b${func}\\b(?=\\()`, 'g');
            text = text.replace(regex, match => saveToken(match, 'function'));
        });
        
        // 6. Numbers
        text = text.replace(/\b(\d+\.?\d*(?:[eE][+-]?\d+)?)\b/g, match => saveToken(match, 'number'));
        
        // 7. Variables (sebelum operator =)
        text = text.replace(/\b([a-z_][a-z0-9_]*)\b(?=\s*=)/gi, match => saveToken(match, 'variable'));
        
        // 8. Operators (Hati-hati dengan karakter yang sudah di-escape &lt; &gt;)
        const ops = [
            { p: '&lt;=', r: '&lt;=' }, { p: '&gt;=', r: '&gt;=' },
            { p: '&lt;&lt;', r: '&lt;&lt;' }, { p: '&gt;&gt;', r: '&gt;&gt;' },
            { p: '&lt;', r: '&lt;' }, { p: '&gt;', r: '&gt;' }, { p: '&amp;', r: '&amp;' },
            { p: '\\/\\/', r: '//' }, { p: '\\*\\*', r: '**' },
            { p: '==', r: '==' }, { p: '!=', r: '!=' },
            { p: '\\+', r: '+' }, { p: '-', r: '-' }, { p: '\\*', r: '*' },
            { p: '/', r: '/' }, { p: '%', r: '%' }, { p: '=', r: '=' },
            { p: '\\|', r: '|' }, { p: '\\^', r: '^' }, { p: '~', r: '~' }
        ];
        
        ops.forEach(op => {
            const regex = new RegExp(`(${op.p})`, 'g');
            text = text.replace(regex, match => saveToken(match, 'operator'));
        });
        
        // Restore tokens menjadi HTML
        tokens.forEach(token => {
            text = text.replace(token.id, `<span class="${token.type}">${token.str}</span>`);
        });
        
        return text;
    },

    /**
     * Escape HTML special characters
     */
    escapeHtml: function(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    /**
     * Update line numbers display
     */
    updateLineNumbers: function(code) {
        const lineNumbers = document.getElementById('lineNumbers');
        if (!lineNumbers) return;
        
        const lines = code ? code.split('\n').length : 1;
        lineNumbers.innerHTML = Array.from({length: lines}, (_, i) => i + 1).join('<br>');
    },

    /**
     * Display code in the code panel
     */
    display: function(code) {
        const codeContent = document.getElementById('codeContent');
        if (!codeContent) return;
        
        const highlighted = this.highlight(code);
        codeContent.innerHTML = `<code class="python">${highlighted}</code>`;
        
        this.updateLineNumbers(code);
    },

    /**
     * Get code statistics
     */
    getStats: function(code) {
        const lines = code.split('\n').length;
        const nonEmptyLines = code.split('\n').filter(l => l.trim()).length;
        const words = code.split(/\s+/).length;
        
        return { lines, nonEmptyLines, words };
    }
};