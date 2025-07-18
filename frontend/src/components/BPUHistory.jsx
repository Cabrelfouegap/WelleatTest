import React, { useEffect, useState } from 'react';
import { fetchHistory, getDownloadUrl } from '../services/api';
import { Button, Table, Spinner } from 'react-bootstrap';

// Composant Historique des fichiers analysés
const BPUHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Récupère l'historique au chargement du composant
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchHistory();
      setHistory(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="text-center my-4"><Spinner animation="border" /> Chargement de l'historique...</div>;
  if (!history.length) return <div className="text-center my-4">Aucun fichier analysé pour le moment.</div>;

  return (
    <div className="bpu-table-card mt-5">
      <h5 className="mb-3">Historique des fichiers analysés</h5>
      <Table bordered hover responsive className="bpu-table">
        <thead>
          <tr>
            <th>Nom du fichier Excel</th>
            <th>Date d'analyse</th>
            <th>Nombre de lignes</th>
            <th>Télécharger JSON</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item, idx) => (
            <tr key={idx}>
              <td>{item.excel}</td>
              <td>{new Date(item.date).toLocaleString()}</td>
              <td>{item.rows}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  href={getDownloadUrl(item.json)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Télécharger
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default BPUHistory; 