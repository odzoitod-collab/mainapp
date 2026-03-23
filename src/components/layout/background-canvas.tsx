export function BackgroundCanvas() {
  return (
    <>
      <div className="bg-canvas" aria-hidden="true">
        <div className="bg-orb bg-orb--a" />
        <div className="bg-orb bg-orb--b" />
        <div className="bg-orb bg-orb--c" />
        <div className="bg-orb bg-orb--d" />
        <div className="bg-blob bg-blob--1" />
        <div className="bg-blob bg-blob--2" />
        <div className="bg-blob bg-blob--3" />
        <div className="bg-blob bg-blob--4" />
        <div className="bg-grid" />
      </div>
      {/* Group 5.1: Noise texture overlay */}
      <div className="bg-noise" aria-hidden="true" />
    </>
  );
}
