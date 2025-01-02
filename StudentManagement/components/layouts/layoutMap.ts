import AdminLayout from "./adminLayout";
import {StudentLayout} from "./studentLayout";

const layoutsMap: Record<string, React.FC<{ children: React.ReactNode }>> = {
  'admin' : AdminLayout,
  'student' : StudentLayout,
};

export default layoutsMap;
