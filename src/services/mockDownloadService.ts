export function downloadCSV(filename: string, headers: string[], rows: unknown[][]) {
  const csvRows = [
    headers.join(','),
    ...rows.map((row) =>
      row
        .map((val) => {
          const cleanVal = val === null || val === undefined ? '' : String(val);
          // Escape quotes
          const escaped = cleanVal.replace(/"/g, '""');
          return `"${escaped}"`;
        })
        .join(',')
    ),
  ];

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadPDF(filename: string, textContent: string) {
  // Generate a beautiful text receipt/invoice file
  const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadQRCode(filename: string, iccid: string) {
  // Generate a beautiful mock QR code SVG blob
  const svgContent = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200" style="background:#fff;font-family:sans-serif;">
      <!-- Border -->
      <rect width="200" height="200" fill="none" stroke="#2563eb" stroke-width="6"/>
      <!-- QR Blocks Representation -->
      <rect x="20" y="20" width="40" height="40" fill="#0f172a" />
      <rect x="30" y="30" width="20" height="20" fill="#fff" />
      <rect x="35" y="35" width="10" height="10" fill="#0f172a" />

      <rect x="140" y="20" width="40" height="40" fill="#0f172a" />
      <rect x="150" y="30" width="20" height="20" fill="#fff" />
      <rect x="155" y="35" width="10" height="10" fill="#0f172a" />

      <rect x="20" y="140" width="40" height="40" fill="#0f172a" />
      <rect x="30" y="150" width="20" height="20" fill="#fff" />
      <rect x="35" y="155" width="10" height="10" fill="#0f172a" />

      <rect x="70" y="70" width="60" height="60" fill="#2563eb" opacity="0.1" />
      
      {/* Dynamic noise pixels */}
      <rect x="75" y="75" width="10" height="10" fill="#0f172a" />
      <rect x="90" y="85" width="15" height="10" fill="#0f172a" />
      <rect x="80" y="110" width="10" height="20" fill="#0f172a" />
      <rect x="110" y="75" width="15" height="15" fill="#0f172a" />
      <rect x="120" y="105" width="10" height="10" fill="#0f172a" />
      <rect x="100" y="125" width="20" height="10" fill="#0f172a" />
      <rect x="140" y="90" width="15" height="15" fill="#0f172a" />
      <rect x="160" y="110" width="20" height="10" fill="#0f172a" />

      <text x="100" y="180" font-size="8" font-weight="bold" text-anchor="middle" fill="#64748b">ICCID: ${iccid}</text>
      <text x="100" y="192" font-size="7" text-anchor="middle" fill="#94a3b8">FluxtonX E-sim Profile</text>
    </svg>
  `;

  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.svg') ? filename : `${filename}.svg`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
