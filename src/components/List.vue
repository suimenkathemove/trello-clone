<template>
  <div class="list">
    {{ list.name }}
    <Card v-for="card in list.cards" :key="card.id" class="card" :card="card" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Card from "@/components/Card.vue";
import { IList } from "@/types";

@Component({
  components: {
    Card
  }
})
export default class List extends Vue {
  @Prop({ type: Object, required: true })
  readonly list!: IList;
}
</script>

<style lang="scss" scoped>
.list {
  border: 1px solid #000000;

  > .card {
    margin: 1px;
  }
}
</style>
