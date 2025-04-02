
declare namespace JSX {
  interface IntrinsicElements {
    'tableau-viz': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        src?: string;
        id?: string;
        toolbar?: string;
        'hide-tabs'?: boolean;
      },
      HTMLElement
    >;
  }
}
