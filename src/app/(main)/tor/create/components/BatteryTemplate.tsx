"use client";

import React from "react";

// Shared cell styles - optimized for page fitting
const TD = "align-top border border-black/60 p-0.5 text-[8px] leading-tight whitespace-pre-wrap break-words text-gray-900";
const TH = "bg-[#cfe2f3] font-semibold border border-black p-0.5 text-[8px] leading-tight text-center text-gray-900";

interface BatteryTemplateProps {
  data: any[]; // Array of technical particulars data
  onChange: (updatedData: any[]) => void;
  isEditing: boolean;
}

export default function BatteryTemplate({ data, onChange, isEditing }: BatteryTemplateProps) {
  const editableProps = isEditing
    ? { contentEditable: true, suppressContentEditableWarning: true } as const
    : ({} as const);

  // Helper to update a specific cell value
  const updateCell = (rowIndex: number, field: string, value: string) => {
    const updatedData = [...data];
    updatedData[rowIndex] = { ...updatedData[rowIndex], [field]: value };
    onChange(updatedData);
  };

  // Get value safely with fallback
  const getValue = (rowIndex: number, field: string) => {
    return data[rowIndex]?.[field] || "";
  };

  return (
    <div className="w-full overflow-auto bg-white p-3">
      <table className="w-full border-collapse [table-layout:fixed]" {...editableProps}>
        <colgroup>
          <col className="w-[48px]" />
          <col className="w-[820px]" />
          <col className="w-[120px]" />
          <col className="w-[120px]" />
          <col className="w-[120px]" />
          <col className="w-[260px]" />
        </colgroup>
        <thead>
          <tr>
            <th className={TH}>NO</th>
            <th className={TH}>SPESIFICATION REQUIREMENTS</th>
            <th className={TH}>PT. X</th>
            <th className={TH}>PT. Y</th>
            <th className={TH}>PT. Z</th>
            <th className={TH}>KETERANGAN</th>
          </tr>
        </thead>
        <tbody>
          {/* GENERAL (1–4) */}
          <tr>
            <td className={TD}>1</td>
            <td className={`${TD} font-semibold text-center`}>GENERAL</td>
            <td className={TD}></td>
            <td className={TD}></td>
            <td className={TD}></td>
            <td className={TD}></td>
          </tr>
          <tr>
            <td className={TD}>2</td>
            <td className={TD}>
              <div className="grid grid-cols-[260px_380px_90px_90px]">
                <div className="pr-1">Kesuaian Temperature</div>
                <div className="border-l pl-1">Temperatur (°C): 33</div>
                <div className="border-l pl-1">Min: 28</div>
                <div className="border-l pl-1">Max: 35</div>
              </div>
            </td>
            <td className={`${TD} border-t border-dashed`}>OK</td>
            <td className={`${TD} border-t border-dashed`}>Not OK</td>
            <td className={`${TD} border-t border-dashed`}>NO DATA</td>
            <td className={`${TD} border-t border-dashed`}></td>
          </tr>
          <tr>
            <td className={TD}>3</td>
            <td className={TD}>
              <div className="grid grid-cols-[260px_560px]">
                <div className="pr-1">Kesuaian Zona Gempa</div>
                <div className="border-l pl-1">Zona : 3</div>
              </div>
            </td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
          </tr>
          <tr>
            <td className={TD}>4</td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
          </tr>

          {/* APPROVAL STANDARDS (5–7) */}
          <tr>
            <td className={TD}>5</td>
            <td className={`${TD} font-semibold text-center`}>APPROVAL STANDARDS</td>
            <td className={TD}></td>
            <td className={TD}></td>
            <td className={TD}></td>
            <td className={TD}></td>
          </tr>
          <tr>
            <td className={TD}>6</td>
            <td className={TD}>
              <div className="grid grid-cols-[200px_600px]">
                <div className="pr-1">Standard</div>
                <div className="border-l pl-1">ANSI / IEEE / IEC / JIS / DIN/VDE</div>
              </div>
            </td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
          </tr>
          <tr>
            <td className={TD}>7</td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
          </tr>

          {/* STATIONARY BATTERY SPECIFICATION (8 header) */}
          <tr>
            <td className={TD}>8</td>
            <td className={`${TD} font-semibold text-center`}>STATIONARY BATTERY SPECIFICATION</td>
            <td className={TD}></td>
            <td className={TD}></td>
            <td className={TD}></td>
            <td className={TD}></td>
          </tr>

          {/* 9–16: SPEC cell merged with nested table; vendor columns empty */}
          <tr>
            <td className={TD}>9</td>
            <td className={TD} rowSpan={8} data-spec-merge>
              <div className="grid grid-cols-[200px_620px] gap-0 h-full">
                <div className="flex items-center justify-center text-center font-medium border-r">Tipe Sel</div>
                <div>
                  <table className="w-full border-collapse text-[7px]">
                    <colgroup>
                      <col className="w-[220px]" />
                      <col className="w-[240px]" />
                      <col className="w-[160px]" />
                    </colgroup>
                    <tbody>
                      <tr>
                        <td className="border border-black/60" colSpan={3}>OPzS</td>
                      </tr>
                      <tr>
                        <td className="border-l border-r border-t border-black/60 border-dashed pr-1">Plate</td>
                        <td className="border-l border-r border-t border-black/60 border-dashed">Positif: TUBULAR</td>
                        <td className="border-l border-r border-t border-black/60 border-dashed">Negatif: GRID</td>
                      </tr>
                      <tr>
                        <td className="border-l border-r border-t border-black/60 border-dashed pr-1">Lead Alloying</td>
                        <td className="border-l border-r border-t border-black/60 border-dashed">Low Antimony</td>
                        <td className="border-l border-r border-t border-black/60 border-dashed">0,5 ~ 1 %</td>
                      </tr>
                      <tr>
                        <td className="border-l border-r border-t border-black/60 border-dashed pr-1">Container</td>
                        <td className="border-l border-r border-t border-black/60 border-dashed">High Quality Transparent Electrolyte Proof Material (AcrylNitrile-Styrene)</td>
                        <td className="border-l border-r border-t border-black/60 border-dashed">Black Color container is NOT APPROVED</td>
                      </tr>
                      <tr>
                        <td className="border-l border-r border-t border-black/60 border-dashed pr-1">Number of Poles Terminal</td>
                        <td className="border-l border-r border-t border-black/60 border-dashed">Positif: Min. 3 pcs</td>
                        <td className="border-l border-r border-t border-black/60 border-dashed">Negatif: Min. 3 pcs</td>
                      </tr>
                      <tr>
                        <td className="border-l border-r border-t border-black/60 border-dashed pr-1">Electrolyte Spesific Grafity (SG)</td>
                        <td className="border-l border-r border-t border-black/60 border-dashed">1.22 atau 1.24</td>
                        <td className="border-l border-r border-t border-black/60 border-dashed">At 25 °C</td>
                      </tr>
                      <tr>
                        <td className="border-l border-r border-t border-black/60 border-dashed pr-1">Full Charge Electrolyte Specific Gravity (SG)</td>
                        <td className="border-l border-r border-t border-black/60 border-dashed">1,27</td>
                        <td className="border-l border-r border-t border-black/60 border-dashed">At 25 °C</td>
                      </tr>
                      <tr>
                        <td className="border border-black/60 pr-1">Design Life Time</td>
                        <td className="border border-black/60">Min 20 years (Certified Letter by Manufacture)</td>
                        <td className="border border-black/60">At 20 °C</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </td>
            <td className={TD}></td>
            <td className={TD}></td>
            <td className={TD}></td>
            <td className={TD}></td>
          </tr>
          {/* Rows 10–16 (only NO + vendor + keterangan) */}
          <tr><td className={TD}>10</td><td className={TD}></td><td className={TD}></td><td className={TD}></td><td className={TD}></td></tr>
          <tr><td className={TD}>11</td><td className={TD}></td><td className={TD}></td><td className={TD}></td><td className={TD}></td></tr>
          <tr><td className={TD}>12</td><td className={TD}></td><td className={TD}></td><td className={TD}></td><td className={TD}></td></tr>
          <tr><td className={TD}>13</td><td className={TD}></td><td className={TD}></td><td className={TD}></td><td className={TD}></td></tr>
          <tr><td className={TD}>14</td><td className={TD}></td><td className={TD}></td><td className={TD}></td><td className={TD}></td></tr>
          <tr><td className={TD}>15</td><td className={TD}></td><td className={TD}></td><td className={TD}></td><td className={TD}></td></tr>
          <tr><td className={TD}>16</td><td className={TD}></td><td className={TD}></td><td className={TD}></td><td className={TD}></td></tr>

          {/* 17–22 */}
          <tr>
            <td className={TD}>17</td>
            <td className={`${TD} border-t border-dashed`}>
              <div className="grid grid-cols-[260px_1fr]">
                <div className="pr-1">Minimum Kapasitas (Ampere Hours):</div>
                <div className="border-l pl-1">2000 Ah (C10)</div>
              </div>
            </td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
          </tr>
          <tr>
            <td className={TD}>18</td>
            <td className={`${TD} border-t border-dashed`}>
              <div className="grid grid-cols-[1fr_1fr_1fr]">
                <div className="pr-1">Tegangan Nominal/Cell : 2 Volt</div>
                <div className="border-l pl-1">Tegangan Float Cell : 2,2 Volt</div>
                <div className="border-l pl-1">Tegangan Equalize (Boost) Cell : 2,25 V</div>
              </div>
            </td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
          </tr>
          <tr>
            <td className={TD}>19</td>
            <td className={`${TD} border-t border-dashed`}>
              <div className="grid grid-cols-[320px_240px_1fr]">
                <div className="pr-1">End Voltage per Cell (Battery Design)</div>
                <div className="border-l pl-1">Minimum 1,80 Volts</div>
                <div className="border-l pl-1">End Voltage yang menyatakan battery sudah rusak.</div>
              </div>
            </td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
          </tr>
          <tr>
            <td className={TD}>20</td>
            <td className={`${TD} border-t border-dashed`}>
              <div className="grid grid-cols-[320px_240px_1fr]">
                <div className="pr-1">End Voltage per Cell at Commissioning/ Acceptance Test</div>
                <div className="border-l pl-1">Minimum 1,85 Volts</div>
                <div className="border-l pl-1">Metode Test C10 (200 A 10 jam). Test dilakukan Vendor termasuk alat dummy load, charging, dll disediakan oleh Vendor.</div>
              </div>
            </td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
          </tr>
          <tr>
            <td className={TD}>21</td>
            <td className={`${TD} border-t border-dashed`}>
              <div className="grid grid-cols-[280px_240px_1fr]">
                <div className="pr-1">Metode Pengiriman:</div>
                <div className="border-l pl-1">Kering</div>
                <div className="border-l pl-1">Dry Pre-Charged for Un-Limited Time Storage</div>
              </div>
            </td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
          </tr>
          <tr>
            <td className={TD}>22</td>
            <td className={`${TD} border-t border-dashed`}>
              <div className="grid grid-cols-[280px_540px]">
                <div className="pr-1">Jumlah Discharge Cycles</div>
                <div className="border-l pl-1">Minimal 1000 Cycle (Certified Letter by Manufacture)</div>
              </div>
            </td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
          </tr>

          {/* 23–24: LOAD CHARACTERISTIC header section (after 22) */}
          <tr>
            <td className={TD}>23</td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
          </tr>
          <tr>
            <td className={TD}>24</td>
            <td className={`${TD} font-semibold text-center`}>KESESUAIAN DENGAN LOAD CHARACTERISTIC (End Voltage 1,80 VPC Back-Up Time 10 hours)</td>
            <td className={TD}></td>
            <td className={TD}></td>
            <td className={TD}></td>
            <td className={TD}></td>
          </tr>

          {/* 25: Chart row */}
          <tr>
            <td className={TD}>25</td>
            <td className={`${TD}`}>
              <div className="mb-1">Baterai harus dapat memenuhi load karakteristik berikut:</div>
              <div className="border border-black/60 h-[200px] relative">
                <svg viewBox="0 0 900 200" className="w-full h-full">
                  {/* Axes */}
                  <line x1="70" y1="20" x2="70" y2="255" stroke="black" strokeWidth="3" />
                  <polygon points="70,20 63,35 77,35" fill="black" />
                  <line x1="70" y1="255" x2="860" y2="255" stroke="black" strokeWidth="3" />
                  <polygon points="860,255 845,248 845,262" fill="black" />

                  {/* Y dashed lines */}
                  <g stroke="black" strokeDasharray="8 6" strokeWidth="2" opacity="0.6">
                    <line x1="70" y1="190" x2="860" y2="190" /> {/* 486 */}
                    <line x1="70" y1="120" x2="860" y2="120" /> {/* 641*/}
                    <line x1="70" y1="70" x2="860" y2="70" />  {/* 796*/}
                  </g>

                  {/* Y labels */}
                  <g fontSize="14">
                    <text x="35" y="195">486</text>
                    <text x="35" y="125">641</text>
                    <text x="35" y="165">595</text>
                    <text x="35" y="75">796</text>
                  </g>

                  {/* Axis titles */}
                  <text x="90" y="28" fontSize="16">Current</text>
                  <text x="100" y="48" fontSize="16">(Ampere)</text>
                  <text x="750" y="272" fontSize="16">Time (minutes)</text>

                  {/* X ticks/labels */}
                  <g fontSize="14">
                    <text x="65" y="272">0</text>
                    <text x="215" y="272">1</text>
                    <text x="725" y="272">45</text>
                    <text x="610" y="272">21</text>
                    <text x="595" y="272">20</text>
                  </g>

                  {/* Vertical guides at 1,20,21 */}
                  <g stroke="black" opacity="0.3">
                    <line x1="210" y1="55" x2="210" y2="255" />
                    <line x1="590" y1="55" x2="590" y2="255" />
                    <line x1="620" y1="55" x2="620" y2="255" />
                  </g>

                  {/* Step profile A-B-C-D */}
                  <polyline fill="none" stroke="black" strokeWidth="6"
                    points="70,150 210,150 210,190 590,190 590,55 620,55 620,120 860,120 860,255" />

                  {/* Area labels */}
                  <g fontSize="28" opacity="0.6">
                    <text x="140" y="200">A</text>
                    <text x="380" y="200">B</text>
                    <text x="605" y="200">C</text>
                    <text x="700" y="200">D</text>
                  </g>
                </svg>
              </div>
            </td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
          </tr>

          {/* 26–29: BATTERY RACK SPECIFICATION */}
          <tr>
            <td className={TD}>26</td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
          </tr>
          <tr>
            <td className={TD}>27</td>
            <td className={`${TD} font-semibold text-center`}>BATTERY RACK SPECIFICATION</td>
            <td className={TD}></td>
            <td className={TD}></td>
            <td className={TD}></td>
            <td className={TD}></td>
          </tr>
          <tr>
            <td className={TD}>28</td>
            <td className={TD}>
              <div className="grid grid-cols-[160px_1fr_320px]">
                <div className="pr-1 font-medium">MATERIAL</div>
                <div className="border-l pl-1">
                  CARBON STEEL DICAT DENGAN ANTI ACID COATING DAN DI BAWAH BATTERY DILENGKAPI DENGAN INSULATORS, CROSS BEAMS DAN WOOD STRIPS
                </div>
                <div className="border-l pl-1">ANTI SEISMIC BATTERY RACK (TAHAN GEMPA)</div>
              </div>
            </td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
          </tr>
          <tr>
            <td className={TD}>29</td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
          </tr>

          {/* 30–35: ACCESSORIES */}
          <tr>
            <td className={TD}>30</td>
            <td className={`${TD} font-semibold text-center`}>ACCESSORIES</td>
            <td className={TD}></td>
            <td className={TD}></td>
            <td className={TD}></td>
            <td className={TD}></td>
          </tr>
          <tr>
            <td className={TD}>31</td>
            <td className={TD}>
              <div className="grid grid-cols-[320px_1fr]">
                <div className="pr-1">Hydrometer Portabel</div>
                <div className="border-l pl-1">Diperlukan 2 buah</div>
              </div>
            </td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
          </tr>
          <tr>
            <td className={TD}>32</td>
            <td className={TD}>
              <div className="grid grid-cols-[320px_1fr]">
                <div className="pr-1">Hydrometer Vent-Mounted</div>
                <div className="border-l pl-1">Diperlukan 2 buah</div>
              </div>
            </td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
          </tr>
          <tr>
            <td className={TD}>33</td>
            <td className={TD}>
              <div className="grid grid-cols-[320px_1fr]">
                <div className="pr-1">Thermometer Vent-Mounted</div>
                <div className="border-l pl-1">Diperlukan sebanyak jumlah battery yang diminta (±110 buah)</div>
              </div>
            </td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
          </tr>
          <tr>
            <td className={TD}>34</td>
            <td className={TD}>
              <div className="grid grid-cols-[320px_1fr]">
                <div className="pr-1">Pengangkat Sel Portable (Lifting Truck)</div>
                <div className="border-l pl-1">Diperlukan 1 set</div>
              </div>
            </td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
          </tr>
          <tr>
            <td className={TD}>35</td>
            <td className={TD}>
              <div className="grid grid-cols-[320px_1fr]">
                <div className="pr-1">Portable Charger smooth selector 2 - 12 Volt continous current 200 Ampere</div>
                <div className="border-l pl-1">Diperlukan 1 set</div>
              </div>
            </td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
            <td className={`${TD} border-t border-dashed`}></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
