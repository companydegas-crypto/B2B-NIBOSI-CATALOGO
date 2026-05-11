document.addEventListener('DOMContentLoaded', () => {
    const catalogContent = document.getElementById('catalogContent');
    const orderSection = document.getElementById('orderSection');
    const orderList = document.getElementById('orderList');
    const orderItemCount = document.getElementById('orderItemCount');
    const finishOrderBtn = document.getElementById('finishOrderBtn');
    
    const whatsappNumber = "5518988201364";
    let currentOrder = {};

    function renderCatalog() {
        if (!catalogData || catalogData.length === 0) {
            catalogContent.innerHTML = '<p style="text-align: center;">Nenhum modelo encontrado no catálogo.</p>';
            return;
        }

        catalogContent.innerHTML = catalogData.map(model => {
            const variants = Array.isArray(model.variants) ? model.variants : [model.variants];
            
            return `
                <section class="product-section">
                    <div class="product-header">
                        <h2 class="product-title">${model.title}</h2>
                    </div>
                    <div class="variant-grid">
                        ${variants.map(variant => {
                            const orderKey = `${model.id}-${variant.title}`;
                            return `
                                <div class="variant-card">
                                    <div class="variant-image-wrapper">
                                        <img class="variant-image" src="${variant.image}" alt="${model.title} - ${variant.title}" loading="lazy">
                                    </div>
                                    <div class="variant-name">${variant.title}</div>
                                    <div class="qty-control">
                                        <button class="qty-btn" onclick="changeQty('${orderKey}', -1, '${model.title}', '${variant.title}')">-</button>
                                        <input type="number" 
                                               id="qty-${orderKey}"
                                               class="qty-input" 
                                               value="0" 
                                               readonly>
                                        <button class="qty-btn" onclick="changeQty('${orderKey}', 1, '${model.title}', '${variant.title}')">+</button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </section>
            `;
        }).join('');
    }

    window.changeQty = (key, delta, model, variant) => {
        const input = document.getElementById(`qty-${key}`);
        let currentQty = parseInt(input.value) || 0;
        let newQty = currentQty + delta;
        
        if (newQty < 0) newQty = 0;
        
        input.value = newQty;
        
        if (newQty > 0) {
            currentOrder[key] = { model, variant, qty: newQty };
        } else {
            delete currentOrder[key];
        }
        
        renderOrderSummary();
    };

    function renderOrderSummary() {
        const keys = Object.keys(currentOrder);
        let totalItems = 0;
        
        if (keys.length === 0) {
            orderSection.style.display = 'none';
            orderItemCount.innerText = '0';
            return;
        }

        orderSection.style.display = 'block';
        orderList.innerHTML = keys.map(key => {
            const item = currentOrder[key];
            totalItems += item.qty;
            return `
                <div class="order-item">
                    <div class="order-item-info">
                        <span class="order-item-title">${item.model}</span>
                        <span class="order-item-variant">${item.variant}</span>
                    </div>
                    <span class="order-item-qty">${item.qty} un</span>
                </div>
            `;
        }).join('');
        
        orderItemCount.innerText = totalItems;
        updateWhatsAppLink();
    }

    function updateWhatsAppLink() {
        const keys = Object.keys(currentOrder);
        
        // Melhorando a formatação do WhatsApp conforme solicitado
        let message = "📦 *NOVO PEDIDO NIBOSI B2B*\n";
        message += "------------------------------------------\n\n";
        
        keys.forEach(key => {
            const item = currentOrder[key];
            message += `*MOD:* ${item.model}\n`;
            message += `*COR:* ${item.variant}\n`;
            message += `*QTD:* ${item.qty} unidades\n`;
            message += "------------------------------------------\n\n";
        });
        
        message += `🚀 *TOTAL DE ITENS:* ${orderItemCount.innerText}\n\n`;
        message += "_Aguardando confirmação de estoque e valores._";
        
        const encodedMessage = encodeURIComponent(message);
        finishOrderBtn.href = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    }

    renderCatalog();

    // Calculator Logic
    const watchCount = document.getElementById('watchCount');
    const costPrice = document.getElementById('costPrice');
    const salePrice = document.getElementById('salePrice');

    const totalInvestment = document.getElementById('totalInvestment');
    const totalRevenue = document.getElementById('totalRevenue');
    const totalProfit = document.getElementById('totalProfit');
    const profitMargin = document.getElementById('profitMargin');

    function calculateProfit() {
        const count = parseFloat(watchCount.value) || 0;
        const cost = parseFloat(costPrice.value) || 0;
        const sale = parseFloat(salePrice.value) || 0;

        const investment = count * cost;
        const revenue = count * sale;
        const profit = revenue - investment;
        const margin = investment > 0 ? (profit / investment) * 100 : 0;

        totalInvestment.innerText = investment.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        totalRevenue.innerText = revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        totalProfit.innerText = profit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        profitMargin.innerText = margin.toFixed(0) + '%';
    }

    if (watchCount) {
        [watchCount, costPrice, salePrice].forEach(input => {
            input.addEventListener('input', calculateProfit);
        });
        calculateProfit();
    }
});
