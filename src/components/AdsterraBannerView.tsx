/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';

interface AdsterraBannerViewProps {
  bannerCode: string;
  enabled: boolean;
}

export const AdsterraBannerView: React.FC<AdsterraBannerViewProps> = ({ bannerCode, enabled }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled || !bannerCode || !containerRef.current) return;
    const container = containerRef.current;
    container.innerHTML = '';

    try {
      const range = document.createRange();
      range.selectNode(container);
      const fragment = range.createContextualFragment(bannerCode);
      container.appendChild(fragment);
    } catch (e) {
      container.innerHTML = bannerCode;
    }
  }, [bannerCode, enabled]);

  if (!enabled || !bannerCode) return null;

  return (
    <div className="w-full my-3 p-3 rounded-xl bg-slate-950/90 border border-amber-500/20 flex flex-col items-center justify-center overflow-hidden shadow-inner">
      <span className="text-[9px] uppercase tracking-widest text-slate-500 mb-1.5 font-semibold">
        Sponsored Advertisement (Adsterra Global Banner)
      </span>
      <div ref={containerRef} className="w-full flex justify-center items-center overflow-x-auto min-h-[50px]" />
    </div>
  );
};
