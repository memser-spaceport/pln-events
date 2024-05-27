import { ManageAdminView } from "@/components/page/manage/admin/manage-admin-view";
import { ManageUserView } from "@/components/page/manage/user/manage-user-view";
import { checkIsValidToken } from "@/service/auth.service";
import { ROLES } from "@/utils/constants";
import { checkIsValidUserInfo, parseCookieValue } from "@/utils/helper";
import { Metadata } from "next";
import { cookies } from "next/headers";
import styles from "./page.module.css";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Manage events",
};

export default async function Page() {
  const { isError, isLoggedIn, roles, events } = await getPageData();


  if (isError) {
    return <div></div>;
  }

  if (!isLoggedIn) {
    redirect("/#login");
  }

  return (
    <div className={styles?.managepg}>
      <div className={styles.managepg__content}>
        {roles.includes(ROLES.admin) && <ManageAdminView events={events} />}
        {roles.includes(ROLES.user) && <ManageUserView events={events}/>}
      </div>
    </div>
  );
}

const getPageData = async () => {
  let isLoggedIn: boolean = false;
  let isError: boolean = false;
  let roles: string[] = ["ADMIN"];
  let events = null;
  try {
    const cookieStore: any = cookies();
    const userInfo = parseCookieValue(cookieStore.get("userInfo")?.value);
    const authToken = parseCookieValue(cookieStore.get("authToken")?.value);
    const isValidToken = await checkIsValidToken(authToken);
    const isValidUserInfo = checkIsValidUserInfo(userInfo);
    isLoggedIn = isValidToken && isValidUserInfo;

    if (!isLoggedIn) {
      return { isLoggedIn, isError, roles, events };
    }

    if (roles.includes(ROLES.admin)) {
      events = {
        pending: [
          {
            title: "Pending Event 1",
            description:
              "<p>This is a <strong/>description</strong> for pending event 1.</p><p>More details can be found <a href='http://example.com/event1'>here</a>.</p>",
            date: "2024-05-01",
            location: "Location 1",
            userInfo: {
              imageurl:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX-mmy1bZzkwQY2zce4WkOl6zenIWOHqGVLZUckaVnkA&s",
              name: "User 1",
            },
            status: "PENDING",
            isMainEvent: true,
            mainEventName: null,
          },
          {
            title: "Pending Event 2",
            description:
              "<p>Description for pending event 2 with a list:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>",
            date: "2024-05-02",
            location: "Location 2",
            userInfo: {
              imageurl:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX-mmy1bZzkwQY2zce4WkOl6zenIWOHqGVLZUckaVnkA&s",
              name: "User 2",
            },
            status: "PENDING",
            isMainEvent: false,
            mainEventName: "Pending Event 1",
          },
          {
            title: "Pending Event 3",
            description:
              "<p>Description for pending event 3. Visit <a href='http://example.com/event3'>this link</a> for more information.</p>",
            date: "2024-05-03",
            location: "Location 3",
            userInfo: {
              imageurl:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX-mmy1bZzkwQY2zce4WkOl6zenIWOHqGVLZUckaVnkA&s",
              name: "User 3",
            },
            status: "PENDING",
            isMainEvent: false,
            mainEventName: "Pending Event 1",
          },
          {
            title: "Pending Event 4",
            description:
              "<p>Description for pending event 4 with additional details.</p>",
            date: "2024-05-04",
            location: "Location 4",
            userInfo: {
              imageurl:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX-mmy1bZzkwQY2zce4WkOl6zenIWOHqGVLZUckaVnkA&s",
              name: "User 4",
            },
            status: "PENDING",
            isMainEvent: false,
            mainEventName: "Pending Event 1",
          },
          {
            title: "Pending Event 5",
            description:
              "<p>This is a <strong>description</strong> for pending event 5.</p><p>More details can be found <a href='http://example.com/event5'>here</a>.</p>",
            date: "2024-05-05",
            location: "Location 5",
            userInfo: {
              imageurl:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX-mmy1bZzkwQY2zce4WkOl6zenIWOHqGVLZUckaVnkA&s",
              name: "User 5",
            },
            status: "PENDING",
            isMainEvent: false,
            mainEventName: "Pending Event 1",
          },
          {
            title: "Pending Event 6",
            description:
              "<p>Description for pending event 6 with a list:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>",
            date: "2024-05-06",
            location: "Location 6",
            userInfo: {
              imageurl:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX-mmy1bZzkwQY2zce4WkOl6zenIWOHqGVLZUckaVnkA&s",
              name: "User 6",
            },
            status: "PENDING",
            isMainEvent: false,
            mainEventName: "Pending Event 1",
          },
          {
            title: "Pending Event 7",
            description:
              "<p>Description for pending event 7. Visit <a href='http://example.com/event7'>this link</a> for more information.</p>",
            date: "2024-05-07",
            location: "Location 7",
            userInfo: {
              imageurl:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX-mmy1bZzkwQY2zce4WkOl6zenIWOHqGVLZUckaVnkA&s",
              name: "User 7",
            },
            status: "PENDING",
            isMainEvent: false,
            mainEventName: "Pending Event 1",
          },
          {
            title: "Pending Event 8",
            description:
              "<p>Description for pending event 8 with additional details.</p>",
            date: "2024-05-08",
            location: "Location 8",
            userInfo: {
              imageurl:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX-mmy1bZzkwQY2zce4WkOl6zenIWOHqGVLZUckaVnkA&s",
              name: "User 8",
            },
            status: "PENDING",
            isMainEvent: false,
            mainEventName: "Pending Event 1",
          },
          {
            title: "Pending Event 9",
            description:
              "<p>This is a <strong>description</strong> for pending event 9.</p><p>More details can be found <a href='http://example.com/event9'>here</a>.</p>",
            date: "2024-05-09",
            location: "Location 9",
            userInfo: {
              imageurl:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX-mmy1bZzkwQY2zce4WkOl6zenIWOHqGVLZUckaVnkA&s",
              name: "User 9",
            },
            status: "PENDING",
            isMainEvent: false,
            mainEventName: "Pending Event 1",
          },
          {
            title: "Pending Event 10",
            description:
              "<p>Description for pending event 10 with a list:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>",
            date: "2024-05-10",
            location: "Location 10",
            userInfo: {
              imageurl:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX-mmy1bZzkwQY2zce4WkOl6zenIWOHqGVLZUckaVnkA&s",
              name: "User 10",
            },
            status: "PENDING",
            isMainEvent: false,
            mainEventName: "Pending Event 1",
          },
        ],
        approved: [
          {
            title: "Approved Event 1",
            description:
              "<p>This is a <strong>description</strong> for approved event 1.</p><p>More details can be found <a href='http://example.com/event11'>here</a>.</p>",
            date: "2024-06-01",
            location: "Location 11",
            userInfo: {
              imageurl:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX-mmy1bZzkwQY2zce4WkOl6zenIWOHqGVLZUckaVnkA&s",
              name: "User 11",
            },
            status: "APPROVED",
            isMainEvent: true,
            mainEventName: null,
          },
          {
            title: "Approved Event 2",
            description:
              "<p>Description for approved event 2 with a list:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>",
            date: "2024-06-02",
            location: "Location 12",
            userInfo: {
              imageurl:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX-mmy1bZzkwQY2zce4WkOl6zenIWOHqGVLZUckaVnkA&s",
              name: "User 12",
            },
            status: "APPROVED",
            isMainEvent: false,
            mainEventName: "Approved Event 1",
          },
          {
            title: "Approved Event 3",
            description:
              "<p>Description for approved event 3. Visit <a href='http://example.com/event13'>this link</a> for more information.</p>",
            date: "2024-06-03",
            location: "Location 13",
            userInfo: {
              imageurl:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX-mmy1bZzkwQY2zce4WkOl6zenIWOHqGVLZUckaVnkA&s",
              name: "User 13",
            },
            status: "APPROVED",
            isMainEvent: false,
            mainEventName: "Approved Event 1",
          },
          {
            title: "Approved Event 4",
            description:
              "<p>Description for approved event 4 with additional details.</p>",
            date: "2024-06-04",
            location: "Location 14",
            userInfo: {
              imageurl:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX-mmy1bZzkwQY2zce4WkOl6zenIWOHqGVLZUckaVnkA&s",
              name: "User 14",
            },
            status: "APPROVED",
            isMainEvent: false,
            mainEventName: "Approved Event 1",
          },
          {
            title: "Approved Event 5",
            description:
              "<p>This is a <strong>description</strong> for approved event 5.</p><p>More details can be found <a href='http://example.com/event15'>here</a>.</p>",
            date: "2024-06-05",
            location: "Location 15",
            userInfo: {
              imageurl:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX-mmy1bZzkwQY2zce4WkOl6zenIWOHqGVLZUckaVnkA&s",
              name: "User 15",
            },
            status: "APPROVED",
            isMainEvent: false,
            mainEventName: "Approved Event 1",
          },
          {
            title: "Approved Event 6",
            description:
              "<p>Description for approved event 6 with a list:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>",
            date: "2024-06-06",
            location: "Location 16",
            userInfo: {
              imageurl:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX-mmy1bZzkwQY2zce4WkOl6zenIWOHqGVLZUckaVnkA&s",
              name: "User 16",
            },
            status: "APPROVED",
            isMainEvent: false,
            mainEventName: "Approved Event 1",
          },
          {
            title: "Approved Event 7",
            description:
              "<p>Description for approved event 7. Visit <a href='http://example.com/event17'>this link</a> for more information.</p>",
            date: "2024-06-07",
            location: "Location 17",
            userInfo: {
              imageurl:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX-mmy1bZzkwQY2zce4WkOl6zenIWOHqGVLZUckaVnkA&s",
              name: "User 17",
            },
            status: "APPROVED",
            isMainEvent: false,
            mainEventName: "Approved Event 1",
          },
          {
            title: "Approved Event 8",
            description:
              "<p>Description for approved event 8 with additional details.</p>",
            date: "2024-06-08",
            location: "Location 18",
            userInfo: {
              imageurl:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX-mmy1bZzkwQY2zce4WkOl6zenIWOHqGVLZUckaVnkA&s",
              name: "User 18",
            },
            status: "APPROVED",
            isMainEvent: false,
            mainEventName: "Approved",
          },
          {
            title: "Approved Event 9",
            description:
              "<p>This is a <strong>description</strong> for approved event 9.</p><p>More details can be found <a href='http://example.com/event19'>here</a>.</p>",
            date: "2024-06-09",
            location: "Location 19",
            userInfo: {
              imageurl:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX-mmy1bZzkwQY2zce4WkOl6zenIWOHqGVLZUckaVnkA&s",
              name: "User 19",
            },
            status: "APPROVED",
            isMainEvent: false,
            mainEventName: "Approved Event 5",
          },
          {
            title: "Approved Event 10",
            description:
              "<p>Description for approved event 10 with a list:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>",
            date: "2024-06-10",
            location: "Location 20",
            userInfo: {
              imageurl:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX-mmy1bZzkwQY2zce4WkOl6zenIWOHqGVLZUckaVnkA&s",
              name: "User 20",
            },
            status: "APPROVED",
            isMainEvent: false,
            mainEventName: "Approved Event 5",
          },
        ],
        rejected: [
          {
            title: "Rejected Event 1",
            description:
              "<p>This is a <strong>description</strong> for rejected event 1.</p><p>More details can be found <a href='http://example.com/event21'>here</a>.</p>",
            date: "2024-07-01",
            location: "Location 21",
            userInfo: {
              imageurl:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX-mmy1bZzkwQY2zce4WkOl6zenIWOHqGVLZUckaVnkA&s",
              name: "User 21",
            },
            status: "REJECTED",
            isMainEvent: true,
            mainEventName: null,
          },
          {
            title: "Rejected Event 2",
            description:
              "<p>Description for rejected event 2 with a list:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>",
            date: "2024-07-02",
            location: "Location 22",
            userInfo: {
              imageurl:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX-mmy1bZzkwQY2zce4WkOl6zenIWOHqGVLZUckaVnkA&s",
              name: "User 22",
            },
            status: "REJECTED",
            isMainEvent: false,
            mainEventName: "Rejected Event 1",
          },
          {
            title: "Rejected Event 3",
            description:
              "<p>Description for rejected event 3. Visit <a href='http://example.com/event23'>this link</a> for more information.</p>",
            date: "2024-07-03",
            location: "Location 23",
            userInfo: {
              imageurl:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX-mmy1bZzkwQY2zce4WkOl6zenIWOHqGVLZUckaVnkA&s",
              name: "User 23",
            },
            status: "REJECTED",
            isMainEvent: false,
            mainEventName: "Rejected Event 1",
          },
          {
            title: "Rejected Event 4",
            description:
              "<p>Description for rejected event 4 with additional details.</p>",
            date: "2024-07-04",
            location: "Location 24",
            userInfo: {
              imageurl:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX-mmy1bZzkwQY2zce4WkOl6zenIWOHqGVLZUckaVnkA&s",
              name: "User 24",
            },
            status: "REJECTED",
            isMainEvent: false,
            mainEventName: "Rejected Event 1",
          },
          {
            title: "Rejected Event 5",
            description:
              "<p>This is a <strong>description</strong> for rejected event 5.</p><p>More details can be found <a href='http://example.com/event25'>here</a>.</p>",
            date: "2024-07-05",
            location: "Location 25",
            userInfo: {
              imageurl:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX-mmy1bZzkwQY2zce4WkOl6zenIWOHqGVLZUckaVnkA&s",
              name: "User 25",
            },
            status: "REJECTED",
            isMainEvent: false,
            mainEventName: "Rejected Event 1",
          },
          {
            title: "Rejected Event 6",
            description:
              "<p>Description for rejected event 6 with a list:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>",
            date: "2024-07-06",
            location: "Location 26",
            userInfo: {
              imageurl:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX-mmy1bZzkwQY2zce4WkOl6zenIWOHqGVLZUckaVnkA&s",
              name: "User 26",
            },
            status: "REJECTED",
            isMainEvent: false,
            mainEventName: "Rejected Event 1",
          },
          {
            title: "Rejected Event 7",
            description:
              "<p>Description for rejected event 7. Visit <a href='http://example.com/event27'>this link</a> for more information.</p>",
            date: "2024-07-07",
            location: "Location 27",
            userInfo: {
              imageurl:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX-mmy1bZzkwQY2zce4WkOl6zenIWOHqGVLZUckaVnkA&s",
              name: "User 27",
            },
            status: "REJECTED",
            isMainEvent: false,
            mainEventName: "Rejected Event 1",
          },
          {
            title: "Rejected Event 8",
            description:
              "<p>Description for rejected event 8 with additional details.</p>",
            date: "2024-07-08",
            location: "Location 28",
            userInfo: {
              imageurl:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX-mmy1bZzkwQY2zce4WkOl6zenIWOHqGVLZUckaVnkA&s",
              name: "User 28",
            },
            status: "REJECTED",
            isMainEvent: false,
            mainEventName: "Rejected Event 1",
          },
          {
            title: "Rejected Event 9",
            description:
              "<p>This is a <strong>description</strong> for rejected event 9.</p><p>More details can be found <a href='http://example.com/event29'>here</a>.</p>",
            date: "2024-07-09",
            location: "Location 29",
            userInfo: {
              imageurl:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX-mmy1bZzkwQY2zce4WkOl6zenIWOHqGVLZUckaVnkA&s",
              name: "User 29",
            },
            status: "REJECTED",
            isMainEvent: false,
            mainEventName: "Rejected Event 1",
          },
          {
            title: "Rejected Event 10",
            description:
              "<p>Description for rejected event 10 with a list:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>",
            date: "2024-07-10",
            location: "Location 30",
            userInfo: {
              imageurl:
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX-mmy1bZzkwQY2zce4WkOl6zenIWOHqGVLZUckaVnkA&s",
              name: "User 30",
            },
            status: "REJECTED",
            isMainEvent: false,
            mainEventName: "Rejected Event 1",
          },
        ],
      };
    }

    if(roles.includes(ROLES.user)) {
      events =  [
        {
          title: "Pending Event 1",
          description:
            "<p>This is a <strong/>description</strong> for pending event 1.</p><p>More details can be found <a href='http://example.com/event1'>here</a>.</p>",
          date: "2024-05-01",
          location: "Location 1",
          userInfo: {
            imageurl:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX-mmy1bZzkwQY2zce4WkOl6zenIWOHqGVLZUckaVnkA&s",
            name: "User 1",
          },
          status: "PENDING",
          isMainEvent: true,
          mainEventName: null,
        },
        {
          title: "Pending Event 2",
          description:
            "<p>Description for pending event 2 with a list:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>",
          date: "2024-05-02",
          location: "Location 2",
          userInfo: {
            imageurl:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX-mmy1bZzkwQY2zce4WkOl6zenIWOHqGVLZUckaVnkA&s",
            name: "User 2",
          },
          status: "PENDING",
          isMainEvent: false,
          mainEventName: "Pending Event 1",
        },
        {
          title: "Pending Event 3",
          description:
            "<p>Description for pending event 3. Visit <a href='http://example.com/event3'>this link</a> for more information.</p>",
          date: "2024-05-03",
          location: "Location 3",
          userInfo: {
            imageurl:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX-mmy1bZzkwQY2zce4WkOl6zenIWOHqGVLZUckaVnkA&s",
            name: "User 3",
          },
          status: "PENDING",
          isMainEvent: false,
          mainEventName: "Pending Event 1",
        },
        {
          title: "Pending Event 4",
          description:
            "<p>Description for pending event 4 with additional details.</p>",
          date: "2024-05-04",
          location: "Location 4",
          userInfo: {
            imageurl:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX-mmy1bZzkwQY2zce4WkOl6zenIWOHqGVLZUckaVnkA&s",
            name: "User 4",
          },
          status: "PENDING",
          isMainEvent: false,
          mainEventName: "Pending Event 1",
        },
        {
          title: "Pending Event 5",
          description:
            "<p>This is a <strong>description</strong> for pending event 5.</p><p>More details can be found <a href='http://example.com/event5'>here</a>.</p>",
          date: "2024-05-05",
          location: "Location 5",
          userInfo: {
            imageurl:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX-mmy1bZzkwQY2zce4WkOl6zenIWOHqGVLZUckaVnkA&s",
            name: "User 5",
          },
          status: "PENDING",
          isMainEvent: false,
          mainEventName: "Pending Event 1",
        },
        {
          title: "Pending Event 6",
          description:
            "<p>Description for pending event 6 with a list:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>",
          date: "2024-05-06",
          location: "Location 6",
          userInfo: {
            imageurl:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX-mmy1bZzkwQY2zce4WkOl6zenIWOHqGVLZUckaVnkA&s",
            name: "User 6",
          },
          status: "PENDING",
          isMainEvent: false,
          mainEventName: "Pending Event 1",
        },
        {
          title: "Pending Event 7",
          description:
            "<p>Description for pending event 7. Visit <a href='http://example.com/event7'>this link</a> for more information.</p>",
          date: "2024-05-07",
          location: "Location 7",
          userInfo: {
            imageurl:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX-mmy1bZzkwQY2zce4WkOl6zenIWOHqGVLZUckaVnkA&s",
            name: "User 7",
          },
          status: "PENDING",
          isMainEvent: false,
          mainEventName: "Pending Event 1",
        },
        {
          title: "Pending Event 8",
          description:
            "<p>Description for pending event 8 with additional details.</p>",
          date: "2024-05-08",
          location: "Location 8",
          userInfo: {
            imageurl:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX-mmy1bZzkwQY2zce4WkOl6zenIWOHqGVLZUckaVnkA&s",
            name: "User 8",
          },
          status: "PENDING",
          isMainEvent: false,
          mainEventName: "Pending Event 1",
        },
        {
          title: "Pending Event 9",
          description:
            "<p>This is a <strong>description</strong> for pending event 9.</p><p>More details can be found <a href='http://example.com/event9'>here</a>.</p>",
          date: "2024-05-09",
          location: "Location 9",
          userInfo: {
            imageurl:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX-mmy1bZzkwQY2zce4WkOl6zenIWOHqGVLZUckaVnkA&s",
            name: "User 9",
          },
          status: "PENDING",
          isMainEvent: false,
          mainEventName: "Pending Event 1",
        },
        {
          title: "Pending Event 10",
          description:
            "<p>Description for pending event 10 with a list:</p><ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>",
          date: "2024-05-10",
          location: "Location 10",
          userInfo: {
            imageurl:
              "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX-mmy1bZzkwQY2zce4WkOl6zenIWOHqGVLZUckaVnkA&s",
            name: "User 10",
          },
          status: "PENDING",
          isMainEvent: false,
          mainEventName: "Pending Event 1",
        },
      ]

    }

    return {
      isLoggedIn,
      isError,
      events,
      roles,
    };
  } catch (error) {
    console.log(error);
    return {
      isLoggedIn,
      isError,
      roles,
      events,
    };
  }
};
