<template>
  <div>
    <span>{{ flag? hide: show }}</span>
    <svg-icon :icon-class="flag?'eye':'eye-open'" style="margin-left:10px" @click="flag=!flag" />
  </div>
</template>

<script>
export default {
  props: ["hide", "show"],
  data() {
    return {
      flag: true,
    };
  },
};
</script>