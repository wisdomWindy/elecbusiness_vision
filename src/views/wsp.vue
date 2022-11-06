<template>
  <div class="container">后端返回的数据{{bdata}}</div>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  data() {
    return {
      bdata:''
    };
  },
  created() {
    this.$ws.send(JSON.stringify("hello"));
    this.$ws.addEventListener('message', (e) => {
      console.log(e.data);
      this.bdata = e.data;
      // this.$ws.send(JSON.stringify("world"));
    });
  },
});
</script>

<style scoped>
</style>