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
            this.registerLoopGenerators();

            // Use Blockly's built-in Python generator
            const orphanValueBlocks = [];
            if (typeof workspace.getTopBlocks === 'function') {
                if (typeof Blockly !== 'undefined' && Blockly.Events) Blockly.Events.disable();
                try {
                    workspace.getTopBlocks(false).forEach(b => {
                        const isEnabled = typeof b.isEnabled === 'function' ? b.isEnabled() : !b.disabled;
                        if (b.outputConnection && isEnabled) {
                            orphanValueBlocks.push(b);
                            if (typeof b.setEnabled === 'function') b.setEnabled(false);
                            else if (typeof b.setDisabledReason === 'function') b.setDisabledReason(true, 'orphan_value');
                        }
                    });
                } finally {
                    if (typeof Blockly !== 'undefined' && Blockly.Events) Blockly.Events.enable();
                }
            }
            let code = Blockly.Python.workspaceToCode(workspace);
            if (orphanValueBlocks.length > 0) {
                if (typeof Blockly !== 'undefined' && Blockly.Events) Blockly.Events.disable();
                try {
                    orphanValueBlocks.forEach(b => {
                        if (typeof b.setEnabled === 'function') b.setEnabled(true);
                        else if (typeof b.setDisabledReason === 'function') b.setDisabledReason(false, 'orphan_value');
                    });
                } finally {
                    if (typeof Blockly !== 'undefined' && Blockly.Events) Blockly.Events.enable();
                }
            }
            
            // Post-process untuk membersihkan output
            code = this.postProcess(code);
            
            return code;
        } catch (error) {
            console.error('Error generating Python code:', error);
            return `# Error generating code:\n# ${error.message}`;
        }
    },

    /**
     * Register Python generators for the custom loop blocks.
     */
    registerLoopGenerators: function() {
        if (!Blockly.Python) {
            throw new Error('Generator Python Blockly belum dimuat.');
        }

        Blockly.Python.INDENT = '    ';
        const generator = Blockly.Python.forBlock || Blockly.Python;
        const variableName = function(block, fieldName, gen) {
            const variableId = block.getFieldValue(fieldName);
            if (typeof gen.getVariableName === 'function') {
                return gen.getVariableName(variableId);
            }
            const nameDatabase = gen.nameDB_ || gen.variableDB_;
            return nameDatabase
                ? nameDatabase.getName(variableId, Blockly.Names.NameType.VARIABLE)
                : block.getField(fieldName).getText();
        };

        generator.controls_for = function(block, gen) {
            const g = gen || Blockly.Python;
            const variable = variableName(block, 'VAR', g);
            const from = g.valueToCode(block, 'FROM', g.ORDER_NONE) || '0';
            const to = g.valueToCode(block, 'TO', g.ORDER_NONE) || '0';
            const by = g.valueToCode(block, 'BY', g.ORDER_NONE) || '1';
            const statements = g.statementToCode(block, 'DO') || (g.INDENT || '    ') + 'pass\n';

            // Jika from, to, by berupa angka integer literal
            if (/^[+-]?\d+$/.test(from) && /^[+-]?\d+$/.test(to) && /^[+-]?\d+$/.test(by)) {
                const fromNum = Number(from);
                const toNum = Number(to);
                const byNum = Math.abs(Number(by)) || 1;

                if (fromNum <= toNum) {
                    const stopNum = toNum + 1;
                    return 'for ' + variable + ' in range(' + fromNum + ', ' + stopNum + ', ' + byNum + '):\n' + statements;
                } else {
                    const stopNum = toNum - 1;
                    return 'for ' + variable + ' in range(' + fromNum + ', ' + stopNum + ', -' + byNum + '):\n' + statements;
                }
            } else {
                return 'for ' + variable + ' in range(' + from + ', (' + to + ') + 1, ' + by + '):\n' + statements;
            }
        };

        generator.loop_range = function(block, gen) {
            const g = gen || Blockly.Python;
            const variable = variableName(block, 'VAR', g);
            const mode = block.getFieldValue('MODE') || 'START_STOP';
            const stop = g.valueToCode(block, 'STOP', g.ORDER_NONE) || '0';
            const statements = g.statementToCode(block, 'DO') || (g.INDENT || '    ') + 'pass\n';

            let rangeArgs = '';
            if (mode === 'STOP') {
                rangeArgs = stop;
            } else if (mode === 'START_STOP') {
                const start = g.valueToCode(block, 'START', g.ORDER_NONE) || '0';
                rangeArgs = start + ', ' + stop;
            } else { // START_STOP_STEP
                const start = g.valueToCode(block, 'START', g.ORDER_NONE) || '0';
                const step = g.valueToCode(block, 'STEP', g.ORDER_NONE) || '1';
                rangeArgs = start + ', ' + stop + ', ' + step;
            }

            return 'for ' + variable + ' in range(' + rangeArgs + '):\n' + statements;
        };

        generator.loop_doWhile = function(block, gen) {
            const g = gen || Blockly.Python;
            const indent = g.INDENT || '    ';
            const mode = block.getFieldValue('MODE') || 'WHILE';
            const condition = g.valueToCode(block, 'CONDITION', g.ORDER_NONE) || (mode === 'WHILE' ? 'False' : 'True');
            const statements = g.statementToCode(block, 'DO') || (indent + 'pass\n');

            const loopTypesList = new Set([
                'controls_repeat',
                'controls_repeat_ext',
                'controls_whileUntil',
                'controls_for',
                'controls_forEach',
                'loop_range',
                'loop_doWhile',
                'loop_forEachChar',
                'loop_forEachIndex'
            ]);

            const hasContinue = (function() {
                const descendants = block.getDescendants(false);
                return descendants.some(d => {
                    if (d.type === 'loop_continue' || (d.type === 'controls_flow_statements' && d.getFieldValue('FLOW') === 'CONTINUE')) {
                        let p = d.getSurroundParent();
                        while (p) {
                            if (loopTypesList.has(p.type)) {
                                return p === block;
                            }
                            p = p.getSurroundParent();
                        }
                    }
                    return false;
                });
            })();

            const labelComment = '# do-while: isi dijalankan dulu, kondisi dicek di akhir\n';

            if (hasContinue) {
                // Pola flag: pertama = True / while pertama or (kondisi): / pertama = False
                const condExpr = (mode === 'WHILE') ? '(' + condition + ')' : 'not (' + condition + ')';
                return labelComment +
                    'pertama = True\n' +
                    'while pertama or ' + condExpr + ':\n' +
                    indent + 'pertama = False\n' +
                    statements;
            } else {
                // Pola while True: + isi + if not (kondisi): break (until tanpa not)
                const breakCondition = (mode === 'WHILE')
                    ? indent + 'if not (' + condition + '):\n' + indent + indent + 'break\n'
                    : indent + 'if ' + condition + ':\n' + indent + indent + 'break\n';

                return labelComment +
                    'while True:\n' +
                    statements +
                    breakCondition;
            }
        };

        generator.controls_flow_statements = function(block) {
            const flow = block.getFieldValue('FLOW');
            return (flow === 'CONTINUE' ? 'continue' : 'break') + '\n';
        };


        generator.loop_break = function() {
            return 'break\n';
        };

        generator.loop_continue = function() {
            return 'continue\n';
        };

        generator.loop_forEachChar = function(block, gen) {
            const g = gen || Blockly.Python;
            const variable = variableName(block, 'VAR', g);
            const text = g.valueToCode(block, 'TEXT', g.ORDER_NONE) || "''";
            const statements = g.statementToCode(block, 'DO') || (g.INDENT || '    ') + 'pass\n';
            return 'for ' + variable + ' in ' + text + ':\n' + statements;
        };

        generator.loop_forEachIndex = function(block, gen) {
            const g = gen || Blockly.Python;
            const index = variableName(block, 'INDEX', g);
            const item = variableName(block, 'ITEM', g);
            const list = g.valueToCode(block, 'LIST', g.ORDER_NONE) || '[]';
            const statements = g.statementToCode(block, 'DO') || (g.INDENT || '    ') + 'pass\n';
            return 'for ' + index + ', ' + item + ' in enumerate(' + list + '):\n' + statements;
        };
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