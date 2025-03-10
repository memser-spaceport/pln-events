interface IHostLogo {
  firstLetter: string;
  height?: string;
  width?: string;
  fontSize?: string;
}

export const HOST_LOGO_COLOR_CODES = ["#FF8863", "#7774FF", "#FF6CC4", "#E26CFF", "#FFB647", "#35B6FF", "#7FC210"];

const getColorCode = (letter: string) => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const segmentSize = Math.ceil(alphabet.length / HOST_LOGO_COLOR_CODES.length);
    const letterIndex = alphabet.indexOf(letter.trim().toUpperCase().charAt(0));
    const colorIndex = Math.floor(letterIndex / segmentSize);
    return HOST_LOGO_COLOR_CODES[colorIndex];
  };

export default function HostLogo(props: IHostLogo) {
  const height = props?.height || '24px';
  const width = props?.width || '24px';
  const fontSize = props.fontSize || '14px';
  const color = getColorCode(props.firstLetter);
  
  return (
    <>
      <div className="logo">{props.firstLetter}</div>
      <style jsx>{`
        .logo {
          display: flex;
          justify-content: center;
          align-items: center;
          height: ${height};
          width: ${width};
          background: ${color};
          color: #ffffff;
          font-size: ${fontSize};
        }
      `}</style>
    </>
  );
}
