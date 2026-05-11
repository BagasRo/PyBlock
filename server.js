const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files dari public folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve Blockly files dari node_modules
app.use('/blockly', express.static(path.join(__dirname, 'node_modules/blockly')));

// Serve Pyodide files dari node_modules
app.use('/pyodide', express.static(path.join(__dirname, 'node_modules/pyodide')));

// Middleware untuk parsing JSON dan URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route utama
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint untuk menyimpan project
app.post('/api/save', (req, res) => {
    const { projectName, jsonCode, pythonCode } = req.body;
    console.log(`💾 Project "${projectName}" saved`);
    console.log('JSON Length:', jsonCode ? jsonCode.length : 0);
    console.log('Python Code Length:', pythonCode.length);
    
    res.json({ 
        success: true, 
        message: 'Project berhasil disimpan',
        timestamp: new Date().toISOString()
    });
});

// API endpoint untuk load contoh project
app.get('/api/examples/:id', (req, res) => {
    const examples = {
        '1': {
            name: 'Halo Dunia',
            description: 'Program sederhana mencetak teks',
            xml: `<!-- XML untuk halo dunia -->`
        },
        '2': {
            name: 'Kalkulator',
            description: 'Operasi matematika dasar',
            xml: `<!-- XML untuk kalkulator -->`
        }
    };
    
    const example = examples[req.params.id];
    if (example) {
        res.json(example);
    } else {
        res.status(404).json({ error: 'Contoh tidak ditemukan' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        blocklyVersion: require('./node_modules/blockly/package.json').version
    });
});

// Error handling
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.stack);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not Found' });
});

app.listen(PORT, () => {
    console.log(`
    🚀 ========================================
    🚀 Python Blockly Simulator Running!
    🚀 ========================================
    🌐 URL: http://localhost:${PORT}
    📁 Public: ${path.join(__dirname, 'public')}
    📦 Blockly: ${path.join(__dirname, 'node_modules/blockly')}
    🔧 Mode: ${process.env.NODE_ENV || 'development'}
    =========================================
    `);
});