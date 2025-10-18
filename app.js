document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initQuickTrack();
    initTrackingPage();
    initContactForm();
    initQuoteForm();
    initLoginForms();
});

function initMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const menu = document.getElementById('navMenu');

    if (toggle && menu) {
        toggle.addEventListener('click', function() {
            menu.classList.toggle('active');
        });

        document.addEventListener('click', function(event) {
            if (!toggle.contains(event.target) && !menu.contains(event.target)) {
                menu.classList.remove('active');
            }
        });
    }
}

function initQuickTrack() {
    const form = document.getElementById('quickTrackForm');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const trackingNumber = document.getElementById('quickTrackInput').value;
            window.location.href = `tracking.html?number=${encodeURIComponent(trackingNumber)}`;
        });
    }
}

function initTrackingPage() {
    const form = document.getElementById('trackingForm');

    if (form) {
        const urlParams = new URLSearchParams(window.location.search);
        const prefilledNumber = urlParams.get('number');

        if (prefilledNumber) {
            document.getElementById('trackingNumber').value = prefilledNumber;
            form.dispatchEvent(new Event('submit'));
        }

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const trackingNumber = document.getElementById('trackingNumber').value.trim();

            if (trackingNumber) {
                simulateTrackingSearch(trackingNumber);
            }
        });
    }
}

function simulateTrackingSearch(trackingNumber) {
    const resultsDiv = document.getElementById('trackingResults');
    const errorDiv = document.getElementById('trackingError');

    const mockData = {
        'DHL123456789': {
            status: 'In Transit',
            statusClass: 'in-transit',
            origin: 'Lagos, Nigeria',
            destination: 'Abuja, Nigeria',
            estimatedDelivery: 'Tomorrow, 10:00 AM',
            timeline: [
                {
                    date: 'Oct 16, 2025 - 2:30 PM',
                    status: 'In Transit',
                    location: 'En route to Abuja'
                },
                {
                    date: 'Oct 16, 2025 - 9:00 AM',
                    status: 'Departed Facility',
                    location: 'Lagos Distribution Center'
                },
                {
                    date: 'Oct 15, 2025 - 4:00 PM',
                    status: 'Picked Up',
                    location: 'Lagos, Ikeja'
                }
            ]
        },
        'DHL987654321': {
            status: 'Delivered',
            statusClass: 'delivered',
            origin: 'Abuja, Nigeria',
            destination: 'Port Harcourt, Nigeria',
            estimatedDelivery: 'Oct 15, 2025 - 2:00 PM',
            timeline: [
                {
                    date: 'Oct 15, 2025 - 2:00 PM',
                    status: 'Delivered',
                    location: 'Port Harcourt - Signed by John Doe'
                },
                {
                    date: 'Oct 15, 2025 - 11:30 AM',
                    status: 'Out for Delivery',
                    location: 'Port Harcourt Distribution Center'
                },
                {
                    date: 'Oct 14, 2025 - 8:00 PM',
                    status: 'In Transit',
                    location: 'En route to Port Harcourt'
                },
                {
                    date: 'Oct 14, 2025 - 10:00 AM',
                    status: 'Picked Up',
                    location: 'Abuja, Wuse 2'
                }
            ]
        }
    };

    setTimeout(() => {
        if (mockData[trackingNumber]) {
            const data = mockData[trackingNumber];

            document.getElementById('trackingNumberDisplay').textContent = trackingNumber;
            document.getElementById('shipmentStatus').textContent = data.status;
            document.getElementById('shipmentStatus').className = `info-value status-badge ${data.statusClass}`;
            document.getElementById('shipmentOrigin').textContent = data.origin;
            document.getElementById('shipmentDestination').textContent = data.destination;
            document.getElementById('estimatedDelivery').textContent = data.estimatedDelivery;

            const timelineContainer = document.getElementById('trackingTimeline');
            timelineContainer.innerHTML = '';

            data.timeline.forEach(item => {
                const timelineItem = document.createElement('div');
                timelineItem.className = 'timeline-item';
                timelineItem.innerHTML = `
                    <div class="timeline-date">${item.date}</div>
                    <div class="timeline-status">${item.status}</div>
                    <div class="timeline-location">${item.location}</div>
                `;
                timelineContainer.appendChild(timelineItem);
            });

            resultsDiv.classList.remove('hidden');
            errorDiv.classList.add('hidden');
        } else {
            resultsDiv.classList.add('hidden');
            errorDiv.classList.remove('hidden');
        }
    }, 800);
}

window.resetTracking = function() {
    document.getElementById('trackingNumber').value = '';
    document.getElementById('trackingResults').classList.add('hidden');
    document.getElementById('trackingError').classList.add('hidden');
    document.getElementById('trackingNumber').focus();
};

function initContactForm() {
    const form = document.getElementById('contactForm');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            console.log('Contact form submitted:', formData);

            form.style.display = 'none';
            document.getElementById('contactFormSuccess').classList.remove('hidden');

            setTimeout(() => {
                form.reset();
                form.style.display = 'flex';
                document.getElementById('contactFormSuccess').classList.add('hidden');
            }, 5000);
        });
    }
}

let currentStep = 1;

function initQuoteForm() {
    const form = document.getElementById('quoteForm');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateQuote();
        });
    }
}

window.nextStep = function(step) {
    if (validateCurrentStep()) {
        document.getElementById(`step${currentStep}`).classList.remove('active');
        document.getElementById(`step${step}`).classList.add('active');
        currentStep = step;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

window.prevStep = function(step) {
    document.getElementById(`step${currentStep}`).classList.remove('active');
    document.getElementById(`step${step}`).classList.add('active');
    currentStep = step;
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

function validateCurrentStep() {
    const currentStepDiv = document.getElementById(`step${currentStep}`);
    const inputs = currentStepDiv.querySelectorAll('input[required], select[required]');
    let valid = true;

    inputs.forEach(input => {
        if (!input.value) {
            input.style.borderColor = 'var(--error-color)';
            valid = false;
        } else {
            input.style.borderColor = '';
        }
    });

    return valid;
}

function calculateQuote() {
    const shipmentType = document.querySelector('input[name="shipmentType"]:checked').value;
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    const weight = parseFloat(document.getElementById('weight').value);
    const quantity = parseInt(document.getElementById('quantity').value);
    const packageType = document.getElementById('packageType').value;

    document.getElementById('resultOrigin').textContent = origin;
    document.getElementById('resultDestination').textContent = destination;
    document.getElementById('resultWeight').textContent = `${weight} kg`;
    document.getElementById('resultPackageType').textContent = packageType.charAt(0).toUpperCase() + packageType.slice(1);
    document.getElementById('resultQuantity').textContent = quantity;

    let basePrice = shipmentType === 'domestic' ? 2500 : 15000;
    basePrice *= weight * 0.5;
    basePrice *= quantity;

    const options = [];

    if (shipmentType === 'domestic') {
        options.push({
            name: 'Standard',
            price: Math.round(basePrice),
            delivery: '2-3 business days'
        });
        options.push({
            name: 'Express',
            price: Math.round(basePrice * 1.5),
            delivery: '24-48 hours'
        });
        options.push({
            name: 'Same Day',
            price: Math.round(basePrice * 2.5),
            delivery: 'Within 6 hours (Lagos only)'
        });
    } else {
        options.push({
            name: 'Economy',
            price: Math.round(basePrice),
            delivery: '5-7 business days'
        });
        options.push({
            name: 'Standard',
            price: Math.round(basePrice * 1.6),
            delivery: '4-6 business days'
        });
        options.push({
            name: 'Express',
            price: Math.round(basePrice * 2.5),
            delivery: '3-5 business days'
        });
    }

    const optionsContainer = document.getElementById('quoteOptions');
    optionsContainer.innerHTML = '';

    options.forEach(option => {
        const optionCard = document.createElement('div');
        optionCard.className = 'option-card';
        optionCard.innerHTML = `
            <div class="option-header">
                <span class="option-name">${option.name}</span>
                <span class="option-price">₦${option.price.toLocaleString()}</span>
            </div>
            <div class="option-delivery">${option.delivery}</div>
        `;
        optionsContainer.appendChild(optionCard);
    });

    document.getElementById('quoteForm').style.display = 'none';
    document.getElementById('quoteResult').classList.remove('hidden');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.resetQuote = function() {
    document.getElementById('quoteForm').reset();
    document.getElementById('quoteForm').style.display = 'block';
    document.getElementById('quoteResult').classList.add('hidden');
    currentStep = 1;
    document.querySelectorAll('.form-step').forEach(step => step.classList.remove('active'));
    document.getElementById('step1').classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

function initLoginForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const forgotForm = document.getElementById('forgotForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            console.log('Login attempt:', { email, password });

            alert('Login functionality would be implemented with backend integration. For demo purposes, login simulation successful!');
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            const formData = {
                firstName: document.getElementById('regFirstName').value,
                lastName: document.getElementById('regLastName').value,
                email: document.getElementById('regEmail').value,
                phone: document.getElementById('regPhone').value,
                password: password
            };

            console.log('Registration data:', formData);

            alert('Registration successful! You can now login with your credentials.');
            showLoginTab();
        });
    }

    if (forgotForm) {
        forgotForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('forgotEmail').value;

            console.log('Password reset requested for:', email);

            alert('Password reset link has been sent to your email address.');
            showLoginTab();
        });
    }
}

window.showLoginTab = function() {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById('loginTab').classList.add('active');
    document.querySelector('.tab-btn:first-child').classList.add('active');
};

window.showRegisterTab = function() {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    document.getElementById('registerTab').classList.add('active');
    document.querySelector('.tab-btn:last-child').classList.add('active');
};

window.showForgotPassword = function() {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.getElementById('forgotTab').classList.add('active');
};

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});