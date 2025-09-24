import torch
import timm
import numpy as np
from .preprocess import preprocess_image, preprocess_video


MODEL_PATH = "models/deepfake_model.pt"

def load_model():
    # Create a ResNet50 model
    model = timm.create_model('resnet50', pretrained=False, num_classes=2)
    model.load_state_dict(torch.load(MODEL_PATH, map_location=torch.device('cpu')))
    model.eval()
    return model

def predict_deepfake(file_path, model):
    # Determine if file is image or video
    if file_path.lower().endswith(('.png', '.jpg', '.jpeg')):
        img = preprocess_image(file_path)
    elif file_path.lower().endswith(('.mp4', '.avi', '.mov')):
        img = preprocess_video(file_path)
    else:
        raise ValueError("Unsupported file type")

    # Convert to tensor and add batch dimension
    input_tensor = torch.from_numpy(img).unsqueeze(0)
    with torch.no_grad():
        outputs = model(input_tensor)
        probs = torch.softmax(outputs, dim=1).numpy()[0]

    # Map predictions
    classes = ["Real", "Fake"]
    predicted_class = classes[np.argmax(probs)]
    confidence = float(np.max(probs))
    return predicted_class, confidence
