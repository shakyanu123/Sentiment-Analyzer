// API endpoint - change this to your backend URL
const API_URL = 'http://localhost:5000/analyze';

// Analyze sentiment function
async function analyzeSentiment() {
    const textInput = document.getElementById('textInput').value.trim();
    const urlInput = document.getElementById('urlInput').value.trim();
    const errorDiv = document.getElementById('error');
    const resultsDiv = document.getElementById('results');
    const loadingDiv = document.getElementById('loading');
    const analyzeBtn = document.querySelector('.analyze-btn');

    // Clear previous messages
    errorDiv.style.display = 'none';
    resultsDiv.style.display = 'none';

    // Validation
    if (!textInput && !urlInput) {
        showError('Please enter text or a URL to analyze.');
        return;
    }

    // Show loading state
    loadingDiv.style.display = 'block';
    analyzeBtn.disabled = true;

    try {
        // Prepare request data
        const requestData = {
            text: textInput,
            url: urlInput
        };

        // Make API call to Python backend
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Hide loading
        loadingDiv.style.display = 'none';
        analyzeBtn.disabled = false;

        // Check for errors from backend
        if (data.error) {
            showError(data.error);
            return;
        }

        // Display results
        displayResults(data);

    } catch (error) {
        loadingDiv.style.display = 'none';
        analyzeBtn.disabled = false;
        
        console.error('Error:', error);
        showError('Failed to connect to the server. Make sure the Python backend is running on http://localhost:5000');
    }
}

// Display results function
function displayResults(data) {
    const resultsDiv = document.getElementById('results');
    const scores = data.scores;
    const sentiment = getSentimentLabel(scores.compound);

    resultsDiv.innerHTML = `
        <div class="sentiment-card">
            <div class="sentiment-label" style="color: ${sentiment.color}">
                <span class="emoji">${sentiment.emoji}</span>
                <span>Overall Sentiment: ${sentiment.label}</span>
            </div>
            <div class="scores">
                <div class="score-item">
                    <span class="score-label">Compound</span>
                    <div class="score-bar-container">
                        <div class="score-bar ${scores.compound >= 0 ? 'positive' : 'negative'}" 
                             style="width: ${Math.abs(scores.compound) * 100}%"></div>
                    </div>
                    <span class="score-value">${scores.compound.toFixed(4)}</span>
                </div>
                <div class="score-item">
                    <span class="score-label">Positive</span>
                    <div class="score-bar-container">
                        <div class="score-bar positive" style="width: ${scores.pos * 100}%"></div>
                    </div>
                    <span class="score-value">${scores.pos.toFixed(4)}</span>
                </div>
                <div class="score-item">
                    <span class="score-label">Neutral</span>
                    <div class="score-bar-container">
                        <div class="score-bar neutral" style="width: ${scores.neu * 100}%"></div>
                    </div>
                    <span class="score-value">${scores.neu.toFixed(4)}</span>
                </div>
                <div class="score-item">
                    <span class="score-label">Negative</span>
                    <div class="score-bar-container">
                        <div class="score-bar negative" style="width: ${scores.neg * 100}%"></div>
                    </div>
                    <span class="score-value">${scores.neg.toFixed(4)}</span>
                </div>
            </div>
        </div>
        ${data.analyzed_text ? `
        <div style="background: #f5f5f5; padding: 15px; border-radius: 10px; margin-top: 15px;">
            <strong style="color: #555;">Analyzed Text:</strong>
            <p style="margin-top: 10px; color: #666; line-height: 1.6;">${data.analyzed_text.substring(0, 200)}${data.analyzed_text.length > 200 ? '...' : ''}</p>
        </div>
        ` : ''}
    `;
    
    resultsDiv.style.display = 'block';
}

// Get sentiment label based on compound score
function getSentimentLabel(compound) {
    if (compound >= 0.05) {
        return { label: 'Positive', emoji: '😊', color: '#4caf50' };
    } else if (compound <= -0.05) {
        return { label: 'Negative', emoji: '😞', color: '#f44336' };
    } else {
        return { label: 'Neutral', emoji: '😐', color: '#2196f3' };
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

// Clear all inputs and results
function clearAll() {
    document.getElementById('textInput').value = '';
    document.getElementById('urlInput').value = '';
    document.getElementById('results').style.display = 'none';
    document.getElementById('error').style.display = 'none';
}

// Allow Ctrl+Enter to submit
document.getElementById('textInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.ctrlKey) {
        analyzeSentiment();
    }
});
