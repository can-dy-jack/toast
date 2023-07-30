import { Layout, Tree, Row, Col, Image, message } from "antd";
import { Octokit } from "octokit";
import { useCallback, useMemo, useEffect, useState } from "react";
import { fileType } from "../utils/fileType";

const { Content } = Layout;
const { DirectoryTree } = Tree;

function arr2Tree(arr, pid) {
  let tree = [];
  arr.forEach((item) => {
    if (item.pid === pid) {
      item.children = arr2Tree(arr, item.id);
      tree.push(item);
    }
  });
  return tree;
}

export default function Home() {
  const [treeData, setTreeData] = useState([]);
  const [imgURL, setImgURL] = useState("");
  const [currentImg, setcurrentImg] = useState("");
  const [toast, setToast] = useState({});

  const [messageApi, contextHolder] = message.useMessage();

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

  let rootURL = useMemo(() => {
    return `https://cdn.jsdelivr.net/gh/${toast.username}/${toast.repo}@${toast.branch}/`
  }, [toast]);

  const getDirs = useCallback(async () => {
    if (Object.keys(toast).length === 0) return;
    const Token = toast.token;
    const ajax = new Octokit({
      Token: Token,
    });

    let data = await ajax.request(
      `GET /repos/${toast.username}/${toast.repo}/git/trees/${toast.branch}?recursive=1`,
      {
        owner: toast.username,
        repo: toast.repo,
        tree_sha: toast.branch,
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );
    return data;
  }, [toast]);

  useEffect(() => {
    if (Object.keys(toast).length === 0) return;
    getDirs().then((res) => {
      let arrs = res.data.tree.map((item) => {
        let path = item.path.split("/");
        item.pid = path[path.length - 2] || "root";
        if (item.pid !== "root") {
          item.isLeaf = true;
        }
        item.id = path[path.length - 1];
        item.key = path[path.length - 1];
        item.title = path[path.length - 1];
        item.children = [];
        return item;
      });
      let ans = arr2Tree(arrs, "root");
      ans.forEach((item) => {
        if (item.children.length === 0) {
          item.isLeaf = true;
        }
      });
      setTreeData(ans);
    });
  }, [getDirs, toast]);

  const onSelect = (_, info) => {
    let id_split = info.node.id.split(".");
    let isImg = fileType.image.includes(id_split[id_split.length - 1]);
    if (info.node.isLeaf && isImg) {
      setImgURL(rootURL + info.node.path);
      setcurrentImg(info.node.id);
    }
  };

  const handleOnLoad = () => {
    console.log("loading~~~");
  };

  return (
    <Content
      style={{
        margin: "1rem",
        fontSize: 16,
      }}
    >
      {contextHolder}
      <Row
        style={{
          padding: 24,
          height: "calc(100vh - 6rem)",
          overflow: "auto",
          background: "#fff",
          borderRadius: "0.5rem",
          boxShadow: "0 0 0.5rem rgba(1px, 2px, 0, 0.09)",
        }}
        gutter={[16, 16]}
      >
        {Object.keys(toast).length > 0 ? (
          <>
            <Col
              span={6}
              style={{
                maxHeight: "100%",
                overflow: "auto",
              }}
            >
              <div>
                <DirectoryTree
                  multiple
                  defaultExpandAll
                  onSelect={onSelect}
                  // onExpand={onExpand}
                  treeData={treeData}
                />
              </div>
            </Col>
            <Col span={18}>
              <div className="center-col">
                {imgURL && (
                  <div
                    style={{
                      maxHeight: "460px",
                      maxWidth: "460px",
                      textAlign: "center",
                    }}
                  >
                    <Image
                      width="auto"
                      height="100%"
                      style={{
                        objectFit: "contain",
                      }}
                      src={imgURL}
                      fallback={fileType.errorImg}
                      onLoad={handleOnLoad}
                    />
                  </div>
                )}
                <div>{currentImg}</div>
              </div>
            </Col>
          </>
        ) : (
          <>暂无内容</>
        )}
      </Row>
    </Content>
  );
}
