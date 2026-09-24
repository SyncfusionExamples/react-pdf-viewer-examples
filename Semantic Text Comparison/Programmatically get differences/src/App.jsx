
import { PdfViewerComponent, Inject, Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, TextSearch, FormFields, FormDesigner, PageOrganizer } from '@syncfusion/ej2-react-pdfviewer';
import React, { useRef, useState } from 'react';
import './App.css';
export default function App() {
  const viewer1Ref = useRef(null);
  const viewer2Ref = useRef(null);
  const [loadedCount, setLoadedCount] = useState(0);
  const [viewersLoaded, setViewersLoaded] = useState(false);
  const [synchronizationEnabled, setSynchronizationEnabled] = useState(true);
  const [highlightsEnabled, setHighlightsEnabled] = useState(true);
  const handleDocumentLoad = () => {
    setLoadedCount((prev) => {
      const newCount = prev + 1;
      if (newCount === 2 && viewer1Ref.current && viewer2Ref.current) {
        setViewersLoaded(true);
        viewer1Ref.current.syncViewers(viewer2Ref.current, synchronizationEnabled);
      }
      return newCount;
    });
  };
  const handleToggleSync = () => {
    const newSyncState = !synchronizationEnabled;
    setSynchronizationEnabled(newSyncState);
    if (viewer1Ref.current && viewer2Ref.current) {
      viewer1Ref.current.syncViewers(viewer2Ref.current, newSyncState);
    }
  };
  const handleToggleHighlights = async () => {
    const newHighlightsState = !highlightsEnabled;
    setHighlightsEnabled(newHighlightsState);
    // Re-apply comparison with updated highlight state
    if (viewersLoaded && viewer1Ref.current && viewer2Ref.current) {
      const options = {
        beforeColor: '#FF0000',
        afterColor: '#00FF00',
        beforeColorOpacity: 0.4,
        afterColorOpacity: 0.4,
        enableHighlights: newHighlightsState,
      };
      try {
        // Clear previous comparison
        viewer1Ref.current.removeSemanticTextCompare?.(viewer2Ref.current);
        // Apply new comparison with updated highlights state
        const result = await viewer1Ref.current.semanticTextCompare(viewer2Ref.current, options);
        console.log('Highlights updated:', result);
      } catch (error) {
        console.error('Error updating highlights:', error);
      }
    }
  };
  const handleClearAnnotations = () => {
    if (viewer1Ref.current && viewer2Ref.current) {
      viewer1Ref.current.removeSemanticTextCompare?.(viewer2Ref.current);
    }
  };
  // Control Buttons
  const ControlPanel = () => (
    <div style={{
      display: 'flex',
      gap: '8px',
      padding: '12px',
      backgroundColor: '#f5f5f5',
      borderBottom: '1px solid #ddd',
      flexWrap: 'wrap',
      alignItems: 'center'
    }}>
      {/* Main Control Buttons */}
      <button onClick={handleCompare} style={{
        padding: '8px 16px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: '500'
      }}>
        Compare Documents
      </button>
      <button onClick={handleToggleHighlights} style={{
        padding: '8px 16px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: '500'
      }}>
        {highlightsEnabled ? 'Disable Highlights' : 'Enable Highlights'}
      </button>
      <button onClick={handleToggleSync} style={{
        padding: '8px 16px',
        backgroundColor: '#ffc107',
        color: 'black',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: '500'
      }}>
        {synchronizationEnabled ? 'Disable Sync' : 'Enable Sync'}
      </button>
      <button onClick={handleClearAnnotations} style={{
        padding: '8px 16px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: '500'
      }}>
        Clear Annotations
      </button>
      {/* Separator */}
      <div style={{ width: '1px', height: '24px', backgroundColor: '#ccc', margin: '0 8px' }}></div>
      {/* Test Buttons */}
      <button onClick={() => getDifferencesByType('Added')} style={{
        padding: '8px 16px',
        backgroundColor: '#17a2b8',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: '500'
      }}>
        Test: Get Added
      </button>
      <button onClick={() => getDifferencesByType('Deleted')} style={{
        padding: '8px 16px',
        backgroundColor: '#17a2b8',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: '500'
      }}>
        Test: Get Deleted
      </button>
      <button onClick={() => getDifferencesByType('Modified')} style={{
        padding: '8px 16px',
        backgroundColor: '#17a2b8',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: '500'
      }}>
        Test: Get Modified
      </button>
      <button onClick={groupDifferencesByPage} style={{
        padding: '8px 16px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: '500'
      }}>
        Test: Group by Page
      </button>
      <button onClick={generateReport} style={{
        padding: '8px 16px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: '500'
      }}>
        Test: Generate Report
      </button>
    </div>
  );
  const getDifferencesByType = async (type) => {
    if (!viewer1Ref.current || !viewer2Ref.current) return [];
    const options = {
      beforeColor: '#FF0000',
      afterColor: '#00FF00',
      beforeColorOpacity: 0.4,
      afterColorOpacity: 0.4,
      enableHighlights: true,
    };
    try {
      const result = await viewer1Ref.current.semanticTextCompare(viewer2Ref.current, options);
      const originalAnnotations = result?.originalDocumentAnnotations || [];
      const modifiedAnnotations = result?.modifiedDocumentAnnotations || [];
      const differences = [];
      // Extract differences by type from original annotations
      originalAnnotations.forEach((pageAnnotations) => {
        pageAnnotations.differenceAnnotations?.forEach((diff) => {
          if (diff.textDiffType === type.toLowerCase()) {
            differences.push({
              pageNumber: pageAnnotations.pageNumber,
              type: diff.textDiffType,
              text: diff.textDiffData,
              bounds: diff.annotation?.bounds,
              color: diff.annotation?.color
            });
          }
        });
      });
      // Extract differences by type from modified annotations
      modifiedAnnotations.forEach((pageAnnotations) => {
        pageAnnotations.differenceAnnotations?.forEach((diff) => {
          if (diff.textDiffType === type.toLowerCase()) {
            // Avoid duplicates by checking if already exists
            const exists = differences.find(d =>
              d.pageNumber === pageAnnotations.pageNumber &&
              d.text === diff.textDiffData
            );
            if (!exists) {
              differences.push({
                pageNumber: pageAnnotations.pageNumber,
                type: diff.textDiffType,
                text: diff.textDiffData,
                bounds: diff.annotation?.bounds,
                color: diff.annotation?.color
              });
            }
          }
        });
      });
      console.log(`${type} differences (${differences.length}):`, differences);
      return differences;
    } catch (error) {
      console.error('Error filtering differences:', error);
      return [];
    }
  };
  const groupDifferencesByPage = async () => {
    if (!viewer1Ref.current || !viewer2Ref.current) return {};
    const options = {
      beforeColor: '#FF0000',
      afterColor: '#00FF00',
      beforeColorOpacity: 0.4,
      afterColorOpacity: 0.4,
      enableHighlights: true,
    };
    try {
      const result = await viewer1Ref.current.semanticTextCompare(viewer2Ref.current, options);
      const originalAnnotations = result?.originalDocumentAnnotations || [];
      const modifiedAnnotations = result?.modifiedDocumentAnnotations || [];
      const grouped = {};
      // Group original document differences by page
      originalAnnotations.forEach((pageAnnotations) => {
        const pageNum = pageAnnotations.pageNumber;
        if (!grouped[pageNum]) {
          grouped[pageNum] = { original: [], modified: [] };
        }
        pageAnnotations.differenceAnnotations?.forEach((diff) => {
          grouped[pageNum].original.push({
            type: diff.textDiffType,
            text: diff.textDiffData,
            bounds: diff.annotation?.bounds,
            color: diff.annotation?.color
          });
        });
      });
      // Group modified document differences by page
      modifiedAnnotations.forEach((pageAnnotations) => {
        const pageNum = pageAnnotations.pageNumber;
        if (!grouped[pageNum]) {
          grouped[pageNum] = { original: [], modified: [] };
        }
        pageAnnotations.differenceAnnotations?.forEach((diff) => {
          grouped[pageNum].modified.push({
            type: diff.textDiffType,
            text: diff.textDiffData,
            bounds: diff.annotation?.bounds,
            color: diff.annotation?.color
          });
        });
      });
      console.log('Differences grouped by page:', grouped);
      return grouped;
    } catch (error) {
      console.error('Error grouping differences:', error);
      return {};
    }
  };
  const handleCompare = async () => {
    if (!viewersLoaded || !viewer1Ref.current || !viewer2Ref.current) {
      return;
    }
    const options = {
      beforeColor: '#FF0000',      // Red for original
      afterColor: '#00FF00',       // Green for modified
      beforeColorOpacity: 0.4,
      afterColorOpacity: 0.4,
      enableHighlights: highlightsEnabled,
    };
    try {
      const result = await viewer1Ref.current.semanticTextCompare(viewer2Ref.current, options);
      console.log('Full Comparison Result:', result);
      // Parse the result structure properly
      const originalAnnotations = result?.originalDocumentAnnotations || [];
      const modifiedAnnotations = result?.modifiedDocumentAnnotations || [];
      const totalTextDiffCount = result?.totalTextDiffCount || 0;
      console.log('Total Text Differences:', totalTextDiffCount);
      console.log('Original Document Pages:', originalAnnotations.length);
      console.log('Modified Document Pages:', modifiedAnnotations.length);
      // Extract and categorize all differences
      let addedCount = 0;
      let deletedCount = 0;
      let modifiedCount = 0;
      // Process original document annotations (deletions and modifications)
      originalAnnotations.forEach((pageAnnotations) => {
        const pageNum = pageAnnotations.pageNumber;
        console.log(`\nOriginal Document - Page ${pageNum}:`);
        pageAnnotations.differenceAnnotations?.forEach((diff) => {
          const type = diff.textDiffType; // "deleted", "modified", "added"
          const text = diff.textDiffData;
          if (type === 'deleted') deletedCount++;
          if (type === 'modified') modifiedCount++;
          if (type === 'added') addedCount++;
          console.log(`  - ${type.toUpperCase()}: "${text?.substring(0, 50)}..."`);
        });
      });
      // Process modified document annotations (additions and modifications)
      modifiedAnnotations.forEach((pageAnnotations) => {
        const pageNum = pageAnnotations.pageNumber;
        console.log(`\nModified Document - Page ${pageNum}:`);
        pageAnnotations.differenceAnnotations?.forEach((diff) => {
          const type = diff.textDiffType; // "deleted", "modified", "added"
          const text = diff.textDiffData;
          if (type === 'added' && !addedCount) addedCount++; // Count only once
          if (type === 'modified' && !modifiedCount) modifiedCount++; // Count only once
          console.log(`  - ${type.toUpperCase()}: "${text?.substring(0, 50)}..."`);
        });
      });
      // Summary
      console.log('\n=== COMPARISON SUMMARY ===');
      console.log(`Total Differences: ${totalTextDiffCount}`);
      console.log(`Deleted: ${deletedCount}`);
      console.log(`Added: ${addedCount}`);
      console.log(`Modified: ${modifiedCount}`);
    } catch (error) {
      console.error('Error during comparison:', error);
    }
  };
  const generateReport = async () => {
    if (!viewer1Ref.current || !viewer2Ref.current) return;
    const options = {
      beforeColor: '#FF0000',
      afterColor: '#00FF00',
      beforeColorOpacity: 0.4,
      afterColorOpacity: 0.4,
      enableHighlights: true,
    };
    try {
      const result = await viewer1Ref.current.semanticTextCompare(viewer2Ref.current, options);
      const originalAnnotations = result?.originalDocumentAnnotations || [];
      const modifiedAnnotations = result?.modifiedDocumentAnnotations || [];
      const totalTextDiffCount = result?.totalTextDiffCount || 0;
      let addedCount = 0;
      let deletedCount = 0;
      let modifiedCount = 0;
      const byPage = {};
      // Process all annotations
      originalAnnotations.forEach((pageAnnotations) => {
        const pageNum = pageAnnotations.pageNumber;
        if (!byPage[pageNum]) {
          byPage[pageNum] = { deleted: 0, added: 0, modified: 0, details: [] };
        }
        pageAnnotations.differenceAnnotations?.forEach((diff) => {
          const type = diff.textDiffType;
          if (type === 'deleted') {
            deletedCount++;
            byPage[pageNum].deleted++;
          } else if (type === 'added') {
            addedCount++;
            byPage[pageNum].added++;
          } else if (type === 'modified') {
            modifiedCount++;
            byPage[pageNum].modified++;
          }
          byPage[pageNum].details.push({
            type,
            text: diff.textDiffData?.substring(0, 100),
            color: diff.annotation?.color
          });
        });
      });
      modifiedAnnotations.forEach((pageAnnotations) => {
        const pageNum = pageAnnotations.pageNumber;
        if (!byPage[pageNum]) {
          byPage[pageNum] = { deleted: 0, added: 0, modified: 0, details: [] };
        }
        pageAnnotations.differenceAnnotations?.forEach((diff) => {
          const type = diff.textDiffType;
          if (type === 'deleted') {
            deletedCount++;
            byPage[pageNum].deleted++;
          } else if (type === 'added') {
            addedCount++;
            byPage[pageNum].added++;
          } else if (type === 'modified') {
            modifiedCount++;
            byPage[pageNum].modified++;
          }
          byPage[pageNum].details.push({
            type,
            text: diff.textDiffData?.substring(0, 100),
            color: diff.annotation?.color
          });
        });
      });
      const report = {
        totalDifferences: totalTextDiffCount,
        summary: {
          added: addedCount,
          deleted: deletedCount,
          modified: modifiedCount
        },
        byPage: byPage
      };
      console.log('=== DETAILED COMPARISON REPORT ===');
      console.log(`Total Text Differences: ${report.totalDifferences}`);
      console.log(`Added: ${report.summary.added}`);
      console.log(`Deleted: ${report.summary.deleted}`);
      console.log(`Modified: ${report.summary.modified}`);
      console.log('\nBreakdown by Page:');
      Object.entries(byPage).forEach(([pageNum, data]) => {
        console.log(`  Page ${pageNum}: +${data.added} -${data.deleted} ~${data.modified}`);
      });
      console.log('\nFull Report:', report);
      return report;
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };
  return (
    <div style={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Control Panel with Test Buttons */}
      <ControlPanel />
      {/* PDF Viewers Container */}
      <div style={{
        display: 'flex',
        flex: 1,
        gap: 0,
        overflow: 'hidden'
      }}>
        {/* Viewer 1 - Original Document */}
        <div style={{ width: '50%', height: '100%', borderRight: '1px solid #ccc' }}>
          <PdfViewerComponent
            ref={viewer1Ref}
            id="pdfViewer1"
            documentPath="https://cdn.syncfusion.com/content/pdf/original-document.pdf"
            resourceUrl="https://cdn.syncfusion.com/ej2/34.2.4/dist/ej2-pdfviewer-lib"
            documentLoad={handleDocumentLoad}
            style={{ height: '100%', width: '100%' }}
          >
            <Inject services={[
              Toolbar,
              Magnification,
              Navigation,
              Annotation,
              LinkAnnotation,
              BookmarkView,
              ThumbnailView,
              Print,
              TextSelection,
              TextSearch,
              FormFields,
              FormDesigner,
              PageOrganizer
            ]} />
          </PdfViewerComponent>
        </div>
        {/* Viewer 2 - Modified Document */}
        <div style={{ width: '50%', height: '100%' }}>
          <PdfViewerComponent
            ref={viewer2Ref}
            id="pdfViewer2"
            documentPath="https://cdn.syncfusion.com/content/pdf/modified-document.pdf"
            resourceUrl="https://cdn.syncfusion.com/ej2/34.2.4/dist/ej2-pdfviewer-lib"
            documentLoad={handleDocumentLoad}
            style={{ height: '100%', width: '100%' }}
          >
            <Inject services={[
              Toolbar,
              Magnification,
              Navigation,
              Annotation,
              LinkAnnotation,
              BookmarkView,
              ThumbnailView,
              Print,
              TextSelection,
              TextSearch,
              FormFields,
              FormDesigner,
              PageOrganizer
            ]} />
          </PdfViewerComponent>
        </div>
      </div>
    </div>
  );
}
