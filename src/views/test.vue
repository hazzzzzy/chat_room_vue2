<template>
  <div id="app">
    <VEmojiPicker @select="selectEmoji" />
  </div>
</template>

<script>
import { VEmojiPicker } from "v-emoji-picker";

export default {
  name: "Demo",
  components: {
    VEmojiPicker,
  },
  data: () => ({}),
  methods: {
    selectEmoji(emoji) {
      console.log(emoji);
    },
  },
};
</script>