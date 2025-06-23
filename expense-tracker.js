class WeddingExpenseTracker {
    constructor() {
        this.tableBody = document.getElementById('expenseTableBody');
        this.modal = document.getElementById('modal');
        this.encodedDataTextarea = document.getElementById('encodedData');
        this.modalTitle = document.getElementById('modalTitle');
        
        this.initializeEventListeners();
        this.loadFromLocalStorage();
        this.updateSummary();
    }

    initializeEventListeners() {
        // Add row button
        document.getElementById('addRowBtn').addEventListener('click', () => {
            this.addExpenseRow();
        });

        // Save button
        document.getElementById('saveBtn').addEventListener('click', () => {
            this.showSaveModal();
        });

        // Load button
        document.getElementById('loadBtn').addEventListener('click', () => {
            this.showLoadModal();
        });

        // Modal events
        document.querySelector('.close').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('copyBtn').addEventListener('click', () => {
            this.copyToClipboard();
        });

        document.getElementById('clearBtn').addEventListener('click', () => {
            this.encodedDataTextarea.value = '';
        });

        // Close modal when clicking outside
        window.addEventListener('click', (event) => {
            if (event.target === this.modal) {
                this.closeModal();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 's':
                        e.preventDefault();
                        this.showSaveModal();
                        break;
                    case 'l':
                        e.preventDefault();
                        this.showLoadModal();
                        break;
                    case 'n':
                        e.preventDefault();
                        this.addExpenseRow();
                        break;
                }
            }
        });
    }

    addExpenseRow(data = null) {
        const row = document.createElement('tr');
        row.className = 'expense-row';
        
        const rowData = data || {
            name: '',
            totalAmount: '',
            paidSoFar: '',
            whoPaid: ''
        };

        row.innerHTML = `
            <td>
                <input type="text" class="expense-name" value="${rowData.name}" placeholder="e.g., Venue, Catering, etc.">
            </td>
            <td>
                <input type="number" class="total-amount" value="${rowData.totalAmount}" placeholder="0.00" step="0.01" min="0">
            </td>
            <td>
                <input type="number" class="paid-so-far" value="${rowData.paidSoFar}" placeholder="0.00" step="0.01" min="0">
            </td>
            <td>
                <span class="remaining-amount">$0.00</span>
            </td>
            <td>
                <select class="who-paid">
                    <option value="">Select...</option>
                    <option value="Bride" ${rowData.whoPaid === 'Bride' ? 'selected' : ''}>Bride</option>
                    <option value="Groom" ${rowData.whoPaid === 'Groom' ? 'selected' : ''}>Groom</option>
                    <option value="Bride's Family" ${rowData.whoPaid === 'Bride\'s Family' ? 'selected' : ''}>Bride's Family</option>
                    <option value="Groom's Family" ${rowData.whoPaid === 'Groom\'s Family' ? 'selected' : ''}>Groom's Family</option>
                    <option value="Both" ${rowData.whoPaid === 'Both' ? 'selected' : ''}>Both</option>
                    <option value="Other" ${rowData.whoPaid === 'Other' ? 'selected' : ''}>Other</option>
                </select>
            </td>
            <td>
                <button class="btn btn-danger delete-row">🗑️</button>
            </td>
        `;

        this.tableBody.appendChild(row);

        // Add event listeners to the new row
        this.addRowEventListeners(row);
        
        // Auto-save after adding row
        this.saveToLocalStorage();
        this.updateSummary();
    }

    addRowEventListeners(row) {
        // Delete button
        row.querySelector('.delete-row').addEventListener('click', () => {
            row.remove();
            this.saveToLocalStorage();
            this.updateSummary();
        });

        // Input change events for calculations
        const totalInput = row.querySelector('.total-amount');
        const paidInput = row.querySelector('.paid-so-far');
        const remainingSpan = row.querySelector('.remaining-amount');

        const updateRemaining = () => {
            const total = parseFloat(totalInput.value) || 0;
            const paid = parseFloat(paidInput.value) || 0;
            const remaining = total - paid;
            
            remainingSpan.textContent = `$${remaining.toFixed(2)}`;
            remainingSpan.className = `remaining-amount ${remaining === 0 ? 'zero' : ''}`;
            
            this.saveToLocalStorage();
            this.updateSummary();
        };

        totalInput.addEventListener('input', updateRemaining);
        paidInput.addEventListener('input', updateRemaining);

        // Auto-save on any input change
        const inputs = row.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                this.saveToLocalStorage();
            });
        });
    }

    updateSummary() {
        const rows = this.tableBody.querySelectorAll('tr');
        let totalExpenses = 0;
        let totalPaid = 0;

        rows.forEach(row => {
            const totalAmount = parseFloat(row.querySelector('.total-amount').value) || 0;
            const paidSoFar = parseFloat(row.querySelector('.paid-so-far').value) || 0;
            
            totalExpenses += totalAmount;
            totalPaid += paidSoFar;
        });

        const totalRemaining = totalExpenses - totalPaid;

        document.getElementById('totalExpenses').textContent = `$${totalExpenses.toFixed(2)}`;
        document.getElementById('totalPaid').textContent = `$${totalPaid.toFixed(2)}`;
        document.getElementById('totalRemaining').textContent = `$${totalRemaining.toFixed(2)}`;
    }

    getTableData() {
        const rows = this.tableBody.querySelectorAll('tr');
        const data = [];

        rows.forEach(row => {
            const rowData = {
                name: row.querySelector('.expense-name').value,
                totalAmount: row.querySelector('.total-amount').value,
                paidSoFar: row.querySelector('.paid-so-far').value,
                whoPaid: row.querySelector('.who-paid').value
            };
            data.push(rowData);
        });

        return data;
    }

    encodeData(data) {
        const dataString = JSON.stringify({
            version: '1.0',
            timestamp: new Date().toISOString(),
            expenses: data
        });
        
        // Compress and encode
        return btoa(unescape(encodeURIComponent(dataString)));
    }

    decodeData(encodedString) {
        try {
            const decodedString = decodeURIComponent(escape(atob(encodedString)));
            const data = JSON.parse(decodedString);
            
            // Version check for future compatibility
            if (!data.version || !data.expenses) {
                throw new Error('Invalid data format');
            }
            
            return data.expenses;
        } catch (error) {
            throw new Error('Invalid encoded data');
        }
    }

    showSaveModal() {
        const data = this.getTableData();
        const encodedString = this.encodeData(data);
        
        this.modalTitle.textContent = 'Save Data';
        this.encodedDataTextarea.value = encodedString;
        this.encodedDataTextarea.readOnly = false;
        this.encodedDataTextarea.placeholder = 'Your encoded data will appear here...';
        
        // Show copy and clear buttons, hide load button
        document.getElementById('copyBtn').style.display = 'inline-flex';
        document.getElementById('clearBtn').style.display = 'inline-flex';
        
        // Hide load button if it exists
        const loadBtn = document.getElementById('loadDataBtn');
        if (loadBtn) {
            loadBtn.style.display = 'none';
        }
        
        this.modal.style.display = 'block';
        this.encodedDataTextarea.focus();
        this.encodedDataTextarea.select();
    }

    showLoadModal() {
        this.modalTitle.textContent = 'Load Data';
        this.encodedDataTextarea.value = '';
        this.encodedDataTextarea.readOnly = false;
        this.encodedDataTextarea.placeholder = 'Paste your encoded data here...';
        
        // Hide copy button, show clear button
        document.getElementById('copyBtn').style.display = 'none';
        document.getElementById('clearBtn').style.display = 'inline-flex';
        
        // Create or show load button
        let loadBtn = document.getElementById('loadDataBtn');
        if (!loadBtn) {
            loadBtn = document.createElement('button');
            loadBtn.id = 'loadDataBtn';
            loadBtn.className = 'btn btn-success';
            loadBtn.textContent = 'Load Data';
            loadBtn.onclick = () => this.loadData();
            
            const modalButtons = document.querySelector('.modal-buttons');
            modalButtons.insertBefore(loadBtn, document.getElementById('clearBtn'));
        } else {
            loadBtn.style.display = 'inline-flex';
        }
        
        this.modal.style.display = 'block';
        this.encodedDataTextarea.focus();
    }

    loadData() {
        try {
            const encodedString = this.encodedDataTextarea.value.trim();
            if (!encodedString) {
                this.showMessage('Please paste encoded data', 'error');
                return;
            }

            const expenses = this.decodeData(encodedString);
            
            // Clear current table
            this.tableBody.innerHTML = '';
            
            // Add loaded data
            expenses.forEach(expense => {
                this.addExpenseRow(expense);
            });
            
            this.closeModal();
            this.showMessage('Data loaded successfully!', 'success');
            
        } catch (error) {
            this.showMessage('Error loading data: ' + error.message, 'error');
        }
    }

    copyToClipboard() {
        this.encodedDataTextarea.select();
        this.encodedDataTextarea.setSelectionRange(0, 99999); // For mobile devices
        
        try {
            document.execCommand('copy');
            this.showMessage('Copied to clipboard!', 'success');
        } catch (err) {
            // Fallback for modern browsers
            navigator.clipboard.writeText(this.encodedDataTextarea.value).then(() => {
                this.showMessage('Copied to clipboard!', 'success');
            }).catch(() => {
                this.showMessage('Failed to copy to clipboard', 'error');
            });
        }
    }

    closeModal() {
        this.modal.style.display = 'none';
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());
        
        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        
        // Insert after header
        const header = document.querySelector('.expense-header');
        header.parentNode.insertBefore(messageDiv, header.nextSibling);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    saveToLocalStorage() {
        const data = this.getTableData();
        localStorage.setItem('weddingExpenses', JSON.stringify(data));
    }

    loadFromLocalStorage() {
        const savedData = localStorage.getItem('weddingExpenses');
        if (savedData) {
            try {
                const expenses = JSON.parse(savedData);
                expenses.forEach(expense => {
                    this.addExpenseRow(expense);
                });
            } catch (error) {
                console.error('Error loading from localStorage:', error);
            }
        }
    }
}

// Initialize the expense tracker when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WeddingExpenseTracker();
}); 