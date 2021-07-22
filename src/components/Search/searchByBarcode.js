import React from 'react'
import Autosuggest from 'react-autosuggest';
import { connect } from "react-redux";
import { AddToCart, updateQty } from '../../redux/action/cartAction';
import { Grid, Box, Typography, Tooltip, IconButton } from '@material-ui/core';
import CartHelper from '../../Helper/cartHelper'
import BarcodeIcon from './qrcode.gif'
import PropTypes from 'prop-types';
import { toogleCreateProduct } from '../../redux/action/productsAction';
import storeHelper from '../../Helper/storeHelper';
import { Add } from '@material-ui/icons';
import AddToCartHelper from '../../Helper/actionHelper/addToCartHelper';


class searchByBarcode extends React.Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: [],
      enableCreateProductBtn: false
    };
  }

  getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;


    return inputLength === 0 ? [] : this.props.productData.products.data.filter(product =>
      product.barcode.toLowerCase().slice(0, inputLength) === inputValue
    );
  };


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
          <Grid item xs={6}>
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
                  <Typography variant="body2" component="span" noWrap={true}>{suggestion.name}</Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={3}>
            <Box pl={2} className="align-right-important">
              <Typography variant="caption" component="span" color="textSecondary">{suggestion.barcode}</Typography>
            </Box>
          </Grid>

          <Grid item xs={3}>
            <Box pl={2} className="align-right-important">
              <Typography variant="caption" component="span" color="textSecondary">{CartHelper.getPriceFromPrices(suggestion)}</Typography>
            </Box>
          </Grid>
        </Grid>
      </div>
    )
  };

  addToCartSuggestedItem = (event, data) => {
    let product = data.suggestion;
    this.AddToCartProduct(product);
    this.setState({
      value: ''
    })
  }

  AddToCartProduct = (product) => {
    AddToCartHelper.validatePrice(product)
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };


  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
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
    return value.trim().length >= 2;
  }
  onKeyDown = (event) => {
    if (event.key === 'Enter') {
      this.setState({
        value: ""
      });
    }
  }

  openCreateProductPopup = () => {
    this.props.toogleCreateProduct(true)
  }

  render() {
    const { value, suggestions, enableCreateProductBtn } = this.state;

    const barcodescan = {
      height: 40,
      width: '100%',
      position: 'relative',
      fontSize: 18,
      padding: 12,
      border: '1px solid #e0e0e0',
      borderRadius: 4,
    }

    const inputProps = {
      placeholder: 'Enter or Scan Barcode...[ Alt+B ]',
      value,
      onChange: this.onChange,
      onKeyDown: this.onKeyDown,
      style: barcodescan,
      id: "searchByBarcode"
    };

    const autosuggestStyle = {
      color: '#000',
      position: 'relative'
    }
    const barcodeIconStyle = {
      position: 'absolute',
      zIndex: '1',
      top: '6px',
      width: '29px',
      right: '6px',
      pointerEvents: 'none'
    }



    // Finally, render it!
    return (
      <div style={autosuggestStyle}>
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
            :
            <img src={BarcodeIcon} alt="Scan Barcode" style={barcodeIconStyle} />
          }
        </React.Fragment>
      </div>
    );
  }
}

searchByBarcode.propTypes = {
  AddToCart: PropTypes.func.isRequired,
  updateQty: PropTypes.func.isRequired,
  toogleCreateProduct: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  productData: state.productData,
  cartProduct: state.cartProduct
});

export default connect(mapStateToProps, { AddToCart, updateQty, toogleCreateProduct })(searchByBarcode)