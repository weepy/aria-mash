<!-- <script src="./main.js"></script> -->

<script>
  import { getRemoteAudio, playBuffer2 } from "$lib/utils.js";

  import { stretchBuffer } from "$lib/rubberband.js";

  async function processAndPlay() {
    const buffer = await getRemoteAudio("/audio/amen.wav");
    const stretchedBuffer = await stretchBuffer(buffer, {
      speed: 1.2,
      pitch: -3,
    });

    playBuffer2(stretchedBuffer, true);
  }
</script>

<button on:click={processAndPlay}>Play</button>
