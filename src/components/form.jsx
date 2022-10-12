import React from 'react';
import Slider from './slider.jsx';

class Form extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <form className="calc__form" action="/" method="post" onSubmit={this.props.handleSubmit}>
        <label className="calc__form-label" disabled={this.props.disabled}>
          <span className="calc__form-label-span">Стоимость автомобиля</span>
          <span className="calc__form-label-wrapper">
            <input type="text" className="calc__form-label-input" name="car_coast" value={this.props.formatedValue.carCoast} onChange={this.props.handleChange} onFocus={(e) => e.target.select()} onBlur={this.props.handleBlur} disabled={this.props.disabled} required />
            <span className="calc__form-label-unit">&#8381;</span>
          </span>
          <Slider inputName={'car_coast'} valueMin={this.props.limitValues.carCoast.min} valueMax={this.props.limitValues.carCoast.max} value={this.props.value.carCoast} handleSlider={this.props.handleSlider} disabled={this.props.disabled} />
        </label>

        <label className="calc__form-label calc__form-label--percent" disabled={this.props.disabled}>
          <span className="calc__form-label-span">Первоначальный взнос</span>
          <span className="calc__form-label-wrapper">
            <input type="text" className="calc__form-label-input" name="initail_payment_percent" value={this.props.formatedValue.initailPaymentPercent} onChange={this.props.handleChange} onFocus={(e) => e.target.select()} onBlur={this.props.handleBlur} disabled={this.props.disabled} required />
            <input type="hidden" className="calc__form-input calc__form-input--hidden" name="initail_payment" value={this.props.result.initailPayment} />
            <span className="calc__form-label-unit">{this.props.result.initailPayment}</span>
          </span>
          <Slider inputName={'initail_payment_percent'} valueMin={this.props.limitValues.initailPaymentPercent.min} valueMax={this.props.limitValues.initailPaymentPercent.max} value={this.props.value.initailPaymentPercent} handleSlider={this.props.handleSlider} disabled={this.props.disabled} />
        </label>

        <label className="calc__form-label" disabled={this.props.disabled}>
          <span className="calc__form-label-span">Срок лизинга</span>
          <span className="calc__form-label-wrapper">
            <input type="text" className="calc__form-label-input" name="lease_term" value={this.props.formatedValue.leaseTerm} onChange={this.props.handleChange} disabled={this.props.disabled} onFocus={(e) => e.target.select()} onBlur={this.props.handleBlur} required />
            <span className="calc__form-label-unit">мес.</span>
          </span>
          <Slider inputName={'lease_term'} valueMin={this.props.limitValues.leaseTerm.min} valueMax={this.props.limitValues.leaseTerm.max} value={this.props.value.leaseTerm} handleSlider={this.props.handleSlider} disabled={this.props.disabled} />
        </label>

        <label className="calc__form-label calc__form-label--result">
          <span className="calc__form-label-span calc__form-label-span--result">Сумма договора лизинга</span>
          <input type="hidden" className="calc__form-input calc__form-input--hidden" name="total_sum" value={this.props.result.totalSum} />
          <span className="calc__form-result">{this.props.result.totalSum}</span>
        </label>

        <label className="calc__form-label calc__form-label--result">
          <span className="calc__form-label-span calc__form-label-span--result">Ежемесячный платеж от</span>
          <input type="hidden" className="calc__form-input calc__form-input--hidden" name="monthly_payment_from" value={this.props.result.monthlyPaymentFrom} />
          <span className="calc__form-result">{this.props.result.monthlyPaymentFrom}</span>
        </label>

        <button className={this.props.busy ? 'btn-reset calc__form-button calc__form-button--busy' : 'btn-reset calc__form-button'} disabled={this.props.disabled}>Оставить заявку</button>
      </form>
    );
  }
}

export default Form;
