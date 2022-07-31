<template>
  <div class="wrapper">
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
  padding: 10px;
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
