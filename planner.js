document.addEventListener('DOMContentLoaded', () => {
    const stepTitleEl = document.getElementById('step-title');
    const stepContentEl = document.getElementById('step-content');
    const prevStepBtn = document.getElementById('prev-step');
    const nextStepBtn = document.getElementById('next-step');

    const VENDORS = [
        { name: "DFW Desi Catering", category: "Food", specialty: "Authentic Hyderabadi Biryani, Haleem", phone: "(214) 555-0123", instagram: "@dfwdesicatering" },
        { name: "Shahnawaz Restaurant", category: "Food", specialty: "Pakistani & Indian Cuisine", phone: "(817) 555-0456", instagram: "@shahnawazdfw" },
        { name: "Aamir's Photography", category: "Photographers", specialty: "Candid shots, traditional portraits", phone: "(469) 555-0789", instagram: "@aamirsphotography" },
        { name: "Sana's Photography", category: "Photographers", specialty: "Elegant bridal & couple portraits", phone: "(214) 555-0321", instagram: "@sanasphotography" },
        { name: "Alina Films", category: "Videographers", specialty: "Cinematic wedding films, drone shots", phone: "(817) 555-0654", instagram: "@alinafilms" },
        { name: "Zohaib Films", category: "Videographers", specialty: "Documentary-style wedding stories", phone: "(469) 555-0987", instagram: "@zohaibfilms" },
        { name: "Reels by Rabia", category: "Content Creators", specialty: "Instagram Reels, TikTok wedding content", phone: "(214) 555-0543", instagram: "@reelsbyrabia" },
        { name: "Desi Wedding Rentals", category: "Supplying Companies", specialty: "Mandaps, jhoolas, stage decor", phone: "(817) 555-0876", instagram: "@desiweddingrentals" },
        { name: "Dallas Dhol Group", category: "DJs", specialty: "Authentic Punjabi beats, Bhangra", phone: "(469) 555-0210", instagram: "@dallasdholgroup" },
        { name: "DJ Khan", category: "DJs", specialty: "Bollywood, Bhangra, Top 40 Fusion", phone: "(214) 555-0129", instagram: "@djkhan" },
    ];
    
    const VENDOR_CATEGORIES = ["Food", "Photographers", "Videographers", "Content Creators", "Supplying Companies", "DJs"];

    const initialSteps = [
        {
            title: "What events are you having?",
            key: "events",
            type: "multiple-choice",
            options: ["Dholki", "Haldi", "Mehendi", "Nikah", "Shaadi", "Valima", "Shalima"],
            render: (step, selections) => `
                <div class="options-grid">
                    ${step.options.map(option => `
                        <label class="option-card">
                            <input type="checkbox" name="${step.key}" value="${option}" 
                                ${selections[step.key]?.includes(option) ? 'checked' : ''}>
                            <div class="option-card-content"><span>${option}</span></div>
                        </label>
                    `).join('')}
                </div>`,
            save: (selections) => {
                const checked = document.querySelectorAll(`input[name="events"]:checked`);
                selections.events = Array.from(checked).map(el => el.value);
            }
        }
    ];

    let steps = [...initialSteps];
    let currentStepIndex = 0;
    const userSelections = { events: [], vendors: {} };

    function generateVendorSteps(selectedEvents) {
        const vendorSteps = selectedEvents.map(event => ({
            title: `Choose Vendors for ${event}`,
            key: `vendors-${event}`,
            type: 'vendor-selection',
            event: event,
            render: (step, selections) => {
                const eventSelections = selections.vendors[step.event] || {};
                const viewMode = selections.viewMode || 'card';
                
                return `
                    <div class="view-toggle-container">
                        <button class="view-toggle-btn ${viewMode === 'card' ? 'active' : ''}" data-view="card">
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                            </svg>
                            Card View
                        </button>
                        <button class="view-toggle-btn ${viewMode === 'list' ? 'active' : ''}" data-view="list">
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"/>
                            </svg>
                            List View
                        </button>
                    </div>
                    ${viewMode === 'card' ? 
                        VENDOR_CATEGORIES.map(category => `
                            <div class="vendor-category-group">
                                <h4>${category}</h4>
                                <div class="options-grid-small">
                                    ${VENDORS.filter(v => v.category === category).map(vendor => `
                                        <label class="option-card-small">
                                            <input type="checkbox" name="${step.event}-${category}" value="${vendor.name}"
                                                ${eventSelections[category]?.includes(vendor.name) ? 'checked' : ''}>
                                            <div class="option-card-content-small">
                                                <strong>${vendor.name}</strong>
                                                <span>${vendor.specialty}</span>
                                                <div class="vendor-contact">
                                                    <a href="tel:${vendor.phone}" class="contact-link">📞 ${vendor.phone}</a>
                                                    <a href="https://instagram.com/${vendor.instagram.substring(1)}" target="_blank" class="contact-link">📷 ${vendor.instagram}</a>
                                                </div>
                                            </div>
                                        </label>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('') :
                        `<div class="vendor-table-container">
                            ${VENDOR_CATEGORIES.map(category => `
                                <div class="vendor-category-group">
                                    <h4>${category}</h4>
                                    <div class="vendor-table-wrapper">
                                        <table class="vendor-table">
                                            <thead>
                                                <tr>
                                                    <th width="50">Select</th>
                                                    <th>Vendor Name</th>
                                                    <th>Specialty</th>
                                                    <th>Phone</th>
                                                    <th>Instagram</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                ${VENDORS.filter(v => v.category === category).map(vendor => `
                                                    <tr>
                                                        <td>
                                                            <label class="table-checkbox">
                                                                <input type="checkbox" name="${step.event}-${category}" value="${vendor.name}"
                                                                    ${eventSelections[category]?.includes(vendor.name) ? 'checked' : ''}>
                                                                <span class="checkmark"></span>
                                                            </label>
                                                        </td>
                                                        <td><strong>${vendor.name}</strong></td>
                                                        <td>${vendor.specialty}</td>
                                                        <td><a href="tel:${vendor.phone}" class="contact-link">${vendor.phone}</a></td>
                                                        <td><a href="https://instagram.com/${vendor.instagram.substring(1)}" target="_blank" class="contact-link">${vendor.instagram}</a></td>
                                                    </tr>
                                                `).join('')}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            `).join('')}
                        </div>`
                    }
                `;
            },
            save: (selections) => {
                if (!selections.vendors[event]) selections.vendors[event] = {};
                VENDOR_CATEGORIES.forEach(category => {
                    const checked = document.querySelectorAll(`input[name="${event}-${category}"]:checked`);
                    selections.vendors[event][category] = Array.from(checked).map(el => el.value);
                });
            }
        }));

        const summaryStep = {
            title: "Your Wedding Plan Summary",
            key: "summary",
            type: "summary",
            render: (step, selections) => {
                return `
                    <div class="summary-container">
                        <div class="summary-header">
                            <h3>Selected Events</h3>
                            <button class="download-csv-btn" onclick="downloadWeddingPlanCSV()">
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                                    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                                </svg>
                                Download as CSV
                            </button>
                        </div>
                        <ul class="summary-list">
                            ${selections.events.map(event => `<li>${event}</li>`).join('')}
                        </ul>
                        <hr>
                        <h3>Vendor Selections</h3>
                        ${selections.events.map(event => `
                            <div class="summary-event-group">
                                <h4>${event}</h4>
                                ${Object.entries(selections.vendors[event] || {}).filter(([_, v]) => v.length > 0).map(([category, vendorList]) => `
                                    <div class="summary-category-group">
                                        <strong>${category}:</strong>
                                        <ul class="summary-vendor-list">
                                            ${vendorList.map(vendor => `<li>${vendor}</li>`).join('')}
                                        </ul>
                                    </div>
                                `).join('')}
                            </div>
                        `).join('')}
                    </div>
                `;
            }
        };

        steps = [...initialSteps, ...vendorSteps, summaryStep];
    }

    function renderCurrentStep() {
        const step = steps[currentStepIndex];
        stepTitleEl.textContent = step.title;
        stepContentEl.innerHTML = step.render(step, userSelections);
        stepContentEl.style.animation = 'fadeIn 0.5s ease-in-out';
        
        // Add event listeners for view toggle buttons
        if (step.type === 'vendor-selection') {
            const toggleBtns = stepContentEl.querySelectorAll('.view-toggle-btn');
            toggleBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const viewMode = btn.dataset.view;
                    userSelections.viewMode = viewMode;
                    renderCurrentStep();
                });
            });
        }
        
        prevStepBtn.style.display = currentStepIndex > 0 ? 'inline-flex' : 'none';
        nextStepBtn.textContent = currentStepIndex === steps.length - 1 ? 'Finish' : 'Next';
    }

    nextStepBtn.addEventListener('click', () => {
        const currentStep = steps[currentStepIndex];
        if (currentStep.save) {
            currentStep.save(userSelections);
        }

        if (currentStep.key === "events") {
            generateVendorSteps(userSelections.events);
        }

        if (currentStepIndex < steps.length - 1) {
            currentStepIndex++;
            renderCurrentStep();
        } else {
            stepTitleEl.textContent = "All Done!";
            stepContentEl.innerHTML = `<div class="summary-final-message"><p>Your wedding plan has been generated. You can now review your selections.</p></div>` + stepContentEl.innerHTML;
            nextStepBtn.style.display = 'none';
        }
    });

    prevStepBtn.addEventListener('click', () => {
        if (currentStepIndex > 0) {
            currentStepIndex--;
            renderCurrentStep();
        }
    });

    renderCurrentStep();
    
    const style = document.createElement('style');
    style.textContent = `
        .options-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; }
        .option-card {
            border: 1px solid transparent; /* No visible outer border */
            border-radius: 8px;
            padding: 0; /* Padding moved to inner element */
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
        }
        .option-card:hover .option-card-content {
            border-color: #8B5CF6;
            background-color: #f5f3ff;
        }
        .option-card input[type="checkbox"] {
            display: none;
        }
        .option-card input[type="checkbox"]:checked + .option-card-content {
            border-color: #8B5CF6;
            background-color: #8B5CF6;
            color: white;
        }
        .option-card-content {
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            font-weight: 500;
            border: 1px solid #e2e8f0; /* The one, true border */
            border-radius: 8px;
            padding: 1.5rem; /* Padding is now here */
            height: 100%;
            transition: all 0.3s ease;
        }
        
        .vendor-category-group { margin-bottom: 2rem; }
        .vendor-category-group h4 { font-size: 1.2rem; margin-bottom: 1rem; color: #334155; border-bottom: 2px solid #f1f5f9; padding-bottom: 0.5rem; }
        .options-grid-small { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; }
        
        .option-card-small {
            border: 1px solid transparent; /* No visible outer border */
            border-radius: 8px;
            padding: 0; /* Padding moved to inner element */
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
        }
        .option-card-small:hover .option-card-content-small {
            border-color: #8B5CF6;
            background-color: #f5f3ff;
        }
        .option-card-small input[type="checkbox"] { 
            display: none; 
        }
        .option-card-small input[type="checkbox"]:checked + .option-card-content-small {
            border-color: #8B5CF6;
            background-color: #eef2ff;
        }
        .option-card-content-small {
            display: flex;
            flex-direction: column;
            text-align: left;
            border: 1px solid #e2e8f0; /* The one, true border */
            border-radius: 8px;
            padding: 1rem; /* Padding is now here */
            height: 100%;
            transition: all 0.3s ease;
        }
        .option-card-content-small strong { font-weight: 600; color: #1e293b; }
        .option-card-content-small span { font-size: 0.9rem; color: #64748b; }
        .vendor-contact { margin-top: 0.5rem; font-size: 0.8rem; }
        .vendor-contact .contact-link { 
            display: block; 
            color: #8B5CF6; 
            text-decoration: none; 
            margin-bottom: 0.25rem;
            transition: color 0.2s ease;
        }
        .vendor-contact .contact-link:hover { color: #7C3AED; }

        .view-toggle-container { 
            display: flex; 
            gap: 0.5rem; 
            margin-bottom: 2rem; 
            justify-content: center;
        }
        .view-toggle-btn { 
            display: flex; 
            align-items: center; 
            gap: 0.5rem; 
            padding: 0.75rem 1.5rem; 
            border: 1px solid #e2e8f0; 
            background: white; 
            border-radius: 8px; 
            cursor: pointer; 
            transition: all 0.2s ease;
            font-weight: 500;
        }
        .view-toggle-btn:hover { 
            border-color: #8B5CF6; 
            background-color: #f5f3ff; 
        }
        .view-toggle-btn.active { 
            background-color: #8B5CF6; 
            color: white; 
            border-color: #8B5CF6; 
        }

        .vendor-table-container { margin-top: 1rem; }
        .vendor-table-wrapper { overflow-x: auto; margin-top: 1rem; }
        .vendor-table { 
            width: 100%; 
            border-collapse: collapse; 
            background: white; 
            border-radius: 8px; 
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .vendor-table th { 
            background-color: #f8fafc; 
            padding: 1rem; 
            text-align: left; 
            font-weight: 600; 
            color: #334155; 
            border-bottom: 1px solid #e2e8f0;
        }
        .vendor-table td { 
            padding: 1rem; 
            border-bottom: 1px solid #f1f5f9; 
            vertical-align: middle;
        }
        .vendor-table tr:hover { background-color: #f8fafc; }
        
        .table-checkbox { 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            cursor: pointer; 
        }
        .table-checkbox input[type="checkbox"] { 
            display: none; 
        }
        .checkmark { 
            width: 20px; 
            height: 20px; 
            border: 2px solid #e2e8f0; 
            border-radius: 4px; 
            position: relative; 
            transition: all 0.2s ease;
        }
        .table-checkbox input[type="checkbox"]:checked + .checkmark { 
            background-color: #8B5CF6; 
            border-color: #8B5CF6; 
        }
        .table-checkbox input[type="checkbox"]:checked + .checkmark::after { 
            content: '✓'; 
            position: absolute; 
            top: 50%; 
            left: 50%; 
            transform: translate(-50%, -50%); 
            color: white; 
            font-size: 12px; 
            font-weight: bold; 
        }
        .contact-link { 
            color: #8B5CF6; 
            text-decoration: none; 
            transition: color 0.2s ease;
        }
        .contact-link:hover { 
            color: #7C3AED; 
            text-decoration: underline; 
        }

        .summary-container { font-size: 1.1rem; line-height: 1.8; }
        .summary-container h3 { font-size: 1.5rem; color: #1e293b; margin-top: 1.5rem; margin-bottom: 1rem; }
        .summary-header { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            margin-bottom: 1rem;
        }
        .summary-header h3 { margin: 0; }
        .download-csv-btn { 
            display: flex; 
            align-items: center; 
            gap: 0.5rem; 
            padding: 0.75rem 1.5rem; 
            background-color: #8B5CF6; 
            color: white; 
            border: none; 
            border-radius: 8px; 
            cursor: pointer; 
            font-weight: 500;
            transition: all 0.2s ease;
            font-size: 0.9rem;
        }
        .download-csv-btn:hover { 
            background-color: #7C3AED; 
            transform: translateY(-1px);
        }
        .download-csv-btn:active { 
            transform: translateY(0); 
        }
        .summary-list { list-style-type: disc; padding-left: 20px; margin-bottom: 1.5rem; }
        .summary-event-group { margin-bottom: 1.5rem; }
        .summary-event-group h4 { font-size: 1.3rem; color: #334155; }
        .summary-category-group { margin-left: 1rem; margin-bottom: 1rem; }
        .summary-category-group strong { color: #475569; }
        .summary-vendor-list { list-style-type: circle; padding-left: 25px; margin-top: 0.5rem; }
        .summary-final-message { text-align: center; padding: 1rem; background-color: #eef2ff; border-radius: 8px; margin-bottom: 2rem; }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

    // Make the download function available globally
    window.downloadWeddingPlanCSV = function() {
        const csvContent = generateWeddingPlanCSV(userSelections);
        
        // Create blob with application/csv MIME type to avoid text file detection
        const blob = new Blob([csvContent], { 
            type: 'application/csv'
        });
        
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'wedding-plan.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
    
    function generateWeddingPlanCSV(selections) {
        const lines = [];
        
        // Start with the main data table immediately (more recognizable as CSV)
        lines.push('Event,Category,Vendor Name,Specialty,Phone,Instagram');
        
        selections.events.forEach(event => {
            const eventVendors = selections.vendors[event] || {};
            Object.entries(eventVendors).forEach(([category, vendorList]) => {
                vendorList.forEach(vendorName => {
                    const vendor = VENDORS.find(v => v.name === vendorName);
                    if (vendor) {
                        // Escape any quotes in the data and ensure proper CSV formatting
                        const escapedEvent = `"${event.replace(/"/g, '""')}"`;
                        const escapedCategory = `"${category.replace(/"/g, '""')}"`;
                        const escapedName = `"${vendor.name.replace(/"/g, '""')}"`;
                        const escapedSpecialty = `"${vendor.specialty.replace(/"/g, '""')}"`;
                        const escapedPhone = `"${vendor.phone.replace(/"/g, '""')}"`;
                        const escapedInstagram = `"${vendor.instagram.replace(/"/g, '""')}"`;
                        
                        lines.push(`${escapedEvent},${escapedCategory},${escapedName},${escapedSpecialty},${escapedPhone},${escapedInstagram}`);
                    }
                });
            });
        });
        
        // If no vendors selected, add a placeholder row to ensure CSV structure
        if (lines.length === 1) {
            lines.push('"No vendors selected","","","","",""');
        }
        
        return lines.join('\r\n'); // Use Windows line endings for better compatibility
    }
}); 