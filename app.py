from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import numpy as np
import cv2
import torch
from ultralytics import YOLO
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array

app = Flask(__name__)
CORS(app)  # ✅ Enable CORS for all routes

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Load YOLOv8 model for human detection
yolo_model = YOLO("yolov8n.pt")  # Using YOLOv8 nano version

# Load classification models
try:
    age_model = load_model('./models/age_classifier.keras')
    # gender_model = load_model('./models/gender/gender_best_model.keras')
    gender_model = load_model('./models/new_gender_classifier.h5')
    # fashion_model = load_model('./models/ethnicity_classifier_model.h5')
    fashion_model = load_model('./models/ethnicity_classifier_model.h5')
    print("Models loaded successfully")
except Exception as e:
    print(f"Error loading models: {str(e)}")

age = ['adult', 'child']
gender = ['female', 'male']
# fashion = ['african', 'asian', 'middleEast', 'western']
fashion = ['african', 'southAsian', 'eastAsian', 'middleEast', 'western']

def get_target_size(model):
    """Determine the expected input size of the model."""
    input_shape = model.input_shape
    return (input_shape[1], input_shape[2]) if input_shape else (224, 224)

def detect_human(image_path):
    """Check if the image contains a human figure using YOLOv8."""
    image = cv2.imread(image_path)
    results = yolo_model(image)
    
    for result in results:
        for box in result.boxes:
            if box.cls == 0 and box.conf.item() > 0.5:  # Class 0 corresponds to "person"
                return True
    return False

def predict_image_class(image_path, model, class_names):
    """Predict the class of an image using a given model."""
    try:
        target_size = get_target_size(model)
        img = load_img(image_path, target_size=target_size)
        img_array = img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)

        predictions = model.predict(img_array)

        if predictions.shape[1] == 1:  # Binary classification
            label = class_names[int(predictions[0][0] > 0.5)]
        else:  # Multi-class
            label = class_names[np.argmax(predictions[0])]
        return label
        
        # # Special handling for gender model
        # if model == gender_model:
        #     return 'male' if predictions[0][0] > 0.5 else 'female'

        # # Special handling for age model
        # if model == age_model:
        #     return 'adult' if predictions[0][0] > 0.5 else 'child'

        # return class_names[np.argmax(predictions)]
    except Exception as e:
        print(f"Error in image processing: {str(e)}")
        return None

@app.route('/', methods=['GET'])
def hello_world():
    return jsonify({"message": "Hello, World!"}), 200

@app.route('/upload-image', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image part in the request"}), 400

    image = request.files['image']
    if image.filename == '':
        return jsonify({"error": "No file selected"}), 400

    if image:
        try:
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], image.filename)
            image.save(image_path)

            # Human detection step
            if not detect_human(image_path):
                return jsonify({"error": "No human detected. Please upload an image containing a person."}), 400

            age_predict = predict_image_class(image_path, age_model, age)
            gender_predict = predict_image_class(image_path, gender_model, gender)
            fashion_predict = predict_image_class(image_path, fashion_model, fashion)

            if age_predict is None or gender_predict is None or fashion_predict is None:
                return jsonify({"error": "Prediction failed"}), 500

            print(f"Predicted Age - {age_predict}")
            print(f"Predicted Gender - {gender_predict}")
            print(f"Predicted Fashion - {fashion_predict}")

            return jsonify({
                "message": "Image uploaded and prediction successful",
                "filename": image.filename,
                "path": image_path,
                "age": age_predict,
                "gender": gender_predict,
                "fashion": fashion_predict
            }), 200
        except Exception as e:
            return jsonify({"error": "File upload or prediction failed", "details": str(e)}), 500

    return jsonify({"error": "File upload failed"}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
