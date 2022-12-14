import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuthContext } from "../../AuthProvider";
import styles from "./acceptedRequests.module.scss";
import { IconUserCheck } from "@tabler/icons";
import {
  SegmentedControl,
  Title,
  Alert,
  Button,
  Modal,
  Textarea,
} from "@mantine/core";
import { Fragment, useState } from "react";

const getAcceptedRequests = async (accessToken) => {
  const response = await fetch("https://ftm.pythonanywhere.com/api/friends/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.json();
};

const AcceptedRequests = () => {
  const [{ access: accessToken }] = useAuthContext();
  const { data, isLoading, refetch } = useQuery(["accepted-requests"], () =>
    getAcceptedRequests(accessToken)
  );

  const [opened, setOpened] = useState(false);
  const [requestToRemove, setRequestToRemove] = useState({
    username: "",
    firstname: "",
    message: "",
  });

  const mutation = useMutation(async (payload) => {
    const response = await fetch(
      "https://ftm.pythonanywhere.com/api/friends/remove_friend/",
      {
        method: "POST",
        body: payload,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = await response.json();
    return data;
  });

  const removeRequest = () => {
    const formData = new FormData();
    formData.append("to_user", requestToRemove.username);
    formData.append("message", requestToRemove.message);
    mutation.mutate(formData, {
      onSuccess: () => {
        refetch();
        setOpened(false);
        setRequestToRemove({ username: "", firstname: "", message: "" });
      },
      onError: () => {
        refetch();
        setOpened(false);
        setRequestToRemove({ username: "", firstname: "", message: "" });
      },
    });
  };

  if (isLoading) {
    return <p> Loading... </p>;
  }
  return (
    <div className={styles["accepted-requests-container"]}>
      {data.length > 0 ? (
        data.map((request) => (
          <Fragment key={request.id}>
            <Alert
              icon={<IconUserCheck size={20} />}
              title="Accepted Request"
              color="grape"
              className={styles["accepted-request-item"]}
            >
              <p>
                <span>Name : </span>
                {`${request.first_name} ${request.last_name}`}
              </p>
              <p>
                <span>Email: </span> {request.email}
              </p>
              <Button
                color="red"
                onClick={() => {
                  setRequestToRemove((prevState) => ({
                    ...prevState,
                    username: request.username,
                    firstname: request.first_name,
                  }));
                  setOpened(true);
                }}
              >
                Remove
              </Button>
            </Alert>
            <Modal
              opened={opened}
              onClose={() => setOpened(false)}
              title={`Remove ${requestToRemove.firstname}`}
            >
              <Title order={4}>Add an optional message </Title>
              <Textarea
                value={requestToRemove.message}
                onChange={(event) => {
                  setRequestToRemove((prevState) => ({
                    ...prevState,
                    message: event.target.value,
                  }));
                }}
              />
              <Button
                onClick={removeRequest}
                color="grape"
                className={styles["remove-request-btn"]}
              >
                Remove Request
              </Button>
            </Modal>
          </Fragment>
        ))
      ) : (
        <div className={styles["no-requests-container"]}>
          <Title order={3} weight={700} align="center" color="grape">
            No Accepted Requests yet.
          </Title>
        </div>
      )}
    </div>
  );
};

const getRejectedRequests = async (accessToken) => {
  const response = await fetch(
    "https://ftm.pythonanywhere.com/api/friends/rejected_requests/",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.json();
};

const RejectedRequests = () => {
  const [{ access: accessToken }] = useAuthContext();
  const { data, isLoading } = useQuery(["rejected-requests"], () =>
    getRejectedRequests(accessToken)
  );

  if (isLoading) {
    return <p>Loading..</p>;
  }

  return (
    <div className={styles["accepted-requests-container"]}>
      {data.length > 0 ? (
        data.map((request) => (
          <Fragment key={request.id}>
            <Alert
              style={{ color: "#ff6464" }}
              key={request.id}
              icon={<IconUserCheck size={20} />}
              title="Rejected Request"
              color="grape"
              className={styles["accepted-request-item"]}
            >
              <p>
                <span>User Name : </span>
                {`${request.from_user}`}
              </p>
              <p>
                <span>Message: </span> {request.message}
              </p>
            </Alert>
          </Fragment>
        ))
      ) : (
        <div className={styles["no-requests-container"]}>
          <Title order={3} weight={700} align="center" color="grape">
            No Rejected Requests yet.
          </Title>
        </div>
      )}
    </div>
  );
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

const SentRequests = () => {
  const [{ access: accessToken }] = useAuthContext();
  const { data, isLoading } = useQuery(["rejected-requests"], () =>
    getSentRequests(accessToken)
  );

  if (isLoading) {
    return <p>Loading..</p>;
  }

  return (
    <div className={styles["accepted-requests-container"]}>
      {data.length > 0 ? (
        data.map((request) => (
          <Fragment key={request.id}>
            <Alert
              style={{ color: "#FFA500" }}
              key={request.id}
              icon={<IconUserCheck size={20} />}
              title="Sent Request"
              color="grape"
              className={styles["accepted-request-item"]}
            >
              <p>
                <span>User Name : </span>
                {`${request.to_user} `}
              </p>
              <p>
                <span>Message: </span> {request.message}
              </p>
            </Alert>
          </Fragment>
        ))
      ) : (
        <div className={styles["no-requests-container"]}>
          <Title order={3} weight={700} align="center" color="grape">
            No Sent Requests yet.
          </Title>
        </div>
      )}
    </div>
  );
};

const Friends = () => {
  const [value, setValue] = useState("Accepted Requests");
  return (
    <div className={styles["friends-outer-container"]}>
      <div className={styles["friends-inner-container"]}>
        <SegmentedControl
          value={value}
          onChange={setValue}
          data={["Accepted Requests", "Rejected Requests", "Sent Requests"]}
          className={styles["segemented-control"]}
        />
        {value === "Accepted Requests" ? (
          <AcceptedRequests />
        ) : value === "Rejected Requests" ? (
          <RejectedRequests />
        ) : (
          <SentRequests />
        )}
      </div>
    </div>
  );
};

export default Friends;
