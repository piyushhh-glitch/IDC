# PixelGaurd - DeepFake Detection System

PixelGaurd is a deepfake detection system that allows users to upload images and videos to detect whether the content is real or fake using state-of-the-art AI models. Both the backend and frontend are implemented using **Streamlit** for a simple, interactive interface.

---

## Features

- Detects Deepfakes in **images** and **videos**.
- Uses a **ResNet18-based deep learning model** trained for real/fake classification.
- Intuitive **Streamlit UI** for uploading files and displaying results.
- Shows **probabilities** for Real vs Fake predictions.
- Processes media **locally**, ensuring privacy and security.

---

## Tech Stack

- **Backend & Frontend:** Streamlit
- **Deep Learning:** PyTorch, torchvision
- **Media Processing:** Pillow, OpenCV
- **File Handling:** tempfile, pathlib

---

## Backend Overview

The **backend** is implemented entirely in **Streamlit**, which handles:

1. **File Uploads:** Accepts image and video files (`.jpg`, `.png`, `.mp4`).
2. **Media Processing:** Uses Pillow for images and OpenCV for videos.
3. **Deepfake Detection Model:** Loads a PyTorch `ResNet18` model to classify media as **Real** or **Fake**.
4. **Prediction Logic:**  
   - For images: processes a single image and predicts probabilities.  
   - For videos: samples frames and computes average probabilities across frames.
5. **Results Handling:** Returns predictions and probabilities directly in the UI.

**Backend Entry Point:** `app.py` – handles both backend logic and frontend interface.

---

## Requirements

- Python 3.10 or higher
- PyTorch 2.x
- torchvision
- Pillow
- OpenCV
- Streamlit

Install dependencies and Run:

```bash
pip install -r requirements.txt

streamlit run app.py
