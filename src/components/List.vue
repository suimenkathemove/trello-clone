<template>
  <div class="list">
    <div
      class="list-name"
      :contenteditable="contenteditable"
      @dblclick="onDoubleClick"
      @keypress.enter="onKeyPressEnter"
      @blur="onBlur"
    >
      <Cross @click="removeList" />
      {{ list.name }}
    </div>
    <Card
      v-for="card in list.cards"
      :key="card.id"
      class="card"
      :listId="list.id"
      :card="card"
      :cardText.sync="card.text"
      @remove-card="removeCard"
      draggable
      @dragstart.native.stop="onDragStart(card, $event)"
      @dragover.native="moveCard(card.id, $event)"
      @dragend.native="onDragEnd"
    />
    <input type="text" class="card-input" @change="addCard" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, PropSync } from "vue-property-decorator";
import Card from "@/components/Card.vue";
import Cross from "@/components/Cross.vue";
import { IList, ICard } from "@/types";
import { IRemoveCardEvent } from "@/components/Card.vue";
import { ICardData } from "@/App.vue";

export interface IAddCardEvent {
  listId: number;
  text: string;
}

export interface IMoveCardEvent {
  listId: number;
  cardId: number;
  event: DragEvent & { currentTarget: HTMLDivElement };
}

@Component({
  components: {
    Card,
    Cross
  }
})
export default class List extends Vue {
  @Prop({ type: Object, required: true })
  readonly list!: IList;

  @PropSync("listName", { type: String, required: true })
  syncedListName!: IList["name"];

  @PropSync("draggedCardData", { required: true })
  syncedDraggedCardData!: ICardData | null;

  contenteditable = false;

  @Emit()
  addCard(event: Event & { currentTarget: HTMLInputElement }): IAddCardEvent {
    const text = event.currentTarget.value;

    event.currentTarget.value = "";

    return {
      listId: this.list.id,
      text
    };
  }

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
    this.syncedListName = event.currentTarget.innerText;

    this.contenteditable = false;
  }

  @Emit()
  removeList(): number {
    return this.list.id;
  }

  @Emit()
  removeCard(event: IRemoveCardEvent): IRemoveCardEvent {
    return event;
  }

  onDragStart(card: ICard, event: DragEvent): void {
    if (event.dataTransfer == null) return;
    event.dataTransfer.setData("text/plain", "");

    this.syncedDraggedCardData = {
      listId: this.list.id,
      card
    };
  }

  @Emit()
  moveCard(
    cardId: number,
    event: DragEvent & { currentTarget: HTMLDivElement }
  ): IMoveCardEvent {
    return {
      listId: this.list.id,
      cardId,
      event
    };
  }

  onDragEnd(): void {
    this.syncedDraggedCardData = null;
  }
}
</script>

<style lang="scss" scoped>
.list {
  width: 160px;
  border: 1px solid #000000;

  &-name {
    position: relative;

    > .cross {
      right: 0;
    }
  }

  > .card {
    margin: 1px;
  }

  > .card-input {
    width: 100%;
  }
}
</style>
