'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Globe, Wifi, MapPin } from 'lucide-react';
import WorldMapPaths from './WorldMapPaths';

export default function GlobalActivityMap() {
  return (
    <Card className="border-slate-100 h-full flex flex-col justify-between select-none">
      
      {/* Header */}
      <CardHeader className="border-slate-100/50 pb-3 flex items-center justify-between">
        <CardTitle className="text-sm font-bold text-slate-800 dark:text-white">
          Global eSIM Activity
        </CardTitle>
        <span className="flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-bold text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
          Live
        </span>
      </CardHeader>

      <CardContent className="p-5 flex-1 flex flex-col gap-5 justify-between">
        
        {/* Navy Map Panel */}
        <div className="relative flex flex-col justify-between h-[230px] bg-[#0b1320] rounded-2xl overflow-hidden border border-slate-900 shadow-inner">
          
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#1f293d_1.2px,transparent_1.2px)] [background-size:14px_14px] opacity-25" />

          {/* Render the detailed SVG world map */}
          <div className="relative flex-1 flex items-center justify-center p-2.5 mt-2">
            <WorldMapPaths className="w-full h-full max-h-[175px] text-slate-800">
              {/* Inject CSS styling to colour target continents and countries as active in the Figma map */}
              <style dangerouslySetInnerHTML={{ __html: `
                path {
                  fill: #151f32;
                  stroke: #080d1a;
                  stroke-width: 0.5px;
                  transition: fill 0.15s ease;
                }
                path:hover {
                  fill: #60a5fa;
                  cursor: pointer;
                }
                /* Figma Highlighted Active Countries - Bright Vivid Blue */
                #us, #ca, #gl,
                #gb, #fr, #de, #it, #es, #nl, #be, #ch, #pl, #se, #no, #fi, #ie,
                #in, #cn, #jp, #kr, #sg, #th, #my, #id, #ph, #vn, #kh,
                #ae, #sa, #eg, #za,
                #au, #nz,
                #br, #ar, #mx
                {
                  fill: #3b82f6 !important; /* Bright Electric Blue */
                }
              `}} />
            </WorldMapPaths>

            {/* Glowing Hotspots */}
            <div className="absolute top-[38%] left-[27%] h-2 w-2 rounded-full bg-blue-400">
              <span className="absolute -inset-2 rounded-full border border-blue-400/50 animate-ping" style={{ animationDuration: '3s' }} />
            </div>
            <div className="absolute top-[32%] left-[51%] h-2 w-2 rounded-full bg-blue-400">
              <span className="absolute -inset-2 rounded-full border border-blue-400/50 animate-ping" style={{ animationDuration: '2.5s' }} />
            </div>
            <div className="absolute top-[58%] left-[71%] h-2 w-2 rounded-full bg-blue-400">
              <span className="absolute -inset-2 rounded-full border border-blue-400/50 animate-ping" style={{ animationDuration: '3.5s' }} />
            </div>
          </div>

          {/* Bottom Card Overlay stats (exactly matching layout inside dark blue panel) */}
          <div className="z-10 bg-[#0d1625]/95 border-t border-slate-900/60 flex justify-between items-center py-2.5 px-6 text-center text-white">
            <div className="flex-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Countries</span>
              <span className="text-sm font-extrabold text-blue-400">190+</span>
            </div>
            <div className="h-5 w-px bg-slate-800" />
            <div className="flex-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Networks</span>
              <span className="text-sm font-extrabold text-blue-400">700+</span>
            </div>
            <div className="h-5 w-px bg-slate-800" />
            <div className="flex-1">
              <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Active Regions</span>
              <span className="text-sm font-extrabold text-blue-400">12</span>
            </div>
          </div>

        </div>

        {/* Lower Horizontal Card Grid */}
        <div className="grid grid-cols-3 gap-3">
          {/* Countries Covered */}
          <div className="rounded-xl border border-slate-100 bg-white p-3 flex flex-col items-center justify-between text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="rounded-full bg-blue-50 p-2 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400">
              <Globe className="h-4 w-4" />
            </div>
            <span className="text-lg font-black text-slate-800 dark:text-white mt-2 leading-none">190+</span>
            <span className="text-[10px] text-slate-400 font-bold mt-1 leading-tight">Countries Covered</span>
          </div>

          {/* Networks Connected */}
          <div className="rounded-xl border border-slate-100 bg-white p-3 flex flex-col items-center justify-between text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="rounded-full bg-cyan-50 p-2 text-cyan-600 dark:bg-cyan-950/20 dark:text-cyan-400">
              <Wifi className="h-4 w-4" />
            </div>
            <span className="text-lg font-black text-slate-800 dark:text-white mt-2 leading-none">700+</span>
            <span className="text-[10px] text-slate-400 font-bold mt-1 leading-tight">Networks Connected</span>
          </div>

          {/* Active Regions */}
          <div className="rounded-xl border border-slate-100 bg-white p-3 flex flex-col items-center justify-between text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="rounded-full bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
              <MapPin className="h-4 w-4" />
            </div>
            <span className="text-lg font-black text-slate-800 dark:text-white mt-2 leading-none">12</span>
            <span className="text-[10px] text-slate-400 font-bold mt-1 leading-tight">Active Regions</span>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
