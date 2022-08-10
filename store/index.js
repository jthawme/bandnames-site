import { saveItem } from "~/assets/js/utils";

export const state = () => {
  return {
    endpoint: "",
    domain: "",
    dimensions: {
      width: 0,
      height: 0
    },
    activeWords: [],
    windows: {
      "bandnames.csv": true,
      "plural-bandnames.csv": false,
      "possible-names.csv": false,
      about: false,
      help: true
    },
    windowOrder: ["bandnames.csv", "help"],
    color: 0,
    savedWords: []
  };
};

export const mutations = {
  setEndpoint(state, val) {
    state.endpoint = val;
  },
  setDomain(state, val) {
    state.domain = val;
  },
  setDimensions(state, val) {
    state.dimensions = {
      ...val
    };
  },
  setActiveWord(state, val) {
    const words = state.activeWords
      .slice()
      .reverse()
      .slice(0, 10);

    if (!words.includes(val)) {
      state.activeWords = [val, ...words].reverse();
      state.windowOrder = [...state.windowOrder, val];
    } else {
      const windowOrder = state.windowOrder.slice();
      windowOrder.splice(windowOrder.indexOf(val), 1);
      state.windowOrder = [...windowOrder, val];
    }
  },
  removeWord(state, val) {
    const words = state.activeWords.slice();
    words.splice(words.indexOf(val), 1);
    state.activeWords = words;

    const order = state.windowOrder.slice();
    order.splice(order.indexOf(val), 1);
    state.windowOrder = order;
  },
  setWindowState(state, { id, active }) {
    state.windows = {
      ...state.windows,
      [id]: active
    };

    if (active) {
      state.windowOrder = [...state.windowOrder, id];
    } else {
      const order = state.windowOrder.slice();
      order.splice(order.indexOf(id), 1);
      state.windowOrder = order;
    }
  },
  pullWindow(state, id) {
    const order = state.windowOrder.slice();

    order.splice(order.indexOf(id), 1);
    order.push(id);

    state.windowOrder = order;
  },
  cycleColor(state) {
    state.color = (state.color + 1) % 4;
  },

  toggleSavedWord(state, word) {
    const words = state.savedWords.slice();

    if (words.includes(word)) {
      words.splice(words.indexOf(word), 1);
      state.savedWords = words;
    } else {
      state.savedWords = [...words, word];
    }

    saveItem("possible", JSON.stringify(state.savedWords));
  },

  populateSavedWords(state, val) {
    state.savedWords = val.slice();
  }
};

export const getters = {
  api: state => path => {
    return `${state.endpoint}${path}`;
  }
  // post: (state, getters) => data => {
  //   return fetch(getters.api("/post"), {
  //     method: "POST",
  //     body: JSON.stringify(data)
  //   });
  // }
};

export const actions = {
  async nuxtServerInit({ commit }, { env }) {
    commit("setEndpoint", env.endpoint);
    commit("setDomain", env.PROJECT_DOMAIN);
  }
};
