/**
 * Guide Registry — Pusat data dan registrasi panduan ensiklopedia Blockly + Python.
 * Menggabungkan seluruh modul data kategori dan menyediakan helper pencarian & navigasi.
 */

import gettingStartedData from './data/getting-started.js';
import ioData from './data/io.js';
import textData from './data/text.js';
import mathData from './data/math.js';
import variablesData from './data/variables.js';
import controlData from './data/control.js';
import logicData from './data/logic.js';
import loopsData from './data/loops.js';
import listsData from './data/lists.js';

export const guideCategories = [
    gettingStartedData,
    ioData,
    textData,
    mathData,
    variablesData,
    controlData,
    logicData,
    loopsData,
    listsData
];

/**
 * Normalisasi id atau alias untuk pencocokan yang fleksibel
 */
function normalizeKey(str) {
    if (!str) return '';
    return String(str).toLowerCase().trim().replace(/[\s\-_]/g, '');
}

/**
 * Dapatkan seluruh kategori
 */
export function getAllCategories() {
    return guideCategories;
}

/**
 * Dapatkan semua entri datar dalam 1 array
 */
export function getAllEntries() {
    const list = [];
    guideCategories.forEach(cat => {
        if (Array.isArray(cat.entries)) {
            cat.entries.forEach(e => {
                list.push({ ...e, kategoriWarna: cat.warna, kategoriIcon: cat.icon });
            });
        }
    });
    return list;
}

/**
 * Dapatkan kategori berdasarkan ID kategori
 */
export function getCategoryById(catId) {
    if (!catId) return null;
    const key = normalizeKey(catId);
    return guideCategories.find(c => normalizeKey(c.id) === key || normalizeKey(c.nama) === key) || null;
}

/**
 * Cari entri berdasarkan ID atau alias (misal 'print', 'text_print', 'read_int', 'controls_if')
 */
export function getEntryById(entryId) {
    if (!entryId) return null;
    const targetKey = normalizeKey(entryId);

    for (const cat of guideCategories) {
        for (const entry of cat.entries) {
            if (normalizeKey(entry.id) === targetKey) {
                return { ...entry, kategoriWarna: cat.warna, kategoriIcon: cat.icon, kategoriId: cat.id };
            }
            if (Array.isArray(entry.aliases)) {
                for (const alias of entry.aliases) {
                    if (normalizeKey(alias) === targetKey) {
                        return { ...entry, kategoriWarna: cat.warna, kategoriIcon: cat.icon, kategoriId: cat.id };
                    }
                }
            }
        }
    }

    // Jika tidak ditemukan exact/alias, cari yang mengandung substring
    for (const cat of guideCategories) {
        for (const entry of cat.entries) {
            const idNorm = normalizeKey(entry.id);
            if (idNorm.includes(targetKey) || targetKey.includes(idNorm)) {
                return { ...entry, kategoriWarna: cat.warna, kategoriIcon: cat.icon, kategoriId: cat.id };
            }
        }
    }

    return null;
}

/**
 * Dapatkan entri sebelum dan sesudah dalam kategori yang sama
 */
export function getAdjacentEntries(entryId) {
    if (!entryId) return { prev: null, next: null, category: null };
    const currentEntry = getEntryById(entryId);
    if (!currentEntry) return { prev: null, next: null, category: null };

    const cat = guideCategories.find(c => c.id === currentEntry.kategoriId);
    if (!cat || !Array.isArray(cat.entries)) return { prev: null, next: null, category: cat };

    const idx = cat.entries.findIndex(e => e.id === currentEntry.id);
    if (idx === -1) return { prev: null, next: null, category: cat };

    const prev = idx > 0 ? cat.entries[idx - 1] : null;
    const next = idx < cat.entries.length - 1 ? cat.entries[idx + 1] : null;

    return { prev, next, category: cat };
}

/**
 * Pencarian realtime entri berdasarkan kata kunci
 */
export function searchEntries(query) {
    if (!query || typeof query !== 'string') return [];
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const all = getAllEntries();
    return all.filter(item => {
        if (item.nama && item.nama.toLowerCase().includes(q)) return true;
        if (item.id && item.id.toLowerCase().includes(q)) return true;
        if (item.fungsi && item.fungsi.toLowerCase().includes(q)) return true;
        if (item.kegunaan && item.kegunaan.toLowerCase().includes(q)) return true;
        if (item.kategori && item.kategori.toLowerCase().includes(q)) return true;
        if (item.contoh && item.contoh.python && item.contoh.python.toLowerCase().includes(q)) return true;
        if (Array.isArray(item.aliases) && item.aliases.some(a => a.toLowerCase().includes(q))) return true;
        return false;
    });
}

/**
 * Simpan riwayat blok terakhir yang dibuka
 */
export function saveLastViewed(entryId, catId) {
    try {
        if (entryId) localStorage.setItem('guide_last_entry_id', entryId);
        if (catId) localStorage.setItem('guide_last_category_id', catId);
    } catch (e) {}
}

/**
 * Dapatkan riwayat blok terakhir yang dibuka
 */
export function getLastViewed() {
    try {
        const lastEntryId = localStorage.getItem('guide_last_entry_id');
        const lastCatId = localStorage.getItem('guide_last_category_id');
        return {
            entryId: lastEntryId || 'intro_workspace',
            catId: lastCatId || 'getting_started'
        };
    } catch (e) {
        return { entryId: 'intro_workspace', catId: 'getting_started' };
    }
}
