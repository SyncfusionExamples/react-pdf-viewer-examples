import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { FormValidator } from '@syncfusion/ej2-inputs';

function RecipientSetup() {
    const navigate = useNavigate();
    // State to manage a list of recipients (e.g., for sharing or notifications)
    const [recipients, setRecipients] = useState([{ userName: '', userEmail: '' }]);
    // Ref to access the form DOM element for validation or reset
    const formRef = useRef<HTMLFormElement>(null);
    // Ref to hold the form validator instance (e.g., for triggering validation programmatically)
    const validatorRef = useRef<FormValidator | null>(null);
    // Ref to access the button component for enabling/disabling it based on form state
    const formBtnRef = useRef<ButtonComponent | null>(null);
    // State to manage the height of the card containing the recipient form
    const [cardHeight, setCardHeight] = useState('400px'); 

  useEffect(() => {
        if(formRef.current) {
            const dynamicRules: Record<string, any> = {};

            recipients.forEach((_, idx) => {
                dynamicRules[`name_${idx}`] = {
                    required: [true, '* Name is required'],
                    minLength: [3, '* Name must be at least 3 characters']
                };
                dynamicRules[`email_${idx}`] = {
                    required: [true, '* Email is required'],
                    email: [true, '* Please enter a valid email']
                };
            });
          
            if (validatorRef.current) {
                // Update existing validator rules without destroying it
                validatorRef.current.rules = dynamicRules;
            } else {
                // Create new validator only if it doesn't exist
                validatorRef.current = new FormValidator(formRef.current, {
                    rules: dynamicRules
                });
            }
        }
    }, [recipients]);

    // Adds a new empty recipient to the list
    const addRecipient = () => {
        const newRecipients = [...recipients, { userName: '', userEmail: '' }];
        setRecipients(newRecipients);

        if (formBtnRef.current)
            formBtnRef.current.disabled = false;

        // Set card height to 500px if there is at least one recipient
        if (newRecipients.length > 0)
            setCardHeight('500px');
        else
            setCardHeight('400px');
    };

    // Updates a specific field (userName or userEmail) of a recipient at a given index
    const recipientChange = (index: number, field: 'userName' | 'userEmail', value: string) => {
        const updatedRecipients = [...recipients];
        updatedRecipients[index][field] = value;
        setRecipients(updatedRecipients);
    };

    // Removes a recipient from the list by index
    const removeRecipient = (index: number) => {
        const updatedRecipients = recipients.filter((_, i) => i !== index);
        setRecipients(updatedRecipients);        

        if (updatedRecipients.length > 1)
            setCardHeight('500px');
        else
            setCardHeight('400px');        

        if (updatedRecipients.length === 0) {
            if (formBtnRef.current)
                formBtnRef.current.disabled = true;
        }
    };

    // Handles form submission: validates input, stores data, and navigates to the PDF viewer
    const formSubmit = (event: React.FormEvent) => {       
        event.preventDefault();
        if (validatorRef.current && validatorRef.current.validate()) {
            const validRecipients = recipients.filter(
                r => r.userName.trim() !== '' && r.userEmail.trim() !== ''
            );
            localStorage.setItem('recipients', JSON.stringify(validRecipients));
            navigate('/pdf-viewer');
        }
    };

    // Renders the recipient input form UI with dynamic fields and a submit button
    return (
        <div className="user-login-container" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: '#f5f5f5',
            paddingTop: 0
        }}>
            <div className="e-card" style={{ height: cardHeight }} >
                {/* Header section with title and add button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <div style={{ padding: '12px 24px', fontWeight: 'bold', fontSize: '18px', }}>
                        Add recipients
                    </div>
                    <ButtonComponent
                        id='addRecipientButton'
                        content="+Add recipients"
                        onClick={addRecipient}
                    />
                </div>

                {/* Form for entering recipient details */}
                <form id="userForm" ref={formRef} onSubmit={formSubmit}>
                    {recipients.map((recipient, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
                            <div style={{ display: 'flex', gap: '30px', alignItems: 'center', width: '80%' }}>
                                {/* Recipient Name Field */}
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Recipient Name</label>
                                    <TextBoxComponent                                       
                                        placeholder="Enter recipient name"
                                        floatLabelType="Auto"
                                        cssClass="e-outline"
                                        value={recipient.userName}
                                        name={`name_${idx}`}
                                        input={(e) => recipientChange(idx, 'userName', e.value)}
                                    />
                                </div>

                                {/* Recipient Email Field */}
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Recipient Email</label>
                                    <TextBoxComponent
                                        placeholder="Enter recipient email"
                                        floatLabelType="Auto"
                                        cssClass="e-outline"
                                        value={recipient.userEmail}
                                        name={`email_${idx}`}
                                        input={(e) => recipientChange(idx, 'userEmail', e.value)}
                                    />                                    
                                </div>

                                {/* Remove recipient button */}
                                <ButtonComponent
                                    cssClass="e-flat e-danger"
                                    iconCss="e-icons e-trash"
                                    style={{ marginTop: '22px', height: '40px', width: '40px' }}
                                    onClick={() => removeRecipient(idx)}
                                />
                            </div>
                        </div>
                    ))}

                    {/* Submit button */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
                        <ButtonComponent
                            ref={formBtnRef}
                            isPrimary={true}
                            cssClass="e-success"
                            type="submit"
                            style={{ width: '40%', height: '40px' }}
                        >
                            Continue to Form Creation
                        </ButtonComponent>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default RecipientSetup;