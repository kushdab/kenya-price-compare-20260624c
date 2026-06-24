/**
 * kenya-price-compare-20260624c
 * Content Script for comparing prices across Jumia, Kilimall, and Sky.Garden
 */

(function() {
    const CONFIG = {
        'jumia.co.ke': { name: 'Jumia', title: 'h1', price: '.prc', search: 'https://www.jumia.co.ke/catalog/?q=' },
        'kilimall.co.ke': { name: 'Kilimall', title: '.product-name', price: '.price-box .price', search: 'https://www.kilimall.co.ke/new/search?q=' },
        'sky.garden': { name: 'Sky Garden', title: 'h1', price: '[data-testid="product-price"]', search: 'https://sky.garden/search/' }
    };

    const currentHost = window.location.hostname.replace('www.', '');
    const siteConfig = Object.entries(CONFIG).find(([domain]) => currentHost.includes(domain));

    if (!siteConfig) return;

    function getProductDetails() {
        const config = siteConfig[1];
        const titleEl = document.querySelector(config.title);
        const priceEl = document.querySelector(config.price);

        return {
            title: titleEl ? titleEl.innerText.trim() : null,
            price: priceEl ? priceEl.innerText.trim() : 'N/A'
        };
    }

    function createUI(productTitle) {
        const container = document.createElement('div');
        container.id = 'kpc-comparison-bar';
        Object.assign(container.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: '#ffffff',
            border: '2px solid #2e7d32',
            borderRadius: '8px',
            padding: '15px',
            zIndex: '999999',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            width: '300px',
            fontFamily: 'Arial, sans-serif'
        });

        const header = document.createElement('h3');
        header.innerText = 'Compare Prices (Kenya)';
        header.style.margin = '0 0 10px 0';
        header.style.fontSize = '16px';
        header.style.color = '#333';
        container.appendChild(header);

        const list = document.createElement('ul');
        list.style.listStyle = 'none';
        list.style.padding = '0';
        list.style.margin = '0';

        Object.entries(CONFIG).forEach(([domain, info]) => {
            if (currentHost.includes(domain)) return;

            const item = document.createElement('li');
            item.style.marginBottom = '8px';

            const link = document.createElement('a');
            const searchQuery = encodeURIComponent(productTitle);
            link.href = info.search + searchQuery;
            link.target = '_blank';
            link.innerText = `Check on ${info.name}`;
            Object.assign(link.style, {
                display: 'block',
                padding: '8px 12px',
                backgroundColor: '#f5f5f5',
                color: '#2e7d32',
                textDecoration: 'none',
                borderRadius: '4px',
                fontSize: '13px',
                fontWeight: 'bold',
                textAlign: 'center',
                transition: 'background-color 0.2s'
            });
            link.onmouseover = () => link.style.backgroundColor = '#e0e0e0';
            link.onmouseout = () => link.style.backgroundColor = '#f5f5f5';

            item.appendChild(link);
            list.appendChild(item);
        });

        container.appendChild(list);

        const closeBtn = document.createElement('div');
        closeBtn.innerText = '×';
        Object.assign(closeBtn.style, {
            position: 'absolute',
            top: '5px',
            right: '10px',
            cursor: 'pointer',
            fontSize: '18px',
            color: '#999'
        });
        closeBtn.onclick = () => container.remove();
        container.appendChild(closeBtn);

        document.body.appendChild(container);
    }

    // Initial delay to ensure page elements are rendered
    setTimeout(() => {
        const details = getProductDetails();
        if (details.title && details.title.length > 3) {
            createUI(details.title);
        }
    }, 2500);
})();