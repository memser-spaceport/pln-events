import HostLogo from "@/components/ui/host-logo";

const EventHosts = (props: any) => {
  const event = props?.event;
  const hostName = event?.hostName ?? "";
  const hostLogo = event?.hostLogo ?? "";
  const coHosts = event?.coHosts ?? [];
  const hosts = hostName
    ? [{ name: hostName, logo: hostLogo }, ...coHosts]
    : [...coHosts];
  const showTitle = props?.showTitle ?? false;

  return (
    <>
      {hosts?.length > 0 && (
        <div className="eventHosts">
          {showTitle && <h6 className="eventHosts__title">Hosted By</h6>}
          <div className="eventHosts__list">
            {hosts?.map((host: any, index: number) => {
              return (
                <>
                  {host?.name && (
                    <div className="eventHosts__host" key={`host-${index}`}>
                      {host?.logo && host?.name ? (
                        <img
                          src={host?.logo || "/icons/default-host.svg"}
                          width={15}
                          height={15}
                          alt="host logo"
                        />
                      ) : host?.name ? (
                        <HostLogo
                          firstLetter={host?.name.trim().charAt(0).toUpperCase()}
                          height={"15px"}
                          width={"15px"}
                          fontSize={"12px"}
                        />
                      ) : null}
                      {host?.name ? (
                        <div className="eventHosts__host__name">
                          {host?.name}
                        </div>
                      ) : null}
                    </div>
                  )}
                </>
              );
            })}
          </div>
        </div>
      )}
      <style jsx>
        {`
          .eventHosts {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .eventHosts__title {
            font-size: 13px;
            font-weight: 500;
            line-height: 20px;
            color: #0f172a;
            opacity: 0.5;
          }

          .eventHosts__list {
            display: flex;
            flex-wrap: wrap;
            flex-direction: row;
            gap: 4px;
          }

          .eventHosts__host {
            display: flex;
            gap: 4px;
            align-items: center;
          }

          .eventHosts__host__name {
            font-size: 13px;
            line-height: 20px;
            display: inline-block;
            color: #000000;
            padding-right: 4px;
          }
        `}
      </style>
    </>
  );
};

export default EventHosts;
