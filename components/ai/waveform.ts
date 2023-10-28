// import React, { useEffect, useRef } from "react";
// import WaveSurfer from "wavesurfer.js";

// interface WaveformProps {
//   url: string;
// }

// const Waveform: React.FC<WaveformProps> = ({ url }) => {
//   const waveformRef = useRef(null);

//   useEffect(() => {
//     if (waveformRef.current) {
//       const wavesurfer = WaveSurfer.create({
//         container: waveformRef.current,
//         waveColor: "violet",
//         progressColor: "purple",
//       });

//       wavesurfer.load(url);
//     }
//   }, [url]);
// };

// export default Waveform;
