// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const videoInput = document.getElementById('videoInput');
const selectFileBtn = document.getElementById('selectFileBtn');
const progressSection = document.getElementById('progressSection');
const detailsSection = document.getElementById('detailsSection');
const successSection = document.getElementById('successSection');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const detailsForm = document.getElementById('detailsForm');
const cancelBtn = document.getElementById('cancelBtn');
const uploadAnotherBtn = document.getElementById('uploadAnotherBtn');
const videoPreview = document.getElementById('videoPreview');

// File size limit (100MB)
const MAX_FILE_SIZE = 100 * 1024 * 1024;

// Allowed file types
const ALLOWED_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];

let selectedFile = null;

// Select file button click
selectFileBtn.addEventListener('click', () => {
    videoInput.click();
});

// File input change
videoInput.addEventListener('change', (e) => {
    const files = e.target.files;
    if (files.length > 0) {
        handleFileSelect(files[0]);
    }
});

// Drag and drop events
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileSelect(files[0]);
    }
});

// Handle file selection
function handleFileSelect(file) {
    // Validate file
    if (!ALLOWED_TYPES.includes(file.type)) {
        alert('Please select a valid video file (MP4, WebM, or OGG)');
        return;
    }

    if (file.size > MAX_FILE_SIZE) {
        alert('File size exceeds 100MB limit');
        return;
    }

    selectedFile = file;
    
    // Show progress and hide upload area
    uploadArea.style.display = 'none';
    progressSection.style.display = 'block';
    
    // Simulate upload progress
    simulateUpload();
}

// Simulate upload progress
function simulateUpload() {
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 30;
        
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            completeUpload();
        }
        
        updateProgress(progress);
    }, 300);
}

// Update progress bar
function updateProgress(percent) {
    progressFill.style.width = percent + '%';
    progressText.textContent = Math.round(percent) + '%';
}

// Complete upload and show details form
function completeUpload() {
    // Create object URL for video preview
    const videoUrl = URL.createObjectURL(selectedFile);
    videoPreview.src = videoUrl;
    
    // Hide progress and show details form
    progressSection.style.display = 'none';
    detailsSection.style.display = 'block';
}

// Form submission
detailsForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const username = document.getElementById('username').value;
    const description = document.getElementById('description').value;
    const audioTitle = document.getElementById('audioTitle').value;
    const avatarColor1 = document.getElementById('avatarColor').value;
    const avatarColor2 = document.getElementById('avatarColor2').value;
    
    // Create reel object
    const reel = {
        id: Date.now(),
        username: username,
        description: description,
        audioTitle: audioTitle || 'Original Audio',
        avatarColor1: avatarColor1,
        avatarColor2: avatarColor2,
        videoUrl: URL.createObjectURL(selectedFile),
        videoData: selectedFile,
        likes: 0,
        timestamp: new Date().toISOString()
    };
    
    // Save to localStorage
    saveReelToStorage(reel);
    
    // Show success message
    detailsSection.style.display = 'none';
    successSection.style.display = 'block';
}

// Save reel to localStorage
function saveReelToStorage(reel) {
    try {
        // Get existing reels
        let reels = JSON.parse(localStorage.getItem('uploadedReels')) || [];
        
        // Add new reel
        reels.push({
            id: reel.id,
            username: reel.username,
            description: reel.description,
            audioTitle: reel.audioTitle,
            avatarColor1: reel.avatarColor1,
            avatarColor2: reel.avatarColor2,
            videoUrl: reel.videoUrl,
            likes: reel.likes,
            timestamp: reel.timestamp
        });
        
        // Save to localStorage
        localStorage.setItem('uploadedReels', JSON.stringify(reels));
        
        console.log('Reel saved successfully:', reel);
    } catch (error) {
        console.error('Error saving reel:', error);
        alert('Error saving reel. File might be too large.');
    }
}

// Cancel button
cancelBtn.addEventListener('click', () => {
    resetForm();
});

// Upload another button
uploadAnotherBtn.addEventListener('click', () => {
    resetForm();
});

// Reset form to initial state
function resetForm() {
    // Reset form
    detailsForm.reset();
    videoInput.value = '';
    selectedFile = null;
    
    // Reset progress
    progressFill.style.width = '0%';
    progressText.textContent = '0%';
    
    // Show upload area and hide other sections
    uploadArea.style.display = 'block';
    progressSection.style.display = 'none';
    detailsSection.style.display = 'none';
    successSection.style.display = 'none';
}

// Initialize on page load
window.addEventListener('load', () => {
    // Check if there's an existing video source in the URL or sessionStorage
    const existingVideo = sessionStorage.getItem('videoToUpload');
    if (existingVideo) {
        sessionStorage.removeItem('videoToUpload');
    }
});