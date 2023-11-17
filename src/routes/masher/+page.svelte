<script>
  import { getRemoteAudio, reverseAudioBuffer } from "$lib/utils.js";
  import { stretchBuffer } from "$lib/rubberband.js";

  import Slicer from "$lib/Slicer.js";
  //   import { get } from "svelte/store";
  let context;

  let slicer = $state();
  async function load() {
    context = new AudioContext();
    slicer = new Slicer({
      context,
      sliceLength: 0.5 * 44100,
      numSlices: 16,
    });

    const buffer = await getRemoteAudio(
      "/audio/120bpm/c_major/bass/2.ogg",
      context
    );

    const fastBuffer = await stretchBuffer(buffer, { speed: 2 });

    slicer.loadBuffer(0, buffer);
    slicer.loadBuffer(1, reverseAudioBuffer(buffer));
    slicer.loadBuffer(2, fastBuffer);
    slicer.loadBuffer(3, reverseAudioBuffer(fastBuffer));
    // slicer.start();
  }

  function play() {
    slicer.play();
  }
  function stop() {
    slicer.stop();
  }
  let isDragging = false;

  function startDrag() {
    isDragging = true;
  }

  function stopDrag() {
    isDragging = false;
  }

  function updateValue(e, index) {
    if (isDragging) {
      slicer.slicePositions[index] = e.target.valueAsNumber;
    }
  }
</script>

<button onclick={load}> load </button>

<button onclick={play}> play </button>

<button onclick={stop}> stop </button>

{#if slicer}
  <div
    class="slice-wrapper"
    on:mousedown={startDrag}
    on:mouseup={stopDrag}
    on:mouseleave={stopDrag}
  >
    {#each slicer.slicePositions as pos, index}
      <input
        type="range"
        on:focus={(e) => e.target.blur()}
        on:mousemove={(e) => updateValue(e, index)}
        bind:value={slicer.slicePositions[index]}
        min="0"
        step="1"
        max={slicer.slicePositions.length - 1}
      />
    {/each}
  </div>
{/if}

<style>
  .slice-wrapper {
    display: flex;
    margin-top: 10px;
  }
  [type="range"] {
    appearance: slider-vertical;
    margin: 0;
    padding: 0;
    width: 20px;
  }
</style>
