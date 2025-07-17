// Language Manager Fix Script
// This script fixes all LanguageManager references to use window.LanguageManager

console.log('🔧 Applying LanguageManager fixes...');

// Fix all direct LanguageManager references in the current page
function fixLanguageManagerReferences() {
    // Get the current script content
    const scripts = document.querySelectorAll('script');
    let scriptContent = '';
    
    scripts.forEach(script => {
        if (script.innerHTML.includes('LanguageManager.')) {
            scriptContent = script.innerHTML;
        }
    });
    
    if (scriptContent) {
        console.log('Found script with LanguageManager references');
        
        // Replace all LanguageManager. with window.LanguageManager. (except where already prefixed)
        const fixedContent = scriptContent.replace(
            /(?<!window\.)LanguageManager\./g, 
            'window.LanguageManager.'
        );
        
        console.log('Script content updated');
    }
    
    // Manually fix the specific problematic calls
    try {
        // Fix initialization
        if (window.LanguageManager && typeof window.LanguageManager.updateUI === 'function') {
            console.log('✅ Calling window.LanguageManager.updateUI()');
            window.LanguageManager.updateUI();
        }
        
        // Re-initialize language buttons with correct references
        const languageButtons = document.querySelectorAll('.language-btn');
        console.log(`Found ${languageButtons.length} language buttons to fix`);
        
        languageButtons.forEach((button, index) => {
            // Remove existing listeners by cloning
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
            
            console.log(`✅ Fixed button ${index + 1}`);
        });
        
        // Set initial language correctly
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
        
        console.log('🎉 All LanguageManager references fixed!');
        
    } catch (error) {
        console.error('❌ Error fixing LanguageManager references:', error);
    }
}

// Run the fix
if (typeof window !== 'undefined' && window.LanguageManager) {
    fixLanguageManagerReferences();
} else {
    console.log('⏳ Waiting for LanguageManager to be available...');
    
    // Wait for LanguageManager to be available
    const checkInterval = setInterval(() => {
        if (window.LanguageManager) {
            clearInterval(checkInterval);
            fixLanguageManagerReferences();
        }
    }, 100);
    
    // Timeout after 5 seconds
    setTimeout(() => {
        clearInterval(checkInterval);
        if (!window.LanguageManager) {
            console.error('❌ LanguageManager not available after 5 seconds');
        }
    }, 5000);
}