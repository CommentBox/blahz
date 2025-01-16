import requests
import os

def download_file(url, local_path):
    response = requests.get(url)
    if response.status_code == 200:
        os.makedirs(os.path.dirname(local_path), exist_ok=True)
        with open(local_path, 'wb') as f:
            f.write(response.content)
        print(f"Downloaded {local_path}")
    else:
        print(f"Failed to download {url}")

# Font Awesome files
fa_files = {
    'fa-regular-400.woff2': 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/webfonts/fa-regular-400.woff2',
    'fa-solid-900.woff2': 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/webfonts/fa-solid-900.woff2'
}

# Poppins font files
poppins_files = {
    'poppins-light.woff2': 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLDz8Z1xlFQ.woff2',
    'poppins-regular.woff2': 'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2',
    'poppins-medium.woff2': 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2',
    'poppins-semibold.woff2': 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLEj6Z1xlFQ.woff2'
}

# Download Font Awesome files
for filename, url in fa_files.items():
    local_path = os.path.join('static', 'fonts', filename)
    download_file(url, local_path)

# Download Poppins files
for filename, url in poppins_files.items():
    local_path = os.path.join('static', 'fonts', filename)
    download_file(url, local_path)

print("All fonts downloaded successfully!")
