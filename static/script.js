document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('uploadForm');
    const imageInput = document.getElementById('imageInput');
    const preview = document.getElementById('preview');
    const imagePreview = document.getElementById('imagePreview');
    const loading = document.getElementById('loading');
    const results = document.getElementById('results');

    // Handle image preview
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imagePreview.src = e.target.result;
                preview.classList.remove('hidden');
            }
            reader.readAsDataURL(file);
        }
    });

    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const selectedEngines = Array.from(document.querySelectorAll('input[name="engines[]"]:checked'))
            .map(checkbox => checkbox.value);

        if (selectedEngines.length === 0) {
            alert('Please select at least one search engine');
            return;
        }

        if (!imageInput.files[0]) {
            alert('Please select an image');
            return;
        }

        const formData = new FormData();
        formData.append('file', imageInput.files[0]);
        selectedEngines.forEach(engine => {
            formData.append('engines[]', engine);
        });

        try {
            loading.classList.remove('hidden');
            results.innerHTML = '';

            const response = await fetch('/search', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }

            displayResults(data);
        } catch (error) {
            console.error('Error:', error);
            results.innerHTML = `<div class="error">Error: ${error.message}</div>`;
        } finally {
            loading.classList.add('hidden');
        }
    });

    function createImageElement(result) {
        const img = document.createElement('img');
        img.alt = result.title || 'No title';
        img.className = 'absolute top-0 left-0 w-full h-full object-cover rounded-lg';
        
        // Set a loading placeholder
        img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23ddd"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23666"%3ELoading...%3C/text%3E%3C/svg%3E';
        
        // Load the actual image
        const actualImage = new Image();
        actualImage.onload = function() {
            img.src = this.src;
        };
        actualImage.onerror = function() {
            img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23ddd"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23666"%3ENo Image%3C/text%3E%3C/svg%3E';
        };
        if (result.thumbnail) {
            actualImage.src = result.thumbnail;
        } else {
            img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23ddd"/%3E%3Ctext x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23666"%3ENo Image%3C/text%3E%3C/svg%3E';
        }
        
        return img;
    }

    function displayResults(data) {
        results.innerHTML = '';

        for (const [engine, engineResults] of Object.entries(data)) {
            const engineSection = document.createElement('div');
            engineSection.className = 'col-span-1 bg-white rounded-lg shadow-lg p-6 mb-6';
            
            let engineContent = `<h2 class="text-xl font-bold mb-4 text-gray-800 capitalize">${engine}</h2>`;

            if (engineResults.error) {
                engineContent += `
                    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        Error: ${engineResults.error}
                    </div>`;
            } else {
                engineContent += `<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">`;
                engineResults.forEach(result => {
                    engineContent += `
                        <div class="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                            <div class="relative pb-[100%] mb-3">
                                <div class="absolute inset-0 bg-gray-100 rounded-lg"></div>
                            </div>
                            <h3 class="font-semibold text-gray-700 mt-2 line-clamp-2">${result.title || 'No title'}</h3>
                            ${result.similarity ? `
                                <div class="text-sm text-gray-600 mt-1">
                                    Similarity: ${result.similarity}
                                </div>
                            ` : ''}
                            ${result.source ? `
                                <div class="text-sm text-gray-600 mt-1">
                                    Source: ${result.source}
                                </div>
                            ` : ''}
                            ${result.size ? `
                                <div class="text-sm text-gray-600 mt-1">
                                    Size: ${result.size}
                                </div>
                            ` : ''}
                            <a href="${result.url}" target="_blank" rel="noopener noreferrer" 
                               class="inline-block mt-2 text-blue-500 hover:text-blue-700 text-sm">
                                View Source →
                            </a>
                        </div>
                    `;
                });
                engineContent += '</div>';
            }
            
            engineSection.innerHTML = engineContent;
            results.appendChild(engineSection);

            // Add images after the HTML is set
            if (!engineResults.error) {
                const imageContainers = engineSection.querySelectorAll('.relative.pb-\\[100\\%\\]');
                engineResults.forEach((result, index) => {
                    if (imageContainers[index]) {
                        const img = createImageElement(result);
                        imageContainers[index].appendChild(img);
                    }
                });
            }
        }
    }
});
