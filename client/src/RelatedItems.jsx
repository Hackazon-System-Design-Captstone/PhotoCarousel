import React, { Component } from 'react';
import fetch from 'node-fetch';
import PzSlider from './PzSlider';
import styles from './main.css';

class RelatedItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      pageNum: 0,
      pageProducts: [],
    };
  }

  componentDidMount() {
    const id = window.location.search.replace(/\?id=/, '');
    if (id) {
      fetch(`/product?id=${id}`)
        .then(response => response.json())
        .then(({ data }) => {
          const listOfItems = [];
          let numOfItem = 6;
          if (data.length < 6) { numOfItem = data.length; }
          for (let i = 0; i < numOfItem; i += 1) {
            listOfItems.push(data[i]);
          }

          this.setState({
            products: data,
            pageProducts: listOfItems,
          });
        })
        .catch(err => console.log(err));
    }
  }

  pageClickN() {
    const { products } = this.state;
    let { pageNum } = this.state;
    const total = products.length;
    let numOfItem = 6;
    pageNum += 1;
    let startNum = pageNum * 6;

    if (startNum > total) {
      pageNum = 0;
      startNum = 0;
    } else if (startNum + numOfItem > total) {
      numOfItem = total % numOfItem;
    }
    const listOfItems = [];
    for (let i = startNum; i < startNum + numOfItem; i += 1) {
      listOfItems.push(products[i]);
    }
    this.setState({
      pageProducts: listOfItems,
      pageNum,
    });
  }

  pageClickP() {
    const { products } = this.state;
    let { pageNum } = this.state;
    const total = products.length;
    let numOfItem = 6;
    pageNum -= 1;
    if (pageNum < 0) {
      pageNum = Math.floor(products.length / numOfItem);
    }
    let startNum = pageNum * 6;

    if (startNum > total) {
      pageNum = 0;
      startNum = 0;
    } else if (startNum + numOfItem > total) {
      numOfItem = total % numOfItem;
    }
    const listOfItems = [];
    for (let i = startNum; i < startNum + numOfItem; i += 1) {
      listOfItems.push(products[i]);
    }
    this.setState({
      pageProducts: listOfItems,
      pageNum,
    });
  }


  render() {
    const { products, pageProducts, pageNum } = this.state;
    return (
      <div>
        <span className={styles.page}>
          {'Page '}
          {pageNum + 1}
          {' of '}
          {(products.length - (products.length % 6)) / 6 + 1}
        </span>
        <div>
          {products.length > 0 ? <PzSlider prev={this.pageClickP.bind(this)} next={this.pageClickN.bind(this)} items={pageProducts} /> : 'Loading...'}
        </div>
      </div>
    );
  }
}

export default RelatedItems;
