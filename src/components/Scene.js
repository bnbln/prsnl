import { Canvas, extend, useLoader } from '@react-three/fiber';
import { useRef } from 'react';
import { Box, useColorMode } from '@chakra-ui/react';
import { Plane, Float, Text, AccumulativeShadows, RandomizedLight } from '@react-three/drei';
import { EffectComposer, DepthOfField, Bloom } from '@react-three/postprocessing';
import { OBJLoader } from 'three-stdlib';

// Extend the EffectComposer so it can be used in JSX
extend({ EffectComposer, DepthOfField, Bloom });

const Model = ({ path }) => {
  const obj = useLoader(OBJLoader, path);
  const { colorMode } = useColorMode();
  const color = colorMode === 'dark' ? '#f9f9f9' : '#080808';
  return <primitive object={obj} position={[-1, -0.5, -2]} scale={0.8}>
    <meshLambertMaterial color={color} />
  </primitive>;
};

const Scene = () => {
  return (
    <Box height="100%" width="100%">
      <Canvas camera={{ position: [0, 0, 5] }} shadows={true}>
        <ambientLight intensity={0.5} />
        <pointLight intensity={1} position={[10, 10, 10]} castShadow />
        <Float floatIntensity={5} speed={1}>
          {/* <Text position={[0, 0, 1]} ref={textRef} fontWeight={900} color={color} letterSpacing={-0.05} scale={0.8}>
            benedikt
          </Text> */}
          <Model path="/objects/logo.obj" />
        </Float>
        
        <EffectComposer>
          <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} />
        </EffectComposer>
      </Canvas>
    </Box>
  );
};

export default Scene;
