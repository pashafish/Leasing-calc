import React from 'react';

class Notification extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='notification' role='alert'>
        {this.props.message}
      </div>
    );
  }
}

export default Notification;
