import React from 'react';

/**
 * PageHeader - Komponen judul halaman yang konsisten
 * Props:
 *   title      : string - Judul halaman
 *   subtitle   : string - Deskripsi singkat
 *   actions    : ReactNode - Tombol aksi di kanan (opsional)
 *   breadcrumb : string - misal "Data Akademik / Siswa" (opsional)
 */
const PageHeader = ({ title, subtitle, actions, breadcrumb }) => {
  return (
    <div className="flex items-start justify-between mb-6 gap-4">
      <div>
        {breadcrumb && (
          <p className="text-xs text-slate-400 mb-1">{breadcrumb}</p>
        )}
        <h1 className="text-xl font-bold text-slate-800 leading-tight">{title}</h1>
        {subtitle && (
          <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 flex-shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
