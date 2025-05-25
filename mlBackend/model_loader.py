from tensorflow.keras.models import load_model

def load_models():
    age_model = load_model('./models/age_classifier.keras')
    gender_model = load_model('./models/gender_classifier1.h5')
    fashion_model = load_model('./models/fashionClassifier.keras')
    return age_model, gender_model, fashion_model