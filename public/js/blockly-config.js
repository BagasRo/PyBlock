/**
 * Konfigurasi Blockly menggunakan NPM package
 */

const BlocklyConfig = {
    workspace: null,

    // Inisialisasi workspace
    init: function(level = 1) {
        // Bersihkan container dan workspace lama jika ada untuk mencegah duplikasi
        const container = document.getElementById('blocklyDiv');
        if (container) {
            container.innerHTML = '';
        }
        if (this.workspace) {
            try { this.workspace.dispose(); } catch (e) {}
            this.workspace = null;
        }

        const toolbox = this.getToolboxForLevel(level);
        
        this.workspace = Blockly.inject('blocklyDiv', {
            toolbox: toolbox,
            grid: {
                spacing: 20,
                length: 3,
                colour: '#ccc',
                snap: true
            },
            zoom: {
                controls: true,
                wheel: true,
                startScale: 1.0,
                maxScale: 3,
                minScale: 0.3,
                scaleSpeed: 1.2
            },
            trashcan: true,
            theme: this.getCustomTheme(),
            renderer: 'geras',
            move: {
                scrollbars: true,
                drag: true,
                wheel: true
            },
            sounds: true
        });

        // Berikan ruang scroll ekstra di bagian bawah dan kanan agar blok paling bawah
        // tidak terpotong dan dialog/mutator memiliki ruang kerja yang leluasa
        try {
            const metricsMgr = this.workspace.getMetricsManager();
            if (metricsMgr) {
                const origGetScrollMetrics = metricsMgr.getScrollMetrics.bind(metricsMgr);
                metricsMgr.getScrollMetrics = function(opt_getReal) {
                    const metrics = origGetScrollMetrics(opt_getReal);
                    if (metrics) {
                        metrics.height += 300;
                        metrics.width += 200;
                    }
                    return metrics;
                };
            }
        } catch (e) {
            console.warn("Gagal set custom scroll metrics:", e);
        }

        // Auto-resize workspace ketika container berubah ukuran
        if (window.ResizeObserver) {
            const ro = new ResizeObserver(() => {
                if (this.workspace && typeof Blockly !== 'undefined' && Blockly.svgResize) {
                    Blockly.svgResize(this.workspace);
                }
            });
            const blocklyDiv = document.getElementById('blocklyDiv');
            if (blocklyDiv) ro.observe(blocklyDiv);
        }

        // Definisikan custom block setelah workspace siap
        this.defineCustomBlocks();

        return this.workspace;
    },

    // Definisi Toolbox sesuai tingkatan level
    getToolboxForLevel: function(level) {
        // 1. KONTROL ALUR
        const controlCategory = {
            "kind": "category",
            "name": "Control",
            "categorystyle": "logic_category",
            "contents": [
                { "kind": "block", "type": "controls_if" },
                { "kind": "block", "type": "controls_ifelse" }
            ]
        };
        // 2. PERULANGAN
        const loopsCategory = {
            "kind": "category",
            "name": "Loops",
            "categorystyle": "loop_category",
            "contents": [
                {
                    "kind": "block",
                    "type": "controls_repeat_ext",
                    "inputs": {
                        "TIMES": { "shadow": { "type": "math_number", "fields": { "NUM": 5 } } }
                    }
                },
                { "kind": "block", "type": "controls_whileUntil", "fields": { "MODE": "WHILE" } },
                {
                    "kind": "block",
                    "type": "controls_for",
                    "fields": { "VAR": "i" },
                    "inputs": {
                        "FROM": { "shadow": { "type": "math_number", "fields": { "NUM": 1 } } },
                        "TO": { "shadow": { "type": "math_number", "fields": { "NUM": 5 } } },
                        "BY": { "shadow": { "type": "math_number", "fields": { "NUM": 1 } } }
                    }
                },
                { "kind": "block", "type": "controls_forEach", "fields": { "VAR": "item" } },
                {
                    "kind": "block",
                    "type": "loop_range",
                    "fields": { "VAR": "i", "MODE": "START_STOP" },
                    "inputs": {
                        "START": { "shadow": { "type": "math_number", "fields": { "NUM": 1 } } },
                        "STOP": { "shadow": { "type": "math_number", "fields": { "NUM": 6 } } }
                    }
                },
                { "kind": "block", "type": "loop_doWhile", "fields": { "MODE": "WHILE" } },
                { "kind": "block", "type": "loop_forEachChar", "fields": { "VAR": "k" } },
                { "kind": "block", "type": "loop_forEachIndex", "fields": { "INDEX": "i", "ITEM": "item" } },
                { "kind": "block", "type": "controls_flow_statements" }
            ]
        };
        // 2b. LISTS
        const listsCategory = {
            "kind": "category",
            "name": "Lists",
            "categorystyle": "list_category",
            "contents": [
                { "kind": "block", "type": "lists_create_with" },
                { "kind": "block", "type": "lists_create_with", "extraState": { "itemCount": 0 } },
                { "kind": "block", "type": "lists_repeat",
                    "inputs": {
                        "NUM": { "shadow": { "type": "math_number", "fields": { "NUM": 5 } } }
                    }
                },
                { "kind": "block", "type": "lists_length" },
                { "kind": "block", "type": "lists_isEmpty" },
                { "kind": "block", "type": "lists_indexOf",
                    "inputs": {
                        "VALUE": { "block": { "type": "variables_get" } }
                    }
                },
                { "kind": "block", "type": "lists_getIndex",
                    "inputs": {
                        "VALUE": { "block": { "type": "variables_get" } }
                    }
                },
                { "kind": "block", "type": "lists_setIndex",
                    "inputs": {
                        "LIST": { "block": { "type": "variables_get" } }
                    }
                }
            ]
        };
        // 3. LOGIKA
        const logicCategory = {
            "kind": "category",
            "name": "Logic",
            "categorystyle": "logic_category",
            "contents": [
                { "kind": "block", "type": "logic_compare" },
                { "kind": "block", "type": "logic_operation" },
                { "kind": "block", "type": "logic_negate" },
                { "kind": "block", "type": "logic_boolean" }
            ]
        };
        // 4. MATEMATIKA
        const mathCategory = {
            "kind": "category",
            "name": "Math",
            "categorystyle": "math_category",
            "contents": [
                { "kind": "block", "type": "math_number", "fields": { "NUM": 123 } },
                {
                    "kind": "block",
                    "type": "math_arithmetic",
                    "inputs": {
                        "A": { "shadow": { "type": "math_number", "fields": { "NUM": 1 } } },
                        "B": { "shadow": { "type": "math_number", "fields": { "NUM": 1 } } }
                    }
                },
                {
                    "kind": "block",
                    "type": "math_modulo",
                    "inputs": {
                        "DIVIDEND": { "shadow": { "type": "math_number", "fields": { "NUM": 64 } } },
                        "DIVISOR": { "shadow": { "type": "math_number", "fields": { "NUM": 10 } } }
                    }
                }
            ]
        };
        // 5. TEKS
        const textCategory = {
            "kind": "category",
            "name": "Text",
            "categorystyle": "text_category",
            "contents": [
                { "kind": "block", "type": "python_comment", "fields": { "COMMENT": "tulis komentar di sini" } },
                { "kind": "block", "type": "text", "fields": { "TEXT": "abc" } },
                { "kind": "block", "type": "text_join" },
                {
                    "kind": "block",
                    "type": "convert_to_string",
                    "inputs": {
                        "VALUE": { "shadow": { "type": "math_number", "fields": { "NUM": 123 } } }
                    }
                }
            ]
        };
        // 6. INPUT/OUTPUT
        const ioCategory = {
            "kind": "category",
            "name": "I/O",
            "categorystyle": "io_category",
            "contents": [
                {
                    "kind": "block",
                    "type": "text_print",
                    "inputs": {
                        "TEXT": { "shadow": { "type": "text", "fields": { "TEXT": "Halo Dunia" } } }
                    }
                },
                {
                    "kind": "block",
                    "type": "python_input",
                    "inputs": {
                        "TEXT": { "shadow": { "type": "text", "fields": { "TEXT": "Masukkan nama:" } } }
                    }
                },
                {
                    "kind": "block",
                    "type": "read_number",
                    "inputs": {
                        "PROMPT": { "shadow": { "type": "text", "fields": { "TEXT": "Masukkan angka:" } } }
                    }
                },
                {
                    "kind": "block",
                    "type": "read_float",
                    "inputs": {
                        "PROMPT": { "shadow": { "type": "text", "fields": { "TEXT": "Masukkan desimal:" } } }
                    }
                }
            ]
        };

        const contents = [];
        
        // Menentukan kategori yang muncul sesuai level
        contents.push(textCategory);
        contents.push(mathCategory);
        contents.push(ioCategory);
        
        if (level >= 2) {
            contents.push({
                "kind": "category",
                "name": "Variables",
                "categorystyle": "variable_category",
                "custom": "VARIABLE"
            });
        }
        
        if (level >= 3) {
            contents.push(controlCategory);
            contents.push(logicCategory);
        }
        
        if (level >= 4) {
            contents.push(loopsCategory);
            contents.push(listsCategory);
        }

        return {
            "kind": "categoryToolbox",
            "contents": contents
        };
    },

    // Definisi Toolbox berdasarkan blok_tersedia pada data soal (fallback ke level)
    getToolboxForQuestion: function(blokTersedia, level = 1) {
        if (!blokTersedia) {
            return this.getToolboxForLevel(level);
        }
        if (blokTersedia.kind === 'categoryToolbox' && Array.isArray(blokTersedia.contents)) {
            return blokTersedia;
        }

        const fullToolbox = this.getToolboxForLevel(4);
        const allCategories = fullToolbox.contents || [];

        if (Array.isArray(blokTersedia)) {
            const allowedNames = blokTersedia.map(c => String(c).toLowerCase());
            const filtered = allCategories.filter(cat =>
                allowedNames.includes(String(cat.name).toLowerCase())
            );
            if (filtered.length > 0) {
                return {
                    "kind": "categoryToolbox",
                    "contents": filtered
                };
            }
        }

        if (typeof blokTersedia === 'object' && Array.isArray(blokTersedia.categories)) {
            const allowedNames = blokTersedia.categories.map(c => String(c).toLowerCase());
            const blockFilterMap = blokTersedia.blocks || {};
            const filtered = allCategories
                .filter(cat => allowedNames.includes(String(cat.name).toLowerCase()))
                .map(cat => {
                    const allowedBlocks = blockFilterMap[cat.name];
                    if (Array.isArray(allowedBlocks) && Array.isArray(cat.contents)) {
                        return {
                            ...cat,
                            contents: cat.contents.filter(b => allowedBlocks.includes(b.type))
                        };
                    }
                    return cat;
                });
            if (filtered.length > 0) {
                return {
                    "kind": "categoryToolbox",
                    "contents": filtered
                };
            }
        }

        return this.getToolboxForLevel(level);
    },

    // Toolbox lengkap untuk mode Sandbox (semua kategori)
    getFullToolbox: function() {
        return this.getToolboxForLevel(4);
    },

    // Tema kustom
    getCustomTheme: function() {
        // Kompatibilitas: Cek Blockly.themes (v10+) atau Blockly.Themes (lama)
        const themes = Blockly.themes || Blockly.Themes || {};
        const baseTheme = themes.Classic || null;

        return Blockly.Theme.defineTheme('pythonTheme', {
            'base': baseTheme,
            'blockStyles': {
                'logic_blocks': {
                    'colourPrimary': '#5C81A6',
                    'colourSecondary': '#3D5A80',
                    'colourTertiary': '#2C4A6E'
                },
                'loop_blocks': {
                    'colourPrimary': '#5CA65C',
                    'colourSecondary': '#3D853D',
                    'colourTertiary': '#2C632C'
                },
                'loop_flow_blocks': {
                    'colourPrimary': '#DC2626',
                    'colourSecondary': '#B91C1C',
                    'colourTertiary': '#991B1B'
                },
                'math_blocks': {
                    'colourPrimary': '#5C68A6',
                    'colourSecondary': '#3D4580',
                    'colourTertiary': '#2C336E'
                },
                'text_blocks': {
                    'colourPrimary': '#A65C81',
                    'colourSecondary': '#853D66',
                    'colourTertiary': '#632C4D'
                },
                'io_blocks': {
                    'colourPrimary': '#49a39f',
                    'colourSecondary': '#3a827e',
                    'colourTertiary': '#2b615e'
                },
                'utility_blocks': {
                    'colourPrimary': '#74879d',
                    'colourSecondary': '#5d6c7e',
                    'colourTertiary': '#46515e'
                },
                'variable_blocks': {
                    'colourPrimary': '#FF8C1A',
                    'colourSecondary': '#FF6F00',
                    'colourTertiary': '#E66000'
                },
                'procedure_blocks': {
                    'colourPrimary': '#9A5CA6',
                    'colourSecondary': '#7A3D85',
                    'colourTertiary': '#5C2C63'
                },
                'list_blocks': {
                    'colourPrimary': '#4A90E2',
                    'colourSecondary': '#357ABD',
                    'colourTertiary': '#2A6099'
                }
            },
            'categoryStyles': {
                'logic_category': { 'colour': '#5C81A6' },
                'loop_category': { 'colour': '#5CA65C' },
                'math_category': { 'colour': '#5C68A6' },
                'text_category': { 'colour': '#A65C81' },
                'io_category': { 'colour': '#49a39f' },
                'utility_category': { 'colour': '#74879d' },
                'variable_category': { 'colour': '#FF8C1A' },
                'procedure_category': { 'colour': '#9A5CA6' },
                'list_category': { 'colour': '#4A90E2' }
            },
            'componentStyles': {
                'workspaceBackgroundColour': '#1a1a2e',
                'toolboxBackgroundColour': '#16213e',
                'toolboxForegroundColour': '#fff',
                'flyoutBackgroundColour': '#0f3460',
                'flyoutForegroundColour': '#ccc',
                'flyoutOpacity': 0.95,
                'scrollbarColour': '#e94560',
                'insertionMarkerColour': '#fff',
                'insertionMarkerOpacity': 0.3,
                'scrollbarOpacity': 0.4,
                'cursorColour': '#d0d0d0',
                'blackBackground': '#333'
            },
            'fontStyle': {
                'family': 'Inter, sans-serif',
                'weight': 'bold',
                'size': 14
            },
            'startHats': true
        });
    },

    // Custom blocks untuk Python spesifik
    defineCustomBlocks: function() {
        if (!Blockly.Python) {
            console.warn("⚠️ Blockly.Python belum dimuat. Custom blocks mungkin tidak berfungsi.");
            return;
        }

        // Helper untuk kompatibilitas versi Blockly (v10+ menggunakan .forBlock)
        const generator = Blockly.Python.forBlock || Blockly.Python;
        const loopTypes = new Set([
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

        // Daftarkan semua loop kustom ke libraryBlocks resmi Blockly (Blockly v10+)
        if (typeof Blockly !== 'undefined' && Blockly.libraryBlocks && Blockly.libraryBlocks.loops && Blockly.libraryBlocks.loops.loopTypes) {
            ['loop_range', 'loop_doWhile', 'loop_forEachChar', 'loop_forEachIndex'].forEach(t => {
                Blockly.libraryBlocks.loops.loopTypes.add(t);
            });
        }

        const defineFlowBlock = function(type, keyword) {
            Blockly.Blocks[type] = {
                init: function() {
                    this.appendDummyInput().appendField(keyword === 'break' ? '⤴ break' : '↪ continue');
                    this.setPreviousStatement(true, null);
                    this.setNextStatement(true, null);
                    this.setStyle('loop_flow_blocks');
                    this.setColour('#DC2626');
                    this.setTooltip(keyword === 'break'
                        ? 'Menghentikan perulangan yang sedang berjalan.'
                        : 'Melanjutkan ke iterasi berikutnya dalam perulangan.');
                    this.setOnChange(function() {
                        let parent = this.getSurroundParent();
                        let insideLoop = false;
                        while (parent) {
                            if (loopTypes.has(parent.type)) {
                                insideLoop = true;
                                break;
                            }
                            parent = parent.getSurroundParent();
                        }
                        if (typeof this.setWarningText === 'function') {
                            this.setWarningText(insideLoop ? null : 'Blok ini harus berada di dalam perulangan');
                        }
                        if (typeof this.setColour === 'function') {
                            this.setColour(insideLoop ? '#DC2626' : '#EF4444');
                        }
                    });
                }
            };
        };

        // Block untuk input() -> string
        Blockly.Blocks['python_input'] = {
            init: function() {
                this.appendValueInput('TEXT')
                    .setCheck('String')
                    .appendField('read text');
                this.setOutput(true, 'String');
                this.setStyle('io_blocks');
                this.setOutput(true, ['String', 'Number']);
                this.setTooltip('Membaca input dari pengguna sebagai teks (string).');
                this.setHelpUrl('');
            }
        };
        generator['python_input'] = function(block, gen) {
            const g = gen || Blockly.Python;
            var text = g.valueToCode(block, 'TEXT', g.ORDER_ATOMIC) || "''";
            return [`input(${text})`, g.ORDER_FUNCTION_CALL];
        };

        // Block untuk int(input()) -> number
        Blockly.Blocks['read_number'] = {
            init: function() {
                this.appendValueInput('PROMPT')
                    .setCheck('String')
                    .appendField('read int');
                this.setOutput(true, 'Number');
                this.setStyle('io_blocks');
                this.setTooltip('Membaca input dari pengguna dan mengubahnya menjadi angka bulat (integer).');
                this.setHelpUrl('');
            }
        };
        generator['read_number'] = function(block, gen) {
            const g = gen || Blockly.Python;
            var prompt = g.valueToCode(block, 'PROMPT', g.ORDER_ATOMIC) || "''";
            return [`int(input(${prompt}))`, g.ORDER_FUNCTION_CALL];
        };

        // Block untuk float(input()) -> number
        Blockly.Blocks['read_float'] = {
            init: function() {
                this.appendValueInput('PROMPT')
                    .setCheck('String')
                    .appendField('read float');
                this.setOutput(true, 'Number');
                this.setStyle('io_blocks');
                this.setTooltip('Membaca input dari pengguna dan mengubahnya menjadi angka desimal (float).');
                this.setHelpUrl('');
            }
        };
        generator['read_float'] = function(block, gen) {
            const g = gen || Blockly.Python;
            var prompt = g.valueToCode(block, 'PROMPT', g.ORDER_ATOMIC) || "''";
            return [`float(input(${prompt}))`, g.ORDER_FUNCTION_CALL];
        };

        // Block untuk str(value)
        Blockly.Blocks['convert_to_string'] = {
            init: function() {
                this.appendValueInput('VALUE')
                    .appendField('to str');
                this.setOutput(true, 'String');
                this.setStyle('text_blocks');
                this.setTooltip('Mengubah nilai apapun menjadi teks (string).');
                this.setHelpUrl('');
            }
        };
        generator['convert_to_string'] = function(block, gen) {
            const g = gen || Blockly.Python;
            var value = g.valueToCode(block, 'VALUE', g.ORDER_NONE) || "''";
            return [`str(${value})`, g.ORDER_FUNCTION_CALL];
        };

        // Generator controls_for: selalu sertakan step (misal range(1, 6, 1))
        generator['controls_for'] = function(block, gen) {
            const g = gen || Blockly.Python;
            const variableId = block.getFieldValue('VAR');
            const variable = (typeof g.getVariableName === 'function')
                ? g.getVariableName(variableId)
                : (block.getField('VAR') ? block.getField('VAR').getText() : 'i');
            const from = g.valueToCode(block, 'FROM', g.ORDER_NONE) || '0';
            const to = g.valueToCode(block, 'TO', g.ORDER_NONE) || '0';
            const by = g.valueToCode(block, 'BY', g.ORDER_NONE) || '1';
            const statements = g.statementToCode(block, 'DO') || (g.INDENT || '    ') + 'pass\n';

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

        // 1. loop_range: for [var i] in range [mode] do ...
        Blockly.Blocks['loop_range'] = {
            init: function() {
                this.appendDummyInput('HEADER')
                    .appendField('↻ for')
                    .appendField(new Blockly.FieldVariable('i'), 'VAR')
                    .appendField('in range')
                    .appendField(new Blockly.FieldDropdown([
                        ['(start, stop)', 'START_STOP'],
                        ['(stop)', 'STOP'],
                        ['(start, stop, step)', 'START_STOP_STEP']
                    ], function(newMode) {
                        this.getSourceBlock().updateMode(newMode);
                        return newMode;
                    }), 'MODE');

                this.appendValueInput('START')
                    .setCheck('Number')
                    .appendField('start');
                this.appendValueInput('STOP')
                    .setCheck('Number')
                    .appendField('stop');
                this.appendValueInput('STEP')
                    .setCheck('Number')
                    .appendField('step');

                this.appendStatementInput('DO')
                    .appendField('do');

                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('loop_blocks');
                this.setTooltip('stop tidak ikut dihitung. Menghasilkan perulangan dengan fungsi range().');
                this.setHelpUrl('');

                this.updateMode('START_STOP');
            },

            updateMode: function(mode) {
                const isStop = (mode === 'STOP');
                const isStartStopStep = (mode === 'START_STOP_STEP');

                const setVisibleSafe = (input, visible) => {
                    if (!input) return;
                    try {
                        if (typeof input.setVisible === 'function') {
                            input.setVisible(visible);
                        } else {
                            input.visible = visible;
                        }
                    } catch (e) {
                        input.visible = visible;
                    }
                };

                setVisibleSafe(this.getInput('START'), !isStop);
                setVisibleSafe(this.getInput('STOP'), true);
                setVisibleSafe(this.getInput('STEP'), isStartStopStep);

                if (this.rendered) {
                    this.render();
                }
            },

            saveExtraState: function() {
                return {
                    'mode': this.getFieldValue('MODE') || 'START_STOP'
                };
            },

            loadExtraState: function(state) {
                if (state && state.mode) {
                    this.setFieldValue(state.mode, 'MODE');
                    this.updateMode(state.mode);
                }
            },

            mutationToDom: function() {
                const container = Blockly.utils.xml.createElement('mutation');
                container.setAttribute('mode', this.getFieldValue('MODE') || 'START_STOP');
                return container;
            },

            domToMutation: function(xmlElement) {
                const mode = xmlElement.getAttribute('mode') || 'START_STOP';
                this.setFieldValue(mode, 'MODE');
                this.updateMode(mode);
            },

            onchange: function() {
                const mode = this.getFieldValue('MODE') || 'START_STOP';
                const startInput = this.getInput('START');
                if (startInput && ((mode === 'STOP' && startInput.isVisible()) || (mode !== 'STOP' && !startInput.isVisible()))) {
                    this.updateMode(mode);
                }

                let warning = null;
                if (mode === 'START_STOP_STEP') {
                    const stepBlock = this.getInputTargetBlock('STEP');
                    if (stepBlock) {
                        const numField = stepBlock.getField('NUM');
                        if (numField && Number(numField.getValue()) === 0) {
                            warning = 'Nilai step tidak boleh bernilai 0!';
                        }
                    }
                }
                if (typeof this.setWarningText === 'function') {
                    this.setWarningText(warning);
                }
            }
        };

        // 2. loop_doWhile: do ... [while/until] kondisi
        Blockly.Blocks['loop_doWhile'] = {
            init: function() {
                this.appendDummyInput()
                    .appendField('↻ do');
                this.appendStatementInput('DO');
                this.appendValueInput('CONDITION')
                    .setCheck('Boolean')
                    .appendField(new Blockly.FieldDropdown([
                        ['while', 'WHILE'],
                        ['until', 'UNTIL']
                    ]), 'MODE');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('loop_blocks');
                this.setTooltip('Menjalankan isi blok minimal satu kali, lalu mengulang berdasarkan kondisi di akhir.');
                this.setOnChange(function() {
                    if (typeof this.setWarningText === 'function') {
                        this.setWarningText(
                            this.getInputTargetBlock('CONDITION') ? null : 'Kondisi belum diisi'
                        );
                    }
                });
                this.setHelpUrl('');
            }
        };

        // 3. loop_break & loop_continue (fallback kompatibilitas lama)
        defineFlowBlock('loop_break', 'break');
        defineFlowBlock('loop_continue', 'continue');

        // 5. loop_forEachChar: for [var k] in [text] do ...
        Blockly.Blocks['loop_forEachChar'] = {
            init: function() {
                this.appendValueInput('TEXT')
                    .setCheck('String')
                    .appendField('↻ for each character')
                    .appendField(new Blockly.FieldVariable('k'), 'VAR')
                    .appendField('in text');
                this.appendStatementInput('DO')
                    .appendField('do');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('loop_blocks');
                this.setTooltip('Mengulang isi blok untuk setiap karakter (huruf) di dalam teks.');
                this.setHelpUrl('');
            }
        };

        // 6. loop_forEachIndex: for [var i], [var item] in [list] do ...
        Blockly.Blocks['loop_forEachIndex'] = {
            init: function() {
                this.appendValueInput('LIST')
                    .appendField('↻ for each index')
                    .appendField(new Blockly.FieldVariable('i'), 'INDEX')
                    .appendField(',')
                    .appendField(new Blockly.FieldVariable('item'), 'ITEM')
                    .appendField('in list');
                this.appendStatementInput('DO')
                    .appendField('do');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('loop_blocks');
                this.setTooltip('Mengulang isi blok untuk setiap indeks dan item dalam daftar menggunakan enumerate().');
                this.setOnChange(function() {
                    const sameVariable = this.getField('INDEX').getText() === this.getField('ITEM').getText();
                    if (typeof this.setWarningText === 'function') {
                        this.setWarningText(sameVariable
                            ? 'Nama variabel indeks dan item tidak boleh sama'
                            : null);
                    }
                });
                this.setHelpUrl('');
            }
        };
        // Block untuk komentar
        Blockly.Blocks['python_comment'] = {
            init: function() {
                this.appendDummyInput()
                    .appendField('#')
                    .appendField(new Blockly.FieldTextInput(''), 'COMMENT');
                this.setPreviousStatement(true, null);
                this.setNextStatement(true, null);
                this.setStyle('utility_blocks');
                this.setTooltip('Menambahkan komentar pada kode yang tidak akan dieksekusi.');
                this.setHelpUrl('');
            }
        };
        generator['python_comment'] = function(block) {
            return '# ' + block.getFieldValue('COMMENT') + '\n';
        };
    }
};