/**
 * Apex Landing Page Logic
 * Features: Light/Dark Mode, Sticky Navbar, Scrollspy, Mobile Drawer,
 *           Intersection Observer Scroll Reveals, Form Validation
 */

document.addEventListener('DOMContentLoaded', () => {

    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    /* ==========================================================================
       1. Theme Toggle Management (Light / Dark Mode)
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const storedTheme = localStorage.getItem('theme');
    
    // Check system preference if localStorage is empty
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const defaultTheme = prefersDark ? 'dark' : 'light';
    const activeTheme = storedTheme || defaultTheme;

    // Apply active theme
    document.documentElement.setAttribute('data-theme', activeTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    /* ==========================================================================
       2. Sticky Header & Scrollspy (Active Section Highlighting)
       ========================================================================== */
    const navbar = document.querySelector('.navbar-container');
    const navLinks = document.querySelectorAll('.nav-desktop .nav-link');
    const sections = document.querySelectorAll('section[id]');
    
    const handleScrollEffects = () => {
        const scrollY = window.scrollY;
        
        // 2a. Shrink/add shadow to navbar on scroll
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // 2b. Scrollspy highlighting
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 120; // offset navbar height + extra padding
            
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    };

    window.addEventListener('scroll', handleScrollEffects);
    handleScrollEffects(); // Trigger once on load to set initial state

    /* ==========================================================================
       3. Mobile Hamburger Menu Drawer
       ========================================================================== */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, .mobile-cta');

    const toggleMobileMenu = () => {
        mobileMenuBtn.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('active');
        
        // Block document scrolling when mobile nav is open
        if (mobileMenuOverlay.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    };

    mobileMenuBtn.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when nav link is clicked
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenuOverlay.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    // Close mobile menu if resized to desktop size
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && mobileMenuOverlay.classList.contains('active')) {
            toggleMobileMenu();
        }
    });

    /* ==========================================================================
       4. Intersection Observer for Fade-in Scroll Animations
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal-fade');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before element is fully in view
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    /* ==========================================================================
       5. Back-to-Top Button Behavior
       ========================================================================== */
    const backToTopBtn = document.getElementById('back-to-top');

    const handleBackToTopVisibility = () => {
        if (window.scrollY > 600) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', handleBackToTopVisibility);
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });



    /* ==========================================================================
       7. Contact Form Handling & Validation
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const formFields = {
        name: document.getElementById('form-name'),
        email: document.getElementById('form-email'),
        subject: document.getElementById('form-subject'),
        message: document.getElementById('form-message')
    };
    const successToast = document.getElementById('form-success-toast');

    // Email regex checker
    const isValidEmail = (email) => {
        const regex = /^[a-zA-Z0-8._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        // Simple fallback check in case of edge cases, regular expression covers typical structures
        return regex.test(String(email).toLowerCase());
    };

    // Single input validation
    const validateField = (field, id) => {
        let isFieldValid = true;
        
        if (!field.value.trim()) {
            isFieldValid = false;
        } else if (id === 'email' && !isValidEmail(field.value.trim())) {
            isFieldValid = false;
        }

        if (!isFieldValid) {
            field.classList.add('invalid');
        } else {
            field.classList.remove('invalid');
        }

        return isFieldValid;
    };

    // Add input listeners to clear errors on typing
    Object.entries(formFields).forEach(([id, field]) => {
        field.addEventListener('input', () => {
            if (field.classList.contains('invalid')) {
                validateField(field, id);
            }
        });
    });

    // Handle Form Submission
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isFormValid = true;

        // Validate all fields
        Object.entries(formFields).forEach(([id, field]) => {
            const isValid = validateField(field, id);
            if (!isValid) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            // Form is fully validated, simulate form dispatch
            const submitBtn = contactForm.querySelector('.btn-submit');
            const submitBtnText = submitBtn.querySelector('span');
            const submitBtnIcon = submitBtn.querySelector('i');

            // Set state to loading
            submitBtn.style.opacity = '0.7';
            submitBtn.style.pointerEvents = 'none';
            submitBtnText.textContent = 'Sending...';

            setTimeout(() => {
                // Simulate successful completion
                submitBtn.style.opacity = '';
                submitBtn.style.pointerEvents = '';
                submitBtnText.textContent = 'Send Message';
                
                // Show Success Toast
                successToast.classList.add('active');
                
                // Clear Form Fields
                contactForm.reset();
                Object.values(formFields).forEach(field => field.classList.remove('invalid'));

                // Hide Toast after 5 seconds
                setTimeout(() => {
                    successToast.classList.remove('active');
                }, 5000);

            }, 1200);
        }
    });
});
