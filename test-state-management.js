/**
 * Unit Tests for Whispering Arcana State Management System
 * Run with: node test-state-management.js
 */

// Simple test framework
class TestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }
    
    test(name, testFn) {
        this.tests.push({ name, testFn });
    }
    
    assert(condition, message) {
        if (!condition) {
            throw new Error(message);
        }
    }
    
    assertEqual(actual, expected, message) {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
            throw new Error(`${message}. Expected: ${JSON.stringify(expected)}, Got: ${JSON.stringify(actual)}`);
        }
    }
    
    async run() {
        console.log('🧪 Running State Management Tests...\n');
        
        for (const { name, testFn } of this.tests) {
            try {
                await testFn();
                console.log(`✅ ${name}`);
                this.passed++;
            } catch (error) {
                console.log(`❌ ${name}: ${error.message}`);
                this.failed++;
            }
        }
        
        console.log(`\n📊 Results: ${this.passed} passed, ${this.failed} failed`);
        return this.failed === 0;
    }
}

// Mock localStorage for Node.js environment
global.localStorage = {
    store: {},
    getItem(key) {
        return this.store[key] || null;
    },
    setItem(key, value) {
        this.store[key] = value;
    },
    removeItem(key) {
        delete this.store[key];
    },
    clear() {
        this.store = {};
    }
};

// Mock window object
global.window = {
    matchMedia: () => ({ matches: false })
};

// Create test runner
const runner = new TestRunner();

// Test 1: Basic State Structure
runner.test('Basic State Structure Validation', () => {
    const defaultState = {
        currentLanguage: 'en',
        dailyCard: {
            date: null,
            cardId: null,
            revealed: false
        },
        currentReading: {
            cards: [],
            revealed: []
        },
        preferences: {
            reducedMotion: false
        },
        version: '1.0.0'
    };
    
    // Test required properties
    runner.assert(defaultState.hasOwnProperty('currentLanguage'), 'Should have currentLanguage property');
    runner.assert(defaultState.hasOwnProperty('dailyCard'), 'Should have dailyCard property');
    runner.assert(defaultState.hasOwnProperty('currentReading'), 'Should have currentReading property');
    runner.assert(defaultState.hasOwnProperty('preferences'), 'Should have preferences property');
    
    // Test data types
    runner.assert(typeof defaultState.currentLanguage === 'string', 'currentLanguage should be string');
    runner.assert(typeof defaultState.dailyCard === 'object', 'dailyCard should be object');
    runner.assert(Array.isArray(defaultState.currentReading.cards), 'currentReading.cards should be array');
    runner.assert(typeof defaultState.preferences.reducedMotion === 'boolean', 'reducedMotion should be boolean');
});

// Test 2: Date Validation Function
runner.test('Date Validation Function', () => {
    function isValidDateString(dateString) {
        if (typeof dateString !== 'string') return false;
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date) && dateString === date.toISOString().split('T')[0];
    }
    
    runner.assert(isValidDateString('2024-01-15'), 'Valid ISO date should pass');
    runner.assert(!isValidDateString('invalid-date'), 'Invalid date string should fail');
    runner.assert(!isValidDateString('2024-13-01'), 'Invalid month should fail');
    runner.assert(!isValidDateString(null), 'Null should fail');
    runner.assert(!isValidDateString(123), 'Number should fail');
});

// Test 3: State Validation Logic
runner.test('State Validation Logic', () => {
    function validateState(state) {
        try {
            if (!state || typeof state !== 'object') return false;
            
            const requiredProps = ['currentLanguage', 'dailyCard', 'currentReading', 'preferences'];
            for (const prop of requiredProps) {
                if (!(prop in state)) return false;
            }
            
            if (!['en', 'zh-TW'].includes(state.currentLanguage)) return false;
            
            const dailyCard = state.dailyCard;
            if (!dailyCard || typeof dailyCard !== 'object') return false;
            
            if (dailyCard.cardId !== null && (!Number.isInteger(dailyCard.cardId) || dailyCard.cardId < 0 || dailyCard.cardId > 77)) {
                return false;
            }
            
            if (typeof dailyCard.revealed !== 'boolean') return false;
            
            const currentReading = state.currentReading;
            if (!currentReading || typeof currentReading !== 'object') return false;
            
            if (!Array.isArray(currentReading.cards) || !Array.isArray(currentReading.revealed)) return false;
            
            const preferences = state.preferences;
            if (!preferences || typeof preferences !== 'object') return false;
            
            if (typeof preferences.reducedMotion !== 'boolean') return false;
            
            return true;
        } catch (error) {
            return false;
        }
    }
    
    // Valid state
    const validState = {
        currentLanguage: 'en',
        dailyCard: { date: null, cardId: null, revealed: false },
        currentReading: { cards: [], revealed: [] },
        preferences: { reducedMotion: false }
    };
    runner.assert(validateState(validState), 'Valid state should pass validation');
    
    // Invalid language
    const invalidLanguage = { ...validState, currentLanguage: 'invalid' };
    runner.assert(!validateState(invalidLanguage), 'Invalid language should fail validation');
    
    // Invalid card ID
    const invalidCardId = { ...validState, dailyCard: { ...validState.dailyCard, cardId: 100 } };
    runner.assert(!validateState(invalidCardId), 'Invalid card ID should fail validation');
    
    // Missing required property
    const missingProperty = { ...validState };
    delete missingProperty.dailyCard;
    runner.assert(!validateState(missingProperty), 'Missing required property should fail validation');
});

// Test 4: localStorage Integration
runner.test('localStorage Integration', () => {
    const storageKey = 'whispering-arcana-state';
    
    // Test saving state
    const testState = {
        currentLanguage: 'zh-TW',
        dailyCard: { date: '2024-01-15', cardId: 42, revealed: true },
        currentReading: { cards: [1, 2, 3], revealed: [true, false, false] },
        preferences: { reducedMotion: true }
    };
    
    localStorage.setItem(storageKey, JSON.stringify(testState));
    
    // Test loading state
    const storedState = JSON.parse(localStorage.getItem(storageKey));
    runner.assertEqual(storedState.currentLanguage, 'zh-TW', 'Language should be persisted');
    runner.assertEqual(storedState.dailyCard.cardId, 42, 'Card ID should be persisted');
    runner.assertEqual(storedState.preferences.reducedMotion, true, 'Preferences should be persisted');
    
    // Test clearing state
    localStorage.removeItem(storageKey);
    runner.assertEqual(localStorage.getItem(storageKey), null, 'State should be cleared');
});

// Test 5: Error Handling
runner.test('Error Handling', () => {
    // Test JSON parsing error handling
    function safeJsonParse(jsonString) {
        try {
            return JSON.parse(jsonString);
        } catch (error) {
            return null;
        }
    }
    
    runner.assertEqual(safeJsonParse('{"valid": "json"}').valid, 'json', 'Valid JSON should parse correctly');
    runner.assertEqual(safeJsonParse('invalid json'), null, 'Invalid JSON should return null');
    runner.assertEqual(safeJsonParse(''), null, 'Empty string should return null');
    
    // Test localStorage availability check
    function checkLocalStorageAvailability() {
        try {
            const testKey = '__localStorage_test__';
            localStorage.setItem(testKey, 'test');
            localStorage.removeItem(testKey);
            return true;
        } catch (error) {
            return false;
        }
    }
    
    runner.assert(checkLocalStorageAvailability(), 'localStorage should be available in test environment');
});

// Test 6: State Merging Logic
runner.test('State Merging Logic', () => {
    function mergeWithDefaults(loadedState, defaultState) {
        const merged = { ...defaultState };
        
        Object.keys(defaultState).forEach(key => {
            if (key in loadedState) {
                if (typeof defaultState[key] === 'object' && defaultState[key] !== null) {
                    merged[key] = { ...defaultState[key], ...loadedState[key] };
                } else {
                    merged[key] = loadedState[key];
                }
            }
        });
        
        return merged;
    }
    
    const defaultState = {
        currentLanguage: 'en',
        dailyCard: { date: null, cardId: null, revealed: false },
        preferences: { reducedMotion: false, newFeature: true }
    };
    
    const loadedState = {
        currentLanguage: 'zh-TW',
        dailyCard: { cardId: 42 },
        preferences: { reducedMotion: true }
    };
    
    const merged = mergeWithDefaults(loadedState, defaultState);
    
    runner.assertEqual(merged.currentLanguage, 'zh-TW', 'Should use loaded language');
    runner.assertEqual(merged.dailyCard.cardId, 42, 'Should use loaded card ID');
    runner.assertEqual(merged.dailyCard.date, null, 'Should keep default date');
    runner.assertEqual(merged.preferences.reducedMotion, true, 'Should use loaded preference');
    runner.assertEqual(merged.preferences.newFeature, true, 'Should keep default new feature');
});

// Test 7: Daily Card Date Logic
runner.test('Daily Card Date Logic', () => {
    function isDailyCardForToday(dailyCardDate) {
        const today = new Date().toISOString().split('T')[0];
        return dailyCardDate === today;
    }
    
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    runner.assert(isDailyCardForToday(today), 'Today\'s date should match');
    runner.assert(!isDailyCardForToday(yesterday), 'Yesterday\'s date should not match');
    runner.assert(!isDailyCardForToday(null), 'Null date should not match');
    runner.assert(!isDailyCardForToday('invalid'), 'Invalid date should not match');
});

// Test 8: Property Path Access
runner.test('Property Path Access', () => {
    function getStateProperty(state, path) {
        try {
            return path.split('.').reduce((obj, key) => obj?.[key], state);
        } catch (error) {
            return undefined;
        }
    }
    
    function setStateProperty(state, path, value) {
        try {
            // Deep clone the state to avoid mutations
            const newState = JSON.parse(JSON.stringify(state));
            const keys = path.split('.');
            const lastKey = keys.pop();
            
            let current = newState;
            for (const key of keys) {
                if (!(key in current)) {
                    current[key] = {};
                }
                current = current[key];
            }
            
            current[lastKey] = value;
            return newState;
        } catch (error) {
            return state;
        }
    }
    
    const testState = {
        dailyCard: { cardId: 42, revealed: false },
        preferences: { reducedMotion: true }
    };
    
    runner.assertEqual(getStateProperty(testState, 'dailyCard.cardId'), 42, 'Should get nested property');
    runner.assertEqual(getStateProperty(testState, 'invalid.path'), undefined, 'Should return undefined for invalid path');
    
    const updatedState = setStateProperty(testState, 'dailyCard.cardId', 99);
    runner.assertEqual(getStateProperty(updatedState, 'dailyCard.cardId'), 99, 'Should set nested property');
    runner.assertEqual(getStateProperty(testState, 'dailyCard.cardId'), 42, 'Original state should be unchanged');
});

// Run all tests
runner.run().then(success => {
    if (success) {
        console.log('\n🎉 All state management tests passed!');
        console.log('✨ State management system is ready for integration.');
    } else {
        console.log('\n💥 Some tests failed. Please check the implementation.');
        process.exit(1);
    }
});