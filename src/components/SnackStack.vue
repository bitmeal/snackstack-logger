<template>
  <v-snackbar
    ref="snackbar"
    :color="color.base"
    :timeout="_timeout"
    :value="Boolean(message)"
    @input="shiftQueue()"
  >
    <div class="count-anchor">
      <div class="count-container" v-if="count">
        <span class="count-number font-weight-medium">
          {{ count + 1 }}
        </span>
      </div>
    </div>
    {{ text }}
    <template v-slot:action="{ attrs }">
      <v-btn
        :color="button_color"
        @click="shiftQueue()"
        v-bind="attrs"
        v-if="buttontext"
        >{{ buttontext }}</v-btn
      >
      <v-btn icon @click="shiftQueue()" v-bind="attrs" v-if="!buttontext">
        <v-icon> mdi-close </v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>
<script>
import colors from "vuetify/es5/util/colors";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapGetters, mapActions } = createNamespacedHelpers(
  "snack-stack-logger"
);
import { snackstack_vuex } from "./snackstack-vuex.js";

export default {
  name: "SnackStack",

  props: {
    stacksize: {
        type: Number,
        default: 2
    },
    timeout: {
      type: Number,
      default: 4000,
    },
    deadtime: {
        type: Number,
        default: 0
    },
    buttontext: {
      type: String,
    },
    dark: {
      type: Boolean,
      default: false,
    },
    transparency: {
      type: Boolean,
      default: true,
    },
  },

  data: () => ({
      color: colors.blue,
  }),

  computed: {
    ...mapGetters(["count"]),
    ...mapState(["message", "errors", "warnings", "infos"]),
    // color() {
    //   switch (this.message && this.message["type"]) {
    //     case "error":
    //       return colors.red;
    //     case "warning":
    //       return colors.orange;
    //     default:
    //       return colors.blue;
    //   }
    // },
    button_color() {
      return this.color[`${this.dark ? "lighten" : "darken"}2`];
    },
    _timeout() {
      return (this.message && this.message["timeout"]) || this.timeout;
    },
    text() {
      return (this.message && this.message["text"]) || "";
    },
    // wrap message for defered vuex resolution
    _message() {
      return this.message;
    },
  },

  methods: {
    ...mapActions(["shiftQueue"]),
    color_computer(message, old_message) {
        let ref = message ? message : old_message;
        let color = colors.blue;
      switch (ref && ref["type"]) {
        case "error":
          color = colors.red;
          break;
        case "warning":
          color = colors.orange;
          break;
        default:
          color = colors.blue;
      }
      this.color = color;
    },
    hexToRGB(hex) {
      hex = hex.trim();
      if (hex.length === 7 && hex[0] === "#") {
        hex = hex.slice(1);
      }

      return [
        parseInt(hex.slice(0, 2), 16),
        parseInt(hex.slice(2, 4), 16),
        parseInt(hex.slice(4, 6), 16),
      ];
    },
    make_offset_color(color, offset) {
      let rgb = this.hexToRGB(
        color[`${this.dark ? "darken" : "lighten"}${offset}`]
      );
      return `rgba(${rgb.join(", ")}, ${this.transparency ? 1 / offset : 1})`;
    },
    next_color(when = 0) {
      let color = colors.blue;

      if (this.errors.length >= when) {
        color = colors.red;
      } else if (this.errors.length + this.warnings.length >= when) {
        color = colors.orange;
      }

      return this.make_offset_color(color, when + 1);
    },
    watcher() {
      this.applyMultiSnackState();
    },
    applyMultiSnackState() {
      const snack_stack_shadow =
        "0px -5px 5px -6px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12)";
      const stack_offset = [4, -4];

      const snack_card_shadow = (offset = 0) => {
        return `${offset * stack_offset[0]}px ${
          3 + offset * stack_offset[1]
        }px 5px -1px rgba(0, 0, 0, 0.2)`;
      };

      const snack_card_stack = (offset = 0) => {
        return `${offset * stack_offset[0]}px ${
          offset * stack_offset[1]
        }px 0px -0px ${this.next_color(offset)}`;
      };

      const wrapper = this.$refs["snackbar"].$el.querySelectorAll(
        ".v-snack__wrapper"
      )[0];
      /* eslint-disable-next-line no-extra-boolean-cast */
      if (Boolean(this.message)) {
        let shadow_stack = [
          snack_card_shadow(0),
          ...(Array.apply(null, Array(Math.min(this.stacksize, this.count)))
                .map((_, idx) => [
                    snack_card_stack(idx + 1),
                    snack_card_shadow(idx + 1)
                ])
                .flat()
            ),
            snack_stack_shadow
        ];

        shadow_stack.push();
        wrapper.style.boxShadow = shadow_stack.join(", ");
      }
    },
  },

  created() {
    // register snackstack vuex module from within component: spares user from manually registering
    this.$store.registerModule("snack-stack-logger", snackstack_vuex(this.deadtime));

    // attach watchers after vuex module is registered
    this.$watch('message', this.color_computer);
    this.$watch('count', this.watcher);
    this.$watch('dark', this.watcher);
  },
};

const logger = {
  install(Vue, name) {
    const _name = name && typeof name === "string" ? name : "logger";

    Vue.mixin({
      methods: {
        ...mapActions({
          _snackStackInfo: "info",
          _snackStackWarn: "warn",
          _snackStackError: "error",
        }),
      },
      data: (instance) => {
        let data = {};
        data[_name] = {
          log: instance._snackStackInfo,
          info: instance._snackStackInfo,
          warn: instance._snackStackWarn,
          error: instance._snackStackError,
        };
        return data;
      },
    });
  },
};

export { logger };
</script>
<style>
.count-anchor {
  position: relative;
  width: 0px;
  height: 100%;
  min-width: 0;
}
.count-container {
  position: absolute;
  top: -24px;
  left: -24px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #212121;
  color: whitesmoke;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
    0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
}
.count-number {
  flex: 0 1 auto;
  min-width: 0;
  padding-top: 2px;
}
</style>