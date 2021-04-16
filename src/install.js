import Vuex from 'vuex';
import SnackStack from './SnackStack.vue';
import { snackstack_vuex } from './snackstack-vuex.js';

const { mapActions } = Vuex.createNamespacedHelpers('snack-stack-logger');
const installer = {
    // register component, add defered vuex module registration, and inject logger to all instances
    install(Vue, name) {
        // register component
        Vue.component('snack-stack', SnackStack);

        // name logger per request (default: 'logger')
        // use as <name>.log(), <name>.error(), ...
        const _name = name && typeof name === 'string' ? name : 'logger';

        // inject logger in all components; mapping vuex actions and 'scoping' methods by using a data member
        // register vuex module if not already registered
        Vue.mixin({
            methods: {
                ...mapActions({
                    _snackStackInfo: 'info',
                    _snackStackWarn: 'warn',
                    _snackStackError: 'error',
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
            created() {
                // register vuex module for global logging model
                if (this.$store && !this.$store.hasModule('snack-stack-logger')) {
                    // console.log('registering vuex module: snack-stack-logger');
                    this.$store.registerModule('snack-stack-logger', snackstack_vuex(this.deadtime));
                }
            }
        });

    }
};

// Automatic installation if Vue has been added to the global scope.
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(installer);
}

export default installer;