import cv2
from ultralytics import YOLO

yolo_model = YOLO("yolov8n.pt")

def detect_human(image_path):
    image = cv2.imread(image_path)
    results = yolo_model(image)

    for result in results:
        for box in result.boxes:
            if box.cls == 0 and box.conf.item() > 0.5:
                return True
    return False
