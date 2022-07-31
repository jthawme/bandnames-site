<template>
  <component
    :is="tagName"
    v-bind="tagProps"
    class="btn"
    :class="{ disabled, dummy }"
  >
    <span class="inner">
      <slot />
    </span>
  </component>
</template>

<script>
export default {
  props: {
    dummy: {
      type: Boolean,
      default: false
    },
    to: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    tagName: function() {
      if (this.to && !this.disabled) {
        if (this.to.startsWith("/")) {
          return "nuxt-link";
        }

        return "a";
      }

      if (this.dummy) {
        return "span";
      }

      return "button";
    },
    tagProps: function() {
      if (this.to) {
        if (this.to.startsWith("/")) {
          return {
            to: this.to
          };
        }

        return {
          href: this.to,
          target: "_blank"
        };
      }

      return {
        disabled: this.disabled
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.btn {
  position: relative;

  display: inline-flex;
  align-items: stretch;
  justify-content: center;

  background-color: transparent;
  border: none;
  outline: 0;

  padding: 4px 6px;
  margin: 0;
  text-decoration: none;
  border-radius: 2px;

  border: 1px solid var(--color-front);

  width: 80px;

  color: var(--color-front);

  &:not(.disabled) {
    cursor: pointer;
  }

  &.disabled {
    @include halftone-thin;
  }
}

.btn:not(.disabled):hover,
.btn:not(.disabled):focus-visible {
  color: var(--color-back);
  background-color: var(--color-front);
  outline: 1px solid var(--color-back);
}
</style>
