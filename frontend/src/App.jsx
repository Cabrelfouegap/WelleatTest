import React, { useRef, useState } from 'react';
import BPUUploadSection from './components/BPUUploadSection';
import BPUDataTable from './components/BPUDataTable';
import BPUHistory from './components/BPUHistory';
import './styles/BPUApp.css';
import { uploadFile, fetchData } from './services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';

function App() {
  const fileInputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError('');
    setSuccess('');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError('');
      setSuccess('');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Veuillez sélectionner un fichier .xlsx');
      setSuccess('');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await uploadFile(file);
      const json = await fetchData();
      setData(json);
      setSuccess('Fichier analysé avec succès !');
    } catch (err) {
      setError("Erreur lors de l'upload ou de l'analyse.");
      setData([]);
    }
    setLoading(false);
  };

  const handleDownload = () => {
    window.open(import.meta.env.VITE_API_URL + '/download-json', '_blank');
  };

  return (
    <div className="bpu-home-page">
      <div className="bpu-main-content">
        <h1 className="bpu-title mb-2">
          <FontAwesomeIcon icon={faFileExcel} className="bpu-title-icon" />
          Lecture de BPU
        </h1>
        <div className="bpu-subtitle mb-4">
          Uploadez un fichier Excel (.xlsx), analysez-le et téléchargez les données extraites au format JSON.
        </div>
        <BPUUploadSection
          fileInputRef={fileInputRef}
          file={file}
          dragActive={dragActive}
          onFileChange={handleFileChange}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
          onAnalyse={handleUpload}
          onDownload={handleDownload}
          loading={loading}
          hasData={!!data.length}
          error={error}
          success={success}
        />
        <BPUDataTable data={data} />
        {/* Historique des fichiers analysés */}
        <BPUHistory />
      </div>
    </div>
  );
}

export default App; 