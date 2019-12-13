<template>
  <span class="cross" @click="click" />
</template>

<script lang="ts">
import { Component, Vue, Emit } from "vue-property-decorator";

@Component
export default class Cross extends Vue {
  @Emit()
  click(): void {}
}
</script>

<style lang="scss" scoped>
.cross {
  display: inline-block;
  width: 16px;
  height: 16px;
  position: absolute;

  &:before,
  &:after {
    width: 100%;
    border-top: 1px solid #000000;
    position: absolute;
    top: 50%;
    content: "";
  }

  &:before {
    transform: rotate(-45deg);
  }

  &:after {
    transform: rotate(45deg);
  }
}
</style>
