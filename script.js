// Smooth Scrolling with mobile optimization
document.querySelectorAll('.dock-item').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Add visual feedback for mobile
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
        
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            let offsetTop;
            
            if (targetId === '#about') {
                // For About section, scroll to very top
                offsetTop = 0;
            } else {
                // For other sections, scroll to the section start with margin
                offsetTop = targetSection.offsetTop - 30;
            }
            
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
    });
    
    // Add touch feedback
    item.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.95)';
    });
    
    item.addEventListener('touchend', function() {
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
});

// Active Section Highlighting
const sections = document.querySelectorAll('section');
const navItems = document.querySelectorAll('.dock-item');

function highlightActiveSection() {
    const scrollPosition = window.scrollY + 200;
    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navItems.forEach(item => item.classList.remove('active'));
            const activeNavItem = document.querySelector(`.dock-item[href="#${sectionId}"]`);
            if (activeNavItem) activeNavItem.classList.add('active');
        }
    });
}

window.addEventListener('scroll', highlightActiveSection);

// Form Handling
const contactForm = document.querySelector('#contactForm');
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.querySelector('#name').value.trim();
    const email = document.querySelector('#email').value.trim();
    const message = document.querySelector('#message').value.trim();

    if (!name || !email || !message) {
        showNotification('Please fill in all fields!', 'error');
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showNotification('Please enter a valid email address!', 'error');
        return;
    }

    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
    contactForm.reset();
});

// Notification System
function showNotification(message, type='info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type==='success'?'linear-gradient(135deg, #00ffff, #0099cc)':'linear-gradient(135deg, #ff6b6b, #ff8e8e)'};
        color: #000;
        padding: 1rem 2rem;
        border-radius: 12px;
        font-size: 1rem;
        font-weight: 600;
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    document.body.appendChild(notification);
    setTimeout(()=>{ notification.style.opacity='1'; notification.style.transform='translateX(0)'; },100);
    setTimeout(()=>{ notification.style.opacity='0'; notification.style.transform='translateX(100%)';
        setTimeout(()=>{ if(notification.parentNode) notification.parentNode.removeChild(notification); },400);
    },3000);
}

// Scroll Animations
function animateOnScroll() {
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}
window.addEventListener('scroll', animateOnScroll);

// Initialize
window.addEventListener('load', function() {
    highlightActiveSection();
    animateOnScroll();
    document.querySelectorAll('.fade-in').forEach(el => {
        el.style.opacity='0';
        el.style.transform='translateY(30px)';
        el.style.transition='all 0.8s ease';
    });
    console.log('🚀 Portfolio loaded successfully!');
});

// Keyboard Navigation
document.addEventListener('keydown', function(e) {
    if(e.key==='ArrowDown'||e.key==='ArrowUp') {
        e.preventDefault();
        const currentSection = getCurrentSection();
        const currentIndex = Array.from(sections).indexOf(currentSection);
        let nextIndex;
        if(e.key==='ArrowDown') nextIndex=Math.min(currentIndex+1,sections.length-1);
        else nextIndex=Math.max(currentIndex-1,0);
        const targetSection=sections[nextIndex];
        if(targetSection){
            const offsetTop=targetSection.offsetTop-100;
            window.scrollTo({top:offsetTop,behavior:'smooth'});
        }
    }
});

function getCurrentSection() {
    const scrollPosition = window.scrollY + 200;
    for (let section of sections){
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if(scrollPosition>=sectionTop && scrollPosition<sectionTop+sectionHeight) return section;
    }
    return sections[0];
}