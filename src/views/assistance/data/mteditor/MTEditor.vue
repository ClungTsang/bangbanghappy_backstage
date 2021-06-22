<template>
  <div>
    <editor-bar
      v-model="detail"
      :isClear="isClear"
      @change="change"
    ></editor-bar>
    <a-button type="" @click="post">发布</a-button>
    <a-button type="" @click="isClear = true">清除</a-button>

  </div>
</template>
<script>
import EditorBar from "./wangEnduit.vue";
export default {
  components: { EditorBar },
  data() {
    return {
      isClear: false,
      detail: "",
    };
  },
  methods: {
    change(val) {
      this.detial = val;
    },
    post(){
      console.log(JSON.stringify(this.detail));
    }
  },
};
</script>
