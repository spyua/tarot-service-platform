// Immediate fix for LanguageManager reference errors
console.log('🔧 Applying immediate LanguageManager fix...');

// Wait for DOM to be ready
function applyImmediateFix() {
    try {
        // Check if LanguageManager exists
        if (!window.LanguageManager) {
            console.error('❌ LanguageManager not found on window object');
            return;
        }
        
        console.log('✅ LanguageManager found, applying fixes...');
        
        // Fix 1: Re-initialize language buttons with correct references
        const languageButtons = document.querySelectorAll('.language-btn');
        console.log(`Found ${languageButtons.length} language buttons`);
        
        languageButtons.forEach((button, index) => {
            // Remove existing event listeners by cloning the button
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            
            // Add corrected event listener
            newButton.addEventListener('click', function(event) {
                event.preventDefault();
                console.log('🔥 Button clicked!', this.getAttribute('data-lang'));
                
                const selectedLanguage = this.getAttribute('data-lang');
                console.log('Selected language:', selectedLanguage);
                console.log('LanguageManager exists:', !!window.LanguageManager);
                
                if (window.LanguageManager && typeof window.LanguageManager.isValidLanguage === 'function') {
                    console.log('isValidLanguage check:', window.LanguageManager.isValidLanguage(selectedLanguage));
                    
                    if (selectedLanguage && window.LanguageManager.isValidLanguage(selectedLanguage)) {
                        console.log('Attempting to set language...');
                        const success = window.LanguageManager.setLanguage(selectedLanguage);
                        console.log('Set language result:', success);
                        
                        if (success) {
                            console.info(`✅ Language switched to: ${selectedLanguage}`);
                        } else {
                            console.error(`❌ Failed to switch language to: ${selectedLanguage}`);
                        }
                    } else {
                        console.error(`❌ Invalid language code: ${selectedLanguage}`);
                    }
                } else {
                    console.error('❌ LanguageManager methods not available');
                }
            });
            
            // Add keyboard support
            newButton.addEventListener('keydown', function(event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    this.click();
                }
            });
            
            console.log(`✅ Fixed button ${index + 1}: ${newButton.getAttribute('data-lang')}`);
        });
        
        // Fix 2: Update UI immediately
        if (window.LanguageManager && typeof window.LanguageManager.updateUI === 'function') {
            window.LanguageManager.updateUI();
            console.log('✅ UI updated');
        }
        
        // Fix 3: Set initial language correctly
        if (window.AppState && window.LanguageManager) {
            const currentLanguage = window.AppState.getState().currentLanguage;
            if (currentLanguage && window.LanguageManager.isValidLanguage(currentLanguage)) {
                window.LanguageManager.setLanguage(currentLanguage);
                console.log(`✅ Set initial language to: ${currentLanguage}`);
            } else {
                window.LanguageManager.setLanguage('en');
                console.log('✅ Set fallback language to: en');
            }
        }
        
        // Fix 4: Override any remaining incorrect references
        window.LanguageManager_updateUI = function() {
            if (window.LanguageManager && typeof window.LanguageManager.updateUI === 'function') {
                return window.LanguageManager.updateUI();
            }
        };
        
        console.log('🎉 All fixes applied successfully!');
        
        // Test the fix
        setTimeout(() => {
            console.log('🧪 Testing language switch...');
            const currentLang = window.LanguageManager.getCurrentLanguage();
            const testLang = currentLang === 'en' ? 'zh-TW' : 'en';
            const success = window.LanguageManager.setLanguage(testLang);
            console.log(`Test result: ${success ? '✅ PASS' : '❌ FAIL'}`);
            
            // Switch back
            window.LanguageManager.setLanguage(currentLang);
        }, 1000);
        
    } catch (error) {
        console.error('❌ Error applying immediate fix:', error);
    }
}

// Apply fix when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyImmediateFix);
} else {
    applyImmediateFix();
}

// Also apply fix after a short delay to catch any late initialization
setTimeout(applyImmediateFix, 500);