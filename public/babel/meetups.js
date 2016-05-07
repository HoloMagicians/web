var MeetupsLoading = React.createClass({
  render: function(){
    return(
    <div className='text-center'>
      <img src='/img/loading.gif' />
    </div>);
  }
});

var MeetupsMoreEvents = React.createClass({
  render: function(){
    return(
      <div className='container more-events'>
        <a href='http://hololens.connpass.com/'>もっとイベントを見る</a>
      </div>
    );
  }
});
// <img className='col-md-3 col-xs-12' src={'/api/meetups/thumbnail/' + data.id} />

var Meetup = React.createClass({
  render: function(){
    var data = this.props.data;
    var d = new Date(data.started_at);
    var current = new Date();
    var divStyle = {
      backgroundImage: 'url(/api/meetups/thumbnail/' + data.id + ')',
    };
    var done = d.getTime() < current.getTime() ? ' done' : '';
    return(
    <div className='container meetup'>
      <a href={data.event_url}>
        <div className={'col-md-3 col-xs-12 thumbnail' + done} style={divStyle}>
          <div className='gray-out'>
            <p>終了</p>
          </div>
        </div>
      </a>
      <div className='container col-md-9'>
        <h3><a href={data.event_url}>{data.title}</a></h3>
        <p>{d.getYear() + 1900}/{d.getMonth() + 1}/{d.getDate()}</p>
        <p>{data.attendees}人</p>
      </div>
    </div>)
  }
});

var Meetups = React.createClass({
  getInitialState: function(){
    return null;
  },
  componentDidMount: function(){
    $.get('/api/meetups', function(data){
     this.setState(data);
    }.bind(this));
  },
  render: function(){
    if(!this.state){
      return <MeetupsLoading />
    }else{
      var meetups = [];
      for(var i = 0; i < this.state.events.length; ++i){
        meetups.push(<Meetup data={this.state.events[i]} />);
      }
      var moreEvents = this.state.more_events
        ? <MeetupsMoreEvents />
        : <span />;
      return(
        <div>
          {meetups}
          {moreEvents}
        </div>
      );
    }
  }
});

ReactDOM.render(<Meetups />, document.getElementById('meetups_container'));

