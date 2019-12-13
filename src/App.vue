<template>
  <div id="app">
    <List v-for="list in lists" :key="list.id" class="list" :list="list" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import List from "@/components/List.vue";
import { IList } from "@/types";
import { createInitialLists } from "@/initialData";

@Component({
  components: {
    List
  }
})
export default class App extends Vue {
  lists: IList[] = createInitialLists();
}
</script>

<style lang="scss" scoped>
#app {
  display: flex;

  > .list {
    margin: 1px;
  }
}
</style>
