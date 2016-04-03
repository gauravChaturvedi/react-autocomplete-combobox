import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './AutoCompleteDropdown.scss';

// To be able to close the dropdown on tap anywhere except the dropdown/input box/autocomplete list,
// we have added an event listener in componentDidMount which works on the basis of className 'autocomplete' so DO NOT CHANGE CLASS NAME

export default class AutoCompleteDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: this.props.recipientList,
      showList: false,
      selectedValue: null,
      selectedMsisdn: null,
      isDisabled: true
    };
  }

  componentDidMount() {
    this.comboBoxEventListener = ::this.handleComboBoxClick;
    document.addEventListener('click', this.comboBoxEventListener);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.comboBoxEventListener);
  }

  handleComboBoxClick(evt) {
    const className = evt.target.className || '';
    if (className.indexOf('autocomplete') < 0) {
      this.setState({
        showList: false
      });
    }
  }

  dropdownIconClicked() {
    if (this.props.recipientList && this.props.recipientList.length > 0) {
      const inputRef = ReactDOM.findDOMNode(this.refs.giftRecipientInput);
      this.filterList(inputRef.value);
      this.setState({
        showList: !this.state.showList
      });
    }
  }

  onFocus() {
    if (this.props.recipientList && this.props.recipientList.length > 0) {
      const inputRef = ReactDOM.findDOMNode(this.refs.giftRecipientInput);
      this.filterList(inputRef.value);
      this.setState({
        showList: true
      });
    }
  }

  onChange() {
    if (this.props.recipientList && this.props.recipientList.length > 0) {
      const inputRef = ReactDOM.findDOMNode(this.refs.giftRecipientInput);
      const searchedString = inputRef && inputRef.value;
      if (searchedString && searchedString.length > 0) {
        this.setState({
          isDisabled: false
        });
      } else {
        this.setState({
          isDisabled: true
        });
      }
      this.filterList(inputRef.value);
    }
  }

  listItemClicked(item) {
    const inputRef = ReactDOM.findDOMNode(this.refs.giftRecipientInput);
    inputRef.value = item.name;
    this.setState({
      showList: false,
      selectedValue: item.name,
      selectedMsisdn: item.msisdn,
      isDisabled: false
    });
  }

  filterList(value) {
    let newList = this.props.recipientList;
    if (value.length > 0) {
      const filteredList = [];
      this.props.recipientList.map((object) => {
        if (((object.name.toLowerCase()).indexOf(value.toLowerCase()) > -1) || ((object.msisdn.toString()).indexOf(value) > -1)) {
          filteredList.push(object);
        }
      });
      newList = filteredList;
    }
    this.setState({
      list: newList
    });
  }

  returnCorrectCaseFormat(searchedString, listItem) {
    const indexOfMatch = (listItem.toLowerCase()).indexOf(searchedString.toLowerCase());
    if (indexOfMatch > -1) {
      return listItem.substring(indexOfMatch, indexOfMatch + searchedString.length);
    }
  }

  // Used to highlight and bold the matched query in the display
  highlightItem(option) {
    const inputRef = ReactDOM.findDOMNode(this.refs.giftRecipientInput);
    const searchedString = inputRef && inputRef.value;
    if (searchedString && searchedString.length > 0) {
      const regEx = new RegExp(searchedString, 'ig');
      return option.replace(regEx, '<span style="color: #CCC; font-weight: 800;">' + this.returnCorrectCaseFormat(searchedString, option) + '</span>');
    } else {
      return option;
    }
  }

  render() {
    const showList = this.state.showList;
    const nodeList = [];
    if (this.state.list) {
      this.state.list.map((item, index) => {
        nodeList.push(
          <li className="autocomplete-dropdown--list--item" key={index} onClick={() => { this.listItemClicked(item); return; }} dangerouslySetInnerHTML={{__html: this.highlightItem(item.msisdn.toString()) + '  (' + this.highlightItem(item.name) + ')'}}></li>
        );
      });
    }
    const dropdownIconClass = 'autocomplete-dropdown__icon--' + ((showList) ? 'open' : 'closed');
    return (
      <div>
        <span className={dropdownIconClass} onClick={::this.dropdownIconClicked}></span>
        <div className="autocomplete-dropdown__select">
          <input ref="giftRecipientInput" className="autocomplete-dropdown--input" onChange={::this.onChange} onFocus={::this.onFocus} />
          {(showList) ? <ol className="autocomplete-dropdown--list">
            {nodeList}</ol> : null}
        </div>
      </div>
    );
  }
}

