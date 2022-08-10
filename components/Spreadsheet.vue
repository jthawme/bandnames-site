<template>
  <div class="outer">
    <div v-if="hasInnerSlot" class="floating">
      <div class="floating-inner">
        <slot name="inner" />
      </div>
    </div>

    <div class="row row-header">
      <div class="cell cell-num" />
      <div class="cell cell-word">A</div>

      <div
        v-for="cell in displayEmptyCells"
        :key="cell"
        class="cell cell-empty"
      >
        {{ cell }}
      </div>
    </div>
    <RecycleScroller
      v-slot="{ item, index }"
      ref="scroller"
      class="scroller"
      :items="wordList"
      :item-size="33"
      key-field="word"
    >
      <div
        class="row"
        :class="{ saved: hasSaved(item.word) }"
        @click="openWord(item.word)"
      >
        <div class="cell cell-num">{{ index + 1 }}</div>
        <div class="cell cell-word">
          {{ plural ? `The ${item.word}` : item.word }}
        </div>

        <div
          v-for="cell in displayEmptyCells"
          :key="cell"
          class="cell cell-empty"
        />
      </div>
    </RecycleScroller>
  </div>
</template>

<script>
import { RecycleScroller } from "vue-virtual-scroller";
import Words from "~/assets/words.json";
import PluralWords from "~/assets/plurals.json";

import "vue-virtual-scroller/dist/vue-virtual-scroller.css";
import { EventBus } from "~/assets/js/comms";
import { BreakPointMixin } from "~/assets/js/mixins/breakpoints";

export default {
  components: { RecycleScroller },
  mixins: [BreakPointMixin],
  props: {
    plural: {
      type: Boolean,
      default: false
    },
    words: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      list: this.plural ? PluralWords : Words,
      emptyCells: "BCDEFGHIJKL".slice(0, 6)
    };
  },
  computed: {
    wordList() {
      if (this.words) {
        return this.words;
      }

      return this.list;
    },
    hasInnerSlot() {
      return !!this.$slots.inner;
    },
    displayEmptyCells() {
      if (this.isTabletAndAbove) {
        return this.emptyCells;
      }

      return this.emptyCells.slice(0, 2);
    }
  },
  mounted() {
    EventBus.$on("random", this.randomWord);
  },
  beforeDestroy() {
    EventBus.$off("random", this.randomWord);
  },
  methods: {
    hasSaved(word) {
      return this.words ? false : this.$store.state.savedWords.includes(word);
    },
    randomWord(data) {
      if (data === this.$parent.windowId) {
        const idx = Math.floor(this.list.length * Math.random());
        const { word } = this.list[idx];
        this.scrollTo(idx);

        this.openWord(word);
      }
    },
    openWord(word) {
      this.$store.commit("setActiveWord", word);
    },
    scrollTo(idx) {
      if (this.$refs.scroller) {
        this.$refs.scroller.scrollToItem(idx);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.outer {
  height: 100%;
}

.scroller {
  height: 100%;
  overflow-y: auto;
}

.row {
  display: flex;

  border-bottom: 1px solid currentColor;

  &:not(.row-header):hover {
    color: var(--color-back);
    background-color: var(--color-front);
  }

  &.saved {
    @include halftone;
  }
}

.cell {
  display: flex;

  align-items: center;

  height: 32px;

  padding: 5px;

  &:not(:last-child) {
    border-right: 1px solid currentColor;
  }

  .row-header & {
    justify-content: center;
  }

  &-num {
    flex-basis: 50px;

    justify-content: center;
  }

  &-word {
    flex-grow: 1;
    flex-shrink: 0;
  }

  &-empty {
    flex-basis: 10%;
    flex-shrink: 1;
  }
}

.floating {
  position: absolute;

  bottom: 20px;
  right: 20px;

  background-color: var(--color-back);
  border: 1px solid var(--color-front);

  z-index: 3;

  @include halftone-thin;

  max-width: 35%;

  padding: 10px;
  font-size: 12px;

  &-inner {
    background-color: var(--color-back);

    padding: 4px;

    p {
      margin: 0;

      &:not(:last-child) {
        padding: 0 0 6px;
      }
    }
  }

  @include tablet {
    top: 50px;
    right: 30px;
    bottom: auto;
  }
}
</style>
