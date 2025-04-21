import { Flex, Spin } from 'antd';
import classes from './spiner.module.scss';

const Spinner = () => {
  return (
    <Flex align="center" justify="center" className={classes.spin}>
      <Spin size="large" />
    </Flex>
  );
};
export default Spinner;
