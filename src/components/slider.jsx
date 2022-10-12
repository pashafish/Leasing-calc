import React from 'react';

class Slider extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <span className='slider'>
        <span className='slider__guide'>
          <span className='slider__line' style={{width: 'clamp(0%, ' + (this.props.value - this.props.valueMin) / (this.props.valueMax - this.props.valueMin) * 100 + '%, 100%)'}}></span>
          <span className='slider__dot' data-inputname={this.props.inputName} tabIndex={!this.props.disabled - 1} role='slider' style={{left: 'clamp(0%, ' + (this.props.value - this.props.valueMin) / (this.props.valueMax - this.props.valueMin) * 100 + '%, 100%)'}} aria-valuemin={this.props.valueMin} aria-valuemax={this.props.valueMax} aria-valuenow={this.props.value} disabled={this.props.disabled} onMouseDown={this.props.handleSlider} onTouchStart={this.props.handleSlider} onKeyDown={this.props.handleSlider}></span>
        </span>
      </span>
    );
  }
}

export default Slider;
