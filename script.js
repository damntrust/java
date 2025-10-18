// Global variables for charts
let sipChart, lumpsumChart, swpChart, stpChart, goalChart;

// Initialize the calculator
document.addEventListener('DOMContentLoaded', function() {
    initializeCalculator();
    setupEventListeners();
    calculateSIP(); // Calculate default SIP values
});

function initializeCalculator() {
    // Setup calculator type switching
    const calcButtons = document.querySelectorAll('.calc-btn');
    const calcSections = document.querySelectorAll('.calculator-section');

    calcButtons.forEach(button => {
        button.addEventListener('click', () => {
            const calcType = button.dataset.calc;
            
            // Update active button
            calcButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update active section
            calcSections.forEach(section => section.classList.remove('active'));
            document.getElementById(`${calcType}-calculator`).classList.add('active');
            
            // Calculate default values for the selected calculator
            switch(calcType) {
                case 'sip':
                    calculateSIP();
                    break;
                case 'lumpsum':
                    calculateLumpsum();
                    break;
                case 'swp':
                    calculateSWP();
                    break;
                case 'stp':
                    calculateSTP();
                    break;
                case 'goal':
                    calculateGoal();
                    break;
            }
        });
    });
}

function setupEventListeners() {
    // SIP Calculator Event Listeners
    setupSliderSync('sip-amount', 'sip-amount-slider');
    setupSliderSync('sip-rate', 'sip-rate-slider');
    setupSliderSync('sip-period', 'sip-period-slider');
    
    // Lumpsum Calculator Event Listeners
    setupSliderSync('lumpsum-amount', 'lumpsum-amount-slider');
    setupSliderSync('lumpsum-rate', 'lumpsum-rate-slider');
    setupSliderSync('lumpsum-period', 'lumpsum-period-slider');
    
    // SWP Calculator Event Listeners
    setupSliderSync('swp-investment', 'swp-investment-slider');
    setupSliderSync('swp-withdrawal', 'swp-withdrawal-slider');
    setupSliderSync('swp-rate', 'swp-rate-slider');
    setupSliderSync('swp-period', 'swp-period-slider');
    
    // STP Calculator Event Listeners
    setupSliderSync('stp-investment', 'stp-investment-slider');
    setupSliderSync('stp-transfer', 'stp-transfer-slider');
    setupSliderSync('stp-source-rate', 'stp-source-rate-slider');
    setupSliderSync('stp-target-rate', 'stp-target-rate-slider');
    setupSliderSync('stp-period', 'stp-period-slider');
    
    // Goal Calculator Event Listeners
    setupSliderSync('goal-amount', 'goal-amount-slider');
    setupSliderSync('goal-period', 'goal-period-slider');
    setupSliderSync('goal-rate', 'goal-rate-slider');
    
    // Add input event listeners for real-time calculation
    addRealTimeCalculation();
}

function setupSliderSync(inputId, sliderId) {
    const input = document.getElementById(inputId);
    const slider = document.getElementById(sliderId);
    
    if (!input || !slider) return;
    
    // Sync slider to input
    input.addEventListener('input', () => {
        const value = parseFloat(input.value) || 0;
        const min = parseFloat(slider.min);
        const max = parseFloat(slider.max);
        
        if (value >= min && value <= max) {
            slider.value = value;
        }
        
        // Trigger calculation based on calculator type
        triggerCalculation(inputId);
    });
    
    // Sync input to slider
    slider.addEventListener('input', () => {
        input.value = slider.value;
        triggerCalculation(inputId);
    });
}

function addRealTimeCalculation() {
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            triggerCalculation(input.id);
        });
    });
}

function triggerCalculation(inputId) {
    // Debounce calculations to avoid excessive calls
    clearTimeout(window.calculationTimeout);
    window.calculationTimeout = setTimeout(() => {
        if (inputId.includes('sip')) {
            calculateSIP();
        } else if (inputId.includes('lumpsum')) {
            calculateLumpsum();
        } else if (inputId.includes('swp')) {
            calculateSWP();
        } else if (inputId.includes('stp')) {
            calculateSTP();
        } else if (inputId.includes('goal')) {
            calculateGoal();
        }
    }, 300);
}

// SIP Calculator Functions
function calculateSIP() {
    const monthlyAmount = parseFloat(document.getElementById('sip-amount').value) || 0;
    const annualRate = parseFloat(document.getElementById('sip-rate').value) || 0;
    const years = parseFloat(document.getElementById('sip-period').value) || 0;
    
    const monthlyRate = annualRate / 100 / 12;
    const months = years * 12;
    
    // SIP Future Value Formula: FV = PMT * [((1 + r)^n - 1) / r] * (1 + r)
    let maturityAmount = 0;
    if (monthlyRate > 0) {
        maturityAmount = monthlyAmount * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate * (1 + monthlyRate);
    } else {
        maturityAmount = monthlyAmount * months;
    }
    
    const totalInvestment = monthlyAmount * months;
    const returns = maturityAmount - totalInvestment;
    
    // Update display
    document.getElementById('sip-total-investment').textContent = formatCurrency(totalInvestment);
    document.getElementById('sip-returns').textContent = formatCurrency(returns);
    document.getElementById('sip-maturity').textContent = formatCurrency(maturityAmount);
    
    // Update chart
    updateSIPChart(totalInvestment, returns);
}

function resetSIP() {
    document.getElementById('sip-amount').value = 5000;
    document.getElementById('sip-rate').value = 12;
    document.getElementById('sip-period').value = 10;
    document.getElementById('sip-amount-slider').value = 5000;
    document.getElementById('sip-rate-slider').value = 12;
    document.getElementById('sip-period-slider').value = 10;
    calculateSIP();
}

// Lumpsum Calculator Functions
function calculateLumpsum() {
    const principal = parseFloat(document.getElementById('lumpsum-amount').value) || 0;
    const annualRate = parseFloat(document.getElementById('lumpsum-rate').value) || 0;
    const years = parseFloat(document.getElementById('lumpsum-period').value) || 0;
    
    // Compound Interest Formula: A = P(1 + r/n)^(nt)
    const maturityAmount = principal * Math.pow(1 + annualRate / 100, years);
    const returns = maturityAmount - principal;
    
    // Update display
    document.getElementById('lumpsum-principal').textContent = formatCurrency(principal);
    document.getElementById('lumpsum-returns').textContent = formatCurrency(returns);
    document.getElementById('lumpsum-maturity').textContent = formatCurrency(maturityAmount);
    
    // Update chart
    updateLumpsumChart(principal, returns);
}

function resetLumpsum() {
    document.getElementById('lumpsum-amount').value = 100000;
    document.getElementById('lumpsum-rate').value = 12;
    document.getElementById('lumpsum-period').value = 10;
    document.getElementById('lumpsum-amount-slider').value = 100000;
    document.getElementById('lumpsum-rate-slider').value = 12;
    document.getElementById('lumpsum-period-slider').value = 10;
    calculateLumpsum();
}

// SWP Calculator Functions
function calculateSWP() {
    const initialInvestment = parseFloat(document.getElementById('swp-investment').value) || 0;
    const monthlyWithdrawal = parseFloat(document.getElementById('swp-withdrawal').value) || 0;
    const annualRate = parseFloat(document.getElementById('swp-rate').value) || 0;
    const years = parseFloat(document.getElementById('swp-period').value) || 0;
    
    const monthlyRate = annualRate / 100 / 12;
    const months = years * 12;
    
    let balance = initialInvestment;
    let totalWithdrawn = 0;
    
    // Simulate month by month
    for (let i = 0; i < months; i++) {
        balance = balance * (1 + monthlyRate) - monthlyWithdrawal;
        totalWithdrawn += monthlyWithdrawal;
        
        if (balance < 0) {
            balance = 0;
            break;
        }
    }
    
    // Update display
    document.getElementById('swp-initial').textContent = formatCurrency(initialInvestment);
    document.getElementById('swp-total-withdrawal').textContent = formatCurrency(totalWithdrawn);
    document.getElementById('swp-final-value').textContent = formatCurrency(Math.max(0, balance));
    
    // Update chart
    updateSWPChart(initialInvestment, totalWithdrawn, balance);
}

function resetSWP() {
    document.getElementById('swp-investment').value = 500000;
    document.getElementById('swp-withdrawal').value = 5000;
    document.getElementById('swp-rate').value = 12;
    document.getElementById('swp-period').value = 10;
    document.getElementById('swp-investment-slider').value = 500000;
    document.getElementById('swp-withdrawal-slider').value = 5000;
    document.getElementById('swp-rate-slider').value = 12;
    document.getElementById('swp-period-slider').value = 10;
    calculateSWP();
}

// STP Calculator Functions
function calculateSTP() {
    const initialInvestment = parseFloat(document.getElementById('stp-investment').value) || 0;
    const monthlyTransfer = parseFloat(document.getElementById('stp-transfer').value) || 0;
    const sourceRate = parseFloat(document.getElementById('stp-source-rate').value) || 0;
    const targetRate = parseFloat(document.getElementById('stp-target-rate').value) || 0;
    const years = parseFloat(document.getElementById('stp-period').value) || 0;
    
    const sourceMonthlyRate = sourceRate / 100 / 12;
    const targetMonthlyRate = targetRate / 100 / 12;
    const months = years * 12;
    
    let sourceBalance = initialInvestment;
    let targetBalance = 0;
    
    // Simulate month by month transfers
    for (let i = 0; i < months; i++) {
        // Grow source fund
        sourceBalance = sourceBalance * (1 + sourceMonthlyRate);
        
        // Transfer amount
        if (sourceBalance >= monthlyTransfer) {
            sourceBalance -= monthlyTransfer;
            targetBalance += monthlyTransfer;
        }
        
        // Grow target fund
        targetBalance = targetBalance * (1 + targetMonthlyRate);
    }
    
    // Continue growing source fund for remaining period
    const remainingYears = Math.max(0, 10 - years); // Assume 10 year total period
    sourceBalance = sourceBalance * Math.pow(1 + sourceRate / 100, remainingYears);
    
    const totalValue = sourceBalance + targetBalance;
    
    // Update display
    document.getElementById('stp-source-value').textContent = formatCurrency(sourceBalance);
    document.getElementById('stp-target-value').textContent = formatCurrency(targetBalance);
    document.getElementById('stp-total-value').textContent = formatCurrency(totalValue);
    
    // Update chart
    updateSTPChart(sourceBalance, targetBalance);
}

function resetSTP() {
    document.getElementById('stp-investment').value = 500000;
    document.getElementById('stp-transfer').value = 10000;
    document.getElementById('stp-source-rate').value = 8;
    document.getElementById('stp-target-rate').value = 12;
    document.getElementById('stp-period').value = 5;
    document.getElementById('stp-investment-slider').value = 500000;
    document.getElementById('stp-transfer-slider').value = 10000;
    document.getElementById('stp-source-rate-slider').value = 8;
    document.getElementById('stp-target-rate-slider').value = 12;
    document.getElementById('stp-period-slider').value = 5;
    calculateSTP();
}

// Goal Calculator Functions
function calculateGoal() {
    const targetAmount = parseFloat(document.getElementById('goal-amount').value) || 0;
    const years = parseFloat(document.getElementById('goal-period').value) || 0;
    const annualRate = parseFloat(document.getElementById('goal-rate').value) || 0;
    
    const monthlyRate = annualRate / 100 / 12;
    const months = years * 12;
    
    // Calculate required monthly SIP
    let monthlySIP = 0;
    if (monthlyRate > 0) {
        monthlySIP = targetAmount * monthlyRate / (Math.pow(1 + monthlyRate, months) - 1) / (1 + monthlyRate);
    } else {
        monthlySIP = targetAmount / months;
    }
    
    // Calculate required lumpsum
    const requiredLumpsum = targetAmount / Math.pow(1 + annualRate / 100, years);
    
    // Update display
    document.getElementById('goal-target').textContent = formatCurrency(targetAmount);
    document.getElementById('goal-monthly-sip').textContent = formatCurrency(monthlySIP);
    document.getElementById('goal-lumpsum').textContent = formatCurrency(requiredLumpsum);
    
    // Update chart
    updateGoalChart(monthlySIP * months, targetAmount - (monthlySIP * months));
}

function resetGoal() {
    document.getElementById('goal-amount').value = 1000000;
    document.getElementById('goal-period').value = 10;
    document.getElementById('goal-rate').value = 12;
    document.getElementById('goal-amount-slider').value = 1000000;
    document.getElementById('goal-period-slider').value = 10;
    document.getElementById('goal-rate-slider').value = 12;
    calculateGoal();
}

// Chart Functions
function updateSIPChart(investment, returns) {
    const ctx = document.getElementById('sip-chart').getContext('2d');
    
    if (sipChart) {
        sipChart.destroy();
    }
    
    sipChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Total Investment', 'Expected Returns'],
            datasets: [{
                data: [investment, returns],
                backgroundColor: ['#3b82f6', '#1e40af'],
                borderWidth: 0,
                cutout: '60%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                }
            }
        }
    });
}

function updateLumpsumChart(principal, returns) {
    const ctx = document.getElementById('lumpsum-chart').getContext('2d');
    
    if (lumpsumChart) {
        lumpsumChart.destroy();
    }
    
    lumpsumChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Principal Amount', 'Expected Returns'],
            datasets: [{
                data: [principal, returns],
                backgroundColor: ['#3b82f6', '#1e40af'],
                borderWidth: 0,
                cutout: '60%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                }
            }
        }
    });
}

function updateSWPChart(initial, withdrawn, remaining) {
    const ctx = document.getElementById('swp-chart').getContext('2d');
    
    if (swpChart) {
        swpChart.destroy();
    }
    
    swpChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Total Withdrawn', 'Remaining Value'],
            datasets: [{
                data: [withdrawn, Math.max(0, remaining)],
                backgroundColor: ['#1e40af', '#3b82f6'],
                borderWidth: 0,
                cutout: '60%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                }
            }
        }
    });
}

function updateSTPChart(sourceValue, targetValue) {
    const ctx = document.getElementById('stp-chart').getContext('2d');
    
    if (stpChart) {
        stpChart.destroy();
    }
    
    stpChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Source Fund', 'Target Fund'],
            datasets: [{
                data: [sourceValue, targetValue],
                backgroundColor: ['#3b82f6', '#1e40af'],
                borderWidth: 0,
                cutout: '60%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                }
            }
        }
    });
}

function updateGoalChart(investment, returns) {
    const ctx = document.getElementById('goal-chart').getContext('2d');
    
    if (goalChart) {
        goalChart.destroy();
    }
    
    goalChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Total Investment', 'Expected Returns'],
            datasets: [{
                data: [investment, returns],
                backgroundColor: ['#3b82f6', '#1e40af'],
                borderWidth: 0,
                cutout: '60%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                }
            }
        }
    });
}

// Utility Functions
function formatCurrency(amount) {
    if (amount >= 10000000) {
        return '₹' + (amount / 10000000).toFixed(2) + ' Cr';
    } else if (amount >= 100000) {
        return '₹' + (amount / 100000).toFixed(2) + ' L';
    } else if (amount >= 1000) {
        return '₹' + (amount / 1000).toFixed(2) + ' K';
    } else {
        return '₹' + Math.round(amount).toLocaleString('en-IN');
    }
}

function addButtonClickEffect(button) {
    button.classList.add('calculating');
    setTimeout(() => {
        button.classList.remove('calculating');
    }, 1000);
}

// Add click effects to calculate buttons
document.addEventListener('DOMContentLoaded', function() {
    const calculateButtons = document.querySelectorAll('.calculate-btn');
    calculateButtons.forEach(button => {
        button.addEventListener('click', () => {
            addButtonClickEffect(button);
        });
    });
});

// Advanced Features

// Export functionality
function exportResults(calculatorType) {
    const results = getCalculatorResults(calculatorType);
    const csvContent = convertToCSV(results);
    downloadCSV(csvContent, `${calculatorType}-calculator-results.csv`);
}

function getCalculatorResults(type) {
    switch(type) {
        case 'sip':
            return {
                'Calculator Type': 'SIP Calculator',
                'Monthly Investment': document.getElementById('sip-amount').value,
                'Annual Return Rate': document.getElementById('sip-rate').value + '%',
                'Investment Period': document.getElementById('sip-period').value + ' years',
                'Total Investment': document.getElementById('sip-total-investment').textContent,
                'Expected Returns': document.getElementById('sip-returns').textContent,
                'Maturity Amount': document.getElementById('sip-maturity').textContent
            };
        // Add other calculator types as needed
        default:
            return {};
    }
}

function convertToCSV(data) {
    const headers = Object.keys(data).join(',');
    const values = Object.values(data).join(',');
    return headers + '\n' + values;
}

function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

// Print functionality
function printResults() {
    window.print();
}

// Share functionality
function shareResults(calculatorType) {
    const results = getCalculatorResults(calculatorType);
    const text = Object.entries(results)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');
    
    if (navigator.share) {
        navigator.share({
            title: 'Mutual Fund Calculator Results',
            text: text
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(text).then(() => {
            alert('Results copied to clipboard!');
        });
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case 'Enter':
                e.preventDefault();
                const activeSection = document.querySelector('.calculator-section.active');
                const calculateBtn = activeSection.querySelector('.calculate-btn');
                calculateBtn.click();
                break;
            case 'r':
                e.preventDefault();
                const resetBtn = document.querySelector('.calculator-section.active .reset-btn');
                resetBtn.click();
                break;
        }
    }
});

// Accessibility improvements
function announceResult(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Error handling
function handleCalculationError(error, calculatorType) {
    console.error(`Error in ${calculatorType} calculator:`, error);
    
    // Show user-friendly error message
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = 'An error occurred during calculation. Please check your inputs and try again.';
    
    const activeSection = document.querySelector('.calculator-section.active');
    activeSection.insertBefore(errorMessage, activeSection.firstChild);
    
    setTimeout(() => {
        errorMessage.remove();
    }, 5000);
}

// Input validation
function validateInput(value, min, max, fieldName) {
    if (isNaN(value) || value < min || value > max) {
        throw new Error(`${fieldName} must be between ${min} and ${max}`);
    }
    return true;
}

// Local storage for saving preferences
function saveCalculatorState(calculatorType, values) {
    const state = {
        type: calculatorType,
        values: values,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('mf-calculator-state', JSON.stringify(state));
}

function loadCalculatorState() {
    const saved = localStorage.getItem('mf-calculator-state');
    if (saved) {
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error('Error loading saved state:', e);
        }
    }
    return null;
}

// Initialize saved state on load
document.addEventListener('DOMContentLoaded', function() {
    const savedState = loadCalculatorState();
    if (savedState && savedState.values) {
        // Restore saved values
        Object.entries(savedState.values).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.value = value;
            }
        });
    }
});