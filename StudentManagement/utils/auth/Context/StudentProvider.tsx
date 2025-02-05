import {
  GetStudentDetailsById,
  StudentDataProps,
} from "@/utils/adminUtils/allStudent's";
import { BlobOptions } from "buffer";
import { createContext, useContext, useEffect, useState } from "react";

interface StudentContextType {
  studentData: StudentDataProps | null;
  isLoading: boolean;
  error: string | null;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const useStudentContext = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error("useStudentContext must be used within a StudentProvider");
  }
  return context;
};

export const StudentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [studentData, setStudentData] = useState<StudentDataProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      const studentId = parseInt(sessionStorage.getItem("UserId") ?? "0", 10);
      try {
        const student = await GetStudentDetailsById(studentId);
        console.log(student);
        setStudentData(student);
      } catch (err) {
        setError("Failed to fetch student details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudentDetails();
  }, []);

  return (
    <StudentContext.Provider value={{ studentData, error, isLoading }}>
      {children}
    </StudentContext.Provider>
  );
};
