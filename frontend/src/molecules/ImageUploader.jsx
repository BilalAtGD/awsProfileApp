import React, { useRef, useState, useCallback } from 'react';
import Button from '../atoms/Button';
import Spinner from '../atoms/Spinner';

/**
 * MOLECULE: ImageUploader
 * Handles two upload modes:
 * 1. File picker (drag & drop or click)
 * 2. Camera capture (live webcam preview → take photo)
 *
 * Props:
 *   onFileSelected(file: File) — called when file is ready
 *   uploading: boolean          — show upload progress
 *   currentImageUrl: string     — current profile pic to display
 */
const ImageUploader = ({ onFileSelected, uploading = false, currentImageUrl }) => {
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [showCamera, setShowCamera] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState(null);
  const [cameraError, setCameraError] = useState('');

  // ─── File Selection ───────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    onFileSelected(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  // ─── Camera ───────────────────────────────────────────────────
  const openCamera = useCallback(async () => {
    setCameraError('');
    setShowCamera(true);
    setCameraReady(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setCameraReady(true);
        };
      }
    } catch {
      setCameraError('Camera access denied. Please allow camera permission in your browser.');
      setCameraReady(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
    setCameraReady(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      setPreview(url);
      onFileSelected(file);
      stopCamera();
    }, 'image/jpeg', 0.92);
  }, [onFileSelected, stopCamera]);

  const displayImage = preview || currentImageUrl;

  return (
    <>
      {/* ─── Upload Zone ─── */}
      <div className="space-y-4 pt-1">
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer
            transition-all duration-300
            ${dragOver
              ? 'border-violet-400 bg-violet-500/10 scale-[1.01]'
              : 'border-slate-700/60 hover:border-violet-500/50 hover:bg-violet-500/5'
            }
          `}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <Spinner size="lg" />
              <p className="text-sm text-slate-400">Uploading to S3...</p>
            </div>
          ) : displayImage ? (
            <div className="flex flex-col items-center gap-2">
              <img
                src={displayImage}
                alt="Profile preview"
                className="w-24 h-24 rounded-full object-cover border-2 border-violet-500/40 mx-auto shadow-md"
              />
              <p className="text-xs text-slate-400">Click or drag new image to change photo</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-2">
              <div className="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                <svg className="w-7 h-7 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-300">Drop photo here</p>
                <p className="text-xs text-slate-500 mt-0.5">or click to browse files</p>
              </div>
              <p className="text-xs text-slate-500 opacity-75">JPG, PNG, WEBP up to 5MB</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            id="profile-pic-upload"
          />
        </div>

        <Button
          id="open-camera-btn"
          variant="secondary"
          size="sm"
          fullWidth
          onClick={openCamera}
          disabled={uploading}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Take Photo with Camera
        </Button>
      </div>

      {/* ─── Camera Modal ─── */}
      {showCamera && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-overlay animate-fadeIn">
          <div className="glass-card p-6 w-full max-w-md animate-fadeInUp">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-100">Take a Photo</h3>
              <button
                onClick={stopCamera}
                className="text-slate-400 hover:text-slate-200 transition-colors"
                aria-label="Close camera"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {cameraError ? (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-300 text-sm text-center">
                {cameraError}
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video">
                {!cameraReady && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <Spinner size="lg" />
                      <p className="text-xs text-slate-400">Starting camera...</p>
                    </div>
                  </div>
                )}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${cameraReady ? 'opacity-100' : 'opacity-0'}`}
                />
                {/* Viewfinder overlay */}
                {cameraReady && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-6 border-2 border-indigo-400/40 rounded-full" />
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-indigo-400 rounded-tl" />
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-indigo-400 rounded-tr" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-indigo-400 rounded-bl" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-indigo-400 rounded-br" />
                  </div>
                )}
              </div>
            )}
            <canvas ref={canvasRef} className="hidden" />

            <div className="flex gap-3 mt-4">
              <Button id="cancel-camera-btn" variant="ghost" fullWidth onClick={stopCamera}>
                Cancel
              </Button>
              <Button
                id="capture-photo-btn"
                variant="primary"
                fullWidth
                onClick={capturePhoto}
                disabled={!cameraReady}
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <circle cx="10" cy="10" r="3" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                </svg>
                Capture
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageUploader;
