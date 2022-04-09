import Tippy from "@tippyjs/react";
import React, { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import ErrorBoundary from "../../ErrorBoundary";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import CustModal from "../../Modal";
import { readAllEmployeeComments } from "../../../../services/api/reportsAPI";
import { toast } from "react-toastify";

/**
 * @name TimesheetShowAllComments
 * @component
 * @category Time Entry
 * @description Shows all comments in timesheet in a modal when clicked.
 * @param {Object} props Props. See propTypes for details.
 */
// eslint-disable-next-line react/prop-types
const TimesheetShowAllComments = ({
  timesheet,
  userInfo,
  timeEntryPeriodStartDate,
}) => {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  const [entryComments, setEntryComments] = useState([]);
  const [periodComments, setPeriodComments] = useState("");
  const [dayComments, setDayComments] = useState([]);
  const [showCommentModal, setShowCommentModal] = useState(false);

  const workCodes = useSelector((state) => state.workCodes);
  const departments = useSelector((state) => state.departments);
  const projects = useSelector((state) => state.projects);

  useEffect(() => {
    setFileName(
      `${userInfo.user.FirstName}${
        userInfo.user.LastName
      }TimesheetComments${moment(timeEntryPeriodStartDate).format("DDMMYYYY")}`
    );
  }, [userInfo, timeEntryPeriodStartDate]);

  useEffect(() => {
    if (timesheet) {
      let entryComments = [];
      let periodComments = timesheet.approval.SubmissionComment;
      let dayComments = timesheet.dayComments
        .filter((comment) => comment.Comment)
        .map((comment) => ({
          comment: comment.Comment,
          date: comment.DateofComment,
        }));

      entryComments = timesheet.hourEntries.map((row) => {
        const workCode = workCodes.find(
          (workCode) => workCode.WorkCodeID === row.WorkCodeID
        );
        const department = departments.find(
          (dep) => dep.DepartmentID === row.DepartmentID
        );
        const project = projects.find(
          (proj) => proj.ProjectID === row.ProjectID
        );

        return {
          project: project?.Name,
          department: department?.DeptName,
          workCode: workCode?.Code,
          entries: row.dates
            .filter((entry) => entry.Comment)
            .map((entry) => {
              return {
                comment: entry.Comment,
                date: entry.DateofWork,
              };
            }),
        };
      });

      setEntryComments(entryComments.filter((row) => row.entries.length > 0));
      setPeriodComments(periodComments);
      setDayComments(dayComments);
    }
  }, [timesheet, workCodes, projects, departments]);

  const onClick = () => {
    setShowCommentModal(true);
  };

  const getReport = async () => {
    if (!loading) {
      setLoading(true);
      const result = await readAllEmployeeComments(
        userInfo.user.EmployeeID,
        moment.utc(timeEntryPeriodStartDate).toDate(),
        fileName
      );
      if (!result.success) {
        toast.warn("Error: " + result.data);
      }
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <Tippy content={"Show all comments"}>
        <Button
          type="button"
          aria-label="Show all comments"
          //disabled={disableModification}
          onClick={onClick}
          variant="secondary"
          style={{ marginLeft: 10 }}
        >
          <i className="far fa-comments"></i>
        </Button>
      </Tippy>
      <CustModal
        show={showCommentModal}
        onHide={() => setShowCommentModal(false)}
        title={`All Timesheet Comments`}
      >
        <div>
          {dayComments.length > 0 && (
            <>
              <h4>Day Comments</h4>
              <div style={{ marginLeft: 10 }}>
                {dayComments.map((day, i) => {
                  return (
                    <div key={i}>
                      <strong>{moment.utc(day.date).format("M/D")}</strong>{" "}
                      {day.comment}
                    </div>
                  );
                })}
              </div>
            </>
          )}
          {entryComments.length > 0 && (
            <>
              {dayComments.length > 0 && <hr />}
              <h4>Entry Comments</h4>

              <div style={{ marginLeft: 10 }}>
                {entryComments.map((day, i) => {
                  return (
                    <div key={i}>
                      <h5>{`${day.department} • ${day.project} • ${day.workCode}`}</h5>
                      <div style={{ marginLeft: 10 }}>
                        {day.entries.map((entry, j) => {
                          return (
                            <div key={j}>
                              <strong>
                                {moment.utc(entry.date).format("M/D")}
                              </strong>
                              : {entry.comment}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {periodComments && (
            <>
              {dayComments.length > 0 || (dayComments.length == 0 && <hr />)}
              <h4>Day Comments</h4>

              <div style={{ marginLeft: 10 }}>{periodComments}</div>
            </>
          )}
          {!periodComments &&
            entryComments.length == 0 &&
            dayComments.length == 0 && (
              <div style={{ marginLeft: 10 }}>
                No comments have been entered
              </div>
            )}
        </div>
        <br />
        <a className="printCommentsLink" onClick={getReport}>
          Click here to print comments
        </a>{" "}
        {loading && (
          <div style={{ margin: "0 10px", display: "inline-block" }}>
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              style={{ marginRight: 5 }}
            />
            Loading...
          </div>
        )}
      </CustModal>
    </ErrorBoundary>
  );
};
TimesheetShowAllComments.propTypes = {
  disableModification: PropTypes.bool,
  timesheet: PropTypes.object,
  userInfo: PropTypes.object,
  timeEntryPeriodStartDate: PropTypes.object,
};

export default TimesheetShowAllComments;
