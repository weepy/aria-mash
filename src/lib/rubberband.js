// import {
//   onNewFile,
//   onChangePitch,
//   onChangeTempo,
//   processAndPlay,
//   playOriginal,
//   processAndExport,
//   stop,
// } from "./main.js";


let audioCtx


let worker = null;
let processing = false;




function processOnWorker(msg, inputBuffer) {

  audioCtx = audioCtx || new AudioContext()

  processing = true;
  const workerInstance = new Worker("/rubberband-wasm/rubberband.worker.js");

  return new Promise((resolve) => {
    workerInstance.onmessage = function (e) {
      console.log("Message received from worker", e.data);
      if ("ready" in e.data) {
        worker = workerInstance;
        worker.postMessage(msg);
      }

      if ("status" in e.data) {
        console.log(e.data.status);
      }

      if ("progress" in e.data) {
        const progress = e.data.progress;
        console.log(`${(progress * 100).toFixed(0)}%)`)

      }

      if ("channelBuffers" in e.data) {
        const { channelBuffers } = e.data;
        const buffer = audioCtx.createBuffer(inputBuffer.numberOfChannels, channelBuffers[0].length, inputBuffer.sampleRate);
        channelBuffers.forEach((buf, i) => buffer.copyToChannel(buf, i));
        processing = false;
        resolve(buffer);
      }

      // if ("wavData" in e.data) {
      //   const { wavData } = e.data;
      //   processing = false;
      //   resolve(wavData);
      // }
    };
  });
}



export async function stretchBuffer(inputBuffer, { pitch = 0, speed = 1 } = {}) {


  const start = performance.now();


  const channelBuffers = [];
  for (let channel = 0; channel < inputBuffer.numberOfChannels; channel++) {
    channelBuffers.push(inputBuffer.getChannelData(channel));
  }

  const msg = {
    channelBuffers,
    sampleRate: inputBuffer.sampleRate,
    pitch: Math.pow(2, pitch / 12),
    tempo: 1 / speed,
  };


  const audioBuffer = await processOnWorker(msg, inputBuffer);
  const timeMs = performance.now() - start;

  console.log(`Finished processing in ${(timeMs / 1000).toFixed(3)} seconds.`);

  return audioBuffer

}


