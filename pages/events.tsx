import { client } from "../.tina/__generated__/client";

const TimelineCard = ({ data }) => {
  return (
    <div>
    </div>
  )
}

// const Timeline = ({ items }) => {
//   return (
//     {items && items.map(function (item) {
//       return (
//         { item }
//       );
//     })}
//   );
// };


export default function HomePage(
  props: AsyncReturnType<typeof getStaticProps>["props"]
) {
  const events = props.data.eventConnection.edges;

  return (
    <>
      <div className="border border-primary">
        {events && events.map((event, index) => {
          const values = event.node._values
          return (
            <div className="border border-primary text-primary bg-accent1 m-10" key={index}>
              <p>{values.eventName}</p>
            </div>
          )
        })}
      </div>
    </>
  )
}

export const getStaticProps = async () => {
  const tinaProps = await client.queries.pageQuery();
  return {
    props: {
      ...tinaProps,
    },
  };
};

export type AsyncReturnType<T extends (...args: any) => Promise<any>> =
  T extends (...args: any) => Promise<infer R> ? R : any;
