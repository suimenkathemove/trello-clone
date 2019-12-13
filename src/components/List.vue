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
    />
    <input type="text" class="card-input" @change="addCard" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, PropSync } from "vue-property-decorator";
import Card from "@/components/Card.vue";
import Cross from "@/components/Cross.vue";
import { IList } from "@/types";
import { IRemoveCardEvent } from "@/components/Card.vue";

export interface IAddCardEvent {
  listId: number;
  text: string;
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
