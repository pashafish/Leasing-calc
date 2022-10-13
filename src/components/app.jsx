import React from 'react';
import ReactDOM from 'react-dom/client';
import Form from './form.jsx';
import Notification from './notification.jsx';

class Calc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: {
        carCoast: 3300000,
        initailPaymentPercent: 13,
        leaseTerm: 60,
      },
      formatedValue: {
        carCoast: '3 300 000',
        initailPaymentPercent: '13%',
        leaseTerm: '60',
      },
      result: {
        initailPayment: '429 000 ₽',
        totalSum: '7 334 640 ₽',
        monthlyPaymentFrom: '115 094 ₽',
      },
      notification: {
        visible: false,
        message: null,
      },
      disabled: false,
      activeElement: null,
      busy: false,
    }
    this.limitValues = {
      carCoast: {
        min: 1000000,
        max: 6000000,
      },
      initailPaymentPercent: {
        min: 10,
        max: 60,
      },
      leaseTerm: {
        min: 1,
        max: 60,
      },
    }
    this.interestRate = 0.035;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleSlider = this.handleSlider.bind(this);
    this.handleSliderMove = this.handleSliderMove.bind(this);
    this.handleSliderKey = this.handleSliderKey.bind(this);
  }

  async handleSubmit(e) {
    e.preventDefault();
    if(!this.state.disabled) {
      this.setState({disabled: true});
      this.calculate();
      const data = new FormData(e.target);
      let dataJSON = {};
      data.forEach((value, key) => dataJSON[key] = Number(value.toString().replace(/[^0-9]+/g, '')));
      this.setState({busy: true});

      try {
        const response = await fetch('https://hookb.in/eK160jgYJ6UlaRPldJ1P', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(dataJSON)
        });
        if (!response.ok) {
          throw new Error('Произошла ошибка. Попробуйте снова чуть позже.');
        }
        let responseData = await response.json();
        console.log(responseData);
        if(responseData.success) {
          this.setState({
            notification: {
              visible: true,
              message: 'Ваша заявка принята!',
            },
            busy: false,
          });
          setTimeout(() => {
            this.setState({
              notification: {
                visible: false,
                message: null,
              },
              disabled: false,
            });
          }, 5000);
        } else throw new Error('Произошла ошибка. Попробуйте снова чуть позже.');
      } catch (error) {
        this.setState({
          notification: {
            visible: true,
            message: error.message,
          },
          busy: false,
        });
        setTimeout(() => {
          this.setState({
            notification: {
              visible: false,
              message: null,
            },
            disabled: false,
          });
        }, 5000);
      }
    }
  }

  handleChange(e) {
    let inputName = e.nativeEvent.target.name;
    let value = this.state.value;
    let formatedValue = this.state.formatedValue;
    let newFormatedValue = e.target.value.toString();
    let newValue = Number(e.target.value.toString().replace(/[^0-9]+/g, ''));
    switch(inputName) {
      case 'car_coast':
        value.carCoast = String(newValue).length > String(this.limitValues.carCoast.max).length ? Number(String(newValue).substring(0, String(newValue).length - 1)) : newValue;
        formatedValue.carCoast = this.formatNumber(value.carCoast);
        break;
      case 'initail_payment_percent':
        newValue = (e.nativeEvent.inputType === 'deleteContentBackward') && (newFormatedValue.replace(/[0-9]+/g, '') === '') ? Number(String(newValue).substring(0, String(newValue).length - 1)) : newValue;
        value.initailPaymentPercent = String(newValue).length > String(this.limitValues.initailPaymentPercent.max).length ? Number(String(newValue).substring(0, String(newValue).length - 1)) : newValue;
        formatedValue.initailPaymentPercent = this.formatNumber(value.initailPaymentPercent, '%');
        break;
      case 'lease_term':
        value.leaseTerm = String(newValue).length > String(this.limitValues.leaseTerm.max).length ? Number(String(newValue).substring(0, String(newValue).length - 1)) : newValue;
        formatedValue.leaseTerm = this.formatNumber(value.leaseTerm);
        break;
      default: break;
    }
    this.setState({
      value: value,
      formatedValue: formatedValue,
    });
  }

  handleBlur(e) {
    let inputName = e.nativeEvent.target.name;
    let value = this.state.value;
    let formatedValue = this.state.formatedValue;
    let newValue = Number(e.target.value.toString().replace(/[^0-9]+/g, ''));
    switch(inputName) {
      case 'car_coast':
        value.carCoast = newValue < this.limitValues.carCoast.min ? this.limitValues.carCoast.min : newValue > this.limitValues.carCoast.max ? this.limitValues.carCoast.max : newValue;
        formatedValue.carCoast = this.formatNumber(value.carCoast);
        break;
      case 'initail_payment_percent':
        value.initailPaymentPercent = newValue < this.limitValues.initailPaymentPercent.min ? this.limitValues.initailPaymentPercent.min : newValue > this.limitValues.initailPaymentPercent.max ? this.limitValues.initailPaymentPercent.max : newValue;
        formatedValue.initailPaymentPercent = this.formatNumber(value.initailPaymentPercent, '%');
        break;
      case 'lease_term':
        value.leaseTerm = newValue < this.limitValues.leaseTerm.min ? this.limitValues.leaseTerm.min : newValue > this.limitValues.leaseTerm.max ? this.limitValues.leaseTerm.max : newValue;
        formatedValue.leaseTerm = this.formatNumber(value.leaseTerm);
        break;
      default: break;
    }
    this.setState({
      value: value,
      formatedValue: formatedValue,
    });
    this.calculate();
  }

  handleSliderMove(e) {
    e.preventDefault();
    const targetSlider = this.state.activeElement;
    const targetSliderGuide = targetSlider.parentElement;
    const sliderGuideCoords = {
      left: targetSliderGuide.getBoundingClientRect().left,
      right: targetSliderGuide.getBoundingClientRect().right,
      width: targetSliderGuide.getBoundingClientRect().right - targetSliderGuide.getBoundingClientRect().left,
    }
    let sliderPercent = 0;
    sliderPercent = ((e.pageX ?? e.touches[0]?.pageX ?? 0) - sliderGuideCoords.left) / sliderGuideCoords.width;
    sliderPercent = sliderPercent < 0 ? 0 : sliderPercent > 1 ? 1 : sliderPercent;
    let value = this.state.value;
    let formatedValue = this.state.formatedValue;
    switch(targetSlider.getAttribute('data-inputname')) {
      case 'car_coast':
        value.carCoast = Math.round(this.limitValues.carCoast.min + (this.limitValues.carCoast.max - this.limitValues.carCoast.min) * sliderPercent);
        formatedValue.carCoast = this.formatNumber(value.carCoast);
        break;
      case 'initail_payment_percent':
        value.initailPaymentPercent = Math.round(this.limitValues.initailPaymentPercent.min + (this.limitValues.initailPaymentPercent.max - this.limitValues.initailPaymentPercent.min) * sliderPercent);
        formatedValue.initailPaymentPercent = this.formatNumber(value.initailPaymentPercent, '%');
        break;
      case 'lease_term':
        value.leaseTerm = Math.round(this.limitValues.leaseTerm.min + (this.limitValues.leaseTerm.max - this.limitValues.leaseTerm.min) * sliderPercent);
        formatedValue.leaseTerm = this.formatNumber(value.leaseTerm);
        break;
      default: break;
    }
    this.setState({value: value, formatedValue: formatedValue});
    this.calculate();
  }

  handleSliderKey(e) {
    const targetSlider = e.target;
    const delta = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    let value = this.state.value;
    let formatedValue = this.state.formatedValue;
    switch(targetSlider.getAttribute('data-inputname')) {
      case 'car_coast':
        value.carCoast = value.carCoast + delta;
        value.carCoast = value.carCoast < this.limitValues.carCoast.min ? this.limitValues.carCoast.min : value.carCoast > this.limitValues.carCoast.max ? this.limitValues.carCoast.max : value.carCoast;
        formatedValue.carCoast = this.formatNumber(value.carCoast);
        break;
      case 'initail_payment_percent':
        value.initailPaymentPercent = value.initailPaymentPercent + delta;
        value.initailPaymentPercent = value.initailPaymentPercent < this.limitValues.initailPaymentPercent.min ? this.limitValues.initailPaymentPercent.min : value.initailPaymentPercent > this.limitValues.initailPaymentPercent.max ? this.limitValues.initailPaymentPercent.max : value.initailPaymentPercent;
        formatedValue.initailPaymentPercent = this.formatNumber(value.initailPaymentPercent, '%');
        break;
      case 'lease_term':
        value.leaseTerm = value.leaseTerm + delta;
        value.leaseTerm = value.leaseTerm < this.limitValues.leaseTerm.min ? this.limitValues.leaseTerm.min : value.leaseTerm > this.limitValues.leaseTerm.max ? this.limitValues.leaseTerm.max : value.leaseTerm;
        formatedValue.leaseTerm = this.formatNumber(value.leaseTerm);
        break;
      default: break;
    }
    this.setState({value: value, formatedValue: formatedValue});
    this.calculate();
  }

  handleSlider(e) {
    if(!this.state.disabled) {
      if(e.nativeEvent.type === 'keydown') {
        this.handleSliderKey(e);
      } else {
        this.setState({activeElement: e.nativeEvent.target});
        e.nativeEvent.target.classList.add('focus-visible');
        document.addEventListener('mousemove', this.handleSliderMove);
        document.addEventListener('touchmove', this.handleSliderMove, {passive: false});
        document.addEventListener('mouseup', (e) => {
          document.removeEventListener('mousemove', this.handleSliderMove);
          document.removeEventListener('touchmove', this.handleSliderMove, {passive: false});
          if(this.state.activeElement) this.state.activeElement.classList.remove('focus-visible');
          this.setState({activeElement: null});
        });
        document.addEventListener('touchend', (e) => {
          document.removeEventListener('mousemove', this.handleSliderMove);
          document.removeEventListener('touchmove', this.handleSliderMove, {passive: false});
          if(this.state.activeElement) this.state.activeElement.classList.remove('focus-visible');
          this.setState({activeElement: null});
        });
      }
    }
  }

  calculate() {
    let result = this.state.result;
    let value = this.state.value;
    result.initailPayment = Math.round(value.carCoast * value.initailPaymentPercent / 100);
    result.monthlyPaymentFrom = Math.round((value.carCoast - result.initailPayment) * ((this.interestRate * Math.pow((1 + this.interestRate), value.leaseTerm)) / (Math.pow((1 + this.interestRate), value.leaseTerm) - 1)));
    result.totalSum = result.initailPayment + value.leaseTerm * result.monthlyPaymentFrom;
    Object.keys(result).forEach((key, index) => {
      result[key] = this.formatNumber(result[key], '₽');
    });
    this.setState({result: result});
  }

  formatNumber(num, unit = undefined) {
    return !unit ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : (unit === '%') ? num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + `${unit}` : num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ` ${unit}`;
  }

  render() {
    return (
      this.state.notification.visible ?
      <div className="container">
        <Notification message={this.state.notification.message}/>
        <h1 className="calc__header">Рассчитайте стоимость автомобиля в&nbsp;лизинг</h1>
        <Form value={this.state.value} formatedValue={this.state.formatedValue} result={this.state.result} limitValues={this.limitValues} handleSubmit={this.handleSubmit} handleChange={this.handleChange} handleBlur={this.handleBlur} handleSlider={this.handleSlider} disabled={this.state.disabled} busy={this.state.busy} />
      </div> :
      <div className="container">
        <h1 className="calc__header">Рассчитайте стоимость автомобиля в&nbsp;лизинг</h1>
        <Form value={this.state.value} formatedValue={this.state.formatedValue} result={this.state.result} limitValues={this.limitValues} handleSubmit={this.handleSubmit} handleChange={this.handleChange} handleBlur={this.handleBlur} handleSlider={this.handleSlider} disabled={this.state.disabled} busy={this.state.busy} />
      </div>
    )
  }
}

const root = ReactDOM.createRoot(document.getElementById("calc"));
root.render(<Calc />);
