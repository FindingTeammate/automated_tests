import { Button, PasswordInput, Notification } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./passwordReset.module.scss";

const PasswordReset = () => {
  const { uid, token } = useParams();
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const mutation = useMutation(async (payload) => {
    const response = await fetch(
      "https://ftm.pythonanywhere.com/password-reset-complete/",
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      console.log(response);
      throw new Error(
        response.status === 403
          ? "The reset link is invalid"
          : "Password does not meet criteria"
      );
    }

    const data = await response.json();
    return data;
  });

  const handleReset = () => {
    // const formData = new FormData();
    // formData.append("password", password);
    // formData.append("token", token);
    // formData.append("uidb64", uid);
    const payload = {
      password,
      token,
      uidb64: uid,
    };
    mutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Password reset successfull. Redirecting to Login!");
        setPassword("");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      },
      onError: (error) => {
        setError(error.message);
      },
    });
  };

  return (
    <div className={styles["password-reset-container"]}>
      <div>
        <Notification disallowClose>Enter new password to reset.</Notification>
        <PasswordInput
          label="New Password"
          onChange={(event) => {
            setPassword(event.target.value);
            setError("");
          }}
          value={password}
          withAsterisk
        />
        <Button
          onClick={handleReset}
          className={styles["password-reset-container-btn"]}
        >
          Reset Password
        </Button>
        {error && <p className={styles["password-reset-error"]}>{error}</p>}
      </div>
    </div>
  );
};

export default PasswordReset;
