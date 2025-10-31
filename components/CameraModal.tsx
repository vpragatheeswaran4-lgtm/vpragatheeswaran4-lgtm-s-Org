import React, { useRef, useEffect, useState } from 'react';
import Modal from './Modal';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (file: File) => void;
}

const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activeStream: MediaStream | null = null;
    if (isOpen) {
      setError(null);
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          activeStream = stream;
          setStream(stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.error("Error accessing camera:", err);
          setError("Could not access the camera. Please check permissions and ensure your device has a camera.");
        });
    } else {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
    
    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            onCapture(file);
            onClose();
          }
        }, 'image/jpeg');
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Take a Picture">
      <div className="flex flex-col items-center">
        {error ? (
            <p className="text-red-500 text-center">{error}</p>
        ) : (
            <>
                <video ref={videoRef} autoPlay playsInline className="w-full rounded-lg bg-gray-900 max-h-[60vh]"></video>
                <canvas ref={canvasRef} className="hidden"></canvas>
                <button
                    onClick={handleCapture}
                    disabled={!stream}
                    className="mt-4 px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 disabled:bg-gray-400"
                >
                    Capture
                </button>
            </>
        )}
      </div>
    </Modal>
  );
};

export default CameraModal;