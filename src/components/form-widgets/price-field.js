import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getFiatPrice } from 'utils/priceUtils'
import { FormattedMessage } from 'react-intl'

class PriceField extends Component {
  constructor(props) {
    super(props)
    this.state = {
      price: props.formData || '',
      currencyCode: props.currencyCode || 'USD'
    }

    const { options } = props
    const { selectedSchema } = options
    const enumeratedPrice =
      selectedSchema && selectedSchema.properties['price'].enum
    this.priceHidden =
      enumeratedPrice &&
      enumeratedPrice.length === 1 &&
      enumeratedPrice[0] === 0
  }

  onChange() {
    return async event => {
      const value = event.target.value
      const isNan = value === '' || isNaN(value)
      const valueNum = isNan ? value : parseFloat(value)
      if (valueNum < 0) {
        return
      }
      this.setState(
        {
          price: valueNum
        },
        () => this.props.onChange(valueNum)
      )
    }
  }

  render() {
    const { price, currencyCode } = this.state
    const priceUsd = getFiatPrice(price, currencyCode, 'ETH')

    return (
      !this.priceHidden && (
        <div className="price-field">
          <label className="control-label" htmlFor="root_price">
            {this.props.schema.title}
            {this.props.required && <span className="required">*</span>}
          </label>
          <div className="row">
            <div className="col-sm-6">
              <div className="price-field-container">
                <input
                  type="number"
                  id="root_price"
                  step="0.00001"
                  className="price-field form-control"
                  value={price}
                  onChange={this.onChange()}
                  required={this.props.required}
                />
                <span className="currency-badge">
                  <img src="images/eth-icon.svg" role="presentation" />
                  ETH
                </span>
              </div>
            </div>
            <div className="col-sm-6 no-left-padding">
              <div className="price-field-fiat">
                {priceUsd}&nbsp;
                <span className="currency-badge text-grey">
                  <img src="images/usd-icon.svg" role="presentation" />
                  {currencyCode}
                </span>
              </div>
            </div>
          </div>
          <p className="help-block">
            <FormattedMessage
              id={'price-field.price-help'}
              defaultMessage={'The price is always in {currency}. '}
              values={{
                currency: (
                  <a
                    href="https://en.wikipedia.org/wiki/Ethereum"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    ETH
                  </a>
                )
              }}
            />
            <span className="text-bold">
              <FormattedMessage
                id={'price-field.price-usd-disclaimer'}
                defaultMessage={'USD is an estimate.'}
              />
            </span>
          </p>
        </div>
      )
    )
  }
}

const mapStateToProps = ({ exchangeRates }) => ({
  exchangeRates
})

export default connect(mapStateToProps)(PriceField)
