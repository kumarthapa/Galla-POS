import React, { Component } from 'react';
import { withStyles } from "@material-ui/core/styles";
import ProductPage from './Product';
import CategoryList from './CategoryList';
//import RecomdedProduct from './RecomdedProduct';
import { fetchProducts, saveProducts, saveCategoryProducts, saveBestsellingProducts, saveRecommendedProducts, saveCategories } from '../../redux/action/productsAction';
import { AddToCart, updateQty } from '../../redux/action/cartAction';
import { loading, alert } from '../../redux/action/InterAction';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { Typography, Grid } from '@material-ui/core';
import CartHelper from '../../Helper/cartHelper';
import AddToCartHelper from '../../Helper/actionHelper/addToCartHelper';

const Styles = theme => ({
  root: {
    flexGrow: 1,
  }
});

class Productpannel extends Component {

  constructor(props) {
    super(props)

    this.state = {
      showEmptyProductsBlock: false,
    }
  }


  componentDidMount() {
    this.props.loading(true);
    const { productData } = this.props
    if (CartHelper.isEmpty(productData.products) && !productData.products.success) {
      this.fetchProducts();
    } else {
      this.showEmptyProductsBlock();
      this.props.loading(false);
    }
  }

  fetchProducts = () => {
    this.props.fetchProducts()
      .then(res => res.json())
      .then(products => {
        if (products.success) {
          if (products.data) {
            this.props.saveProducts(products);
            this.props.saveCategoryProducts(products.data);
            this.props.saveBestsellingProducts(products.data);
            this.props.saveRecommendedProducts(products.data);
            this.props.loading(false);
          } else {
            this.showEmptyProductsBlock();
            this.props.loading(false);
          }
        } else {
          this.showEmptyProductsBlock();
          this.props.loading(false);
        }
      })
      .catch(() => {
        this.showEmptyProductsBlock();
        this.props.loading(false);
        alert(true, "Something went wrong!")
      });
  }

  showEmptyProductsBlock = () => {
    const { productData } = this.props
    if (productData.category_products.length === 0) {
      this.setState({
        showEmptyProductsBlock: true
      })
    } else {
      this.setState({
        showEmptyProductsBlock: false
      })
    }
  }

  AddToCartProduct = (product) => {
    AddToCartHelper.validatePrice(product);
  }

  render() {
    const stylescroll = {
      overflowY: 'scroll',
      height: 'calc(100vh - 64px)',
      margin: 0,
      padding: 0,
      width: 'auto',
      justifyContent: 'space-around'
    }
    const { classes, productData } = this.props;
    var category_products = productData.category_products;
    var bestsellings = productData.bestsellings;
    var recommended = productData.recommended;
    const { showEmptyProductsBlock } = this.state;

    return (
      <>
        <div className={classes.root} style={stylescroll}>
          <CategoryList />

          {category_products !== undefined && category_products.length !== 0 ?
            <ProductPage products={category_products} AddToCart={this.AddToCartProduct} multirows={true} row={2} />
            :
            null
          }
          {bestsellings !== undefined && bestsellings.length !== 0 ?
            <ProductPage products={bestsellings} title={'Best Selling Products'} AddToCart={this.AddToCartProduct} />
            :
            null
          }
          {/* //Recommended */}
          {recommended !== undefined && recommended.length !== 0 ?
            <ProductPage products={recommended} title={'Valuable Products'} AddToCart={this.AddToCartProduct} />
            :
            null
          }
          {showEmptyProductsBlock ?
            <Grid className="height-100" container direction="row" alignItems="center" justify="center">
              <Grid item className="empty-products align-center-important">
                <Typography variant="h6" component="span">No items available</Typography>
              </Grid>
            </Grid>
            : null}
        </div>
      </>
    )
  }
}

Productpannel.propTypes = {
  fetchProducts: PropTypes.func.isRequired,
  saveProducts: PropTypes.func.isRequired,
  saveCategoryProducts: PropTypes.func.isRequired,
  saveBestsellingProducts: PropTypes.func.isRequired,
  saveRecommendedProducts: PropTypes.func.isRequired,
  saveCategories: PropTypes.func.isRequired,
  AddToCart: PropTypes.func.isRequired,
  loading: PropTypes.func.isRequired,
  alert: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  productData: state.productData,
  cartProduct: state.cartProduct
});

const mapActionsToProps = {
  fetchProducts,
  saveProducts,
  saveCategoryProducts,
  saveBestsellingProducts,
  saveRecommendedProducts,
  saveCategories,
  AddToCart,
  updateQty,
  loading,
  alert
};

export default connect(mapStateToProps, mapActionsToProps)(withStyles(Styles)(Productpannel));