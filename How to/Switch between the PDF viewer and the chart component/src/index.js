import { createRoot } from 'react-dom/client';
import './index.css';
import React, { useState } from "react";
import { PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, TextSearch, Annotation, FormFields, FormDesigner, PageOrganizer, Inject } from '@syncfusion/ej2-react-pdfviewer';
import { ChartComponent, SeriesCollectionDirective, SeriesDirective, LineSeries } from "@syncfusion/ej2-react-charts";


function Default() {
    const [activeTab, setActiveTab] = useState("pdfViewer");
    return (
        <div>
        {/* Navigation Tabs */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          {/* PDF Viewer Tab Button */}
          <button
            onClick={() => setActiveTab("pdfViewer")}
            style={{
              padding: "10px 20px",
              cursor: "pointer",
              backgroundColor: activeTab === "pdfViewer" ? "#007bff" : "#ccc",
              color: activeTab === "pdfViewer" ? "#fff" : "#000",
              border: "none",
              margin: "0 5px",
            }}
          >
            PDF Viewer
          </button>
          {/* Chart Tab Button */}
          <button
            onClick={() => setActiveTab("chart")}
            style={{
              padding: "10px 20px",
              cursor: "pointer",
              backgroundColor: activeTab === "chart" ? "#007bff" : "#ccc",
              color: activeTab === "chart" ? "#fff" : "#000",
              border: "none",
              margin: "0 5px",
            }}
          >
            Chart
          </button>
        </div>
  
        {/* Conditional Rendering Based on Active Tab */}
        <div style={{ textAlign: "center" }}>
          {/* PDF Viewer Component */}
          {activeTab === "pdfViewer" && (
            <PdfViewerComponent 
                    id="container" 
                    documentPath="https://cdn.syncfusion.com/content/pdf/pdf-succinctly.pdf"
                    resourceUrl="https://cdn.syncfusion.com/ej2/28.1.33/dist/ej2-pdfviewer-lib" 
                    style={{ 'height': '680px' }} 
                  >
                    {/* Injecting PDF Viewer Services */}
                    <Inject services={[Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, BookmarkView, ThumbnailView,
                      Print, TextSelection, TextSearch, FormFields, FormDesigner, PageOrganizer]} />
                  </PdfViewerComponent>
            )}
            {/* Chart Component */}
            {activeTab === "chart" && (
              <ChartComponent
                id="charts"
                title="Sales Analysis"
                style={{ height: "600px", width: "80%" }}
              >
                {/* Injecting Chart Services */}
                <Inject services={[LineSeries]} />
                <SeriesCollectionDirective>
                  <SeriesDirective
                    dataSource={[
                      { x: "Jan", y: 35 },
                      { x: "Feb", y: 28 },
                      { x: "Mar", y: 34 },
                      { x: "Apr", y: 32 },
                      { x: "May", y: 40 },
                    ]}
                    xName="x"
                    yName="y"
                    type="Line"
                  />
                </SeriesCollectionDirective>
              </ChartComponent>
            )}
          </div>
        </div>    
        );
}
export default Default;

const root = createRoot(document.getElementById('sample'));
root.render(<Default />);