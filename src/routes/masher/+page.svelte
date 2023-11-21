<script>
  import { getRemoteAudio, reverseAudioBuffer } from "$lib/utils.js";
  import { stretchBuffer } from "$lib/rubberband.js";

  import Slicer from "$lib/Slicer.js";
  import SlicerView from "./SlicerView.svelte";

  let context;

  let slicers = $state([]);

  async function createSlicer(url) {
    // slicer.loadBuffer(1, reverseAudioBuffer(buffer));
    // slicer.loadBuffer(2, fastBuffer);
    // slicer.loadBuffer(3, reverseAudioBuffer(fastBuffer));

    return slicer;
  }

  let sampleNums = $state([]);

  async function load() {
    context = new AudioContext();

    slicers = [];

    // const p = comboEl.value.split("");

    const slicer1 = new Slicer({
      context,
      sliceLength: 0.5 * 44100,
      numSlices: 16,
    });

    const slicer2 = new Slicer({
      context,
      sliceLength: 0.5 * 44100,
      numSlices: 16,
    });

    const slicer3 = new Slicer({
      context,
      sliceLength: 0.5 * 44100,
      numSlices: 16,
    });

    slicers = [slicer1, slicer2, slicer3];
    sampleNums = [1, 1, 1];
  }

  $effect(async () => {
    await slicers[0]?.loadUrl(
      `/audio/120bpm/c_major/bass/${sampleNums[0]}.ogg`
    );
  });
  $effect(async () => {
    await slicers[1]?.loadUrl(
      `/audio/120bpm/c_major/drums/${sampleNums[1]}.ogg`
    );
  });
  $effect(async () => {
    await slicers[2]?.loadUrl(
      `/audio/120bpm/c_major/leads/${sampleNums[2]}.ogg`
    );
  });

  function play() {
    slicers.forEach((s) => s.play());
  }
  function stop() {
    slicers.forEach((s) => s.stop());
  }
</script>

<!-- {#each slicers as slicer, index} -->
{#if slicers?.length == 3}
  <h3>
    Bass
    <input bind:value={sampleNums[0]} type="range" min="1" max="5" />
  </h3>

  <SlicerView slicer={slicers[0]} style="filter: hue-rotate(90deg)" />

  <h3>
    Drums
    <input bind:value={sampleNums[1]} type="range" min="1" max="5" />
  </h3>
  <SlicerView slicer={slicers[1]} style="filter: hue-rotate(45deg)" />

  <h3>
    Lead
    <input bind:value={sampleNums[2]} type="range" min="1" max="5" />
  </h3>
  <SlicerView slicer={slicers[2]} />
  <br />
  <button onclick={play}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"
      ><path fill="currentColor" d="M8 19V5l11 7l-11 7Z" /></svg
    >
  </button>

  <button onclick={stop}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 24 24"><path fill="currentColor" d="M6 18V6h12v12H6Z" /></svg
    >
  </button>
{:else}
  <button onclick={load}>Load</button>
{/if}

<!-- {/each} -->

<style>
  h3,
  p {
    font-family: arial;
  }
</style>
