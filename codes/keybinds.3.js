const actions = require_code("actions");

function setupDefaults() {
    map_key("A", "snippet", "actions.toggle_attack()");
    map_key("'", "toggle_run_code");
}

module.exports = { setupDefaults };
