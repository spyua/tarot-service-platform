// Test State Management System
console.log('🧪 Testing State Management System...');

// Test 1: AppStateManager Creation
function testAppStateManager() {
    console.log('Test 1: AppStateManager Creation');
    
    try {
        const testStateManager = new AppStateManager();
        console.log('✅ AppStateManager created successfully');
        console.log('State:', testStateManager.getState());
        console.log('Debug info:', testStateManager.getDebugInfo());
        return true;
    } catch (error) {
        console.error('❌ AppStateManager creation failed:', error);
        return false;
    }
}

// Test 2: LanguageManager Creation
function testLanguageManager() {
    console.log('Test 2: LanguageManager Creation');
    
    try {
        const testStateManager = new AppStateManager();
        const testLanguageManager = new LanguageManager(testStateManager);
        console.log('✅ LanguageManager created successfully');
        console.log('Current language:', testLanguageManager.getCurrentLanguage());
        console.log('Available languages:', testLanguageManager.getAvailableLanguages());
        console.log('Debug info:', testLanguageManager.getDebugInfo());
        return true;
    } catch (error) {
        console.error('❌ LanguageManager creation failed:', error);
        return false;
    }
}

// Test 3: Language Switching
function testLanguageSwitching() {
    console.log('Test 3: Language Switching');
    
    try {
        const testStateManager = new AppStateManager();
        const testLanguageManager = new LanguageManager(testStateManager);
        
        const initialLang = testLanguageManager.getCurrentLanguage();
        console.log('Initial language:', initialLang);
        
        // Switch to Chinese
        const switchResult1 = testLanguageManager.setLanguage('zh-TW');
        console.log('Switch to Chinese result:', switchResult1);
        console.log('Current language after switch:', testLanguageManager.getCurrentLanguage());
        
        // Switch back to English
        const switchResult2 = testLanguageManager.setLanguage('en');
        console.log('Switch to English result:', switchResult2);
        console.log('Current language after switch back:', testLanguageManager.getCurrentLanguage());
        
        // Test invalid language
        const switchResult3 = testLanguageManager.setLanguage('invalid');
        console.log('Switch to invalid language result:', switchResult3);
        
        console.log('✅ Language switching test completed');
        return true;
    } catch (error) {
        console.error('❌ Language switching test failed:', error);
        return false;
    }
}

// Test 4: Text Retrieval
function testTextRetrieval() {
    console.log('Test 4: Text Retrieval');
    
    try {
        const testStateManager = new AppStateManager();
        const testLanguageManager = new LanguageManager(testStateManager);
        
        // Test English text
        testLanguageManager.setLanguage('en');
        const englishTitle = testLanguageManager.getText('app.title');
        console.log('English title:', englishTitle);
        
        // Test Chinese text
        testLanguageManager.setLanguage('zh-TW');
        const chineseTitle = testLanguageManager.getText('app.title');
        console.log('Chinese title:', chineseTitle);
        
        // Test non-existent key
        const nonExistent = testLanguageManager.getText('nonexistent.key');
        console.log('Non-existent key result:', nonExistent);
        
        console.log('✅ Text retrieval test completed');
        return true;
    } catch (error) {
        console.error('❌ Text retrieval test failed:', error);
        return false;
    }
}

// Test 5: Global Instance Check
function testGlobalInstances() {
    console.log('Test 5: Global Instance Check');
    
    try {
        console.log('window.AppState exists:', !!window.AppState);
        console.log('window.LanguageManager exists:', !!window.LanguageManager);
        
        if (window.AppState) {
            console.log('AppState debug info:', window.AppState.getDebugInfo());
        }
        
        if (window.LanguageManager) {
            console.log('LanguageManager debug info:', window.LanguageManager.getDebugInfo());
            console.log('LanguageManager methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(window.LanguageManager)));
        }
        
        console.log('✅ Global instance check completed');
        return true;
    } catch (error) {
        console.error('❌ Global instance check failed:', error);
        return false;
    }
}

// Run all tests
function runAllTests() {
    console.log('🚀 Starting all tests...');
    
    const results = [
        testAppStateManager(),
        testLanguageManager(),
        testLanguageSwitching(),
        testTextRetrieval(),
        testGlobalInstances()
    ];
    
    const passed = results.filter(r => r).length;
    const total = results.length;
    
    console.log(`📊 Test Results: ${passed}/${total} tests passed`);
    
    if (passed === total) {
        console.log('🎉 All tests passed!');
    } else {
        console.log('⚠️ Some tests failed. Check the logs above.');
    }
    
    return passed === total;
}

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.testStateManagement = {
        runAllTests,
        testAppStateManager,
        testLanguageManager,
        testLanguageSwitching,
        testTextRetrieval,
        testGlobalInstances
    };
}

// Auto-run tests if this script is loaded directly
if (typeof window !== 'undefined' && document.readyState !== 'loading') {
    setTimeout(runAllTests, 1000);
} else if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(runAllTests, 1000);
    });
}