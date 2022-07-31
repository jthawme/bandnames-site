<template>
  <BoxContainer
    id="help"
    title="Help"
    :initial-x="650"
    :initial-y="100"
    window-id="help"
    can-close
    class="help"
    @close="onClose"
  >
    <div class="content">
      <TextLogo />

      <p>
        This .csv contains a list of all single word dictionary values that are
        not currently being used as a band name.
      </p>

      <p>
        Want a snappy single word name for your fans to shout at the top of
        their lungs? Have a peruse of the list.
      </p>

      <OSButton @click.native="onClose">Okay</OSButton>
    </div>
  </BoxContainer>
</template>

<script>
import TextLogo from "~/assets/img/textlogo.svg?inline";

export default {
  components: { TextLogo },
  methods: {
    onClose(id) {
      this.$emit("close", id);
    }
  }
};
</script>

<style lang="scss" scoped>
.help {
  --box-width: 450px;
}

.content {
  padding: 10px;
}
</style>
