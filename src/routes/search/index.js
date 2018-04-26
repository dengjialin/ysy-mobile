import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'dva';
import styles from './index.less';
import Main from '../../components/layout/main.js';

@connect()
export default class Search extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired
  };

  render() {
    const {location} = this.props;
    return (
      <Main location={location}>
        <div className={styles.normal}>
          Route Component: Search
        </div>
      </Main>
    )
  }
}
