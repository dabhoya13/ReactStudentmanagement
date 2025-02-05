import { Box } from "@mui/material";
import DemoImg from "../../../public/Images/Annual-Day-pic.jpg";
import { ChevronLeft } from "@mui/icons-material";
import { useEffect, useState } from "react";
import LoadingGif from "../../../public/Images/Animation.gif";
import { GetNoticeByNoticeId } from "@/utils/studentUtils/allNotices's";
import { useRouter } from "next/router";
import { NoticeProps } from "@/utils/studentUtils/studentDashboard's";
import { format } from "date-fns";

const Notice: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [noticeData, setNoticeData] = useState<NoticeProps>();
  const router = useRouter();
  const { noticeId } = router.query;
  useEffect(() => {
    const fetchNotice = async () => {
      if (typeof noticeId === "string") {
        const parsedNoticeId = parseInt(noticeId, 10);
        const notice: NoticeProps | null = await GetNoticeByNoticeId(
          parsedNoticeId
        );
        if (notice != null) setNoticeData(notice);
      } else {
        console.error("Invalid or missing noticeId");
      }
    };
    try {
      setLoading(true);
      fetchNotice();
    } catch (ex) {
      throw ex;
    } finally {
      setLoading(false);
    }
  }, [noticeId]);

  return (
    <>
      {loading && (
        <Box className="loading-spinner">
          <img src={LoadingGif.src} alt="loading-gif" />
        </Box>
      )}
      <div className="notice-info-main container-lg">
        <div className="title-div page-title-block">
          <div className="d-flex">
            <a
              onClick={() => window.history.back()}
              id="backLink"
              asp-controller="Home"
              className="mt-2 me-2 d-flex align-items-center"
            >
              <ChevronLeft />
            </a>
            <h1 className="notice-title" id="title">
              {noticeData?.title}
            </h1>
          </div>
          <label style={{ color: "#666" }} className="ml-5 mt-3">
            Date:{" "}
            {noticeData?.date ? format(noticeData?.date, "dd MMM, yyyy") : ""}
          </label>
        </div>
        <Box
          className="notice-img-div mt-4"
          sx={{
            // backgroundImage: `url('https://localhost:7199/NoticeImages/annual-Day.jpg')`,
            backgroundImage: `url(${noticeData?.imageUrl}) !important`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></Box>
        <div className="content-div" id="description">
          <p id="description1" style={{ fontWeight: "bold" }}>
            {noticeData?.shortDescription}
          </p>
          <br />
          <h5>{noticeData?.longDescription}</h5>
        </div>
      </div>
    </>
  );
};

export default Notice;
