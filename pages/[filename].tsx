import { Blocks } from "../components/blocks-renderer";
import { useTina } from "tinacms/dist/react";
import { Layout } from "../components/layout";
import { client } from "../.tina/__generated__/client";

export default function HomePage(
  props: AsyncReturnType<typeof getStaticProps>["props"]
) {
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });
  const eventList = props.events.eventConnection.edges

  return (
    <Layout rawData={data} data={data.global as any}>
      <Blocks {...data.page} />
      <p className="max-w-desktop-full mx-auto mb-10">Navigation Here to jump to a month - it should be sticky</p>
      
      <div className="relative max-w-desktop-full mx-auto border-l border-primary mb-10 ml-60">
        {eventList && eventList.map((event, index) => {
          const startDate = new Date(event.node.startDate)
          const endDate = new Date(event.node.endDate)
          return (
            <div className="mb-10 ml-4" key={index}>
              {(index === 0 && 
                <div className="absolute -left-20">January</div>
              )}
              <div className="absolute w-3 h-3 bg-primary rounded-full mt-1.5 -left-1.5"></div>
              <time className="mg-body-sm font-normal text-gray">
                {`${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`}
              </time>
              <h3 className="mg-headline-sm font-semibold">{event.node.eventName}</h3>
              <p className="mg-body-sm text-primary mb-6 font-semibold">{event.node.location}</p>
              <p className="mg-body-md">{event.node.eventName}</p>
              <p>{event.node.website}</p>
              <p>{event.node.dri}</p>
            </div>
          )
        })}
      </div>
      
      <div className="relative max-w-desktop-full mx-auto border-l border-primary ml-60">
        {eventList && eventList.map((event, index) => {
          const startDate = new Date(event.node.startDate)
          const endDate = new Date(event.node.endDate)
          return (
            <div className="mb-10 ml-4" key={index}>
              {(index === 0 && 
                <div className="absolute -left-20">February</div>
              )}
              <div className="absolute w-3 h-3 bg-primary rounded-full mt-1.5 -left-1.5"></div>
              <time className="mg-body-sm font-normal text-gray">
                {`${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`}
              </time>
              <h3 className="mg-headline-sm font-semibold">{event.node.eventName}</h3>
              <p className="mg-body-sm text-primary mb-6 font-semibold">{event.node.location}</p>
              <p className="mg-body-md">{event.node.eventName}</p>
              <p>{event.node.website}</p>
              <p>{event.node.dri}</p>
            </div>
          )
        })}
      </div>

      <div>Read More</div>

    </Layout>
  );
}

export const getStaticProps = async ({ params }) => {
  const tinaProps = await client.queries.contentQuery({
    relativePath: `${params.filename}.md`,
  });
  const eventsListData = await client.queries.eventConnection();
  return {
    props: {
      data: tinaProps.data,
      query: tinaProps.query,
      variables: tinaProps.variables,
      events: eventsListData.data
    },
  };
};

export const getStaticPaths = async () => {
  const pagesListData = await client.queries.pageConnection();
  return {
    paths: pagesListData.data.pageConnection.edges.map((page) => ({
      params: { filename: page.node._sys.filename },
    })),
    fallback: false,
  };
};

export type AsyncReturnType<T extends (...args: any) => Promise<any>> =
  T extends (...args: any) => Promise<infer R> ? R : any;
