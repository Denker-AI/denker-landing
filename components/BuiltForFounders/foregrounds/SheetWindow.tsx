"use client";

import { DenkerCursorBubble } from "@/components/production/cursors/denker-cursor-bubble";

// Google-Sheets-style window with Denker filling a Total column. Authored at
// 640px design width. Denker green replaces the reference's blue selection
// accent. Uses the production DenkerCursorBubble.

const cols =["Quarter", "Revenue", "COGS", "Gross Profit", "Op. Income", "Net Income", "Total"];
const rows: string[][] = [
  ["Q1 2024", "2,365", "885", "1,480", "835", "670", "6,893"],
  ["Q2 2024", "2,480", "920", "1,560", "890", "715", "7,249"],
  ["Q3 2024", "2,615", "975", "1,640", "945", "760", "7,645"],
  ["Q4 2024", "2,780", "1,035", "1,745", "1,020", "820", "8,141"],
  ["Q1 2025", "2,895", "1,075", "1,820", "1,075", "865", "8,491"],
  ["Q2 2025", "3,020", "1,120", "1,900", "1,130", "910", "8,867"],
  ["Q3 2025", "3,185", "1,180", "2,005", "1,205", "970", "9,363"],
];

export function SheetWindow() {
  return (
    <div className="relative" style={{ width: 640 }}>
      <div className="overflow-hidden rounded-[14px] border border-grey-950/10 bg-white shadow-[0_30px_70px_-20px_rgba(9,20,40,0.6)]">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 bg-grey-900 px-3 py-2">
          <span className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-[#ff5f57]" />
            <span className="size-2.5 rounded-full bg-[#febc2e]" />
            <span className="size-2.5 rounded-full bg-[#28c840]" />
          </span>
          <div className="ml-1 flex items-center gap-1.5 rounded-t-md bg-white/10 px-3 py-1 text-[11px] text-white/85">
            <span className="grid size-3.5 place-items-center rounded-[3px] bg-emerald-500 text-[7px] text-white">⊞</span>
            Gross Revenue Sheet
          </div>
        </div>

        {/* Sheets toolbar */}
        <div className="flex items-center gap-3 border-b border-grey-950/8 px-3 py-2">
          <span className="grid size-6 place-items-center rounded-md bg-emerald-500 text-[10px] font-bold text-white">⊞</span>
          <div className="flex flex-col">
            <span className="text-[12px] font-semibold text-grey-900">Gross Revenue Sheet</span>
            <div className="flex gap-2 text-[9px] text-grey-500">
              <span>File</span><span>Edit</span><span>View</span><span>Insert</span><span>Data</span><span>Tools</span>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="bg-white">
          {/* column header row */}
          <div className="flex border-b border-grey-950/10 bg-grey-50 text-[9px] font-semibold text-grey-500">
            <span className="w-7 shrink-0 border-r border-grey-950/8 py-1.5 text-center">#</span>
            {cols.map((c, i) => (
              <span
                key={c}
                className={`flex-1 border-r border-grey-950/8 py-1.5 pl-2 ${i === cols.length - 1 ? "bg-accent/15 font-bold text-emerald-700" : ""}`}
              >
                {c}
              </span>
            ))}
          </div>
          {rows.map((r, ri) => (
            <div key={r[0]} className="flex border-b border-grey-950/6 text-[10px] text-grey-800">
              <span className="w-7 shrink-0 border-r border-grey-950/8 bg-grey-50 py-1.5 text-center text-[9px] text-grey-400">{ri + 2}</span>
              {r.map((cell, ci) => (
                <span
                  key={ci}
                  className={`flex-1 border-r border-grey-950/6 py-1.5 pl-2 ${
                    ci === r.length - 1
                      ? "border-l-2 border-l-accent bg-accent/10 font-semibold text-emerald-800"
                      : ci === 0
                        ? "font-medium text-grey-900"
                        : ""
                  }`}
                >
                  {cell}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Real Denker cursor + glass bubble */}
      <DenkerCursorBubble
        className="![transform:none] !left-[60%] !top-[22%]"
        maxWidthPx={185}
      >
        Adding a Total column for every quarter&apos;s gross profit.
      </DenkerCursorBubble>
    </div>
  );
}
