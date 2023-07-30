import { Layout, message, Modal, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useState } from "react";
import { getBase64, fileType } from "../utils/fileType";
import { Octokit } from "octokit";

const { Content } = Layout;

export default function UploadPage() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const [toast, setToast] = useState({});
  const [messageApi, contextHolder] = message.useMessage();

  const handleCancel = () => setPreviewOpen(false);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };
  const beforeUpload = (file) => {
    let name =  file.name.split(".")
    const isImg = fileType.image.includes(name[name.length - 1]);
    if (!isImg) {
      message.error(`${file.name} is not a png file`);
    }
    return isImg || Upload.LIST_IGNORE;
  };
  const uploadFile  = useCallback(async ({ file, onSuccess, onError }) => {
    if (Object.keys(toast).length === 0) return;
    const octokit = new Octokit({
      auth: toast.token,
    })

    const filetype = file.name.split(".").reverse()[0];
    const filename = new Date().getTime() + Math.random().toFixed(2)*100 + '.' + filetype;
    const content = await getBase64(file);

    await octokit.request(`put /repos/${toast.username}/${toast.repo}/contents/${filename}`, {
      message: `upload：${filename}`,
      content: content.replace(/^data:image\/\w+;base64,/, ""),
      branch: toast.branch,
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    }).then(res => {
      onSuccess(res.content)
    }).catch(onError)
  }, [toast]);
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  useEffect(() => {
    const toastInfo = localStorage.getItem("toast-info");

    if (toastInfo) {
      setToast(JSON.parse(toastInfo));
    } else {
      messageApi.open({
        type: "warning",
        content: "请先去设置github仓库信息！",
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  return (
    <Content
      style={{
        margin: "1rem",
      }}
    >
      {contextHolder}
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
        <Upload
          customRequest={uploadFile}
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          beforeUpload={beforeUpload}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal
          open={previewOpen}
          title={previewTitle}
          footer={null}
          onCancel={handleCancel}
        >
          <img
            alt="example"
            style={{
              width: "100%",
            }}
            src={previewImage}
          />
        </Modal>
      </Layout>
    </Content>
  );
}
