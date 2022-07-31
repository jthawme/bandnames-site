<template>
  <div class="icon" @click="onClick">
    <div class="icon-image">
      <img v-if="image" :src="image" alt="" />
      <component :is="icon" v-else />
    </div>
    <div class="icon-text">{{ text }}</div>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      required: true
    },
    image: {
      type: String,
      default: null
    },
    icon: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      clicks: 0,
      delay: 500
    };
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
  methods: {
    onClick() {
      this.clicks++;
      if (this.clicks < 2) {
        this.timer = setTimeout(() => {
          this.clicks = 0;
        }, this.delay);
      } else {
        clearTimeout(this.timer);
        this.$emit("open");
        this.clicks = 0;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.icon {
  display: flex;

  flex-direction: column;

  width: 100px;
  height: 120px;

  cursor: pointer;

  &-image {
    position: relative;

    flex-grow: 1;

    margin-bottom: 5px;

    line-height: 0;

    svg {
      position: absolute;

      top: 50%;
      left: 50%;

      height: 100%;

      transform: translate3d(-50%, -50%, 0);
    }
  }

  &-text {
    width: 100%;
    white-space: pre;
    overflow: hidden;
    text-overflow: ellipsis;

    font-size: 14px;

    text-align: center;
  }
}
</style>
