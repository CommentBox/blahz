import os
from quart import Quart, request, render_template, session, jsonify, redirect, url_for
from pathlib import Path
import asyncio
import logging
from datetime import datetime, timedelta
from PicImageSearch import Network
from PicImageSearch.engines import Ascii2D, BaiDu, Bing, Google, SauceNAO, Yandex
import httpx
import json
import uuid
import shutil
from hashlib import sha3_256
import time
import requests

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Quart(__name__)
app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')
app.secret_key = 'your-secret-key-here'

@app.after_request
def add_security_headers(response):
    response.headers['Content-Security-Policy'] = "default-src *; img-src * data: blob: 'unsafe-inline'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com;"
    return response

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Configure Network settings
Network.headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

# Search limit tracking
DAILY_SEARCH_LIMIT = 5
SEARCHES_PER_AD = 3

# Favorites configuration
FAVORITES_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'favorites')
os.makedirs(FAVORITES_DIR, exist_ok=True)

# Share code storage
SHARE_CODES_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'share_codes.json')

def load_share_codes():
    try:
        if os.path.exists(SHARE_CODES_FILE):
            with open(SHARE_CODES_FILE, 'r') as f:
                return json.load(f)
    except Exception as e:
        logger.error(f"Error loading share codes: {str(e)}")
    return {}

def save_share_codes(codes):
    try:
        # Create directory if it doesn't exist
        os.makedirs(os.path.dirname(SHARE_CODES_FILE), exist_ok=True)
        with open(SHARE_CODES_FILE, 'w') as f:
            json.dump(codes, f)
    except Exception as e:
        logger.error(f"Error saving share codes: {str(e)}")

def get_user_favorites_file(user_id):
    return os.path.join(FAVORITES_DIR, f'{user_id}_favorites.json')

def load_favorites(user_id):
    favorites_file = get_user_favorites_file(user_id)
    if os.path.exists(favorites_file):
        try:
            with open(favorites_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except json.JSONDecodeError:
            logger.error(f"Error reading favorites file for user {user_id}")
            return []
    return []

def save_favorites(user_id, favorites):
    favorites_file = get_user_favorites_file(user_id)
    try:
        with open(favorites_file, 'w', encoding='utf-8') as f:
            json.dump(favorites, f, ensure_ascii=False)
    except Exception as e:
        logger.error(f"Error saving favorites for user {user_id}: {str(e)}")

# Initialize engines with API keys if needed
def init_engines():
    return {
        'ascii2d': Ascii2D(),
        'baidu': BaiDu(),
        'bing': Bing(),
        'google': Google(),
        'saucenao': SauceNAO(),  # Add API key if you have one
        'yandex': Yandex()
    }

@app.before_request
async def before_request():
    if 'user_id' not in session:
        session['user_id'] = str(uuid.uuid4())
    if 'searches_left' not in session:
        session['searches_left'] = DAILY_SEARCH_LIMIT
        session['last_reset'] = datetime.now().strftime('%Y-%m-%d')
    
    # Reset daily limit if it's a new day
    today = datetime.now().strftime('%Y-%m-%d')
    if session.get('last_reset') != today:
        session['searches_left'] = DAILY_SEARCH_LIMIT
        session['last_reset'] = today

@app.route('/')
async def index():
    return await render_template('index.html')

@app.route('/get_search_count')
async def get_search_count():
    return jsonify({'count': session.get('searches_left', 0)})

@app.route('/add_search', methods=['POST'])
async def add_search():
    session['searches_left'] = session.get('searches_left', 0) + SEARCHES_PER_AD
    return jsonify({'count': session['searches_left']})

async def create_client():
    """Create an httpx client with appropriate settings"""
    return httpx.AsyncClient(
        timeout=30.0,
        follow_redirects=True,
        headers=Network.headers,
        verify=False  # Added to handle SSL issues
    )

async def search_single_engine(engine, file_path, client):
    """Search with a single engine and process its results"""
    engine_name = engine.__class__.__name__.lower()
    logger.info(f"Starting search with {engine_name}")
    
    try:
        # Set the client for the engine
        engine.client = client
        
        # Perform the search
        resp = await engine.search(file=file_path)
        logger.info(f"{engine_name} search completed")
        
        if not resp or not hasattr(resp, 'raw') or not resp.raw:
            logger.warning(f"{engine_name}: No results found")
            return []
            
        results = []
        for item in resp.raw:
            try:
                result = {}
                
                # Get URL (required)
                url = getattr(item, 'url', None)
                if url:
                    result['url'] = str(url)
                
                # Get thumbnail
                thumbnail = getattr(item, 'thumbnail', None)
                if thumbnail:
                    thumb = str(thumbnail)
                    if thumb.startswith('//'):
                        thumb = 'https:' + thumb
                    result['thumbnail'] = thumb
                
                # Get title
                title = getattr(item, 'title', None)
                if title:
                    result['title'] = str(title)
                
                # Get similarity
                similarity = getattr(item, 'similarity', None)
                if similarity:
                    result['similarity'] = str(similarity)
                
                # Get author
                author = getattr(item, 'author', None)
                if author:
                    if isinstance(author, dict):
                        result['author'] = author.get('name', '')
                    else:
                        result['author'] = str(author)
                
                # Only add if we have a URL or thumbnail
                if 'url' in result or 'thumbnail' in result:
                    logger.debug(f"{engine_name} found result: {result}")
                    results.append(result)
                
            except Exception as e:
                logger.error(f"Error processing {engine_name} result: {str(e)}")
                continue
        
        logger.info(f"{engine_name} found {len(results)} results")
        return results
        
    except Exception as e:
        logger.error(f"Error in {engine_name}: {str(e)}")
        return []

@app.route('/search', methods=['POST'])
async def search():
    try:
        # Check search limit
        if session.get('searches_left', 0) <= 0:
            return jsonify({'error': 'No searches left today. Watch an ad to get more searches.'}), 403
            
        if 'file' not in await request.files:
            return jsonify({'error': 'No file uploaded'}), 400
        
        file = (await request.files)['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Save uploaded file
        filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}_{file.filename}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        await file.save(file_path)
        logger.info(f"Saved file: {file_path}")
        
        try:
            # Initialize engines
            engines = init_engines()
            
            # Create a shared client for all engines
            async with await create_client() as client:
                # Create tasks for all engines
                tasks = []
                for name, engine in engines.items():
                    task = asyncio.create_task(search_single_engine(engine, file_path, client))
                    tasks.append((name, task))
                
                # Wait for all tasks to complete
                results = {}
                for name, task in tasks:
                    try:
                        engine_results = await task
                        results[name] = engine_results
                    except Exception as e:
                        logger.error(f"Task error for {name}: {str(e)}")
                        results[name] = []
            
            # Deduct a search
            session['searches_left'] = max(0, session.get('searches_left', 0) - 1)
            
            # Clean up uploaded file
            try:
                os.remove(file_path)
            except Exception as e:
                logger.error(f"Error removing file {file_path}: {str(e)}")
            
            return jsonify(results)
            
        except Exception as e:
            logger.error(f"Search error: {str(e)}")
            return jsonify({'error': str(e)}), 500
            
    except Exception as e:
        logger.error(f"Request error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/favorite', methods=['POST'])
async def favorite_image():
    try:
        data = await request.get_json()
        image_data = data.get('image')
        if not image_data:
            return jsonify({'error': 'No image data provided'}), 400
        
        user_id = session.get('user_id')
        favorites = load_favorites(user_id)
        
        # Check if image is already favorited by comparing URLs
        existing_urls = [f.get('url') for f in favorites]
        if image_data.get('url') in existing_urls:
            favorites = [f for f in favorites if f.get('url') != image_data.get('url')]
            save_favorites(user_id, favorites)
            return jsonify({'status': 'removed'})
        else:
            favorites.append(image_data)
            save_favorites(user_id, favorites)
            return jsonify({'status': 'added'})
            
    except Exception as e:
        logger.error(f"Error in favorite_image: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/favorites')
async def view_favorites():
    try:
        user_id = session.get('user_id')
        favorites = load_favorites(user_id)
        return jsonify({'favorites': favorites})
    except Exception as e:
        logger.error(f"Error in view_favorites: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/generate_share')
async def generate_share_code():
    try:
        user_id = session.get('user_id')
        favorites = load_favorites(user_id)
        
        if not favorites:
            return jsonify({'error': 'No favorites to share'}), 400
        
        # Generate unique share code
        timestamp = str(time.time())
        keccak = sha3_256()
        keccak.update(f"{user_id}_{timestamp}".encode())
        share_code = keccak.hexdigest()[:12]
        
        # Load existing share codes
        share_codes = load_share_codes()
        
        # Add new share code
        share_codes[share_code] = {
            'user_id': user_id,
            'created_at': timestamp
        }
        
        # Save updated share codes
        save_share_codes(share_codes)
        
        return jsonify({'share_code': share_code})
    except Exception as e:
        logger.error(f"Error in generate_share_code: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/share/<share_code>')
async def view_shared_favorites(share_code):
    try:
        # Get current user's ID
        current_user_id = session.get('user_id')
        if not current_user_id:
            return jsonify({'error': 'Please refresh the page and try again'}), 401

        # Load share codes
        share_codes = load_share_codes()
        logger.info(f"Available share codes: {list(share_codes.keys())}")
        logger.info(f"Requested share code: {share_code}")
        
        # Check if share code exists
        if share_code not in share_codes:
            return jsonify({'error': 'Invalid share code'}), 404
            
        # Get sharer's user ID
        sharer_data = share_codes[share_code]
        sharer_id = sharer_data['user_id']
        
        # Don't allow sharing to yourself
        if sharer_id == current_user_id:
            return jsonify({'error': 'Cannot use your own share code'}), 400
        
        # Load both users' favorites
        sharer_favorites = load_favorites(sharer_id)
        current_favorites = load_favorites(current_user_id)
        
        # Create a set of existing URLs for O(1) lookup
        existing_urls = {fav['url'] for fav in current_favorites if 'url' in fav}
        
        # Track how many new favorites were added
        new_favorites_count = 0
        
        # Add sharer's favorites to current user's favorites
        for fav in sharer_favorites:
            # Skip if no URL
            if 'url' not in fav:
                continue
                
            # Only check URL for duplicates
            if fav['url'] not in existing_urls:
                current_favorites.append(fav)
                existing_urls.add(fav['url'])
                new_favorites_count += 1
        
        # Save updated favorites if we added any
        if new_favorites_count > 0:
            save_favorites(current_user_id, current_favorites)
            message = f"Added {new_favorites_count} new hearted pics to your collection!"
        else:
            message = "You already have all these hearted pics!"
        
        # Remove the used share code
        del share_codes[share_code]
        save_share_codes(share_codes)
        
        return jsonify({
            'favorites': current_favorites,
            'message': message,
            'added_count': new_favorites_count
        })
        
    except Exception as e:
        logger.error(f"Error in view_shared_favorites: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=False, port=5000)
