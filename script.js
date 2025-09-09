const BORED_API_BASE = 'https://api.allorigins.win/raw?url=';
const BORED_API_URL = 'https://bored-api.appbrewery.com';

const randomBtn = document.getElementById('randomBtn');
const categoryBtns = document.querySelectorAll('.category-btn');
const loading = document.getElementById('loading');
const activityCard = document.getElementById('activityCard');
const errorMessage = document.getElementById('errorMessage');

const activityType = document.getElementById('activityType');
const participants = document.getElementById('participants');
const activityTitle = document.getElementById('activityTitle');
const activityDescription = document.getElementById('activityDescription');
const activityPrice = document.getElementById('activityPrice');
const activityAccessibility = document.getElementById('activityAccessibility');

let currentCategory = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
});

function initializeEventListeners() {
    randomBtn.addEventListener('click', getRandomActivity);
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            toggleCategory(category);
            getActivityByCategory(category);
        });
    });
}

async function getRandomActivity() {
    showLoading();
    hideError();
    
    try {
        const url = `${BORED_API_BASE}${encodeURIComponent(`${BORED_API_URL}/random`)}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        displayActivity(data);
        clearCategorySelection();
        
    } catch (error) {
        console.error('Error al obtener actividad aleatoria:', error);
        showError();
    }
}

async function getActivityByCategory(category) {
    showLoading();
    hideError();
    
    try {
        const apiUrl = `${BORED_API_URL}/filter?type=${category}`;
        const url = `${BORED_API_BASE}${encodeURIComponent(apiUrl)}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        // La API devuelve un array, tomamos el primer elemento
        const activity = Array.isArray(data) ? data[0] : data;
        displayActivity(activity);
        
    } catch (error) {
        console.error('Error al obtener actividad por categoría:', error);
        showError();
    }
}

function displayActivity(activity) {
    hideLoading();
    
    const typeTranslations = {
        'education': 'Education',
        'recreational': 'Recreational',
        'social': 'Social',
        'charity': 'Charity',
        'cooking': 'Cooking',
        'relaxation': 'Relaxation',
        'busywork': 'Busywork'
    };
    
    activityType.textContent = typeTranslations[activity.type] || activity.type;
    participants.textContent = `${activity.participants} participante${activity.participants !== 1 ? 's' : ''}`;
    activityTitle.textContent = activity.activity;
    activityDescription.textContent = activity.activity;
    
    const priceText = formatPrice(activity.price);
    activityPrice.textContent = priceText;
    
    const accessibilityText = formatAccessibility(activity.accessibility);
    activityAccessibility.textContent = accessibilityText;
    
    activityCard.classList.remove('hidden');
}

function formatPrice(price) {
    if (price === 0) {
        return 'Gratis';
    } else if (price <= 0.3) {
        return 'Casi regalado';
    } else if (price <= 0.6) {
        return 'Barato';
    } else {
        return 'Caro';
    }
}

function formatAccessibility(accessibility) {
    if (accessibility <= 0.3) {
        return '♿ Facil';
    } else if (accessibility <= 0.6) {
        return 'Ni Dificil Ni facil';
    } else {
        return 'Dificil';
    }
}

function toggleCategory(category) {
    categoryBtns.forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (currentCategory === category) {
        currentCategory = null;
        return;
    }
    
    currentCategory = category;
    const selectedBtn = document.querySelector(`[data-category="${category}"]`);
    selectedBtn.classList.add('active');
}

function clearCategorySelection() {
    currentCategory = null;
    categoryBtns.forEach(btn => {
        btn.classList.remove('active');
    });
}

function showLoading() {
    loading.classList.remove('hidden');
    activityCard.classList.add('hidden');
    errorMessage.classList.add('hidden');
}

function hideLoading() {
    loading.classList.add('hidden');
}

function showError() {
    hideLoading();
    errorMessage.classList.remove('hidden');
    activityCard.classList.add('hidden');
}


function hideError() {
    errorMessage.classList.add('hidden');
}

function retryConnection() {
    window.location.reload();
}

document.addEventListener('DOMContentLoaded', function() {
    const errorDiv = document.getElementById('errorMessage');
    const retryBtn = document.createElement('button');
    retryBtn.textContent = '🔄 Reintentar';
    retryBtn.className = 'btn btn-primary';
    retryBtn.style.marginTop = '15px';
    retryBtn.onclick = retryConnection;
    errorDiv.appendChild(retryBtn);
});
