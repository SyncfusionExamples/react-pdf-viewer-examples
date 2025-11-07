import { useEffect, useRef, useState } from 'react';
import {
    PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView,
    ThumbnailView, Print, TextSelection, Annotation, TextSearch, FormFields, FormDesigner, Inject
} from '@syncfusion/ej2-react-pdfviewer';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { ButtonComponent, RadioButtonComponent } from '@syncfusion/ej2-react-buttons';
import { ToolbarComponent, ItemDirective, ItemsDirective } from '@syncfusion/ej2-react-navigations';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';

interface UserDetails {
    Name: string;
    Mail: string;
    fieldIds: string[];
}

function PdfViewer() {
    // Reference to access PDF viewer methods (e.g., retrieveFormFields, updateFormField)
    const pdfViewer = useRef<PdfViewerComponent>(null);
    // Reference to access the selected radio button component
    const radioBtnRef = useRef<RadioButtonComponent>(null);
    // State to control the visibility of the dialog
    const [status, setStatus] = useState({ hideDialog: false });
    // State to hold user details, which can be loaded from localStorage or an API
    const [userDetails, setUserDetails] = useState<UserDetails[]>([]);
    // Add a state to store user colors
    const [userColors, setUserColors] = useState<{ [email: string]: string }>({});
    // Variable to store the currently selected user from the radio buttons
    const [selectedUser, setSelectedUser] = useState(userDetails[0]?.Name || '');
    const [showDropdown, setShowDropdown] = useState(false); // Initially false: show user cards
    const userMenu = useRef<DropDownListComponent>(null);
    const fields = {
        text: 'Name',  // property to display in dropdown
        value: 'Mail', // property to use as the value
    };
    // Stores the current user's color for UI styling
    let userColour = useRef<string>(''); 
    // Tracks the email of the currently active user
    let currentUser = useRef<string>(''); 
    // Reference to the "Finish Signing" button component
    let btnElement = useRef<ButtonComponent>(null); 

    const recipientCount = userDetails.length; 
    const rowHeight = 36; // Height allocated per recipient row in the dialog
    const baseHeight = 100; // Minimum height of the dialog without any recipients
    const dialogHeight = baseHeight + recipientCount * rowHeight; // Final calculated height of the dialog based on recipient count

    const hasLongName = userDetails.some(user => user.Name.length > 5);
    const baseWidth = hasLongName ? 350 : 250;
    const widthPerRecipient = recipientCount > 2 ? 60 : 30; // 60px increments for 3+ users, else 30px
    const maxDialogWidth = 600; // Maximum allowed width for the dialog
    const dialogWidth = Math.min(baseWidth + recipientCount * widthPerRecipient, maxDialogWidth); // Final calculated width of the dialog, capped at maxDialogWidth

    // Set the default selected user when userDetails are loaded
    useEffect(() => {
        if (userDetails.length > 0) {
            setSelectedUser(userDetails[0].Name);
        }
    }, [userDetails]);

    // Load recipients from localStorage, convert them to userDetails format, and merge without duplicates
    useEffect(() => {
        const storedRecipients = localStorage.getItem('recipients');
        try {
            let fieldId = 0;
            const newUsers: UserDetails[] = [];

            if (storedRecipients) {
                const recipients = JSON.parse(storedRecipients);
                recipients.forEach((r: any) => {
                    newUsers.push({
                        Name: r.userName,
                        Mail: r.userEmail,
                        fieldIds: [fieldId.toString()]
                    });
                    fieldId++;
                });
            }

            setUserDetails(prev => {
                const existingEmails = new Set(prev.map(u => u.Mail));
                const filteredNewUsers = newUsers.filter(u => !existingEmails.has(u.Mail));
                return [...filteredNewUsers, ...prev];
            });
        } catch (error) {
            console.error("Error parsing user info or recipients:", error);
        }
    }, []);

    // Initialize and attach a spinner to the container element on component mount
    useEffect(() => {
        const spinnerTarget = document.getElementById('container');
        if (spinnerTarget) {
            createSpinner({ target: spinnerTarget });
        }
    }, []);

    // Closes the dialog by updating the visibility state
    function dialogClose() {
        setStatus({ hideDialog: false });
    }

    // Triggered when a form field is added; opens the user selection dialog
    const formFieldAdd = (args: any) => {
        setStatus({ hideDialog: true });
    }

    const getRandomLightColor = (): string => {
        // Generate RGB values between 180 and 255 for light colors
        const r = Math.floor(180 + Math.random() * 75);
        const g = Math.floor(180 + Math.random() * 75);
        const b = Math.floor(180 + Math.random() * 75);
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };

    const hexToRgba = (hex: string, alpha: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r},${g},${b},${alpha})`;
    };

    // Handles the Submit button click after user selection
    const userSelectionSubmit = () => {
        setSelectedUser(radioBtnRef.current?.getSelectedValue() || '');

        setStatus({ hideDialog: false });
        dialogClose();

        // Get the last added form field
        const formFields = pdfViewer.current?.retrieveFormFields();
        const lastField = formFields?.[formFields.length - 1];

        // Find the selected user's details
        const user = userDetails.find(u => u.Name === selectedUser);

        if (lastField && user) {
            let color = userColors[user.Mail];
            if (!color) {
                color = getRandomLightColor();
                setUserColors(prev => ({ ...prev, [user.Mail]: color }));
            }

            // Check if the field is a signature field (adjust property as needed)
            const isSignatureField = lastField.type === 'SignatureField' || lastField.name?.toLowerCase().includes('sign');

            // Use 40% opacity for signature fields, solid for others
            userColour.current = isSignatureField ? hexToRgba(color, 0.4) : color;

            pdfViewer.current?.formDesigner.updateFormField(
                lastField,
                {
                    customData: {
                        name: user.Name,
                        email: user.Mail
                    },
                    name: `${user.Name || ""} ${lastField.name || ""}`.trim(),
                    backgroundColor: userColour.current,
                    isRequired: true,
                    borderColor: '#303030'
                } as any
            );
        }
    };

    // Updates the selected user when a radio button is changed
    const userChange = (args: any) => {
        setSelectedUser(args.value);
    };

    // Renders the user dropdown component for selecting a signer
    const dropdownComponent = () => {
        return (
            <div id='e-pv-e-sign-user-field' style={{ width: '215px', height: '37px', left: '5px' }}>
                <div className='e-pv-e-sign-user-dropdown' >
                    <DropDownListComponent ref={userMenu} id='userMenu' select={dropdownUserChange} index={0} popupWidth={'215px'} dataSource={userDetails as any} width={'200px'} fields={fields} itemTemplate={itemTemplate} valueTemplate={valueTemplate} ></DropDownListComponent>
                </div>
            </div>
        );
    }

    // Custom template for rendering each item in the dropdown list
    const itemTemplate = (data: any) => {
        return (
            <div style={{ display: 'flex' }}>
                <img className="e-pv-e-sign-empImage" style={{ maxHeight: '35px', marginTop: '7px', marginLeft: '4px', borderRadius: '50%', border: `1px solid ${userColour.current}` }}
                    src={"../assets/User.png"}
                />
                <div>
                    <div className="e-pv-e-sign-ename" style={{ height: '18px', fontSize: '13px' }}> {data.Name} </div>
                    <div className="e-pv-e-sign-job" style={{ fontSize: '11px' }} > {data.Mail} </div>
                </div>
            </div>
        );
    }

    // Custom template for displaying the selected value in the dropdown
    const valueTemplate = (data: any) => {
        return (<div className="e-pv-e-sign valueTemplate" style={{ display: 'flex', marginLeft: '2px' }}>
            <img className="e-pv-e-sign-value" style={{ borderRadius: '20px', marginTop: '1px', border: userColour.current }} src={"../assets/User.png"} height="30px" width="30px" alt="employee" />
            <div>
                <div className="e-pv-e-sign-name" style={{ fontSize: '12px', marginLeft: '12px', alignContent: 'center' }}> {data.Name} </div>
                <div className="e-pv-e-sign-job" style={{ fontSize: '10px', marginLeft: '11px', alignContent: 'center' }}> {data.Mail} </div>
            </div>
        </div>);
    };

    // Renders the "Finish Signing" button
    const buttonComponent = () => {
        return (<ButtonComponent ref={btnElement} id='e-pv-e-sign-finishbtn' cssClass="e-outline" onClick={finishSigning} created={disableFinishButtonOnInit}>Finish Signing</ButtonComponent>);
    }

    // Disables the "Finish Signing" button when the component is first created
    const disableFinishButtonOnInit = () => {
        if (btnElement.current)
            btnElement.current.disabled = true;
    }

    // Renders user cards with image, name, and email in a horizontal layout
    const userCardComponent = () => {
        return (
            <div style={{ display: 'flex', gap: '20px' }}>
                {userDetails.map((user, idx) => (
                    <div
                        key={idx}
                        style={{
                            border: '1px solid #000', borderRadius: '6px', padding: '8px 16px', minWidth: '220px',
                            display: 'flex', alignItems: 'center', background: '#fff', height: '25px'
                        }}
                    >
                        <img
                            src={"../assets/User.png"}
                            alt="user"
                            style={{
                                width: '30px', height: '30px', borderRadius: '50%', marginRight: '12px', border: '1px solid #ccc'
                            }}
                        />
                        <div>
                            <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '2px' }}>
                                {user['Name'] as string}
                            </div>
                            <div style={{ fontSize: '11px', color: '#555' }}>
                                {user['Mail'] as string}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // Renders the dialog content with user selection and submit button
    const getRecipientDialogContent = () => {
        return (
            <div className="dialog-content">
                <p style={{ fontWeight: 'bold', fontSize: '16px' }}>
                    Select the User:
                </p>
                <div className="radio-options" style={{ display: 'flex', gap: '50px', marginTop: '30px', }}>
                    {userDetails.map((user, index) => (
                        <div className="radio-item" key={index}>
                            <RadioButtonComponent
                                ref={radioBtnRef}
                                label={user.Name}
                                name="userType"
                                value={user.Name}
                                checked={selectedUser === user.Name}
                                change={userChange}
                            />
                        </div>
                    ))}
                </div>
                <div className="button-container" style={{ marginTop: '25px', textAlign: 'center' }}>
                    <ButtonComponent className="e-btn e-primary" style={{ width: '80%', borderRadius: '5px' }} onClick={userSelectionSubmit}>Submit</ButtonComponent>
                </div>
            </div>
        );
    };

     // Initializes event listener for closing the form designer and shows the user dropdown
    const documentLoaded = () => {
        document.getElementById("pdfViewer_formdesigner_closeContainer")?.addEventListener("click", async function () {
            setShowDropdown(true);
            if (pdfViewer.current)
                pdfViewer.current.designerMode = false;
            showOnlyCurrentUserFields();
        })

    }

    // Displays only the form fields assigned to the current user and hides others
    const showOnlyCurrentUserFields = () => {
        const formFields = pdfViewer.current?.retrieveFormFields();
        currentUser.current = userDetails[0].Mail;
        if (!formFields || !currentUser.current) return;

        formFields.forEach(field => {
            const fieldEmail = (field.customData as { email?: string })?.email;
            // Show fields of current user, hide others
            pdfViewer.current?.formDesigner.updateFormField(field, {
                visibility: fieldEmail === currentUser.current ? 'visible' : 'hidden'
            } as any);
        });
    };

    // Handles user selection change in the dropdown
    const dropdownUserChange = (args: any) => {
        const selectedMail = args.itemData.Mail;
        const selectedIdx = userDetails.findIndex(u => u.Mail === selectedMail);

        // Validate all previous users, on first invalid - show error, block switch
        for (let i = 0; i < selectedIdx; i++) {
            const prevUser = userDetails[i];
            const prevUserFields = pdfViewer.current?.formFieldCollections?.filter(
                (field: any) => (field.customData && field.customData.email === prevUser.Mail)
            );
            // If any previous user's fields are invalid, cancel the dropdown change and show 
            if (!validateFormFields(prevUserFields || [], prevUser.Name)) {
                args.cancel = true;
                // Optionally, show which user needs to finish:
                pdfViewer.current?.showNotificationPopup(
                    `Please complete all required fields for user: ${prevUser.Name}`
                );
                return;
            }
        }

        // Proceed to update field visibility and editability based on selected user
        const fieldCollection = pdfViewer.current?.formFieldCollections;
        if (fieldCollection) {
            for (let i = 0; i < fieldCollection.length; i++) {
                const customData = fieldCollection[i]?.customData as any;
                if (!customData) continue;

                const fieldUserIdx = userDetails.findIndex(u => u.Mail === customData.email);

                // For the selected user: show fields as editable
                if (fieldUserIdx === selectedIdx) {
                    pdfViewer.current?.formDesigner.updateFormField(fieldCollection[i], {
                        visibility: 'visible',
                        isReadOnly: false,
                    } as any);
                }
                // For users before the selected one: show fields as read-only
                else if (fieldUserIdx < selectedIdx) {
                    pdfViewer.current?.formDesigner.updateFormField(fieldCollection[i], {
                        visibility: 'visible',
                        isReadOnly: true,
                    } as any);
                }

                // For users after the selected one: hide fields and make them read-only
                else {
                    pdfViewer.current?.formDesigner.updateFormField(fieldCollection[i], {
                        visibility: 'hidden',
                        isReadOnly: true,
                    } as any);
                }

            }
        }
    };

    // Validates previous users' fields before allowing dropdown selection change and updates field visibility accordingly.
    function validateFormFields(fieldsToCheck: any[], userLabel?: string, showPopup = true): boolean {
        let missingFields: string[] = [];
        let radioGroups: Record<string, boolean> = {};

        for (const field of fieldsToCheck) {
            if (!field.isRequired) continue;

            if (field.type === "Checkbox" && !field.isChecked) {
                missingFields.push(field.name);
            } else if (field.type === "RadioButton") {
                if (!radioGroups[field.name]) radioGroups[field.name] = false;
                if (field.isSelected) radioGroups[field.name] = true;
            } else if (field.type === "DropdownList" && (!field.value || field.value.length === 0)) {
                missingFields.push(field.name);
            } else if (
                field.type !== "Checkbox" &&
                field.type !== "RadioButton" &&
                field.type !== "DropdownList" &&
                (!field.value || (typeof field.value === "string" && field.value.trim() === ""))
            ) {
                missingFields.push(field.name);
            }
        }

        // After loop: find any radio groups with no selection
        Object.entries(radioGroups).forEach(([group, selected]) => {
            if (!selected) missingFields.push(group);
        });

        if (missingFields.length > 0) {
            if (showPopup) {
                const msgUser = userLabel || "User";
                const fieldsList = missingFields.join(', ');
                const errorMessage = `<b>${msgUser}</b> hasn't signed the document.<br><br><b>Required fields:</b> ${fieldsList}`;
                pdfViewer.current?.showNotificationPopup(errorMessage);
            }
            return false;
        }
        return true;
    }

    // Checks all required form fields on change and enables/disables the finish button based 
    const fieldChange = (args: any) => {
        const forms = pdfViewer.current?.formFieldCollections || [];
        const missingFields: Set<string> = new Set();
        const radioGroups: Record<string, boolean> = {};

        forms.forEach(form => {
            if (!form.isRequired) return;
            const type = form.type;
            const name = String(form.name);

            switch (type as any) {
                case "Checkbox":
                    if (!form.isChecked) missingFields.add(name);
                    break;
                case "RadioButton":
                    if (!(name in radioGroups)) radioGroups[name] = false;
                    if (form.isSelected) radioGroups[name] = true;
                    break;
                case "DropdownList":
                    if (!form.value || (Array.isArray(form.value) && form.value.length === 0)) missingFields.add(name);
                    break;
                default:
                    const valueIsEmpty =
                        !form.value ||
                        (typeof form.value === "string" && form.value.trim() === "") ||
                        (typeof args.newValue === "string" && args.newValue.trim() === "");
                    if (valueIsEmpty) missingFields.add(name);
            }
        });

        // After iteration, check for required radio groups not selected
        Object.keys(radioGroups).forEach(group => {
            if (!radioGroups[group]) missingFields.add(group);
        });

        //Enable the finish button once all required fields filled
        if (missingFields.size > 0) {
            if (btnElement.current) btnElement.current.disabled = true;
        } else {
            if (btnElement.current) btnElement.current.disabled = false;
            if (pdfViewer.current) pdfViewer.current.enableDownload = true;
        }
    };
   
    // Handles the final signing process: saves the PDF, sends it to the server, downloads the signed version, and disables UI controls
    const finishSigning = () => {
        // Show the spinner when signing starts
        const spinnerTarget = document.getElementById('container');
        if (spinnerTarget) showSpinner(spinnerTarget);
        const url = "https://ej2services.syncfusion.com/react/development/api/pdfviewer/FlattenDownload";
        pdfViewer.current?.saveAsBlob().then((blob) => {
            return convertBlobToBase64(blob);
        }).then((base64String) => {
            const httpResponse = new XMLHttpRequest();
            httpResponse.open('POST', url, true);
            httpResponse.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
            const requestData = JSON.stringify({ base64String });
            httpResponse.onload = () => {
                // Always hide spinner at end (success or error)
                if (spinnerTarget) hideSpinner(spinnerTarget);
                if (httpResponse.status === 200) {
                    const responseBase64 = httpResponse.responseText.split('base64,')[1];
                    if (responseBase64) {
                        const blob = createBlobFromBase64(responseBase64, 'application/pdf');
                        const blobUrl = URL.createObjectURL(blob);
                        downloadDocument(blobUrl);
                        pdfViewer.current?.load(httpResponse.responseText, "");
                        if (btnElement.current)
                            btnElement.current.disabled = true;
                        if (userMenu.current)
                            userMenu.current.enabled = false;
                    } else {
                        console.error('Invalid base64 response.');
                    }
                } else {
                    console.error('Download failed:', httpResponse.statusText);
                }
            };
            httpResponse.onerror = () => {
                if (spinnerTarget) hideSpinner(spinnerTarget);
                console.error('An error occurred during the download:', httpResponse.statusText);
            };
            httpResponse.send(requestData);
        }).catch((error) => {
            if (spinnerTarget) hideSpinner(spinnerTarget);
            console.error('Error saving Blob:', error);
        });
    }   

    // Converts a Blob object to a Base64-encoded string
    const convertBlobToBase64 = (blob: any) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
                if (typeof reader.result === 'string') {
                    resolve(reader.result);
                } else {
                    reject(new Error('Failed to convert Blob to Base64'));
                }
            };
            reader.onerror = (error) => reject(error);
        });
    };

    // Creates a Blob object from a Base64 string and specified content type
    const createBlobFromBase64 = (base64String: any, contentType: any) => {
        const sliceSize = 512;
        const byteCharacters = atob(base64String);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, { type: contentType });
    };

    // Triggers download of the signed PDF document using a blob URL
    const downloadDocument = (blobUrl: any) => {
        const anchorElement = document.createElement('a');
        anchorElement.href = blobUrl;
        anchorElement.target = '_parent';

        const downloadFileName = pdfViewer.current?.fileName || 'default.pdf';
        anchorElement.download = downloadFileName.endsWith('.pdf')
            ? downloadFileName
            : `${downloadFileName.split('.pdf')[0]}.pdf`;

        document.body.appendChild(anchorElement);
        anchorElement.click();
        document.body.removeChild(anchorElement);
        URL.revokeObjectURL(blobUrl);
    };

    return (
        <div>
            {/* Toolbar displaying user cards (e.g., name, email, image) */}
            <div>
                <ToolbarComponent id="e-pv-e-sign-toolbar-user-viewer" style={{ padding: '5px 0px' }}>
                    <ItemsDirective>
                        <ItemDirective template={showDropdown ? dropdownComponent : userCardComponent} />
                        {showDropdown && (
                            <ItemDirective align='Right' template={buttonComponent} />
                        )}
                    </ItemsDirective>
                </ToolbarComponent>
            </div>

            {/* PDF Viewer with form designer and other tools enabled */}
            <PdfViewerComponent
                id="pdfViewer"
                ref={pdfViewer}
                resourceUrl="https://cdn.syncfusion.com/ej2/26.2.11/dist/ej2-pdfviewer-lib"
                style={{ height: "calc(100vh - 70px)"}}
                enableToolbar={true}
                documentPath={window.location.origin + "/assets/SoftwareLicenseAgreement.pdf"}
                formFieldAdd={formFieldAdd}
                isFormDesignerToolbarVisible={true}
                documentLoad={documentLoaded}
                showNotificationDialog={false}
                formFieldPropertiesChange={fieldChange}
                enableDownload = {false}
            >
                {/* Inject required PDF viewer services and features */}
                <Inject services={[
                    Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, TextSearch, FormFields, FormDesigner
                ]} />
            </PdfViewerComponent>

            {/* Dialog for selecting user type (Licensee or Licensor) */}
            <div>
                <DialogComponent
                    style={{ height: `${dialogHeight}px`, padding: '0px 20px' }}
                    width={`${dialogWidth}px`}
                    target='#pdfViewer'
                    visible={status.hideDialog}
                    close={dialogClose}
                    isModal={true}
                >
                    {getRecipientDialogContent()}
                </DialogComponent>
            </div>

            {/* Container element used as the target for loading spinner and layout wrapper */}
            <div id="container" className="control-section col-lg-12 spinner-target"></div>
        </div>
    );
}

export default PdfViewer;

