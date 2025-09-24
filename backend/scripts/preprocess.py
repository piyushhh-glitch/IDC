import cv2
from PIL import Image
import numpy as np

def preprocess_image(image_path):
    """
    Preprocess an image file for model input.
    Returns a numpy array suitable for PyTorch.
    """
    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, (224, 224))
    img = img / 255.0  # normalize
    img = np.transpose(img, (2, 0, 1))  # channel first
    return img.astype(np.float32)

def preprocess_video(video_path):
    """
    Preprocess a video file (for simplicity, we take the first frame).
    """
    cap = cv2.VideoCapture(video_path)
    ret, frame = cap.read()
    cap.release()
    if not ret:
        raise ValueError("Unable to read video")
    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    frame = cv2.resize(frame, (224, 224))
    frame = frame / 255.0
    frame = np.transpose(frame, (2, 0, 1))
    return frame.astype(np.float32)
