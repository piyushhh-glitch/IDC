import os
from pathlib import Path
from PIL import Image
from torchvision import transforms, datasets, models
import torch
from torch import nn, optim
from torch.utils.data import DataLoader

class DeepfakeModel(nn.Module):
    def __init__(self):
        super().__init__()
        self.model = models.resnet18(pretrained=True)
        self.model.fc = nn.Linear(self.model.fc.in_features, 2)

    def forward(self, x):
        return self.model(x)

model = DeepfakeModel()
# ... train model ...
torch.save(model.state_dict(), "deepfake_model.pth")

def train_model(dataset_dir="dataset", model_save_path="deepfake_model.pth",
                batch_size=16, epochs=5, lr=1e-4, img_size=224):

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    # Transforms
    transform = transforms.Compose([
        transforms.Resize((img_size, img_size)),
        transforms.ToTensor(),
        transforms.Normalize([0.5, 0.5, 0.5], [0.5, 0.5, 0.5])
    ])

    # Dataset & DataLoader
    dataset = datasets.ImageFolder(dataset_dir, transform=transform)
    dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=True)

    # Model, Loss, Optimizer
    model = DeepfakeModel()
    model = model.to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=lr)

    # Training loop
    for epoch in range(epochs):
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0
        for images, labels in dataloader:
            images, labels = images.to(device), labels.to(device)
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            running_loss += loss.item() * images.size(0)
            _, predicted = outputs.max(1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()

        print(f"Epoch [{epoch+1}/{epochs}] Loss: {running_loss/total:.4f} Accuracy: {correct/total:.4f}")

    torch.save(model.state_dict(), model_save_path)
    print(f"Model saved to {model_save_path}")

if __name__ == "__main__":
    train_model()
