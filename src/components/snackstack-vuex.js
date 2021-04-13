// snackstack vuex module
const snackstack_vuex = {
    namespaced: true,
    state: {
        errors: [],
        warnings: [],
        infos: [],
        message: null,
        // guard shift operation for delayed showing of new messages
        delaying_active: false,
    },
    getters: {
        count(state) {
            return (
                state.errors.length +
                state.warnings.length +
                state.infos.length
            );
        },
    },
    mutations: {
        queue_error(state, error) {
            state.errors.unshift(error);
        },
        queue_warn(state, warn) {
            state.warnings.unshift(warn);
        },
        queue_info(state, info) {
            state.infos.unshift(info);
        },
        clear_message(state) {
            state.message = null;
        },
        // sets message and pops from queue
        show_message(state) {
            let message = null;

            if (state.errors.length) {
                message = state.errors.pop();
            }
            else if (state.warnings.length) {
                message = state.warnings.pop();
            }
            else if (state.infos.length) {
                message = state.infos.pop();
            }

            state.message = message;
        },
        delay_on(state) {
            state.delaying_active = true;
        },
        delay_off(state) {
            state.delaying_active = false;
        },
    },
    actions: {
        shiftQueue({ state, commit }) {
            // there is another shift operation taking place
            if (!state.delaying_active) {
                // no message active
                if (!state.message) {
                    commit('show_message');
                }
                // a message is showing
                else {
                    commit('clear_message');
                    commit('delay_on');
                    setTimeout(() => {
                        commit('show_message');
                        commit('delay_off');
                    }, 0);
                }
            }
        },
        info({ state, commit, dispatch }, message) {
            // make log object from message if string
            if (!(typeof message === 'object')) {
                message = { text: message }
            }

            message['type'] = 'info';

            commit('queue_info', message);
            if (!state.message) {
                dispatch('shiftQueue');
            }
        },
        warn({ state, commit, dispatch }, message) {
            // make log object from message if string
            if (!(typeof message === 'object')) {
                message = { text: message }
            }

            message['type'] = 'warning';

            commit('queue_warn', message);
            if (!state.message) {
                dispatch('shiftQueue');
            }
        },
        error({ state, commit, dispatch }, message) {
            // make log object from message if string
            if (!(typeof message === 'object')) {
                message = { text: message }
            }

            message['type'] = 'error';

            commit('queue_error', message);
            if (!state.message) {
                dispatch('shiftQueue');
            }
        },
    }
};

export { snackstack_vuex };