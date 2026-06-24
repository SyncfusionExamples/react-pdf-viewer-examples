import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView,
  ThumbnailView, Print, TextSelection, Annotation, TextSearch, FormFields, FormDesigner, Inject
} from '@syncfusion/ej2-react-pdfviewer';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import Authentication from './Authentication';
import './PdfViewer.css';

const PdfViewer = () => {
  const [loggedInUser, setUser] = useState(null);
  const pdfViewerRef = useRef(null);
  const displayName = useMemo(() => {
    if (!loggedInUser) return '';
    return (
      loggedInUser.userName ||
      loggedInUser.username ||
      loggedInUser.name ||
      loggedInUser.email ||
      ''
    );
  }, [loggedInUser]);

  const [authorsList, setAuthorsList] = useState([{ name: 'All Authors' }]);
  const [selectedAuthor, setSelectedAuthor] = useState('All Authors');
  const [globalAnnotationsData, setGlobalAnnotationsData] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("user");
      if (saved) setUser(JSON.parse(saved));
    } catch {/* ignore */}
  }, []);

  useEffect(() => {
    if (!displayName) {
      setAuthorsList([{ name: 'All Authors' }]);
      setSelectedAuthor('All Authors');
      return;
    }
    setAuthorsList([{ name: 'All Authors' }, { name: displayName }]);
    setSelectedAuthor(displayName);
  }, [displayName]);

  const handleDocumentLoad = async () => {
    const viewer = pdfViewerRef.current;
    if (!viewer) return;
    const currentName = displayName || 'All Authors';
    setAuthorsList([{ name: 'All Authors' }, ...(displayName ? [{ name: displayName }] : [])]);
    setSelectedAuthor(currentName);
    try {
      const exportedData = await viewer.exportAnnotationsAsObject();
      setGlobalAnnotationsData(exportedData);
      const authorNames = new Set(displayName ? [displayName] : []);
      viewer.annotationCollection?.forEach(annotation => {
        const name = (annotation.author || '').trim();
        if (name) authorNames.add(name);
      });
      const newAuthorsList = [{ name: 'All Authors' }, ...Array.from(authorNames).map(name => ({ name }))];
      setAuthorsList(newAuthorsList);
      if (displayName) {
        filterAndLoadAnnotations(displayName, exportedData);
      }
    } catch (error) {
      console.error('Error during document load process:', error);
      setGlobalAnnotationsData(null);
    }
  };

  const filterAndLoadAnnotations = (userName, allAnnotations) => {
    if (!pdfViewerRef.current) return;
    setTimeout(() => {
      try { pdfViewerRef.current.deleteAnnotations(); } catch {}
      if (!allAnnotations) return;
      try {
        if (userName === 'All Authors') {
          let parsedData =
            typeof allAnnotations === 'string' && allAnnotations.trim() !== ''
              ? JSON.parse(allAnnotations)
              : allAnnotations;
          if (!parsedData) return;
          const dataToImport = parsedData.pdfAnnotation ? parsedData : { pdfAnnotation: parsedData };
          pdfViewerRef.current.importAnnotation(dataToImport);
          return;
        }
        let parsedData =
          typeof allAnnotations === 'string' ? JSON.parse(allAnnotations) : allAnnotations;
        if (!parsedData?.pdfAnnotation) parsedData = { pdfAnnotation: parsedData };
        const filteredData = { pdfAnnotation: {} };
        Object.keys(parsedData.pdfAnnotation).forEach(pageNumber => {
          const pageData = parsedData.pdfAnnotation[pageNumber];
          const list = pageData?.shapeAnnotation || [];
          const userAnnotations = list.filter(a => a.title === userName);
          if (userAnnotations.length > 0) {
            filteredData.pdfAnnotation[pageNumber] = { shapeAnnotation: userAnnotations };
          }
        });
        if (Object.keys(filteredData.pdfAnnotation).length > 0) {
          pdfViewerRef.current.importAnnotation(filteredData);
        }
      } catch (error) {
        console.error('Error filtering or loading annotations:', error);
      }
    }, 0);
  };

  const onAuthorChange = async (args) => {
    const newAuthor = args?.itemData?.name;
    if (!newAuthor) return;

    const viewer = pdfViewerRef.current;
    let mergedGlobal = globalAnnotationsData;

    try {
      const live = await viewer.exportAnnotationsAsObject();
      mergedGlobal = exportEditedAnnotsIntoGlobal(live, globalAnnotationsData);
      setGlobalAnnotationsData(mergedGlobal);
      try { localStorage.setItem('annot', mergedGlobal); } catch {}
    } catch (e) {
      console.warn('Failed to persist edits before switching author:', e);
    }

    try {
      if (newAuthor === "All Authors" || newAuthor === displayName) {
        viewer.toolbar.enableToolbarItem(['AnnotationEditTool'], true);
      } else {
        viewer.toolbar.enableToolbarItem(['AnnotationEditTool'], false);
        viewer.toolbarModule.showAnnotationToolbar(false);
      }
    } catch {}

    setSelectedAuthor(newAuthor);
    filterAndLoadAnnotations(newAuthor, mergedGlobal);
  };

  const exportEditedAnnotsIntoGlobal = (liveJson, globalJson) => {
    const parseJsonOrObject = (value) =>
      typeof value === 'string' ? JSON.parse(value || '{}') : value || {};

    const liveData = parseJsonOrObject(liveJson);
    const globalData = parseJsonOrObject(globalJson);

    globalData.pdfAnnotation = globalData.pdfAnnotation || {};
    const livePagesByKey = liveData.pdfAnnotation || {};

    const normalizeToArray = (value) =>
      Array.isArray(value) ? value : value ? Object.values(value) : [];

    for (const pageKey of Object.keys(livePagesByKey)) {
      const liveShapeAnnotations = livePagesByKey[pageKey]?.shapeAnnotation;
      const liveAnnotationsList = normalizeToArray(liveShapeAnnotations);
      if (!liveAnnotationsList.length) continue;

      if (!globalData.pdfAnnotation[pageKey]) {
        globalData.pdfAnnotation[pageKey] = { shapeAnnotation: [] };
      }

      const globalPageEntry = globalData.pdfAnnotation[pageKey];
      const globalShapeAnnotations = globalPageEntry.shapeAnnotation;

      if (Array.isArray(globalShapeAnnotations)) {
        for (const annotation of liveAnnotationsList) {
          if (!annotation?.name) continue;
          const existingIndex = globalShapeAnnotations.findIndex(
            (a) => a?.name === annotation.name
          );
          if (existingIndex >= 0) {
            globalShapeAnnotations[existingIndex] = { ...annotation };
          } else {
            globalShapeAnnotations.push({ ...annotation });
          }
        }
      } else {
        for (const annotation of liveAnnotationsList) {
          if (!annotation?.name) continue;

          let matchedKey = null;
          for (const key of Object.keys(globalShapeAnnotations)) {
            if (globalShapeAnnotations[key]?.name === annotation.name) {
              matchedKey = key;
              break;
            }
          }
          if (matchedKey) {
            globalShapeAnnotations[matchedKey] = { ...annotation };
          } else {
            const nextKey = String(Object.keys(globalShapeAnnotations).length);
            globalShapeAnnotations[nextKey] = { ...annotation };
          }
        }
      }
    }
    return JSON.stringify(globalData);
  };

  function lockAnnnotations() {
    var annotations = pdfViewerRef.current.annotationCollection;
    for (let i = 0; i < annotations.length; i++) {
      const annot = annotations[i];
      if(annot.author === loggedInUser.username && selectedAuthor === loggedInUser.username)
      {
        annot.annotationSettings.isLock = false;
      }
      else if(annot.author === "Guest" && selectedAuthor === "All Authors")
      {
        annot.annotationSettings.isLock = false;
      }
      else{
        annot.annotationSettings.isLock = true;
      }
      pdfViewerRef.current.annotation.editAnnotation(annotations[i]);
    }
  }

  const onAnnotationAdd = async (args) => {
    const viewer = pdfViewerRef.current;
    const coll = viewer.annotationCollection || [];
    const addedAnnotation = coll[coll.length - 1];
    if (!addedAnnotation) return;
    addedAnnotation.author = displayName;
    viewer.annotation.editAnnotation(addedAnnotation);
    const exportedData = await viewer.exportAnnotationsAsObject();
    const allAnnnots = JSON.parse(exportedData).pdfAnnotation;
    const exportData = [];
    if (allAnnnots) {
      const keys = Object.keys(allAnnnots);
      for (let x = 0; x < keys.length; x++) {
        const pageAnnots = allAnnnots[keys[x]].shapeAnnotation || [];
        for (let y = 0; y < pageAnnots.length; y++) {
          const pageAnnot = pageAnnots[y];
          if (pageAnnot.name === args.annotationId || pageAnnot.inreplyto === args.annotationId) {
            exportData.push(pageAnnot);
          }
        }
      }
    }
    combineAnnotations(exportData);
  };

  function combineAnnotations(exportData) {
    const existingData = JSON.parse(globalAnnotationsData);
    const key = exportData[0].page;
    if (existingData.pdfAnnotation[key]) {
      if (Array.isArray(existingData.pdfAnnotation[key].shapeAnnotation)) {
        for (let x = 0; x < exportData.length; x++) {
          existingData.pdfAnnotation[key].shapeAnnotation.push(exportData[x]);
        }
      } else {
        const keysLength = Object.keys(existingData.pdfAnnotation[key].shapeAnnotation).length;
        for (let x = 0; x < exportData.length; x++) {
          existingData.pdfAnnotation[key].shapeAnnotation[(keysLength + x).toString()] = exportData[x];
        }
      }
    } else {
      existingData.pdfAnnotation[key] = { shapeAnnotation: {} };
      for (let x = 0; x < exportData.length; x++) {
        existingData.pdfAnnotation[key].shapeAnnotation[x.toString()] = exportData[x];
      }
    }
    localStorage.setItem('annot', JSON.stringify(existingData));
    const combinedAnnotations = JSON.stringify(existingData);
    setGlobalAnnotationsData(combinedAnnotations);
  }

  const onAnnotationRemove = async () => {
    try {
      const updatedAnnotations = await pdfViewerRef.current.exportAnnotationsAsObject();
      setGlobalAnnotationsData(updatedAnnotations);
    } catch (error) {
      console.error('Error updating annotations after remove:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // Template for the currently selected item in the dropdown
  const dropdownValueTemplate = (data) => {
    const name = data?.name ?? selectedAuthor;
    const selectedName = data.name ?? selectedAuthor;
    const roleText =
    selectedName === 'All Authors'
      ? 'Aggregated View'
      : selectedName === displayName
        ? 'LoggedIn User'
        : 'Read-Only user';
    return (
            <div style={{ display: 'flex' }}>
                <img
                  className="e-pv-e-sign-empImage"
                  style={{
                    maxHeight: '30px',
                    width: '30px',
                    minWidth: '30px', 
                    marginLeft: '4px',
                    marginRight: '5px',
                    borderRadius: '50%', 
                    border: `1px solid #000`,
                    objectFit: 'cover'
                  }}
                  src={"../User.png"}
                  alt="User Avatar"
                />
                <div>
                    <div className="e-pv-e-sign-ename" style={{ height: '18px', fontSize: '13px' }}> {name} </div>
                    <div className="e-pv-e-role" style={{fontSize: '11px'}} > {roleText}</div>
                </div>
            </div>
        );
  };


  // Template for each item in the dropdown list
  const dropdownItemTemplate = (data) => {
    const name = data?.name || '';
    return (<div className="e-pv-e-sign valueTemplate" style={{ display: 'flex', marginLeft: '2px' }}>
            <img
              className="e-pv-e-sign-empImage"
              style={{
                maxHeight: '30px',
                width: '30px',
                minWidth: '30px', 
                marginLeft: '4px',
                borderRadius: '50%', 
                border: `1px solid #000`,
                objectFit: 'cover' 
              }}
              src={"../User.png"}
              alt="User Avatar"
            />
            <div>
                <div className="e-pv-e-sign-name" style={{ fontSize: '12px', marginLeft: '12px', alignContent: 'center' }}> {data.name} </div>
            </div>
        </div>);
  };

  if (!loggedInUser) {
    return <Authentication onLogin={setUser} />;
  }

  return (
    <div>
      <div className="app-header">
        <DropDownListComponent
          id="author-dropdown"
          cssClass="author-ddl" 
          popupCssClass="author-ddl-popup" 
          dataSource={authorsList}
          fields={{ text: 'name', value: 'name' }}
          value={selectedAuthor}
          change={onAuthorChange}
          popupHeight="220px"
          width="250px" 
          valueTemplate={dropdownValueTemplate}
          itemTemplate={dropdownItemTemplate}
        />
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>

      <div className='control-section'>
        <PdfViewerComponent
          ref={pdfViewerRef}
          id="container"
          documentPath={window.location.origin + "/Annotations.pdf"}
          resourceUrl="https://cdn.syncfusion.com/ej2/31.2.7/dist/ej2-pdfviewer-lib"
          style={{ height: '640px' }}
          documentLoad={handleDocumentLoad}
          annotationAdd={onAnnotationAdd}
          annotationRemove={onAnnotationRemove}
          importSuccess={lockAnnnotations}
        >
          <Inject services={[
            Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, BookmarkView,
            ThumbnailView, Print, TextSelection, TextSearch, FormFields, FormDesigner
          ]} />
        </PdfViewerComponent>
      </div>
    </div>
  );
};
export default PdfViewer;