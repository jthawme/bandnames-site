<template>
  <div
    v-resize="onResize"
    class="outer"
    :style="style"
    :class="{ scroll }"
    @mousedown="onActivate"
    @touchstart="onActivate"
  >
    <BoxHeader @move="onMove" @close="onClose">{{ title }}</BoxHeader>

    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script>
import { clamp, listenCb } from "~/assets/js/utils";
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    canClose: {
      type: Boolean,
      default: false
    },
    initialX: {
      type: Number,
      default: -1
    },
    initialY: {
      type: Number,
      default: -1
    },
    windowId: {
      type: String,
      required: true
    },
    scroll: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      persistedX:
        this.initialX >= 0
          ? this.initialX
          : Math.random() * this.$store.state.dimensions.width,
      persistedY:
        this.initialY >= 0
          ? this.initialY
          : Math.random() * this.$store.state.dimensions.height,
      x: 0,
      y: 0,
      width: -1,
      height: -1
    };
  },
  computed: {
    active() {
      return (
        this.$store.state.windowOrder.indexOf(this.windowId) ===
        this.$store.state.windowOrder.length - 1
      );
    },
    windowWidth() {
      return this.$store.state.dimensions.width;
    },
    windowHeight() {
      return this.$store.state.dimensions.height;
    },
    style() {
      return {
        top: `${clamp(this.y, 26, this.maxHeight)}px`,
        left: `${clamp(this.x, 0, this.maxWidth)}px`,
        "--box-z-index": this.windowOrder
      };
    },
    maxHeight() {
      return this.windowHeight - this.height;
    },
    maxWidth() {
      return this.windowWidth - this.width;
    },
    windowOrder() {
      return (this.$store.state.windowOrder.indexOf(this.windowId) || 0) + 5;
    }
  },
  watch: {
    maxWidth(val) {
      this.x = clamp(this.persistedX, 0, val);
    },
    maxHeight(val) {
      this.y = clamp(this.persistedY, 0, val);
    }
  },
  mounted() {
    this.width = this.$el.clientWidth;
    this.height = this.$el.clientHeight;

    this.unlisten = listenCb(document, "keyup", this.onKeyUp.bind(this));
  },
  beforeDestroy() {
    this.unlisten();
  },
  methods: {
    onKeyUp(e) {
      if (e.key === "Escape" && this.active) {
        this.onClose();
      }
    },
    onActivate() {
      this.$store.commit("pullWindow", this.windowId);
    },
    onMove({ x, y }) {
      this.x += x;
      this.y += y;
    },
    onResize({ width, height }) {
      this.width = width;
      this.height = height;
    },
    onClose() {
      if (this.canClose) {
        this.$emit("close", this.windowId);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.outer {
  position: var(--box-position, absolute);

  border: 1px solid currentColor;
  background-color: var(--color-back);

  z-index: var(--box-z-index, 5);

  width: var(--box-width, 360px);
  height: var(--box-height, 300px);

  max-width: 100vw;
  max-height: calc((var(--vh) * 100) - 100px);

  display: flex;

  flex-direction: column;

  overflow: hidden;

  box-shadow: 3px 3px 0 var(--color-front);
}

.content {
  flex-grow: 1;

  .scroll & {
    overflow: auto;
  }
}
</style>
