<template>
  <div class="card">
    <div
      class="card-name"
      :contenteditable="contenteditable"
      @dblclick="onDoubleClick"
      @keypress.enter="onKeyPressEnter"
      @blur="onBlur"
    >
      <Cross @click="removeCard" />
      {{ card.text }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, PropSync } from "vue-property-decorator";
import Cross from "@/components/Cross.vue";
import { ICard, IList } from "@/types";

export interface IRemoveCardEvent {
  listId: number;
  cardId: number;
}

@Component({
  components: {
    Cross
  }
})
export default class Card extends Vue {
  @Prop({ type: Number, required: true })
  listId!: IList["id"];

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

  @Emit()
  removeCard(): IRemoveCardEvent {
    return {
      listId: this.listId,
      cardId: this.card.id
    };
  }
}
</script>

<style lang="scss" scoped>
.card {
  border: 1px solid #000000;

  &-name {
    position: relative;

    > .cross {
      right: 0;
    }
  }
}
</style>
