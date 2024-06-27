import * as ReactDOM from 'react-dom';
import * as React from 'react';
import './index.css';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView,
         ThumbnailView, Print, TextSelection, Annotation, TextSearch, FormFields, FormDesigner, Inject} from '@syncfusion/ej2-react-pdfviewer';

function App() {
    return (<div>
    <div className='control-section'>
      <ButtonComponent onClick={loadNextUser}>Next User</ButtonComponent>
      <PdfViewerComponent
        id="container"
        documentPath="https://cdn.syncfusion.com/content/pdf/form-filling-document.pdf"
        resourceUrl="https://cdn.syncfusion.com/ej2/23.1.40/dist/ej2-pdfviewer-lib"
        style={{ 'height': '640px' }}>
         
         <Inject services={[ Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, BookmarkView,
                             ThumbnailView, Print, TextSelection, TextSearch, FormFields, FormDesigner ]}/>

      </PdfViewerComponent>
    </div>
  </div>);
}
let users = [];
let currentIndex = 0;

async function fetchUsers() {
  const response = await fetch('https://localhost:7153/api/users');
  users = await response.json();
}

const loadNextUser = () => {
  var viewer = document.getElementById('container').ej2_instances[0];
  const user = users[currentIndex];
  //map the DB field to respective form fields name
  var jsonD = { name: user.name, email: user.email };
  viewer.importFormFields(JSON.stringify(jsonD));
  if (users.length === 0) {
      alert("No users available");
      return;
  }

  currentIndex = (currentIndex + 1) % users.length;
};

window.onload = fetchUsers;

const root = ReactDOM.createRoot(document.getElementById('sample'));
root.render(<App />);