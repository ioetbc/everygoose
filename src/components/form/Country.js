import React, { Component } from 'react';
import { CountryDropdown, RegionDropdown } from 'react-country-region-selector';

class Country extends Component {
    constructor (props) {
        super(props);
        this.state = { country: '', region: '' };
    }


    render () {
        const { country, region } = this.state;
        return [
            <CountryDropdown
                value={country}
                onChange={(value) => this.setState({ country: value }, this.props.onClick(value)) }
            />,
            <RegionDropdown
                country={country}
                value={region}
                onChange={(value) => this.setState({ region: value })}
            />,
        ];
    }
}

export default Country;