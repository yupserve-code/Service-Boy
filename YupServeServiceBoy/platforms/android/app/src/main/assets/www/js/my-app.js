var app = new Framework7({
  // App root element
  root: '#app',
  // App Name
  name: 'YupServe',
  // App id
  id: 'com.ntspl.yupserveserviceboy',
  // Enable swipe panel
  /*   panel: {
     swipe: 'left',
    }, */
  pushState: true,
  toast: {
    closeTimeout: 3000,
    closeButton: true,
  },

  // Add default routes
  routes: [
    {
      name: 'login',
      path: '/login/',
      url: 'index.html'
    },
    {
      name: 'otp',
      path: '/otp/',
      url: 'otp.html'
    },
    {
      name: 'profile',
      path: '/profile/',
      url: 'profile.html'
    },

    {
      name: 'notification',
      path: '/notification/',
      url: 'notification.html'
    },

    {
      name: 'task-details',
      path: '/task-details/',
      url: 'task-details.html'
    },
    {
      name: 'task-details-2',
      path: '/task-details-2/',
      url: 'task-details-2.html'
    },

    {
      name: 'completed-task',
      path: '/completed-task/',
      url: 'completed-task.html'
    },
    {
      name: 'all-task',
      path: '/all-task/',
      url: 'all-task.html'
    },
    {
      name: 'update-details',
      path: '/update-details/',
      url: 'update-details.html'
    },
    {
      name: 'pending-task',
      path: '/pending-task/',
      url: 'pending-task.html'
    },
    {
      name: 'assigned-task',
      path: '/assigned-task/',
      url: 'assigned-task.html'
    },

    {
      name: 'filters',
      path: '/filters/',
      url: 'filters.html'
    },

    {
      name: 'dashboard',
      path: '/dashboard/',
      url: 'dashboard.html'
    },

    {
      name: 'no-internet-connection',
      path: '/no-internet-connection/',
      url: 'no-internet-connection.html'
    },
    {
      name: 'update-image',
      path: '/update-image/',
      url: 'update-image.html'
    },
    {
      name: 'feedback',
      path: '/feedback/',
      url: 'feedback.html'
    },
    {
      name: 'generate-bill',
      path: '/generate-bill/',
      url: 'generate-bill.html'
    }

  ],
  // ... other parameters
  on: {
    init() {

      //app.router.navigate('/loginone/');
      // app.views.main.router.navigate('/dashboard/');
      //device ready here
      //alert('Here comes About page');


      //app.router.navigate('/login/');
      //app.views.main.router.navigate('/login/');
      // app.router.navigate('/login/')
      if (cordova.platformId == 'android') {
        StatusBar.backgroundColorByHexString("#ff9800");
      }
    },
  }
});

var mainView = app.views.create('.view-main');


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;
// Handle Cordova Device Ready Event
// Handle Cordova Device Ready Event
$$(document).on('deviceready', function () {

  /* push notification */
  FCMPlugin.getToken(function (token) {
    localStorage.setItem("token", token);
    // alert(token);
  });

  FCMPlugin.onNotification(function (data) {

    var currentPage = sessionStorage.currentPage;

    if (currentPage == null || currentPage == undefined) {
      currentPage = "";
    }

    var notiCount = 0;

    notiCount = localStorage.getItem("NotiCount");

    if (notiCount == 0 || notiCount == null || notiCount == undefined) {
      notiCount = 0;
    } else {
      notiCount = localStorage.getItem("NotiCount");
    }

    var isLoggedIn = localStorage.getItem("isLogin");

    if (isLoggedIn == null || isLoggedIn == undefined) {
      isLoggedIn = "";
    }

    if (data.wasTapped) {

      var request_id = data.request_id;
      var action = data.action;

      notiCount = parseInt(notiCount) + 1;

      localStorage.setItem("NotiCount", notiCount);

      if (isLoggedIn == 'true') { // Redirect to task details page

        if (currentPage == "task-details") {

          loadTaskDetails(data.request_id);

        } else {

          //alert("currentPage = " + currentPage);

          app.views.main.router.navigate('/task-details/?orderId=' + data.request_id + '&backScreenType=' + "dashboard");

        }

      } else { // Redirect to login page

        app.views.main.router.navigate('/login/');
      }

    } else {
      // With callback on close
      var notificationCallbackOnClose = app.notification.create({
        icon: '<i class="icon material-icons md-only">notifications_none</i>',
        title: data.title,
        titleRightText: 'now',
        request_id: data.request_id,
        message: data.message,
        action: data.action,
        text: data.message,
        closeOnClick: true,
        //pushState: true,
        on: {
          close: function () {

            notiCount = parseInt(notiCount) + 1;

            localStorage.setItem("NotiCount", notiCount);

            if (isLoggedIn == 'true') { // Redirect to task details page

              if (currentPage == "task-details") {

                //alert("currentPage = " + currentPage);

                loadTaskDetails(data.request_id);

              } else {

                //alert("currentPage = " + currentPage);

                app.views.main.router.navigate('/task-details/?orderId=' + data.request_id + '&backScreenType=' + "dashboard");

              }

            } else { // Redirect to login page

              app.views.main.router.navigate('/login/');
            }
          },
        },
      });

      notificationCallbackOnClose.open();
    }

    //updateNotification();

    /* Notification modal ends */

  });

  /* Check back button functionality */
  document.addEventListener('backbutton', onBackKeyDown, false);
  /* Check back button functionality ends */

  document.addEventListener("resume", onResume, false);
  document.addEventListener("pause", onPause, false);

});

app.on('pageInit', function (page) {

  //my booking search start
  // create searchbar
  var searchbar = app.searchbar.create({
    el: '.searchbar',
    searchContainer: '.list',
    searchIn: '.item-order-number, .booking-service-name',
    on: {
      search(sb, query, previousQuery) {
        console.log(query, previousQuery);
      }
    }
  });
  //my booking end

});

$$(document).on('page:init', '.page[data-name="generate-bill"]', function (e) {

});

/************ Login Start *************/

$$(document).on('page:init', '.page[data-name="login"]', function (e) {

  sessionStorage.currentPage = "login";

  $$('#login-layout').hide();

  var isLogin = "";

  isLogin = localStorage.getItem("isLogin");

  if (isLogin == "true") {

    app.views.main.router.navigate('/dashboard/');

  } else {

    $$('#login-layout').show();

    isLogin == "false";

    // Call Login API service
    //On clicking login button 
    $$('.login-button').on('click', function (e) {
      app.preloader.show();
      e.preventDefault();

      var usermobile = $$("#usermobile").val().trim();

      console.log("mobile " + usermobile);

      console.log("Start  " + usermobile);

      if (usermobile.length == 0 || (usermobile.length > 0 && usermobile.length < 10)) {

        console.log('Check Validity!');
        app.preloader.hide();

        if (usermobile.length == 0) {
          $$("#mobile-invalid").removeClass("hidden");
          $$('#mobile-error').text("Enter your mobile number.");
        } else if (usermobile.length > 0 && usermobile.length < 10) {
          $$("#mobile-invalid").removeClass("hidden");
          $$('#mobile-error').text("Mobile number should be 10 digits.");

        } else {
          $$("#mobile-invalid").addClass("hidden");
        }

      } else {



        app.preloader.hide();
        console.log('Check Validity Success');

        $$("#mobile-invalid").addClass("hidden");

        console.log(usermobile);

        var user_id = 0;
        var mobile_no = usermobile;
        console.log("mobile no." + " " + mobile_no);

        // Load timeslots based on the date selection
        var connectiontype = checkConnection();

        if (connectiontype == "No network connection") {
          message = connectiontype;
          app.preloader.hide();
          var toast = app.toast.create({
            text: message
          });
          toast.open();
          app.preloader.hide();
        } else {

          app.preloader.show();

          app.request.setup({
            /* headers: {
              'api_key': "6be2f840a6a0da34f9904743800e2cae"
            }, */
            cache: false
          });

          app.request.post(LOGIN_API, {
            mobile: mobile_no
          }, function (data) {

            var obj = JSON.parse(data);
            console.log(data);

            if (obj.success != undefined) {

              if (typeof (Storage) !== "undefined") {
                localStorage.setItem("serviceBoyID", obj.success.staff_details.staff_id);
                var serviceBoyID = localStorage.getItem("serviceBoyID");
                console.log("Service Boy ID " + serviceBoyID);
                //localStorage.setItem("isLogin", 'true');

                app.preloader.hide();
                app.views.main.router.navigate('/otp/?mobileNumber=' + mobile_no + '&backScreenType=' + "loginScreen");

              } else {
                // Sorry! No Web Storage support..
              }
              message = obj.success.message;
              //app.preloader.hide();
            }

            if (obj.error != undefined) {
              message = obj.error.message;
              console.log("Error " + message);
              app.preloader.hide();

              var toast = app.toast.create({
                text: message
              });
              toast.open();
            }
          });
        }
      }
    });
  }
});

/*************** Login End *******************/

//swiper slider home page start
/* var swiper = app.swiper.get('.swiper-container');
swiper.autoplay.start(); */
//swiper slider home page end

/******************  On OTP page init*******************************/
$$(document).on('page:init', '.page[data-name="otp"]', function (e) {

  sessionStorage.currentPage = "otp";
  sessionStorage.backButtonOpenDialog = "false";

  var page = $$('.page[data-name="otp"]')[0].f7Page;
  var pageType = page.route.query.pageType;
  var orderId = page.route.query.bookingId;
  var backScreenType = page.route.query.backScreenType;

  //Store session
  sessionStorage.pageType = pageType;
  sessionStorage.bookingId = orderId;
  sessionStorage.backScreenType = backScreenType;

  console.log("OrderId=" + orderId + " Page Type=" + pageType);

  var mobileNumber = page.route.query.mobileNumber;

  var firstTwoNumber = mobileNumber.substring(0, 2);
  var lastTwoNumber = mobileNumber.substring(8, 10);

  //Device token
  var deviceToken = localStorage.getItem("token");

  console.log("deviceToken =" + " " + deviceToken);

  $$("#reg-mob-number").text(" Please enter the 4 digit OTP sent to  " + firstTwoNumber + "******" + lastTwoNumber);

  //On clicking otp submit button 
  $$('.otp-submit').on('click', function (e) {

    app.preloader.show();
    e.preventDefault();

    var userotp = $$("#partitioned").val().trim();

    console.log("otp " + userotp);

    console.log("Start  " + userotp);

    if (userotp.length == 0 || (userotp.length > 0 && userotp.length < 4)) {

      console.log('Check Validity!');
      app.preloader.hide();

      if (userotp.length == 0) {
        $$("#otp-invalid").removeClass("hidden");
        $$('#otp-error').text("Enter your OTP.");
      } else if (userotp.length > 0 && userotp.length < 4) {
        $$("#otp-invalid").removeClass("hidden");
        $$('#otp-error').text("OTP should be 4 digits.");

      } else {
        $$("#otp-invalid").addClass("hidden");
      }
    } else {
      app.preloader.hide();
      console.log('Check Validity Success');

      $$("#otp-invalid").addClass("hidden");

      console.log(userotp);
      // get Service Boy ID stored in localStorage
      var serviceBoyID = localStorage.getItem('serviceBoyID');
      console.log(serviceBoyID);
      var otp = userotp;
      console.log("OTP" + " " + otp);
      app.request.setup({
        /*  headers: {
           'api_key': "6be2f840a6a0da34f9904743800e2cae"
         }, */
        cache: false
      });

      // Check page and verify otp accordingly
      if (pageType == "taskDetails") {

        /* Come from Task Details Screen */
        var connectiontype = checkConnection();
        if (connectiontype == "No network connection") {
          message = connectiontype;
          app.preloader.hide();
          var toast = app.toast.create({
            text: message
          });
          toast.open();
          app.preloader.hide();
        } else {

          app.preloader.show();
          taskVerifyOTP();
        }
      } else {

        /* Come from Login Screen */
        var connectiontype = checkConnection();
        if (connectiontype == "No network connection") {
          message = connectiontype;
          app.preloader.hide();
          var toast = app.toast.create({
            text: message
          });
          toast.open();
          app.preloader.hide();
        } else {

          app.preloader.show();
          loginVerifyOTP();

        }
      }

      //Login Verify OTP
      function loginVerifyOTP() {

        app.request.post(LOGIN_VERIFY_OTP_API, {
          otp: otp, staff_id: serviceBoyID, device_id: deviceToken
        }, function (data) {

          var obj = JSON.parse(data);
          console.log(data);

          if (obj.success != undefined) {

            if (typeof (Storage) !== "undefined") {

              localStorage.setItem("serviceBoyID", obj.success.staff_details.staff_id);
              var serviceBoyID = localStorage.getItem("serviceBoyID");
              console.log("Service Boy ID " + serviceBoyID);
              localStorage.setItem("isLogin", 'true');
              app.views.main.router.navigate('/dashboard/');

            } else {
              // Sorry! No Web Storage support..
            }
            message = obj.success.message;
            app.preloader.hide();
          }

          if (obj.error != undefined) {
            message = obj.error.message;
            console.log("Error " + message);
            app.preloader.hide();

            var toast = app.toast.create({
              text: message
            });
            toast.open();

            $$("#partitioned").val("");

          }
        });
      }

      //Task Verify OTP
      function taskVerifyOTP() {

        app.request.post(TASK_VERIFY_OTP_API, {
          order_id: orderId, otp: otp, staff_id: serviceBoyID
        }, function (data) {

          var obj = JSON.parse(data);
          console.log(data);

          if (obj.success != undefined) {

            if (typeof (Storage) !== "undefined") {

              var msg = obj.success.message;

              var toast = app.toast.create({
                text: msg
              });
              toast.open();
              app.preloader.hide();
              app.views.main.router.navigate('/task-details/?orderId=' + orderId + '&backScreenType=' + backScreenType);

            } else {
              // Sorry! No Web Storage support..
            }
            //message = obj.success.message;

          }

          if (obj.error != undefined) {
            message = obj.error.message;
            console.log("Error " + message);
            app.preloader.hide();

            var toast = app.toast.create({
              text: message
            });
            toast.open();

            $$("#partitioned").val("");
          }
        });
      }
    }
  });

  /******** Resend API calling **********/

  //On clicking resend button 
  $$('.resend-onclick').on('click', function (e) {

    $$("#partitioned").val("");

    // get Service Boy ID stored in localStorage
    var serviceBoyID = localStorage.getItem('serviceBoyID');
    console.log(serviceBoyID);

    var page = $$('.page[data-name="otp"]')[0].f7Page;
    var pageType = page.route.query.pageType;
    var orderId = page.route.query.bookingId;

    if (pageType == "taskDetails") {

      var connectiontype = checkConnection();

      if (connectiontype == "No network connection") {
        message = connectiontype;
        app.preloader.hide();
        var toast = app.toast.create({
          text: message
        });
        toast.open();
        app.preloader.hide();
      } else {

        app.preloader.show();
        taskResendOTP();
      }

    } else {

      /* Come from Login Screen */
      var connectiontype = checkConnection();
      if (connectiontype == "No network connection") {
        message = connectiontype;
        app.preloader.hide();
        var toast = app.toast.create({
          text: message
        });
        toast.open();
        app.preloader.hide();
      } else {

        app.preloader.show();
        loginResendOTP();
      }
    }

    function loginResendOTP() {

      app.request.setup({
        /* headers: {
          'api_key': "6be2f840a6a0da34f9904743800e2cae"
        }, */
        cache: false
      });

      app.request.post(LOGIN_RESEND_OTP_API, {
        staff_id: serviceBoyID
      }, function (data) {

        var obj = JSON.parse(data);
        console.log(data);

        if (obj.success != undefined) {

          if (typeof (Storage) !== "undefined") {

            localStorage.setItem("serviceBoyID", obj.success.staff_details.staff_id);

            var serviceBoyID = localStorage.getItem("customerID");
            console.log("Service BoyID ID " + serviceBoyID);
            var msg = obj.success.message;
            var toast = app.toast.create({
              text: msg
            });
            toast.open();

          } else {
            // Sorry! No Web Storage support..
          }
          message = obj.success.message;
          app.preloader.hide();
        }

        if (obj.error != undefined) {
          message = obj.error.message;
          console.log("Error " + message);
          app.preloader.hide();

          var toast = app.toast.create({
            text: message
          });
          toast.open();
        }
      });
    }

    function taskResendOTP() {

      app.request.setup({
        /*  headers: {
           'api_key': "6be2f840a6a0da34f9904743800e2cae"
         }, */
        cache: false
      });

      /* Come from Task details Screen */

      app.request.post(TASK_VERIFY_RESEND_OTP_API, {
        staff_id: serviceBoyID, order_id: orderId
      }, function (data) {

        var obj = JSON.parse(data);
        console.log(data);

        if (obj.success != undefined) {

          message = obj.success.message;

          var toast = app.toast.create({
            text: message
          });
          toast.open();

          app.preloader.hide();
        }

        if (obj.error != undefined) {
          message = obj.error.message;
          console.log("Error " + message);
          app.preloader.hide();

          var toast = app.toast.create({
            text: message
          });
          toast.open();
        }
      });
    }
  });
});

/******************  On OTP page init End*******************************/


/************ Dashboard Start *************/

$$(document).on('page:init', '.page[data-name="dashboard"]', function (e) {

  sessionStorage.currentPage = "dashboard";
  sessionStorage.logoutDialogOpen = "false";
  sessionStorage.backButtonOpenDialog = "false";

  var notiCount = localStorage.getItem("NotiCount");

  if (notiCount == undefined || notiCount == null) {
    notiCount = 0;
  }

  if (notiCount > 0) {
    $$(".navbar").find(".badge").html(notiCount);

    $$("#notificationCount").show();
  } else {
    $$("#notificationCount").hide();
  }

  // Load timeslots based on the date selection
  var connectiontype = checkConnection();

  if (connectiontype == "No network connection") {
    message = connectiontype;
    app.preloader.hide();
    var toast = app.toast.create({
      text: message
    });
    toast.open();
    app.preloader.hide();
  } else {

    $$('#taskDashboard').hide();
    $$('#empty-dashboard-task-screen').hide();

    loadHomeServiceList();
  }

  $$('#logout-click').on('click', function () {

    sessionStorage.logoutDialogOpen = "true";

    app.dialog.confirm('Do you really want to logout?', 'Logout', function () {

      sessionStorage.logoutDialogOpen = "false";

      if (typeof (Storage) !== "undefined") {
        localStorage.setItem("isLogin", 'false');
        localStorage.removeItem("serviceBoyID");

        var toast = app.toast.create({
          text: "You have been logged out successfully."
        });
        toast.open();
        app.views.main.router.navigate('/login/');
      }
    },
      function () {
        sessionStorage.logoutDialogOpen = "false";
      });
  });

  $$('#drawerHome').on('click', function () {
    // Load timeslots based on the date selection
    var connectiontype = checkConnection();

    if (connectiontype == "No network connection") {
      message = connectiontype;
      app.preloader.hide();
      var toast = app.toast.create({
        text: message
      });
      toast.open();
      app.preloader.hide();
    } else {

      $$('#taskDashboard').hide();
      $$('#empty-dashboard-task-screen').hide();

      loadHomeServiceList();
    }
  });

  //hide profile
  //$$('#drawerProfileLayout').hide();

  $$('#drawerProfile').on('click', function () {

    // Load timeslots based on the date selection
    var connectiontype = checkConnection();

    if (connectiontype == "No network connection") {
      message = connectiontype;
      app.preloader.hide();
      var toast = app.toast.create({
        text: message
      });
      toast.open();
      app.preloader.hide();
    } else {

      app.views.main.router.navigate('/profile/');
    }
  });

  $$('#drawerNotification').on('click', function () {

    // Load timeslots based on the date selection
    var connectiontype = checkConnection();

    if (connectiontype == "No network connection") {
      message = connectiontype;
      app.preloader.hide();
      var toast = app.toast.create({
        text: message
      });
      toast.open();
      app.preloader.hide();
    } else {

      app.views.main.router.navigate('/notification/');
    }
  });

  $$('#notificationIcon').on('click', function () {

    // Load timeslots based on the date selection
    var connectiontype = checkConnection();

    if (connectiontype == "No network connection") {
      message = connectiontype;
      app.preloader.hide();
      var toast = app.toast.create({
        text: message
      });
      toast.open();
      app.preloader.hide();
    } else {

      app.views.main.router.navigate('/notification/');
    }
  });

  $$('#dashboardAllTaskCard').on('click', function () {

    // Load timeslots based on the date selection
    var connectiontype = checkConnection();

    if (connectiontype == "No network connection") {
      message = connectiontype;
      app.preloader.hide();
      var toast = app.toast.create({
        text: message
      });
      toast.open();
      app.preloader.hide();
    } else {

      app.views.main.router.navigate('/all-task/');
    }
  });

  $$('#dashboardCompletedTaskCard').on('click', function () {

    // Load timeslots based on the date selection
    var connectiontype = checkConnection();

    if (connectiontype == "No network connection") {
      message = connectiontype;
      app.preloader.hide();
      var toast = app.toast.create({
        text: message
      });
      toast.open();
      app.preloader.hide();
    } else {

      app.views.main.router.navigate('/completed-task/');
    }
  });

  $$('#dashboardAssignedTaskCard').on('click', function () {

    // Load timeslots based on the date selection
    var connectiontype = checkConnection();

    if (connectiontype == "No network connection") {
      message = connectiontype;
      app.preloader.hide();
      var toast = app.toast.create({
        text: message
      });
      toast.open();
      app.preloader.hide();
    } else {
      app.views.main.router.navigate('/assigned-task/');
    }
  });

  $$('#viewAllTaskButton').on('click', function () {

    // Load timeslots based on the date selection
    var connectiontype = checkConnection();

    if (connectiontype == "No network connection") {
      message = connectiontype;
      app.preloader.hide();
      var toast = app.toast.create({
        text: message
      });
      toast.open();
      app.preloader.hide();
    } else {
      app.views.main.router.navigate('/all-task/');
    }
  });
});

/************ Dashboard End *************/

/************ All Task List Api Start **************/

$$(document).on('page:init', '.page[data-name="all-task"]', function (e) {

  // get Service Boy ID stored in localStorage
  var serviceBoyID = localStorage.getItem('serviceBoyID');
  console.log(serviceBoyID);

  if (serviceBoyID == null) {
    serviceBoyID = 0;
  }

  var page = $$('.page[data-name="all-task"]')[0].f7Page;
  var backScreenType = page.route.query.backScreenType;

  if (backScreenType == null) {
    backScreenType = "allTask";
  }

  sessionStorage.backScreenType = backScreenType;

  var allowInfinite = true;
  $$(".page").addClass("contentload");
  $$(".page").addClass("loadernone");

  //Hide filter button
  $$('#allTaskFabButton').hide();

  app.request.setup({
    /*  headers: {
       'api_key': "6be2f840a6a0da34f9904743800e2cae"
     }, */
    cache: false
  });

  var pageIndex = 1;

  // Load timeslots based on the date selection
  var connectiontype = checkConnection();

  if (connectiontype == "No network connection") {
    message = connectiontype;
    app.preloader.hide();
    var toast = app.toast.create({
      text: message
    });
    toast.open();
    app.preloader.hide();
  } else {

    app.preloader.show();
    $$('#empty-all-task-screen').hide();
    $$('#searchAllTask').hide();
    $$('#task-empty').hide();
    loadAllTaskBookings();

  }

  function loadAllTaskBookings() {

    app.request.get(ALL_TASK_API, { staff_id: serviceBoyID, page: pageIndex }, function (data) {
      var obj = JSON.parse(data);

      if (obj.success != undefined) {

        if (obj.success.bookings != null) {

          var str = "";

          if (obj.success.bookings.length > 0) {

            for (var x = 0; x < obj.success.bookings.length; x++) {

              var dateTime = obj.success.bookings[x].date_time;
              var orderID = obj.success.bookings[x].order_id;
              var status = obj.success.bookings[x].status;
              var service_name = obj.success.bookings[x].service_name;
              var service_image = obj.success.bookings[x].service_image;

              var res = dateTime.split(" ");
              var dateString = res[0];
              var timeString = res[1];

              var ddmmyy = dateString.split("-");
              var date = ddmmyy[2];
              var month = ddmmyy[1];
              var year = ddmmyy[0];

              var formattedMonth = monthFormat(month);
              var finalDate = date + " " + formattedMonth + " " + year;
              var hhmm = timeString.split(":");
              var hour = hhmm[0];
              var minute = hhmm[1];

              var formattedHour = hourFormat(hour);

              var AMPM = "";

              if (hour >= 12 && hour <= 23) {
                AMPM = "PM";
              } else {
                AMPM = "AM";
              }

              var finalTime = formattedHour + ":" + minute + " " + AMPM;

              str += '<li>';
              str += '<a href="/task-details/?orderId=' + orderID + '&backScreenType=' + backScreenType + '" class="item-link item-content">';
              str += '<div class="item-media"><img src= "' + service_image + '"  width="65" /></div>';
              str += '<div class="item-inner">';
              str += '<div class="item-title-row">';
              str += '<div class="item-order-number">Booking ID - ' + "#" + orderID + '</div>';

              if (status == "A".toUpperCase()) {
                str += '<div class="item-after orange-background">' + "Active" + '</div>';
              } else if (status == "C".toUpperCase()) {
                str += '<div class="item-after blue-background">' + "Assigned" + '</div>';
              } else if (status == "R".toUpperCase()) {
                str += '<div class="item-after red-background"">' + "Rejected" + '</div>';
              } else if (status == "CC".toUpperCase()) {
                str += '<div class="item-after red-background">' + "Cancelled" + '</div>';
              } else if (status == "CS".toUpperCase()) {
                str += '<div class="item-after red-background">' + "Cancelled" + '</div>';
              } else if (status == "CO".toUpperCase()) {
                str += '<div class="item-after green-background">' + "Completed" + '</div>';
              } else {
                str += '<div class="item-after">' + status + '</div>';
              }
              str += '</div>';
              str += '<div class="booking-service-name">' + service_name + '</div>';
              str += '<div class="item-title-row my-booking-date-otp-layout">';
              str += '<div class="item-date">' + finalDate + " " + finalTime + '</div>';
              str += '<div class="item-otp hidden">4785</div>';
              str += '</div>';
              str += '</div>';
              str += '</a>';
              str += '</li>';

            }
            pageIndex = pageIndex + 1;
            app.preloader.hide();
            $$('#empty-all-task-screen').hide();
            $$('#task-empty').show();
            $$('#searchAllTask').show();

          } else {

            app.preloader.hide();
            $$('#empty-all-task-screen').show();
            $$('#task-empty').hide();
            $$('#searchAllTask').hide();
          }

          $$(".page").addClass("loadernone");
          $$(".page").removeClass("contentload");
        }
      } if (obj.error != undefined) {
        message = obj.error.message;
        console.log("Error " + message);
        app.preloader.hide();

        var toast = app.toast.create({
          text: message
        });
        toast.open();
      }
      $$("#all-task-layout").html(str);
      app.preloader.hide();
      console.log(obj);
    });
  }

  /* Infinite scroll */

  // Attach 'infinite' event handler

  $$('.infinite-scroll-content').on('infinite', function () {

    var connectiontype = checkConnection();

    if (connectiontype == "No network connection") {
      message = connectiontype;
      app.preloader.hide();
      var toast = app.toast.create({
        text: message
      });
      toast.open();
      app.preloader.hide();

    } else {

      $$(".page").removeClass("loadernone");

      $$('.infinite-scroll-preloader').show();
      var lastItemIndex = $$('#all-task-layout li').length;

      // Max items to load
      var maxItems = 100;

      // Exit, if loading in progress
      if (!allowInfinite) return;

      // Set loading flag
      allowInfinite = false;

      // Emulate 1s loading
      setTimeout(function () {
        // Reset loading flag
        allowInfinite = true;

        if (lastItemIndex >= maxItems) {
          // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
          app.infiniteScroll.destroy('.infinite-scroll-content');
          // Remove preloader
          $$('.infinite-scroll-preloader').hide();
          return;
        }

        app.request.get(ALL_TASK_API, { staff_id: serviceBoyID, page: pageIndex }, function (data) {

          var obj = JSON.parse(data);

          if (obj.success != undefined) {

            if (obj.success.bookings != null) {

              var str = "";

              if (obj.success.bookings.length > 0) {

                for (var x = 0; x < obj.success.bookings.length; x++) {

                  var dateTime = obj.success.bookings[x].date_time;
                  var orderID = obj.success.bookings[x].order_id;
                  var status = obj.success.bookings[x].status;
                  var service_name = obj.success.bookings[x].service_name;
                  var service_image = obj.success.bookings[x].service_image;

                  var res = dateTime.split(" ");
                  var dateString = res[0];
                  var timeString = res[1];

                  var ddmmyy = dateString.split("-");
                  var date = ddmmyy[2];
                  var month = ddmmyy[1];
                  var year = ddmmyy[0];

                  var formattedMonth = monthFormat(month);
                  var finalDate = date + " " + formattedMonth + " " + year;
                  var hhmm = timeString.split(":");
                  var hour = hhmm[0];
                  var minute = hhmm[1];

                  var formattedHour = hourFormat(hour);

                  var AMPM = "";

                  if (hour >= 12 && hour <= 23) {
                    AMPM = "PM";
                  } else {
                    AMPM = "AM";
                  }

                  var finalTime = formattedHour + ":" + minute + " " + AMPM;

                  str += '<li>';
                  str += '<a href="/task-details/?orderId=' + orderID + '&backScreenType=' + backScreenType + '" class="item-link item-content">';
                  str += '<div class="item-media"><img src= "' + service_image + '"  width="65" /></div>';
                  str += '<div class="item-inner">';
                  str += '<div class="item-title-row">';
                  str += '<div class="item-order-number">Booking ID - ' + "#" + orderID + '</div>';

                  if (status == "A".toUpperCase()) {
                    str += '<div class="item-after orange-background">' + "Active" + '</div>';
                  } else if (status == "C".toUpperCase()) {
                    str += '<div class="item-after blue-background">' + "Assigned" + '</div>';
                  } else if (status == "R".toUpperCase()) {
                    str += '<div class="item-after red-background"">' + "Rejected" + '</div>';
                  } else if (status == "CC".toUpperCase()) {
                    str += '<div class="item-after red-background">' + "Cancelled" + '</div>';
                  } else if (status == "CS".toUpperCase()) {
                    str += '<div class="item-after red-background">' + "Cancelled" + '</div>';
                  } else if (status == "CO".toUpperCase()) {
                    str += '<div class="item-after green-background">' + "Completed" + '</div>';
                  } else {
                    str += '<div class="item-after">' + status + '</div>';
                  }
                  str += '</div>';
                  str += '<div class="booking-service-name">' + service_name + '</div>';
                  str += '<div class="item-title-row my-booking-date-otp-layout">';
                  str += '<div class="item-date">' + finalDate + " " + finalTime + '</div>';
                  str += '<div class="item-otp hidden">4785</div>';
                  str += '</div>';
                  str += '</div>';
                  str += '</a>';
                  str += '</li>';

                }

                $$('.infinite-scroll-preloader').hide();
                $$('#all-task-layout').append(str);
              } else {
                app.infiniteScroll.destroy('.infinite-scroll-content');
                // Remove preloader
                $$('.infinite-scroll-preloader').hide();
                pageIndex = 0;
                return;
              }
            }
          }
        });
        // Update last loaded index
        pageIndex = pageIndex + 1;
      }, 1000);
    }
  });

  /* Infinite scroll ends */

  //All Task back Button
  $$('#allTaskBackButton').on('click', function () {

    if (backScreenType == "profileAllTask") {

      app.views.main.router.navigate('/profile/');

    } else {
      app.views.main.router.navigate('/dashboard/');

    }
  });
});

/************ All Task List Api End **************/

/************ Task Details Api Start **************/

$$(document).on('page:init', '.page[data-name="task-details"]', function (e) {

  var isServiceStartDialogOn = "false";

  sessionStorage.isServiceStartDialogOn = isServiceStartDialogOn;

  sessionStorage.currentPage = "task-details";

  //Store for customer mobile number in task details screen
  var custNumber = "";
  var bookedServiceName = "";

  var invoicePathFromServer = "";
  //Used for task end in task details screen (line no 1426)
  //var isEndTask = "false";
  sessionStorage.isEndTask = "false";

  //hide the booking details screen
  $$('#contain-layout-task-details').hide();
  $$('#generateBillLayout').hide();

  var customerNumber = "";
  var page = $$('.page[data-name="task-details"]')[0].f7Page;
  var orderId = page.route.query.orderId;
  var notificationID = page.route.query.notificationId;
  var backScreenType = page.route.query.backScreenType;

  sessionStorage.backScreenType = backScreenType;
  sessionStorage.orderID = orderId;

  console.log("OrderId=" + orderId);

  // get Service Boy ID stored in localStorage
  var serviceBoyID = localStorage.getItem('serviceBoyID');
  console.log(serviceBoyID);

  if (serviceBoyID == null) {
    serviceBoyID = 0;
  }

  if (notificationID == null || notificationID == undefined) {
    notificationID = "";
  }

  //Read notification API
  if (notificationID != "") {

    if (connectiontype == "No network connection") {

      message = connectiontype;
      //hide the booking details screen
      app.preloader.hide();
      var toast = app.toast.create({
        text: message
      });
      toast.open();
      app.preloader.hide();
    } else {

      //Call Task Details
      loadReadNotification(notificationID, serviceBoyID);

    }
  }

  // Load timeslots based on the date selection
  var connectiontype = checkConnection();

  if (connectiontype == "No network connection") {

    message = connectiontype;
    //hide the booking details screen
    $$('#contain-layout-task-details').hide();
    app.preloader.hide();
    var toast = app.toast.create({
      text: message
    });
    toast.open();
    app.preloader.hide();
  } else {

    app.preloader.show();

    $$('#contain-layout-task-details').hide();
    //Call Task Details
    loadTaskDetails(orderId);
  }

  //Service Start button click
  $$('#serviceStartButton').on('click', function () {

    isServiceStartDialogOn = "true";

    sessionStorage.isServiceStartDialogOn = isServiceStartDialogOn;

    //Check task start or end
    //isEndTask = true (Task is end)
    //isEndTask = false (Task is start)

    /* Start button click */

    //app.dialog.confirm(text, title, callbackOk, callbackCancel);

    app.dialog.confirm('Do you really want to start service?', function () {

      isServiceStartDialogOn = "false";

      sessionStorage.isServiceStartDialogOn = isServiceStartDialogOn;

      /* if (typeof (Storage) !== "undefined") {
        localStorage.setItem("isLogin", 'false');
        app.views.main.router.navigate('/login/');
        
      } */

      app.views.main.router.navigate('/otp/?pageType=' + "taskDetails" + '&bookingId=' + sessionStorage.orderID + '&mobileNumber=' + sessionStorage.customerNumber + '&backScreenType=' + backScreenType);

    },

      function () {

        //myApp.alert('You clicked Cancel button');
        isServiceStartDialogOn = "false";

        sessionStorage.isServiceStartDialogOn = isServiceStartDialogOn;

      }
    );
  });

  //End button click
  $$('#serviceEndButton').on('click', function () {

    /* End button click */

    app.dialog.confirm('Do you really want to end service?', function () {

      isServiceStartDialogOn = "false";

      sessionStorage.isServiceStartDialogOn = isServiceStartDialogOn;

      var connectiontype = checkConnection();

      if (connectiontype == "No network connection") {
        message = connectiontype;
        app.preloader.hide();
        var toast = app.toast.create({
          text: message
        });
        toast.open();
        app.preloader.hide();

      } else {

        app.request.setup({
          /* headers: {
            'api_key': "6be2f840a6a0da34f9904743800e2cae"
          }, */
          cache: false
        });
        app.preloader.show();

        app.request.post(TASK_END_API, {
          staff_id: serviceBoyID, order_id: orderId
        }, function (data) {

          var obj = JSON.parse(data);
          console.log(data);

          if (obj.success != undefined) {

            app.preloader.hide();
            var msg = obj.success.message;
            var toast = app.toast.create({
              text: msg
            });
            toast.open();
            //Call Task Details
            loadTaskDetails(orderId);
          }

          if (obj.error != undefined) {
            message = obj.error.message;
            console.log("Error " + message);
            app.preloader.hide();

            var toast = app.toast.create({
              text: message
            });
            toast.open();
          }
        });
      }
    },
      function () {

        //myApp.alert('You clicked Cancel button');
        isServiceStartDialogOn = "false";

        sessionStorage.isServiceStartDialogOn = isServiceStartDialogOn;
      }
    );
  });

  //Service Cancel button click
  $$('#serviceCancelButton').on('click', function () {

    isServiceStartDialogOn = "true";

    sessionStorage.isServiceStartDialogOn = isServiceStartDialogOn;

    app.dialog.confirm('Do you really want to cancel service?', function () {

      //myApp.alert('You clicked Cancel button');
      isServiceStartDialogOn = "false";

      sessionStorage.isServiceStartDialogOn = isServiceStartDialogOn;

      var connectiontype = checkConnection();

      if (connectiontype == "No network connection") {
        message = connectiontype;
        app.preloader.hide();
        var toast = app.toast.create({
          text: message
        });
        toast.open();
        app.preloader.hide();

      } else {

        /* Cancle task api start */

        app.request.setup({
          /*  headers: {
             'api_key': "6be2f840a6a0da34f9904743800e2cae"
           }, */
          cache: false
        });
        app.preloader.show();

        app.request.post(TASK_CANCEL_API, {
          staff_id: serviceBoyID, order_id: orderId
        }, function (data) {

          var obj = JSON.parse(data);
          console.log(data);

          if (obj.success != undefined) {

            app.preloader.hide();
            var msg = obj.success.message;
            var toast = app.toast.create({
              text: msg
            });
            toast.open();

            //Call Task Details
            loadTaskDetails(orderId);
          }

          if (obj.error != undefined) {
            message = obj.error.message;
            console.log("Error " + message);
            app.preloader.hide();

            var toast = app.toast.create({
              text: message
            });
            toast.open();
          }
        });
      }
    },
      function () {

        //myApp.alert('You clicked Cancel button');
        isServiceStartDialogOn = "false";

        sessionStorage.isServiceStartDialogOn = isServiceStartDialogOn;

      }
    );
  });

  /* Payment received button click  */

  $$('.online-pay-button').on('click', function () {

    isServiceStartDialogOn = "true";

    sessionStorage.isServiceStartDialogOn = isServiceStartDialogOn;

    app.dialog.confirm('Have you received the payment?', function () {

      isServiceStartDialogOn = "false";

      sessionStorage.isServiceStartDialogOn = isServiceStartDialogOn;

      /* Payment received api start */

      var connectiontype = checkConnection();

      if (connectiontype == "No network connection") {

        message = connectiontype;
        var toast = app.toast.create({
          text: message
        });
        toast.open();
        app.preloader.hide();

      } else {

        app.request.setup({
          /* headers: {
            'api_key': "6be2f840a6a0da34f9904743800e2cae"
          }, */
          cache: false
        });

        app.preloader.show();
        app.request.post(PAYMENT_RECEIVED_API, {
          staff_id: serviceBoyID, order_id: orderId
        }, function (data) {

          var obj = JSON.parse(data);
          console.log(data);
          if (obj.success != undefined) {

            app.preloader.hide();
            var msg = obj.success.message;
            var toast = app.toast.create({
              text: msg
            });
            toast.open();

            //Call Task Details
            loadTaskDetails(orderId);
          }

          if (obj.error != undefined) {
            message = obj.error.message;
            console.log("Error " + message);
            app.preloader.hide();

            var toast = app.toast.create({
              text: message
            });
            toast.open();
          }
        });
      }
    },
      function () {

        //myApp.alert('You clicked Cancel button');
        isServiceStartDialogOn = "false";

        sessionStorage.isServiceStartDialogOn = isServiceStartDialogOn;
      }
    );

  });

  /* Extra requirement button click  */

  $$('#updateRequirementButton').on('click', function () {

    app.views.main.router.navigate('/update-details/?orderId=' + orderId + '&backScreenType=' + backScreenType);

  });

  /*   $$('#payment-dtls-show-as-pdf').on('click', function () {
  
  
      alert("OK" + sessionStorage.invoicePathFromServer);
  
      var target = "_blank";
  
      var options = "location=yes,hidden=yes,beforeload=yes";
  
      var afg = "https://www.icarda.org/";
  
      //window.open(sessionStorage.invoicePathFromServer, "_system", "");
  
      cordova.InAppBrowser.open("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", target, options);
  
    }); */

  /* Extra requirement image click  */

  /* $$("body").on('click', '#extraRequirementImage img', function (e) {
 
   var imageURL = $$(this).attr('src');
 
   viewZoomImage(imageURL);
   
 });  */


  /* Back Button */
  $$('#taskDetailsBackButton').on('click', function () {

    if (backScreenType == "allTask") {

      app.views.main.router.navigate('/all-task/');

    } else if (backScreenType == "completedTask") {

      app.views.main.router.navigate('/completed-task/');

    } else if (backScreenType == "assignedTask") {

      app.views.main.router.navigate('/assigned-task/');

    } else if (backScreenType == "dashboardTask") {

      app.views.main.router.navigate('/dashboard/');

    } else if (backScreenType == "profileAssignedTask") {

      app.views.main.router.navigate('/assigned-task/?backScreenType=' + backScreenType);

    } else if (backScreenType == "profileCompletedTask") {

      app.views.main.router.navigate('/completed-task/?backScreenType=' + backScreenType);

    } else if (backScreenType == "profileAllTask") {

      app.views.main.router.navigate('/all-task/?backScreenType=' + backScreenType);

    } else if (backScreenType == "notification") {

      app.views.main.router.navigate('/notification/');

    } else {

      app.views.main.router.navigate('/dashboard/');
    }
  });

  //End button click
  $$('#generateBillButton').on('click', function () {

    debugger

    app.views.main.router.navigate('/generate-bill/?pageType=' + "taskDetails" + '&orderId=' + sessionStorage.orderID + '&backScreenType=' + backScreenType + '&BookedServiceName=' + sessionStorage.bookedServiceName);
  });
});


/************ Task Details Api End **************/


/************ Update Requirement Api Start **************/

$$(document).on('page:init', '.page[data-name="update-details"]', function (e) {

  // get Service Boy ID stored in localStorage
  var serviceBoyID = localStorage.getItem('serviceBoyID');
  console.log(serviceBoyID);

  var imagePath = "";

  //Recived orderID from task details
  var page = $$('.page[data-name="update-details"]')[0].f7Page;
  var orderId = page.route.query.orderId;
  var backScreenType = page.route.query.backScreenType;

  var imageCount = 0;

  //Hide Image
  $$('#imageLayout').hide();
  //$$('#addMoreImage').hide();


  //Back arrow click
  $$('#updateScreenBack').on('click', function () {

    localStorage.removeItem("imag1");
    //localStorage.removeItem("image2");
    //localStorage.removeItem("image3");

    app.views.main.router.navigate('/task-details/?orderId=' + orderId + '&backScreenType=' + backScreenType);

  });

  $$('#popupImage1').on('click', function () {

    //viewZoomImage(localStorage.getItem("imag1"));

    app.views.main.router.navigate('/update-image/?orderId=' + orderId + '&backScreenType=' + backScreenType + '&extraImage=' + localStorage.getItem("imag1") + '&previousScreen=' + "extraRequirmentScreen");

  });

  /* $$('#popupImage2').on('click', function () {

    app.views.main.router.navigate('/update-image/?orderId=' + orderId + '&backScreenType=' + backScreenType + '&extraImage=' + localStorage.getItem("image2") + '&previousScreen=' + "extraRequirmentScreen");

  });

  $$('#popupImage3').on('click', function () {

    app.views.main.router.navigate('/update-image/?orderId=' + orderId + '&backScreenType=' + backScreenType + '&extraImage=' + localStorage.getItem("image3") + '&previousScreen=' + "extraRequirmentScreen");

  });
*/
  /* $$('#popupImage1').on('click', function () {

    loadPopUpImage(localStorage.getItem("imag1"));

  });

  $$('#popupImage2').on('click', function () {

    loadPopUpImage(localStorage.getItem("image2"));

  });

  $$('#popupImage3').on('click', function () {

    loadPopUpImage(localStorage.getItem("image3"));

  }); */



  // call camera function to take picture using camera
  function takePicure() {
    navigator.camera.getPicture(onSuccess, onFail, {
      quality: 20,
      correctOrientation: true,
      destinationType: Camera.DestinationType.FILE_URI
    });
  }
  // camera on success
  function onSuccess(imageURI) {
    console.log('Successw', imageURI);

    /* // Convert image
     getFileContentAsBase64(imageURI,function(base64Image){
    //window.open(base64Image);
     console.log("base64Image"+ base64Image); 
     imagePath = base64Image;
    // Then you'll be able to handle the myimage.png file as base64
    });

    alert("baseUrl=" + imagePath);
    console.log("baseUrl" + imagePath); */

    $$('#imageLayout').show();
    $$('#imag1').show();
    $$('#imag1').attr('src', imageURI);
    //alert(imageURI);
    $$('#image2').hide();
    $$('#image3').hide();
    $$('#cameraButton').hide();
    $$('#cameraIcon').hide();

    localStorage.setItem("imag1", imageURI);

    /* if (imageCount == 2) {

      $$('#imag1').show();
      $$('#image2').show();

      $$('#image2').attr('src', imageURI);
      
      $$('#image3').hide();

      localStorage.setItem("image2", imageURI);
      //var updateImage2 = localStorage.getItem("image2");

    }

    if (imageCount == 3) {

      $$('#imag1').show();
      $$('#image2').show();
      $$('#image3').show();

      $$('#image3').attr('src', imageURI);
      $$('#addMoreImage').hide();

      localStorage.setItem("image3", imageURI);
      //var updateImage3 = localStorage.getItem("image3");
      
    }  
    //takePicure();
} */
  }

  function onFail(message) {
    //alert('Failed because: ' + message);
    imageCount--;
  }

  $$('#cameraButton').on('click', function () {
    takePicure();
    imageCount++;
  });

  /* $$('#addMoreImage').on('click', function () {
    takePicure();
    imageCount++;
  }); */

  //Submit button click
  $$('#updateButton').on('click', function () {

    app.preloader.show();
    var extraRequirementText = $$("#textAreaInput").val().trim();

    var updateImage1 = localStorage.getItem("imag1");
    //var updateImage2 = localStorage.getItem("image2");
    //var updateImage3 = localStorage.getItem("image3");

    if (updateImage1 == null || updateImage1 == undefined) {
      updateImage1 = "";
    }

    /* if (updateImage2 == null || updateImage2 == undefined) {

      updateImage2 = "";
    }

    if (updateImage3 == null || updateImage3 == undefined) {

      updateImage3 = "";
    } */

    if (extraRequirementText.length == 0 && updateImage1 == "") {

      app.preloader.hide();
      var toast = app.toast.create({
        text: "Please update at least one requirement."
      });
      toast.open();

    } else {

      $$("#update-invalid").addClass("hidden");

      var connectiontype = checkConnection();
      if (connectiontype == "No network connection") {
        message = connectiontype;
        app.preloader.hide();
        var toast = app.toast.create({
          text: message
        });
        toast.open();
        app.preloader.hide();
      } else {

        //Without image call API (Only text) 
        if (updateImage1 == "") {

          app.request.setup({
            /* headers: {
              'api_key': "6be2f840a6a0da34f9904743800e2cae"
            }, */
            cache: false
          });

          app.request.post(EXTRA_REQUIREMENT_API, {
            staff_id: serviceBoyID, order_id: orderId, requirement: extraRequirementText
          }, function (data) {

            var obj = JSON.parse(data);

            if (obj.success != undefined) {

              message = obj.success.message;
              app.preloader.hide();

              var toast = app.toast.create({
                text: message
              });
              toast.open();

              app.views.main.router.navigate('/task-details/?orderId=' + orderId + '&backScreenType=' + backScreenType);
            }

            if (obj.error != undefined) {
              message = obj.error.message;
              console.log("Error " + message);
              app.preloader.hide();

              var toast = app.toast.create({
                text: message
              });
              toast.open();
            }
          });

        } else {


          //With image and text call API

          var options = new FileUploadOptions();

          options.fileKey = "images1";
          options.fileName = updateImage1.substr(updateImage1.lastIndexOf('/') + 1);
          options.mimeType = "image/jpeg";

          options.params = {
            staff_id: serviceBoyID,
            order_id: orderId,
            requirement: extraRequirementText
          };

          var headers = { 'api_key': '6be2f840a6a0da34f9904743800e2cae' };

          options.headers = headers;

          var ft = new FileTransfer();

          ft.onprogress = function (progressEvent) {
            if (progressEvent.lengthComputable) {
              loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
            } else {
              loadingStatus.increment();
            }
          };

          ft.upload(updateImage1, encodeURI(EXTRA_REQUIREMENT_API), win, fail, options);

          // Called if something bad happens.
          function onFail(message) {
            console.log('Failed because: ' + message);
          }

          function win(result) {

            console.log("Response Image = " + result.response);

            app.preloader.hide();

            var toast = app.toast.create({
              text: "Extra requirements sent to customer for approval"
            });
            toast.open();

            localStorage.removeItem("imag1");
            updateImage1 = "";

            app.views.main.router.navigate('/task-details/?orderId=' + orderId + '&backScreenType=' + backScreenType);

            /* var obj = JSON.parse(result.response);
  
            if (obj.success != undefined) {
  
              app.preloader.hide();
              alert(obj.success.message);
  
              var toast = app.toast.create({
                text: obj.success.message
              });
              toast.open();
  
              app.views.main.router.navigate('/task-details/?orderId=' + orderId + '&backScreenType=' + backScreenType); 
  
            } */

          }

          function fail(error) {
            app.preloader.hide();
            //alert("An error has occurred: Code = " + error.code);
            console.log("upload error source " + error.source);
            console.log("upload error target " + error.target);
            var toast = app.toast.create({
              text: "Extra requirements upload failed"
            });
            toast.open();
          }
        }
      }
    }
  });
});


/************ Update Requirement Api End **************/

/************* Extra image Start *************/


$$(document).on('page:init', '.page[data-name="update-image"]', function (e) {

  //Received orderID from task details
  var page = $$('.page[data-name="update-image"]')[0].f7Page;
  var orderId = page.route.query.orderId;
  var backScreenType = page.route.query.backScreenType;
  var largeImage = page.route.query.extraImage;
  var previousScreen = page.route.query.previousScreen;

  //alert(largeImage);
  //alert(previousScreen);

  //Back arrow click
  $$('#updateImageBack').on('click', function () {

    if (previousScreen == "extraRequirmentScreen") {

      mainView.router.back();

      //app.views.main.router.navigate('/update-details/?orderId=' + orderId + '&backScreenType=' + backScreenType + '&previousScreen=' + previousScreen);

    } else {
      app.views.main.router.navigate('/task-details/?orderId=' + orderId + '&backScreenType=' + backScreenType);

    }
  });

  $$('#extraImageLarge').attr('src', largeImage);

});

/************* Extra image End *************/

/************* Notification List Start *************/


$$(document).on('page:init', '.page[data-name="notification"]', function (e) {

  // get Service Boy ID stored in localStorage
  var serviceBoyID = localStorage.getItem('serviceBoyID');
  console.log(serviceBoyID);

  var allowInfinite = true;
  $$(".page").addClass("contentload");
  $$(".page").addClass("loadernone");

  var pageIndex = 1;

  var connectiontype = checkConnection();

  if (connectiontype == "No network connection") {
    message = connectiontype;
    var toast = app.toast.create({
      text: message
    });
    toast.open();
    app.preloader.hide();

  } else {

    $$('#empty-notification-screen').hide();
    $$('#notificationCardLayout').hide();
    app.preloader.show();
    loadNotification();

  }

  function loadNotification() {

    app.request.setup({
      /*  headers: {
         'api_key': "6be2f840a6a0da34f9904743800e2cae"
       }, */
      cache: false
    });

    app.request.get(NOTIFICATION_API, { staff_id: serviceBoyID, page: pageIndex }, function (data) {
      var obj = JSON.parse(data);

      if (obj.success != undefined) {

        if (obj.success.notifications != null) {

          var str = "";

          //Notification count zero
          localStorage.setItem("NotiCount", 0);

          if (obj.success.notifications.length > 0) {

            for (var x = 0; x < obj.success.notifications.length; x++) {

              var notificationId = obj.success.notifications[x].id;
              var order_id = obj.success.notifications[x].order_id;
              var staff_id = obj.success.notifications[x].staff_id;
              var notificationMessage = obj.success.notifications[x].text;
              var isRead = obj.success.notifications[x].is_read;
              var notificationDateTime = obj.success.notifications[x].created_at;

              var res = notificationDateTime.split(" ");
              var dateString = res[0];
              var timeString = res[1];

              var ddmmyy = dateString.split("-");
              var date = ddmmyy[2];
              var month = ddmmyy[1];
              var year = ddmmyy[0];

              var formattedMonth = monthFormat(month);

              var finalDate = date + " " + formattedMonth + " " + year;

              var hhmm = timeString.split(":");
              var hour = hhmm[0];
              var minute = hhmm[1];

              var formattedHour = hourFormat(hour);

              var AMPM = "";

              if (hour >= 12 && hour <= 23) {
                AMPM = "PM";
              } else {
                AMPM = "AM";
              }

              var finalTime = formattedHour + ":" + minute + " " + AMPM;

              if (isRead) {

                str += '<li>';
                str += '<a href="/task-details/?orderId=' + order_id + '&backScreenType=' + "notification" + '&notificationId=' + notificationId + '" class="item-link item-content">';
                str += '<div class="item-inner">';
                str += '<div class="row text-vertical-center hidden">';
                str += '<div class="notification-service-name-text"></div>';
                str += '<div class="notification-image"><img class="notification-image" src="images/expand.png" /></div>';
                str += '</div>';
                str += '<div class="notification-read-message-text">' + notificationMessage + '</div>';
                str += '<div class="row text-vertical-center">';
                str += '<div class="notification-read-date-time">' + finalDate + '</div>';
                str += '<div class="notification-read-date-time">' + finalTime + '</div>';
                str += '</div>';
                str += '</div>';
                str += '</a>';
                str += '</li>';

              } else {

                str += '<li>';
                str += '<a href="/task-details/?orderId=' + order_id + '&backScreenType=' + "notification" + '&notificationId=' + notificationId + '" class="item-link item-content">';
                str += '<div class="item-inner">';
                str += '<div class="row text-vertical-center hidden">';
                str += '<div class="notification-service-name-text"></div>';
                str += '<div class="notification-image"><img class="notification-image" src="images/expand.png" /></div>';
                str += '</div>';
                str += '<div class="notification-message-text">' + notificationMessage + '</div>';
                str += '<div class="row text-vertical-center">';
                str += '<div class="notification-date-time">' + finalDate + '</div>';
                str += '<div class="notification-date-time">' + finalTime + '</div>';
                str += '</div>';
                str += '</div>';
                str += '</a>';
                str += '</li>';

              }
            }

            pageIndex = pageIndex + 1;
            $$('#empty-notification-screen').hide();
            $$('#notificationCardLayout').show();
            app.preloader.hide();

          } else {

            //show the empty screen
            //$$('#notificationCardLayout').hide();
            $$('#empty-notification-screen').show();
          }

          $$(".page").addClass("loadernone");
          $$(".page").removeClass("contentload");

        }/*  else {
              alert("empty screen2");
              //show the empty screen
              $$('#empty-notification-screen').show();
              $$('#notificationCardLayout').hide();
            } */
      } else if (obj.error != undefined) {
        message = obj.error.message;
        app.preloader.hide();

        var toast = app.toast.create({
          text: message
        });
        toast.open();
      }
      $$("#my-notification").html(str);
      app.preloader.hide();
    });
  }

  /* Infinite scroll */

  // Attach 'infinite' event handler

  $$('.infinite-scroll-content').on('infinite', function () {

    var connectiontype = checkConnection();

    if (connectiontype == "No network connection") {
      message = connectiontype;
      var toast = app.toast.create({
        text: message
      });
      toast.open();
      app.preloader.hide();

    } else {

      $$(".page").removeClass("loadernone");

      $$('.infinite-scroll-preloader').show();
      var lastItemIndex = $$('#my-notification li').length;

      // Max items to load
      var maxItems = 100;

      // Exit, if loading in progress
      if (!allowInfinite) return;

      // Set loading flag
      allowInfinite = false;

      // Emulate 1s loading
      setTimeout(function () {
        // Reset loading flag
        allowInfinite = true;

        if (lastItemIndex >= maxItems) {
          // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
          app.infiniteScroll.destroy('.infinite-scroll-content');
          // Remove preloader
          $$('.infinite-scroll-preloader').hide();
          return;
        }

        app.request.get(NOTIFICATION_API, { staff_id: serviceBoyID, page: pageIndex }, function (data) {

          var obj = JSON.parse(data);

          if (obj.success != undefined) {
            if (obj.success.notifications != null) {

              var str = "";

              if (obj.success.notifications.length > 0) {
                for (var x = 0; x < obj.success.notifications.length; x++) {

                  var notificationId = obj.success.notifications[x].id;
                  var order_id = obj.success.notifications[x].order_id;
                  var staff_id = obj.success.notifications[x].staff_id;
                  var notificationMessage = obj.success.notifications[x].text;
                  var isRead = obj.success.notifications[x].is_read;
                  var notificationDateTime = obj.success.notifications[x].created_at;

                  var res = notificationDateTime.split(" ");
                  var dateString = res[0];
                  var timeString = res[1];

                  var ddmmyy = dateString.split("-");
                  var date = ddmmyy[2];
                  var month = ddmmyy[1];
                  var year = ddmmyy[0];

                  var formattedMonth = monthFormat(month);

                  var finalDate = date + " " + formattedMonth + " " + year;

                  var hhmm = timeString.split(":");
                  var hour = hhmm[0];
                  var minute = hhmm[1];

                  var formattedHour = hourFormat(hour);

                  var AMPM = "";

                  if (hour >= 12 && hour <= 23) {
                    AMPM = "PM";
                  } else {
                    AMPM = "AM";
                  }

                  var finalTime = formattedHour + ":" + minute + " " + AMPM;

                  if (isRead) {

                    str += '<li>';
                    str += '<a href="/task-details/?orderId=' + order_id + '&backScreenType=' + "notification" + '&notificationId=' + notificationId + '" class="item-link item-content">';
                    str += '<div class="item-inner">';
                    str += '<div class="row text-vertical-center hidden">';
                    str += '<div class="notification-service-name-text"></div>';
                    str += '<div class="notification-image"><img class="notification-image" src="images/expand.png" /></div>';
                    str += '</div>';
                    str += '<div class="notification-read-message-text">' + notificationMessage + '</div>';
                    str += '<div class="row text-vertical-center">';
                    str += '<div class="notification-read-date-time">' + finalDate + '</div>';
                    str += '<div class="notification-read-date-time">' + finalTime + '</div>';
                    str += '</div>';
                    str += '</div>';
                    str += '</a>';
                    str += '</li>';

                  } else {

                    str += '<li>';
                    str += '<a href="/task-details/?orderId=' + order_id + '&backScreenType=' + "notification" + '&notificationId=' + notificationId + '" class="item-link item-content">';
                    str += '<div class="item-inner">';
                    str += '<div class="row text-vertical-center hidden">';
                    str += '<div class="notification-service-name-text"></div>';
                    str += '<div class="notification-image"><img class="notification-image" src="images/expand.png" /></div>';
                    str += '</div>';
                    str += '<div class="notification-message-text">' + notificationMessage + '</div>';
                    str += '<div class="row text-vertical-center">';
                    str += '<div class="notification-date-time">' + finalDate + '</div>';
                    str += '<div class="notification-date-time">' + finalTime + '</div>';
                    str += '</div>';
                    str += '</div>';
                    str += '</a>';
                    str += '</li>';

                  }
                }

                $$('.infinite-scroll-preloader').hide();
                $$('#my-notification').append(str);
              } else {
                app.infiniteScroll.destroy('.infinite-scroll-content');
                // Remove preloader
                $$('.infinite-scroll-preloader').hide();
                pageIndex = 0;
                return;
              }
            }
          }
        });
        // Update last loaded index
        pageIndex = pageIndex + 1;
      }, 1000);
    }
  });

  /* Infinite scroll ends */

});

/************* Notification List End *************/


/*********** Completed Task Start ***************/

$$(document).on('page:init', '.page[data-name="completed-task"]', function (e) {

  // get Service Boy ID stored in localStorage
  var serviceBoyID = localStorage.getItem('serviceBoyID');
  console.log(serviceBoyID);

  if (serviceBoyID == null) {
    serviceBoyID = 0;
  }

  var page = $$('.page[data-name="completed-task"]')[0].f7Page;
  var backScreenType = page.route.query.backScreenType;

  if (backScreenType == null) {
    backScreenType = "completedTask";

  }

  sessionStorage.backScreenType = backScreenType;

  //Hide Filter button
  $$('#completedTaskFabButton').hide();

  var connectiontype = checkConnection();

  if (connectiontype == "No network connection") {
    message = connectiontype;
    var toast = app.toast.create({
      text: message
    });
    toast.open();
    app.preloader.hide();

  } else {

    var allowInfinite = true;
    $$(".page").addClass("contentload");
    $$(".page").addClass("loadernone");
    var pageIndex = 1;

    app.request.setup({
      /* headers: {
        'api_key': "6be2f840a6a0da34f9904743800e2cae"
      }, */
      cache: false
    });

    app.preloader.show();

    $$('#empty-completed-task-screen').hide();
    $$('#completed-task-layout').hide();
    $$('#completedSearchBar').hide();

    loadCompletedBookings();

    function loadCompletedBookings() {

      app.request.get(COMPLETED_TASK_API, { staff_id: serviceBoyID, page: pageIndex }, function (data) {
        var obj = JSON.parse(data);
        console.log(obj);

        if (obj.success != undefined) {

          if (obj.success.bookings != null) {
            var str = "";

            if (obj.success.bookings.length > 0) {

              for (var x = 0; x < obj.success.bookings.length; x++) {

                var dateTime = obj.success.bookings[x].date_time;
                var orderID = obj.success.bookings[x].order_id;
                var status = obj.success.bookings[x].status;
                var service_name = obj.success.bookings[x].service_name;
                var service_image = obj.success.bookings[x].service_image;

                var res = dateTime.split(" ");
                var dateString = res[0];
                var timeString = res[1];

                var ddmmyy = dateString.split("-");
                var date = ddmmyy[2];
                var month = ddmmyy[1];
                var year = ddmmyy[0];

                var formattedMonth = monthFormat(month);
                var finalDate = date + " " + formattedMonth + " " + year;
                var hhmm = timeString.split(":");
                var hour = hhmm[0];
                var minute = hhmm[1];

                var formattedHour = hourFormat(hour);

                var AMPM = "";

                if (hour >= 12 && hour <= 23) {
                  AMPM = "PM";
                } else {
                  AMPM = "AM";
                }

                var finalTime = formattedHour + ":" + minute + " " + AMPM;

                console.log(finalDate);
                console.log(finalTime);

                str += '<li>';
                str += '<a href="/task-details/?orderId=' + orderID + '&backScreenType=' + backScreenType + '" class="item-link item-content">';
                str += '<div class="item-media"><img src= "' + service_image + '"  width="65" /></div>';
                str += '<div class="item-inner">';
                str += '<div class="item-title-row">';
                str += '<div class="item-order-number">Booking ID - ' + "#" + orderID + '</div>';

                if (status == "A".toUpperCase()) {
                  str += '<div class="item-after orange-background">' + "Active" + '</div>';
                } else if (status == "C".toUpperCase()) {
                  str += '<div class="item-after blue-background">' + "Assigned" + '</div>';
                } else if (status == "R".toUpperCase()) {
                  str += '<div class="item-after red-background"">' + "Rejected" + '</div>';
                } else if (status == "CC".toUpperCase()) {
                  str += '<div class="item-after red-background">' + "Cancelled" + '</div>';
                } else if (status == "CS".toUpperCase()) {
                  str += '<div class="item-after red-background">' + "Cancelled" + '</div>';
                } else if (status == "CO".toUpperCase()) {
                  str += '<div class="item-after green-background">' + "Completed" + '</div>';
                } else {
                  str += '<div class="item-after">' + status + '</div>';
                }
                str += '</div>';
                str += '<div class="booking-service-name">' + service_name + '</div>';
                str += '<div class="item-title-row my-booking-date-otp-layout">';
                str += '<div class="item-date">' + finalDate + " " + finalTime + '</div>';
                str += '<div class="item-otp hidden">4785</div>';
                str += '</div>';
                str += '</div>';
                str += '</a>';
                str += '</li>';

              }
              pageIndex = pageIndex + 1;
              app.preloader.hide();
              $$('#empty-completed-task-screen').hide();
              $$('#completed-task-layout').show();
              $$('#completedSearchBar').show();

            } else {

              app.preloader.hide();
              $$('#empty-completed-task-screen').show();
              $$('#completed-task-layout').hide();
              $$('#completedSearchBar').hide();
            }

            $$(".page").addClass("loadernone");
            $$(".page").removeClass("contentload");
          }

        } if (obj.error != undefined) {

          message = obj.error.message;
          app.preloader.hide();

          var toast = app.toast.create({
            text: message
          });
          toast.open();
        }
        $$("#completed-task-list").html(str);
        app.preloader.hide();
        console.log(obj);
      });
    }

    /* Infinite scroll */

    // Attach 'infinite' event handler

    $$('.infinite-scroll-content').on('infinite', function () {

      var connectiontype = checkConnection();

      if (connectiontype == "No network connection") {

        message = connectiontype;
        var toast = app.toast.create({
          text: message
        });
        toast.open();
        app.preloader.hide();

      } else {

        $$(".page").removeClass("loadernone");

        $$('.infinite-scroll-preloader').show();
        var lastItemIndex = $$('#completed-task-list li').length;

        // Max items to load
        var maxItems = 100;

        // Exit, if loading in progress
        if (!allowInfinite) return;

        // Set loading flag
        allowInfinite = false;

        // Emulate 1s loading
        setTimeout(function () {
          // Reset loading flag
          allowInfinite = true;

          if (lastItemIndex >= maxItems) {
            // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
            app.infiniteScroll.destroy('.infinite-scroll-content');
            // Remove preloader
            $$('.infinite-scroll-preloader').hide();
            return;
          }

          app.request.get(COMPLETED_TASK_API, { staff_id: serviceBoyID, page: pageIndex }, function (data) {

            var obj = JSON.parse(data);

            if (obj.success != undefined) {

              if (obj.success.bookings != null) {

                var str = "";

                if (obj.success.bookings.length > 0) {
                  for (var x = 0; x < obj.success.bookings.length; x++) {

                    var dateTime = obj.success.bookings[x].date_time;
                    var orderID = obj.success.bookings[x].order_id;
                    var status = obj.success.bookings[x].status;
                    var service_name = obj.success.bookings[x].service_name;
                    var service_image = obj.success.bookings[x].service_image;

                    var res = dateTime.split(" ");
                    var dateString = res[0];
                    var timeString = res[1];

                    var ddmmyy = dateString.split("-");
                    var date = ddmmyy[2];
                    var month = ddmmyy[1];
                    var year = ddmmyy[0];

                    var formattedMonth = monthFormat(month);
                    var finalDate = date + " " + formattedMonth + " " + year;
                    var hhmm = timeString.split(":");
                    var hour = hhmm[0];
                    var minute = hhmm[1];

                    var formattedHour = hourFormat(hour);

                    var AMPM = "";

                    if (hour >= 12 && hour <= 23) {
                      AMPM = "PM";
                    } else {
                      AMPM = "AM";
                    }

                    var finalTime = formattedHour + ":" + minute + " " + AMPM;

                    console.log(finalDate);
                    console.log(finalTime);

                    str += '<li>';
                    str += '<a href="/task-details/?orderId=' + orderID + '&backScreenType=' + backScreenType + '" class="item-link item-content">';
                    str += '<div class="item-media"><img src= "' + service_image + '"  width="65" /></div>';
                    str += '<div class="item-inner">';
                    str += '<div class="item-title-row">';
                    str += '<div class="item-order-number">Booking ID - ' + "#" + orderID + '</div>';

                    if (status == "A".toUpperCase()) {
                      str += '<div class="item-after orange-background">' + "Active" + '</div>';
                    } else if (status == "C".toUpperCase()) {
                      str += '<div class="item-after blue-background">' + "Assigned" + '</div>';
                    } else if (status == "R".toUpperCase()) {
                      str += '<div class="item-after red-background"">' + "Rejected" + '</div>';
                    } else if (status == "CC".toUpperCase()) {
                      str += '<div class="item-after red-background">' + "Cancelled" + '</div>';
                    } else if (status == "CS".toUpperCase()) {
                      str += '<div class="item-after red-background">' + "Cancelled" + '</div>';
                    } else if (status == "CO".toUpperCase()) {
                      str += '<div class="item-after green-background">' + "Completed" + '</div>';
                    } else {
                      str += '<div class="item-after">' + status + '</div>';
                    }
                    str += '</div>';
                    str += '<div class="booking-service-name">' + service_name + '</div>';
                    str += '<div class="item-title-row my-booking-date-otp-layout">';
                    str += '<div class="item-date">' + finalDate + " " + finalTime + '</div>';
                    str += '<div class="item-otp hidden">4785</div>';
                    str += '</div>';
                    str += '</div>';
                    str += '</a>';
                    str += '</li>';

                  }

                  $$('.infinite-scroll-preloader').hide();
                  $$('#completed-task-list').append(str);
                } else {
                  app.infiniteScroll.destroy('.infinite-scroll-content');
                  // Remove preloader
                  $$('.infinite-scroll-preloader').hide();
                  pageIndex = 0;
                  return;
                }
              }
            }
          });
          // Update last loaded index
          pageIndex = pageIndex + 1;
        }, 1000);
      }
    });

    /* Infinite scroll ends */
  }

  //Completed Task back Button
  $$('#completedTaskBackButton').on('click', function () {

    if (backScreenType == "profileCompletedTask") {
      app.views.main.router.navigate('/profile/');

    } else {
      app.views.main.router.navigate('/dashboard/');

    }
  });
});

/*********** Completed Task End ***************/


/*********** Assigned Task Start ***************/

$$(document).on('page:init', '.page[data-name="assigned-task"]', function (e) {


  // get Service Boy ID stored in localStorage
  var serviceBoyID = localStorage.getItem('serviceBoyID');

  if (serviceBoyID == null) {
    serviceBoyID = 0;
  }

  var page = $$('.page[data-name="assigned-task"]')[0].f7Page;
  var backScreenType = page.route.query.backScreenType;

  if (backScreenType == null) {
    backScreenType = "assignedTask";

  }

  sessionStorage.backScreenType = backScreenType;

  //Hide Filter button
  $$('#assignedTaskFabButton').hide();

  var connectiontype = checkConnection();

  if (connectiontype == "No network connection") {
    message = connectiontype;
    var toast = app.toast.create({
      text: message
    });
    toast.open();
    app.preloader.hide();

  } else {

    var allowInfinite = true;
    $$(".page").addClass("contentload");
    $$(".page").addClass("loadernone");
    var pageIndex = 1;

    app.request.setup({
      /* headers: {
        'api_key': "6be2f840a6a0da34f9904743800e2cae"
      }, */
      cache: false
    });

    app.preloader.show();
    $$('#empty-assigned-task-screen').hide();
    $$('#assigned-task-layout').hide();
    $$('#assisgnedSearchbar').hide();

    loadAssignedBookings();

    function loadAssignedBookings() {

      app.request.get(ASSIGNED_TASK_API, { staff_id: serviceBoyID, page: pageIndex }, function (data) {
        var obj = JSON.parse(data);

        if (obj.success != undefined) {

          if (obj.success.bookings != null) {

            var str = "";

            if (obj.success.bookings.length > 0) {

              for (var x = 0; x < obj.success.bookings.length; x++) {

                var dateTime = obj.success.bookings[x].date_time;
                var orderID = obj.success.bookings[x].order_id;
                var status = obj.success.bookings[x].status;
                var service_name = obj.success.bookings[x].service_name;
                var service_image = obj.success.bookings[x].service_image;

                var res = dateTime.split(" ");
                var dateString = res[0];
                var timeString = res[1];

                var ddmmyy = dateString.split("-");
                var date = ddmmyy[2];
                var month = ddmmyy[1];
                var year = ddmmyy[0];

                var formattedMonth = monthFormat(month);
                var finalDate = date + " " + formattedMonth + " " + year;
                var hhmm = timeString.split(":");
                var hour = hhmm[0];
                var minute = hhmm[1];

                var formattedHour = hourFormat(hour);

                var AMPM = "";

                if (hour >= 12 && hour <= 23) {
                  AMPM = "PM";
                } else {
                  AMPM = "AM";
                }

                var finalTime = formattedHour + ":" + minute + " " + AMPM;

                str += '<li>';
                str += '<a href="/task-details/?orderId=' + orderID + '&backScreenType=' + backScreenType + '" class="item-link item-content">';
                str += '<div class="item-media"><img src= "' + service_image + '"  width="65" /></div>';
                str += '<div class="item-inner">';
                str += '<div class="item-title-row">';
                str += '<div class="item-order-number">Booking ID - ' + "#" + orderID + '</div>';

                if (status == "A".toUpperCase()) {
                  str += '<div class="item-after orange-background">' + "Active" + '</div>';
                } else if (status == "C".toUpperCase()) {
                  str += '<div class="item-after blue-background">' + "Assigned" + '</div>';
                } else if (status == "R".toUpperCase()) {
                  str += '<div class="item-after red-background"">' + "Rejected" + '</div>';
                } else if (status == "CC".toUpperCase()) {
                  str += '<div class="item-after red-background">' + "Cancelled" + '</div>';
                } else if (status == "CS".toUpperCase()) {
                  str += '<div class="item-after red-background">' + "Cancelled" + '</div>';
                } else if (status == "CO".toUpperCase()) {
                  str += '<div class="item-after green-background">' + "Completed" + '</div>';
                } else {
                  str += '<div class="item-after">' + status + '</div>';
                }
                str += '</div>';
                str += '<div class="booking-service-name">' + service_name + '</div>';
                str += '<div class="item-title-row my-booking-date-otp-layout">';
                str += '<div class="item-date">' + finalDate + " " + finalTime + '</div>';
                str += '<div class="item-otp hidden">4785</div>';
                str += '</div>';
                str += '</div>';
                str += '</a>';
                str += '</li>';

              }
              pageIndex = pageIndex + 1;
              app.preloader.hide();
              $$('#empty-assigned-task-screen').hide();
              $$('#assigned-task-layout').show();
              $$('#assisgnedSearchbar').show();

            } else {

              app.preloader.hide();
              $$('#empty-assigned-task-screen').show();
              $$('#assigned-task-layout').hide();
              $$('#assisgnedSearchbar').hide();

            }
            $$(".page").addClass("loadernone");
            $$(".page").removeClass("contentload");

          }

        } if (obj.error != undefined) {

          message = obj.error.message;

          var toast = app.toast.create({
            text: message
          });
          toast.open();
        }
        $$("#assigned-task-list").html(str);
        app.preloader.hide();
        console.log(obj);
      });
    }

    /* Infinite scroll */

    // Attach 'infinite' event handler

    $$('.infinite-scroll-content').on('infinite', function () {

      var connectiontype = checkConnection();

      if (connectiontype == "No network connection") {

        message = connectiontype;
        var toast = app.toast.create({
          text: message
        });
        toast.open();
        app.preloader.hide();

      } else {

        $$(".page").removeClass("loadernone");

        $$('.infinite-scroll-preloader').show();
        var lastItemIndex = $$('#assigned-task-list li').length;

        // Max items to load
        var maxItems = 100;

        // Exit, if loading in progress
        if (!allowInfinite) return;

        // Set loading flag
        allowInfinite = false;

        // Emulate 1s loading
        setTimeout(function () {
          // Reset loading flag
          allowInfinite = true;

          if (lastItemIndex >= maxItems) {
            // Nothing more to load, detach infinite scroll events to prevent unnecessary loadings
            app.infiniteScroll.destroy('.infinite-scroll-content');
            // Remove preloader
            $$('.infinite-scroll-preloader').hide();
            return;
          }

          app.request.get(ASSIGNED_TASK_API, { staff_id: serviceBoyID, page: pageIndex }, function (data) {

            var obj = JSON.parse(data);

            if (obj.success != undefined) {

              if (obj.success.bookings != null) {

                var str = "";

                if (obj.success.bookings.length > 0) {

                  for (var x = 0; x < obj.success.bookings.length; x++) {

                    var dateTime = obj.success.bookings[x].date_time;
                    var orderID = obj.success.bookings[x].order_id;
                    var status = obj.success.bookings[x].status;
                    var service_name = obj.success.bookings[x].service_name;
                    var service_image = obj.success.bookings[x].service_image;

                    var res = dateTime.split(" ");
                    var dateString = res[0];
                    var timeString = res[1];

                    var ddmmyy = dateString.split("-");
                    var date = ddmmyy[2];
                    var month = ddmmyy[1];
                    var year = ddmmyy[0];

                    var formattedMonth = monthFormat(month);
                    var finalDate = date + " " + formattedMonth + " " + year;
                    var hhmm = timeString.split(":");
                    var hour = hhmm[0];
                    var minute = hhmm[1];

                    var formattedHour = hourFormat(hour);

                    var AMPM = "";

                    if (hour >= 12 && hour <= 23) {
                      AMPM = "PM";
                    } else {
                      AMPM = "AM";
                    }

                    var finalTime = formattedHour + ":" + minute + " " + AMPM;

                    str += '<li>';
                    str += '<a href="/task-details/?orderId=' + orderID + '&backScreenType=' + backScreenType + '" class="item-link item-content">';
                    str += '<div class="item-media"><img src= "' + service_image + '"  width="65" /></div>';
                    str += '<div class="item-inner">';
                    str += '<div class="item-title-row">';
                    str += '<div class="item-order-number">Booking ID - ' + "#" + orderID + '</div>';

                    if (status == "A".toUpperCase()) {
                      str += '<div class="item-after orange-background">' + "Active" + '</div>';
                    } else if (status == "C".toUpperCase()) {
                      str += '<div class="item-after blue-background">' + "Assigned" + '</div>';
                    } else if (status == "R".toUpperCase()) {
                      str += '<div class="item-after red-background"">' + "Rejected" + '</div>';
                    } else if (status == "CC".toUpperCase()) {
                      str += '<div class="item-after red-background">' + "Cancelled" + '</div>';
                    } else if (status == "CS".toUpperCase()) {
                      str += '<div class="item-after red-background">' + "Cancelled" + '</div>';
                    } else if (status == "CO".toUpperCase()) {
                      str += '<div class="item-after green-background">' + "Completed" + '</div>';
                    } else {
                      str += '<div class="item-after">' + status + '</div>';
                    }
                    str += '</div>';
                    str += '<div class="booking-service-name">' + service_name + '</div>';
                    str += '<div class="item-title-row my-booking-date-otp-layout">';
                    str += '<div class="item-date">' + finalDate + " " + finalTime + '</div>';
                    str += '<div class="item-otp hidden">4785</div>';
                    str += '</div>';
                    str += '</div>';
                    str += '</a>';
                    str += '</li>';

                  }

                  $$('.infinite-scroll-preloader').hide();
                  $$('#assigned-task-list').append(str);
                } else {
                  app.infiniteScroll.destroy('.infinite-scroll-content');
                  // Remove preloader
                  $$('.infinite-scroll-preloader').hide();
                  pageIndex = 0;
                  return;
                }
              }
            }
          });
          // Update last loaded index
          pageIndex = pageIndex + 1;
        }, 1000);
      }
    });

    /* Infinite scroll ends */

  }

  //Assigned Task Button
  $$('#assignedTaskBackButton').on('click', function () {

    if (backScreenType == "profileAssignedTask") {
      app.views.main.router.navigate('/profile/');

    } else {
      app.views.main.router.navigate('/dashboard/');
    }
  });
});

/*********** Assigned Task End ***************/

/*********** My Account Screen Start ***************/

$$(document).on('page:init', '.page[data-name="profile"]', function (e) {

  // get Service Boy ID stored in localStorage
  var serviceBoyID = localStorage.getItem('serviceBoyID');

  if (serviceBoyID == null) {
    serviceBoyID = 0;
  }

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
    $$('#profileCardLayout').hide();
    loadProfileData();
  }

  function loadProfileData() {

    app.request.get(PROFILE_API, { staff_id: serviceBoyID }, function (data) {

      var obj = JSON.parse(data);

      if (obj.success != undefined) {

        if (obj.success.customer_details != undefined) {

          var staffName = obj.success.customer_details.name;
          var staffEmail = obj.success.customer_details.email;
          var staffmobile = obj.success.customer_details.mobile;

          $$('#staffName').text(staffName);
          $$('#staffNumber').text("+91" + " " + staffmobile);

        }

        app.preloader.hide();
        $$('#profileCardLayout').show();

      } if (obj.error != undefined) {
        message = obj.error.message;
        console.log("Error " + message);
        app.preloader.hide();

        var toast = app.toast.create({
          text: message
        });
        toast.open();
      }
    });
  }

  //Assigned Task Button
  $$('#profileAssignedButton').on('click', function () {

    // Load timeslots based on the date selection
    var connectiontype = checkConnection();

    if (connectiontype == "No network connection") {

      message = connectiontype;
      var toast = app.toast.create({
        text: message
      });
      toast.open();
      app.preloader.hide();

    } else {
      app.views.main.router.navigate('/assigned-task/?backScreenType=' + "profileAssignedTask");
    }
  });

  //Completed Task Button
  $$('#profileCompletedButton').on('click', function () {

    // Load timeslots based on the date selection
    var connectiontype = checkConnection();

    if (connectiontype == "No network connection") {

      message = connectiontype;
      var toast = app.toast.create({
        text: message
      });
      toast.open();
      app.preloader.hide();

    } else {
      app.views.main.router.navigate('/completed-task/?backScreenType=' + "profileCompletedTask");
    }
  });

  //All Task Button
  $$('#profileAllTaskButton').on('click', function () {

    // Load timeslots based on the date selection
    var connectiontype = checkConnection();

    if (connectiontype == "No network connection") {

      message = connectiontype;
      var toast = app.toast.create({
        text: message
      });
      toast.open();
      app.preloader.hide();
    } else {
      app.views.main.router.navigate('/all-task/?backScreenType=' + "profileAllTask");
    }
  });

  $$('#profileLogoutButton').on('click', function () {

    sessionStorage.logoutDialogOpen = "true";

    var title = "Logout";

    app.dialog.confirm('Do you really want to logout?', title, function () {

      sessionStorage.logoutDialogOpen = "false";

      if (typeof (Storage) !== "undefined") {

        localStorage.setItem("isLogin", 'false');
        localStorage.removeItem("serviceBoyID");

        var toast = app.toast.create({
          text: "You have been logged out successfully."
        });
        toast.open();

        app.views.main.router.navigate('/login/');

      }
    },
      function () {
        sessionStorage.logoutDialogOpen = "false";
      });
  });
});

/*********** My Account Screen End ***************/


/*********** No Internet Screen Start ***************/

$$(document).on('page:init', '.page[data-name="no-internet-connection"]', function (e) {

  var page = $$('.page[data-name="no-internet-connection"]')[0].f7Page;
  var pageToNoInternetScreen = page.route.query.pageToNoInternetScreen;
  var orderID = page.route.query.orderId;
  var backScreenType = page.route.query.backScreenType;

  $$('#retryButton').on('click', function () {

    var connectiontype = checkConnection();

    if (connectiontype == "No network connection") {

      message = connectiontype;
      var toast = app.toast.create({
        text: message
      });
      toast.open();
      app.preloader.hide();

    } else {

      if (pageToNoInternetScreen == "dashboard") {

        app.views.main.router.navigate('/dashboard/');

      } else if (pageToNoInternetScreen == "assigned-task") {

        app.views.main.router.navigate('/assigned-task/?backScreenType=' + backScreenType);

      } else if (pageToNoInternetScreen == "all-task") {

        app.views.main.router.navigate('/all-task/?backScreenType=' + backScreenType);

      } else if (pageToNoInternetScreen == "completed-task") {

        app.views.main.router.navigate('/completed-task/?backScreenType=' + backScreenType);

      } else if (pageToNoInternetScreen == "task-details") {

        app.views.main.router.navigate('/task-details/?backScreenType=' + backScreenType + '&orderId=' + orderID);

      } else if (pageToNoInternetScreen == "update-details") {

        app.views.main.router.navigate('/update-details/?backScreenType=' + backScreenType + '&orderId=' + orderID);

      } else if (pageToNoInternetScreen == "profile") {

        app.views.main.router.navigate('/profile/');

      } else if (pagename == "notification") {

        app.views.main.router.navigate('/notification/');

      }
    }
  });

});

/*********** No Internet Screen End ***************/


function monthFormat(month) {
  var monthValue = "";

  if (month == 01) {
    monthValue = "JAN";
  } else if (month == "02") {
    monthValue = "FEB";
  } else if (month == "03") {
    monthValue = "MAR";
  } else if (month == "04") {
    monthValue = "APR";
  } else if (month == "05") {
    monthValue = "MAY";
  } else if (month == "06") {
    monthValue = "JUN";
  } else if (month == "07") {
    monthValue = "JUL";
  } else if (month == "08") {
    monthValue = "AUG";
  } else if (month == "09") {
    monthValue = "SEP";
  } else if (month == "10") {
    monthValue = "OCT";
  } else if (month == "11") {
    monthValue = "NOV";
  } else if (month == "12") {
    monthvalue = "DEC";
  } else
    monthValue = "";
  return monthValue;
}

function hourFormat(hour) {
  var hourValue = "";

  if (hour == 13) {
    hourValue = "01";
  } else if (hour == "14") {
    hourValue = "02";
  } else if (hour == "15") {
    hourValue = "03";
  } else if (hour == "16") {
    hourValue = "04";
  } else if (hour == "17") {
    hourValue = "05";
  } else if (hour == "18") {
    hourValue = "06";
  } else if (hour == "19") {
    hourValue = "07";
  } else if (hour == "20") {
    hourValue = "08";
  } else if (hour == "21") {
    hourValue = "09";
  } else if (hour == "22") {
    hourValue = "10";
  } else if (hour == "23") {
    hourValue = "11";
  } else
    hourValue = hour;
  return hourValue;
}

/* Home page service list load */

function loadHomeServiceList() {

  // get Service Boy ID stored in localStorage
  var serviceBoyID = localStorage.getItem('serviceBoyID');
  console.log(serviceBoyID);

  app.request.setup({
    /*  headers: {
       'api_key': "6be2f840a6a0da34f9904743800e2cae"
     }, */
    cache: false
  });
  app.preloader.show();

  app.request.get(HOME_API, { staff_id: serviceBoyID }, function (data) {

    var obj = JSON.parse(data);

    if (obj.success != undefined) {

      if (obj.success.dashboard != null) {

        //Staf details
        if (obj.success.dashboard.staff_dtls != null) {
          var serviceBoyName = obj.success.dashboard.staff_dtls.name;
          $$('#dashboardServiceBoyName').text(serviceBoyName);
        }

        if (obj.success.dashboard.stats != null) {

          var total_tasks = obj.success.dashboard.stats.total;
          var assigned_tasks = obj.success.dashboard.stats.assigned;
          var completed_tasks = obj.success.dashboard.stats.completed;

          // Assign the values 
          $$('#total_count').text(total_tasks);
          $$('#assigned_count').text(assigned_tasks);
          $$('#completed_count').text(completed_tasks);
        }

        var str = "";

        if (obj.success.dashboard.bookings != null) {

          if (obj.success.dashboard.bookings.length > 0) {

            for (var x = 0; x < obj.success.dashboard.bookings.length; x++) {

              var id = obj.success.dashboard.bookings[x].id;
              var orderID = obj.success.dashboard.bookings[x].order_id;
              var status = obj.success.dashboard.bookings[x].status;
              var serviceName = obj.success.dashboard.bookings[x].service_name;
              var serviceImage = obj.success.dashboard.bookings[x].service_image;
              var serviceDateTime = obj.success.dashboard.bookings[x].date_time;

              var res = serviceDateTime.split(" ");
              var dateString = res[0];
              var timeString = res[1];

              var ddmmyy = dateString.split("-");
              var date = ddmmyy[2];
              var month = ddmmyy[1];
              var year = ddmmyy[0];

              var formattedMonth = monthFormat(month);
              var finalDate = date + " " + formattedMonth + " " + year;

              var hhmm = timeString.split(":");
              var hour = hhmm[0];
              var minute = hhmm[1];

              var formattedHour = hourFormat(hour);

              var AMPM = "";

              if (hour >= 12 && hour <= 23) {
                AMPM = "PM";
              } else {
                AMPM = "AM";
              }

              var finalTime = formattedHour + ":" + minute + " " + AMPM;

              str += '<li>';
              str += '<a href="/task-details/?orderId=' + orderID + '&backScreenType=' + "dashboardTask" + '" class="item-link item-content">';
              str += '<div class="item-media"><img src="' + serviceImage + '" width="70" /></div>';
              str += '<div class="item-inner">';
              str += '<div class="item-title-row">';
              str += '<div class="item-order-number">Booking ID - ' + "#" + orderID + '</div>';

              if (status == "A".toUpperCase()) {
                str += '<div class="item-after orange-background">' + "Active" + '</div>';
              } else if (status == "C".toUpperCase()) {
                str += '<div class="item-after blue-background">' + "Assigned" + '</div>';
              } else if (status == "R".toUpperCase()) {
                str += '<div class="item-after red-background"">' + "Rejected" + '</div>';
              } else if (status == "CC".toUpperCase()) {
                str += '<div class="item-after red-background">' + "Cancelled" + '</div>';
              } else if (status == "CS".toUpperCase()) {
                str += '<div class="item-after red-background">' + "Cancelled" + '</div>';
              } else if (status == "CO".toUpperCase()) {
                str += '<div class="item-after green-background">' + "Completed" + '</div>';
              } else {
                str += '<div class="item-after">' + status + '</div>';
              }
              str += '</div>';
              str += '<div class="booking-service-name">' + serviceName + '</div>';
              str += '<div class="item-title-row my-booking-date-otp-layout">';
              str += '<div class="item-date">Scheduled On - ' + finalDate + " " + finalTime + '</div>';
              str += '</div>';
              str += '</div>';
              str += '</a>';
              str += '</li>';
            }
          }
          $$('#taskDashboard').show();
          $$('#empty-dashboard-task-screen').hide();
          app.preloader.hide();

        } else {

          $$('#taskDashboard').hide();
          $$('#empty-dashboard-task-screen').show();

        }
      }
    } else if (obj.error != undefined) {
      message = obj.error.message;
      app.preloader.hide();

      var toast = app.toast.create({
        text: message
      });
      toast.open();
    }
    $$("#home-booking-list-data").html(str);
    app.preloader.hide();
  });

}

/* Home page service list load ends */

/******* Task Details API Start ********/

//Task Details API Data
function loadTaskDetails(orderId) {

  app.preloader.show();

  sessionStorage.orderID = orderId;

  var orderID = orderId;

  // get Service Boy ID stored in localStorage
  var serviceBoyID = localStorage.getItem('serviceBoyID');

  app.request.setup({
    /*  headers: {
       'api_key': "6be2f840a6a0da34f9904743800e2cae"
     }, */
    cache: false
  });

  //hide the booking details screen
  $$('#contain-layout-task-details').hide();

  app.request.get(TASK_DETAILS_API, {
    order_id: orderID, staff_id: serviceBoyID
  }, function (data) {

    var obj = JSON.parse(data);

    if (obj.success != undefined) {

      if (obj.success.booking_details != null) {

        debugger

        //Order
        var id = obj.success.booking_details.order_details.id;
        var OrderID = obj.success.booking_details.order_details.order_id;
        var bookingOn = obj.success.booking_details.order_details.order_date;
        var scheduleDateTime = obj.success.booking_details.order_details.booking_datetime;
        var serviceTitle = obj.success.booking_details.order_details.service_title;
        var bookingStatus = obj.success.booking_details.order_details.booking_status;

        sessionStorage.bookedServiceName = obj.success.booking_details.order_details.service_title;

        //ScheduleDateTime Split
        var res = scheduleDateTime.split(" ");
        var dateString = res[0];
        var timeString = res[1];

        //Date split
        var schedule_ddmmyy = dateString.split("-");
        var schedule_date = schedule_ddmmyy[2];
        var schedule_month = schedule_ddmmyy[1];
        var schedule_year = schedule_ddmmyy[0];

        var schedule_formattedMonth = monthFormat(schedule_month);
        var scheduleDate = schedule_date + " " + schedule_formattedMonth + " " + schedule_year;

        //Time split
        var hhmm = timeString.split(":");
        var hour = hhmm[0];
        var minute = hhmm[1];

        var formattedHour = hourFormat(hour);

        var AMPM = "";

        if (hour >= 12 && hour <= 23) {
          AMPM = "PM";
        } else {
          AMPM = "AM";
        }

        var scheduleTime = formattedHour + ":" + minute + " " + AMPM;

        $$('#taskBookingID').text("#" + OrderID);
        $$('#serviceType').text(serviceTitle);
        $$('#taskScheduleDate').text(scheduleDate);
        $$('#taskScheduleTime').text(scheduleTime);

        //Check status
        if (bookingStatus == "A") {

          $$('#taskStatus').text("Active");
          $$('#taskStatusColor').addClass("orange");

        } else if (bookingStatus == "CO") {

          $$('#taskStatus').text("Completed");
          $$('#taskStatusColor').addClass("green");

        } else if (bookingStatus == "C") {

          $$('#taskStatus').text("Assigned");
          $$('#taskStatusColor').addClass("blue");

        } else if (bookingStatus == "R") {

          $$('#taskStatus').text("Rejected");
          $$('#taskStatusColor').addClass("red");

        } else if (bookingStatus == "CS") {

          $$('#taskStatus').text("Cancelled");
          $$('#taskStatusColor').addClass("red");
        }

        //Hide the cancel button
        if (bookingStatus == "CS" || bookingStatus == "R") {

          $$('#serviceStartLayout').hide();
          $$('#taskStatusColor').addClass("red");
        }

        //Sub Service
        if (obj.success.booking_details.sub_services != null) {

          if (obj.success.booking_details.sub_services.length > 0) {

            var str = "";
            var subServiceName = '';
            for (var x = 0; x < obj.success.booking_details.sub_services.length; x++) {
              var subServiveId = obj.success.booking_details.sub_services[x].sub_service_id;
              //subServiveName = obj.success.booking_details.sub_services[x].sub_service_title;

              if (x == 0) {
                subServiceName = subServiceName + obj.success.booking_details.sub_services[x].sub_service_title;
              } else {

                subServiceName = subServiceName + ", " + obj.success.booking_details.sub_services[x].sub_service_title;
              }
            }

            str += '<span>' + subServiceName + '</span>';
            $$("#service-sub-list-data").html(str);
          }
        }

        //Customer details
        if (obj.success.booking_details.customer_details != "") {

          var customerName = obj.success.booking_details.customer_details.customer_name;
          var customerEmail = obj.success.booking_details.customer_details.email;
          var customerPhone = obj.success.booking_details.customer_details.phone;
          var customerZip = obj.success.booking_details.customer_details.zip;
          var customerAddress = obj.success.booking_details.customer_details.address;
          var customerState = obj.success.booking_details.customer_details.state;
          var customerCity = obj.success.booking_details.customer_details.city;

          //split +91
          var res = customerPhone.split("+91");
          var mobile_no = res[1];
          customerNumber = mobile_no;
          sessionStorage.customerNumber = mobile_no;

          $$('#customerName').text(customerName);
          $$('#customerEmail').text(customerEmail);
          $$('#customerPhone').text(mobile_no);
          $$('#customerAddress').text(customerAddress + ", " + customerCity + "-" + customerZip + ", " + customerState);

        } else {
          $$('#customers-layout').hide();
        }

        //Status
        var task_started = obj.success.booking_details.task_stats.task_started;
        var task_update_requested = obj.success.booking_details.task_stats.task_update_requested;
        var task_update_accepted = obj.success.booking_details.task_stats.task_update_accepted;
        var task_end_requested = obj.success.booking_details.task_stats.task_end_requested;
        var task_end_accepted = obj.success.booking_details.task_stats.task_end_accepted;
        var payment_received = obj.success.booking_details.task_stats.payment_received;
        var customer_paid = obj.success.booking_details.task_stats.customer_paid;

        if (task_started) {

          $$('#serviceEndLayout').show();
          $$('#serviceStartLayout').hide();
          $$('#service-requirement-layout').show();
          //$$("#serviceStatrEndButton").text("End");
          //$$('#serviceCancelButton').hide();
          //isEndTask = "true";
          //sessionStorage.isEndTask.removeItem;
          //sessionStorage.isEndTask = "true";

        } else {

          /* Requirement section hide because data is not available in API */
          //Service Requirement Details
          $$('#serviceEndLayout').hide();
          $$('#serviceStartLayout').show();
          $$('#service-requirement-layout').hide();
          $$('#generateBillLayout').hide();
          //$$("#serviceStatrEndButton").text("Start");
          //$$('#serviceCancelButton').show();
          //sessionStorage.isEndTask = "false";
        }

        if (task_update_requested || task_end_requested) {

          //Extar updated button hide
          $$('#updateRequirementButton').hide();
          //$$('#serviceEndLayout').hide();
          //$$('#serviceStartLayout').hide();
          $$('#imageLayout').hide();

          if (task_update_requested) {

          } else {
            $$('#service-requirement-layout').hide();
          }

        } else {

          //Extar updated button show
          $$('#updateRequirementButton').show();
        }
        if (task_end_requested) {
          //End button hide
          $$('#serviceStartLayout').hide();
          $$('#serviceEndLayout').hide();

        } else {

          //Hide the cancel button
          if (bookingStatus == "CS" || bookingStatus == "R") {

            $$('#serviceStartLayout').hide();
            $$('#serviceEndLayout').hide();
            $$('#taskStatusColor').addClass("red");

          } else {
            //Start button show
            $$('#serviceStartLayout').show();
          }
        }

        if (task_end_accepted) {
          //Payment Layout Hide
          $$('#payment-layout').show();

          if (!payment_received) {

            $$('#paymentTypeLayout').hide();
            $$('#serviceCostLayout').hide();
            $$('#taxLayout').hide();
            $$('#discountLayout').hide();
            $$('#totalAmountLayout').hide();

          } else {

            $$('#paymentTypeLayout').show();
            $$('#serviceCostLayout').show();
            $$('#taxLayout').hide();
            $$('#discountLayout').show();
            $$('#totalAmountLayout').show();
          }
        } else {
          //Payment Layout Hide
          $$('#payment-layout').hide();
        }
        //Extra Requirement
        if (obj.success.booking_details.extra_requirements != "") {
          var extraRequirementData = obj.success.booking_details.extra_requirements.requirements;
          $$('#extraRequirement').text(extraRequirementData);
        }

        //Extra Requirement Image
        var arrayImageLength = obj.success.booking_details.extra_images.length;

        if (arrayImageLength != 0) {

          if (obj.success.booking_details.extra_images != null) {

            var str2 = "";

            if (obj.success.booking_details.extra_images.length > 0) {

              for (var x = 0; x < obj.success.booking_details.extra_images.length; x++) {

                var extraRequirmentimage = obj.success.booking_details.extra_images[x].image;

                str2 += '<li style="display:inline;">';
                //str2 += '<a href="#">';
                str2 += '<a href="/update-image/?orderId=' + OrderID + '&backScreenType=' + sessionStorage.backScreenType + '&extraImage=' + extraRequirmentimage + '&previousScreen=' + "taskDetailsScreen" + '">';
                str2 += '<img src="' + extraRequirmentimage + '"style="width: 40px; height: 40px; margin: 5px;"/>';
                str2 += '</a>';
                str2 += '</li>';
              }
            }
          }
        } else {

          $$('#extraRequirementImage').hide();
        }

        //Invoice
        if (obj.success.booking_details.invoice_dtls != "") {

          debugger

          var invoice_generated = obj.success.booking_details.invoice_dtls.invoice_generated;
          var payment_total = obj.success.booking_details.invoice_dtls.payment_total;

          $$('#inVoice-layout').addClass("floating-div");
          $$('#task-details-layout').removeClass("floating-div");
          $$('#history-layout').removeClass("floating-div");

          $$('#serviceInVoiceTotalAmount').text("Rs " + payment_total);

          app.request.setup({
            /*  headers: {
               'Content-Type': 'application/pdf'
            },  */
            cache: false
          });

          app.request.get(PAYMENT_INVOICE_DOWNLOAD_API, { order_id: orderId}, function (data) {

            var obj = JSON.parse(data);

            if (obj.success != undefined) {

              if (obj.success.invoice != null) {

                var invoice = obj.success.invoice.order_id;
                var invoicePath = obj.success.invoice.invoice;

                sessionStorage.invoicePathFromServer = invoicePath;

                $$('#invoice-anchor').attr("href", invoicePath);

                $$('#invoice-anchor_payment').attr("href", invoicePath);

              }
            }

            if (obj.error != undefined) {

              message = obj.error.message;
              console.log("Error " + message);
              //$$('#invoice-anchor').attr("href", "#");
              $$("#invoice-anchor_payment").attr("disabled", "disabled");
              $$('#invoice-anchor').attr("disabled", "disabled");
              $$("#invoice-anchor_payment").removeAttr("href");
              $$("#invoice-anchor").removeAttr("href");
              app.preloader.hide();

            }
          }, function (error) {
          });

          if (customer_paid) {
            $$('#receiveButtonLayout').show();

          } else {
            $$('#receiveButtonLayout').hide();
          }

          if(invoice_generated){

            if (customer_paid) {
              $$('#generateBillLayout').hide();

            } else {
              $$('#generateBillLayout').show();
            }

          }

          if (task_end_accepted && invoice_generated && !customer_paid) {
            $$('#generateBillButton').text("ReGenerate Bill");
            $$('#generateBillLayout').show();
          }

        } else {

          $$('#inVoice-layout').hide();

          if (obj.success.booking_details.history.length == 0) {

            $$('#task-details-layout').addClass("floating-div");
          }
        }


        if (task_end_accepted && obj.success.booking_details.invoice_dtls == ""){
          $$('#generateBillButton').text("Generate Bill");
          $$('#generateBillLayout').show();
        }

        //Payment
        if (obj.success.booking_details.payment_info != "") {

          var paymentMethod = obj.success.booking_details.payment_info.payment_method;
          var serviceAmount = obj.success.booking_details.payment_info.amount;
          var tax_gst = obj.success.booking_details.payment_info.taxes;
          var discount = obj.success.booking_details.payment_info.discount;
          var partialAmount = obj.success.booking_details.payment_info.partial_amount;
          var paymentDate = obj.success.booking_details.payment_info.payment_date;
          var TotalAmount = obj.success.booking_details.payment_info.net_amount;
          var paymentStatus = obj.success.booking_details.payment_info.payment_status;

          //bookingOn date split
          var ddmmyy = paymentDate.split("-");
          var date = ddmmyy[2];
          var month = ddmmyy[1];
          var year = ddmmyy[0];

          var formattedMonth = monthFormat(month);
          var payDate = date + " " + formattedMonth + " " + year;

          //Check the payment recive or not
          if (payment_received) {

            $$('#inVoice-layout').hide();

            if (paymentMethod == "Pay At Venue") {

              $$('#paymentType').text("Cash");

            } else {

              $$('#paymentType').text(paymentMethod);
            }

            $$('#paymentDate').text(payDate);
            $$('#serviceCost').text("Rs." + " " + serviceAmount);
            $$('#serviceTax').text("Rs." + " " + tax_gst);
            $$('#serviceDiscount').text("Rs." + " " + discount);
            $$('#serviceTotalAmount').text("Rs." + " " + TotalAmount);

            if (paymentStatus == "Completed") {

              $$('#paymentStatus').html("Paid");
              $$('#paymentStatusColor').addClass("green");

            } else {

              $$('#paymentStatus').html("Unpaid");
              $$('#paymentStatusColor').addClass("orange");
            }

            $$('#generateBillLayout').hide();

          } else {

            $$('#payment-layout').hide();
            //$$('#generateBillLayout').show();
          }
        } else {
          $$('#payment-layout').hide();
          //$$('#generateBillLayout').hide();
        }

        //History
        var arrayLength = obj.success.booking_details.history.length;

        if (arrayLength != 0) {

          if (obj.success.booking_details.history != null) {
            var str = "";

            if (obj.success.booking_details.history.length > 0) {

              if (obj.success.booking_details.invoice_dtls == "") {
                $$('#history-layout').addClass("floating-div");
              }

              for (var x = 0; x < obj.success.booking_details.history.length; x++) {

                var history_id = obj.success.booking_details.history[x].history_id;
                var historyStatus = obj.success.booking_details.history[x].status;
                var historyDateTime = obj.success.booking_details.history[x].created_at;

                //HistoryDateTime Split
                var res_history = historyDateTime.split(" ");
                var historyDateString = res_history[0];
                var historyTimeString = res_history[1];

                //Date split
                var history_ddmmyy = historyDateString.split("-");
                var history_date = history_ddmmyy[2];
                var history_month = history_ddmmyy[1];
                var history_year = history_ddmmyy[0];

                var history_formattedMonth = monthFormat(history_month);
                var historyDate = history_date + " " + history_formattedMonth + " " + history_year;

                //Time split
                var history_hhmm = historyTimeString.split(":");
                var history_hour = history_hhmm[0];
                var history_minute = history_hhmm[1];

                var historyFormattedHour = hourFormat(history_hour);

                var AMPM = "";

                if (history_hour >= 12 && history_hour <= 23) {
                  AMPM = "PM";
                } else {
                  AMPM = "AM";
                }

                var historyTime = historyFormattedHour + ":" + history_minute + " " + AMPM;

                var historyFinalDateTime = historyDate + ", " + historyTime;

                str += '<li>';
                str += '<table id="customers" class="mrg-top-btm">';
                str += '<td style="width:45%">';
                str += '<span class="status-btn green" id="historyStatusColor"></span>';
                str += '<span id="historyStatus">' + historyStatus + '</span>';
                str += '<span style="font-size: 12px; color: rgb(112, 111, 111); display: block;" id="historyStatusDate">' + historyFinalDateTime + '</span> ';
                str += '</td>';
                str += '</tr>';
                str += '</table>';
                str += '</li>';

              }
            }
          }

        } else {
          $$('#history-layout').hide();
        }

        if (task_end_accepted && customer_paid) {
          $$('#generateBillLayout').hide();
        }

        //Show the after get all responce
        $$('#contain-layout-task-details').show();
        app.preloader.hide();
      }
    }

    if (obj.error != undefined) {

      message = obj.error.message;
      console.log("Error " + message);
      app.preloader.hide();
      var toast = app.toast.create({
        text: message
      });
      toast.open();
    }

    $$("#all-history-layout").html(str);
    $$("#extraRequirementImage").html(str2);
    app.preloader.hide();
  });
}

/********* Task Details API End ********/

/********* Notification Read API Start ********/

function loadReadNotification(notificationId, serviceBoyID) {

  app.request.setup({
    /* headers: {
      'api_key': "6be2f840a6a0da34f9904743800e2cae"
    }, */
    cache: false
  });

  app.request.post(READ_NOTIFICATION_API, {
    staff_id: serviceBoyID, notif_id: notificationId
  }, function (data) {

    var obj = JSON.parse(data);
    console.log(data);

    if (obj.success != undefined) {

      message = obj.success.message;
      //app.preloader.hide();
    }

    if (obj.error != undefined) {
      message = obj.error.message;
      console.log("Error " + message);
      app.preloader.hide();

      /* var toast = app.toast.create({
        text: message
      });
      toast.open(); */
    }
  });
}

/********* Notification Read API End ********/

/************* Extra image Start *************/

$$(document).on('page:init', '.page[data-name="feedback"]', function (e) {

  /* 2. Action to perform on click */
  $('#stars li').on('click', function () {

    var onStar = parseInt($(this).data('value'), 10); // The star currently selected
    var stars = $(this).parent().children('li.star');

    for (i = 0; i < stars.length; i++) {
      $(stars[i]).removeClass('selected');
    }

    for (i = 0; i < onStar; i++) {
      $(stars[i]).addClass('selected');
    }

    // JUST RESPONSE (Not needed)
    var ratingValue = parseInt($('#stars li.selected').last().data('value'), 10);
    var msg = "";
    if (ratingValue > 1) {
      msg = "Thanks! You rated this " + ratingValue + " stars.";
    }
    else {
      msg = "We will improve ourselves. You rated this " + ratingValue + " stars.";
    }
  });

});

/************* Extra image End *************/

/***** Image popup start ******/

function loadPopUpImage(imageData) {

  // Create dynamic Popup
  var dynamicPopup = app.popup.create({
    content: '<div class="popup">' +
      '<div class="block">' +
      '<p><a href="#" class="link popup-close" style="font-size: 17px;">Close</a></p>' +
      '<div class="extra-image">' +
      '<img src="' + imageData + '" id="extraImageLarge"/>' + '</div>' +
      '</div>' +
      '</div>',
    // Events
    on: {
      open: function (popup) {
        console.log('Popup open');
      },
      opened: function (popup) {
        console.log('Popup opened');
      },
    }
  });

  // Events also can be assigned on instance later
  dynamicPopup.on('close', function (popup) {
    console.log('Popup close');
  });
  dynamicPopup.on('closed', function (popup) {
    console.log('Popup closed');
  });

  // Open dynamic popup
  $$('.dynamic-popup').on('click', function () {
    dynamicPopup.open();
  });
}

/***** Image popup end ******/


/*************************** on every page reinit **********************************/
$$(document).on('page:reinit', function (e, page) {

  app.preloader.hide();
  var pagename = page.name;

  if (pagename == "dashboard" || pagename == "assigned-task" || pagename == "update-details" ||
    pagename == "all-task" || pagename == "completed-task" || pagename == "task-details" || pagename == "notification"
    || pagename == "profile" || pagename == "otp" || pagename == "login") {

    sessionStorage.currentPage = page.name;
  } else {
    sessionStorage.currentPage = "";
  }
});
/*************************** on every page reinit ends **********************************/

/*************************** on every page afterin **********************************/
$$(document).on('page:afterin', function (e, page) {

  app.preloader.hide();
  var pagename = page.name;
  var connectiontype = checkConnection();

  if (pagename == "dashboard" || pagename == "assigned-task" || pagename == "update-details" ||
    pagename == "all-task" || pagename == "completed-task" || pagename == "task-details" || pagename == "notification"
    || pagename == "profile" || pagename == "otp" || pagename == "login") {

    sessionStorage.currentPage = page.name;
  } else {
    sessionStorage.currentPage = "";
  }

  if (pagename == "dashboard") {

    if (connectiontype == "No network connection") {

      app.preloader.hide();
      app.views.main.router.navigate('/no-internet-connection/?pageToNoInternetScreen=' + "dashboard");
      app.preloader.hide();

    } else {

    }
  } else if (pagename == "assigned-task") {

    if (connectiontype == "No network connection") {

      app.preloader.hide();
      app.views.main.router.navigate('/no-internet-connection/?pageToNoInternetScreen=' + "assigned-task" + '&backScreenType=' + sessionStorage.backScreenType);
      app.preloader.hide();

    } else {

    }

  } else if (pagename == "all-task") {

    if (connectiontype == "No network connection") {

      app.preloader.hide();
      app.views.main.router.navigate('/no-internet-connection/?pageToNoInternetScreen=' + "all-task" + '&backScreenType=' + sessionStorage.backScreenType);
      app.preloader.hide();

    } else {

    }

  } else if (pagename == "completed-task") {

    if (connectiontype == "No network connection") {

      app.preloader.hide();
      app.views.main.router.navigate('/no-internet-connection/?pageToNoInternetScreen=' + "completed-task" + '&backScreenType=' + sessionStorage.backScreenType);
      app.preloader.hide();

    } else {

    }

  } else if (pagename == "task-details") {

    if (connectiontype == "No network connection") {

      app.preloader.hide();
      app.views.main.router.navigate('/no-internet-connection/?pageToNoInternetScreen=' + "task-details" + '&backScreenType=' + sessionStorage.backScreenType + '&orderId=' + sessionStorage.orderID);
      app.preloader.hide();

    } else {

    }

  } else if (pagename == "update-details") {

    if (connectiontype == "No network connection") {

      app.preloader.hide();
      app.views.main.router.navigate('/no-internet-connection/?pageToNoInternetScreen=' + "update-details" + '&backScreenType=' + sessionStorage.backScreenType + '&orderId=' + sessionStorage.orderID);
      app.preloader.hide();

    } else {

    }

  } else if (pagename == "profile") {

    if (connectiontype == "No network connection") {

      app.preloader.hide();
      app.views.main.router.navigate('/no-internet-connection/?pageToNoInternetScreen=' + "profile");
      app.preloader.hide();

    } else {

    }

  } else if (pagename == "notification") {

    if (connectiontype == "No network connection") {

      app.preloader.hide();
      app.views.main.router.navigate('/no-internet-connection/?pageToNoInternetScreen=' + "notification");
      app.preloader.hide();

    } else {

    }

  }

});
/*************************** on every page afterin ends **********************************/

/* Check internet connection */
function checkConnection() {
  var networkState = navigator.connection.type;

  var states = {};
  states[Connection.UNKNOWN] = 'Unknown connection';
  states[Connection.ETHERNET] = 'Ethernet connection';
  states[Connection.WIFI] = 'WiFi connection';
  states[Connection.CELL_2G] = 'Cell 2G connection';
  states[Connection.CELL_3G] = 'Cell 3G connection';
  states[Connection.CELL_4G] = 'Cell 4G connection';
  states[Connection.CELL] = 'Cell generic connection';
  states[Connection.NONE] = 'No network connection';

  return states[networkState];
}

/* Check internet connection ends */


/************************ Check back button functionality********************* */
function onBackKeyDown() {

  app.preloader.hide();
  $$(".page").removeClass("contentload");

  var currentPage = sessionStorage.currentPage;

  var orderID = sessionStorage.orderID;
  var backScreenType = sessionStorage.backScreenType;
  var bookingId = sessionStorage.bookingId;
  var pageType = sessionStorage.pageType;


  if (currentPage == "task-details") {

    if (sessionStorage.isServiceStartDialogOn == "false") {

      if (backScreenType == "allTask") {

        app.views.main.router.navigate('/all-task/');

      } else if (backScreenType == "completedTask") {

        app.views.main.router.navigate('/completed-task/');

      } else if (backScreenType == "assignedTask") {

        app.views.main.router.navigate('/assigned-task/');

      } else if (backScreenType == "dashboardTask") {

        app.views.main.router.navigate('/dashboard/');

      } else if (backScreenType == "profileAssignedTask") {

        app.views.main.router.navigate('/assigned-task/?backScreenType=' + backScreenType);

      } else if (backScreenType == "profileCompletedTask") {

        app.views.main.router.navigate('/completed-task/?backScreenType=' + backScreenType);

      } else if (backScreenType == "profileAllTask") {

        app.views.main.router.navigate('/all-task/?backScreenType=' + backScreenType);

      } else if (backScreenType == "notification") {

        app.views.main.router.navigate('/notification/');

      } else {

        app.views.main.router.navigate('/dashboard/');

      }

    }

  } if (currentPage == "generate-bill") {

    if (sessionStorage.isServiceStartDialogOn == "false") {
      app.views.main.router.navigate('/task-details/?orderId=' + orderId + '&backScreenType=' + backScreenType);
    }
  }
  else if (currentPage == "update-details") {

    app.views.main.router.navigate('/task-details/?orderId=' + orderID + '&backScreenType=' + backScreenType);

  }
  else if (currentPage == "all-task") {

    if (backScreenType == "profileAllTask") {

      app.views.main.router.navigate('/profile/');

    } else {

      app.views.main.router.navigate('/dashboard/');

    }

  } else if (currentPage == "assigned-task") {

    if (backScreenType == "profileAssignedTask") {

      app.views.main.router.navigate('/profile/');

    } else {

      app.views.main.router.navigate('/dashboard/');

    }

  } else if (currentPage == "completed-task") {

    if (backScreenType == "profileCompletedTask") {

      app.views.main.router.navigate('/profile/');

    } else {

      app.views.main.router.navigate('/dashboard/');

    }

  } else if (currentPage == "otp") {

    if (pageType == "taskDetails") {

      app.views.main.router.navigate('/task-details/?orderId=' + bookingId + '&backScreenType=' + backScreenType);

    } else {

      if (sessionStorage.backButtonOpenDialog == "false") {

        sessionStorage.backButtonOpenDialog = "true";

        app.dialog.confirm('Do you want to exit.', function () {
          navigator.app.exitApp();
        },
          function () {

            sessionStorage.backButtonOpenDialog = "false";

          });

      }

    }

  } else if (currentPage == "profile") {

    if (sessionStorage.logoutDialogOpen == "false") {

      app.views.main.router.navigate('/dashboard/');

    }

  } else if (currentPage == "notification") {

    app.views.main.router.navigate('/dashboard/');

  } else if (currentPage == "login") {

    navigator.app.exitApp();

  } else if (currentPage == "dashboard") {

    if (sessionStorage.logoutDialogOpen == "false") {

      if (sessionStorage.backButtonOpenDialog == "false") {

        sessionStorage.backButtonOpenDialog = "true";

        app.dialog.confirm('Do you want to exit.', function () {
          navigator.app.exitApp();
        },
          function () {

            sessionStorage.backButtonOpenDialog = "false";

          });

      }

    }
  } else {

    mainView.router.back();

  }
}

/************************ Check back button functionality********************* */

function getFileContentAsBase64(path, callback) {

  console.log("basePath" + path);
  console.log("baseCallback" + callback);

  window.resolveLocalFileSystemURL(path, gotFile, fail);

  function fail(e) {
    //alert('Cannot found requested file');
    console.log("Cannot found requested file");
  }

  function callback(e) {

    console.log("Cannot found requested file*****");
  }

  function gotFile(fileEntry) {
    fileEntry.file(function (file) {
      console.log("baseFile" + file);
      var reader = new FileReader();
      reader.onloadend = function (e) {
        var content = this.result;
        callback(content);
      };
      // The most important point, use the readAsDatURL Method from the file plugin
      reader.readAsDataURL(file);
    });
  }
}


/* Image zoom method */

function viewZoomImage(imageURL) {

  //alert("image=" + imageURL);
  console.log("image=" + imageURL);

  var options = {
    share: false, // default is false
    closeButton: false, // default is true
    copyToReference: true // default is false
    /* transition: true,
    // min and max zoom scales
    minScale: 0.4,
    maxScale: 5,
    duration: 200,
    onEnd: undefined, */
  };



  PhotoViewer.show(imageURL, '', options);
}

/* Image zoom method end */


function onResume() {
  // Handle the resume event

  //alert("OnResume");

}

function onPause() {

  //alert("OnPause");

}