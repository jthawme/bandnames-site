<template>
  <BoxContainer
    id="about"
    title="About this project"
    :initial-x="50"
    :initial-y="50"
    window-id="about"
    can-close
    scroll
    @close="onClose"
  >
    <div class="content">
      <Hello />

      <p>
        This project was LOVINGLY crafted by me,
        <a href="https://jthaw.me" target="_blank">Jonny Thaw</a> after a
        discussion with my friend
        <a href="https://www.fullstopnewparagraph.co.uk/" target="_blank"
          >Jon Ryder</a
        >
      </p>

      <p>
        There is a large assumption being made, but one I'm willing to take. The
        way I have justified that the word is being used or not is whether there
        is an exact match of the name on Spotify. I got a large list of words
        from the english dictionary by way of the
        <a href="http://wordlist.aspell.net/" target="_blank">Scowl Project</a>
        and iterated over them doing lookups of Spotify.
      </p>

      <p>
        Get the code for the site <a href="#" target="_blank">here</a> and the
        lookup script <a href="#" target="_blank">here (messy)</a>.
      </p>

      <h5>Disclaimer</h5>

      <p>
        If you think this site looks like anything copyrighted, it isn't and
        thats just a coincidence
      </p>
    </div>
  </BoxContainer>
</template>

<script>
import Hello from "~/assets/img/hello.svg?inline";

export default {
  components: { Hello },
  methods: {
    onClose(id) {
      this.$emit("close", id);
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  padding: 10px;
}
</style>
