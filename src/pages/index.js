import { useEffect, useMemo, useState } from "react";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import usePost from "@/utils/hooks/usePost";
import useComment from "@/utils/hooks/useComment";
import CommentsLengthChart from "@/components/commentsLengthChart";
import CommentsOriginChart from "@/components/commentsOriginChart";
import { useTranslation } from "next-i18next";
import Switch from "@/components/input/switch";

export default function Home() {
  const { i18n } = useTranslation("common")
  const [post, setPost] = useState(undefined);
  const [isZh, setIsZh] = useState(i18n.language === "zh");
  
  const handlePostClick = (event) => {
    setPost(event.data)
  };

  const clearPost = () => {
    setPost(undefined)
  }

  const changeLanguage = () => {
    const newLang = isZh ? "en" : "zh";
    i18n.changeLanguage(newLang);
    setIsZh(!isZh);
  }

  return (
    <div style={{ height: "100vh", width: "100vw", display: "flex", flexDirection: "column" }}>
      <div style={{ height: "5%", padding: "4px", display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "beige" }}>
        <span>Next JS Application by Jaypee Tan</span>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <span>{isZh ? "Simplified Chinese" : "English"}</span>
          <Switch handleOnChange={changeLanguage} isChecked={isZh}/>
        </div>
      </div>
      <div style={{ height: "95%", width: "100vw", display: "flex", gap: "12px" }}>
        <PostsContainer post={post} handlePostClick={handlePostClick} />
        { post && <CommentsContainer post={post} clearPost={clearPost}/> }
      </div>
    </div>
  );
}

const PostsContainer = ({post,  handlePostClick}) => {
  const { t, i18n } = useTranslation("common")
  const { posts } = usePost()
  const rowData = useMemo(() => posts, [posts]);
  const [columnDefs, setColumnDefs] = useState([]);

  useEffect(() => {
    setColumnDefs([
      { headerName: t("Id"), field: "id", sortable: false, filter: false, width: "100px" },
      { headerName: t("Title"), field: "title", sortable: false, filter: false, width: "300px" },
      { headerName: t("Body"), field: "body", sortable: false, filter: false, width: "500px" }
    ]);
  }, [t, i18n.language]);

  return (
    <div className="ag-theme-alpine" style={{ height: "95%", width: post ? "50%" : "100%" }}>
      <div style={{ height: "5%", display: "flex", alignItems: "center", padding: "12px 4px" }}>
        <span style={{ fontSize: "16px" }}>Post list</span>
      </div>
      <AgGridReact
        columnDefs={columnDefs}
        rowData={rowData}
        pagination={true}
        paginationPageSize={20}
        onRowClicked={handlePostClick}
        rowSelection="single"
      />
    </div>
  )
}

const CommentsContainer = ({post, clearPost}) => {
  const { t, i18n } = useTranslation("common")
  const { comments } = useComment(post.id)
  const [columnDefs, setColumnDefs] = useState([]);
  const rowData = useMemo(() => comments.map(comment => ({
    ...comment,
    domain: comment.email.split('@')[1] // Extract domain from email
  })), [comments]);

  const uniqueDomains = [...new Set(comments.map(c => c.email.split('@')[1]))];

  useEffect(() => {
    setColumnDefs([
      { headerName: t("Id"), field: "id", sortable: true, filter: false, width: "100px" },
      { headerName: t("Name"), field: "name", sortable: true, filter: true, width: "300px" },
      { headerName: t("Email"), field: "email", sortable: true, filter: true, width: "300px" },
      { headerName: t("Domain"), field: "domain", sortable: true, filter: true, width: "200px" },
      { headerName: t("Body"), field: "body", sortable: true, filter: true, width: "500px" }
    ]);
  }, [t, i18n.language]);

  return (
    <div style={{ height: "90%", width: "50%" }}>
      <div style={{height: "55px", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0px 4px"}}>
        <span style={{ fontSize: "16px" }}>Comments</span>
        <span style={{ margin: "0px 16px", cursor: "pointer" }} onClick={clearPost}>X</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", marginBottom: "12px", padding: "0px 4px" }}>
        <span style={{ fontSize: "14px" }}>Post: {`${post.title}`}</span>
        <span style={{ fontSize: "12px" }}>Body: {`${post.body}`}</span>
      </div>
      <div className="ag-theme-alpine" style={{ height: "30%", width: "100%" }}>
        <AgGridReact
          columnDefs={columnDefs}
          rowData={rowData}
          pagination={true}
          paginationPageSize={20}
        />
      </div>
      <div style={{padding: "4px"}}>
        <div style={{marginBottom: "12px"}}>
          <span>Stats</span>
        </div>
        <div style={{display: "flex", flexDirection: "column"}}>
          <span style={{ fontSize: "14px" }}>Comments Length</span>
          <CommentsLengthChart comments={comments} />
        </div>
        <div style={{display: "flex", flexDirection: "column"}}>
          <span style={{ fontSize: "14px" }}>Comments Origin</span>
          <CommentsOriginChart comments={comments} />
        </div>
      </div>
    </div>
  )
}

export async function getStaticProps ({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}