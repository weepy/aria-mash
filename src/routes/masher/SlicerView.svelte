<script>
  let { slicer, style = "" } = $props();

  function updateSliceIndex(e, index) {
    slicer.sliceOptions[index].position = e.target.valueAsNumber;
  }

  function updateBank(e, index) {
    const opts = slicer.sliceOptions[index];

    slicer.sliceOptions[index].bank = e.target.valueAsNumber;

    // const num = e.target.valueAsNumber;
    // opts.reverse = num % 2 == 1
    // opts.speed = num < 2 ? 1 : num < 4 ?
  }

  function updateRandomize(e) {
    slicer.randomize = e.target.valueAsNumber;
    slicer.createRandomLoop();
  }
</script>

<div>
  <!-- <label>Delta mode</label><input
    type="checkbox"
    bind:checked={slicer.deltaMode}
  /> -->
</div>

<div class="slice-wrapper" {style}>
  <div>
    {#each slicer.sliceOptions as pos, index}
      <input
        type="range"
        on:focus={(e) => e.target.blur()}
        on:mousemove={(e) => updateSliceIndex(e, index)}
        value={slicer.sliceOptions[index].position}
        min={slicer.deltaMode ? -slicer.sliceOptions.length - 1 : 0}
        step="1"
        max={slicer.sliceOptions.length - 1}
      />
    {/each}
  </div>

  <div style="margin-left: 1rem">
    {#each slicer.sliceOptions as pos, index}
      <input
        type="range"
        on:focus={(e) => e.target.blur()}
        on:mousemove={(e) => updateBank(e, index)}
        value={slicer.sliceOptions[index].bank}
        min="0"
        step="1"
        max="5"
      />
    {/each}
  </div>

  <div style="margin-left: 1rem">
    <input
      class="randomize"
      type="range"
      min="0"
      max="1"
      step="0.01"
      value={slicer.randomize}
      on:change={updateRandomize}
    />
  </div>
</div>

<style>
  .randomize {
    /* margin-left: 1rem; */
  }
  .slice-wrapper {
    display: flex;
    margin-top: 10px;
  }
  [type="range"] {
    appearance: slider-vertical;
    margin: 0;
    padding: 0;
    width: 18px;
  }
</style>
