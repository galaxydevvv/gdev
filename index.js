console.clear();

const clock = document.getElementById('clock');
const timeValue = document.getElementById('timeValue');
const timePeriod = document.getElementById('timePeriod');
const clockDate = document.getElementById('clockDate');

const rings = {
  hours:   { el: clock.querySelector('.hours'),   numbers: 12 },
  minutes: { el: clock.querySelector('.minutes'), numbers: 60 },
  seconds: { el: clock.querySelector('.seconds'), numbers: 60 },
};

// Build the clock rings dynamically
Object.entries(rings).forEach(([key, item]) => {
  item.el.innerHTML = ''; // clear existing dots

  for (let i = 0; i < item.numbers; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot';

    const angle = (360 / item.numbers) * i;
    dot.style.transform = `rotate(${angle}deg) translateY(calc((var(--clock-radius) + var(--dot-h) * .5) * -1))`;

    item.el.appendChild(dot);
  }
});

// Store previous active elements to prevent unnecessary DOM updates
const prevActive = {
  hours: null,
  minutes: null,
  seconds: null
};

function updateClock() {
  const now = new Date();

  const current = {
    hours: now.getHours() % 12,
    minutes: now.getMinutes(),
    seconds: now.getSeconds()
  };

  // Loop through each time unit to activate dots
  for (const unit in current) {
    const value = current[unit];
    const ring = rings[unit].el;
    if (prevActive[unit] !== value) {
      if (prevActive[unit] !== null) {
        ring.children[prevActive[unit]].classList.remove('active');
      }
      ring.children[value].classList.add('active');
      prevActive[unit] = value;
    }
  }

  // Update numerical display text
  const displayHours = ((now.getHours() % 12) || 12).toString();
  const displayMinutes = current.minutes.toString().padStart(2, '0');
  const displaySeconds = current.seconds.toString().padStart(2, '0');
  const period = now.getHours() >= 12 ? 'PM' : 'AM';

  timeValue.textContent = `${displayHours}:${displayMinutes}`;
  timePeriod.textContent = period;
  clockDate.textContent = now.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  clock.style.setProperty('--second-angle', `${current.seconds * 6}deg`);
  clock.setAttribute('aria-label', `Current time: ${displayHours}:${displayMinutes}:${displaySeconds} ${period}`);
}

updateClock();
setInterval(updateClock, 1000);

function fitClock() {
  const clockSize = clock.clientWidth;
  const hourDotHeight = parseFloat(getComputedStyle(clock).getPropertyValue('--dot-hours-h')) || 20;
  clock.style.setProperty('--clock-radius', `${Math.max(1, (clockSize / 2) - hourDotHeight)}px`);
}

fitClock();
new ResizeObserver(fitClock).observe(clock);
