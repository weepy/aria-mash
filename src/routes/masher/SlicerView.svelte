<script>
  let { slicer, style = "" } = $props();

  function updateSliceIndex(e, index) {
    slicer.slicePositions[index] = e.target.valueAsNumber;
  }

  function updateBankPosition(e, index) {
    slicer.sliceBankPositions[index] = e.target.valueAsNumber;
  }
</script>

<div class="slice-wrapper" {style}>
  {#each slicer.slicePositions as pos, index}
    <input
      type="range"
      on:focus={(e) => e.target.blur()}
      on:mousemove={(e) => updateSliceIndex(e, index)}
      value={slicer.slicePositions[index]}
      min="0"
      step="1"
      max={slicer.slicePositions.length - 1}
    />
  {/each}

  {#each slicer.sliceBankPositions as pos, index}
    <input
      type="range"
      on:focus={(e) => e.target.blur()}
      on:mousemove={(e) => updateBankPosition(e, index)}
      value={slicer.sliceBankPositions[index]}
      min="0"
      step="1"
      max={slicer.sliceBanks.length - 1}
    />
  {/each}
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
