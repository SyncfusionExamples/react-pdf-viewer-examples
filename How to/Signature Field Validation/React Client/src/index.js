/* eslint-disable no-loop-func */
import * as ReactDOM from 'react-dom/client';
import * as React from 'react';
import './index.css';
import {
  PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView,
  ThumbnailView, Print, TextSelection, Annotation, TextSearch, FormFields, FormDesigner, Inject
} from '@syncfusion/ej2-react-pdfviewer';
export function App() {
  var currentUser = "";
  var currentUserColor = "#ff0000";
  var userDetails = [];
  var colorPicker;
  var submitButton;
  var pdfViewer;

  window.onload = function () {
    //create user collections
    userDetails.push(new UserDetails("manager@mycompany.com", "#ff0000", []));
    userDetails.push(new UserDetails("engineer@mycompany.com", "#00ff00", []));
    //retrieve the ej2 control instance
    colorPicker = document.getElementById("colorpicker");
    submitButton = document.getElementById("finishSigningBtn");
    pdfViewer = document.getElementById('pdfviewer').ej2_instances[0];
    submitButton.addEventListener('click', downloadDocument);
    //bind the function to dropdown change
    setCurrentUser('manager@mycompany.com');
    var viewerContainer = document.getElementById("pdfviewer_viewerContainer");
    //checked the form designer toolbar is expand or collapse and update the form fields based on the user type.
    const observer = new MutationObserver(function (mutationsList, observer) {
      for (let mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          // Handle the resize event here
          updateUserFormField();
        }
      }
    });
    observer.observe(viewerContainer, { attributes: true });
  }

  function dropdownChange(e) {
    currentUser = e.target.value;
    updateUserFormField();
  }

  function updateUserFormField() {
    var user = userDetails.filter(userDetail => userDetail.userName === currentUser);
    currentUserColor = colorPicker.value = user[0].userColor;
    //hide the field based on the user type
    var otherUserDetails = userDetails.filter(userDetail => userDetail.userName !== currentUser)[0];
    for (var i = 0; i < otherUserDetails.fieldIds.length; i++) {
      var otherUserField = document.getElementById(otherUserDetails.fieldIds[i].id + "_content_html_element");
      if (!pdfViewer.designerMode) {
        if (otherUserField) {
          pdfViewer.formDesigner.updateFormField(otherUserDetails.fieldIds[i].id, { isReadOnly: true });
          var currentFormField = pdfViewer.formFieldCollections.filter(formField => formField.id === otherUserDetails.fieldIds[parseInt(i.toString(), 10)].id)[0];
          if (!currentFormField.value && otherUserField)
            otherUserField.style.display = 'none';
        }
      } else {
        if (otherUserField) {
          //Show the form fields in designer mode
          pdfViewer.formDesigner.updateFormField(otherUserDetails.fieldIds[i].id, { isReadOnly: false });
          document.getElementById(otherUserDetails.fieldIds[i].id + "_content_html_element").style.display = 'block';
        }
      }
    }
    //show the field based on the user type.
    var currentUserDetails = userDetails.filter(userDetail => userDetail.userName === currentUser)[0];
    for (var j = 0; j < currentUserDetails.fieldIds.length; j++) {
      var currentUserField = document.getElementById(currentUserDetails.fieldIds[j].id + "_content_html_element");
      if (currentUserField) {
        pdfViewer.formDesigner.updateFormField(currentUserDetails.fieldIds[j].id, { isReadOnly: false });
        document.getElementById(currentUserDetails.fieldIds[j].id + "_content_html_element").style.display = 'block';
      }
    }
  }

  // validate the form fields
  function fieldChange(arg) {

    var viewer = pdfViewer;
    var errorMessage = "Required Field(s): ";
    var forms = viewer.formFieldCollections;
    var flag = false;
    var isAllFieldFilled = true;
    var radioGroupName = "";
    for (var i = 0; i < forms.length; i++) {
      var text = "";
      if (forms[i].type.toString() === "Checkbox" && forms[i].isChecked === false) {
        text = forms[i].name;
        isAllFieldFilled = false;
      }
      else if (forms[i].type === "RadioButton" && flag === false) {
        radioGroupName = forms[i].name;
        if (forms[i].isSelected === true)
          flag = true;
      }
      else if (forms[i].type.toString() !== "Checkbox" && forms[i].type !== "RadioButton" && (forms[i].value === "" || ((typeof arg.newValue === 'string') && arg.newValue === ""))) {
        text = forms[i].name;
        isAllFieldFilled = false;
      }
      if (text !== "") {
        if (errorMessage === "Required Field(s): ") {
          errorMessage += text;
        }
        else {
          errorMessage += ", " + text;
        }
      }

    }
    if (!flag && radioGroupName !== "") {
      if (errorMessage === "Required Field(s): ")
        errorMessage += radioGroupName;
      else
        errorMessage += ", " + radioGroupName;
      isAllFieldFilled = false;
    }
    if (isAllFieldFilled) {
      submitButton.disabled = false;
    } else {
      submitButton.disabled = true;
    }

  }

  function addFormField(arg) {
    var col = currentUserColor === '#ff0000' ? 'red' : 'green';
    pdfViewer.formDesigner.updateFormField(arg.field.id, { backgroundColor: col });
    var currentUserDetails = userDetails.filter(userDetail => userDetail.userName === currentUser)[0];
    var currentFormField = pdfViewer.formFieldCollections.filter(formField => formField.id === arg.field.id)[0];
    currentUserDetails.fieldIds.push(currentFormField);
  }

  function downloadDocument(args) {
    pdfViewer.download();
  }

  function setCurrentUser(username) {
    if (userDetails.findIndex(userDetail => userDetail.userName === username) !== -1) {
      currentUser = username;
      document.getElementById('ddlelement').value = currentUser;
      updateUserFormField();
    }
  }

  class UserDetails {
    constructor(userName, userColor, fieldIds) {
      this.userName = userName;
      this.userColor = userColor;
      this.fieldIds = fieldIds;
    }
  }

  return (
    <div>
      <div className="control-container">
        <div className="userContainerRow">
          <div className="column userContainer">
            <div className="user-label-container">
              <div className="user-label">
                Choose the user:
              </div>
              <select id="ddlelement" onChange={dropdownChange}>
                <option value="manager@mycompany.com">manager@mycompany.com</option>
                <option value="engineer@mycompany.com">engineer@mycompany.com</option>
              </select>
            </div>
            <div className="color-label-container">
              <div className="color-label">
                Color:
              </div>
              <input type="color" id="colorpicker" value="#ff0000" disabled={true}></input>
            </div>
          </div>
          <div className="column finishSignBtn">
            <button id="finishSigningBtn" disabled >Finish Signing</button>
          </div>
        </div>
      </div>
      <div className='control-section'>
        <div className="column viewerContainer">
          <PdfViewerComponent
            id="pdfviewer"
            documentPath='fill_and_sign_empty.pdf'
            serviceUrl="https://localhost:44309/pdfviewer"
            enableFormFieldsValidation={true}
            showNotificationDialog={false}
            formFieldAdd={addFormField}
            formFieldPropertiesChange={fieldChange}
            toolbarSettings={{ showTooltip: false, toolbarItems: ["OpenOption", "PageNavigationTool", "MagnificationTool", "FormDesignerEditTool", "PrintOption", "DownloadOption"] }}
            height='640px'>
            {/* Inject the required services */}
            <Inject services={[Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, BookmarkView, ThumbnailView,
              Print, TextSelection, TextSearch, FormFields, FormDesigner]} />
          </PdfViewerComponent>
        </div>
      </div>
    </div>
  );
}
const root = ReactDOM.createRoot(document.getElementById('sample'));
root.render(<App />);