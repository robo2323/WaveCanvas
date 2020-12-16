import React, { useEffect, useRef } from "react";
import "@qctrl/elements-css/dist/elements.min.css";

const DEFAULTS = {
  waveLineWidth: 4,
  waveLineColor: "#000",
  axisLineWidth: 1,
  axisLineColor: "rgba(0,0,0,0.4)",
  summationLineWidth: 4,
  summationLineColor: "rgba(144, 201, 247,1)",
  phaseAnimationFactor: 0.1,
};

export interface LineStyles {
  lineColor?: string;
  lineWidth?: number;
  dashArray?: number[];
}

export interface Wave {
  amplitude: number;
  frequency: number;
  phase: number;
  styles?: LineStyles;
}

export interface WaveCanvasProps {
  waves: Wave[];
  axisStyles?: { hideAxis?: boolean } & LineStyles;
  phaseAnimationFactor?: number;
  waveSummationStyles?: {
    showSummation?: boolean;
    overlay?: boolean;
  } & LineStyles;
  animatePhase?: boolean;
}

function WaveCanvas({
  waves,
  axisStyles,
  waveSummationStyles,
  animatePhase = true,
  phaseAnimationFactor = DEFAULTS.phaseAnimationFactor,
}: WaveCanvasProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect((): (() => void) => {
    const canvas = canvasRef.current;

    const context = canvas?.getContext("2d");

    let requestId: number;

    let animationPhase = 0;

    function render(): void {
      if (!context) return;

      const { width, height } = context.canvas;

      context.clearRect(0, 0, width, height);

      const heightOffset =
        waveSummationStyles?.showSummation && !waveSummationStyles.overlay
          ? height / 3
          : height / 2;

      function drawAxis(hOffset: number): void {
        if (!context) return;
        context.beginPath();
        context.moveTo(0, hOffset);
        context.lineWidth = axisStyles?.lineWidth || DEFAULTS.axisLineWidth;
        context.strokeStyle = axisStyles?.lineColor || DEFAULTS.axisLineColor;
        context.setLineDash(axisStyles?.dashArray || []);
        context.lineTo(width, hOffset);
        context.stroke();
        context.setLineDash([]);
        context.closePath();
      }

      waves.forEach(({ amplitude, styles, frequency, phase }) => {
        context.beginPath();

        context.lineWidth = styles?.lineWidth || DEFAULTS.waveLineWidth;

        for (let x = 0; x < width; x++) {
          const y =
            heightOffset +
            amplitude *
              Math.sin(
                x * 2 * Math.PI * (frequency / width) - animationPhase - phase
              );

          context.lineTo(x, y);
        }

        context.strokeStyle = styles?.lineColor || DEFAULTS.waveLineColor;
        context.setLineDash(styles?.dashArray || []);
        context.stroke();

        context.closePath();
      });

      if (waveSummationStyles?.showSummation && waves.length === 2) {
        const a1 = waves[0].amplitude;
        const a2 = waves[1].amplitude;
        const f1 = waves[0].frequency;
        const f2 = waves[1].frequency;
        const p1 = waves[0].phase;
        const p2 = waves[1].phase;

        const { dashArray, lineColor, lineWidth } = waveSummationStyles;

        context.beginPath();
        context.lineWidth = lineWidth || DEFAULTS.summationLineWidth;

        const offset = waveSummationStyles.overlay
          ? heightOffset
          : heightOffset * 2;

        for (let x = 0; x < width; x++) {
          const y =
            offset +
            a1 *
              Math.sin(x * 2 * Math.PI * (f1 / width) - animationPhase - p1) +
            a2 * Math.sin(x * 2 * Math.PI * (f2 / width) - animationPhase - p2);

          context.lineTo(x, y);
        }

        context.strokeStyle = lineColor || DEFAULTS.summationLineColor;
        context.setLineDash(dashArray || []);
        context.stroke();

        context.closePath();

        if (!waveSummationStyles.overlay && !axisStyles?.hideAxis) {
          drawAxis(offset);
        }
      }

      if (!axisStyles?.hideAxis) {
        drawAxis(heightOffset);
      }

      if (animatePhase) {
        animationPhase =
          animationPhase < width ? animationPhase + phaseAnimationFactor : 0;
      }
      requestId = requestAnimationFrame(render);
    }

    render();

    return function cleanup(): void {
      if (requestId) cancelAnimationFrame(requestId);
    };
  }, [
    animatePhase,
    axisStyles?.dashArray,
    axisStyles?.hideAxis,
    axisStyles?.lineColor,
    axisStyles?.lineWidth,
    phaseAnimationFactor,
    waveSummationStyles,
    waves,
  ]);

  return (
    <div className="flex items-center">
      <canvas
        ref={canvasRef}
        //TODO: Set the following from the parent div
        width="800"
        height="600"
      />
    </div>
  );
}

export default WaveCanvas;
