<template>
  <div class="box-header" @mousedown="onMouseDown" @touchstart="onMouseDown">
    <button class="box-header-close" @click="$emit('close')">X</button>
    <slot />
  </div>
</template>

<script>
import { listenCb, tickUpdate } from "~/assets/js/utils";

const normalisePress = e => {
  if (e.touches) {
    return {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  }

  return {
    x: e.clientX,
    y: e.clientY
  };
};
export default {
  props: {
    size: {
      type: String,
      default: "medium"
    }
  },
  beforeDestroy() {
    this.unlisten && this.unlisten.forEach(cb => cb());
  },
  methods: {
    onMouseDown(e) {
      if (e.target.tagName === "BUTTON") {
        return;
      }
      e.preventDefault();

      let { x: startX, y: startY } = normalisePress(e);

      this.unlisten = [
        listenCb(
          document,
          "mousemove",
          tickUpdate(
            e => {
              const { x, y } = normalisePress(e);
              this.$emit("move", {
                x: x - startX,
                y: y - startY
              });

              startX = x;
              startY = y;
            },
            {
              passive: false
            }
          )
        ),
        listenCb(
          document,
          "touchmove",
          tickUpdate(
            e => {
              if (e.cancelable) {
                e.preventDefault();
              }
              const { x, y } = normalisePress(e);
              this.$emit("move", {
                x: x - startX,
                y: y - startY
              });

              startX = x;
              startY = y;
            },
            {
              passive: false
            }
          )
        ),
        listenCb(document, "mouseup", this.onMouseUp.bind(this)),
        listenCb(document, "touchend", this.onMouseUp.bind(this))
      ];
    },
    onMouseUp() {
      this.unlisten && this.unlisten.forEach(cb => cb());
      return true;
    }
  }
};
</script>

<style lang="scss" scoped>
.box-header {
  position: relative;

  display: flex;

  align-items: center;

  font-size: 14px;

  border-bottom: 1px solid currentColor;

  padding: 1px 2px;

  cursor: move;

  &:after,
  &:before {
    flex-grow: 1;
    content: "";

    @include lines;
  }

  &:before {
    margin-right: 10px;
  }

  &:after {
    margin-left: 10px;
  }
}

.box-header-close {
  position: absolute;

  top: 50%;
  left: 8px;

  width: 11px;
  height: 11px;

  padding: 0;
  margin: 0;

  transform: translate3d(0, -50%, 0);

  -webkit-appearance: none;
  border: 1px solid var(--color-front);
  outline: 1px solid var(--color-back);

  font-size: 0;

  cursor: pointer;
  background-color: var(--color-back);

  &:hover {
    background-color: var(--color-front);
  }
}
</style>
