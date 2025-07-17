// Quick fix for LanguageManager references
// This script will replace all incorrect LanguageManager references with window.LanguageManager

// Run this in browser console to fix the references
function fixLanguageManagerReferences() {
    // Fix the debug info call
    try {
        if (window.LanguageManager && typeof window.LanguageManager.getDebugInfo === 'function') {
            console.log('Language Manager Debug Info:', window.LanguageManager.getDebugInfo());
        }
    } catch (error) {
        console.error('Error getting LanguageManager debug info:', error);
    }
    
    // Fix UI update call
    try {
        if (window.LanguageManager && typeof window.LanguageManager.updateUI === 'function') {
            window.LanguageManager.updateUI();
        }
    } catch (error) {
        console.error('Error updating UI:', error);
    }
    
    // Re-initialize language system with correct references
    const languageButtons = document.querySelectorAll('.language-btn');
    
    languageButtons.forEach((button, index) => {
        // Remove existing listeners
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // Add new listener with correct references
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
                console.error('LanguageManager methods not available');
            }
        });
    });
    
    console.log('✅ Language manager references fixed!');
}

// Auto-run the fix
if (typeof window !== 'undefined') {
    fixLanguageManagerReferences();
}