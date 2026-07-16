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

        // Block untuk input() -> string
        Blockly.Blocks['python_input'] = {
            init: function() {
                this.appendValueInput('TEXT')
                    .setCheck('String')
                    .appendField('read text');
                this.setOutput(true, 'String');
                this.setStyle('io_blocks');
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