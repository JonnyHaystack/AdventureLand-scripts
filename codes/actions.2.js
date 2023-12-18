const state = require_code("state");

function run_away() {
    // TODO: Improve this a lot
    state.attack_mode = false;
    smart_move("bean");
}

function toggle_attack() {
    state.attack_mode = !state.attack_mode;
    log(`Attack mode ${state.attack_mode ? "en" : "dis"}abled!`);
}

function regen_stuff() {
    if (safeties && mssince(last_potion) < min(200, character.ping * 3)) {
        return resolving_promise({
            reason: "safeties",
            success: false,
            used: false,
        });
    }
    let used = true;

    const cooldown_abilities = ["use_hp", "regen_hp", "use_mp", "regen_mp"];
    for (ability of cooldown_abilities) {
        if (is_on_cooldown(ability)) {
            return resolving_promise({ success: false, reason: "cooldown" });
        }
    }

    if (character.mp / character.max_mp < 0.2) {
        debug_log("use_skill('use_mp')");
        return use_skill("use_mp");
    }
    if (character.max_mp - character.mp >= 100) {
        debug_log(`is_on_cooldown('regen_mp'): ${is_on_cooldown("regen_mp")}`);
        debug_log("use_skill('regen_mp')");
        return use_skill("regen_mp");
    }
    if (character.max_hp - character.hp >= 50) {
        debug_log("use_skill('regen_hp')");
        return use_skill("regen_hp");
    }
    if (character.hp / character.max_hp < 0.2) {
        debug_log("use_skill('use_hp')");
        return run_away();
        // return use_skill("use_hp");
    }
    used = false;
    if (used) {
        last_potion = new Date();
    } else {
        return resolving_promise({
            reason: "full",
            success: false,
            used: false,
        });
    }
}

function ranged_attack_basic() {
    if (!is_in_range(target)) {
        // Walk half the distance
        move(
            character.x + (target.x - character.x) / 2,
            character.y + (target.y - character.y) / 2
        );
    } else if (can_attack(target) && !is_on_cooldown("attack")) {
        const distance_to_target = simple_distance(
            { x: character.x, y: character.y },
            { x: target.x, y: target.y }
        );

        const safe_distance = target.range + 20;
        if (distance_to_target < safe_distance) {
            debug_log("distance_to_target=" + Math.round(distance_to_target));
            debug_log(
                `Vector: ${Math.round(character.x - target.x)}, ${Math.round(
                    character.y - target.y
                )}`
            );
            const safe_distance_mult = safe_distance / distance_to_target;
            debug_log(`safe_distance_mult=${safe_distance_mult.toFixed(3)}`);
            move(
                character.x + (character.x - target.x) * safe_distance_mult,
                character.y + (character.y - target.y) * safe_distance_mult
            );
        }

        set_message("Attacking");
        attack(target);
    }
}

module.exports = { run_away, toggle_attack, regen_stuff, ranged_attack_basic };
