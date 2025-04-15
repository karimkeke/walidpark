// Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize charts if they exist
    if (typeof initializeStatistics === 'function') {
        initializeStatistics();
    }
    
    // Handle missing images by creating canvas placeholders
    handleMissingImages();
    
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
    }
    
    // Active link highlighting
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav ul li a');
    const mobileLinks = document.querySelectorAll('.mobile-menu ul li a');
    
    function setActiveLinks(links) {
        links.forEach(link => {
            // Remove all active classes first
            link.classList.remove('active');
            
            // Add active class if the href matches the current path
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            }
        });
    }
    
    setActiveLinks(navLinks);
    setActiveLinks(mobileLinks);
    
    // Apply filters in the My Bookings page
    const filterStatus = document.getElementById('filter-status');
    const sortBy = document.getElementById('sort-by');
    
    if (filterStatus && sortBy) {
        window.applyFilters = function() {
            const filterValue = filterStatus.value;
            const sortValue = sortBy.value;
            
            window.location.href = `my_bookings.php?filter=${filterValue}&sort=${sortValue}`;
        };
    }
    
    // Parking Map slot selection
    const parkingSpots = document.querySelectorAll('.parking-spot');
    
    if (parkingSpots.length > 0) {
        parkingSpots.forEach(spot => {
            if (spot.classList.contains('available')) {
                spot.addEventListener('click', function() {
                    const spotId = this.getAttribute('data-spot-id');
                    window.location.href = `book_spot.php?slot_id=${spotId}`;
                });
            }
        });
    }
    
    // Tooltips for parking spots
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    
    if (tooltipElements.length > 0) {
        tooltipElements.forEach(element => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = element.getAttribute('data-tooltip');
            
            element.appendChild(tooltip);
            
            element.addEventListener('mouseenter', () => {
                tooltip.style.display = 'block';
                setTimeout(() => {
                    tooltip.style.opacity = '1';
                }, 10);
            });
            
            element.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
                setTimeout(() => {
                    tooltip.style.display = 'none';
                }, 300);
            });
        });
    }
});

// Function to handle missing images
function handleMissingImages() {
    const placeholderColors = {
        'parking-map': { background: '#4ade80', text: 'Parking Map', icon: 'fa-map-marker-alt' },
        'my-bookings': { background: '#4361ee', text: 'My Bookings', icon: 'fa-ticket-alt' },
        'profile': { background: '#f72585', text: 'Profile', icon: 'fa-user-circle' },
        'vehicles': { background: '#fb8500', text: 'Vehicles', icon: 'fa-car' },
        'empty-bookings': { background: '#4361ee', text: 'No Active Bookings', icon: 'fa-calendar-xmark' },
        'empty-history': { background: '#48cae4', text: 'No Booking History', icon: 'fa-history' }
    };
    
    // Handle action card images
    const actionCardImages = document.querySelectorAll('.action-card .card-image img');
    actionCardImages.forEach(img => {
        img.onerror = function() {
            createPlaceholderImage(this, placeholderColors);
        };
    });
    
    // Handle empty state images
    const emptyStateImages = document.querySelectorAll('.empty-state img');
    emptyStateImages.forEach(img => {
        img.onerror = function() {
            createPlaceholderImage(this, placeholderColors, 200, 200);
        };
    });
}

// Function to create placeholder image
function createPlaceholderImage(imgElement, colorMap, width = 300, height = 150) {
    const imgSrc = imgElement.src;
    const imgAlt = imgElement.alt;
    const cardType = imgSrc.split('/').pop().split('.')[0];
    
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    // Get color data or use default
    const colorData = colorMap[cardType] || { 
        background: '#48cae4', 
        text: imgAlt || 'Image', 
        icon: 'fa-image' 
    };
    
    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, colorData.background);
    gradient.addColorStop(1, adjustColor(colorData.background, -30));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add pattern
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(
            Math.random() * canvas.width, 
            Math.random() * canvas.height, 
            Math.random() * 50 + 20, 
            0, 
            Math.PI * 2
        );
        ctx.fill();
    }
    
    // Add text
    ctx.font = 'bold 24px Poppins, sans-serif';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(colorData.text, canvas.width / 2, canvas.height / 2);
    
    // Replace the image with canvas
    imgElement.src = canvas.toDataURL('image/png');
}

// Helper function to adjust color brightness
function adjustColor(hex, amount) {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Convert to RGB
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);
    
    // Adjust
    r = Math.max(0, Math.min(255, r + amount));
    g = Math.max(0, Math.min(255, g + amount));
    b = Math.max(0, Math.min(255, b + amount));
    
    // Convert back to hex
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
} 