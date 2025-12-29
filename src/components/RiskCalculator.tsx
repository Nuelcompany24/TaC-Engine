import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ReferenceLine, Cell } from 'recharts';
import { useData } from '../contexts/DataContext';

const RiskCalculator: React.FC = () => {
  const { riskProfile } = useData();

  const [baseRate, setBaseRate] = useState(riskProfile.baseInterestRate); 
  const [susScore, setSusScore] = useState(riskProfile.sustainabilityScore); 
  const [reliability, setReliability] = useState(riskProfile.verificationConfidence); 
  const [weight, setWeight] = useState(0.05); 

  const [adjustedRate, setAdjustedRate] = useState(0);
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const calculatedDiscount = (susScore * reliability * weight);
    const newRate = Math.max(0, baseRate - calculatedDiscount);
    
    setDiscount(calculatedDiscount);
    setAdjustedRate(newRate);
  }, [baseRate, susScore, reliability, weight]);

  const data = [
    {
      name: 'Standard Market Rate',
      Base: baseRate,
      Discount: 0,
      total: baseRate
    },
    {
      name: 'TaC Verified Rate',
      Base: adjustedRate,
      Discount: discount,
      total: adjustedRate // Used for sorting or label positioning if needed
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8 border-b border-slate-800 pb-6">
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <span className="bg-amber-500/10 p-2 rounded-lg text-amber-400">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </span>
          Collateral Simulator
        </h2>
        <p className="text-slate-400 max-w-2xl mt-2">
          Translate verified environmental impact into basis points. This engine uses the <span className="text-slate-300 font-mono text-xs p-1 bg-slate-800 rounded">TaC-Risk-Offset-v1</span> formula.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0B1221] p-6 rounded-2xl border border-slate-800 shadow-xl">
            <h3 className="text-slate-200 font-bold mb-6 flex items-center gap-2 text-sm uppercase tracking-wider">
              Variables
            </h3>
            
            <div className="space-y-8">
              {/* Base Rate Input */}
              <div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-slate-400">Base Interest Rate</span>
                  <span className="font-mono text-white font-bold bg-slate-800 px-2 py-0.5 rounded">{baseRate.toFixed(1)}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="25"
                  step="0.5"
                  value={baseRate}
                  onChange={(e) => setBaseRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-400"
                />
              </div>

              {/* Sustainability Score Input */}
              <div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-emerald-400 font-medium">Verification Score</span>
                  <span className="font-mono text-emerald-400 font-bold">{susScore}/100</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={susScore}
                  onChange={(e) => setSusScore(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <p className="text-xs text-slate-500 mt-2">
                   Higher scores require multiple verified sources.
                </p>
              </div>

              {/* Reliability Input */}
              <div>
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-purple-400 font-medium">Data Confidence</span>
                  <span className="font-mono text-purple-400 font-bold">{(reliability * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={reliability}
                  onChange={(e) => setReliability(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

               <div className="pt-6 border-t border-slate-800">
                <div className="flex justify-between text-sm mb-3">
                  <span className="text-slate-400">Weight Factor (Alpha)</span>
                  <span className="font-mono text-amber-500">{weight.toFixed(3)}</span>
                </div>
                 <input
                  type="range"
                  min="0.01"
                  max="0.15"
                  step="0.005"
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/10 p-6 rounded-2xl border border-amber-500/20 shadow-lg">
             <div className="flex justify-between items-center mb-1">
               <h4 className="text-amber-200/70 text-xs uppercase font-bold tracking-widest">Rate Reduction</h4>
             </div>
             <div className="text-5xl font-bold text-amber-400 tracking-tighter">
               {discount.toFixed(2)}%
             </div>
             <div className="text-sm text-amber-200/50 mt-2">
               Annual interest saved
             </div>
          </div>
        </div>

        {/* Visualization */}
        <div className="lg:col-span-8 bg-[#0B1221] p-8 rounded-2xl border border-slate-800 shadow-xl flex flex-col">
          <h3 className="text-slate-200 font-bold mb-8 text-sm uppercase tracking-wider">Financial Impact Projection</h3>
          <div className="flex-1 w-full min-h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                barSize={60}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis 
                  dataKey="name" 
                  stroke="#475569" 
                  tick={{fill: '#94a3b8', fontSize: 12}} 
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  stroke="#475569" 
                  label={{ value: 'Interest Rate %', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 12 }}
                  tick={{fill: '#64748b', fontSize: 12}}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f1f5f9', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)' }}
                  itemStyle={{ color: '#f1f5f9' }}
                />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                <ReferenceLine y={0} stroke="#475569" />
                <Bar dataKey="Base" stackId="a" name="Effective Rate">
                   {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#3b82f6' : '#10b981'} />
                    ))}
                </Bar>
                <Bar dataKey="Discount" stackId="a" fill="#f59e0b" name="Impact Discount (TaC)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 p-5 bg-slate-950/50 rounded-xl border border-slate-800 text-sm text-slate-400 font-mono">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
               <div>
                  <span className="text-slate-500 block text-xs uppercase mb-1">Risk Offset Formula</span>
                  <span>{baseRate} - ({susScore} × {reliability} × {weight})</span>
               </div>
               <div className="text-right">
                  <span className="text-slate-500 block text-xs uppercase mb-1">Final Result</span>
                  <span className="text-emerald-400 font-bold text-lg">{adjustedRate.toFixed(2)}%</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskCalculator;