import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipientSetup from './recipientSetup';
import PdfViewer from './pdfViewer';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<RecipientSetup />} />
        <Route path="/pdf-viewer" element={<PdfViewer />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
