import { 
  Breadcrumb, Layout, Form,
  Input, Button, Checkbox,
  Space, message
} from "antd";

const { Content } = Layout;

export default function Repo() {
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const onReset = () => {
    form.resetFields();
  }

  const onFinish = (values) => {
    // console.log('Success:', values);
    localStorage.setItem('toast-info', JSON.stringify(values));
    onReset();
    messageApi.open({
      type: 'success',
      content: '数据保存成功！',
    });
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Content
      style={{
        margin: "0 1rem",
      }}
    >
      {contextHolder}
      <Breadcrumb
        style={{
          margin: "16px 0",
        }}
        items={[
          {
            title: "设置",
          },
          {
            title: "仓库地址",
          },
        ]}
      ></Breadcrumb>

      <Layout
        style={{
          padding: 24,
          height: "calc(100vh - 7.5rem)",
          overflow: "auto",
          background: "#fff",
          borderRadius: "0.5rem",
          boxShadow: "0 0 0.5rem rgba(1px, 2px, 0, 0.09)",
        }}
      >
        <Form
          form={form}
          name="basic"
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 12,
          }}
          style={{
            width: 600,
            margin: "auto",
          }}
          initialValues={{
            remember: true,
            cdn: true
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="用户名"
            name="username"
            rules={[
              {
                required: true,
                message: "用户名必填!",
              },
            ]}
          >
            <Input placeholder="用户名" />
          </Form.Item>

          <Form.Item
            label="仓库名"
            name="repo"
            rules={[
              {
                required: true,
                message: "仓库名必填!",
              },
            ]}
          >
            <Input placeholder="仓库名" />
          </Form.Item>

          <Form.Item
            label="token"
            name="token"
            rules={[
              {
                required: true,
                message: "token必填!",
              },
            ]}
          >
            <Input placeholder="token" />
          </Form.Item>

          <Form.Item
            label="分支名"
            name="branch"
          >
            <Input placeholder="默认master" />
          </Form.Item>

          <Form.Item
            name="cdn"
            valuePropName="checked"
            wrapperCol={{
              offset: 4,
              span: 12,
            }}
          >
            <Checkbox>JSDELIVR CDN加速</Checkbox>
          </Form.Item>

          <Form.Item
            name="remember"
            valuePropName="checked"
            wrapperCol={{
              offset: 4,
              span: 12,
            }}
          >
            <Checkbox>保存仓库信息</Checkbox>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 6,
              span: 16,
            }}
          >
            <Space.Compact block>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
            <Button htmlType="button" onClick={onReset}>
              重置表单
            </Button>
            </Space.Compact>
          </Form.Item>
        </Form>
      </Layout>
    </Content>
  );
}
