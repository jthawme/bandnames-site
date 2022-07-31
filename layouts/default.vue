<template>
  <div class="outer">
    <OSHeader />

    <div class="main">
      <nuxt />
    </div>
  </div>
</template>

<script>
import smoothscroll from "smoothscroll-polyfill";
import {
  onWindowResize,
  registerBootlegVH,
  tickUpdate
} from "~/assets/js/utils";
import { BreakPointSet } from "~/assets/js/mixins/breakpoints";
import OSHeader from "~/components/OSHeader.vue";

export default {
  components: { OSHeader },
  mixins: [BreakPointSet],
  computed: {
    color() {
      return this.$store.state.color;
    }
  },
  mounted() {
    smoothscroll.polyfill();

    registerBootlegVH();
    // prevent the add to home screen banner
    window.addEventListener("beforeinstallprompt", e => {
      e.preventDefault();
    });

    this.onResize();

    onWindowResize(tickUpdate(this.onResize.bind(this)));
  },
  methods: {
    onResize() {
      this.$store.commit("setDimensions", {
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
  },
  head() {
    return {
      bodyAttrs: {
        class: `color-${this.color}`
      }
    };
  }
};
</script>
<style lang="scss">
@import "~assets/scss/parts/fonts";

:root {
  --color-white: #fff;
  --color-black: #000;

  --color-front: var(--color-black);
  --color-back: var(--color-white);

  --font-size-x-small: 10px;
  --font-size-small: 12px;
  --font-size-normal: 14px;
  --font-size-medium: 21px;
  --font-size-large: 24px;
  --font-size-x-large: 36px;
  --font-size-xx-large: 46px;
  --font-size-xxx-large: 56px;

  --font-family-body: "Chicago FLF", sans-serif;
  --font-family-headline: "Chicago FLF", sans-serif;

  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-bold: 700;
  --font-weight-extra-bold: 900;

  @for $i from 1 through 20 {
    --size-unit-#{$i}: #{$i * 5px};
  }
}

@for $i from 1 through 3 {
  .color-#{$i} {
    --color-front: #{nth($colors-front, $i)};
    --color-back: #{nth($colors-back, $i)};
  }
}

// ::-webkit-scrollbar {
//   width: 0px; /* remove scrollbar space */
//   background: transparent; /* optional: just make scrollbar invisible */
// }

*,
*:before,
*:after {
  box-sizing: border-box;
}

html {
  font-family: var(--font-family-body);
  font-size: var(--font-size-normal);

  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  font-smooth: never;
  -webkit-font-smoothing: none;

  image-rendering: pixelated;

  line-height: 1.25;

  user-select: none;
}

body {
  color: var(--color-front);

  background-color: var(--color-back);
}

input,
button {
  font-family: inherit;
  font-weight: inherit;
}

html,
body {
  width: 100%;
  min-height: 100%;
}

.visually-hidden {
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}

.fade {
  opacity: 1;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.fade-fast {
  opacity: 1;
}

.fade-fast-enter-active,
.fade-fast-leave-active {
  transition: opacity 0.5s;
}
.fade-fast-enter, .fade-fast-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

img {
  max-width: 100%;
}

.outer {
  display: flex;

  flex-direction: column;

  width: 100vw;
  height: vh(100);

  background-color: var(--color-back);
}

.main {
  flex-grow: 1;

  @include halftone;
}

a {
  color: currentColor;
}
</style>
