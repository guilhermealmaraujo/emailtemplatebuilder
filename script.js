document.addEventListener('DOMContentLoaded', function() {
    const processButton = document.getElementById('processButton');
    const previewContent = document.getElementById('previewContent');
    const templateSelect = document.getElementById('template');
    const saveButton = document.getElementById('saveButton');
    const applyButton = document.getElementById('applyButton');
    const configNameInput = document.getElementById('config_name');
    const savedConfigsSelect = document.getElementById('saved_configs');
    const deleteConfigButton = document.getElementById('deleteConfigButton');

    // Template selection elements
    const dropdownHeader = document.getElementById('dropdownHeader');
    const dropdownContent = document.getElementById('dropdownContent');
    const templateSearch = document.getElementById('templateSearch');
    const selectedTemplates = document.getElementById('selectedTemplates');
    const selectAllCheckbox = document.getElementById('selectAllTemplates');

    // Set to store selected template values
    const selectedTemplateValues = new Set();

    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Add active class to clicked button and corresponding pane
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(tabId + 'Preview').classList.add('active');
        });
    });

    // Load saved configurations into the dropdown
    function loadSavedConfigurations() {
        savedConfigsSelect.innerHTML = '<option value="">Select a saved configuration...</option>';
        
        // Get all saved configurations from localStorage
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('email_template_config_')) {
                const configName = key.replace('email_template_config_', '');
                const option = document.createElement('option');
                option.value = configName;
                option.textContent = configName;
                savedConfigsSelect.appendChild(option);
            }
        }
    }

    // Save current form data to localStorage
    saveButton.addEventListener('click', function() {
        const configName = configNameInput.value.trim();
        if (!configName) {
            alert('Please enter a name for this configuration');
            return;
        }

        // Get all form values
        const formData = {
            title_name: document.getElementById('title_name').value,
            title_url: document.getElementById('title_url').value,
            title_domain_name: document.getElementById('title_domain_name').value,
            customer_service_email: document.getElementById('customer_service_email').value,
            address: document.getElementById('address').value,
            logo_url: document.getElementById('logo_url').value,
            twitter_url: document.getElementById('twitter_url').value,
            facebook_url: document.getElementById('facebook_url').value,
            contact_url: document.getElementById('contact_url').value,
            privacy_url: document.getElementById('privacy_url').value,
            terms_url: document.getElementById('terms_url').value,
            subscribe_page_link: document.getElementById('subscribe_page_link').value
        };

        // Save to localStorage
        localStorage.setItem(`email_template_config_${configName}`, JSON.stringify(formData));
        
        // Update the dropdown
        loadSavedConfigurations();
        
        // Clear the input
        configNameInput.value = '';
        
        alert(`Configuration "${configName}" saved successfully!`);
    });

    // Apply selected configuration to the form
    applyButton.addEventListener('click', function() {
        const selectedConfig = savedConfigsSelect.value;
        if (!selectedConfig) {
            alert('Please select a configuration to apply');
            return;
        }

        try {
            // Get the saved configuration
            const savedConfigStr = localStorage.getItem(`email_template_config_${selectedConfig}`);
            if (!savedConfigStr) {
                throw new Error('Configuration not found');
            }

            const savedConfig = JSON.parse(savedConfigStr);
            
            // Apply values to form fields
            const fields = [
                'title_name',
                'title_url',
                'title_domain_name',
                'customer_service_email',
                'address',
                'logo_url',
                'twitter_url',
                'facebook_url',
                'contact_url',
                'privacy_url',
                'terms_url',
                'subscribe_page_link'
            ];

            fields.forEach(field => {
                const element = document.getElementById(field);
                if (element && savedConfig[field] !== undefined) {
                    element.value = savedConfig[field];
                }
            });
            
        } catch (error) {
            console.error('Error applying configuration:', error);
            alert(`Error applying configuration: ${error.message}`);
        }
    });

    // Load saved configurations when the page loads
    loadSavedConfigurations();

    // Toggle dropdown
    dropdownHeader.addEventListener('click', () => {
        dropdownContent.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            dropdownContent.classList.remove('show');
        }
    });

    // Search functionality
    templateSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const items = dropdownContent.querySelectorAll('.dropdown-item');
        
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            item.style.display = text.includes(searchTerm) ? 'block' : 'none';
        });
    });

    // Function to select/deselect all templates
    function toggleAllTemplates(selectAll) {
        const items = dropdownContent.querySelectorAll('.dropdown-item');
        items.forEach(item => {
            const value = item.dataset.value;
            if (selectAll) {
                if (!selectedTemplateValues.has(value)) {
                    selectedTemplateValues.add(value);
                    item.classList.add('selected');
                    // Add template tag
                    const tag = document.createElement('div');
                    tag.className = 'template-tag';
                    tag.innerHTML = `
                        ${item.textContent}
                        <span class="remove-tag" data-value="${value}">&times;</span>
                    `;
                    selectedTemplates.appendChild(tag);
                }
            } else {
                selectedTemplateValues.delete(value);
                item.classList.remove('selected');
                // Remove template tag
                const tag = selectedTemplates.querySelector(`.template-tag .remove-tag[data-value="${value}"]`)?.parentElement;
                if (tag) {
                    tag.remove();
                }
            }
        });
    }

    // Add event listener for select all checkbox
    selectAllCheckbox.addEventListener('change', (e) => {
        toggleAllTemplates(e.target.checked);
    });

    // Update select all checkbox state when templates are manually selected/deselected
    function updateSelectAllCheckbox() {
        const items = dropdownContent.querySelectorAll('.dropdown-item');
        const allSelected = Array.from(items).every(item => selectedTemplateValues.has(item.dataset.value));
        selectAllCheckbox.checked = allSelected;
    }

    // Update the existing template selection handler
    dropdownContent.addEventListener('click', (e) => {
        const item = e.target.closest('.dropdown-item');
        if (!item) return;

        const value = item.dataset.value;
        const text = item.textContent;

        if (!selectedTemplateValues.has(value)) {
            // Add template tag
            const tag = document.createElement('div');
            tag.className = 'template-tag';
            tag.innerHTML = `
                ${text}
                <span class="remove-tag" data-value="${value}">&times;</span>
            `;
            selectedTemplates.appendChild(tag);
            selectedTemplateValues.add(value);
            
            // Mark item as selected
            item.classList.add('selected');
        }
        updateSelectAllCheckbox();
    });

    // Update the existing tag removal handler
    selectedTemplates.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-tag')) {
            const value = e.target.dataset.value;
            const tag = e.target.closest('.template-tag');
            tag.remove();
            selectedTemplateValues.delete(value);
            
            // Remove selected class from dropdown item
            const item = dropdownContent.querySelector(`.dropdown-item[data-value="${value}"]`);
            if (item) {
                item.classList.remove('selected');
            }
            updateSelectAllCheckbox();
        }
    });

    // Load templates.json data
    let templatesData = {};
    fetch('templates.json')
        .then(response => response.json())
        .then(data => {
            templatesData = data;
        })
        .catch(error => console.error('Error loading templates.json:', error));

    // Process templates
    processButton.addEventListener('click', async function() {
        if (selectedTemplateValues.size === 0) {
            alert('Please select at least one template');
            return;
        }

        // Get all form values
        const formData = {
            title_name: document.getElementById('title_name').value,
            title_url: document.getElementById('title_url').value,
            title_domain_name: document.getElementById('title_domain_name').value,
            customer_service_email: document.getElementById('customer_service_email').value,
            address: document.getElementById('address').value,
            logo_url: document.getElementById('logo_url').value,
            twitter_url: document.getElementById('twitter_url').value,
            facebook_url: document.getElementById('facebook_url').value,
            contact_url: document.getElementById('contact_url').value,
            privacy_url: document.getElementById('privacy_url').value,
            terms_url: document.getElementById('terms_url').value,
            subscribe_page_link: document.getElementById('subscribe_page_link').value
        };

        // Validate required fields
        const requiredFields = ['title_name', 'title_url', 'title_domain_name', 'customer_service_email'];
        const missingFields = requiredFields.filter(field => !formData[field]);
        
        if (missingFields.length > 0) {
            alert('Please fill in all required fields: ' + missingFields.join(', '));
            return;
        }

        // Clear the accordion
        const accordion = document.getElementById('templateAccordion');
        accordion.innerHTML = '';

        // Process each selected template
        for (const template of selectedTemplateValues) {
            try {
                const response = await fetch(`Templates/${template}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                let html = await response.text();
                
                // Replace all placeholders with form values
                for (const [key, value] of Object.entries(formData)) {
                    const placeholder = `\\[ph\\]${key}\\[/ph\\]`; // Escape special regex characters
                    const regex = new RegExp(placeholder, 'g');
                    html = html.replace(regex, value || ''); // Handle undefined values
                }

                // Create accordion item
                const accordionItem = document.createElement('div');
                accordionItem.className = 'accordion-item';
                
                // Escape HTML for display in the code tab
                const escapedHtml = html
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#039;');
                
                // Store the original HTML in a data attribute
                accordionItem.setAttribute('data-html', html);
                
                // Get template data from templates.json
                const templateName = template.replace('.html', '');
                const templateData = templatesData[templateName] || {};
                
                accordionItem.innerHTML = `
                    <div class="accordion-header">
                        <div class="accordion-title">${template}</div>
                        <div class="accordion-actions">
                            <button class="copy-button" data-template="${template}">Copy Raw HTML</button>
                            <button class="copy-email-type-button" data-template="${template}">Copy Email Type</button>
                            <button class="copy-subject-button" data-template="${template}">Copy Subject</button>
                            <button class="remove-button" data-template="${template}">×</button>
                            <div class="accordion-arrow">▼</div>
                        </div>
                    </div>
                    <div class="accordion-content">
                        <div class="accordion-preview">
                            <div class="accordion-preview-tabs">
                                <button class="accordion-tab-button active" data-tab="rendered">Rendered HTML</button>
                                <button class="accordion-tab-button" data-tab="code">Raw HTML</button>
                            </div>
                            <div class="accordion-tab-content">
                                <div class="accordion-tab-pane active" data-pane="rendered">
                                    <div class="preview-content">${html}</div>
                                </div>
                                <div class="accordion-tab-pane" data-pane="code">
                                    <pre class="accordion-code-content">${escapedHtml}</pre>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                accordion.appendChild(accordionItem);
                
                // Add event listeners for the accordion item
                const header = accordionItem.querySelector('.accordion-header');
                const content = accordionItem.querySelector('.accordion-content');
                const arrow = accordionItem.querySelector('.accordion-arrow');
                
                header.addEventListener('click', () => {
                    // Close all other accordion items
                    document.querySelectorAll('.accordion-content').forEach(item => {
                        if (item !== content) {
                            item.classList.remove('expanded');
                            item.previousElementSibling.querySelector('.accordion-arrow').classList.remove('expanded');
                        }
                    });
                    
                    // Toggle the clicked item
                    content.classList.toggle('expanded');
                    arrow.classList.toggle('expanded');
                });
                
                // Add event listeners for the tabs
                const tabButtons = accordionItem.querySelectorAll('.accordion-tab-button');
                const tabPanes = accordionItem.querySelectorAll('.accordion-tab-pane');
                
                tabButtons.forEach(button => {
                    button.addEventListener('click', (e) => {
                        e.stopPropagation(); // Prevent accordion toggle
                        
                        // Remove active class from all buttons and panes
                        tabButtons.forEach(btn => btn.classList.remove('active'));
                        tabPanes.forEach(pane => pane.classList.remove('active'));
                        
                        // Add active class to clicked button and corresponding pane
                        button.classList.add('active');
                        const tabId = button.getAttribute('data-tab');
                        accordionItem.querySelector(`.accordion-tab-pane[data-pane="${tabId}"]`).classList.add('active');
                    });
                });
                
                // Add event listener for the copy button
                const copyButton = accordionItem.querySelector('.copy-button');
                copyButton.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent accordion toggle
                    
                    // Get the original HTML from the data attribute
                    const codeContent = accordionItem.getAttribute('data-html');
                    
                    // Create a temporary textarea element
                    const textarea = document.createElement('textarea');
                    textarea.value = codeContent;
                    textarea.style.position = 'fixed';
                    textarea.style.opacity = '0';
                    document.body.appendChild(textarea);
                    
                    // Select and copy the text
                    textarea.select();
                    document.execCommand('copy');
                    
                    // Remove the temporary textarea
                    document.body.removeChild(textarea);
                    
                    // Show feedback
                    copyButton.textContent = 'Copied!';
                    copyButton.classList.add('copied');
                    
                    setTimeout(() => {
                        copyButton.textContent = 'Copy Raw HTML';
                        copyButton.classList.remove('copied');
                    }, 2000);
                });

                // Add event listener for the copy email type button
                const copyEmailTypeButton = accordionItem.querySelector('.copy-email-type-button');
                copyEmailTypeButton.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent accordion toggle
                    
                    const templateName = template.replace('.html', '');
                    const emailType = templatesData[templateName]?.EmailType || 'Email Type not found';
                    
                    // Create a temporary textarea element
                    const textarea = document.createElement('textarea');
                    textarea.value = emailType;
                    textarea.style.position = 'fixed';
                    textarea.style.opacity = '0';
                    document.body.appendChild(textarea);
                    
                    // Select and copy the text
                    textarea.select();
                    document.execCommand('copy');
                    
                    // Remove the temporary textarea
                    document.body.removeChild(textarea);
                    
                    // Show feedback
                    copyEmailTypeButton.textContent = 'Copied!';
                    copyEmailTypeButton.classList.add('copied');
                    
                    setTimeout(() => {
                        copyEmailTypeButton.textContent = 'Copy Email Type';
                        copyEmailTypeButton.classList.remove('copied');
                    }, 2000);
                });

                // Add event listener for the copy subject button
                const copySubjectButton = accordionItem.querySelector('.copy-subject-button');
                copySubjectButton.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent accordion toggle
                    
                    const templateName = template.replace('.html', '');
                    const subject = templatesData[templateName]?.Subject || 'Subject not found';
                    
                    // Create a temporary textarea element
                    const textarea = document.createElement('textarea');
                    textarea.value = subject;
                    textarea.style.position = 'fixed';
                    textarea.style.opacity = '0';
                    document.body.appendChild(textarea);
                    
                    // Select and copy the text
                    textarea.select();
                    document.execCommand('copy');
                    
                    // Remove the temporary textarea
                    document.body.removeChild(textarea);
                    
                    // Show feedback
                    copySubjectButton.textContent = 'Copied!';
                    copySubjectButton.classList.add('copied');
                    
                    setTimeout(() => {
                        copySubjectButton.textContent = 'Copy Subject';
                        copySubjectButton.classList.remove('copied');
                    }, 2000);
                });

                // Add event listener for the remove button
                const removeButton = accordionItem.querySelector('.remove-button');
                removeButton.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent accordion toggle
                    accordionItem.remove();
                });

            } catch (error) {
                console.error('Error:', error);
                const errorItem = document.createElement('div');
                errorItem.className = 'accordion-item error';
                errorItem.innerHTML = `
                    <div class="accordion-header">
                        <div class="accordion-title">${template}</div>
                        <div class="accordion-actions">
                            <div class="error-message">Error loading template: ${error.message}</div>
                        </div>
                    </div>
                `;
                accordion.appendChild(errorItem);
            }
        }
    });

    // Update delete button state based on selection
    savedConfigsSelect.addEventListener('change', () => {
        deleteConfigButton.disabled = !savedConfigsSelect.value;
    });

    // Handle configuration deletion
    deleteConfigButton.addEventListener('click', () => {
        const selectedConfig = savedConfigsSelect.value;
        if (!selectedConfig) {
            alert('Please select a configuration to delete');
            return;
        }

        if (confirm(`Are you sure you want to delete the configuration "${selectedConfig}"?`)) {
            // Remove from localStorage
            localStorage.removeItem(`email_template_config_${selectedConfig}`);
            
            // Update the dropdown
            loadSavedConfigurations();
            
            alert(`Configuration "${selectedConfig}" deleted successfully!`);
        }
    });

    // Update the processTemplate function to also update the code preview
    async function processTemplate() {
        // ... existing code ...

        // After processing the template, update both previews
        document.getElementById('previewContent').innerHTML = processedTemplate;
        document.getElementById('codeContent').textContent = processedTemplate;
    }
});

// Copy to clipboard function
function copyToClipboard(button) {
    const previewContent = button.previousElementSibling;
    const textarea = document.createElement('textarea');
    textarea.value = previewContent.innerHTML;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Template copied to clipboard!');
    } catch (err) {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy template to clipboard');
    }
    document.body.removeChild(textarea);
} 