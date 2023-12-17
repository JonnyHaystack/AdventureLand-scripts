// Hey there!
// This is CODE, lets you control your character with code.
// If you don't know how to code, don't worry, It's easy.
// Just set attack_mode to true and ENGAGE!

var attack_mode = true;

// smart_move("");

function regen_stuff() {
    if (safeties && mssince(last_potion) < min(200, character.ping * 3)) {
        return resolving_promise({
            reason: "safeties",
            success: false,
            used: false,
        });
    }
    let used = true;
    if (is_on_cooldown("hp")) {
        return resolving_promise({ success: false, reason: "cooldown" });
    }
    if (character.mp / character.max_mp < 0.2) {
        return use_skill("use_mp");
    }
    if (character.hp / character.max_hp < 0.2) {
        return use_skill("use_hp");
    }
    if (character.max_mp - character.mp >= 50) {
        return use_skill("regen_mp");
    }
    if (character.max_hp - character.hp >= 50) {
        return use_skill("regen_hp");
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

function on_party_invite(name) {
    if (name === "Dengar") {
        log("Received party invite from Dengy Boi");
    }
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

    if (!attack_mode || character.rip || is_moving(character)) return;

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
        move(
            character.x + (target.x - character.x) / 2,
            character.y + (target.y - character.y) / 2
        );
        // Walk half the distance
    } else if (can_attack(target)) {
        set_message("Attacking");
        attack(target);
    }
}, 1000 / 4); // Loops every 1/4 seconds.

// Learn Javascript: https://www.codecademy.com/learn/introduction-to-javascript
// Write your own CODE: https://github.com/kaansoral/adventureland
