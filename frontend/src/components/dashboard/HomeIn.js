import React, { useState, useEffect } from 'react';

import { Container, Form, Row, Col } from 'react-bootstrap';
import { Line, Polar } from 'react-chartjs-2';
import { getSales, resetSales, getStatitics } from '../../actions/invoice';
import CurrencyFormat from 'react-currency-format';
import { connect } from 'react-redux';

var moment = require('moment');

function HomeIn(props) {
  const [filter, setFilter] = useState(0);

  useEffect(() => {
    switch (parseInt(filter)) {
      case 0:
      case 1:
        props.getSales('last_week');
        break;
      case 2:
        props.getSales('last_month');
        break;
      case 3:
        props.getSales('last_4week');
        break;
      case 4:
        props.getStatitics('last_month');
        break;
      case 5:
        props.getStatitics('last_2week');
        break;
      case 6:
        props.getStatitics('last_week');
        break;
      case 7:
        props.getStatitics('today');
        break;
      default:
        break;
    }
  }, [filter])

  const onChange = (e) => {
    setFilter(e.target.value)
  };

  useEffect(() => {
    props.getSales('last_week');
    return () => {
      props.resetSales();
    };
  }, []);

  let { sales, statitics } = props;
  sales = sales.sort(function (a, b) {
    if (b.date > a.date) {
      return -1;
    }
    if (a.date > b.date) {
      return 1;
    }
    return 0;
  });
  const min = 0,
    max = 255;
  let typeChar = filter < 4 ? 0 : 1;
  let list = filter < 4 ? sales : statitics;
  let colors = list.map(
    (item) =>
      `rgba(${Math.random() * (max - min) + min}, ${Math.random() * (max - min) + min}, ${
        Math.random() * (max - min) + min
      }, 0.5)`
  );
  const data =
    typeChar == 0
      ? {
          labels: list.map(
            (item) =>
              moment(item.date).locale('es').format('ddd DD') +
              '-' +
              ((item.util / item.total) * 100).toFixed(0) +
              '%'
          ),
          datasets: [
            {
              label: 'Ventas',
              data: props.sales.map((item) => item.total),
              backgroundColor: 'rgba(144, 223, 144, 0.5)',
              lineTension: 0.15,
            },
            {
              label: 'Ganancia',
              data: props.sales.map((item) => item.util),
              backgroundColor: 'rgba(255, 99, 71, 0.5)',
              lineTension: 0.15,
            },
          ],
        }
      : {
          labels: list.map((item) => item.product__category__name),
          datasets: [
            {
              label: 'Ventas',
              data: list.map((item) => item.total),
              backgroundColor: colors,
            },
            {
              label: 'Ganancia',
              data: list.map((item) => parseInt(item.util)),
              backgroundColor: colors,
            },
          ],
          borderWidth: 1,
        };
  const options =
    typeChar === 0
      ? {
          responsive: true,
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        }
      : { responsive: true };
  const total = list.reduce(function (a, b) {
    return a + b.total;
  }, 0);
  const util = list.reduce(function (a, b) {
    return a + b.util;
  }, 0);
  return (
    <Container className='pt-2'>
      <Row>
        <Col>
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
            name='filter'
            value={filter}
            onChange={onChange}>
            <option value={1}>Ultimos 7 días</option>
            <option value={2}>Ultimos 30 días</option>
            <option value={3}>Ultimas 4 semanas</option>
            <option value={4}>Por categorias último 30 días</option>
            <option value={5}>Por categorias último 15 días</option>
            <option value={6}>Por categorias último 7 días</option>
            <option value={7}>Por categorias actual</option>
          </Form.Control>
        </Col>
      </Row>

      {typeChar === 0 ? (
        <Line data={data} options={options} />
      ) : (
        <Polar data={data} options={options} />
      )}
    </Container>
  );
}

const mapStateToProps = (state) => ({
  sales: state.invoice.sales,
  statitics: state.invoice.statitics,
});

export default connect(mapStateToProps, {
  getSales,
  getStatitics,
  resetSales,
})(HomeIn);
