import React, { Component } from 'react'
import { Dialog, DialogTitle, DialogActions, DialogContent, Grid, Button, TextField, MenuItem, IconButton, FormControl, InputLabel, Select } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import storeHelper from '../../Helper/storeHelper';
import { fetchProducts, saveProducts, toogleCreateProduct, createProduct, fetchCategory } from '../../redux/action/productsAction';
import { loading, alert } from '../../redux/action/InterAction';

export class CreateProduct extends Component {
  constructor(props) {
    super(props)

    this.state = {
      name: "",
      barcode: "",
      costprice: "",
      mrp: "",
      user_id: "",
      tax: "",
      inventory: "",
      unit: "",
      hsncode: "",
      location: "",
      category_id: "",
      categories: []
    }
  }

  componentDidMount() {
    this.props.fetchCategory()
      .then(res => res.json())
      .then(response => {
        if (response['success'] && response['cats']) {
          this.setState({
            categories: response['cats']
          })
        }
      })
      .catch(() => {
        this.props.alert(true, "Something went wrong")
      });
  }

  closePopup = () => {
    this.props.toogleCreateProduct(false)
  }

  componentDidUpdate() {
    const { location, user_id } = this.state
    if (!location) {
      this.setState({
        location: storeHelper.getLocationId()
      })
    }
    if (!user_id) {
      this.setState({
        user_id: storeHelper.getUserId()
      })
    }
  }

  update = (name, e) => {
    this.setState({ [name]: e.target.value });
  }

  saveProduct = (e) => {
    e.preventDefault()
    var state = this.state
    delete state['categories']

    if (this.isFilledAllData(state)) {
      this.props.loading(true)
      this.props.createProduct(state)
        .then(res => res.json())
        .then(response => {
          this.props.loading(false)
          if (response && response.success) {
            this.fetchProducts()
            this.closePopup()
          } else {
            this.props.alert(true, response.msg)
          }
        })
        .catch(() => {
          this.props.loading(false)
          this.props.alert(true, "Something went wrong")
        });
    }
  }

  isFilledAllData = (state) => {
    var isfilled = true
    Object.keys(state).forEach(key => {
      if (!state[key]) {
        isfilled = false
        return isfilled
      }
    })
    return isfilled
  }

  fetchProducts = () => {
    this.props.fetchProducts()
      .then(res => res.json())
      .then(products => {
        if (products.success) {
          if (products.data) {
            this.props.saveProducts(products);
          }
        }
      })
      .catch(() => {
        this.props.loading(false);
        this.props.alert(true, "Something went wrong!")
      });
  }

  render() {
    const { productData } = this.props
    const { name, barcode, costprice, mrp, tax, inventory, unit, hsncode, category_id, categories } = this.state
    return (
      <Dialog fullWidth={true} maxWidth="sm" open={(productData.createPopup) ? productData.createPopup : false} scroll={'body'} className={'create-product'}>
        <form onSubmit={this.saveProduct} autoComplete="off">
          <Grid>
            <DialogActions>
              <IconButton className={'popup-close-button'} onClick={this.closePopup}>
                <Close />
              </IconButton>
            </DialogActions>
          </Grid>
          <DialogTitle>{"Create a new product!"}</DialogTitle>
          <DialogContent>
            <Grid container direction="row" spacing={2}>
              <Grid item xs={6}>
                <TextField
                  required
                  className="width-100"
                  label="Name"
                  variant="outlined"
                  value={name}
                  onChange={(e) => this.update("name", e)} />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  className="width-100"
                  label="Barcode"
                  variant="outlined"
                  value={barcode}
                  onChange={(e) => this.update("barcode", e)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  className="width-100"
                  label="Cost price"
                  variant="outlined"
                  type="number"
                  value={costprice}
                  onChange={(e) => this.update("costprice", e)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  className="width-100"
                  label="MRP"
                  variant="outlined"
                  type="number"
                  value={mrp}
                  onChange={(e) => this.update("mrp", e)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  className="width-100"
                  label="HSN code"
                  variant="outlined"
                  value={hsncode}
                  onChange={(e) => this.update("hsncode", e)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  className="width-100"
                  label="Tax"
                  variant="outlined"
                  type="number"
                  value={tax}
                  onChange={(e) => this.update("tax", e)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  required
                  className="width-100"
                  label="Unit"
                  variant="outlined"
                  value={unit}
                  onChange={(e) => this.update("unit", e)}
                >
                  <MenuItem value={'Each'}>Each</MenuItem>
                  <MenuItem value={'KG'}>KG</MenuItem>
                  <MenuItem value={'Box'}>Box</MenuItem>
                  <MenuItem value={'Dozen'}>Dozen</MenuItem>
                  <MenuItem value={'Carton'}>Carton</MenuItem>
                  <MenuItem value={'Quantity'}>Quantity</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  className="width-100"
                  label="Inventory"
                  variant="outlined"
                  type="number"
                  value={inventory}
                  onChange={(e) => this.update("inventory", e)}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl className="width-100" variant="outlined">
                  <InputLabel htmlFor="grouped-native-select">Category</InputLabel>
                  <Select
                    native
                    required
                    label="Category"
                    variant="outlined"
                    value={category_id}
                    onChange={(e) => this.update("category_id", e)}
                  >
                    <option aria-label="None" value="" />
                    {
                      categories.map((cat, i) => (
                        <optgroup key={i} label={cat.parent}>
                          {
                            cat.childs.map(subcat => (
                              <option value={subcat.id} key={subcat.id}>{subcat.child}</option>)
                            )
                          }
                        </optgroup>
                      ))
                    }
                  </Select>
                </FormControl>
              </Grid>

            </Grid>
          </DialogContent>
          <DialogActions>
            <Button type="submit" variant="contained" color="secondary" size="large">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog >
    )
  }
}

CreateProduct.propTypes = {
  toogleCreateProduct: PropTypes.func.isRequired,
  createProduct: PropTypes.func.isRequired,
  fetchProducts: PropTypes.func.isRequired,
  fetchCategory: PropTypes.func.isRequired,
  saveProducts: PropTypes.func.isRequired,
  loading: PropTypes.func.isRequired,
  alert: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  productData: state.productData
});

const mapActionToProps = {
  toogleCreateProduct,
  createProduct,
  fetchProducts,
  fetchCategory,
  saveProducts,
  loading,
  alert
};

export default connect(mapStateToProps, mapActionToProps)((CreateProduct))
