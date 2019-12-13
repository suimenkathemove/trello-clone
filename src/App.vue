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
    />
    <input type="text" class="list-input" @change="addList" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import List from "@/components/List.vue";
import { IList } from "@/types";
import { createInitialLists } from "@/initialData";
import { IAddCardEvent } from "@/components/List.vue";
import { IRemoveCardEvent } from "@/components/Card.vue";

@Component({
  components: {
    List
  }
})
export default class App extends Vue {
  lists: IList[] = createInitialLists();
  listCreatedCount = 2;
  cardCreatedCount = 4;

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
