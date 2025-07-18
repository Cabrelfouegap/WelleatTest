import React from 'react';

const BPUDataTable = ({ data }) => {
  if (!data.length) return null;
  return (
    <div className="bpu-table-card">
      <h5 className="mb-3">Aperçu des données extraites</h5>
      <div className="table-responsive">
        <table className="table bpu-table table-bordered table-striped mt-2">
          <thead>
            <tr>
              {Object.keys(data[0]).map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                {Object.entries(row).map(([col, val], i) => (
                  <td key={i} style={col === 'Désignation produit' ? { textAlign: 'left', paddingLeft: 16 } : {}}>{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BPUDataTable; 