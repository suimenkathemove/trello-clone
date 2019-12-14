<template>
  <div id="app">
    <List
      v-for="list in lists"
      :key="list.id"
      class="list"
      :list="list"
      :listName.sync="list.name"
      @add-card="addCard"
      @remove-list="removeList"
      @remove-card="removeCard"
      draggable
      @dragstart.native="onDragStart(list, $event)"
      @dragover.native="moveList(list.id, $event)"
      @dragend.native="onDragEnd"
      :draggedCardData.sync="draggedCardData"
      @move-card="moveCard"
      @dragenter.native="moveCardForEmpty(list.id)"
    />
    <input type="text" class="list-input" @change="addList" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import List from "@/components/List.vue";
import { IList, ICard } from "@/types";
import { createInitialLists } from "@/initialData";
import { IAddCardEvent, IMoveCardEvent } from "@/components/List.vue";
import { IRemoveCardEvent } from "@/components/Card.vue";

enum CursorPosition {
  Left,
  Right,
  Center,
  Top,
  Bottom
}

export interface ICardData {
  listId: number;
  card: ICard;
}

@Component({
  components: {
    List
  }
})
export default class App extends Vue {
  lists: IList[] = createInitialLists();
  listCreatedCount = 2;
  cardCreatedCount = 4;
  draggedList: IList | null = null;
  draggedCardData: ICardData | null = null;

  addList(event: Event & { currentTarget: HTMLInputElement }): void {
    const newList = {
      id: this.listCreatedCount + 1,
      name: event.currentTarget.value,
      cards: []
    };
    this.lists.push(newList);

    ++this.listCreatedCount;

    event.currentTarget.value = "";
  }

  addCard({ listId, text }: IAddCardEvent): void {
    const list = this.lists.find(list => list.id === listId);
    if (list === undefined) return;
    const newCard = {
      id: this.cardCreatedCount + 1,
      text
    };
    list.cards.push(newCard);

    ++this.cardCreatedCount;
  }

  removeList(listId: number): void {
    const listIndex = this.lists.findIndex(list => list.id === listId);
    if (listIndex === -1) return;
    this.lists.splice(listIndex, 1);
  }

  removeCard({ listId, cardId }: IRemoveCardEvent): void {
    const list = this.lists.find(list => list.id === listId);
    if (list === undefined) return;
    const cardIndex = list.cards.findIndex(card => card.id === cardId);
    if (cardIndex === -1) return;
    list.cards.splice(cardIndex, 1);
  }

  onDragStart(list: IList, event: DragEvent): void {
    if (event.dataTransfer == null) return;
    event.dataTransfer.setData("text/plain", "");

    this.draggedList = list;
  }

  moveList(
    listId: number,
    event: DragEvent & { currentTarget: HTMLDivElement }
  ): void {
    if (this.draggedList === null || this.draggedList.id === listId) return;

    const left: number = event.currentTarget.getBoundingClientRect().left - 1;
    const right: number = event.currentTarget.getBoundingClientRect().right - 1;
    const centerX: number = left + (right - left) / 2;
    const cursorPosition: CursorPosition = (() => {
      if (left <= event.clientX && event.clientX < centerX) {
        return CursorPosition.Left;
      } else if (centerX < event.clientX && event.clientX <= right) {
        return CursorPosition.Right;
      } else return CursorPosition.Center;
    })();
    if (cursorPosition === CursorPosition.Center) return;

    const draggedListIndex = this.lists.findIndex(
      list => list.id === this.draggedList!.id
    );
    if (draggedListIndex === -1) return;
    this.lists.splice(draggedListIndex, 1);

    const listIndex = this.lists.findIndex(list => list.id === list.id);
    if (listIndex === -1) return;
    const toListIndex =
      cursorPosition === CursorPosition.Left ? listIndex : listIndex + 1;
    this.lists.splice(toListIndex, 0, this.draggedList);
  }

  onDragEnd(): void {
    this.draggedList = null;
  }

  moveCard({ listId, cardId, event }: IMoveCardEvent): void {
    if (
      this.draggedCardData === null ||
      this.draggedCardData.card.id === cardId
    )
      return;

    const top: number = event.currentTarget.getBoundingClientRect().top - 1;
    const bottom: number =
      event.currentTarget.getBoundingClientRect().bottom - 1;
    const centerY: number = top + (bottom - top) / 2;
    const cursorPosition: CursorPosition = (() => {
      if (top <= event.clientY && event.clientY < centerY) {
        return CursorPosition.Top;
      } else if (centerY < event.clientY && event.clientY <= bottom) {
        return CursorPosition.Bottom;
      } else return CursorPosition.Center;
    })();
    if (cursorPosition === CursorPosition.Center) return;

    const draggedCardList = this.lists.find(
      list => list.id === this.draggedCardData!.listId
    );
    if (draggedCardList === undefined) return;
    const draggedCardIndex = draggedCardList.cards.findIndex(
      card => card.id === this.draggedCardData!.card.id
    );
    if (draggedCardIndex === -1) return;
    draggedCardList.cards.splice(draggedCardIndex, 1);

    const list = this.lists.find(list => list.id === listId);
    if (list === undefined) return;
    const cardIndex = list.cards.findIndex(card => card.id === cardId);
    if (cardIndex === -1) return;
    const toCardIndex =
      cursorPosition === CursorPosition.Top ? cardIndex : cardIndex + 1;
    list.cards.splice(toCardIndex, 0, this.draggedCardData.card);

    this.draggedCardData.listId = listId;
  }

  moveCardForEmpty(listId: number): void {
    if (this.draggedCardData === null || this.draggedCardData.listId === listId)
      return;

    const list = this.lists.find(list => list.id === listId);
    if (list === undefined || list.cards.length !== 0) return;

    const draggedCardList = this.lists.find(
      list => list.id === this.draggedCardData!.listId
    );
    if (draggedCardList === undefined) return;
    const draggedCardIndex = draggedCardList.cards.findIndex(
      card => card.id === this.draggedCardData!.card.id
    );
    if (draggedCardIndex === -1) return;
    draggedCardList.cards.splice(draggedCardIndex, 1);

    list.cards.push(this.draggedCardData.card);

    this.draggedCardData.listId = listId;
  }
}
</script>

<style lang="scss" scoped>
#app {
  display: flex;
  align-items: flex-start;

  > .list {
    margin: 1px;
  }

  > .list-input {
    width: 160px;
    margin: 1px;
  }
}
</style>
