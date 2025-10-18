# Mutual Fund Calculator for Zoho Snippets

A comprehensive mutual fund calculator with a dark blue and white theme, designed specifically for integration with Zoho snippets. This calculator includes all major mutual fund calculation types with interactive charts and real-time calculations.

## Features

### 🧮 Calculator Types
- **SIP Calculator** - Systematic Investment Plan calculations
- **Lumpsum Calculator** - One-time investment calculations  
- **SWP Calculator** - Systematic Withdrawal Plan calculations
- **STP Calculator** - Systematic Transfer Plan calculations
- **Goal Calculator** - Target-based investment planning

### 🎨 Design Features
- **Dark Blue & White Theme** - Professional color scheme with emphasis on white backgrounds
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- **Interactive Sliders** - Real-time input adjustment with visual feedback
- **Dynamic Charts** - Beautiful doughnut charts showing investment breakdown
- **Smooth Animations** - Enhanced user experience with CSS transitions

### ⚡ Functionality
- **Real-time Calculations** - Updates results as you type
- **Input Validation** - Ensures accurate calculations with proper ranges
- **Currency Formatting** - Indian Rupee formatting with K, L, Cr notations
- **Reset Functions** - Quick reset to default values for each calculator
- **Keyboard Shortcuts** - Ctrl+Enter to calculate, Ctrl+R to reset

## Files Included

1. **`zoho-mutual-fund-calculator.html`** - Single-file version optimized for Zoho snippets
2. **`mutual-fund-calculator.html`** - Main HTML structure (separate files version)
3. **`styles.css`** - CSS styling with dark blue and white theme
4. **`script.js`** - JavaScript functionality and calculations

## Zoho Integration Instructions

### Option 1: Single File Integration (Recommended)
Use the `zoho-mutual-fund-calculator.html` file which contains everything in one file:

1. Copy the entire content of `zoho-mutual-fund-calculator.html`
2. Create a new snippet in Zoho
3. Paste the content as HTML
4. Save and publish

### Option 2: Separate Files Integration
If you prefer to keep files separate:

1. Upload `styles.css` and `script.js` to your Zoho file manager
2. Update the file paths in `mutual-fund-calculator.html` to point to your uploaded files
3. Copy the HTML content to your Zoho snippet

## Calculator Formulas

### SIP Calculator
```
Future Value = PMT × [((1 + r)^n - 1) / r] × (1 + r)
```
Where:
- PMT = Monthly investment amount
- r = Monthly interest rate (Annual rate / 12)
- n = Total number of months

### Lumpsum Calculator
```
Maturity Amount = Principal × (1 + Annual Rate)^Years
```

### SWP Calculator
Simulates month-by-month withdrawals with compound growth on remaining balance.

### STP Calculator
Simulates systematic transfers between two funds with different return rates.

### Goal Calculator
```
Required Monthly SIP = Target Amount × r / [(1 + r)^n - 1] / (1 + r)
Required Lumpsum = Target Amount / (1 + Annual Rate)^Years
```

## Customization Options

### Color Theme
The calculator uses a dark blue and white theme. To customize colors, modify these CSS variables:

```css
/* Primary Colors */
--primary-blue: #1e40af;
--secondary-blue: #3b82f6;
--background-white: #ffffff;
--light-gray: #f8fafc;
```

### Input Ranges
Adjust the min/max values for inputs by modifying the HTML attributes:

```html
<input type="number" id="sip-amount" value="5000" min="500" max="1000000">
<input type="range" id="sip-amount-slider" min="500" max="100000" value="5000">
```

### Default Values
Change default calculator values by modifying the `value` attributes in the HTML.

## Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## Dependencies

The calculator uses these external libraries (loaded via CDN):
- **Chart.js** - For interactive charts
- **Font Awesome** - For icons
- **Google Fonts (Inter)** - For typography

All dependencies are loaded from reliable CDNs and don't require local installation.

## Performance Features

- **Debounced Calculations** - Prevents excessive calculations during rapid input changes
- **Optimized Chart Updates** - Charts are destroyed and recreated only when necessary
- **Lazy Loading** - Charts are only created when their respective calculator is active

## Accessibility Features

- **Keyboard Navigation** - Full keyboard support
- **Screen Reader Compatible** - Proper ARIA labels and semantic HTML
- **High Contrast** - Meets WCAG accessibility guidelines
- **Mobile Friendly** - Touch-optimized interface

## Support

For any issues or customization requests, please refer to the code comments or modify the calculator according to your specific needs.

## License

This calculator is provided as-is for integration with Zoho snippets. Feel free to modify and customize according to your requirements.

---

**Note**: The calculations are based on assumed rates of return and are for illustration purposes only. Mutual fund investments are subject to market risks. Please read all scheme-related documents carefully before investing.