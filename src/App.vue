<template>
  <div id="app">
    <router-view v-if="isRouterAlive" v-loading="loading" />
  </div>
</template>

<script>
export default {
  name: "App",
  provide() {
    return {
      reload: this.reload,
      inload: this.inload,
      outload: this.outload,
    };
  },
  data() {
    return {
      isRouterAlive: true,
      loading: false,
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      // this.$nextTick(function () {
      //   this.isRouterAlive = true;
      // });
    },
    inload() {
      this.loading = true;
    },
    outload() {
      this.loading = false;
    },
  },
};
</script>
