<template>
  <div class="content">
    <OSIcon
      v-for="({ dblclick, ...icon }, idx) in icons"
      :key="idx"
      class="icon"
      v-bind="icon"
      @open="dblclick"
    />

    <client-only>
      <BoxContainer
        v-if="isOpen('bandnames.csv')"
        id="bandnames.csv"
        title="bandnames.csv"
        :initial-x="250"
        :initial-y="50"
        window-id="bandnames.csv"
        class="excel"
        can-close
        @close="onClose"
      >
        <Spreadsheet :with-help="true" />
      </BoxContainer>

      <BoxContainer
        v-if="isOpen('plural-bandnames.csv')"
        id="plural-bandnames.csv"
        title="plural-bandnames.csv"
        :initial-x="130"
        :initial-y="90"
        window-id="plural-bandnames.csv"
        class="excel"
        can-close
        @close="onClose"
      >
        <Spreadsheet plural />
      </BoxContainer>
    </client-only>

    <AboutWindow v-if="isOpen('about')" @close="onClose" />

    <HelpWindow v-if="isOpen('help')" @close="onClose" />

    <BoxContainer
      v-for="word in $store.state.activeWords"
      :key="word"
      :title="word"
      :window-id="word"
      can-close
      scroll
      @close="closeWord(word)"
    >
      <WordDescription :word="word" />
    </BoxContainer>
  </div>
</template>

<script>
import AboutWindow from "~/components/AboutWindow.vue";
import HelpWindow from "~/components/HelpWindow.vue";
import Spreadsheet from "~/components/Spreadsheet.vue";

import AboutIcon from "~/assets/img/about.svg?inline";
import CsvIcon from "~/assets/img/csv.svg?inline";
import OSIcon from "~/components/common/OSIcon.vue";

export default {
  components: { Spreadsheet, AboutWindow, HelpWindow, CsvIcon, OSIcon },
  data() {
    return {
      icons: [
        {
          icon: CsvIcon,
          text: "bandnames.csv",
          dblclick: () => this.openWindow("bandnames.csv")
        },
        {
          icon: CsvIcon,
          text: "plural-bandnames.csv",
          dblclick: () => this.openWindow("plural-bandnames.csv")
        },
        {
          icon: AboutIcon,
          text: "About",
          dblclick: () => this.openWindow("about")
        }
      ]
    };
  },
  methods: {
    openWindow(id) {
      this.$store.commit("setWindowState", {
        id,
        active: true
      });
    },
    closeWord(word) {
      this.$store.commit("removeWord", word);
    },
    onClose(id) {
      this.$store.commit("setWindowState", {
        id,
        active: false
      });
    },
    isOpen(id) {
      return this.$store.state.windows[id];
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  display: flex;

  flex-direction: column;
  flex-wrap: wrap;

  padding: 20px;

  gap: 20px;
}

.excel {
  --box-width: 900px;
  --box-height: 900px;
}
</style>
