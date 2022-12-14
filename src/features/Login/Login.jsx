import { Button, Input, PasswordInput, TextInput } from "@mantine/core";
import styles from "./login.module.scss";
import { IconLogin, IconKey } from "@tabler/icons";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../AuthProvider";
import { useEffect } from "react";
import { Alert, Modal, Notification } from "@mantine/core";
import { IconAlertCircle, IconMail } from "@tabler/icons";
import toast from "react-hot-toast";

const postUserLogin = async (userLogin) => {
  const response = await fetch("https://ftm.pythonanywhere.com/login/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userLogin),
  });

  if (!response.ok) {
    throw new Error("No active account found with the given credentials");
  }

  const data = await response.json();

  return data;
};

const ErrorAlert = ({ message }) => {
  return (
    <Alert icon={<IconAlertCircle size={16} />} title="Error!" color="red">
      {message}
    </Alert>
  );
};

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const Login = () => {
  const [loginDetail, setLoginDetails] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const [, setAuthDetails] = useAuthContext();

  const [open, setOpen] = useState(false);

  const [email, setEmail] = useState("");

  useEffect(() => {
    setAuthDetails(null);
  }, []);

  const mutation = useMutation((userLogin) => {
    return postUserLogin(userLogin);
  });

  const forgotPasswordMutation = useMutation(async (payload) => {
    const response = await fetch(
      "https://ftm.pythonanywhere.com/request-reset-email/",
      {
        method: "POST",
        body: payload,
      }
    );
    const data = await response.json();
    return data;
  });

  const handleFormChange = (event) => {
    mutation.reset();
    setLoginDetails((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const handleFormSubmit = () => {
    mutation.mutate(
      { ...loginDetail },
      {
        onSuccess: (data) => {
          setAuthDetails(data);
          navigate("/user-list");
        },
      }
    );
  };

  const handleForgotPassword = () => {
    const formData = new FormData();
    formData.append("email", email);
    forgotPasswordMutation.mutate(formData, {
      onSuccess: () => {
        // Close the opened Modal
        setOpen(false);

        // Show a Success toast message
        toast.success("Reset Password Link sent to your email!");
      },
    });
  };

  return (
    <section className={styles["body-container"]}>
      <div className={styles["form-container"]}>
        <h2 className={styles["form-header"]}>Login</h2>
        <Input
          className={styles["form-input"]}
          placeholder="Username"
          icon={<IconLogin />}
          onChange={handleFormChange}
          name="username"
        />
        <PasswordInput
          className={styles["form-input"]}
          icon={<IconKey />}
          placeholder="111"
          withAsterisk
          onChange={handleFormChange}
          name="password"
        />
        <Button onClick={handleFormSubmit} className={styles["button"]}>
          {mutation.isLoading ? "Logging you in" : "Login"}
        </Button>

        <Button onClick={() => setOpen(true)} className={styles["button"]}>
          Forgot Password
        </Button>
        {mutation.isError && <ErrorAlert message={mutation.error.message} />}

        <Modal
          opened={open}
          onClose={() => setOpen(false)}
          title="Forgot Password"
          centered
        >
          <Notification disallowClose>
            You will receive a Password Reset Link on this email.
          </Notification>
          <TextInput
            placeholder="Enter your email"
            label="Email"
            icon={<IconMail />}
            className={styles["email-modal"]}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Button
            onClick={handleForgotPassword}
            disabled={!validateEmail(email)}
          >
            Send Link
          </Button>
        </Modal>
      </div>
    </section>
  );
};

export default Login;
