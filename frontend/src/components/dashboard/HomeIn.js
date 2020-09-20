import React, { Component } from 'react';

import { Container, Form, Row, Col } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { getSales, resetSales } from '../../actions/invoice';
import CurrencyFormat from 'react-currency-format';
import { connect } from 'react-redux';

var moment = require('moment');

export class HomeIn extends Component {
  state = {
    filter: 0,
  };

  onChange = (event) => {
    let { name, value } = event.target;
    this.setState({ [name]: value }, () => {
      console.log(name + ' ' + value);
      if (name === 'filter') {
        switch (parseInt(value)) {
          case 0:
          case 1:
            console.log('ultima semana');
            this.props.getSales('last_week');
            break;
          case 2:
            console.log('ultimo mes');
            this.props.getSales('last_month');
            break;
          default:
            break;
        }
      }
    });
  };

  componentDidMount() {
    this.props.getSales('last_week');
  }

  componentWillUnmount() {
    this.props.resetSales();
  }

  render() {
    const data = {
      labels: this.props.sales.map(
        (item) =>
          moment(item.date).locale('es').format('ddd DD') +
          '-' +
          ((item.util / item.total) * 100).toFixed(0) +
          '%'
      ),
      datasets: [
        {
          label: 'Ventas',
          data: this.props.sales.map((item) => item.total),
          backgroundColor: 'rgba(144, 223, 144, 0.5)',
          lineTension: 0.15,
        },
        {
          label: 'Ganancia',
          data: this.props.sales.map((item) => item.util),
          backgroundColor: 'rgba(255, 99, 71, 0.5)',
          lineTension: 0.15,
        },
      ],
    };
    const options = {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    };
    const total = this.props.sales.reduce(function (a, b) {
      return a + b.total;
    }, 0);
    const util = this.props.sales.reduce(function (a, b) {
      return a + b.util;
    }, 0);
    return (
      <Container className='pt-2'>
        <Row>
          <Col >
            <span>
              Total:
              <CurrencyFormat
                value={total.toFixed(0)}
                displayType={'text'}
                thousandSeparator={true}
                prefix={'$'}
              />
            </span>
            <br />
            <span>
              Utilidad:
              <CurrencyFormat
                value={util.toFixed(0)}
                displayType={'text'}
                thousandSeparator={true}
                prefix={'$'}
              />
            </span>
          </Col>
          <Col>
            <Form.Control
              as='select'
              defaultValue={0}
              name='filter'
              value={this.state.filter}
              onChange={this.onChange}>
              <option value={1}>Ultimos 7 días</option>
              <option value={2}>Ultimos 30 días</option>
            </Form.Control>
          </Col>
        </Row>

        <Line data={data} options={options} />
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  sales: state.invoice.sales,
});

export default connect(mapStateToProps, {
  getSales,
  resetSales,
})(HomeIn);
