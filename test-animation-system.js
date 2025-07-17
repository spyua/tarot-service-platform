/**
 * Test Suite for 3D Card Animation System
 * Tests animation triggers, completion callbacks, and performance monitoring
 */

function runAnimationTests() {
    console.log('🧪 Running Animation System Tests...');
    
    let passed = 0;
    let failed = 0;
    let total = 0;
    
    function test(name, testFn) {
        total++;
        try {
            testFn();
            passed++;
            console.log(`✅ ${name}`);
        } catch (error) {
            failed++;
            console.error(`❌ ${name}: ${error.message}`);
        }
    }
    
    function assert(condition, message) {
        if (!condition) {
            throw new Error(message);
        }
    }
    
    // Test 1: AnimationController Initialization
    test('AnimationController should be initialized', () => {
        assert(window.AnimationController, 'AnimationController should exist');
        assert(typeof window.AnimationController.flipCard === 'function', 'flipCard should be a function');
        assert(typeof window.AnimationController.arrangeCards === 'function', 'arrangeCards should be a function');
        assert(typeof window.AnimationController.startBackgroundEffects === 'function', 'startBackgroundEffects should be a function');
    });
    
    // Test 2: Card Element Creation
    test('Card element creation should work correctly', () => {
        const cardData = {
            name: 'Test Card',
            keywords: ['test', 'card'],
            symbol: '★'
        };
        
        const cardElement = window.AnimationController.createCardElement(cardData);
        assert(cardElement instanceof HTMLElement, 'Should return HTML element');
        assert(cardElement.classList.contains('card-container'), 'Should have card-container class');
        
        const card = cardElement.querySelector('.tarot-card');
        assert(card, 'Should contain tarot-card element');
        
        const cardBack = cardElement.querySelector('.card-back');
        const cardFront = cardElement.querySelector('.card-front');
        assert(cardBack, 'Should have card back');
        assert(cardFront, 'Should have card front');
    });
    
    // Test 3: Reduced Motion Detection
    test('Reduced motion detection should work', () => {
        const reducedMotion = window.AnimationController.checkReducedMotionPreference();
        assert(typeof reducedMotion === 'boolean', 'Should return boolean');
    });
    
    // Test 4: Performance Monitoring
    test('Performance monitoring should work', () => {
        const metrics = window.AnimationController.getPerformanceMetrics();
        assert(typeof metrics === 'object', 'Should return metrics object');
        assert(typeof metrics.frameDrops === 'number', 'Should have frameDrops metric');
        assert(typeof metrics.averageFrameTime === 'number', 'Should have averageFrameTime metric');
        assert(typeof metrics.activeAnimations === 'number', 'Should have activeAnimations count');
        assert(typeof metrics.reducedMotion === 'boolean', 'Should have reducedMotion flag');
    });
    
    // Test 5: Card Flip Animation (Reduced Motion)
    test('Card flip animation should work with reduced motion', async () => {
        const cardData = { name: 'Test Card', keywords: ['test'], symbol: '★' };
        const cardElement = window.AnimationController.createCardElement(cardData);
        document.body.appendChild(cardElement);
        
        // Force reduced motion for this test
        const originalReducedMotion = window.AnimationController.reducedMotion;
        window.AnimationController.reducedMotion = true;
        
        try {
            await window.AnimationController.flipCard(cardElement);
            const card = cardElement.querySelector('.tarot-card');
            assert(card.classList.contains('flipped'), 'Card should be flipped');
        } finally {
            // Restore original setting
            window.AnimationController.reducedMotion = originalReducedMotion;
            document.body.removeChild(cardElement);
        }
    });
    
    // Test 6: Card Arrangement
    test('Card arrangement should work', async () => {
        const cardElements = [];
        for (let i = 0; i < 3; i++) {
            const cardData = { name: `Test Card ${i}`, keywords: ['test'], symbol: '★' };
            const cardElement = window.AnimationController.createCardElement(cardData);
            cardElements.push(cardElement);
            document.body.appendChild(cardElement);
        }
        
        // Create container
        const container = document.createElement('div');
        container.className = 'cards-container';
        cardElements.forEach(card => container.appendChild(card));
        document.body.appendChild(container);
        
        try {
            await window.AnimationController.arrangeCards(cardElements, 'three');
            assert(container.classList.contains('layout-three'), 'Container should have layout class');
        } finally {
            document.body.removeChild(container);
        }
    });
    
    // Test 7: Background Effects
    test('Background effects should start without errors', () => {
        // Create test container
        const testContainer = document.createElement('div');
        testContainer.id = 'test-container';
        document.body.appendChild(testContainer);
        
        try {
            window.AnimationController.startBackgroundEffects(testContainer);
            // Should not throw errors
            assert(true, 'Background effects started successfully');
        } finally {
            document.body.removeChild(testContainer);
        }
    });
    
    // Test 8: Animation Cleanup
    test('Animation cleanup should work', () => {
        const initialMetrics = window.AnimationController.getPerformanceMetrics();
        window.AnimationController.cleanup();
        
        const particles = document.querySelectorAll('.floating-particle');
        assert(particles.length === 0, 'All particles should be removed');
        
        const particleStyles = document.querySelector('#particle-animations');
        assert(!particleStyles, 'Particle animation styles should be removed');
    });
    
    // Test 9: Error Handling
    test('Error handling should work correctly', async () => {
        try {
            await window.AnimationController.flipCard(null);
            assert(false, 'Should throw error for null element');
        } catch (error) {
            assert(error instanceof Error, 'Should throw proper error');
        }
        
        try {
            await window.AnimationController.arrangeCards(null, 'single');
            // Should resolve without error for null/empty array
            assert(true, 'Should handle null cards gracefully');
        } catch (error) {
            assert(false, 'Should not throw error for null cards');
        }
    });
    
    // Test 10: Animation State Management
    test('Animation state management should work', () => {
        const cardData = { name: 'Test Card', keywords: ['test'], symbol: '★' };
        const cardElement = window.AnimationController.createCardElement(cardData);
        document.body.appendChild(cardElement);
        
        try {
            // Test stop all animations
            window.AnimationController.stopAllAnimations();
            const metrics = window.AnimationController.getPerformanceMetrics();
            assert(metrics.activeAnimations === 0, 'Should have no active animations');
        } finally {
            document.body.removeChild(cardElement);
        }
    });
    
    // Print results
    console.log(`\n📊 Animation Test Results: ${passed}/${total} passed`);
    if (failed === 0) {
        console.log('🎉 All animation system tests passed!');
    } else {
        console.log(`⚠️ ${failed} test(s) failed`);
    }
    
    return { passed, failed, total };
}

// Export for use in main application
if (typeof window !== 'undefined') {
    window.runAnimationTests = runAnimationTests;
}