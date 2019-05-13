function main() {
  $.each($("address"), function( key, value  ){
    let id = $(value).closest("[data-id]").data();

    let whole_address = $(value).text().replace(/[\s]{4,}/g,'');
    let zip_code = whole_address.match(/[\d]{4}\s/i)[0].trim();
    let city = whole_address.match(/[\d]{4}\s.+/i)[0].replace(zip_code, "").trim();
    let street_number = whole_address.replace(zip_code,"").replace(city,"").trim();

    if (street_number !== '') {
      let house_number = "0";
      if(/[0-9]/.test(street_number)) {
        house_number = street_number.match(/(?=\w)\w[0-9A-za-z]{0,}$/)[0].trim();
      }
      let street = street_number.replace(house_number,"").trim();

      let iseligible = ({
        id,
        address: {
          city: city,
          house_number: house_number,
          language: "EN",
          new_order: true,
          street: street,
          zip_code: zip_code
        }
      });

      // loading
      $("div[data-id="+iseligible.id.id+"]")
        .find(".header")
        .append("<img id="+iseligible.id.id+" width='20px' style='margin-left:5px' src='"+ chrome.extension.getURL("images/loading.png") +"'></img>");

      chrome.extension.sendRequest({title: 'showResponse', homes: iseligible},
      function(response){
        // remove loading image
        $("#"+response.id).remove();

        if(response.init7.fiber7 === true){
          $("div[data-id="+response.id+"]")
            .find(".header")
            .append("<img width='20px' style='margin-left:5px' src='"+ chrome.extension.getURL("images/Init7_logo.png") +"'></img>");
        }
        if(response.salt.valid === true){
          $("div[data-id="+response.id+"]")
            .find(".header")
            .append("<img width='20px' style='margin-left:5px' src='"+ chrome.extension.getURL("images/salt_logo.png") +"'></img>");
        }

        if(response.salt.valid === false && response.init7.fiber7 === false) {
          // Don't forsake everything!
          // Maybe there's still init7 vdsl
          if(response.init7.vdsl){
            $("div[data-id="+response.id+"]")
              .find(".header")
            .append("<p style='font-size:0.6em'>Init7 VDSL:"+ response.init7.vdsl_down +"/"+ response.init7.vdsl_up +"</p>");
          } else {
          // Ok nothing found :(
          $("div[data-id="+response.id+"]")
            .find(".header")
            .append("<img width='20px' style='margin-left:5px' src='"+ chrome.extension.getURL("images/slow.png") +"'></img>");
          }
        }
      });
    }
  });
}


main();
