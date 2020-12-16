import React, { useMemo, useState } from "react";
import "@qctrl/elements-css/dist/elements.min.css";

import WaveCanvas, { Wave as WaveType } from "./WaveCanvas";
import Fps from "./FpsCounter";

function Wave(): JSX.Element {
  const [amplitude, setAmplitude] = useState(0.5);
  const [wavelength, setWavelength] = useState(0.5);
  const [phase, setPhase] = useState(0);
  const [animatePhase, setAnimatePhase] = useState(true);
  const [showSummation, setShowSummation] = useState(true);
  const [phaseAnimationFactor, setPhaseAnimationFactor] = useState(0.04);
  const [nonInteractive, setNonInteractive] = useState(false);
  const [targetPhase, setTargetPhase] = useState(0);
  const [targetWavelength, setTargetWavelength] = useState(0.5);
  const [targetAmplitude, setTargetAmplitude] = useState(0.5);
  const [xScale, setXScale] = useState(10);

  const waves: WaveType[] = useMemo(
    () => [
      { amplitude, wavelength, phase, styles: { lineColor: "#680ce9" } }, // User/interactive wave
      {
        phase: targetPhase,
        wavelength: targetWavelength,
        amplitude: targetAmplitude,
        styles: { lineColor: "#bd90ff", dashArray: [6, 3] },
      }, // Target/non interactive wave
    ],
    [
      amplitude,
      phase,
      targetAmplitude,
      targetPhase,
      targetWavelength,
      wavelength,
    ]
  );

  return (
    <div className="w-full h-screen bg-white flex items-center">
      <div className="w-1/4 flex flex-col items-center"></div>
      <div className="h-full w-1/2 flex flex-col items-center">
        <Fps showAverage className="flex space-x-3" />
        {nonInteractive ? (
          <WaveCanvas
            waves={[
              {
                ...{
                  phase: targetPhase,
                  wavelength: targetWavelength,
                  amplitude: targetAmplitude,
                },
                phase: 0,
                styles: { lineColor: "#680ce9" },
              },
            ]}
            animatePhase={animatePhase}
            phaseAnimationFactor={phaseAnimationFactor}
          />
        ) : (
          <>
            <WaveCanvas
              waves={waves}
              animatePhase={animatePhase}
              phaseAnimationFactor={phaseAnimationFactor}
              showWaveSummation={showSummation}
              xScale={xScale}
            />

            <div className="flex flex-col w-full space-y-4">
              <label htmlFor="wavelength" className="text-dark mr-2">
                Wavelength: {wavelength}
              </label>
              <input
                id="wavelength"
                type="range"
                min="0.05"
                max="1"
                step="0.01"
                value={wavelength}
                onChange={(e): void => setWavelength(+e.currentTarget.value)}
              />
              <label htmlFor="amplitude" className="text-dark mr-2">
                Amplitude: {amplitude}
              </label>
              <input
                id="amplitude"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={amplitude}
                onChange={(e): void => setAmplitude(+e.currentTarget.value)}
              />
              <label htmlFor="phase" className="text-dark mr-2">
                Phase (deg/rad): {Math.round((phase * 180) / Math.PI)}° /{" "}
                {Math.ceil((phase / Math.PI + Number.EPSILON) * 1000) / 1000} x
                π
              </label>
              <input
                id="phase"
                type="range"
                min="0"
                max={2 * Math.PI}
                step={Math.PI / 180}
                value={phase}
                onChange={(e): void => setPhase(+e.currentTarget.value)}
              />
            </div>
          </>
        )}
        <div className="flex w-full mt-3">
          <div className="flex flex-col w-1/2 space-y-4">
            <div>non customer controls below, for demo only</div>
            <label htmlFor="nonInteractive" className="text-dark">
              Show non-interactive "read-only" wave animation
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
                onChange={(e) =>
                  setPhaseAnimationFactor(+e.currentTarget.value)
                }
              />
            </label>
            <div className="flex space-x-4">
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
            </div>
          </div>

          <div className="flex flex-col w-1/2 space-y-4">
            <div>
              <b>Inputs for test data for target wave</b>
            </div>
            <div className="flex">
              <label htmlFor="targetWavelength" className="text-dark">
                Wavelength
                <input
                  id="targetWavelength"
                  className="ml-2 border-2 border-gray w-15"
                  type="number"
                  min="0.05"
                  max="1"
                  step="0.01"
                  value={targetWavelength}
                  onChange={(e) => setTargetWavelength(+e.currentTarget.value)}
                />
              </label>
              <label htmlFor="xScale" className="ml-8 text-dark">
                X axis/wavelength scale
                <input
                  id="xScale"
                  className="ml-2 border-2 border-gray w-15"
                  type="number"
                  min="1"
                  max="50"
                  step="1"
                  value={xScale}
                  onChange={(e) => setXScale(+e.currentTarget.value)}
                />
              </label>
            </div>
            <label htmlFor="targetAmplitude" className="text-dark">
              Amplitude
              <input
                id="targetAmplitude"
                className="ml-2 border-2 border-gray w-15"
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={targetAmplitude}
                onChange={(e) => setTargetAmplitude(+e.currentTarget.value)}
              />
            </label>
            <label htmlFor="targetPhase" className="text-dark">
              Phase
              <input
                id="targetPhase"
                className="ml-2 border-2 border-gray w-15"
                type="number"
                min="0"
                max="2"
                step="0.01"
                value={targetPhase}
                onChange={(e) => setTargetPhase(+e.currentTarget.value)}
              />{" "}
              x π
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Wave;
