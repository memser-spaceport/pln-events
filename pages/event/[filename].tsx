// import { Post } from "../../components/events/event";
import { client } from "../../.tina/__generated__/client";
import { useTina } from "tinacms/dist/react";
import { Layout } from "../../components/layout";

// Use the props returned by get static props
export default function EventPage(
  props: AsyncReturnType<typeof getStaticProps>["props"]
) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });
  if (data && data.event) {
    return (
      <p>Event</p>
      // <Layout rawData={data} data={data.global as any}>
      //   <ul className="p-10 m-10 bg-white text-black rounded">
      //     <li>Name: {data.event.eventName}</li>
      //     <li>DRI: {data.event.dri}</li>
      //     <li>Website: {data.event.website}</li>
      //     <li>startDate: {data.event.startDate}</li>
      //   </ul>
      // </Layout>
    );
  }
  return (
    <p>No Data</p>
    // <Layout rawData={null} data={null}>
    //   <div>No data</div>;
    // </Layout>
  );
}

export const getStaticProps = async ({ params }) => {
  const tinaProps = await client.queries.eventQuery({
    relativePath: `${params.filename}.mdx`,
  });
  return {
    props: {
      ...tinaProps,
    },
  };
};

/**
 * To build the event pages we just iterate through the list of
 * events and provide their "filename" as part of the URL path
 *
 * So a event at "content/events/hello.md" would
 * be viewable at http://localhost:3000/events/hello
 */
export const getStaticPaths = async () => {
  const eventsListData = await client.queries.eventConnection();
  return {
    paths: eventsListData.data.eventConnection.edges.map((event) => ({
      params: { filename: event.node._sys.filename },
    })),
    fallback: "blocking",
  };
};

export type AsyncReturnType<T extends (...args: any) => Promise<any>> =
  T extends (...args: any) => Promise<infer R> ? R : any;
