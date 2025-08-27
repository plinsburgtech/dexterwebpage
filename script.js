let githubConfig = {
    token: localStorage.getItem('githubToken') || '',
    repo: localStorage.getItem('githubRepo') || '',
    branch: 'main'
};

let products = [];
let lastETag = null;
let lastFileSha = localStorage.getItem('lastProductsSha');
let hourlyCacheInterval;

const translations = {
    pl: {
        navHome: "Strona główna",
        navAbout: "O mnie", 
        navPortfolio: "Moje prace",
        navContact: "Kontakt",
        heroSubtitle: "Najlepszy serwis po tej stronie Rio Grande",
        heroDescription: "Tworzę unikalne, precyzyjne broń z dbałością o szczegóły. Każdy element jest wykonywany na zamówienie lub jako unikalne dzieło.",
        heroButton: "Zobacz prace",
        aboutTitle: "O mnie",
        aboutText1: "Od 2007 roku zajmuję się serwisem replik snajperskich i gazowych. Tworzę projekty na indywidualne zamówienie jak i na sprzedaż, według moich pomysłów. W pracy opieram się wyłącznie na najwyższej jakości częściach uznanych producentów, używam wysokiej jakości narzędzi i materiałów, współpracuję z wybitnymi specjalistami w swoich dziedzinach. Wkładam wiele wysiłku w idealne dopracowanie każdego zlecenia.",
        aboutText2: "Szerokie zaplecze warsztatowe pozwala mi zapewnić klientowi szybką i kompleksową usługę, włącznie z wykonaniem elementów na zamówienie lub według własnego pomysłu. Toczenie, frezowanie, cięcie i grawerowanie laserem, spawanie, szlifowanie, wiercenie, gwintowanie itp. leżące w zakresie moich możliwości pozwalają mi wykonywać powierzone prace w sposób profesjonalny, bez uciekania się do metod zastępczych jak druk 3D czy byle jaka rzeźba ręcznymi narzędziami.",
        aboutText3: "Przede wszystkim- jakość. Nie konkuruję ceną- jest i będzie drogo.",
        portfolioTitle: "Moje prace",
        portfolioSubtitle: "Wystawa indywidualnych montaży i modyfikacji. Każdy element reprezentuje unikalne rzemiosło i dbałość o szczegóły.",
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
        projectNameLabel: "Nazwa produktu:",
        descriptionLabel: "Opis:",
        specsLabel: "Specyfikacje (oddzielone przecinkami):",
        imageLabel: "Zdjęcie produktu:",
        statusLabel: "Status:",
        yearLabel: "Rok:",
        addBtn: "Dodaj produkt",
        currentProjectsTitle: "Obecne produkty",
        refreshBtn: "Odśwież z GitHub",
        statusAvailableOption: "Dostępne do zakupu",
        statusSoldOption: "Sprzedane",
        deleteBtn: "Usuń",
        footerText: "© 2025 SERWIS DEXTERA JACEK REITER. Serwis sprzętu sportowego w Krakowie.",
        imageHelp: "Maksymalny rozmiar: 2MB. Obsługiwane formaty: JPG, PNG, WebP",
        forceRefreshBtn: "Odśwież katalog"
    },
    en: {
        navHome: "Home",
        navAbout: "About me",
        navPortfolio: "My Work",
        navContact: "Contact",
        heroSubtitle: "Best service this side of the Rio Grande",
        heroDescription: "Crafting unique, precision firearms with attention to detail. Each piece is custom-made to order or available as one-of-a-kind creations.",
        heroButton: "View My Work",
        aboutTitle: "About Me",
        aboutText1: "Since 2007, I have been servicing sniper and gas-powered replicas. I create custom designs and designs for sale, based on my own ideas. In my work, I rely exclusively on the highest quality parts from renowned manufacturers, use high-quality tools and materials, and collaborate with leading specialists in their fields. I put a great deal of effort into perfecting each order.",
        aboutText2: "My extensive workshop facilities allow me to provide clients with fast and comprehensive service, including custom-made components or custom-made designs. Turning, milling, laser cutting and engraving, welding, grinding, drilling, threading, and more, all within my capabilities, allow me to perform assigned work professionally, without resorting to substitute methods like 3D printing or sloppy hand-tool carving.",
        aboutText3: "First and foremost, quality. I don't compete on price—it is and will remain expensive.",
        portfolioTitle: "My Work",
        portfolioSubtitle: "A showcase of custom builds and modifications. Each piece represents unique craftsmanship and attention to detail.",
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
        projectNameLabel: "Product name:",
        descriptionLabel: "Description:",
        specsLabel: "Specifications (comma separated):",
        imageLabel: "Product image:",
        statusLabel: "Status:",
        yearLabel: "Year:",
        addBtn: "Add product",
        currentProjectsTitle: "Current products",
        refreshBtn: "Refresh from GitHub",
        statusAvailableOption: "Available for purchase",
        statusSoldOption: "Sold",
        deleteBtn: "Delete",
        footerText: "© 2025 DEXTER SERVICE JACEK REITER. Sports equipment service in Kraków.",
        imageHelp: "Maximum size: 2MB. Supported formats: JPG, PNG, WebP",
        forceRefreshBtn: "Refresh catalog"
    }
};

let currentLanguage = localStorage.getItem('dexterLanguage') || 'pl';

function getHeaderOffset() {
    const header = document.querySelector('header');
    if (!header) return 100;
    
    const isMobile = window.innerWidth <= 768;
    const baseOffset = header.offsetHeight;
    
    if (isMobile) {
        return baseOffset + 40;
    }
    
    return baseOffset + 20;
}

function adaptiveScrollToSection(targetId) {
    const target = document.querySelector(targetId);
    if (!target) return;
    
    const offset = getHeaderOffset();
    const targetPosition = target.offsetTop - offset;
    
    window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: 'smooth'
    });
}

async function loadThroughProxy() {
    const repo = githubConfig.repo;
    
    if (!repo) {
        throw new Error('Репозиторий не настроен');
    }
    
    const endpoints = [
        `https://raw.githubusercontent.com/${repo}/main/products.json?t=${Date.now()}`,
        `https://api.github.com/repos/${repo}/contents/products.json?ref=main&t=${Date.now()}`,
        `https://github.com/${repo}/raw/main/products.json?t=${Date.now()}`
    ];
    
    for (const endpoint of endpoints) {
        try {
            const response = await fetch(endpoint, {
                cache: 'no-store',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            
            if (response.ok) {
                let content;
                if (endpoint.includes('api.github.com')) {
                    const data = await response.json();
                    content = atob(data.content);
                } else {
                    content = await response.text();
                }
                
                products = JSON.parse(content);
                renderPortfolio();
                renderProjectsList();
                console.log(`Загружено через альтернативный endpoint: ${endpoint}`);
                return;
            }
        } catch (error) {
            console.log(`Endpoint ${endpoint} не работает:`, error);
        }
    }
    
    throw new Error('Все endpoints недоступны');
}

async function loadProductsFromGitHub() {
    const repo = githubConfig.repo;
    
    if (!repo) {
        console.error('Репозиторий не настроен');
        showStatus('Настройте репозиторий в админ панели', 'error');
        return;
    }
    
    const cacheBuster = Date.now();
    
    try {
        const headers = {
            'Accept': 'application/vnd.github.v3+json'
        };
        
        if (githubConfig.token) {
            headers['Authorization'] = `token ${githubConfig.token}`;
        }

        const response = await fetch(`https://api.github.com/repos/${repo}/contents/products.json?_=${cacheBuster}`, {
            method: 'GET',
            headers: headers
        });
        
        if (response.ok) {
            const data = await response.json();
            const content = atob(data.content);
            const newProducts = JSON.parse(content);
            
            products = newProducts;
            renderPortfolio();
            renderProjectsList();
            
            console.log(`Обновление: ${new Date().toLocaleTimeString()}`);
            console.log(`Загружено продуктов: ${products.length}`);
            
            lastFileSha = data.sha;
            localStorage.setItem('lastProductsSha', data.sha);
            localStorage.setItem('lastForceUpdate', Date.now().toString());
            
        } else if (response.status === 404) {
            products = [];
            renderPortfolio();
            renderProjectsList();
            console.log('Файл products.json не найден');
        } else {
            throw new Error(`GitHub API error: ${response.status}`);
        }
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        
        try {
            await loadThroughJSDelivr();
        } catch (cdnError) {
            console.error('CDN тоже не помог:', cdnError);
            products = [];
            renderPortfolio();
            renderProjectsList();
        }
    }
}

async function loadThroughJSDelivr() {
    const repo = githubConfig.repo;
    
    if (!repo) {
        throw new Error('Репозиторий не настроен');
    }
    
    const cacheBuster = Date.now();
    const cdnUrl = `https://cdn.jsdelivr.net/gh/${repo}@main/products.json?_=${cacheBuster}`;
    
    try {
        const response = await fetch(cdnUrl);
        
        if (response.ok) {
            const content = await response.text();
            products = JSON.parse(content);
            renderPortfolio();
            renderProjectsList();
            console.log(`Загружено через JSDelivr CDN: ${products.length} продуктов`);
            return;
        } else {
            throw new Error(`CDN error: ${response.status}`);
        }
    } catch (error) {
        console.error('JSDelivr CDN ошибка:', error);
        throw error;
    }
}

async function simpleUpdate() {
    console.log('Запуск простого обновления...');
    await loadProductsFromGitHub();
}

function forceRefreshProducts() {
    lastETag = null;
    lastFileSha = null;
    localStorage.removeItem('lastProductsSha');
    localStorage.removeItem('lastSmartUpdate');
    
    simpleUpdate();
    
    showStatus('Каталог обновлен', 'success');
}

async function smartHourlyUpdate() {
    const repo = githubConfig.repo;
    
    if (!repo) {
        console.error('Репозиторий не настроен');
        return;
    }
    
    const now = Date.now();
    const lastUpdate = parseInt(localStorage.getItem('lastSmartUpdate') || '0');
    const oneHour = 3600000;
    
    try {
        const headers = {
            'Accept': 'application/vnd.github.v3+json'
        };
        
        if (githubConfig.token) {
            headers['Authorization'] = `token ${githubConfig.token}`;
        }
        
        if ((now - lastUpdate) > oneHour) {
            headers['Cache-Control'] = 'no-cache';
            
            const response = await fetch(`https://api.github.com/repos/${repo}/contents/products.json?_=${now}`, {
                headers: headers,
                cache: 'no-cache'
            });
            
            if (response.ok) {
                const data = await response.json();
                const content = atob(data.content);
                const newProducts = JSON.parse(content);
                
                if (JSON.stringify(products) !== JSON.stringify(newProducts)) {
                    products = newProducts;
                    renderPortfolio();
                    renderProjectsList();
                    console.log('Каталог обновлен после очистки кэша');
                } else {
                    console.log('Кэш очищен, но данные не изменились');
                }
                
                localStorage.setItem('lastSmartUpdate', now.toString());
            }
        } else {
            loadProductsWithShaCheck();
        }
        
    } catch (error) {
        console.error('Ошибка умного обновления:', error);
    }
}

async function loadProductsWithShaCheck() {
    const repo = githubConfig.repo;
    
    if (!repo) {
        console.error('Репозиторий не настроен');
        return;
    }
    
    try {
        const headers = {
            'Accept': 'application/vnd.github.v3+json'
        };
        
        if (githubConfig.token) {
            headers['Authorization'] = `token ${githubConfig.token}`;
        }

        const response = await fetch(`https://api.github.com/repos/${repo}/contents/products.json`, {
            headers: headers
        });
        
        if (response.ok) {
            const data = await response.json();
            
            if (data.sha === lastFileSha) {
                console.log('Данные не изменились (SHA совпадает)');
                return;
            }
            
            lastFileSha = data.sha;
            localStorage.setItem('lastProductsSha', data.sha);
            
            const content = atob(data.content);
            products = JSON.parse(content);
            renderPortfolio();
            renderProjectsList();
            console.log('Продукты обновлены из GitHub');
        } else if (response.status === 404) {
            products = [];
            renderPortfolio();
            renderProjectsList();
            console.log('Файл products.json не найден');
        }
    } catch (error) {
        console.error('Ошибка загрузки из GitHub:', error);
    }
}

async function aggressiveUpdate() {
    console.log('Запуск агрессивного обновления...');
    
    localStorage.removeItem('lastProductsSha');
    localStorage.removeItem('lastSmartUpdate');
    localStorage.removeItem('productsCache');
    lastETag = null;
    lastFileSha = null;
    
    await loadProductsFromGitHub();
}

function forceRefreshProducts() {
    lastETag = null;
    lastFileSha = null;
    localStorage.removeItem('lastProductsSha');
    localStorage.removeItem('lastSmartUpdate');
    
    loadProductsFromGitHub();
    
    showStatus('Каталог принудительно обновлен', 'success');
}

async function saveProductsToGitHub() {
    if (!githubConfig.token || !githubConfig.repo) {
        showStatus('Brak konfiguracji GitHub', 'error');
        return false;
    }

    showLoading(true);
    try {
        let sha = null;
        
        try {
            const getResponse = await fetch(`https://api.github.com/repos/${githubConfig.repo}/contents/products.json`, {
                headers: {
                    'Authorization': `token ${githubConfig.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (getResponse.ok) {
                const existingFile = await getResponse.json();
                sha = existingFile.sha;
            }
        } catch (e) {
            console.log('Файл не существует, создаем новый');
        }
        
        const content = btoa(unescape(encodeURIComponent(JSON.stringify(products, null, 2))));
        
        const payload = {
            message: `Update products.json - ${new Date().toISOString()}`,
            content: content,
            branch: githubConfig.branch || 'main'
        };
        
        if (sha) {
            payload.sha = sha;
        }

        const response = await fetch(`https://api.github.com/repos/${githubConfig.repo}/contents/products.json`, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${githubConfig.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            showStatus('Produkty zapisane do GitHub', 'success');
            return true;
        } else {
            const errorData = await response.text();
            console.error('GitHub API error:', response.status, errorData);
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Ошибка сохранения в GitHub:', error);
        showStatus(`Błąd zapisu do GitHub: ${error.message}`, 'error');
        return false;
    } finally {
        showLoading(false);
    }
}

async function testGitHubConnection() {
    const token = document.getElementById('githubToken').value;
    const repo = document.getElementById('githubRepo').value;

    if (!token || !repo) {
        showStatus('Wypełnij wszystkie pola', 'error');
        return;
    }

    showLoading(true);
    try {
        const response = await fetch(`https://api.github.com/repos/${repo}`, {
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (response.ok) {
            const testResponse = await fetch(`https://api.github.com/repos/${repo}/contents/test.json`, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (testResponse.status === 404) {
                showStatus('Połączenie z GitHub działa! Token ma odpowiednie uprawnienia.', 'success');
            } else if (testResponse.status === 403) {
                showStatus('Połączenie działa, ale brak uprawnień do zapisu. Użyj CLASSIC token z uprawnieniami "repo".', 'error');
            } else {
                showStatus('Połączenie z GitHub działa!', 'success');
            }
        } else {
            throw new Error(`HTTP ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error('GitHub connection test failed:', error);
        showStatus(`Błąd połączenia: ${error.message}`, 'error');
    } finally {
        showLoading(false);
    }
}

function saveGitHubConfig() {
    const token = document.getElementById('githubToken').value;
    const repo = document.getElementById('githubRepo').value;

    if (!token || !repo) {
        showStatus('Wypełnij wszystkie pola', 'error');
        return;
    }

    githubConfig.token = token;
    githubConfig.repo = repo;

    localStorage.setItem('githubToken', token);
    localStorage.setItem('githubRepo', repo);

    showStatus('Konfiguracja zapisana', 'success');
}

function showStatus(message, type) {
    const indicator = document.getElementById('statusIndicator');
    if (!indicator) return;
    
    indicator.textContent = message;
    indicator.className = `status-indicator status-${type}`;
    indicator.style.display = 'block';

    setTimeout(() => {
        indicator.style.display = 'none';
    }, 5000);
}

function showLoading(show) {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = show ? 'block' : 'none';
    }
}

function processImageFile(file) {
    return new Promise((resolve, reject) => {
        if (file.size > 2 * 1024 * 1024) {
            const errorText = currentLanguage === 'pl' ? 
                'Plik jest zbyt duży! Maksymalny rozmiar: 2MB' : 
                'File is too large! Maximum size: 2MB';
            reject(errorText);
            return;
        }

        if (!file.type.startsWith('image/')) {
            const errorText = currentLanguage === 'pl' ? 
                'Nieprawidłowy typ pliku! Wybierz obraz.' : 
                'Invalid file type! Please select an image.';
            reject(errorText);
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                const maxWidth = 800;
                const maxHeight = 600;
                
                let { width, height } = img;

                if (width > height) {
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                const compressedImage = canvas.toDataURL('image/jpeg', 0.8);
                resolve(compressedImage);
            };
            img.src = e.target.result;
        };
        reader.onerror = () => reject('Ошибка при чтении файла');
        reader.readAsDataURL(file);
    });
}

function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('dexterLanguage', lang);
    
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    if (lang === 'pl') {
        const plBtn = document.getElementById('langPl');
        if (plBtn) plBtn.classList.add('active');
    } else if (lang === 'en') {
        const enBtn = document.getElementById('langEn');
        if (enBtn) enBtn.classList.add('active');
    }
    
    Object.keys(translations[lang]).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.textContent = translations[lang][key];
        }
    });
    
    renderPortfolio();
    renderProjectsList();
}

function renderPortfolio() {
    const grid = document.getElementById('portfolioGrid');
    if (!grid) return;
    
    grid.innerHTML = '';

    products.forEach((product, index) => {
        const statusClass = product.status === 'available' ? 'status-available' : 'status-sold';
        const statusText = product.status === 'available' ? translations[currentLanguage].statusAvailable : translations[currentLanguage].statusSold;

        const productElement = document.createElement('div');
        productElement.className = 'portfolio-item';
        
        const imageContent = product.image ? 
            `<img src="${product.image}" alt="${product.title}">` : 
            'Product Photo';
        
        productElement.innerHTML = `
            <div class="portfolio-image">${imageContent}</div>
            <div class="portfolio-content">
                <div class="portfolio-title">${product.title}</div>
                <div class="portfolio-description">${product.description}</div>
                <div class="portfolio-specs">
                    ${product.specs.map(spec => `<span class="spec-tag">${spec}</span>`).join('')}
                    ${product.year ? `<span class="spec-tag">${product.year}</span>` : ''}
                </div>
                <div class="portfolio-status ${statusClass}">${statusText}</div>
            </div>
        `;
        grid.appendChild(productElement);
    });
}

function renderProjectsList() {
    const list = document.getElementById('projectsList');
    if (!list) return;
    
    list.innerHTML = '';

    products.forEach((product, index) => {
        const productDiv = document.createElement('div');
        productDiv.className = 'project-item';
        productDiv.innerHTML = `
            <h4>${product.title}</h4>
            <p><strong>${translations[currentLanguage].statusLabel}</strong> ${product.status === 'available' ? translations[currentLanguage].statusAvailableOption : translations[currentLanguage].statusSoldOption}</p>
            <p><strong>${translations[currentLanguage].yearLabel}</strong> ${product.year}</p>
            ${product.image ? '<p><strong>📸</strong> Zdjęcie załączone</p>' : ''}
            <button class="btn btn-danger" onclick="removeProduct(${index})">${translations[currentLanguage].deleteBtn}</button>
        `;
        list.appendChild(productDiv);
    });
}

async function addProduct(productData) {
    products.push(productData);
    await saveProductsToGitHub();
    renderPortfolio();
    renderProjectsList();
}

async function removeProduct(index) {
    const confirmText = currentLanguage === 'pl' ? 
        'Czy na pewno chcesz usunąć ten produkt?' : 
        'Are you sure you want to delete this product?';
    
    if (confirm(confirmText)) {
        products.splice(index, 1);
        await saveProductsToGitHub();
        renderPortfolio();
        renderProjectsList();
    }
}

function openAdminPanel() {
    const passwords = {
        pl: 'Wprowadź hasło administratora:',
        en: 'Enter administrator password:'
    };
    
    const password = prompt(passwords[currentLanguage]);
    const correctPassword = 'dexter2025';
    
    if (password === correctPassword) {
        const modal = document.getElementById('adminModal');
        if (modal) modal.style.display = 'block';
        
        const tokenInput = document.getElementById('githubToken');
        const repoInput = document.getElementById('githubRepo');
        
        if (tokenInput) tokenInput.value = githubConfig.token;
        if (repoInput) repoInput.value = githubConfig.repo;
        
        renderProjectsList();
    } else if (password !== null) {
        const errorMessages = {
            pl: 'Nieprawidłowe hasło!',
            en: 'Incorrect password!'
        };
        alert(errorMessages[currentLanguage]);
    }
}

function closeAdminPanel() {
    const modal = document.getElementById('adminModal');
    if (modal) modal.style.display = 'none';
}

function addRefreshButton() {
    const refreshButton = document.createElement('button');
    refreshButton.innerHTML = 'Odśwież katalog';
    refreshButton.className = 'btn btn-success';
    refreshButton.onclick = async function() {
        this.innerHTML = 'Odświeżanie...';
        this.disabled = true;
        
        await aggressiveUpdate();
        
        this.innerHTML = 'Odświeżono!';
        setTimeout(() => {
            this.innerHTML = 'Odśwież katalog';
            this.disabled = false;
        }, 2000);
    };
    
    refreshButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        font-size: 14px;
        padding: 12px 16px;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    `;
    
    document.body.appendChild(refreshButton);
}

document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('projectImage');
    const imagePreview = document.getElementById('imagePreview');

    if (imageInput && imagePreview) {
        imageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                processImageFile(file)
                    .then(compressedImage => {
                        imagePreview.src = compressedImage;
                        imagePreview.style.display = 'block';
                    })
                    .catch(error => {
                        alert(error);
                        imageInput.value = '';
                        imagePreview.style.display = 'none';
                    });
            } else {
                imagePreview.style.display = 'none';
            }
        });
    }

    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    if (currentLanguage === 'pl') {
        const plBtn = document.getElementById('langPl');
        if (plBtn) plBtn.classList.add('active');
    } else if (currentLanguage === 'en') {
        const enBtn = document.getElementById('langEn');
        if (enBtn) enBtn.classList.add('active');
    }
    
    changeLanguage(currentLanguage);
    
    setInterval(aggressiveUpdate, 120000);
    
    aggressiveUpdate();
    
    addRefreshButton();
    
    window.addEventListener('focus', aggressiveUpdate);
    
    document.addEventListener('click', function() {
        const lastClick = localStorage.getItem('lastClickUpdate');
        const now = Date.now();
        if (!lastClick || (now - parseInt(lastClick)) > 60000) {
            localStorage.setItem('lastClickUpdate', now.toString());
            setTimeout(aggressiveUpdate, 1000);
        }
    });
    
    const projectForm = document.getElementById('projectForm');
    if (projectForm) {
        projectForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const title = document.getElementById('projectTitle').value;
            const description = document.getElementById('projectDescription').value;
            const specs = document.getElementById('projectSpecs').value.split(',').map(s => s.trim()).filter(s => s);
            const status = document.getElementById('projectStatus').value;
            const year = document.getElementById('projectYear').value;
            const imagePreview = document.getElementById('imagePreview');
            const image = imagePreview && imagePreview.style.display === 'block' ? imagePreview.src : null;

            await addProduct({ title, description, specs, status, year, image });
            
            this.reset();
            if (imagePreview) imagePreview.style.display = 'none';
            const successText = currentLanguage === 'pl' ? 
                'Produkt dodany pomyślnie!' : 
                'Product added successfully!';
            showStatus(successText, 'success');
        });
    }
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            
            if (targetId === '#' || targetId === '#home') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            adaptiveScrollToSection(targetId);
            history.pushState(null, null, targetId);
        });
    });

    if (window.location.hash) {
        setTimeout(() => {
            adaptiveScrollToSection(window.location.hash);
        }, 200);
    }
    
    window.addEventListener('resize', function() {
        if (window.location.hash) {
            setTimeout(() => {
                adaptiveScrollToSection(window.location.hash);
            }, 100);
        }
    });
    
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            loadProductsWithShaCheck();
        }
    });
});

document.addEventListener('click', function(e) {
    const adminModal = document.getElementById('adminModal');
    if (e.target === adminModal) {
        closeAdminPanel();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname.toLowerCase();

    const adminRedirectPaths = [
        '/pl/admin',
        '/en/admin',
        '/pl/zarzadzanie',
        '/en/zarzadzanie'
    ];

    if (adminRedirectPaths.includes(path)) {
        window.location.replace('/admin');
        return;
    }

    const adminPanel = document.querySelector(".admin-panel");
    const langSwitcher = document.querySelector(".language-switcher");

    if (langSwitcher) langSwitcher.style.display = "block";
    if (adminPanel) adminPanel.style.display = "none";

    if (path === "/admin" || path === "/admin.html") {
        if (adminPanel) adminPanel.style.display = "block";
    }

    if (path === "/pl" || path === "/pl.html") changeLanguage("pl");
    else if (path === "/en" || path === "/en.html") changeLanguage("en");
    else changeLanguage(currentLanguage);

    const plBtn = document.getElementById("langPl");
    const enBtn = document.getElementById("langEn");
    
    if (plBtn) plBtn.onclick = () => window.location.pathname = "/pl";
    if (enBtn) enBtn.onclick = () => window.location.pathname = "/en";
});

window.addEventListener('beforeunload', () => {
    if (hourlyCacheInterval) {
        clearInterval(hourlyCacheInterval);
    }
});
