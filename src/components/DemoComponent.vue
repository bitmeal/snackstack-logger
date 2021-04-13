<template>
  <v-card width="200">
    <v-card-title>
      log: <span class="ml-1 font-italic">"{{ value }}"</span>
    </v-card-title>
    <v-card-actions>
      <v-btn icon>
        <v-icon @click="log.error(`⚡ ${value}`)">mdi-close</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon @click="log.warn(`🚧 ${value}`)">mdi-bell</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon @click="log.info({ text: `☁ ${value}`, timeout: -1 })"
          >mdi-message</v-icon
        >
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "Demo",
  props: ["value"],

  data: () => ({}),
};
</script>
<style>
button {
  flex: 1;
}
.v-card__actions {
  display: flex;
  justify-content: flex-end;
}
</style>