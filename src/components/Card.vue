<template>
  <div class="card">
    <div
      :contenteditable="contenteditable"
      @dblclick="onDoubleClick"
      @keypress.enter="onKeyPressEnter"
      @blur="onBlur"
    >
      {{ card.text }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";
import { ICard } from "@/types";

@Component
export default class Card extends Vue {
  @Prop({ type: Object, required: true })
  readonly card!: ICard;

  @PropSync("cardText", { type: String, required: true })
  syncedCardText!: ICard["text"];

  contenteditable = false;

  onDoubleClick(event: MouseEvent & { currentTarget: HTMLDivElement }): void {
    this.contenteditable = true;

    event.currentTarget.focus();
  }

  onKeyPressEnter(
    event: KeyboardEvent & { currentTarget: HTMLDivElement }
  ): void {
    event.currentTarget.blur();
  }

  onBlur(event: FocusEvent & { currentTarget: HTMLDivElement }): void {
    this.syncedCardText = event.currentTarget.innerText;

    this.contenteditable = false;
  }
}
</script>

<style lang="scss" scoped>
.card {
  border: 1px solid #000000;
}
</style>
