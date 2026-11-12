# Button Form Field in React PDF Viewer

This sample demonstrates the **button form field** in the Syncfusion React PDF Viewer. It shows how to add button fields programmatically, place button fields interactively using the form designer, modify the properties and actions of existing button fields, and remove button fields.

## What is covered

- **Add a button field programmatically** with `formDesignerModule.addFormField('ButtonField', { ... })`.
- **Place a button field interactively** by switching the designer into button field mode with `formDesignerModule.setFormFieldMode('ButtonField')` and clicking on the document.
- **Update button field properties** such as text, tooltip, alignment, and actions using `formDesignerModule.updateFormField(...)`.
- **Assign button actions** such as navigating to a specific page and zoom location when the button is clicked.
- **Delete a button field** with `formDesignerModule.deleteFormField(...)`.

The fields created through the PDF Viewer UI are also listed in the edit panel, allowing existing button fields to be modified or removed regardless of how they were created.

## Add a button field programmatically

```JSX
const viewer = viewerRef.current;

viewer.formDesignerModule.addFormField('ButtonField', {
  name: 'Submit1',
  pageNumber: 1,
  bounds: {
    X: 100,
    Y: 350,
    Width: 120,
    Height: 32
  },
  value: 'Submit',
  text: 'Submit',
  tooltip: 'Click to submit',
  actions: {
    mouseUp: {
      action: ActionType.GoTo,
      destinationPageNumber: 5,
      destinationLocation: {
        x: 100,
        y: 100
      },
      zoomValue: 2
    }
  }
});
```

## Place a button field interactively

```JSX
const viewer = viewerRef.current;

// Switches the form designer into button field placement mode.
viewer.formDesignerModule.setFormFieldMode('ButtonField');
```

After the mode is enabled, click on the page to place a button field and configure its properties.

## Update an existing button field

```JSX
const viewer = viewerRef.current;

const field = viewer.formFieldCollections.find(
  (f) => f.id === selectedFieldId
);

viewer.formDesignerModule.updateFormField(field, {
  value: 'Submit Button',
  text: 'Submit Button',
  alignment: 'Left',
  tooltip: 'Updated Submit Button',
  actions: {
    mouseUp: {
      action: ActionType.GoTo,
      destinationPageNumber: 7,
      destinationLocation: {
        x: 100,
        y: 100
      },
      zoomValue: 1
    }
  }
});
```

## Configure button actions

The sample demonstrates how to associate an action with a button field. When the user clicks the button, the PDF Viewer navigates to a specified page and location in the document.

```JSX
actions: {
  mouseUp: {
    action: ActionType.GoTo,
    destinationPageNumber: 7,
    destinationLocation: {
      x: 100,
      y: 100
    },
    zoomValue: 1
  }
}

```

## Remove a button field

```JSX
const viewer = viewerRef.current;

viewer.formDesignerModule.deleteFormField(field);
```

## Run the sample

```Shell
npm install
npm start
```

Once the sample is running, use the **Add Button Field** option to create button fields programmatically, **Enable Button Designer Mode** to place button fields interactively, and the **Edit Button Field** section to update or remove existing button fields.

## Learn more

- [React PDF Viewer Documentation](https://help.syncfusion.com/document-processing/pdf/pdf-viewer/react/getting-started)
- [Form Designer API Reference](https://ej2.syncfusion.com/react/documentation/api/pdfviewer/formdesigner)
