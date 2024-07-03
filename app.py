from flask import Flask, request, render_template
import cv2
import numpy as np
from io import BytesIO
import base64
from PIL import Image

app = Flask(__name__)

def get_average_color(image, x, y, w, h):
    roi = image[y:y+h, x:x+w]
    avg_color_per_row = np.average(roi, axis=0)
    avg_color = np.average(avg_color_per_row, axis=0)
    return avg_color

def analyze_urine_strip(image):
    strip_height, strip_width, _ = image.shape
    pad_height = strip_height // 10
    parameters = ['URO', 'BIL', 'KET', 'BLD', 'PRO', 'NIT', 'LEU', 'GLU', 'SG', 'PH']
    colors = {}

    for i in range(10):
        y = i * pad_height
        color = get_average_color(image, 0, y, strip_width, pad_height)
        colors[parameters[i]] = [int(c) for c in color]
    return colors

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'image' not in request.files:
        return "No file part"
    file = request.files['image']
    if file.filename == '':
        return "No selected file"
    if file:
        # Read image file
        image = Image.open(file.stream)
        image = np.array(image)
        colors = analyze_urine_strip(image)
        
        # Convert image to base64 for displaying in HTML
        buffered = BytesIO()
        image = Image.fromarray(image)
        image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()

        return render_template('result.html', image_data=img_str, colors=colors)

if __name__ == '__main__':
    app.run(debug=True, port=5500)
