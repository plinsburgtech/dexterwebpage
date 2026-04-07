/* ===== CONFIG ===== */
const GITHUB_REPO_DEFAULT = 'plinsburgtech/dexterwebpage';
const GITHUB_BRANCH = 'main';
const PRODUCTS_CACHE_KEY = 'dexterProductsCache';
const PRODUCTS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/* ===== STATE ===== */
let products = [];
let currentLanguage = localStorage.getItem('dexterLanguage') || 'pl';
let editingProductId = null;

function getGithubToken() {
    return sessionStorage.getItem('githubToken') || '';
}
function getGithubRepo() {
    return sessionStorage.getItem('githubRepo') || '';
}

/* ===== TRANSLATIONS ===== */
const translations = {
    pl: {
        navHome: "Strona główna",
        navAbout: "O mnie",
        navPortfolio: "Moje prace",
        navContact: "Kontakt",
        heroSubtitle: "Najlepszy serwis po tej stronie Rio Grande",
        heroButton: "Zobacz prace",
        aboutTitle: "O mnie",
        aboutText1: "Od 2007 roku zajmuję się serwisem replik snajperskich i gazowych. Tworzę projekty na indywidualne zamówienie jak i na sprzedaż, według moich pomysłów. W pracy opieram się wyłącznie na najwyższej jakości częściach uznanych producentów, używam wysokiej jakości narzędzi i materiałów, współpracuję z wybitnymi specjalistami w swoich dziedzinach. Wkładam wiele wysiłku w idealne dopracowanie każdego zlecenia.",
        aboutText2: "Szerokie zaplecze warsztatowe pozwala mi zapewnić klientowi szybką i kompleksową usługę, włącznie z wykonaniem elementów na zamówienie lub według własnego pomysłu. Toczenie, frezowanie, cięcie i grawerowanie laserem, spawanie, szlifowanie, wiercenie, gwintowanie itp. leżące w zakresie moich możliwości pozwalają mi wykonywać powierzone prace w sposób profesjonalny, bez uciekania się do metod zastępczych jak druk 3D czy byle jaka rzeźba ręcznymi narzędziami.",
        aboutText3: "Przede wszystkim- jakość. Nie konkuruję ceną- jest i będzie drogo.",
        portfolioTitle: "Moje prace",
        contactTitle: "Kontakt",
        contactPhone: "Telefon",
        contactAddress: "Adres",
        contactInquiries: "Zapytania",
        contactInquiriesText: "Skontaktuj się ze mną w sprawie pracy niestandardowej lub aktualnej dostępności",
        statusAvailable: "Dostępne do zakupu",
        statusSold: "Sprzedane",
        adminBtn: "Zarządzanie",
        adminTitle: "Zarządzanie katalogiem produktów",
        githubConfigTitle: "Konfiguracja GitHub",
        githubTokenLabel: "GitHub Token:",
        githubTokenHelp: "Potrzebny do zapisywania zmian. Utwórz CLASSIC token w GitHub Settings > Developer settings > Personal access tokens (classic) z uprawnieniami 'repo'",
        githubRepoLabel: "Nazwa repozytorium:",
        githubRepoHelp: "Format: username/repository-name",
        testConnectionBtn: "Testuj połączenie",
        saveConfigBtn: "Zapisz konfigurację",
        addProjectTitle: "Dodaj nowy produkt",
        editProjectTitle: "Edytuj produkt",
        projectNameLabel: "Nazwa produktu:",
        descriptionLabel: "Opis:",
        specsLabel: "Specyfikacje (oddzielone przecinkami):",
        imageLabel: "Zdjęcie produktu:",
        statusLabel: "Status:",
        yearLabel: "Rok:",
        addBtn: "Dodaj produkt",
        saveBtn: "Zapisz zmiany",
        cancelEditBtn: "Anuluj",
        currentProjectsTitle: "Obecne produkty",
        refreshBtn: "Odśwież z GitHub",
        statusAvailableOption: "Dostępne do zakupu",
        statusSoldOption: "Sprzedane",
        deleteBtn: "Usuń",
        editBtn: "Edytuj",
        toggleToSold: "→ Sprzedane",
        toggleToAvailable: "→ Dostępne",
        footerText: "\u00a9 2026 SERWIS DEXTERA JACEK REITER. Serwis sprzętu sportowego w Krakowie.",
        imageHelp: "Maksymalny rozmiar: 2MB. Obsługiwane formaty: JPG, PNG, WebP",
        confirmDelete: "Czy na pewno chcesz usunąć ten produkt?",
        productAdded: "Produkt dodany pomyślnie!",
        productUpdated: "Produkt zaktualizowany!",
        productDeleted: "Produkt usunięty!",
        noConfig: "Brak konfiguracji GitHub",
        connectionOk: "Połączenie z GitHub działa!",
        connectionNoWrite: "Połączenie działa, ale brak uprawnień do zapisu. Użyj CLASSIC token z uprawnieniami 'repo'.",
        configSaved: "Konfiguracja zapisana",
        savedToGithub: "Produkty zapisane do GitHub",
        fillAllFields: "Wypełnij wszystkie pola",
        enterToken: "Podaj GitHub Token aby uzyskać dostęp:",
        invalidToken: "Nieprawidłowy token — brak dostępu do repozytorium.",
        keepCurrentImage: "Obecne zdjęcie zostanie zachowane. Wybierz nowe aby je zastąpić.",
        pageTitle: "Dexter — Serwis sprzętu sportowego"
    },
    en: {
        navHome: "Home",
        navAbout: "About me",
        navPortfolio: "My Work",
        navContact: "Contact",
        heroSubtitle: "Best service this side of the Rio Grande",
        heroButton: "View My Work",
        aboutTitle: "About Me",
        aboutText1: "Since 2007, I have been servicing sniper and gas-powered replicas. I create custom designs and designs for sale, based on my own ideas. In my work, I rely exclusively on the highest quality parts from renowned manufacturers, use high-quality tools and materials, and collaborate with leading specialists in their fields. I put a great deal of effort into perfecting each order.",
        aboutText2: "My extensive workshop facilities allow me to provide clients with fast and comprehensive service, including custom-made components or custom-made designs. Turning, milling, laser cutting and engraving, welding, grinding, drilling, threading, and more, all within my capabilities, allow me to perform assigned work professionally, without resorting to substitute methods like 3D printing or sloppy hand-tool carving.",
        aboutText3: "First and foremost, quality. I don't compete on price\u2014it is and will remain expensive.",
        portfolioTitle: "My Work",
        contactTitle: "Contact",
        contactPhone: "Phone",
        contactAddress: "Location",
        contactInquiries: "Inquiries",
        contactInquiriesText: "Contact me for custom work or current availability",
        statusAvailable: "Available for Purchase",
        statusSold: "Sold",
        adminBtn: "Management",
        adminTitle: "Product Catalog Management",
        githubConfigTitle: "GitHub Configuration",
        githubTokenLabel: "GitHub Token:",
        githubTokenHelp: "Required for saving changes. Create CLASSIC token in GitHub Settings > Developer settings > Personal access tokens (classic) with 'repo' permissions",
        githubRepoLabel: "Repository name:",
        githubRepoHelp: "Format: username/repository-name",
        testConnectionBtn: "Test connection",
        saveConfigBtn: "Save configuration",
        addProjectTitle: "Add new product",
        editProjectTitle: "Edit product",
        projectNameLabel: "Product name:",
        descriptionLabel: "Description:",
        specsLabel: "Specifications (comma separated):",
        imageLabel: "Product image:",
        statusLabel: "Status:",
        yearLabel: "Year:",
        addBtn: "Add product",
        saveBtn: "Save changes",
        cancelEditBtn: "Cancel",
        currentProjectsTitle: "Current products",
        refreshBtn: "Refresh from GitHub",
        statusAvailableOption: "Available for purchase",
        statusSoldOption: "Sold",
        deleteBtn: "Delete",
        editBtn: "Edit",
        toggleToSold: "\u2192 Sold",
        toggleToAvailable: "\u2192 Available",
        footerText: "\u00a9 2026 DEXTER SERVICE JACEK REITER. Sports equipment service in Krak\u00f3w.",
        imageHelp: "Maximum size: 2MB. Supported formats: JPG, PNG, WebP",
        confirmDelete: "Are you sure you want to delete this product?",
        productAdded: "Product added successfully!",
        productUpdated: "Product updated!",
        productDeleted: "Product deleted!",
        noConfig: "GitHub not configured",
        connectionOk: "GitHub connection works!",
        connectionNoWrite: "Connection works, but no write permissions. Use CLASSIC token with 'repo' permissions.",
        configSaved: "Configuration saved",
        savedToGithub: "Products saved to GitHub",
        fillAllFields: "Fill in all fields",
        enterToken: "Enter GitHub Token for access:",
        invalidToken: "Invalid token \u2014 no access to repository.",
        keepCurrentImage: "Current image will be kept. Select a new one to replace it.",
        pageTitle: "Dexter \u2014 Custom Gunsmith Services"
    }
};

function t(key) {
    return translations[currentLanguage][key] || key;
}

/* ===== GITHUB API ===== */

async function githubFetch(url, options = {}) {
    const token = getGithubToken();
    const headers = { 'Accept': 'application/vnd.github.v3+json' };
    if (token) headers['Authorization'] = `token ${token}`;
    if (options.body) headers['Content-Type'] = 'application/json';
    return fetch(url, { ...options, headers: { ...headers, ...(options.headers || {}) } });
}

function repoApiUrl(path) {
    const repo = getGithubRepo() || GITHUB_REPO_DEFAULT;
    return `https://api.github.com/repos/${repo}/contents/${path}`;
}

async function getFileSha(path) {
    try {
        const resp = await githubFetch(repoApiUrl(path) + `?ref=${GITHUB_BRANCH}`);
        if (resp.ok) return (await resp.json()).sha;
    } catch { /* file doesn't exist */ }
    return null;
}

async function uploadFileToGithub(path, base64Content, commitMessage) {
    const sha = await getFileSha(path);
    const payload = { message: commitMessage, content: base64Content, branch: GITHUB_BRANCH };
    if (sha) payload.sha = sha;
    const resp = await githubFetch(repoApiUrl(path), {
        method: 'PUT',
        body: JSON.stringify(payload)
    });
    if (!resp.ok) throw new Error(`GitHub PUT ${resp.status}: ${await resp.text()}`);
    return resp.json();
}

async function deleteFileFromGithub(path, commitMessage) {
    const sha = await getFileSha(path);
    if (!sha) return;
    const resp = await githubFetch(repoApiUrl(path), {
        method: 'DELETE',
        body: JSON.stringify({ message: commitMessage, sha, branch: GITHUB_BRANCH })
    });
    if (!resp.ok && resp.status !== 404) {
        throw new Error(`GitHub DELETE ${resp.status}`);
    }
}

/* ===== BASE64 ENCODING (chunked, no stack overflow) ===== */

function uint8ToBase64(bytes) {
    const CHUNK = 0x8000;
    const parts = [];
    for (let i = 0; i < bytes.length; i += CHUNK) {
        parts.push(String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK)));
    }
    return btoa(parts.join(''));
}

/* ===== PRODUCTS CACHE ===== */

function getCachedProducts() {
    try {
        const raw = sessionStorage.getItem(PRODUCTS_CACHE_KEY);
        if (!raw) return null;
        const cached = JSON.parse(raw);
        if (Date.now() - cached.ts > PRODUCTS_CACHE_TTL) {
            sessionStorage.removeItem(PRODUCTS_CACHE_KEY);
            return null;
        }
        return cached.data;
    } catch {
        return null;
    }
}

function setCachedProducts(data) {
    try {
        sessionStorage.setItem(PRODUCTS_CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
    } catch { /* storage full, ignore */ }
}

function invalidateProductsCache() {
    sessionStorage.removeItem(PRODUCTS_CACHE_KEY);
}

/* ===== PRODUCTS: LOAD / SAVE ===== */

async function loadProducts() {
    // Try cache first
    const cached = getCachedProducts();
    if (cached) {
        products = cached;
        render();
        return;
    }

    const repo = getGithubRepo() || GITHUB_REPO_DEFAULT;
    try {
        const resp = await githubFetch(`https://api.github.com/repos/${repo}/contents/products.json?ref=${GITHUB_BRANCH}`);
        if (resp.ok) {
            const data = await resp.json();
            const raw = atob(data.content);
            const bytes = Uint8Array.from(raw, c => c.charCodeAt(0));
            products = JSON.parse(new TextDecoder().decode(bytes));
            setCachedProducts(products);
        } else {
            products = [];
        }
    } catch (err) {
        console.error('Error loading products:', err);
        products = [];
    }
    render();
}

async function saveProducts(commitMsg) {
    const token = getGithubToken();
    const repo = getGithubRepo();
    if (!token || !repo) {
        showStatus(t('noConfig'), 'error');
        return false;
    }
    showLoading(true);
    try {
        const jsonStr = JSON.stringify(products, null, 2);
        const encoded = new TextEncoder().encode(jsonStr);
        const base64 = uint8ToBase64(encoded);
        await uploadFileToGithub('products.json', base64, commitMsg || `Update products.json - ${new Date().toISOString()}`);
        invalidateProductsCache();
        setCachedProducts(products);
        showStatus(t('savedToGithub'), 'success');
        return true;
    } catch (err) {
        console.error('Error saving products:', err);
        showStatus(`Error: ${err.message}`, 'error');
        return false;
    } finally {
        showLoading(false);
    }
}

/* ===== IMAGE PROCESSING ===== */

function processImageFile(file) {
    return new Promise((resolve, reject) => {
        if (file.size > 2 * 1024 * 1024) {
            reject(currentLanguage === 'pl' ? 'Plik jest zbyt duży! Maksymalny rozmiar: 2MB' : 'File is too large! Maximum size: 2MB');
            return;
        }
        if (!file.type.startsWith('image/')) {
            reject(currentLanguage === 'pl' ? 'Nieprawidłowy typ pliku!' : 'Invalid file type!');
            return;
        }
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.onload = function () {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const maxW = 800, maxH = 600;
                let { width, height } = img;
                if (width > height) {
                    if (width > maxW) { height = (height * maxW) / width; width = maxW; }
                } else {
                    if (height > maxH) { width = (width * maxH) / height; height = maxH; }
                }
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg', 0.8));
            };
            img.src = e.target.result;
        };
        reader.onerror = () => reject('Error reading file');
        reader.readAsDataURL(file);
    });
}

async function uploadImageToGithub(productId, dataUrl) {
    const match = dataUrl.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!match) throw new Error('Invalid image data');
    const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
    const base64 = match[2];
    const path = `images/${productId}.${ext}`;
    await uploadFileToGithub(path, base64, `Upload image: ${productId}`);
    return path;
}

/* ===== UI HELPERS ===== */

function showStatus(message, type) {
    const el = document.getElementById('statusIndicator');
    if (!el) return;
    el.textContent = message;
    el.className = `status-indicator status-${type}`;
    el.style.display = 'block';
    setTimeout(() => { el.style.display = 'none'; }, 5000);
}

function showLoading(show) {
    const el = document.getElementById('loadingSpinner');
    if (el) el.style.display = show ? 'block' : 'none';
}

function generateId() {
    return crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

/* ===== SAFE DOM ===== */

function createEl(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
        if (k === 'className') el.className = v;
        else if (k === 'textContent') el.textContent = v;
        else if (k === 'onclick') el.addEventListener('click', v);
        else if (k === 'href') el.setAttribute('href', v);
        else if (k === 'src') el.setAttribute('src', v);
        else if (k === 'alt') el.setAttribute('alt', v);
        else if (k === 'loading') el.setAttribute('loading', v);
        else el.setAttribute(k, v);
    }
    for (const child of children) {
        if (typeof child === 'string') el.appendChild(document.createTextNode(child));
        else if (child) el.appendChild(child);
    }
    return el;
}

function resolveImageSrc(product) {
    if (!product.image) return null;
    if (product.image.startsWith('data:')) return product.image;
    if (product.image.startsWith('http')) return product.image;
    const repo = getGithubRepo() || GITHUB_REPO_DEFAULT;
    return `https://raw.githubusercontent.com/${repo}/${GITHUB_BRANCH}/${product.image}`;
}

/* ===== RENDER: PORTFOLIO (public) ===== */

function renderPortfolio() {
    const grid = document.getElementById('portfolioGrid');
    if (!grid) return;
    grid.replaceChildren();

    products.forEach(product => {
        const statusClass = product.status === 'available' ? 'status-available' : 'status-sold';
        const statusText = product.status === 'available' ? t('statusAvailable') : t('statusSold');
        const imgSrc = resolveImageSrc(product);

        const imageDiv = createEl('div', { className: 'portfolio-image' });
        if (imgSrc) {
            imageDiv.appendChild(createEl('img', { src: imgSrc, alt: product.title, loading: 'lazy' }));
        }

        const specsDiv = createEl('div', { className: 'portfolio-specs' });
        (product.specs || []).forEach(spec => {
            specsDiv.appendChild(createEl('span', { className: 'spec-tag', textContent: spec }));
        });
        if (product.year) {
            specsDiv.appendChild(createEl('span', { className: 'spec-tag', textContent: product.year }));
        }

        const contentDiv = createEl('div', { className: 'portfolio-content' }, [
            createEl('div', { className: 'portfolio-title', textContent: product.title }),
            createEl('div', { className: 'portfolio-description', textContent: product.description }),
            specsDiv,
            createEl('div', { className: `portfolio-status ${statusClass}`, textContent: statusText })
        ]);

        const card = createEl('div', { className: 'portfolio-item' }, [imageDiv, contentDiv]);
        grid.appendChild(card);
    });
}

/* ===== RENDER: ADMIN PRODUCTS LIST ===== */

function renderProjectsList() {
    const list = document.getElementById('projectsList');
    if (!list) return;
    list.replaceChildren();

    products.forEach((product, index) => {
        const statusText = product.status === 'available' ? t('statusAvailableOption') : t('statusSoldOption');

        const btnGroup = createEl('div', { className: 'project-actions' });

        if (index > 0) {
            btnGroup.appendChild(createEl('button', {
                className: 'btn btn-small',
                textContent: '\u2191',
                'aria-label': 'Move up',
                onclick: () => moveProduct(product.id, -1)
            }));
        }
        if (index < products.length - 1) {
            btnGroup.appendChild(createEl('button', {
                className: 'btn btn-small',
                textContent: '\u2193',
                'aria-label': 'Move down',
                onclick: () => moveProduct(product.id, 1)
            }));
        }

        const toggleLabel = product.status === 'available' ? t('toggleToSold') : t('toggleToAvailable');
        btnGroup.appendChild(createEl('button', {
            className: 'btn btn-small btn-toggle',
            textContent: toggleLabel,
            onclick: () => toggleProductStatus(product.id)
        }));

        btnGroup.appendChild(createEl('button', {
            className: 'btn btn-small',
            textContent: t('editBtn'),
            onclick: () => startEditProduct(product.id)
        }));

        btnGroup.appendChild(createEl('button', {
            className: 'btn btn-small btn-danger',
            textContent: t('deleteBtn'),
            onclick: () => removeProduct(product.id)
        }));

        const item = createEl('div', { className: 'project-item' }, [
            createEl('h4', { textContent: product.title }),
            createEl('p', { textContent: `${t('statusLabel')} ${statusText}` }),
            createEl('p', { textContent: `${t('yearLabel')} ${product.year || ''}` }),
            btnGroup
        ]);

        list.appendChild(item);
    });
}

function render() {
    renderPortfolio();
    renderProjectsList();
}

/* ===== CRUD OPERATIONS ===== */

async function addProduct(data) {
    const id = generateId();
    const product = { id, ...data };

    if (product.image && product.image.startsWith('data:')) {
        showLoading(true);
        try {
            product.image = await uploadImageToGithub(id, product.image);
        } catch (err) {
            console.error('Image upload failed:', err);
            showStatus(`Image upload error: ${err.message}`, 'error');
            showLoading(false);
            return;
        }
        showLoading(false);
    }

    products.push(product);
    await saveProducts(`Add product: ${product.title}`);
    render();
}

async function updateProduct(id, data) {
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) return;

    const product = products[idx];

    if (data.image && data.image.startsWith('data:')) {
        showLoading(true);
        try {
            if (product.image && product.image.startsWith('images/')) {
                await deleteFileFromGithub(product.image, `Remove old image for ${id}`).catch(() => {});
            }
            data.image = await uploadImageToGithub(id, data.image);
        } catch (err) {
            console.error('Image upload failed:', err);
            showStatus(`Image upload error: ${err.message}`, 'error');
            showLoading(false);
            return;
        }
        showLoading(false);
    } else if (!data.image) {
        data.image = product.image;
    }

    products[idx] = { ...product, ...data };
    await saveProducts(`Update product: ${products[idx].title}`);
    render();
}

async function removeProduct(id) {
    if (!confirm(t('confirmDelete'))) return;

    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) return;

    const product = products[idx];

    if (product.image && product.image.startsWith('images/')) {
        await deleteFileFromGithub(product.image, `Remove image for ${product.title}`).catch(() => {});
    }

    products.splice(idx, 1);
    await saveProducts(`Delete product: ${product.title}`);
    render();
    showStatus(t('productDeleted'), 'success');
}

async function toggleProductStatus(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    product.status = product.status === 'available' ? 'sold' : 'available';
    await saveProducts(`Toggle status: ${product.title} \u2192 ${product.status}`);
    render();
}

async function moveProduct(id, direction) {
    const idx = products.findIndex(p => p.id === id);
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= products.length) return;
    [products[idx], products[newIdx]] = [products[newIdx], products[idx]];
    await saveProducts('Reorder products');
    render();
}

/* ===== EDIT MODE ===== */

function startEditProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    editingProductId = id;

    document.getElementById('projectTitle').value = product.title;
    document.getElementById('projectDescription').value = product.description;
    document.getElementById('projectSpecs').value = (product.specs || []).join(', ');
    document.getElementById('projectStatus').value = product.status;
    document.getElementById('projectYear').value = product.year || '';

    const imageInput = document.getElementById('projectImage');
    if (imageInput) imageInput.value = '';
    const imagePreview = document.getElementById('imagePreview');
    if (imagePreview) {
        const src = resolveImageSrc(product);
        if (src) {
            imagePreview.src = src;
            imagePreview.style.display = 'block';
        } else {
            imagePreview.style.display = 'none';
        }
    }

    const formTitle = document.getElementById('addProjectTitle');
    const submitBtn = document.getElementById('addBtn');
    const cancelBtn = document.getElementById('cancelEditBtn');

    if (formTitle) formTitle.textContent = t('editProjectTitle');
    if (submitBtn) submitBtn.textContent = t('saveBtn');
    if (cancelBtn) cancelBtn.style.display = 'inline-block';

    const form = document.getElementById('projectForm');
    if (form) form.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function cancelEdit() {
    editingProductId = null;
    const form = document.getElementById('projectForm');
    if (form) form.reset();

    const imagePreview = document.getElementById('imagePreview');
    if (imagePreview) imagePreview.style.display = 'none';

    const formTitle = document.getElementById('addProjectTitle');
    const submitBtn = document.getElementById('addBtn');
    const cancelBtn = document.getElementById('cancelEditBtn');

    if (formTitle) formTitle.textContent = t('addProjectTitle');
    if (submitBtn) submitBtn.textContent = t('addBtn');
    if (cancelBtn) cancelBtn.style.display = 'none';
}

/* ===== ADMIN AUTH ===== */

async function openAdminPanel() {
    let token = getGithubToken();
    const repo = getGithubRepo() || GITHUB_REPO_DEFAULT;

    if (!token) {
        token = prompt(t('enterToken'));
        if (!token) return;

        try {
            const resp = await fetch(`https://api.github.com/repos/${repo}`, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            if (!resp.ok) {
                alert(t('invalidToken'));
                return;
            }
        } catch {
            alert(t('invalidToken'));
            return;
        }

        sessionStorage.setItem('githubToken', token);
        if (!getGithubRepo()) sessionStorage.setItem('githubRepo', repo);
    }

    document.getElementById('adminModal').style.display = 'block';
    document.getElementById('githubToken').value = getGithubToken();
    document.getElementById('githubRepo').value = getGithubRepo() || GITHUB_REPO_DEFAULT;
    renderProjectsList();
}

function closeAdminPanel() {
    document.getElementById('adminModal').style.display = 'none';
    cancelEdit();
}

async function testGitHubConnection() {
    const token = document.getElementById('githubToken').value;
    const repo = document.getElementById('githubRepo').value;
    if (!token || !repo) { showStatus(t('fillAllFields'), 'error'); return; }

    showLoading(true);
    try {
        const resp = await fetch(`https://api.github.com/repos/${repo}`, {
            headers: { 'Authorization': `token ${token}`, 'Accept': 'application/vnd.github.v3+json' }
        });
        if (resp.ok) {
            showStatus(t('connectionOk'), 'success');
        } else {
            throw new Error(`HTTP ${resp.status}`);
        }
    } catch (err) {
        showStatus(`Connection error: ${err.message}`, 'error');
    } finally {
        showLoading(false);
    }
}

function saveGitHubConfig() {
    const token = document.getElementById('githubToken').value;
    const repo = document.getElementById('githubRepo').value;
    if (!token || !repo) { showStatus(t('fillAllFields'), 'error'); return; }
    sessionStorage.setItem('githubToken', token);
    sessionStorage.setItem('githubRepo', repo);
    showStatus(t('configSaved'), 'success');
}

/* ===== LANGUAGE ===== */

function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('dexterLanguage', lang);

    // Update html lang attribute
    document.documentElement.lang = lang;

    // Update page title
    document.title = t('pageTitle');

    // Update active button
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(lang === 'pl' ? 'langPl' : 'langEn');
    if (activeBtn) activeBtn.classList.add('active');

    // Apply translations to all elements with matching IDs
    const tr = translations[lang];
    for (const key of Object.keys(tr)) {
        const el = document.getElementById(key);
        if (el) el.textContent = tr[key];
    }

    render();
}

/* ===== BURGER MENU ===== */

function setupBurgerMenu() {
    const burger = document.getElementById('burgerBtn');
    const nav = document.getElementById('mainNav');
    if (!burger || !nav) return;

    burger.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('open');
        burger.classList.toggle('active');
        burger.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking a nav link
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('open');
            burger.classList.remove('active');
            burger.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !burger.contains(e.target) && nav.classList.contains('open')) {
            nav.classList.remove('open');
            burger.classList.remove('active');
            burger.setAttribute('aria-expanded', 'false');
        }
    });
}

/* ===== INIT ===== */

document.addEventListener('DOMContentLoaded', function () {
    const path = window.location.pathname.toLowerCase();

    // Admin path redirects
    const adminRedirectPaths = ['/pl/admin', '/en/admin', '/pl/zarzadzanie', '/en/zarzadzanie'];
    if (adminRedirectPaths.includes(path)) {
        window.location.replace('/admin');
        return;
    }

    // Show/hide admin panel button based on route
    const adminPanelBtn = document.getElementById('adminPanelBtn');
    if (adminPanelBtn) adminPanelBtn.style.display = (path === '/admin' || path === '/admin.html') ? 'block' : 'none';

    // Language from URL
    if (path === '/pl' || path === '/pl.html') currentLanguage = 'pl';
    else if (path === '/en' || path === '/en.html') currentLanguage = 'en';

    // Language switcher via history.replaceState (no page reload)
    const langPl = document.getElementById('langPl');
    const langEn = document.getElementById('langEn');
    if (langPl) langPl.addEventListener('click', () => {
        changeLanguage('pl');
        history.replaceState(null, '', '/pl');
    });
    if (langEn) langEn.addEventListener('click', () => {
        changeLanguage('en');
        history.replaceState(null, '', '/en');
    });

    // Apply language
    changeLanguage(currentLanguage);

    // Burger menu
    setupBurgerMenu();

    // Admin button (no inline onclick)
    const adminBtn = document.getElementById('adminBtn');
    if (adminBtn) adminBtn.addEventListener('click', openAdminPanel);

    // Close modal button
    const closeModalBtn = document.getElementById('closeModalBtn');
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeAdminPanel);

    // Test connection button
    const testBtn = document.getElementById('testConnectionBtn');
    if (testBtn) testBtn.addEventListener('click', testGitHubConnection);

    // Save config button
    const saveBtn = document.getElementById('saveConfigBtn');
    if (saveBtn) saveBtn.addEventListener('click', saveGitHubConfig);

    // Refresh button
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) refreshBtn.addEventListener('click', () => {
        invalidateProductsCache();
        loadProducts();
    });

    // Image preview on file input
    const imageInput = document.getElementById('projectImage');
    const imagePreview = document.getElementById('imagePreview');
    if (imageInput && imagePreview) {
        imageInput.addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (!file) { imagePreview.style.display = 'none'; return; }
            processImageFile(file)
                .then(compressed => {
                    imagePreview.src = compressed;
                    imagePreview.style.display = 'block';
                })
                .catch(err => {
                    alert(err);
                    imageInput.value = '';
                    imagePreview.style.display = 'none';
                });
        });
    }

    // Form submit: add or edit
    const form = document.getElementById('projectForm');
    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const title = document.getElementById('projectTitle').value;
            const description = document.getElementById('projectDescription').value;
            const specs = document.getElementById('projectSpecs').value.split(',').map(s => s.trim()).filter(Boolean);
            const status = document.getElementById('projectStatus').value;
            const year = document.getElementById('projectYear').value;
            const preview = document.getElementById('imagePreview');
            const hasNewImage = preview && preview.style.display === 'block' && preview.src.startsWith('data:');
            const image = hasNewImage ? preview.src : null;

            if (editingProductId) {
                await updateProduct(editingProductId, { title, description, specs, status, year, image });
                showStatus(t('productUpdated'), 'success');
                cancelEdit();
            } else {
                await addProduct({ title, description, specs, status, year, image });
                showStatus(t('productAdded'), 'success');
            }

            form.reset();
            if (preview) preview.style.display = 'none';
        });
    }

    // Cancel edit button
    const cancelBtn = document.getElementById('cancelEditBtn');
    if (cancelBtn) cancelBtn.addEventListener('click', cancelEdit);

    // Close modal on backdrop click
    document.addEventListener('click', function (e) {
        if (e.target === document.getElementById('adminModal')) closeAdminPanel();
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // Load products
    loadProducts();
});
