import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Save, FileText, ZoomIn, ZoomOut, Pen, Eraser, Undo, Redo, Trash2, Download } from 'lucide-react';

const DrawableFormViewer = ({ form, patient, onClose, onSave }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [notes, setNotes] = useState('');
  const [filledBy, setFilledBy] = useState('');
  const [filledByRole, setFilledByRole] = useState('Nurse');
  
  // Drawing states
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('pen'); // 'pen' or 'eraser'
  const [penColor, setPenColor] = useState('#000000');
  const [penWidth, setPenWidth] = useState(2);
  const [drawings, setDrawings] = useState({}); // Store drawings per page
  const [history, setHistory] = useState({}); // Undo/redo history per page
  const [historyStep, setHistoryStep] = useState({});
  
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  if (!form) return null;

  const totalPages = form.pages.length;
  const currentPageKey = `page-${currentPage}`;

  // Initialize canvas when page changes or zoom changes
  useEffect(() => {
    if (imageRef.current && canvasRef.current) {
      const img = imageRef.current;
      const canvas = canvasRef.current;
      
      // Wait for image to load
      const setupCanvas = () => {
        // Set canvas size to match the displayed image size (not natural size)
        const rect = img.getBoundingClientRect();
        canvas.width = img.offsetWidth || rect.width;
        canvas.height = img.offsetHeight || rect.height;
        
        // Clear canvas first
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // If we have a saved merged image, extract just the drawings
        // For now, we'll just clear it - user can redraw
        // In future, we could extract the drawing layer from the merged image
      };

      if (img.complete) {
        setupCanvas();
      } else {
        img.onload = setupCanvas;
      }
    }
  }, [currentPage, zoom]);

  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let clientX, clientY;
    
    if (e.touches && e.touches.length > 0) {
      // Touch event (S-Pen or finger)
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const coords = getCanvasCoordinates(e);
    
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const coords = getCanvasCoordinates(e);
    
    ctx.lineTo(coords.x, coords.y);
    
    if (tool === 'pen') {
      ctx.strokeStyle = penColor;
      ctx.lineWidth = penWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    } else if (tool === 'eraser') {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = penWidth * 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
    
    ctx.stroke();
  };

  const stopDrawing = (e) => {
    if (!isDrawing) return;
    e.preventDefault();
    setIsDrawing(false);
    
    // Merge form image with drawings
    const canvas = canvasRef.current;
    const image = imageRef.current;
    
    // Create temporary canvas to merge - use same size as drawing canvas
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Draw form image first (scaled to canvas size)
    tempCtx.drawImage(image, 0, 0, canvas.width, canvas.height);
    
    // Draw annotations on top (already at correct size)
    tempCtx.drawImage(canvas, 0, 0);
    
    // Get merged image
    const mergedDataURL = tempCanvas.toDataURL('image/png');
    
    // Update drawings for current page
    setDrawings(prev => ({
      ...prev,
      [currentPageKey]: mergedDataURL
    }));
    
    // Save to history for undo/redo
    const currentHistory = history[currentPageKey] || [];
    const currentStep = historyStep[currentPageKey] || 0;
    
    setHistory(prev => ({
      ...prev,
      [currentPageKey]: [...currentHistory.slice(0, currentStep + 1), mergedDataURL]
    }));
    
    setHistoryStep(prev => ({
      ...prev,
      [currentPageKey]: currentStep + 1
    }));
  };

  const handleUndo = () => {
    const currentStep = historyStep[currentPageKey] || 0;
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setHistoryStep(prev => ({
        ...prev,
        [currentPageKey]: newStep
      }));
      
      const previousState = history[currentPageKey][newStep];
      if (previousState) {
        setDrawings(prev => ({
          ...prev,
          [currentPageKey]: previousState
        }));
      }
    }
  };

  const handleRedo = () => {
    const currentStep = historyStep[currentPageKey] || 0;
    const pageHistory = history[currentPageKey] || [];
    
    if (currentStep < pageHistory.length - 1) {
      const newStep = currentStep + 1;
      setHistoryStep(prev => ({
        ...prev,
        [currentPageKey]: newStep
      }));
      
      const nextState = pageHistory[newStep];
      if (nextState) {
        setDrawings(prev => ({
          ...prev,
          [currentPageKey]: nextState
        }));
      }
    }
  };

  const handleClearPage = () => {
    if (window.confirm('Clear all drawings on this page?')) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      setDrawings(prev => {
        const newDrawings = { ...prev };
        delete newDrawings[currentPageKey];
        return newDrawings;
      });
      
      setHistory(prev => {
        const newHistory = { ...prev };
        delete newHistory[currentPageKey];
        return newHistory;
      });
      
      setHistoryStep(prev => {
        const newStep = { ...prev };
        delete newStep[currentPageKey];
        return newStep;
      });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 25, 50));
  };

  const handleDownload = () => {
    // Download current page with drawings
    const canvas = canvasRef.current;
    const image = imageRef.current;
    
    // Create a temporary canvas to merge image and drawings
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = image.naturalWidth;
    tempCanvas.height = image.naturalHeight;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Draw the form image
    tempCtx.drawImage(image, 0, 0);
    
    // Draw the annotations on top
    if (drawings[currentPageKey]) {
      const drawingImg = new Image();
      drawingImg.src = drawings[currentPageKey];
      drawingImg.onload = () => {
        tempCtx.drawImage(drawingImg, 0, 0);
        
        // Download
        const link = document.createElement('a');
        link.download = `${form.name}_${patient.name}_Page${currentPage + 1}.png`;
        link.href = tempCanvas.toDataURL('image/png');
        link.click();
      };
    } else {
      // No drawings, just download the form
      const link = document.createElement('a');
      link.download = `${form.name}_${patient.name}_Page${currentPage + 1}.png`;
      link.href = tempCanvas.toDataURL('image/png');
      link.click();
    }
  };

  const handleSave = () => {
    if (!filledBy.trim()) {
      alert('Please enter your name');
      return;
    }

    // Convert all drawings to base64 for storage
    const formData = {
      patientId: patient.id,
      formType: form.category, // Use category to determine table (OT, Monitoring, etc.)
      formName: form.name,
      formId: form.id, // Store form ID to retrieve template later
      filledBy: filledBy.trim(),
      filledByRole,
      notes: notes.trim(),
      formData: drawings, // Store all page drawings
      status: 'Completed'
    };

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-7xl h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-primary-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{form.name}</h2>
              <p className="text-sm text-gray-600">
                Patient: <span className="font-medium">{patient.name}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Drawing Tools */}
        <div className="flex items-center justify-between p-3 border-b bg-gray-50 flex-wrap gap-2">
          {/* Tool Selection */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setTool('pen')}
              className={`p-2 rounded transition-colors ${
                tool === 'pen' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              title="Pen"
            >
              <Pen className="w-5 h-5" />
            </button>
            <button
              onClick={() => setTool('eraser')}
              className={`p-2 rounded transition-colors ${
                tool === 'eraser' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              title="Eraser"
            >
              <Eraser className="w-5 h-5" />
            </button>
            
            {/* Pen Color */}
            {tool === 'pen' && (
              <div className="flex items-center space-x-2 ml-2">
                <input
                  type="color"
                  value={penColor}
                  onChange={(e) => setPenColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer"
                  title="Pen Color"
                />
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={penWidth}
                  onChange={(e) => setPenWidth(parseInt(e.target.value))}
                  className="w-24"
                  title="Pen Width"
                />
                <span className="text-sm text-gray-600">{penWidth}px</span>
              </div>
            )}
          </div>

          {/* Undo/Redo/Clear */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleUndo}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
              title="Undo"
            >
              <Undo className="w-5 h-5" />
            </button>
            <button
              onClick={handleRedo}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors"
              title="Redo"
            >
              <Redo className="w-5 h-5" />
            </button>
            <button
              onClick={handleClearPage}
              className="p-2 text-red-600 hover:text-red-900 hover:bg-red-100 rounded transition-colors"
              title="Clear Page"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-100 rounded transition-colors"
              title="Download Page"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form Viewer with Canvas */}
        <div className="flex-1 overflow-auto bg-gray-100 p-4" ref={containerRef}>
          <div className="flex justify-center">
            <div style={{ width: `${zoom}%` }} className="relative inline-block">
              <img
                ref={imageRef}
                src={form.pages[currentPage]}
                alt={`${form.name} - Page ${currentPage + 1}`}
                className="shadow-lg bg-white block"
                style={{ width: '100%', height: 'auto', userSelect: 'none' }}
                draggable={false}
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 cursor-crosshair"
                style={{ width: '100%', height: '100%', touchAction: 'none' }}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="border-t bg-white p-4">
          {/* Zoom and Page Controls */}
          <div className="flex items-center justify-between mb-4">
            {/* Zoom Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleZoomOut}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium text-gray-700 min-w-[60px] text-center">
                {zoom}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>

            {/* Page Navigation */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm font-medium text-gray-700">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages - 1}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <div className="w-[100px]"></div>
          </div>

          {/* Form Submission Details */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="label">Filled By</label>
              <input
                type="text"
                value={filledBy}
                onChange={(e) => setFilledBy(e.target.value)}
                placeholder="Enter your name"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="label">Role</label>
              <select
                value={filledByRole}
                onChange={(e) => setFilledByRole(e.target.value)}
                className="input-field"
              >
                <option value="Nurse">Nurse</option>
                <option value="Doctor">Doctor</option>
                <option value="Administrator">Administrator</option>
              </select>
            </div>
            <div>
              <label className="label">Notes (Optional)</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes"
                className="input-field"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn-primary flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Form</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DrawableFormViewer;
