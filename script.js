/**
 * ALEENA SHAFIQ — PORTFOLIO JAVASCRIPT
 * High Performance Interactions, Cinematic Preloader, Stardust Canvas & Scroll Reveals
 */

$(document).ready(function () {
  'use strict';

  /* ===================================================================
     1. CINEMATIC PRELOADER
     =================================================================== */
  const steps = [
    { percent: 0, text: '00%' },
    { percent: 15, text: '10%' },
    { percent: 35, text: '25%' },
    { percent: 60, text: '50%' },
    { percent: 85, text: '75%' },
    { percent: 100, text: '100%' }
  ];

  let currentStep = 0;
  const $progressBar = $('#preloader-bar');
  const $percentage = $('#preloader-percentage');
  const $preloader = $('#preloader');

  // Step intervals calibrated for ~1.7 seconds total loading duration
  function runPreloaderStep() {
    if (currentStep < steps.length) {
      const step = steps[currentStep];
      $progressBar.css('width', step.percent + '%');
      $percentage.text(step.text);

      if (step.percent === 100) {
        // Percentage reaches 100% -> disappears as requested
        setTimeout(() => {
          $percentage.fadeOut(220);
        }, 180);

        // Smooth fade out of preloader & cinematic hero reveal
        setTimeout(() => {
          $preloader.addClass('fade-out');
          $('body').removeClass('loading');
          initHeroReveal();
        }, 450);
      } else {
        currentStep++;
        setTimeout(runPreloaderStep, 260);
      }
    }
  }

  // Start preloader progression
  setTimeout(runPreloaderStep, 150);

  function initHeroReveal() {
    $('body').removeClass('loading').css('overflow-y', 'auto');
    $('.hero-section .hero-name, .hero-section .hero-roles, .hero-section .hero-description, .hero-section .hero-cta-group, .hero-section .code-mockup-wrapper')
      .css('opacity', '0')
      .css('transform', 'translateY(25px)')
      .css('transition', 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)');

    setTimeout(() => {
      $('.hero-section .hero-name').css({ opacity: 1, transform: 'translateY(0)' });
    }, 100);

    setTimeout(() => {
      $('.hero-section .hero-roles').css({ opacity: 1, transform: 'translateY(0)' });
    }, 250);

    setTimeout(() => {
      $('.hero-section .hero-description').css({ opacity: 1, transform: 'translateY(0)' });
    }, 400);

    setTimeout(() => {
      $('.hero-section .hero-cta-group, .hero-section .hero-highlights-row').css({ opacity: 1, transform: 'translateY(0)' });
    }, 550);

    setTimeout(() => {
      $('.hero-section .code-mockup-wrapper, .hero-section .floating-badge').css({ opacity: 1, transform: 'translateY(0)' });
    }, 700);
  }

  /* ===================================================================
     2. NAVBAR SCROLL & ACTIVE LINK DETECTION
     =================================================================== */
  const $navbar = $('#mainNav');
  const $navLinks = $('.nav-link-custom');
  const sections = $('section, header');

  $(window).on('scroll', function () {
    const scrollPos = $(this).scrollTop();

    // Toggle navbar style on scroll
    if (scrollPos > 50) {
      $navbar.addClass('scrolled');
    } else {
      $navbar.removeClass('scrolled');
    }

    // Back to top button visibility
    if (scrollPos > 400) {
      $('#backToTop').addClass('visible');
    } else {
      $('#backToTop').removeClass('visible');
    }

    // Update active nav link based on scroll position
    sections.each(function () {
      const top = $(this).offset().top - 140;
      const bottom = top + $(this).outerHeight();
      const id = $(this).attr('id');

      if (scrollPos >= top && scrollPos < bottom && id) {
        $navLinks.removeClass('active');
        $(`.nav-link-custom[href="#${id}"]`).addClass('active');
      }
    });
  });

  // Smooth scroll for nav links & close mobile menu on click
  $('a[href^="#"]').on('click', function (e) {
    const targetId = $(this).attr('href');
    if (targetId.length > 1 && $(targetId).length) {
      e.preventDefault();
      const targetOffset = $(targetId).offset().top - 85;
      
      $('html, body').stop().animate({
        scrollTop: targetOffset
      }, 700, 'swing');

      // Close Bootstrap mobile collapse if open
      const $navCollapse = $('#navbarContent');
      if ($navCollapse.hasClass('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance($navCollapse[0]);
        if (bsCollapse) {
          bsCollapse.hide();
        }
      }
    }
  });

  /* ===================================================================
     3. INTERSECTION OBSERVER FOR SCROLL REVEALS
     =================================================================== */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is unavailable
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  /* ===================================================================
     4. PARTICLES CANVAS (CYBER STARDUST)
     =================================================================== */
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = window.innerWidth < 768 ? 35 : 70;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    resizeCanvas();
    $(window).on('resize', resizeCanvas);

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 1.6 + 0.4;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.alpha = Math.random() * 0.6 + 0.1;
        this.color = Math.random() > 0.5 ? '#713CFF' : '#00BFFF';
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          this.reset();
        }
      }
      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  /* ===================================================================
     5. CUSTOM CURSOR FOLLOWER (DESKTOP)
     =================================================================== */
  const $cursor = $('#custom-cursor');
  const $cursorDot = $('#custom-cursor-dot');

  if (window.matchMedia('(pointer: fine)').matches && $cursor.length) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let cursorX = mouseX;
    let cursorY = mouseY;

    $(window).on('mousemove', function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      $cursorDot.css({ left: mouseX + 'px', top: mouseY + 'px' });
    });

    function renderCursor() {
      cursorX += (mouseX - cursorX) * 0.18;
      cursorY += (mouseY - cursorY) * 0.18;
      $cursor.css({ left: cursorX + 'px', top: cursorY + 'px' });
      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    $('a, button, input, textarea, .glass-card, .tech-badge').on('mouseenter', function () {
      $cursor.addClass('active');
    }).on('mouseleave', function () {
      $cursor.removeClass('active');
    });
  }

  /* ===================================================================
     6. CONTACT FORM INTERACTION & FEEDBACK
     =================================================================== */
  const $contactForm = $('#portfolio-contact-form');
  const $submitBtn = $('#contact-submit-btn');
  const $successAlert = $('#contact-success-alert');

  $contactForm.on('submit', function (e) {
    e.preventDefault();

    const name = $('#contact-name').val().trim();
    const email = $('#contact-email').val().trim();
    const subject = $('#contact-subject').val().trim();
    const message = $('#contact-message').val().trim();

    if (!name || !email || !subject || !message) {
      alert('Please fill out all fields before sending.');
      return;
    }

    // Button loading state
    $submitBtn.prop('disabled', true).html('<i class="fa-solid fa-spinner fa-spin me-2"></i> TRANSMITTING...');

    // Simulate sending with realistic network delay
    setTimeout(() => {
      $submitBtn.prop('disabled', false).html('<span>SEND MESSAGE ↗</span>');
      $successAlert.fadeIn();
      $contactForm[0].reset();

      setTimeout(() => {
        alert("Thank you for contact me!");
        $successAlert.fadeOut();
      }, 6000);
    }, 1200);
  });

  /* ===================================================================
     7. 3D TILT EFFECT ON PROJECT CARDS
     =================================================================== */
  if (window.innerWidth > 992) {
    $('.project-card').on('mousemove', function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;

      $(this).css({
        transform: `perspective(1000px) rotateX(${-deltaY * 3}deg) rotateY(${deltaX * 3}deg) translateY(-8px)`
      });
    }).on('mouseleave', function () {
      $(this).css({
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)'
      });
    });
  }

});
