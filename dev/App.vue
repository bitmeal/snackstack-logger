<template>
  <v-app>
    <v-main :style="`background-color: ${dark ? '#212121' : '#FAFAFA'};`">
      <v-container fill-height>
        <v-row>
          <v-col>
            <v-card width="200">
              <v-card-title> DARK </v-card-title>
              <v-card-actions style="justify-content: center">
                <v-switch class="ma-0" color="grey-darken-4" v-model="dark" />
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <demo-component value="foo bar" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <demo-component value="jazz" />
          </v-col>
        </v-row>
      </v-container>
      <snack-stack
        :deadtime="0"
        :transparency="false"
        :dark="dark"
        buttontext="close"
      />
    </v-main>
  </v-app>
</template>

<script>
// import SnackStack from './SnackStack.vue';
import DemoComponent from './DemoComponent.vue';

export default {
  name: "App",

  components: {
    // SnackStack,
    DemoComponent,
  },

  data: () => ({
    dark: false,
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