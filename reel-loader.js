// Reel Loader Script - Handles dynamic loading of reels
const reelsContainer = document.getElementById('reelsContainer');
const homeBtn = document.getElementById('homeBtn');

// Sample reel data (default reel)
const defaultReel = {
    id: 1,
    username: '@madanrathore_fanclub',
    description: 'Uploaded by Madan Rathore Fan Club 🔥 #madanrathore #fanclub #viral',
    audioTitle: 'Original Audio - Madan Rathore Fan Club',
    videoUrl: 'your-video.mp4',
    avatarColor1: '#667eea',
    avatarColor2: '#764ba2',
    likes: 125000,
    liked: false
};

// Initialize on page load
window.addEventListener('load', () => {
    loadReels();
});

// Load all reels
function loadReels() {
    // Get uploaded reels from localStorage
    let uploadedReels = [];
    try {
        uploadedReels = JSON.parse(localStorage.getItem('uploadedReels')) || [];
    } catch (error) {
        console.error('Error loading reels from storage:', error);
    }

    // Combine default reel with uploaded reels
    const allReels = [defaultReel, ...uploadedReels];

    // Clear container
    reelsContainer.innerHTML = '';

    // Create reel elements
    allReels.forEach((reel, index) => {
        const reelElement = createReelElement(reel, index);
        reelsContainer.appendChild(reelElement);
    });
}

// Create individual reel element
function createReelElement(reel, index) {
    const reelDiv = document.createElement('div');
    reelDiv.className = 'reel';
    reelDiv.id = `reel-${reel.id}`;

    // Avatar gradient style
    const avatarGradient = `linear-gradient(135deg, ${reel.avatarColor1} 0%, ${reel.avatarColor2} 100%)`;

    reelDiv.innerHTML = `
        <div class="reel-video">
            <video class="video-player" playsinline loop muted>
                <source src="${reel.videoUrl}" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>

        <div class="reel-overlay">
            <div class="reel-info">
                <div class="user-info">
                    <div class="user-avatar" style="background: ${avatarGradient}; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: bold;">
                        ${reel.username.substring(1, 3).toUpperCase()}
                    </div>
                    <span class="username">${reel.username}</span>
                    <button class="follow-btn">Follow</button>
                </div>
                <p class="reel-description">${reel.description}</p>
                <div class="audio-info">
                    <svg class="music-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                    </svg>
                    <span class="audio-text">${reel.audioTitle}</span>
                </div>
            </div>

            <div class="reel-actions">
                <button class="action-btn like-btn" data-reel-id="${reel.id}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                    <span class="like-count">${formatCount(reel.likes)}</span>
                </button>

                <button class="action-btn" style="opacity: 0.5; cursor: not-allowed">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    <span>Off</span>
                </button>

                <button class="action-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                    </svg>
                    <span>Share</span>
                </button>

                <button class="action-btn">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="19" r="1" />
                    </svg>
                </button>

                <div class="audio-thumbnail" style="background: linear-gradient(45deg, #f093fb 0%, #f5576c 100%); display: flex; align-items: center; justify-content: center;">
                    <svg viewBox="0 0 24 24" fill="white" style="width: 20px; height: 20px">
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                    </svg>
                </div>
            </div>
        </div>
    `;

    // Add event listeners after creating the element
    setTimeout(() => {
        addReelEventListeners(reelDiv, reel, index);
    }, 0);

    return reelDiv;
}

// Add event listeners to reel
function addReelEventListeners(reelElement, reel, index) {
    const video = reelElement.querySelector('.video-player');
    const likeBtn = reelElement.querySelector('.like-btn');
    const followBtn = reelElement.querySelector('.follow-btn');

    // Video controls
    video.addEventListener('click', () => {
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    });

    // Auto play first video
    if (index === 0) {
        video.play().catch(err => console.log('Autoplay prevented:', err));
    }

    // Like button
    likeBtn.addEventListener('click', () => {
        toggleLike(likeBtn, reel);
    });

    // Follow button
    followBtn.addEventListener('click', () => {
        followBtn.textContent = followBtn.textContent === 'Follow' ? 'Following' : 'Follow';
        followBtn.style.backgroundColor = followBtn.textContent === 'Following' ? '#fff' : 'transparent';
        followBtn.style.color = followBtn.textContent === 'Following' ? '#000' : '#fff';
    });

    // Intersection Observer for video autoplay
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                video.play().catch(err => console.log('Autoplay prevented:', err));
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.5 });

    observer.observe(reelElement);
}

// Toggle like
function toggleLike(likeBtn, reel) {
    const likeCountSpan = likeBtn.querySelector('.like-count');
    const icon = likeBtn.querySelector('svg');
    const isLiked = likeBtn.classList.contains('liked');

    if (!isLiked) {
        reel.likes++;
        likeBtn.classList.add('liked');
        icon.innerHTML = '<path fill="red" stroke="red" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>';
        
        // Animation
        likeBtn.style.transform = 'scale(1.2)';
        setTimeout(() => {
            likeBtn.style.transform = 'scale(1)';
        }, 200);
    } else {
        reel.likes--;
        likeBtn.classList.remove('liked');
        icon.innerHTML = '<path fill="none" stroke="currentColor" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>';
        
        // Animation
        likeBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            likeBtn.style.transform = 'scale(1)';
        }, 200);
    }

    likeCountSpan.textContent = formatCount(reel.likes);

    // Save to localStorage if it's an uploaded reel
    if (reel.id !== 1) {
        updateReelInStorage(reel);
    }
}

// Update reel in localStorage
function updateReelInStorage(reel) {
    try {
        let reels = JSON.parse(localStorage.getItem('uploadedReels')) || [];
        const reelIndex = reels.findIndex(r => r.id === reel.id);
        if (reelIndex !== -1) {
            reels[reelIndex].likes = reel.likes;
            localStorage.setItem('uploadedReels', JSON.stringify(reels));
        }
    } catch (error) {
        console.error('Error updating reel:', error);
    }
}

// Format count with K suffix
function formatCount(count) {
    if (count >= 1000) {
        return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return count.toString();
}

// Home button
homeBtn.addEventListener('click', () => {
    reelsContainer.scrollTo({ top: 0, behavior: 'smooth' });
});