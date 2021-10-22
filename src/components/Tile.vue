<template>
  <div v-bind:style="{
    width: width + 'px',
    height: height + 'px',
   'background-image': 'url(' + sprite + ')'
  }"
  >
  </div>
</template>

<script>
export default {
  name: 'Tile',
  props: {
    model: {
      default: {},
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
