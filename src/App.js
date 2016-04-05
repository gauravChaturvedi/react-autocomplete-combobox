import React, { Component } from 'react';
import AutoCompleteDropdown from './AutoCompleteDropdown.js';

const dummyArray = [
  {
    name: 'C3PO',
    msisdn: 123456789
  },
  {
    name: 'BB8',
    msisdn: 123456789
  },
  {
    name: 'R2D2',
    msisdn: 987654321
  }
];

export default class App extends Component {
  render() {
    return (
      <div>
        <AutoCompleteDropdown list={dummyArray} />
      </div>
    );
  }
}
