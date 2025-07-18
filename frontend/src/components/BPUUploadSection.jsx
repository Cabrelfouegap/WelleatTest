import React from 'react';
import { Button, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faDownload } from '@fortawesome/free-solid-svg-icons';

const BPUUploadSection = ({
  fileInputRef, file, dragActive, onFileChange, onDrop, onDragOver, onDragLeave, onClick,
  onAnalyse, onDownload, loading, hasData, error, success
}) => (
  <>
    <div
      className={`bpu-upload-zone${dragActive ? ' drag-active' : ''}`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faCloudUploadAlt} className="bpu-upload-icon" />
      <p className="mb-2">
        {dragActive ? 'Relâchez votre fichier ici' : 'Glissez votre fichier .xlsx ici ou cliquez pour sélectionner'}
      </p>
      <Button variant="success" className="fw-semibold" onClick={onClick}>
        Sélectionner un fichier
      </Button>
      {file && <div className="bpu-badge-file">{file.name}</div>}
      <input
        type="file"
        accept=".xlsx"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={onFileChange}
      />
    </div>
    {(error || success) && (
      <Alert variant={error ? 'danger' : 'success'} className="bpu-alert">{error || success}</Alert>
    )}
    <div className="d-flex flex-wrap justify-content-center mb-3" style={{gap: '1rem'}}>
      <Button
        className="bpu-btn-analyse"
        variant="primary"
        onClick={onAnalyse}
        disabled={loading}
      >
        {loading ? <><Spinner animation="border" size="sm" className="me-2" />Analyse en cours...</> : 'Analyser'}
      </Button>
      <Button
        className="bpu-btn-download"
        variant="outline-success"
        onClick={onDownload}
        disabled={!hasData}
      >
        <FontAwesomeIcon icon={faDownload} className="me-2" />Télécharger JSON
      </Button>
    </div>
  </>
);

export default BPUUploadSection; 