# AI-Powered Car Ad Reviewer

This is a Flask web application for submitting car ads, which uses LangChain and Groq's Llama-3.1-8B-Instant model to automatically review ads for appropriateness (e.g., offensive language, misleading claims, mismatches). Ads are saved to `data.json` with review status ("approve" or "reject") and reason, regardless of decision.

## Features
- Web form for entering car details (brand, model, variant, year, mileage, fuel type, engine type, transmission, condition, description).
- AI review using Groq's Llama-3.1-8B-Instant model to detect inappropriate content.
- Saves all ads to `data.json` with review status and reason.
- Supports multilingual ads (English, Urdu, Roman Urdu).
- Error handling for API connection issues.

## Prerequisites
- Python 3.8+.
- Groq API key (free tier available).
- VS Code or any code editor.

## Setup Instructions

### 1. Create a Virtual Environment (Recommended)
Create and activate a virtual environment to isolate dependencies:

```bash
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
# source venv/bin/activate
```

### 2. Install Dependencies
Clone or download the project, then install Python dependencies:

```bash
pip install -r requirements.txt
```

This installs Flask, LangChain, Groq integrations, and dotenv.

### 3. Get Groq API Key
- Sign up at [groq.com](https://groq.com) for a free API key.
- Create a `.env` file in the project root and add:
  ```
  GROQ_API_KEY=your_api_key_here
  ```

### 4. Run the Application
Navigate to the project directory and run:

```bash
python app.py
```

The Flask server will start on `http://127.0.0.1:5000`.

### 5. Access the App
- Open your browser and go to `http://127.0.0.1:5000`.
- Fill out the car ad form.
- Submit the form. The AI will review it and show approval/rejection.
- Check `data.json` for saved ads with status.

## Usage
1. **Submit an Ad**:
   - Enter car details in the form.
   - Include a description (can be in English, Urdu, or Roman Urdu).
   - Click "Save".

2. **AI Review**:
   - The app reviews for:
     - Offensive/abusive language.
     - Misleading claims (e.g., "like new" is allowed for "Used" condition).
     - Mismatches between description and details.
     - Spammy/non-car content.
   - If rejected, you'll see the reason; if approved, a success message.

3. **View Saved Data**:
   - Open `data.json` to see all submissions with fields like `status` ("approve"/"reject") and `review_reason`.

## Troubleshooting
- **API Connection Error**: Check your Groq API key in `.env` and internet connection.
- **JSON Parsing Error**: The model should respond with valid JSON; if not, check the prompt.
- **Static Files 404**: Ensure `static/` directory exists with `style.css` and `script.js`.
- **No Data Saved**: Check console for errors; verify write permissions in the project directory.

## Project Structure
- `app.py`: Main Flask app with routes and data saving.
- `review_agent.py`: LangChain setup for AI review using Groq.
- `templates/index.html`: Web form.
- `templates/script.js`: Frontend form handling.
- `templates/style.css`: Basic styling.
- `data.json`: Saved ads (auto-created).
- `requirements.txt`: Dependencies.
- `.env`: API key (not committed).

## Extending the App
- Add more review rules in `review_agent.py` prompt.
- Integrate a database instead of JSON for production.
- Deploy to a server (e.g., Heroku).

For issues, check the Flask console output.
