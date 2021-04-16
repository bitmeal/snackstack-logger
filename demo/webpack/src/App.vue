<template>
  <v-app>
    <v-main>
      <v-container fill-height>
        <v-row>
          <v-col>
      <v-btn @click="log.error('⚡ error msg')">
        ERR
      </v-btn>

          </v-col>
        </v-row>
        <v-row>
          <v-col>
      <v-btn @click="log.warn({ text: '🚧 warning message', timeout: 1000 })">
        WARN
      </v-btn>

          </v-col>
        </v-row>
        <v-row>
          <v-col>
      <v-btn @click="log.info({ text: '☁ info message', timeout: -1 })">
          INFO
      </v-btn>

          </v-col>
        </v-row>
      </v-container>
      <snack-stack
        :deadtime="0"
        :transparency="false"
        buttontext="close"
      />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "App",


  data: () => ({
  }),
};
</script>
<style>
.container {
  display: flex;
  justify-content: center;
  align-content: flex-start;
}
.row {
  display: flex;
  justify-content: center;
}
.col {
  display: flex;
  justify-content: center;
}
</style>