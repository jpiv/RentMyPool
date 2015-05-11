var ListContent = React.createClass({

  getInitialState: function() {
  return {
    name: 'Name',
    address : 'Address',
    price : 'Price',
    date: "Date",
    title: "Title",
    user_id: "",
    dateFrom : "Date from",
    dateTo : "Date to"
    };
  },

  componentWillMount: function () {
    AppStore.addFetchUserListener(this.handleFetchUser);
  },

  componentDidMount: function () {
    $( "#datepicker" ).datepicker();
    $( "#datepicker2" ).datepicker();
    AppActions.fetchUser();
  },

  componentWillUnmount: function () {
    AppStore.removeFetchUserListener(this.handleFetchUser);
  },

  handleFetchUser: function (data) {
    this.setState({
      user_id: data._id
    });
  },

  handleSubmit: function (e) {
    e.preventDefault();

    this.setState({
      name: e.target.name.value,
      address: e.target.address.value,
      price: e.target.price.value,
      dateFrom: e.target.dateFrom.value,
      dateTo: e.target.dateTo.value,
      file: e.target.userPhoto.files[0],
      title: e.target.name.title,
    }, 
      function () {
        ListingsActions.listingSubmitted(this.state);
      }.bind(this)
    );
  },

  render: function () {
    return (
      <div className="listView">
        <LoginTransitioner />
        <h1>List a Pool</h1>
        <form onSubmit={this.handleSubmit}>
          <input name="title" placeholder={this.state.title} type="text" />
          <br />
          <br />
          <input name="name" placeholder={this.state.name} type="text" />
          <br />
          <br />
          <input name="address" placeholder={this.state.address} type="text" />
          <br />
          <br />
          <input name="price" placeholder={this.state.price} type="text" />
          <br />
          <br />
          <input name="dateFrom" id="datepicker" placeholder={this.state.dateFrom} type="text" />
          <br />
          <br />
          <input name="dateTo" id="datepicker2" placeholder={this.state.dateTo} type="text" />
          <br />
          <br />
          <input type="file" id="userPhotoInput" name="userPhoto" />
          <br />
          <br />
          <input type="submit" />
        </form>
      </div>
    );
  }

});
