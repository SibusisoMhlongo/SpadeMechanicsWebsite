
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let message = '';

    switch (field.name) {
        case 'name':
            if (!value) {
                isValid = false;
                message = 'Name is required';
            } else if (value.length < 2) {
                isValid = false;
                message = 'Name must be at least 2 characters';
            }
            break;
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) {
                isValid = false;
                message = 'Email is required';
            } else if (!emailRegex.test(value)) {
                isValid = false;
                message = 'Please enter a valid email address';
            }
            break;
        case 'phone':
            const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
            if (!value) {
                isValid = false;
                message = 'Phone number is required';
            } else if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                isValid = false;
                message = 'Please enter a valid phone number';
            }
            break;
        case 'vehicle':
            if (!value) {
                isValid = false;
                message = 'Vehicle information is required';
            }
            break;
        case 'message':
            if (!value) {
                isValid = false;
                message = 'Message is required';
            } else if (value.length < 10) {
                isValid = false;
                message = 'Message must be at least 10 characters';
            }
            break;
    }

    return { isValid, message };
}

function showFieldError(field, message) {
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.style.cssText = `
            color: #dc3545;
            font-size: 0.875rem;
            margin-top: 0.25rem;
        `;
        field.parentNode.appendChild(errorElement);
    }
    errorElement.textContent = message;
    field.style.borderColor = '#dc3545';
}

function hideFieldError(field) {
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
    field.style.borderColor = '#C0C0C0';
}

function initRealTimeValidation(form) {
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            const { isValid, message } = validateField(input);
            if (!isValid) {
                showFieldError(input, message);
            } else {
                hideFieldError(input);
            }
        });

        input.addEventListener('input', () => {
            if (input.parentNode.querySelector('.field-error')) {
                const { isValid } = validateField(input);
                if (isValid) {
                    hideFieldError(input);
                }
            }
        });
    });
}

function handleFormSubmission(form, e) {
    e.preventDefault();

    const inputs = form.querySelectorAll('input, textarea');
    let isFormValid = true;

    inputs.forEach(input => {
        const { isValid, message } = validateField(input);
        if (!isValid) {
            showFieldError(input, message);
            isFormValid = false;
        } else {
            hideFieldError(input);
        }
    });

    if (isFormValid) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        const formData = {};
        inputs.forEach(input => {
            formData[input.name] = input.value;
        });
        formData.timestamp = new Date().toISOString();

        const storedSubmissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
        storedSubmissions.push(formData);
        localStorage.setItem('formSubmissions', JSON.stringify(storedSubmissions));

        setTimeout(() => {
            submitBtn.textContent = 'Sent Successfully!';
            submitBtn.style.backgroundColor = '#28a745';

            setTimeout(() => {
                form.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                submitBtn.style.backgroundColor = '';
                inputs.forEach(input => hideFieldError(input));
            }, 2000);
        }, 1000);
    }
}

function initForms() {
    const forms = document.querySelectorAll('.contact-form');
    forms.forEach(form => {
        initRealTimeValidation(form);
        form.addEventListener('submit', (e) => handleFormSubmission(form, e));
    });
}

window.FormsModule = {
    initForms,
    validateField,
    showFieldError,
    hideFieldError
};
