import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import styles from "./userdetail.module.scss";
import Loader from "../../components/Loader";
import { Card, Image, Button, Modal, ActionIcon } from "@mantine/core";
import { useState } from "react";
import { useAuthContext } from "../../AuthProvider";
import EditUserProfile from "./EditProfile";
import WorkExperience from "./WorkExperience";
import { IconSend } from "@tabler/icons";
import SendRequest from "./SendRequest";
import ViewRequests from "./ViewRequests";

const MODAL_TITLE_MAP = {
  details: "Edit Details",
  workExperience: "Work Experience",
  sendRequest: "Send Request",
  viewRequests: "View Requests",
};

const getUserDetail = async ({ queryKey }) => {
  const userId = queryKey[1];
  const response = await fetch(
    `https://ftm.pythonanywhere.com/api/user/${userId}/`
  );
  return response.json();
};

const getSentRequests = async (accessToken) => {
  const response = await fetch(
    "https://ftm.pythonanywhere.com/api/friends/sent_requests/",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.json();
};

const getAcceptedRequests = async (accessToken) => {
  const response = await fetch("https://ftm.pythonanywhere.com/api/friends/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.json();
};

const UserDetail = () => {
  const { userId } = useParams();
  const [authDetails] = useAuthContext();
  const { data, isLoading, refetch } = useQuery(
    ["user-id", userId],
    getUserDetail
  );

  const { data: sentRequestsData, refetch: refetchSentRequests } = useQuery(
    ["sent-requests"],
    () => getSentRequests(authDetails.access)
  );

  const { data: acceptedRequestsData, refetch: refetchAcceptedRequests } =
    useQuery(["accepted-requests"], () =>
      getAcceptedRequests(authDetails.access)
    );

  const requestSent = sentRequestsData?.some?.(
    (request) => request?.to_user == data?.username
  );

  console.log({ sentRequestsData, acceptedRequestsData });

  const requestAccepted = acceptedRequestsData?.some?.(
    (request) => request?.username == data?.username
  );

  // modal can be details | workExperience | sendRequest \ viewRequests
  // If it's null, it's currently closed
  const [opened, setOpened] = useState({ modal: null });

  const fullName = `${data?.first_name} ${data?.last_name}`;

  const profileImg =
    data?.profile?.profileImg ||
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  return (
    <section className={styles["user-detail-container"]}>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className={[styles["card-container"]]}>
            <Card style={{ padding: 0 }} shadow="sm" radius="md" withBorder>
              <div className={styles["card-first-half"]}>
                <Image
                  fit="cover"
                  src={profileImg}
                  alt="User Profile Image"
                  height={100}
                  width={100}
                  radius={100}
                  className={styles["profile-image"]}
                />
                {authDetails.id != userId && (
                  <div className={styles["send-request-container"]}>
                    <ActionIcon
                      variant="filled"
                      className={styles["send-request-icon"]}
                      onClick={() => {
                        if (requestSent) return;
                        setOpened({ modal: "sendRequest" });
                      }}
                      // If the request has already been sent,
                      // add this background color - #8D72E1
                      {...(requestSent && {
                        style: { backgroundColor: "#8D72E1" },
                      })}
                      {...(requestAccepted && {
                        style: { backgroundColor: "#FF9F9F" },
                      })}
                    >
                      <IconSend size={36} />
                      <p>
                        {requestSent
                          ? "Sent"
                          : requestAccepted
                          ? "Accepted"
                          : "Send"}
                      </p>
                    </ActionIcon>
                  </div>
                )}
                {authDetails.id == userId && (
                  <div className={styles["send-request-container"]}>
                    <ActionIcon
                      variant="filled"
                      className={styles["view-request-icon"]}
                      onClick={() => setOpened({ modal: "viewRequests" })}
                    >
                      <IconSend size={36} />
                      <p>View</p>
                    </ActionIcon>
                  </div>
                )}
                <p className={styles["user-full-name"]}>{fullName}</p>
              </div>
              <div className={styles["card-second-half"]}>
                <div>
                  {data?.profile?.bio || (
                    <span className={styles["details-not-available"]}>
                      Details not available
                    </span>
                  )}
                </div>
              </div>
            </Card>
          </div>

          <div className={[styles["generic-pill"]]}>
            <p>Work Experience</p>
            {data?.profile?.exp?.map((workEx) => (
              <div
                key={workEx.id}
                className={styles["work-experience-container"]}
              >
                <p>
                  <span>Company</span> : {workEx.company_name}
                </p>
                <p>
                  <span>Reporting Manager : </span> {workEx.manager_name}
                </p>
                <p>
                  <span>Start Date : </span> {workEx.start_date}
                </p>
                <p>
                  <span>End Date : </span> {workEx.end_date}
                </p>
                <p>
                  <span>Work Experience : </span> {workEx.work_experience}
                </p>
              </div>
            )) || (
              <span className={styles["details-not-available"]}>
                Details not available
              </span>
            )}
          </div>

          <div className={[styles["generic-pill"]]}>
            <p>Tech Stack</p>
            <p>
              {data?.profile?.techstack || (
                <span className={styles["details-not-available"]}>
                  Details not available
                </span>
              )}
            </p>
          </div>

          <div className={[styles["generic-pill"]]}>
            <p>Certificates</p>
            <p>
              {data?.profile?.certificates || (
                <span className={styles["details-not-available"]}>
                  Details not available
                </span>
              )}
            </p>
          </div>

          <div className={[styles["generic-pill"]]}>
            <p>Github/Portfolio</p>
            <p>
              {data?.profile?.portfolio || (
                <span className={styles["details-not-available"]}>
                  Details not available
                </span>
              )}
            </p>
          </div>

          <div className={[styles["generic-pill"]]}>
            <p>User Comments</p>
            <p>
              {data?.profile?.review?.[0]?.comments || (
                <span className={styles["details-not-available"]}>
                  Details not available
                </span>
              )}
            </p>
          </div>

          {/* authDetails.id is of type number
              userId is of type string
              Hence, using == as opposed to === which is more common
           */}
          {authDetails.id == userId && (
            <div className={styles["buttons-container"]}>
              <Button
                variant="light"
                onClick={() => setOpened({ modal: "details" })}
              >
                Edit Details
              </Button>
              <Button
                variant="light"
                onClick={() => setOpened({ modal: "workExperience" })}
              >
                Edit Work Experience
              </Button>
            </div>
          )}
          <Modal
            opened={!!opened.modal}
            onClose={() => setOpened({ modal: null })}
            title={MODAL_TITLE_MAP[opened.modal]}
            centered
            closeOnClickOutside={false}
            {...(opened.modal === "viewRequests" && { size: "xl" })}
          >
            {opened.modal === "details" && (
              <EditUserProfile
                profile={data?.profile || {}}
                closeModal={() => setOpened({ modal: null })}
                onSuccess={refetch}
              />
            )}
            {opened.modal === "workExperience" && (
              <WorkExperience
                profile={data?.profile || {}}
                closeModal={() => setOpened({ modal: null })}
                onSuccess={refetch}
              />
            )}
            {opened.modal === "sendRequest" && (
              <SendRequest
                username={data?.username || {}}
                closeModal={() => setOpened({ modal: null })}
                onSuccess={() => {
                  refetch();
                  refetchSentRequests();
                  refetchAcceptedRequests();
                }}
              />
            )}
            {opened.modal === "viewRequests" && (
              <ViewRequests
                username={data?.username || {}}
                closeModal={() => setOpened({ modal: null })}
                onSuccess={refetch}
              />
            )}
          </Modal>
        </>
      )}
    </section>
  );
};

export default UserDetail;
