"use client";

export function ZetaLoader({ active }: { active: boolean }) {
  if (!active) return null;

  return <div className="zeta-loader-overlay" role="status" aria-live="polite" aria-label="Loading, please wait">
    <div className="zeta-loader-card">
      <span className="zeta-loader-mark" aria-hidden="true">Z</span>
      <span className="zeta-loader-word" aria-hidden="true">ZetaSkills</span>
      <span className="zeta-loader-caption" aria-hidden="true">Just a moment<span className="zeta-loader-dots"><span>.</span><span>.</span><span>.</span></span></span>
    </div>
  </div>;
}
