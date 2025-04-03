import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactPlayer from 'react-player/lazy';
import {
  Box,
  Flex,
  IconButton,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  Spinner,
  useStyleConfig,
  VisuallyHidden,
} from '@chakra-ui/react';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand, FaCompress } from 'react-icons/fa';
import screenfull from 'screenfull'; // Ensure screenfull is imported if used

interface CustomVideoPlayerProps {
  videoUrl: string;
  color?: string;
}

// Basic example for frosted glass style - refine in your theme or here
const controlStyle = {
  backdropFilter: 'blur(5px)',
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  WebkitBackdropFilter: 'blur(5px)', // For Safari
};

const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({ videoUrl, color }) => {
  const playerRef = useRef<ReactPlayer>(null);
  const playerWrapperRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Ref for the inactivity timer

  // --- State for Custom Controls ---
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false); // Start unmuted
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(screenfull.isFullscreen);
  const [showControls, setShowControls] = useState(false);

  // --- Handlers (Keep all handlers: handlePlayPause, handleVolumeChange, etc.) ---
  const handlePlayPause = useCallback(() => {
    setIsPlaying(prevIsPlaying => !prevIsPlaying);
  }, []);
  const handleVolumeChange = (value: number) => { setVolume(value); setIsMuted(value === 0); };
  const handleToggleMute = () => { setIsMuted(!isMuted); if (isMuted && volume === 0) setVolume(0.5); };
  const handleSeekMouseDown = () => setSeeking(true);
  const handleSeekChange = (value: number) => setPlayedSeconds(value);
  const handleSeekMouseUp = (value: number) => { setSeeking(false); playerRef.current?.seekTo(value); };
  const handleProgress = (state: { playedSeconds: number }) => { if (!seeking) setPlayedSeconds(state.playedSeconds); };
  const handleDuration = (durationSeconds: number) => setDuration(durationSeconds);
  const handleReady = () => setIsReady(true);
  const handleEnded = () => setIsPlaying(false);

  const handleToggleFullscreen = () => {
    if (screenfull.isEnabled && playerWrapperRef.current) {
      screenfull.toggle(playerWrapperRef.current);
    }
  };

  // --- Controls Visibility Logic ---
  const hideControls = useCallback(() => {
    setShowControls(false);
  }, []);

  const displayControls = useCallback(() => {
    setShowControls(true);
    // Clear existing timer if any
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    // Set a new timer to hide controls after 3 seconds of inactivity
    controlsTimeoutRef.current = setTimeout(hideControls, 3000);
  }, [hideControls]);

  // Clear timer on unmount
  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  // Effect to listen for fullscreen changes (e.g., user pressing Esc)
  useEffect(() => {
    const handleChange = () => {
      if (screenfull.isEnabled) {
        setIsFullscreen(screenfull.isFullscreen);
      }
    };
    if (screenfull.isEnabled) {
      screenfull.on('change', handleChange);
    }
    return () => {
      if (screenfull.isEnabled) {
        screenfull.off('change', handleChange);
      }
    };
  }, []);

  // Format time helper
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === Infinity) {
      return '0:00';
    }
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  // --- Keyboard Listener for Space Bar ---
  useEffect(() => {
    const playerElement = playerWrapperRef.current;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if the focused element is the player wrapper or something inside it,
      // but not an input/slider itself to avoid conflicts.
      // For simplicity here, we just check for space if the player has focus.
      if (document.activeElement === playerElement && (event.key === ' ' || event.code === 'Space')) {
        event.preventDefault(); // Prevent page scroll
        handlePlayPause();
      }
    };

    if (playerElement) {
      // Add listener to the focusable player element
      playerElement.addEventListener('keydown', handleKeyDown);
    }

    // Cleanup function
    return () => {
      if (playerElement) {
        playerElement.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [handlePlayPause]);

  // --- Render
  return (
    <Box
      ref={playerWrapperRef}
      position="absolute"
      top="0"
      left="0"
      width="100%"
      height="100%"
      bg="black"
      overflow="hidden"
      onMouseEnter={displayControls}
      onMouseLeave={hideControls}
      onMouseMove={displayControls}
      cursor={showControls ? 'auto' : 'none'}
      onClick={handlePlayPause}
      tabIndex={0}
      _focusVisible={{ outline: '2px solid teal' }}
    >
      <Box pointerEvents="none" position="absolute" top="0" left="0" width="100%" height="100%">
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          playing={isPlaying}
          volume={volume}
          muted={isMuted}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onReady={handleReady}
          onEnded={handleEnded}
          width="100%"
          height="100%"
          controls={false}
          loop={false}
          playsinline
        />
      </Box>

      {!isReady && (
         <Flex position="absolute" top="0" left="0" right="0" bottom="0" align="center" justify="center" zIndex={1}>
           <Spinner size="xl" color="white" />
         </Flex>
      )}

      {isReady && (
        <Box
          position="absolute"
          bottom="0"
          left="0"
          right="0"
          p="2"
          sx={controlStyle}
          zIndex={2}
          opacity={showControls ? 1 : 0}
          transform={showControls ? 'translateY(0)' : 'translateY(100%)'}
          transition="opacity 0.3s ease-in-out, transform 0.3s ease-in-out"
          pointerEvents={showControls ? 'auto' : 'none'}
          onClick={(e) => e.stopPropagation()}
        >
          <Flex align="center" justify="space-between">
             <IconButton
               aria-label={isPlaying ? 'Pause' : 'Play'}
               icon={isPlaying ? <FaPause /> : <FaPlay />}
               onClick={handlePlayPause}
               size="sm" variant="ghost" color="white" _hover={{ bg: 'rgba(255, 255, 255, 0.3)' }}
             />
             <Slider
               aria-label="seek-slider"
               flex="1"
               mx="4"
               min={0}
               max={duration}
               step={0.1}
               value={playedSeconds}
               onChangeStart={handleSeekMouseDown}
               onChange={handleSeekChange}
               onChangeEnd={handleSeekMouseUp}
               focusThumbOnChange={false}
             >
               <SliderTrack bg="rgba(255, 255, 255, 0.3)">
                 <SliderFilledTrack bg={color || 'teal.300'} />
               </SliderTrack>
               <SliderThumb boxSize={3} />
               <VisuallyHidden>Seek</VisuallyHidden>
             </Slider>
             <Text fontSize="xs" color="white" minW="80px" textAlign="center">
               {formatTime(playedSeconds)} / {formatTime(duration)}
             </Text>
             <Flex align="center" ml="4">
                <IconButton aria-label={isMuted ? 'Unmute' : 'Mute'} icon={isMuted ? <FaVolumeMute /> : <FaVolumeUp />} onClick={handleToggleMute} />
                <Slider aria-label="volume-slider" onChange={handleVolumeChange} />
             </Flex>
             <IconButton aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'} icon={isFullscreen ? <FaCompress /> : <FaExpand />} onClick={handleToggleFullscreen} />
          </Flex>
        </Box>
      )}
    </Box>
  );
};

export default CustomVideoPlayer; 