import { Canvas } from "@react-three/fiber"
import { Particles } from "./particles"

export const GL = ({ hovering }: { hovering: boolean }) => {
  const config = {
    speed: 1.2, // Increased speed for more animation
    noiseScale: 0.7,
    noiseIntensity: 0.65, // Increased for more movement
    timeScale: 1.0, // Increased time scale
    focus: 3.5,
    aperture: 1.5,
    pointSize: 14.0, // Increased point size for better visibility
    opacity: 0.85, // Increased opacity
    planeScale: 12.0, // Increased plane scale
    size: 512,
    useManualTime: false,
    manualTime: 0,
  }

  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{
          position: [1.26, 2.66, -1.82],
          fov: 50,
          near: 0.01,
          far: 300,
        }}
      >
        <color attach="background" args={["#fef3f5"]} />
        <Particles
          speed={config.speed}
          aperture={config.aperture}
          focus={config.focus}
          size={config.size}
          noiseScale={config.noiseScale}
          noiseIntensity={config.noiseIntensity}
          timeScale={config.timeScale}
          pointSize={config.pointSize}
          opacity={config.opacity}
          planeScale={config.planeScale}
          useManualTime={config.useManualTime}
          manualTime={config.manualTime}
          introspect={hovering}
        />
      </Canvas>
    </div>
  )
}
