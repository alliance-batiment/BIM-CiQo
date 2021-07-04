// import React, { useRef, useState } from 'react';
// import * as THREE from 'three';
// import { useFrame } from 'react-three-fiber';
// import { Vector3 } from 'three';

// function Line(props) {
// 	// This reference will give us direct access to the mesh
// 	const mesh = useRef();

// 	// Set up state for the hovered and active state
// 	const [hovered, setHover] = useState(false)
// 	const [active, setActive] = useState(false)

// 	const points = []
//   points.push(new THREE.Vector3(0, 0, 0))
//   points.push(new THREE.Vector3(3, 3, 0))

// 	const lineGeometry = new THREE.Geometry();
// 	lineGeometry.vertices.push(new THREE.Vector3(0, 0, 0), new THREE.Vector3(3, 3, 0));
// 	// Rotate mesh every frame, this is outside of React without overhead
// 	//useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01))

// 	return (
// 		<mesh
// 			{...props}
// 			ref={mesh}
// 			onClick={e => setActive(!active)}
// 			onPointerOver={e => setHover(true)}
// 			onPointerOut={e => setHover(false)}>
// 			<lineSegments
// 				geometry={lineGeometry}
// 			>
// 				<lineBasicMaterial
// 					attach="material"
// 					color={(hovered || active) ? 'red' : 'black'} 
// 					linewidth={active ? 2 : 1} 
// 				/>
// 			</lineSegments>

// 		</mesh>
// 	)
// };

// export default Line;