<script>
  import { getRemoteAudio, reverseAudioBuffer } from "$lib/utils.js";
  import { stretchBuffer } from "$lib/rubberband.js";

  import Slicer from "$lib/Slicer.js";
  import SlicerView from "./SlicerView.svelte";

  let context;

  let slicers = $state(null);

  async function createSlicer(url) {
    const slicer = new Slicer({
      context,
      sliceLength: 0.5 * 44100,
      numSlices: 16,
    });

    const buffer = await getRemoteAudio(url, context);

    const fastBuffer = await stretchBuffer(buffer, { speed: 2 });

    slicer.loadBuffer(0, buffer);
    slicer.loadBuffer(1, reverseAudioBuffer(buffer));
    slicer.loadBuffer(2, fastBuffer);
    slicer.loadBuffer(3, reverseAudioBuffer(fastBuffer));

    return slicer;
  }

  let comboEl = $state();

  async function load() {
    context = new AudioContext();

    slicers = [];

    const p = comboEl.value.split("");

    const slicer1 = await createSlicer(
      `/audio/120bpm/c_major/bass/${p[0]}.ogg`
    );
    const slicer2 = await createSlicer(
      `/audio/120bpm/c_major/drums/${p[1]}.ogg`
    );
    const slicer3 = await createSlicer(
      `/audio/120bpm/c_major/leads/${p[2]}.ogg`
    );

    slicers = [slicer1, slicer2, slicer3];
  }

  function play() {
    slicers.forEach((s) => s.play());
  }
  function stop() {
    slicers.forEach((s) => s.stop());
  }
</script>

<!-- {#each slicers as slicer, index} -->
{#if slicers?.length == 3}
  <h3>Bass</h3>
  <SlicerView slicer={slicers[0]} style="filter: hue-rotate(90deg)" />

  <h3>Drums</h3>
  <SlicerView slicer={slicers[1]} style="filter: hue-rotate(45deg)" />

  <h3>Lead</h3>
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
{:else if slicers}
  <h3>Loading</h3>
{:else}
  <input type="text" value="111" bind:this={comboEl} />
  <button onclick={load}>Load</button>
  <p>Which set of sample to play. Each digit can be 1-5.</p>
{/if}

<!-- {/each} -->

<style>
  h3,
  p {
    font-family: arial;
  }
</style>
