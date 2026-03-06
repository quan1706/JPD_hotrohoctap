(function () {
    let vocabData = [];
    let displayBox = null;
    let isMinimized = true;
    let currentAnswer = { word: '-', reading: '-', meaning: '-' };

    const createUI = () => {
        if (displayBox) return;
        displayBox = document.createElement('div');
        displayBox.id = 'jpd-stealth-helper';
        displayBox.innerHTML = `
            <div id="jpd-main-container" style="position: fixed; bottom: 16px; right: 16px; z-index: 2147483647; font-family: 'Segoe UI', sans-serif; transition: all 0.3s ease;">

                <!-- Nút bong bóng nhỏ xíu -->
                <div id="jpd-trigger" style="
                    width: 24px; height: 24px;
                    background: rgba(210, 140, 80, 0.25);
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    border: 1px solid rgba(200, 130, 60, 0.15);
                    transition: all 0.3s ease;
                    opacity: 0.5;
                ">
                    <span style="font-size: 9px; color: rgba(180, 120, 50, 0.4);">●</span>
                </div>

                <!-- Panel nhỏ gọn -->
                <div id="jpd-panel" style="
                    display: none;
                    margin-bottom: 6px;
                    background: rgba(255, 248, 240, 0.95);
                    border-radius: 8px 8px 2px 8px;
                    box-shadow: 0 2px 10px rgba(180, 120, 50, 0.1);
                    width: 180px;
                    overflow: hidden;
                    animation: jpd-slide-up 0.25s ease;
                    border: 1px solid rgba(220, 160, 80, 0.2);
                    backdrop-filter: blur(8px);
                ">
                    <!-- Header nhỏ -->
                    <div style="
                        background: linear-gradient(135deg, rgba(230, 150, 60, 0.85), rgba(200, 120, 50, 0.85));
                        padding: 4px 8px;
                        display: flex; justify-content: space-between; align-items: center;
                    ">
                        <span id="jpd-stt-tiny" style="font-size: 9px; color: rgba(255,255,255,0.8);">Đang tải...</span>
                        <div style="display: flex; align-items: center; gap: 4px;">
                            <span id="jpd-copy-btn" title="C" style="
                                cursor: pointer; font-size: 9px; color: rgba(255,255,255,0.7);
                                padding: 1px 4px; border-radius: 3px;
                                background: rgba(255,255,255,0.1);
                                transition: background 0.2s;
                            ">📋</span>
                            <span id="jpd-close-stealth" title="F1" style="
                                cursor: pointer; font-size: 11px; color: rgba(255,255,255,0.6);
                                padding: 1px 4px; border-radius: 3px;
                                background: rgba(255,255,255,0.08);
                                transition: background 0.2s;
                            ">✕</span>
                        </div>
                    </div>

                    <!-- Body -->
                    <div style="padding: 8px;">
                        <!-- Answer chính -->
                        <div style="
                            background: rgba(240, 170, 80, 0.08);
                            border-left: 2px solid rgba(220, 150, 60, 0.5);
                            border-radius: 0 6px 6px 0;
                            padding: 5px 8px;
                            margin-bottom: 6px;
                        ">
                            <div style="font-size: 8px; color: #bbb; text-transform: uppercase; letter-spacing: 0.4px; margin-bottom: 2px;">ANS</div>
                            <div id="jpd-ans-r" style="font-size: 14px; font-weight: 600; color: #8B5E34;">-</div>
                        </div>

                        <!-- Chi tiết nhỏ -->
                        <div style="display: flex; gap: 4px;">
                            <div style="
                                flex: 1;
                                background: rgba(245, 235, 220, 0.6);
                                border-radius: 4px;
                                padding: 4px 6px;
                                text-align: center;
                            ">
                                <div style="font-size: 7px; color: #ccc; text-transform: uppercase; margin-bottom: 1px;">漢字</div>
                                <div id="jpd-ans-w" style="font-size: 11px; font-weight: 500; color: #7a5230;">-</div>
                            </div>
                            <div style="
                                flex: 1.2;
                                background: rgba(245, 235, 220, 0.6);
                                border-radius: 4px;
                                padding: 4px 6px;
                                text-align: center;
                            ">
                                <div style="font-size: 7px; color: #ccc; text-transform: uppercase; margin-bottom: 1px;">意味</div>
                                <div id="jpd-ans-m" style="font-size: 10px; font-weight: 400; color: #9a7a55;">-</div>
                            </div>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div style="
                        padding: 3px 8px 4px;
                        background: rgba(245, 235, 220, 0.4);
                        border-top: 1px solid rgba(220, 180, 120, 0.1);
                        display: flex; justify-content: space-between;
                        font-size: 7px; color: #ccc;
                    ">
                        <span>F1 · C</span>
                        <span id="jpd-copy-toast" style="color: #b8860b; font-weight: 600; opacity: 0; transition: opacity 0.3s;">OK</span>
                    </div>
                </div>
            </div>

            <style>
                @keyframes jpd-slide-up {
                    from { opacity: 0; transform: translateY(6px) scale(0.96); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes jpd-slide-down {
                    from { opacity: 1; transform: translateY(0) scale(1); }
                    to   { opacity: 0; transform: translateY(6px) scale(0.96); }
                }
                #jpd-trigger:hover {
                    opacity: 0.8 !important;
                    transform: scale(1.05);
                }
                #jpd-copy-btn:hover { background: rgba(255,255,255,0.25) !important; }
                #jpd-close-stealth:hover { background: rgba(255,255,255,0.2) !important; }
            </style>
        `;
        document.body.appendChild(displayBox);

        const trigger = document.getElementById('jpd-trigger');
        const panel = document.getElementById('jpd-panel');
        const close = document.getElementById('jpd-close-stealth');
        const copyBtn = document.getElementById('jpd-copy-btn');

        trigger.onclick = () => togglePanel();

        close.onclick = (e) => {
            e.stopPropagation();
            if (!isMinimized) togglePanel();
        };

        copyBtn.onclick = (e) => {
            e.stopPropagation();
            copyAnswer();
        };

        // Kéo thả
        const container = document.getElementById('jpd-main-container');
        let isDown = false, offset = [0, 0];
        trigger.onmousedown = (e) => {
            isDown = true;
            offset = [container.offsetLeft - e.clientX, container.offsetTop - e.clientY];
        };
        document.onmousemove = (e) => {
            if (!isDown) return;
            container.style.left = (e.clientX + offset[0]) + 'px';
            container.style.top = (e.clientY + offset[1]) + 'px';
            container.style.right = 'auto';
            container.style.bottom = 'auto';
        };
        document.onmouseup = () => isDown = false;

        // Phím tắt
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F1') {
                e.preventDefault();
                e.stopPropagation();
                togglePanel();
            }
            if ((e.key === 'c' || e.key === 'C') && !e.ctrlKey && !e.metaKey) {
                const tag = document.activeElement?.tagName?.toLowerCase();
                if (tag !== 'input' && tag !== 'textarea' && !document.activeElement?.isContentEditable) {
                    e.preventDefault();
                    copyAnswer();
                }
            }
        }, true);
    };

    const togglePanel = () => {
        const panel = document.getElementById('jpd-panel');
        const trigger = document.getElementById('jpd-trigger');
        isMinimized = !isMinimized;

        if (isMinimized) {
            panel.style.animation = 'jpd-slide-down 0.2s ease forwards';
            setTimeout(() => { panel.style.display = 'none'; }, 200);
            trigger.style.opacity = '0.5';
            trigger.style.background = 'rgba(210, 140, 80, 0.25)';
        } else {
            panel.style.display = 'block';
            panel.style.animation = 'jpd-slide-up 0.25s ease';
            trigger.style.opacity = '0.75';
            trigger.style.background = 'rgba(220, 150, 60, 0.45)';
        }
    };

    const copyAnswer = () => {
        const text = currentAnswer.reading || '-';
        navigator.clipboard.writeText(text).then(() => {
            showCopyToast();
        }).catch(() => {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.left = '-9999px';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            showCopyToast();
        });
    };

    const showCopyToast = () => {
        const toast = document.getElementById('jpd-copy-toast');
        if (toast) {
            toast.style.opacity = '1';
            setTimeout(() => { toast.style.opacity = '0'; }, 1000);
        }
    };

    const loadVocab = async () => {
        try {
            const resources = performance.getEntriesByType('resource');
            const dataScript = resources.find(r => r.name.includes('japaneseData'));
            let scriptUrl = dataScript ? dataScript.name : '';

            if (!scriptUrl) {
                const scripts = Array.from(document.querySelectorAll('script, link[rel="modulepreload"]'))
                    .map(el => el.src || el.href)
                    .filter(url => url && url.includes('japaneseData'));
                if (scripts.length > 0) scriptUrl = scripts[0];
            }

            if (!scriptUrl) return;

            const res = await fetch(scriptUrl);
            const text = await res.text();

            const results = [];
            const objRegex = /\{[^{}]*?\}/g;
            const matches = text.match(objRegex);

            if (matches) {
                matches.forEach(objStr => {
                    const wordMatch = objStr.match(/word\s*:\s*["']([^"']+)["']/) || objStr.match(/word\s*:\s*([^,}]+)/);
                    const readingMatch = objStr.match(/reading\s*:\s*["']([^"']+)["']/) || objStr.match(/reading\s*:\s*([^,}]+)/);
                    const meaningMatch = objStr.match(/meaning\s*:\s*["']([^"']+)["']/) || objStr.match(/meaning\s*:\s*([^,}]+)/);
                    if (wordMatch && readingMatch && meaningMatch) {
                        results.push({
                            word: wordMatch[1].replace(/["']/g, '').trim(),
                            reading: readingMatch[1].replace(/["']/g, '').trim(),
                            meaning: meaningMatch[1].replace(/["']/g, '').trim()
                        });
                    }
                });
            }

            if (results.length > 0) {
                vocabData = results;
                const stt = document.getElementById('jpd-stt-tiny');
                if (stt) {
                    stt.innerText = `${vocabData.length} mục`;
                    stt.style.color = 'rgba(255,255,255,0.9)';
                }
            }
        } catch (err) { }
    };

    const scanPage = () => {
        if (vocabData.length === 0) return;
        const elements = Array.from(document.querySelectorAll('h1, h2, h3, div, span, p'));
        for (const el of elements) {
            if (el.children.length === 0 && el.innerText.trim().length > 0 && el.innerText.trim().length < 80) {
                const txt = el.innerText.trim();
                const match = vocabData.find(v =>
                    (v.meaning && v.meaning.toLowerCase() === txt.toLowerCase()) ||
                    (v.word && v.word === txt) ||
                    (v.reading && v.reading.toLowerCase() === txt.toLowerCase())
                );
                if (match) {
                    currentAnswer = match;
                    document.getElementById('jpd-ans-r').innerText = match.reading || '-';
                    document.getElementById('jpd-ans-w').innerText = match.word || '-';
                    document.getElementById('jpd-ans-m').innerText = match.meaning || '-';
                    return;
                }
            }
        }
    };

    createUI();
    loadVocab();
    setInterval(loadVocab, 5000);
    setInterval(scanPage, 1000);
})();
