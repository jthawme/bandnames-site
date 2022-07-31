<template>
  <header>
    <div class="items">
      <span class="item logo">
        <Icon name="logo" class="logo-image" />
      </span>
      <div v-for="(item, idx) in links" :key="idx" class="item">
        <span>{{ item.text }}</span>

        <div v-if="item.items" class="item-links">
          <div v-for="({ click, ...sub }, subidx) in item.items" :key="subidx">
            <a v-if="sub.href" class="subitem" v-bind="sub">{{ sub.text }}</a>
            <button
              v-else-if="click"
              class="subitem"
              v-bind="sub"
              @click="click"
            >
              {{ sub.text }}
            </button>
            <Markdown v-else class="subitem" :content="sub.text" />
          </div>
        </div>
      </div>
    </div>

    <div class="info">
      <span class="time item">{{ timeDisplay }}</span>
    </div>
  </header>
</template>

<script>
import { EventBus } from "~/assets/js/comms";

export default {
  data() {
    return {
      time: Date.now()
    };
  },
  computed: {
    timeDisplay() {
      return this.formatter.format(this.time);
    },
    activeWindow() {
      return this.$store.state.windowOrder.slice().pop();
    },
    links() {
      const FRONT_CORE = [];

      const links = [];

      const BACK_CORE = [
        {
          text: "About",
          items: [
            {
              text: "This project",
              click: () => this.openWindow("about")
            },
            {
              href: "https://jthaw.me",
              text: "jthaw.me",
              target: "_blank"
            }
          ]
        },
        {
          text: "Help",
          items: [
            {
              text: "What is this?",
              click: () => this.openWindow("help")
            },
            {
              text: "Change colour",
              click: () => this.$store.commit("cycleColor")
            }
          ]
        }
      ];

      if (
        ["bandnames.csv", "plural-bandnames.csv"].includes(this.activeWindow)
      ) {
        links.push({
          text: "File",
          items: [
            {
              click: this.onRandomWord.bind(this),
              text: "Random word"
            }
          ]
        });
      }

      return [...FRONT_CORE, ...links, ...BACK_CORE];
    }
  },
  created() {
    this.formatter = new Intl.DateTimeFormat("en", {
      timeStyle: "short"
    });
  },
  mounted() {
    this.time = Date.now();

    this.intervalId = setInterval(() => {
      this.time = Date.now();
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.intervalId);
  },
  methods: {
    openWindow(id) {
      this.$store.commit("setWindowState", {
        id,
        active: true
      });
    },
    onRandomWord() {
      EventBus.$emit("random", this.activeWindow);
    }
  }
};
</script>

<style lang="scss" scoped>
header {
  display: flex;

  align-items: flex-end;
  justify-content: space-between;

  border-bottom: 1px solid var(--color-front);
  color: var(--color-front);

  font-size: 14px;

  padding-top: 4px;
}

.items {
  display: flex;

  margin-left: 4px;
}

.item {
  position: relative;

  display: block;

  padding: 2px 5px;
  padding-right: 8px;
  cursor: default;

  &.active,
  &:hover {
    background-color: var(--color-front);
    color: var(--color-back);
  }

  &-links {
    position: absolute;

    top: 100%;
    left: 0;

    background-color: var(--color-back);
    border: 1px solid var(--color-front);

    flex-direction: column;

    display: none;

    z-index: 10;
  }

  &:hover {
    .item-links {
      display: flex;
    }
  }
}

.subitem {
  display: block;

  padding: 4px;

  font-size: inherit;
  color: var(--color-front);

  cursor: default;

  white-space: nowrap;
}

button.subitem {
  -webkit-appearance: none;
  border: none;
  padding: 4px;
  margin: 0;

  background-color: transparent;
}

a.subitem {
  color: var(--color-front);
}

a.subitem,
button.subitem {
  cursor: pointer;

  &:hover,
  &:focus-visible {
    color: var(--color-back);
    background-color: var(--color-front);
  }
}

.logo {
  padding: 2px 10px;

  &-image {
    --icon-size: 10px;
  }
}

.info {
  margin-right: 10px;
}
</style>

<style lang="scss">
.subitem {
  p {
    margin: 0;
  }
}
</style>
