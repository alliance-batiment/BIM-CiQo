// import React, { useRef, useState } from 'react';
// import * as THREE from 'three';
// import { useFrame } from 'react-three-fiber';

// function Arrow(props) {
// 	// This reference will give us direct access to the mesh
// 	const mesh = useRef();

// 	const points = []
// 	points.push(new THREE.Vector3(0, 0, 0))
// 	points.push(new THREE.Vector3(3, 3, 0))

// 	const lineGeometry = new THREE.Geometry();
// 	lineGeometry.vertices.push(new THREE.Vector3(-10, 0, 0), new THREE.Vector3(3, 3, 0));
// 	// Rotate mesh every frame, this is outside of React without overhead
// 	//useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01))

// 	return (
// 		<mesh
// 			{...props}
// 			ref={mesh}>
// 			<arrowHelper
// 				geometry={lineGeometry}
// 			>
// 				<lineBasicMaterial
// 					attach="material"
// 				//color={(hovered || active) ? 'red' : 'black'} 
// 				//linewidth={active ? 2 : 1} 
// 				/>
// 			</arrowHelper>

// 		</mesh>
// 	)
// };

// export default Arrow;