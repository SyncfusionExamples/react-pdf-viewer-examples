import * as ReactDOM from 'react-dom';
import * as React from 'react';
import './index.css';
import { PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, Annotation, TextSearch, FormFields, FormDesigner, Inject } from '@syncfusion/ej2-react-pdfviewer';
import { CheckBoxComponent } from '@syncfusion/ej2-react-buttons';

export function App() {
    let menuItems = [
        {
            text: 'Search In Google',
            id: 'search_in_google',
            iconCss: 'e-icons e-de-ctnr-find'
        },
        {
            text: 'Lock Annotation',
            iconCss: 'e-icons e-lock',
            id: 'lock_annotation'
        },
        {
            text: 'Unlock Annotation',
            iconCss: 'e-icons e-unlock',
            id: 'unlock_annotation'
        },
        {
            text: 'Lock Form Fields',
            iconCss: 'e-icons e-lock',
            id: 'read_only_true'
        },
        {
            text: 'Unlock Form Fields',
            iconCss: 'e-icons e-unlock',
            id: 'read_only_false'
        },
    ];
return (<div>
    <tr>
        <td className='left-side-property'>Hide Default Context Menu</td>
        <td>
            <CheckBoxComponent ref={(scope) => { enableObj = scope; }} cssClass="multiline" id="hide-default-context-menu" change={contextmenuHelper}></CheckBoxComponent>
        </td>
    </tr>
    <tr>
        <td className='left-side-property'>Add Custom option at bottom</td>
        <td>
            <CheckBoxComponent ref={(scope) => { positionObj = scope; }} cssClass="multiline" id="show-custom-menu-bottom" change={contextmenuHelper}></CheckBoxComponent>
        </td>
    </tr>
    <div className='control-section'>
        <PdfViewerComponent id="container" documentPath="PDF_Succinctly.pdf" serviceUrl="https://ej2services.syncfusion.com/production/web-services/api/pdfviewer" documentLoad={documentLoad} customContextMenuSelect = {customContextMenuSelect} customContextMenuBeforeOpen = {customContextMenuBeforeOpen} style={{ 'height': '640px' }}>
            <Inject services={[Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, TextSearch, FormFields, FormDesigner]}/>
        </PdfViewerComponent>
    </div>
</div>);

    function documentLoad(args) {
        viewer.addCustomMenu(menuItems, false, false);
    }

    function customContextMenuSelect(args) {
        switch (args.id) {
            case 'search_in_google':
                for (var i = 0; i < viewer.textSelectionModule.selectionRangeArray.length; i++) {
                    var content = viewer.textSelectionModule.selectionRangeArray[i].textContent;
                    if ((viewer.textSelectionModule.isTextSelection) && (/\S/.test(content))) {
                        window.open('http://google.com/search?q=' + content);
                    }
                }
                break;
            case 'lock_annotation':
                lockAnnotations(args);
                break;
            case 'unlock_annotation':
                unlockAnnotations(args);
                break;
            case 'read_only_true':
                setReadOnlyTrue(args);
                break;
            case 'read_only_false':
                setReadOnlyFalse(args);
                break;
            default:
                break;
        }
    }

    function customContextMenuBeforeOpen(args) {
        for (var i = 0; i < args.ids.length; i++) {
            var search = document.getElementById(args.ids[i]);
            if (search) {
                search.style.display = 'none';
                if (args.ids[i] === 'search_in_google' && (viewer.textSelectionModule) && viewer.textSelectionModule.isTextSelection) {
                    search.style.display = 'block';
                } else if (args.ids[i] === "lock_annotation" || args.ids[i] === "unlock_annotation") {
                    var isLockOption = args.ids[i] === "lock_annotation";
                    for (var j = 0; j < viewer.selectedItems.annotations.length; j++) {
                        var selectedAnnotation = viewer.selectedItems.annotations[j];
                        if (selectedAnnotation && selectedAnnotation.annotationSettings) {
                            var shouldDisplay = (isLockOption && !selectedAnnotation.annotationSettings.isLock) ||
                                (!isLockOption && selectedAnnotation.annotationSettings.isLock);
                            search.style.display = shouldDisplay ? 'block' : 'none';
                        }
                    }
                } else if ((args.ids[i] === "read_only_true" || args.ids[i] === "read_only_false") && viewer.selectedItems.formFields.length !== 0) {
                    var isReadOnlyOption = args.ids[i] === "read_only_true";
                    for (var j = 0; j < viewer.selectedItems.formFields.length; j++) {
                        var selectedFormFields = viewer.selectedItems.formFields[j];
                        if (selectedFormFields) {
                            var selectedFormField = viewer.selectedItems.formFields[j].isReadonly;
                            var displayMenu = (isReadOnlyOption && !selectedFormField) || (!isReadOnlyOption && selectedFormField);
                            search.style.display = displayMenu ? 'block' : 'none';
                        }
                    }
                } else if (args.ids[i] === 'formfield properties' && viewer.selectedItems.formFields.length !== 0) {
                    search.style.display = 'block';
                }
            }
        }
    }

    function lockAnnotations(args) {
        var selectedAnnotations = viewer.selectedItems.annotations;
        for (var i = 0; i < selectedAnnotations.length; i++) {
            var annotation = selectedAnnotations[i];
            if (annotation && annotation.annotationSettings) {
                annotation.annotationSettings.isLock = true;
                viewer.annotationModule.editAnnotation(annotation);
                args.cancel = false;
            }
        }
    }


    function unlockAnnotations(args) {
        var selectedAnnotations = viewer.selectedItems.annotations;
        for (var i = 0; i < selectedAnnotations.length; i++) {
            var annotation = selectedAnnotations[i];
            if (annotation && annotation.annotationSettings) {
                annotation.annotationSettings.isLock = false;
                viewer.annotationModule.editAnnotation(annotation);
                args.cancel = false;
            }
        }
    }

    function setReadOnlyTrue(args) {
        var selectedFormFields = viewer.selectedItems.formFields;
        for (var i = 0; i < selectedFormFields.length; i++) {
            var selectedFormField = selectedFormFields[i];
            if (selectedFormField) {
                viewer.formDesignerModule.updateFormField(selectedFormField, {
                    isReadOnly: true,
                });
            }
            args.cancel = false;
        }
    }

    function setReadOnlyFalse(args) {
        var selectedFormFields = viewer.selectedItems.formFields;
        for (var i = 0; i < selectedFormFields.length; i++) {
            var selectedFormField = selectedFormFields[i];
            if (selectedFormField) {
                viewer.formDesignerModule.updateFormField(selectedFormField, {
                    isReadOnly: false,
                });
            }
            args.cancel = false;
        }
    }

    function contextmenuHelper(args) {
        viewer.addCustomMenu(menuItems,enableObj.checked, positionObj.checked);
    }

}
const root = ReactDOM.createRoot(document.getElementById('sample'));
root.render(<App />);