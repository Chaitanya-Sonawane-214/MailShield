const API_BASE_URL = 'http://localhost:8000/api';

// DOM Elements
const emailInput = document.getElementById('emailInput');
const charCount = document.getElementById('charCount');
const btnClear = document.getElementById('btnClear');
const btnAnalyze = document.getElementById('btnAnalyze');
const btnAnother = document.getElementById('btnAnother');
const analyzerCard = document.querySelector('.analyzer-card');
const resultsCard = document.getElementById('resultsCard');
const errorCard = document.getElementById('errorCard');
const errorText = document.getElementById('errorText');
const navStatus = document.getElementById('navStatus');
const statusText = document.querySelector('.status-text');

// Results DOM Elements
const resultVerdict = document.getElementById('resultVerdict');
const resultSubtitle = document.getElementById('resultSubtitle');
const resultIcon = document.getElementById('resultIcon');
const gaugeValue = document.getElementById('gaugeValue');
const gaugeArc = document.getElementById('gaugeArc');
const barBenign = document.getElementById('barBenign');
const valBenign = document.getElementById('valBenign');
const barPhishing = document.getElementById('barPhishing');
const valPhishing = document.getElementById('valPhishing');

// SVG Icons
const icons = {
    safe: `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    danger: `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkApiStatus();
    setInterval(checkApiStatus, 30000); // Check every 30s
});

// Input handling
emailInput.addEventListener('input', () => {
    const len = emailInput.value.length;
    charCount.textContent = `${len} character${len !== 1 ? 's' : ''}`;
    btnAnalyze.disabled = len === 0;
});

btnClear.addEventListener('click', () => {
    emailInput.value = '';
    emailInput.dispatchEvent(new Event('input'));
    emailInput.focus();
});

// Analysis handling
btnAnalyze.addEventListener('click', async () => {
    const text = emailInput.value.trim();
    if (!text) return;

    setLoading(true);
    hideError();

    try {
        const response = await fetch(`${API_BASE_URL}/text_check`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text })
        });

        const data = await response.json();

        if (!response.ok || data.error) {
            throw new Error(data.error || 'Failed to analyze email');
        }

        showResults(data);
    } catch (err) {
        showError(err.message);
    } finally {
        setLoading(false);
    }
});

btnAnother.addEventListener('click', () => {
    resultsCard.style.display = 'none';
    analyzerCard.style.display = 'block';
    emailInput.focus();
});

// Helper Functions
async function checkApiStatus() {
    try {
        const res = await fetch(`${API_BASE_URL}/status`);
        if (res.ok) {
            navStatus.classList.add('connected');
            statusText.textContent = 'API Connected';
        } else {
            throw new Error();
        }
    } catch {
        navStatus.classList.remove('connected');
        statusText.textContent = 'API Disconnected';
    }
}

function setLoading(isLoading) {
    const textSpan = btnAnalyze.querySelector('.btn-text');
    const loadingSpan = btnAnalyze.querySelector('.btn-loading');
    
    btnAnalyze.disabled = isLoading;
    if (isLoading) {
        textSpan.style.display = 'none';
        loadingSpan.style.display = 'flex';
    } else {
        textSpan.style.display = 'flex';
        loadingSpan.style.display = 'none';
    }
}

function showError(message) {
    errorText.textContent = message;
    errorCard.style.display = 'flex';
    setTimeout(() => {
        errorCard.style.display = 'none';
    }, 5000);
}

function hideError() {
    errorCard.style.display = 'none';
}

function showResults(data) {
    // Hide input, show results
    analyzerCard.style.display = 'none';
    resultsCard.style.display = 'block';

    const isPhishing = data.label === 'PHISHING';
    const probPhishing = data.probs.phishing;
    const probBenign = data.probs.benign;
    const confidencePct = Math.round(data.confidence * 100);

    // Update Header
    resultVerdict.textContent = isPhishing ? 'Phishing Detected' : 'Email Looks Safe';
    resultVerdict.className = `result-verdict ${isPhishing ? 'danger' : 'safe'}`;
    
    resultSubtitle.textContent = isPhishing 
        ? 'Exercise extreme caution. Do not click links or download attachments.'
        : 'No clear signs of phishing detected, but always remain vigilant.';
        
    resultIcon.className = `result-icon ${isPhishing ? 'danger' : 'safe'}`;
    resultIcon.innerHTML = isPhishing ? icons.danger : icons.safe;

    // Update Gauge Animation
    // Max dash offset is 251.3. 0 offset = 100% full.
    // Map phishing probability to gauge fill (0 to 180 degrees mapping)
    setTimeout(() => {
        const fillAmount = probPhishing; // 0.0 to 1.0
        const gaugeMax = 251.3;
        const offset = gaugeMax - (gaugeMax * fillAmount);
        
        gaugeArc.style.strokeDashoffset = offset;
        animateValue(gaugeValue, 0, Math.round(probPhishing * 100), 1000);
    }, 100);

    // Update Bars
    setTimeout(() => {
        const pBenignPct = Math.round(probBenign * 100);
        const pPhishingPct = Math.round(probPhishing * 100);

        barBenign.style.width = `${pBenignPct}%`;
        valBenign.textContent = `${pBenignPct}%`;

        barPhishing.style.width = `${pPhishingPct}%`;
        valPhishing.textContent = `${pPhishingPct}%`;
    }, 300);
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start) + '%';
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// FAQ Toggle Global Function
window.toggleFaq = function(button) {
    const item = button.parentElement;
    item.classList.toggle('active');
};
