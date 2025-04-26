document.addEventListener('DOMContentLoaded', function() {
    const processButton = document.getElementById('processButton');
    const previewContent = document.getElementById('previewContent');
    const templateSelect = document.getElementById('template');
    const saveButton = document.getElementById('saveButton');
    const applyButton = document.getElementById('applyButton');
    const configNameInput = document.getElementById('config_name');
    const savedConfigsSelect = document.getElementById('saved_configs');

    // Template selection elements
    const dropdownHeader = document.getElementById('dropdownHeader');
    const dropdownContent = document.getElementById('dropdownContent');
    const templateSearch = document.getElementById('templateSearch');
    const selectedTemplates = document.getElementById('selectedTemplates');

    // Set to store selected template values
    const selectedTemplateValues = new Set();

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
            subscribe_page_link: document.getElementById('subscribe_page_link').value,
            template: templateSelect.value
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

        // Get the saved configuration
        const savedConfig = JSON.parse(localStorage.getItem(`email_template_config_${selectedConfig}`));
        
        // Apply values to form fields
        document.getElementById('title_name').value = savedConfig.title_name || '';
        document.getElementById('title_url').value = savedConfig.title_url || '';
        document.getElementById('title_domain_name').value = savedConfig.title_domain_name || '';
        document.getElementById('customer_service_email').value = savedConfig.customer_service_email || '';
        document.getElementById('address').value = savedConfig.address || '';
        document.getElementById('logo_url').value = savedConfig.logo_url || '';
        document.getElementById('twitter_url').value = savedConfig.twitter_url || '';
        document.getElementById('facebook_url').value = savedConfig.facebook_url || '';
        document.getElementById('contact_url').value = savedConfig.contact_url || '';
        document.getElementById('privacy_url').value = savedConfig.privacy_url || '';
        document.getElementById('terms_url').value = savedConfig.terms_url || '';
        document.getElementById('subscribe_page_link').value = savedConfig.subscribe_page_link || '';
        templateSelect.value = savedConfig.template || '';
        
        alert(`Configuration "${selectedConfig}" applied successfully!`);
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

    // Handle template selection
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
    });

    // Handle tag removal
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
        }
    });

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

        previewContent.innerHTML = '';

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
                    html = html.replace(new RegExp(placeholder, 'g'), value || ''); // Handle undefined values
                }

                // Create template section
                const templateSection = document.createElement('div');
                templateSection.className = 'template-preview';
                templateSection.innerHTML = `
                    <h3>${template}</h3>
                    <div class="preview-content">${html}</div>
                    <button class="copy-button" onclick="copyToClipboard(this)">Copy to Clipboard</button>
                `;
                previewContent.appendChild(templateSection);

            } catch (error) {
                console.error('Error:', error);
                const errorSection = document.createElement('div');
                errorSection.className = 'template-preview error';
                errorSection.innerHTML = `<div class="error">Error loading template ${template}: ${error.message}</div>`;
                previewContent.appendChild(errorSection);
            }
        }
    });
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