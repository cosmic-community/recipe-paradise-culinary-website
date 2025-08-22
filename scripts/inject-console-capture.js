const fs = require('fs');
const path = require('path');

// Script to inject console capture into HTML files after build
function injectConsoleCapture() {
  const buildDir = path.join(process.cwd(), '.next');
  
  // Check if build directory exists
  if (!fs.existsSync(buildDir)) {
    console.log('Build directory not found. Skipping console capture injection.');
    return;
  }
  
  const consoleScript = '<script src="/dashboard-console-capture.js"></script>';
  const injectComment = '<!-- Console capture script for dashboard debugging -->';
  
  function processHtmlFiles(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        processHtmlFiles(filePath);
      } else if (file.endsWith('.html')) {
        try {
          let content = fs.readFileSync(filePath, 'utf8');
          
          // Only inject if not already present
          if (!content.includes('dashboard-console-capture.js')) {
            // Try to inject before closing head tag
            if (content.includes('</head>')) {
              content = content.replace('</head>', `  ${injectComment}\n  ${consoleScript}\n</head>`);
            } else if (content.includes('<head>')) {
              // If no closing head tag, inject after opening head tag
              content = content.replace('<head>', `<head>\n  ${injectComment}\n  ${consoleScript}`);
            } else {
              // Last resort: inject at the beginning of the document
              content = `${injectComment}\n${consoleScript}\n${content}`;
            }
            
            fs.writeFileSync(filePath, content);
            console.log(`✓ Injected console capture into: ${filePath}`);
          }
        } catch (error) {
          console.warn(`⚠ Could not process ${filePath}:`, error.message);
        }
      }
    });
  }
  
  try {
    processHtmlFiles(buildDir);
    console.log('✓ Console capture injection completed');
  } catch (error) {
    console.error('✗ Error during console capture injection:', error);
  }
}

// Run the injection
if (require.main === module) {
  injectConsoleCapture();
}

module.exports = injectConsoleCapture;