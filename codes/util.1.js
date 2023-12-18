const constants = require_code("constants");

function debug_log(message, color) {
    if (constants.DEBUG) {
        log(message, color);
    }
}

function vectorPretty({ x, y }) {
    return `${x.toFixed(2)}, ${y.toFixed(2)}`;
}

function myNearbyCharacters() {
    return Object.values(parent.entities).filter(
        (e) => e.owner === character.owner
    );
}

function myNearbyPartyMembers() {
    return Object.values(parent.entities).filter(
        (e) => e.party === character.party
    );
}
