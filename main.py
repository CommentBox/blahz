import sys
import os
import io
import requests
from PIL import Image
from PicImageSearch import Network, Google, Ascii2D, BaiDu, Bing, SauceNAO, Yandex
from PyQt5.QtWidgets import (QApplication, QMainWindow, QWidget, QVBoxLayout, 
                           QHBoxLayout, QPushButton, QLabel, QFileDialog, 
                           QScrollArea, QGridLayout, QFrame)
from PyQt5.QtCore import Qt, QThread, pyqtSignal
from PyQt5.QtGui import QPixmap, QImage, QDragEnterEvent, QDropEvent

class SearchThread(QThread):
    finished = pyqtSignal(dict)
    error = pyqtSignal(str)
    
    def __init__(self, image_path):
        super().__init__()
        self.image_path = image_path
        
    def run(self):
        try:
            async_client = Network()
            engines = {
                'Google': Google,
                'Ascii2D': Ascii2D,
                'BaiDu': BaiDu,
                'Bing': Bing,
                'SauceNAO': SauceNAO,
                'Yandex': Yandex
            }
            
            results = {}
            with open(self.image_path, 'rb') as f:
                image = f.read()
                
            for engine_name, engine_class in engines.items():
                try:
                    searcher = engine_class(async_client)
                    resp = searcher.search(file=image)
                    results[engine_name] = resp.raw
                except Exception as e:
                    print(f"Error with {engine_name}: {str(e)}")
                    
            self.finished.emit(results)
        except Exception as e:
            self.error.emit(str(e))

class ImageWidget(QLabel):
    clicked = pyqtSignal(str)
    
    def __init__(self, image_url):
        super().__init__()
        self.image_url = image_url
        self.setAlignment(Qt.AlignCenter)
        self.setMinimumSize(200, 200)
        self.setMaximumSize(300, 300)
        self.setStyleSheet("""
            QLabel {
                border: 1px solid #E4E6EF;
                border-radius: 8px;
                background: white;
                padding: 5px;
            }
            QLabel:hover {
                border-color: #3699FF;
            }
        """)
        
    def mousePressEvent(self, event):
        if event.button() == Qt.LeftButton:
            self.clicked.emit(self.image_url)

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Reverse Image Search")
        self.setMinimumSize(1200, 800)
        
        # Main widget and layout
        main_widget = QWidget()
        self.setCentralWidget(main_widget)
        layout = QVBoxLayout(main_widget)
        
        # Upload section
        upload_frame = QFrame()
        upload_frame.setStyleSheet("""
            QFrame {
                border: 2px dashed #E4E6EF;
                border-radius: 8px;
                background: #F3F6F9;
                padding: 20px;
                margin: 10px;
            }
            QFrame:hover {
                border-color: #3699FF;
            }
        """)
        upload_layout = QVBoxLayout(upload_frame)
        
        # Preview image
        self.preview_image = QLabel()
        self.preview_image.setAlignment(Qt.AlignCenter)
        self.preview_image.setMinimumHeight(300)
        self.preview_image.setStyleSheet("border: none;")
        upload_layout.addWidget(self.preview_image)
        
        # Upload button
        upload_button = QPushButton("Select Image or Drop Here")
        upload_button.setStyleSheet("""
            QPushButton {
                background: #3699FF;
                color: white;
                border: none;
                border-radius: 6px;
                padding: 10px 20px;
                font-size: 14px;
            }
            QPushButton:hover {
                background: #187DE4;
            }
        """)
        upload_button.clicked.connect(self.select_image)
        upload_layout.addWidget(upload_button)
        
        layout.addWidget(upload_frame)
        
        # Results area
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll.setStyleSheet("border: none;")
        
        self.results_widget = QWidget()
        self.results_layout = QGridLayout(self.results_widget)
        scroll.setWidget(self.results_widget)
        layout.addWidget(scroll)
        
        # Enable drag and drop
        self.setAcceptDrops(True)
        
        self.current_search = None
        
    def select_image(self):
        file_path, _ = QFileDialog.getOpenFileName(
            self, "Select Image", "", "Image Files (*.png *.jpg *.jpeg *.bmp *.gif)"
        )
        if file_path:
            self.start_search(file_path)
            
    def start_search(self, image_path):
        # Clear previous results
        for i in reversed(range(self.results_layout.count())): 
            self.results_layout.itemAt(i).widget().setParent(None)
            
        # Show preview
        pixmap = QPixmap(image_path)
        scaled_pixmap = pixmap.scaled(300, 300, Qt.KeepAspectRatio, Qt.SmoothTransformation)
        self.preview_image.setPixmap(scaled_pixmap)
        
        # Start search
        self.current_search = SearchThread(image_path)
        self.current_search.finished.connect(self.handle_results)
        self.current_search.error.connect(self.handle_error)
        self.current_search.start()
        
    def handle_results(self, results):
        row = 0
        col = 0
        max_cols = 4
        
        for engine, engine_results in results.items():
            if not isinstance(engine_results, list):
                continue
                
            for result in engine_results:
                if not isinstance(result, dict) or 'thumbnail' not in result:
                    continue
                    
                try:
                    response = requests.get(result['thumbnail'])
                    image = Image.open(io.BytesIO(response.content))
                    qimage = QImage(response.content)
                    pixmap = QPixmap.fromImage(qimage)
                    
                    # Create image widget
                    image_widget = ImageWidget(result['thumbnail'])
                    scaled_pixmap = pixmap.scaled(200, 200, Qt.KeepAspectRatio, Qt.SmoothTransformation)
                    image_widget.setPixmap(scaled_pixmap)
                    image_widget.clicked.connect(self.image_clicked)
                    
                    # Add to grid
                    self.results_layout.addWidget(image_widget, row, col)
                    
                    col += 1
                    if col >= max_cols:
                        col = 0
                        row += 1
                except Exception as e:
                    print(f"Error loading image: {str(e)}")
                    
    def handle_error(self, error_message):
        print(f"Search error: {error_message}")
        
    def image_clicked(self, image_url):
        try:
            # Download and save image temporarily
            response = requests.get(image_url)
            temp_path = "temp_search.jpg"
            with open(temp_path, 'wb') as f:
                f.write(response.content)
            self.start_search(temp_path)
        except Exception as e:
            print(f"Error handling image click: {str(e)}")
            
    def dragEnterEvent(self, event: QDragEnterEvent):
        if event.mimeData().hasUrls():
            event.accept()
        else:
            event.ignore()
            
    def dropEvent(self, event: QDropEvent):
        files = event.mimeData().urls()
        if files:
            image_path = files[0].toLocalFile()
            if image_path.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.gif')):
                self.start_search(image_path)

def main():
    app = QApplication(sys.argv)
    
    # Set style
    app.setStyle('Fusion')
    
    window = MainWindow()
    window.show()
    
    sys.exit(app.exec_())

if __name__ == '__main__':
    main()
