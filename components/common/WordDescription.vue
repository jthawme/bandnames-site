<template>
  <div class="wrapper">
    <button class="btn" @click.prevent="$store.commit('toggleSavedWord', word)">
      {{ isSaved ? "Remove save" : "Save word" }}
    </button>

    <span class="word">{{ word }}</span>

    <div v-if="loading">
      Loading...
    </div>
    <div>
      <div v-if="phonetic" class="phonetic">{{ phonetic }}</div>

      <div v-for="(meaning, idx) in meanings" :key="idx" class="meaning">
        <span class="meaning-part">{{ meaning.partOfSpeech }}</span>

        <ol>
          <li v-for="(definition, defidx) in meaning.definitions" :key="defidx">
            {{ definition.definition }}
          </li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    word: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: true,
      phonetic: null,
      meanings: []
    };
  },
  computed: {
    isSaved() {
      return this.$store.state.savedWords.includes(this.word);
    }
  },
  mounted() {
    this.getWord();
  },
  methods: {
    async getWord() {
      const data = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${this.word}`
      ).then(resp => resp.json());

      this.loading = false;

      if (data.length) {
        this.phonetic = data[0].phonetic;
        this.meanings = data[0].meanings;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  position: relative;

  padding: 40px 10px 10px;
}

.btn {
  position: absolute;

  top: 0;
  left: 0;

  width: 100%;

  padding: 10px;

  -webkit-appearance: none;

  border: none;

  background-color: var(--color-front);
  color: var(--color-back);

  cursor: pointer;

  border-bottom: 1px solid var(--color-front);

  &:hover,
  &:focus-visible {
    color: var(--color-front);
    background-color: var(--color-back);
  }
}

.phonetic {
}

.word {
  font-size: 36px;
}

.meaning {
  margin-top: 1em;
}
</style>
