// Check salt fiber
// Arg:
//  home: object
// Return:
//  Promise
function is_it_salty_in_here(home) {
    // create request to create a new session
    fetch("https://fiber.salt.ch/en", {
        method: 'GET'
    });

    return fetch("https://fiber.salt.ch/fiber-ui-service/public/eligibility/fiber/address/check", {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
				'User-Agent': '(Comparis-Fiber-Checker github/b401)'
            },
            body: JSON.stringify(home)
        })
        .then(response => response.json())
        .catch(error => {
            console.log(error);
        });
}

// Swisscom Request
function is_it_swisscom_in_here(home) {
    let new_body = ({
        language: "en",
        address: {
            zipCode4: home.zip_code,
            city: home.city,
            street: home.street,
            houseNumber: home.house_number
        }
    });

    return fetch("https://www.swisscom.ch/map-api/onlinenslg/lineinfo", {
            method: "POST",
            credentials: 'include',
            body: JSON.stringify(new_body),
            "headers": {
                "accept": "application/json, text/javascript, */*; q=0.01",
                'Content-Type': 'application/json',
				'User-Agent': '(Comparis-Fiber-Checker github/b401)'
            },
        })
        .then(response => response.json())
        .catch(error => {
            console.log(error);
        });
}

// create a async wrapper function for mutliple eligibility checks
// Arg:
//  home: [object object]
// Return:
//  callback: object(id,salt,init7)
async function wrapper(home, fn) {
    let salt = await is_it_salty_in_here(home.address);
    let init7 = await is_it_init7_in_here(home.address);
    let swisscom = await is_it_swisscom_in_here(home.address);
    fn({
        id: home.id_find,
        salt: salt,
        init7: init7,
        swisscom: swisscom
    });
}

// Fetch infromation from init7 api with a GET request
// Arg:
//  home: [object object]
// Return:
//  Promise
function is_it_init7_in_here(home) {
    return fetch("https://api.init7.net/check/address/" +
            home.zip_code + "/" +
            home.street + "/" +
            home.house_number, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
					'User-Agent': '(Comparis-Fiber-Checker github/b401)'
                },
            })
        .then(response => response.json())
        .catch(error => {
            console.log(error);
        });
}

// Use chrome API to listen for new requests.
// This is needed because of CORB function which Google introduced to fight
// agains XSS and other vulnerabilities.
// Arg:
//  message: [object object]
//  sender: [object]
//  sendResponse: cb
// Return:
//  Promise
chrome.extension.onRequest.addListener(function(message, sender, sendResponse) {
    if (message.title === 'showResponse') {
        wrapper(message.homes, sendResponse, function(values) {
            sendResponse(values);
        });
    };
});
