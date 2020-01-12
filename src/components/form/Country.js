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
        return [
            <CountryDropdown
                value={country}
                name="country"
                onChange={(value) => this.setState({ country: value }, this.props.onClick(value)) }
                className="select"
                onBlur={(e) => onBlur(e)}
            />,
            <RegionDropdown
                country={country}
                name="county"
                value={region}
                onChange={(value) => this.setState({ region: value })}
                onBlur={(e) => onBlur(e)}
            />,
        ];
    }
}

export default Country;