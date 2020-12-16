import React, { useEffect, useRef, useState } from "react";
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
  wavelength: number;
  phase: number;
  styles?: LineStyles;
}

export interface WaveCanvasProps {
  waves: Wave[];
  xScale?: number;
  axisStyles?: { hideAxis?: boolean } & LineStyles;
  phaseAnimationFactor?: number;
  showWaveSummation?: boolean;
  waveSummationStyles?: LineStyles;
  animatePhase?: boolean;
  canvasHeight?: number;
}

function WaveCanvas({
  waves,
  xScale = 10,
  axisStyles,
  showWaveSummation = true,
  waveSummationStyles,
  animatePhase = true,
  phaseAnimationFactor = DEFAULTS.phaseAnimationFactor,
  canvasHeight = 400,
}: WaveCanvasProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [parentWidth, setParentWidth] = useState(0);

  useEffect(() => {
    setParentWidth(canvasRef?.current?.parentElement?.clientWidth || 0);
  }, []);

  useEffect((): (() => void) => {
    const canvas = canvasRef.current;

    const context = canvas?.getContext("2d");

    let requestId: number;

    let animationPhase = 0;

    function render(): void {
      if (!context) return;

      const { width, height } = context.canvas;

      context.clearRect(0, 0, width, height);

      const canvasYDivision = showWaveSummation ? height / 4 : height / 2;

      const graphHeight = canvasYDivision / 2;

      const topGraphYOrigin = canvasYDivision;

      const bottomGraphYOrigin = showWaveSummation
        ? canvasYDivision * 3
        : canvasYDivision;

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

      waves.forEach(({ amplitude, styles, wavelength, phase }) => {
        const phaseRad = phase * Math.PI;

        context.beginPath();

        context.lineWidth = styles?.lineWidth || DEFAULTS.waveLineWidth;

        for (let x = 0; x < width; x++) {
          const y =
            bottomGraphYOrigin +
            graphHeight *
              amplitude *
              Math.sin(
                x * 2 * Math.PI * (wavelength / width) * xScale -
                  animationPhase -
                  phaseRad
              );

          context.lineTo(x, y);
        }

        context.strokeStyle = styles?.lineColor || DEFAULTS.waveLineColor;
        context.setLineDash(styles?.dashArray || []);
        context.stroke();

        context.closePath();
      });

      //TODO:  Update this for multiple waves
      if (showWaveSummation && waves.length === 2) {
        const a1 = waves[0].amplitude;
        const a2 = waves[1].amplitude;
        const f1 = waves[0].wavelength;
        const f2 = waves[1].wavelength;
        const p1 = waves[0].phase * Math.PI;
        const p2 = waves[1].phase * Math.PI;

        context.beginPath();
        context.lineWidth =
          waveSummationStyles?.lineWidth || DEFAULTS.summationLineWidth;

        for (let x = 0; x < width; x++) {
          const y =
            topGraphYOrigin +
            graphHeight *
              a1 *
              Math.sin(
                x * 2 * Math.PI * (f1 / width) * xScale - animationPhase - p1
              ) +
            graphHeight *
              a2 *
              Math.sin(
                x * 2 * Math.PI * (f2 / width) * xScale - animationPhase - p2
              );

          context.lineTo(x, y);
        }

        context.strokeStyle =
          waveSummationStyles?.lineColor || DEFAULTS.summationLineColor;
        context.setLineDash(waveSummationStyles?.dashArray || []);
        context.stroke();

        context.closePath();

        if (!axisStyles?.hideAxis) {
          drawAxis(topGraphYOrigin);
        }
      }

      if (!axisStyles?.hideAxis) {
        drawAxis(bottomGraphYOrigin);
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
    showWaveSummation,
    waveSummationStyles?.dashArray,
    waveSummationStyles?.lineColor,
    waveSummationStyles?.lineWidth,
    waves,
    xScale,
  ]);

  return <canvas ref={canvasRef} width={parentWidth} height={canvasHeight} />;
}

export default WaveCanvas;
