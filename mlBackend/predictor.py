from tensorflow.keras.preprocessing.image import load_img, img_to_array
import numpy as np

# Define class names for multi-class model(s)
class_names = ['african', 'asian', 'middleEast', 'western']

def get_target_size(model):
    input_shape = model.input_shape
    return (input_shape[1], input_shape[2]) if input_shape else (180, 180)

def predict_image_class(image_path, model):
    try:
        target_size = get_target_size(model)
        img = load_img(image_path, target_size=target_size)
        img_array = img_to_array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        predictions = model.predict(img_array)

        # Special handling for gender model (binary classification)
        if predictions.shape[-1] == 1:
            prediction = predictions[0][0]
            predicted_class = 'male' if prediction > 0.5 else 'female'
            return predicted_class

        # Default handling for other models (multi-class)
        predicted_class = class_names[np.argmax(predictions)]
        return predicted_class

    except Exception as e:
        print(f"Error in image processing: {str(e)}")
        return None
