/* --- A place where you can add your own code -- */

/*-- <script src="https://www.paypal.com/sdk/js?client-id=sb&currency=USD" data-sdk-integration-source="button-factory"></script> --*/
var payPalCheckoutGateway = {
    name: "Thorium Builder Paypal Checkout Plugin",
    price: 0,
    createdby: "",
    createddate: "",
    qty: 0,
    fullname: "",
    address: "",
    zipcode: "",
    email: "",
    city: "",
    country: "",
    notes: "",

    processPayment: function () {
        app.preloader.hide();
        $('#paymentprocessor').html("");
        if (typeof paypal == 'undefined') {
            var m="Payment Gateway Paypal is not available";
            $('.paymentprocessor').html("<h4>"+m+"</h4>");
            thoriumCorePlugin.logEvent(1,m);
            app.dialog.alert(m);
            return;
        }

        paypal.Buttons({
            style: {
                shape: 'rect',
                color: 'blue',
                layout: 'vertical',
                label: 'checkout',
            },
            createOrder: function (data, actions) {
                return po = actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: payPalCheckoutGateway.price
                        },
                    }]
                });
            },
            onApprove: function (data, actions) {
                return actions.order.capture().then(function (details) {
                    thoriumCorePlugin.logEvent(0,'Transaction completed by ' + details.payer.name.given_name + '!');
                    thoriumCorePlugin.logEvent(0, "Calling paymentCallback");
                    eCommerceFirestorePlugin.paymentCallback(details);    
                });
            }
        }).render('#paymentprocessor');  

    },

    initialize: function () {
        if (payPalCheckoutGateway.price == 0) {
            thoriumCorePlugin.logEvent(2, "Price not set");
            return;
        }
        $('#paymentprocessor').html("<h4>Starting Paypal... Please Wait...</h4>");
        app.preloader.show();
        setTimeout(function () { payPalCheckoutGateway.processPayment(); }, 1000);
    },

}
function hideProductImagePlaceholder() {
  const productimageInput = document.querySelector(
    'input[name="productimage"]'
  );
  if (productimageInput) {
         console.log(productimageInput.getAttribute("src"));

  }
}
$(document).on(
  "page:beforein",
  '.page[data-name="productdetail"]',
    function (e, page) {
        console.log(page)
        //hideProductImagePlaceholder()
   //hideProductImagePlaceholder()
        const imageUrl = $('input[name="productimage"]').css("background-image");  
        var extractedUrl = imageUrl
        .replace(/^url\(["']?/, "")
        .replace(/["']?\)$/, "");
        $('input[name="productimage"]').css("opacity", "1")
        $('input[name="productimage"]').attr('src', extractedUrl);
         if (localStorage.getItem("productimage")) {
           localStorage.removeItem("productimage");
         }
    }
);
$(document).on(
  "page:afterout",
  '.page[data-name="productdetail"]',
    function (e, page) {
        if (localStorage.getItem("productimage")) {
            localStorage.removeItem("productimage");
          
      }
  }
);
function extractSecondUrl(str) {
  const regex = /url\("([^"]+)"\)/g;
  const matches = [];
  let match;

  while ((match = regex.exec(str))) {
    matches.push(match[1]);
  }

  return matches[1] || null; // Return the second URL or null if it doesn't exist
}



$(document).on(
  "page:afterin",
  '.page[data-name="productdetail"]',
  function (e, page) {
    console.log(page);

    // Extract the URL from the input's background-image
      const imageUrl = $('input[name="productimage"]').css("background-image");
      console.log("🚀 ~ imageUrl:", imageUrl)
      if (imageUrl || localStorage.getItem("productimage")) {
        const extractedUrl = imageUrl
          .replace(/^url\(["']?/, "")
          .replace(/["']?\)$/, "");
        console.log("🚀 ~ extractedUrl:", extractedUrl);
        const newUrl = extractSecondUrl(extractedUrl);
        if (!localStorage.getItem("productimage")) {
            $('input[name="productimage"]').attr("src", newUrl);
            $('input[name="productimage"]').css("background-image", "none");
            localStorage.setItem("productimage", newUrl);
            
        }
        else {
              $('input[name="productimage"]').attr("src", localStorage.getItem("productimage"));
              $('input[name="productimage"]').css("background-image", "none");
              
          }
        
    }
    // Ensure the parent of the input has a relative position for the absolute positioning of the appended div
    $('input[name="productimage"]').parent().css("position", "relative");

    // Append the div with the background-image set to the extractedUrl
/*     $('input[name="productimage"]').parent().append(`<div class='img img-thumbnail firebase_document_preview testClass'style='position:absolute; width:100%; top:0; background-image:url("${extractedUrl}")'>New Div</div>`
      ); */
  }
);

$(document).on('click', '#toto', function (e) {
    eCommerceFirestorePlugin.ConvertCartToHistory();
});

$(document).on('page:afterin', '.page[data-name="history"]', function (e,page) {
    if (app.device.cordova == true) {
        $(".page-current").css("width", "99%");
        $(".page-current").css("width", "100%");
        $(".page-current").css("border", "1px solid transparent");
        setTimeout(function () {
            $(".page-current").css("width", "99%");
            $(".page-current").css("width", "100%");
            $(".page-current").css("border", "1px solid transparent");
            $(".page-current").css("border", "0px solid transparent");
        }, 100);
    }
});
