import { Card, Image, Input } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import styles from "./userlist.module.scss";
import Loader from "../../components/Loader";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../AuthProvider";

const UserCard = ({ name, bio, techStack, rating, image, onClick }) => (
  <Card
    className={styles["card"]}
    shadow="sm"
    radius="md"
    withBorder
    onClick={onClick}
  >
    <div className={styles["card-first-row"]}>
      <Image
        radius={100}
        fit="cover"
        src={image}
        alt="User Profile Image"
        height={100}
        width={100}
      />
      <div>
        <p>{name}</p>
        <p>{bio}</p>
      </div>
    </div>
    <div className={styles["card-second-row"]}>
      <p>{techStack}</p>
    </div>

    <div className={styles["card-third-row"]}>
      <p>Ratings: {rating}</p>
    </div>
  </Card>
);

const getUserList = async () => {
  return fetch("https://ftm.pythonanywhere.com/api/user/").then((response) =>
    response.json()
  );
};

const UserList = () => {
  const [authDetails] = useAuthContext();

  const { data, isLoading } = useQuery(["user-list"], getUserList, {
    select: useCallback(
      (data) =>
        data.filter((user) => !user.is_superuser && user.id != authDetails.id),
      [authDetails]
    ),
  });

  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = useMemo(() => {
    if (!data) return [];

    if (!searchTerm) return data;
    return data?.filter((user) => {
      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    });
  }, [searchTerm, data]);

  return (
    <div className={styles["user-list-container"]}>
      {isLoading ? (
        <Loader />
      ) : (
        <div className={styles["cards-container"]}>
          <Input.Wrapper
            className={styles["demo"]}
            id="input-demo"
            withAsterisk
            label="Search for a specific user"
            // description="Please enter the name of the User you want to search"
            error=""
          >
            <Input
              id="input-demo"
              className={styles["search-input"]}
              placeholder="Search User"
              onChange={handleSearch}
            />
          </Input.Wrapper>
          {filteredData?.map((user) => {
            const fullName = `${user.first_name} ${user.last_name}`;
            const bio = user?.profile?.bio || "Need to fill bio";
            const techStack =
              user?.profile?.techstack || "Need to fill tech stack";
            const rating = `${user?.profile?.review?.[0]?.ratings || 0}/5`;
            const image =
              user?.profile?.profileimg ||
              "https://ftm.pythonanywhere.com/media/profile_images/pngegg.png";
            const userId = user.id;
            return (
              <UserCard
                key={userId}
                name={fullName}
                bio={bio}
                techStack={techStack}
                rating={rating}
                image={image}
                onClick={() => navigate(`/user-detail/${userId}`)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserList;
