from flask import Flask, request, jsonify
from flask_cors import CORS
import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import requests
from bs4 import BeautifulSoup
import re

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Download VADER lexicon (run once)
try:
    nltk.data.find('vader_lexicon')
except LookupError:
    nltk.download('vader_lexicon')

# Initialize sentiment analyzer
sid = SentimentIntensityAnalyzer()

def clean_text(text):
    """Clean and preprocess text"""
    # Remove special characters that shouldn't be analyzed
    # Keep basic punctuation for sentiment analysis
    text = re.sub(r'UTC[+-]\d{2}:\d{2}', '', text)  # Remove UTC timestamps
    text = re.sub(r'\s+', ' ', text)  # Remove extra whitespace
    return text.strip()

def fetch_url_content(url):
    """Fetch content from URL"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        # Parse HTML content
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.decompose()
        
        # Get text
        text = soup.get_text()
        
        # Clean up text
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = ' '.join(chunk for chunk in chunks if chunk)
        
        return text[:5000]  # Limit to first 5000 characters
    except Exception as e:
        raise Exception(f"Failed to fetch URL: {str(e)}")

@app.route('/analyze', methods=['POST'])
def analyze_sentiment():
    """Analyze sentiment of text or URL content"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        text = data.get('text', '').strip()
        url = data.get('url', '').strip()
        
        # Determine what to analyze
        if url and not text:
            # Fetch content from URL
            text = fetch_url_content(url)
            analyzed_text = text
        elif text:
            analyzed_text = text
        else:
            return jsonify({'error': 'Please provide text or URL'}), 400
        
        # Clean the text
        cleaned_text = clean_text(analyzed_text)
        
        if not cleaned_text:
            return jsonify({'error': 'No valid text to analyze'}), 400
        
        # Perform sentiment analysis
        sentiment_scores = sid.polarity_scores(cleaned_text)
        
        # Prepare response
        response = {
            'scores': {
                'neg': sentiment_scores['neg'],
                'neu': sentiment_scores['neu'],
                'pos': sentiment_scores['pos'],
                'compound': sentiment_scores['compound']
            },
            'analyzed_text': analyzed_text[:500]  # Return first 500 chars
        }
        
        # Log to console (similar to your original code)
        print("\n" + "="*50)
        print("Sentiment Analysis Results:")
        print("="*50)
        print(f"Text: {analyzed_text[:100]}...")
        print("-"*50)
        for key, value in sentiment_scores.items():
            print(f"{key}: {value}")
        print("="*50 + "\n")
        
        return jsonify(response), 200
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'Sentiment Analysis API is running'}), 200

@app.route('/', methods=['GET'])
def home():
    """Root endpoint"""
    return jsonify({
        'message': 'Sentiment Analysis API',
        'endpoints': {
            '/analyze': 'POST - Analyze sentiment',
            '/health': 'GET - Health check'
        }
    }), 200

if __name__ == '__main__':
    print("Starting Sentiment Analysis API...")
    print("Server running on http://localhost:5000")
    print("Press CTRL+C to quit")
    app.run(debug=True, host='0.0.0.0', port=5000)
