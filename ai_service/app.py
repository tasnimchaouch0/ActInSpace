from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return 'GreenSignal AI Service running'

# TODO: Add endpoints for satellite data processing, ML predictions

# AI analysis endpoint for backend integration
@app.route('/analyze-field', methods=['POST'])
def analyze_field():
    data = request.get_json()
    field_id = data.get('field_id')
    image_url = data.get('image_url')
    # Dummy response for integration
    result = {
        'ndvi': 0.72,
        'risk': 'Low',
        'alerts': ['No water stress detected']
    }
    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000)
