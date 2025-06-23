document.addEventListener('DOMContentLoaded', () => {
    const stepTitleEl = document.getElementById('step-title');
    const stepContentEl = document.getElementById('step-content');
    const prevStepBtn = document.getElementById('prev-step');
    const nextStepBtn = document.getElementById('next-step');

    const VENDORS = [
        { name: "DFW Desi Catering", category: "Food", specialty: "Authentic Hyderabadi Biryani, Haleem" },
        { name: "Shahnawaz Restaurant", category: "Food", specialty: "Pakistani & Indian Cuisine" },
        { name: "Aamir's Photography", category: "Photographers", specialty: "Candid shots, traditional portraits" },
        { name: "Sana's Photography", category: "Photographers", specialty: "Elegant bridal & couple portraits" },
        { name: "Alina Films", category: "Videographers", specialty: "Cinematic wedding films, drone shots" },
        { name: "Zohaib Films", category: "Videographers", specialty: "Documentary-style wedding stories" },
        { name: "Reels by Rabia", category: "Content Creators", specialty: "Instagram Reels, TikTok wedding content" },
        { name: "Desi Wedding Rentals", category: "Supplying Companies", specialty: "Mandaps, jhoolas, stage decor" },
        { name: "Dallas Dhol Group", category: "DJs", specialty: "Authentic Punjabi beats, Bhangra" },
        { name: "DJ Khan", category: "DJs", specialty: "Bollywood, Bhangra, Top 40 Fusion" },
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
                return VENDOR_CATEGORIES.map(category => `
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
                                    </div>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                `).join('');
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
                        <h3>Selected Events</h3>
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
        .option-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 1.5rem; cursor: pointer; transition: all 0.3s ease; position: relative; }
        .option-card:hover { border-color: #8B5CF6; background-color: #f5f3ff; }
        .option-card input[type="checkbox"] { display: none; }
        .option-card input[type="checkbox"]:checked + .option-card-content { border-color: #8B5CF6; background-color: #8B5CF6; color: white; }
        .option-card-content { display: flex; align-items: center; justify-content: center; text-align: center; font-weight: 500; border: 1px solid transparent; border-radius: 8px; padding: 1rem; height: 100%; transition: all 0.3s ease; }
        
        .vendor-category-group { margin-bottom: 2rem; }
        .vendor-category-group h4 { font-size: 1.2rem; margin-bottom: 1rem; color: #334155; border-bottom: 2px solid #f1f5f9; padding-bottom: 0.5rem; }
        .options-grid-small { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; }
        .option-card-small { border: 1px solid #e2e8f0; border-radius: 8px; padding: 1rem; cursor: pointer; transition: all 0.3s ease; position: relative; }
        .option-card-small:hover { border-color: #8B5CF6; background-color: #f5f3ff; }
        .option-card-small input[type="checkbox"] { display: none; }
        .option-card-small input[type="checkbox"]:checked + .option-card-content-small { border-color: #8B5CF6; background-color: #eef2ff; }
        .option-card-content-small { display: flex; flex-direction: column; text-align: left; border: 2px solid transparent; border-radius: 6px; height: 100%; transition: all 0.3s ease; }
        .option-card-content-small strong { font-weight: 600; color: #1e293b; }
        .option-card-content-small span { font-size: 0.9rem; color: #64748b; }

        .summary-container { font-size: 1.1rem; line-height: 1.8; }
        .summary-container h3 { font-size: 1.5rem; color: #1e293b; margin-top: 1.5rem; margin-bottom: 1rem; }
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
}); 