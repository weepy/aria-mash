<!-- <script src="./main.js"></script> -->

<script>
  import {
    getRemoteAudio,
    // objectToAudioBuffer,
    // audioBufferToObject,
    playBuffer2,
  } from "$lib/utils.js";

  // import "$lib/utils.js";
  import localforage from "localforage";

  import { onMount } from "svelte";
  onMount(async () => {
    const buffer = await getRemoteAudio("/audio/amen.wav");

    await localforage.setAudio("x", buffer);
    const buffer2 = await localforage.getAudio("x");

    playBuffer2(buffer2);
  });
</script>
