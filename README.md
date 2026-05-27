📊 Sentiment Analysis Tool A modern web-based sentiment analysis application that analyzes the emotional tone of text or web content using Natural Language Processing. Built with Flask backend and vanilla JavaScript frontend. ✨ Features

Text Analysis: Analyze sentiment of any text input URL Scraping: Fetch and analyze content from web URLs Real-time Results: Get instant sentiment scores with visual representations Multiple Metrics: View compound, positive, neutral, and negative sentiment scores Responsive Design: Works seamlessly on desktop and mobile devices Clean UI: Modern, gradient-based interface with smooth animations

🎯 Sentiment Scores The tool provides four key metrics:

Compound Score (-1 to +1): Overall sentiment indicator

Positive: ≥ 0.05 Neutral: -0.05 to 0.05 Negative: ≤ -0.05

Positive Score (0 to 1): Proportion of positive sentiment Neutral Score (0 to 1): Proportion of neutral sentiment Negative Score (0 to 1): Proportion of negative sentiment

🛠️ Tech Stack Backend

Flask: Web framework NLTK: Natural Language Toolkit with VADER sentiment analyzer BeautifulSoup4: HTML parsing for URL content extraction Requests: HTTP library for fetching web content Flask-CORS: Cross-Origin Resource Sharing support

Frontend

HTML5: Structure CSS3: Styling with gradients and animations Vanilla JavaScript: Interactive functionality Fetch API: Asynchronous communication with backend

📋 Prerequisites

Python 3.8 or higher pip (Python package manager) Modern web browser

🚀 Installation

Clone the repository

bashgit clone https://github.com/yourusername/sentiment-analysis-tool.git cd sentiment-analysis-tool

Install Python dependencies

bashpip install flask flask-cors nltk requests beautifulsoup4

Download NLTK data (automatic on first run, or manual)

pythonpython -c "import nltk; nltk.download('vader_lexicon')" 💻 Usage

Start the Flask backend

bashpython app.py The server will start on http://localhost:5000

Open the frontend

Open index.html in your web browser Or use a local server:

bash python -m http.server 8000 Then navigate to http://localhost:8000

Analyze sentiment

Enter text directly in the text area, OR Paste a URL to analyze web content Click "Analyze Sentiment" View the results with visual score bars

📁 Project Structure
sentiment-analysis-tool
│
├── app.py # Flask backend API
├── index.html # Main HTML structure
├── script.js # Frontend JavaScript logic
├── style.css # Styling and animations
└── README.md # Project documentation
🔌 API Endpoints
POST /analyze
Analyzes sentiment of provided text or URL content.
Request Body:
json{
"text": "Your text here",
"url": "https://example.com"
}
Response:
json{
"scores": {
"neg": 0.0,
"neu": 0.5, "pos": 0.5, "compound": 0.8 }, "analyzed_text": "Sample text..." }

Root endpoint with API information. 🎨 Customization Changing Colors Edit style.css to modify the color scheme: cssbackground: linear-gradient(135deg, #667eea 0%, #764ba2 100%); Adjusting Analysis Length Modify text limits in app.py: pythonreturn text[:5000] # Change character limit
⚠️ Known Limitations

URL fetching limited to publicly accessible pages JavaScript-rendered content may not be captured Analysis limited to first 5000 characters of web content VADER is optimized for social media text and may vary for formal content

🤝 Contributing Contributions are welcome! Please feel free to submit a Pull Request.
