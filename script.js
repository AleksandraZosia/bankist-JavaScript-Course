'use strict';

// Elements Selection
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

///////////////////////////////////////
// Modal window
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Button Scrolling
btnScrollTo.addEventListener('click', function (e) {
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  console.log(e.target.getBoundingClientRect());

  console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

  console.log(
    'height/width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );
  // Scrolling
  // window.scrollTo(
  // s1coords.left + window.pageXOffset,
  // s1coords.top + window.pageYOffset
  // );
  // window.scrollTo({
  // left: s1coords.left + window.pageXOffset,
  // top: s1coords.top + window.pageYOffset,
  // behavior: 'smooth',
  // });

  // modern way
  section1.scrollIntoView({ behavior: 'smooth' });
});

///////////////////////////////////////
// Page Navigation

// document.querySelectorAll('.nav__link').forEach(function (el) {
// el.addEventListener('click', function (e) {
// e.preventDefault();
// const id = this.getAttribute('href');
// console.log(id);
// document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
// });
// });

// Event delagation
// 1. Add event listener to common parent element
// 2. Determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    e.preventDefault();
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed Component

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach(t => t.classList.remove('.operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Active Tab
  clicked.classList.add('.operations__tab--active');

  // Active content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky navigation

///// inefficient way, bc scroll event fires all the time
// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });
// Sv: Intersection Observer API
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

//// Reveal Sections
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

// allSections.forEach(function (section) {
//   sectionObserver.observe(section);
//   section.classList.add('section--hidden');
// });

//// Lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');
const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '300px',
});
imgTargets.forEach(img => imgObserver.observe(img));

//////////////////
// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  let currSlide = 0;
  const maxSlide = slides.length;
  const dotContainer = document.querySelector('.dots');

  //// Functions
  const createDots = function () {
    slides.forEach((_, i) =>
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class='dots__dot dots__dot--active' data-slide="${i}"></button>`
      )
    );
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide ="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  const nextSlide = function () {
    if (currSlide === maxSlide - 1) {
      currSlide = 0;
    } else {
      currSlide++;
    }
    goToSlide(currSlide);
    activateDot(currSlide);
  };
  const prevSlide = function () {
    if (currSlide <= 0) {
      currSlide = maxSlide;
    } else {
      currSlide--;
      goToSlide(currSlide);
      activateDot(currSlide);
    }
  };
  const init = function () {
    createDots();
    activateDot(0);
    goToSlide(0);
  };
  init();
  // Event Handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
/////////////////////////////////////////////////////////////////////////////////////

console.log('Cześć kochana Babciu!');
/*
//Selecting Elements
// console.log(document.documentElement);
// console.log(document.head);
// console.log(document.body);
//
const header = document.querySelector('.header');
const allSection = document.querySelectorAll('.section');
// console.log(allSection);

document.getElementById('section--1');
const allButtons = document.getElementsByTagName('button');
// console.log(allButtons);
//
// console.log(document.getElementsByClassName('btn'));

//Creating and Inserting Elements
// .insertAdjacentHTML

const message = document.createElement('div');
message.classList.add('cookie-message');
message.textContent = 'We use cookies for improved functionality and analytics';
message.innerHTML =
  'We use cookies for improved functionality and analytics. <button class="btn btn--close-cookies">Got it!</button>';
header.prepend(message);
// header.append(message);
// header.append(message.cloneNode(true));
// header.before(message);
// header.after(message);

//Delete elements

document
  .querySelector('.btn--close-cookies')
  .addEventListener('click', function () {
    message.remove();
  });

// Styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(message.style.height);
console.log(message.style.backgroundColor); // Only works for inline style

console.log(getComputedStyle(message).color); // For style sheets
console.log(getComputedStyle(message).height);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 20 + 'px';

// CSS Variables (Custom properties)

document.documentElement.style.setProperty('--color-primary', 'orangered');

//Attributes

const logo = document.querySelector('.nav__logo');

console.log(logo.alt);
console.log(logo.src);
console.log(logo.className);

// Set attribiutes
logo.alt = 'beautiful minimalist logo';
logo.setAttribute('company', 'Bankist');

// Non-standard
console.log(logo.designer); // doesm't work
console.log(logo.getAttribute('designer'));
console.log(logo.getAttribute('scr')); // relative url
console.log(logo.src); // absolute url

const link = document.querySelector('.nav__link--btn');
console.log(link.href);
console.log(link.getAttribute('href'));

// Data attributes
console.log(logo.dataset.versionNumber);

// Classes
logo.classList.add('c');
logo.classList.remove('c', 'j');
logo.classList.toggle('c');
logo.classList.contains('c');

// Don't use, bc it will override ALL existing classes
logo.className = 'jonas';


// Event Handlers

const h1 = document.querySelector('h1');

const alerth1 = function (e) {
  alert('addEventListener: Great! You are reading the heading :D');
};
h1.addEventListener('mouseenter', alerth1);

setTimeout(() => h1.removeEventListener('mouseenter', alerth1), 3000);
// h1.onmouseenter=  function (e) {
// alert('addEventListener: Great! You are reading the heading :D');
// }


// rgb(255,255,255)
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);

  // Stop propagation -bad idea
  // e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTEINER', e.target, e.currentTarget);
});

document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('NAV', e.target, e.currentTarget);
});


const h1 = document.querySelector('h1');

// Going downward: child
console.log(h1.querySelectorAll('.highlight'));
console.log(h1.childNodes);
console.log(h1.children); // HTML Collection
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'black';

// Going upwards: parent
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('header').style.background = 'var(--gradient-secondary)';

h1.closest('h1').style.background = 'var(--gradient-primary)';

// Going sideways: siblings - only previous and next

console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = 'scale(0.5)';
});


// Intersection Observer API
const obsCallback = function (entries, observer) {
  entries.forEach(entry => {
    console.log(entry);
  });
};

const obsOptions = {
  root: null, // observing the entire viewport
  threshold: [0, 0.2],
};
const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(section1); // Every time section1 intersects root el at the threshold, obsCallbac is called
*/
///// Lifecycle
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built', e);
});

window.addEventListener('load', function (e) {
  console.log('Page fully loaded', e);
});
// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// });
