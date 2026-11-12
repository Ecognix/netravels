import "./globals.css";
import { Header, Footer } from "../components/Site";
import SupportChat from "../components/SupportChat";

export const metadata = {
  title: { default: "NE Travels | A little further, a lot more", template: "%s | NE Travels" },
  description: "Thoughtfully planned journeys through Northeast India. Explore six customizable itineraries and request your trip.",
};

export default function RootLayout({ children }) {
  return <html lang="en"><body><Header/><main>{children}</main><Footer/><SupportChat/></body></html>;
}
