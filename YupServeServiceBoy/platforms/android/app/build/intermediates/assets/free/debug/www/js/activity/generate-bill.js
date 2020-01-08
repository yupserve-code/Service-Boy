$$(document).on('page:init', '.page[data-name="generate-bill"]', function (e) {

      debugger

      //Recived orderID from task details
      var page = $$('.page[data-name="generate-bill"]')[0].f7Page;
      var orderId = page.route.query.orderId;
      var backScreenType = page.route.query.backScreenType;
      var bookedServiceName = page.route.query.BookedServiceName;

      $$('#stored-bill-card-layout').hide();
      $$('#total-bill-card-layout').hide();
      $$('.final-generate-bill-ul').hide();

      $$('#orderID').text("Order Id " + orderId);
      $$('#bookedServiceNameID').text(bookedServiceName);

      sessionStorage.backScreenType = backScreenType;
      sessionStorage.orderID = orderId;

      // get Service Boy ID stored in localStorage
      var serviceBoyID = localStorage.getItem('serviceBoyID');
      console.log(serviceBoyID);

      var subTotalPrice = 0;
      var promocodePercentage = 0;
      var promocodePrice = 0;
      var grandTotalPrice = 0;
      var arrayUpdatePosition = 0;
      var defaultPromoCodeDisinFloat = 0.0;
      var defaultPromoCodeDis = 0;

      var checkAddOrEdit = "Add";
      var selectedSubServiceID = "", selectedSubServiceText = "";

      $$('#item-desc-error').hide();
      $$('#item-price-error').hide();
      $$('#item-quantity-error').hide();
      $$('#item-disc-error').hide();

      localStorage.removeItem("itemDescLocalArray");
      localStorage.removeItem("itemPriceLocalArray");
      localStorage.removeItem("itemQuantityLocalArray");
      localStorage.removeItem("itemDiscountLocalArray");
      localStorage.removeItem("itemPricePerUnitLocalArray");
      localStorage.removeItem("itemDiscountInPerLocalArray");
      localStorage.removeItem("itemSubServiceIDLocalArray");
      localStorage.removeItem("itemSubServiceTextLocalArray");

      var itemDescArray = []; // array to save values 
      var itemPriceArray = []; // array to save values 
      var itemQuantityArray = []; // array to save values 
      var itemDiscArray = []; // array to save values 
      var itemPricePerUnitArray = []; // array to save values 
      var itemDiscountInPerArray = []; // array to save values 
      var subServiceIDArray = []; // array to save values 
      var subServiceTextPerArray = []; // array to save values 

      loadSubServiceName();

      $$('#itemBillGenButtonID').on('click', function (e) {

            var itemDescText = $$("#itemDescID").val().trim();
            var itemPriceText = $$("#itemPriceID").val().trim();
            var itemQuantityText = $$("#itemQuantityID").val().trim();
            var itemDiscountText = $$("#itemDiscountID").val().trim();
            var selectedSubServiceName = $$("#sub-service-dropdown").val().trim();

            if (selectedSubServiceName == "Select Sub Service" || itemDescText.length == 0 || itemPriceText.length == 0
                  || itemQuantityText.length == 0 || itemDiscountText.length == 0) {

                  if (selectedSubServiceName == "Select Sub Service") {
                        $$('#service-select-error').show();
                  } else {
                        $$('#service-select-error').hide();
                  }

                  if (itemDescText.length == 0) {
                        $$('#item-desc-error').show();
                  } else {
                        $$('#item-desc-error').hide();
                  }

                  if (itemPriceText.length == 0) {
                        $$('#item-price-error').show();
                  } else {
                        $$('#item-price-error').hide();
                  }

                  if (itemQuantityText.length == 0) {
                        $$('#item-quantity-error').show();
                  } else {
                        $$('#item-quantity-error').hide();
                  }

                  if (itemDiscountText.length == 0) {
                        $$('#item-disc-error').show();
                  } else {
                        $$('#item-disc-error').hide();
                  }

            } else {

                  $$('#item-desc-error').hide();
                  $$('#item-price-error').hide();
                  $$('#item-quantity-error').hide();
                  $$('#item-disc-error').hide();

                  if (checkAddOrEdit == "Add") { // This is the case for add


                        var priceQty = itemPriceText * itemQuantityText;
                        var discValue = Math.round(priceQty * (itemDiscountText / 100));

                        itemDescArray.push(itemDescText);
                        itemPriceArray.push(priceQty);
                        itemQuantityArray.push(itemQuantityText);
                        itemDiscArray.push(discValue);
                        itemPricePerUnitArray.push(itemPriceText);
                        itemDiscountInPerArray.push(itemDiscountText);
                        subServiceIDArray.push(selectedSubServiceID);
                        subServiceTextPerArray.push(selectedSubServiceText);

                        localStorage.setItem("itemDescLocalArray", JSON.stringify(itemDescArray));
                        localStorage.setItem("itemPriceLocalArray", JSON.stringify(itemPriceArray));
                        localStorage.setItem("itemQuantityLocalArray", JSON.stringify(itemQuantityArray));
                        localStorage.setItem("itemDiscountLocalArray", JSON.stringify(itemDiscArray));
                        localStorage.setItem("itemPricePerUnitLocalArray", JSON.stringify(itemPricePerUnitArray));
                        localStorage.setItem("itemDiscountInPerLocalArray", JSON.stringify(itemDiscountInPerArray));
                        localStorage.setItem("itemSubServiceIDLocalArray", JSON.stringify(subServiceIDArray));
                        localStorage.setItem("itemSubServiceTextLocalArray", JSON.stringify(subServiceTextPerArray));

                        checkAddOrEdit = "Add";
                        $$('#addUpdateButton').text("Add");

                  } else {   // This is the case for edit

                        var priceQtyEdit = itemPriceText * itemQuantityText;
                        var discValueEdit = Math.round(priceQtyEdit * (itemDiscountText / 100));

                        itemDescArray.splice(arrayUpdatePosition, 1, itemDescText);
                        itemPriceArray.splice(arrayUpdatePosition, 1, priceQtyEdit);
                        itemQuantityArray.splice(arrayUpdatePosition, 1, itemQuantityText);
                        itemDiscArray.splice(arrayUpdatePosition, 1, discValueEdit);
                        itemPricePerUnitArray.splice(arrayUpdatePosition, 1, itemPriceText);
                        itemDiscountInPerArray.splice(arrayUpdatePosition, 1, itemDiscountText);
                        subServiceIDArray.splice(arrayUpdatePosition, 1, selectedSubServiceID);
                        subServiceTextPerArray.splice(arrayUpdatePosition, 1, selectedSubServiceText);

                        localStorage.setItem("itemDescLocalArray", JSON.stringify(itemDescArray));
                        localStorage.setItem("itemPriceLocalArray", JSON.stringify(itemPriceArray));
                        localStorage.setItem("itemQuantityLocalArray", JSON.stringify(itemQuantityArray));
                        localStorage.setItem("itemDiscountLocalArray", JSON.stringify(itemDiscArray));
                        localStorage.setItem("itemPricePerUnitLocalArray", JSON.stringify(itemPricePerUnitArray));
                        localStorage.setItem("itemDiscountInPerLocalArray", JSON.stringify(itemDiscountInPerArray));
                        localStorage.setItem("itemSubServiceIDLocalArray", JSON.stringify(subServiceIDArray));
                        localStorage.setItem("itemSubServiceTextLocalArray", JSON.stringify(subServiceTextPerArray));

                        checkAddOrEdit = "Add";
                        $$('#addUpdateButton').text("Add");

                  }

                  refreshdata();
            }
      });

      $$('#add-more-bill').on('click', function (e) {

            $$('#create-bill-card-layout').show();
      });

      $$("body").on("click", "#stored-bill-gen-ul .editBill", function (e) {

            debugger

            arrayUpdatePosition = $$(this).closest('li').find("#arrayPosID").val();

            sessionStorage.isServiceStartDialogOn = "true";

            var title = "Delete";

            app.dialog.confirm('Do you really want to delete?', title, function () {

                  sessionStorage.isServiceStartDialogOn = "false";

                  itemDescArray.splice(parseInt(arrayUpdatePosition), 1);
                  itemPriceArray.splice(parseInt(arrayUpdatePosition), 1);
                  itemQuantityArray.splice(parseInt(arrayUpdatePosition), 1);
                  itemDiscArray.splice(parseInt(arrayUpdatePosition), 1);
                  itemPricePerUnitArray.splice(parseInt(arrayUpdatePosition), 1);
                  itemDiscountInPerArray.splice(parseInt(arrayUpdatePosition), 1);
                  subServiceIDArray.splice(parseInt(arrayUpdatePosition), 1);
                  subServiceTextPerArray.splice(parseInt(arrayUpdatePosition), 1);

                  localStorage.setItem("itemDescLocalArray", JSON.stringify(itemDescArray));
                  localStorage.setItem("itemPriceLocalArray", JSON.stringify(itemPriceArray));
                  localStorage.setItem("itemQuantityLocalArray", JSON.stringify(itemQuantityArray));
                  localStorage.setItem("itemDiscountLocalArray", JSON.stringify(itemDiscArray));
                  localStorage.setItem("itemPricePerUnitLocalArray", JSON.stringify(itemPricePerUnitArray));
                  localStorage.setItem("itemDiscountInPerLocalArray", JSON.stringify(itemDiscountInPerArray));
                  localStorage.setItem("itemSubServiceIDLocalArray", JSON.stringify(subServiceIDArray));
                  localStorage.setItem("itemSubServiceTextLocalArray", JSON.stringify(subServiceTextPerArray));

                  refreshdata();

                  loadSubServiceName();

            },
                  function () {
                        sessionStorage.isServiceStartDialogOn = "false";
                  });

            $$('#create-bill-card-layout').show();

            $$('#addUpdateButton').text("Add");

      });

      /* Back Button */
      $$('#generateBillBackButton').on('click', function () {

      app.views.main.router.navigate('/task-details/?orderId=' + orderId + '&backScreenType=' + backScreenType);
            
      });

      $$('#finalBillGenButtonID').on('click', function (e) {

            debugger

            var connectiontype = checkConnection();

            if (connectiontype == "No network connection") {

                  message = connectiontype;
                  var toast = app.toast.create({
                        text: message
                  });
                  toast.open();
                  app.preloader.hide();
            } else {

                  app.preloader.show();

                  var objects = {};
                  var main_item_array = new Array();
                  var x;

                  var getSubServiceIDList = JSON.parse(localStorage.getItem("itemSubServiceIDLocalArray") || "[]");
                  var getDesc = JSON.parse(localStorage.getItem("itemDescLocalArray") || "[]");
                  var getPrice = JSON.parse(localStorage.getItem("itemPriceLocalArray") || "[]");
                  var getQty = JSON.parse(localStorage.getItem("itemQuantityLocalArray") || "[]");
                  var getDisc = JSON.parse(localStorage.getItem("itemDiscountLocalArray") || "[]");
                  var getItemPricePerUnit = JSON.parse(localStorage.getItem("itemPricePerUnitLocalArray") || "[]");
                  var getItemDisc = JSON.parse(localStorage.getItem("itemDiscountInPerLocalArray") || "[]");

                  for (x = 0; x < getSubServiceIDList.length; x++) {

                        objects[x] = new Object();
                        objects[x].sub_service_id = getSubServiceIDList[x];
                        objects[x].addon_item_desc = getDesc[x];
                        objects[x].addon_price = parseInt(getItemPricePerUnit[x]);
                        objects[x].addon_qty = parseInt(getQty[x]);
                        objects[x].addon_discount = parseInt(getItemDisc[x]);
                        objects[x].addon_total = getPrice[x] - getDisc[x];

                        main_item_array.push(objects[x]);
                  }

                  app.request.setup({
                        cache: false,
                  });

                  app.request.postJSON(GENERATE_BILL_API, {
                        order_id: orderId, staff_id: serviceBoyID,
                        sub_service_addon_list: main_item_array

                  }, function (data) {

                        debugger

                        if (data.success != undefined) {

                              debugger

                              message = data.success.message;
                              var toast = app.toast.create({
                                    text: message
                              });
                              toast.open();
                              app.preloader.hide();

                              app.views.main.router.navigate('/task-details/?orderId=' + orderId + '&backScreenType=' + backScreenType);
                        }

                        if (data.error != undefined) {

                              debugger
                              message = data.error.message;
                              console.log("Error " + message);
                              app.preloader.hide();

                              var toast = app.toast.create({
                                    text: message
                              });
                              toast.open();
                        }
                  }, function(error){
                        debugger
                        var toast = app.toast.create({
                              text: "Something went wrong."
                        });
                        toast.open();
                        app.preloader.hide();
                  });
            }
      });


      // On Text Change listener. Hide error when user gives correct input.

      $$("#itemDescID").on('keyup', function (e) {

            var itemDescText = $$("#itemDescID").val().trim();

            if (itemDescText.length == 0) {
                  $$('#item-desc-error').show();
                  $$("#item-desc-error").removeClass("hidden");
            } else {
                  $$('#item-desc-error').hide();
                  $$("#item-desc-error").addClass("hidden");
            }
      });


      $$("#itemPriceID").on('keyup', function (e) {

            var priceText = $$("#itemPriceID").val().trim();

            if (priceText.length == 0) {
                  $$('#item-price-error').show();
                  $$("#item-price-error").removeClass("hidden");
            } else {
                  $$('#item-price-error').hide();
                  $$("#item-price-error").addClass("hidden");
            }
      });

      $$("#itemQuantityID").on('keyup', function (e) {

            var quantityText = $$("#itemQuantityID").val().trim();

            if (quantityText.length == 0) {
                  $$('#item-quantity-error').show();
                  $$("#item-quantity-error").removeClass("hidden");
            } else {
                  $$('#item-quantity-error').hide();
                  $$("#item-quantity-error").addClass("hidden");
            }
      });

      $$("#itemDiscountID").on('keyup', function (e) {

            var discText = $$("#itemDiscountID").val().trim();

            if (discText.length == 0) {
                  $$('#item-disc-error').show();
                  $$("#item-disc-error").removeClass("hidden");
            } else {
                  $$('#item-disc-error').hide();
                  $$("#item-disc-error").addClass("hidden");
            }
      });

      function loadSubServiceName() {

            debugger

            app.request.setup({

                  cache: false
            });

            app.preloader.show();

            app.request.post(GET_SUBSERVICE_LIST_OF_AN_ORDER_API, { order_id: orderId }, function (data) {

                  debugger

                  var obj = JSON.parse(data);

                  if (obj.success != undefined) {

                        if (obj.success.sub_service != null) {

                              defaultPromoCodeDis = parseFloat(obj.success.promo_code);
                              defaultPromoCodeDis = Math.round(parseInt(defaultPromoCodeDis));

                              var getStoredSubServiceID = JSON.parse(localStorage.getItem("itemSubServiceIDLocalArray") || "[]");

                              var str = "";
                              str = "<option value='Select Sub Service'>Select Sub Service</option>";

                              for (var x = 0; x < obj.success.sub_service.length; x++) {

                                    if (getStoredSubServiceID.length > 0) {
                                          var count = 0;
                                          for (var y = 0; y < getStoredSubServiceID.length; y++) {

                                                if (obj.success.sub_service[x].sub_service_id == getStoredSubServiceID[y]) {
                                                      count = 1;
                                                }
                                          }
                                          if (count == 0) {
                                                str += '<option value="' + obj.success.sub_service[x].sub_service_id + '">' + obj.success.sub_service[x].sub_service_name + '</option>';

                                          }
                                    } else {
                                          str += '<option value="' + obj.success.sub_service[x].sub_service_id + '">' + obj.success.sub_service[x].sub_service_name + '</option>';
                                    }
                              }

                              $$('#sub-service-dropdown').html(str);
                              app.preloader.hide();
                        }
                  } else {
                        message = obj.Error.Message;
                        app.preloader.hide();
                        var toast = app.toast.create({
                              text: message
                        });
                        toast.open();

                        var str1 = "<option value='Select Sub Service'>Select Sub Service'</option>";

                        $$('#sub-service-dropdown').html(str1);
                  }
            });
      }

      $$('#sub-service-dropdown').on('change', function (e) {

            selectedSubServiceID = $$(this).val();
            //selectedSubServiceText = $$(this).text();
            selectedSubServiceText = $("#sub-service-dropdown option:selected").text();

            if (selectedSubServiceText == "Select Sub Service") {
                  $$('#service-select-error').show();

            } else {
                  $$('#service-select-error').hide();
            }
      });

      function refreshdata() {

            var getDesc = JSON.parse(localStorage.getItem("itemDescLocalArray") || "[]");
            var getPrice = JSON.parse(localStorage.getItem("itemPriceLocalArray") || "[]");
            var getQty = JSON.parse(localStorage.getItem("itemQuantityLocalArray") || "[]");
            var getDisc = JSON.parse(localStorage.getItem("itemDiscountLocalArray") || "[]");
            var getItemPricePerUnit = JSON.parse(localStorage.getItem("itemPricePerUnitLocalArray") || "[]");
            var getItemDisc = JSON.parse(localStorage.getItem("itemDiscountInPerLocalArray") || "[]");
            var getSubServiceID = JSON.parse(localStorage.getItem("itemSubServiceIDLocalArray") || "[]");
            var getSubServiceText = JSON.parse(localStorage.getItem("itemSubServiceTextLocalArray") || "[]");

            if (getDesc.length > 0) {

                  var strStoreData = "";
                  var subTotalPrice = 0;

                  for (var x = 0; x < getDesc.length; x++) {

                        strStoreData += '<li>';

                        strStoreData += '<div class="row list-item-margin-top">';
                        strStoreData += '<div class="col-90">';
                        strStoreData += '<p class="gen-bill-align-start-text">' + getSubServiceText[x] + '</p>';
                        strStoreData += '</div>';
                        strStoreData += '<div class="col-10">';
                        strStoreData += '<span class="badge color-blue editBill" id="add-more-bill">' + "Delete" + '</span>';
                        strStoreData += '</div>';
                        strStoreData += '</div>';
                        strStoreData += '</div>';

                        strStoreData += '<div class="row list-item-margin-top">';
                        strStoreData += '<p class="gen-bill-item-desc-text item-desc-class">' + getDesc[x] + '</p>';
                        strStoreData += '</div>';
                        strStoreData += '</div>';

                        strStoreData += '<input type="hidden" id="arrayPosID" name="arrayPos" value=' + x + '>' + '</input>';
                        strStoreData += '<input type="hidden" id="itemPricePerUnitID" name="itemPricePerUnitID" value=' + getItemPricePerUnit[x] + '>' + '</input>';
                        strStoreData += '<input type="hidden" id="itemUnitDiscID" name="itemUnitDiscID" value=' + getItemDisc[x] + '>' + '</input>';
                        strStoreData += '<input type="hidden" id="subServIDHidden" name="subServIDHidden" value=' + getSubServiceID[x] + '>' + '</input>';

                        strStoreData += '<div class="row list-item-margin-top">';
                        strStoreData += '<div class="col-50">';
                        strStoreData += '<p class="gen-bill-align-start-text">' + "Price" + '</p>';
                        strStoreData += '</div>';
                        strStoreData += '<div class="col-50">';
                        strStoreData += '<p class="gen-bill-align-end-text">' + "Rs. " + getPrice[x] + '</p>';
                        strStoreData += '</div>';
                        strStoreData += '</div>';

                        strStoreData += '<div class="row list-item-margin-top">';
                        strStoreData += '<div class="col-50">';
                        strStoreData += '<p class="gen-bill-align-start-text">' + "Quantity" + '</p>';
                        strStoreData += '</div>';
                        strStoreData += '<div class="col-50">';
                        strStoreData += '<p class="gen-bill-align-end-text item-quantity-class">' + getQty[x] + '</p>';
                        strStoreData += '</div>';
                        strStoreData += '</div>';

                        strStoreData += '<div class="row list-item-margin-top">';
                        strStoreData += '<div class="col-50">';
                        strStoreData += '<p class="gen-bill-align-start-text">' + "Discount" + '</p>';
                        strStoreData += '</div>';
                        strStoreData += '<div class="col-50">';
                        strStoreData += '<p class="gen-bill-align-end-text">' + "Rs. " + getDisc[x] + '</p>';
                        strStoreData += '</div>';
                        strStoreData += '</div>';

                        strStoreData += '</li>';

                        var itemPrice = parseInt(getPrice[x]) - parseInt(getDisc[x]);

                        subTotalPrice = subTotalPrice + itemPrice;
                  }

                  $$("#stored-bill-gen-ul").html(strStoreData);

                  console.log("All Desc data " + strStoreData);

                  $$("#itemDescID").val("");
                  $$("#itemPriceID").val("");
                  $$("#itemQuantityID").val("");
                  $$("#itemDiscountID").val("");

                  $$("#sub-total-amount-id").val("Rs. " + subTotalPrice);

                  promocodePrice = Math.round(subTotalPrice * (defaultPromoCodeDis / 100));
                  grandTotalPrice = subTotalPrice - promocodePrice;

                  $$("#promo-code-id").text("- Rs. " + promocodePrice);
                  $$("#total-amount-id").text("Rs. " + grandTotalPrice);
                  $$("#sub-total-amount-id").text("Rs. " + subTotalPrice);

                  $$('#stored-bill-card-layout').show();
                  $$('#total-bill-card-layout').show();
                  $$('.final-generate-bill-ul').show();
                  //$$('#create-bill-card-layout').hide();

                  loadSubServiceName();

            } else {
                  $$('#stored-bill-card-layout').hide();
                  $$('#create-bill-card-layout').show();
                  $$('#total-bill-card-layout').hide();
                  $$('.final-generate-bill-ul').hide();
            }
      }
});