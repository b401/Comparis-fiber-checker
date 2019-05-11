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
      chrome.extension.sendRequest({title: 'showResponse', homes: iseligible},
      function(response){
        if(response.init7.fiber7 === true){
          $("div[data-id="+response.id+"]")
            .find(".header")
            .append("<img width='20px' style='margin-left:5px' src='https://www.init7.net/static/img/logo/Init7_logo.svg?h=78dbf1b8'></img>");
        }
        if(response.salt.valid === true){
          $("div[data-id="+response.id+"]")
            .find(".header")
            .append("<img width='20px' style='margin-left:5px' src='https://www.salt.ch/static/img/logo-main-print.png'></img>");
        }
      });
    }
  });
}

main();
