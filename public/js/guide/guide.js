/**
 * Guide Component — Antarmuka Ensiklopedia Panduan Blockly + Python (Civilopedia Style)
 * Mengelola Drawer universal, pencarian, navigasi entri, dan integrasi antar halaman.
 */

import {
    getAllCategories,
    getAllEntries,
    getCategoryById,
    getEntryById,
    getAdjacentEntries,
    searchEntries,
    saveLastViewed,
    getLastViewed
} from './registry.js';

class GuideManager {
    constructor() {
        this.isOpen = false;
        this.currentEntryId = 'intro_workspace';
        this.currentCategoryId = 'getting_started';
        this.isStandalone = false;
        this.overlayEl = null;
        this.drawerEl = null;
        this.sidebarEl = null;
        this.contentEl = null;
        this.searchInputEl = null;
        this.searchClearEl = null;
        this.menuScrollEl = null;
        this.isSearching = false;
    }

    /**
     * Inisialisasi awal modul
     */
    init(options = {}) {
        this.isStandalone = !!options.isStandalone;

        if (this.isStandalone) {
            this.initStandalone();
        } else {
            this.initDrawer();
        }

        this.bindGlobalKeys();
        this.exposeGlobalFunctions();

        // Restore riwayat terakhir jika ada
        const history = getLastViewed();
        const initialBlock = options.initialBlockId || history.entryId || 'intro_workspace';
        this.navigateToEntry(initialBlock, false);
    }

    /**
     * Inisialisasi Drawer untuk mode modal/overlay di atas workspace
     */
    initDrawer() {
        if (document.getElementById('guideDrawerOverlay')) {
            this.overlayEl = document.getElementById('guideDrawerOverlay');
            this.drawerEl = this.overlayEl.querySelector('.guide-drawer');
            this.bindElements();
            return;
        }

        // Buat DOM drawer
        const overlay = document.createElement('div');
        overlay.id = 'guideDrawerOverlay';
        overlay.className = 'guide-drawer-overlay';
        overlay.innerHTML = `
            <div class="guide-drawer" role="dialog" aria-label="Panduan Blockly">
                <header class="guide-header">
                    <div class="guide-header-title">
                        <span class="guide-logo-icon">📖</span>
                        <span>Panduan Blockly</span>
                        <span class="guide-header-badge">Ensiklopedia</span>
                    </div>
                    <div class="guide-header-actions">
                        <button id="guideMobileMenuToggle" class="guide-mobile-menu-toggle" title="Lihat Daftar Blok">
                            <span>☰</span> <span>Daftar Blok</span>
                        </button>
                        <a id="guideBtnOpenTab" class="guide-btn-action" href="/panduan.html" target="_blank" title="Buka panduan di tab baru">
                            <span>↗️</span> <span>Buka di tab baru</span>
                        </a>
                        <button id="guideBtnClose" class="guide-btn-close" title="Tutup Panduan (Esc)">✕</button>
                    </div>
                </header>
                <div class="guide-body">
                    <aside class="guide-sidebar" id="guideSidebar">
                        <div class="guide-search-wrapper">
                            <input type="text" id="guideSearchInput" class="guide-search-input" placeholder="🔍 Cari nama blok atau fungsi..." autocomplete="off">
                            <button id="guideSearchClear" class="guide-search-clear" title="Bersihkan pencarian">✕</button>
                        </div>
                        <div class="guide-menu-scroll" id="guideMenuScroll">
                            <!-- Daftar kategori & blok otomatis di-render di sini -->
                        </div>
                    </aside>
                    <main class="guide-content" id="guideContent">
                        <!-- Entri blok aktif di-render di sini -->
                    </main>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        this.overlayEl = overlay;
        this.drawerEl = overlay.querySelector('.guide-drawer');

        this.bindElements();
        this.bindHeaderTriggers();
    }

    /**
     * Inisialisasi untuk halaman standalone (panduan.html)
     */
    initStandalone() {
        this.overlayEl = document.getElementById('guideStandaloneContainer');
        this.bindElements();

        // Cek query parameter URL (?block=... atau ?kategori=...)
        const urlParams = new URLSearchParams(window.location.search);
        const blockParam = urlParams.get('block') || urlParams.get('id');
        if (blockParam) {
            this.navigateToEntry(blockParam, false);
        }
    }

    /**
     * Hubungkan referensi elemen dan event listener di Drawer
     */
    bindElements() {
        this.sidebarEl = document.getElementById('guideSidebar');
        this.contentEl = document.getElementById('guideContent');
        this.searchInputEl = document.getElementById('guideSearchInput');
        this.searchClearEl = document.getElementById('guideSearchClear');
        this.menuScrollEl = document.getElementById('guideMenuScroll');

        const btnClose = document.getElementById('guideBtnClose');
        if (btnClose) {
            btnClose.onclick = () => this.close();
        }

        const mobileToggle = document.getElementById('guideMobileMenuToggle');
        if (mobileToggle) {
            mobileToggle.onclick = () => {
                if (this.sidebarEl) {
                    this.sidebarEl.classList.toggle('mobile-open');
                }
            };
        }

        this.bindSearch();
        this.renderMenu();
    }

    /**
     * Pasang listener untuk tombol-tombol pembuka panduan di header
     */
    bindHeaderTriggers() {
        const triggers = document.querySelectorAll('#btnOpenGuide, .btn-guide-trigger');
        triggers.forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                this.open();
            };
        });
    }

    /**
     * Hubungkan input pencarian
     */
    bindSearch() {
        if (!this.searchInputEl) return;

        this.searchInputEl.oninput = (e) => {
            const query = e.target.value.trim();
            if (query.length > 0) {
                if (this.searchClearEl) this.searchClearEl.classList.add('show');
                this.isSearching = true;
                this.renderSearchResults(query);
            } else {
                if (this.searchClearEl) this.searchClearEl.classList.remove('show');
                this.isSearching = false;
                this.renderMenu();
            }
        };

        if (this.searchClearEl) {
            this.searchClearEl.onclick = () => {
                this.searchInputEl.value = '';
                this.searchClearEl.classList.remove('show');
                this.isSearching = false;
                this.renderMenu();
                this.searchInputEl.focus();
            };
        }
    }

    /**
     * Shortcut keyboard Escape untuk menutup drawer
     */
    bindGlobalKeys() {
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen && !this.isStandalone) {
                this.close();
            }
        });
    }

    /**
     * Expose global helper untuk Tips & Bantuan
     */
    exposeGlobalFunctions() {
        window.openGuide = (blockId) => {
            this.open(blockId);
        };
        window.closeGuide = () => {
            this.close();
        };
    }

    /**
     * Buka Drawer Panduan
     * @param {string} [blockId] ID blok spesifik yang ingin langsung dibuka
     */
    open(blockId) {
        if (this.isStandalone) {
            if (blockId) this.navigateToEntry(blockId);
            return;
        }

        if (!this.overlayEl) this.initDrawer();
        this.isOpen = true;
        this.overlayEl.classList.add('open');

        // Buka blok tertentu jika ditentukan, atau buka blok terakhir
        if (blockId) {
            this.navigateToEntry(blockId);
        } else if (!this.currentEntryId) {
            const history = getLastViewed();
            this.navigateToEntry(history.entryId || 'intro_workspace');
        } else {
            this.updateTabLink(this.currentEntryId);
        }
    }

    /**
     * Tutup Drawer Panduan
     */
    close() {
        if (this.isStandalone) return;
        this.isOpen = false;
        if (this.overlayEl) {
            this.overlayEl.classList.remove('open');
        }
        if (this.sidebarEl) {
            this.sidebarEl.classList.remove('mobile-open');
        }
    }

    /**
     * Pindah ke entri blok tertentu
     */
    navigateToEntry(entryId, shouldSave = true) {
        let entry = getEntryById(entryId);
        if (!entry) {
            entry = getEntryById('intro_workspace');
        }
        if (!entry) return;

        this.currentEntryId = entry.id;
        this.currentCategoryId = entry.kategoriId;

        if (shouldSave) {
            saveLastViewed(entry.id, entry.kategoriId);
        }

        // Update tombol tab baru
        this.updateTabLink(entry.id);

        // Tutup menu mobile jika sedang terbuka
        if (this.sidebarEl) {
            this.sidebarEl.classList.remove('mobile-open');
        }

        // Render konten entri
        this.renderEntryContent(entry);

        // Perbarui highlight pada sidebar
        this.updateSidebarActiveState();

        // Scroll konten ke atas
        if (this.contentEl) {
            this.contentEl.scrollTop = 0;
        }
    }

    /**
     * Update URL pada tombol "Buka di tab baru"
     */
    updateTabLink(blockId) {
        const btnTab = document.getElementById('guideBtnOpenTab');
        if (btnTab) {
            btnTab.href = `/panduan.html?block=${encodeURIComponent(blockId || 'intro_workspace')}`;
        }
    }

    /**
     * Render daftar kategori dan blok pada sidebar
     */
    renderMenu() {
        if (!this.menuScrollEl) return;

        const categories = getAllCategories();
        let html = '';

        categories.forEach(cat => {
            const isCatActive = cat.id === this.currentCategoryId;
            const expandedClass = isCatActive ? 'expanded' : '';

            html += `
                <div class="guide-cat-group ${expandedClass}" id="guideCatGroup_${cat.id}">
                    <button class="guide-cat-header" onclick="window._toggleGuideCat('${cat.id}')">
                        <div class="guide-cat-header-left">
                            <span class="guide-cat-dot" style="background-color: ${cat.warna};"></span>
                            <span>${cat.icon || '📁'} ${cat.nama}</span>
                        </div>
                        <span class="guide-cat-arrow">▶</span>
                    </button>
                    <ul class="guide-cat-items">
            `;

            if (Array.isArray(cat.entries)) {
                cat.entries.forEach(entry => {
                    const isActive = entry.id === this.currentEntryId;
                    const activeClass = isActive ? 'active' : '';
                    html += `
                        <li>
                            <button class="guide-cat-item-btn ${activeClass}" id="guideItemBtn_${entry.id}" onclick="window.openGuide('${entry.id}')" title="${entry.nama}">
                                <span>•</span> <span>${entry.nama}</span>
                            </button>
                        </li>
                    `;
                });
            }

            html += `
                    </ul>
                </div>
            `;
        });

        this.menuScrollEl.innerHTML = html;

        // Expose helper toggle kategori ke window
        window._toggleGuideCat = (catId) => {
            const group = document.getElementById(`guideCatGroup_${catId}`);
            if (group) {
                group.classList.toggle('expanded');
            }
        };
    }

    /**
     * Render hasil pencarian pada sidebar
     */
    renderSearchResults(query) {
        if (!this.menuScrollEl) return;

        const results = searchEntries(query);
        if (results.length === 0) {
            this.menuScrollEl.innerHTML = `
                <div style="padding: 24px 12px; text-align: center; color: var(--guide-text-muted); font-size: 0.88rem;">
                    🔍 Tidak ada blok atau instruksi yang cocok dengan <em>"${query}"</em>.
                </div>
            `;
            return;
        }

        let html = `<ul class="guide-search-results-list">`;
        results.forEach(entry => {
            const isActive = entry.id === this.currentEntryId;
            const activeClass = isActive ? 'active' : '';
            html += `
                <li>
                    <button class="guide-search-item-btn ${activeClass}" onclick="window.openGuide('${entry.id}')">
                        <div class="guide-search-item-title">${entry.nama}</div>
                        <div class="guide-search-item-cat" style="color: ${entry.kategoriWarna || '#38bdf8'};">
                            ${entry.kategoriIcon || '•'} Kategori: ${entry.kategori}
                        </div>
                    </button>
                </li>
            `;
        });
        html += `</ul>`;

        this.menuScrollEl.innerHTML = html;
    }

    /**
     * Perbarui highlight item yang sedang aktif di sidebar
     */
    updateSidebarActiveState() {
        if (this.isSearching) return;

        // Buka grup kategori aktif
        if (this.currentCategoryId) {
            const group = document.getElementById(`guideCatGroup_${this.currentCategoryId}`);
            if (group && !group.classList.contains('expanded')) {
                group.classList.add('expanded');
            }
        }

        // Tandai tombol item aktif
        document.querySelectorAll('.guide-cat-item-btn.active').forEach(b => b.classList.remove('active'));
        const activeBtn = document.getElementById(`guideItemBtn_${this.currentEntryId}`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    /**
     * Render satu entri blok secara lengkap di konten kanan
     */
    renderEntryContent(entry) {
        if (!this.contentEl) return;

        // Render Gambar / Placeholder
        let imagesHtml = '';
        if (Array.isArray(entry.gambar) && entry.gambar.length > 0) {
            imagesHtml = entry.gambar.map(imgName => {
                const imgSrc = `/assets/guide/${imgName}`;
                return `
                    <div class="guide-image-box">
                        <img src="${imgSrc}" alt="${entry.nama}" 
                             onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'guide-img-placeholder\\'><span class=\\'guide-img-placeholder-icon\\'>🖼️</span><div>Gambar belum tersedia</div><span class=\\'guide-img-placeholder-filename\\'>${imgName}</span></div>';">
                    </div>
                `;
            }).join('');
        }

        // Render Langkah-Langkah Pemakaian
        let stepsHtml = '';
        if (Array.isArray(entry.langkah) && entry.langkah.length > 0) {
            stepsHtml = `
                <div class="guide-section">
                    <div class="guide-section-title">📋 Cara Memakai (Langkah-Langkah)</div>
                    <ol class="guide-steps-list">
                        ${entry.langkah.map(step => `<li>${step}</li>`).join('')}
                    </ol>
                </div>
            `;
        }

        // Render Opsi Pengaturan Mutator ⚙️ (Jika ada)
        let mutatorHtml = '';
        if (entry.opsi && entry.opsi.langkah) {
            mutatorHtml = `
                <div class="guide-section">
                    <div class="guide-section-title">⚙️ ${entry.opsi.judul || 'Opsi Pengaturan (Mutator)'}</div>
                    <div class="guide-section-desc">${entry.opsi.deskripsi || ''}</div>
                    <div class="guide-mutator-box">
                        ${entry.opsi.langkah.map(st => `
                            <div class="guide-mutator-step-item">
                                <div class="guide-mutator-step-title">Langkah ${st.nomor}: ${st.judul}</div>
                                <div class="guide-mutator-step-desc">${st.penjelasan}</div>
                                ${st.gambar ? (
                                    Array.isArray(st.gambar) ? `
                                        <div class="guide-mutator-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px; margin: 8px 0;">
                                            ${st.gambar.map(img => {
                                                const isObj = typeof img === 'object' && img !== null;
                                                const src = isObj ? img.src : img;
                                                const caption = isObj ? img.caption : '';
                                                return `
                                                    <div style="display: flex; flex-direction: column;">
                                                        <div class="guide-image-box" style="margin: 0; min-height: 90px; padding: 10px; height: 100%;">
                                                            <img src="/assets/guide/${src}" alt="${caption || st.judul}"
                                                                 onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'guide-img-placeholder\\'><span class=\\'guide-img-placeholder-icon\\'>🖼️</span><div>Gambar belum tersedia</div><span class=\\'guide-img-placeholder-filename\\'>${src}</span></div>';">
                                                        </div>
                                                        ${caption ? `<div class="guide-image-caption" style="margin-top: 4px; font-size: 11px;">🔍 ${caption}</div>` : ''}
                                                    </div>
                                                `;
                                            }).join('')}
                                        </div>
                                    ` : `
                                        <div class="guide-image-box" style="margin: 8px 0; min-height: 90px; padding: 10px;">
                                            <img src="/assets/guide/${st.gambar}" alt="${st.judul}"
                                                 onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'guide-img-placeholder\\'><span class=\\'guide-img-placeholder-icon\\'>🖼️</span><div>Gambar belum tersedia</div><span class=\\'guide-img-placeholder-filename\\'>${st.gambar}</span></div>';">
                                        </div>
                                    `
                                ) : ''}
                                ${st.python ? `
                                    <div class="guide-code-box">
                                        <pre><code>${this.escapeHtml(st.python)}</code></pre>
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        // Render Contoh Susunan & Kode Python
        let exampleHtml = '';
        if (entry.contoh) {
            const renderSingleContoh = (c) => {
                const contohImages = Array.isArray(c.gambar)
                    ? c.gambar
                    : (c.gambar ? [c.gambar] : []);

                const imagesHtml = contohImages.map(img => {
                    const isObj = typeof img === 'object' && img !== null;
                    const src = isObj ? img.src : img;
                    const caption = isObj ? img.caption : '';
                    return `
                        <div style="margin: 10px 0;">
                            <div class="guide-image-box" style="margin: 0; min-height: 90px; padding: 12px;">
                                <img src="/assets/guide/${src}" alt="${caption || 'Contoh ' + entry.nama}"
                                     onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'guide-img-placeholder\\'><span class=\\'guide-img-placeholder-icon\\'>🖼️</span><div>Gambar belum tersedia</div><span class=\\'guide-img-placeholder-filename\\'>${src}</span></div>';">
                            </div>
                            ${caption ? `<div class="guide-image-caption">🔍 ${caption}</div>` : ''}
                        </div>
                    `;
                }).join('');

                return `
                    ${c.deskripsi ? `<div class="guide-section-desc" style="margin-bottom: 8px;">${c.deskripsi}</div>` : ''}
                    ${imagesHtml}
                    ${c.python ? `
                    <div class="guide-code-box" style="margin-top: 8px;">
                        <pre><code>${this.escapeHtml(c.python || '')}</code></pre>
                    </div>` : ''}
                `;
            };

            const content = Array.isArray(entry.contoh)
                ? entry.contoh.map(c => `<div class="guide-example-item" style="margin-bottom: 18px;">${renderSingleContoh(c)}</div>`).join('')
                : renderSingleContoh(entry.contoh);

            exampleHtml = `
                <div class="guide-section">
                    <div class="guide-section-title">💡 Contoh Susunan & Hasil Kode Python</div>
                    ${content}
                </div>
            `;
        }

        // Render Kesalahan Umum
        let pitfallsHtml = '';
        if (Array.isArray(entry.kesalahanUmum) && entry.kesalahanUmum.length > 0) {
            pitfallsHtml = `
                <div class="guide-section">
                    <div class="guide-section-title">⚠️ Kesalahan Umum yang Sering Terjadi</div>
                    <div class="guide-pitfall-box">
                        <ul class="guide-pitfall-list">
                            ${entry.kesalahanUmum.map(p => `<li>${p}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
        }

        // Render Lihat Juga (Cross-links)
        let seeAlsoHtml = '';
        if (Array.isArray(entry.lihatJuga) && entry.lihatJuga.length > 0) {
            seeAlsoHtml = `
                <div class="guide-section" style="margin-top: 24px;">
                    <div class="guide-section-title">🔗 Lihat Juga</div>
                    <div class="guide-see-also-list">
                        ${entry.lihatJuga.map(refId => {
                            const ref = getEntryById(refId);
                            const label = ref ? ref.nama : refId;
                            return `
                                <button class="guide-link-pill" onclick="window.openGuide('${refId}')">
                                    <span>👉</span> <span>${label}</span>
                                </button>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }

        // Navigasi Sebelumnya / Berikutnya dalam Kategori yang sama
        const adj = getAdjacentEntries(entry.id);
        const prevBtn = adj.prev ? `
            <button class="guide-nav-btn" onclick="window.openGuide('${adj.prev.id}')" title="${adj.prev.nama}">
                <span>◀</span> <span>Sebelumnya: <strong>${adj.prev.nama}</strong></span>
            </button>
        ` : `<button class="guide-nav-btn" disabled><span>◀</span> <span>Sebelumnya</span></button>`;

        const nextBtn = adj.next ? `
            <button class="guide-nav-btn" onclick="window.openGuide('${adj.next.id}')" title="${adj.next.nama}">
                <span>Berikutnya: <strong>${adj.next.nama}</strong></span> <span>▶</span>
            </button>
        ` : `<button class="guide-nav-btn" disabled><span>Berikutnya</span> <span>▶</span></button>`;

        this.contentEl.innerHTML = `
            <article class="guide-entry-card">
                <header class="guide-entry-header">
                    <div class="guide-entry-top-meta">
                        <span class="guide-cat-pill" style="border-color: ${entry.kategoriWarna || '#38bdf8'};">
                            <span style="color: ${entry.kategoriWarna || '#38bdf8'};">${entry.kategoriIcon || '•'}</span>
                            <span>Kategori: ${entry.kategori}</span>
                        </span>
                    </div>
                    <h1 class="guide-entry-title">${entry.nama}</h1>
                </header>

                ${imagesHtml}

                <div class="guide-section">
                    <div class="guide-section-title">🎯 Fungsi</div>
                    <div class="guide-section-desc">${entry.fungsi}</div>
                </div>

                <div class="guide-section">
                    <div class="guide-section-title">🚀 Kegunaan dalam Pemrograman</div>
                    <div class="guide-section-desc">${entry.kegunaan}</div>
                </div>

                ${stepsHtml}
                ${mutatorHtml}
                ${exampleHtml}
                ${pitfallsHtml}
                ${seeAlsoHtml}

                <footer class="guide-nav-footer">
                    ${prevBtn}
                    ${nextBtn}
                </footer>
            </article>
        `;
    }

    /**
     * Escape karakter HTML untuk blok kode
     */
    escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
}

// Inisialisasi instance singleton
export const guide = new GuideManager();

// Auto-inisialisasi saat dokumen HTML siap
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        // Cek apakah halaman adalah panduan.html standalone
        const isStandalone = !!document.getElementById('guideStandaloneContainer');
        guide.init({ isStandalone });
    });
}
