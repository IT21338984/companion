from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from model_loader import load_models
from detection import detect_human
from predictor import predict_image_class

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

age_model, gender_model, fashion_model = load_models()

@app.route('/upload-image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400
    image = request.files['image']
    if image.filename == '':
        return jsonify({"error": "No file selected"}), 400

    image_path = os.path.join(app.config['UPLOAD_FOLDER'], image.filename)
    image.save(image_path)

    if not detect_human(image_path):
        return jsonify({"error": "No human detected"}), 400

    age = predict_image_class(image_path, age_model)
    gender = predict_image_class(image_path, gender_model)
    fashion = predict_image_class(image_path, fashion_model)

    return jsonify({
        "age": age,
        "gender": gender,
        "fashion": fashion
    }), 200

if __name__ == '__main__':
    app.run(debug=True)
