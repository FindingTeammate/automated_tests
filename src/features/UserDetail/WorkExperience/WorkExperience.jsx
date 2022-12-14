import { Tabs } from "@mantine/core";
import { IconCirclePlus, IconEdit } from "@tabler/icons";
import { Button, TextInput, Textarea } from "@mantine/core";
import { useState } from "react";
import { DatePicker } from "@mantine/dates";
import dayjs from "dayjs";
import { useAuthContext } from "../../../AuthProvider";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import styles from "../userdetail.module.scss";

const AddNewWorkExperience = ({ profile, closeModal, onSuccess }) => {
  const [{ access: accessToken }] = useAuthContext();

  const [updatedWorkExperience, setUpdatedWorkExperience] = useState({
    company_name: "",
    manager_name: "",
    start_date: null,
    end_date: null,
    work_experience: "",
    user: profile.id,
  });

  const mutation = useMutation(async (newWorkEx) => {
    const response = await fetch(
      `https://ftm.pythonanywhere.com/api/workExp/`,
      {
        method: "POST",
        body: newWorkEx,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return await response.json();
  });

  const handleFormChange = (event) => {
    setUpdatedWorkExperience((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };

  const onAddWorkExperience = () => {
    const formData = new FormData();

    for (const field in updatedWorkExperience) {
      formData.append(field, updatedWorkExperience[field]);
    }
    mutation.mutate(formData, {
      onSuccess: () => {
        closeModal();
        onSuccess();
        toast.success("Details Updated Successfully!");
      },
    });
  };

  const disabled = Object.values(updatedWorkExperience).some((val) => !val);

  return (
    <div className={styles["add-work-ex-container"]}>
      <TextInput
        placeholder="Meta"
        name="company_name"
        label="Company Name"
        onChange={handleFormChange}
        withAsterisk
        value={updatedWorkExperience.company_name}
      />
      <TextInput
        placeholder="Mark Zuckerberg"
        name="manager_name"
        label="Manager Name"
        onChange={handleFormChange}
        withAsterisk
        value={updatedWorkExperience.manager_name}
      />
      <DatePicker
        placeholder="Pick a date"
        label="Start date"
        allowFreeInput
        name="start_date"
        withAsterisk
        onChange={(date) => {
          setUpdatedWorkExperience((prevState) => ({
            ...prevState,
            start_date: dayjs(date).format("YYYY-MM-DD"),
          }));
        }}
      />
      <DatePicker
        placeholder="Pick a date"
        label="End date"
        name="end_date"
        allowFreeInput
        withAsterisk
        onChange={(date) => {
          setUpdatedWorkExperience((prevState) => ({
            ...prevState,
            end_date: dayjs(date).format("YYYY-MM-DD"),
          }));
        }}
      />
      <Textarea
        placeholder="Worked on React, React Native and NodeJS"
        name="work_experience"
        label="Work Experience"
        withAsterisk
        onChange={handleFormChange}
        value={updatedWorkExperience.work_experience}
      />
      <Button
        loading={mutation.isLoading}
        variant="outline"
        onClick={onAddWorkExperience}
        disabled={disabled}
      >
        {mutation.isLoading ? "Adding" : "Add"}
      </Button>
    </div>
  );
};

const WorkExperience = ({ profile, closeModal, onSuccess }) => {
  return (
    <Tabs defaultValue="add-new">
      <Tabs.List>
        <Tabs.Tab value="add-new" icon={<IconCirclePlus size={20} />}>
          Add New
        </Tabs.Tab>
        <Tabs.Tab value="edit" icon={<IconEdit size={20} />}>
          Edit
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="add-new" pt="xs">
        <AddNewWorkExperience
          profile={profile}
          closeModal={closeModal}
          onSuccess={onSuccess}
        />
      </Tabs.Panel>

      <Tabs.Panel value="edit" pt="xs">
        Coming soon
      </Tabs.Panel>
    </Tabs>
  );
};

export default WorkExperience;
