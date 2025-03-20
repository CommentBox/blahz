from flask import Flask, send_from_directory
import os

app = Flask(__name__)

# Path to your ads.txt file
ads_txt_path = os.path.join(os.getcwd(), 'ads.txt')

@app.route('/ads.txt')
def serve_ads_txt():
    return send_from_directory(os.getcwd(), 'ads.txt')

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=80)
