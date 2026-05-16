export const Footer = () => (
  <footer className="mt-16 mb-8 text-center text-muted-foreground text-sm">
    <ul className="space-y-2">
      <li>
        <h4 className="font-medium">Version</h4>
        <p>{import.meta.env.VITE_BUILD_VERSION}</p>
      </li>
    </ul>
  </footer>
);
