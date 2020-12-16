import { useEffect, useState } from "react";

export interface FpsCounterProps {
  updateInterval?: number;
  showAverage?: boolean;
  className?: string;
}

function FpsCounter({
  showAverage,
  updateInterval = 30,
  className,
}: FpsCounterProps): JSX.Element {
  const [fps, setFps] = useState(0);
  const [averageFps, setAverageFps] = useState(0);

  useEffect(() => {
    let requestId: number;

    function render(
      previousTime: number,
      frameCount = 0,
      fpsAccumulator: number[] | [] = []
    ) {
      const currentTime = performance.now();
      const elapsed = currentTime / 1000 - previousTime / 1000;

      const fps = Math.round(1 / elapsed);

      let nextFpsAccumulator = [...fpsAccumulator, fps];

      if (frameCount === updateInterval) {
        setFps(fps);

        if (showAverage) {
          const average =
            nextFpsAccumulator.reduce((prev, curr) => {
              return prev + curr;
            }) / nextFpsAccumulator.length;
          setAverageFps(Math.round(average));
        }

        nextFpsAccumulator = [];
      }

      const nextFrameCount = frameCount < updateInterval ? frameCount + 1 : 0;

      requestId = requestAnimationFrame(() =>
        render(currentTime, nextFrameCount, nextFpsAccumulator)
      );
    }

    render(performance.now());

    return function cleanup(): void {
      cancelAnimationFrame(requestId);
    };
  }, [showAverage, updateInterval]);

  return (
    <div className={className}>
      <div>FPS: {fps}</div>
      {showAverage && <div>Avg. FPS: {averageFps}</div>}
    </div>
  );
}

export default FpsCounter;
