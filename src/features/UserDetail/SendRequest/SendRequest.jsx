import { Button, Textarea } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../../../AuthProvider";
import styles from "../userdetail.module.scss";

const SendRequest = ({ closeModal, onSuccess, username }) => {
  const [message, setMessage] = useState(null);
  const [{ access: accessToken }] = useAuthContext();

  const mutation = useMutation(async (newRequest) => {
    const response = await fetch(
      "https://ftm.pythonanywhere.com/api/friends/add_friend/",
      {
        method: "POST",
        body: newRequest,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return await response.json();
  });

  const onSendRequest = () => {
    const formData = new FormData();

    formData.append("to_user", username);
    formData.append("message", message);
    mutation.mutate(formData, {
      onSuccess: () => {
        closeModal();
        onSuccess();
        toast.success("Request sent successfully!");
      },
    });
  };

  return (
    <div className={styles["send-request-container"]}>
      <Textarea
        placeholder="Hey! I think your front end skills are perfect for my current requirement"
        label="Add an optional message"
        withAsterisk
        maxLength={25}
        onChange={({ target: { value } }) => setMessage(value)}
        value={message}
      />
      <Button
        loading={mutation.isLoading}
        onClick={onSendRequest}
        variant="gradient"
        gradient={{ from: "teal", to: "lime", deg: 105 }}
      >
        {mutation.isLoading ? "Sending" : "Send"}
      </Button>
    </div>
  );
};

export default SendRequest;
