import React, { useMemo, useState } from "react";
import "@qctrl/elements-css/dist/elements.min.css";

import WaveCanvas, { Wave as WaveType } from "./WaveCanvas";
import Fps from "./FpsCounter";

const targetWaveValues = { amplitude: 80, frequency: 5, phase: 0 };

function Wave(): JSX.Element {
  const [amplitude, setAmplitude] = useState(50);
  const [frequency, setFrequency] = useState(10);
  const [phase, setPhase] = useState(0);
  const [animatePhase, setAnimatePhase] = useState(true);
  const [showSummation, setShowSummation] = useState(true);
  const [overlaySummation, setOverlaySummation] = useState(false);
  const [phaseAnimationFactor, setPhaseAnimationFactor] = useState(0.04);
  const [nonInteractive, setNonInteractive] = useState(false);

  const waves: WaveType[] = useMemo(
    () => [
      { amplitude, frequency, phase, styles: { lineColor: "#680ce9" } }, // User/interactive wave
      {
        ...targetWaveValues,
        phase: 0,
        styles: { lineColor: "#bd90ff", dashArray: [6, 3] },
      }, // Target/non interactive wave
    ],
    [amplitude, frequency, phase]
  );

  return (
    <div className="w-full h-screen bg-white flex flex-col items-center">
      <Fps showAverage className="flex space-x-3"/>
      {nonInteractive ? (
        <WaveCanvas
          waves={[
            { ...targetWaveValues, phase: 0, styles: { lineColor: "#680ce9" } },
          ]}
          animatePhase={animatePhase}
          phaseAnimationFactor={phaseAnimationFactor}
        />
      ) : (
        <>
          <WaveCanvas
            waves={waves}
            waveSummationStyles={{ showSummation, overlay: overlaySummation }}
            animatePhase={animatePhase}
            phaseAnimationFactor={phaseAnimationFactor}
          />

          <div className="flex flex-col w-1/3 space-y-4">
            <label htmlFor="frequency" className="text-dark mr-2">
              Frequency: {frequency}hz
            </label>
            <input
              id="frequency"
              type="range"
              min="1"
              max="100"
              value={frequency}
              onChange={(e): void => setFrequency(+e.currentTarget.value)}
            />
            <label htmlFor="amplitude" className="text-dark mr-2">
              Amplitude: {amplitude}
            </label>
            <input
              id="amplitude"
              type="range"
              min="1"
              max="200" // TODO: set this from canvas height
              value={amplitude}
              onChange={(e): void => setAmplitude(+e.currentTarget.value)}
            />
            <label htmlFor="phase" className="text-dark mr-2">
              Phase: {Math.round((phase * 180) / Math.PI)}°
            </label>
            <input
              id="phase"
              type="range"
              min="0"
              max={360 * (Math.PI / 180)}
              step={Math.PI / 180}
              value={phase}
              onChange={(e): void => setPhase(+e.currentTarget.value)}
            />
          </div>
        </>
      )}
      <div className="flex flex-col w-1/3 space-y-4 mt-3">
        <div className="m-auto">non customer controls below, for demo only</div>
        <label htmlFor="nonInteractive" className="text-dark">
          <b>Show non-interactive "read-only" wave animation</b>
          <input
            className="ml-2"
            id="nonInteractive"
            type="checkbox"
            checked={nonInteractive}
            onChange={(e) => setNonInteractive(e.currentTarget.checked)}
          />
        </label>
        <label htmlFor="animationSpeed" className="text-dark">
          (phase) animation speed:
          <input
            className="ml-2 border-2 border-gray"
            type="number"
            min="0"
            max="0.5"
            step="0.01"
            value={phaseAnimationFactor}
            onChange={(e) => setPhaseAnimationFactor(+e.currentTarget.value)}
          />
        </label>
        <div className="flex justify-between">
          <label htmlFor="animatePhase" className="text-dark">
            Animate phase?
            <input
              className="ml-2"
              id="animatePhase"
              type="checkbox"
              checked={animatePhase}
              onChange={(e) => setAnimatePhase(e.currentTarget.checked)}
            />
          </label>
          <label htmlFor="showSummation" className="text-dark">
            Show summation of waves?
            <input
              className="ml-2"
              id="animatePhase"
              type="checkbox"
              checked={showSummation}
              onChange={(e) => setShowSummation(e.currentTarget.checked)}
            />
          </label>
          <label htmlFor="overlaySummation" className="text-dark">
            Overlay wave summation?
            <input
              className="ml-2"
              id="overlaySummation"
              type="checkbox"
              checked={overlaySummation}
              onChange={(e) => setOverlaySummation(e.currentTarget.checked)}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

export default Wave;
