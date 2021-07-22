import React from 'react'
import { withRouter } from 'react-router-dom'
import Autosuggest from 'react-autosuggest';
import { connect } from "react-redux";
import { AddToCart, updateQty } from '../../redux/action/cartAction';
import { toogleCreateProduct } from '../../redux/action/productsAction';
import { Search, Add } from '@material-ui/icons';
import { Grid, Box, Typography, IconButton, Tooltip } from '@material-ui/core';
import CartHelper from '../../Helper/cartHelper'
import storeHelper from '../../Helper/storeHelper';
import PropTypes from 'prop-types';
import AddToCartHelper from '../../Helper/actionHelper/addToCartHelper';


class searchByName extends React.Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: [],
      enableCreateProductBtn: false
    };
  }

  getSuggestions = value => {
    const inputValue = this.escapeRegexCharacters(value.trim()).toLowerCase();
    const inputLength = inputValue.length;

    if (inputValue === '' || inputLength === 0) {
      return [];
    }

    const regex = new RegExp(inputValue, 'i');

    var productData = this.props.productData.products.data

    return productData.filter(product => regex.test(product.name) || regex.test(product.cat_name) || regex.test(product.sku));
  };

  escapeRegexCharacters = (str) => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  getSuggestionValue = suggestion => {
    return suggestion.name
  };

  renderSuggestion = suggestion => {
    return (
      <div>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item xs={5}>
            <Grid
              container
              direction="row"
              alignItems="center"
            >
              <Grid item>
                <Box>
                  {suggestion.item_image ?
                    <img src={suggestion.item_image} height={30} alt={suggestion.name} /> : <img src={`${process.env.PUBLIC_URL}/assets/images/shop-placeholder.png`} height={30} alt={suggestion.name} />
                  }
                </Box>
              </Grid>
              <Grid item xs>
                <Box pl={2} className="display-grid">
                  <Typography variant="body2" component="span" noWrap={true}>{suggestion.name}
                    <Typography variant="caption" component="span" color="textSecondary">{" (in " + suggestion.cat_name + ")"}</Typography>
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={4}>
            <Box pl={1} className="align-right-important">
              <Typography variant="caption" component="span" color="textSecondary" noWrap={true}>{suggestion.barcode}</Typography>
            </Box>
          </Grid>

          <Grid item xs={3}>
            <Box pl={1} className="align-right-important">
              <Typography variant="caption" component="span" color="textSecondary" noWrap={true}>{CartHelper.getPriceFromPrices(suggestion)}</Typography>
            </Box>
          </Grid>
        </Grid>
      </div>
    )
  };

  addToCartSuggestedItem = (event, data) => {
    let product = data.suggestion;
    this.AddToCartProduct(product);
    //Clearing data of input text 
    this.setState({
      value: ''
    })
  }

  AddToCartProduct = (product) => {
    AddToCartHelper.validatePrice(product);
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  onKeyDown = (event) => {
    if (event.key === 'Enter') {
      this.setState({
        value: ""
      });
    }
  }


  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      enableCreateProductBtn: false,
      suggestions: this.getSuggestions(value).slice(0, 10)
    });
    if (this.getSuggestions(value).length === 0 && storeHelper.canCreateProduct()) {
      this.setState({
        enableCreateProductBtn: true
      })
    } else {
      this.setState({
        enableCreateProductBtn: false
      })
    }
  };


  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  shouldRenderSuggestions = (value) => {
    return value.trim().length > 2;
  }
  onFocusHandler = () => {
    var parts = this.props.location.pathname.split('/');
    var lastSegment = parts.pop() || parts.pop();
    if (this.props.location.pathname !== '/' && lastSegment !== 'stockrequest') {
      this.props.history.push(`${process.env.PUBLIC_URL}/`);
    }
  }

  openCreateProductPopup = () => {
    this.props.toogleCreateProduct(true)
  }

  render() {
    const { value, suggestions, enableCreateProductBtn } = this.state;

    const inputStyte = {
      height: 40,
      width: '100%',
      position: 'relative',
      fontSize: 14,
      padding: '0 0 0 40px',
      border: '1px solid #e0e0e0',
      borderRadius: 4,
    }
    const autosuggestStyle = {
      color: '#000',
      position: 'relative'
    }
    const searchIconStyle = {
      position: 'absolute',
      zIndex: 1,
      top: 9,
      left: 9,
      color: '#ccc',
    }

    const inputProps = {
      placeholder: 'Search product by name, category, sku...[ Alt+S ]',
      value,
      onChange: this.onChange,
      onFocus: this.onFocusHandler,
      onKeyDown: this.onKeyDown,
      style: inputStyte,
      ref: this.searchInput,
      id: "searchByName"
    };

    // Finally, render it!
    return (
      <div style={autosuggestStyle}>
        <Search style={searchIconStyle} />
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          getSuggestionValue={this.getSuggestionValue.bind(this)}
          renderSuggestion={this.renderSuggestion}
          inputProps={inputProps}
          onSuggestionSelected={this.addToCartSuggestedItem}
          highlightFirstSuggestion={true}
          shouldRenderSuggestions={this.shouldRenderSuggestions}
        />
        <React.Fragment>
          {enableCreateProductBtn ?
            <div className="add-product-btn">
              <Tooltip title="Add new product" aria-label="add">
                <IconButton onClick={this.openCreateProductPopup}>
                  <Add fontSize="inherit" />
                </IconButton>
              </Tooltip>
            </div>
            : null}
        </React.Fragment>
      </div>
    );
  }
}

searchByName.propTypes = {
  AddToCart: PropTypes.func.isRequired,
  updateQty: PropTypes.func.isRequired,
  toogleCreateProduct: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  productData: state.productData,
  cartProduct: state.cartProduct
});

export default connect(mapStateToProps, { AddToCart, updateQty, toogleCreateProduct })(withRouter(searchByName))
