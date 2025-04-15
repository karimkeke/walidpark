// Main JavaScript for Parking Management System

document.addEventListener('DOMContentLoaded', function() {
    // Initialize components
    initializeTooltips();
    initializeFormValidation();
    initializeToggleButtons();
    initializeParkingMap();
    initializeStatistics();
    initializeHowItWorks();
    initializeParticles();
    initializeImageLoading();
    initializeHeroParallax();
    initializeFeatureCards();
    
    // Add event listeners
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    // Scroll effects for header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            
            // Animate the hamburger to X
            const bars = this.querySelectorAll('span');
            bars[0].classList.toggle('rotate-down');
            bars[1].classList.toggle('fade-out');
            bars[2].classList.toggle('rotate-up');
        });
    }

    // Add animations to elements when they come into view
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const animationClass = entry.target.dataset.animation || 'animate-fade-in-up';
                    entry.target.classList.add(animationClass);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        animatedElements.forEach(element => {
            element.classList.add('animate-fade-in');
        });
    }

    // Add active class to current navigation item
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.php') ||
            (currentPage !== 'index.php' && linkPage !== 'index.php' && currentPage.includes(linkPage))) {
            link.classList.add('active');
        }
    });

    // Initialize tooltips
    const tooltips = document.querySelectorAll('[data-tooltip]');
    
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', function() {
            const text = this.getAttribute('data-tooltip');
            const tooltipEl = document.createElement('div');
            tooltipEl.className = 'tooltip';
            tooltipEl.textContent = text;
            document.body.appendChild(tooltipEl);
            
            const rect = this.getBoundingClientRect();
            const tooltipRect = tooltipEl.getBoundingClientRect();
            
            tooltipEl.style.top = `${rect.top - tooltipRect.height - 10 + window.scrollY}px`;
            tooltipEl.style.left = `${rect.left + (rect.width / 2) - (tooltipRect.width / 2)}px`;
            tooltipEl.style.opacity = '1';
            
            this.addEventListener('mouseleave', function() {
                tooltipEl.remove();
            }, { once: true });
        });
    });

    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn, .nav-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Auto-hide alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.opacity = '0';
            setTimeout(() => {
                alert.style.display = 'none';
            }, 500);
        }, 5000);
    });

    // Add hover effects to tables
    const tableRows = document.querySelectorAll('.table tbody tr');
    
    tableRows.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.classList.add('hover-highlight');
        });
        
        row.addEventListener('mouseleave', function() {
            this.classList.remove('hover-highlight');
        });
    });

    // Add animation to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach((card, index) => {
        card.classList.add('animate-on-scroll');
        card.dataset.animation = 'animate-fade-in-up';
        card.style.animationDelay = `${index * 0.1}s`;
    });

    // Add counter animation to stat numbers
    const statNumbers = document.querySelectorAll('.stat-card .number');
    
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000; // ms
        const step = Math.ceil(target / (duration / 16)); // 60fps
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = current;
            }
        }, 16);
    }
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statNumbers.forEach(number => {
            observer.observe(number);
        });
    }

    // Form validation
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            let valid = true;
            const requiredFields = this.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    valid = false;
                    field.classList.add('is-invalid');
                    
                    // Create error message if it doesn't exist
                    let errorMsg = field.parentNode.querySelector('.error-message');
                    if (!errorMsg) {
                        errorMsg = document.createElement('div');
                        errorMsg.className = 'error-message';
                        errorMsg.textContent = 'This field is required';
                        field.parentNode.appendChild(errorMsg);
                    }
                }
            });
            
            if (!valid) {
                e.preventDefault();
            }
        });
        
        // Remove error when field is filled
        const fields = form.querySelectorAll('.form-control');
        fields.forEach(field => {
            field.addEventListener('input', function() {
                if (this.value.trim()) {
                    this.classList.remove('is-invalid');
                    const errorMsg = this.parentNode.querySelector('.error-message');
                    if (errorMsg) {
                        errorMsg.remove();
                    }
                }
            });
        });
    });

    // Add CSS styles for new JavaScript features
    const style = document.createElement('style');
    style.textContent = `
        /* Mobile menu toggle animation */
        .mobile-menu-toggle span {
            transition: transform 0.3s ease, opacity 0.3s ease;
        }
        
        .mobile-menu-toggle span.rotate-down {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .mobile-menu-toggle span.fade-out {
            opacity: 0;
        }
        
        .mobile-menu-toggle span.rotate-up {
            transform: rotate(-45deg) translate(5px, -5px);
        }
        
        /* Table row highlight effect */
        .table tbody tr.hover-highlight {
            background-color: rgba(67, 97, 238, 0.05);
        }
        
        /* Tooltip styles */
        .tooltip {
            position: absolute;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .tooltip::after {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            margin-left: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
        }
        
        /* Button ripple effect */
        .btn, .nav-btn {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.5);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        /* Form validation styles */
        .is-invalid {
            border-color: var(--danger-color) !important;
        }
        
        .error-message {
            color: var(--danger-color);
            font-size: 0.8rem;
            margin-top: 0.25rem;
            animation: fadeIn 0.3s ease;
        }
    `;
    
    document.head.appendChild(style);
});

// Toggle mobile menu
function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
    }
}

// Initialize tooltips
function initializeTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', showTooltip);
        tooltip.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(e) {
    const tooltipText = this.getAttribute('data-tooltip');
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.innerText = tooltipText;
    document.body.appendChild(tooltip);
    
    const rect = this.getBoundingClientRect();
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.opacity = '1';
    
    this.tooltipElement = tooltip;
}

function hideTooltip() {
    if (this.tooltipElement) {
        document.body.removeChild(this.tooltipElement);
        this.tooltipElement = null;
    }
}

// Form validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');
    forms.forEach(form => {
        form.addEventListener('submit', validateForm);
    });
}

function validateForm(e) {
    const form = e.target;
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            showInputError(input, 'This field is required');
        } else {
            clearInputError(input);
            
            // Email validation
            if (input.type === 'email' && !validateEmail(input.value)) {
                isValid = false;
                showInputError(input, 'Please enter a valid email address');
            }
            
            // Password validation
            if (input.type === 'password' && input.value.length < 8) {
                isValid = false;
                showInputError(input, 'Password must be at least 8 characters long');
            }
        }
    });
    
    // Check password confirmation
    const password = form.querySelector('input[name="password"]');
    const passwordConfirm = form.querySelector('input[name="password_confirm"]');
    if (password && passwordConfirm && password.value !== passwordConfirm.value) {
        isValid = false;
        showInputError(passwordConfirm, 'Passwords do not match');
    }
    
    if (!isValid) {
        e.preventDefault();
    }
}

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function showInputError(input, message) {
    clearInputError(input);
    input.classList.add('is-invalid');
    
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.innerText = message;
    
    input.parentNode.appendChild(errorElement);
}

function clearInputError(input) {
    input.classList.remove('is-invalid');
    const errorElement = input.parentNode.querySelector('.error-message');
    if (errorElement) {
        errorElement.parentNode.removeChild(errorElement);
    }
}

// Toggle buttons
function initializeToggleButtons() {
    const toggleButtons = document.querySelectorAll('[data-toggle]');
    toggleButtons.forEach(button => {
        button.addEventListener('click', handleToggle);
    });
}

function handleToggle() {
    const targetId = this.getAttribute('data-toggle');
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
        if (targetElement.style.display === 'none' || window.getComputedStyle(targetElement).display === 'none') {
            targetElement.style.display = 'block';
        } else {
            targetElement.style.display = 'none';
        }
    }
}

// Parking Map
function initializeParkingMap() {
    const parkingMap = document.querySelector('.parking-grid');
    if (!parkingMap) return;
    
    // Add click event listeners to parking spots
    const parkingSpots = parkingMap.querySelectorAll('.parking-spot');
    parkingSpots.forEach(spot => {
        spot.addEventListener('click', function() {
            // Only allow clicking on available spots
            if (this.classList.contains('available')) {
                showBookingModal(this.getAttribute('data-spot-id'), this.innerText);
            } else if (this.classList.contains('occupied') || this.classList.contains('reserved')) {
                showSpotDetailsModal(this.getAttribute('data-spot-id'), this.innerText);
            }
        });
    });
}

function showBookingModal(spotId, spotNumber) {
    // Create modal HTML
    const modalHTML = `
        <div class="modal-overlay" id="booking-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Book Parking Spot ${spotNumber}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="booking-form" action="process_booking.php" method="post">
                        <input type="hidden" name="spot_id" value="${spotId}">
                        
                        <div class="form-group">
                            <label for="vehicle_number">Vehicle Number</label>
                            <input type="text" class="form-control" id="vehicle_number" name="vehicle_number" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="start_time">Start Time</label>
                            <input type="datetime-local" class="form-control" id="start_time" name="start_time" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="duration">Duration (hours)</label>
                            <input type="number" class="form-control" id="duration" name="duration" min="1" value="1" required>
                        </div>
                        
                        <div class="form-group">
                            <button type="submit" class="btn btn-primary">Book Now</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Set default start time to now
    const startTimeInput = document.getElementById('start_time');
    const now = new Date();
    now.setMinutes(now.getMinutes() + 10); // Add 10 minutes to current time
    startTimeInput.value = now.toISOString().slice(0, 16);
    
    // Add event listeners
    const modal = document.getElementById('booking-modal');
    const closeButton = modal.querySelector('.modal-close');
    
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

function showSpotDetailsModal(spotId, spotNumber) {
    // In a real application, you would fetch data from the server
    // but for this demo, we'll use dummy data
    
    const status = document.querySelector(`[data-spot-id="${spotId}"]`).classList.contains('reserved') ? 'Reserved' : 'Occupied';
    
    // Create modal HTML
    const modalHTML = `
        <div class="modal-overlay" id="spot-details-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Parking Spot ${spotNumber} Details</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p><strong>Status:</strong> ${status}</p>
                    <p><strong>Vehicle:</strong> ABC-123</p>
                    <p><strong>Start Time:</strong> ${new Date().toLocaleString()}</p>
                    <p><strong>End Time:</strong> ${new Date(Date.now() + 2 * 60 * 60 * 1000).toLocaleString()}</p>
                    
                    ${status === 'Reserved' ? 
                        '<button class="btn btn-danger mt-3" id="cancel-reservation">Cancel Reservation</button>' : 
                        ''}
                </div>
            </div>
        </div>
    `;
    
    // Add modal to DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add event listeners
    const modal = document.getElementById('spot-details-modal');
    const closeButton = modal.querySelector('.modal-close');
    
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Add cancel reservation button logic
    const cancelButton = document.getElementById('cancel-reservation');
    if (cancelButton) {
        cancelButton.addEventListener('click', () => {
            // In a real application, this would send an AJAX request to the server
            alert('Reservation cancelled');
            document.body.removeChild(modal);
            
            // Update spot status
            const spot = document.querySelector(`[data-spot-id="${spotId}"]`);
            spot.classList.remove('reserved');
            spot.classList.add('available');
        });
    }
}

// Statistics for dashboard
function initializeStatistics() {
    const chartContainers = document.querySelectorAll('[data-chart]');
    
    chartContainers.forEach(container => {
        const chartType = container.getAttribute('data-chart');
        
        switch(chartType) {
            case 'occupancy':
                renderOccupancyChart(container);
                break;
            case 'revenue':
                renderRevenueChart(container);
                break;
            case 'popularity':
                renderPopularityChart(container);
                break;
        }
    });
}

// Example chart rendering functions (placeholder for actual chart library)
function renderOccupancyChart(container) {
    // In a real application, you would use a charting library like Chart.js
    // For this example, we'll just display some dummy HTML
    container.innerHTML = `
        <div class="chart-placeholder">
            <div class="chart-bar" style="height: 75%; background-color: var(--primary-color);">
                <span>75%</span>
            </div>
            <div class="chart-label">Current Occupancy</div>
        </div>
    `;
}

function renderRevenueChart(container) {
    container.innerHTML = `
        <div class="chart-placeholder">
            <div class="chart-line">
                <div class="chart-point" style="left: 0%; bottom: 20%"></div>
                <div class="chart-point" style="left: 20%; bottom: 40%"></div>
                <div class="chart-point" style="left: 40%; bottom: 30%"></div>
                <div class="chart-point" style="left: 60%; bottom: 50%"></div>
                <div class="chart-point" style="left: 80%; bottom: 70%"></div>
                <div class="chart-point" style="left: 100%; bottom: 80%"></div>
            </div>
            <div class="chart-label">Revenue Last 7 Days</div>
        </div>
    `;
}

function renderPopularityChart(container) {
    container.innerHTML = `
        <div class="chart-placeholder">
            <div class="chart-bars">
                <div class="chart-bar" style="height: 85%; background-color: var(--accent-color);">
                    <span>A</span>
                </div>
                <div class="chart-bar" style="height: 60%; background-color: var(--accent-color);">
                    <span>B</span>
                </div>
                <div class="chart-bar" style="height: 95%; background-color: var(--accent-color);">
                    <span>C</span>
                </div>
                <div class="chart-bar" style="height: 40%; background-color: var(--accent-color);">
                    <span>D</span>
                </div>
            </div>
            <div class="chart-label">Most Popular Sections</div>
        </div>
    `;
}

// Booking confirmation modal
function showBookingConfirmation(bookingDetails) {
    // Create modal HTML
    const modalHTML = `
        <div class="modal-overlay" id="confirmation-modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Booking Confirmed!</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="booking-success">
                        <i class="fas fa-check-circle"></i>
                        <p>Your parking spot has been reserved successfully.</p>
                    </div>
                    
                    <div class="booking-details">
                        <h4>Booking Details</h4>
                        <p><strong>Booking ID:</strong> ${bookingDetails.id}</p>
                        <p><strong>Spot Number:</strong> ${bookingDetails.spotNumber}</p>
                        <p><strong>Vehicle:</strong> ${bookingDetails.vehicleNumber}</p>
                        <p><strong>Start Time:</strong> ${bookingDetails.startTime}</p>
                        <p><strong>End Time:</strong> ${bookingDetails.endTime}</p>
                        <p><strong>Total Cost:</strong> $${bookingDetails.totalCost}</p>
                    </div>
                    
                    <button class="btn btn-primary mt-3" id="view-bookings">View My Bookings</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to DOM
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add event listeners
    const modal = document.getElementById('confirmation-modal');
    const closeButton = modal.querySelector('.modal-close');
    
    closeButton.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Add view bookings button logic
    const viewBookingsButton = document.getElementById('view-bookings');
    viewBookingsButton.addEventListener('click', () => {
        window.location.href = 'my_bookings.php';
    });
}

// Add this function for How It Works section
function initializeHowItWorks() {
    const howItWorksSection = document.querySelector('.how-it-works');
    if (!howItWorksSection) return;

    const progressLine = document.getElementById('progress-line');
    const steps = document.querySelectorAll('.step');
    
    if (!progressLine || steps.length === 0) return;
    
    // Set initial styles for steps
    steps.forEach(step => {
        step.style.opacity = '0';
        step.style.transform = 'translateY(30px)';
    });
    
    // Create intersection observer for the section
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // When section is visible, start monitoring the scroll for progress line
                window.addEventListener('scroll', updateProgressLine);
                // Initially trigger it
                updateProgressLine();
                
                // Observe individual steps for animation
                const stepObserver = new IntersectionObserver((stepEntries) => {
                    stepEntries.forEach(stepEntry => {
                        if (stepEntry.isIntersecting) {
                            const step = stepEntry.target;
                            const stepNumber = parseInt(step.getAttribute('data-step'));
                            
                            // Alternate animation direction based on step number
                            if (stepNumber % 2 === 0) {
                                step.classList.add('animate-fade-in-right');
                            } else {
                                step.classList.add('animate-fade-in-left');
                            }
                            
                            // Update progress line height based on step number
                            const progressPercentage = (stepNumber / steps.length) * 100;
                            if (progressPercentage > parseInt(progressLine.style.height)) {
                                progressLine.style.height = `${progressPercentage}%`;
                            }
                            
                            stepObserver.unobserve(step);
                        }
                    });
                }, { threshold: 0.5 });
                
                // Observe all steps
                steps.forEach(step => {
                    stepObserver.observe(step);
                });
                
                sectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    sectionObserver.observe(howItWorksSection);
    
    function updateProgressLine() {
        const sectionTop = howItWorksSection.getBoundingClientRect().top;
        const sectionHeight = howItWorksSection.offsetHeight;
        const windowHeight = window.innerHeight;
        
        // Calculate how much of the section is visible
        let progress = 0;
        
        if (sectionTop < windowHeight) {
            // Section is at least partially visible
            const visibleAmount = Math.min(windowHeight - sectionTop, sectionHeight);
            progress = (visibleAmount / sectionHeight) * 100;
            
            // Limit progress to 0-100%
            progress = Math.max(0, Math.min(100, progress));
            
            // Apply progress to the line if it's greater than current height
            const currentHeight = parseInt(progressLine.style.height) || 0;
            if (progress > currentHeight) {
                progressLine.style.height = `${progress}%`;
            }
        }
    }
}

// Initialize particles.js for hero section
function initializeParticles() {
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 80,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#ffffff"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    }
                },
                "opacity": {
                    "value": 0.3,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 40,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#ffffff",
                    "opacity": 0.2,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 0.8
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        });
    }
}

// Handle image loading with placeholders
function initializeImageLoading() {
    const images = document.querySelectorAll('img:not(.lazy-exempt)');
    
    images.forEach(img => {
        // Skip images that are already loaded
        if (img.complete) {
            img.classList.add('loaded');
            return;
        }
        
        // Add loading class and create placeholder if needed
        img.classList.add('loading');
        
        // For images without parent position:relative
        const parent = img.parentElement;
        if (window.getComputedStyle(parent).position === 'static') {
            parent.style.position = 'relative';
        }
        
        // Create placeholder
        const placeholder = document.createElement('div');
        placeholder.classList.add('image-placeholder');
        img.before(placeholder);
        
        // Remove placeholder and show image when loaded
        img.addEventListener('load', function() {
            img.classList.remove('loading');
            img.classList.add('loaded');
            
            if (placeholder) {
                setTimeout(() => {
                    placeholder.remove();
                }, 300);
            }
        });
        
        // Handle error
        img.addEventListener('error', function() {
            img.style.display = 'none';
            const errorMsg = document.createElement('div');
            errorMsg.style.padding = '20px';
            errorMsg.style.textAlign = 'center';
            errorMsg.innerHTML = '<i class="fas fa-image" style="font-size: 2rem; color: #ccc;"></i><p style="margin-top: 10px; color: #999;">Image failed to load</p>';
            img.after(errorMsg);
        });
    });
}

// Enhance hero section parallax effect
function initializeHeroParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY;
        if (scrollPosition < window.innerHeight) {
            const heroImage = document.querySelector('.hero-image img');
            const heroContent = document.querySelector('.hero-content');
            const floatingCards = document.querySelectorAll('.floating-card.desktop-only');
            
            if (heroImage) {
                heroImage.style.transform = `perspective(1000px) rotateY(-${scrollPosition * 0.01}deg) translateY(${scrollPosition * 0.05}px)`;
            }
            
            if (heroContent) {
                heroContent.style.transform = `translateY(${scrollPosition * 0.1}px)`;
                heroContent.style.opacity = 1 - (scrollPosition * 0.002);
            }
            
            floatingCards.forEach((card, index) => {
                const direction = index % 2 === 0 ? 1 : -1;
                card.style.transform = `translateY(${scrollPosition * 0.08 * direction}px)`;
            });
        }
    });
}

// Initialize feature cards animation
function initializeFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    // Add animate class to all cards initially
    featureCards.forEach(card => {
        card.classList.add('animate');
        
        // Add feature indicator element to each card
        const indicator = document.createElement('div');
        indicator.className = 'feature-indicator';
        indicator.innerHTML = '<i class="fas fa-check"></i>';
        card.appendChild(indicator);
    });
    
    // Create intersection observer to trigger animations when cards are in view
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe each feature card
    featureCards.forEach(card => {
        observer.observe(card);
    });
} 