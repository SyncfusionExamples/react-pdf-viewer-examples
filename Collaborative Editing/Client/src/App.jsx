import {
  PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView,
  ThumbnailView, Print, TextSelection, Annotation, TextSearch, FormFields, FormDesigner,
  PageOrganizer, Inject
} from '@syncfusion/ej2-react-pdfviewer';
import { CollaborationClient } from '@syncfusion/ej2-collaborator';
import React, { useRef, useState, useEffect } from 'react';
import { PdfViewerAdapter } from './pdfViewerAdapter';

// ============================================================
// Collaboration Configuration
// ============================================================

// Available user list for demo purposes
const userList = ['RIO', 'JOHN', 'MAXY', 'SHAI', 'SRI'];
const currentUserName = userList[Math.floor(Math.random() * userList.length)];
const SERVICE_URL = 'http://localhost:8081/';

export default function App() {
  // ============================================================
  // State Management
  // ============================================================

  const viewerRef = useRef(null);
  const [isDocumentLoaded, setIsDocumentLoaded] = useState(false);
  const [collaborationStatus, setCollaborationStatus] = useState('initializing');
  const [currentUser] = useState(currentUserName);
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [roomName, setRoomName] = useState('');

  // Persistent references for collaboration
  const adapterRef = useRef(null);
  const clientRef = useRef(null);
  const roomNameRef = useRef('');

  // ============================================================
  // Helper Functions - PDF Fetch and Load
  // ============================================================

  /**
   * Loads a PDF blob into the viewer
   */
  const loadPDFBlobIntoViewer = async (pdfBlob) => {
    try {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
          try {
            const arrayBuffer = reader.result;
            const uint8Array = new Uint8Array(arrayBuffer);

            // Attempt to load using viewer.load() with Uint8Array
            if (viewerRef.current && viewerRef.current.load && typeof viewerRef.current.load === 'function') {
              viewerRef.current.load(uint8Array, '');
              console.log('[App] Loaded PDF using viewer.load(Uint8Array)');
              resolve();
              return;
            }

            // Fallback: Try loading via data URL
            const dataReader = new FileReader();
            dataReader.onload = () => {
              try {
                const dataUrl = dataReader.result;

                if (viewerRef.current && viewerRef.current.load && typeof viewerRef.current.load === 'function') {
                  viewerRef.current.load(dataUrl, '');
                  console.log('[App] Loaded PDF using viewer.load(dataUrl)');
                  resolve();
                } else {
                  console.error('[App] Viewer does not support load method');
                  reject(new Error('Viewer load method not available'));
                }
              } catch (error) {
                reject(error);
              }
            };

            dataReader.onerror = () => {
              reject(new Error('Failed to read blob as data URL'));
            };

            dataReader.readAsDataURL(pdfBlob);

          } catch (error) {
            reject(error);
          }
        };

        reader.onerror = () => {
          reject(new Error('Failed to read blob as array buffer'));
        };

        reader.readAsArrayBuffer(pdfBlob);
      });

    } catch (error) {
      console.error('[App] Error loading PDF blob:', error);
      throw error;
    }
  };

  /**
   * Fetches the current collaborative document from the server and loads it into the viewer
   */
  const fetchAndLoadPDFDocument = async () => {
    try {
      console.log(`[App] Fetching PDF from room: ${roomNameRef.current}`);

      const queryParams = new URLSearchParams({
        roomName: roomNameRef.current || 'default'
      });

      const response = await fetch(
        `${SERVICE_URL}api/CollaborativeEditing/GetPDFDocument?${queryParams.toString()}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(`Server error: ${result.error}`);
      }

      console.log(`[App] PDF retrieved successfully - Size: ${result.contentLength} bytes`);

      // Decode Base64 content to binary string
      const binaryString = atob(result.content);

      // Convert binary string to Uint8Array
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Create Blob from Uint8Array
      const pdfBlob = new Blob([bytes], { type: 'application/pdf' });
      console.log(`[App] Converted to Blob - Size: ${pdfBlob.size} bytes`);

      // Load the PDF into the viewer
      await loadPDFBlobIntoViewer(pdfBlob);
      console.log('[App] PDF loaded into viewer');

    } catch (error) {
      console.error('[App] Error fetching PDF document:', error);
      throw error;
    }
  };

  // ============================================================
  // Event Handlers - Collaboration Lifecycle
  // ============================================================

  /**
   * Handler for viewer.resourcesLoaded event
   * 
   * This event fires when the PdfViewer has initialized all resources.
   * We use it to:
   * 1. Initialize the collaboration adapter and client
   * 2. Load the document from the collaboration service
   * 3. Join the collaboration room
   * 4. Fetch and load the current PDF state
   */
  const handleResourcesLoaded = async () => {
    console.log('[App] Viewer resourcesLoaded event triggered');

    if (!isDocumentLoaded) {
      try {
        console.log(`[App] Initializing collaboration - User: ${currentUser}, Service: ${SERVICE_URL}`);

        setCollaborationStatus('loading');
        setIsDocumentLoaded(true);

        // Initialize collaboration asynchronously
        (async () => {
          try {
            // Step 1: Initialize PdfViewerAdapter
            const adapter = new PdfViewerAdapter(viewerRef.current, SERVICE_URL, currentUser);
            adapterRef.current = adapter;
            console.log('[App] PdfViewerAdapter initialized');

            // Step 2: Create and configure CollaborationClient
            const client = new CollaborationClient(adapter, {
              serviceUrl: SERVICE_URL,
              connectionType: 'websocket',
              currentUser: currentUser,
              onUserJoined: (user) => {
                console.log('[App] User joined collaboration:', user);
                setConnectedUsers(prev => [...new Set([...prev, user.userName || user.currentUser])]);
              },
              onUserLeft: (user) => {
                console.log('[App] User left collaboration:', user);
                setConnectedUsers(prev => prev.filter(u => u !== (user.userName || user.currentUser)));
              }
            });
            clientRef.current = client;

            console.log('[App] CollaborationClient initialized');

            // Step 3: Load from server (gets room name and pending operations)
            const roomName = await adapter.loadFromServer();
            roomNameRef.current = roomName;
            setRoomName(roomName);
            console.log(`[App] Loaded from server - Room: ${roomName}`);

            // Step 4: Join the collaboration room with the client
            await client.joinRoomAsync(roomName);
            console.log(`[App] Joined collaboration room: ${roomName}`);

            // Step 5: Fetch and load the current PDF document state
            await fetchAndLoadPDFDocument();
            console.log('[App] PDF document loaded successfully');

            setCollaborationStatus('connected');
            setConnectedUsers([currentUser]);

          } catch (error) {
            console.error('[App] Error during collaboration initialization:', error);
            setCollaborationStatus('error');
            // Fallback: Load default document
            console.log('[App] Falling back to default document');
          }
        })();

      } catch (error) {
        console.error('[App] Error initializing collaboration:', error);
        setCollaborationStatus('error');
      }
    }
  };

  /**
   * Handler for viewer.documentChanged event
   * 
   * This event fires when the user makes changes to:
   * - Annotations (add, modify, delete)
   * - Form fields (add, modify, delete)
   * - Page organizer (reorder, insert, delete pages)
   * 
   * We package these changes as operations and send them to the server
   * for broadcast to other collaborators.
   */
  const handleDocumentChanged = (args) => {
    try {
      // Handle AnnotationChangedEventArgs
      if (args && 'annotationId' in args) {
        console.log('[App] Annotation changed:', args.annotationId);

        let operations = [];
        if (args.action) {
          operations = [{
            action: args.action,
            annotation: args.annotationId,
            type: 'annotation',
            isRedacted: args.isRedacted
          }];
        } else {
          operations = [{
            type: 'removeUser',
            currentUser: currentUser
          }];
        }

        console.log('[App] Annotation operation:', operations);
        if (adapterRef.current && adapterRef.current.sendActionToServer) {
          adapterRef.current.sendActionToServer(operations).catch(err =>
            console.error('[App] Error sending annotation operation:', err)
          );
        }
      }
      // Handle FormFieldChangedEventArgs
      else if (args && 'formField' in args && !('fieldName' in args)) {
        console.log('[App] Form field changed:', args.formField);

        const operations = [{
          action: args.action,
          formField: args.formField,
          type: 'formField'
        }];

        console.log('[App] Form field operation:', operations);
        if (adapterRef.current && adapterRef.current.sendActionToServer) {
          adapterRef.current.sendActionToServer(operations).catch(err =>
            console.error('[App] Error sending form field operation:', err)
          );
        }
        // IMPORTANT: Uncomment when PdfViewerAdapter is available
        // if (adapterRef.current && adapterRef.current.sendActionToServer) {
        //   adapterRef.current.sendActionToServer(operations);
        // }
      }
      // Handle FormFieldFocusOutEventArgs (form field value updates)
      else if (args && 'fieldName' in args) {
        console.log('[App] Form field updated:', args.fieldName);

        const operations = [{
          action: 'formFieldUpdate',
          data: args,
          type: 'formField'
        }];

        console.log('[App] Form field update operation:', operations);
        if (adapterRef.current && adapterRef.current.sendActionToServer) {
          adapterRef.current.sendActionToServer(operations).catch(err =>
            console.error('[App] Error sending form field update:', err)
          );
        }
      }
      // Handle PageOrganizerSavedEventArgs
      else if (args && 'organizePageActions' in args) {
        console.log('[App] Page organizer changed');

        const eventData = args;
        const actionDetails = args.organizePageActions && typeof args.organizePageActions === 'string'
          ? JSON.parse(args.organizePageActions)
          : "";

        let operations = [];

        if (eventData && eventData.savedDocument === null && actionDetails.action && actionDetails.action === 'applyCancelled') {
          // User cancelled the page organizer operation
          operations = [{
            type: 'removeUser',
            currentUser: currentUser
          }];
          console.log('[App] Page organizer operation cancelled');
        }
        else if (eventData && eventData.savedDocument !== null && actionDetails.length > 0 && actionDetails[0].action !== 'applyCancelled') {
          // Page organizer operation applied successfully
          operations = [{
            action: 'pageOrganizerUpdate',
            data: args.organizePageActions,
            type: 'pageOrganizer'
          }];
          console.log('[App] Page organizer operation:', operations);
        } else {
          console.log('[App] No valid page organizer operation to send');
          return;
        }

        if (adapterRef.current && adapterRef.current.sendActionToServer) {
          adapterRef.current.sendActionToServer(operations).catch(err =>
            console.error('[App] Error sending page organizer operation:', err)
          );
        }
      }

    } catch (error) {
      console.error('[App] Error processing document change:', error);
    }
  };

  // ============================================================
  // Cleanup on unmount
  // ============================================================

  useEffect(() => {
    return () => {
      // Cleanup collaboration resources on unmount
      if (clientRef.current) {
        console.log('[App] Cleaning up collaboration client');
      }
    };
  }, []);

  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Collaboration Status Bar */}
      <div style={{
        padding: '10px 15px',
        backgroundColor: '#f0f0f0',
        borderBottom: '1px solid #ddd',
        fontSize: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <strong>User:</strong> {currentUser} |
          <strong> Status:</strong> <span style={{
            color: collaborationStatus === 'connected' ? '#28a745' :
              collaborationStatus === 'error' ? '#dc3545' : '#ffc107'
          }}>
            {collaborationStatus}
          </span> |
          <strong> Room:</strong> {roomName || 'N/A'}
        </div>
        <div>
          <strong>Connected Users:</strong> {connectedUsers.join(', ') || 'None'}
        </div>
      </div>

      {/* PDF Viewer */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <PdfViewerComponent
          ref={viewerRef}
          id="container"
          enableCollaborativeEditing={true}
          resourceUrl="https://cdn.syncfusion.com/ej2/34.1.29/dist/ej2-pdfviewer-lib"
          resourcesLoaded={handleResourcesLoaded}
          documentChanged={handleDocumentChanged}
          style={{ height: '100%', width: '100%' }}
        >
          <Inject services={[
            Toolbar, Magnification, Navigation, Annotation, LinkAnnotation,
            BookmarkView, ThumbnailView, Print, TextSelection, TextSearch,
            FormFields, FormDesigner, PageOrganizer
          ]} />
        </PdfViewerComponent>
      </div>
    </div>
  );
}