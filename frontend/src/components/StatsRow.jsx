/**
 * StatsRow - Baris kartu statistik seragam
 * stats: [{ label, value, icon, color, sub }]
 */
import React from 'react';

const StatsRow = ({ stats }) => (
  <div className={`grid gap-4 mb-6 grid-cols-2 ${stats.length >= 4 ? 'lg:grid-cols-4' : stats.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
    {stats.map((s, i) => (
      <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
        <div className={`w-11 h-11 rounded-xl ${s.color} flex items-center justify-center text-white flex-shrink-0 shadow-sm`}>
          <s.icon size={20} />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide leading-tight">{s.label}</p>
          <p className="text-xl font-bold text-slate-800 mt-0.5">{s.value}</p>
          {s.sub && <p className="text-xs text-slate-400">{s.sub}</p>}
        </div>
      </div>
    ))}
  </div>
);

export default StatsRow;
