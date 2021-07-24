import React, { Component } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { withStyles } from "@material-ui/core/styles";
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
//import API from '../Utility/Api';
import { Grid, CardContent, Card, CardActionArea, CardMedia } from '@material-ui/core';
//import {KeyboardArrowLeft,KeyboardArrowRight} from '@material-ui/icons';
import cartHelper from '../../Helper/cartHelper'

const Styles = theme => ({
  card: {
    height: '100%',
    width: '100%',
    boxSizing: 'border-box',
    border: '1px solid #e0e0e0'
  },
  media: {
    width: 120,
    height: 80,
    backgroundSize: 'contain'
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  avatar: {
    fontSize: 14,
    background: '#f60808',
    width: 35,
    height: 35,
    fontWeight: 'bold',
    position: 'absolute',
    right: 16,
    top: 14

  }, cardcontent: {
    paddingbottom: 2,
  },
  CardActionArea: {
    minHeight: 170,
  }
});


class RecomdedProduct extends Component {
  constructor(props) {
    super(props)
    this.state = {
      responsive: {
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 5,
          slidesToSlide: 5, // optional, default to 1.
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 3,
          slidesToSlide: 3, // optional, default to 1.
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1,
          slidesToSlide: 1, // optional, default to 1.
        },
      },
      Customdata: [],
      selectdata: [],
      multirows: false
    }
  }

  componentDidMount() {
    if (this.props.multirows !== undefined && this.props.multirows) {
      var i = 0;
      var multirowsItems = [];
      var items = [];
      this.props.products.forEach((product, index) => {
        if (i === 0) {
          multirowsItems.push(items);
        }
        items[i] = product
        ++i;
        if (items.length === this.props.row) {
          items = [];
          i = 0;
        }
      });

      this.setState({
        multirows: true,
        Customdata: multirowsItems
      })

    } else {
      this.setState({
        Customdata: this.props.products
      })
    }
  }

  productData = (data) => {
    this.props.AddToCart(data);
  }


  getDataForCarousel = () => {
    var carouselData = {}
    if (this.props.multirows !== undefined && this.props.multirows) {
      var i = 0;
      var multirowsItems = [];
      var items = [];
      this.props.products.forEach((product, index) => {
        if (i === 0) {
          multirowsItems.push(items);
        }
        items[i] = product
        ++i;
        if (items.length === this.props.row) {
          items = [];
          i = 0;
        }
      });

      carouselData.multirows = true;
      carouselData.Customdata = multirowsItems;

      // this.setState({
      //   multirows:true,
      //   Customdata:multirowsItems
      // })

    } else {
      carouselData.multirows = false;
      carouselData.Customdata = this.props.products;
    }
    return carouselData;
  }





  render() {
    const { classes, title, AddToCart } = this.props;
    //const { Customdata,multirows } = this.state;
    var carouselData = this.getDataForCarousel()
    var Customdata = carouselData.Customdata
    //var multirows = carouselData.multirows

    return (
      <>
        {Customdata !== undefined && Customdata.length !== 0 ?
          <div>
            {title ?
              <Box pl={1} pr={1} pt={2}>
                <Typography p={1} component="span" variant="h6" display="block" align="left">{title}</Typography>
              </Box>
              : null}
            <Carousel
              dditionalTransfrom={10000}
              arrows
              autoPlaySpeed={1000}
              centerMode={false}
              containerClass="carousel-container"
              draggable={true}
              deviceType={this.props.deviceType}
              dotListClass="custom-dot-list-style"
              focusOnSelect={false}
              infinite={false}
              itemClass="carousel-item-padding-40-px"
              minimumTouchDrag={80}
              keyBoardControl
              transitionTime={600}
              transitionDuration={100}
              renderDotsOutside={false}
              removeArrowOnDeviceType={["tablet", "mobile"]}
              responsive={this.state.responsive}
            //customLeftArrow={<KeyboardArrowLeft />}
            //customRightArrow={<KeyboardArrowRight />}
            >

              {Customdata.map((data, index) => (

                <Box key={index} p={1}>
                    <Card className={classes.card}>
                      <CardActionArea onClick={() => { AddToCart(data) }} className={classes.CardActionArea}>
                        <Grid container direction="row" justify="center" alignItems="center">
                          <Grid item>
                            <Box p={1}>
                              {data.image &&
                                <CardMedia
                                  className={classes.media}
                                  image={data.image}
                                  title={data.title}
                                />
                              }
                            </Box>
                          </Grid>
                          {/* <Grid item xs={2}>
                              <Avatar aria-label="recipe" className={classes.avatar}>
                              {data.discount}%
                              </Avatar>
                            </Grid> */}
                        </Grid>
                        <CardContent className="padding-0">
                          <Grid container direction="row" className={classes.cardcontent}>
                            <Grid item xs={12}>
                              <Typography variant="caption" display="block" gutterBottom color="textSecondary" align="center" className="font-weight-900">
                                {data.title}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="caption" display="block" gutterBottom color="textSecondary" align="center">
                                {/* {data.barcode} */}334543654
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="subtitle2" display="block" gutterBottom align="center">
                                {/* {cartHelper.getPriceFromPrices(data)} */}
                                {cartHelper.getCurrencyFormatted(data.price)}
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                </Box>
              ))}
            </Carousel>
          </div>
          :
          null
        }

      </>
    );
  }


}

export default withStyles(Styles)(RecomdedProduct);