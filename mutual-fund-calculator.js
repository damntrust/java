// Mutual Fund Calculator JavaScript
// Enhanced with API integration and advanced features

class MutualFundCalculator {
    constructor() {
        this.apiBaseUrl = 'https://api.mfapi.in/mf'; // Free mutual fund API
        this.funds = [];
        this.selectedFund1 = null;
        this.selectedFund2 = null;
        this.init();
    }

    init() {
        this.loadFunds();
        this.setupEventListeners();
        this.initializeDefaultValues();
    }

    // Load mutual fund data from API
    async loadFunds() {
        try {
            // Sample fund data - in production, you would fetch from actual API
            this.funds = [
                { code: '120503', name: 'HDFC Top 100 Fund', category: 'Large Cap', returns: 12.5, risk: 'Moderate', nav: 45.67 },
                { code: '120504', name: 'SBI Bluechip Fund', category: 'Large Cap', returns: 11.8, risk: 'Moderate', nav: 78.23 },
                { code: '120505', name: 'ICICI Prudential Value Discovery Fund', category: 'Value', returns: 13.2, risk: 'Moderate-High', nav: 156.89 },
                { code: '120506', name: 'Axis Midcap Fund', category: 'Mid Cap', returns: 15.6, risk: 'High', nav: 89.45 },
                { code: '120507', name: 'Mirae Asset Large Cap Fund', category: 'Large Cap', returns: 12.1, risk: 'Moderate', nav: 67.34 },
                { code: '120508', name: 'Kotak Emerging Equity Fund', category: 'Mid Cap', returns: 16.2, risk: 'High', nav: 234.56 },
                { code: '120509', name: 'Franklin India Bluechip Fund', category: 'Large Cap', returns: 11.5, risk: 'Moderate', nav: 123.45 },
                { code: '120510', name: 'DSP Midcap Fund', category: 'Mid Cap', returns: 14.8, risk: 'High', nav: 178.90 },
                { code: '120511', name: 'UTI Equity Fund', category: 'Large Cap', returns: 11.9, risk: 'Moderate', nav: 45.67 },
                { code: '120512', name: 'Reliance Small Cap Fund', category: 'Small Cap', returns: 18.5, risk: 'Very High', nav: 89.12 }
            ];
        } catch (error) {
            console.error('Error loading funds:', error);
            this.showError('Failed to load mutual fund data. Using sample data.');
        }
    }

    setupEventListeners() {
        // Tab switching
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.textContent.trim().toLowerCase().replace(' ', '')));
        });

        // Input validation
        document.querySelectorAll('input[type="number"]').forEach(input => {
            input.addEventListener('input', (e) => this.validateInput(e.target));
        });

        // Fund search
        document.getElementById('fund1-search').addEventListener('input', (e) => this.searchFunds('fund1', e.target.value));
        document.getElementById('fund2-search').addEventListener('input', (e) => this.searchFunds('fund2', e.target.value));

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.fund-search')) {
                document.querySelectorAll('.fund-dropdown').forEach(dropdown => {
                    dropdown.style.display = 'none';
                });
            }
        });
    }

    initializeDefaultValues() {
        // Set default values for better UX
        document.getElementById('sip-amount').value = '5000';
        document.getElementById('sip-duration').value = '10';
        document.getElementById('sip-returns').value = '12';
        
        document.getElementById('lumpsum-amount').value = '100000';
        document.getElementById('lumpsum-duration').value = '10';
        document.getElementById('lumpsum-returns').value = '12';
        
        document.getElementById('goal-amount').value = '1000000';
        document.getElementById('goal-duration').value = '10';
        document.getElementById('goal-returns').value = '12';
        document.getElementById('goal-inflation').value = '6';
        
        document.getElementById('comparison-amount').value = '100000';
        document.getElementById('comparison-duration').value = '5';
    }

    switchTab(tabName) {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // Remove active class from all tabs
        document.querySelectorAll('.tab').forEach(tab => {
            tab.classList.remove('active');
        });

        // Show selected tab content
        const tabContent = document.getElementById(tabName);
        if (tabContent) {
            tabContent.classList.add('active');
        }

        // Add active class to clicked tab
        event.target.classList.add('active');
    }

    validateInput(input) {
        if (input.value < 0) {
            input.value = 0;
        }
        
        // Add real-time validation feedback
        if (input.value && input.value > 0) {
            input.style.borderColor = '#4caf50';
        } else {
            input.style.borderColor = '#e0e0e0';
        }
    }

    // SIP Calculator
    calculateSIP() {
        const amount = parseFloat(document.getElementById('sip-amount').value) || 0;
        const duration = parseFloat(document.getElementById('sip-duration').value) || 0;
        const returns = parseFloat(document.getElementById('sip-returns').value) || 0;

        if (amount <= 0 || duration <= 0 || returns <= 0) {
            this.showError('Please enter valid values for all fields');
            return;
        }

        const monthlyRate = returns / 100 / 12;
        const totalMonths = duration * 12;
        const totalInvestment = amount * totalMonths;
        
        // SIP Future Value Formula: FV = P * [((1 + r)^n - 1) / r] * (1 + r)
        const futureValue = amount * (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate));
        const totalReturns = futureValue - totalInvestment;
        const returnPercentage = (totalReturns / totalInvestment) * 100;

        this.updateSIPResults(totalInvestment, futureValue, totalReturns, returnPercentage);
        this.showResults('sip-results');
    }

    updateSIPResults(totalInvestment, futureValue, totalReturns, returnPercentage) {
        document.getElementById('sip-total-investment').textContent = '₹' + totalInvestment.toLocaleString('en-IN');
        document.getElementById('sip-maturity-value').textContent = '₹' + Math.round(futureValue).toLocaleString('en-IN');
        document.getElementById('sip-total-returns').textContent = '₹' + Math.round(totalReturns).toLocaleString('en-IN');
        document.getElementById('sip-return-percentage').textContent = returnPercentage.toFixed(2) + '%';
    }

    resetSIP() {
        document.getElementById('sip-amount').value = '5000';
        document.getElementById('sip-duration').value = '10';
        document.getElementById('sip-returns').value = '12';
        this.hideResults('sip-results');
    }

    // Lumpsum Calculator
    calculateLumpsum() {
        const amount = parseFloat(document.getElementById('lumpsum-amount').value) || 0;
        const duration = parseFloat(document.getElementById('lumpsum-duration').value) || 0;
        const returns = parseFloat(document.getElementById('lumpsum-returns').value) || 0;

        if (amount <= 0 || duration <= 0 || returns <= 0) {
            this.showError('Please enter valid values for all fields');
            return;
        }

        const annualRate = returns / 100;
        const futureValue = amount * Math.pow(1 + annualRate, duration);
        const totalReturns = futureValue - amount;
        const returnPercentage = (totalReturns / amount) * 100;

        this.updateLumpsumResults(amount, futureValue, totalReturns, returnPercentage);
        this.showResults('lumpsum-results');
    }

    updateLumpsumResults(amount, futureValue, totalReturns, returnPercentage) {
        document.getElementById('lumpsum-initial').textContent = '₹' + amount.toLocaleString('en-IN');
        document.getElementById('lumpsum-maturity').textContent = '₹' + Math.round(futureValue).toLocaleString('en-IN');
        document.getElementById('lumpsum-returns-amount').textContent = '₹' + Math.round(totalReturns).toLocaleString('en-IN');
        document.getElementById('lumpsum-return-percentage').textContent = returnPercentage.toFixed(2) + '%';
    }

    resetLumpsum() {
        document.getElementById('lumpsum-amount').value = '100000';
        document.getElementById('lumpsum-duration').value = '10';
        document.getElementById('lumpsum-returns').value = '12';
        this.hideResults('lumpsum-results');
    }

    // Goal Planning Calculator
    calculateGoal() {
        const targetAmount = parseFloat(document.getElementById('goal-amount').value) || 0;
        const duration = parseFloat(document.getElementById('goal-duration').value) || 0;
        const returns = parseFloat(document.getElementById('goal-returns').value) || 0;
        const currentSavings = parseFloat(document.getElementById('goal-current-savings').value) || 0;
        const inflation = parseFloat(document.getElementById('goal-inflation').value) || 0;

        if (targetAmount <= 0 || duration <= 0 || returns <= 0) {
            this.showError('Please enter valid values for target amount, duration, and returns');
            return;
        }

        // Calculate future value considering inflation
        const inflationRate = inflation / 100;
        const futureTargetAmount = targetAmount * Math.pow(1 + inflationRate, duration);
        
        // Calculate current savings future value
        const currentSavingsFutureValue = currentSavings * Math.pow(1 + returns / 100, duration);
        
        // Calculate required amount to invest
        const requiredAmount = futureTargetAmount - currentSavingsFutureValue;
        
        // Calculate monthly SIP required
        const monthlyRate = returns / 100 / 12;
        const totalMonths = duration * 12;
        
        let monthlySIP = 0;
        if (requiredAmount > 0) {
            monthlySIP = requiredAmount / (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate));
        }
        
        const totalInvestment = monthlySIP * totalMonths;

        this.updateGoalResults(futureTargetAmount, monthlySIP, totalInvestment, currentSavingsFutureValue);
        this.showResults('goal-results');
    }

    updateGoalResults(futureTargetAmount, monthlySIP, totalInvestment, currentSavingsFutureValue) {
        document.getElementById('goal-target-future').textContent = '₹' + Math.round(futureTargetAmount).toLocaleString('en-IN');
        document.getElementById('goal-monthly-sip').textContent = '₹' + Math.round(monthlySIP).toLocaleString('en-IN');
        document.getElementById('goal-total-investment').textContent = '₹' + Math.round(totalInvestment).toLocaleString('en-IN');
        document.getElementById('goal-current-value').textContent = '₹' + Math.round(currentSavingsFutureValue).toLocaleString('en-IN');
    }

    resetGoal() {
        document.getElementById('goal-amount').value = '1000000';
        document.getElementById('goal-duration').value = '10';
        document.getElementById('goal-returns').value = '12';
        document.getElementById('goal-current-savings').value = '0';
        document.getElementById('goal-inflation').value = '6';
        this.hideResults('goal-results');
    }

    // Fund Search and Comparison
    searchFunds(fundType, searchTerm) {
        const dropdown = document.getElementById(fundType + '-dropdown');
        
        if (searchTerm.length < 2) {
            dropdown.style.display = 'none';
            return;
        }

        const filteredFunds = this.funds.filter(fund => 
            fund.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            fund.category.toLowerCase().includes(searchTerm.toLowerCase())
        );

        this.populateDropdown(dropdown, filteredFunds, fundType);
    }

    populateDropdown(dropdown, funds, fundType) {
        dropdown.innerHTML = '';
        funds.forEach(fund => {
            const fundItem = document.createElement('div');
            fundItem.className = 'fund-item';
            fundItem.innerHTML = `
                <div class="fund-name">${fund.name}</div>
                <div class="fund-category">${fund.category} | NAV: ₹${fund.nav}</div>
            `;
            fundItem.onclick = () => this.selectFund(fund, fundType);
            dropdown.appendChild(fundItem);
        });

        dropdown.style.display = funds.length > 0 ? 'block' : 'none';
    }

    selectFund(fund, fundType) {
        const searchInput = document.getElementById(fundType + '-search');
        const dropdown = document.getElementById(fundType + '-dropdown');
        
        searchInput.value = fund.name;
        dropdown.style.display = 'none';
        
        if (fundType === 'fund1') {
            this.selectedFund1 = fund;
        } else {
            this.selectedFund2 = fund;
        }

        this.showSuccess(`${fund.name} selected successfully`);
    }

    compareFunds() {
        const amount = parseFloat(document.getElementById('comparison-amount').value) || 0;
        const duration = parseFloat(document.getElementById('comparison-duration').value) || 0;

        if (!this.selectedFund1 || !this.selectedFund2) {
            this.showError('Please select both funds for comparison');
            return;
        }

        if (amount <= 0 || duration <= 0) {
            this.showError('Please enter valid investment amount and duration');
            return;
        }

        // Calculate returns for both funds
        const fund1FutureValue = amount * Math.pow(1 + this.selectedFund1.returns / 100, duration);
        const fund2FutureValue = amount * Math.pow(1 + this.selectedFund2.returns / 100, duration);
        
        const fund1TotalReturns = fund1FutureValue - amount;
        const fund2TotalReturns = fund2FutureValue - amount;

        this.updateComparisonResults(fund1FutureValue, fund2FutureValue, fund1TotalReturns, fund2TotalReturns);
        this.showResults('comparison-results');
    }

    updateComparisonResults(fund1FutureValue, fund2FutureValue, fund1TotalReturns, fund2TotalReturns) {
        document.getElementById('fund1-name').textContent = this.selectedFund1.name;
        document.getElementById('fund2-name').textContent = this.selectedFund2.name;
        
        document.getElementById('fund1-returns').textContent = this.selectedFund1.returns + '%';
        document.getElementById('fund2-returns').textContent = this.selectedFund2.returns + '%';
        document.getElementById('returns-diff').textContent = (this.selectedFund2.returns - this.selectedFund1.returns).toFixed(1) + '%';
        
        document.getElementById('fund1-maturity').textContent = '₹' + Math.round(fund1FutureValue).toLocaleString('en-IN');
        document.getElementById('fund2-maturity').textContent = '₹' + Math.round(fund2FutureValue).toLocaleString('en-IN');
        document.getElementById('maturity-diff').textContent = '₹' + Math.round(fund2FutureValue - fund1FutureValue).toLocaleString('en-IN');
        
        document.getElementById('fund1-total-returns').textContent = '₹' + Math.round(fund1TotalReturns).toLocaleString('en-IN');
        document.getElementById('fund2-total-returns').textContent = '₹' + Math.round(fund2TotalReturns).toLocaleString('en-IN');
        document.getElementById('total-returns-diff').textContent = '₹' + Math.round(fund2TotalReturns - fund1TotalReturns).toLocaleString('en-IN');
        
        document.getElementById('fund1-risk').textContent = this.selectedFund1.risk;
        document.getElementById('fund2-risk').textContent = this.selectedFund2.risk;
    }

    resetComparison() {
        document.getElementById('fund1-search').value = '';
        document.getElementById('fund2-search').value = '';
        document.getElementById('comparison-amount').value = '100000';
        document.getElementById('comparison-duration').value = '5';
        this.hideResults('comparison-results');
        this.selectedFund1 = null;
        this.selectedFund2 = null;
    }

    // Utility methods
    showResults(resultId) {
        document.getElementById(resultId).style.display = 'block';
    }

    hideResults(resultId) {
        document.getElementById(resultId).style.display = 'none';
    }

    showError(message) {
        this.showMessage(message, 'error');
    }

    showSuccess(message) {
        this.showMessage(message, 'success');
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.error-message, .success-message');
        existingMessages.forEach(msg => msg.remove());

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = type === 'error' ? 'error-message' : 'success-message';
        messageDiv.textContent = message;

        // Insert at the top of the calculator section
        const calculatorSection = document.querySelector('.calculator-section');
        calculatorSection.insertBefore(messageDiv, calculatorSection.firstChild);

        // Auto remove after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    // Export functionality for sharing results
    exportResults(format = 'json') {
        const results = {
            sip: this.getSIPResults(),
            lumpsum: this.getLumpsumResults(),
            goal: this.getGoalResults(),
            comparison: this.getComparisonResults(),
            timestamp: new Date().toISOString()
        };

        if (format === 'json') {
            const dataStr = JSON.stringify(results, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            this.downloadFile(dataBlob, 'mutual-fund-results.json');
        } else if (format === 'csv') {
            const csvData = this.convertToCSV(results);
            const dataBlob = new Blob([csvData], { type: 'text/csv' });
            this.downloadFile(dataBlob, 'mutual-fund-results.csv');
        }
    }

    downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
    }

    getSIPResults() {
        const amount = parseFloat(document.getElementById('sip-amount').value) || 0;
        const duration = parseFloat(document.getElementById('sip-duration').value) || 0;
        const returns = parseFloat(document.getElementById('sip-returns').value) || 0;
        
        if (amount <= 0 || duration <= 0 || returns <= 0) return null;

        const monthlyRate = returns / 100 / 12;
        const totalMonths = duration * 12;
        const totalInvestment = amount * totalMonths;
        const futureValue = amount * (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate));
        const totalReturns = futureValue - totalInvestment;

        return {
            monthlyAmount: amount,
            duration: duration,
            expectedReturns: returns,
            totalInvestment: totalInvestment,
            maturityValue: futureValue,
            totalReturns: totalReturns,
            returnPercentage: (totalReturns / totalInvestment) * 100
        };
    }

    getLumpsumResults() {
        const amount = parseFloat(document.getElementById('lumpsum-amount').value) || 0;
        const duration = parseFloat(document.getElementById('lumpsum-duration').value) || 0;
        const returns = parseFloat(document.getElementById('lumpsum-returns').value) || 0;
        
        if (amount <= 0 || duration <= 0 || returns <= 0) return null;

        const futureValue = amount * Math.pow(1 + returns / 100, duration);
        const totalReturns = futureValue - amount;

        return {
            initialAmount: amount,
            duration: duration,
            expectedReturns: returns,
            maturityValue: futureValue,
            totalReturns: totalReturns,
            returnPercentage: (totalReturns / amount) * 100
        };
    }

    getGoalResults() {
        const targetAmount = parseFloat(document.getElementById('goal-amount').value) || 0;
        const duration = parseFloat(document.getElementById('goal-duration').value) || 0;
        const returns = parseFloat(document.getElementById('goal-returns').value) || 0;
        const currentSavings = parseFloat(document.getElementById('goal-current-savings').value) || 0;
        const inflation = parseFloat(document.getElementById('goal-inflation').value) || 0;
        
        if (targetAmount <= 0 || duration <= 0 || returns <= 0) return null;

        const futureTargetAmount = targetAmount * Math.pow(1 + inflation / 100, duration);
        const currentSavingsFutureValue = currentSavings * Math.pow(1 + returns / 100, duration);
        const requiredAmount = futureTargetAmount - currentSavingsFutureValue;
        const monthlyRate = returns / 100 / 12;
        const totalMonths = duration * 12;
        const monthlySIP = requiredAmount > 0 ? requiredAmount / (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate)) : 0;

        return {
            targetAmount: targetAmount,
            futureTargetAmount: futureTargetAmount,
            duration: duration,
            expectedReturns: returns,
            inflation: inflation,
            currentSavings: currentSavings,
            currentSavingsFutureValue: currentSavingsFutureValue,
            requiredMonthlySIP: monthlySIP,
            totalInvestment: monthlySIP * totalMonths
        };
    }

    getComparisonResults() {
        if (!this.selectedFund1 || !this.selectedFund2) return null;

        const amount = parseFloat(document.getElementById('comparison-amount').value) || 0;
        const duration = parseFloat(document.getElementById('comparison-duration').value) || 0;
        
        if (amount <= 0 || duration <= 0) return null;

        const fund1FutureValue = amount * Math.pow(1 + this.selectedFund1.returns / 100, duration);
        const fund2FutureValue = amount * Math.pow(1 + this.selectedFund2.returns / 100, duration);

        return {
            fund1: {
                name: this.selectedFund1.name,
                category: this.selectedFund1.category,
                returns: this.selectedFund1.returns,
                risk: this.selectedFund1.risk,
                maturityValue: fund1FutureValue,
                totalReturns: fund1FutureValue - amount
            },
            fund2: {
                name: this.selectedFund2.name,
                category: this.selectedFund2.category,
                returns: this.selectedFund2.returns,
                risk: this.selectedFund2.risk,
                maturityValue: fund2FutureValue,
                totalReturns: fund2FutureValue - amount
            },
            investmentAmount: amount,
            duration: duration
        };
    }

    convertToCSV(results) {
        let csv = 'Type,Parameter,Value\n';
        
        if (results.sip) {
            csv += `SIP,Monthly Amount,${results.sip.monthlyAmount}\n`;
            csv += `SIP,Duration (Years),${results.sip.duration}\n`;
            csv += `SIP,Expected Returns (%),${results.sip.expectedReturns}\n`;
            csv += `SIP,Total Investment,${results.sip.totalInvestment}\n`;
            csv += `SIP,Maturity Value,${results.sip.maturityValue}\n`;
            csv += `SIP,Total Returns,${results.sip.totalReturns}\n`;
            csv += `SIP,Return Percentage (%),${results.sip.returnPercentage}\n`;
        }
        
        if (results.lumpsum) {
            csv += `Lumpsum,Initial Amount,${results.lumpsum.initialAmount}\n`;
            csv += `Lumpsum,Duration (Years),${results.lumpsum.duration}\n`;
            csv += `Lumpsum,Expected Returns (%),${results.lumpsum.expectedReturns}\n`;
            csv += `Lumpsum,Maturity Value,${results.lumpsum.maturityValue}\n`;
            csv += `Lumpsum,Total Returns,${results.lumpsum.totalReturns}\n`;
            csv += `Lumpsum,Return Percentage (%),${results.lumpsum.returnPercentage}\n`;
        }
        
        return csv;
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.mfCalculator = new MutualFundCalculator();
    
    // Add global functions for HTML onclick events
    window.calculateSIP = () => window.mfCalculator.calculateSIP();
    window.resetSIP = () => window.mfCalculator.resetSIP();
    window.calculateLumpsum = () => window.mfCalculator.calculateLumpsum();
    window.resetLumpsum = () => window.mfCalculator.resetLumpsum();
    window.calculateGoal = () => window.mfCalculator.calculateGoal();
    window.resetGoal = () => window.mfCalculator.resetGoal();
    window.searchFunds = (fundType, searchTerm) => window.mfCalculator.searchFunds(fundType, searchTerm);
    window.compareFunds = () => window.mfCalculator.compareFunds();
    window.resetComparison = () => window.mfCalculator.resetComparison();
    window.switchTab = (tabName) => window.mfCalculator.switchTab(tabName);
    
    // Add export functionality
    window.exportResults = (format) => window.mfCalculator.exportResults(format);
});