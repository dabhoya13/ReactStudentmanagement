import LoadingGif from "../../public/Images/loading.gif";
import { GetAllNoticesWithPagination } from "@/utils/studentUtils/allNotices's";
import { NoticeProps } from "@/utils/studentUtils/studentDashboard's";
import {
  CalendarMonthOutlined,
  ChevronRightOutlined,
} from "@mui/icons-material";
import { Box } from "@mui/material";
import { format } from "date-fns";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

const AllNotices: React.FC = () => {
  const [items, setItems] = useState<NoticeProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const router = useRouter();
  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const response = await GetAllNoticesWithPagination(page);
      console.log("response", response);
      setItems((prevItems) => [...prevItems, ...response]);
    } catch (error) {
      console.error("Error loading items:", error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  // Detect when user scrolls to the bottom
  const handleScroll = () => {
    const bottom =
      document.documentElement.scrollHeight ===
      document.documentElement.scrollTop + window.innerHeight;

    if (bottom && !loading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    loadItems();
  }, [page]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  return (
    <>
      <h3 className="mb-5">Notice Board</h3>
      {items.map((item) => (
        <div
          onClick={(e) => {
            e.preventDefault();
            router.push(`/student/notice/${item.noticeId}`);
          }}
          key={item.noticeId}
          className="card board-hover mb-3"
        >
          <div className="card-body d-md-flex align-items-center justify-content-between pb-1">
            <div className="d-flex align-items-center mb-3 gap-1">
              <Box
                sx={{ marginRight: "15px" }}
                className="all_notices_icon_box"
              >
                <img
                  src={item.imageUrl}
                  alt="notice-board-img"
                  width={40}
                  height={40}
                />
              </Box>
              <div>
                <h6 className="mb-1 fw-semibold">{item.title}</h6>
                <p className="d-flex align-items-center">
                  <CalendarMonthOutlined
                    sx={{ fontSize: "15px", marginRight: 0.5 }}
                  />
                  Added on : {format(item.date, "dd MMM, yyyy")}
                </p>
              </div>
            </div>
            <div className="d-flex align-items-center mb-3">
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <ChevronRightOutlined sx={{ color: "grey" }} />
              </Box>
            </div>
          </div>
        </div>
      ))}

      {loading && (
        <Box
          className="d-flex justify-content-center align-items-center"
          sx={{ width: "100%" }}
        >
          <img
            src={LoadingGif.src}
            alt="notice-board-img"
            width={100}
            height={100}
          />
        </Box>
      )}
    </>
  );
};

export default AllNotices;
