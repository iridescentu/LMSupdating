import styled from "styled-components";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../AuthContext";
import {
  apiGetCourseHistroiesByCourse,
  apiGetCompletedContentHistories,
  apiGetMyExamHistory,
  apiGetContentByCourse,
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
  const [totalContents, setTotalContents] = useState(0);

  // 선택한 강의 정보 불러오기
  const selectedCourse = courses.find(
    (course) => course.courseId === parseInt(selectedCourseId)
  );

  // 선택한 강의에 대한 학습 이력 불러오기
  useEffect(() => {
    const fetchCourseAndContentHistories = async () => {
      if (!selectedCourseId) return;

      // 선택한 강의에 대한 강의 이력 불러오기
      const courseHistoriesResponse = await apiGetCourseHistroiesByCourse(
        selectedCourseId
      );
      const courseHistoriesData = courseHistoriesResponse.data.data;

      setCourseHistories(courseHistoriesData);

      // 선택한 강의에 대한 콘텐츠 불러오기
      const contentResponse = await apiGetContentByCourse(selectedCourseId);
      const contentData = contentResponse.data.data;

      // 총 콘텐츠 개수 업데이트
      const updatedTotalContents = contentData.length;
      setTotalContents(updatedTotalContents);

      const newExamResults = [];

      // 학생 별로 학습 이력 및 시험 결과 계산
      for (const courseHistory of courseHistoriesData) {
        const memberId = courseHistory.member.memberId;

        // 해당 학생이 완료한 콘텐츠 수 불러오기
        const completedContentHistoriesResponse =
          await apiGetCompletedContentHistories(memberId);
        const completedContentCount =
          completedContentHistoriesResponse.data.data.length;

        // 완료된 콘텐츠 비율 계산
        const progressRate =
          (completedContentCount / updatedTotalContents) * 100;

        // 해당 학생의 시험 결과 불러오기
        const examHistoryResponse = await apiGetMyExamHistory(memberId);
        const examHistoryData = examHistoryResponse.data.data;

        // 시험 결과를 기반으로 완료된 시험 개수 계산
        const completedExamsCount = examHistoryData
          ? examHistoryData.filter((exam) => exam.examCompletionStatus === true)
              .length
          : 0;

        // 과제 완료 비율 계산
        const assignmentRate =
          updatedTotalContents > 0
            ? (completedExamsCount / updatedTotalContents) * 100
            : 0;

        // 계산된 결과를 배열 추가
        newExamResults.push({
          memberId: memberId,
          examResults: examHistoryData,
          completedContentCount: completedContentCount,
          progressRate: progressRate,
          assignmentRate: assignmentRate,
        });
      }

      // 계산된 결과 업데이트
      setExamResults(newExamResults);
    };

    fetchCourseAndContentHistories();
  }, [selectedCourseId]);

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
        {/* 선택된 강의에 대한 정보를 표시 */}
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
        {/* 학생 정보를 테이블로 표시 */}
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

              // 해당 학생의 정보 불러오기
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
                      ? studentExamResult.assignmentRate.toFixed(2) + " %"
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
