const constants = require_code("constants");

function on_party_invite(name) {
    if (constants.partyAllowList.includes(name)) {
        accept_party_invite(name);
    }
    log(`Received party invite from ${name}, and accepted it!`);
}

function on_party_request(name) {
    if (constants.partyAllowList.includes(name)) {
        accept_party_request(name);
    }
    log(`Received party request from ${name}, and accepted it!`);
}

// On every character, implement a messaging logic like this:
character.on("cm", function (m) {
    if (m.name == "Dengar") {
        log(m);
    }
});
