type IconProps = {
  name: "github" | "play" | "youtube" | "doc" | "send" | "settings" | "lock";
  className?: string;
};

export function Icon({ name, className }: IconProps) {
  const common = `h-4 w-4 ${className ?? ""}`;

  switch (name) {
    case "github":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden="true">
          <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.2.8-.5v-2c-3.3.7-4-1.4-4-1.4-.5-1.2-1.2-1.6-1.2-1.6-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 3 .8.1-.7.4-1.1.7-1.4-2.7-.3-5.6-1.4-5.6-6.1 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.4 1.2a11.8 11.8 0 0 1 6.2 0c2.5-1.5 3.4-1.2 3.4-1.2.6 1.6.2 2.8.1 3.1.8.9 1.2 2 1.2 3.3 0 4.7-2.9 5.8-5.7 6.1.4.4.8 1.1.8 2.2v3.3c0 .3.2.6.8.5A12 12 0 0 0 12 .5Z" />
        </svg>
      );
    case "play":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden="true">
          <path d="M8 5.5v13l11-6.5-11-6.5Z" />
        </svg>
      );
    case "youtube":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={common} aria-hidden="true">
          <path d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 5 12 5 12 5s-6 0-7.7.3A2.7 2.7 0 0 0 2.4 7.2 28.4 28.4 0 0 0 2 12a28.4 28.4 0 0 0 .4 4.8 2.7 2.7 0 0 0 1.9 1.9C6 19 12 19 12 19s6 0 7.7-.3a2.7 2.7 0 0 0 1.9-1.9A28.4 28.4 0 0 0 22 12a28.4 28.4 0 0 0-.4-4.8ZM10 15.2V8.8L15.6 12 10 15.2Z" />
        </svg>
      );
    case "doc":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} stroke="currentColor" strokeWidth="1.75" aria-hidden="true">
          <path d="M7 3.5h7l5 5V20a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 6 20V5A1.5 1.5 0 0 1 7.5 3.5Z" />
          <path d="M14 3.5V9h5" />
          <path d="M9 12h6M9 15h6" />
        </svg>
      );
    case "send":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
          <path d="M4 12 20 4l-4 16-4-6-8-2Z" />
        </svg>
      );
    case "settings":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
          <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" />
          <path d="m19.4 13 .1-2-1.8-.7a7.3 7.3 0 0 0-.8-1.9l1-1.8-1.4-1.4-1.8 1a7.3 7.3 0 0 0-1.9-.8L12.5 3h-2l-.7 1.8a7.3 7.3 0 0 0-1.9.8l-1.8-1-1.4 1.4 1 1.8a7.3 7.3 0 0 0-.8 1.9L3 11l.1 2 1.8.7a7.3 7.3 0 0 0 .8 1.9l-1 1.8 1.4 1.4 1.8-1a7.3 7.3 0 0 0 1.9.8l.7 1.8h2l.7-1.8a7.3 7.3 0 0 0 1.9-.8l1.8 1 1.4-1.4-1-1.8a7.3 7.3 0 0 0 .8-1.9l1.8-.7Z" />
        </svg>
      );
    case "lock":
      return (
        <svg viewBox="0 0 24 24" fill="none" className={common} stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path d="M7 11V8.5a5 5 0 1 1 10 0V11" />
          <path d="M6.5 11h11A1.5 1.5 0 0 1 19 12.5v6A1.5 1.5 0 0 1 17.5 20h-11A1.5 1.5 0 0 1 5 18.5v-6A1.5 1.5 0 0 1 6.5 11Z" />
        </svg>
      );
    default:
      return null;
  }
}
