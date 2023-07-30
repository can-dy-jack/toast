import { Link } from "react-router-dom";
import { Button, Result } from "antd";

export default function Page404() {
  return (
    <div style={{
      textAlign: 'center',
      height: '100vh',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      background: '#f2f4f6',
    }}>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Button type="dashed"><Link to="/">Go Home</Link></Button>}
      />
    </div>
  )
}
