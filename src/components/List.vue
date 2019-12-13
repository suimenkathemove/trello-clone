<template>
  <div class="list">
    {{ list.name }}
    <Card v-for="card in list.cards" :key="card.id" class="card" :card="card" />
    <input type="text" class="card-input" @change="addCard" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import Card from "@/components/Card.vue";
import { IList } from "@/types";

export interface IAddCardEvent {
  listId: number;
  text: string;
}

@Component({
  components: {
    Card
  }
})
export default class List extends Vue {
  @Prop({ type: Object, required: true })
  readonly list!: IList;

  @Emit()
  addCard(event: Event & { currentTarget: HTMLInputElement }): IAddCardEvent {
    const text = event.currentTarget.value;

    event.currentTarget.value = "";

    return {
      listId: this.list.id,
      text
    };
  }
}
</script>

<style lang="scss" scoped>
.list {
  width: 160px;
  border: 1px solid #000000;

  > .card {
    margin: 1px;
  }

  > .card-input {
    width: 100%;
  }
}
</style>
