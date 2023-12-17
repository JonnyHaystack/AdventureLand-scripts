map_key("A", "snippet", "toggle_attack()");

var attack_mode = false;

function toggle_attack() {
    attack_mode = !attack_mode;
    log(`Attack mode ${attack_mode ? "en" : "dis"}abled!`);
}

function run_away() {
    // TODO: Improve this a lot
    smart_move("bean");
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
        log("use_skill('use_mp')");
        return use_skill("use_mp");
    }
    if (character.max_mp - character.mp >= 100) {
        log(`is_on_cooldown('regen_mp'): ${is_on_cooldown("regen_mp")}`);
        log("use_skill('regen_mp')");
        return use_skill("regen_mp");
    }
    if (character.max_hp - character.hp >= 50) {
        log("use_skill('regen_hp')");
        return use_skill("regen_hp");
    }
    if (character.hp / character.max_hp < 0.2) {
        log("use_skill('use_hp')");
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

const partyAllowList = ["Dengar", "Cadet", "Shelfy", "Kata"];

function on_party_invite(name) {
    if (partyAllowList.includes(name)) {
        accept_party_invite(name);
    }
    log(`Received party invite from ${name}, and accepted it!`);
}

function on_party_request(name) {
    if (partyAllowList.includes(name)) {
        accept_party_request(name);
    }
    log(`Received party request from ${name}, and accepted it!`);
}

// On every character, implement a messaging logic like this:
character.on("cm", function (m) {
    if (m.name == "Dengar")
        // Make sure the message is from a trusted character
        log(m); // Do something with the message!
});

setInterval(function () {
    regen_stuff();
    loot();

    if (!attack_mode || character.rip || is_moving(character)) {
        set_message("Attack mode disabled");
        return;
    }

    var target = get_targeted_monster();
    if (!target) {
        target = get_nearest_monster({ min_xp: 100, max_att: 120 });
        if (target) change_target(target);
        else {
            set_message("No Monsters");
            return;
        }
    }

    if (!is_in_range(target)) {
        // Walk half the distance
        move(
            character.x + (target.x - character.x) / 2,
            character.y + (target.y - character.y) / 2
        );
    } else if (can_attack(target) && !is_on_cooldown("attack")) {
        set_message("Attacking");
        attack(target);
    }
}, 1000 / 4); // Loops every 1/4 seconds.
