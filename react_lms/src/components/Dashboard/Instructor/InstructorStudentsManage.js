// import styled from "styled-components";
// import React, { useContext, useEffect, useState } from "react";
// import { AuthContext } from "../../../AuthContext";
// import {
//   apiGetCourseHistroiesByCourse,
//   apiGetCompletedContentHistories,
//   apiGetMyExamResult,
//   apiGetContentHistoriesByCourse,
// } from "../../RestApi";

// const Container = styled.div`
//   color: #454545;
// `;
// const Course = styled.div`
//   display: flex;
//   justify-content: space-around;
//   background-color: #f3f3f3;
//   padding: 1rem;
//   margin-bottom: 1rem;
//   border-radius: 10px;
// `;
// const Select = styled.select`
//   padding: 10px;
//   margin: 1rem 0;
//   border-radius: 5px;
//   border: 1px solid #ccc;
//   background-color: #fff;
//   cursor: pointer;
// `;
// const UserTable = styled.div``;
// const Th = styled.th`
//   border: 1px solid #ddd;
//   padding: 8px;
// `;
// const Td = styled.td`
//   border: 1px solid #ddd;
//   padding: 8px;
// `;
// const DetailTable = styled.div``;

// export function InstructorStudentsManage() {
//   const { user } = useContext(AuthContext);
//   const courses = user.teachingCourses;
//   const [courseHistories, setCourseHistories] = useState([]);
//   const [selectedCourseId, setSelectedCourseId] = useState(null);
//   const [examResults, setExamResults] = useState([]);
//   const selectedCourse = courses.find(
//     (course) => course.courseId === parseInt(selectedCourseId)
//   );

//   useEffect(() => {
//     const fetchCourseAndContentHistories = async () => {
//       if (!selectedCourseId) return;

//       const courseHistoriesResponse = await apiGetCourseHistroiesByCourse(
//         selectedCourseId
//       );
//       const courseHistoriesData = courseHistoriesResponse.data.data;

//       setCourseHistories(courseHistoriesData);

//       const newExamResults = [];

//       for (const courseHistory of courseHistoriesData) {
//         const memberId = courseHistory.member.memberId;

//         const completedContentHistoriesResponse =
//           await apiGetCompletedContentHistories(memberId);
//         const completedContentCount =
//           completedContentHistoriesResponse.data.data.length;

//         // 해당 강의의 contentHistory를 조회
//         const contentHistoriesResponse = await apiGetContentHistoriesByCourse(
//           selectedCourseId
//         );
//         console.log("contentHistoriesResponse:", contentHistoriesResponse); // 응답 데이터 확인
//         const contentHistoriesData = contentHistoriesResponse.data.data;

//         // 해당 학생의 강의 진행율 계산
//         const totalContents = contentHistoriesData.length;
//         console.log("totalContents:", totalContents); // totalContents 값 확인
//         const completedContents = contentHistoriesData.filter(
//           (contentHistory) => contentHistory.isCompleted
//         ).length;
//         const progressRate = (completedContents / totalContents) * 100;

//         const examResultResponse = await apiGetMyExamResult(memberId);
//         const examResultData = examResultResponse.data.data;

//         newExamResults.push({
//           memberId: memberId,
//           examResults: examResultData,
//           completedContentCount: completedContentCount,
//           progressRate: progressRate,
//         });
//       }

//       setExamResults(newExamResults);
//     };

//     fetchCourseAndContentHistories();
//   }, [selectedCourseId]);

//   const handleSelectChange = (e) => {
//     setSelectedCourseId(e.target.value);
//   };

//   return (
//     <>
//       <Container>
//         <h1>학생 관리</h1>
//         <Select onChange={handleSelectChange}>
//           <option value="">강의 선택</option>
//           {courses.map((course) => (
//             <option key={course.courseId} value={course.courseId}>
//               {course.courseName}
//             </option>
//           ))}
//         </Select>
//         <Course>
//           <p>{selectedCourse ? selectedCourse.subject?.subjectName : null}</p>
//           <p>
//             {selectedCourse
//               ? selectedCourse.courseName
//               : "강의를 선택해주세요."}
//           </p>
//           <p>
//             {selectedCourse
//               ? "총 강의 시간: " + selectedCourse.durationMins + "분"
//               : null}
//           </p>
//           <p>
//             {selectedCourse ? "총 수강자 수: " + courseHistories.length : null}
//           </p>
//         </Course>
//         <UserTable>
//           <thead>
//             <tr>
//               <Th>학생 이름</Th>
//               <Th>성별</Th>
//               <Th>수료증</Th>
//               <Th>강의 진도율</Th>
//               <Th>과제율</Th>
//             </tr>
//           </thead>
//           <tbody>
//             {courseHistories.map((courseHistory) => {
//               const memberId = courseHistory.member.memberId;

//               const studentInfo = examResults.find(
//                 (result) => result.memberId === memberId
//               );

//               const studentCompletedContentCount =
//                 studentInfo?.completedContentCount || 0;

//               // 수정된 부분: selectedCourse가 존재하고 totalContents가 존재하는 경우에만 totalContents 값을 사용
//               const totalContents = selectedCourse?.totalContents || 0;

//               const progressRate =
//                 totalContents > 0
//                   ? (studentCompletedContentCount / totalContents) * 100
//                   : 0;

//               const studentExamResult = studentInfo;

//               return (
//                 <tr key={courseHistory.courseHistoryId}>
//                   <Td>{courseHistory.member.name}</Td>
//                   <Td>{courseHistory.member.gender}</Td>
//                   <Td>{courseHistory.contentStatus ? "완료" : "미완료"}</Td>
//                   <Td>{progressRate.toFixed(2)} %</Td>
//                   <Td>
//                     {studentExamResult
//                       ? `${studentExamResult.examResults.length} %`
//                       : "0 %"}
//                   </Td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </UserTable>
//         <DetailTable>
//           <p>컨텐트 디테일</p>
//           <div>학생명</div>
//           <div>진도율 상세</div>
//         </DetailTable>
//       </Container>
//     </>
//   );
// }

import styled from "styled-components";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../AuthContext";
import {
  apiGetCourseHistroiesByCourse,
  apiGetCompletedContentHistories,
  apiGetMyExamResult,
  apiGetContentByCourse, // 변경된 부분: apiGetContentHistoriesByCourse 대신 apiGetContentByCourse 사용
} from "../../RestApi";

const Container = styled.div`
  color: #454545;
`;
const Course = styled.div`
  display: flex;
  justify-content: space-around;
  background-color: #f3f3f3;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 10px;
`;
const Select = styled.select`
  padding: 10px;
  margin: 1rem 0;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #fff;
  cursor: pointer;
`;
const UserTable = styled.div``;
const Th = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
`;
const Td = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;
const DetailTable = styled.div``;

export function InstructorStudentsManage() {
  const { user } = useContext(AuthContext);
  const courses = user.teachingCourses;
  const [courseHistories, setCourseHistories] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [examResults, setExamResults] = useState([]);
  const [totalContents, setTotalContents] = useState(0); // 변경된 부분: totalContents 상태 추가

  const selectedCourse = courses.find(
    (course) => course.courseId === parseInt(selectedCourseId)
  );

  useEffect(() => {
    const fetchCourseAndContentHistories = async () => {
      if (!selectedCourseId) return;

      const courseHistoriesResponse = await apiGetCourseHistroiesByCourse(
        selectedCourseId
      );
      const courseHistoriesData = courseHistoriesResponse.data.data;

      setCourseHistories(courseHistoriesData);

      const contentResponse = await apiGetContentByCourse(selectedCourseId); // 변경된 부분: 해당 강의의 컨텐츠 가져오기
      const contentData = contentResponse.data.data;
      setTotalContents(contentData.length); // 변경된 부분: 강의의 컨텐츠 개수 설정

      const newExamResults = [];

      for (const courseHistory of courseHistoriesData) {
        const memberId = courseHistory.member.memberId;

        const completedContentHistoriesResponse =
          await apiGetCompletedContentHistories(memberId);
        const completedContentCount =
          completedContentHistoriesResponse.data.data.length;

        const progressRate = (completedContentCount / totalContents) * 100; // 변경된 부분: totalContents 사용

        const examResultResponse = await apiGetMyExamResult(memberId);
        const examResultData = examResultResponse.data.data;

        newExamResults.push({
          memberId: memberId,
          examResults: examResultData,
          completedContentCount: completedContentCount,
          progressRate: progressRate,
        });
      }

      setExamResults(newExamResults);
    };

    fetchCourseAndContentHistories();
  }, [selectedCourseId, totalContents]); // 변경된 부분: totalContents를 의존성 배열에 추가

  const handleSelectChange = (e) => {
    setSelectedCourseId(e.target.value);
  };

  return (
    <>
      <Container>
        <h1>학생 관리</h1>
        <Select onChange={handleSelectChange}>
          <option value="">강의 선택</option>
          {courses.map((course) => (
            <option key={course.courseId} value={course.courseId}>
              {course.courseName}
            </option>
          ))}
        </Select>
        <Course>
          <p>{selectedCourse ? selectedCourse.subject?.subjectName : null}</p>
          <p>
            {selectedCourse
              ? selectedCourse.courseName
              : "강의를 선택해주세요."}
          </p>
          <p>
            {selectedCourse
              ? "총 강의 시간: " + selectedCourse.durationMins + "분"
              : null}
          </p>
          <p>
            {selectedCourse ? "총 수강자 수: " + courseHistories.length : null}
          </p>
        </Course>
        <UserTable>
          <thead>
            <tr>
              <Th>학생 이름</Th>
              <Th>성별</Th>
              <Th>수료증</Th>
              <Th>강의 진도율</Th>
              <Th>과제율</Th>
            </tr>
          </thead>
          <tbody>
            {courseHistories.map((courseHistory) => {
              const memberId = courseHistory.member.memberId;

              const studentInfo = examResults.find(
                (result) => result.memberId === memberId
              );

              const studentCompletedContentCount =
                studentInfo?.completedContentCount || 0;

              const progressRate =
                totalContents > 0
                  ? (studentCompletedContentCount / totalContents) * 100
                  : 0;

              const studentExamResult = studentInfo;

              return (
                <tr key={courseHistory.courseHistoryId}>
                  <Td>{courseHistory.member.name}</Td>
                  <Td>{courseHistory.member.gender}</Td>
                  <Td>{courseHistory.contentStatus ? "완료" : "미완료"}</Td>
                  <Td>{progressRate.toFixed(2)} %</Td>
                  <Td>
                    {studentExamResult
                      ? `${studentExamResult.examResults.length} %`
                      : "0 %"}
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </UserTable>
        <DetailTable>
          <p>컨텐트 디테일</p>
          <div>학생명</div>
          <div>진도율 상세</div>
        </DetailTable>
      </Container>
    </>
  );
}
