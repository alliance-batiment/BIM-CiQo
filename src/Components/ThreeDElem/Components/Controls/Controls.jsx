import React, { useRef } from 'react';
import { extend, useFrame, useThree } from 'react-three-fiber';
import { OrbitControls } from './OrbitControls';
extend({ OrbitControls });


function Controls() {
  const controlsRef = useRef();
  const { camera, gl } = useThree();

  useFrame(() => controlsRef.current && controlsRef.current.update());

  return (
    <>
      <orbitControls
        ref={controlsRef}
        args={[camera, gl.domElement]}
        enableRotate
        enablePan={true}
        maxDistance={100}
        minDistance={0}
        maxAzimuthAngle={Math.PI / 4}
        maxPolarAngle={Math.PI}
        minAzimuthAngle={-Math.PI / 4}
        minPolarAngle={0}
      /*minPolarAngle={Math.PI / 6}
      maxPolarAngle={Math.PI / 2}*/
      />
    </>
  );
}

export default Controls;
