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
        <button id="lunar-eclipse-btn">Tampilkan Gerhana Bulan</button>
        <button id="solar-eclipse-btn">Tampilkan Gerhana Matahari</button>
        <button id="reset-eclipse-btn">Kembalikan Orbit Normal</button>
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
                <h3>Gerhana Bulan</h3>
                <p>Gerhana bulan terjadi ketika Bumi berada di antara Matahari dan Bulan, 
                menghalangi sinar matahari mencapai Bulan. Bumi melemparkan bayangannya pada Bulan, 
                menyebabkan Bulan menjadi gelap dan terkadang tampak kemerahan.</p>
                <p>Gerhana bulan hanya dapat terjadi saat bulan purnama ketika Bulan berada di sisi 
                berlawanan dari Bumi terhadap Matahari.</p>
            `;
        } else if (eclipseType === 'solar') {
            explanation.innerHTML = `
                <h3>Gerhana Matahari</h3>
                <p>Gerhana matahari terjadi ketika Bulan berada di antara Bumi dan Matahari, 
                melemparkan bayangan pada Bumi dan menghalangi cahaya Matahari.</p>
                <p>Gerhana matahari hanya dapat terjadi saat bulan baru ketika Bulan berada di antara 
                Bumi dan Matahari.</p>
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
    const facts = [
        "Bumi bergerak dengan kecepatan sekitar 107.000 km/jam dalam orbitnya mengelilingi Matahari.",
        "Bulan memiliki diameter sekitar 1/4 dari diameter Bumi.",
        "Matahari sangat besar sehingga sekitar 1,3 juta Bumi dapat muat di dalamnya.",
        "Sumbu Bumi miring 23,5 derajat, yang menyebabkan terjadinya musim.",
        "Gravitasi Bulan bertanggung jawab atas sebagian besar pasang surut di Bumi.",
        "Gerhana bulan dapat berlangsung hingga 3 jam 40 menit.",
        "Gerhana matahari total hanya dapat dilihat dari area kecil di Bumi.",
        "Gerhana matahari terjadi di suatu tempat di Bumi sekitar 2-5 kali per tahun."
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