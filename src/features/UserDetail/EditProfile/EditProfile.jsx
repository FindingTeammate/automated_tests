import { useMutation } from "@tanstack/react-query";
import { useAuthContext } from "../../../AuthProvider";
import toast from "react-hot-toast";
import { Button, TextInput, Textarea } from "@mantine/core";
import { useState } from "react";
import styles from "../userdetail.module.scss";

const EditUserProfile = ({ profile = {}, closeModal, onSuccess }) => {
  const [{ access: accessToken }] = useAuthContext();

  const [updatedProfileDetails, setUpdatedProfileDetails] = useState({
    bio: profile.bio || "",
    techstack: profile.techstack || "",
    certificates: profile.certificates || "",
    portfolio: profile.portfolio || "",
  });

  const mutation = useMutation((updatedDetails) => {
    return fetch(`https://ftm.pythonanywhere.com/api/profile/${profile.id}/`, {
      method: "PUT",
      body: updatedDetails,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((response) => response.json());
  });

  const handleFormChange = (event) => {
    setUpdatedProfileDetails((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const onUpdateDetails = () => {
    const formData = new FormData();

    for (const field in updatedProfileDetails) {
      formData.append(field, updatedProfileDetails[field]);
    }

    mutation.mutate(formData, {
      onSuccess: () => {
        closeModal();
        onSuccess();
        toast.success("Details Updated Successfully!");
      },
    });
  };

  return (
    <div className={styles["edit-form-container"]}>
      <Textarea
        placeholder={profile.bio}
        name="bio"
        label="Bio"
        onChange={handleFormChange}
        value={updatedProfileDetails.bio}
      />
      <TextInput
        placeholder={profile.techstack}
        name="techstack"
        label="Tech Stack"
        onChange={handleFormChange}
        value={updatedProfileDetails.techstack}
      />
      <TextInput
        placeholder={profile.certificates}
        name="certificates"
        label="Certificates"
        onChange={handleFormChange}
        value={updatedProfileDetails.certificates}
      />
      <TextInput
        placeholder={profile.portfolio}
        name="portfolio"
        label="Portfolio"
        onChange={handleFormChange}
        value={updatedProfileDetails.portfolio}
      />
      <Button
        loading={mutation.isLoading}
        variant="outline"
        onClick={onUpdateDetails}
      >
        {mutation.isLoading ? "Updating" : "Update"}
      </Button>
    </div>
  );
};

export default EditUserProfile;
