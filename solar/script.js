document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const pauseBtn = document.getElementById('pause-btn');
    const speedSlider = document.getElementById('speed-slider');
    const speedValue = document.getElementById('speed-value');
    const earthOrbit = document.querySelector('.earth-orbit');
    const earth = document.querySelector('.earth');
    const moonOrbit = document.querySelector('.moon-orbit');
    const moon = document.querySelector('.moon');
    const sun = document.querySelector('.sun');
    
    // Add eclipse control buttons
    const controlsDiv = document.querySelector('.controls');
    const eclipseControls = document.createElement('div');
    eclipseControls.className = 'eclipse-controls';
    eclipseControls.innerHTML = `
        <button id="lunar-eclipse-btn">Show Lunar Eclipse</button>
        <button id="solar-eclipse-btn">Show Solar Eclipse</button>
        <button id="reset-eclipse-btn">Reset Normal Orbit</button>
    `;
    controlsDiv.appendChild(eclipseControls);
    
    const lunarEclipseBtn = document.getElementById('lunar-eclipse-btn');
    const solarEclipseBtn = document.getElementById('solar-eclipse-btn');
    const resetEclipseBtn = document.getElementById('reset-eclipse-btn');
    
    // Animation state
    let isPaused = false;
    let animationSpeed = 1;
    let currentEclipseState = 'none'; // 'none', 'lunar', or 'solar'
    
    // Original animation durations (in seconds)
    const originalDurations = {
        earthOrbit: 36.5,  // Earth orbits the Sun in 365 days (scaled to 36.5s)
        earthRotation: 2.4,  // Earth rotates in 24 hours (scaled to 2.4s)
        moonOrbit: 2.7,  // Moon orbits Earth in 27.3 days (scaled to 2.7s)
        moonRotation: 2.7  // Moon rotates in 27.3 days (scaled to 2.7s)
    };
    
    // Function to update animation speeds
    function updateAnimationSpeeds() {
        const newEarthOrbitDuration = originalDurations.earthOrbit / animationSpeed;
        const newEarthRotationDuration = originalDurations.earthRotation / animationSpeed;
        const newMoonOrbitDuration = originalDurations.moonOrbit / animationSpeed;
        const newMoonRotationDuration = originalDurations.moonRotation / animationSpeed;
        
        earthOrbit.style.animationDuration = `${newEarthOrbitDuration}s`;
        earth.style.animationDuration = `${newEarthRotationDuration}s`;
        moonOrbit.style.animationDuration = `${newMoonOrbitDuration}s`;
        moon.style.animationDuration = `${newMoonRotationDuration}s`;
    }
    
    // Function to set up lunar eclipse
    function setupLunarEclipse() {
        // Reset any existing eclipse state
        resetEclipseState();
        
        // Position Earth between Sun and Moon for lunar eclipse
        earthOrbit.style.animation = 'none';
        moonOrbit.style.animation = 'none';
        
        // Position Earth on the left side of the Sun
        earthOrbit.style.transform = 'rotate(180deg)';
        
        // Position Moon behind Earth (in Earth's shadow)
        moonOrbit.style.transform = 'rotate(0deg)';
        
        // Add shadow effect
        moon.classList.add('eclipsed');
        
        // Add explanation
        showEclipseExplanation('lunar');
        
        currentEclipseState = 'lunar';
    }
    
    // Function to set up solar eclipse
    function setupSolarEclipse() {
        // Reset any existing eclipse state
        resetEclipseState();
        
        // Position Moon between Earth and Sun for solar eclipse
        earthOrbit.style.animation = 'none';
        moonOrbit.style.animation = 'none';
        
        // Position Earth on the right side of the Sun
        earthOrbit.style.transform = 'rotate(0deg)';
        
        // Position Moon between Earth and Sun
        moonOrbit.style.transform = 'rotate(180deg)';
        
        // Add shadow effect
        sun.classList.add('eclipsed-by-moon');
        
        // Add explanation
        showEclipseExplanation('solar');
        
        currentEclipseState = 'solar';
    }
    
    // Function to reset to normal orbit
    function resetEclipseState() {
        // Remove any eclipse-specific classes
        moon.classList.remove('eclipsed');
        sun.classList.remove('eclipsed-by-moon');
        
        // Reset animations
        earthOrbit.style.animation = '';
        moonOrbit.style.animation = '';
        updateAnimationSpeeds();
        
        // Remove any eclipse explanation
        const existingExplanation = document.querySelector('.eclipse-explanation');
        if (existingExplanation) {
            existingExplanation.remove();
        }
        
        currentEclipseState = 'none';
    }
    
    // Function to show eclipse explanation
    function showEclipseExplanation(eclipseType) {
        // Remove any existing explanation
        const existingExplanation = document.querySelector('.eclipse-explanation');
        if (existingExplanation) {
            existingExplanation.remove();
        }
        
        // Create new explanation
        const explanation = document.createElement('div');
        explanation.className = 'eclipse-explanation';
        
        if (eclipseType === 'lunar') {
            explanation.innerHTML = `
                <h3>Lunar Eclipse</h3>
                <p>A lunar eclipse occurs when the Earth comes between the Sun and the Moon, 
                blocking sunlight from reaching the Moon. The Earth casts its shadow on the Moon, 
                causing it to darken and sometimes appear reddish.</p>
                <p>Lunar eclipses can only happen during a full moon when the Moon is on the opposite 
                side of the Earth from the Sun.</p>
            `;
        } else if (eclipseType === 'solar') {
            explanation.innerHTML = `
                <h3>Solar Eclipse</h3>
                <p>A solar eclipse occurs when the Moon comes between the Earth and the Sun, 
                casting a shadow on Earth and blocking the Sun's light.</p>
                <p>Solar eclipses can only happen during a new moon when the Moon is between 
                the Earth and the Sun.</p>
            `;
        }
        
        // Add explanation to the page
        const animationSection = document.getElementById('animation');
        animationSection.appendChild(explanation);
    }
    
    // Pause/Play button
    pauseBtn.addEventListener('click', function() {
        isPaused = !isPaused;
        
        const elements = [earthOrbit, earth, moonOrbit, moon];
        
        if (isPaused) {
            elements.forEach(el => {
                const computedStyle = window.getComputedStyle(el);
                const animationName = computedStyle.getPropertyValue('animation-name');
                const animationDuration = computedStyle.getPropertyValue('animation-duration');
                const animationTimingFunction = computedStyle.getPropertyValue('animation-timing-function');
                const animationDelay = computedStyle.getPropertyValue('animation-delay');
                const animationIterationCount = computedStyle.getPropertyValue('animation-iteration-count');
                const animationDirection = computedStyle.getPropertyValue('animation-direction');
                const animationFillMode = computedStyle.getPropertyValue('animation-fill-mode');
                
                el.style.animationPlayState = 'paused';
            });
            
            pauseBtn.textContent = 'Play';
        } else {
            elements.forEach(el => {
                el.style.animationPlayState = 'running';
            });
            
            pauseBtn.textContent = 'Pause';
        }
    });
    
    // Speed slider
    speedSlider.addEventListener('input', function() {
        animationSpeed = parseFloat(this.value);
        speedValue.textContent = `${animationSpeed.toFixed(1)}x`;
        updateAnimationSpeeds();
    });
    
    // Eclipse buttons
    lunarEclipseBtn.addEventListener('click', setupLunarEclipse);
    solarEclipseBtn.addEventListener('click', setupSolarEclipse);
    resetEclipseBtn.addEventListener('click', resetEclipseState);
    
    // Initialize with default speed
    updateAnimationSpeeds();
    
    // Add some educational tooltips
    const celestialBodies = [
        { element: sun, name: 'Sun', info: 'The star at the center of our Solar System' },
        { element: earth, name: 'Earth', info: 'Our home planet, orbits the Sun once every 365.25 days' },
        { element: moon, name: 'Moon', info: 'Earth\'s natural satellite, orbits Earth once every 27.3 days' }
    ];
    
    celestialBodies.forEach(body => {
        body.element.setAttribute('title', `${body.name}: ${body.info}`);
    });
    
    // Add some facts that change periodically
    const facts = [
        "The Earth travels at about 107,000 km/h in its orbit around the Sun.",
        "The Moon is about 1/4 the diameter of Earth.",
        "The Sun is so large that about 1.3 million Earths could fit inside it.",
        "The Earth's axis is tilted at 23.5 degrees, which causes our seasons.",
        "The Moon's gravity is responsible for most of Earth's tides.",
        "A lunar eclipse can last up to 3 hours and 40 minutes.",
        "A total solar eclipse can only be seen from a small area on Earth.",
        "Solar eclipses happen somewhere on Earth about 2-5 times per year."
    ];
    
    const factList = document.querySelector('.fact-list');
    let factIndex = 0;
    
    // Add a dynamic fact that changes every 10 seconds
    const dynamicFact = document.createElement('li');
    dynamicFact.classList.add('dynamic-fact');
    dynamicFact.textContent = facts[factIndex];
    factList.appendChild(dynamicFact);
    
    setInterval(() => {
        factIndex = (factIndex + 1) % facts.length;
        dynamicFact.textContent = facts[factIndex];
        dynamicFact.style.animation = 'none';
        dynamicFact.offsetHeight; // Trigger reflow
        dynamicFact.style.animation = 'fadeInOut 10s';
    }, 10000);
});