import torch
import timm
import os

MODEL_PATH = "models/deepfake_model.pt"

# Create directory if not exists
os.makedirs("models", exist_ok=True)

# Example: create and save a dummy model (replace with your trained model)
model = timm.create_model('resnet50', pretrained=False, num_classes=2)
torch.save(model.state_dict(), MODEL_PATH)
print(f"Model saved at {MODEL_PATH}")
