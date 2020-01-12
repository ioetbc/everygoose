import React, { Component } from 'react';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';

class Country extends Component {
    constructor (props) {
        super(props);
        this.state = { country: '', region: '' };
    }


    render () {
        const { country, region } = this.state;
        const { onBlur } = this.props;

        return (
            <div className="input-side-by-side item-quantity">
                <CountryDropdown
                    value={country}
                    name="country"
                    onChange={(value) => this.setState({ country: value }, this.props.onClick(value)) }
                    className="select quantity-select"
                    onBlur={(e) => onBlur(e)}
                />
                <RegionDropdown
                    country={country}
                    name="county"
                    value={region}
                    className={`select ${this.state.country === '' ? 'disabled' : ''} quantity-select`}
                    disabled={this.state.country === '' ? true : false}
                    onChange={(value) => this.setState({ region: value })}
                    onBlur={(e) => onBlur(e)}
                />
            </div>
        );
    }
}

export default Country;