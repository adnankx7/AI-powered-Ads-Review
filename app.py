from flask import Flask, render_template, request, jsonify
import json
import os
from review_agent import get_ad_review_chain

app = Flask(__name__)

DATA_FILE = 'data.json'


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/submit', methods=['POST'])
def submit():
    new_data = request.get_json()

    # Review the ad using AI
    chain = get_ad_review_chain()
    try:
        review_result = chain.invoke(new_data)
    except Exception as e:
        error_message = str(e)
        if "ConnectError" in error_message or "connection refused" in error_message.lower():
            return jsonify({'message': 'Error: Cannot connect to Ollama local model server. Please ensure it is running.'}), 503
        return jsonify({'message': f'Error during AI review: {error_message}'}), 500

    # Load existing data
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, 'r') as f:
            try:
                data = json.load(f)
            except json.JSONDecodeError:
                data = []
    else:
        data = []

    # Append new entry with review status
    new_data_with_status = new_data.copy()
    new_data_with_status['status'] = review_result['decision'].lower()  # 'approve' or 'reject'
    new_data_with_status['review_reason'] = review_result['reason']

    data.append(new_data_with_status)

    # Save back to JSON file
    with open(DATA_FILE, 'w') as f:
        json.dump(data, f, indent=2)

    if review_result['decision'] == 'Reject':
        return jsonify({'message': f'Ad rejected: {review_result["reason"]}'} ), 400

    return jsonify({'message': 'Car details saved successfully!'})


if __name__ == '__main__':
    app.run(debug=True)
