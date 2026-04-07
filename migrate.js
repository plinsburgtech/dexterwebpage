#!/usr/bin/env node
/**
 * Миграция: извлечь base64 картинки из products.json → загрузить как файлы в images/ → обновить products.json
 *
 * Использование:
 *   node migrate.js <github-token> <repo>
 *   Пример: node migrate.js ghp_xxxx plinsburgtech/dexterwebpage
 */

const BRANCH = 'main';

async function githubAPI(url, token, options = {}) {
    const resp = await fetch(`https://api.github.com${url}`, {
        ...options,
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
            ...(options.headers || {})
        }
    });
    if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`GitHub API ${resp.status}: ${text}`);
    }
    return resp.json();
}

async function getFileSha(token, repo, path) {
    try {
        const data = await githubAPI(`/repos/${repo}/contents/${path}?ref=${BRANCH}`, token);
        return data.sha;
    } catch {
        return null;
    }
}

async function uploadFile(token, repo, path, contentBase64, message) {
    const sha = await getFileSha(token, repo, path);
    const payload = {
        message,
        content: contentBase64,
        branch: BRANCH
    };
    if (sha) payload.sha = sha;
    return githubAPI(`/repos/${repo}/contents/${path}`, token, {
        method: 'PUT',
        body: JSON.stringify(payload)
    });
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

async function migrate(token, repo) {
    console.log(`Загружаю products.json из ${repo}...`);

    const fileData = await githubAPI(`/repos/${repo}/contents/products.json?ref=${BRANCH}`, token);
    const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
    const products = JSON.parse(content);

    console.log(`Найдено ${products.length} продуктов`);

    const updated = [];

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const id = generateId();
        const newProduct = { id, ...product };

        if (product.image && product.image.startsWith('data:image/')) {
            const match = product.image.match(/^data:image\/(\w+);base64,(.+)$/);
            if (match) {
                const ext = match[1] === 'jpeg' ? 'jpg' : match[1];
                const base64Data = match[2];
                const imagePath = `images/${id}.${ext}`;

                console.log(`[${i + 1}/${products.length}] Загружаю ${imagePath} (${Math.round(base64Data.length * 0.75 / 1024)}KB)...`);

                await uploadFile(token, repo, imagePath, base64Data, `Migrate image: ${product.title}`);

                newProduct.image = imagePath;
                console.log(`  ✓ Загружено`);
            }
        }

        delete newProduct.image_old;
        updated.push(newProduct);
    }

    console.log(`\nОбновляю products.json...`);
    const newJson = JSON.stringify(updated, null, 2);
    const newBase64 = Buffer.from(newJson, 'utf-8').toString('base64');

    await uploadFile(token, repo, 'products.json', newBase64, 'Migrate: base64 images → separate files, add product IDs');

    console.log(`✓ Миграция завершена!`);
    console.log(`  - ${updated.length} продуктов обновлено`);
    console.log(`  - products.json: ${Math.round(newJson.length / 1024)}KB (было ~280KB)`);
}

const [,, token, repo] = process.argv;

if (!token || !repo) {
    console.error('Использование: node migrate.js <github-token> <repo>');
    console.error('Пример: node migrate.js ghp_xxxx plinsburgtech/dexterwebpage');
    process.exit(1);
}

migrate(token, repo).catch(err => {
    console.error('Ошибка миграции:', err.message);
    process.exit(1);
});
