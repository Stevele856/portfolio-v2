import '../css/style.css'

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from 'lenis';
import Swiper from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.mjs';

gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  lerp: 0.1,
  smoothWheel: true,
})

lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time) => {
  lenis.raf(time * 1000)
})
gsap.ticker.lagSmoothing(0)

const swiperElement = document.querySelector('.swiper')
if (swiperElement) {
  const swiper = new Swiper('.swiper', {
    // slidesPerView: 3,
    spaceBetween: 24,
    speed: 700,
    breakpoints: {
    // Breakpoints (when window width >= 320px)
      320: {
        slidesPerView: 1,
        // spaceBetween: 32
      },
      640: {
        slidesPerView: 1.5,
      },
      1024: {
        slidesPerView: 2,
      },
      1280: {
        slidesPerView: 3,
      },
      // 1440: {
      //   slidesPerView: 3,
      // }
    },
    navigation: {
      nextEl: '.swiper-next-btn',
      prevEl: '.swiper-prev-btn',
    },
    scrollbar: {
      el: '.swiper-scrollbar',
      draggable: true,
      dragSize: 'auto',
    },
    loop: false,
  });  
} else {
  console.error('Swiper element not found');
}

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}

requestAnimationFrame(raf)

// DECRYPTED TEXT
document.querySelectorAll('.decrypt-text').forEach((el) => {
  const originalText = el.textContent
  const arr1 = originalText.split('')
  const arr2 = []

  arr1.forEach((char, index) => {
    arr2[index] = randChar()
      
  })

  el.addEventListener('pointerover', () => {
    const tl = gsap.timeline();
    let step = 0;

    tl.fromTo(
      el,
      {
        innerHTML: arr2.join(''),
      },
      {
        duration: arr1.length / 10,
        ease: 'power4.in',
        delay: 0.1,
        onUpdate: () => {
          const revealedCharCount = Math.floor(tl.progress() * arr1.length);

          if (step !== revealedCharCount) {
            step = revealedCharCount;

            arr1.forEach((char, index) => {
              arr2[index] = randChar();
            });

            const fixedText = arr1.join('').substring(0, revealedCharCount);
            const scrambledPart = arr2.join('').substring(revealedCharCount);

            el.innerHTML = fixedText + scrambledPart;
          }
        },
        onComplete: () => {
          el.innerHTML = originalText;
        }
      }
    );
  });
})

function randChar() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+{}:"<>?|'
  const randomChar = chars[Math.floor(Math.random() * chars.length)]
  return Math.random() > 0.5 ? randomChar : randomChar.toUpperCase()
}

// TOGGLE MENU
const menuToggle = document.getElementById('menu-toggle');
const navMenu = document.getElementById('nav-menu');
const body = document.body;
const line1 = document.getElementById('line1');
const line2 = document.getElementById('line2');

let isOpen = false;

// Initial state for mobile
if (window.innerWidth < 1024) {
  gsap.set(navMenu, {
    y: -100,
    opacity: 0,
    display: 'none'
  });
}

// Toggle on click
menuToggle.addEventListener('click', () => {
  toggleMenu(!isOpen);
});

function toggleMenu(state) {
  isOpen = state;

  if (isOpen) {
    body.classList.add('no-scroll');
    lenis.stop();

    // Animate hamburger to X
    gsap.to(line1, { duration: 0.3, y: 3.2, rotate: 45, transformOrigin: '50% 50%' });
    gsap.to(line2, { duration: 0.3, y: -3.2, rotate: -45, transformOrigin: '50% 50%' });

    // Show and animate menu
    gsap.set(navMenu, { display: 'block' });
    gsap.to(navMenu, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      ease: 'power2.out'
    });

  } else {
    body.classList.remove('no-scroll');
    lenis.start();

    // Animate hamburger back
    gsap.to(line1, { duration: 0.3, y: 0, rotate: 0 });
    gsap.to(line2, { duration: 0.3, y: 0, rotate: 0 });

    // Hide nav menu
    gsap.to(navMenu, {
      y: -100,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: () => {
        gsap.set(navMenu, { display: 'none' });
      }
    });
  }
}

// Handle screen resize
window.addEventListener('resize', () => {
  if (window.innerWidth >= 1024) {
    // On desktop: reset styles to show menu normally
    gsap.set(navMenu, { clearProps: 'all' }); // Remove all GSAP inline styles
    body.classList.remove('no-scroll');
    lenis.start();
    isOpen = false;
  } else {
    // On mobile: re-hide the menu
    gsap.set(navMenu, {
      y: -100,
      opacity: 0,
      display: 'none'
    });
    body.classList.remove('no-scroll');
    lenis.start();
    isOpen = false;
  }
});

// Scroll to section + close nav on mobile
function scrollToSection() {
  const menuItems = document.querySelectorAll('.header a')

  menuItems.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault()

      const targetID = link.getAttribute('href')
      const targetEl = document.querySelector(targetID)

      if (window.innerWidth < 1024 && isOpen) {
        toggleMenu(false)
      }

      if (targetEl) {
        lenis.scrollTo(targetEl, {
          offset: -60,
          duration: 1.2,
          easing: (t) => 1 - Math.pow(1 - t, 3)
        })
      }
    })
  })
}
scrollToSection()

const cursor = document.querySelector('.cursor');
const navLinks = document.querySelectorAll('#nav-menu a');
const textPortfolio = document.querySelector('.hero-center h1');

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});


function animateCursor() {

  const easing = 0.08;
  
  cursorX += (mouseX - cursorX) * easing;
  cursorY += (mouseY - cursorY) * easing;
  
  // Apply the position
  cursor.style.left = `${cursorX}px`;
  cursor.style.top = `${cursorY}px`;
  
  requestAnimationFrame(animateCursor);
}

// Start the animation
animateCursor();

// Hide cursor when hovering links
navLinks.forEach(link => {
  link.addEventListener('mouseenter', () => {
    cursor.style.opacity = '0';
  });
  link.addEventListener('mouseleave', () => {
    cursor.style.opacity = '1';
  });
});


const image1 = new Image();
image1.src = '/assets/eyes1.png';

const image2 = new Image();
image2.src = '/assets/eyes2.png';

const eyeImages = [
  '<img src="/assets/eyes1.png" alt="Eye 1" style="width: 100px;">',
  '<img src="/assets/eyes2.png" alt="Eye 2" style="width: 100px;">'
];

let imageIndex = 0;
let intervalId = null;

if (textPortfolio) {
  textPortfolio.addEventListener('mouseenter', () => {
    cursor.classList.add('scale-up');

    cursor.innerHTML = eyeImages[imageIndex]

    intervalId = setInterval(() => {
      imageIndex = (imageIndex + 1) % eyeImages.length
      cursor.innerHTML = eyeImages[imageIndex]
    }, 1000)

  });

  textPortfolio.addEventListener('mouseleave', () => {
    cursor.classList.remove('scale-up')
    clearInterval(intervalId)
    intervalId = null
    cursor.innerHTML = ''
  })

}

// MANEGTIC BTN
let magBtn = document.querySelector('.magneticBtn') 
let magStrength = 0.8

magBtn.addEventListener('mousemove', (e) => {
  const rect = magBtn.getBoundingClientRect()
  
  const x = e.clientX - rect.left - rect.width / 2
  const y = e.clientY - rect.top - rect.height / 2

  
  gsap.to(magBtn, {
    x: x * magStrength,
    y: y * magStrength,
    duration: 0.3,
    ease: 'power3.out'
  })
})

magBtn.addEventListener('mouseleave', () => {
  gsap.to(magBtn, {
    x: 0,
    y: 0,
    duration: 0.4,
    ease: 'power3.out'
  })
})

magBtn.addEventListener('mouseenter', () => {
  cursor.style.opacity = '0'
})
magBtn.addEventListener('mouseleave', () => {
  cursor.style.opacity = '1'
})

let magPhone = document.querySelector('.phoneIcon')
let magPhoneStrength = 1

magPhone.addEventListener('mousemove', (i) => {
  const rectPhone = magPhone.getBoundingClientRect()

  const p = i.clientX - rectPhone.left - rectPhone.width / 2
  const h = i.clientY - rectPhone.top - rectPhone.height / 2

  gsap.to(magPhone, {
    x: p * magPhoneStrength,
    y: h * magPhoneStrength,
    duration: 0.3,
    ease: 'power3.out'
  })
})

magPhone.addEventListener('mouseleave', () => {
  gsap.to(magPhone, {
    x: 0,
    y: 0,
    duration: 0.4,
    ease: 'power3.out'
  })
})

// hide cursor on phone
magPhone.addEventListener('mouseenter', () => {
  cursor.style.opacity = '0'
})
magPhone.addEventListener('mouseleave', () => {
  cursor.style.opacity = '1'
})

// Email icon
let magEmail = document.querySelector('.emailIcon')
let magEmailStrength = 1

magEmail.addEventListener('mousemove', (v) => {
  const rectEmail = magEmail.getBoundingClientRect()

  const m = v.clientX - rectEmail.left - rectEmail.width / 2
  const l = v.clientY - rectEmail.top - rectEmail.height / 2

  gsap.to(magEmail, {
    x: m * magEmailStrength,
    y: l * magEmailStrength,
    duration: 0.3,
    ease: 'power3.out'
  })
})

magEmail.addEventListener('mouseleave', () => {
  gsap.to(magEmail, {
    x: 0,
    y: 0,
    duration: 0.4,
    ease: 'power3.out'
  })
})

// hide cursor on email
magEmail.addEventListener('mouseenter', () => {
  cursor.style.opacity = '0'
})
magEmail.addEventListener('mouseleave', () => {
  cursor.style.opacity = '1'
})

// on-scroll Text effect

function splitText(sel) {
  document.querySelectorAll(sel).forEach(el => {
    const text = el.dataset.text || el.textContent.trim()
    el.innerHTML = '';

    // text.split('').forEach(char => {
    //   const span = document.createElement('span')
    //   span.innerHTML = (char === ' ') ? '&nbsp;' : char;
    //   el.appendChild(span)
    // })

    text.split(' ').forEach((word, i) => {
      const wordSpan = document.createElement('span');
      wordSpan.innerHTML = word + '&nbsp;';
      el.appendChild(wordSpan);
    });
  })
}

splitText('.scroll-text')

// Animate spans với stagger (mỗi chữ delay chút)
document.querySelectorAll('.scroll-text').forEach(el => {
  const spans = el.querySelectorAll('span')

  gsap.fromTo(spans,
    {
      opacity: 0,
      filter: 'blur(2px)',
      y: 4,
    },
    {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      // duration: 1.5,
      ease: 'power2.out',
      stagger: 0.05, 
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        end: 'top 30%',
        scrub: 0.2, 
        // toggleActions: 'play reverse play reverse'
      }
    }
  )
})

// Hide cursor btn navigation
const buttons = document.querySelectorAll('.swiper-prev-btn, .swiper-next-btn');

buttons.forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    cursor.style.opacity = '0';
  });
  btn.addEventListener('mouseleave', () => {
    cursor.style.opacity = '1';
  });
});

// Progress bar

/* const progressBar = () => {
  let progress = document.querySelector('.progress-bar')

  window.addEventListener('scroll', () => {
    let scrollY = window.scrollY
    let percent = scrollY / (document.body.offsetHeight - window.innerHeight) * 100
    progress.style.width = `${percent}%`

    
    
  })
}
window.addEventListener('load', progressBar)
*/

lenis.on('scroll', ({ scroll }) => {
  if (window.innerWidth < 1024) {
    const percent = scroll / (document.body.offsetHeight - window.innerHeight) * 100;
    document.querySelector('.progress-bar').style.width = `${percent}%`; 
  }
});



// const menuToggle = document.getElementById('menu-toggle')
// const navMenu = document.getElementById('nav-menu')

// Scroll img

gsap.set('.scroll-img', { transformPerspective: 1000 })

document.querySelectorAll('.scroll-img').forEach((img) => {
  gsap.fromTo(
    img,
    { y: -33 },
    {
      y: 33,
      // scale: 1.1,
      ease: 'none',
      scrollTrigger: {
        trigger: img,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      }
      
    }
  )
})













  




  