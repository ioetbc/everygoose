import React, { Component } from 'react';

export default class ScrollToTop extends Component {
	componentDidMount() {
	  window.scrollTo({
		top: 0,
		left: 0,
		behavior: 'smooth'
	  });
	}
  
	render() {
	  return null;
	}
}