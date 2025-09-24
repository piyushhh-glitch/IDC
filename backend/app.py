import streamlit as st
import torch
from torchvision import models, transforms
from PIL import Image
import cv2
import tempfile
from pathlib import Path

# ----------------- Model Setup -----------------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Initialize ResNet18
model = models.resnet18(pretrained=False)
model.fc = torch.nn.Linear(model.fc.in_features, 2)  # 2 classes: Real/Fake
model = model.to(device)

# Load checkpoint
checkpoint = torch.load("deepfake_model.pth", map_location=device)

# Remove "model." prefix if it exists
state_dict = checkpoint
if 'model' in checkpoint:
    state_dict = checkpoint['model']

new_state_dict = {}
for k, v in state_dict.items():
    if k.startswith("model."):
        new_state_dict[k.replace("model.", "")] = v
    else:
        new_state_dict[k] = v

model.load_state_dict(new_state_dict)
model.eval()

# ----------------- Image/Video Transforms -----------------
img_size = 224
transform = transforms.Compose([
    transforms.Resize((img_size, img_size)),
    transforms.ToTensor(),
    transforms.Normalize([0.5,0.5,0.5], [0.5,0.5,0.5])
])

# ----------------- Prediction Functions -----------------
def predict_image(img: Image.Image):
    img_t = transform(img).unsqueeze(0).to(device)
    with torch.no_grad():
        outputs = model(img_t)
        probs = torch.softmax(outputs, dim=1)
        fake_prob = probs[0][0].item()
        real_prob = probs[0][1].item()
        # Prediction based on higher probability
        label = "Real" if real_prob >= fake_prob else "Fake"
        return label, real_prob, fake_prob

def predict_video(video_path: str, frame_skip=10):
    cap = cv2.VideoCapture(video_path)
    real_probs = []
    fake_probs = []
    frame_count = 0
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        if frame_count % frame_skip == 0:
            img = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
            _, real_prob, fake_prob = predict_image(img)
            real_probs.append(real_prob)
            fake_probs.append(fake_prob)
        frame_count += 1
    cap.release()
    if len(real_probs) == 0:
        return "Unknown", 0, 0
    avg_real = sum(real_probs)/len(real_probs)
    avg_fake = sum(fake_probs)/len(fake_probs)
    # Overall label based on higher average probability
    overall_label = "Real" if avg_real >= avg_fake else "Fake"
    return overall_label, avg_real, avg_fake

# ----------------- Streamlit UI -----------------
st.title("DeepFake Detection System")
st.markdown("Upload an image or video to detect if it's Real or Fake.")

uploaded_file = st.file_uploader("Drag & Drop or Select File", type=['jpg','png','mp4'])

if uploaded_file:
    file_path = Path(tempfile.NamedTemporaryFile(delete=False).name)
    file_path.write_bytes(uploaded_file.read())
    
    if uploaded_file.type.startswith("image"):
        img = Image.open(file_path)
        label, real_prob, fake_prob = predict_image(img)
        st.image(img, caption="Uploaded Image", use_container_width=True)
        st.write(f"Prediction: **{label}**")
        st.write(f"Real Probability: {real_prob*100:.2f}%")
        st.write(f"Fake Probability: {fake_prob*100:.2f}%")
    
    elif uploaded_file.type.startswith("video"):
        st.video(str(file_path))
        st.write("Analyzing video frames...")
        label, avg_real, avg_fake = predict_video(str(file_path))
        st.write(f"Overall Video Prediction: **{label}**")
        st.write(f"Average Real Probability: {avg_real*100:.2f}%")
        st.write(f"Average Fake Probability: {avg_fake*100:.2f}%")
