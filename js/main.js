/**
 * Christ Church Aylmer - Main JavaScript
 *
 * Features:
 * - Mobile navigation toggle
 * - Scroll-based animations (respects reduced motion preferences)
 * - Dynamic year in footer
 * - Simple form validation feedback
 *
 * Design Philosophy:
 * - Progressive enhancement (site works without JS)
 * - Accessibility-first (keyboard navigation, screen reader support)
 * - Performance-focused (Intersection Observer for scroll animations)
 * - Respects user preferences (prefers-reduced-motion)
 */

(function() {
  'use strict';

  // ============================================
  // MOBILE NAVIGATION
  // ============================================

  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav__link');

  if (menuToggle && mobileNav) {
    // Toggle mobile menu
    menuToggle.addEventListener('click', function() {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';

      menuToggle.setAttribute('aria-expanded', !isExpanded);
      mobileNav.classList.toggle('mobile-nav--open');

      // Prevent body scroll when menu is open
      document.body.style.overflow = isExpanded ? '' : 'hidden';

      // Focus management for accessibility
      if (!isExpanded) {
        // Menu is opening - focus first link
        const firstLink = mobileNav.querySelector('.mobile-nav__link');
        if (firstLink) {
          firstLink.focus();
        }
      }
    });

    // Close menu when clicking a link
    mobileNavLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('mobile-nav--open');
        document.body.style.overflow = '';
      });
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('mobile-nav--open')) {
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('mobile-nav--open');
        document.body.style.overflow = '';
        menuToggle.focus();
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (mobileNav.classList.contains('mobile-nav--open') &&
          !mobileNav.contains(e.target) &&
          !menuToggle.contains(e.target)) {
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileNav.classList.remove('mobile-nav--open');
        document.body.style.overflow = '';
      }
    });
  }

  // ============================================
  // SCROLL ANIMATIONS
  // Uses Intersection Observer for performance
  // Respects prefers-reduced-motion
  // ============================================

  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Stop observing once animated
            observer.unobserve(entry.target);
          }
        });
      }, {
        // Trigger when element is 10% visible
        threshold: 0.1,
        // Start animation slightly before element enters viewport
        rootMargin: '0px 0px -50px 0px'
      });

      animatedElements.forEach(function(el) {
        observer.observe(el);
      });
    } else {
      // Fallback for browsers without IntersectionObserver
      // or when reduced motion is preferred
      animatedElements.forEach(function(el) {
        el.classList.add('is-visible');
      });
    }
  } else {
    // If reduced motion is preferred, show all elements immediately
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(function(el) {
      el.classList.add('is-visible');
    });
  }

  // ============================================
  // DYNAMIC YEAR IN FOOTER
  // ============================================

  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // ============================================
  // CONTACT FORM HANDLING
  // Basic client-side enhancement
  // Note: Server-side processing required for actual submission
  // ============================================

  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Get form data
      const formData = new FormData(contactForm);
      const name = formData.get('name');
      const email = formData.get('email');
      const message = formData.get('message');

      // Basic validation (HTML5 validation handles most of this)
      if (!name || !email || !message) {
        showFormMessage('Please fill in all required fields.', 'error');
        return;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showFormMessage('Please enter a valid email address.', 'error');
        return;
      }

      // Simulate form submission
      // In production, replace with actual form submission logic
      // (e.g., fetch to a server endpoint or form service like Formspree)
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      submitButton.textContent = 'Sending...';
      submitButton.disabled = true;

      // Simulate network delay
      setTimeout(function() {
        // Show success message
        showFormMessage(
          'Thank you for your message! We\'ll be in touch soon.',
          'success'
        );

        // Reset form
        contactForm.reset();

        // Restore button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
      }, 1000);
    });
  }

  /**
   * Display a message below the form
   * @param {string} message - The message to display
   * @param {string} type - 'success' or 'error'
   */
  function showFormMessage(message, type) {
    // Remove any existing message
    const existingMessage = contactForm.querySelector('.form-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = 'form-message form-message--' + type;
    messageEl.setAttribute('role', type === 'error' ? 'alert' : 'status');
    messageEl.style.cssText = `
      padding: 1rem;
      margin-top: 1rem;
      border-radius: 8px;
      text-align: center;
      font-weight: 500;
      ${type === 'success'
        ? 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;'
        : 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'
      }
    `;
    messageEl.textContent = message;

    // Insert after the submit button
    contactForm.appendChild(messageEl);

    // Auto-remove success message after 5 seconds
    if (type === 'success') {
      setTimeout(function() {
        messageEl.remove();
      }, 5000);
    }

    // Scroll to message if not visible
    messageEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // (Enhancement - CSS scroll-behavior handles most cases)
  // ============================================

  // Handle anchor links that might not trigger smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth'
        });

        // Update focus for accessibility
        target.setAttribute('tabindex', '-1');
        target.focus();
      }
    });
  });

  // ============================================
  // HEADER SHADOW ON SCROLL
  // Subtle enhancement for sticky header
  // ============================================

  const header = document.querySelector('.header');

  if (header) {
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 10) {
        header.style.boxShadow = '0 2px 20px rgba(44, 62, 80, 0.12)';
      } else {
        header.style.boxShadow = '0 2px 20px rgba(44, 62, 80, 0.08)';
      }

      lastScroll = currentScroll;
    }, { passive: true });
  }

})();
