import styled from "styled-components";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../AuthContext";
import {
  apiGetCourseHistroiesByCourse,
  apiGetMyExamResult,
  apiGetContentByCourse,
  apiGetMyContentHistory,
  apiGetMyExamHistory,
  apiGetContentHistoriesByCourse,
  apiGetCourse,
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
  const [members, setMembers] = useState([]);
  const [courseHistories, setCourseHistories] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const selectedCourse = courses.find(
    (course) => course.courseId === parseInt(selectedCourseId)
  );
  const [examResults, setExamResults] = useState([]);
  const [contentHistories, setContentHistories] = useState([]);
  const [completedContentCount, setCompletedContentCount] = useState(0);
  const [completedExamCount, setCompletedExamCount] = useState(0);
  const [contents, setContents] = useState([]);
  const [examHistories, setExamHistories] = useState([]);
  const [selectedContentId, setSelectedContentId] = useState(null);
  const [course, setCourse] = useState(null);

  // 컨텐츠 히스토리 조회 => 강의진도율
  // 해당 강의의 코스히스토리 조회
  useEffect(() => {
    const fetchCourseHistories = async () => {
      if (!selectedCourseId) return;
      const response = await apiGetCourseHistroiesByCourse(selectedCourseId);
      setCourseHistories(response.data.data);
      console.log(response.data.data);

      for (const courseHistory of response.data.data) {
        const examResultResponse = await apiGetMyExamResult(
          courseHistory.member.memberId
        );
        examResults.push({
          memberId: courseHistory.member.memberId,
          memberExamResults: examResultResponse.data.data,
        });
      }
      console.log(examResults);
      setExamResults(examResults);
    };

    fetchCourseHistories();
  }, [selectedCourseId, examResults]);

  const handleSelectChange = (e) => {
    setSelectedCourseId(e.target.value);
  };

  // 해당 코스 조회
  useEffect(() => {
    apiGetCourse(selectedCourseId)
      .then((response) => {
        setCourse(response.data.data);
      })
      .catch((error) => {
        console.error("코스 정보 불러오기 오류: ", error);
      });
  }, [selectedCourseId]);

  // 선택한 코스 컨텐츠 조회
  useEffect(() => {
    apiGetContentByCourse(selectedCourseId)
      .then((response) => {
        setContents(response.data.data);
      })
      .catch((err) => {
        console.log("해당 코스 컨텐츠 조회 실패 ", err);
      });
  }, [selectedCourseId]);

  // 특정 유저의 contentHistory 조회 및 해당 content의 examHistory 조회
  useEffect(() => {
    const fetchContentHistories = async () => {
      if (!selectedContentId) return; // 선택한 컨텐츠가 없으면 함수를 중단

      try {
        const contentHistoriesResponse = await apiGetContentHistoriesByCourse(
          selectedContentId
        );
        const contentHistories = contentHistoriesResponse.data.data;
        setContentHistories(contentHistories);
        console.log(contentHistories);

        // completedContentCount 계산
        const totalCompletedContentCount = contentHistories.filter(
          (contentHistory) => contentHistory.isCompleted
        ).length;
        setCompletedContentCount(totalCompletedContentCount);

        // 비동기 요청 병렬 처리를 위한 Promise.all 사용
        const examHistoriesPromises = contentHistories.map((contentHistory) =>
          apiGetMyExamHistory(
            contentHistory.content.contentId,
            contentHistory.memberId
          )
        );
        const examHistoriesResponses = await Promise.all(examHistoriesPromises);
        const examHistoriesTemp = examHistoriesResponses.flatMap(
          (response) => response.data.data
        );

        const filteredExamHistories = examHistoriesTemp.filter((examHistory) =>
          contentHistories.some(
            (contentHistory) =>
              contentHistory.content.contentId === examHistory.exam.contentId
          )
        );
        setExamHistories(filteredExamHistories);
        console.log(filteredExamHistories);
      } catch (error) {
        console.error("Content and Exam histories fetching failed:", error);
        // 여기에 사용자에게 에러를 알리는 로직을 추가할 수 있습니다.
      }
    };

    fetchContentHistories();
  }, [selectedContentId]); // 의존성 배열에 필요한 변수나 함수 추가

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
              <Th>질문</Th>
              <Th>강의 진도율</Th>
              <Th>과제율</Th>
            </tr>
          </thead>
          <tbody>
            {courseHistories.map((courseHistory) => {
              const studentExamResult = examResults.find(
                (result) => result.memberId === courseHistory.member.memberId
              );

              const completedContentsCount = courseHistory.contentHistories
                ? courseHistory.contentHistories.filter(
                    (contentHistory) => contentHistory.isCompleted
                  ).length
                : 0;

              const totalContentsCount =
                courseHistory.contentHistories?.length || 0;
              const courseProgressRate =
                totalContentsCount > 0
                  ? (completedContentsCount / totalContentsCount) * 100
                  : 0;

              const examCount = studentExamResult
                ? studentExamResult.memberExamResults.length
                : 0;
              const completedExamCount = studentExamResult
                ? studentExamResult.memberExamResults.filter(
                    (result) => result.examCompletionStatus
                  ).length
                : 0;
              const examProgressRate =
                examCount > 0 ? (completedExamCount / examCount) * 100 : 0;

              // console.log(
              //   "courseHistory.contentHistories:",
              //   courseHistory.contentHistories
              // );
              // console.log(
              //   "studentExamResult.memberExamResults:",
              //   studentExamResult.memberExamResults
              // );

              return (
                <tr key={courseHistory.courseHistoryId}>
                  <Td>{courseHistory.member.name}</Td>
                  <Td>{courseHistory.member.gender}</Td>
                  <Td>{courseHistory.contentStatus ? "완료" : "미완료"}</Td>
                  <Td></Td>
                  <Td>{courseProgressRate}</Td>
                  <Td>{examProgressRate}</Td>
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
