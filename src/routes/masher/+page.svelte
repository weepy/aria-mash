<script>
  import { getRemoteAudio, reverseAudioBuffer } from "$lib/utils.js";
  import { stretchBuffer } from "$lib/rubberband.js";

  import Slicer from "$lib/Slicer.js";
  import SlicerView from "./SlicerView.svelte";

  let context;

  let slicers = $state([]);

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

  async function load() {
    context = new AudioContext();

    const slicer1 = await createSlicer("/audio/120bpm/c_major/bass/2.ogg");
    const slicer2 = await createSlicer("/audio/120bpm/c_major/drums/2.ogg");
    const slicer3 = await createSlicer("/audio/120bpm/c_major/leads/2.ogg");

    slicers = [slicer1, slicer2, slicer3];
  }

  function play() {
    slicers.forEach((s) => s.play());
  }
  function stop() {
    slicers.forEach((s) => s.stop());
  }
</script>

<button onclick={load}> load </button>

<button onclick={play}> play </button>

<button onclick={stop}> stop </button>

{#each slicers as slicer, index}
  <SlicerView {slicer} />
{/each}
