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
</script>

<div class="slice-wrapper" {style}>
  <div>
    {#each slicer.sliceOptions as pos, index}
      <input
        type="range"
        on:focus={(e) => e.target.blur()}
        on:mousemove={(e) => updateSliceIndex(e, index)}
        value={slicer.sliceOptions[index].position}
        min="0"
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
</div>

<style>
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
