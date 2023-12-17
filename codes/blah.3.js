// Hey there!
// This is CODE, lets you control your character with code.
// If you don't know how to code, don't worry, It's easy.
// Just set attack_mode to true and ENGAGE!

var attack_mode = true;

// smart_move("");

on_party_invite();

// On every character, implement a messaging logic like this:
character.on("cm", function (m) {
    if (m.name == "Dengar")
        // Make sure the message is from a trusted character
        log(m.message.from); // Do something with the message!
});

setInterval(function () {
    use_hp_or_mp();
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
