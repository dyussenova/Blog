import { Alert } from 'antd';
import { useSelector } from 'react-redux';

const Error = () => {
  const errorMessage = useSelector((state) => state.list.error);
  return (
    <div className="errorMessage">
      <Alert message="Ошибка" description={errorMessage} type="error" />
    </div>
  );
};
export default Error;
