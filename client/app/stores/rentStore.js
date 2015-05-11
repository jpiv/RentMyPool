var _fetchEntries = function (date, loc) {
  var params = "?val=true";
  if (date) params += "&date=" + date;
  if (loc) params += "&loc=" + loc;
  return new Promise(function (resolve, reject) {
    $.get("/rentItems" + params, function (data) {
      resolve(data);
    });
  });
};

var _postBooking = function (date, id) {
  return new Promise(function (resolve, reject) {
    $.ajax({
      url: "/book",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({date : date, _id : id}),
      statusCode: {
        302: function (data) {
          resolve({
            statusCode: 302,
            data: data
          });
        },
        500: function (err) {
          console.log("Error:", err)
          reject(err);
        }
      }
    });
  });
};

var RentStore = ObjectAssign({}, EventEmitter.prototype, {

  addEntryClickedListener: function (callback) {
    this.on(RentConstants.ENTRY_CLICKED, callback);
  },

  addFetchEntriesListener: function (callback) {
    this.on(RentConstants.FETCH_ENTRIES, callback);
  },

  addNewBookingListener: function (callback) {
    this.on(RentConstants.NEW_BOOKING, callback);
  },

  addFilterChangeLocationListener: function (callback) {
    this.on(RentConstants.FILTER_CHANGE_LOCATION, callback);
  },

  addFilterChangeDateListener: function (callback) {
    this.on(RentConstants.FILTER_CHANGE_DATE, callback);
  },

  removeEntryClickedListener: function (callback) {
    this.removeListener(RentConstants.ENTRY_CLICKED, callback);
  },

  removeFetchEntriesListener: function (callback) {
    this.removeListener(RentConstants.FETCH_ENTRIES, callback);
  },

  removeNewBookingListener: function (callback) {
    this.removeListener(RentConstants.NEW_BOOKING, callback);
  },

  removeFilterChangeListener: function (callback) {
    this.removeListener(RentConstants.FILTER_CHANGE, callback);
  },

});

RentDispatcher.register(function (action) {
  var actions = {};

  actions[RentConstants.ENTRY_CLICKED] = function () {
    RentStore.emit(RentConstants.ENTRY_CLICKED, action.load);
  };

  actions[RentConstants.FETCH_ENTRIES] = function () {
    _fetchEntries()
      .then(function (data) {
        RentStore.emit(RentConstants.FETCH_ENTRIES, data.results);
      });
  };

  actions[RentConstants.NEW_BOOKING] = function () {
    _postBooking(action.load.date, action.load.id)
      .then(function (data) {
        RentStore.emit(RentConstants.NEW_BOOKING, data);
      })
      .catch(function (err) {
        console.log("Booking Error.",err);
      });
  };

  actions[RentConstants.FILTER_CHANGE_LOCATION] = function () {
    RentStore.emit(RentConstants.FILTER_CHANGE_LOCATION, action.load);
  };

  actions[RentConstants.FILTER_CHANGE_DATE] = function () {
    _fetchEntries(action.load.date, action.load.location)
      .then(function (data) {
        RentStore.emit(RentConstants.FETCH_ENTRIES, data.results);
        RentStore.emit(RentConstants.FILTER_CHANGE_DATE, action.load);
      });
  };

  actions[action.type]();
});

