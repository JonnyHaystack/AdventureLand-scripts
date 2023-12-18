const actions = require_code("actions");
const state = require_code("state");

function main() {
    setInterval(function () {
        regen_stuff();
        loot();

        if (!state.attack_mode || character.rip || is_moving(character)) {
            set_message("Attack: off");
            return;
        }

        actions.ranged_attack_basic();
    }, 1000 / 4); // Loops every 1/4 seconds.
}

module.exports = { main };
