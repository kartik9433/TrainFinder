const API_BASE_URL = 'http://localhost:8080';

// DOM Elements
const searchForm = document.getElementById('searchForm');
const resultsSection = document.getElementById('resultsSection');
const loadingSection = document.getElementById('loadingSection');
const trainResults = document.getElementById('trainResults');
const resultsCount = document.getElementById('resultsCount');
const searchBtn = document.getElementById('searchBtn');
const sourceCodeInput = document.getElementById('sourceCode');
const destinationCodeInput = document.getElementById('destinationCode');

// Event Listeners
document.addEventListener('DOMContentLoaded', initializeApp);
searchForm.addEventListener('submit', handleFormSubmit);
sourceCodeInput.addEventListener('input', handleInputUppercase);
destinationCodeInput.addEventListener('input', handleInputUppercase);

// Initialize the application
function initializeApp() {
    console.log('Train Search App initialized');
    // You can pre-fill with example values for testing
    // sourceCodeInput.value = 'NDLS';
    // destinationCodeInput.value = 'PNNN';
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();
    
    const sourceCode = sourceCodeInput.value.trim();
    const destinationCode = destinationCodeInput.value.trim();
    
    if (!sourceCode || !destinationCode) {
        showError('Please enter both source and destination station codes');
        return;
    }

    if (sourceCode.length < 3 || destinationCode.length < 3) {
        showError('Station codes must be at least 3 characters long');
        return;
    }

    await searchTrains(sourceCode, destinationCode);
}

// Convert input to uppercase automatically
function handleInputUppercase(e) {
    e.target.value = e.target.value.toUpperCase();
}

// Main search function
async function searchTrains(sourceCode, destinationCode) {
    showLoading();
    hideResults();
    hideError();

    try {
        const url = `${API_BASE_URL}/search/by-code?sourceCode=${encodeURIComponent(sourceCode)}&destinationCode=${encodeURIComponent(destinationCode)}`;
        
        console.log('Fetching from:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }
        
        const trains = await response.json();
        console.log('API Response:', trains);
        
        hideLoading();
        displayResults(trains, sourceCode, destinationCode);
        
    } catch (error) {
        hideLoading();
        console.error('Error fetching trains:', error);
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            showError('Unable to connect to the server. Please ensure the API server is running on localhost:8080');
        } else if (error.message.includes('404')) {
            showError('API endpoint not found. Please check the server configuration.');
        } else if (error.message.includes('500')) {
            showError('Server error occurred. Please try again later.');
        } else {
            showError(`Error: ${error.message}`);
        }
    }
}

// Display search results
function displayResults(trains, sourceCode, destinationCode) {
    if (!trains || trains.length === 0) {
        showNoResults(sourceCode, destinationCode);
        return;
    }

    resultsCount.textContent = `Found ${trains.length} train${trains.length > 1 ? 's' : ''} from ${sourceCode} to ${destinationCode}`;
    
    trainResults.innerHTML = trains.map(train => createTrainCard(train)).join('');
    
    showResults();
}

// Create individual train card HTML
function createTrainCard(train) {
    return `
        <div class="train-card">
            <div class="train-header">
                <div class="train-id">Train #${train.id}</div>
            </div>
            <div class="route-info">
                <div class="station-info">
                    <div class="station-name">${escapeHtml(train.station.stationName)}</div>
                    <div class="station-code">${escapeHtml(train.station.stationCode)}</div>
                    <div class="time-info">
                        <div class="time">${formatTime(train.departureTime)}</div>
                        <div class="time-label">Departure</div>
                    </div>
                </div>
                <div class="route-arrow">→</div>
                <div class="station-info">
                    <div class="station-name">${escapeHtml(train.destination.stationName)}</div>
                    <div class="station-code">${escapeHtml(train.destination.stationCode)}</div>
                    <div class="time-info">
                        <div class="time">${formatTime(train.arrivalTime)}</div>
                        <div class="time-label">Arrival</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Format time from 24-hour to 12-hour format
function formatTime(timeString) {
    if (!timeString) return 'N/A';
    
    try {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    } catch (error) {
        console.error('Error formatting time:', error);
        return timeString;
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show loading state
function showLoading() {
    loadingSection.style.display = 'block';
    searchBtn.disabled = true;
    searchBtn.textContent = 'Searching...';
}

// Hide loading state
function hideLoading() {
    loadingSection.style.display = 'none';
    searchBtn.disabled = false;
    searchBtn.textContent = 'Search Trains';
}

// Show results section
function showResults() {
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Hide results section
function hideResults() {
    resultsSection.style.display = 'none';
}

// Show error message
function showError(message) {
    hideError();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    errorDiv.id = 'errorMessage';
    
    const container = document.querySelector('.container');
    container.appendChild(errorDiv);
    
    // Auto-hide error after 5 seconds
    setTimeout(hideError, 5000);
}

// Hide error message
function hideError() {
    const existingError = document.getElementById('errorMessage');
    if (existingError) {
        existingError.remove();
    }
}

// Show no results message
function showNoResults(sourceCode, destinationCode) {
    trainResults.innerHTML = `
        <div class="no-results">
            <div class="no-results-icon">🚫</div>
            <h3>No trains found</h3>
            <p>No trains available from ${escapeHtml(sourceCode)} to ${escapeHtml(destinationCode)}</p>
            <p>Please check the station codes and try again</p>
        </div>
    `;
    resultsCount.textContent = `No trains found from ${sourceCode} to ${destinationCode}`;
    showResults();
}

// Utility function to calculate journey duration
function calculateDuration(departureTime, arrivalTime) {
    try {
        const [depHours, depMinutes] = departureTime.split(':').map(Number);
        const [arrHours, arrMinutes] = arrivalTime.split(':').map(Number);
        
        let depTotalMinutes = depHours * 60 + depMinutes;
        let arrTotalMinutes = arrHours * 60 + arrMinutes;
        
        // Handle next day arrival
        if (arrTotalMinutes < depTotalMinutes) {
            arrTotalMinutes += 24 * 60;
        }
        
        const durationMinutes = arrTotalMinutes - depTotalMinutes;
        const hours = Math.floor(durationMinutes / 60);
        const minutes = durationMinutes % 60;
        
        return `${hours}h ${minutes}m`;
    } catch (error) {
        console.error('Error calculating duration:', error);
        return 'N/A';
    }
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatTime,
        calculateDuration,
        escapeHtml
    };
}