import styled from "styled-components";
import { useContext, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../../AuthContext";
import {
  apiGetQnABoardsByCourse,
  apiGetQnARepliesByQnABoardId,
  apiGetCourseReviewByCourse,
  apiGetCourseHistroiesByCourse,
  apiGetCompletedContentHistories,
  apiGetMyExamHistory,
  apiGetContentByCourse,
  apiGetCourse,
  apiGetExamByContent,
  apiUpdateExam,
  apiDeleteExam,
  apiCreateExam,
} from "../../RestApi";
import { Icon } from "@iconify/react";
import { formatDateTime } from "../../Util/util";

const Container = styled.div`
  width: 100%;
  padding: 10px;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #212529;
  margin-bottom: 1rem;
  font-size: 40px;
  font-weight: bolder;
`;

const Body = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 16px;
`;

const Content = styled.div`
  width: 100%;
  height: 250px;
  border-radius: 5px;
  border: 1px solid #ddd;
  padding: 20px;
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.1);
  &.coursetable {
    overflow: hidden;
  }
`;

const Columntitle = styled.div`
  font-size: 1.2rem;
  font-weight: 900;
  color: #3182f6;
`;

const Contents = styled.div`
  &.course {
    display: flex;
  }
  &.courseReview {
    display: grid;
    grid-template-columns: 1fr 4fr 1fr;
    padding: 1rem;
  }
  &.qnalist {
    display: grid;
    grid-template-columns: 1fr 3fr 1fr 1fr;
    padding: 1rem;
  }
  &.examInfo {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 0.5fr;
    align-items: center;
    padding: 0.5rem 1rem;
    background-color: #f3f3f3;
    border-radius: 5px;
    margin-bottom: 0.5rem;
  }
`;

const Course = styled.div`
  display: flex;
  justify-content: space-between; /* 내용을 좌우로 분산 배치 */
  align-items: center; /* 내용을 수직으로 가운데로 정렬 */
  background-color: #f3f3f3;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 10px;
  width: 100%; /* 부모 요소에 맞춰 가로로 확장 */
`;

const Exam = styled.div`
  // background-color: #f3f3f3;
  // border-radius: 10px;

  & .examTitle,
  .examContent {
    display: grid;
    grid-template-columns: 3fr 1fr 1fr;
    gap: 1rem; /* 각 열 사이의 간격을 조정합니다. */
    white-space: nowrap; /* 내용이 넘치는 경우 줄 바꿈을 방지합니다. */
  }
`;

const Select = styled.select`
  padding: 10px;
  margin: 1rem 0;
  border-radius: 5px;
  border: 1px solid #ccc;
  background-color: #fff;
  cursor: pointer;
`;

const Txt = styled.p`
  text-align: center;
  width: 100%;
`;

const UserNum = styled.div``;

export function InstructorDashboard() {
  const { user } = useContext(AuthContext);
  const courses = user.teachingCourses;
  const [courseHistories, setCourseHistories] = useState([]);
  const [selectedCourseIdForCourse, setSelectedCourseIdForCourse] =
    useState(null); // "과정명" 부분에서 선택된 강의 아이디
  const [selectedCourseForCourse, setSelectedCourseForCourse] = useState(null); // 선택된 강의 정보
  const [selectedCourseIdForExamList, setSelectedCourseIdForExamList] =
    useState(null); // "과제 리스트" 부분에서 선택된 강의 아이디
  const [selectedCourseForExamList, setSelectedCourseForExamList] =
    useState(null); // 선택된 강의 정보
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [examResults, setExamResults] = useState([]);
  const [totalContents, setTotalContents] = useState(0);
  const [latestReviews, setLatestReviews] = useState({});
  const [qnas, setQnas] = useState([]);
  const [teachingCourses, setTeachingCourses] = useState([]);
  const [contents, setContents] = useState([]);
  const [exams, setExams] = useState([]);

  // 선택한 강의 정보 불러오기
  useEffect(() => {
    const fetchSelectedCourse = async () => {
      if (!selectedCourseIdForCourse) return;

      const response = await apiGetCourse(selectedCourseIdForCourse);
      const selectedCourseData = response.data.data;
      setSelectedCourseForCourse(selectedCourseData);
    };

    fetchSelectedCourse();
  }, [selectedCourseIdForCourse]);

  // 선택한 강의에 대한 학습 이력 불러오기
  useEffect(() => {
    const fetchCourseAndContentHistories = async () => {
      if (!selectedCourseIdForCourse) return;

      // 선택한 강의에 대한 강의 이력 불러오기
      const courseHistoriesResponse = await apiGetCourseHistroiesByCourse(
        selectedCourseIdForCourse
      );
      const courseHistoriesData = courseHistoriesResponse.data.data;

      setCourseHistories(courseHistoriesData);

      // 선택한 강의에 대한 콘텐츠 불러오기
      const contentResponse = await apiGetContentByCourse(
        selectedCourseIdForCourse
      );
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
  }, [selectedCourseIdForCourse]);

  // 과정명 선택을 위한 함수
  const handleCourseSelectChange = (e) => {
    setSelectedCourseIdForCourse(e.target.value);
  };

  // 과제 리스트 선택을 위한 함수
  const handleExamListSelectChange = (e) => {
    const courseId = e.target.value;
    console.log("Selected Course ID for Exam List:", courseId); // 선택된 강의 ID 확인
    setSelectedCourseIdForExamList(courseId);

    // 선택한 강의의 정보를 가져와서 설정
    const selectedCourse = courses.find(
      (course) => course.courseId === courseId
    );
    console.log("Selected Course for Exam List:", selectedCourse); // 선택된 강의 정보 확인
    setSelectedCourseForExamList(selectedCourse);
  };

  // 조회한 코스 중 teachingCourse 조회
  useEffect(() => {
    const userTeachingCoursesIds = user.teachingCourses.map(
      (course) => course.courseId
    );
    const userTeachingCourses = courses.filter((course) =>
      userTeachingCoursesIds.includes(course.courseId)
    );
    setTeachingCourses(userTeachingCourses);
  }, [courses, user]);

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
  };

  // selectedCourse에 따라 content 조회, content 당 exam 조회
  useEffect(() => {
    if (selectedCourse) {
      apiGetContentByCourse(selectedCourse)
        .then((response) => {
          // 최신 콘텐츠 3개만 가져오기
          const latestContents = response.data.data.slice(0, 3);
          setContents(latestContents);

          let examsTemp = [];
          const fetchExams = async () => {
            for (let content of latestContents) {
              const examResponse = await apiGetExamByContent(content.contentId);
              examsTemp.push(examResponse.data.data);
            }
            setExams(examsTemp);
          };
          console.log(examsTemp);
          fetchExams();
        })
        .catch((error) => {
          console.error("코스 컨텐츠 가져오기 오류: ", error);
        });
    }
  }, [selectedCourse]);

  // exam 생성 후 조회
  const handleCreateExam = (contentId) => {
    const examDto = {
      contentId: contentId,
    };
    apiCreateExam(examDto)
      .then(() => {
        let examsTemp = [];
        const fetchExams = async () => {
          for (let content of contents) {
            const response = await apiGetExamByContent(content.contentId);
            examsTemp.push(response.data.data);
          }
          setExams(examsTemp);
        };
        fetchExams();
      })
      .catch((error) => {
        console.error("시험 생성 오류: ", error);
      });
  };

  // 시험 수정
  const handleUpdateExam = (examId) => {
    const examDto = {
      examIsActive: true,
    };
    apiUpdateExam(examId, examDto)
      .then(() => {
        let examsTemp = [];
        const fetchExams = async () => {
          for (let content of contents) {
            const response = await apiGetExamByContent(content.contentId);
            examsTemp.push(response.data.data);
          }
          setExams(examsTemp);
        };
        fetchExams();
      })
      .catch((error) => {
        console.error("시험 수정 오류: ", error);
      });
  };

  // 시험 삭제
  const handleDeleteExam = (examId) => {
    apiDeleteExam(examId)
      .then(() => {
        let examsTemp = [];
        const fetchExams = async () => {
          for (let content of contents) {
            const response = await apiGetExamByContent(content.contentId);
            examsTemp.push(response.data.data);
          }
          setExams(examsTemp);
        };
        fetchExams();
      })
      .catch((error) => {
        console.error("시험 삭제 오류: ", error);
      });
  };

  // 과정별 최신 수강평 3개 가져오기
  useEffect(() => {
    const fetchLatestReviews = async () => {
      const allLatestReviews = {};
      for (const course of courses) {
        const response = await apiGetCourseReviewByCourse(course.courseId);
        const reviews = response.data.data;
        if (reviews.length > 0) {
          allLatestReviews[course.courseId] = reviews.slice(0, 3);
        }
      }
      setLatestReviews(allLatestReviews);
    };

    fetchLatestReviews();
  }, [courses]);

  useEffect(() => {
    courses.forEach((course) => {
      apiGetQnABoardsByCourse(course.courseId).then(async (response) => {
        const fetchedQnas = response.data.data;
        // 최신 QnA 3개만 가져오기
        const latestQnas = fetchedQnas.slice(0, 3);
        await Promise.all(
          latestQnas.map((qna) => {
            return apiGetQnARepliesByQnABoardId(qna.qnaId).then((response) => {
              if (response.data.data.length > 0) {
                qna.replyId = response.data.data[0].replyId;
              }
            });
          })
        );
        setQnas(latestQnas);
      });
    });
  }, [courses]);

  return (
    <>
      <Container>
        <Header>Dashboard</Header>
        <Body>
          <Content className="coursetable">
            <Columntitle>과정명</Columntitle>
            <Select onChange={handleCourseSelectChange}>
              <option value="">강의 선택</option>
              {courses.map((course) => (
                <option key={course.courseId} value={course.courseId}>
                  {course.courseName}
                </option>
              ))}
            </Select>
            {/* 선택된 강의에 대한 정보를 표시 */}
            <Course>
              {selectedCourseForCourse ? (
                <>
                  <p>{selectedCourseForCourse.subject?.subjectName}</p>
                  <p>{selectedCourseForCourse.courseName}</p>
                  <p>총 강의 시간: {selectedCourseForCourse.durationMins}분</p>
                  <p>총 수강자 수: {courseHistories.length}</p>
                </>
              ) : (
                <Txt>정보 조회를 원하는 강의의 이름을 선택해 주세요</Txt>
              )}
            </Course>
            <NavLink
              to={`/dashboard/${user.loginId}/students_manage`}
              style={{ textDecoration: "none" }}
            >
              상세보기
            </NavLink>
          </Content>

          {courses.map((course, index) => {
            if (!latestReviews[course.courseId]) {
              return null;
            }

            return (
              <Content className="coursetable" key={index}>
                <NavLink
                  to={`/dashboard/${user.loginId}/coursereview_manage`}
                  style={{ textDecoration: "none" }}
                >
                  <Columntitle>수강평</Columntitle>
                </NavLink>
                {latestReviews[course.courseId].map((review, i) => (
                  <Contents className="courseReview" key={i}>
                    <p>{review.member.name}</p>
                    <p>{review.comment}</p>
                    <p>{formatDateTime(review.reviewDate)}</p>
                  </Contents>
                ))}
              </Content>
            );
          })}
          <Content className="examlist">
            <NavLink
              to={`/dashboard/${user.loginId}/exam_manage`}
              style={{ textDecoration: "none" }}
            >
              <Columntitle>과제 리스트</Columntitle>
            </NavLink>
            <Select onChange={handleCourseChange}>
              <option value="">강의 선택</option>
              {teachingCourses.map((course) => (
                <option key={course.courseId} value={course.courseId}>
                  {course.courseName}
                </option>
              ))}
            </Select>
            <Exam>
              {contents && (
                <>
                  {contents.map((content, index) => {
                    const examArray = exams.find(
                      (e) => e && e[0] && e[0].contentId === content.contentId
                    );
                    const exam = examArray ? examArray[0] : null;
                    const hasExam = !!exam;
                    const hasQuestions =
                      hasExam &&
                      !!exam.examQuestions &&
                      exam.examQuestions.length > 0;

                    return (
                      <Contents className="examInfo" key={index}>
                        <p>{content.contentTitle}</p>
                        {!hasExam && (
                          <button
                            onClick={() => handleCreateExam(content.contentId)}
                          >
                            시험 생성
                          </button>
                        )}
                        {hasExam && (
                          <NavLink
                            to={`/dashboard/${user.loginId}/exam_manage/${exam.examId}/question`}
                            style={{ textDecoration: "none" }}
                          >
                            문제 관리
                          </NavLink>
                        )}
                        {hasExam && (
                          <button onClick={() => handleDeleteExam(exam.examId)}>
                            시험 삭제
                          </button>
                        )}
                        {hasQuestions && (
                          <button onClick={() => handleUpdateExam(exam.examId)}>
                            시험 활성화
                          </button>
                        )}
                        {/* contentIcon 코드 추가 예제 */}
                        <div className="contentIcon">
                          <Icon
                            icon={"codicon:circle-filled"}
                            color={hasExam ? "#3182f6" : "white"}
                          ></Icon>
                          <Icon
                            icon={"codicon:circle-filled"}
                            color={hasQuestions ? "#3182f6" : "white"}
                          ></Icon>
                          <Icon
                            icon={"codicon:circle-filled"}
                            color={exam?.examIsActive ? "#3182f6" : "white"}
                          ></Icon>
                        </div>
                      </Contents>
                    );
                  })}
                  {contents.length === 0 && (
                    <Txt>선택한 강의에 대한 시험 리스트가 없습니다.</Txt>
                  )}
                </>
              )}
              {!contents && <Txt>콘텐츠를 선택해 주세요.</Txt>}
            </Exam>
            {/* <NavLink
              to={`/dashboard/${user.loginId}/exam_manage`}
              style={{ textDecoration: "none" }}
            >
              상세보기
            </NavLink> */}
          </Content>

          <Content className="coursetable">
            <Columntitle>QnA</Columntitle>
            {qnas
              .slice(0)
              .reverse()
              .map((qna, index) => (
                <Contents className="qnalist" key={index}>
                  <p>{qna.member.name}</p>
                  <p>{qna.questionText}</p>
                  {qna.replyId ? (
                    <>
                      <p>{formatDateTime(qna.createdAt)}</p>
                      <p>답변 완료</p>
                    </>
                  ) : (
                    <>
                      <p>{formatDateTime(qna.createdAt)}</p>
                      <NavLink
                        to={`/dashboard/${user.loginId}/qna_manage`}
                        style={{ textDecoration: "none" }}
                      >
                        답변하기
                      </NavLink>
                    </>
                  )}
                </Contents>
              ))}
          </Content>
        </Body>
      </Container>
    </>
  );
}
